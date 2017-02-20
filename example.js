var io = require('socket.io')
var clientIO = require('socket.io-client')
var stencil = require('./stencil')

//Get port number from command line
var listeningPort = process.argv[2]

//This example hardcodes the memberList
//Please provide the memberList in this format
var memberList = [
	{'host': 'localhost', 'port': 6000},
	{'host': 'localhost', 'port': 5000},
	{'host': 'localhost', 'port': 4000}
]

var sockets = stencil.init(memberList, 'localhost', listeningPort)

//Receive messages
stencil.getFromStream(listeningPort, function(msg){
	console.log(msg)
})

//Send messages periodically to all members
setInterval(function(){
	//Send a message
	stencil.sendToStream(sockets, listeningPort + ' says hello')
}, 3000)