package helpers

import (
	"encoding/json"
	"game/backEnd/config"
	"os"
)

func SaveData(name string, key config.Score) error {
	err := ReadData(name)
	if err != nil {
		return err
	}

	config.Scores = append(config.Scores, key)

	file, errr := os.Create(name)
	if errr != nil {
		return errr
	}
	defer file.Close()

	err = json.NewEncoder(file).Encode(config.Scores)
	if err != nil {
		return err
	}

	return nil
}
