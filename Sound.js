import React,{useState} from 'react';
import {View,Text,Pressable,Vibration,StyleSheet} from 'react-native';
import {Audio} from 'expo-av';
import * as FS from 'expo-file-system';
import {get,put} from './api';

const SR=22050;
export const TONES={klingel:'Klingel',gong:'Gong',beep:'Beep',glocke:'Glocke',sanft:'Sanft',aus:'Nur Vibration'};
const NOTES={ // [Hz, Start s, Dauer s, Lautstärke]
 klingel:[1.6,[[880,0,.18,1],[1320,.18,.5,1],[880,.8,.18,1],[1320,.98,.5,1]]],
 gong:[1.8,[[196,0,1.6,1],[392,0,1.2,.5],[588,0,.8,.3]]],
 beep:[.8,[[1000,0,.12,1],[1000,.25,.12,1],[1000,.5,.12,1]]],
 glocke:[1.3,[[1568,0,1.1,1],[2349,0,.8,.6],[3136,0,.5,.3]]],
 sanft:[1.2,[[523,0,.3,1],[659,.2,.3,1],[784,.4,.6,1]]],
 tick:[.15,[[1000,0,.08,1]]]};
export const cfg={tone:'klingel',vib:true,ticks:true};

function wav(len,notes){
 const n=Math.floor(SR*len),f=new Float32Array(n);
 notes.forEach(([hz,t0,du,v])=>{const s=Math.floor(t0*SR),e=Math.min(n,Math.floor((t0+du)*SR));
  for(let i=s;i<e;i++){const t=(i-s)/SR;f[i]+=Math.sin(2*Math.PI*hz*t)*Math.exp(-3*t/du)*Math.min(1,t*200)*v*0.45}});
 const b=new Uint8Array(44+n*2),d=new DataView(b.buffer),w=(o,s)=>{for(let i=0;i<s.length;i++)d.setUint8(o+i,s.charCodeAt(i))};
 w(0,'RIFF');d.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,SR,true);d.setUint32(28,SR*2,true);d.setUint16(32,2,true);d.setUint16(34,16,true);w(36,'data');d.setUint32(40,n*2,true);
 for(let i=0;i<n;i++)d.setInt16(44+i*2,Math.max(-1,Math.min(1,f[i]))*32767,true);
 return b}
const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function b64(u){let o='';for(let i=0;i<u.length;i+=3){const a=u[i],b=u[i+1],c=u[i+2];o+=A[a>>2]+A[((a&3)<<4)|(b>>4)]+(i+1<u.length?A[((b&15)<<2)|(c>>6)]:'=')+(i+2<u.length?A[c&63]:'=')}return o}
const cache={};
async function file(name){if(cache[name])return cache[name];const uri=FS.cacheDirectory+'gf_'+name+'.wav';const [l,n]=NOTES[name];
 await FS.writeAsStringAsync(uri,b64(wav(l,n)),{encoding:FS.EncodingType.Base64});cache[name]=uri;return uri}
export async function play(name,vol=1){if(!NOTES[name])return;try{
 await Audio.setAudioModeAsync({playsInSilentModeIOS:true});
 const {sound}=await Audio.Sound.createAsync({uri:await file(name)},{shouldPlay:true,volume:vol});
 sound.setOnPlaybackStatusUpdate(s=>{if(s.didJustFinish)sound.unloadAsync()})}catch(e){}}
export function ding(){if(cfg.tone!='aus')play(cfg.tone);if(cfg.vib)Vibration.vibrate([0,150,100,150])}
export function tick(){if(cfg.ticks)play('tick',0.6)}
export async function loadSnd(){Object.assign(cfg,await get('snd',{}));try{await file('tick');if(cfg.tone!='aus')await file(cfg.tone)}catch(e){}}

const C={card:'#10161b',line:'#1e2a32',ac:'#46e6d6',tx:'#f3f8f9',mu:'#8a9aa3'};
export function SoundCard(){
 const [,f]=useState(0);
 const set=(k,v)=>{cfg[k]=v;put('snd',cfg);f(x=>x+1)};
 const Tg=({k,l})=><View style={s.row}><Text style={s.tx}>{l}</Text><Pressable onPress={()=>set(k,!cfg[k])} style={[s.sw,cfg[k]&&{backgroundColor:C.ac}]}><Text style={[s.swT,cfg[k]&&{color:'#02161a'}]}>{cfg[k]?'An':'Aus'}</Text></Pressable></View>;
 return <View style={s.card}><Text style={s.b}>Timer-Ton</Text><Text style={s.mu}>Tippe auf einen Ton, um ihn zu hören.</Text>
  <View style={s.wrap}>{Object.keys(TONES).map(k=><Pressable key={k} onPress={()=>{set('tone',k);play(k)}} style={[s.chip,cfg.tone==k&&s.on]}><Text style={[s.chipT,cfg.tone==k&&{color:'#02161a'}]}>{TONES[k]}</Text></Pressable>)}</View>
  <Tg k="vib" l="Vibration am Ende"/><Tg k="ticks" l="Countdown-Töne (3, 2, 1)"/></View>}
const s=StyleSheet.create({card:{backgroundColor:C.card,borderColor:C.line,borderWidth:1,borderRadius:18,padding:14,marginVertical:6},b:{color:C.tx,fontWeight:'700',fontSize:16},mu:{color:C.mu,fontSize:14},tx:{color:C.tx,fontSize:15},
 wrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginVertical:10},chip:{paddingVertical:9,paddingHorizontal:14,borderRadius:20,borderWidth:1,borderColor:C.line,backgroundColor:'#0b1115'},on:{backgroundColor:C.ac,borderColor:C.ac},chipT:{color:C.tx,fontWeight:'600',fontSize:14},
 row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:6},sw:{width:60,height:36,borderRadius:12,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},swT:{color:C.tx,fontWeight:'700'}});
