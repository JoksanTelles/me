package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using defaults")
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "me.db"
	}
	InitDB(dbPath)

	r := gin.Default()

	// Detailed Request Logger
	r.Use(func(c *gin.Context) {
		log.Printf("Incoming %s %s from %s", c.Request.Method, c.Request.URL.Path, c.ClientIP())
		log.Printf("X-Admin-Email: [%s]", c.GetHeader("X-Admin-Email"))
		log.Printf("X-Admin-Token: [%s]", c.GetHeader("X-Admin-Token"))
		c.Next()
	})

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Admin-Token, X-Admin-Email")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})

		// Contact Form Submission (Unified Multi-step)
		api.POST("/contact", func(c *gin.Context) {
			var input struct {
				Email       string `json:"email" binding:"required,email"`
				Name        string `json:"name"`
				Company     string `json:"company"`
				Role        string `json:"role"`
				Description string `json:"description"`
				Area        string `json:"area"`
				Problem     string `json:"problem"`
				Deadline    string `json:"deadline"`
				Budget      string `json:"budget"`
				Type        string `json:"type"`
			}

			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			// 1. Get or Create User
			userID, err := GetOrCreateUser(input.Email, input.Name, input.Company, input.Role)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error managing user data"})
				return
			}

			// 2. Add Contact Submission
			err = AddContact(userID, input.Problem, input.Description, input.Area, input.Deadline, input.Budget)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving contact submission"})
				return
			}

			// 3. Send Emails (Async to not block response)
			go SendContactNotifications(input.Email, input.Name, input.Problem, input.Description, input.Area, input.Deadline, input.Budget)

			c.JSON(http.StatusOK, gin.H{"message": "Enviado correctamente"})
		})

		// Admin Routes (Simple Token Protection)
		admin := api.Group("/admin")
		admin.Use(func(c *gin.Context) {
			email := c.GetHeader("X-Admin-Email")
			token := c.GetHeader("X-Admin-Token")

			expectedEmail := os.Getenv("ADMIN_EMAIL")
			expectedToken := os.Getenv("ADMIN_TOKEN")

			// Debug logging (Remove in production)
			log.Printf("Admin Auth Attempt: Received Email: [%s], Received Token: [%s]", email, token)
			log.Printf("Expected: Email: [%s], Token: [%s]", expectedEmail, expectedToken)

			if email == "" || token == "" || email != expectedEmail || token != expectedToken {
				log.Println("Auth Failed: mismatch or empty headers")
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
				return
			}
			c.Next()
		})
		{
			admin.GET("/leads", func(c *gin.Context) {
				leads, err := GetAllLeads()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving leads"})
					return
				}
				c.JSON(http.StatusOK, leads)
			})

			admin.GET("/subscribers", func(c *gin.Context) {
				subs, err := GetAllSubscribers()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving subscribers"})
					return
				}
				c.JSON(http.StatusOK, subs)
			})
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
