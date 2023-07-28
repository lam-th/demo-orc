
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerAnim extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    isWalking: boolean = false;

    public lookAt(dir: number) {
        this.node.scaleX = dir;
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
