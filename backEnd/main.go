package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type Score struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

var (
	Scores   []Score
	fileName = "../data/scores.json"
)

func ReadData(name string) error {
	fileRead, err := os.Open(name)
	if err != nil {
		log.Fatal(err)
	}
	defer fileRead.Close()

	err = json.NewDecoder(fileRead).Decode(&Scores)

	if err != nil && err != io.EOF {
		return err
	}
	return nil
}

func saveData(name string, key Score) error {
	err := ReadData(name)
	if err != nil {
		return err
	}

	Scores = append(Scores, key)

	file, errr := os.Create(name)
	if errr != nil {
		return errr
	}
	defer file.Close()

	err = json.NewEncoder(file).Encode(Scores)
	if err != nil {
		return err
	}

	return nil
}

// to handle the CORS Problem

func main() {
	fs := http.FileServer(http.Dir("../frontEnd"))
	http.Handle("/", fs)

	http.HandleFunc("/addScore", addScore)
	http.HandleFunc("/scores", allScores)

	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// handler of the add posts
func addScore(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var s Score
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}
	if len(s.Name) <= 3 {
		http.Error(w, "username must be more than 3  charts", http.StatusBadRequest)
		return
	}
	

	err := saveData(fileName, s)
	if err != nil {
		http.Error(w, "Error in storing the data ", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(Scores)
}

// get all the data
func allScores(w http.ResponseWriter, r *http.Request) {
	err := ReadData(fileName)
	if err != nil {
		http.Error(w, "Error in reading the data", http.StatusInternalServerError)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Scores)
}
