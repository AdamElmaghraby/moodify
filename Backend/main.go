package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/AdamElmaghraby/moodify/config"
	"github.com/AdamElmaghraby/moodify/routers"
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