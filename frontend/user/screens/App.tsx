import React from 'react'
// import Home from './screens/Home'
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import SwimBooking_page from './screens/SwimBooking_page';
// import SwimTime_page from './screens/SwimTime_page';
// import SwimmingPool_payment from './screens/SwimmingPool_payment';
// import Swimming_page from './screens/Swimming_page'
// import SwimmingPool_payment from './screens/SwimmingPool_payment'

const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown :false}}
        />
        <Stack.Screen name="SwimBooking" component={SwimBooking_page} options={{headerShown : false}} />
        <Stack.Screen name="SwimTime" component={SwimTime_page} options={{headerShown : false}} />
        <Stack.Screen name="SwimPayment" component={SwimmingPool_payment} options={{headerShown : false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App