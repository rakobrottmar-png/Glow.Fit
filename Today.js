import React,{useEffect,useState} from 'react';
import {View,Text,TextInput,Pressable,Alert,ActivityIndicator,StyleSheet,Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Pedometer} from 'expo-sensors';

const C={card:'#10161b',line:'#1e2a32',ac:'#46e6d6',ac2:'#4cc3ff',tx:'#f3f8f9',mu:'#8a9aa3'};
const dk=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const get=async(k,d)=>{try{const v=await AsyncStorage.getItem('gf_'+k);return v?JSON.parse(v):d}catch(e){return d}};
const put=(k,v)=>AsyncStorage.setItem('gf_'+k,JSON.stringify(v)).catch(()=>{});
const SYS='Du schätzt Nährwerte für Mahlzeiten. Antworte NUR mit JSON ohne weiteren Text: {"name":string,"kcal":number,"protein":number,"carbs":number,"fat":number}. Alle Werte gelten für die gesamte beschriebene Portion (kcal bzw. Gramm). Gib eine realistische Schätzung.';

export default function Today(){
 const [steps,setSteps]=useState(undefined),[meals,setMeals]=useState([]),[txt,setTxt]=useState(''),[busy,setBusy]=useState(false);
 const [key,setKey]=useState(''),[model,setModel]=useState('openai/gpt-4o-mini');
 useEffect(()=>{(async()=>{setKey(await get('orkey',''));setModel(await get('ormodel','openai/gpt-4o-mini'));setMeals(await get('meals_'+dk(),[]))})();loadSteps();const t=setInterval(loadSteps,30000);return()=>clearInterval(t)},[]);
 async function loadSteps(){try{
  if(!(await Pedometer.isAvailableAsync())){setSteps(null);return}
  const p=await Pedometer.requestPermissionsAsync();if(!p.granted){setSteps(-1);return}
  const s=new Date();s.setHours(0,0,0,0);const r=await Pedometer.getStepCountAsync(s,new Date());setSteps(r.steps)}catch(e){setSteps(null)}}
 async function ask(){
  if(!key.trim()){Alert.alert('API-Key fehlt','Trage unten deinen OpenRouter-Key ein.');return}
  if(!txt.trim()){Alert.alert('Was hast du gegessen?','Beschreibe die Mahlzeit, zum Beispiel „2 Eier und 2 Scheiben Brot“.');return}
  setBusy(true);
  try{
   const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key.trim(),'X-Title':'GlowFit'},
    body:JSON.stringify({model:model.trim(),temperature:0.2,messages:[{role:'system',content:SYS},{role:'user',content:txt}]})});
   const j=await r.json();
   if(!r.ok)throw new Error((j.error&&j.error.message)||('Fehler '+r.status));
   const m=String(j.choices[0].message.content).match(/\{[\s\S]*\}/);const o=JSON.parse(m[0]);
   const n=x=>Math.max(0,Math.round(Number(x)||0));
   const nm=[...meals,{id:Date.now(),name:String(o.name||txt).slice(0,60),kcal:n(o.kcal),p:n(o.protein),c:n(o.carbs),f:n(o.fat)}];
   setMeals(nm);put('meals_'+dk(),nm);setTxt('')
  }catch(e){Alert.alert('Das hat nicht geklappt',String(e.message||e))}
  setBusy(false)}
 const del=id=>{const nm=meals.filter(x=>x.id!=id);setMeals(nm);put('meals_'+dk(),nm)};
 const sum=f=>meals.reduce((a,x)=>a+x[f],0);
 return <View>
  <Text style={s.h1}>Heute</Text>
  <View style={s.card}><Text style={s.mu}>Schritte</Text>
   {steps===undefined?<Text style={s.mu}>Lädt…</Text>:steps===null?<Text style={s.mu}>Schrittzähler auf diesem Gerät nicht verfügbar.</Text>:steps===-1?<Text style={s.mu}>Erlaube GlowFit unter Einstellungen den Zugriff auf Bewegung und Fitness.</Text>
   :<><Text style={s.big}>{steps.toLocaleString('de-DE')}</Text><View style={s.bar}><View style={[s.barI,{width:Math.min(100,steps/100)+'%'}]}/></View><Text style={s.mu}>Ziel: 10.000 Schritte</Text></>}</View>
  <View style={s.card}><Text style={s.mu}>Heute gegessen</Text><Text style={s.big}>{sum('kcal')} <Text style={s.mu}>kcal</Text></Text>
   <Text style={s.tx}>{sum('p')} g Protein · {sum('c')} g Kohlenhydrate · {sum('f')} g Fett</Text></View>
  <View style={s.card}><Text style={s.b}>Mahlzeit hinzufügen</Text>
   <TextInput style={s.in} value={txt} onChangeText={setTxt} multiline placeholder="z. B. 3 Eier, 2 Scheiben Brot, 200 g Quark" placeholderTextColor={C.mu}/>
   <Pressable onPress={busy?undefined:ask} style={s.btn}>{busy?<ActivityIndicator color="#02161a"/>:<Text style={s.btnT}>Mit KI berechnen</Text>}</Pressable>
   <Text style={[s.mu,{marginTop:8,fontSize:12}]}>Die Werte sind Schätzungen und können abweichen.</Text></View>
  {meals.map(m=><View key={m.id} style={[s.card,s.row]}><View style={{flex:1}}><Text style={s.b}>{m.name}</Text><Text style={s.mu}>{m.kcal} kcal · {m.p} g P · {m.c} g KH · {m.f} g F</Text></View><Pressable onPress={()=>del(m.id)} style={s.x}><Text style={s.tx}>✕</Text></Pressable></View>)}
  <View style={s.card}><Text style={s.b}>KI-Einstellungen</Text>
   <Text style={[s.mu,{marginTop:6}]}>OpenRouter-API-Key</Text>
   <TextInput style={s.in} value={key} onChangeText={v=>{setKey(v);put('orkey',v)}} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="sk-or-…" placeholderTextColor={C.mu}/>
   <Text style={s.mu}>Modell</Text>
   <TextInput style={s.in} value={model} onChangeText={v=>{setModel(v);put('ormodel',v)}} autoCapitalize="none" autoCorrect={false}/>
   <Text style={[s.mu,{fontSize:12}]}>Der Key bleibt nur auf deinem Handy und wird nur an OpenRouter gesendet. Teile ihn mit niemandem.</Text>
   <Pressable onPress={()=>Linking.openURL('https://openrouter.ai/keys')}><Text style={{color:C.ac2,marginTop:6}}>Key bei OpenRouter erstellen</Text></Pressable></View>
 </View>}

const s=StyleSheet.create({
 h1:{color:C.tx,fontSize:30,fontWeight:'800',marginBottom:4},b:{color:C.tx,fontWeight:'700',fontSize:16},mu:{color:C.mu,fontSize:14},tx:{color:C.tx,fontSize:14,fontWeight:'600'},
 card:{backgroundColor:C.card,borderColor:C.line,borderWidth:1,borderRadius:18,padding:14,marginVertical:6},row:{flexDirection:'row',alignItems:'center'},
 big:{color:C.ac,fontSize:40,fontWeight:'800'},bar:{height:6,backgroundColor:C.line,borderRadius:6,overflow:'hidden',marginVertical:8},barI:{height:6,backgroundColor:C.ac2},
 in:{color:C.tx,borderWidth:1,borderColor:C.line,borderRadius:12,padding:12,marginVertical:8,minHeight:44,fontSize:16,backgroundColor:'#0b1115'},
 btn:{height:52,borderRadius:16,backgroundColor:C.ac,alignItems:'center',justifyContent:'center'},btnT:{color:'#02161a',fontSize:17,fontWeight:'800'},
 x:{width:38,height:38,alignItems:'center',justifyContent:'center'}});
