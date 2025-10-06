package main

import (
	"fmt"
	"log"
	"net/http"

	"game/backEnd/handlers"
)

// to handle the CORS Problem

func main() {
fs := http.FileServer(http.Dir("../frontEnd/static"))
http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/addScore", handlers.AddScore)
	http.HandleFunc("/scores", handlers.GetScores)

	fmt.Println("Server running on port localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
