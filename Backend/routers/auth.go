package routers

import (
	"net/http"

	"github.com/AdamElmaghraby/moodify/handlers"
	"github.com/gofiber/adaptor/v2"
	"github.com/gofiber/fiber/v2"
)


func RegisterAuthRoutes(app *fiber.App) {
	oauthService := handlers.NewOAuthService()

	// Will send user to spotify login page 
	app.Get("/auth/login",
        adaptor.HTTPHandler(http.HandlerFunc(oauthService.HandleSpotifyLogin)),
    )

	// Will callback to app from spotify
	app.Get("/auth/callback",
        adaptor.HTTPHandler(http.HandlerFunc(oauthService.HandleCallback)),
    )

	// Get user info from JWT
	app.Get("/api/me",
        adaptor.HTTPHandler(handlers.JWTAuthMiddleware(http.HandlerFunc(handlers.HandleCurrentUser))),
    )

	// Logout user
	app.Post("/auth/logout",
        adaptor.HTTPHandler(http.HandlerFunc(handlers.HandleLogout)),
    )
}