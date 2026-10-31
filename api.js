import AsyncStorage from '@react-native-async-storage/async-storage';
export const get=async(k,d)=>{try{const v=await AsyncStorage.getItem('gf_'+k);return v?JSON.parse(v):d}catch(e){return d}};
export const put=(k,v)=>AsyncStorage.setItem('gf_'+k,JSON.stringify(v)).catch(()=>{});
export async function orChat(messages,temp=0.4){
 const key=String(await get('orkey','')).trim(),model=String(await get('ormodel','openai/gpt-4o-mini')).trim();
 if(!key)throw new Error('API-Key fehlt. Trage ihn im Tab „Heute“ unter KI-Einstellungen ein.');
 const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key,'X-Title':'GlowFit'},body:JSON.stringify({model,temperature:temp,messages})});
 const j=await r.json();
 if(!r.ok)throw new Error((j.error&&j.error.message)||('Fehler '+r.status));
 return String(j.choices[0].message.content)}
export const SYS_FOOD='Du schätzt Nährwerte für Mahlzeiten. Antworte NUR mit JSON ohne weiteren Text: {"name":string,"kcal":number,"protein":number,"carbs":number,"fat":number}. Alle Werte gelten für die gesamte beschriebene oder abgebildete Portion (kcal bzw. Gramm). Gib eine realistische Schätzung.';
export function parseFood(t,fallback){const m=String(t).match(/\{[\s\S]*\}/);if(!m)throw new Error('Die KI hat keine Werte geliefert.');const o=JSON.parse(m[0]);const n=x=>Math.max(0,Math.round(Number(x)||0));
 return {id:Date.now(),name:String(o.name||fallback||'Mahlzeit').slice(0,60),kcal:n(o.kcal),p:n(o.protein),c:n(o.carbs),f:n(o.fat)}}
