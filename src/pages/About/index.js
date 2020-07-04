import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from '@react-navigation/native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';
import * as MailComposer from 'expo-mail-composer';

const About = ({ navigation }) => {
    
    /* useEffect(()=> {//id teste
        async function initTest() {await setTestDeviceIDAsync('EMULATOR');}
        initTest();
    }, []); */

    useEffect(() => {
        AdMobInterstitial.setAdUnitID('ca-app-pub-7665396611222810/1911735590');
        interstitialAd();
    }, []);

    async function interstitialAd(){
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
    }

    getStorage = async (v) => {
        try {
            const value = await AsyncStorage.getItem(v);
            if (value !== null) {
                console.log('getou',value); 
                setThemerachaconta(value)
                return value;
            }else{
                console.log('erro read asyncstorage')
            }
        } catch (error) {
            console.log('catch erro read asyncstorage')
        }
    };

    function getThemeRacha(){
        console.log(getStorage('@THEMERACHACONTA'))

    }

    const [themerachaconta, setThemerachaconta] = useState(getThemeRacha());

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: 'Sobre o Racha Conta',
            recipients: ['marcoant008@gmail.com']
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, {backgroundColor: themerachaconta || '#2E8B57'}]}>
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
                    <MaterialCommunityIcons style={{padding:15}} name="view-sequential" color={'white'} size={26} />
                </TouchableOpacity>
                <Text style={styles.headerText}>racha conta</Text>
            </View>
            <View style={{flex: 1, borderWidth: 2, borderColor: themerachaconta || '#2E8B57', margin: 7, padding:15, borderRadius: 10}}>
                <ScrollView>
                    <Image style={{width: 180, height: 180, alignSelf: 'center', marginTop: 20}} source={require('../../assets/logo.png')} />
                    <Text style={[styles.title, {paddingBottom: 15, paddingTop: 10, alignSelf: 'center'}]}>Sobre</Text>
                    <Text style={[styles.description, { alignSelf: 'center'}]}>versão</Text>
                    <Text style={[styles.title, { alignSelf: 'center'}]}>1.0</Text>
                </ScrollView>
                <Text style={[styles.headerText, { color: themerachaconta || '#2E8B57' }]}>racha conta</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <RectButton style={[styles.button, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={handleComposeMail}>
                    <MaterialCommunityIcons style={{paddingLeft:30, alignSelf: 'center'}} name="email" color={'white'} size={26} />
                    <Text style={styles.txtbutton}>Contato</Text>
                  </RectButton>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 27,
        justifyContent: 'center',
    },

    header: {
      alignItems: 'center',
      backgroundColor: '#2E8B57',
      flexDirection: 'row',
      height: 55
  },

  headerText: {
    fontSize: 35,
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Piedra_400Regular'
  },
  
  title: {
    fontSize: 25,
    color: '#003E15',
    paddingLeft: 15,
    fontFamily: 'Ubuntu_500Medium'
  },

  description: {
    fontSize: 16,
    color: '#555',
    paddingLeft: 15,
    fontFamily: 'Inter_400Regular'
  },
    
  txtbutton: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular'
  },
  
  button: {
    backgroundColor: '#2E8B57',
    height: 40,
    width: '80%',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  });

export default About;