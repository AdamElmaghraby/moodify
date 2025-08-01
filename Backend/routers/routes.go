package routers

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	RegisterAuthRoutes(app)
	RegisterPromptRoutes(app)
	RegisterPlaylisthRoutes(app)
}