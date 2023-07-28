import { CONNECTED, INGAME, PlayerData } from "./GameDefine";
import PlayerAnim from "./PlayerAnim";
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
    rivalAnim: PlayerAnim = null;

    start() {

        this.player = cc.find('Canvas/PlayerControl').getComponent(PlayerControl);

        this.ws = new WebSocket("ws://127.0.0.1:8080");

        // websocket event
        this.ws.onopen = evt => {
            this.isConnected = true;
        };

        this.ws.onclose = evt => {
            this.isConnected = false;
        }

        this.ws.onmessage = evt => {
            console.log('data: ' + evt.data);

            let data = JSON.parse(evt.data);
            if (data.key != undefined && data.key == CONNECTED) {
                if (data.type == 'ME') {
                    this.player.initPlayer(data);
                    console.log('connected to server');
                }
                else if (data.type == 'RIVAL') {
                    let rival = cc.instantiate(this.playerPrefab);
                    rival.x = data.x;
                    rival.y = -150;
                    rival.setParent(this.node.parent);

                    this.rivalData = data;
                    this.rivalData.node = rival;
                    this.rivalAnim = rival.getComponent(PlayerAnim);
                    this.rivalAnim.lookAt(data.dir)
                }
                else if (data.type == INGAME) {
                    console.log(`player move: x = ${data.x}`);
                    this.rivalData.x = data.x;
                    this.rivalData.dir = data.dir;
                }
                else if (data.type == 'LEFT') {
                    if (this.rivalData.id == data.id) {
                        this.rivalData.node.destroy();
                        this.rivalData = null;
                    }
                }
            }

            for(let i = 0; i < data.length; i++) {
                if (data[i].id == this.rivalData.id) {
                    this.rivalData.node.x = data[i].x;
                    // animation
                    if (data[i].dir != 0) {
                        this.rivalAnim.startWalking(data[i].dir);
                    }
                    else {
                        this.rivalAnim.stopWalking();
                    }
                    //message
                    if (data[i].message != undefined) {
                        this.rivalAnim.showChatBubble(data[i].message);
                    }
                    break;
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
