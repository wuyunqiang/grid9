import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Alert } from 'react-native';
import Grid9, { BoxRef, IBox } from '../src/index';
import { ItemView } from '../src/type';
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    item: {
        backgroundColor: '#F72B2B',
        alignItems: 'center',
        justifyContent: 'center',
        height: 75,
        position: 'relative',
        width: 80,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    itemInner: {
        backgroundColor: '#5E5FFF',
        width: 60,
        height: 60,
    },
    itemFlash: {
        backgroundColor: '#6AAFFF',
    },
    itemContent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        borderRadius: 28,
        backgroundColor: 'pink',
        width: 240,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#B34111',
        textAlign: 'center',
        fontFamily: 'PingFang SC',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '400',
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
});

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
                Alert.alert('done')
                console.log('test done');
            },
            aniFail: () => {
                Alert.alert('error')
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

export default Demo;
