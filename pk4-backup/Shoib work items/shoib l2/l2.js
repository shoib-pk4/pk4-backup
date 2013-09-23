function exec_l2(jsonResult, container) {
	console.log(jsonResult);

	//style for this complete page
	var le_style = '<style type="text/css">';
		le_style += ".box_sizing {box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;-ms-box-sizing:border-box;} ";
		le_style += "#l2_container { display:inline-block;margin:auto;height: auto;} #l2_left_col {width: 20%; float:left;} #l2_right_col { overflow-x:auto;width: 80%;float:left;padding:4px;}"; 
		le_style += '#l2_container ul {margin:0;padding:0 0 4px 0;border:none;border-right:solid 1px #D3CDCD;background-color: #fff;}  .l2LCRow:hover {background:#DFC184;}  #l2_container p {padding:0;margin:0;} .l2LCRow { color:white;cursor:pointer; width:90%;line-height:15px;list-style-type:none;margin: 4px auto 0px auto;text-align:left;padding: 4px; display:inline-block;background:#4486f6;background: -moz-linear-gradient(top,#4486f6,#AEFCF6);background: -webkit-gradient(linear,left top,left bottom,color-stop(0,#4486f6),color-stop(1,#4180eb));background: linear-gradient(top,#4486f6,#AEFCF6);} .l2LCBT{font:bold 13px/27px Arial,sans-serif;} .l2LCBST {display:none;font: 12px/14px Arial,sans-serif;}.l2LCActv {background:#DFC184;background: -moz-linear-gradient(top,#DFC184,#E9CA8C);background: -webkit-gradient(linear,left top,left bottom,color-stop(0,#DFC184),color-stop(1,#E9CA8C));background: linear-gradient(top,#DFC184,#E9CA8C);} .l2LCActv .l2LCBST {display:inline-block;} ';
		le_style += '</style>';

	var html_str = le_style + l2_getLayout(); //form complete html string here

	container.innerHTML = html_str; //add to dom 

	var viewUrl = jsonResult['ViewUrl'];
	drawLeftColData(jsonResult['RowData'], viewUrl);


	/* end of exec_l2 function */
}

/* 
	* this will fill the left col
*/
function drawLeftColData(leftColRows, viewUrl) {
	var t,lbls,li;
	var ul = $('<ul></ul>');
		ul.attr('id', viewUrl).addClass('l2LCC'); //l2LCC l2 left column container

	$.each(leftColRows, function(k,d) {
		li = $('<li></li>');
		li.addClass('l2LCRow')
		li.attr('id', d['pkId']);

		$.each(d['data'], function(k1, v1) {
			if(k1 == 0 ) { //this will be btn title
				t = '<p class="l2LCBT">'+v1['colTxt']+'</p>'; //l2LCBT l2 left column button title
				li.append(t);
			} else {
				lbls = '<span class="l2LCBST">'+v1['colTxt']+', </span>'; //l2LCBST l2 left column button sub title
				li.append(lbls);
			}	
		});		

		//append li to ul
		ul.append(li);
	});
	//finally add complete ul to dom
	$('#l2_left_col').append(ul);

	//trigger click of first li of ul
	$('.l2LCC li:nth(0)').trigger('click');
}


/* 
	* this will give the basic layout of page
*/
function l2_getLayout() {
	var d = '<div class="box_sizing" id="l2_container">'; 
		d += '<div id="l2_left_col" class="box_sizing"></div><div id="l2_right_col" class="box_sizing"></div>';
		d += '</div>';

		return d;
}

/* 
	* write all the event handlers here
*/
$(document).ready(function () {

	//get the pages for each tab click
	$('body').on('click', '.l2LCRow', function() {

		//remove active class from all other tabs first
		$('.l2LCRow').removeClass('l2LCActv');

		//mark current clicked tab has active
		$(this).addClass('l2LCActv');

		var pkId = $(this).attr('id'); //this contains pk id
		var viewUrl = $('.l2LCC').attr('id');  //this contains view url
			viewUrl += '?id='+pkId;

		//take left col height
		var lftColHt = $('.l2LCC').css('height');

		//show loading message here
		$('#l2_right_col').html('Loading...' + viewUrl).css('minHeight',lftColHt); 

		//trigger the url
		$.get(viewUrl, function(data) {
			$('#l2_right_col').html(data);
		});
	});

	/* end of document ready */
});