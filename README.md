# grid9
react native grid9  draw a lottery

效果如下：
![all](./assets/all.gif)
![done](./assets/done.gif)


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
