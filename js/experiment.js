var fullInterface=true;
var planetLeft=-180;
var planetTop=330;
var showPlanet=true;
var personMass=80;
var gEarth=10; //Earth's acceleration of gravity
var maxGravity=20;
var g=10; //acceleration of gravity
var personLeft=180;
var personTop=170;
var elevatorLeft=250;
var elevatorTopInit=180;
var elevatorTop=elevatorTopInit;
var scale1Left=0;
var scale1Top=0; 
var scale2Left=0;
var scale2Top=0; 
var t=0;
var projectionVisible=false;
var elevatorSteady=false;
var vectorsVisible=false;
var valuesVisible=false;
var elevatorVelocityInit=0;
var elevatorVelocity=elevatorVelocityInit;
var acceleration=0;
var externalForce=0;
var scaleFactor=4;
var forceScaleFactor=0.1;
var magnifyScale=false;

//frame of reference
var userDefinedFrame=false;
var frameAngle=0;
var newOriginX=0;
var newOriginY=0;

//vector colors
var vRed=255;
var vGreen=0;
var vBlue=0;
var aRed=0;
var aGreen=255;
var aBlue=255;
var wRed=0;
var wGreen=0;
var wBlue=255;
var FRed=0;
var FGreen=255;
var FBlue=0;

var gField=new vector(100,100,context);
var v=new vector(100,100,context);
var a=new vector(100,100,context);
var w=new vector(100,100,context);
var F=new vector(100,100,context);

function initialiseExperiment(){
	experimentInitialised=false;
	newOriginX=canvas.width/2;
	newOriginY=canvas.height/2;
	initGUI();
	reset();
	experimentInitialised=true;
	drawScene();
}

/*function previousFrame(){
	clock1.setValue(clock1.m_Value-1);
	clock2.setValue(clock2.m_Value-1);
	ray.trailX.splice(ray.trailX.length-1,1); 
	ray.trailY.splice(ray.trailY.length-1,1);
	drawScene();
}*/

function nextFrame(){
	if (showPlanet && !fullInterface){
		externalForce=personMass*g;
	}
	else{
		if (elevatorSteady){
			gridOrigin=elevatorVelocityInit*t+0.5*acceleration*Math.pow(t,2);
			//showDebugInfo("elevatorVelocityInit="+elevatorVelocityInit+" , gridOrigin="+gridOrigin);
			while (gridOrigin>=gridBase*gridStep) {
				gridOrigin-=gridBase*gridStep;
			}
			while (gridOrigin<=-gridBase*gridStep){
				gridOrigin+=gridBase*gridStep;
			}
		}
		else{
			elevatorTop=elevatorTopInit-elevatorVelocityInit*t-0.5*acceleration*Math.pow(t,2);		
			if (elevatorTop<-elevator.height){
				elevatorTopInit+=canvas.height+elevator.height-newOriginY;
			}
			if (elevatorTop>=canvas.height+1){
				elevatorTopInit-=canvas.height+elevator.height;
			}
		}
		elevatorVelocity=elevatorVelocityInit+acceleration*t;
		v.value(scaleFactor*elevatorVelocity);
		a.value(-scaleFactor*acceleration);
		externalForce=Math.max(personMass*acceleration+personMass*g,0);
		//showDebugInfo("t="+t+" , externalForce="+externalForce);
	}
	w.value(forceScaleFactor*personMass*g);
	F.value(forceScaleFactor*externalForce);
	placeVectors();
	t+=0.2;
	drawScene();
}

function reset(){
	t=0;
	gridOrigin=0;
	document.getElementById("btnNextFrame").disabled=false;
	elevatorTop=elevatorTopInit;
	initialiseVectors();
	drawScene();
}

function drawScene(){
	if (experimentInitialised){
		clearGraphics();
		setReferenceFrame();
		showGrid();
		placeScales();
		placePerson();
		placeVectors();
		drawBackground();
		drawVectors();
		restoreReferenceFrame();
		if (valuesVisible) printValues();
	}
}

function setReferenceFrame(){
	if (!userDefinedFrame){
		userDefinedFrame=true;
		context.save();
		// move the origin to center of canvas   
		context.translate(newOriginX,newOriginY); 
		context.rotate(frameAngle*Math.PI/180);
	}
}

function restoreReferenceFrame(){
	if(userDefinedFrame){
		userDefinedFrame=false;
		context.restore();
	}
}

function drawBackground(){
	if (showPlanet && !fullInterface){
		context.globalAlpha=g/maxGravity;
		context.drawImage(planet,planetLeft-newOriginX,planetTop-newOriginY);
		context.globalAlpha=1;
		context.drawImage(planetSketch,planetLeft-newOriginX,planetTop-newOriginY);
	}
    context.drawImage(elevator,elevatorLeft-newOriginX,elevatorTop-newOriginY);
    context.drawImage(person,personLeft,personTop);
    if(valuesVisible){
        context.drawImage(scale2,scale2Left,scale2Top-newOriginY);
        if(magnifyScale){
        	context.drawImage(lens,scale2Left-5,scale2Top-10-newOriginY);
        	restoreReferenceFrame();
        	context.drawImage(scale1,scale1Left,scale1Top);
        	setReferenceFrame();
        }
    }
}

