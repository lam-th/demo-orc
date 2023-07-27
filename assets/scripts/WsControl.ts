import { CONNECTED, INGAME, PlayerData } from "./GameDefine";
import PlayerControl from "./PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WsControl extends cc.Component {

    ws: WebSocket = null;
    isConnected: boolean = false;

    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;

    player: PlayerControl = null;
    rivalData: PlayerData = null;

    start() {

        this.player = cc.find('Canvas/Player').getComponent(PlayerControl);

        this.ws = new WebSocket("ws://127.0.0.1:8080");

        // websocket event
        this.ws.onopen = evt => this.isConnected = true;
        this.ws.onclose = evt => this.isConnected = false;
        this.ws.onmessage = evt => {
            console.log('data: ' + evt.data);

            let data = JSON.parse(evt.data);
            if (data.key != undefined && data.key == CONNECTED) {
                if (data.type == 'ME') {
                    this.player.initPlayer(data);
                    console.log('connected to server');
                }
                else if (data.type == 'RIVAL') {
                    console.log(data);

                    let rival = cc.instantiate(this.playerPrefab);
                    rival.x = data.x;
                    rival.y = -150;
                    rival.scaleX = data.order == 1 ? 1 : -1;
                    rival.setParent(this.node.parent);

                    this.rivalData = data;
                    this.rivalData.node = rival;
                }
                else if (data.type == INGAME) {
                    console.log(`player move: x = ${data.x}`);
                    this.rivalData.x = data.x;
                }
            }

            for(let i = 0; i < data.length; i++) {
                if (data[i].id == this.rivalData.id) {
                    this.rivalData.node.x = data[i].x;
                }
            }
        };
    }

    public send(data: string) {
        if (this.ws != null && this.isConnected == true){
            this.ws.send(data);
        }
    }
}
