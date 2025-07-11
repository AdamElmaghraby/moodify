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

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/spotify"
)

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

	fmt.Fprintf(w, "Logged in successfully! User: %s\n", userInfo)

}

func getSpotifyUserInfo(client *http.Client) (string, error) {

	//get request for user info
	resp, err := client.Get("https://api.spotify.com/v1/me")
	if err != nil {
		return "", fmt.Errorf("failed to get user info: %w", err)
	}
	defer resp.Body.Close()

	
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("error response from Spotify: %s", resp.Status)
	}

	var user struct {
		Name string `json:"display_name"`
	}

	err = json.NewDecoder(resp.Body).Decode(&user)
	if err != nil {
		return "", fmt.Errorf("failed to decode user info: %w", err)
	}

	return user.Name, nil

}