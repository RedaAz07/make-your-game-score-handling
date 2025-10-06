package helpers

import (
	"encoding/json"
	"game/backEnd/config"
	"io"
	"log"
	"os"
)

func ReadData(name string) error {
	fileRead, err := os.Open(name)
	if err != nil {
		log.Fatal(err)
	}
	defer fileRead.Close()

	err = json.NewDecoder(fileRead).Decode(&config.Scores)

	if err != nil && err != io.EOF {
		return err
	}
	return nil
}
