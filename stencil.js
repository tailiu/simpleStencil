var io = require('socket.io')
var clientIO = require('socket.io-client')

function getPeerURL(host, port) {
	return 'http://' + host + ':' + port
}

//Initialize stencil. Specifically, this peer connects to 
//all the members in the memberlist except itself
//arguments:
//memberList: all the members
//host: local host address
//listeningPort: local listening port
exports.init = function(memberList, host, listeningPort) {
	var sockets = []

	for (var i in memberList) {
		var member = memberList[i]
		var memHost = member.host
		var memPort = member.port

		if (memHost == host && memPort == listeningPort) {
			continue
		}

		var socket = clientIO.connect(getPeerURL(memHost, memPort))
		sockets.push(socket)
	}

	return sockets
}

//Send data to all the connected sockets
//this function emits 'send' event out
//arguments:
//sockets: sockets returned by init()
//data: this peer wants to send
exports.sendToStream = function(sockets, data) {
	for (var i in sockets) {
		sockets[i].emit('send', data)
	}
}

//Get data from other sockets
//This function should only be called once, because it
//registers a 'send' event and listens to this 'event'.
//Once there are new data, this function would send the new data to callback
//arguments:
//listeningPort: the port this peer listens on
//callback: once this peer receives some messages, it would send to callback
exports.getFromStream = function(listeningPort, callback) {
	var serverIO = io(listeningPort)

	serverIO.on('connection', function (serverSocket){
		serverSocket.on('send', function (msg) {
			callback(msg)
		})
	})
}