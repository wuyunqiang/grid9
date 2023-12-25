import React, { memo, useImperativeHandle, useState } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { ItemView } from './type';
import useBoxAni, { BoxSetting, type Stage } from './useBoxAni';

export const styles = StyleSheet.create({
    box: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 280,
    },
    item: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent:'center',
        height: 75,
        position: 'relative',
        width: 80,
        marginVertical: 5,
        marginHorizontal: 5,
    },
});


export type IStartParam = {
    target: number;
    boxSetting?: Partial<BoxSetting>;
    aniDone?: () => void;
    aniFail?: () => void;
};
export type IBox = {
    start: (p: IStartParam) => void;
    updateList: (list: List) => void
};
export type BoxRef = React.MutableRefObject<IBox>;
export type List = { key: string | number; [index: string]: any }[];
export type IProps = {
    list: List;
    jumpFlashArr?: (string | number)[];
    boxStyle?: ViewStyle;
    renderItem: (props: ItemView) => JSX.Element;
    boxRef: any;
};
const Box = (props: IProps) => {
    const { list, boxStyle, renderItem, boxRef } = props;
    const { startAnimation, getList, stage } = useBoxAni();
    const listData = getList(list) as ItemView[];
    const [listView, setListView] = useState(listData);

    useImperativeHandle(boxRef, () => ({
        start: (p: IStartParam) =>
            startAnimation({ ...p, arr: listView }),
        updateList:(list: List)=>{
            setListView(getList(list))
        }
    }));

    return (
        <View style={[styles.box, boxStyle]}>
            {listView.map((item, index) => {
                return renderItem({ ...item, stage, index });
            })}
        </View>
    );
};

export default memo(Box);
