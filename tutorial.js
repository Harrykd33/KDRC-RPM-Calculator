// First-run feature tour. All progress stays in this browser.
function startCalculatorTutorial(){
 const $=id=>document.getElementById(id),dialog=$('tutorialDialog'),card=$('tutorialCard'),seenKey='kevind_rpm_tutorial_v1';
 const steps=[
 ['resultPanel','Your estimated head speed','This is your estimated rotor RPM. The motor speed and drive ratio appear below it.'],
 ['modelSelectors','Choose a verified model','Select a brand and model to load published, verified gearing. Confirm it matches your installed drivetrain.'],
 ['customGearing','Use your own gearing','Check Custom gearing to enter your own teeth or choose a saved offline model. Brand and model selection will be greyed out.'],
 ['gearingPanel','Check the drivetrain','Main / equivalent teeth divided by pinion teeth gives the drive ratio. For custom direct drive, enter 1 and 1. Source details appear below.'],
 ['kvNum','Set your motor KV','Enter the motor KV or move its slider. The starting value is 830 KV.'],
 ['cellsRange','Match your battery','Choose the battery cell count. The starting value is 8S.'],
 ['voltsRange','Adjust volts per cell','Set the voltage per cell used in the estimate. Battery voltage changes during a flight.'],
 ['effRange','Allow for efficiency','Adjust the estimated drivetrain and motor efficiency to suit your setup.'],
 ['throttleRange','Explore throttle output','Move this slider to estimate head speed at different outputs. Above 80%, the RPM number shifts from orange toward red.'],
 ['manageModelsLink','Save personal models','Manage Models lets you save and back up offline custom gearing on this device. Database verification and publishing tools are behind the PIN.'],
 ['reset','Reset your setup','Reset restores the starting motor and battery settings and the selected gearing.'],
 ['tutorialButton','Return any time','Use this Tutorial button whenever you want another tour.']
 ];
 let index=0,frame=0,previousFocus=null;
 function remember(){try{localStorage.setItem(seenKey,'1')}catch{}}
 function position(){if(!dialog.open)return;const target=$(steps[index][0]),r=target.getBoundingClientRect(),gap=20,pad=10,height=window.innerHeight;const h=card.getBoundingClientRect().height;let top=r.bottom+gap;if(top+h>height-pad){top=r.top-h-gap;if(top<pad)top=Math.max(pad,height-h-pad)}card.style.top=top+'px';const spot=$('tutorialSpotlight');spot.style.left=Math.max(2,r.left-5)+'px';spot.style.top=Math.max(2,r.top-5)+'px';spot.style.width=r.width+10+'px';spot.style.height=r.height+10+'px';const cr=card.getBoundingClientRect(),below=cr.top>=r.bottom;const startX=cr.left+cr.width/2,startY=below?cr.top-3:cr.bottom+3,endX=Math.max(12,Math.min(window.innerWidth-12,r.left+r.width/2)),endY=below?r.bottom+9:r.top-9;const bend=(startY+endY)/2;$('tutorialArrowPath').setAttribute('d','M '+startX+' '+startY+' Q '+startX+' '+bend+' '+endX+' '+endY)}
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(position)}
 function show(){const step=steps[index];$('tutorialTitle').textContent=step[1];$('tutorialText').textContent=step[2];$('tutorialProgress').textContent='Step '+(index+1)+' of '+steps.length;$('tutorialBack').disabled=index===0;$('tutorialNext').textContent=index===steps.length-1?'Finish':'Next';$(step[0]).scrollIntoView({behavior:'instant',block:'center'});schedule();$('tutorialNext').focus({preventScroll:true})}
 function finish(){remember();dialog.close()}
 function start(){if(dialog.open)return;previousFocus=document.activeElement;index=0;document.body.classList.add('tutorial-active');dialog.showModal();show()}
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
