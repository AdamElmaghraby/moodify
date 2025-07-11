package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Panicln("No .env file found, relying on system environment variables.")
	} else {
		log.Println(".env file found successfully.")
	}

	log.Println("Spotify Client ID:", os.Getenv("SPOTIFY_CLIENT_ID"))

}

