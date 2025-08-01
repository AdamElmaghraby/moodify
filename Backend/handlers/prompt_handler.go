package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/sashabaranov/go-openai"
)

func HandleGeneratePlaylist(w http.ResponseWriter, r *http.Request) {
	// Define a local struct for the request body
	var body struct {
		Prompt string `json:"prompt"`
		Length int    `json:"length"`
	}

	// Decode the JSON body into the body struct
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	systemContent := fmt.Sprintf(
		`You are an assistant that only responds with valid JSON. Do NOT include any explanations, comments, or code fences. Create a list of %d unique songs based off the following statement: "%s". Include "id", "title", "artist", "album", and "duration" in your response. The duration should be in MM:SS format. An example response is: [
		{
			"id": 1,
			"title": "Hey Jude",
			"artist": "The Beatles",
			"album": "The Beatles (White Album)",
			"duration": "4:56"
		}
		] Respond with ONLY a JSON array.`,
		body.Length, body.Prompt,
	)

	resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model: "gpt-4o",
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    "system",
				Content: systemContent,
			},
			{
				Role:    "user",
				Content: body.Prompt,
			},
		},
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(resp.Choices[0].Message.Content))
}