package handlers

import (
	"net/http"
	"os"
)

func StaticHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowd ", http.StatusMethodNotAllowed)

		return
	}
	file, err := os.Stat("frontEnd/"+r.URL.Path[1:])
	if err != nil || file.IsDir() {
		http.Error(w, "page not found ", http.StatusNotFound)

		return
	}

	http.ServeFile(w, r, "frontEnd/"+r.URL.Path[1:])
}
