package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitDB(path string) {
	var err error
	db, err = sql.Open("sqlite3", path)
	if err != nil {
		log.Fatal(err)
	}

	createTables := `
	CREATE TABLE IF NOT EXISTS subscribers (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		name TEXT,
		company TEXT,
		role TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS contacts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		problem TEXT,
		description TEXT,
		area TEXT,
		deadline TEXT,
		budget TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id)
	);`

	_, err = db.Exec(createTables)
	if err != nil {
		log.Fatalf("Error creating tables: %q", err)
	}
}

func AddSubscriber(email string) error {
	_, err := db.Exec("INSERT INTO subscribers (email) VALUES (?)", email)
	return err
}

// GetOrCreateUser retrieves a user by email or creates a new one
func GetOrCreateUser(email, name, company, role string) (int64, error) {
	var id int64
	err := db.QueryRow("SELECT id FROM users WHERE email = ?", email).Scan(&id)
	if err == sql.ErrNoRows {
		result, err := db.Exec("INSERT INTO users (email, name, company, role) VALUES (?, ?, ?, ?)", email, name, company, role)
		if err != nil {
			return 0, err
		}
		return result.LastInsertId()
	} else if err != nil {
		return 0, err
	}

	// Update existing user info if provided
	_, _ = db.Exec("UPDATE users SET name = ?, company = ?, role = ? WHERE id = ?", name, company, role, id)
	return id, nil
}

// AddContact adds a new contact submission associated with a user
func AddContact(userID int64, problem, description, area, deadline, budget string) error {
	_, err := db.Exec(
		"INSERT INTO contacts (user_id, problem, description, area, deadline, budget) VALUES (?, ?, ?, ?, ?, ?)",
		userID, problem, description, area, deadline, budget,
	)
	return err
}

type LeadResult struct {
	ID          int    `json:"id"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	Company     string `json:"company"`
	Role        string `json:"role"`
	Problem     string `json:"problem"`
	Description string `json:"description"`
	Area        string `json:"area"`
	Deadline    string `json:"deadline"`
	Budget      string `json:"budget"`
	CreatedAt   string `json:"created_at"`
}

func GetAllLeads() ([]LeadResult, error) {
	query := `
		SELECT c.id, u.email, u.name, u.company, u.role, c.problem, c.description, c.area, c.deadline, c.budget, c.created_at
		FROM contacts c
		JOIN users u ON c.user_id = u.id
		ORDER BY c.created_at DESC
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leads []LeadResult
	for rows.Next() {
		var l LeadResult
		err := rows.Scan(&l.ID, &l.Email, &l.Name, &l.Company, &l.Role, &l.Problem, &l.Description, &l.Area, &l.Deadline, &l.Budget, &l.CreatedAt)
		if err != nil {
			return nil, err
		}
		leads = append(leads, l)
	}
	return leads, nil
}

type Subscriber struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
}

func GetAllSubscribers() ([]Subscriber, error) {
	rows, err := db.Query("SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subs []Subscriber
	for rows.Next() {
		var s Subscriber
		if err := rows.Scan(&s.ID, &s.Email, &s.CreatedAt); err != nil {
			return nil, err
		}
		subs = append(subs, s)
	}
	return subs, nil
}
