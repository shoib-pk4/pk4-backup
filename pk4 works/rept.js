/* 
	* Note
	Dont add any event listners in below function, becuase every time function is called 
	and event is attached and this behaves differently
*/
var reptCalInitIndx = 0;
function exec_rept (doc, into_div) {
	
	// //before going to datatable function show loading message..
	setTimeout(function() {		
		$('#reptOnloadLoading').html('<center>Data recieved, parsing...</center>');
		//$('#reptOnloadLoading img').attr('src', '').attr('alt','...');
	}, 1000);	


	var piv_str;
	var last_piv_upd = '';
	var init_piv_obj;
	var cht_str;
	var last_cht_upd = '';
	var example      = 'line-basic';
	var theme        = 'default';
	var date_format  ="dd/MM/yyyy";
	dataTblHdr  = doc.dataTblHdr;
	dataTblData = doc.dataTblData;
	var tabsArr = doc.Tabs;
	var params    = doc.Parameters;
	rptName = doc.ReportName;
	document.title = rptName;
	var rptSubName = doc.ReportDesc;	
	paUrl = '';
	rptName;
	pvtAjaxCall = true;
	chartAjaxCall=true;
	totalColCntDt=true;
	
	var cont =  '<div id="reptCanU" style="width:100%;"><div id="reportElementHeader">  <table width="100%" class="reportHeaderCont" > <tr> <td align="left" class="pageTitle" style="width:240px;"> ' + rptName + ' </td><td style="width:300px;" align="left">' + rptSubName + '</td><td align="right" valign="bottom" > <input type="button" class="blueButton reptBtns" value="Parameters" style="width: 100px;" id="showParams" /> <input type="button" class="blueButton reptBtns expBtn" value="Export" style="width: 100px;border-radius: 4px 0px 0px 4px;" id="exportDataTbl" /><div id="reptMoreTblOptCont" ><input type="button" class="reptBtns reptMoreOpt" /> <div class="reptMoreSel" > <div id="reptDtMoreSelc" ></div> </div> </div> </div> </td> </tr> </table><div id="paramsContainer"><div class="reptShowLoading" id="dtLoading"><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div> </div> </div> <div id="tabs-2" > <span id="dtRefreshedAt"></span> <div id="tabs-min" class="tabs ui-tabs ui-widget ui-widget-content ui-corner-all"> <ul id="tabsContainer" class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">  </ul> <div id="tabData"> <table id="reportData"> </table> </div><div id="tabChart" > <div class="highchartsHdr"><div class="reptShowLoading" id="reptChartLoading"><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div><span id="reptChartInstr">You can select the type of chart that you\'d like to see for each set of data here. </span><div id="selectTypeChartCont"></div></div> <div id="tabChartArea" status="0"> <span style="margin-top: 60px;display:block;">Your chart will be displayed here. </span></div> </div><div id="tabMap" >show map here </div> <div id="tabPivot" width="auto"> <div id="pvtLoading" class="reptShowLoading"><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div> <div id="pivot-menu-container">Please select the appropriate columns below to create your own Pivot Report.<br> </div> <div id="k_results"></div><div id="results"> </div> </div> </div> </div> <form name="xlForm" id="xlForm" style="display: none" action="http://sys.impelcrm.in:81/ret_xl.php" onclick="dtExportToExcel(\'reportData\')" method="post"><textarea name="rN" id="rN" style="display: none"></textarea><textarea name="rD" id="rD" style="display: none"></textarea></form></div>';
	
	// var scr = "<script type='text/javascript' src='/atCRM/javascript/JSON/rept-more.js'></script>";
	var sty = '<style type="text/css" id="reptStyle"> #reportElementHeader {min-width: 1000px;width:100%;} #reportData tr th,#reportData tr td  {word-wrap:break-word;min-width:60px;max-width:60px;} .dataTables_info {margin-bottom: 12px; color:grey;}  .dtHdrFixed {position:fixed;background-color:white;top:0;} #selectTypeOfHC, #chartSelXAxis {font-size: 12px;} .dtTotal {background-color: #014464; color: white;}  .dtTotal td {  border:none; border-right: solid 1px grey;border-left: solid 1px grey;} .ui-state-active-droppable {background-color: #DFEB5E !important; } .reptBtns:hover, .reptFrmBtns:hover {background-color:#014464 !important;color:white;} #filterCancel {cursor:pointer;visibility:hidden;} #reportData .Text {text-align: left !important;} #reportData .Integer, #reportData .Number {text-align: right !important;} #reportData tr td {text-align:left;} #hcTypeSelTbl {width: 100%;} #hcTypeSelTbl td { display: inline-block; font-size: 12px; font-weight:bold; } #reportData_wrapper .clear {clear:both;} .pageTitle {font-size: 20px; } .reportHeaderCont { text-align: left; border-radius: 4px; margin: 10px auto; color: white; padding: 5px; background: #014464;background: -moz-linear-gradient(top, #0272a7, #013953);background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#0272a7), to(#013953));border: 1px solid #002232;-moz-box-shadow: inset 0px 0px 1px #edf9ff;-webkit-box-shadow: inset 0px 0px 1px #edf9ff;box-shadow: inset 0px 0px 1px #edf9ff; } .reptBtns {background-color: #fff !important;} #reptMoreTblOptCont {position:relative; width: 30px; height: 30px; float:right; } #reptMoreTblOptCont:hover .reptMoreSel {display:block;} .reptMoreSel a {width: 25px !important;}  .reptMoreSel {display: none; right:0; top:28px;border: solid 1px #F1F1F1; position: absolute; background-color:#DADADA; padding: 4px; border-radius: 2px; z-index:1; width: 42px; } .reptMoreOpt {width: 30px !important;height: 28px; border-radius: 0px 4px 4px 0px; background: url("/atCRM/images/imagesList.png") no-repeat -60px -35px; } #tabMapBtn {display:none !important;}  #tabs-min .ui-tabs-nav li {top: 0px !important;} #k_results #vals, #k_results #rows {width: 15%; }  #k_results #cols {width: 85%;} #reportTblContainer {width: 100%; overflow: auto; } #filterRow th {padding: 4px 0 !important;} .eachColFilterSelect {margin: auto; width: 50px; display: block; } .filterRowHide {display:none;} .reptShowLoading{ display:none;text-align:center;color:red;} .highchartsHdr { font-family: candara, "sans-serif"; text-align:left; font-size:16px;display:block;} #tabChartArea {border: solid 1px #9C9797; display:block; width: 900px;height:400px; margin:auto;} #pivot-menu-container {text-align:left; font-size:14px; font-family:candara; margin:4px 0px;} #selectTypeChartCont {width: 100%;display:block;margin:12px auto;} #tabChart {display:block; margin: auto; width: 90%;} #paramsTbl td input[type=text] { width: 80%; } #paramsTbl td { display: inline-block; vertical-align: top; margin-right: 1.5%; width: 18%; } #slideUpDwnCont {display:none;} .showParamsCondCont {font-size: 16px;font-weight:bold; text-align:left; height: 30px;display:block; } .showParamsCondCont #showParams {float:right;}   #paramsTbl .multiSelectBox {width:82%;} #paramsTbl .sf_suggestion {margin-top: -56px;} #tblDiv {display:inline-block;width:100%;} .reptFrmBtns {float:right;margin-right: 5px; } .reptParamsDesc {font-size: 12px;display: block; color:grey;} #dtRefreshedAt {position:absolute; right: 1%;top: 0; font-size: 12px;} .reptParamsLbl {font-weight: bold; font-family:candara, "sans-serif"; font-size: 14px; letter-spacing: 1px; margin: 4px 0;} #paramsTbl {width:100%; border-collapse: collapse;} #paramsContainer { padding: 0.5% 0; width: 99%; display: block; height:auto;} .filterApplied {background-color:palegreen;} .dpass {display: none;} #reportData tr th {position:relative;} #k_results {display:block;overflow:auto;} #reportData_wrapper {overflow:auto;} #tabs-2 {position:relative;min-width:1000px;width:100%;} #tabs-2 .dataTables_filter {width: 425px; } .removeCol {display:none;} .showOrHideColsActv { height: 250px !important; background-color: white;border: solid 2px white;border-radius: 3px; background-position:top left !important; overflow-x:hidden !important; overflow-y:auto !important; width:220px !important; margin-left: -12.5% !important;} #reportData {text-align:center;} #tabs-min .ui-tabs-nav li {top: 2px !important; }  .toggleColName:hover {background-color:rgb(164, 198, 218);} .toggleColName { border:none; border-top:solid 1px rgba(10, 9, 9, 0.1);width: 100%; cursor: pointer; font-size: 12px; font-family: candara; display:block;margin: 2px 0;text-align:left;padding: 2px 0;} #reportData_filter input { display: inline;} #reportData_length label { width 260px; } #reportData_length select { display: inline-block; } #tabs-min { background: transparent; border: none; } #filterColsByCombo {background: url("/atCRM/images/imagesList.png") no-repeat 1px -2px;} #showOrHideCols, #filterColsByCombo { cursor: pointer; background-color: white; border: solid 1px white; transition: height all 1s; -webkit-transition: all 1s; -moz-transition: all 1s; -o-transition: all 1s; z-index:1; overflow: hidden; position:absolute; width:31px; margin: 0.5% 0 0 -1%; padding: 24px 4px 2px 4px; box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -o-box-sizing: border-box; -ms-box-sizing: border-box; height: 25px;  } #showOrHideCols {margin-left: 2.3%; background: white url("/atCRM/images/gearDown.png") no-repeat top right / 28px 24px;}  #tabs-min .ui-widget-header { background: transparent; border: none; border-bottom: 1px solid #c0c0c0; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; } #tabs-min .ui-state-default { background: transparent; border: none; } #tabs-min .ui-state-active { border: none; } #tabs-min .ui-state-default a { color: #c0c0c0; } #tabs-min .ui-state-active a { color: #459E00; background: transparent url(/atCRM/stylesheets/style_h/images/uiTabsArrow.png) no-repeat bottom center; } .dataTables_wrapper { font-size: 9pt; } .flash{ padding-top:4px; padding-bottom:4px; background-color: #FFFF33; font-weight:bold; font-size:12px;-moz-border-radius: 6px;-webkit-border-radius: 6px; color: black; } .alignRight { text-align: right; } .ui-tabs .ui-tabs-nav { margin: 0; padding: 0 0 0 0.4em; border: 1px solid #d4ccb0; background: none !important;} .blkSdw {box-shadow: 1px 1px 4px black;-moz-box-shadow: 1px 1px 4px black;-webkit-box-shadow: 1px 1px 4px black;-o-box-shadow: 1px 1px 4px black;}  .showingParams {background-color: skyblue !important; color: black;} #slideUpDwnCont {border: solid 1px rgba(0,0,0,0.2); border-left: none;border-right:none;} table#reportData thead tr th {  padding-right:36px; } .filterColsByComboActv { border:solid 1px #FF0606; -webkit-box-shadow: 1px 1px 4px #111010; -moz-box-shadow: 1px 1px 4px #111010;box-shadow: 1px 1px 4px #111010; }  </style>';
	
	into_div.innerHTML = sty + cont;

	
	/* 
		* this contains scripts regarding reports functionality
	*/
		
	/*  Set up the datatable that carries tabular data  */
	// var json_str = JSON.stringify(dataTblData);

	//add tabs 
	$.each(tabsArr, function(k, v) {
		var li = $('<li></li>');
		if(k == 0) {
			li.addClass('ui-tabs-selected ui-state-active');
		}
		var a = $('<a></a>');
			a.attr('href', '#tab'+v).attr('id','tab'+v+'Btn').text(v);
		//add a to li
		li.append(a);
		//add li to menu container
		$('#tabsContainer').append(li);
	});

	/*  Set up the tabs for Data, Chart, Map and Pivot  */
	$('#tabs-min').tabs();

	drawParamsConditions(params);

	//set the width of table	
	var w = $(document).width() - 30;
	$('#tabs-2').css('width', w+'px');
	
	

	plotDataTable(doc);
	

	//remove filters, on load type
	for(var i=0, len = doc['dataTblHdr'].length; i < len; i++) {
		oTable.fnFilter('', i);
	}		
	// iniFnFilter();

	//adds drop down for hiding and showing columns
	addShorOrHideCols();

	//add column wise filter button
	filterColsByCombo();
	
	//adds drop down for filtering based on columns
	addFilteringBasedOnCols(oTable);
	// $('thead tr:last th').each( function ( i ) {
	// 	if(i != 0) {
	// 		this.innerHTML = fnCreateSelect( oTable.fnGetColumnData(i), i );
	// 		$('select', this).change( function () {
	// 			oTable.fnFilter( $(this).val(), i );
	// 		} );
	//    }
	// } );


	//this will show the load time of date table
	showRefreshedDateTimeForDataTbl();

	//show btns related to data tab
	document.getElementById('tabDataBtn').addEventListener('click', function() {
		if($(this).parent().hasClass('ui-state-active'))
			$('#exportPvt').attr('id', 'exportDataTbl'); //changing the ids for dt
		$('#showParams, #dtRefreshedAt, #exportDataTbl, #reptMoreTblOptCont').css('visibility', 'visible');			
		//show copy etc btns of data table
		$('#reptDtMoreSelc .DTTT_container').css('display', 'block');

	}, false);

	//show btns related to pivot tab
	document.getElementById('tabPivotBtn').addEventListener('click', function() {
		
		if($(this).parent().hasClass('ui-state-active'))
			$('#showParams, #dtRefreshedAt').css('visibility', 'hidden');

		$('#slideUpDwnCont').slideUp(); //slide up if params body is open
		$('#exportDataTbl').attr('id', 'exportPvt'); //changing the ids for pvtTable
		$('#reptMoreTblOptCont, #exportPvt').css('visibility', 'visible');			
		$('#reptDtMoreSelc .DTTT_container').css('display', 'none'); //hide copy etc btns of data table

		setTimeout(function() {
			$('#pivot-menu-container').css('display', 'none');
			$('#pvtLoading').css('display', 'block');
		}, 10);
		setTimeout(function() {
			//check if params been refreshed, if so then reload pivot
			if(pvtAjaxCall == true) {
				initializePivot(); //show pivot
			} else 	{
				//hide the loading text
				$('#pvtLoading').css('display', 'none');
				$('#pivot-menu-container').css('display', 'block');
			}
		}, 100);		
	}, false);

	//show btns related to chart tab
	document.getElementById('tabChartBtn').addEventListener('click', function() {
		if($(this).parent().hasClass('ui-state-active'))
			$('#showParams, #dtRefreshedAt, .expBtn, #reptMoreTblOptCont').css('visibility', 'hidden');

		$('#reptDtMoreSelc .DTTT_container').css('display', 'none'); //hide copy etc btns of data table
		$('#slideUpDwnCont').slideUp(); //slide up if params body is open
		setTimeout(function() {
			$('#reptChartInstr').css('display', 'none');
			$('#reptChartLoading').css('display', 'block');
		}, 10);
		setTimeout(function() {
			//shows high charts based on params refresh
			if(chartAjaxCall == true) {
				initializeChart(); 	
			} else {
				$('#reptChartInstr').css('display', 'block');
				$('#reptChartLoading').css('display', 'none');
			}
			
		}, 100);
		
		
	}, false);

	//show btns related to map tab
	document.getElementById('tabMapBtn').addEventListener('click', function() {
		if($(this).parent().hasClass('ui-state-active'))
			$('#showParams, #dtRefreshedAt, .expBtn, #reptMoreTblOptCont').css('visibility', 'hidden');
			$('#reptDtMoreSelc .DTTT_container').css('display', 'none'); //hide copy etc btns of data table
			$('#slideUpDwnCont').slideUp(); //slide up if params body is open
	}, false);


	//wrap report table into div
	wrapReportTblInDiv();

	//clear the previous btns
	$('#reptDtMoreSelc').html('');
	//move data table button to reptDtmoreSel div
	$('.DTTT_container').appendTo('#reptDtMoreSelc');


	//$('.reptOnloadLoading').remove();

	/* end of exec_rept function */
}




