package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using defaults")
	}

	// Initialize Database
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "me.db"
	}
	InitDB(dbPath)

	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"site_name": os.Getenv("SITE_NAME"),
		})
	})

	// API Routes
	api := r.Group("/api")
	{
		// Subscribe to newsletter
		api.POST("/newsletter", func(c *gin.Context) {
			var input struct {
				Email string `json:"email" binding:"required,email"`
			}

			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := AddSubscriber(input.Email); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not subscribe"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Subscribed successfully"})
		})

		// Contact form
		api.POST("/contact", func(c *gin.Context) {
			var input struct {
				Name    string `json:"name"`
				Email   string `json:"email" binding:"required,email"`
				Message string `json:"message" binding:"required"`
				Type    string `json:"type"` // To distinguish between newsletter and contact if needed
			}

			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			// If type is newsletter, we can handle it differently or just store as message
			if input.Type == "newsletter" {
				if err := AddSubscriber(input.Email); err != nil {
					// Silent error if already exists or just handle it
					log.Println("Newsletter sub error:", err)
				}
				c.JSON(http.StatusOK, gin.H{"message": "Subscribed successfully"})
				return
			}

			if err := AddMessage(input.Email, input.Name, input.Message); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save message"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
