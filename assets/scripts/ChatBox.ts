import { INGAME } from "./GameDefine";
import PlayerControl from "./PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatBox extends cc.Component {

    @property(cc.EditBox)
    chatBox: cc.EditBox = null;

    @property(PlayerControl)
    player: PlayerControl = null;

    public onEditEnd(editbox: cc.EditBox, customData: string ) {
        this.player.chatMessage(this.chatBox.string);
        this.chatBox.string = '';
    }
}
