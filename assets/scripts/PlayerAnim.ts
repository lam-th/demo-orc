import ChatBubble from "./ChatBubble";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerAnim extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    isWalking: boolean = false;

    @property(cc.Prefab)
    chatBubble: cc.Prefab = null;

    public lookAt(dir: number) {
        this.anim.node.scaleX = dir;
    }

    public showChatBubble(message: string) {
        let bubble = cc.instantiate(this.chatBubble);
        bubble.setParent(this.node);
        bubble.getComponent(ChatBubble).showMessage(message);
    }

    public startWalking(dir: number) {
        if (this.isWalking) 
            return;

        this.lookAt(dir);
        this.isWalking = true;
        this.anim.play('walk');
    }

    public stopWalking() {
        if (!this.isWalking)
            return;

        this.isWalking = false;
        this.anim.play('idle');
    }
}
