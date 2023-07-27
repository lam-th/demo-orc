import { INGAME, PlayerData } from "./GameDefine";
import WsControl from "./WsControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

    speed: number = 150;
    dir: number = 0;
    playerData: PlayerData;

    @property(WsControl)
    ws: WsControl = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    initPlayer(data: PlayerData) {
        this.playerData = data;
        this.node.x = data.x;
        this.node.scaleX = data.order == 1 ? 1 : -1;
    }
    
    update(dt: number) {
        if (this.dir == 0)
            return;
        this.node.x += this.speed * this.dir * dt;
        this.sendData(INGAME);
    }

    public sendData(type: string) {
        if (this.ws == null) return;
        //prepare data
        this.playerData.x = this.node.x;
        this.playerData.type = type;
        //send to server
        this.ws.send(JSON.stringify(this.playerData));
    }

    onKeyDown(evt: cc.Event.EventKeyboard) {
        switch(evt.keyCode) {
            case cc.macro.KEY.right:
                this.dir = 1;
            break;

            case cc.macro.KEY.left: 
                this.dir = -1;
            break;
        }
    }

    onKeyUp(evt: cc.Event.EventKeyboard) {
        this.dir = 0;
    }
}