$(document).ready(function () {

	//add scripts
	var scr = '<script type="text/javascript" src="https://www.google.com/jsapi"> </script>';
		scr += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/gchart_renderers.js"> </script>';
	$('head').append(scr);

	//makin datable header fixed
	// $(window).scroll(function () {
	// 	var hdr = $('#reportData thead tr:first-child');

	// 	if(hdr.length > 0) {
	// 		hdr = $('#reportData thead tr:first-child');
	// 		var cont = $('#reportTblContainer').offset();
	// 			cont = cont.left;
	// 		var o  = hdr.offset(); 
	// 		var ho = o.top; //header offset
	// 		// var rh = parseInt(hdr.css('height').replace('px', '')); //row height

	// 		var co = $(window).scrollTop();//current window offset

	// 		var podr = ho - co ;// header offset
	// 		if(podr  < 0) {
	// 			//make it fixed
	// 			if($('#reportData thead .dtHdrRowClone').length == 0)
	// 				$('#reportData thead').prepend(hdr.clone().addClass('dtHdrRowClone').css('visibility','hidden'));

	// 			var lft = cont - $('#reportTblContainer').scrollLeft(); //left scroll offset of div
				
	// 			$('#reportData thead tr:nth-child(2)').addClass('dtHdrFixed').css('left', lft+'px');
	// 		} else {
	// 			$('#reportData thead .dtHdrRowClone').remove();
	// 			//remove fixed				
	// 			hdr.removeClass('dtHdrFixed').css('left','0px');				
	// 		}
	//     }

	// });

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

	/* 
		* get the parameters data 
		* form a url and post to server and get the new json and reload the data table
		* getting form elements by class name called reptParamsElem, it is attached to each element for 
		* which we need value
	*/
	$('body').on('click', '#getReptData', function(e) {
		var url='', name, val, multipleTT='',type;

		//first show loading symble
		setTimeout(function() {
			$('#dtLoading').css('display', 'block');
		}, 10);

		var isData = false; //assuming user is send no data
		$('#paramsTbl tr td').each(function() {
			name = $(this).attr('name');
			type = $(this).attr('type');

			if(type == 'Checkbox') {
				//this is for check box
				val  = ($(this).children('.reptParamsElem').prop('checked')==true)?'1':'0';
				// if(val == 1) if(isData==false) isData=true;
				isData=true;
				
			}
			else if(type == 'Picklist Multi-select') {
				arrStr = $(this).children('.reptParamsElem').val().split(',');
				$.each(arrStr, function(k,v) {
					multipleTT += v + ",";
				});
				val = multipleTT.substr(0, multipleTT.length-1);
				if(val != '') if(isData==false) isData=true;
			}
			else if(type == 'Date' || type == 'DateTime') {
				val = $(this).children('.reptParamsElem').val();
				
				//because in this we need time to so concatiating it
				if(type == 'DateTime' && val != '')
					val += ' '+ $(this).children('#reptTime').val(); 

				if(val != '') if(isData==false) isData=true;
			}
			else {
				ths = $(this).children('.reptParamsElem');
				val = ths.val().replace(/'/g, "\\'");
				val = (val == '2 chars or **')?'':val;
				if(val != ''){ 
					if(isData==false) 
						isData=true;
				} else {
					ths.val('');
				}
			}
						
			if(val.length > 0)	
				url += name + val +'!~~!';

		});
	
		if(isData == true)
			url = url.substr(0, url.length - 4); //strip down last ampersand from url
		else
			url = '';

		paUrl = url; //this is global, used of pivot and charts if set
			
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
			var getPParm = getValueFromUrl('pa');
			if(getPParm == ''){
				url = '&pa='+url;
			}
			else{
				var getPParmArr = getPParm.split('!~~!');
				getPParm = getPParmArr[0];
				getPParm = getPParm.replace(/'/g, "");
				url = '&pa='+getPParm+'!~~!'+url;					
			}
			setTimeout(function () {
				postDataTorAnFile(url, id);	
			}, 100);
			
		}

		//set pivot and chart ajax trigger to true
		pvtAjaxCall = true;
		chartAjaxCall = true;
		totalColCntDt = true; //this means, total for data table needs to calculate again

	});

	//on applying filter to cols, show some indication
	$('body').on('change', '.eachColFilterSelect', function() {
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

	//this will export data table to excel
	$('body').on('click','#exportDataTbl', function() {
		dtExportToExcel('reportData');
	});

	//this will export pivot table to excel
	$('body').on('click','#exportPvt', function() {
		pvtExportToExcel();
	});

	//show or hide col
	colIdsForWhichFiltersApplied = []; //this is global, bad practise but no choice
	$('body').on('click', '.toggleColName', function(e) {
			
		var colId = $(this).attr('id');
		var cbxId = colId + '_cbx';

		if($(this).hasClass('toggleColNameActv')) {
			//hide column
			$('#reportData tr').each(function() {
				// $(this).find("th:eq("+colId+")").addClass('removeCol');
				// $(this).find("td:eq("+colId+")").addClass('removeCol');
				$(this).find("th:eq("+colId+")").addClass('dpass');
				$(this).find("td:eq("+colId+")").addClass('dpass');
			});			

			//this is for total tr
			// $('#tmpDivForTot table tbody tr td').eq(colId).addClass('removeCol');	
			$('#tmpDivForTot table tbody tr td').eq(colId).addClass('dpass');	
				
			$('#'+cbxId).prop('checked', false);
			$(this).removeClass('toggleColNameActv');

			//store the column ids for which it applied filters, this is fix for sorting or searching before applying filters #shoib
			colIdsForWhichFiltersApplied.push(colId);
		} 
		else {
			//show the column
			$('#reportData tr').each(function() {
				// $(this).find("th:eq("+colId+")").removeClass('removeCol');
				// $(this).find("td:eq("+colId+")").removeClass('removeCol');
				$(this).find("th:eq("+colId+")").removeClass('dpass');
				$(this).find("td:eq("+colId+")").removeClass('dpass');
			});

			//this is for total tr
			// $('#tmpDivForTot table tbody tr td').eq(colId).removeClass('removeCol');	
			$('#tmpDivForTot table tbody tr td').eq(colId).removeClass('dpass');	
				
			$('#'+cbxId).prop('checked', true);
				$(this).addClass('toggleColNameActv');

			//if cols checked, means showing, then remove that element from global arr	
			var indx = colIdsForWhichFiltersApplied.indexOf(colId);	
			if(indx > -1) {
				colIdsForWhichFiltersApplied.splice(indx, 1);
			}
		}

		


		e.stopPropagation();
	});

	$('body').on('click','#showOrHideCols', function(e) {
			
		if($(this).hasClass('showOrHideColsActv'))
			$(this).removeClass('showOrHideColsActv').removeClass('blkSdw');
		else
			$(this).addClass('showOrHideColsActv').addClass('blkSdw');

		e.stopPropagation();
	});


	//on clicking the input field pop up date, and focus out of input field
	$('body').on('click','#eachParamCondName_0',function() {		
		$('#calendar_0').trigger('click');
	});

	//on clicking the input field pop up date, and focus out of input field
	$('body').on('click','#eachParamCondName_1',function() {
		$('#calendar_1').trigger('click');
	});

	//show filter column
	$('body').on('click','#filterColsByCombo', function() {

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

	//show chart based on select type
	$('body').on('change','.selectTypeOfHC', function() {
		var ths = $(this);

		var id   = ths.attr('id');
		var typ  = ths.val();
		var name = ths.attr('name');
		var indx = id.split('_').pop();
		var delIndx = 'null';

		var s   = globalChartPlotted.series;
		var cnt = s.length;			
		//remove chart if none
		//check if already it has plotted with the same name, then remove previous and replot
		for(var i=0; i<cnt; i++) {
			if(s[i]['name'] == name) {
				delIndx = i;
			}
		}
		//delete if key found
		if(delIndx != 'null') {
			s[delIndx].remove(false); 
			globalChartPlotted.redraw();
		}
		//show the chart, if type is not equal to none
		if(typ != 'none') {
			//get series here
			var data = adHchart['series'][indx]['data'];
			if(typ == 'pie' || typ == 'funnel') {
				var ind = $('#chartSelXAxis').val();
					ind = (ind < 0)? 0: ind;
				var ycol = returnColValues(ind);
				var newData = [], tempData;
				$.each(ycol, function(k, v) {
					//preparing two values arr each time and pushing newdata array;
					tempData = [];
					tempData.push(v.toString());
					tempData.push(data[k]);
					newData.push(tempData);
				});
				data = newData; //add newdata array to data
				newData = []; //clear the arr, save some mem
			}				
				plotChart(data, name, typ);				
		}
    		
	});

	//reset filter
	$('body').on('click', '#filterCancel', function() {
		$('#reportData_filter label input[type=text]').val('').trigger('keyup');
		$(this).css('visibility', 'hidden');
	});

	//change x axis based for highcharts
	$('body').on('change', '#chartSelXAxis', function() {
		var ind = $(this).val();
		
		var data = returnColValues(ind); 
		setXAxis(data);
		try {
			globalChartPlotted.redraw();
		}
		catch(e) {
			alert(e);
		}
	});

	$('body').on('mousedown', '#unused', function() {
		$('#cols, #rows, #vals').addClass('ui-state-active-droppable');
	})
	$('body').on('mouseup', '#unused', function() {
		$('#cols, #rows, #vals').removeClass('ui-state-active-droppable');
	});	

	//on rept scroll set rept total to same scroll positions
	$('body').on('mousedown', '#reportTblContainer', function() {				
		var c =  $('#reportTblContainer');
		if(c.length > 0) {
			$('#reportTblContainer').bind('scroll', function() {
				$('#tmpDivForTot').scrollLeft(c.scrollLeft());			
			});								
		}
	});

	//on mouseup remove bind event
	$('body').on('mouseup', '#reportTblContainer', function() {				
		var c =  $('#reportTblContainer');
		if(c.length > 0) {
			$('#reportTblContainer').unbind('scroll');						
		}
	});

	//limit integer only
	$('body').on('keydown', '.reptIntegerOnly', function(e) {
		 var ac = e.which;    
	    if((( ac >= 48 && ac<= 57) || (ac >= 96 && ac <= 105) || (ac >= 37 && ac <= 40)) || (ac == 8) || (ac == 46)) 
	        return true;
	    else
	        return false;
	});

	$('body').on('keydown', '.reptLimitDecimal', function(e) {
		 var ac = e.which;    
	    if((( ac >= 48 && ac<= 57) || (ac >= 96 && ac <= 105) || (ac >= 37 && ac <= 40)) || (ac == 8) || (ac == 46) || (ac == 190) || (ac == 110)) 
	        return true;
	    else
	        return false;
	});

	//limit decimal upto two point
	$('body').on('blur', '.reptLimitDecimal', function(e) {
		 var t = $(this);
		 var deci = t.val();
		 var twoDeci = Math.round(deci * 100) / 100;
		 t.val(twoDeci);
	});

	//on mouse over of rept can change width of tabs
	var tempDocWidth='';
	$('body').on('mouseover', '#reptCanU', function() {
		//set the width of table	
		var doc =  $(document);
		var w = doc.width() - 30;
		if(w != tempDocWidth) {
			var sw = screen.width;
			$('#tabs-2').css('width', (sw-30)+'px');		
			
			w = doc.width() - 30; //takin one more time becuase previous w will be diffrent after applying screen width;
			$('#tabs-2').css('width', w+'px');		
			tempDocWidth = w;
		}
	});


	/* end of document ready */
});



/* 
	* this will add as select box as many as different type of charts required
*/
function drawSelectBoxForHighcharts(chartData) {

	//add the options for types of chart
	var typeHC = {
		"none": "none",
		"area" : "Area Chart", 
		"arearange": "Area Range Chart",
		"areaspline": "Areaspline Chart",		
		"bar": "Bar Chart", 
		"bubble": "Bubble Chart",
		"column": "Column Chart",
	    "funnel": "Funnel Chart",
	    "line": "Line Chart",
		"pie": "Pie Chart",
		"waterfall": "Waterfall Chart"
	};
	var totSeries = chartData['series']; 
	var i=0, sel,opt, tbl,n,ctr, ctd,nv, cXA;
	tbl = $('<table width="100%" id="hcTypeSelTbl"></table>');
	
	//prepare selecting x axis for charts
	cXA = $('<tr></tr>').append('<label style="font-weight:bold;"> Select x-axis</label>');
	selXA = $('<select></select>');
	selXA.attr('id', 'chartSelXAxis');
	selXA.append('<option value="-1"> Default </option>'); //add default x axis
	$.each(dataTblHdr, function(k, v) {
		opt = '<option value="'+k+'">'+v['sTitle']+'</option>';
		selXA.append(opt);
	});
	
	//y axis label
	var cYA = $('<tr></tr>').append('<label style="font-weight:bold;border:none;border-top:solid 1px #C5C5C5;">Select y-axis</label>');

	ctr = $('<tr></tr>'); //ctr content row
	$.each(totSeries, function(k, v) {
		ctd = $('<td></td>');
		nv  = v['name']; //name
		// selXA.append('<option value="'+nv+'">'+nv+'</option>'); //add each col name to x axis combo
		n = '<label>' + nv + '</label>';		
		ctd.append(n); //add name to td
		sel = $('<select></select>');
		sel.attr('id', 'showChart_'+i).addClass('selectTypeOfHC').attr('name', nv);
		//add options
		$.each(typeHC, function(k1,v1) {
			opt = '<option value="'+k1+'">'+v1+'</option>';
			sel.append(opt);
		});
		
		ctd.append(sel); //add select box to td
		ctr.append(ctd); //add td to tr
		i++;
	});
	cXA.append(selXA);
	tbl.append(cXA).append(cYA);
	tbl.append(ctr); //add row to table

	$('#selectTypeChartCont').append(tbl); //once done with select box add to dom

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

			//first show loading symble
			setTimeout(function() {
				$('#dtLoading').css('display', 'none');
			}, 100);



		},
		error: function(response) {
			//first show loading symble
			setTimeout(function() {
				$('#dtLoading').css('display', 'none');
			}, 100);

			alert('Refresh table failed. Check whether json is valid or not!! Aborted');
			console.log(response.responseText);
		},
	});
}

function showRefreshedDateTimeForDataTbl() {
	// show the refresh time to user
	var now = new Date();
	var d = now.format().split(' ');
	var df = d[2] + ' ' + ' ' + d[1] + ' ' + d[3] + ', ' + d[4] + ' IST';

	$('#dtRefreshedAt').text('Refreshed: '+ df);
}

/*
	* this gives the value of variable from url
	* need 1 parameter, which is variable name
 */
 function getValueFromUrl(name) {
 	var query = $('.subMnuSpan_current').parent().attr('href'); //document.URL;
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
	
	if(typeof oTable != undefined) {
		$('#tabData').children().remove();
		$('#tabData').html('<table id="reportData"> </table>');	
		//remove filters		
		for(var i=0, len = data['dataTblHdr'].length; i < len; i++) {
			oTable.fnFilter('', i);
		}		
		iniFnFilter();
	}

	plotDataTable(data);
	


	//clear the previous btns
	$('#reptDtMoreSelc').html('');
	//move data table button to reptDtmoreSel div
	$('.DTTT_container').appendTo('#reptDtMoreSelc');

	// add drop down for filtering based on columns
	addFilteringBasedOnCols(oTable);

	//adds drop down for shoing or hiding columns
	addShorOrHideCols();

	//add filter column button
	filterColsByCombo();

	//wrap report table into div
	wrapReportTblInDiv();

	//remove filters once datatable drawn
	$('#filterCancel').trigger('click');
	$('#filterDtTable').blur();
}

/* 
	* plot datatable
*/
function plotDataTable(data) {
	dataTblHdr = data['dataTblHdr'];
	dataTblData = data['dataTblData'];

	oTable = $('#reportData').dataTable({
			"aaData": dataTblData,	
			"aoColumnDefs": dataTblHdr,
			"aLengthMenu":[[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
			//"sDom": "\"<clear>\"frtip",
			// "sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
			"sDom": 'T<"clear">lfrtip<"clear">',
			"aaSorting": [[0, 'asc']],
			'iDisplayLength': 10, //this works, Tip: if not revert statsave to false and check.
			"bLengthChange": true, 
			"bDestroy": true,
			// "sScrollX": "100%",
			"bStateSave": true,//saves the states, comment this if cookies are big
			"oLanguage": {
				"sSearch": "Search all columns:"
			},
			"oTableTools": {
				"aButtons": [ "print"], //"xls","copy", "csv", "pdf"  
				"sSwfPath": "/atCRM/javascript/jquery/swf/copy_csv_xls_pdf.swf"
			},
			"fnRowCallback": function( nRow, aData, iDisplayIndex ) { 
				//this call back makes slow while filtering
				var len = aData.length, cn, td, num, val;
				for(var i=0;i<len; i++) {
					td = $('td:eq('+i+')', nRow);
					cn = td[0]['className']; //this is assumption that in zero will find class name
					val = aData[i];
					if(cn.match(/Integer/g)) {
						td.html(Math.floor(val));
					}
					if(cn.match(/Number/g)) {
						num = Math.round(val * 100) / 100;
						td.html(val);
					}
				}
			},
			"fnDrawCallback": function() {
				//this is called when data table has been drawn completely 
				addTrForShowingTotal();

				//show or hide cols after dt modifying
				showOrHideColsAfterDtModifying();
			}
	});

		
	//show total entries
	var totEntries = dataTblData.length;
	$('#reportData_length label').append( ' (Total '+ totEntries + ')');
	
}

/* 
	* this is fix for improper columns showing and adding after adding filters and then sorting etc..
*/
function showOrHideColsAfterDtModifying() {
	$.each(colIdsForWhichFiltersApplied, function(k,colId) {
		//hide column
		$('#reportData tr').each(function() {
			// $(this).find("th:eq("+colId+")").addClass('removeCol');
			// $(this).find("td:eq("+colId+")").addClass('removeCol');
			$(this).find("th:eq("+colId+")").addClass('dpass');
			$(this).find("td:eq("+colId+")").addClass('dpass');
		});			

		//this is for total tr
		// $('#tmpDivForTot table tbody tr td').eq(colId).addClass('removeCol');	
		$('#tmpDivForTot table tbody tr td').eq(colId).addClass('dpass');
	});
}

/* 
	* this will add the a row for dt, containing sum of all cols
*/
var trDtRes='<tr></tr>';
function addTrForShowingTotal() {
	if(totalColCntDt == true) {
		//get the count of total cols
		var colHdrLen = dataTblHdr.length;
		var colDtLen  = dataTblData.length;
		var colTotReq = ['Number', 'Integer'];
		// var indexOfTotalCols = []; //this will contain index of each data row, which needs to totaled
		var tr = $('<tr></tr>'), td, t, fc, toNum;
		for(var i=0, fc="dpass"; i<colHdrLen; i++, fc="") {
			t=0;
			if($.inArray(dataTblHdr[i]['sClass'], colTotReq) != -1 ) {
				// indexOfTotalCols.push(i);
				t =0;
				for(var j=0; j<colDtLen; j++) {
					toNum  = dataTblData[j][i];

					if(toNum.length>0) 
						t = +t + +toNum;

				}
				t = Math.round(t);
				td = '<td style="text-align:right;padding:3px 18px 3px 10px;min-width:60px;max-width:60px;" class="dtTotal'+fc+'">'+ t + '</td>';	
			} 
			else {
				td = '<td class="'+fc+'" style="font-weight:bold;padding:3px 18px 3px 10px;min-width:60px;max-width:60px;"></td>'; //dataTblHdr[i]['sTitle'] 
			}
			
			tr.append(td); //add td to row,
		}
		trDtRes = tr; //this is global	
		totalColCntDt = false; //set to false finishing totaling	
	} 
	$('table#reportData tbody').append(trDtRes);

	// setTimeout("moveReptTotalOutside();", 1000);
	moveReptTotalOutside();
}

/* 
	* moves total to outside div
*/
function moveReptTotalOutside() {
	if($('#tmpDivForTot').length > 0) {
		$('#tmpDivForTot').remove()
	}
	var tblWidth = $('#reportData').css('width');	
	var tmpDiv = $('<div id="tmpDivForTot" style="width:100%;overflow-x:auto;overflow-y:hidden;"></div>');
			tmpDiv.css({'width':'100%','overflow':'hidden'});
	var tmpTbl = $('<table></table>');		 		
		  tmpTbl.css('width', tblWidth);
	
	//move last row outside the div
	$('#reportData tbody tr:last-child').appendTo(tmpTbl);
	tmpDiv.append(tmpTbl);
	$('#reportData_wrapper').append(tmpDiv);

}

/*
	* this will add filters drop down for filtering based on columns
*/
function addFilteringBasedOnCols(oTable) {
	// console.log('filtering added..');
	/* Add a select menu for each TH element in the table header */
	var thLen = $('#reportData').children('thead').children('tr').children('th').length;
	
	$('#reportData thead').append('<tr id="filterRow" class="filterRowHide" ></tr>'); //add row to thead

	for (var ix=0; ix < thLen; ix++) {
		if(ix == 0)
			$('#reportData thead #filterRow').append("<th class='dpass'></th>");	//hiding first col
		else
			$(' #reportData thead #filterRow').append("<th></th>");	
	}

	iniFnFilter();
}

//this will initialize filters
function iniFnFilter() {
	//this is for add select filters
	$('#reportData thead tr:last th').each( function ( i ) {
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
	//hide the params button if length is 0
	if(!paramsData) {
		$('#showParams').css('display', 'none');
		return;
	}		
	var desc, lbl, picklistId='', name, td, name,type;
	var tblDiv = $('<div id="tblDiv"></div>'); tbl=$('<table id="paramsTbl" cellspacing="5"></table>'); tr = $('<tr></tr>'), colLen = 3;
	$.each(paramsData, function(k, v) {
		name = v['name'];
		desc = v['description'];
		type = v['param_type'];
		lbl  = v['label'];
		td   = $('<td></td>');
		td.attr('name', name).attr('type',type);

		//add element to dom based on type
		switch(type) {

			case 'Picklist Single-select': 
				picklistId = (v['picklist']=='')?picklistId:v['picklist'];
				td = reptDrawSinglePickList(lbl, picklistId, td, desc);
				break;

			case 'Picklist Multi-select': 
				picklistId = (v['picklist']=='')?picklistId:v['picklist'];
				td = reptDrawMultiPickList(lbl,picklistId, td, desc);
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

			case 'Text':
				 td.append('<input  type="text" name="" class="reptParamsElem" />');
				 break;	

			case 'Integer':
				 td.append('<input  type="text" name="" class="reptParamsElem reptIntegerOnly" />');
				 break;	

			case 'Decimal':
				 td.append('<input  type="text" name="" class="reptParamsElem reptLimitDecimal" />');
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
	$('.reptdateTime').each(function() {
		var id = $(this).attr('id').split('_').pop();
		initializeCalendar(id);
	});

}

function reptDrawSinglePickList(lbl, pkId, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';
		td.append(p);
	//add picklist for single select
	var pkList = '<input type="hidden" class="reptParamsElem" name="0-1-'+pkId+'-'+pkId+'" id="0-1-'+pkId+'-'+pkId+'" value="">';
		pkList += '<input type="text"  name="0-1-'+pkId+'-'+pkId+'txt" id="0-1-'+pkId+'-'+pkId+'txt" value="2 chars or **" onfocus="changeMultiTxt(this);" onblur="changeMultiTxt(this);" onkeyup="callAjax(\'smartSuggestDiv\',this,event,\'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListId='+pkId+'\',this.value,\'\',\'undefined\');"  autocomplete="off">';
 		pkList += '<div id="smartSuggestDiv"></div>';
 
 		//add pick list to td
 		td.append(pkList);

		return td;
}

function reptDrawMultiPickList(lbl, pkId, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	
		td.append(p);
	//add multiple pick list
	 window["array_0_1_4202_multi"] = []; //fix for multiple select box
	 var multipleSel = '<input type="hidden" name="0-1-4202" id="0-1-4202" class="reptParamsElem" value=""><input type="hidden" name="0-1-4202-multi" id="0-1-4202-multi" value=""><input type="hidden" name="0-1-4202-multi-max" id="0-1-4202-multi-max" value="5"><input type="hidden" name="0-1-4202-multi-fun" id="0-1-4202-multi-fun" value="">';
		 multipleSel += '<input type="text" name="0-1-4202-multitxt" id="0-1-4202-multitxt" class="ui-corner-all multiSelectTxt" onkeyup="callAjax(\'multiSelectSugg\',this,event,\'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListId='+pkId+'\',this.value,\'undefined\',\'undefined\');" onfocus="changeMultiTxt(this);" onblur="changeMultiTxt(this);" value="2 chars or **" autocomplete="off"/><div id="multiSelectSugg" name="multiSelectSugg" class="sf_suggestion" ></div>';
		 multipleSel += '<div class="multiSelectBox" name="0-1-4202-multi-multiSelDiv" id="0-1-4202-multi-multiSelDiv"></div>'; 

	//add to td now
	td.append(multipleSel);
	
	return td;
}

function reptDrawDate(lbl, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	
		td.append(p);

	var dt = '<input type="text"  id="eachParamCondName_'+reptCalInitIndx+'" class="reptParamsElem reptdateTime">';
		dt += '<img src="/atCRM/images/calendar.gif" id="calendar_'+reptCalInitIndx+'" alt="Pick Date" style="cursor:pointer;vertical-align:middle;padding-left:1px;" >';
		td.append(dt);

	reptCalInitIndx++;
	return td;
}

function reptDrawDateTime(lbl, td, desc) {
	var p = '<p class="reptParamsLbl">'+lbl+'<span class="reptParamsDesc">'+desc+'</span></p>';	
		td.append(p);

	var dt = '<input type="text"  id="eachParamCondName_'+reptCalInitIndx+'" class="reptParamsElem reptdateTime">';
		dt += '<img src="/atCRM/images/calendar.gif" id="calendar_'+reptCalInitIndx+'" alt="Pick Date" style="cursor:pointer;vertical-align:middle;padding-left:1px;" >';
		td.append(dt);

	var sl = generateSlctTime($('<select id="reptTime"  style="width: 100px;height: 30px;"></select>'));	
	//add select box to td now
	td.append(sl);

	reptCalInitIndx++;
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
	* this will wrap repotData table into div
*/
function wrapReportTblInDiv() {
	var newDiv = $('<div></div>');
		newDiv.attr('id', 'reportTblContainer');
		//now add new div to dom after reportData_filter id
		$('#reportData_filter').after(newDiv);
		//now move report data table to new div
		$('#reportData').appendTo('#reportTblContainer');
}

/* 
	* this will add show or hiding columns feature to data table
*/
function addShorOrHideCols() {
	// console.log('show or hide added..');
	//add header names in show or hide block
	//this block toggels the display
	$('.dataTables_filter').prepend('<div id="showOrHideCols" title="Show / Hide Columns"></div>');
	$('.dataTables_filter label').append('<span id="filterCancel"> X </span>');
	$('.dataTables_filter label input[type=text]').attr('id', 'filterDtTable');
	var hdrName, cbx;
	$('#reportData thead tr:first-child th').each(function(i) {
		if(i != 0) {
			cbx = '<input type="checkbox" checked="true" id="'+i+'_cbx" style="float:left;margin-right: 4px;" />';
			hdrName = '<span class="toggleColName toggleColNameActv" id="'+i+'">'+ cbx + $(this).text() + '</a>';
			$('#showOrHideCols').append(hdrName);
	    }	    
	});

	//add listener for dt table filter
	document.getElementById('filterDtTable').addEventListener('keyup', function() {
		if($('#filterDtTable').val() != '') {
			$('#filterCancel').css('visibility', 'visible');
		} else {
			$('#filterCancel').css('visibility', 'hidden');
		}
	}, false); //false because id doesn't stops event bubbling
}

/* 
	* It adds a button for filter columns based on combo box
*/
function filterColsByCombo() {
	// console.log('filtering by combo added..');
	$('.dataTables_filter').prepend('<div id="filterColsByCombo" title="Filter Columns"></div>');
}

function initializeCalendar(id) {
	new Calendar({
                inputField: 'eachParamCondName_'+id,
                dateFormat: "%Y-%m-%d", 
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
	* this will export pivot table to excel
*/
function pvtExportToExcel() {
	//prepare excel format html
	var tbl = $('<table></table>');

	//prepare first row
	//preparing first col
	var frow = $('<tr></tr>');
		frow.append('<td>'+$('#aggregator').val()+'</td>');

	//preparing second col
	var ftd = $('<td></td>');
	var ftdt = '';
	$('#k_results table tbody #cols nobr').each(function() {
		var t = $(this).text();
		ftdt += t + ',';
	});
	ftdt = ftdt.substr(0, ftdt.length-1);
	ftd.append(ftdt);
	frow.append(ftd);

	//prepare second row
	//preparing first col
	var srow = $('<tr></tr>');
	var std = $('<td></td>');
	var stdt = '';
	$('#k_results table tbody #rows nobr').each(function() {
		var t = $(this).text();
		stdt += t + ',';
	});
	stdt = stdt.substr(0, stdt.length-1);
	std.append(stdt);
	srow.append(std);

	//preparing second col
	//srow.append('<td id="tblData">'+$('.pvtTable').parent().html()+'</td>');
	var std1 = $('<td></td>');
	var std1tbl = $('<table></table>');
	$('.pvtTable tr').each(function () { 
		var tr = $('<tr></tr>'), ts, td;
		if($(this).children('th')) {
			$(this).children().each(function() {
			ts = $(this);
			td = $('<td></td>');
				td.attr('colspan', ts.attr('colspan'));
				td.attr('rowspan', ts.attr('rowspan'));
				td.text(ts.text());
				tr.append(td);
		});
		}
		
		
		std1tbl.append(tr);
	});
	std1.append(std1tbl); //add table to td
	srow.append(std1); //add to row

	//now add contents to main tbl
	tbl.append(frow).append(srow);
	// var htmlData = tbl.toString();

	//container of table
	var c = $('<div></div>');
		c.append(tbl);


	//send data wrapped properly in table, sending as html obj
	downloadAsExcel(c.html());
}


/* 
	* 
	* reading html data from the table and adding it to new html string
	* some assumptions are made like, first row of thead will contain header
	* javascript download excel
*/
function dtExportToExcel(mytblId)
    {
       	var htmlData = returnExcelFormatData(mytblId);  //will return html string
    	
    	//send data wrapped properly in table, sending as string
       	downloadAsExcel(htmlData);

    }

/* 
	* recieves a string, and downloads to excel
*/
function downloadAsExcel(htmlData) {
	//format the table
	    var uri = 'data:application/vnd.ms-excel;base64,'
		    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
		    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
			
		var ctx = {worksheet: name || 'Worksheet', table: htmlData};

       	//get the browser app name
       	//global_browser_name this is getting set in jquery-migrate-1.2.1.js file, make sure it exists
       	if(global_browser_name != 'chrome') {
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
//dataTblHdr and dataTblData is global variables
function returnExcelFormatData(id) {

	var tbl = '<table xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><thead><tr>';
	
	//prepare heading
	var th='';
	$.each(dataTblHdr, function(k,v) {
		if(k != 0)
			th += '<th>' +v['sTitle']+ '</th>';
	});
	tbl += th + '</tr></thead>';

	//prepare body
	var tbody = '<tbody>', tr='', td='';
	$.each(dataTblData, function(k, v) {
		tr += '<tr>';
		$.each(v, function(k1, v1) {
			if(k1 != 0)
			tr += '<td>'+v1+'</td>';
		});
		tr +='</tr>';
	});

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


/* 
	* Ploting graph using highcharts
*/
function plotChart(d, n, t) {

	globalChartPlotted.addSeries({
		type: t,
		name: n,
		data: d,
	}, false);

	globalChartPlotted.redraw();

}


/* 
	* this will initilize high charts
*/
function initializeChartsObj(reptName, cate) {
	var ChartObj = {
	        chart: {
	            renderTo: 'tabChartArea',
	            type: 'column'
	        },
	        title: {
	        	text: reptName
	        },
	        xaxis: [{
	        	categories:cate,
	        	maxPadding: 0.5,
	        	labels: {
            		overflow: 'justify'
            	},
	        }],
	        yaxis: [{
	        	title: { text: 'Y-Axis'}
	        }],	  
	        credits: {
	        	enabled: false
	        },     
	        series: []
    	};
	globalChartPlotted = new Highcharts.Chart(ChartObj); //this will plot the chart on load

	//set the status of parent element 1
	$('#tabChartArea').attr('status','1');

	$('#reptChartInstr').css('display', 'block');
	$('#reptChartLoading').css('display', 'none');
	return;
}



/*
	* initializes the pivot, and removes previous initilized data
*/
function initializePivot() {
/*  Set up the Kruchten pivot table */
$("#k_results").children().remove(); //empty if any
 var id = getValueFromUrl('i');
 if(id == '')
 	return alert('Abort: i values is mission from url.');
 var getPParm = getValueFromUrl('pa');
	if(getPParm == ''){
		paUrl = '&pa='+paUrl;
	}
 else{
	var getPParmArr = getPParm.split('!~~!');
	getPParm = getPParmArr[0];
	getPParm = getPParm.replace(/'/g, "");
	paUrl = '&pa='+getPParm+'!~~!'+paUrl;					
 }


 $.ajax({
		url: '/atCRM/custom/adhocReports/rAn.htm',
		data: 'i='+id+paUrl+'&t=p',
		type: 'GET',
		dataType: 'JSON',
		async: false,
		success: function(data) {
			setTimeout(function(){google.load('visualization', '1', {'callback':'', 'packages':['corechart']})}, 20);
			$(function(){
					var derivers = $.pivotUtilities.derivers;
					var renderers = $.extend($.pivotUtilities.renderers, 
                    				$.pivotUtilities.gchart_renderers);
					var piv_jason = data.piv_json;

					$(function() {
						$("#k_results").pivotUI(piv_jason, {
							renderers: renderers,
							derivedAttributes: {
						}

					});
				});

					
	 		});
			//hide the loading text
			$('#pvtLoading').css('display', 'none');
			$('#pivot-menu-container').css('display', 'block');

			//set pivot ajax call to false, only if pivot is drawn
			pvtAjaxCall = false;
	},
	error: function(response) {
		alert('Pivot initializing failed. Check whether json is valid or not!! Aborted');
		console.log(response.responseText);
	},
 });

 	
}


/*
	* initializes the chart, and removes previous initilized data
 */
 function initializeChart() {
 	//initialize high charts, for first time only
	//this will create a default object of charts
	if($('#tabChartArea').attr('status') == '0'){
		var data = returnColValues(0);  //this is by default taking 0th index of dt
	  	initializeChartsObj(rptName, data);
	 } else {
	 	var data = returnColValues(0); //this is by default taking 0th index of dt
	 	globalChartPlotted.destroy();
	 	initializeChartsObj(rptName, data);
	 }

	$("#selectTypeChartCont").children().remove(); //empty if any

	var id = getValueFromUrl('i');
	if(id == '')
	 	return alert('Abort: i values is mission from url.');
	 var getPParm = getValueFromUrl('pa');
		if(getPParm == ''){
			paUrl = '&pa='+paUrl;
		}
	 else{
		var getPParmArr = getPParm.split('!~~!');
		getPParm = getPParmArr[0];
		getPParm = getPParm.replace(/'/g, "");
		paUrl = '&pa='+getPParm+'!~~!'+paUrl;					
	 }


 	$.ajax({
		url: '/atCRM/custom/adhocReports/rAn.htm',
		data: 'i='+id+paUrl+'&t=c',
		type: 'GET',
		dataType: 'JSON',
		async: false,
		success: function(data) {
			adHchart = data.adhChart;
			drawSelectBoxForHighcharts(adHchart); //data.adhChart;
			chartAjaxCall = false; //set flase only if chart is dra
		},
		error: function(response) {
			alert('Chart initializing failed. Check whether json is valid or not!! Aborted');
			console.log(response.responseText);
		},
 	});
 	
 }

/* 
	* this will set x axis of global object
*/
function setXAxis(data) {
	// var maxVal = Math.max.apply( Math, data );
	globalChartPlotted.xAxis[0].setCategories(data);
	// console.log(globalChartPlotted);
	// globalChartPlotted.xAxis[0]['min'] = 0;
	// globalChartPlotted.xAxis[0]['max'] = maxVal;
	// globalChartPlotted.xAxis[0]['dataMin'] = 0;
	// globalChartPlotted.xAxis[0]['dataMax'] = maxVal;
	// globalChartPlotted.xAxis[0]['tickPositions'] = [0, 20,40,60,80,00,120,140,160,180];	
}


/* 
	* returns column values of particular index
*/
function returnColValues(ind)  {
	var data = [];
	if(ind > -1) {
		$.each(dataTblData, function(k, v) {
			data.push(v[ind]);
		});
	}

	return data;
}


// function lAddIsDataTable ( nTable )
// {
//     var settings = $.fn.dataTableSettings;
//     for ( var i=0, iLen=settings.length ; i<iLen ; i++ )
//     {
//         if ( settings[i].nTable == nTable )
//         {
//             return true;
//         }
//     }
//     return false;
// }


