require("dotenv").config()

const express = require("express")
const formidable = require("express-formidable")
const cors = require("cors")

// MAILGUN CONFIGURATION //
const api_key = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN

const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain })

const app = express()
app.use(formidable())
app.use(cors())

app.get("/", (req, res) => {
	res.send("Server is up!")
})

app.post("/form", (req, res) => {
	const { firstname, lastname, email, subject, message } = req.fields

	if (firstname && lastname && email && subject && message) {
		const data = {
			from: `${firstname} ${lastname} <${email}>`,
			to: "manuel.fontenelle@gmail.com",
			subject: subject,
			text: message,
		}

		mailgun.messages().send(data, (error, body) => {
			if (!error) {
				console.log(body)
				return res.status(200).json(body)
			}
			res.status(400).json(error)
		})
	} else {
		res.status(400).json({ error: "Missing parameters" })
	}
})

app.all("*", (req, res) => {
	res.json({ message: "All routes" })
})

app.listen(process.env.PORT || 3000, () => {
	console.log("Server has just started")
})
