import React from 'react';
import {StatusBar, Text , View} from 'react-native';
import Login from './components/Login';
import Otpscreen from './components/Otp'; 
import Orders from './components/Orders'; 
import Processorder from './components/Processorder'
import Orderhistory from './components/Orderhistory'
import Inventory from './components/Inventory'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'redux';
import { Provider } from 'react-redux'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function MyTabs() {
    return (
      <TopTab.Navigator tabBarOptions={{labelStyle:{fontFamily:'Nunito-Regular',color:'#999'} ,  } } >
        <TopTab.Screen name='New Orders' component={Orders} />
        <TopTab.Screen name="Completed" component={Orderhistory} />
        <TopTab.Screen name="Inventory" component={Inventory} />
      </TopTab.Navigator>
    );
  }

  const Initial =  {
    counter:5
  }

  const reducer = (state = Initial,action)  => {
      switch(action.type)
      {
        case 'INCREASE_COUNTER':
          return{ counter:state.counter+1}
        case 'DECREASE_COUNTER':
          return{counter:state.counter-1 }
      }
      return state
  }

 const store = createStore(reducer)


class Route extends React.Component {

    state = {mobile_no:''};
    
    async componentDidMount()
    {
       
        const mobile = await AsyncStorage.getItem('mobile')
        this.setState({mobile_no:mobile})
        
        
    }


    render() 
    {
 
        var usertoken = this.state.mobile_no;
        alert(usertoken)

        return(
          <Provider store={store}>
            <NavigationContainer>
             { usertoken == null ? (
                <Stack.Navigator mode="modal" screenOptions={{ headerShown: false,}}>
                  <>
                      <Stack.Screen name="Login" component={Login} />
                      <Stack.Screen name="Home" component={MyTabs} />  
                      <Stack.Screen name="Otpscreen" component={Otpscreen} />   
                      <Stack.Screen name="Processorder" component={Processorder} /> 
                  </>
                </Stack.Navigator>
                ):
                <Stack.Navigator mode="modal" screenOptions={{ headerShown: false,}}>
                  <>
                      <Stack.Screen name="Home" component={MyTabs} /> 
                      <Stack.Screen name="Login" component={Login} /> 
                      <Stack.Screen name="Otpscreen" component={Otpscreen} />  
                      <Stack.Screen name="Processorder" component={Processorder} /> 
                  </> 
             </Stack.Navigator>
            }
            </NavigationContainer>
            </Provider>


        )
    }
}

export default Route;