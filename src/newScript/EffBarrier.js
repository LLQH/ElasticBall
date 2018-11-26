import GameMgr from "./GameMgr";
export default class DropBox extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        this._rig = this.owner.getComponent(Laya.RigidBody);
    }
    onTriggerEnter(other, self, contact) {
        if (other.owner.name === "playBall") {
            let tempSc = parseInt(this.owner.parent.getChildByName("score").text);
            GameMgr.instance.addScore(tempSc);
            Laya.SoundManager.playSound("sound/hit.wav");
            this.owner.parent.removeSelf();
        }
    }
    onDisable() {
        //盒子被移除时，回收盒子到对象池，方便下次复用，减少对象创建开销。
        Laya.Pool.recover("barrier", this.owner.parent);
    }
}