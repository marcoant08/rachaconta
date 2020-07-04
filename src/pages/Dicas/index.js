import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';

const Dicas = ({ navigation }) => {

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
                setThemerachaconta(value)
                return value;
            }else{
                console.log('erro read asyncstorage')
            }
        } catch (error) {
            console.log('catch: erro read asyncstorage')
        }
    };

    function getThemeRacha(){
        console.log(getStorage('@THEMERACHACONTA'))

    }

    const [themerachaconta, setThemerachaconta] = useState(getThemeRacha());

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, {backgroundColor: themerachaconta || '#2E8B57'}]}>
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
                    <MaterialCommunityIcons style={{padding:15}} name="view-sequential" color={'white'} size={26} />
                </TouchableOpacity>
                <Text style={styles.headerText}>racha conta</Text>
            </View>
            <View style={{flex: 1, borderWidth: 2, borderColor: themerachaconta || '#2E8B57', margin: 7, padding:15, borderRadius: 10}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, {paddingBottom: 15, paddingTop: 10, textAlign: 'center'}]}>Olá! 😄</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>Nosso aplicativo é bem simples e fácil de usar. Veja só:</Text>
                    <Text style={[styles.title, {paddingBottom: 10, paddingTop: 20, textAlign: 'center'}]}>Orçamento Simples</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>Você diz quantos produtos você quer comprar, o preço de tal produto e quantas pessoas consumirão, pronto!</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>A partir desses dados, nosso aplicativo vai te dizer quanto cada uma das pessoas deve pagar. 😉</Text>
                    <Text style={[styles.title, {paddingBottom: 10, paddingTop: 20, textAlign: 'center'}]}>Orçamento Avançado</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>Opção de salvar disponível. 😜</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>Esta função é avançada, mas a gente calcula tudo pra você de maneira rápida e fácil!</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>Nosso aplicativo vai te dizer exatamente quanto cada pessoa vai precisar pagar baseado no consumo próprio dela!</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>(Obs.: Na hora de utilizar essa função, separe o nome das pessoas por vírgula (,) para o aplicativo reconhecer que são pessoas diferentes.)</Text>
                    <Image style={{width: 180, height: 180, alignSelf: 'center', marginTop: 20}} source={require('../../assets/logo.png')} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 27,
        justifyContent: 'center'
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
    fontFamily: 'Ubuntu_500Medium'
  },

  description: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Inter_400Regular',
    textAlign: 'justify'
  },
    
  txtbutton: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular'
  },
  
  });

export default Dicas;