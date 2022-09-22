/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-21 13:56:53
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 15:57:53
 * @FilePath: /yangyang/assets/Scripts/view/ResultView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, Sprite, UITransform, director } from 'cc';
import { Clips, events, Key } from '../enum/Enums';
import { Global } from '../Global';
import { AudioMgr } from '../manager/AudioMgr';
import { LevelMgr } from '../manager/LevelMgr';
import { PoolMgr } from '../manager/PoolMgr';
import { save, Utils } from '../utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('ResultView')
export class ResultView extends Component {
    @property(Node)
    root: Node = null;
    @property(Node)
    winT: Node = null;
    @property(Node)
    loseT: Node = null;

    @property(Node)
    winB: Node = null;
    @property(Node)
    loseB: Node = null;

    @property(UITransform)
    stars: UITransform = null;

    onEnable() {
        Utils.fadeIn(this.root);
    }
    private _win = true;

    /* not set yet, you can use time to do with score? */
    init(win, score = 3) {

        this._win = win;

        this.winT.active = win;
        this.winB.active = win;
        this.loseT.active = !win;
        this.loseB.active = !win;

        const clip = win ? Clips.win : Clips.lose;

        AudioMgr.ins.playSound(clip);

        if (win) {
            this.stars.width = 180 * score;
            Global.level++;
            if (Global.level > Global.maxLevel) Global.level = Global.maxLevel;
            save(Key.Level, Global.level);
            director.emit(events.Toast, "喵了个喵！")
        } else {
            this.stars.width = 0;
        }
    }

    async again() {
        let level = this._win ? (Global.level - 1) : Global.level;
        if (level < 1) level = 1;
        await LevelMgr.ins.loadLevel(level);
        this.close();
    }
    async next() {
        await LevelMgr.ins.loadLevel(Global.level);
        this.close();
    }

    onDisable() {
        this.winT.active = this.winB.active = false;
        this.loseT.active = this.loseB.active = false;
        this.stars.width = 0;
    }

    close() {
        Utils.fadeOut(this.root, () => {

            PoolMgr.ins.putNode(this.node);
        })
    }


}

