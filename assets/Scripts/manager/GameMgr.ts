/*
 * @Descripttion: 
 * @version: 
 * @Author: iwae
 * @Date: 2022-09-18 23:18:17
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 15:30:06
 */
import { _decorator, EventTouch, Touch, CameraComponent, MeshRenderer, geometry, Vec2, Vec3, Node, Component, director, Quat, input, Input, quat, EventMouse, sys, tween, AnimationComponent, UI } from 'cc';
import { Clips, Effects, events, ui } from '../enum/Enums';
import { Global } from '../Global';
import { Utils } from '../utils/Utils';
import { ResultView } from '../view/ResultView';
import { AudioMgr } from './AudioMgr';
import { CubeMgr } from './CubeMgr';
import { PoolMgr } from './PoolMgr';
import ResMgr from './ResMgr';

/* ray model hit policy */
const option: geometry.IRayMeshOptions = { mode: geometry.ERaycastMode.CLOSEST, doubleSided: true, distance: 300 };

/* const ray for model hit detect */
const ray: geometry.Ray = new geometry.Ray();
/* temped vectors */
const v2_0 = new Vec2();
const v2_1 = new Vec2();
const v3_0 = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const v3_3 = new Vec3();

const q0 = new Quat();
const q1 = new Quat();


export class GameMgr extends Component {

    private scene: Node = null;
    private shelf: Node = null;

    private sceneCam: CameraComponent = null;

    private mesh: MeshRenderer = null;

    private isDetected = false;

    private meshes: MeshRenderer[] = [];

    private touchID = null;

    private dis = 0;

    private botCubes: Node[] = [];






    private static _ins: GameMgr = null;

    public static get ins() {
        if (!this._ins) {
            this._ins = new GameMgr();
        }

        return this._ins;
    }


    get Rad() {

        return this.scene.position.z;

    }

    set Rad(v) {
        this.scene.setPosition(0, 0, v);
    }



    init(sceneCam: CameraComponent, scene: Node, shelf: Node) {

        this.sceneCam = sceneCam;

        this.scene = scene;

        this.shelf = shelf.getChildByName("shelf");

        this.regEnvents();

    }

    startGame() {

        Global.start = true;

        this.meshes = this.scene.getComponentsInChildren(MeshRenderer);

    }

