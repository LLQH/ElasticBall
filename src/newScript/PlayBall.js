import GameMgr from "./GameMgr";
import BALL_STATE from "./BALL_STATE";
import GAME_STATE from "./GAME_STATE";
export default class PlayBall extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        this.radius = 25;
        this.state = BALL_STATE.STOP;
        //设置初始速度
        this.rig = this.owner.getComponent(Laya.RigidBody);
    }
    onUpdate() {
        if (this.state === BALL_STATE.MOVING) {
            if (this.rig.linearVelocity.x === 0 && this.rig.linearVelocity.y == 0) {
                this.state = BALL_STATE.STOP;
            }
            if (Math.abs(this.rig.linearVelocity.x) <= 0.2 && Math.abs(this.rig.linearVelocity.y) <= 0.2) {
                this.rig.setVelocity({ x: 0, y: 0 });
            }
        }
    }
    changeBallState(newState) {
        this.state = newState;
    }
    onTriggerEnter(other, self, contact) {
        if (other.owner.name == "floor") {
            console.log("速度变为0");
            this.rig.setVelocity({ x: 0, y: 0 });
            this.owner.y = other.owner.y - this.radius;
            this.state = BALL_STATE.STOP;
        }
    }
}