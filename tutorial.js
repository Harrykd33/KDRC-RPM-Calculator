// First-run feature tour. All progress stays in this browser.
function startCalculatorTutorial(){
 const $=id=>document.getElementById(id),dialog=$('tutorialDialog'),card=$('tutorialCard'),seenKey='kevind_rpm_tutorial_v1';
 const electricSteps=[
 ['resultPanel','Your estimated head speed','This is your estimated rotor RPM. The motor speed and drive ratio appear below it.'],
 ['modelSelectors','Choose a verified model','Select a brand and model to load published, verified gearing. Confirm it matches your installed drivetrain.'],
 ['customGearing','Use your own gearing','Check Saved Models to enter your own teeth or choose a saved offline model. Brand and model selection will be greyed out.'],
 ['gearingPanel','Check the drivetrain','Choose 2, 3 or 4 gears beside the diagram. Two gears use main ÷ pinion; a 3-gear idler cancels from the ratio; 4 gears multiply both reductions. Selecting a verified or saved model restores its equivalent two-gear setup, so the reduction is not counted twice.'],
 ['kvNum','Set your motor KV','Enter the motor KV or move its slider. The starting value is 830 KV.'],
 ['cellsRange','Match your battery','Choose 2S through 16S to match your pack. S is the number of cells in series; pack voltage is cell count multiplied by volts per cell. The starting value is 8S.'],
 ['voltsRange','Nominal versus full-charge voltage','A standard LiPo is rated at 3.7 V per cell nominal and reaches 4.2 V fully charged. Nominal is a reference for comparison; using only full-charge voltage can overstate the RPM available later in a flight.'],
 ['voltsRange','Choose a realistic flight voltage','For a better estimate, use measured voltage under load because voltage falls during discharge and sags under heavy load. This app starts at 3.85 V per cell as an adjustable example, not the nominal rating. Choose 3.7 V for a nominal standard-LiPo estimate.'],
 ['effRange','Allow for efficiency','This separate factor estimates drivetrain and motor losses. The 90% default is an assumption, not a measured efficiency. Throttle percentage and system efficiency are different values.'],
 ['throttleRange','Why start around 80%?','A target around 80% can leave governor headroom to add output when rotor load increases or battery voltage falls. Around 70–90% can be a useful starting range when supported by your governor mode: too low can be inefficient, while too high leaves little compensation room.'],
 ['throttleRange','Governor settings depend on your setup','80% is not a universal peak-efficiency setting or a guaranteed 20% power reserve. Follow your ESC governor instructions and check actual RPM and temperatures. This calculator uses a simple linear estimate, not a governor simulation. Electric RPM shifts toward red below 80%, reaching full red at 50% or lower; above 80% it also shifts toward red. These colors are visual guides, not danger limits.'],
 ['manageModelsLink','Save personal models','Manage Models lets you save and back up offline custom gearing on this device. Database verification and publishing tools are behind the PIN.'],
 ['reset','Reset battery and output','Reset restores battery cells, volts per cell, efficiency and throttle. Your motor KV, model selection and gearing stay as you set them.'],
 ['powerSelector','Electric or Nitro','E selects Electric for motor KV and battery calculations. N selects Nitro for engine RPM with 2-, 3- or 4-gear layouts. Each mode keeps its own throttle setting while you switch.'],
 ['tutorialButton','Return any time','Use this Tutorial button whenever you want another tour.']
 ];
 const nitroSteps=[
 ['resultPanel','Nitro head speed','Head RPM is the running engine RPM divided by the drivetrain ratio. The engine RPM and ratio appear under the main readout.'],
 ['powerSelector','Choose your power type','Use E or N at the right of the head speed panel. N uses engine RPM; E restores the Electric motor, battery and gearing calculator.'],
 ['nitroGearLayout','Choose a gear layout','Choose from the horizontal 2, 3 or 4 boxes beside the gears. 2 is the default single reduction; 3 adds an idler; 4 uses a compound two-stage drive. Only one layout is selected at a time.'],
 ['nitroGearInputs','Enter the installed gearing','For 2 gears, divide main / equivalent teeth by engine pinion teeth. For 3 gears, the middle idler cancels from the overall ratio. For 4 gears, multiply main ÷ main pinion by secondary gear ÷ engine pinion.'],
 ['nitroEnginePanel','Set the engine speed','In throttle-estimate mode, maximum engine RPM × throttle gives the estimated running RPM. The starting example uses 15,000 RPM at 50%: 7,500 engine RPM and 909 head RPM with an 8.25:1 ratio.'],
 ['nitroMeasured','Use measured running RPM','Check this option to enter actual engine RPM directly. It bypasses the throttle estimate. With the clutch engaged, mechanical gearing fixes the RPM ratio; efficiency is not multiplied into the speed ratio.'],
 ['throttleRange','Nitro throttle is an estimate','Real nitro engines do not respond linearly to throttle. Mixture, load, clutch slip and governor behavior change the result. Use measured running engine RPM for a more reliable calculation. The color above 80% is only a visual guide.'],
 ['reset','Reset Nitro output','In Nitro mode, Reset sliders returns the throttle estimate to 50%. Your maximum/measured engine RPM and gearing remain unchanged.'],
 ['customGearing','Use your custom models','Check Saved Models to choose a personal offline model, or enter manual Nitro gearing. Manage model opens the offline model editor.'],
 ['tutorialButton','Return any time','Use Tutorial to rerun the guide for the currently selected power type.']
 ];
 let steps=electricSteps;
 let index=0,frame=0,previousFocus=null;
 function remember(){try{localStorage.setItem(seenKey,'1')}catch{}}
 function position(){if(!dialog.open)return;const target=$(steps[index][0]),r=target.getBoundingClientRect(),gap=20,pad=10,height=window.innerHeight;const h=card.getBoundingClientRect().height;let top=r.bottom+gap;if(top+h>height-pad){top=r.top-h-gap;if(top<pad)top=Math.max(pad,height-h-pad)}card.style.top=top+'px';const spot=$('tutorialSpotlight');spot.style.left=Math.max(2,r.left-5)+'px';spot.style.top=Math.max(2,r.top-5)+'px';spot.style.width=r.width+10+'px';spot.style.height=r.height+10+'px';const cr=card.getBoundingClientRect(),below=cr.top>=r.bottom;const startX=cr.left+cr.width/2,startY=below?cr.top-3:cr.bottom+3,endX=Math.max(12,Math.min(window.innerWidth-12,r.left+r.width/2)),endY=below?r.bottom+9:r.top-9;const bend=(startY+endY)/2;$('tutorialArrowPath').setAttribute('d','M '+startX+' '+startY+' Q '+startX+' '+bend+' '+endX+' '+endY)}
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(position)}
 function show(){const step=steps[index];$('tutorialTitle').textContent=step[1];$('tutorialText').textContent=step[2];$('tutorialProgress').textContent='Step '+(index+1)+' of '+steps.length;$('tutorialBack').disabled=index===0;$('tutorialNext').textContent=index===steps.length-1?'Finish':'Next';$(step[0]).scrollIntoView({behavior:'instant',block:'center'});schedule();$('tutorialNext').focus({preventScroll:true})}
 function finish(){remember();dialog.close()}
 function start(){if(dialog.open)return;previousFocus=document.activeElement;steps=$('powerNitro').checked?nitroSteps.filter(step=>step[0]!=='throttleRange'||!$('nitroMeasured').checked):electricSteps;index=0;document.body.classList.add('tutorial-active');dialog.showModal();show()}
 $('tutorialButton').addEventListener('click',start);
 $('tutorialNext').addEventListener('click',()=>{if(index===steps.length-1)finish();else{index++;show()}});
 $('tutorialBack').addEventListener('click',()=>{if(index>0){index--;show()}});
 $('tutorialSkip').addEventListener('click',finish);
 dialog.addEventListener('cancel',remember);
 dialog.addEventListener('close',()=>{remember();cancelAnimationFrame(frame);document.body.classList.remove('tutorial-active');if(previousFocus&&previousFocus.focus)previousFocus.focus({preventScroll:true})});
 window.addEventListener('resize',schedule);window.addEventListener('scroll',schedule,{passive:true});
 if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule);
 let seen=false;try{seen=localStorage.getItem(seenKey)==='1'}catch{}
 if(!seen)start();
}
