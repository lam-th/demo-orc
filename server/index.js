const WebSocket = require('ws')
const uuidv1 = require('uuid/v1');

class PlayerData {
    constructor(id, x) {
        this.id = id;
        this.x = x;
        this.status = 0;
        this.key = '';
        this.order = 0;
    }
}
const KEY_CONNECTED = 'connected';
const KEY_INGAME = 'ingame';

const wss = new WebSocket.Server({ port: 8080 })
let users = {};
let userCount = 0;

wss.on('connection', function connection(ws) {
    userCount += 1;
    let player = new PlayerData(uuidv1(), 0);
    player.ws = ws;
    player.key = KEY_CONNECTED;
    player.order = userCount;
    player.x = userCount == 1 ? -320 : 320;
    users[player.id] = player;
    ws.send(JSON.stringify({
        'id'  : player.id, 
        'x'   : player.x,
        'key' : player.key,
        'order': userCount,
        'type' : 'ME'
    })); 
    
    for(let user_id in users) {
        let user = users[user_id];
        console.log(user_id);
        if(user.ws != ws) {
            user.ws.send(JSON.stringify({
                'id'  : player.id, 
                'x'   : player.x,
                'key' : player.key,
                'order': player.order,
                'type' : 'RIVAL'
            })); 
            ws.send(JSON.stringify({
                'id'  : user.id, 
                'x'   : user.x,
                'key' : user.key,
                'order': user.order,
                'type' : 'RIVAL'
            })); 
        }
    }

    ws.on('message', data => {
        let playerdata = JSON.parse(data);
        let pack = new Array();
        if(playerdata.type == KEY_INGAME) {
            console.log('sent: ')
            console.log(playerdata);
            for(let id in users) {
                let user = users[id];
                user.type = KEY_INGAME;
                pack.push(playerdata);

            }
            for(let id in users) {
                users[id].ws.send(JSON.stringify(
                    pack
                )); 
            }
             
        }
    })
    
    ws.on('close', message => {
        console.log('close .. ');
        console.log(message);
        console.log(wss.clients.length);

        for(let obj in users) {
            console.log(obj);
            if(users[obj].ws == ws) {
                console.log("remove client --");
                delete users[obj];
                break;
            }
        }

        userCount -= 1;
        console.log('clients size : ' + Object.keys(users).length);
    });
    
    ws.on('error', function (code, reason) {
        console.log(code);
    });
});

