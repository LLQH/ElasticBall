import PlayBall from "./PlayBall";
import BarrierMgr from "./BarrierMgr";
import BALL_STATE from "./BALL_STATE";
import GAME_STATE from "./GAME_STATE";
export default class GameMgr extends Laya.Script {
    /** @prop {name:playBall,tips:"玩家控制的小球",type:Prefab}*/
    /** @prop {name:scoreTxt,tips:"分数",type:Node,acceptTypes:Label}*/
    /** @prop {name:overDialog,tips:"结束页面",type:Node,acceptTypes:Dialog}*/
    constructor() {
        super();
        GameMgr.instance = this;
    }
    onEnable() {
        this._score = 0;
        this.gameState = GAME_STATE.START;
        this._started = false;
        this._endPoint = new Laya.Point();
        this._floorY = Laya.stage.height - 300;
        this._ballNum = 7;
        this._difX;
        this._difY;
        this._speed = 50;//合速度
        this._dirSinY;
        this._dirCosX;
        this._canShoot = false;
        this._gameUIPanel = this.owner.getChildByName("gameUIPanel");
        this._mainUIPanel = this.owner.getChildByName("mainUIPanel");
        this._gamePanel = this.owner.getChildByName("gamePanel");
        this._startBtn = this._mainUIPanel.getChildByName("startBtn");
        this._floor = this._gamePanel.getChildByName("floor");
        this._cir = this._gamePanel.getChildByName("gameBox");
        this._barMgr = this._cir.getComponent(BarrierMgr);
        this._startPoint = new Laya.Point(this._floor.width / 2, this._floor.y);
        this.overDialog.getChildByName("restartBtn").on(Laya.Event.CLICK, this, function () {
            this.restartGame();
        });
        this._startBtn.on(Laya.Event.MOUSE_DOWN, this, function () {
            this._mainUIPanel.visible = false;
            Laya.stage.timer.once(1000, this, this.startGame);
            //this.startGame();
        });
    }
    startGame() {
        this._myplayBall = Laya.Pool.getItemByCreateFun("playBall", this.playBall.create, this.playBall);
        this._myplayBall.pos(this._floor.width / 2 - 25, this._floor.y - 25);
        this._gamePanel.addChild(this._myplayBall);
        //this._myplayBall.addComponent(PlayBall);
        this._barMgr.createBarrier();
        this._myplayBallSc = this._myplayBall.getComponent(PlayBall);
        this._started = true;
        this._canShoot = true;
        this.gameState = GAME_STATE.GAMEING;
    }
    restartGame() {
        this.overDialog.close();
        Laya.Pool.recover("playBall", this._myplayBall);
        this._barMgr.recoverBar();
        this._score = 0;
        this.scoreTxt.text = this._score;
        this.startGame();
    }
    onStart() {
        this._floor.y = this._floorY;
    }
    onUpdate() {
        //console.log(this.gameState);
        if (this.gameState === GAME_STATE.START) {

        } else if (this.gameState === GAME_STATE.OVER) {
            console.log("游戏结束");
        } else if (this.gameState === GAME_STATE.GAMEING) {
            //判断小球的状态
            //1.在中途停止
            if (this._myplayBallSc.state === BALL_STATE.STOP) {
                if (this._myplayBall.y < (this._floor.y - 25)) {
                    this.gameOver();
                    this.gameState = GAME_STATE.OVER;
                } else {
                    //判断是否还能得分
                    this._canShoot = true;
                }
            } else {

            }
        }
    }

    addScore(sc = 0) {
        this._score += sc;
        this.scoreTxt.text = this._score;
    }
    gameOver() {
        console.log("游戏结束");
        this.gameState = GAME_STATE.OVER;
        this.overDialog.visible = true;
        this.overDialog.show();
    }
    onStageMouseMove(e) {
        if (!this._canShoot) return;
        e.stopPropagation();
        let tempX = 0;
        let tempY = 0;
        tempX = Laya.stage.mouseX;
        tempY = Laya.stage.mouseY;
        this._startPoint = new Laya.Point(this._myplayBall.x, this._myplayBall.y);
        this._endPoint = { x: tempX, y: tempY };
        this._difX = (this._endPoint.x - this._startPoint.x) / this._ballNum;
        this._difX = Math.trunc(this._difX);
        this._difY = (this._endPoint.y - this._startPoint.y) / this._ballNum;
        this._difY = Math.trunc(this._difY);

        this._cir.graphics.clear();
        for (let i = 0; i <= this._ballNum; i++) {
            this._cir.graphics.drawCircle(this._startPoint.x + this._difX * i, this._startPoint.y + this._difY * i, 5, "#ffffff");
        }
        if (Laya.stage.mouseY > this._startPoint.y) {
            this._canShoot = false;
            this._cir.graphics.clear();
        } else {

        }
        console.log(this._canShoot);
    }
    onStageMouseUp(e) {
        if (!this._canShoot) return;
        if (this._canShoot) {
            console.log("发射："+this._canShoot);
            this._canShoot = false;
            this._cir.graphics.clear();
            e.stopPropagation();

            this._myplayBallSc.changeBallState(BALL_STATE.MOVING);
            let rig = this._myplayBall.getComponent(Laya.RigidBody);
            //确定方向
            this._dirCosX = this._difX / Math.sqrt(this._difX ** 2 + this._difY ** 2);
            this._dirSinY = this._difY / Math.sqrt(this._difX ** 2 + this._difY ** 2);
            let tarX = Math.trunc(this._speed * this._dirCosX);
            let tarY = Math.trunc(this._speed * this._dirSinY);

            const speed = {
                x: (Laya.stage.mouseX - this._myplayBall.x) / (Laya.stage.mouseY - this._myplayBall.y),
                y: 1
            }
            const fixRate = Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2)) / Math.sqrt(Math.pow(Laya.stage.width, 2) + Math.pow(Laya.stage.height, 2)) * 100;
            rig.setVelocity({ x: -speed.x / fixRate * 2, y: -speed.y / fixRate * 2 });
        }

    }
}