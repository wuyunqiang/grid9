# react-native-grid9
react native grid9  draw a lottery

```Javascript
 api:

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

export type IStartParam = {
    target: number;
    boxSetting?: Partial<BoxSetting>;
    aniDone?: () => void;
    aniFail?: () => void;
};

export type List = { key: string | number; [index: string]: any }[];


 start: (p: IStartParam) => void;
 updateList: (list: List) => void;


```
效果如下：
![all](https://github.com/wuyunqiang/react-native-grid9/blob/main/assets/all.gif)
![done](https://github.com/wuyunqiang/react-native-grid9/blob/main/assets/done.gif)


demo:

```Javascript
function Demo() {
    const list = [
        { key: 1, done: false },
        { key: 2, done: true },
        { key: 3, done: false },
        { key: 4, done: false },
        { key: 5, done: false },
        { key: 6, done: false },
        { key: 7, done: true },
        { key: 8, done: false },
        { key: 9, done: false },
    ];

    const renderItem = (props: ItemView) => {
        return (
            <View style={styles.item}>
                <Animated.View
                    style={[
                        styles.itemInner,
                        {
                            transform: [
                                {
                                    scale: props.boxScaleValue,
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.itemContent}>
                        <Text style={styles.text}>{!props.done ? props.key : `done`}</Text>
                    </View>
                    <Animated.View
                        style={[
                            styles.itemContent,
                            styles.itemFlash,
                            {
                                zIndex: 100,
                                opacity: props.boxFlashValue,
                            },
                        ]}
                    ></Animated.View>
                </Animated.View>
            </View>
        );
    };

    const boxRef = useRef<IBox>();

    const onClick = () => {
        if (!boxRef.current) {
            return;
        }
        boxRef.current.start({
            target: 3,
            aniDone: () => {
                console.log('test done');
            },
            aniFail: () => {
                console.log('test error');
            },
            boxSetting: {
                jumpFlashArr: list
                    .map((item, index) => {
                        if (item.done) {
                            return index;
                        }
                        return -1;
                    })
                    .filter(item => item > -1),
            },
        });
    };
    return (
        <View style={styles.container}>
            <Grid9 list={list} renderItem={renderItem} boxRef={boxRef} />
            <TouchableOpacity onPress={onClick}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>抽奖</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
```
