import Popup from "./Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component {

    @property(cc.Button)
    btnPlay: cc.Button = null;

    start () {
        this.btnPlay.node.on('click', () => {
            cc.director.loadScene('game');
            //Popup.instance.showPopup();
        })
    }
}
