import React,{useEffect,useState,useRef} from 'react';
import {View,Text,ScrollView,Pressable,Alert,Vibration,StyleSheet,SafeAreaView,StatusBar,Linking} from 'react-native';
import Svg,{Polyline,Circle,Rect,Line} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useKeepAwake} from 'expo-keep-awake';
import {Z,E,ST,PL,poseKey,G,BD,earned} from './data';

const C={bg:'#06080a',card:'#10161b',line:'#1e2a32',ac:'#46e6d6',ac2:'#4cc3ff',tx:'#f3f8f9',mu:'#8a9aa3'};
const save=(k,v)=>AsyncStorage.setItem('gf_'+k,JSON.stringify(v)).catch(()=>{});
const load=async(k,d)=>{try{const v=await AsyncStorage.getItem('gf_'+k);return v?JSON.parse(v):d}catch(e){return d}};

function Fig({k}){const a=Z[k];const [i,setI]=useState(0);
 useEffect(()=>{if(a.length<2)return;const t=setInterval(()=>setI(x=>1-x),1200);return()=>clearInterval(t)},[k]);
 const p=a[a.length>1?i:0];
 return <View style={s.fig}><Svg width="100%" height={170} viewBox="0 0 200 120">
  <Line x1="8" y1="107" x2="192" y2="107" stroke="#2a3a44" strokeWidth="2"/>
  {(p.r||[]).map((r,j)=><Rect key={j} x={r[0]} y={r[1]} width={r[2]} height={r[3]} rx="2" fill="#1e2a32" stroke={C.ac2} strokeWidth="1.5"/>)}
  {p.c.map((c,j)=><Polyline key={j} points={c.map(q=>q.join(',')).join(' ')} fill="none" stroke={j?C.ac2:C.ac} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>)}
  <Circle cx={p.h[0]} cy={p.h[1]} r="8" fill={C.ac}/></Svg></View>}

function Ring({size,rings,children}){const c=size/2;
 return <View style={{width:size,height:size}}><Svg width={size} height={size} style={{transform:[{rotate:'-90deg'}]}}>
  {rings.map((r,i)=>{const L=2*Math.PI*r.r;return <React.Fragment key={i}>
   <Circle cx={c} cy={c} r={r.r} stroke={r.col} strokeOpacity=".18" strokeWidth={r.w} fill="none"/>
   <Circle cx={c} cy={c} r={r.r} stroke={r.col} strokeWidth={r.w} fill="none" strokeLinecap="round" strokeDasharray={[L*Math.min(1,r.p),L]}/></React.Fragment>})}
  </Svg>{children?<View style={s.ringIn}>{children}</View>:null}</View>}

function Btn({t,on,alt,style}){return <Pressable onPress={on} style={({pressed})=>[s.btn,alt&&s.alt,pressed&&{opacity:.7},style]}><Text style={[s.btnT,alt&&{color:C.tx}]}>{t}</Text></Pressable>}

function build(ids,rest){const w=[];
 ids.forEach((id,xi)=>{const e=E[id];for(let n=1;n<=e.sets;n++)(e.sides?['links','rechts']:[null]).forEach(sd=>w.push({type:e.k=='h'?'hold':'reps',id,e,s:n,sd,xi}))});
 const st=[];w.forEach((x,i)=>{st.push(x);if(i<w.length-1)st.push({type:'rest',dur:x.sd=='links'?5:(x.e.rest||rest),nx:w[i+1]})});
 return {st,n:w.length,ne:ids.length}}

