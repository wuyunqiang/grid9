# 功能
react native 版本九宫格抽奖组件，支持Android&iOS <br>
纯js实现 不依赖任何第三方 <br>
按照帧率配置播放动画 任何动画属性都可以更改 同时提供默认配置 <br>
支持抽中跳过逻辑 <br>

# 效果如图
![1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e38f344d3054bb7b5747d4f5ee8572a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=500&h=500&s=2048151&e=gif&f=253&b=f9f0fd)

![2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e07ec131f9b4c3eb5fa394203d2c372~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=500&h=500&s=2278266&e=gif&f=268&b=f9f0fd)
# 使用示例
### 组件配置
```
type IProps = {
    list: List;
    jumpFlashArr?: (string | number)[];
    boxStyle?: ViewStyle;
    renderItem: (props: ItemView) => JSX.Element;
    boxRef: any;
}
```
### api方法
```
type IBox = {
    start: (p: IStartParam) => void;  // 开始抽奖
    updateList: (list: List) => void  // 更新列表数据
};

export type IStartParam = {
    target: number; // 目标的下标
    boxSetting?: Partial<BoxSetting>; // 动画相关配置
    aniDone?: () => void;  // 动画完成的回调
    aniFail?: () => void;  // 失败的回调
};

export interface BoxSetting {
    circle: number; // 需要转的圈数
    fastFrame: number; // 快速旋转的帧率
    slowFrameArray: number[]; // 慢速旋转的帧率
    jumpFlashArr: number[]; // 跳过闪烁动画的数据位置
    lastStageAni?: (  // 最后阶段的动画
        params: AniCallBackParams & {
            stopAnimation: () => void;
        },
    ) => void;
    fastStageAni?: (params: AniCallBackParams) => void; // 快速阶段的动画
    slowStageAni?: (params: AniCallBackParams) => void; // 慢速阶段的动画
}
```
### demo
```
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
            target: 3, // 目标下标
            aniDone: () => { // 成功回调
                Alert.alert('done')
                console.log('test done');
            },
            aniFail: () => { // 失败回调
                Alert.alert('error')
                console.log('test error');
            },
            // 动画相关配置
            boxSetting: {
                // 配置动画跳过已经选中的item
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

export default Demo;
```


# 代码仓库
[react-native-grid9](https://www.npmjs.com/package/react-native-grid9)

[github_react-native-grid9](https://github.com/wuyunqiang/react-native-grid9)