
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatBubble extends cc.Component {

    @property(cc.RichText)
    message: cc.RichText = null;

    public showMessage(msg: string) {
        this.message.string = msg;
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 5);
    }

}
