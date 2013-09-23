function exec_rept (doc, into_div) {

	var piv_str;
	var last_piv_upd = '';
	var init_piv_obj;
	var cht_str;
	var last_cht_upd = '';
	var example      = 'line-basic';
	var theme        = 'default';
	var date_format  ="dd/MM/yyyy";

	var dataTblHdr  = doc.dataTblHdr;
	var dataTblData = doc.dataTblData;
	var adHchart    = doc.adHchart;
	var pivot_jsn = doc.pivot_json;
	var pivot_fld = doc.pivot_fields;
	var params    = doc.Parameters;

	$('head').append('<style type="text/css"> #filterRow th {padding: 4px 0 !important;} .eachColFilterSelect {margin: auto; width: 100px; display: block; } .filterRowHide {display:none;}  #paramsTbl td input[type=text] { width: 80%; } #paramsTbl td { display: inline-block; vertical-align: top; margin-right: 1.5%; width: 18%; } #slideUpDwnCont {display:none;} .showParamsCondCont {font-size: 16px;font-weight:bold; text-align:left; height: 30px;display:block; } .showParamsCondCont #showParams {float:right;}   #paramsTbl .multiSelectBox {width:82%;} #paramsTbl .sf_suggestion {margin-top: -56px;} #tblDiv {display:inline-block;width:100%;} .reptFrmBtns {float:right;margin-right: 5px; } .reptParamsDesc {font-size: 12px;display: block; color:grey;} #dtRefreshedAt {position:absolute; right: 1%;top: 0; font-size: 12px;} .reptParamsLbl {font-weight: bold; font-family:candara, "sans-serif"; font-size: 14px; letter-spacing: 1px; margin: 4px 0;} #paramsTbl {width:100%; border-collapse: collapse;} #paramsContainer { padding: 0.5% 0; width: 99%; display: block; height:auto;} .filterApplied {background-color:palegreen;} .dpass {display: none;} #reportData tr th {position:relative;} #reportData_wrapper {overflow:auto;} #tabs-2 {position:relative;} #tabs-2 .dataTables_filter {width: 425px; } .removeCol {display:none;} .showOrHideColsActv { height: 250px !important; background-color: white;border: solid 2px white;border-radius: 3px; background-position:top left !important; overflow-x:hidden !important; overflow-y:auto !important; width:220px !important; margin-left: -12.5% !important;} #reportData { width:auto !important;text-align:center;} #tabData {border:solid 1px rgba(0,0,0,0.3);border-top:none;}  .toggleColName:hover {background-color:rgb(164, 198, 218);} .toggleColName { border:none; border-top:solid 1px rgba(10, 9, 9, 0.1);width: 100%; cursor: pointer; font-size: 12px; font-family: candara; display:block;margin: 2px 0;text-align:left;padding: 2px 0;} #reportData_filter input { display: inline;} #reportData_length label { width 260px; } #reportData_length select { display: inline-block; } #tabs-min { background: transparent; border: none; } #filterColsByCombo {background: url(\"/atCRM/images/filterCols.gif\") no-repeat right center / 18px 18px;} #showOrHideCols, #filterColsByCombo { background-color: white; border: solid 1px white; transition: height all 1s; -webkit-transition: all 1s; -moz-transition: all 1s; -o-transition: all 1s; z-index:1; overflow: hidden; position:absolute; width:31px; margin: 0.5% 0 0 -1%; padding: 24px 4px 2px 4px; box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -o-box-sizing: border-box; -ms-box-sizing: border-box; height: 25px;  } #showOrHideCols {margin-left: 2.3%; background: white url(\"/atCRM/images/gearDown.png\") no-repeat top right / 28px 24px;}  #tabs-min .ui-widget-header { background: transparent; border: none; border-bottom: 1px solid #c0c0c0; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; } #tabs-min .ui-state-default { background: transparent; border: none; } #tabs-min .ui-state-active { border: none; } #tabs-min .ui-state-default a { color: #c0c0c0; } #tabs-min .ui-state-active a { color: #459E00; } .dataTables_wrapper { font-size: 9pt; } .blueButton { background-color: #4982AB; border-color: #D9DFEA #0E1F5B #0E1F5B #D9DFEA; border-style: solid; border-width: 1px; color: white; cursor: pointer; font-family: "lucida grande",tahoma,verdana,arial,sans-serif; font-size: 12px; } .tabUpArr { position: absolute; bottom: -4%; left: 36%; visibility: hidden; } .ui-tabs-selected .tabUpArr {visibility: visible; }  .flash{ padding-top:4px; padding-bottom:4px; background-color: #FFFF33; font-weight:bold; font-size:12px;-moz-border-radius: 6px;-webkit-border-radius: 6px; color: black; } .alignRight { text-align: right; } li {top: 0px !important; } .ui-tabs .ui-tabs-nav { margin: 0; padding: 0 0 0 0.4em; border: 1px solid #d4ccb0; background: none !important;} .blkSdw {box-shadow: 1px 1px 4px black;-moz-box-shadow: 1px 1px 4px black;-webkit-box-shadow: 1px 1px 4px black;-o-box-shadow: 1px 1px 4px black;}  .showingParams {background-color: skyblue; color: black;} #slideUpDwnCont {border: solid 1px rgba(0,0,0,0.2); border-left: none;border-right:none;} table#reportData thead tr th { min-width: 100px; padding-right:36px; } .filterColsByComboActv { border:solid 1px #FF0606; -webkit-box-shadow: 1px 1px 4px #111010; -moz-box-shadow: 1px 1px 4px #111010;box-shadow: 1px 1px 4px #111010; }  </style>');

	into_div.innerHTML = '<div id="reportElementHeader"> <table width="100%"> <tr> <td align="left" class="pageTitle" width="30%"> ' + doc.ReportName + ' </td><td width="30%" align="left">' + doc.ReportDesc + '</td><td align="right" valign="bottom" width="40%"> <input type="button" class="blueButton" value="Parameters" style="width: 100px;" id="showParams" /> <input type="button" class="blueButton" value="Export" style="width: 100px;" id="expxlb" /> </td> </tr> </table><div id="paramsContainer"> </div> </div> <div id="tabs-2" > <span id="dtRefreshedAt"></span> <div id="tabs-min" class="tabs ui-tabs ui-widget ui-widget-content ui-corner-all"> <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"> <li class="ui-tabs-selected ui-state-active" > <a href="#tabData" id="tabDataBtn"> Data</a> <img src="/atCRM/stylesheets/style_h/images/uiTabsArrow.png" class="tabUpArr" /> </li>  <li> <a href="#tabPivot"  id="tabPivotBtn"> Pivot</a> <img src="/atCRM/stylesheets/style_h/images/uiTabsArrow.png" class="tabUpArr" /></li></ul> <div id="tabData"> <table id="reportData"> </table> </div> <div id="tabPivot" width="auto">  <div id="pivot-menu-container">Please select the appropriate columns below to create your own Pivot Report.<br> </div> <div id="k_results" style="display:inline-block"></div><div id="results"> </div> </div> </div> </div> <form name="xlForm" id="xlForm" style="display: none" action="http://sys.impelcrm.in:81/ret_xl.php" onclick="ExportToExcel(\'reportData\')" method="post"><textarea name="rN" id="rN" style="display: none"></textarea><textarea name="rD" id="rD" style="display: none"></textarea></form>';
	/*
		* reload btn
		<td align="right" valign="bottom" width="15%"> <input type="button" class="blueButton" value="Reload" style="width: 100px;" id="rel_page" > </td>
		* pivot col
		<div id="pivot-menu-container">Please select the appropriate columns below to create your own Pivot Report.<br> </div>
		<li> <a href="#tabPivot"> Pivot</a> <img src="/atCRM/stylesheets/style_h/images/uiTabsArrow.png" class="tabUpArr" /></li>
	*/
/*  Set up the tabs for Data, Chart and Pivot  */
	$('#tabs-min').tabs();

/*  Set up the datatable that carries tabular data  */
	var json_str = JSON.stringify(dataTblData);
	$(document).ready(function() {

		/* 
			* get the parameters data 
			* form a url and post to server and get the new json and reload the data table
			* getting form elements by class name called reptParamsElem, it is attached to each element for 
			* which we need value
		*/
		$('body').on('click', '#getReptData', function(e) {
			var url='', name, val, multipleTT='';

			$('#paramsTbl tr td').each(function() {
				name = $(this).attr('name');

				if(name == 'ir') {
					//this is for check box
					val  = "'" + $(this).children('.reptParamsElem').prop('checked') + "'";
					
				}
				else
				if(name == 'te') {
					arrStr = $(this).children('.reptParamsElem').val().split(',');
					$.each(arrStr, function(k,v) {
						multipleTT += "'" + v + "',";
					});
					val = multipleTT.substr(0, multipleTT.length-1);
				}
				else {
					val = $(this).children('.reptParamsElem').val().replace(/'/g, "\\'");
					val  = "'" +  val + "'";
					//because in this we need time to so concatiating it
					if(name == 'td')
						val += ','+ "'" + $(this).children('#reptTime').val() + "'"; 
				}
				
				
				url += name +'' + val +'!~~!';
			});
			//strip down last ampersand from url
			url = url.substr(0, url.length - 2);
			
			//post the data to rAN.htm
			//read the id from url
			//i is the variable name
			var id = getValueFromUrl('i');
			if(id == '') {
				alert('Id could not be retrieved from url!');
				return false; 
			}
			else {
				//get p value if setted, p is variable name in header
				var getPParm = getValueFromUrl('p');
				if(getPParm == ''){
					url = '&p='+url;
				}
				else{
					var getPParmArr = getPParm.split('!~~!');
					getPParm = getPParmArr[0];
					getPParm = getPParm.replace(/'/g, "");
					url = '&p='+"'"+getPParm+"'"+'!~~!'+url;					
				}
				postDataTorAnFile(url, id);	
			}

		});



		//show params container
		$('body').on('click', '#showParams', function(e) {
			if($(this).hasClass('showingParams')) {
				//then slide up the condition selections
				$('#slideUpDwnCont').slideUp('fast');
				$(this).removeClass('showingParams');
			}	else {
				//then slide down the condition selections
				$('#slideUpDwnCont').slideDown('fast');
				$(this).addClass('showingParams');
			}
			
		});

		//hide params container
		$('body').on('click', '#cptcTbl', function(e) {
			//slide up  condition selections
			$('#slideUpDwnCont').slideUp('fast');
			//remove class showing from params button
			$('#showParams').removeClass('showingParams');
		});

		drawParamsConditions(params);

		//on applying filter to cols, show some indication
		$('.eachColFilterSelect').live('change', function() {
			var tis= $(this);
			var v = tis.val();
			if(v == '') {
				tis.parent().removeClass('filterApplied');
			}
			else {
				tis.parent().addClass('filterApplied');
			}
		});
		
		//if showing and hiding column is active then hide if user is clicked other dom pos
		$('body').click(function() {
			var sor = $('#showOrHideCols');
			if(sor.hasClass('showOrHideColsActv')) {
				sor.removeClass('showOrHideColsActv').removeClass('blkSdw');
				sor.scrollTop(0,0);
			}
				
		});

		//set the width of table
		var w = $(document).width() - 30;
		$('#tabs-2, #reportElementHeader').css('width', w+'px');

		$('#expxlb').click(function() {
			ExportToExcel('reportData');
		});

		var oTable = $('#reportData').dataTable({
			"aaData": dataTblData,	
			"aoColumns": dataTblHdr,
			"sDom": "\"<clear>\"frtip",
			"aoColumnDefs": [{"sClass": "dpass", "aTargets": [0]}],
			"aaSorting": [[0, 'asc']],
			"oLanguage": {
				"sSearch": "Search all columns:"
			}
		});

		//adds drop down for hiding and showing columns
		addShorOrHideCols();

		//add column wise filter button
		filterColsByCombo();

		//show or hide col
		$('body').on('click', '.toggleColName', function(e) {
			
			var colId = $(this).attr('id');
			var cbxId = colId + '_cbx';

			if($(this).hasClass('toggleColNameActv')) {
				//hide column
				$('#reportData tr').each(function() {
					$(this).find("th:eq("+colId+")").addClass('removeCol');
					$(this).find("td:eq("+colId+")").addClass('removeCol');
				});
				
				
				$('#'+cbxId).prop('checked', false);
				$(this).removeClass('toggleColNameActv')
			} 
			else {
				//show the column
				$('#reportData tr').each(function() {
					$(this).find("th:eq("+colId+")").removeClass('removeCol');
					$(this).find("td:eq("+colId+")").removeClass('removeCol');
				});
				
				$('#'+cbxId).prop('checked', true);
				$(this).addClass('toggleColNameActv')
			}

			e.stopPropagation();
		});

		$('body').on('click', '#showOrHideCols', function(e) {
			
			if($(this).hasClass('showOrHideColsActv'))
				$(this).removeClass('showOrHideColsActv').removeClass('blkSdw');
			else
				$(this).addClass('showOrHideColsActv').addClass('blkSdw');

			e.stopPropagation();
		});

		$('#rel_page').click(function() {
			console.log('write the code for reloading');
		});

		
		//adds drop down for filtering based on columns
		addFilteringBasedOnCols(oTable);
		$('thead tr:last th').each( function ( i ) {
			if(i != 0) {
				this.innerHTML = fnCreateSelect( oTable.fnGetColumnData(i), i );
				$('select', this).change( function () {
					oTable.fnFilter( $(this).val(), i );
				} );
		   }
		} );


/*  Set up the chart
	onScrChart = new Highcharts.Chart(adHchart); */
/*  Set up the Kruchten pivot table */
	$(function(){
		var derivers = $.pivotUtilities.derivers;
		var piv_jason = doc.piv_json;

		$(function(mps) {
			$("#k_results").pivotUI(piv_jason, {
				derivedAttributes: {
				}
			});
		});
	 });

/*  Set up the pivot table
	var example = 'line-basic',
		theme = 'default';
	setupPivot({json:pivot_jsn, fields:pivot_fld});
	init_piv_obj = pivot.config(true); */


	//on clicking the input field pop up date, and focus out of input field
	$('body').on('click', '#eachParamCondName_0',function() {		
		$('#calendar_0').trigger('click');
	});

	//on clicking the input field pop up date, and focus out of input field
	$('body').on('click', '#eachParamCondName_1',function() {
		$('#calendar_1').trigger('click');
	});

	//hide the params button if length is 0
	if(params.length == 0)
		$('#showParams').css('display', 'none');


	//this will show the load time of date table
	showRefreshedDateTimeForDataTbl();

	//show filter column
	$('body').on('click', '#filterColsByCombo', function() {
		var filterEle = $('#reportData #filterRow');
		var t = $(this);
		if(filterEle.hasClass('filterRowHide')) {
			filterEle.removeClass('filterRowHide');
			t.addClass('filterColsByComboActv');
		}
		else {
			filterEle.addClass('filterRowHide');
			t.removeClass('filterColsByComboActv');
		}
	});

	

	//show btns related to data tab
	document.getElementById('tabDataBtn').addEventListener('click', function() {
		if($(this).parent().hasClass('ui-state-active'))
			$('#showParams, #expxlb, #dtRefreshedAt').css('visibility', 'visible');
	}, false);

	//hide btns related to pivot tab
	document.getElementById('tabPivotBtn').addEventListener('click', function() {
		if($(this).parent().hasClass('ui-state-active'))
			$('#showParams, #expxlb, #dtRefreshedAt').css('visibility', 'hidden');
	}, false);

	/* end of document ready */
	} );


	/* end of exec_rept function */
}

/* 
	* this will post some variables to rAn.htm
	* and does some actions like replots the data table and prams condtion get prepared again if they variats
*/
function postDataTorAnFile(urlData, id) {

	$.ajax({
		url: '/atCRM/custom/adhocReports/rAn.htm',
		data: 'i='+id+urlData,
		type: 'GET',
		dataType: 'JSON',
		async: false,
		success: function(data) {
			
			//reload datatable
			reloadDataTable(data);

			showRefreshedDateTimeForDataTbl();

		},
		error: function(response) {
			alert('Unable to process request!');
			console.log(response);
		},
	});
}

function showRefreshedDateTimeForDataTbl() {
	// show the refresh time to user
	var now = new Date();
	now.format("dd/M/yy h:mm");

	$('#dtRefreshedAt').text('Refreshed: '+ now);
}

/*
	* this gives the value of variable from url
	* need 1 parameter, which is variable name
 */
 function getValueFromUrl(name) {
 	var query = document.URL;
 	var vars = query.split('?'), vars1, vars2, nameVar='';
	
	$.each(vars, function(k,v) {
	    //remove &
	    vars1 = v.split('&');
	    $.each(vars1, function(k1, v1) {
	        //remove equal
	     vars2 = v1.split('=');
	        if(vars2[0] == name)
	            nameVar= vars2[1];	       
	    });
	 });
 	return nameVar;
 }


/* 
	* replots the data table
	* first it removes everything then adds new data
*/
function reloadDataTable(data) {

	var dataTblHdr = data['dataTblHdr'];
	var dataTblData = data['dataTblData'];

	$('#reportData').dataTable().fnDestroy(); //destroy old data
	$('#tabData').children().remove();

	//create new table
	$('#tabData').append('<table id="reportData"></table>');
	
	//call new data on data table
	oTable = $('#reportData').dataTable({
			"aaData": dataTblData,	
			"aoColumns": dataTblHdr,
			"sDom": "\"<clear>\"frtip",
			"aoColumnDefs": [{"sClass": "dpass", "aTargets": [0]}],
			"aaSorting": [[0, 'asc']],
			"oLanguage": {
				"sSearch": "Search all columns:"
			}
	});

	// add drop down for filtering based on columns
	addFilteringBasedOnCols(oTable);

	//adds drop down for shoing or hiding columns
	addShorOrHideCols();

	//add filter column button
	filterColsByCombo();

}

/*
	* this will add filters drop down for filtering based on columns
*/
function addFilteringBasedOnCols(oTable) {
	/* Add a select menu for each TH element in the table header */
	var thLen = $('#reportData').children('thead').children('tr').children('th').length;
	
	$('#reportData thead').append('<tr id="filterRow" class="filterRowHide" ></tr>'); //add row to thead

	for (var ix=0; ix < thLen; ix++) {
		if(ix == 0)
			$('#reportData thead #filterRow').append("<th class='dpass'></th>");	//hiding first col
		else
			$(' #reportData thead #filterRow').append("<th></th>");	
	}

	//this is for add select filters
	$('thead tr:last th').each( function ( i ) {
			if(i != 0) {
				this.innerHTML = fnCreateSelect( oTable.fnGetColumnData(i), i );
				$('select', this).change( function () {
					oTable.fnFilter( $(this).val(), i );
				} );
		   }
	} );
}

/* 
	* this will draw prams condtions
	* reptParamsLen is the global var
	* check the length when ever it is called and redraw it and redraw datatable
	* this happens at load time
*/
function drawParamsConditions(paramsData) {
					
	var desc, lbl, picklistId, name, td, name,type;
	var tblDiv = $('<div id="tblDiv"></div>'); tbl=$('<table id="paramsTbl" cellspacing="5"></table>'); tr = $('<tr></tr>'), colLen = 3;
	$.each(paramsData, function(k, v) {
		name = v['name'];
		desc = v['description'];
		type = v['param_type'];
		lbl  = v['label'];
		td   = $('<td></td>');
		td.attr('name', name);

		//add element to dom based on type
		switch(type) {

			case 'Picklist Single-select': 
				picklistId = v['picklist'];
				td = reptDrawSinglePickList(lbl, picklistId, td, desc);
				break;

			case 'Picklist Multi-select': 
				td = reptDrawMultiPickList(lbl, td, desc);
				break;

			case 'Date': 
				td = reptDrawDate(lbl, td, desc);
				break;

			case 'DateTime': 
				td = reptDrawDateTime(lbl, td, desc);
				break;

			case 'Checkbox': 
				td = reptDrawCbx(lbl, td, desc);
				break;

			default: alert('Invalid param type: ' +  type + ' is not defined');
				 break;
		}

		
		//add tds to tr
		tr.append(td);

	});

	// //append rest of tr which could not add to tbl because length condtion did not satisfied
		tbl.append(tr);
		
	//add buttons for submission and cancellin purpose
	var frmBtns = "<input type='button' id='cptcTbl' value='Cancel' class='reptFrmBtns blueButton' /><input type='button' id='getReptData' value='Refresh' class='reptFrmBtns blueButton' />";

	//add final tbl to tblDiv
	tblDiv.append(tbl);
	//btns to div
	tblDiv.append(frmBtns);

	//slide up and down div cont
	var slideUpDwnCont = $('<div></div>');
		slideUpDwnCont.attr('id', 'slideUpDwnCont');
		slideUpDwnCont.append(tblDiv); //add tbl div into this container

	//finally add to div to dom
	$('#paramsContainer').append(slideUpDwnCont);

	//initilizing last because, it doen't initilize if does not find element on dom
	if($('#eachParamCondName_0').length > 0)
		initializeCalendar(0); //initialize calendar
	if($('#eachParamCondName_1').length > 0)
		initializeCalendar(1); //initialize calendar
	
}

function reptDrawSinglePickList(lbl, pkId, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';
		td.append(p);
	//add picklist for single select
	var pkList = '<input type="hidden" name="0-1-'+pkId+'-'+pkId+'" id="0-1-'+pkId+'-'+pkId+'" value="">';
		pkList += '<input type="text" class="reptParamsElem" name="0-1-'+pkId+'-'+pkId+'txt" id="0-1-'+pkId+'-'+pkId+'txt" value="2 chars or **" onfocus="changeMultiTxt(this);" onblur="changeMultiTxt(this);" onkeyup="callAjax(\'smartSuggestDiv\',this,event,\'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=Account\',this.value,\'\',\'undefined\');"  autocomplete="off">';
 		pkList += '<div id="smartSuggestDiv"></div>';
 
 		//add pick list to td
 		td.append(pkList);

		return td;
}

function reptDrawMultiPickList(lbl, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	
		td.append(p);
	//add multiple pick list
	 window["array_0_1_4202_multi"] = []; //fix for multiple select box
	 var multipleSel = '<input type="hidden" name="0-1-4202" id="0-1-4202" class="reptParamsElem" value=""><input type="hidden" name="0-1-4202-multi" id="0-1-4202-multi" value=""><input type="hidden" name="0-1-4202-multi-max" id="0-1-4202-multi-max" value="5"><input type="hidden" name="0-1-4202-multi-fun" id="0-1-4202-multi-fun" value="">';
		 multipleSel += '<input type="text" name="0-1-4202-multitxt" id="0-1-4202-multitxt" class="ui-corner-all multiSelectTxt" onkeyup="callAjax(\'multiSelectSugg\',this,event,\'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=Account\',this.value,\'undefined\',\'undefined\');" onfocus="changeMultiTxt(this);" onblur="changeMultiTxt(this);" value="2 chars or **" autocomplete="off"/><div id="multiSelectSugg" name="multiSelectSugg" class="sf_suggestion" ></div>';
		 multipleSel += '<div class="multiSelectBox" name="0-1-4202-multi-multiSelDiv" id="0-1-4202-multi-multiSelDiv"></div>'; 

	//add to td now
	td.append(multipleSel);
	
	return td;
}

function reptDrawDate(lbl, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	
		td.append(p);

	var dt = '<input type="text"  id="eachParamCondName_0" class="reptParamsElem">';
		dt += '<img src="/atCRM/images/calendar.gif" id="calendar_0" alt="Pick Date" style="cursor:pointer;vertical-align:middle;padding-left:1px;" >';
		td.append(dt);

	return td;
}

function reptDrawDateTime(lbl, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	
		td.append(p);

	var dt = '<input type="text"  id="eachParamCondName_1" class="reptParamsElem">';
		dt += '<img src="/atCRM/images/calendar.gif" id="calendar_1" alt="Pick Date" style="cursor:pointer;vertical-align:middle;padding-left:1px;" >';
		td.append(dt);

	var sl = generateSlctTime($('<select id="reptTime"  style="width: 100px;height: 30px;"></select>'));	
	//add select box to td now
	td.append(sl);

	return td;
}

/* 
	* gives the time select box like 1:00 AM etc..
*/
function generateSlctTime(sl)  {
	var t = 12, opt, m='AM';
	for(var j=0; j<2; j++) {
		for(var i=0; i< 12; i++) {
			opt = '<option value="'+t+':00">'+t+': 00 '+m+'</option>';
			sl.append(opt);
			opt = '<option value="'+t+':30">'+t+': 30 '+m+'</option>';
			sl.append(opt);

			//for both am and pm
			if(t == 12)
				t = 0; //because t in incremented so it will start from 1;

			//for changing meridian
			if(i == 11)
				m = 'PM';

			t++;
		}
	}

	return sl;
}

function reptDrawCbx(lbl, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	

		td.append(p);

	var  cbx = "<input type='checkbox' class='reptParamsElem' />";
		 td.append(cbx);

		return td;
}

/* 
	* this will add show or hiding columns feature to data table
*/
function addShorOrHideCols() {
	//add header names in show or hide block
	//this block toggels the display
	$('.dataTables_filter').prepend('<div id="showOrHideCols" title="Show / Hide Columns"></div>');
	var hdrName, cbx;
	$('#reportData thead tr:first-child th').each(function(i) {
		if(i != 0) {
			cbx = '<input type="checkbox" checked="true" id="'+i+'_cbx" style="float:left;margin-right: 4px;" />';
			hdrName = '<span class="toggleColName toggleColNameActv" id="'+i+'">'+ cbx + $(this).text() + '</a>';
			$('#showOrHideCols').append(hdrName);
	    }	    
	});
}

/* 
	* It adds a button for filter columns based on combo box
*/
function filterColsByCombo() {
	$('.dataTables_filter').prepend('<div id="filterColsByCombo" title="Filter Columns"></div>');
}

function initializeCalendar(id) {
	new Calendar({
                inputField: 'eachParamCondName_'+id,
                dateFormat: "%d/%m/%Y", 
                trigger: 'calendar_'+id,
                bottomBar: true,
                fdow:0,
                min: 19000101,
                max: 29991231,
                align: "BL",
                onSelect: function() {
                  this.hide();
                }
            });
}


function getSersType(value) {
	if (value = 1) {return(window.cmb_1 ? cmb_1 : "line");}
	else if (value = 2) {return(window.cmb_2 ? cmb_2 : "line");}
	else if (value = 3) {return(window.cmb_3 ? cmb_3 : "line");}
	else if (value = 4) {return(window.cmb_4 ? cmb_4 : "line");}
	else if (value = 5) {return(window.cmb_5 ? cmb_5 : "line");}
	else if (value = 6) {return(window.cmb_6 ? cmb_6 : "line");}
}

function changeType(chart, newType, chgItem) {
   var serie;
   var chgSer = chgItem;
   var currType = "";
   
   for(var i = 0; i < chart.series.length; i++)
   {
   serie = chart.series[i];
   if (newType != 'none') {
	   i == chgSer ? currType = newType : currType = serie.type;

	   chart.addSeries({
		  type: currType,
		  name: serie.name,
		  data: serie.options.data
	   }, false);
	   
	   serie.remove(false);
   }
   }
   
   chart.redraw();
}

function setupPivot(input){
	input.callbacks = {afterUpdateResults: function(){
	  $('#res_table').dataTable({
		"iDisplayLength": 50,
		"aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
		"bRetrieve": true,
		"oLanguage": {
		  "sLengthMenu": "_MENU_ records per page"
		}
	  });
	}};
	$('.stop-propagation').click(function(event){event.stopPropagation();});
	$('#pivot-menu-container').pivot_display('setup', input);
}


(function($) {
/*
 * Function: fnGetColumnData
 * Purpose:  Return an array of table values from a particular column.
 * Returns:  array string: 1d data array 
 * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
 *           int:iColumn - the id of the column to extract the data from
 *           bool:bUnique - optional - if set to false duplicated values are not filtered out
 *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
 *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
 * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
 */
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
	// check that we have a column id
	if ( typeof iColumn == "undefined" ) return new Array();
	
	// by default we only want unique data
	if ( typeof bUnique == "undefined" ) bUnique = true;
	
	// by default we do want to only look at filtered data
	if ( typeof bFiltered == "undefined" ) bFiltered = true;
	
	// by default we do not wany to include empty values
	if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
	
	// list of rows which we're going to loop through
	var aiRows;
	
	// use only filtered rows
	if (bFiltered == true) aiRows = oSettings.aiDisplay; 
	// use all rows
	else aiRows = oSettings.aiDisplayMaster; // all row numbers

	// set up data array	
	var asResultData = new Array();
	
	for (var i=0,c=aiRows.length; i<c; i++) {
		iRow = aiRows[i];
		var aData = this.fnGetData(iRow);
		var sValue = aData[iColumn];
		
		// ignore empty values?
		if (bIgnoreEmpty == true && sValue.length == 0) continue;

		// ignore unique values?
		else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;
		
		// else push the value onto the result data array
		else asResultData.push(sValue);
	}
	
	return asResultData;
}} (jQuery));

var hdrVal;
function fnCreateSelect( aData, indx ) {
	//this will take the header value from first row of thead, based on index
	hdrVal = $('#reportData thead tr:first-child').find('th:eq('+indx+')').text();

	var r='<th><select class="eachColFilterSelect" title="Filter: '+hdrVal+'" ><option value=""></option>', i, iLen=aData.length;
	for ( i=0 ; i<iLen ; i++ ) {
		r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
	}
	return r+'</select></th>';
}


/* 
	* 
	* reading html data from the table and adding it to new html string
	* some assumptions are made like, first row of thead will contain header
	* javascript download excel
*/
function ExportToExcel(mytblId)
    {

       	htmlData = returnExcelFormatData(mytblId);  //will return html string
    	
       	//format the table
	    var uri = 'data:application/vnd.ms-excel;base64,'
		    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
		    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
			
		var ctx = {worksheet: name || 'Worksheet', table: htmlData};

       	//get the browser app name
       	//global_browser_name this is getting set in jquery-migrate-1.2.1.js file, make sure it exists
       	if(global_browser_name != 'chrome') {
			console.log(uri + base64(format(template, ctx)) + 'mdsaw');
			window.location.href = uri + base64(format(template, ctx));
		}
		else {
			//excel  download with file name
			//getting values of current time for generating the file name
	        var dt = new Date();
	        var day = dt.getDate();
	        var month = dt.getMonth() + 1;
	        var year = dt.getFullYear();
	        var hour = dt.getHours();
	        var mins = dt.getMinutes() + 'mins';
	        var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
			//var data_type = 'data:application/vnd.ms-excel';
			var a = document.createElement('a'); 
			a.id = 'download_xl';
			//a.href =  data_type + ', ' + htmlData;
			a.href = uri + base64(format(template, ctx));
	        //setting the file name
	        a.download = 'canvera_'+postfix+ '.xls';
	        //triggering the function
	        a.click();
        }

    }

    

//returns data as html formated string ex '<table><thead>bla</thead><tbody>bla</tbody></table>'
function returnExcelFormatData(id) {
	var tbl = '<table xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><thead><tr>';

	//form the thead
	//getting first only header text from first row of thead
	var th='', txt;
	$('#'+id+' thead tr:first-child th').each(function() {
		txt = $(this).text().replace(/ /g, ''); //get text and replace space with proper code
		if(txt != '')
			th += '<th>' + $(this).text() + '</th>';		
	});
	tbl += th + '</tr></thead>';
	
	//form the tbody
	var tbody = '<tbody>', tr='', td='';
	var rows = $('#'+id).dataTable().fnGetNodes(); //note this get all the rows in body
	
	//looping each rows children and get only text
	for(row in rows) {
		$(rows[row]).children('td').each(function() {
			txt = $(this).text().replace(/ /g, ''); //get text and replace space with proper code
			if(txt != '')
				td += '<td>'+ txt + '</td>';
		});
		tr += '<tr>' + td + '</tr>';
	}
	tbody += tr + '</tbody>';
	tbl += tbody + '</table>';
	return tbl;
}




function stripJSc (s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }

    var imgs = div.getElementsByTagName('img');
    var i = imgs.length;
    while (i--) {
      imgs[i].parentNode.removeChild(imgs[i]);
    }

    var ayes = div.getElementsByTagName('a');
    var i = ayes.length;
    while (i--) {
      ayes[i].parentNode.removeChild(ayes[i]);
    }

    var inputs = div.getElementsByTagName('input');
    var i = inputs.length;
    while (i--) {
      inputs[i].parentNode.removeChild(inputs[i]);
    }

   return div.innerHTML;
}