function Workout({ids,rest,onEnd,onQuit}){useKeepAwake();
 const B=useRef(build(ids,rest)).current,steps=B.st;
 const [i,setI]=useState(0),[done,setDone]=useState(0),[tm,setTm]=useState(null),[,force]=useState(0);
 const t0=useRef(Date.now());
 const s=steps[i],x=s.type=='rest'?s.nx:s,e=x.e;
 useEffect(()=>{if(s.type=='rest')setTm({m:'run',end:Date.now()+s.dur*1000,tot:s.dur*1000});else if(s.type=='hold')setTm({m:'idle',rem:e.s*1000,tot:e.s*1000});else setTm(null)},[i]);
 const rem=!tm?0:tm.m=='run'?Math.max(0,tm.end-Date.now()):tm.rem;
 useEffect(()=>{const t=setInterval(()=>{force(v=>v+1);if(tm&&tm.m=='run'&&tm.end<=Date.now()){Vibration.vibrate([0,150,100,150]);next()}},250);return()=>clearInterval(t)},[tm,i]);
 function next(){const d=done+(s.type!='rest'?1:0);setDone(d);if(i+1>=steps.length)onEnd({n:d,s:Math.round((Date.now()-t0.current)/1000)});else setI(i+1)}
 function tog(){if(tm.m=='run')setTm({...tm,m:'pause',rem:Math.max(0,tm.end-Date.now())});else setTm({...tm,m:'run',end:Date.now()+tm.rem})}
 function plus(){setTm(tm.m=='run'?{...tm,end:tm.end+15000,tot:tm.tot+15000}:{...tm,rem:tm.rem+15000,tot:tm.tot+15000})}
 const quit=()=>Alert.alert('Training beenden?','Der Fortschritt wird nicht gespeichert.',[{text:'Weiter trainieren'},{text:'Beenden',style:'destructive',onPress:onQuit}]);
 const secs=Math.ceil(rem/1000);
 const ring=tm?<View style={{alignItems:'center',marginVertical:10}}><Ring size={190} rings={[{r:84,w:10,col:C.ac,p:rem/tm.tot}]}><Text style={s.big}>{secs}</Text></Ring></View>:null;
 return <SafeAreaView style={s.root}><ScrollView contentContainerStyle={{padding:16,paddingBottom:150}}>
  <View style={s.row}><Text style={s.b}>Übung {x.xi+1} von {B.ne}</Text><Pressable onPress={quit} style={s.sq}><Text style={s.tx}>✕</Text></Pressable></View>
  <View style={s.bar}><View style={[s.barI,{width:(done/B.n*100)+'%'}]}/></View>
  {s.type=='rest'?<>
   <Text style={s.lbl}>Pause</Text><Text style={s.h2}>{s.dur==5?'Kurz wechseln':'Pause – gleich geht’s weiter'}</Text>{ring}
   <View style={s.card}><Text style={s.mu}>Als Nächstes</Text><Text style={s.b}>{e.n}</Text><Text style={s.mu}>Satz {x.s} von {e.sets}{x.sd?' · '+x.sd:''}</Text></View><Fig k={poseKey[x.id]}/></>
  :<>
   <Text style={s.h2}>{e.n}</Text><Text style={[s.mu,{marginBottom:10}]}>Satz {x.s} von {e.sets}{x.sd?' · '+x.sd+'e Seite':''}</Text>
   <Fig k={poseKey[x.id]}/>{s.type=='hold'?ring:<Text style={s.tgt}>{e.t}</Text>}<Text style={s.sm}>{e.d}</Text></>}
 </ScrollView>
 <View style={s.cta}>{s.type=='rest'?<>
   <View style={s.two}><Btn alt t={tm&&tm.m=='run'?'Pause':'Weiter'} on={tog} style={{flex:1}}/><Btn alt t="+15 s" on={plus} style={{flex:1}}/></View><Btn t="Überspringen" on={next}/></>
  :s.type=='hold'?<View style={s.two}><Btn t={tm&&tm.m=='run'?'Pause':tm&&tm.m=='pause'?'Weiter':'Start'} on={tog} style={{flex:1}}/><Btn alt t="Überspringen" on={next} style={{flex:1}}/></View>
  :<Btn t="Satz fertig" on={next}/>}</View></SafeAreaView>}

