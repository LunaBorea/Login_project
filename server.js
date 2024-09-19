const express = require('express')
const server = express()
const fs = require('fs')

// Serve static files from the 'client' directory.
server.use(express.static('client'))

// Middleware to parse incoming JSON requests. 
server.use(express.json())

// Middleware to parse incoming URL-encoded data (e.g., form data from an HTML form).
server.use(express.urlencoded({ extended: true }))

// Handle GET requests to the '/login' and '/signup' route.
server.get('/login', (req, res)=>{
    res.sendFile(__dirname + '/client/login.html')
})
server.get('/signup', (req, res)=>{
    res.sendFile(__dirname + '/client/signup.html')
})


// Adds empty array if client_data.json is empty
let jsonCheck = fs.readFileSync(__dirname + '/client_data/client_data.json')
if (Object.keys(jsonCheck).length == 0) {
        jsonCheck = []
        fs.writeFileSync(__dirname + '/client_data/client_data.json', JSON.stringify(jsonCheck))
}

// Handle POST requests to the '/form' route.
server.post('/signup', (req, res)=>{
    // Log the form data (contained in `req.body`) submitted by the client to client_data.json.
    // Log what is sent to client_data.json in console
    let clientData = JSON.parse(fs.readFileSync(__dirname + '/client_data/client_data.json'))
    clientData.push(JSON.stringify(req.body))
    fs.writeFileSync(__dirname + '/client_data/client_data.json', JSON.stringify(clientData))
    console.log('Data sent to client_data.json = ' + JSON.stringify(req.body))

    res.sendFile(__dirname + '/client/login.html')
})

server.post('/login', (req, res)=>{
    let clientData = JSON.parse(fs.readFileSync(__dirname + '/client_data/client_data.json'))
    let clientDataUser
    let clientDataPassword
    let loginData = req.body

    for (let login in clientData) {
        clientArray = JSON.parse(clientData[login])
        clientDataUser = clientArray.user
        clientDataPassword = clientArray.password
        if (clientDataUser === loginData.user && clientDataPassword === loginData.password) {
            res.sendFile(__dirname + '/client/reward.html')
        }
    }
    res.sendFile(__dirname + '/client/signup.html')
})

server.listen(3000) 