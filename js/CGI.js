/**
 * Basic program 
 */

var programName="Γενική Σχετικότητα: 2. Ανελκυστήρας";

var canvas=document.getElementById("picDraw");
var context=canvas.getContext("2d");
var gridVisible=true;
var gridBase=10;
var gridStep=5;
var experimentInitialised=false;
var changingSimulationParameters=false;
var simSpeed=1;
var simulating=false;
var gridOrigin=0;

$(document).ready(function(){
	/*canvas.addEventListener('mousemove', function(evt) {
	var mousePos=getMousePos(canvas,evt);
    var message="Θέση: ["+mousePos.x+","+mousePos.y+"]";
	writeMessage(message);
  }, false);*/
	document.title=programName;
	$("#title").text(programName);
});

function clearGraphics(){
    context.clearRect(0,0,canvas.width,canvas.height);
}

function simulate(){
    if(!changingSimulationParameters){
    	nextFrame();
    }
}

function writeMessage(message){
    var newTxt=document.getElementById("mouseCoords");
    newTxt.innerHTML=message;
}

/*function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(evt.clientX - rect.left),
      y: Math.floor(evt.clientY - rect.top)
    };
}*/

/*function writeDebugInfo(msg){
    var newTxt=document.getElementById("debugInfo");
    newTxt.innerHTML=msg;	
}*/

function showGrid(){
	var i;
	var j;
	if (gridVisible){
		context.lineWidth=1;
		context.strokeStyle="rgba(0,0,0,0.1)";
		for(i=-canvas.width;i<canvas.width;i=i+gridBase*gridStep){
			context.beginPath();
			context.moveTo(i,-canvas.height);
			context.lineTo(i,canvas.height);
			context.stroke();
		}
		for(j=-canvas.height;j<canvas.height;j=j+gridBase*gridStep){
			context.beginPath();
			context.moveTo(-canvas.width,j+gridOrigin);
			context.lineTo(canvas.width,j+gridOrigin);
			context.stroke();
		}
	}
}

function defineSimulationSpeed(){
	clearInterval(timerLoop);
	if (simulating) handleTimer(true);
}

function showDebugInfo(msg){
	document.getElementById("debugInfo").innerHTML=msg;
}