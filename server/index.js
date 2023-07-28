const WebSocket = require('ws')
const uuidv1 = require('uuid/v1');

class PlayerData {
    constructor(id, x) {
        this.id = id;
        this.x = x;
        this.key = '';
        this.dir = 1;
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
    player.order = userCount%2;
    player.x = player.order == 1 ? -320 : 320;
    player.dir = player.order == 1 ? 1 : -1;
    users[player.id] = player;
    ws.send(JSON.stringify({
        'id'  : player.id, 
        'x'   : player.x,
        'dir' : player.dir,
        'key' : player.key,
        'order': player.order,
        'type' : 'ME'
    })); 
    
    for(let user_id in users) {
        let user = users[user_id];
        if(user.ws != ws) {
            user.ws.send(JSON.stringify({
                'id'  : player.id, 
                'x'   : player.x,
                'dir' : player.dir,
                'key' : player.key,
                'order': player.order,
                'type' : 'RIVAL'
            })); 
            ws.send(JSON.stringify({
                'id'  : user.id, 
                'x'   : user.x,
                'dir' : user.dir,
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
            for(let id in users) {
                let user = users[id];
                user.type = KEY_INGAME;
                if (id == playerdata.id) {
                    user.x = playerdata.x;
                    user.dir = playerdata.dir;
                }
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
        let leftId = '';
        for(let obj in users) {
            console.log(obj);
            if(users[obj].ws == ws) {
                console.log("remove client --");
                leftId = obj;
                delete users[obj];
                break;
            }
        }
        for(let id in users) {
            let user = users[id];
            user.ws.send(JSON.stringify({
                'id': leftId,
                'key': user.key,
                'type': 'LEFT'
            }))
        }
        console.log('clients size : ' + Object.keys(users).length);
    });
    
    ws.on('error', function (code, reason) {
        console.log(code);
    });
});

