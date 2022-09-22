/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-21 16:12:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 16:14:54
 * @FilePath: /yangyang/assets/Scripts/ctrl/AdCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, utils } from 'cc';
import { Utils } from '../utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('AdCtrl')
export class AdCtrl extends Component {




    onGo(event: Event, customEventData: string) {
        window.open(customEventData);
        Utils.clearUI(this.node);
    }


}

