package main

import (
	"context"
	"database/sql"
	"embed"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
)

//go:embed web/*
var webFS embed.FS

type Server struct {
	DB  *sql.DB
	Mux *http.ServeMux
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	db, err := openDB()
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	if err := ensureSchema(db); err != nil {
		log.Fatalf("schema: %v", err)
	}

	s := &Server{
		DB:  db,
		Mux: http.NewServeMux(),
	}
	s.routes()

	log.Printf("Wizarding Realms WASM server -> http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, s.Mux))
}

func openDB() (*sql.DB, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// default local
		dsn = "postgres://wizard:wizard@localhost:5432/wizarding_realms?sslmode=disable"
	}
	cfg, err := pgx.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}
	db := sql.OpenDB(stdlib.RegisterConnConfig(cfg))
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(time.Hour)
	return db, db.Ping()
}

func ensureSchema(db *sql.DB) error {
	_, err := db.Exec(`
CREATE TABLE IF NOT EXISTS claimed_lands (
  id SERIAL PRIMARY KEY,
  tile_x INT NOT NULL,
  tile_y INT NOT NULL,
  wallet TEXT,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tile_x, tile_y)
);
`)
	return err
}

func (s *Server) routes() {
	// Correct MIME for .wasm
	s.Mux.HandleFunc("/web/game.wasm", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/wasm")
		http.ServeFile(w, r, filepath.FromSlash("web/game.wasm"))
	})

	// API: claim tile
	s.Mux.HandleFunc("/api/claim", s.handleClaim)
	// API: list recent claims (for debugging)
	s.Mux.HandleFunc("/api/recent", s.handleRecent)

	// Serve web
	s.Mux.Handle("/", http.FileServer(http.FS(webFS)))
}

type claimReq struct {
	TileX  int    `json:"tile_x"`
	TileY  int    `json:"tile_y"`
	Wallet string `json:"wallet"`
}
type claimResp struct {
	OK    bool   `json:"ok"`
	Error string `json:"error,omitempty"`
}

func (s *Server) handleClaim(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req claimReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()
	_, err := s.DB.ExecContext(ctx,
		`INSERT INTO claimed_lands (tile_x, tile_y, wallet) VALUES ($1,$2,$3)`,
		req.TileX, req.TileY, req.Wallet)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}
	// Simulated Sui call
	log.Printf("[SUI] claim tile (%d,%d) wallet=%s", req.TileX, req.TileY, req.Wallet)
	json.NewEncoder(w).Encode(claimResp{OK: true})
}

func (s *Server) handleRecent(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	type row struct {
		TileX int       `json:"tile_x"`
		TileY int       `json:"tile_y"`
		When  time.Time `json:"claimed_at"`
	}
	rs, err := s.DB.Query(`SELECT tile_x, tile_y, claimed_at FROM claimed_lands ORDER BY id DESC LIMIT 50`)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rs.Close()
	var out []row
	for rs.Next() {
		var rr row
		if err := rs.Scan(&rr.TileX, &rr.TileY, &rr.When); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		out = append(out, rr)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(out)
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
}


