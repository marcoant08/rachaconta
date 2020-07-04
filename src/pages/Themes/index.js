import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Dimensions, AsyncStorage, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from '@react-navigation/native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';

const Themes = ({ navigation }) => {
    const [rewarded, setRewarded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const windowHeight = Dimensions.get('window').height;

    /* useEffect(()=> {//id teste
        async function initTest() {await setTestDeviceIDAsync('EMULATOR');}
        initTest();
    }, []);
 */
    setStorage = async (key, val) => {
        try {
        await AsyncStorage.setItem(
            key,
            val
        );
        console.log(key, ' alterado para ', val);
        } catch (error) {
        // Error saving data
        console.log('erro save asyncstorage')
        }
    };

    getStorage = async (v) => {
        try {
            const value = await AsyncStorage.getItem(v);
            if (value !== null) {
                // We have data!!
                console.log('getou',value); 
                setThemerachaconta(value)
                return value;
            }else{
                console.log('erro read asyncstorage')
            }
        } catch (error) {
        // Error retrieving data
        }
    };

    function setThemeRacha(v){
        setStorage('@THEMERACHACONTA', v)
        setThemerachaconta(getThemeRacha());
    }

    function getThemeRacha(){
        console.log(getStorage('@THEMERACHACONTA'))
        //Alert.alert('Reinicie o aplicativo para aplicar o tema em todas as telas')
    }

    function bt (v){
        setThemeRacha(v)
        //getThemeRacha();
        Alert.alert('Reinicie o aplicativo para aplicar o tema em todas as telas')
    }

    const [themerachaconta, setThemerachaconta] = useState(getThemeRacha());
    
    useEffect(() => {
        AdMobRewarded.setAdUnitID('ca-app-pub-7665396611222810/8688395923');
    }, [])

    
    async function rewardAd(){
        setIsLoading(true);
        await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
        setIsLoading(false);
        await AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', () =>  setRewarded(true));
        await AdMobRewarded.showAdAsync();
    }
 
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, {backgroundColor: themerachaconta || '#2E8B57' }]}>
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
                    <MaterialCommunityIcons style={{padding:15}} name="view-sequential" color={'white'} size={26} />
                </TouchableOpacity>
                <Text style={styles.headerText}>racha conta</Text>
            </View>
            <View style={{flex: 1, borderWidth: 2, borderColor: themerachaconta || '#2E8B57' , margin: 7, padding:15, borderRadius: 10}}>
                {
                    rewarded ?
                    <>
                    <Text style={[styles.title, {paddingBottom: 15, alignSelf: 'center'}]}>📲  Escolha um tema:</Text>
                    <ScrollView>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#2E8B57'}]} onPress={() => bt('#2E8B57')}>
                            <Text style={styles.txtbutton}>Verde Padrão</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#87CEFA'}]} onPress={() => bt('#87CEFA')}>
                            <Text style={styles.txtbutton}>Light Sky Blue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#CD5C5C'}]} onPress={() => bt('#CD5C5C')}>
                            <Text style={styles.txtbutton}>Indian Red</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#FFD700'}]} onPress={() => bt('#FFD700')}>
                            <Text style={styles.txtbutton}>Gold</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#27408B'}]} onPress={() => bt('#27408B')}>
                            <Text style={styles.txtbutton}>Royal Blue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#FF1493'}]} onPress={() => bt('#FF1493')}>
                            <Text style={styles.txtbutton}>Deep Pink</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#BF3EFF'}]} onPress={() => bt('#BF3EFF')}>
                            <Text style={styles.txtbutton}>Dark Orchid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#000'}]} onPress={() => bt('#000')}>
                            <Text style={styles.txtbutton}>Black</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#FF8C00'}]} onPress={() => bt('#FF8C00')}>
                            <Text style={styles.txtbutton}>Dark Orange</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#2F4F4F'}]} onPress={() => bt('#2F4F4F')}>
                            <Text style={styles.txtbutton}>Dark Slate Gray</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#CD0000'}]} onPress={() => bt('#CD0000')}>
                            <Text style={styles.txtbutton}>Red</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#66CDAA'}]} onPress={() => bt('#66CDAA')}>
                            <Text style={styles.txtbutton}>Medium Aquamarine</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    </>
                    :
                    <>
                    <View style={{flex: 1, paddingTop: windowHeight/4, alignItems: 'center'}}>
                        <Text style={styles.title}>Olá! 😜</Text>
                        <Text style={[styles.description, {padding: 15, textAlign: 'center'}]}>Você será premiado com a escolha de temas quando assistir o anúncio.</Text>
                        <RectButton style={[styles.button, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={rewardAd}>
                            <MaterialCommunityIcons style={{paddingLeft:30, alignSelf: 'center'}} name="television-play" color={'white'} size={26} />
                            <Text style={styles.txtbutton}>Assistir</Text>
                        </RectButton>
                        {
                            isLoading ? <ActivityIndicator style={{paddingTop: 30}} size="large" color={themerachaconta || '#2E8B57'} /> : <></>
                        }
                    </View>
                    </>
                }
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 27,
        justifyContent: 'center',
        //backgroundColor: '#C1FFC1'
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
    fontFamily: 'Piedra_400Regular',
    //color: '#C1FFC1'
  },
  
  title: {
    fontSize: 25,
    color: '#003E15',
    fontFamily: 'Ubuntu_500Medium'
  },

  description: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Inter_400Regular'
  },
    
  txtbutton: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Ubuntu_500Medium'
  },
  
  button: {
    backgroundColor: '#2E8B57',
    height: 55,
    width: '90%',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  }

  });

export default Themes;