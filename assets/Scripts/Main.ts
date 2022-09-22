/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-02 09:02:31
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 16:12:01
 * @FilePath: /98KPhysic/assets/src/Main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node, game, Vec3, sys, macro, view, screen, AmbientInfo, setDisplayStats, profiler, CameraComponent, utils } from 'cc';

import texts, { AssetType, Clips, Key, Props, ui } from './enum/Enums';
import { Global } from './Global';
import { AudioMgr } from './manager/AudioMgr';
import { GameMgr } from './manager/GameMgr';
import { LevelMgr } from './manager/LevelMgr';
import ResMgr from './manager/ResMgr';
import { load, Utils } from './utils/Utils';

const { ccclass, property } = _decorator;

const _euler = new Vec3();

const lightSpeed = 0.0001;

@ccclass('Main')
export class Main extends Component {

    /**
     * @scene {0} for world
     * @scene {1} for player
     * @scene {2} for others
     * @scene {3} for effect
     * @scene {4} for rest
     */
    @property({ type: Node, tooltip: "{0} for world,{1} for player,{2} for others,{3} for effect", group: Props.Scenes })
    scene: Node[] = [];
    /**
     * @layer {0} for baseUI
     * @layer {1} for popWin
     * @layer {2} for globalToast
     */
    @property({ type: Node, tooltip: "{0} for baseUI,{1} for popWin,{2} for globalToast", group: Props.Layers })
    layer: Node[] = [];

    @property({ type: Node, group: Props.Comps })
    target: Node = null;

    @property({ type: Node, group: Props.Comps })
    load: Node = null;

    @property({ type: CameraComponent, group: Props.Comps })
    uiCam: CameraComponent = null;

    @property({ type: CameraComponent, group: Props.Comps })
    sceneCam: CameraComponent = null;

    public static ins: Main = null;

    private dt = 0;

    private _time = 0.8;

    public level: LevelMgr = null;
    public game: GameMgr = null;


    /* Check LoadingMgr for loading activities */
    onLoad() {
        /* set normal performance */
        game.frameRate = 60;
        /* detect language environment */
        Global.en = Utils.isEn();

        Global.runtime = true;



        // profiler.hideStats()

    }

    start() {

        Global.level = Number(load(Key.Level)) || 1;

        Main.ins = this;
        Global.layer = this.layer;
        Global.scene = this.scene;
        this.loadRes();
        // this.checkFullScreen();

    }

    async loadRes() {
        await ResMgr.ins.loadBundle(1, 0.1);
        await ResMgr.ins.loadRes(1, AssetType.Prefab, 0.6)
        await ResMgr.ins.loadRes(1, AssetType.Sound, 0.16)
        await ResMgr.ins.loadRes(1, AssetType.Json, 0.15)
        await ResMgr.ins.getUI(ui.HomeView);
        await LevelMgr.ins.init(this.scene[0].getChildByName("cubes"));
        GameMgr.ins.init(this.sceneCam, this.scene[0], this.scene[1]);
        AudioMgr.ins.playLoopSound(Clips.bgm);
        Utils.clearUI(this.load);

    }

    async startGame() {
        this.scene[1].active = true;
        AudioMgr.ins.playSound(Clips.btn);
        await LevelMgr.ins.loadLevel(Global.level);
    }


    checkFullScreen() {

        if (sys.isMobile) {
            Global.isMobile = true;
            view.setOrientation(macro.ORIENTATION_LANDSCAPE);
            screen.requestFullScreen()
        }

    }



}

