// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

app.bringToFront();

main();

function main(){
	var startDisplayDialogs = app.displayDialogs;
	var strtRulerUnits = app.preferences.rulerUnits;

	app.preferences.rulerUnits = Units.PIXELS;
	app.displayDialogs = DialogModes.NO;
	if(documents.length==0){
		alert("please open a document containing WP app graphics that is drawn on the template");
	}
	else{
		var windowResource = "dialog {  \
		    text: 'Export Windows Phone artwork',  \
		    allGroups: Panel { orientation: 'column', \
		    	 text:'export',\
		    	  name: Group{ orientation: 'row', \
		    		 s: StaticText{text:'folder:'}, \
		    	    e: EditText{preferredSize:[200,20],enabled:false},\
		    	    f: Button{text:'...',properties:{name:'selectFolder'}},\
		    	  },\
		    	  wp7: Checkbox{text:'Windows Phone 7',value:true},\
		    	  wp8: Checkbox{text:'Windows Phone 8',value:true}\
			 }, \
		    buttons:Group{orientation:'row', alignment:'right',\
		    okBtn:Button{text:'Ok',enabled:false,properties:{name:'ok'}},\
		    cancelBtn:Button{text:'Cancel',properties:{name:'cancel'}}\
		}}";


		 var dlg2 = new Window(windowResource);
		 
		 
		 dlg2.allGroups.name.f.onClick=function(){
		 	dlg2.allGroups.name.e.text = Folder.selectDialog() || "";
		 	dlg2.buttons.okBtn.enabled = dlg2.allGroups.name.e.text.length > 0
		 };
		 dlg2.buttons.okBtn.onClick = function(){
		     dlg2.close();
		     if(dlg2.allGroups.wp7.value || !dlg2.allGroups.wp8.value)
		     {
		 			performExport(dlg2.allGroups.name.e.text,dlg2.allGroups.wp7.value, dlg2.allGroups.wp8.value );
		 	  }
		 	}
		 dlg2.center();
		 dlg2.show();
	}

	//reset all options
	app.displayDialogs = startDisplayDialogs;
	app.preferences.rulerUnits = app.preferences.rulerUnits;
}


function performExport(path,wp7,wp8)
{
  
 	var docRef = app.activeDocument;

	exportImage(docRef,1687,1645,300,300,"StoreImage",true,path);
	
	//Wp7
	if(wp7){
		exportImage(docRef,102,96,62,62,"ApplicationIcon",true,path);
		exportImage(docRef,398,96,173,173,"Background",true,path);
		exportImage(docRef,1687,791,480,800,"SplashScreenImage",true,path);
	}

	//wp8
	if(wp8){
		exportImage(docRef,1687,791,480,800, "SplashScreenImage.screen-WVGA",true,path);
		exportImage(docRef,906,791,720,1280, "SplashScreenImage.screen-720p",true,path);
		exportImage(docRef,102,791,768,1280, "SplashScreenImage.screen-WXGA",true,path);
		exportImage(docRef,102,388,99,99,"wp8-tile-small",true,path);
		exportImage(docRef,398,388,159,159,"FlipCycleTileSmall",true,path);
		exportImage(docRef,626,388,336,336,"FlipCycleTileMedium",true,path);
		exportImage(docRef,996,388,691,336,"FlipCycleTileLarge",true,path);
	}
}

//Exports the image 
function exportImage(doc,x,y,w,h,name,png,path)
{
	var saveOptions, filename;
	
	doc.selection.select(new Array (new Array(x,y),new Array(x+w,y), new Array(x+w,y+h), new Array(x,y+h)), SelectionType.REPLACE, 0, false);
	doc.selection.copy(true);
   var docRef2 = app.documents.add(w, h, 72, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
   docRef2.paste();
   if(png){
		saveOptions = new PNGSaveOptions();
		filename = path+"/"+name+".png";
   }else{
  		saveOptions = new JPEGSaveOptions();
  		saveOptions.quality = 12;
  		filename = path+"/"+name+".jpg";
   }
   docRef2.saveAs(new File(filename),saveOptions);
   docRef2.close(SaveOptions.DONOTSAVECHANGES);
}