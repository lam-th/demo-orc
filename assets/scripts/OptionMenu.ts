
const {ccclass, property} = cc._decorator;

@ccclass
export default class OptionMenu extends cc.Component {

    @property(cc.Button)
    quitBtn: cc.Button = null;

    start () {
        this.quitBtn.node.on('click', () => {
            cc.director.loadScene('menu');
        })
    }
}
