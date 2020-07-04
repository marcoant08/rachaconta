import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Dimensions, Clipboard, TextInput, Alert, AsyncStorage} from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';
import { DrawerActions } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const NovaConta = ({ navigation }) => {
    const [numOrcamentos, setNumOrcamentos] = useState(1);
    const [nomeProduto, setNomeProduto] = useState(['']);
    const [quantprod, setQuantprod] = useState(['']);
    const [preco, setPreco] = useState(['']);
    const [pessoas, setPessoas] = useState(['']);
    const [orcamento, setOrcamento] = useState([]);
    const modalrefAvancado = useRef(null);
    const modalrefSimples = useRef(null);
    const modalrefsave = useRef(null);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [orcamentoPronto, setOrcamentoPronto] = useState(false);
    const [orcamentoPronto2, setOrcamentoPronto2] = useState(false);
    const [todos, setTodos] = useState('');
    const [precotodos, setPrecotodos] = useState('');
    const [qpsimples, setQpsimples] = useState(0);
    const [psimples, setPsimples] = useState(0);
    const [consusimples, setConsusimples] = useState(0);
    const [contas, setContas] = useState([]);
    const [nomeConta, setNomeConta] = useState('');

    
    const CustomInput = Animatable.createAnimatableComponent(TextInput);
    const CustomRect = Animatable.createAnimatableComponent(RectButton);

    async function getThemeRacha(){
        try {
          const a = await AsyncStorage.getItem('@THEMERACHACONTA')
          setThemerachaconta(a)
        } catch {
          console.log('erro asyncstorage')
        }
    }

  const [themerachaconta, setThemerachaconta] = useState();

  useEffect(() => {
    getThemeRacha();
  }, [])

    useEffect(() => {
      if(todos){
        var arr = [...Array(todos.length)]
        for(var i=0; i < arr.length; i++){
          arr[i] = 0;
        }
        todos.map((t, i) => (
          pessoas.map((p, j) => (
            p.includes(t) ? (arr[i] = arr[i] + parseFloat(orcamento[j]), console.log(arr[i])) : console.log(false)
          ))
        ))
        setPrecotodos(arr)
      }
    }, [todos]);

    useEffect(() => {
      async function loadContas () {
        const contasStorage = await AsyncStorage.getItem('@rachaconta:contas');

        if(contasStorage) {
          setContas(JSON.parse(contasStorage));
        }
        console.log('carregou')
      }

      loadContas();
    }, []);

    useEffect(() => {
      async function saveContas () {
        await AsyncStorage.setItem('@rachaconta:contas', JSON.stringify(contas))
        console.log('gravou')
      }

      saveContas();
    }, [contas]);

    function salvarConta () {
      try {
        const now = new Date();
        setContas([
          ...contas,
          {
              nome: nomeConta,
              data: `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`,
              orc: [
                  nomeProduto,
                  quantprod,
                  preco,
                  pessoas
              ]
          }
        ])

        Alert.alert('Este orçamento foi salvo!');

        onCloseSave();
      } catch {
        console.log('erro save conta')
      }
    }

    async function addOrcamento(){
      if(numOrcamentos < 1){
        setNomeProduto(['']);
        setQuantprod(['']);
        setPreco(['']);
        setPessoas(['']);
        setTodos(['']);
      }

      setNumOrcamentos(numOrcamentos + 1);

      setNomeProduto([...nomeProduto, '']);
      setQuantprod([...quantprod, '']);
      setPreco([...preco, '']);
      setPessoas([...pessoas, '']);
    }

    function organizarTodos () {
      var str = '&';
      
      pessoas.map(p => str = str + ',' + p)
      str = str.replace('&,','')
      str = str.replace(/&/gi, '');
      str = str.replace(/ /gi, '');

      const aux = str.split(",");

      const final = aux.reduce((unico, item) => {
          return unico.includes(item) ? unico : [...unico, item]
      }, []);

      setTodos(final);
    }

    function refazer () {
      setNomeProduto(['']);
      setQuantprod(['']);
      setPreco(['']);
      setPessoas(['']);
      setTodos(['']);
        
      setNumOrcamentos(1);
      
      setOrcamentoPronto(false);
      setOrcamentoPronto2(false);
    }

    function removeOrcamento(){
      if(numOrcamentos > 1) {
          nomeProduto.pop();
          quantprod.pop();
          preco.pop();
          pessoas.pop();
          
          setNumOrcamentos(numOrcamentos - 1);
      }
    }

    function fazerOrcamento (){
      for (var i=0; i < numOrcamentos; i++){
        if(!nomeProduto[i] || !quantprod[i] || !preco[i] || !pessoas[i]){
          Alert.alert('Alguns campos não foram preenchidos. Verifique!');
          return false;
        }
      }


      var arrei = []
      for (var i=0; i < numOrcamentos; i++){
        var str = pessoas[i].replace(/ /gi, '');
        const arr = str.split(",");
        const aux = (parseFloat(quantprod[i].replace(',','.')) * parseFloat(preco[i].replace(',','.')) / arr.length);
        arrei.push(aux);
      }
      setOrcamento(arrei);
      onCloseAvancado();
      organizarTodos();
      setOrcamentoPronto(true);
    }

    function quantpessoas (i) {
      var str = pessoas[i].replace(/ /gi, '');
      const arr = str.split(",");

      return arr.length;
    }

    function totalRole () {
      var aux = 0;
      
      for(var i=0; i<precotodos.length; i++){
        aux = aux + parseFloat(precotodos[i]);
      }

      return aux;
    }

    function onOpenAvancado () {
      modalrefAvancado.current?.open();
    }

    function onOpenSimples () {
      modalrefSimples.current?.open();
    }

    function onOpenSave () {
      modalrefsave.current?.open();
    }

    function onCloseAvancado () {
      modalrefAvancado.current?.close();
    }

    function onCloseSimples () {
      modalrefSimples.current?.close();
    }

    function onCloseSave () {
      modalrefsave.current?.close();
    }

    function attNomeProd(text, i){
      nomeProduto[i] = text;
    }

    function attQuantprod(text, i){
      quantprod[i] = text;
    }

    function attPreco(text, i){
      preco[i] = text;
    }

    function attPessoas(text, i){
      pessoas[i] = text;
    }

    const copyToClipboard = () => {
      Clipboard.setString(String(gerarTxt()));
      Alert.alert('O texto foi copiado!');
    }

    const copyToClipboard2 = () => {
      Clipboard.setString(String(gerarTxt2()));
      Alert.alert('O texto foi copiado!');
    }

    function gerarTxt2 () {
      var str = 'Relatório Racha Conta:\n'
      str = str + 'São '+ String(qpsimples) +' produtos para '+ String(consusimples) + ' pessoas.\n'
      str = str + 'Cada um dos produtos custa R$ ' + String(psimples) + '.\n'
      str = str + 'Logo, cada uma das ' + String(consusimples) + ' pessoas deverá pagar: \n'
      str = str + 'R$ ' + String((qpsimples*psimples/consusimples).toFixed(2)) + '.'

      return str;
    }

    function gerarTxt(){

      var str = 'Relatório Racha Conta:\n';

      for(var i=0; i<numOrcamentos; i++){
        const arr = pessoas[i].split(",");
        str = str + '\n'+ String(quantprod[i]) + ' ' + nomeProduto[i] + '(s) de R$ ' + String(Number(preco[i]).toFixed(2)) + ' para ' + pessoas[i] + ';';
        str = str + '\n(R$ ' + String((quantprod[i] * preco[i]).toFixed(2)) + ')\n';
        str = str + '\n - R$ ' + String((parseFloat(quantprod[i]) * parseFloat(preco[i]) / arr.length).toFixed(2)) + ' para cada pessoa;\n';
        str = str + '\n*******\n';
      }
      
      str = str + '\nFazendo os cálculos, o valor individual final para cada um é:\n';

      for(var i=0; i<todos.length; i++){
        str = str + '- ' + todos[i] + ': R$ ' + String(Number(precotodos[i]).toFixed(2)) + '\n'
      }

      str = str + '--------\n';
      str = str + 'Valor Total: R$ ' + totalRole().toFixed(2);

      return str;
    }

    function formulario (i) {
      return (
        <Animatable.View key={i} style={{flex: 1, width: windowWidth}} animation={'bounceIn'} duration={1000}>
          {
            numOrcamentos == 1 ? 
            <Animatable.Text style={styles.pag} animation={'zoomInUp'}>Orçamento {i+1}/{numOrcamentos}</Animatable.Text>
            :
            <Animatable.Text style={styles.pag} animation={'zoomInUp'}>Orçamento {i+1}/{numOrcamentos}: arraste pro lado</Animatable.Text>
          }
          <TextInput
            style={[styles.input, { borderColor: themerachaconta || '#2E8B57' }]}
            placeholder='Qual o nome do produto?'
            onChangeText={text => attNomeProd(text, i)} 
          />
          <TextInput
            style={[styles.input, { borderColor: themerachaconta || '#2E8B57' }]}
            placeholder='Quantos produtos são?'
            keyboardType="numeric"
            onChangeText={text => attQuantprod(text, i)}
          />
          <TextInput 
            style={[styles.input, { borderColor: themerachaconta || '#2E8B57' }]}
            placeholder='Qual o preço do produto?'
            keyboardType="numeric"
            onChangeText={text => attPreco(text, i)}
          />
          <TextInput 
            style={[styles.input, { borderColor: themerachaconta || '#2E8B57' }]}
            placeholder='Quem são as pessoas?'
            onChangeText={text => attPessoas(text, i)}
          />
      </ Animatable.View>
      )
    }

    function formularioSimples (i) {
      return (
        <Animatable.View style={{flex: 1, width: windowWidth}} animation={'bounceIn'}>
          <TextInput
            style={[styles.input, {borderColor: themerachaconta || '#2E8B57'}]}
            placeholder='Quantos produtos foram comprados?'
            keyboardType="numeric"
            onChangeText={setQpsimples}
          />
          <TextInput 
            style={[styles.input, {borderColor: themerachaconta || '#2E8B57'}]}
            placeholder='Qual o preço do produto?'
            keyboardType="numeric"
            onChangeText={setPsimples}
          />
          <TextInput 
            style={[styles.input, {borderColor: themerachaconta || '#2E8B57'}]}
            placeholder='Quantas pessoas consumiram?'
            keyboardType="numeric"
            onChangeText={setConsusimples}
          />
      </ Animatable.View>
      )
    }

    function orcamentoSimples () {
      onCloseSimples();
      setOrcamentoPronto2(true);
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
            <View style={[styles.header, {backgroundColor: themerachaconta || '#2E8B57'}]}> 
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
                    <MaterialCommunityIcons style={{padding:15}} name="view-sequential" color={'white'} size={26} />
                </TouchableOpacity>
                <Text style={[styles.headerText, {flex: 1}]}>racha conta</Text>
            </ View>
            {
              !orcamentoPronto ?
              <>
                {
                  orcamentoPronto2 ?
                  <>
                    <Animatable.View style={{flex: 1, alignItems: 'center', paddingTop: 60}} animation={'bounceIn'}>
                      <Text style={styles.title}>Orçamento pronto!</Text>
                          <Text style={[styles.description, {padding: 10}]}>São {qpsimples} produtos para {consusimples} pessoas.</Text>
                          <Text style={[styles.description, {padding: 10}]}>Cada um dos produtos custa R$ {Number(psimples).toFixed(2)}.</Text>
                          <Text style={[styles.description, {padding: 10}]}>Logo, cada uma das {consusimples} pessoas deverá pagar:</Text>
                          <Text style={[styles.title, {padding: 10}]}>R$ {(qpsimples * psimples / consusimples).toFixed(2)}</Text>
                    </Animatable.View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                      <CustomRect style={[styles.button, {width: '45%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={refazer} animation={'fadeInUp'}>
                        <Text style={styles.txtbutton}>Novo Orçamento</Text>
                      </CustomRect>
                      <CustomRect style={[styles.button, {width: '45%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={() => copyToClipboard2()} animation={'fadeInUp'}>
                        <Text style={styles.txtbutton}>Copiar Texto</Text>
                      </CustomRect>
                    </View>
                  </>
                  :
                  <>
                  <Animatable.View style={{flex: 1, margin: 30}} animation={'fadeInDown'} duration={800}>
                    <Text style={[styles.title, {paddingBottom: 20, color: themerachaconta || '#2E8B57', textAlign: 'center'}]}>Hora de organizar o orçamento!</Text>
                    <Text style={[styles.description, { textAlign: 'center'}]}>Porque um role pra ser respeitado, tem que ser bem organizado.</Text>
                  </Animatable.View>
                  <Animatable.View style={{flexDirection: 'column', justifyContent: 'space-around', paddingBottom: 40}} animation={'fadeInUp'} duration={800}>
                    <RectButton style={[styles.button, {width: '90%', marginBottom: 20, backgroundColor: themerachaconta || '#2E8B57' }]} onPress={onOpenSimples}>
                      <Text style={styles.txtbutton}>Orçamento Simples</Text>
                    </RectButton>
                    <RectButton style={[styles.button, {width: '90%', backgroundColor: themerachaconta || '#2E8B57' }]} onPress={onOpenAvancado}>
                      <Text style={styles.txtbutton}>Orçamento Avançado</Text>
                    </RectButton>
                  </Animatable.View>
                  </>
                }
                
              </>
              :
              <>
                <ScrollView style={{flex: 1}}>
                  {
                    orcamento.map((item, i) => (
                      <Animatable.View key={item} style={{alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: themerachaconta || '#2E8B57', paddingTop: 10, paddingBottom: 20}} animation={'bounceIn'}>
                        <Text style={[styles.description, {paddingBottom: 15, color: themerachaconta || '#2E8B57'}]}>Conta número {i+1}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.description}>O preço de cada {nomeProduto[i]} foi:</Text>
                          <Text style={styles.title}>R$ {Number(preco[i]).toFixed(2)}</Text> 
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.description}>Quantidade de {nomeProduto[i]}(s):</Text>
                          <Text style={styles.title}>{quantprod[i]}</Text> 
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.description}>Total:</Text>
                          <Text style={styles.title}>R$ {(quantprod[i]*preco[i]).toFixed(2)}</Text> 
                        </View>
                        <Text style={styles.description}>Integrantes desse grupo:</Text>
                        <Text style={[styles.title, { textAlign: 'center'}]}>{quantpessoas(i)} pessoas: {pessoas[i]}</Text>
                        <View style={{flexDirection: 'column', alignItems: 'center', maxWidth: windowWidth-80}}>
                          <Text style={styles.description}>Preço individual para este grupo:</Text>
                          <Text style={styles.title}>R$ {item.toFixed(2)}</Text> 
                        </View>
                      </Animatable.View>
                    ))
                  }
                  <Animatable.View style={{alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: themerachaconta || '#2E8B57', paddingTop: 10, paddingBottom: 20}} animation={'bounceIn'}>
                    <Text style={[styles.description, {paddingBottom: 15, color: themerachaconta || '#2E8B57'}]}>Pagamento Individual Completo</Text>
                    <Text style={styles.description}>Um total de {todos.length} pessoas estão participando do role.</Text>
                    <Text style={[styles.description, {paddingBottom: 10}]}>Aqui está o valor que cada uma deve pagar:</Text>
                    {
                      todos.map((p, i) => (
                        <Text key={p}  style={styles.title}>{p}: R$ {Number(precotodos[i]).toFixed(2)}</Text>
                      ))
                    }
                  </Animatable.View>
                  <Animatable.View style={{alignItems: 'center', paddingTop: 10, paddingBottom: 35}}  animation={'bounceIn'}>
                    <Text style={[styles.description, {paddingBottom: 15, color: themerachaconta || '#2E8B57', textAlign: 'center'}]}>Valor total do role</Text>
                    <Text style={styles.title}>Esse role custou R$ {totalRole().toFixed(2)}</Text>
                  </Animatable.View>
                </ScrollView>
                <Animatable.View style={{flexDirection: 'row', justifyContent: 'space-around'}} animation={'fadeInUp'} duration={1000}>
                  <RectButton style={[styles.button, {width: '30%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={refazer}>
                    <Text style={styles.txtbutton}>Novo Orçamento</Text>
                  </RectButton>
                  <RectButton style={[styles.button, {width: '30%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={() => copyToClipboard()}>
                    <Text style={styles.txtbutton}>Copiar Texto</Text>
                  </RectButton>
                  <RectButton style={[styles.button, {width: '30%', backgroundColor: themerachaconta || '#2E8B57'}]} onPress={onOpenSave}>
                    <Text style={styles.txtbutton}>Salvar</Text>
                  </RectButton>
                </Animatable.View>
              </>
            }
              <Modalize
                ref={modalrefAvancado}
                snapPoint={540}
                modalHeight={windowHeight-50}
              >
                <Text style={[styles.headerText, {color: themerachaconta || '#2E8B57'}]}>racha conta</Text>
                <Animatable.View
                style={styles.viewNumOrcamentos}
                animation="zoomInUp"
                duration={800}
                >
                  {
                    numOrcamentos == 1 ?
                      <Text style={styles.txtNumOrcamentos}>Você está fazendo 1 orçamento</Text>
                    :
                      <Text style={styles.txtNumOrcamentos}>Você está fazendo {numOrcamentos} orçamentos</Text>
                  }
                  <TouchableOpacity style={[styles.buttonNumOrcamentos, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={removeOrcamento}>
                      <MaterialCommunityIcons name="close-circle" color={'white'} size={26} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonNumOrcamentos, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={addOrcamento}>
                      <MaterialCommunityIcons name="plus-circle" color={'white'} size={26} />
                  </TouchableOpacity>
              </Animatable.View>
              <View style={styles.form} >
                <KeyboardAvoidingView>
                  <ScrollView horizontal >
                  {
                    [...Array(numOrcamentos)].map((e, i) => formulario(i))
                  }
                  </ScrollView> 
                  <CustomRect style={[styles.button, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={fazerOrcamento}>
                    <Text style={styles.txtbutton}>Gerar Orçamento</Text>
                  </CustomRect>
                </KeyboardAvoidingView>
            </View>
          </Modalize>
          <Modalize
            ref={modalrefSimples}
            snapPoint={400}
          >
            <KeyboardAvoidingView>
              <Text style={[styles.headerText, {color: themerachaconta || '#2E8B57'}]}>racha conta</Text>
              {
                formularioSimples()
              }
              <RectButton style={[styles.button, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={orcamentoSimples}>
                <Text style={styles.txtbutton}>Gerar Orçamento</Text>
              </RectButton>
            </KeyboardAvoidingView>
          </Modalize>
          <Modalize
            ref={modalrefsave}
            snapPoint={300}
          >
            <KeyboardAvoidingView>
              <Text style={[styles.headerText, {color: themerachaconta || '#2E8B57'}]}>racha conta</Text>
              <TextInput
                style={[styles.input, { borderColor: themerachaconta || '#2E8B57' }]}
                placeholder='Nome'
                onChangeText={setNomeConta} 
              />
              <RectButton style={[styles.button, {backgroundColor: themerachaconta || '#2E8B57'}]} onPress={salvarConta}>
                <Text style={styles.txtbutton}>Salvar</Text>
              </RectButton>
            </KeyboardAvoidingView>
          </Modalize>
      </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 27
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
  
  form: {
    paddingTop: 30,
    justifyContent: 'center',
  },

  input: {
    backgroundColor: '#FFF',
    width: '90%',
    height: 55,
    margin: 7,
    color: '#222',
    fontSize: 17,
    borderRadius: 10,
    padding: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2E8B57',
    fontFamily: 'Inter_400Regular'
  }, 

  title: {
    fontSize: 20,
    padding: 7,
    color: '#003E15',
    fontFamily: 'Ubuntu_500Medium'
  },

  description: {
    fontSize: 16,
    padding: 7,
    color: '#555',
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
    height: 55,
    width: '90%',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  txtNumOrcamentos: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    fontFamily: 'Inter_400Regular'
  },

  pag: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    paddingLeft: 25,
    alignSelf: 'flex-start'
  },

  viewNumOrcamentos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  buttonNumOrcamentos: {
    width: 35,
    height: 35,
    backgroundColor: '#2E8B57',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  }

  });

export default NovaConta;
