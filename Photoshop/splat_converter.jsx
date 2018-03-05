// PHOTOSHOP: Convert painted splat to shader control splat
// By Carlos Breban
// Requires the following layers: "Red", "Green", "Blue", "Alpha"

#target photoshop
app.bringToFront();

function SelectContentAware(){
	if(app.activeDocument.activeLayer.isBackgroundLayer)
		return;
	var mainDesc = new ActionDescriptor();
	var mainRef = new ActionReference();
	mainRef.putProperty( charIDToTypeID( "Chnl" ), charIDToTypeID( "fsel" ) );
	mainDesc.putReference( charIDToTypeID( "null" ), mainRef );
	var secRef = new ActionReference();
	secRef.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "Trsp" ) );
	mainDesc.putReference( charIDToTypeID( "T   " ), secRef );
	executeAction( charIDToTypeID( "setd" ), mainDesc, DialogModes.NO );
}	


function SelectLayerByName(incName) {
	function cTID(s) { return app.charIDToTypeID(s); };
	var mainDesc = new ActionDescriptor();
	var mainRef = new ActionReference();
	mainRef.putName( cTID('Lyr '), incName );
	mainDesc.putReference( cTID('null'), mainRef );
	mainDesc.putBoolean( cTID('MkVs'), false );
	executeAction( cTID('slct'), mainDesc, DialogModes.NO );
}


function LayerConvert (incLayer){
	var activeDoc = app.activeDocument;
	var errorCatch;
	if(incLayer != "Alpha"){
		SelectLayerByName(incLayer);
		SelectContentAware();
		
		if(incLayer == "Red"){
			var redColor = new SolidColor();
			redColor.rgb.red = 255;
			redColor.rgb.green = 0;
			redColor.rgb.blue = 0;			
			activeDoc.selection.fill(redColor);  
		}
		
		if(incLayer == "Green"){
			var greenColor= new SolidColor();
			greenColor.rgb.red = 0;
			greenColor.rgb.green = 255;
			greenColor.rgb.blue = 0;
			activeDoc.selection.fill(greenColor);  
		}	
		
		if(incLayer == "Blue"){
			var blueColor= new SolidColor();
			blueColor.rgb.red = 0;
			blueColor.rgb.green = 0;
			blueColor.rgb.blue = 255;			
			activeDoc.selection.fill(blueColor); 
		}  

		if(incLayer == "Base"){
			activeDoc.selection.selectAll();
			var blackColor= new SolidColor();
			blackColor.rgb.red = 0;
			blackColor.rgb.green = 0;
			blackColor.rgb.blue = 0;			
			activeDoc.selection.fill(blackColor); 
		} 		
    }
	else {
		SelectLayerByName(incLayer);
		SelectContentAware();
		
		try{
			var alphaChannel = activeDoc.channels.getByName("Alpha 1");
			var alphaLayer = activeDoc.layers.getByName("Alpha");
		}
		catch (errorCatch){}
		if(alphaChannel) alphaChannel.remove();
		
		var newAlpha = activeDoc.channels.add()
		newAlpha.name = "Alpha";
		var alphaColor= new SolidColor();
		alphaColor.rgb.red = 255;
		alphaColor.rgb.green = 255;
		alphaColor.rgb.blue = 255; 
		activeDoc.selection.fill(alphaColor); 
		
		if(alphaLayer) alphaLayer.remove();
	}
}


function main(){
	if(app.documents.length>0){
		
		var defaultRulerUnits = preferences.rulerUnits;
		preferences.rulerUnits = Units.PIXELS;
		
		var activeDoc = app.activeDocument;
		
		var errorCatch;
		var baseLayer;
		var redLayer;
		var greenLayer;
		var blueLayer;
		var alphaLayer;
		
		try{
			baseLayer = activeDoc.layers.getByName("Base");
			redLayer = activeDoc.layers.getByName("Red");
			greenLayer = activeDoc.layers.getByName("Green");
			blueLayer = activeDoc.layers.getByName("Blue");
			alphaLayer = activeDoc.layers.getByName("Alpha");
		}
		catch (errorCatch){}
		
		if(baseLayer && redLayer && greenLayer && blueLayer && alphaLayer){
			var redBounds = (redLayer.bounds[0] == 0 && redLayer.bounds[3] == 0 );
			var blueBounds = (blueLayer.bounds[0] == 0 && blueLayer.bounds[3] == 0 );
			var greenBounds = (greenLayer.bounds[0] == 0 && greenLayer.bounds[3] == 0 );
			var alphaBounds = (alphaLayer.bounds[0] == 0 && alphaLayer.bounds[3] == 0 );
			
			if(!redBounds && !blueBounds && !greenBounds && !alphaBounds ){
				LayerConvert("Red"); 
				LayerConvert("Blue"); 
				LayerConvert("Green"); 
				LayerConvert("Alpha"); 
				LayerConvert("Base"); 				
			}
			else     
				 alert("empty layer!");  
			 
			preferences.rulerUnits = defaultRulerUnits;		
		}
	}
}
main();