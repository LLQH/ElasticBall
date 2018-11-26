export default class BarrierMgr extends Laya.Script {
    /** @prop {name:stBar1,tips:"静态障碍",type:Prefab}*/
    /** @prop {name:bar1,tips:"得分障碍1",type:Prefab}*/
    /** @prop {name:bar2,tips:"得分障碍2",type:Prefab}*/
    /** @prop {name:stBarSp,tips:"静态障碍点",type:Node}*/
    onEnable() {
        this.pointArr = [
            { x: 62, y: 59 },
            { x: 304, y: 127 },
            { x: 597, y: 87 },
            { x: 479, y: 216 },
            { x: 311, y: 287 },
        ];
        this.effBars = [];
        this.effBarNum = 0;
    }
    constructor() {
        super();
    }
    createBarrier() {
        this.effBarNum = 0;
        //1.静态障碍
        this.stBarSp.visible = true;
        //2.动态障碍
        for (let index = 0; index < this.pointArr.length; index++) {
            let element = null;
            if (Math.random() > 0.5) {
                element = Laya.Pool.getItemByCreateFun("effbar2", this.bar2.create, this.bar2);
                element.getChildByName("barObj").rotation = Math.trunc(Math.random() * 360);
            } else {
                element = Laya.Pool.getItemByCreateFun("effbar1", this.bar1.create, this.bar1);
            }
            element.getChildByName("score").text = Math.floor((Math.random() + 0.1) * 10);
            element.pos(this.pointArr[index].x, this.pointArr[index].y);
            this.owner.addChild(element);
            this.effBars.push(element);
            this.effBarNum += 1;
        }
    }
    recoverBar() {
        this.stBarSp.visible = false;
        for (let index = 0; index < this.effBars.length; index++) {
            this.effBars[index].removeSelf();
            if (this.effBars[index].name === "bar1") {
                Laya.Pool.recover("effbar1", this.effBars[index]);
            } else if (this.effBars[index].name === "bar2") {
                Laya.Pool.recover("effbar2", this.effBars[index]);
            }
        }
        this.effBars = [];
    }
}