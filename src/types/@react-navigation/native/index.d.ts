import * as React from "react";

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
