import React,{useEffect,useState} from 'react';
import {View,Text,TextInput,Pressable,Alert,ActivityIndicator,StyleSheet} from 'react-native';
import {Z,E,PL,poseKey} from './data';
import {orChat,get,put} from './api';

const C={card:'#10161b',line:'#1e2a32',ac:'#46e6d6',ac2:'#4cc3ff',tx:'#f3f8f9',mu:'#8a9aa3'};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Math.round(Number(v))||a));
const SYS='Du bist der KI-Coach der App GlowFit. Antworte auf Deutsch, kurz, freundlich und konkret. Du hilfst bei Training, Ernährung, Haut, Frisur und Style. Keine extremen Diäten oder Crash-Pläne, bei Gesundheitsproblemen verweise auf Ärzte.\n'+
'Wenn der Nutzer einen Trainingsplan will, schreibe 1–2 Sätze und danach genau einen ```json Block: {"type":"workout","name":"Kurzname","exercises":[{"name":"","kind":"reps","sets":3,"target":"8–12 Wdh.","secs":0,"desc":"1–2 Sätze Anleitung","pose":"push","rest":75}]}. kind ist "reps" oder "hold" (bei hold gibt secs die Sekunden an). Maximal 10 Übungen, nur für zuhause ohne Geräte (Rucksack, Stuhl, Tisch erlaubt). pose ist das passendste Bewegungsbild: push=Liegestütze, squat=Kniebeuge, row=vorgebeugtes Rudern, plank=Unterarmstütz, pike=Pike-Liegestütze, lunge=Ausfallschritt, table=Tisch-Rudern, sup=Superman, snow=Reverse Snow Angel, hip=Hip Thrust, leg=Beinheben, side=Seitstütz, child=Kindhaltung, hipf=Hüftbeuger-Dehnung, quad=Oberschenkel-Dehnung, chest=Brustdehnung, neck=Nackendehnung.\n'+
'Wenn der Nutzer einen Essensplan will, schreibe 1–2 Sätze und danach genau einen ```json Block: {"type":"mealplan","title":"","days":[{"day":"Mo","meals":[{"name":"","kcal":0,"protein":0}]}]}. Frage vorher nach Zielen und Vorlieben, falls sie fehlen. Sonst antworte ohne JSON.';

export function registerPlan(p,key){
 const ids=(p.exercises||[]).slice(0,12).map((x,i)=>{const id=key+'_'+i,h=x.kind=='hold',secs=clamp(x.secs||30,5,300);
  E[id]={n:String(x.name||'Übung').slice(0,40),k:h?'h':'r',sets:clamp(x.sets||3,1,6),t:h?secs+' Sek.':String(x.target||'10 Wdh.'),s:secs,d:String(x.desc||''),rest:x.rest?clamp(x.rest,5,180):undefined};
  poseKey[id]=Z[x.pose]?x.pose:'plank';return id});
 PL[key]={n:String(p.name||'Mein Plan').slice(0,12),s:'KI-Plan',ex:ids}}
export async function loadPlans(){const a=await get('plans',[]);a.forEach(p=>registerPlan(p,p.key))}
export async function deletePlan(key){delete PL[key];await put('plans',(await get('plans',[])).filter(p=>p.key!=key))}

