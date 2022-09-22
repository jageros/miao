/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-02 10:54:56
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 15:37:12
 * @FilePath: /98KPhysic/assets/src/Global.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Node } from "cc";

export class Global {


    static Debug = false;

    static runtime = false;

    static start = false;

    static isEnd = false;

    static isMobile = false;

    static isCtrl = false;

    static keys = 15;

    static maxLevel = 10;

    static light = false;

    /* store performance settings */

    static high = false;

    static scale = 2;

    static isLoading = false;

    static LoadingRate = 0;

    static jumps = 0;

    static layer: Node[] = null;

    static scene: Node[] = null;

    static useStick = false;

    static en = false;

    static min = -20;

    static max = -8;

    static botLength = 6;

    static startTime = 0;

    static level = 1;



}