    regEnvents() {

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
        if (!sys.isMobile) {
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this)
        }

    }

    onMouseWheel(event: EventMouse) {
        let scrollY = event.getScrollY();

        this.scaleDis(scrollY);

    }


    onTouchStart(event?: EventTouch) {
        if (!Global.start) return;


        director.emit(events.catWatch, true);
        const touch = event.touch as Touch;
        touch.getLocation(v2_0);

        if (!this.isDetected) {
            this.sceneCam.screenPointToRay(v2_0.x, v2_0.y, ray);
            this.mesh = this.rayHit();
            if (this.mesh) {
                this.isDetected = true;
                AudioMgr.ins.playSound(Clips.touch);
                touch.getUILocation(v2_1);
                this.showTouch(v2_1);
                this.touchID = touch.getID();
                const mesh = this.mesh;
                this.setMesh(mesh);
            }
        }
    }

    onTouchMove(event?: EventTouch) {
        if (!Global.start) return;

        const touches = event.getAllTouches();
        /* scale radius for mobile multi touch */
        let touch1: Touch;
        let speed = 1;
        if (touches.length > 1) {
            const changedTouches = event.getTouches();

            touch1 = touches[0]

            let touch2: Touch = null!;
            if (changedTouches.length > 1) {
                touch2 = touches[1];
            } else {
                touch1 = event.touch;
                const diffID = touch1.getID();
                for (let i = 0; i < touches.length; i++) {
                    const element = touches[i];
                    if (element.getID() !== diffID) {
                        touch2 = element;
                        break;
                    }
                }
            }
            touch1.getLocation(v2_0);
            touch2.getLocation(v2_1);
            let dis = Vec2.distance(v2_0, v2_1)
            let delta = dis - this.dis;
            this.scaleDis(delta)
            this.dis = dis;
            /* slow down rotate speed for better exp */
            speed = 0.1
        } else {
            touch1 = event.touch;
        }

        touch1.getDelta(v2_1);

        const id = touch1.getID();

        /* rotate obj's parent node */
        if (this.touchID) {
            if (id == this.touchID) {
                this.rotateScene(v2_1.multiplyScalar(speed));
            }
        } else {
            this.rotateScene(v2_1.multiplyScalar(speed));
        };

    }

    scaleDis(v) {

        let rad = this.Rad;

        rad += Math.sign(v) * 0.3;

        if (rad < Global.min) rad = Global.min;
        if (rad > Global.max) rad = Global.max;

        this.Rad = rad;

    }

    rotateScene(v: Vec2) {

        // v3_1.set(this.scene.eulerAngles)
        q1.set(this.scene.rotation)

        Quat.rotateY(q1, q1, v.x * 0.01);

        /* slower for better touch */

        Quat.rotateAround(q1, q1, Vec3.RIGHT, -v.y * 0.008);

        this.scene.setRotation(q1);

    }



    onTouchEnd(event?: EventTouch) {
        if (!Global.start) return;

        const touch = event.touch as Touch;
        const id = touch.getID();

        if (this.isDetected) {
            if (id == this.touchID) {
                touch.getLocation(v2_0);
                this.sceneCam.screenPointToRay(v2_0.x, v2_0.y, ray);
                director.emit(events.catWatch, false);
                const mesh = this.mesh;
                const meshLast = this.rayHit();
                this.setMesh(mesh, false);
                if (mesh == meshLast) {
                    this._GetMesh(mesh);
                }
                this.mesh = null;
                this.touchID = null;
                this.isDetected = false;
            }
        } else {
            director.emit(events.catWatch, false);
        }

    }

    /* show touch eff */
    async showTouch(pos) {
        const touch = await ResMgr.ins.getUI(ui.TouchView);

        touch.setWorldPosition(pos.x, pos.y, 0);

        touch.getComponent(AnimationComponent).play();

        this.scheduleOnce(() => {
            PoolMgr.ins.putNode(touch);
        }, 1)

    }

    /* set mesh's color less brightness */
    setMesh(mesh, dark = true) {
        mesh.setInstancedAttribute('a_dark', [dark ? 0.75 : 0]);
    }


    private _GetMesh(mesh: MeshRenderer) {
        const l = this.meshes.length;
        for (var i = 0; i < l; i++) {
            if (this.meshes[i] == mesh) {
                this.meshes.splice(i, 1);
                break;
            }
        }
        const node = mesh.node;
        this.checkBotCubes(node);
        if (l == 1) {
            this.GameResult(true);
        }

    }


    checkBotCubes(node: Node) {

        const cubes = this.botCubes;
        const L = cubes.length;
        /* check the length of current cubes, if it aboves 2, do the merge check */
        if (L >= 2) {
            const indexV = node.getComponent(CubeMgr).index;
            const cubeMap: Node[] = [];
            for (var i = 0; i < L; i++) {
                const index = cubes[i].getComponent(CubeMgr).index;
                if (index == indexV) cubeMap.push(cubes[i]);
            }

            const mapL = cubeMap.length;
            if (mapL == 2) {
                Utils.clearFromArray(cubeMap[1], cubes);
                Utils.clearFromArray(cubeMap[0], cubes);
                /* set Node as a child of the shelf,then do the merge animation */
                q0.set(node.worldRotation);
                v3_0.set(node.worldPosition);
                node.parent = this.shelf;
                node.setWorldPosition(v3_0);
                node.setRotation(q0);
                cubeMap.push(node);
                this.mergeAction(cubeMap, L)
                /* refreshBot */
                this.refreshBot();
                //test;

            } else {
                if (L >= Global.botLength - 1) {
                    this.GameResult(false);
                }
                this.moveToBot(node, L)



            }
        } else {
            this.moveToBot(node, L)

        }


    }

    moveToBot(node, v) {

        this.botCubes.push(node);
        q0.set(node.worldRotation);
        v3_0.set(node.worldPosition);
        node.parent = this.shelf;
        node.setWorldPosition(v3_0);
        node.setRotation(q0);
        v3_0.set(-3 + v, 0, 0);
        v3_1.set(-15, 0, 0);
        tween(node).to(0.35, { position: v3_0, eulerAngles: v3_1 }).start();
    }


    refreshBot() {
        if (this.botCubes.length > 0) {
            this.botCubes.forEach((v, i) => {
                v3_0.set(-3 + i, 0, 0);
                tween(v).to(0.25, { position: v3_0 }).start();
            }
            )
        }

    }

    mergeAction(nodes: Node[], L: number) {
        console.log("curr cubeMap==", nodes)

        nodes.forEach((v, i) => {
            const x = L + i - 5
            // v3_0.set(x, 0, 0);
            v3_1.set(-15, 0, 0);
            /* closer to the screen */
            v3_2.set(L - 4, 0.8, 3);
            v3_3.set(0, 360, 0);

            tween(v).
                to(0.35, { position: new Vec3(x, 0, 0), eulerAngles: v3_1 }).delay(0.15).
                to(0.35, { position: v3_2, eulerAngles: v3_3 }).
                call(() => {
                    v.setRotationFromEuler(0, 0, 0);
                    PoolMgr.ins.putNode(v);
                    if (i == 2) {
                        const eff = PoolMgr.ins.getNode(Effects.Star, this.shelf);
                        /* avoid loads stacking */
                        this.scheduleOnce(() => {
                            AudioMgr.ins.playSound(Clips.merge);
                        })
                        eff.setPosition(v3_2);
                        this.scheduleOnce(() => {
                            PoolMgr.ins.putNode(eff);
                        }, 1.1);
                    }
                }
                ).start();
        }
        )

    }



    async GameResult(result) {
        Global.start = false;
        const view = await ResMgr.ins.getUI(ui.ResultView);
        this.clearScene();
        this.scheduleOnce(() => {
            this.clearBot();
            view.getComponent(ResultView).init(result);
        }, 0.7);
    }
    clearScene() {
        const cubeL = this.meshes.length;
        if (cubeL > 0) {
            for (var i = this.meshes.length - 1; i >= 0; i--) {
                const cube = this.meshes[0].node;
                cube && PoolMgr.ins.putNode(cube);
            }
        }
        this.scene.getChildByName("cubes").destroyAllChildren();
        this.meshes.length = 0;

    }

    clearBot() {
        const cubeL = this.botCubes.length;
        if (cubeL > 0) {
            for (var i = this.botCubes.length - 1; i >= 0; i--) {
                const cube = this.botCubes[0];
                cube.setRotationFromEuler(0, 0, 0);
                cube && PoolMgr.ins.putNode(cube);
            }
        }
        this.botCubes.length = 0;
        this.shelf.destroyAllChildren();
    }


    /* check model hit */
    rayHit() {
        let distance = 300;
        let mesh: MeshRenderer
        for (let v of this.meshes) {
            let dis = geometry.intersect.rayModel(ray, v.model, option);
            if (dis && dis < distance) {
                distance = dis;
                mesh = v;
            }
        }
        return mesh;
    }

}




