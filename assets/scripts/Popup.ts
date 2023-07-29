
const {ccclass, property} = cc._decorator;

@ccclass
export default class Popup extends cc.Component {

    public static instance: Popup = null;

    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Button)
    confirmBtn: cc.Button = null;

    okCallback: Function = null;

    onLoad () {
        if (Popup.instance != null) {
            this.node.destroy();
            return;
        }

        Popup.instance = this;

        cc.game.addPersistRootNode(this.node);
        this.node.zIndex = 1000;
        this.node.active = false;
    }

    public onConfirm() {
        if (this.okCallback != null) {
            this.okCallback();
            this.okCallback = null;    
        }
        this.node.active = false;
        this.node.removeFromParent();
    }

    public showPopup(content?: string, onOk?: Function) {
        this.okCallback = onOk;
        if (content != undefined && content != '')
            this.content.string = content;

        // show popup    
        let canvas = cc.find('Canvas');
        this.node.setParent(canvas);
        this.node.active = true;
    }
}
