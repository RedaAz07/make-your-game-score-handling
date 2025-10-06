package handlers

import (
	"encoding/json"
	"game/backEnd/config"
	"game/backEnd/helpers"
	"net/http"
)

func GetScores(w http.ResponseWriter, r *http.Request) {
	err := helpers.ReadData(config.FileName)
	if err != nil {
		http.Error(w, "Error in reading the data", http.StatusInternalServerError)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config.Scores)
}
