package handlers

import (
	"encoding/json"
	"net/http"

	"game/backEnd/config"
	"game/backEnd/helpers"
)

func AddScore(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var s config.Score
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}
	if len(s.Name) <= 3 {
		http.Error(w, "username must be more than 3  charts", http.StatusBadRequest)
		return
	}

	err := helpers.SaveData(config.FileName, s)
	if err != nil {
		http.Error(w, "Error in storing the data ", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(config.Scores)
}
