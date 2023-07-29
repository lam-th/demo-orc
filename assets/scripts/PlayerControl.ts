import { INGAME, PlayerData } from "./GameDefine";
import PlayerAnim from "./PlayerAnim";
import WsControl from "./WsControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

    speed: number = 150;
    status: string = 'idle';
    dir: number = 0;
    playerData: PlayerData;

    @property(WsControl)
    ws: WsControl = null;

    @property(PlayerAnim)
    playerAnim: PlayerAnim = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public initPlayer(data: PlayerData) {
        this.playerData = data;
        this.node.x = data.x;
        this.playerAnim.lookAt(data.dir);
        this.node.active = true;
    }
    
    update(dt: number) {
        if (this.status == 'idle')
            return;
            
        this.playerAnim.startWalking(this.dir);
        this.node.x += this.speed * this.dir * dt;
        this.sendData(INGAME);
    }

    public sendData(type: string, message?: string) {
        if (this.ws == null || !this.playerData) 
            return;
        //prepare data
        this.playerData.x = this.node.x;
        this.playerData.type = type;
        this.playerData.dir = this.dir;
        this.playerData.status = this.status;
        this.playerData.message = message;
        //send to server
        this.ws.send(JSON.stringify(this.playerData));
    }

    onKeyDown(evt: cc.Event.EventKeyboard) {
        switch(evt.keyCode) {
            case cc.macro.KEY.right:
                this.status = 'walk';
                this.dir = 1;
            break;

            case cc.macro.KEY.left:
                this.status = 'walk';
                this.dir = -1;
            break;
        }
    }

    onKeyUp(evt: cc.Event.EventKeyboard) {
        this.status = 'idle';
        this.playerAnim.stopWalking();
        this.sendData(INGAME);
    }

    public chatMessage(message: string) {
        this.sendData(INGAME, message);
        this.playerAnim.showChatBubble(message);
    }
}
