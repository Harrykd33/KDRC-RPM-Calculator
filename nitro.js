function transmissionDiagram(layout,driver){const wheel=(x,r,label)=>'<g transform="translate('+x+' 48)"><circle r="'+r+'" class="nitro-wheel"/><circle r="'+(r*.62)+'" class="nitro-hub"/><circle r="4" class="nitro-wheel"/></g><text x="'+x+'" y="100" text-anchor="middle">'+label+'</text>';let content='';if(layout===2)content=wheel(96,32,'Main')+wheel(144,14,driver);if(layout===3)content=wheel(70,30,'Main')+wheel(119,17,'Idler')+wheel(153,14,driver);if(layout===4)content='<path d="M132 18 L194 36 L194 60 L132 78" class="nitro-belt"/>'+wheel(67,32,'Main')+wheel(119,26,'Compound')+wheel(119,14,'')+wheel(194,12,driver);return '<svg viewBox="0 0 250 106" role="img" aria-label="'+layout+'-gear transmission diagram">'+content+'</svg>'}
// Nitro calculations assume an engaged clutch and a fixed mechanical gear ratio.
function nitroDriveRatio(layout,gears){
 const positive=v=>Number.isFinite(v)&&v>0;
 if(![2,3,4].includes(layout)||!positive(gears.main)||!positive(gears.pinion))throw Error('Enter positive gear values.');
 if(layout===3&&!positive(gears.idler))throw Error('Enter positive idler teeth.');
 if(layout===4&&(!positive(gears.secondary)||!positive(gears.enginePinion)))throw Error('Enter positive second-stage gear values.');
 return gears.main/gears.pinion*(layout===4?gears.secondary/gears.enginePinion:1);
}
function createNitroCalculator(onChange){
 const $=id=>document.getElementById(id),configs={2:{main:82.5,pinion:10},3:{main:82.5,pinion:10,idler:30},4:{main:58,pinion:17,secondary:61,enginePinion:20}};
 const data={active:false,layout:2,maxEngine:15000,measured:false,engineRPM:7500};
 const gearFields={main:'nitroMain',pinion:'nitroPinion',idler:'nitroIdler',secondary:'nitroSecondary',enginePinion:'nitroEnginePinion'};
 function gearDiagram(){$('nitroDiagram').innerHTML=transmissionDiagram(data.layout,'Engine')}
 function syncLayout(){const gears=configs[data.layout];for(const count of [2,3,4])$('nitroGear'+count).checked=data.layout===count;for(const [key,id] of Object.entries(gearFields)){$(id).value=gears[key]||''} $('nitroIdlerField').hidden=data.layout!==3;$('nitroSecondStage').hidden=data.layout!==4;$('nitroPinionLabel').textContent=data.layout===4?'Main pinion T':'Engine pinion T';$('nitroGearNote').textContent=data.layout===4?'Two-stage ratio = (main ÷ main pinion) × (secondary gear ÷ engine pinion). The secondary gear and main pinion share a shaft.':data.layout===3?'Three-gear idler train: ratio = main ÷ engine pinion. The middle idler changes direction but cancels out of the ratio.':'Two-gear ratio = main / equivalent teeth ÷ engine pinion teeth. Fractional main values represent an effective equivalent, not a physical tooth count.';gearDiagram()}
 function setLayout(value){if(![2,3,4].includes(Number(value)))return;data.layout=Number(value);syncLayout();onChange()}
 for(const count of [2,3,4])$('nitroGear'+count).addEventListener('change',()=>setLayout(count));
 for(const [key,id] of Object.entries(gearFields)){
  $(id).addEventListener('input',()=>{const raw=String($(id).value).trim(),n=Number(raw);if(raw&&Number.isFinite(n)&&n>=1&&n<=400&&(key==='main'?Number.isInteger(n*2):Number.isInteger(n))){configs[data.layout][key]=n;onChange()}});
  $(id).addEventListener('change',()=>{$(id).value=configs[data.layout][key]||''});
 }
 for(const [key,prefix,min,max] of [['maxEngine','nitroMax',7500,40000],['engineRPM','nitroRPM',0,40000]]){
  for(const suffix of ['Num','Range']){$(prefix+suffix).value=data[key];$(prefix+suffix).addEventListener('input',()=>{const raw=String($(prefix+suffix).value).trim(),n=Number(raw);if(!raw||!Number.isFinite(n)||n<min||n>max)return;data[key]=n;$(prefix+'Num').value=n;$(prefix+'Range').value=n;onChange()});$(prefix+suffix).addEventListener('change',()=>{$(prefix+suffix).value=data[key]})}
 }
 function syncMeasured(){data.measured=$('nitroMeasured').checked;$('nitroMeasuredControls').hidden=!data.measured;$('nitroMaxControls').hidden=data.measured;$('throttlePanel').hidden=data.active&&data.measured;$('nitroEngineNote').textContent=data.measured?'Head RPM = measured running engine RPM ÷ drive ratio, with the clutch engaged. Engine efficiency affects power and heat; it is not a gear-ratio multiplier.':'Engine RPM estimate = maximum engine RPM × throttle %. Head RPM = engine RPM ÷ drive ratio. Real nitro throttle response is not linear; use measured RPM for a more reliable calculation.';onChange()}
 $('nitroMeasured').addEventListener('change',syncMeasured);
 function calculate(throttle){const ratio=nitroDriveRatio(data.layout,configs[data.layout]);const engine=data.measured?data.engineRPM:data.maxEngine*throttle/100;return {ratio,engine,rpm:engine/ratio}}
 const modelsKey='kevind_rpm_nitro_models_v1';
 const modelKey=x=>x.name.trim().toLowerCase();
 function validModel(x){if(!x||typeof x.name!=='string'||!x.name.trim()||x.name.length>90||![2,3,4].includes(x.layout)||!x.gears)return false;const fields=x.layout===4?['main','pinion','secondary','enginePinion']:x.layout===3?['main','pinion','idler']:['main','pinion'];return fields.every(k=>Number.isFinite(x.gears[k])&&x.gears[k]>=1&&x.gears[k]<=400&&(k==='main'?Number.isInteger(x.gears[k]*2):Number.isInteger(x.gears[k])))}
 function cleanModel(x){const gears={};for(const k of (x.layout===4?['main','pinion','secondary','enginePinion']:x.layout===3?['main','pinion','idler']:['main','pinion']))gears[k]=x.gears[k];return {name:x.name.trim(),layout:x.layout,gears}}
 function savedModels(){try{const rows=JSON.parse(localStorage.getItem(modelsKey)||'[]');return Array.isArray(rows)?rows.filter(validModel).map(cleanModel):[]}catch{return []}}
 function loadModel(item){if(!validModel(item))return;data.layout=item.layout;configs[data.layout]={...cleanModel(item).gears};syncLayout();onChange()}
 function snapshot(){return {name:'Manual Nitro gearing',layout:data.layout,gears:{...configs[data.layout]}}}
 syncLayout();$('nitroMeasuredControls').hidden=true;$('nitroMaxControls').hidden=false;$('nitroEngineNote').textContent='Engine RPM estimate = maximum engine RPM × throttle %. Head RPM = engine RPM ÷ drive ratio. Real nitro throttle response is not linear; use measured RPM for a more reliable calculation.';
 return {data,setLayout,calculate,savedModels,loadModel,snapshot};
}
