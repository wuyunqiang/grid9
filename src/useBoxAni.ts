import { useState } from 'react';
import { Animated } from 'react-native';
import { fpsControl } from './fpsControl';

export const enum Stage {
    init = 'init',
    fast = 'fast',
    slow = 'slow',
    last = 'last',
}
export interface Item {
    key: string | number;
    boxFlashValue: Animated.Value;
    boxScaleValue: Animated.Value;
    stage?: Stage;
    [index: string]: any;
}

export type AniCallBackParams = {
    itemObj: Item;
    setting: BoxSetting;
};

export interface BoxSetting {
    circle: number; // 转的圈数
    fastFrame: number; // 快速旋转的帧率
    slowFrameArray: number[]; // 慢速旋转的帧率
    jumpFlashArr: number[]; // 跳过闪烁动画的数据位置
    lastStageAni?: (
        params: AniCallBackParams & {
            stopAnimation: () => void;
        },
    ) => void;
    fastStageAni?: (params: AniCallBackParams) => void;
    slowStageAni?: (params: AniCallBackParams) => void;
}

export const useBoxAni = () => {
    const [stage, setStage] = useState(Stage.init);
    const { start, stopLoop } = fpsControl();
    let setting: BoxSetting = {
        circle: 2,
        fastFrame: 7,
        slowFrameArray: [12, 18, 25, 31, 40],
        jumpFlashArr: [-1],
    };

    let aniDoneCallback;

    let totalInd = 0; // 总数
    let preInd = -1; // 上一轮所在位置
    let currInd = 0; // 本轮所在位置
    let frameNum = 0; // 当前所处的渲染帧数
    let slowStageFrameNum = 0; // 慢速阶段初始帧数
    let slowStageIndex = 0; // 慢速阶段位于第几个

    /**
     * 通过设置帧数间隔 调整动画执行频率
     * 例如 每四帧 增加一步
     * */
    let frameCount = 1;
    const getStep = (target: number) => {
        if (frameCount >= target) {
            frameCount = 0;
            return 1;
        }
        frameCount++;
        return 0;
    };

    const clearAni = () => {
        totalInd = 0;
        preInd = -1;
        currInd = 0;
        frameNum = 0;
        slowStageFrameNum = 0;
        slowStageIndex = 0;
        setStage(Stage.init);
    };

    const stopAnimation = () => {
        clearAni();
        aniDoneCallback && aniDoneCallback();
    };

    /**
     * 根据数据源注入动画相关数据
     * @param list
     * @returns
     */
    const getList = list => {
        return list.map((item, index) => {
            return {
                ...item,
                key: item.key || index,
                boxFlashValue: new Animated.Value(0),
                boxScaleValue: new Animated.Value(1),
            };
        });
    };

    const _lastStageAni = ({ itemObj }: { itemObj: Item }) => {
        const { lastStageAni } = setting;
        if (stage !== Stage.last) {
            setStage(Stage.last);
        }
        if (lastStageAni) {
            lastStageAni({
                itemObj,
                setting,
                stopAnimation,
            });
            return;
        }

        Animated.parallel([
            Animated.sequence([
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 1,
                    duration: 550,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1.4,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 0.9,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            stopAnimation();
        });
    };

    const _fastStageAni = ({ itemObj }: { itemObj: Item }) => {
        const { fastStageAni, fastFrame } = setting;
        if (stage !== Stage.fast) {
            setStage(Stage.fast);
        }
        if (fastStageAni) {
            fastStageAni({
                itemObj,
                setting,
            });
            return;
        }

        Animated.parallel([
            Animated.sequence([
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 1,
                    duration: fastFrame * 16 - 10,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1.3,
                    duration: fastFrame * 17,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    const _slowStageAni = ({ itemObj }: { itemObj: Item }) => {
        const { slowStageAni } = setting;
        if (stage !== Stage.slow) {
            setStage(Stage.slow);
        }
        if (slowStageAni) {
            slowStageAni({
                itemObj,
                setting,
            });
            return;
        }
        Animated.parallel([
            Animated.sequence([
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxFlashValue, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(itemObj.boxScaleValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    /***
     * target 目标在数组中的位置
     * arr 数据列表
     */
    const startAnimation = (p: {
        target: number;
        arr: Item[];
        boxSetting?: Partial<BoxSetting>;
        aniDone?: () => void;
        aniFail?: () => void;
    }) => {
        const { target, arr, boxSetting, aniDone, aniFail } = p;
        setting = { ...setting, ...boxSetting };
        aniDoneCallback = aniDone;
        const { circle, fastFrame, slowFrameArray, jumpFlashArr } = setting;

        const list = arr.filter((item, index) => !jumpFlashArr.includes(index));
        const destination = list.findIndex(item => item.key === arr[target].key);

        if (destination < 0) {
            aniFail && aniFail();
            return;
        }

        if (list.length === 1) {
            // 只有最后一个 直接开启最终动画
            _lastStageAni({ itemObj: list[0] });
            return;
        }

        totalInd = circle * list.length + destination;
        let stageImme = Stage.init;

        const loop = () => {
            const remainInd = totalInd - preInd;
            // 快速阶段
            if (remainInd > slowFrameArray.length) {
                stageImme = Stage.fast;
                currInd += getStep(fastFrame);
                slowStageFrameNum = frameNum;
            }
            // 倒计时阶段
            if (remainInd <= slowFrameArray.length) {
                stageImme = Stage.slow;
                if (frameNum - slowStageFrameNum >= slowFrameArray[slowStageIndex]) {
                    slowStageIndex++;
                    currInd = preInd + 1;
                    slowStageFrameNum = frameNum;
                }
            }
            // 最后一个
            if (currInd >= totalInd) {
                stageImme = Stage.last;
            }

            const itemIdx = currInd % list.length;
            const itemObj = list[itemIdx];
            if (preInd !== currInd) {
                preInd = currInd;
                if (stageImme === Stage.last) {
                    stopLoop(); //终止循环
                    _lastStageAni({ itemObj });
                    return;
                }
                if (stageImme === Stage.fast) {
                    _fastStageAni({ itemObj });
                }
                if (stageImme === Stage.slow) {
                    _slowStageAni({ itemObj });
                }
            }
            frameNum++;
        };
        start(loop);
    };

    return { startAnimation, getList, stage };
};

export default useBoxAni;
