package routers

import (
	"net/http"

	"github.com/AdamElmaghraby/moodify/handlers"
	"github.com/gofiber/adaptor/v2"
	"github.com/gofiber/fiber/v2"
)


func RegisterPlaylisthRoutes(app *fiber.App) {

	
	app.Post("/api/create-playlist", adaptor.HTTPHandler(handlers.JWTAuthMiddleware(http.HandlerFunc(handlers.HandleCreatePlaylist))))

}