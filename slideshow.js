

$(document).ready(function(){

	// global variables
	var thumbnailList;
	var cols = 5;
	var open = false;

	// get xml data from server
	$.ajax({
		type: "GET",
		
		// request thumbnail xml file
		url: "images/thumbs.xml",
		dataType: "xml",
		
		//on successful load, call parsing function
		success: parseThumbnailsFromXML
	});

	// parse and generate thumbnails from xml data
	function parseThumbnailsFromXML(xml){
		//list to store thumbnail filenames (without folder path)
		var list = new Array();

		// push xml content to array
		$(xml).find("img").each(function(){
			list.push( $(this).attr("src") );
		});

		// format array data and append to DOM through slideshow_Content
		var columns = new Array();	//array to store columns for use in loop
		for( var c=0;c<cols;c++){

			//create column and push to array
			var col = $("<div/>",{ 'class':'column' });
			columns.push( col ); 

			// add column to page
			$("#slideshow_Content").append( col );
		}

		// load thumbnails and add to column layout
		// add thumbnails from left to right sequentially
		for(var i=0,c=0;i<list.length;i++){
			
			// create thumb and img objects
			var thumb = $("<div/>",{ 'class':'thumbnail' });
			var image  = $("<img/>",{ 'class':'thumb_Image'}).attr("src","images/"+list[i]);
			thumb.append(image);

			// iterate and loop through columns using modular arithmetic
			columns[c%cols].append( thumb );
			c++;

		}

		// add listeners to thumbnail objects to open lightbox style window
		$(".thumbnail").click(function(){

			// get image url from thumbnail and conver to full url
			var image_url = $(".thumb_Image",this).attr("src");
			var JPEG_suffix = /_tn.jpg/gi;	// regex to change file suffix
			image_url = image_url.replace( JPEG_suffix,".jpg");

			// set image to loading icon and hide
			$("#image_Box #fullImage").attr("src","loadinfo.net.gif");
			$("#image_Box #fullImage").css("display","hidden");
			
			// open slideshow window
			openImageBox();

			// preload image and fade in the elements
			preLoadImage(image_url);
		});

		// set list for global use
		thumbnailList = list;
	}// finished parsing and displaying data


	// image_Box close button
	$("#image_Box_close_Button").click(function(){
		// hide graphic elements
		closeImageBox();
	});
	// image_Box close button
	$("#image_Box_Curtain").click(function(){
		// hide graphic elements
		closeImageBox();
	});

	// open image on click
	$("#image_Box #fullImage").click(function(){
		window.open($("#image_Box #fullImage").attr("src"))
	});

	// iterate forwards on next button
	$("#image_Box_next_Button").click(function(){
		iterateImages(1);
	});
	// itreate backwards on previous button
	$("#image_Box_prev_Button").click(function(){
		iterateImages(-1);
	});

	// iterate through images
	function iterateImages(iterator){
		// get current image selection
		var image = $("#image_Box #fullImage").attr('src');
		
		// convert image to thumbnail name
		// remove prefix
		var JPEG_suffix = /^images\//gi;
		var image_url = image.replace( "images/","");
		// change suffix
		JPEG_suffix = /.jpg/gi;	// regex to change file suffix
		var image_url = image_url.replace( JPEG_suffix,"_tn.jpg");

		// find next image in collection, or loop back to front
		var index = thumbnailList.indexOf( image_url )
		var len = thumbnailList.length;
		var id = 0;

		// use modular arithmetic to find location
		// note: this fails for negative iterators larger than list length
		//		 this won't ever happen in a real situation, we may ignore this
		id = (index+iterator+len)%len;

		// convert thumbnail id to regular id
		JPEG_suffix = /_tn.jpg/gi;	// regex to change file suffix
		image_url = thumbnailList[id].replace( JPEG_suffix,".jpg");
		
		// fade out current image
		$("#image_Box #fullImage").fadeOut("fast", function(){
			// load image before displaying it, cleaner animation
			preLoadImage(image_url);
		});
	}

	// key event functionality
	$(document).keydown(function(e){
		
		// left key
		// iterate backwards
	    if (e.keyCode == 37){
	    	if(isExpanded()) iterateImages(-1);
	    	return false;
	    }
	    
	    // right key
	    // iterate forward
	    if (e.keyCode == 39){
	    	if(isExpanded()) iterateImages(1);
	    	return false;
	    }
	    
	    // escape key
	    // close display window
	    if (e.keyCode == 27){
	    	if(isExpanded()) closeImageBox();
	    	return false;
	    }
	});

	// preload image file to create cleaner animations
	function preLoadImage(filename){

		// check if suffixed to imagees directory
		if( filename.indexOf("images/") == -1){
			filename = "images/"+filename;
		}

		// begin preloading process
		var imageObj = new Image();
		imageObj.src = filename;

		// open image box after preloading
		imageObj.onload = function(){
			openImage(filename);
		};

	}

	// display image into frame and fade in
	function openImage(filename){
		// change to displayed image
		$("#image_Box #fullImage").attr("src",filename);

		// fade image into view
		$("#image_Box #fullImage").fadeIn();
	}

	// check if slideshow image Box window open
	function isExpanded(){
		if( $("#image_Box_Fader").css("dispaly") == 'none'){
			return false;
		}
		return true;
	}

	// open image box
	function openImageBox(){
		$("#image_Box_Fader").fadeIn("fast");
		//lock scrolling to prevent webkit rendering error
		$("body").css("overflow","hidden");
	}

	// close image box
	function closeImageBox(){
		$("#image_Box_Fader").fadeOut("fast");
		//unlock scrolling
		$("body").css("overflow","auto");
	}
}); 
