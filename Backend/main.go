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

	// HTTPS Creds
	certFile := os.Getenv("TLS_CERT_PATH")
	keyFile  := os.Getenv("TLS_KEY_PATH")
	log.Println("TLS_CERT_PATH =", certFile)
    log.Println("TLS_KEY_PATH  =", keyFile)  

	//create fiber app
	app := fiber.New()

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://localhost:5173, http://localhost:8080, https://localhost:3000, https://localhost:5173, https://localhost:8080, https://127.0.0.1:3000, https://127.0.0.1:5173, https://127.0.0.1:8080",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	//mount all routers 
	routers.RegisterRoutes(app)

	//Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	addr := ":" + port

	//Start Server
	if certFile != "" && keyFile != "" {
        log.Printf("## Starting HTTPS server on %s\n", addr)
        log.Fatal(app.ListenTLS(addr, certFile, keyFile))
    } else {
        log.Printf("## Starting HTTP server on %s\n", addr)
        log.Fatal(app.Listen(addr))
    }

}