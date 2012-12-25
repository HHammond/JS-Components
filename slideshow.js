/*//////////////////////////////////////////////////////////////////////////////

 Copyright (C) 2012  Henry Hammond
 email: HenryHHammond92@gmail.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or  any later
 version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 For a copy of the GNU Lesser General Public License, see
 <http://www.gnu.org/licenses/>.

 //////////////////////////////////////////////////////////////////////////////*/



$(document).ready(function(){

	// global variables
	var thumbnailList;
	var cols = 5;
	var open = false;

	// get xml data from server
	$.ajax({
		type: "GET",
		url: "images/thumbs.xml",
		dataType: "xml",
		success: parseThumbnailsFromXML
	});

	// parse and generate thumbnails from xml data
	function parseThumbnailsFromXML(xml){
		var list = new Array();

		// push xml content to array
		$(xml).find("img").each(function(){
			list.push( $(this).attr("src") );
		});

		// format array data and append to DOM through slideshow_Content
		// var cols ;	// 5 column layout (900px)

		// document.write(list.length);
		
		var columns = new Array();
		for( var c=0;c<cols;c++){

			var col = $("<div/>",{ 'class':'column' });
			columns.push( col ); 

			$("#slideshow_Content").append( col );

		}

		var c = 0;
		for(var i=0;i<list.length;i++){
			
			var thumb = $("<div/>",{ 'class':'thumbnail' });
			var icon  = $("<img/>",{ 'class':'thumb_Image'}).attr("src","images/"+list[i]);
			thumb.append(icon);

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
	// TODO: fix to iterate by columns
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

		id = (index+iterator+len)%len;

		
		// convert thumbnail id to regular id
		JPEG_suffix = /_tn.jpg/gi;	// regex to change file suffix
		image_url = thumbnailList[id].replace( JPEG_suffix,".jpg");
		
		// fade out current image
		$("#image_Box #fullImage").fadeOut("fast", function(){
			// load image
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

	// preload image file
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

			// change from loading image to image after loading completes
			$("#image_Box #fullImage").attr("src",filename);

			// fade image into view
			$("#image_Box #fullImage").fadeIn();
		};

	}

	// check if slideshow imageBox window open
	function isExpanded(){
		if( $("#iamge_Box_Fader").css("dispaly") == 'none'){
			return false;
		}
		return true;
	}

	// open image box
	function openImageBox(){
		$("#image_Box_Fader").fadeIn("fast");
	}

	// close image box
	function closeImageBox(){
		$("#image_Box_Fader").fadeOut("fast");
	}
}); 