function placeScales(){
	scale1Left=canvas.width-scale1.width;//-newOriginX;
	scale1Top=canvas.height-scale1.height+3;//-newOriginY;
	scale2Left=elevatorLeft+(elevator.width-scale2.width)/2-newOriginX;
	scale2Top=elevatorTop+elevator.height-scale2.height-6;//-newOriginY;
}

function placePerson(){
	personLeft=elevatorLeft+(elevator.width-person.width)/2-newOriginX;
	if(valuesVisible){
		personTop=scale2Top-person.height-newOriginY;
	}
	else{
		personTop=elevatorTop+elevator.height-person.height-6-newOriginY;
	}
}

function initialiseVectors(){
	elevatorVelocity=elevatorVelocityInit+acceleration*t;
	v.value(scaleFactor*elevatorVelocity);
	v.setInitAngle(3*Math.PI/2);
	v.setAngle(3*Math.PI/2);

	a.value(-scaleFactor*acceleration);
	a.setInitAngle(Math.PI/2);
	a.setAngle(Math.PI/2);

	w.value(forceScaleFactor*personMass*g);
	w.setInitAngle(Math.PI/2);
	w.setAngle(Math.PI/2);

	externalForce=Math.max(personMass*acceleration+personMass*g,0);
	F.value(forceScaleFactor*externalForce);
	F.setInitAngle(3*Math.PI/2);
	F.setAngle(3*Math.PI/2);
	
	gField.value(6*g);
	gField.setInitAngle(Math.PI/2);
	gField.setAngle(Math.PI/2);
	
	placeVectors();
	setVectorsColors();
}

function placeVectors(){
	v.move(elevatorLeft-30-newOriginX,Math.round(elevatorTop+elevator.height/2-newOriginY));
	a.move(elevatorLeft-50-newOriginX,Math.round(elevatorTop+elevator.height/2-newOriginY));
	w.move(Math.round(elevatorLeft+elevator.width/2)-newOriginX,personTop+person.height);
	F.move(Math.round(elevatorLeft+elevator.width/2)-newOriginX,personTop+person.height);
	gField.move(-200,0);
}

function setVectorsColors(){
	v.m_Red=vRed;
	v.m_Green=vGreen;
	v.m_Blue=vBlue;
	a.m_Red=aRed;
	a.m_Green=aGreen;
	a.m_Blue=aBlue;
	w.m_Red=wRed;
	w.m_Green=wGreen;
	w.m_Blue=wBlue;
	F.m_Red=FRed;
	F.m_Green=FGreen;
	F.m_Blue=FBlue;
}

function drawVectors(){
	gField.show();
	if (vectorsVisible){
		if (fullInterface || !showPlanet){
			v.show();
			a.show();
		}
		w.show();
		F.show();
	}
}

function printValues(){
	//πίνακας τιμών
	var y=50;
	if (fullInterface || !showPlanet){
		context.font="20px Georgia";
		context.fillStyle="rgb("+vRed+","+vGreen+","+vBlue+")";
		context.fillText("υ="+Math.round(100*elevatorVelocity)/100+" m/s",10,y);
		y+=30;
		context.fillStyle="rgb("+aRed+","+aGreen+","+aBlue+")";
		context.fillText("α="+acceleration+" m/s",10,y);
		context.font="16px Georgia";
		if(acceleration>0){
			context.fillText("2",87,y-6);
		}
		else{
			context.fillText("2",95,y-6);			
		}
		y+=30;
	}
	context.font="20px Georgia";
	context.fillStyle="rgb(0,0,0)";
	context.fillText("m="+personMass+" kg",10,y);
	y+=30;
	context.fillText("g=-"+g+" m/s",10,y);
	context.font="16px Georgia";
	if(g>9){
		context.fillText("2",100,y-6);
	}
	else{
		context.fillText("2",92,y-6);
	}
	y+=30;
	context.font="20px Georgia";
	context.fillStyle="rgb("+wRed+","+wGreen+","+wBlue+")";
	context.fillText("w="+personMass*g+" N",10,y);
	y+=30;
	context.fillStyle="rgb("+FRed+","+FGreen+","+FBlue+")";
	context.fillText("F="+externalForce+" N",10,y);
	//Μικρή ζυγαριά
	setReferenceFrame();
	context.font="8px Georgia";
	context.fillText(Math.round(100*externalForce/gEarth)/100,280-newOriginX,elevatorTop+138-newOriginY);
	restoreReferenceFrame();
	//Μεγάλη ζυγαριά
	if (magnifyScale){
		context.font="34px Georgia";
		context.fillText(Math.round(100*externalForce/gEarth)/100,420,405);
	}
}