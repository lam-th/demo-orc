import { CONNECTED, INGAME, PlayerData, RivalData } from "./GameDefine";
import PlayerAnim from "./PlayerAnim";
import PlayerControl from "./PlayerControl";
import Popup from "./Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WsControl extends cc.Component {

    ws: WebSocket = null;
    isConnected: boolean = false;

    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;

    @property(cc.Node)
    rivalsRoot: cc.Node = null;

    player: PlayerControl = null;
    rivals: {[key: string]: RivalData} = {}

    onDisable() {
        this.ws.close();
    }

    start() {

        this.player = cc.find('Canvas/PlayerControl').getComponent(PlayerControl);

        this.ws = new WebSocket("ws://127.0.0.1:8080");

        // websocket event
        this.ws.onopen = () => {
            this.isConnected = true;
        };

        this.ws.onclose = evt => {
            this.isConnected = false;
            this.ws = null;
            if (evt.code == 3001) {
                console.log('connection closed');
            }
            else {
                console.log('connection error');
            }
        }

        this.ws.onerror = evt => {
            this.isConnected = false;
            if (this.ws.readyState == 1) {
                console.log('connection normal error: ' + evt.type);
            }
            Popup.instance.showPopup('Connect to server failed', () => {
                cc.director.loadScene('menu');
            })
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
                    rival.y = -215;
                    rival.setParent(this.rivalsRoot);

                    this.rivals[data.id] = new RivalData();
                    this.rivals[data.id].data = data;
                    this.rivals[data.id].anim = rival.getComponent(PlayerAnim);
                    this.rivals[data.id].anim.lookAt(data.dir)
                }
                else if (data.type == INGAME) {
                    console.log(`player move: x = ${data.x}`);
                    let rival = this.rivals[data.id];
                    if (rival != undefined) {
                        rival.data.x = data.x;
                        rival.data.dir = data.dir;
                        rival.data.status = data.status;
                    }
                }
                else if (data.type == 'LEFT') {
                    if (this.rivals[data.id] != undefined) {
                        this.rivals[data.id].anim.node.destroy();
                        delete this.rivals[data.id];
                    }
                }
            }

            for(let i = 0; i < data.length; i++) {
                if (data[i].id != this.player.playerData.id) {
                    let rival = this.rivals[data[i].id];
                    rival.anim.node.x = data[i].x;
                    // animation
                    if (data[i].status == 'walk') {
                        rival.anim.startWalking(data[i].dir);
                    }
                    else {
                        rival.anim.stopWalking();
                    }
                    //message
                    if (data[i].message != undefined) {
                        rival.anim.showChatBubble(data[i].message);
                    }
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
