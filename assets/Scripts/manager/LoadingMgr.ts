/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-02 23:32:17
 * @LastEditors: iwae
 * @LastEditTime: 2022-09-18 21:01:29
 * @FilePath: /98KPhysic/assets/src/manager/LoadingMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, UITransformComponent, director } from 'cc';
import { AssetType, events, ob, ui } from '../enum/Enums';
import { Global } from '../Global';
import { Main } from '../Main';
import { Utils } from '../utils/Utils';
import ResMgr from './ResMgr';
const { ccclass, property } = _decorator;

const loadingWidth = 1268;

@ccclass('LoadingMgr')
export class LoadingMgr extends Component {

    @property(UITransformComponent)
    loading: UITransformComponent = null;


    async onEnable() {

        Global.Debug = true;
        Global.isLoading = true;

        await ResMgr.ins.loadBundle(1, 0.02);

        await ResMgr.ins.loadRes(1, AssetType.Prefab, 0.95);

        await ResMgr.ins.loadRes(1, AssetType.Sound, 0.05);

        /* load UI */
        await this.loadUI();
  

        this.close();



    }

    async loadUI() {
        const uiNode = await ResMgr.ins.initUi(ui.GameUI);

    }

 

    close() {

        Utils.closeUI(this.node);


    }

    update() {
        if (Global.isLoading) {
            const width = loadingWidth * Global.LoadingRate
            this.loading.width = width;
        }
        // [4]
    }
}

