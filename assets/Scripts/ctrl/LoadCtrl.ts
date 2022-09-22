/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-21 16:08:59
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 16:09:29
 * @FilePath: /yangyang/assets/Scripts/ctrl/LoadCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, Sprite } from 'cc';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('LoadCtrl')
export class LoadCtrl extends Component {

    @property(Sprite)
    load: Sprite = null;


    update(deltaTime: number) {


        this.load.fillRange = Global.LoadingRate;

    }
}

