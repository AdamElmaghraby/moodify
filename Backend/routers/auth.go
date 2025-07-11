package routers

import (
	"net/http"
    "github.com/gofiber/adaptor/v2"
	"github.com/AdamElmaghraby/moodify/handlers"
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
}