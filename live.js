const host = 'wss://websocket-api.tibber.com/v1-beta/gql/subscriptions';

var homeId = '96a14971-525a-4420-aae9-e5aedaa129ff'			// demo id
var tibberToken = '5K4MVS-OjfWhK_4yrjOlFe1F6kJXPVf7eQYggo8ebAE'		// demo token

function createId() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

const id = createId()
console.log(id)

const options = {
	headers: {
	"User-Agent": window.navigator.userAgent
	}
};

let ws = new WebSocket(host, 'graphql-transport-ws', options);

ws.onopen = function(){
	json= '{"type":"connection_init","payload":{"token":"'+tibberToken+'"}}';
	ws.send(json)
}

ws.onmessage = function(msg) {
	//console.log(msg)
	reply = JSON.parse(msg.data)
	console.log(msg.data)

	if (reply["type"] == "connection_ack") {
		console.log(reply["type"])

		query = '{"id": "'+id+'","type": "subscribe","payload": {"query": "subscription{liveMeasurement(homeId:\\\"'+homeId+'\\\"){timestamp power powerProduction}}"}}';
		ws.send(query);
	}

	if (reply["type"] == "next") {
		console.log(reply["type"])
		display.innerHTML = 'live Consumption: ' + reply["payload"]["data"]["liveMeasurement"]["power"] + '</br>live Production: ' + reply["payload"]["data"]["liveMeasurement"]["powerProduction"]
	}
}

ws.addEventListener('error', (event) => {
  console.log('WebSocket error: ', event);
});

function stopSocket() {
    try {
        query = '{"id": "'+id+'","type": "stop"}'
        ws.send(query)
		console.log("Client stopped")
		display.innerHTML = 'Client stopped'
    } catch (e) {
        console.log("Stop error")
    }
}
