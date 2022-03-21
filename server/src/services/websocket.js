#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var moment = require('moment');
const map = require('../map.json');

var client = new WebSocketClient();
const state = {
    map: {},
    devices: {}
}

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            // console.log("Received: '" + message.utf8Data + "'");
            const data = JSON.parse(message.utf8Data);

            switch (data.type) {
                case 'auth_required': {
                    return sendAuth(connection);
                }
                case 'auth_ok': {
                    subscribeToBus(connection);
                    return constructMap();
                }
                case 'event': {
                    return processEvent(connection, data.event);
                }
            }
        }
    });
});

client.connect('ws://192.168.1.8:8123/api/websocket');



// Build a map of rooms with empty occupancy
// This is the source of truth
const constructMap = () => {
    map.home.floors.forEach(floor => {
        floor.rooms.forEach(room => {
            if (!state.map[room.id]) {
                state.map[room.id] = {
                    occupancy: [],
                    level: []
                };
            }
            state.map[room.id].level.push(floor.level)

            if (room.devices) {
                room.devices.forEach(device => {
                    if (!state.devices[device.entity_id]) state.devices[device.entity_id] = { ...device, room: room.id, floor: floor.id };
                })
            }
        })
    })

    console.log({ state })

}

const sendAuth = (connection) => {
    return connection.sendUTF(JSON.stringify({
        "type": "auth",
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3ZTgxODZjNTc2ZmQ0NmU4YThjYmFmZTJkYzI5NTgyMiIsImlhdCI6MTY0NzQ2ODI5NywiZXhwIjoxOTYyODI4Mjk3fQ.zgxkQ_9fGn2dga4tqGlhUnSVSk0csoiYVMV1FM6F4gI"
    }))
}

const subscribeToBus = (connection) => {
    return connection.sendUTF(JSON.stringify({
        "id": 18,
        "type": "subscribe_events",
        // Optional
        "event_type": "state_changed"
    }))
}

const processEvent = (connection, event) => {
    const entity_id = event.data.entity_id
    const device = state.devices[entity_id];



    if (device) {
        console.log('Got Event!')
        const room = state.map[device.room];
        room.occupancy.push({
            id: device.owner,
            time: moment()
        })

        console.log(state.map)
    }
}

const handleHomeEvent = (entity_id) => {
    const home = map.home.devices.find(device => device.id === entity_id);
    if (home) {
        console.log(home)
    }
}