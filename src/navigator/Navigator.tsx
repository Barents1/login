import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { registerScreen } from '../screens/registerScreen';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { AuthContext } from '../context/AuthContext';
import { LoadingScreen } from '../screens/LoadingScreen';

const Stack = createStackNavigator();

export const Navigator = () => {

  const { status } = useContext(AuthContext);
  if (status === 'checking') return <LoadingScreen />

  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle:{
                backgroundColor: 'white'
            }
        }}
    >

      {
        ( status !== 'authenticated')
        ? (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="registerScreen" component={registerScreen} />
          </>
        )
        :
        (
          <Stack.Screen name="ProtectedScreen" component={ProtectedScreen} />
        )
      }
    </Stack.Navigator>
  );
}