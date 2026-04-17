package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type ZeptomailRequest struct {
	From          ZeptomailAddress `json:"from"`
	To            []ZeptomailTo    `json:"to"`
	Subject       string           `json:"subject"`
	Htmlbody      string           `json:"htmlbody"`
	BounceAddress string           `json:"bounce_address,omitempty"`
}

type ZeptomailAddress struct {
	Address string `json:"address"`
	Name    string `json:"name"`
}

type ZeptomailTo struct {
	EmailAddress ZeptomailAddress `json:"email_address"`
}

func SendEmail(toEmail, toName, subject, htmlBody string) error {
	apiKey := os.Getenv("ZEPTOMAIL_API_KEY")
	senderEmail := os.Getenv("ZEPTOMAIL_SENDER_EMAIL")
	senderName := os.Getenv("ZEPTOMAIL_SENDER_NAME")
	bounceAddress := os.Getenv("ZEPTOMAIL_BOUNCE_ADDRESS")

	if apiKey == "" || senderEmail == "" {
		return fmt.Errorf("Zeptomail environment variables missing")
	}

	requestBody := ZeptomailRequest{
		From: ZeptomailAddress{
			Address: senderEmail,
			Name:    senderName,
		},
		To: []ZeptomailTo{
			{
				EmailAddress: ZeptomailAddress{
					Address: toEmail,
					Name:    toName,
				},
			},
		},
		Subject:       subject,
		Htmlbody:      htmlBody,
		BounceAddress: bounceAddress,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.zeptomail.com/v1.1/email", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusAccepted {
		return fmt.Errorf("Zeptomail API error: status %d", resp.StatusCode)
	}

	return nil
}

func SendContactNotifications(email, name, problem, description, area, deadline, budget string) {
	adminEmail := os.Getenv("ADMIN_EMAIL")
	siteName := os.Getenv("SITE_NAME")

	// 1. Notification to Admin
	adminSubject := fmt.Sprintf("Nuevo Lead: %s - %s", name, area)
	adminBody := fmt.Sprintf(`
		<h2>Nuevo contacto desde %s</h2>
		<p><strong>Nombre:</strong> %s</p>
		<p><strong>Email:</strong> %s</p>
		<p><strong>Area:</strong> %s</p>
		<p><strong>Problema:</strong> %s</p>
		<p><strong>Descripción:</strong> %s</p>
		<p><strong>Plazo:</strong> %s</p>
		<p><strong>Presupuesto:</strong> %s</p>
	`, siteName, name, email, area, problem, description, deadline, budget)

	err := SendEmail(adminEmail, "Admin", adminSubject, adminBody)
	if err != nil {
		fmt.Printf("Error sending admin notification: %v\n", err)
	}

	// 2. Confirmation to User
	userSubject := fmt.Sprintf("Gracias por contactarme - %s", siteName)
	userBody := fmt.Sprintf(`
		<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
			<h2 style="color: #f43f5e;">¡Hola %s!</h2>
			<p>He recibido tu solicitud para trabajar en tu proyecto de <strong>%s</strong>.</p>
			<p>Revisaré los detalles que me compartiste y me pondré en contacto contigo en las próximas 24-48 horas.</p>
			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
			<p style="font-size: 14px; color: #666;">Este es un mensaje automático confirmando la recepción de tu formulario.</p>
		</div>
	`, name, area)

	err = SendEmail(email, name, userSubject, userBody)
	if err != nil {
		fmt.Printf("Error sending user confirmation: %v\n", err)
	}
}
