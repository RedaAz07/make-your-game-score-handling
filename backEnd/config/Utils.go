package config

type Score struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

var (
	Scores   []Score
	FileName = "../data/scores.json"
)
