// Shared built-in models and fallback source-checked gearing.

const catalog={
'Custom':['Custom helicopter'],
'Goosky':['RS4','RS5','RS5 Ultra','RS6','RS6 Ultra','RS7','RS7 Ultra','E7'],
'SAB Goblin':['RAW 700','RAW 700 Piuma','RAW 700 Nitro','RAW 580','RAW 420','RAW 500','iL Goblin 590','iL Competizion','iL Piuma','Kraken 700','Goblin 700 Competition','Goblin 570','Goblin 650','Goblin 770'],
'XLPower':['Stratos 200','Stratos 700','Specter 700 V2','Specter Ultimate','Nimbus 550','Protos 380','Protos 500'],
'OMP Hobby':['M2','M4','M5','M7','M7N'],
'Tron':['Tron 5.5','Tron 7.0','Tron 7.0 Advance','Tron Heritage'],
'Mikado':['Logo 200','Logo 480','Logo 550','Logo 600','Logo 700','Logo 800'],
'Align':['T-Rex 470','T-Rex 500','T-Rex 550','T-Rex 600','T-Rex 700','T-Rex 760'],
'Soxos':['Soxos 550','Soxos 600','Soxos 700','Soxos 800'],
'MSH':['Protos 380','Protos 500','Protos 700'],
'Synergy':['516','696','766'],
'Gaui':['X3','X5','X7'],
'KDS':['Agile 5.5','Agile 7.5','Agile A5','Agile A7'],
'Other':['Custom / other model']};
const presets={
'SAB Goblin|RAW 700':{main:212,pinions:[18,19,20,21,22,23,24,25],standard:21,source:'Manual-derived effective 212T two-stage equivalent. Confirm revision and installed pulley.',url:'https://www.manualslib.com/manual/2054613/Sab-Heli-Division-Goblin-Raw-700.html'},
'SAB Goblin|RAW 700 Piuma':{main:216,pinions:[18,19,20,21,22,23],standard:20,source:'Manual-derived effective 216T two-stage equivalent. Confirm revision and installed pulley.',url:'https://device.report/m/e96085d1f5993b2585ca44cf3320ce8c0b2188635fc6f078865a2f42a533bab5'},
'Goosky|RS6':{main:107,pinions:[12,13],standard:12,source:'RS6 specifications: 107T main gear, documented 12T (8.917:1) and 13T (8.231:1). Factory-installed pinion not independently established.',url:'https://manuals.plus/asin/B0FCDKQJ61'},
'Goosky|RS7':{main:107,pinions:[11,12],standard:11,source:'RS7 instruction manual: 107T main gear; 11T standard (9.727:1), 12T alternative (8.917:1).',url:'https://manuals.plus/m/e8940e8956e3cf705c4d8f256040e3bd0d9961bb5af9cfa04541a928775e5411'},
'Goosky|RS7 Ultra':{main:116,pinions:[12,13],standard:13,source:'RS7 Ultra instruction manual: 116T main gear; 13T standard (~8.923:1), 12T alternative (~9.667:1).',url:'https://manuals.plus/m/0783ef8f52ed93f3bd07b310b2460cda922f27d4ee65cce88384a753315ca8d3'},
'Tron|Tron 7.0':{main:155,pinions:[16],standard:16,source:'Manufacturer product specification: 155T main gear and 16T pinion included (9.6875:1). Other pinions not verified here.',url:'https://tronhelicopters.com/produkt/tron-7-0/'},
'Tron|Tron 7.0 Advance':{main:151,pinions:[15,16,17,18],standard:16,source:'Manufacturer drivetrain catalog: 151T herringbone main gear and 15–18T herringbone pinions; kit page lists 16T included. Confirm drivetrain revision.',url:'https://tronhelicopters.com/produkt-kategorie/tron-7-0-advance-drivertain-parts/'}
};

// Only the catalogue published with this site establishes global verification.
const gearingKey=x=>x.brand.trim().toLowerCase()+'|'+x.model.trim().toLowerCase();
const validVerified=x=>x&&typeof x.brand==='string'&&x.brand.trim()&&x.brand.length<=70&&typeof x.model==='string'&&x.model.trim()&&x.model.length<=90&&Number.isInteger(x.main)&&x.main>=30&&x.main<=400&&Number.isInteger(x.standard)&&x.standard>=8&&x.standard<=40&&typeof x.source==='string'&&x.source.trim()&&x.source.length<=1000&&(!x.url||(typeof x.url==='string'&&/^https?:\/\//i.test(x.url)));
const catalogReady=(async()=>{
 try{
  const response=await fetch('./verified-gearing.json',{cache:'no-cache'});
  if(!response.ok)throw Error('Catalogue unavailable');
  const data=await response.json();
  if(data.format!=='KevinD-RC-verified-v1'||!Array.isArray(data.models)||data.models.length>1000||!data.models.every(validVerified)||new Set(data.models.map(gearingKey)).size!==data.models.length)throw Error('Invalid verified catalogue');
  for(const k of Object.keys(presets))delete presets[k];
  for(const item of data.models){
   const brand=Object.keys(catalog).find(b=>b.toLowerCase()===item.brand.trim().toLowerCase())||item.brand.trim();
   if(!Object.hasOwn(catalog,brand))Object.defineProperty(catalog,brand,{value:[],enumerable:true,writable:true,configurable:true});
   const model=catalog[brand].find(m=>m.toLowerCase()===item.model.trim().toLowerCase())||item.model.trim();
   if(!catalog[brand].includes(model))catalog[brand].push(model);
   presets[brand+'|'+model]={...item,brand,model};
  }
  return true;
 }catch(error){console.warn('Using bundled gearing catalogue:',error.message);return false}
})();
