import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TextInput,Pressable,Alert,ActivityIndicator,StyleSheet,Linking,Modal,Animated} from 'react-native';
import {Pedometer} from 'expo-sensors';
import {CameraView,useCameraPermissions} from 'expo-camera';
import {orChat,get,put,SYS_FOOD,parseFood} from './api';

const C={card:'#10161b',line:'#1e2a32',ac:'#46e6d6',ac2:'#4cc3ff',tx:'#f3f8f9',mu:'#8a9aa3'};
const dk=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

function Scan({onClose,onShot,busy}){
 const [perm,req]=useCameraPermissions(),ref=useRef(null),y=useRef(new Animated.Value(0)).current,[h,setH]=useState(600);
 const ok=!!(perm&&perm.granted);
 useEffect(()=>{if(!ok)return;const a=Animated.loop(Animated.sequence([Animated.timing(y,{toValue:1,duration:1300,useNativeDriver:true}),Animated.timing(y,{toValue:0,duration:1300,useNativeDriver:true})]));a.start();return()=>a.stop()},[ok]);
 async function shot(){try{const p=await ref.current.takePictureAsync({quality:0.4,base64:true,skipProcessing:true});onShot(p.base64)}catch(e){Alert.alert('Foto fehlgeschlagen',String(e.message||e))}}
 if(!perm)return <View style={{flex:1,backgroundColor:'#000'}}/>;
 if(!ok)return <View style={[s.cam,{justifyContent:'center',padding:24}]}><Text style={[s.tx,{textAlign:'center',marginBottom:16}]}>GlowFit braucht die Kamera, um dein Essen zu scannen.</Text><Pressable style={s.btn} onPress={req}><Text style={s.btnT}>Kamera erlauben</Text></Pressable><Pressable style={[s.btn,s.alt]} onPress={onClose}><Text style={[s.btnT,{color:C.tx}]}>Abbrechen</Text></Pressable></View>;
 return <View style={s.cam}>
  <CameraView ref={ref} style={{flex:1}} facing="back" onLayout={e=>setH(e.nativeEvent.layout.height)}/>
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
   <View style={{position:'absolute',top:100,bottom:170,left:24,right:24,borderWidth:2,borderColor:C.ac,borderRadius:24,opacity:.8}}/>
   <Animated.View style={{position:'absolute',left:30,right:30,height:4,borderRadius:4,backgroundColor:C.ac,shadowColor:C.ac,shadowOpacity:1,shadowRadius:12,transform:[{translateY:y.interpolate({inputRange:[0,1],outputRange:[106,h-176]})}]}}/>
   <Text style={[s.tx,{position:'absolute',top:56,width:'100%',textAlign:'center',fontWeight:'700'}]}>{busy?'Wird analysiert…':'Halte dein Essen in den Rahmen'}</Text></View>
  <View style={{position:'absolute',left:16,right:16,bottom:40,gap:10}}>
   <Pressable style={s.btn} onPress={busy?undefined:shot}>{busy?<ActivityIndicator color="#02161a"/>:<Text style={s.btnT}>Scannen</Text>}</Pressable>
   <Pressable style={[s.btn,s.alt]} onPress={onClose}><Text style={[s.btnT,{color:C.tx}]}>Abbrechen</Text></Pressable></View></View>}