export default function App(){
 const d0=new Date().getDay();
 const [tab,setTab]=useState('home'),[plan,setPlan]=useState((d0==1||d0==5)?'A':d0==3?'B':'S'),[str,setStr]=useState(true),[rest,setRest]=useState(75);
 const [H,setH]=useState([]),[wk,setWk]=useState(null),[res,setRes]=useState(null),[open,setOpen]=useState(null);
 useEffect(()=>{(async()=>{setStr(await load('str',true));setRest(await load('rest',75));setH(await load('hist',[]))})()},[]);
 const ids=[...PL[plan].ex,...(plan!='S'&&str?ST:[])];
 const nm=PL[plan].n+(plan!='S'&&str?' + Dehnen':'');
 function finish(r){const b0=earned(H);const nh=[...H,{t:Date.now(),p:nm,s:r.s,n:r.n}];const b1=earned(nh);setH(nh);save('hist',nh);
  setRes({...r,nb:BD.filter((b,i)=>b1[i]&&!b0[i]).map(b=>b[0])});setWk(null);Vibration.vibrate([0,200,100,200,100,200])}
 const rs=d=>{const v=Math.min(180,Math.max(15,rest+d));setRest(v);save('rest',v)};
 if(wk)return <Workout ids={wk} rest={rest} onEnd={finish} onQuit={()=>setWk(null)}/>;
 if(res){const m=Math.max(1,Math.round(res.s/60));return <SafeAreaView style={[s.root,{justifyContent:'center',padding:24}]}>
  <Text style={[s.h1,{textAlign:'center'}]}>Geschafft.</Text><Text style={[s.mu,{textAlign:'center',marginVertical:8}]}>{res.n} Sätze in {m} Min.</Text>
  {res.nb.length?<View style={s.card}><Text style={s.mu}>Neues Abzeichen</Text><Text style={[s.b,{color:C.ac,fontSize:20}]}>{res.nb.join(' · ')}</Text></View>:null}
  <Btn alt t="In Apple Health eintragen" on={()=>Linking.openURL('shortcuts://run-shortcut?name=GlowFit&input=text&text='+m).catch(()=>{})} style={{marginTop:16}}/>
  <Btn t="Fertig" on={()=>{setRes(null);setTab(res.nb.length?'bd':'hist')}} style={{marginTop:10}}/></SafeAreaView>}
 const wkH=H.filter(x=>x.t>Date.now()-7*864e5);
 const rings=[{v:wkH.length,g:3,l:'Training',col:C.ac,r:54},{v:wkH.reduce((a,x)=>a+x.s,0)/60,g:75,l:'Minuten',col:C.ac2,r:41},{v:wkH.reduce((a,x)=>a+x.n,0),g:50,l:'Sätze',col:'#9af0e6',r:28}];
 const E2=earned(H);
 return <SafeAreaView style={s.root}><StatusBar barStyle="light-content"/>
  <ScrollView contentContainerStyle={{padding:16,paddingBottom:150}}>
  {tab=='home'&&<>
   <Text style={s.h1}>GlowFit</Text><Text style={s.mu}>Dein nächster Satz.</Text>
   <View style={[s.card,s.row]}><Ring size={130} rings={rings.map(r=>({r:r.r,w:11,col:r.col,p:r.v/r.g}))}/>
    <View style={{flex:1,marginLeft:14}}><Text style={s.b}>Diese Woche</Text>{rings.map(r=><Text key={r.l} style={{color:r.col,fontWeight:'800'}}>{Math.round(r.v)}<Text style={[s.mu,{fontWeight:'400'}]}>/{r.g} {r.l}</Text></Text>)}</View></View>
   <View style={s.two}>{Object.keys(PL).map(k=><Pressable key={k} onPress={()=>setPlan(k)} style={[s.chip,plan==k&&s.chipOn]}><Text style={[s.b,plan==k&&{color:'#02161a'}]}>{PL[k].n}</Text><Text style={[s.mu,{fontSize:12},plan==k&&{color:'#04323a'}]}>{PL[k].s}</Text></Pressable>)}</View>
   <View style={[s.card,s.row]}><View><Text style={s.b}>Satzpause</Text><Text style={s.mu}>im Training anpassbar</Text></View><View style={s.row}><Pressable style={s.sq} onPress={()=>rs(-15)}><Text style={s.tx}>–</Text></Pressable><Text style={[s.b,{marginHorizontal:10}]}>{rest} s</Text><Pressable style={s.sq} onPress={()=>rs(15)}><Text style={s.tx}>+</Text></Pressable></View></View>
   {plan!='S'&&<View style={[s.card,s.row]}><View><Text style={s.b}>Dehnen danach</Text><Text style={s.mu}>5 Dehnübungen am Ende</Text></View><Pressable style={[s.sq,{width:60},str&&{backgroundColor:C.ac}]} onPress={()=>{setStr(!str);save('str',!str)}}><Text style={[s.tx,str&&{color:'#02161a'}]}>{str?'An':'Aus'}</Text></Pressable></View>}
   <View style={s.card}>{ids.map(id=><Pressable key={id} onPress={()=>setOpen(open==id?null:id)} style={s.item}><Text style={s.b}>{E[id].n}</Text><Text style={s.mu}>{E[id].sets>1?E[id].sets+' × ':''}{E[id].t}</Text>
    {open==id&&<View style={{marginTop:8}}><Fig k={poseKey[id]}/><Text style={s.sm}>{E[id].d}</Text></View>}</Pressable>)}</View></>}
  {tab=='glow'&&<><Text style={s.h1}>Glow-up</Text><Text style={s.mu}>Allgemeine persönliche Orientierung, keine Diät- oder Kalorienberechnung.</Text>
   <View style={s.card}>{G.map(g=><Pressable key={g[0]} onPress={()=>setOpen(open==g[0]?null:g[0])} style={s.item}><Text style={s.b}>{g[0]}</Text>{open==g[0]&&g[1].map((t,i)=><Text key={i} style={s.sm}>{t}</Text>)}</Pressable>)}</View></>}
  {tab=='hist'&&<><Text style={s.h1}>Verlauf</Text>
   <View style={[s.card,{alignItems:'center'}]}><Text style={s.tgt}>{wkH.length}</Text><Text style={s.mu}>Einheiten in den letzten 7 Tagen</Text></View>
   {H.length?H.slice().reverse().slice(0,40).map((x,i)=><View key={i} style={[s.card,s.row]}><View><Text style={s.b}>{x.p}</Text><Text style={s.mu}>{new Date(x.t).toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'long'})}</Text></View><Text style={s.mu}>{Math.max(1,Math.round(x.s/60))} Min. · {x.n} Sätze</Text></View>):<Text style={s.mu}>Noch kein Training gespeichert.</Text>}
   <View style={s.card}><Text style={s.b}>Apple Health einrichten</Text><Text style={s.sm}>1. Kurzbefehle-App öffnen, + tippen, Name „GlowFit“.{'\n'}2. Aktion „Workout protokollieren“, Typ Krafttraining.{'\n'}3. Dauer = „Kurzbefehl-Eingabe“, Einheit Minuten.{'\n'}4. Nach dem Training „In Apple Health eintragen“ tippen.</Text></View></>}
  {tab=='bd'&&<><Text style={s.h1}>Abzeichen</Text><Text style={s.mu}>{E2.filter(Boolean).length} von {BD.length} verdient</Text>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginTop:10}}>{BD.map((b,i)=><View key={b[0]} style={[s.card,{width:'48%',margin:0,alignItems:'center',opacity:E2[i]?1:.5}]}>
    <Svg width="56" height="56" viewBox="0 0 56 56"><Circle cx="28" cy="28" r="24" fill={E2[i]?'#12303a':'#0b1115'} stroke={E2[i]?C.ac:'#2a3a44'} strokeWidth="4"/><Polyline points="18,29 25,36 38,22" fill="none" stroke={E2[i]?C.ac:'#2a3a44'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></Svg>
    <Text style={s.b}>{b[0]}</Text><Text style={[s.mu,{textAlign:'center',fontSize:13}]}>{b[1]}</Text></View>)}</View></>}
  </ScrollView>
  {tab=='home'&&<View style={s.cta2}><Btn t="Training starten" on={()=>setWk(ids)}/></View>}
  <View style={s.nav}>{[['home','Training'],['glow','Glow-up'],['hist','Verlauf'],['bd','Abzeichen']].map(([k,l])=><Pressable key={k} style={s.navB} onPress={()=>{setTab(k);setOpen(null)}}><Text style={{color:tab==k?C.ac:C.mu,fontWeight:'700'}}>{l}</Text></Pressable>)}</View>
 </SafeAreaView>}

