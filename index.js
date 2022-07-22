const express = require("express")
const cors = require("cors")
const formData = require("form-data")
const Mailgun = require("mailgun.js")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

const mailgun = new Mailgun(formData)
const client = mailgun.client({
	username: "Manuel Fontenelle",
	key: process.env.MAILGUN_API_KEY,
})

app.post("/form", (req, res) => {
	const { firstname, lastname, email, subject, message } = req.body

	if (firstname && lastname && email && subject && message) {
		const messageData = {
			from: `${firstname} ${lastname} <${email}>`,
			to: "manuel.fontenelle@gmail.com",
			subject: `Formulaire reçu`,
			text: `Message envoyé par ${firstname} ${lastname} : ${message}`,
		}

		client.messages
			.create(process.env.MAILGUN_DOMAIN, messageData)
			.then((response) => {
				res.status(response.status).json({ message: response.message })
			})
			.catch((err) => {
				res.status(err.status).json({ message: err.message })
			})
	} else {
		res.status(400).json({ error: "Missing parameters" })
	}
})

app.all("*", (req, res) => {
	res.json({ message: "All routes" })
})

app.listen(process.env.PORT || 3000, () => {
	console.log("Server started")
})
