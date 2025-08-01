package routers

import (
	"net/http"

	"github.com/AdamElmaghraby/moodify/handlers"
	"github.com/gofiber/adaptor/v2"
	"github.com/gofiber/fiber/v2"
)

func RegisterPromptRoutes(app *fiber.App) {

	app.Post("/api/generate-playlist", adaptor.HTTPHandler(http.HandlerFunc(handlers.HandleGeneratePlaylist)))

}