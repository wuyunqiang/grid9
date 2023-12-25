import { Animated, View } from "react-native";
import { Stage } from "./useBoxAni";

export interface Item {
    key: string | number;
    boxFlashValue: Animated.Value;
    boxScaleValue: Animated.Value;
    stage?: Stage;
    [index: string]: any;
}


export type ItemView = Item & {
        line: number;
        destId: string;
        index: number;
        listItemRef: React.MutableRefObject<React.MutableRefObject<View>[]>;
    };


