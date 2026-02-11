package main

import (
	"log"
	"os"

	"github.com/AdamElmaghraby/moodify/config"
	"github.com/AdamElmaghraby/moodify/routers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {

	// Load env variables 
	config.LoadEnv()

	//create fiber app
	app := fiber.New()

	// Add CORS middleware - allow frontend origin from env or localhost for dev
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000, http://localhost:5173, http://localhost:8080, https://localhost:3000, https://localhost:5173, https://localhost:8080, https://127.0.0.1:3000, https://127.0.0.1:5173, https://127.0.0.1:8080"
	}
	
	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	//mount all routers 
	routers.RegisterRoutes(app)

	//Port - get from environment or default to 3000
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	//Start Server
	log.Printf("## Starting server on port %s\n", port)
	log.Fatal(app.Listen(":" + port))

}