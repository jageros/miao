/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-02 10:22:44
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-21 15:52:28
 * @FilePath: /98KPhysic/assets/src/enum/Enums.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { AudioClip, JsonAsset, Prefab, SpriteAtlas } from "cc";
import { Global } from "../Global";


export class playerState {

    static isMoving = false;

}

export const ob = {
    Buildings: { name: 'Buildings' },

    Keys: { name: 'Keys' },

    Env: { name: 'Env' },

    Player: { name: 'Player' },

}

export const ui = ({
    HomeView: { name: 'HomeView', layer: 2, clear: true },
    ResultView: { name: 'ResultView', layer: 3, clear: false },
    TouchView: { name: 'TouchView', layer: 4, clear: false },

})

export const events = {
    rollBg: "rollBg",
    catWatch: "catWatch",
    Jump: "jump",
    Toast: "toast",
    Anm: "anm",
}

export default class texts {



}

export const Effects = {
    Star: "StarEffect",

}
export const Key = {
    Level: "Level",
}


export const Props = {
    Scenes: "Scenes",
    Layers: "Layers",
    Comps: "Components",
    Setting: "Setting",
}

export const Clips = {
    bgm: "bgm",
    btn: "btn",
    touch: "touch",
    gold: "gold",
    reward: "reward",
    merge: "merge",
    win: "win",
    lose: "lose",
}

/**
 */
export const AssetType = ({
    Prefab: { type: Prefab, path: "Preload/Prefabs/" },
    Json: { type: JsonAsset, path: "Preload/Jsons/" },
    Sound: { type: AudioClip, path: "Preload/Clips/" },
    Atlas: { type: SpriteAtlas, path: "Preload/Atlas/" }
})




