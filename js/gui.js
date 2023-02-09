//controls
var gui=new dat.GUI();
var simSwitch,simulationSpeed,orientation,showGrd,grdStep,gravityField,gravity,elevSteady,vel,accel,
    vecVisible,valVisible,magnScale,vCol,aCol,wCol,FCol;

var controls=function() {
	this.simulationSwitch=false;
	this.simulationSpeed=simSpeed;
	this.orientation=frameAngle;
	this.showGrid=gridVisible;
	this.gridStep=gridStep;
	this.gravityField=showPlanet;
	this.gravity=g;
    this.elevSteady=elevatorSteady;
    this.vel=elevatorVelocity;
    this.accel=acceleration;
    this.vecVisible=vectorsVisible;
    this.valVisible=valuesVisible;
    this.magnScale=magnifyScale;
    this.vCol=[vRed,vGreen,vBlue];
    this.aCol=[aRed,aGreen,aBlue];
    this.wCol=[wRed,wGreen,wBlue];
    this.FCol=[FRed,FGreen,FBlue];
};
var cntrls=new controls();

function initGUI(){
	
	if (simSwitch){
		gui.remove(simSwitch);
		simSwitch=null;
	}
	if (simulationSpeed){
		gui.remove(simulationSpeed);
		simulationSpeed=null;
	}
	if (orientation){
		gui.remove(orientation);
		orientation=null;
	}
	if (showGrd){
		gui.remove(showGrd);
		showGrd=null;
	}
	if (grdStep){
		gui.remove(grdStep);
		grdStep=null;
	}
	if (gravityField){
		gui.remove(gravityField);
		gravityField=null;
	}
	if (gravity){
		gui.remove(gravity);
		gravity=null;
	}
	if (elevSteady){
		gui.remove(elevSteady);
		elevSteady=null;
	}
	if (vel){
		gui.remove(vel);
		vel=null;
	}
	if (accel){
		gui.remove(accel);
		accel=null;
	}
	if (vecVisible){
		gui.remove(vecVisible);
		vecVisible=null;
	}
	if (valVisible){
		gui.remove(valVisible);
		valVisible=null;
	}
	if (magnScale){
		gui.remove(magnScale);
		magnScale=null;
	}
	if (vCol){
		gui.remove(vCol);
		vCol=null;
	}
	if (aCol){
		gui.remove(aCol);
		aCol=null;
	}
	if (wCol){
		gui.remove(wCol);
		wCol=null;
	}
	if (FCol){
		gui.remove(FCol);
		FCol=null;
	}

	gui.width=350;	

    if (fullInterface || !showPlanet){
    	simSwitch=gui.add(cntrls,"simulationSwitch").listen().name("Προσομοίωση");
        simSwitch.onChange(function(newValue){
        	simulating=newValue;
        	handleTimer(simulating);
        	if (newValue) reset();
        });

    	simulationSpeed=gui.add(cntrls,"simulationSpeed",1,20).step(1).name("Βραδύτητα προσομοίωσης");
    	simulationSpeed.onChange(function(newValue){
    		simSpeed=newValue;
    		defineSimulationSpeed();
        });
    }
	
	orientation=gui.add(cntrls,"orientation",0,360).step(1).name("Προσανατολισμός");
	orientation.onChange(function(newValue){
		frameAngle=newValue;
		drawScene();
    });

	showGrd=gui.add(cntrls,"showGrid").listen().name("Πλέγμα");
	showGrd.onChange(function(newValue){
		gridVisible=newValue;
		drawScene();
	});
	
	grdStep=gui.add(cntrls,"gridStep",1,5).step(1).name("Βήμα πλέγματος");
	grdStep.onChange(function(newValue){
		gridStep=newValue;
		drawScene();
    });

	if (fullInterface || !showPlanet){
		vel=gui.add(cntrls,"vel",-5,5).step(1).name("ταχύτητα θαλάμου");
		vel.onChange(function(newValue){
			elevatorVelocityInit=newValue;
			reset();
	    });

		accel=gui.add(cntrls,"accel",-5,5).step(1).name("επιτάχυνση θαλάμου");
		accel.onChange(function(newValue){
			elevatorTopInit=180;
			acceleration=newValue;
			reset();
	    });

	    elevSteady=gui.add(cntrls,"elevSteady").listen().name("Σύστ.Αναφ. Ανελκυστήρα");
	    elevSteady.onChange(function(newValue){
	    	elevatorTopInit=180;
	    	elevatorSteady=newValue;
	    	reset();
	    });
	}
	if(!fullInterface){
		gravityField=gui.add(cntrls,"gravityField").listen().name("Βαρυτικό Πεδίο");
		gravityField.onChange(function(newValue){
	    	showPlanet=newValue;
	    	g=10;
	    	//drawScene();
	    	reset();
	    	initGUI();
	    });
	}
	
	if (showPlanet){
		gravity=gui.add(cntrls,"gravity",0,maxGravity).step(1).name("Ένταση βαρ. πεδίου");
		gravity.onChange(function(newValue){
			g=newValue;
			reset();
			/*nextFrame();
			drawScene();*/
	    });
	}

    vecVisible=gui.add(cntrls,"vecVisible").listen().name("Εμφάνιση διανυσμάτων");
    vecVisible.onChange(function(newValue){
    	vectorsVisible=newValue;
    	drawScene();
    });
    
    valVisible=gui.add(cntrls,"valVisible").listen().name("Εμφάνιση μετρήσεων");
    valVisible.onChange(function(newValue){
    	valuesVisible=newValue;
    	placeVectors();
    	drawScene();
    	initGUI();
    });
    
    if(valuesVisible){
        magnScale=gui.add(cntrls,"magnScale").listen().name("Μεγέθυνση");
        magnScale.onChange(function(newValue){
        	magnifyScale=newValue;
        	drawScene();
        });
    }
    
    if (fullInterface || !showPlanet){
    	vCol=gui.addColor(cntrls,"vCol").name("Χρώμα ταχύτητας");
    	vCol.onChange(function(value){
    		vRed=parseInt(value[0]);
    		vGreen=parseInt(value[1]);
    		vBlue=parseInt(value[2]);
    		setVectorsColors();
    		drawScene();
        });

    	aCol=gui.addColor(cntrls,"aCol").name("Χρώμα επιτάχυνσης");
    	aCol.onChange(function(value){
    		aRed=parseInt(value[0]);
    		aGreen=parseInt(value[1]);
    		aBlue=parseInt(value[2]);
    		setVectorsColors();
    		drawScene();
        });    	
    }

	wCol=gui.addColor(cntrls,"wCol").name("Χρώμα βάρους");
	wCol.onChange(function(value){
		wRed=parseInt(value[0]);
		wGreen=parseInt(value[1]);
		wBlue=parseInt(value[2]);
		setVectorsColors();
		drawScene();
    });


	FCol=gui.addColor(cntrls,"FCol").name("Χρώμα δύναμης F");
	FCol.onChange(function(value){
		FRed=parseInt(value[0]);
		FGreen=parseInt(value[1]);
		FBlue=parseInt(value[2]);
		setVectorsColors();
		drawScene();
    });
}