export default function Coach(){
 const [msgs,setMsgs]=useState([{r:'assistant',c:'Hi! Ich bin dein Coach. Sag mir, was du brauchst, zum Beispiel einen Trainingsplan, einen Essensplan oder Tipps für Haut und Style.'}]);
 const [txt,setTxt]=useState(''),[busy,setBusy]=useState(false),[plan,setPlan]=useState(null);
 useEffect(()=>{get('mealplan',null).then(setPlan)},[]);
 async function send(t){t=(t||txt).trim();if(!t||busy)return;setTxt('');const next=[...msgs,{r:'user',c:t}];setMsgs(next);setBusy(true);
  try{const hist=next.slice(-12).map(m=>({role:m.r,content:m.c}));
   const rep=await orChat([{role:'system',content:SYS},...hist],0.5);
   let a=null;const m=rep.match(/```(?:json)?\s*([\s\S]*?)```/);
   if(m){try{a=JSON.parse(m[1])}catch(e){}}
   if(a&&a.type!='workout'&&a.type!='mealplan')a=null;
   setMsgs([...next,{r:'assistant',c:rep.replace(/```[\s\S]*?```/g,'').trim()||'Hier ist dein Vorschlag:',a}])
  }catch(e){setMsgs([...next,{r:'assistant',c:'Das hat nicht geklappt: '+String(e.message||e)}])}
  setBusy(false)}
 async function useAction(a,i){
  if(a.type=='workout'){const key='C'+Date.now();registerPlan(a,key);await put('plans',[...(await get('plans',[])),{key,name:a.name,exercises:a.exercises}]);Alert.alert('Gespeichert','Du findest den Plan im Tab Training. Halte ihn gedrückt, um ihn zu löschen.')}
  else{setPlan(a);await put('mealplan',a);Alert.alert('Gespeichert','Dein Essensplan steht unten.')}
  setMsgs(ms=>ms.map((m,j)=>j==i?{...m,done:true}:m))}
 return <View>
  <Text style={s.h1}>Coach</Text>
  <View style={s.row}>{['Baue mir einen Trainingsplan','Erstelle einen Essensplan'].map(q=><Pressable key={q} style={s.sug} onPress={()=>send(q)}><Text style={s.sugT}>{q}</Text></Pressable>)}</View>
  {msgs.map((m,i)=><View key={i} style={[s.msg,m.r=='user'?s.me:s.ai]}><Text style={s.tx}>{m.c}</Text>
   {m.a&&!m.done?<Pressable style={s.btn} onPress={()=>useAction(m.a,i)}><Text style={s.btnT}>{m.a.type=='workout'?'Als Trainingsplan speichern':'Als Essensplan speichern'}</Text></Pressable>:null}
   {m.done?<Text style={[s.mu,{marginTop:6}]}>Gespeichert</Text>:null}</View>)}
  {busy?<ActivityIndicator color={C.ac} style={{margin:10}}/>:null}
  <View style={s.card}><TextInput style={s.in} value={txt} onChangeText={setTxt} multiline placeholder="Frag deinen Coach…" placeholderTextColor={C.mu}/>
   <Pressable style={s.btn} onPress={()=>send()}><Text style={s.btnT}>Senden</Text></Pressable></View>
  {plan&&plan.days?<View style={s.card}><View style={s.row2}><Text style={s.b}>{plan.title||'Mein Essensplan'}</Text><Pressable onPress={async()=>{setPlan(null);await put('mealplan',null)}}><Text style={{color:C.ac2}}>Löschen</Text></Pressable></View>
   {plan.days.map((d,i)=><View key={i} style={s.day}><Text style={s.b}>{d.day} <Text style={s.mu}>· {(d.meals||[]).reduce((a,x)=>a+(Number(x.kcal)||0),0)} kcal</Text></Text>
    {(d.meals||[]).map((x,j)=><Text key={j} style={s.sm}>{x.name} · {x.kcal} kcal · {x.protein} g P</Text>)}</View>)}</View>:null}
 </View>}

const s=StyleSheet.create({h1:{color:C.tx,fontSize:34,fontWeight:'800',letterSpacing:-0.5,marginBottom:8},b:{color:C.tx,fontWeight:'700',fontSize:16},mu:{color:C.mu,fontSize:15},tx:{color:C.tx,fontSize:15,lineHeight:21},sm:{color:C.tx,fontSize:14,marginTop:4},
 row:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:6},row2:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 sug:{borderWidth:1,borderColor:C.line,backgroundColor:C.card,borderRadius:20,paddingVertical:12,paddingHorizontal:14},sugT:{color:C.ac,fontSize:13,fontWeight:'600'},
 msg:{borderRadius:16,padding:12,marginVertical:5,maxWidth:'92%'},me:{alignSelf:'flex-end',backgroundColor:'#12303a'},ai:{alignSelf:'flex-start',backgroundColor:C.card,borderWidth:1,borderColor:C.line},
 card:{backgroundColor:C.card,borderColor:C.line,borderWidth:1,borderRadius:20,padding:16,marginVertical:8},day:{borderTopWidth:1,borderColor:C.line,paddingVertical:8,marginTop:6},
 in:{color:C.tx,borderWidth:1,borderColor:C.line,borderRadius:12,padding:12,marginBottom:8,minHeight:44,fontSize:16,backgroundColor:'#0b1115'},
 btn:{height:52,borderRadius:14,backgroundColor:C.ac,alignItems:'center',justifyContent:'center',marginTop:8},btnT:{color:'#02161a',fontSize:16,fontWeight:'800'}});
