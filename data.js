const T=[[[55,38,135,6],[58,44,4,61],[183,44,4,61]]];
const Z={
push:[{h:[33,52],c:[[[168,80],[138,74],[105,68],[45,58]],[[45,58],[44,82],[42,105]]],r:[[160,80,30,25]]},{h:[33,80],c:[[[168,80],[138,83],[105,86],[45,85]],[[45,85],[65,92],[42,105]]],r:[[160,80,30,25]]}],
squat:[{h:[100,10],c:[[[95,105],[97,75],[95,50],[97,20]],[[97,20],[108,35],[114,28]]],r:[[112,20,12,18]]},{h:[93,40],c:[[[95,105],[110,80],[72,80],[88,50]],[[88,50],[100,62],[106,56]]],r:[[104,48,12,18]]}],
row:[{h:[128,48],c:[[[80,105],[78,82],[70,60],[115,50]],[[115,50],[117,70],[117,88]]],r:[[110,86,14,14]]},{h:[128,48],c:[[[80,105],[78,82],[70,60],[115,50]],[[115,50],[97,64],[106,74]]],r:[[100,70,14,14]]}],
plank:[{h:[38,72],c:[[[165,102],[135,93],[108,87],[50,75]],[[50,75],[50,100],[75,100]]]}],
pike:[{h:[68,80],c:[[[150,105],[128,70],[105,35],[65,65]],[[65,65],[60,85],[55,105]]]},{h:[72,95],c:[[[150,105],[128,70],[105,38],[62,82]],[[62,82],[75,94],[55,105]]]}],
lunge:[{h:[95,9],c:[[[95,105],[95,76],[95,50],[95,20]],[[88,105],[92,77],[95,50]],[[95,20],[88,36],[96,50]]]},{h:[97,28],c:[[[122,105],[122,78],[95,70],[95,40]],[[45,102],[65,100],[95,70]],[[95,40],[85,55],[96,68]]]}],
table:[{h:[62,93],c:[[[155,105],[140,76],[115,92],[75,91]],[[75,91],[75,66],[75,45]]],r:T[0]},{h:[62,62],c:[[[155,105],[140,70],[115,70],[75,60]],[[75,60],[88,50],[75,45]]],r:T[0]}],
sup:[{h:[58,96],c:[[[168,100],[138,100],[110,100],[70,98]],[[70,98],[50,99],[30,100]]]},{h:[58,86],c:[[[168,82],[138,92],[110,98],[70,94]],[[70,94],[50,86],[28,78]]]}],
snow:[{h:[58,92],c:[[[165,100],[110,98],[70,95]],[[70,95],[50,90],[28,88]]]},{h:[58,92],c:[[[165,100],[110,98],[70,95]],[[70,95],[90,92],[112,90]]]}],
hip:[{h:[47,90],c:[[[140,105],[135,72],[105,98],[60,95]],[[60,95],[75,100],[90,100]]]},{h:[47,88],c:[[[140,105],[138,68],[105,68],[60,90]],[[60,90],[75,98],[90,100]]]}],
leg:[{h:[47,96],c:[[[165,98],[135,98],[105,98],[60,98]],[[60,98],[75,100],[90,100]]]},{h:[47,96],c:[[[105,38],[105,68],[105,98],[60,98]],[[60,98],[75,100],[90,100]]]}],
side:[{h:[50,58],c:[[[165,102],[138,94],[110,86],[60,68]],[[60,68],[58,86],[58,100]],[[60,68],[60,45],[60,25]]]}],
child:[{h:[50,95],c:[[[150,102],[120,100],[105,82],[60,85]],[[60,85],[40,95],[25,100]]]}],
hipf:[{h:[95,28],c:[[[120,105],[125,78],[95,78],[95,40]],[[50,103],[80,100],[95,78]],[[95,40],[105,55],[125,76]]]}],
quad:[{h:[97,9],c:[[[95,105],[95,76],[95,50],[95,20]],[[95,50],[96,80],[72,64]],[[95,20],[88,40],[74,62]]]}],
chest:[{h:[100,9],c:[[[95,105],[95,76],[95,50],[97,20]],[[97,20],[84,40],[72,58]]]}],
neck:[{h:[106,13],c:[[[95,105],[95,76],[95,50],[95,22]],[[95,22],[108,8],[112,12]]]}]};
const E={
push:{n:'Liegestütze, Füße erhöht',k:'r',sets:3,t:'8–15 Wdh.',d:'Füße auf Stuhl oder Sofa, Hände schulterbreit am Boden. Körper bleibt eine gerade Linie. Brust kontrolliert zum Boden senken und kräftig hochdrücken. Zu schwer? Füße tiefer stellen.'},
squat:{n:'Kniebeugen mit Rucksack',k:'r',sets:3,t:'12–15 Wdh.',d:'Vollen Rucksack vor der Brust halten, Füße etwa schulterbreit. Hüfte nach hinten und unten, Rücken gerade, Knie zeigen in Richtung der Zehen. Kräftig aufstehen.'},
row:{n:'Rucksack-Rudern',k:'r',sets:3,t:'12–15 Wdh.',d:'Rucksack mit Büchern oder Wasserflaschen greifen. Oberkörper vorbeugen, Rücken gerade. Rucksack zur Hüfte ziehen, Schulterblätter zusammen, kurz halten, langsam ablassen.'},
plank:{n:'Plank',k:'h',sets:3,s:45,t:'45 Sek.',d:'Unterarme am Boden, Ellbogen unter den Schultern. Körper bildet eine Linie von Kopf bis Ferse. Bauch und Po anspannen, ruhig weiteratmen, Hüfte nicht durchhängen lassen.'},
pike:{n:'Pike-Liegestütze',k:'r',sets:3,t:'8–12 Wdh.',d:'Hände schulterbreit, Hüfte hoch – dein Körper bildet ein umgekehrtes V. Kopf zwischen die Arme senken, dann hochdrücken. Beine möglichst gestreckt.'},
lunge:{n:'Ausfallschritte',k:'r',sets:3,t:'10 pro Bein',d:'Großer Schritt nach vorn, hinteres Knie senkt sich Richtung Boden. Vorderes Knie über dem Fuß, Oberkörper aufrecht. Mit der vorderen Ferse hochdrücken. 10 pro Bein.'},
table:{n:'Tisch-Rudern',k:'r',sets:3,t:'max. Wdh.',d:'Nur unter einem SEHR stabilen Tisch! Auf den Rücken legen, Tischkante greifen, Körper gerade. Brust zur Kante ziehen, Schulterblätter zusammen. Anfangs mit angewinkelten Beinen (leichter). So viele saubere Wiederholungen wie möglich.'},
sup:{n:'Superman',k:'r',sets:3,t:'12 Wdh.',d:'Bauchlage, Arme nach vorn. Arme und Beine gleichzeitig anheben, Blick zum Boden. Oben 2 Sekunden halten, langsam ablegen.'},
snow:{n:'Reverse Snow Angels',k:'r',sets:3,t:'12 Wdh.',d:'Bauchlage, Arme knapp über dem Boden. Arme im Bogen langsam nach oben über den Kopf und wieder zurück zu den Hüften führen. Schulterblätter aktiv zusammenziehen.'},
hip:{n:'Hip Thrusts',k:'r',sets:3,t:'12–15 Wdh.',d:'Rückenlage, Knie angewinkelt, Füße aufgestellt. Hüfte kräftig hochdrücken, oben Po anspannen, langsam absenken.'},
leg:{n:'Beinheben (Core-Finisher)',k:'r',sets:1,t:'12 Wdh.',d:'Rückenlage, Beine gestreckt. Beine senkrecht anheben, kontrolliert fast bis zum Boden senken. Unterer Rücken bleibt am Boden.'},
side:{n:'Seitstütz (Core-Finisher)',k:'h',sets:1,s:30,sides:1,t:'30 Sek. je Seite',d:'Seitlich auf den Unterarm stützen, Körper in einer Linie, Hüfte oben halten. Erst links, dann rechts.'},
child:{n:'Kindhaltung',k:'h',sets:1,s:30,rest:5,t:'30 Sek.',d:'Knie am Boden, Hüfte zu den Fersen, Arme weit nach vorn. Stirn ablegen, tief in den Rücken atmen.'},
hipf:{n:'Hüftbeuger-Dehnung',k:'h',sets:1,s:30,sides:1,rest:5,t:'30 Sek. je Seite',d:'Ausfallschritt auf einem Knie. Becken sanft nach vorn schieben, Oberkörper aufrecht, bis es vorn an der Hüfte zieht.'},
quad:{n:'Oberschenkel-Dehnung',k:'h',sets:1,s:30,sides:1,rest:5,t:'30 Sek. je Seite',d:'Stehen, Ferse zum Po ziehen und Fuß festhalten. Knie zeigen zum Boden, Hüfte nach vorn. Bei Bedarf an der Wand abstützen.'},
chest:{n:'Brustdehnung',k:'h',sets:1,s:30,rest:5,t:'30 Sek.',d:'Hände hinter dem Rücken verschränken, Arme gestreckt nach hinten und oben ziehen. Brust raus, Schultern tief.'},
neck:{n:'Nackendehnung',k:'h',sets:1,s:20,sides:1,rest:5,t:'20 Sek. je Seite',d:'Aufrecht stehen, Ohr zur Schulter neigen, sanft mit der Hand nachhelfen. Gegenüberliegende Schulter bleibt unten.'}};
const ST=['child','hipf','quad','chest','neck'];
const PL={A:{n:'Tag A',s:'Mo / Fr',ex:['push','squat','row','plank']},B:{n:'Tag B',s:'Mittwoch',ex:['pike','lunge','table','sup','snow','hip','leg','side']},S:{n:'Dehnen',s:'ca. 6 Min.',ex:ST}};
const poseKey={push:'push',squat:'squat',row:'row',plank:'plank',pike:'pike',lunge:'lunge',table:'table',sup:'sup',snow:'snow',hip:'hip',leg:'leg',side:'side',child:'child',hipf:'hipf',quad:'quad',chest:'chest',neck:'neck'};
const G=[['Ernährung',['Bei ca. 14 % Körperfett und 60–70 kg lohnt sich keine Diät. Besser: ungefähr Erhaltungsbedarf oder leichter Überschuss und viel Protein (Eier, Quark, Hähnchen, Hülsenfrüchte), damit du Muskeln aufbaust.','Bauchfett wird durch mehr Muskeln optisch weniger. Gezielt am Bauch abnehmen geht nicht.','Viel Wasser, wenig Softdrinks und Süßkram.']],
['Haut',['Morgens: mildes Reinigungsgel, Feuchtigkeitscreme, Sonnencreme.','Abends: Reinigung und Feuchtigkeitscreme.','Bei Pickeln: Produkt mit Salicylsäure oder Niacinamid. 8 Wochen konsequent bleiben, bevor du urteilst.','7–8 Std. Schlaf, Kissenbezug regelmäßig wechseln.']],
['Jawline',['Sichtbar wird sie hauptsächlich durch niedrigen Gesichtsfett-Anteil, gute Haltung und Schlaf. Kauen (z. B. festes Brot, Kaugummi in Maßen) schadet nicht, wirkt aber nur begrenzt.','Kinn leicht einziehen, Kopf aufrecht: Haltung macht optisch viel aus.']],
['Frisur',['Zum Friseur mit der Ansage: „Fade ohne Übergang, beim Ohr startend, oben lang und spiky“. Am besten ein Foto mitbringen.','Zu Hause: Matt-Paste oder Clay in handtuchtrockenes Haar, nach oben formen.']],
['Style und Ausstrahlung',['Passform ist wichtiger als Marke: Oberteile, die an Schultern und Armen anliegen, Hosen nicht zu weit.','Wenige Farben (schwarz, weiß, grau, navy, oliv), die du kombinieren kannst.','Aufrechte Haltung, Blickkontakt, ruhig sprechen.']]];
const wkn=t=>Math.floor((t/864e5+3)/7),cnt=(H,f)=>H.filter(f).length;
const BD=[['Erster Schritt','Erstes Training abgeschlossen.',H=>H.length>=1],
['Dranbleiber','5 Trainings abgeschlossen.',H=>H.length>=5],
['Zehner-Club','10 Trainings abgeschlossen.',H=>H.length>=10],
['Glow-up-Profi','25 Trainings abgeschlossen.',H=>H.length>=25],
['Wochenziel','3 Trainings innerhalb von 7 Tagen.',H=>{const t=H.map(x=>x.t).sort((a,b)=>a-b);return t.some((v,i)=>t[i+2]-v<7*864e5)}],
['Dreier-Serie','3 Wochen hintereinander je 2 Trainings.',H=>{const m={};H.forEach(x=>{const w=wkn(x.t);m[w]=(m[w]||0)+1});return Object.keys(m).some(w=>m[w]>=2&&m[+w+1]>=2&&m[+w+2]>=2)}],
['Tag-A-Meister','5× Tag A trainiert.',H=>cnt(H,x=>x.p.startsWith('Tag A'))>=5],
['Tag-B-Meister','5× Tag B trainiert.',H=>cnt(H,x=>x.p.startsWith('Tag B'))>=5],
['Beweglich','5× gedehnt.',H=>cnt(H,x=>x.p.includes('Dehnen'))>=5],
['Hundert Sätze','100 Sätze insgesamt.',H=>H.reduce((a,x)=>a+x.n,0)>=100]];
const earned=H=>BD.map(b=>b[2](H));
export {Z,E,ST,PL,poseKey,G,BD,earned};
