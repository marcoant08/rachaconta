import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MinhasContas from './pages/MinhasContas';
import NovaConta from './pages/NovaConta';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Piedra_400Regular } from '@expo-google-fonts/piedra';
import { Ubuntu_500Medium, useFonts } from '@expo-google-fonts/ubuntu';
import { AppLoading } from 'expo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import About from './pages/About';
import Themes from './pages/Themes';
import Dicas from './pages/Dicas';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

    Tabs = () => {
    const [fontsLoaded] = useFonts({
        Inter_400Regular, Piedra_400Regular, Ubuntu_500Medium
    })

    if(!fontsLoaded){
        return <AppLoading />
    }
    
    return (
    <Tab.Navigator 
        initialRouteName="barra"
        activeColor="#000"
        inactiveColor="#ddd"
        barStyle={{ 
            backgroundColor: '#fff',
            height: 65,
            justifyContent: 'center',
            alignContent: 'center'
        }} >
        <Tab.Screen 
            name="NovaConta" 
            component={NovaConta} 
            options={{
                tabBarLabel: 'Nova Conta',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="cash-usd" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen 
            name="MinhasContas" 
            component={MinhasContas} 
            options={{
                tabBarLabel: 'Minhas Contas',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="file-document-outline" color={color} size={26} />
                ),
            }}
        />
    </Tab.Navigator>
    )
}

function MyDrawer() {
    return (
        <Drawer.Navigator 
            drawerStyle={{
                color: '#fff',
                width: 240,
            }}
            initialRouteName={Tabs}
            
            drawerType='back' >
          <Drawer.Screen name="🏠 Página Inicial" component={Tabs}  />
          <Drawer.Screen name="📲 Tema" component={Themes} />
          <Drawer.Screen name="🗒️ Dicas" component={Dicas} />
          <Drawer.Screen name="💟 Avaliar App" component={About} />
          <Drawer.Screen name="ℹ️ Sobre" component={About} />
        </Drawer.Navigator>
    );
  }

const Routes = () => {
    useEffect(()=> {//id teste
        async function initTest() {await setTestDeviceIDAsync('EMULATOR');}
        initTest();
    }, []);

    return (
        <>
        <NavigationContainer>
            <Stack.Navigator headerMode="none" screenOptions={{ cardStyle: {backgroundColor: '#f0f0f5'} }} >
                <Tab.Screen name="MyDrawer" component={MyDrawer} />
            </Stack.Navigator>
        </NavigationContainer>
        <AdMobBanner
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-7665396611222810/7140845694"
            servePersonalizedAds 
            onDidFailToReceiveAdWithError={(err) => console.log(err)} 
        />
       </>
    );
};

export default Routes;