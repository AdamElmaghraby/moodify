package routers

import (
	"github.com/gofiber/fiber/v2"
)


func RegisterPlaylisthRoutes(app *fiber.App) {

	// Will send user to spotify login page 
	//app.Get("/api/generate-playlist", handlers.HandleSpotifyLogin)

	// Will callback to app from spotify
	//app.Get("/auth/callback", handlers.HandleSpotifyCallback)
}