var express = require('express')
var bodyParser = require('body-parser')

var emails = []

var setUpServer = function (plasma, dna) {
  var app = express()

  /* SERVER CONFIG */
  app.set('view engine', 'ejs')
  app.use(express.static(__dirname + '/bower_components'))
  app.use(bodyParser.urlencoded({ extended: false }))

  /* SERVER ROUTES */
  app.get('/', function (req, res) {
    res.render(__dirname + '/templates/view', {emails: emails})
  })
  app.get('/email/:emailIndex', function (req, res) {
    res.render(__dirname + '/templates/email', {email: emails[req.params.emailIndex]})
  })

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
