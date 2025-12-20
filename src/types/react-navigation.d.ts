import * as React from "react";

declare module "@react-navigation/native" {
  export type ParamListBase = Record<string, object | undefined>;

  export interface NavigationContainerProps {
    children?: React.ReactNode;
  }

  export const NavigationContainer: React.ComponentType<NavigationContainerProps>;

  export function useNavigation<T = any>(): T;

  export type RouteProp<
    ParamList extends Record<string, object | undefined>,
    RouteName extends keyof ParamList,
  > = {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  };

  export function useRoute<T extends RouteProp<any, any> = RouteProp<any, any>>(): T;
}

declare module "@react-navigation/native-stack" {
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
}