const s=StyleSheet.create({
 root:{flex:1,backgroundColor:C.bg},tx:{color:C.tx,fontSize:18,fontWeight:'700'},
 h1:{color:C.tx,fontSize:30,fontWeight:'800'},h2:{color:C.tx,fontSize:22,fontWeight:'800'},
 b:{color:C.tx,fontWeight:'700',fontSize:16},mu:{color:C.mu,fontSize:14},sm:{color:C.tx,fontSize:14,lineHeight:20,marginTop:6},
 card:{backgroundColor:C.card,borderColor:C.line,borderWidth:1,borderRadius:18,padding:14,marginVertical:6},
 row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},two:{flexDirection:'row',gap:10},
 chip:{flex:1,padding:12,borderRadius:14,borderWidth:1,borderColor:C.line,backgroundColor:C.card,alignItems:'center'},chipOn:{backgroundColor:C.ac,borderColor:C.ac},
 sq:{width:42,height:42,borderRadius:12,borderWidth:1,borderColor:C.line,backgroundColor:C.card,alignItems:'center',justifyContent:'center'},
 btn:{height:60,borderRadius:18,backgroundColor:C.ac,alignItems:'center',justifyContent:'center'},alt:{backgroundColor:C.card,borderWidth:1,borderColor:C.line},btnT:{color:'#02161a',fontSize:20,fontWeight:'800'},
 cta:{position:'absolute',left:16,right:16,bottom:24,gap:10},cta2:{position:'absolute',left:16,right:16,bottom:84},
 nav:{flexDirection:'row',backgroundColor:'#0a0f12',borderTopWidth:1,borderColor:C.line,paddingBottom:16},navB:{flex:1,height:56,alignItems:'center',justifyContent:'center'},
 fig:{backgroundColor:'#0b1115',borderRadius:14,borderWidth:1,borderColor:C.line,marginVertical:8},
 item:{paddingVertical:10,borderBottomWidth:1,borderColor:C.line},
 bar:{height:6,backgroundColor:C.line,borderRadius:6,overflow:'hidden',marginVertical:10},barI:{height:6,backgroundColor:C.ac},
 lbl:{color:C.ac,fontWeight:'700',marginTop:6},tgt:{color:C.ac,fontSize:44,fontWeight:'800',textAlign:'center',marginVertical:6},
 big:{color:C.tx,fontSize:56,fontWeight:'800'},ringIn:{...StyleSheet.absoluteFillObject,alignItems:'center',justifyContent:'center'}});
