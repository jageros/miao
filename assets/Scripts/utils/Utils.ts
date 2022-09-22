/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-03 14:33:33
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 16:12:04
 * @FilePath: /98KPhysic/assets/src/utils/Utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Sprite, SpriteFrame, Texture2D, ImageAsset, Node, UIOpacity, tween, UIMeshRenderer, Layers, Vec3, easing, sys } from 'cc';
import ResMgr from '../manager/ResMgr';

export type rez = {
    index?: number,
    amount?: number
}

export function save(key: string, val: any) {
    sys.localStorage.setItem(key, val || '')
}

export function load(key: string) {
    return sys.localStorage.getItem(key) || ''
}

const ONE = new Vec3(1, 1, 1);

const ZERO = new Vec3(0, 0, 0);

export class Utils {


    static randGrp(kinds: number, types: number, amount: number, size = 3) {

        /* amount should be devied by size in this case */
        const splices = Math.floor(amount / size);

        let res = [];

        let total = 0;

        const length = kinds * types;

        for (var i = 0; i < types; i++) {

            for (var k = 0; k < kinds; k++) {

                const a = (i == types - 1 && k == kinds - 1) ? (splices - total) : Math.round(this.randBetween(0.65, 1.35) * splices / length);
                res[i + k * types] = { index: (k) * 10 + i, amount: a * 3 } as rez;
                total += a;
            }

        }

        return res;

    }

    static isEn(): boolean {
        return (navigator.language.indexOf("zh") != -1) ? false : true;
    }

    static randArray(a: rez[]) {

        const L = a.length;

        const i = Math.floor(Math.random() * L);

        const r = a[i];

        r.amount--;

        if (r.amount <= 0) {
            a.splice(i, 1);
        }

        return r.index;

    }

    static clearFromArray(key, array) {
        const l = array.length;
        for (var i = 0; i < l; i++) {
            if (array[i] == key) {
                array.splice(i, 1);
                break;
            }
        }
    }



    static randBetween(min: number, max: number) {
        return min + Math.random() * (max - min);
    }


    /**
     * @description: Clear UI node, and realse sprite's memory based on needs
     * @param {Node} node
     * @param {*} clear
     * @return {*}
     */
    static clearUI(node: Node, clear = true) {

        if (clear) {
            const sp = node.getComponentsInChildren(Sprite);
            sp.forEach((v) => {
                /* Release mem */
                Utils.clearSprite(v);
            })
        }

        node.destroy();

    }
    static fadeIn(node: Node, dura = 0.5) {
        node.setScale(Vec3.ZERO);
        tween(node).to(dura, { scale: ONE }, { easing: 'elasticIn' }).start();

    }
    static fadeOut(node: Node, cb?) {
        tween(node).to(0.5, { scale: ZERO }, { easing: 'elasticOut' }).call(() => {
            cb && cb();
        }).start();
    }

    /**
     * @description: Clear sprite and release memory
     * @param {Sprite} sp
     * @return {*}
     */
    static clearSprite(sp: Sprite) {
        const sf = sp.spriteFrame as SpriteFrame;
        if (sf) {
            sp.spriteFrame = null;
            if (sf && sf.refCount > 0) {
                sf.decRef();
                const tex = sf.texture as Texture2D;

                this.clearTex(tex)

            }
        } else {
            console.log("sf not exist")
        }
    }

    /**
     * @description: Clear texture2D and release momory
     * @param {Texture2D} tex
     * @return {*}
     */
    static clearTex(tex: Texture2D) {

        if (tex && tex.refCount > 0) {
            tex.decRef();
            const image = tex.image as ImageAsset;
            if (image && image.refCount > 0) {
                image.decRef();
            }
        } else {

            console.log("tex not exist")

        }
    }

    static convertUI(node: Node, is2D = true) {

        if (is2D) {
            node.addComponent(UIMeshRenderer);

            node.layer = Layers.Enum.UI_2D;

            node.setScale(42, 42, 42)

        } else {
            node.setScale(0.5, 0.5, 0.5)

            node.layer = Layers.Enum.DEFAULT;

            let ui = node.getComponent(UIMeshRenderer);

            ui && ui.destroy();

            let prefab = ResMgr.ins.getPrefab("")
        }
    }





}

