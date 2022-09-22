/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-19 00:19:54
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 15:55:43
 * @FilePath: /yangyang/assets/Scripts/manager/LevelMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, Vec3, tween, MeshRenderer, director } from 'cc';
import { events } from '../enum/Enums';
import { Global } from '../Global';
import { rez, Utils } from '../utils/Utils';
import { CubeMgr } from './CubeMgr';
import { GameMgr } from './GameMgr';
import { PoolMgr } from './PoolMgr';
import ResMgr from './ResMgr';

const v = /* as temp Vec3 */new Vec3();

export class LevelMgr {

    private xSize = 1;
    private zSize = 1;
    private gridSize = 1;

    private scene: Node = null;



    private static _ins: LevelMgr = null;

    public static get ins() {
        if (!this._ins) {
            this._ins = new LevelMgr();
        }

        return this._ins;
    }

    init(scene) {

        this.scene = scene;

    }

    /* load level from json parsed */
    async loadLevel(index: number) {

        if (index > Global.maxLevel) {

            return;
        }
        director.emit(events.Toast, "关卡" + index)

        const data = ResMgr.ins.getJson("" + index);
        const config = data.config;
        this.xSize = config.x;
        this.zSize = config.z;
        this.gridSize = config.size;
        const y = -(config.height - 1) / 2;
        const z = -4 - config.width * 2;

        Global.min = z - 4.5;
        Global.max = z + 3.5;

        this.scene.setPosition(0, y);

        this.scene.parent.setPosition(0, 0, z);

        const map = data.mapData;

        /* cubes length */
        const L = map.length;
        /* cubes types,types increases on every 10 of the cubes length, and gains again on every 50 of the length */
        let T = 3 + Math.floor(L / 10) + Math.floor(L / 50);
        /* we only have 8 types of icons for the demo,add more if you want */
        if (T > 8) T = 8;

        let K = 1 + Math.floor(L / 70);

        if (K > 3) K = 3;

        const res = Utils.randGrp(K, T, L);


        if (L > 0) {

            for (var i = 0; i < L; i++) {
                const j = map[i];
                const cube = this.setNode(j, this.scene);
                const index = Utils.randArray(res);
                cube.index = index;

            }
        }

        GameMgr.ins.startGame();

    }

    setNode(j, parent): CubeMgr {
        const node = PoolMgr.ins.getNode(j[3], parent);
        const pos = this._GetPos(j[0], j[1], j[2])
        node.setPosition(pos.x, pos.y + 11, pos.z)
        const time = (pos.y - 0.8) * 0.15 + Math.abs(pos.x) * 0.08 + Math.abs(pos.z) * 0.08;
        tween(node).delay(time).to(0.36, { position: pos }).start();
        return node.getComponent(CubeMgr);

    }




    private _GetPos(x: number, y: number, z: number): Vec3 {

        v.x = (x - this.xSize / 2 + 0.5) * this.gridSize;
        v.y = y;
        v.z = (z - this.zSize / 2 + 0.5) * this.gridSize;
        return v.clone();
    }


}

