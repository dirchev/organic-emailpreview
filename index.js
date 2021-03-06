var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')
var bootstrapPath = require.resolve('bootstrap/dist/css/bootstrap.min.css')

var emails = []

var setUpServer = function (plasma, dna) {
  var app = express()

  /* SERVER CONFIG */
  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({ extended: false }))

  /* SERVER ROUTES */
  app.get('/bootstrap.min.css', function (req, res) {
    res.sendFile(bootstrapPath, 'utf8')
  })

  var auth = require('basic-auth')
  var authMiddleware
  if (dna.auth && dna.auth.username && dna.auth.password) {
    authMiddleware = function (req, res, next) {
      var credentials = auth(req)
      if (!credentials || credentials.name !== dna.auth.username || credentials.pass !== dna.auth.password) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="Organic Emailpreview Login"')
        res.end('Access denied')
        return
      }

      next()
    }
  } else {
    authMiddleware = (req, res, next) => { next() }
  }

  app.get('/', [authMiddleware, function (req, res) {
    emails = emails.map(function (email) {
      email.jsonPresentation = JSON.stringify(email.data, null, 4)
      return email
    })
    res.render(__dirname + '/templates/view', {emails: emails})
  }])
  app.get('/email/:emailIndex', [authMiddleware, function (req, res) {
    res.render(__dirname + '/templates/email', {email: emails[req.params.emailIndex]})
  }])

  var server = app.listen(dna.port || 3212, function () {
    console.log('Organic emailpreview listening at http://localhost:%s', server.address().port)
  })

  var sockets = {}
  var nextSocketId = 0

  server.on('connection', function (socket) {
    var socketId = nextSocketId++
    sockets[socketId] = socket
    socket.on('close', function () {
      delete sockets[socketId]
    })
  })

  plasma.on(dna.closeOn || 'kill', function (c, next) {
    for (var socketId in sockets) {
      sockets[socketId].destroy()
    }
    server.close(function () {
      next()
    })
  })
}

module.exports = function (plasma, dna) {
  this.plasma = plasma
  this.dna = dna
  this.templateCache = {}

  setUpServer(plasma, dna)

  var self = this
  plasma.on(dna.reactOn || 'deliverEmail', function (c) {
    emails.push(c)
  })
}
