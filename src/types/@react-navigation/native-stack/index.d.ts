import { ComponentType } from "react";
import { ParamListBase } from "@react-navigation/native";

export type NativeStackNavigationProp<
  ParamList extends ParamListBase = ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = {
  navigate: (screen: RouteName, params?: ParamList[RouteName]) => void;
  goBack: () => void;
};

export function createNativeStackNavigator<
  ParamList extends ParamListBase = ParamListBase,
>(): {
  Navigator: ComponentType<any>;
  Screen: ComponentType<any>;
};
