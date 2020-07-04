import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, AsyncStorage, Animated, Alert, Clipboard} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { ScrollView, FlatList, RectButton } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import * as Animatable from 'react-native-animatable';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';

const MinhasContas = ({ navigation }) => {

    const [themerachaconta, setThemerachaconta] = useState('');
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const modalrefOptions = useRef(null);
    const [contas, setContas] = useState([]); 
    const [auxrefresh, setAuxrefresh] = useState(0);
    const [selected, setSelected] = useState(0);
    const [contaDetail, setContaDetail] = useState([]); 
    const [showDetails, setShowDetails] = useState(false);
    const [orcs, setOrcs] =  useState([]);
    const [todos, setTodos] = useState([]);
    const [txt, setTxt] = useState();

    /* useEffect(()=> {//id teste
        async function initTest() {await setTestDeviceIDAsync('EMULATOR');}
        initTest();
    }, []); */

    useEffect(() => {
        async function loadContas () {
          const contasStorage = await AsyncStorage.getItem('@rachaconta:contas');
  
          if(contasStorage) {
            setContas(JSON.parse(contasStorage));
          }
          console.log('carregou contas')
        }
        
        async function loadTheme () {
            const tm = await AsyncStorage.getItem('@THEMERACHACONTA');
    
            if(tm) {
              setThemerachaconta(tm);
            }
            console.log('carregou tema')
          }
  
        loadContas();
        loadTheme();
      }, [auxrefresh]);
  
      useEffect(() => {
        async function saveContas () {
          await AsyncStorage.setItem('@rachaconta:contas', JSON.stringify(contas))
          console.log('gravou')
        }
  
        saveContas();
      }, [contas]);
  

    
    useEffect(() => {
        AdMobInterstitial.setAdUnitID('ca-app-pub-7665396611222810/4308692430');
        //interstitialAd();
    }, []);

    async function interstitialAd(){
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
    }

    function onOpenOptions () {
        modalrefOptions.current?.open();
    }
  
    function onCloseOptions () {
        modalrefOptions.current?.close();
    }
  
    function handleOptions (index) {
        setSelected(index);
        onOpenOptions();
    }

    function refresh () {
        setAuxrefresh(auxrefresh + 1);
    }

    function excl () {
        const aux1 = contas[selected];

        const aux2 = contas.filter(item => !(item.nome === aux1.nome && item.data === aux1.data));

        setContas(aux2);
        onCloseOptions();
        Alert.alert('Orçamento excluído.')
    }

    function details (index) {
        interstitialAd();
        setSelected(index);
        setOrcs(orgOrcs(contas[index].orc))
        setContaDetail(contas[index]);
        setShowDetails(true);
        organizarTodos(contas[index]);
        gerarTxt(contas[index]);
    }

    const copyToClipboard = () => {
        Clipboard.setString(txt);
        Alert.alert('O texto foi copiado!');
      }
  
    function gerarTxt(a){
        const arrei = a.orc;
        console.log(arrei[0])
        console.log(arrei[1])
        console.log(arrei[2])
        console.log(arrei[3])

        var str = 'Relatório Racha Conta:\n- '+a.nome+'\n';
  
        for(var i=0; i<arrei[0].length; i++){
          const arr = arrei[3][i].split(",");
          str = str + '\n'+ String(arrei[1][i]) + ' ' + arrei[0][i] + '(s) de R$ ' + String(Number(arrei[2][i]).toFixed(2)) + ' para ' + arrei[3][i] + ';';
          str = str + '\n(R$ ' + String((arrei[1][i] * arrei[2][i]).toFixed(2)) + ')\n';
          str = str + '\n - R$ ' + String((parseFloat(arrei[1][i]) * parseFloat(arrei[2][i]) / arr.length).toFixed(2)) + ' para cada pessoa;\n';
          str = str + '\n*******\n';
        }
        
        str = str + '\nFazendo os cálculos, o valor individual final para cada um é:\n';

        const t = organizarTodos(a);

        for(var i=0; i<t.length; i++){
          str = str + '- ' + t[i][0] + ': R$ ' + String(Number(t[i][1]).toFixed(2)) + '\n'
        }
  
        str = str + '--------\n';
        str = str + 'Valor Total: R$ ' + totalRole();
        console.log(str)

        setTxt(str);
        return str;
      }
  
    function orgOrcs (arr) {
        var aux = [];
        
        for(var i=0; i<arr[0].length; i++) aux.push([arr[0][i], arr[1][i], arr[2][i], arr[3][i]]);

        return aux;
    }

    function organizarTodos (arr) {
        var str = '&';
        /* console.log(arr.orc[0])
        console.log(arr.orc[1])
        console.log(arr.orc[2])
        console.log(arr.orc[3]) */

        arr.orc[3].map(p => str = str + ',' + p)
        str = str.replace('&,','')
        str = str.replace(/&/gi, '');
        str = str.replace(/ /gi, '');
  
        const aux = str.split(",");
  
        const semi = aux.reduce((unico, item) => {
            return unico.includes(item) ? unico : [...unico, item]
        }, []);

        var precotodos = [...Array(semi.length)]
        for(var i=0; i < precotodos.length; i++){
          precotodos[i] = 0;
        }
        semi.map((t, i) => (
            arr.orc[3].map((p, j) => (
                p.includes(t) && (precotodos[i] = precotodos[i] + ((parseFloat(arr.orc[1][j]) * parseFloat(arr.orc[2][j])) / quantpessoas(arr.orc[3][j]))) 
            ))
        ))
        //console.log(precotodos)
        //console.log(semi)
        var final = [...Array(semi.length)];

        for(var i=0; i < final.length; i++){
            final[i] = [semi[i], precotodos[i]]
        }

        //console.log(final)

        setTodos(final);

        return final;
    }
  
    function quantpessoas (p) {
        var str = p.replace(/ /gi, '');
        const arr = str.split(",");
  
        return arr.length;
    }

    function totalRole () {
        var aux = 0;

        todos.map(p => aux = aux + parseFloat(p[1]));

        return aux.toFixed(2);
    }
    
    function renderDetails () {
        return (
            <>
            <Text style={[styles.title, {textAlign: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: themerachaconta || '#2E8B57'}]}>{contaDetail.nome}</Text>
            <ScrollView>
            {
                orcs.map((item, i) => (
                    <View key={i} style={{borderBottomWidth: 0.5, paddingBottom: 20, borderBottomColor: themerachaconta || '#2E8B57'}}>
                        <Text style={[styles.description, {textAlign: 'center', padding: 15, color: themerachaconta || '#2E8B57'}]}>Conta número {i+1}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[styles.description, {textAlign: 'center'}]}>O preço de cada {item[0]} foi: </Text>
                            <Text style={[styles.title, {textAlign: 'center'}]}>R$ {Number(item[2]).toFixed(2)}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[styles.description, {textAlign: 'center'}]}>Quantidade de {item[0]}(s): </Text>
                            <Text style={[styles.title, {textAlign: 'center'}]}>{item[1]}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[styles.description, {textAlign: 'center'}]}>Total: </Text>
                            <Text style={[styles.title, {textAlign: 'center'}]}>R$ {(Number(item[1])*Number(item[2])).toFixed(2)}</Text>
                        </View>
                        <Text style={[styles.description, {textAlign: 'center'}]}>Integrantes desse grupo:</Text>
                        <Text style={[styles.title, {textAlign: 'center'}]}>{item[3]}</Text>
                        <Text style={[styles.description, {textAlign: 'center'}]}>Preço individual para esse grupo:</Text>
                        <Text style={[styles.title, {textAlign: 'center'}]}>R$ {((Number(item[1]) * Number(item[2])) / quantpessoas(item[3])).toFixed(2)}</Text>
                    </View>
                ))
            }
            <View style={{alignItems: 'center'}}>
                <Text style={[styles.description, {textAlign: 'center', padding: 15, color: themerachaconta || '#2E8B57'}]}>Pagamento Individual Completo</Text>
                <Text style={[styles.description, {textAlign: 'center'}]}>Um total de {todos.length} pessoas estão participando do role.</Text>
                <Text style={[styles.description, {textAlign: 'center'}]}>Aqui está o valor que cada um deve pagar:</Text>
                {
                    todos.map(t => (
                        <Text key={t} style={[styles.title, {textAlign: 'center'}]}>{t[0]}: R$ {Number(t[1]).toFixed(2)}</Text>
                    ))
                }
                    <Text style={[styles.description, {textAlign: 'center', margin: 25, color: themerachaconta || '#2E8B57', width: '100%', borderTopColor: themerachaconta || '#2E8B57', borderTopWidth: 0.5}]}>Valor total do role</Text>
                <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row' }}>
                    <Text style={[styles.description, {textAlign: 'center'}]}>Esse role custou</Text>
                    <Text style={styles.title}>R$ {totalRole()}</Text>
                </View>
            </View>
            </ScrollView>
            </>
        )
    }

    function voltar () {
        setShowDetails(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[
                styles.header, 
            {
                height: scrollY.interpolate({
                    inputRange: [10, 160, 185],
                    outputRange: [55, 20, 0],
                    extrapolate: 'clamp'
                }),
                opacity: scrollY.interpolate({
                    inputRange: [1, 75, 170],
                    outputRange: [1, 1, 0],
                    extrapolate: 'clamp'
                }),
                backgroundColor: themerachaconta || '#2E8B57'
            }]}>
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
                    <MaterialCommunityIcons style={{padding:15}} name="view-sequential" color={'white'} size={26} />
                </TouchableOpacity>
                <Text style={styles.headerText}>racha conta</Text>
            </Animated.View>
            {
                showDetails ? 
                    <>
                    <Animatable.View style={{flex: 1}} animation={'fadeInDown'} duration={400}>
                        { renderDetails() }
                        
                    </Animatable.View >
                    <Animatable.View style={{flexDirection: 'row', justifyContent: 'space-around'}} animation={'fadeInUp'} duration={200}>
                        <RectButton style={[styles.button, {width: '45%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={copyToClipboard}>
                            <Text style={styles.txtbutton}>Copiar Texto</Text>
                        </RectButton>
                        <RectButton style={[styles.button, {width: '45%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={voltar}>
                            <Text style={styles.txtbutton}>Voltar</Text>
                        </RectButton>
                    </Animatable.View>
                   
                    </>
                :
                    <>
                        <View style={{ height: 40, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                    {
                        contas.length > 1 ? 
                    <Text style={styles.title}>💸 Você tem {contas.length} orçamentos salvos.</Text>
                        :
                            contas.length == 1 ?
                                <Text style={styles.title}>💸 Você tem {contas.length} orçamento salvo.</Text>
                            :
                                <Text style={styles.title}>💸 Você não tem orçamentos salvos.</Text>
                    }
                    <TouchableOpacity onPress={refresh}>
                        <MaterialCommunityIcons style={{padding:0}} name="refresh" color={'black'} size={26} />
                    </TouchableOpacity>
                </View>
                <FlatList 
                    showsHorizontalScrollIndicator={false}
                    data={contas}
                    keyExtractor={item => item.nome}
                    renderItem={({index, item}) => (
                        <Animatable.View style={styles.box} animation={'lightSpeedIn'} duration={400}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => details(index)}>
                                <Text style={styles.description}>{item.nome}</Text>
                                <Text style={styles.data}>{item.data}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleOptions(index)}>
                                <MaterialCommunityIcons style={{padding:0}} name="trash-can-outline" color={'black'} size={26} />
                            </TouchableOpacity>
                        </Animatable.View>
                        )}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: { y: scrollY }
                        },
                    }], { useNativeDriver: false })}
                />
                <Modalize
                ref={modalrefOptions}
                snapPoint={250}
                modalHeight={550}
                >
                    <Text style={[styles.headerText, {color: themerachaconta || '#2E8B57'}]}>racha conta</Text>
                    <View style={{flex: 1}}>
                        <Text style={[styles.title, {padding: 25, textAlign: 'center'}]}>Tem certeza disso?</Text>
                        <RectButton style={[styles.button, { backgroundColor: 'red', flexDirection: 'row' }]} onPress={excl}>
                            <Text style={styles.txtbutton}>Excluir</Text>
                            <MaterialCommunityIcons style={{padding:25}} name="trash-can-outline" color={'white'} size={26} />
                        </RectButton>
                    </View>
                </Modalize>
            </>
            }
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

  box: {
    backgroundColor: '#fff',
    borderRadius: 7,
    height: 100,
    margin: 7,
    padding: 20,
    fontFamily: 'Inter_400Regular',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
},

  headerText: {
    fontSize: 35,
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Piedra_400Regular'
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
  },

  title: {
    fontSize: 20,
    color: '#003E15',
    padding: 7,
    fontFamily: 'Ubuntu_500Medium'
  },

  description: {
    fontSize: 17,
    color: '#555',
    padding: 7,
    fontFamily: 'Inter_400Regular'
  },
    
  data: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Inter_400Regular',
    textAlign: 'justify',
    paddingTop: 15
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

export default MinhasContas;