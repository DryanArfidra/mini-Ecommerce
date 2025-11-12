import { NavigatorScreenParams } from '@react-navigation/native';

export type RootParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: { userId: string };
  Tabs: NavigatorScreenParams<any>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootParamList {}
  }
}
