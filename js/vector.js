/**
 * 
 */


function vector(x,y,context){
	var CircleColor=255;
	var dX=0;
	var dY=0;
	this.m_OriginX=x;
	this.m_OriginY=y;
	this.cntx=context;
	this.m_OriginOffset=0;
	this.m_PointX=0;
	this.m_PointY=0;
	this.m_LeftX=0;
	this.m_LeftY=0;
	this.m_RightX=0;
	this.m_RightY=0;
	this.m_Length=0;
	this.m_InitAngle=0;
	this.m_Angle=0;
	this.m_Period=0;
	this.m_Omega=0;
	this.m_Color=0;
	this.m_Red=0;
	this.m_Green=0;
	this.m_Blue=0;
	this.m_XComponentVisible=false;
	this.m_YComponentVisible=false;
	this.m_ShowSelectedComponent=false;
	this.m_SelectedComponentOrientation=0;
	this.m_RotatoneOnPlane=0;
	this.m_CircleVisible=false;
	this.m_CircleOpaque=false;
	this.m_AxesVisible=false;
	this.m_AngleTicksVisible=false;
	this.m_NoOfAngleTicks=0;
	this.m_AxesColor=0;

	this.m_Visible=true;
	this.m_Value;
	this.m_Grabbed=false;
	
	this.value=function(vNewValue){
		this.m_Value=vNewValue;
		var ArrowHeadSize=this.m_Value/3;
		if(Math.abs(ArrowHeadSize)<3){
			ArrowHeadSize=2*Math.sign(ArrowHeadSize);
		}
		else if(Math.abs(ArrowHeadSize)>10){
			ArrowHeadSize=10*Math.sign(ArrowHeadSize);
		}
		dX=ArrowHeadSize;
		dY=ArrowHeadSize;
		this.updateCoords();
	};
	
	this.move=function(NewX,NewY){
		this.m_OriginX=NewX;
		this.m_OriginY=NewY;
		this.updateCoords();
	};
	
	this.setOriginY=function(vNewValue){
		this.m_OriginY=vNewValue;
		this.updateCoords();
	};
	
	this.setInitAngle=function(vNewValue){
		this.m_InitAngle=vNewValue;
		this.rotateVector(0);
	};
	
	this.setAngle=function(vNewValue){
		this.m_Angle=vNewValue;
		this.updateCoords();
	};
	
	this.setPeriod=function(vNewValue){
		if(vNewValue>0){
			this.m_Period=vNewValue;
			this.m_Omega=2*Math.PI/this.m_Period;
		}
	};

	this.rotateVector=function(t){
		this.setAngle(this.m_InitAngle+this.m_Omega*t);
	};
		
	this.show=function(){
		this.showSimple();
		if(this.m_CircleVisible) this.drawCircle();
		if(this.m_AngleTicksVisible) this.showAngleTicksSimple();
	};

	this.updateCoords=function(){
		//Υπολογισμός συντεταγμένων πέρατος
		this.m_PointX=this.m_OriginX+this.m_Value*Math.cos(this.m_Angle);
		this.m_PointY=this.m_OriginY+this.m_Value*Math.sin(this.m_Angle);
		//Υπολογισμός συντεταγμένων αριστερής πλευράς βέλους
		var p1=this.rotatePoint(this.m_Angle,this.m_Value-dX,dY);
		this.m_LeftX=p1.xPart+this.m_OriginX;
		this.m_LeftY=p1.yPart+this.m_OriginY;
		//Υπολογισμός συντεταγμένων δεξιάς πλευράς βέλους
		var p2=this.rotatePoint(this.m_Angle,this.m_Value-dX,-dY);
		this.m_RightX=p2.xPart+this.m_OriginX;
		this.m_RightY=p2.yPart+this.m_OriginY;
	};

	this.rotatePoint=function(Angl,X1,Y1){
		var X2=X1*Math.cos(Angl)-Y1*Math.sin(Angl);
		var Y2=X1*Math.sin(Angl)+Y1*Math.cos(Angl);
		return {
			xPart : X2,
			yPart : Y2
		};
	};
	
	
	this.showSimple=function(){
		  var X1=0,Y1=0,X2=0,Y2=0;
		  X1=this.m_OriginX;
		  Y1=this.m_OriginY;
		  X2=this.m_OriginX+this.rotate(this.m_Value,0,0);
		  Y2=this.m_OriginY+this.rotate(this.m_Value,0,1);
		  //Σχεδίαση συνδετικής γραμμής σε επιλεγμένη κατεύθυνση
		  if(this.m_ShowSelectedComponent){
			    var SelX,SelY,SelXX,SelYY;
			    //m_Canvas.DrawStyle = vbDot
			    SelX=this.m_Value*Math.cos(this.m_InitAngle-this.m_SelectedComponentOrientation);
			    SelY=0;
			    //Πρώτη συνιστώσα
			    SelXX=this.m_OriginX+SelX*Math.cos(this.m_SelectedComponentOrientation)-SelY*Math.sin(this.m_SelectedComponentOrientation);
			    SelYY=this.m_OriginY+SelX*Math.sin(this.m_SelectedComponentOrientation)+SelY*Math.cos(this.m_SelectedComponentOrientation);
				this.cntx.strokeStyle="rgb(0,0,0)";
				this.cntx.beginPath();
				this.cntx.moveTo(X2,Y2);
				this.cntx.lineTo(SelXX,SelYY);
				this.cntx.stroke();
			    //Δεύτερη συνιστώσα
			    SelX = 0;
			    SelY = this.m_Value*Math.sin(this.m_InitAngle-SelectedComponentOrientation);
			    SelXX = m_OriginX + SelX * Math.cos(this.m_SelectedComponentOrientation)-SelY*Math.sin(this.m_SelectedComponentOrientation);
			    SelYY = m_OriginY + SelX * Math.sin(this.m_SelectedComponentOrientation)+SelY*Math.cos(this.m_SelectedComponentOrientation);
				this.cntx.beginPath();
				this.cntx.moveTo(X2,Y2);
				this.cntx.lineTo(SelXX,SelYY);
				this.cntx.stroke();
		  }
		  //Σχεδίαση Υ-συνιστώσας
		  if(this.m_YComponentVisible){
			  this.cntx.beginPath();
			  this.cntx.moveTo(X1,Y1);
			  this.cntx.lineTo(X1,Y2);
			  this.cntx.stroke();
			  this.cntx.beginPath();
			  this.cntx.moveTo(X2,Y2);
			  this.cntx.lineTo(X1,Y2);
			  this.cntx.stroke();
		  }
		  //Σχεδίαση Χ-συνιστώσας
		  if(this.m_XComponentVisible){
			  this.cntx.strokeStyle="rgb("+this.m_Red+","+this.m_Green+","+this.m_Blue+")";
			  this.cntx.beginPath();
			  this.cntx.moveTo(X1,Y1);
			  this.cntx.lineTo(X2,Y1);
			  this.cntx.stroke();
			  this.cntx.strokeStyle="rgb(0,0,0)";
			  this.cntx.beginPath();
			  this.cntx.setLineDash([15,15]);
			  this.cntx.moveTo(X2,Y2);
			  this.cntx.lineTo(X2,Y1);
			  this.cntx.stroke();
			  this.cntx.setLineDash([]);
		  }
		  //Σχεδίαση διανύσματος
		  this.cntx.strokeStyle="rgb("+this.m_Red+","+this.m_Green+","+this.m_Blue+")";
		  this.cntx.beginPath();
		  this.cntx.moveTo(X1,Y1);
		  this.cntx.lineTo(X2,Y2);
		  X1=X2;
		  Y1=Y2;
		  X2=X2+this.rotate(-dX,-dY,0);
		  Y2=Y2+this.rotate(-dX,-dY,1);
		  this.cntx.moveTo(X1,Y1);
		  this.cntx.lineTo(X2,Y2);
		  X1=this.rotate(this.m_Value,0,0)+this.m_OriginX;
		  Y1=this.rotate(this.m_Value,0,1)+this.m_OriginY;
		  X2=X1+this.rotate(-dX,dY,0);
		  Y2=Y1+this.rotate(-dX,dY,1);
		  this.cntx.moveTo(X1,Y1);
		  this.cntx.lineTo(X2,Y2);
		  this.cntx.stroke();
	};
	
	this.rotate=function(X1,Y1,selector){
		if(selector==0){
			return Math.round(X1*Math.cos(this.m_InitAngle)-Y1*Math.sin(this.m_InitAngle));
		}
		else if (selector==1){
			return Math.round(X1*Math.sin(this.m_InitAngle)+Y1*Math.cos(this.m_InitAngle));
		}
	};
	
	this.drawCircle=function(){
		this.cntx.strokeStyle="rgb("+CircleColor+","+CircleColor+","+CircleColor+")";
		this.cntx.fillStyle="rgb("+CircleColor+","+CircleColor+","+CircleColor+")";
		this.cntx.beginPath();
		this.cntx.arc(this.m_OriginX,this.m_OriginY,this.m_Value,0,2*Math.PI);
		this.cntx.stroke();
		if (this.m_CircleOpaque) this.cntx.fill();
		if (this.m_AxesVisible){
			this.cntx.strokeStyle="rgb("+m_AxesColor+","+m_AxesColor+","+m_AxesColor+")";
			this.cntx.beginPath();
			this.cntx.moveTo(this.m_OriginX,this.m_OriginY-this.m_Value);
			this.cntx.lineTo(this.m_OriginX,this.m_OriginY+2*this.m_Value);
			this.cntx.moveTo(this.m_OriginX-this.m_Value,this.m_OriginY);
			this.cntx.lineTo(this.m_OriginX+2*this.m_Value,this.m_OriginY);
			this.cntx.stroke();
		}
	};
	

	this.showAngleTicksSimple=function(){
		for(var i=1;i<=this.m_NoOfAngleTicks;i++){
			var Theta=i*2*Math.PI/this.m_NoOfAngleTicks;
			this.cntx.strokeStyle="rgb("+m_AxesColor+","+m_AxesColor+","+m_AxesColor+")";
			this.cntx.beginPath();
			this.cntx.moveTo(this.m_OriginX,this.m_OriginY);
			this.cntx.lineTo(this.m_OriginX+1.2*this.m_Value*Math.cos(Theta),1.2*this.m_Value*Math.sin(Theta));
			this.cntx.stroke();
		}
	};
}