export default function Today(){
 const [steps,setSteps]=useState(undefined),[meals,setMeals]=useState([]),[txt,setTxt]=useState(''),[busy,setBusy]=useState(false),[cam,setCam]=useState(false);
 const [key,setKey]=useState(''),[model,setModel]=useState('openai/gpt-4o-mini');
 useEffect(()=>{(async()=>{setKey(await get('orkey',''));setModel(await get('ormodel','openai/gpt-4o-mini'));setMeals(await get('meals_'+dk(),[]))})();loadSteps();const t=setInterval(loadSteps,30000);return()=>clearInterval(t)},[]);
 async function loadSteps(){try{
  if(!(await Pedometer.isAvailableAsync())){setSteps(null);return}
  const p=await Pedometer.requestPermissionsAsync();if(!p.granted){setSteps(-1);return}
  const s0=new Date();s0.setHours(0,0,0,0);const r=await Pedometer.getStepCountAsync(s0,new Date());setSteps(r.steps)}catch(e){setSteps(null)}}
 const add=async m=>{const cur=await get('meals_'+dk(),[]);const nm=[...cur,m];setMeals(nm);put('meals_'+dk(),nm)};
 async function ask(){
  if(!txt.trim()){Alert.alert('Was hast du gegessen?','Beschreibe die Mahlzeit, zum Beispiel „2 Eier und 2 Scheiben Brot“.');return}
  setBusy(true);
  try{const t=await orChat([{role:'system',content:SYS_FOOD},{role:'user',content:txt}],0.2);await add(parseFood(t,txt));setTxt('')}
  catch(e){Alert.alert('Das hat nicht geklappt',String(e.message||e))}
  setBusy(false)}
 async function scan(b64){
  setBusy(true);
  try{const t=await orChat([{role:'system',content:SYS_FOOD},{role:'user',content:[{type:'text',text:'Was ist auf dem Foto zu sehen? Schätze die Nährwerte der gesamten Portion.'},{type:'image_url',image_url:{url:'data:image/jpeg;base64,'+b64}}]}],0.2);
   await add(parseFood(t,'Foto-Scan'));setCam(false)}
  catch(e){Alert.alert('Scan fehlgeschlagen',String(e.message||e))}
  setBusy(false)}
 const del=id=>{const nm=meals.filter(x=>x.id!=id);setMeals(nm);put('meals_'+dk(),nm)};
 const sum=f=>meals.reduce((a,x)=>a+x[f],0);
 return <View>
  <Modal visible={cam} animationType="slide" onRequestClose={()=>setCam(false)}><Scan onClose={()=>setCam(false)} onShot={scan} busy={busy}/></Modal>
  <Text style={s.h1}>Heute</Text>
  <View style={s.card}><Text style={s.mu}>Schritte</Text>
   {steps===undefined?<Text style={s.mu}>Lädt…</Text>:steps===null?<Text style={s.mu}>Schrittzähler auf diesem Gerät nicht verfügbar.</Text>:steps===-1?<Text style={s.mu}>Erlaube GlowFit unter Einstellungen den Zugriff auf Bewegung und Fitness.</Text>
   :<><Text style={s.big}>{steps.toLocaleString('de-DE')}</Text><View style={s.bar}><View style={[s.barI,{width:Math.min(100,steps/100)+'%'}]}/></View><Text style={s.mu}>Ziel: 10.000 Schritte</Text></>}</View>
  <View style={s.card}><Text style={s.mu}>Heute gegessen</Text><Text style={s.big}>{sum('kcal')} <Text style={s.mu}>kcal</Text></Text>
   <Text style={s.tx}>{sum('p')} g Protein · {sum('c')} g Kohlenhydrate · {sum('f')} g Fett</Text></View>
  <View style={s.card}><Text style={s.b}>Mahlzeit hinzufügen</Text>
   <Pressable onPress={()=>setCam(true)} style={[s.btn,{marginTop:10}]}><Text style={s.btnT}>Essen mit Kamera scannen</Text></Pressable>
   <TextInput style={s.in} value={txt} onChangeText={setTxt} multiline placeholder="oder beschreiben: 3 Eier, 2 Scheiben Brot, 200 g Quark" placeholderTextColor={C.mu}/>
   <Pressable onPress={busy?undefined:ask} style={[s.btn,s.alt]}>{busy?<ActivityIndicator color={C.ac}/>:<Text style={[s.btnT,{color:C.tx}]}>Mit KI berechnen</Text>}</Pressable>
   <Text style={[s.mu,{marginTop:8,fontSize:12}]}>Die Werte sind Schätzungen und können abweichen.</Text></View>
  {meals.map(m=><View key={m.id} style={[s.card,s.row]}><View style={{flex:1}}><Text style={s.b}>{m.name}</Text><Text style={s.mu}>{m.kcal} kcal · {m.p} g P · {m.c} g KH · {m.f} g F</Text></View><Pressable onPress={()=>del(m.id)} style={s.x}><Text style={s.tx}>✕</Text></Pressable></View>)}
  <View style={s.card}><Text style={s.b}>KI-Einstellungen</Text>
   <Text style={[s.mu,{marginTop:6}]}>OpenRouter-API-Key</Text>
   <TextInput style={s.in} value={key} onChangeText={v=>{setKey(v);put('orkey',v)}} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="sk-or-…" placeholderTextColor={C.mu}/>
   <Text style={s.mu}>Modell (für Foto-Scan muss es Bilder verstehen)</Text>
   <TextInput style={s.in} value={model} onChangeText={v=>{setModel(v);put('ormodel',v)}} autoCapitalize="none" autoCorrect={false}/>
   <Text style={[s.mu,{fontSize:12}]}>Der Key bleibt nur auf deinem Handy und wird nur an OpenRouter gesendet. Teile ihn mit niemandem.</Text>
   <Pressable onPress={()=>Linking.openURL('https://openrouter.ai/keys')}><Text style={{color:C.ac2,marginTop:6}}>Key bei OpenRouter erstellen</Text></Pressable></View>
 </View>}

const s=StyleSheet.create({
 h1:{color:C.tx,fontSize:30,fontWeight:'800',marginBottom:4},b:{color:C.tx,fontWeight:'700',fontSize:16},mu:{color:C.mu,fontSize:14},tx:{color:C.tx,fontSize:14,fontWeight:'600'},
 card:{backgroundColor:C.card,borderColor:C.line,borderWidth:1,borderRadius:18,padding:14,marginVertical:6},row:{flexDirection:'row',alignItems:'center'},
 big:{color:C.ac,fontSize:40,fontWeight:'800'},bar:{height:6,backgroundColor:C.line,borderRadius:6,overflow:'hidden',marginVertical:8},barI:{height:6,backgroundColor:C.ac2},
 in:{color:C.tx,borderWidth:1,borderColor:C.line,borderRadius:12,padding:12,marginVertical:8,minHeight:44,fontSize:16,backgroundColor:'#0b1115'},
 btn:{height:52,borderRadius:16,backgroundColor:C.ac,alignItems:'center',justifyContent:'center',marginTop:8},alt:{backgroundColor:C.card,borderWidth:1,borderColor:C.line},btnT:{color:'#02161a',fontSize:17,fontWeight:'800'},
 cam:{flex:1,backgroundColor:'#000'},x:{width:38,height:38,alignItems:'center',justifyContent:'center'}});
