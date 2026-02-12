package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/spotify"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	Username      string `json:"username"`
	ProfilePicture string `json:"profilePicture,omitempty"`
	AccessToken   string `json:"accessToken,omitempty"`
	jwt.RegisteredClaims
}

type OAuthService struct {
	config *oauth2.Config
	state string
}

func generateRandomState() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%d", rand.Intn(100000))
}

func NewOAuthService() *OAuthService {
	return &OAuthService{
		config: &oauth2.Config{
			ClientID: os.Getenv("SPOTIFY_CLIENT_ID"),
			ClientSecret: os.Getenv("SPOTIFY_CLIENT_SECRET"),
			Endpoint: spotify.Endpoint,
			RedirectURL: os.Getenv("SPOTIFY_REDIRECT_URI"),
				Scopes: []string{
					"user-read-private",      // to read the user’s account ID
					"playlist-modify-public", // to create/edit public playlists
					"playlist-modify-private",// to create/edit private playlists
					"user-read-email",        // to read the user’s email
					"playlist-read-private",  // to read their existing private playlists
				},
			},
			state: generateRandomState(),
		}
	}

func (o *OAuthService) HandleSpotifyLogin(w http.ResponseWriter, r *http.Request) {
	url := o.config.AuthCodeURL(o.state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}


func (o *OAuthService) HandleCallback(w http.ResponseWriter, r *http.Request) {
	// Validate OAuth state
	state := r.URL.Query().Get("state")
	code := r.URL.Query().Get("code")
	if state != o.state {
		http.Error(w, "Invalid state", http.StatusBadRequest)
		return
	}

	// Exchange code for token
	token, err := o.config.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
		log.Println("Token exhcange error:", err)
		return
	}

	//makes an auth-ed client
	client := o.config.Client(context.Background(), token)

	// Get user's profile
	userInfo, err := getSpotifyUserInfo(client)
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		log.Println("User info error:", err)
		return
	}

	// Create JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	profilePicture := ""
	if len(userInfo.Images) > 0 {
		profilePicture = userInfo.Images[0].URL
	}
	claims := &Claims{
		Username:      userInfo.Name,
		ProfilePicture: profilePicture,
		AccessToken:   token.AccessToken,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := jwtToken.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Failed to create token", http.StatusInternalServerError)
		log.Println("Token creation error:", err)
		return
	}

	// Set JWT as cookie
	http.SetCookie(w, &http.Cookie{
		Name: "token",
		Value: tokenString,
		Expires: expirationTime,
		HttpOnly: true,
		Secure: true,
		SameSite: http.SameSiteNoneMode,
		Path: "/",
	})

	// Redirect to frontend - use env variable or default to localhost for dev
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}
	http.Redirect(w, r, frontendURL+"/chat", http.StatusTemporaryRedirect)
}

type SpotifyUser struct {
	Name   string `json:"display_name"`
	Images []struct {
		URL string `json:"url"`
	} `json:"images"`
}

func getSpotifyUserInfo(client *http.Client) (SpotifyUser, error) {

	//get request for user info
	resp, err := client.Get("https://api.spotify.com/v1/me")
	if err != nil {
		return SpotifyUser{}, fmt.Errorf("failed to get user info: %w", err)
	}
	defer resp.Body.Close()

	
	if resp.StatusCode != http.StatusOK {
		return SpotifyUser{}, fmt.Errorf("error response from Spotify: %s", resp.Status)
	}

	var user SpotifyUser

	err = json.NewDecoder(resp.Body).Decode(&user)
	if err != nil {
		return SpotifyUser{}, fmt.Errorf("failed to decode user info: %w", err)
	}

	return user, nil

}

// Middleware to validate JWT token
func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			if err == http.ErrNoCookie {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Bad request"})
			return
		}

		tokenStr := cookie.Value
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Bad request"})
			return
		}

		if !token.Valid {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
			return
		}

		// Add claims to context to pass user info to the next handler
		ctx := context.WithValue(r.Context(), "userClaims", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Handler to get current user info
func HandleCurrentUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("userClaims").(*Claims)
	if !ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(claims)
}

// Handler to logout user
func HandleLogout(w http.ResponseWriter, r *http.Request) {
	// Clear the JWT cookie by setting it to expire in the past
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged out successfully"})
}