import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateTeamScreen from '../screens/setup/CreateTeamScreen';
import TeamScreen from '../screens/TeamScreen';
import JoinTeamScreen from '../screens/setup/JoinTeamScreen';
import { StateContext } from '../utils/Context/StateContext';
import CameraScreen from '../screens/CameraScreen';
import SavePostScreen from '../screens/SavePostScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import WelcomeScreen from '../screens/setup/WelcomeScreen';
import MainHeader from '../components/MainHeader';
import TeamSettingsScreen from '../screens/TeamSettingsScreen';
import SecondaryHeader from '../components/SecondaryHeader';
import SuccessJoinOrCreateScreen from '../screens/setup/SuccessJoinOrCreateScreen';

const navigationScreenOptions = {
  headerTintColor: 'white',
  hideWhenScrolling: true,
  headerBackVisible: false,
  headerTransparent: true,
};

export default function Route() {
  const Stack = createNativeStackNavigator();
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navigationScreenOptions}>
        {!user ? (
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{
              title: null,
            }}
          />
        ) : !team ? (
          <>
            <Stack.Screen
              name="JoinTeamScreen"
              component={JoinTeamScreen}
              options={{ title: 'Join a team', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="CreateTeamScreen"
              component={CreateTeamScreen}
              options={{ title: 'Create a team', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="SuccessJoinOrCreateScreen"
              component={SuccessJoinOrCreateScreen}
              options={{ title: null }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="TeamScreen"
              component={TeamScreen}
              options={({ navigation }) => ({
                header: () => <MainHeader navigation={navigation} />,
              })}
            />
            <Stack.Screen
              name="CameraScreen"
              component={CameraScreen}
              options={{
                title: null,
              }}
            />
            <Stack.Screen
              name="SavePostScreen"
              component={SavePostScreen}
              options={{ title: null, headerBackVisible: true }}
            />
            <Stack.Screen
              name="UserSettingsScreen"
              component={UserSettingsScreen}
              options={({ navigation }) => ({
                header: () => <SecondaryHeader navigation={navigation} title="Settings" />,
              })}
            />
            <Stack.Screen
              name="TeamSettingsScreen"
              component={TeamSettingsScreen}
              options={({ navigation }) => ({
                header: () => <SecondaryHeader navigation={navigation} title="Team Space" />,
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
