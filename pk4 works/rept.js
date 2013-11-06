/* 
	* Note
	Dont add any event listners in below function, becuase every time function is called 
	and event is attached and this behaves differently
*/
var reptCalInitIndx = 0, _reptPaginationFlag=false, _reptPageSize, initReptDataTable=false, reptEntityName, _reptPagination=1, _reptTmpResultCnt=0, _reptCurrentResultCnt=0, _reptPaginatioArr=[''], _reptPaginationStatus;
function exec_rept (doc, into_div) {
	
	var tabsArr = doc.Tabs, params    = doc.Parameters, rptSubName = doc.ReportDesc;

    //this are global vars
	dataTblHdr  = doc.dataTblHdr;
	// dataTblData = formatNumbering(doc.dataTblData, dataTblHdr); //returns valid numbers	
	rptName = doc.ReportName;		
	paUrl = '';
	rptName;
	pvtAjaxCall = true;
	chartAjaxCall=true;
	totalColCntDt=true;
	initReptDataTable = false
	reptCreatedBy = doc.CreatedBy; //this is the id who created report
	reptEntityName = (doc.EntityName)?doc.EntityName:'';

	//pagination exist
	var page = (doc.Paginate)?doc.Paginate:'No';
	_reptPageSize = (doc.PageSize)?doc.PageSize:'';
	//hide pagination buttons if it is set to no
	if(page == 'Yes') {
		_reptPaginationFlag = true;
	}


	var cont = '<div id="reptCanU" style="width:100%;"><div id="reportElementHeader">  <table width="100%" class="reportHeaderCont" > <tr> <td align="left" class="pageTitle" style="width:240px;"> ' + rptName + ' </td><td style="width:300px;" align="left">' + rptSubName + '</td><td align="right" valign="bottom" > <table id="reptSingleCondFilter"></table> <input type="button" class="blueButton reptBtns" value="Parameters" style="width: 100px;" id="showParams" /> <input type="button" class="blueButton reptBtns expBtn" value="Export" style="width: 100px;border-radius: 4px 0px 0px 4px;" id="exportDataTbl" /><div id="reptMoreTblOptCont" ><input type="button" class="reptBtns reptMoreOpt" /> <div class="reptMoreSel" > <div id="reptDtMoreSelc" ></div> </div> </div> </div> </td> </tr> </table><div id="paramsContainer"> </div> </div> <div id="tabs-2" > <span id="dtRefreshedAt"></span> <div id="tabs-min" class="tabs ui-tabs ui-widget ui-widget-content ui-corner-all"> <ul id="tabsContainer" class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">  </ul> <div id="tabData"><div class="reptShowLoading" id="dtLoading"><p>Loading data..Wait</p><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div> <table id="reportData"> </table> </div><div id="tabChart" > <div class="highchartsHdr"><div class="reptShowLoading" id="reptChartLoading"><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div><span id="reptChartInstr"><span class="reptTblUseInfo">You can select the type of chart that you\'d like to see for each set of data here.</span> <input type="button" class="twitter-btn twitter-btn-warning saveChart" value="Save"  id="saveChart" title="Save Chart" /> <input type="button" class="twitter-btn twitter-btn-danger" value="Clear Save"  id="deleteChartSave" title="Clear chart save data" /> </span><div id="selectTypeChartCont"></div></div> <div id="tabChartArea" status="0"> <span style="margin-top: 60px;display:block;">Your chart will be displayed here. </span></div> </div><div id="tabMap" >show map here </div> <div id="tabPivot" width="auto"> <div id="pvtLoading" class="reptShowLoading"><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div> <div id="pivot-menu-container"><span class="reptTblUseInfo">Please select the appropriate columns below to create your own Pivot Report.</span> <input type="button" class="twitter-btn twitter-btn-danger" value="Clear Save"  id="deletePivotSave" title="Clear pivot save data" /> <input type="button" class="twitter-btn twitter-btn-warning" value="Customize"  id="editSavePivot" title="Customize Pivot" /><input type="button" class="twitter-btn twitter-btn-warning savePivot" value="Save"  id="savePivot" title="Save Pivot" /></div> <div id="k_results"></div><div id="results"> </div> </div> </div> </div><form method="post" action="/atCRM/custom/adhocReports/rXL.xls" id="exelDownloadForm"> <input type="hidden" name="rD" id="rD"  /> <input type="hidden" name="rN" id="rN"  /></form> </div>';
	
	// var scr = "<script type='text/javascript' src='/atCRM/javascript/JSON/rept-more.js'></script>";
	var sty  = '<style type="text/css" id="reptStyle">';
		sty += '.reptTblUseInfo {float:left;} .reptTblCondVar b {color:black;} .reptTblCondVar {color:grey;font-weight:normal;width: 60%; display:inline-block;} .table-bordered {border: solid 1px white !important; } .table-bordered td+td {border: solid 1px #ddd !important;} .pvtTdFullBorder {border: solid 1px #ddd !important;} #reptOwner {color:grey;font-size:12px;float:right;margin-right: 6px;} #reptOwner span {color:#F87777;}.pivotCustHide {display:none;} #reportElementHeader {min-width: 1000px;width:100%;} #reportData tr th,#reportData tr td  {word-wrap:break-word;min-width:60px;max-width:60px;} .dataTables_info {margin-bottom: 12px; color:grey;}  .dtHdrFixed {position:fixed;background-color:white;top:0;} #selectTypeOfHC, #chartSelXAxis {font-size: 12px;} .dtTotal {background-color: #014464; color: white;}  .dtTotal td {  border:none; border-right: solid 1px grey;border-left: solid 1px grey;} .ui-state-active-droppable {background-color: #DFEB5E !important; } #pivot-menu-container, #reptChartInstr {height:37px;} .savePivot, .saveChart, #deleteChartSave, #deletePivotSave, #deletingChartSave, #deletingPivotSave {float:right; display:none; margin-right: 4px;}  #editSavePivot, #cancelEditPivot { margin-right:4px; float:right;} .reptBtns:hover, .reptFrmBtns:hover {background-color:#014464 !important;color:white;} #filterCancel {cursor:pointer;visibility:hidden;} #reportData .Text {text-align: left !important;} #reportData .Integer, #reportData .Number {text-align: right !important;} #reportData tr td {text-align:left;} #hcTypeSelTbl {width: 100%;} #hcTypeSelTbl td { display: inline-block; font-size: 12px; font-weight:bold; } #reportData_wrapper .clear {clear:both;} .pageTitle {font-size: 20px; } .reportHeaderCont { text-align: left; border-radius: 4px; margin: 10px auto; color: white; padding: 5px; background: #014464;background: -moz-linear-gradient(top, #0272a7, #013953);background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#0272a7), to(#013953));border: 1px solid #002232;-moz-box-shadow: inset 0px 0px 1px #edf9ff;-webkit-box-shadow: inset 0px 0px 1px #edf9ff;box-shadow: inset 0px 0px 1px #edf9ff; } .reptBtns {background-color: #fff !important;} #reptMoreTblOptCont {position:relative; width: 30px; height: 30px; float:right; margin-left:-1px;} #reptMoreTblOptCont:hover .reptMoreSel {display:block;} .reptMoreSel a {width: 25px !important;}  .reptMoreSel {display: none; right:0; top:28px;border: solid 1px #F1F1F1; position: absolute; background-color:#DADADA; padding: 4px; border-radius: 2px; z-index:1; width: 42px; } .reptMoreOpt {width: 30px !important;height: 28px; border-radius: 0px 4px 4px 0px; background: url("/atCRM/images/imagesList.png") no-repeat -60px -35px; } #tabMapBtn {display:none !important;}  #tabs-min .ui-tabs-nav li {top: 1px !important;} #k_results #vals, #k_results #rows {width: 15%; }  #k_results #cols {width: 85%;} #reportTblContainer {width: 100%; overflow: auto; } #filterRow th {padding: 4px 0 !important;} .eachColFilterSelect {margin: auto; width: 50px; display: block; } .filterRowHide {display:none;} .reptShowLoading{ display:none;text-align:center;color:red;} .highchartsHdr { font-family: candara, "sans-serif"; text-align:left; font-size:16px;display:block;} #tabChartArea {border: solid 1px #9C9797; display:block; width: 900px;height:400px; margin:auto;} #pivot-menu-container {text-align:left; font-size:14px; font-family:candara; margin:4px 0px;} #selectTypeChartCont {width: 100%;display:block;margin:12px auto;} #tabChart {display:block; margin: auto; width: 90%;} #paramsTbl td input[type=text] { width: 80%; } #paramsTbl td { display: inline-block; vertical-align: top; margin-right: 1.5%; width: 18%; } #slideUpDwnCont {display:none;} .showParamsCondCont {font-size: 16px;font-weight:bold; text-align:left; height: 30px;display:block; } .showParamsCondCont #showParams {float:right;}   #paramsTbl .multiSelectBox {width:82%;} #paramsTbl .sf_suggestion {margin-top: -56px;} #tblDiv {display:inline-block;width:100%;} .reptFrmBtns {float:right;margin-right: 5px; } .reptParamsDesc {font-size: 12px;display: block; color:grey;} #dtRefreshedAt {z-index:1;position:absolute; right: 1%;top: 0; font-size: 12px;} .reptParamsLbl {font-weight: bold; font-family:candara, "sans-serif"; font-size: 14px; letter-spacing: 1px; margin: 4px 0;} #paramsTbl {width:100%; border-collapse: collapse;} #paramsContainer { padding: 0.5% 0; width: 99%; display: block; height:auto;} .filterApplied {background-color:palegreen;} .dpass {display: none;} #reportData tr th {position:relative;} #k_results {display:block;overflow:auto;} #reportData_wrapper {overflow:auto;} #tabs-2 {position:relative;min-width:1000px;width:100%;} #tabs-2 .dataTables_filter {width: 425px; } .removeCol {display:none;} .showOrHideColsActv { height: 250px !important; background-color: white;border: solid 2px white;border-radius: 3px; background-position:top left !important; overflow-x:hidden !important; overflow-y:auto !important; width:220px !important; margin-left: -12.5% !important;} #reportData {text-align:center;}   .toggleColName:hover {background-color:rgb(164, 198, 218);} .toggleColName { border:none; border-top:solid 1px rgba(10, 9, 9, 0.1);width: 100%; cursor: pointer; font-size: 12px; font-family: candara; display:block;margin: 2px 0;text-align:left;padding: 2px 0;} #reportData_filter input { display: inline;} #reportData_length label { width 260px; } #reportData_length select { display: inline-block; } #tabs-min { background: transparent; border: none; } #filterColsByCombo {background: url("/atCRM/images/imagesList.png") no-repeat 1px -2px;} #showOrHideCols, #filterColsByCombo { cursor: pointer; background-color: white; border: solid 1px white; transition: height all 1s; -webkit-transition: all 1s; -moz-transition: all 1s; -o-transition: all 1s; z-index:1; overflow: hidden; position:absolute; width:31px; margin: 0.5% 0 0 -1%; padding: 24px 4px 2px 4px; box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -o-box-sizing: border-box; -ms-box-sizing: border-box; height: 25px;  } #showOrHideCols {margin-left: 2.3%; background: white url("/atCRM/images/gearDown.png") no-repeat top right / 28px 24px;}  #tabs-min .ui-widget-header { margin:0 !important; padding:0 !important; background: transparent; border: none; border-bottom: 1px solid #c0c0c0; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; } #tabs-min .ui-state-default { background: transparent; border: none; } #tabs-min .ui-state-active { border: none; } #tabs-min .ui-state-default a { color: #c0c0c0; } #tabs-min .ui-state-active a { color: #459E00; background: transparent url(/atCRM/stylesheets/style_h/images/uiTabsArrow.png) no-repeat bottom center; } .dataTables_wrapper { font-size: 9pt; } .flash{ padding-top:4px; padding-bottom:4px; background-color: #FFFF33; font-weight:bold; font-size:12px;-moz-border-radius: 6px;-webkit-border-radius: 6px; color: black; } .alignRight { text-align: right; } .ui-tabs .ui-tabs-nav { margin: 0; padding: 0 0 0 0.4em; border: 1px solid #d4ccb0; background: none !important;} .blkSdw {box-shadow: 1px 1px 4px black;-moz-box-shadow: 1px 1px 4px black;-webkit-box-shadow: 1px 1px 4px black;-o-box-shadow: 1px 1px 4px black;}  .showingParams {background-color: skyblue !important; color: black;} #slideUpDwnCont {border: solid 1px rgba(0,0,0,0.2); border-left: none;border-right:none;} table#reportData thead tr th {  padding-right:36px; } .filterColsByComboActv { border:solid 1px #FF0606; -webkit-box-shadow: 1px 1px 4px #111010; -moz-box-shadow: 1px 1px 4px #111010;box-shadow: 1px 1px 4px #111010; } .ui-tabs .ui-tabs-nav li { margin: 0 !important;}';
		sty += '#reptMoreFilterCond {margin-left:2px;color:white;} #reptSingleCondFilter {float:left;} #reptSingleCondFilter select, #reptSingleCondFilter .reptAddEditFilterTextBox {width: 100px;height25px;} ';	
		sty += '.reptPaginationCont { padding: 4px 7px; background-repeat: no-repeat; background-image: url("/atCRM/images/imagesList.png"); background-position: -8px -33px; } #reptPageInc { background-position: -21px -34px;} ';
		sty += '</style>';
	
	into_div.innerHTML = sty + cont;


	//add tabs 
	$.each(tabsArr, function(k, v) {
		var li = $('<li></li>');
		// if(k == 0) {
		// 	li.addClass('ui-tabs-selected ui-state-active');
		// }
		var a = $('<a></a>');
			a.attr('href', '#tab'+v).attr('id','tab'+v+'Btn').text(v);
		//add a to li
		li.append(a);
		//add li to menu container
		$('#tabsContainer').append(li);
	});

	/*  Set up the tabs for Data, Chart, Map and Pivot  */
	$('#tabs-min').tabs();

	//set the width of table	
	var w = $(document).width() - 30;
	$('#tabs-2').css('width', w+'px');

	//show btns related to data tab
	document.getElementById('tabDataBtn').addEventListener('click', function() {
		
		$('#dtLoading').css('display', 'block');	
		if(initReptDataTable === false) {
			setTimeout(function() {
				initDataTable(params, doc);				
			}, 100);			
		} else {
			$('#dtLoading').css('display', 'none');	
		}
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

	document.title = "Preparing Ui";	

	//get the saved pivot or charts content 
	var reptId = 'report_option_' + getValueFromUrl('i', true);
	var goFurther = getPivotOrChartSavedContent(reptId);
	document.title = rptName; //show document title
	if(!goFurther) {		
		return;
	}
	//load default tab
	initDataTable(params, doc);

	//remove loading
	$('#reptOnloadLoading').remove();

	//show filter conditions
	reptShowColumnsForSingleSelect();

	/* end of exec_rept function */
}


/* 
	* this will initialize data table for first time
*/
function initDataTable(params, doc) {

	drawParamsConditions(params);

	plotDataTable(doc);

	//remove filters, on load type
	for(var i=0, len = doc['dataTblHdr'].length; i < len; i++) {
		oTable.fnFilter('', i);
	}		

	//adds drop down for hiding and showing columns
	addShorOrHideCols();

	//add column wise filter button
	filterColsByCombo();
	
	//adds drop down for filtering based on columns
	addFilteringBasedOnCols(oTable);

	//this will show the load time of date table
	showRefreshedDateTimeForDataTbl();

	//wrap report table into div
	wrapReportTblInDiv();

	//clear the previous btns
	$('#reptDtMoreSelc').html('');
	//move data table button to reptDtmoreSel div
	$('.DTTT_container').appendTo('#reptDtMoreSelc');

	//show scroll for dt, fix table which has many cols, and user enable to figure out existence
	showDuplicateScrollForReptDt();

	initReptDataTable = true;
	$('#dtLoading').css('display', 'none');
}

function showDuplicateScrollForReptDt() {
	//get parent width
	var rpt = $('#reportTblContainer');
	var w = rpt.css('width');
	var offset = rpt.offset();
	var lft = offset.left;

	var tblWidth = $('#reportData').css('width');

	//create hack here
	var c = $('<div id="reptDtHackScroll" style="position:fixed;bottom:0;overflow-y:hidden;overflow-x:auto;"></div>');
		c.css({'width':w,'left':lft+'px'});

	var scroller = $('<div ></div>');
		scroller.css({'height':'1px','width':tblWidth});

	c.append(scroller);

	$('#tabData').append(c);
}

function showDuplicateScrollForReptPivot() {
	//get parent width
	var rpt = $('#k_results');
	var w = rpt.css('width');
	var offset = rpt.offset();
	var lft = offset.left;

	var tblWidth = $('#k_results .table').css('width');
	//create hack here
	var c = $('<div id="reptPivotHackScroll" style="position:fixed;bottom:0;overflow-y:hidden;overflow-x:auto;"></div>');
		c.css({'width':w,'left':lft+'px'});

	var scroller = $('<div ></div>');
		scroller.css({'height':'1px','width':tblWidth});

	c.append(scroller);

	$('#tabPivot').append(c);
}




$(document).ready(function () {

	
	//add scripts
	var scr = '<script type="text/javascript" src="https://www.google.com/jsapi"> </script>';
		scr += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/gchart_renderers.js"> </script>';
	$('head').append(scr);

	//makin datable header fixed
	$(window).scroll(function () {
		//only rept can u
		if($('#reptCanU').length > 0) {
			if ($(window).scrollTop() == $(document).height()-$(window).height()){
			    $('#reptDtHackScroll, #reptPivotHackScroll').css('visibility','hidden');
			} else {
				$('#reptDtHackScroll, #reptPivotHackScroll').css('visibility','visible');
			}
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
			alert('Failed to draw' + e);
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
				$('#tmpDivForTot, #reptDtHackScroll').scrollLeft(c.scrollLeft());			
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
		var tbl = $('#reportTblContainer');
		if(w != tempDocWidth && tbl.length > 0) {
			var sw = screen.width;
			$('#tabs-2').css('width', (sw-30)+'px');		
			
			w = doc.width() - 30; //takin one more time becuase previous w will be diffrent after applying screen width;
			$('#tabs-2').css('width', w+'px');		

			//fitting hack scroll properlly
			var offset = tbl.offset();
			var lft = offset.left;
			$('#reptDtHackScroll').css('width', (w-lft)+'px');		
			tempDocWidth = w;
		}
	});

	//this is hack for wider dt scroll
	$('body').on('mousedown', '#reptDtHackScroll', function() {
		$(this).bind('scroll', function() {
			var sl = $(this).scrollLeft();			
			$('#reportTblContainer, #tmpDivForTot').scrollLeft(sl);
		});	
	});


	//save pivot selection.
	$('body').on('click', '#savePivot', function() {
		
		$(this).val('Saving..').attr('id', 'savingPivot');
		var pivotUiStatus = {}, id;

		//get the rendere type
		pivotUiStatus['renderer'] = $('#renderer').val();

		//get the aggregator value
		pivotUiStatus['aggregator'] = $('#aggregator').val();
		
		//now get the values section #vals, store ids of elements only
		pivotUiStatus['vals'] = [];
		var vals = pivotUiStatus['vals'];
		$('#vals li').each(function() {
			id = $(this).attr('id');
			vals.push(id);
		});

		//now get the rows section #rows, store only ids
		pivotUiStatus['rows'] = [];
		var rows = pivotUiStatus['rows'];
		$('#rows li').each(function() {
			id = $(this).attr('id');
			rows.push(id);
		});

		//now get the cols section #cols, store only ids
		pivotUiStatus['cols'] = [];
		var cols = pivotUiStatus['cols'];
		$('#cols li').each(function() {
			id = $(this).attr('id');
			cols.push(id);
		});

		var reptId = 'report_option_' + getValueFromUrl('i', true);
		pivotUiStatus = JSON.stringify(pivotUiStatus).replace(/"/g, "'");		
		saveReptUiStatus(pivotUiStatus, reptId, 'pivot', $('#savingPivot'), 'savePivot');

	});

	//show pivot customizing buttons
	$('body').on('click', '#editSavePivot', function() {
		$('#rows,#cols,#vals,#unused').removeClass('pivotCustHide');
		$('#renderer').parent().removeClass('pivotCustHide');
		$(this).val('Cancel').attr('id', 'cancelEditPivot');
		$('.table-bordered').css('border', 'solid 1px #ddd !important');
		$('.table-bordered td+td').addClass('pvtTdFullBorder');
		$('#tabPivot .reptTblUseInfo').css('display', 'inline-block');
		$('#tabPivot .reptTblCondVar').css('display', 'none');
	});

	//show pivot customizing buttons
	$('body').on('click', '#cancelEditPivot', function() {
		$('#rows,#cols,#vals,#unused').addClass('pivotCustHide');
		$('#renderer').parent().addClass('pivotCustHide');
		$(this).val('Customize').attr('id', 'editSavePivot');		
		$('.table-bordered').css('border', 'solid 1px #ddd !important');
		$('.table-bordered').css('border', 'solid 1px white !important');
		$('.table-bordered td+td').addClass('pvtTdFullBorder');
		$('#tabPivot .reptTblUseInfo').css('display', 'none');
		$('#tabPivot .reptTblCondVar').css('display', 'inline-block');
	});

	//save charts 
	$('body').on('click', '#saveChart', function() {
		
		//change id of btn, so that it can prevent from multiple clicks
		$(this).val('Saving..').attr('id', 'savingChart');
		//init
		var chartUiStatus = {}, id, value, t;

		chartUiStatus['axis'] = $('#chartSelXAxis').val();

		//now get the different types of charts
		chartUiStatus['chartTypes'] = [];
		var chartTypes = chartUiStatus['chartTypes'];
		$('#selectTypeChartCont .selectTypeOfHC').each(function() {
			t = $(this);
			id = t.attr('id');
			value = t.val();
			chartTypes.push(id + '##' + value);
		});

		//now save it
		var reptId = 'report_option_' + getValueFromUrl('i', true);
		chartUiStatus = JSON.stringify(chartUiStatus).replace(/"/g, "'");		
		saveReptUiStatus(chartUiStatus, reptId, 'chart', $('#savingChart'), 'saveChart');

	});

	//set hack scroll width for pivot 
	$('body').on('mouseover', '#k_results', function() {
		var tblWidth = $('#k_results .table').css('width');
		$('#reptPivotHackScroll div').css('width', tblWidth);
	});

	//on rept scroll set rept total to same scroll positions
	$('body').on('mousedown', '#tabPivot', function() {				
		var c =  $('#reptPivotHackScroll');
		if(c.length > 0) {
			c.bind('scroll', function() {
				$('#k_results').scrollLeft(c.scrollLeft());			
			});								
		}
	});

	//clear pivot data
	$('body').on('click', '#deletePivotSave', function() {
		if(_reptSaveFor === 'pivot') {
			$(this).attr('id', 'deletingPivotSave').val('Clearing..');
			var reptId = 'report_option_' + getValueFromUrl('i', true);

			clearReptUiStatus(' ', reptId, '', $('#deletingPivotSave'), 'deletePivotSave')
		} else {
			alert('No data to delete');
		}
	});

	//show pop up message if user is un patient
	$('body').on('click', '#deletingPivotSave', function() {
		alert('Dude wait! Its working');
	});

	//clear chart data
	$('body').on('click', '#deleteChartSave', function() {
		if(_reptSaveFor === 'chart') {
			$(this).attr('id', 'deletingChartSave').val('Clearing..');
			var reptId = 'report_option_' + getValueFromUrl('i', true);
			clearReptUiStatus(' ', reptId, '', $('#deletingChartSave'), 'deleteChartSave')
		} else {
			alert('No data to delete');
		}
	});

	//show pop up message if user is un patient
	$('body').on('click', '#deletingChartSave', function() {
		alert('Dude wait! Its working');
	});


	//show specific operator
 	$('body').on('change', '.reptFilterEntityCols', function() { 	

 		//remove filter if applied..
 		// $('#'+entityDiv+ ' #removeAddEditFilter').attr('id', 'singleFilterSub');

 		var t = $(this);
 		var type = $('option:selected', t).attr('type');
 		var id   = t.attr('id').split('_').pop();
 		
 		//get mapping key name...
 		var colsMap = reptRulesTriggerMappings['colMapName']; 
 		if(!(type in colsMap)) {
 			alert("Type not found for.. "+ '" '+type+' "');
 			return;
 		}

 		var mapKey = colsMap[type];
 		var properties = reptRulesTriggerMappings['colProperties'][mapKey];
 		var opt, sel=$('#reptCanU #filterOpr_'+id);
 		sel.children().remove();
 		sel.append('<option value="" type="">---</option>')
 		$.each(properties,function(k, v) {
 			opt = '<option value="'+k+'">'+v+'</option>';
 			sel.append(opt);
 		});

 		var td = $('#reptCanU #filterDateCol_'+id);
 		if(mapKey == 'date') {
 			if(td.children('img').length == 0) {
	 			var img = $('<img src="/atCRM/images/calendar.gif" id="filterCalendar_'+id+'" />');
	 			td.html(img).css('display','block');
	 			new Calendar({
	                inputField: 'filterEntTxt_'+id,
	                dateFormat: "%d/%m/%Y", 
	                trigger: 'filterCalendar_'+id,
	                bottomBar: true,
	                fdow:0,
	                min: 19000101,
	                max: 29991231,
	                align: "BL",
	                onSelect: function() {
	                  this.hide();
	                  //remove filter if applied..
 					  $('#reptCanU #removeAddEditFilter').attr('id', 'singleFilterSub');
	                }
	            });
	            // $('#'+entityDiv+ ' .filtersLi').css('width', '420px');
 			} else { 			
 				td.css('display','block');
 				img = td.children('img');	
 				// $('#'+entityDiv+ ' .filtersLi').css('width', '420px');
 				$('#reptCanU #filterEntTxt_'+id).val(img.attr('alt'));
 			}
 		} else {
 			if(td.children('img').length > 0) {
 				var txtFld = $('#reptCanU #filterEntTxt_'+id);
 				td.children('img').attr('alt', txtFld.val());
 				td.css('display','none');
 				txtFld.val('');
 				// $('#'+entityDiv+ ' .filtersLi').css('width', '390px');
 			}
 		}
 	});

	//submit the filters data
	$('body').on('click', '#reptSingleFilterSub', function() {
		//prepare url data
		var urlData = '', rowData, flag,val;
		$('#reptCanU #reptSingleCondFilter tr').each(function() {
			rowData = '';
			flag=true;
			$(this).children('td.toPostCol').each(function() {
				if($(this).css('visibility') !== 'hidden') {
					val = $(this).children('.toPostVal').val();
					rowData +=  val + '!!';
					if(val == '')
						flag = false;
				} 
			});
			if(flag !== false)
				urlData += rowData.substr(0, rowData.length - 2) + '!~~!';
		});		

		if(urlData.length > 0)
			urlData = '&aw='+ urlData.substr(0, urlData.length - 4);

		if(urlData.length > 0) {
			$(this).attr('id', 'reptRemoveAddEditFilter'); //mark current clicked button as remove
			//hit the url
			url = zcServletPrefix+"/custom/adhocReports/rAn.htm?pa=ir" + getValueFromUrl('i', true)+urlData;
			getFilterForRan(url);			
		} else {
			alert('No "and" condtions selected. Please atleast 1 complete row.');
		}		
	});

	//remove filters applied
	//remove single select filter
	$('body').on('click', '#reptRemoveAddEditFilter', function() {
		$(this).attr('id', 'reptSingleFilterSub'); 	
		$('#reptCanU #reptSingleCondFilter tr').each(function() {
			$(this).children('td.toPostCol').each(function() { 
				$(this).css('visibility','visible');
				$(this).children('.toPostVal').val(' ');
			});
		});

		//reload dt
		reptRemoveFiltering();
	});	

	//pop up operator change action for multiple #and conditions
	$('body').on('change', '.reptFilterOprColsPopUp', function() {
		//add selected value to its selct attribute
		var t = $(this);
		t.attr('selct', t.val());

		var v = t.val();
		var id = t.attr('id').split('_').pop();
		if(v == 'nu' || v == 'nn') {
			$('#commonPopupDiv #filterEntTxt_'+id).parent().css('visibility', 'hidden');
			$('#commonPopupDiv #filterDateCol_'+id + ' img').parent().css('visibility', 'hidden');
		} else {
			$('#commonPopupDiv #filterEntTxt_'+id).parent().css('visibility', 'visible');
			$('#commonPopupDiv #filterDateCol_'+id+ ' img').parent().css('visibility', 'visible');
		}

	});

	//show multiple filter popup
	$('body').on('click', '#reptMoreFilterCond', function() {
		reptShowFilterPopUp();
	});

	//remove this row from table
 	$('body').on('click', '.reptRemoveCondForFilter', function() {
 		var id = $(this).attr('id').split('_').pop();
 		$('#filterTblRow_'+id).remove();
 	});

 	//add new row, and make this col has remove
 	$('body').on('click', '.reptAddNewCondForFilter', function() {
 		$(this).addClass('reptRemoveCondForFilter').removeClass('reptAddNewCondForFilter'); 	
 		reptDrawFilterRow(1, $('#commonPopupDiv #filterTbl'), false);	
 	});

 	//get filters from pop up
 // 	$('body').on('click', '#reptFilterTblSubmit', function() {
	// 	//prepare url data
	// 	var urlData = '', rowData, flag,val;
	// 	$('#commonPopupDiv #filterTbl tr').each(function() {
	// 		rowData = '';
	// 		flag=true;
	// 		$(this).children('td.toPostCol').each(function() {
	// 			if($(this).css('visibility') !== 'hidden') {
	// 				val = $(this).children('.toPostVal').val();
	// 				rowData +=  val + '!!';
	// 				if(val == '')
	// 					flag = false;
	// 			} 	
	// 		});


	// 		if(flag !== false)
	// 			urlData += rowData.substr(0, rowData.length - 2) + '!~~!';

	// 	});		
	// 	if(urlData.length > 0)
	// 		urlData = '&aw='+ urlData.substr(0, urlData.length - 4);

	// 	if(urlData.length > 0) {
	// 		//hit the url
	// 		url = zcServletPrefix+"/custom/adhocReports/rAn.htm?rept_id=" + getValueFromUrl('i', true)+urlData;
	// 		getFilterForRan(url);	
	// 	} else {
	// 		alert('No "and" condtions selected. Please atleast 1 complete row.');
	// 	}

	// 	//change the color of more filter
	// 	$('#reptMoreFilterCond').addClass('addEditMoreFilterApplied');		

	// });

	//show specific operator
 	$('body').on('change', '.reptFilterEntityColsPopUp', function() { 	
 		
 		//add current selected val to its  attribute selct
 		// $(this).attr('selct', $(this).val());

 		var t = $(this);
 		var type = $('option:selected', t).attr('type');
 		var id   = t.attr('id').split('_').pop();
 			
 		//get mapping key name...
 		var mapKey = reptRulesTriggerMappings['colMapName'][type];
 		var properties = reptRulesTriggerMappings['colProperties'][mapKey];
 		var opt, sel=$('#commonPopupDiv #filterOpr_'+id);
 		sel.children().remove();
 		sel.append('<option value="" type="">---</option>')
 		$.each(properties,function(k, v) {
 			opt = '<option value="'+k+'">'+v+'</option>';
 			sel.append(opt);
 		});

 		var td = $('#commonPopupDiv #filterDateCol_'+id);
 		if(mapKey == 'date') {
 			if(td.children('img').length == 0) {
	 			var img = $('<img src="/atCRM/images/calendar.gif" id="filterCalendar_'+id+'" />');
	 			td.html(img).css('display','block');
	 			new Calendar({
	                inputField: 'filterEntTxt_'+id,
	                dateFormat: "%d/%m/%Y", 
	                trigger: 'filterCalendar_'+id,
	                bottomBar: true,
	                fdow:0,
	                min: 19000101,
	                max: 29991231,
	                align: "BL",
	                onSelect: function() {
	                  this.hide();
	                  //remove filter if applied..
 					  $('#reptRemoveAddEditFilter').attr('id', 'reptSingleFilterSub');
	                }
	            });
	            // $('#commonPopupDiv .filtersLi').css('width', '420px');
 			} else { 			
 				td.css('display','block');
 				img = td.children('img');	
 				// $('#commonPopupDiv .filtersLi').css('width', '420px');
 				// $('#commonPopupDiv #filterEntTxt_'+id).val(img.attr('alt'));
 			}
 		} else {
 			if(td.children('img').length > 0) {
 				var txtFld = $('#commonPopupDiv #filterEntTxt_'+id);
 				td.children('img').attr('alt', txtFld.val());
 				td.css('display','none');
 				txtFld.val('');
 				// $('#commonPopupDiv  .filtersLi').css('width', '390px');
 			}
 		}
 	});

//submit the filters dat
	$('body').on('click', '#reptFilterTblSubmit', function() {
		//prepare url data
		var urlData = '', rowData, flag,val;
		$('#commonPopupDiv #filterTblForm #filterTbl tr').each(function() {
			rowData = '';
			flag=true;
			$(this).children('td.toPostCol').each(function() {
				if($(this).css('visibility') !== 'hidden') {
					val = $(this).children('.toPostVal').val();
					rowData +=  val + '!!';
					if(val == '')
						flag = false;
				} 	
			});


			if(flag !== false)
				urlData += rowData.substr(0, rowData.length - 2) + '!~~!';

		});		
		if(urlData.length > 0)
			urlData = '&aw='+ urlData.substr(0, urlData.length - 4);

		if(urlData.length > 0) {
			//hit the url
			url = zcServletPrefix+"/custom/JSON/list/rAn.htm?pa=ir" + getValueFromUrl('i', true)+urlData;
			getFilterForRan(url);	
		} else {
			alert('No "and" condtions selected. Please atleast 1 complete row.');
		}

		//change the color of more filter
		$('#reptMoreFilterCond').addClass('addEditMoreFilterApplied');		

	});

	$('body').on('click', '#reptFilterTblClear', function() { 
		$('#commonPopupDiv #filterTblForm #filterTbl tr').each(function() {
			$(this).children('td.toPostCol').each(function() { 
				$(this).children('.toPostVal').val(' ');
			});
		});

		//change the color of more filter
		$('#reptMoreFilterCond').removeClass('addEditMoreFilterApplied');		
		//update the state in div
		// $('#'+entityDiv+' .addEditMorePopUpFiltersState').html('');

		//reload dt with from start
		reptRemoveFiltering();
	});

	//pagination for reports
	$('body').on('click','.reptPaginationCont', function() {
		var t=$(this),id=t.attr('id'), url = '/atCRM/custom/adhocReports/rAn.htm?';
		
		var ival = getValueFromUrl('i');
		if(ival == '') {
			return alert('Abort: i values is mission from url.');
		}
		url += '&i='+ival;
		var getPParm = getValueFromUrl('pa');
		if(getPParm != ''){
			url += '&pa='+getPParm;
		}

		if(id == 'reptPageDec') {
			_reptPagination -= 1;
			url += '&pg='+_reptPagination;
			_reptPaginationStatus = 'decrement';
			if(_reptPagination != '0') {
				_reptPaginatioArr.pop();
			}
			else {
				_reptPagination = 1; //make 1 and return;
				return;
			}
		} else { 
			_reptPagination += 1;
			url += '&pg='+_reptPagination;
			_reptPaginationStatus = 'increment';
		}

		//show loading first
		$('#dtLoading').css('display', 'block');
		setTimeout(function() {
			reptGetNextSetOfResults(url);	
		}, 0);
		
	});

	/* end of document ready */
});

//reload dt from start, cancel filtering
function reptRemoveFiltering() {
	var urlPath = '/atCRM/custom/adhocReports/rAn.htm?';
		
	var ival = getValueFromUrl('i');
	if(ival == '') {
		return alert('Abort: i values is mission from url.');
	}
	urlPath += '&i='+ival;
	var getPParm = getValueFromUrl('pa');
	if(getPParm != ''){
		urlPath += '&pa='+getPParm;
	}

	//show loading of dt
	setTimeout(function() {
		$('#dtLoading').css('display', 'block');
	}, 0);

	$.ajax(
	{
		url: urlPath,
		type: 'POST',
		dataType: 'JSON',
		success: function(data) {

			//refresh dt
			reloadDataTable(data);
			//show time of refresh dt
			showRefreshedDateTimeForDataTbl();

			$('#dtLoading').css('display', 'none');
		},
		error:function(response) {
			alert('Failed to get pagination result');
			console.log(response);
			$('#dtLoading').css('display', 'none');
		}
	}
	);
}

/* 
	gets next set of ran.htm results ex: 0-1000,1000-2000 ..
*/
function reptGetNextSetOfResults(urlPath) {
	$.ajax(
	{
		url: urlPath,
		type: 'POST',
		dataType: 'JSON',
		success: function(data) {

			//refresh dt
			reloadDataTable(data);
			//show time of refresh dt
			showRefreshedDateTimeForDataTbl();

			$('#dtLoading').css('display', 'none');
		},
		error:function(response) {
			alert('Failed to get pagination result');
			console.log(response);
			$('#dtLoading').css('display', 'none');
		}
	}
	);
} 

/* 
	* Redraw pivot with saved structure
*/
var reptPvtKeyVal = {
	'rows': 'Rows have',
	'cols': 'Columns have',
	'renderer': 'Chart type',
	'aggregator': 'Quantity',
	'vals': 'Cells have'
};
//Showing <renderer> of <rows> (as rows) and <cols> as cols, with <aggregator> of <vals> in cells.
function redrawPivotWithSaveObj(obj) {
	
	var typVal;
	$.each(obj, function(id,rowColVals) {
		typVal =  typeof rowColVals;
		if(typVal === 'string') { //this value will be of select
			$('#'+id).val(rowColVals);
		} 
		else if(typVal === 'object') { //in this case object contains ids of particula container
			$.each(rowColVals, function(k,ids) {
				$('#'+ids).appendTo('#'+id);
			});

		}
	});
	var agg    = obj['aggregator'];
	var aggStr = agg.charAt(0).toUpperCase() + agg.slice(1);

	valueStr = '<span class="reptTblCondVar">Showing <b>'+ obj['renderer'] + '</b> of <b>'+ reptReturnCommaSeparatedStrFromArr( obj['rows'] )+'</b> (as rows) and ';
	valueStr += ' <b>'+reptReturnCommaSeparatedStrFromArr( obj['cols'] ) +'</b> as columns, with <b>'+aggStr+'</b> of <b>'+ reptReturnCommaSeparatedStrFromArr( obj['vals'] ) +'</b> in cells.</span>';

	//show the conditions
	$('#pivot-menu-container').prepend(valueStr);
	//just trigger change on render select, so that pivot shows result
	$('#renderer').trigger('change');
	
}

//get comma separated strin from arr
function reptReturnCommaSeparatedStrFromArr(arr) {
	var str =  arr.toString().replace(/axis_/g, '');
		str = str.replace(/,/g, ', ');
		return str;
}

/* 
	* Redraw chart with saved structure
*/
function redrawChartWithSaveObj(obj) {
	var axis = obj.axis, axisObj=$('#chartSelXAxis'), valueStr=''; //get the axis
	//set axis type
	axisObj.val(axis);

	//now set the different charts
	var charts = obj.chartTypes, id, value;
	$.each(charts, function(k,selVal) {
		selVal = selVal.split('##');
		id = selVal[0];
		value = selVal[1];

		$('#'+id).val(value).trigger('change');
		valueStr += '<b>'+$('#'+id+' option[value='+value+']').text()+'</b>, ';
	});
	valueStr = '<span style="color:grey;">Showing for '+ '<b style="color:black">'+ $('#chartSelXAxis option[value='+axis+']').text() +'</b>'+ ', Chart types are ('+ '<b style="color:black">'+valueStr.substr(0, valueStr.length-2) + '</b>)</span>';
	//show the conditions
	$('#reptChartInstr').prepend(valueStr);
	//now finally trigger change of axis, so that it plots all the charts
	axisObj.trigger('change');
		
}

/* 
	* this will save json in udm
*/
function saveReptUiStatus(jsonObj, reptId, name, saveBtn, btnId) {
	// var saveBtn = $('#savingPivot');
	if(_PivtChartReptId == '' || typeof _PivtChartReptId === 'undefined') { //_PivtChartReptId is global
        var postData = "0-1-2=&0-1-3="+reptId+"&0-1-5="+name+"&0-1-4=Reports or charts ui state is stored&0-1-19="+jsonObj;
        var errMsg = 'Abort. Inserting report failed';
    } 
    else {
        var postData = "0-1-2="+_PivtChartReptId+"&0-1-5="+name+"&0-1-19="+jsonObj;
        var errMsg = 'Abort. Could not save';
    }  
	
	$.ajax(
		{
			url: zcServletPrefix+'/custom/JSON/system/addEditUserOptions/editAction',
			data: postData,
			type: 'POST',
			// dataType: 'JSON',
			success: function(data) {
				data = JSON.parse(data);
				_PivtChartReptId = data.addedId; //global set value
                _PivotChart = data.addedTxt;  //this contains json string
                alert('Saved successfully.');
				saveBtn.val('Save').attr('id', btnId);		
				_reptSaveFor = name;						
			},
			error: function(response) {
				saveBtn.val('Save').attr('id', btnId);
				alert(errMsg);
				console.log(response);
			}
		}
	);
}



/* 
	* this will update empty data in udm
*/
function clearReptUiStatus(jsonObj, reptId, name, delBtn, btnId) {
	if(_PivtChartReptId == '' || typeof _PivtChartReptId === 'undefined') { //_PivtChartReptId is global
        var postData = "0-1-2=&0-1-3="+reptId+"&0-1-5="+name+"&0-1-4=Reports or charts ui state is stored&0-1-19="+jsonObj;
        var errMsg = 'Abort. Inserting report failed';
    } 
    else {
        var postData = "0-1-2="+_PivtChartReptId+"&0-1-5="+name+"&0-1-19="+jsonObj;
        var errMsg = 'Abort. Could not save';
    }  
	
	$.ajax(
		{
			url: zcServletPrefix+'/custom/JSON/system/addEditUserOptions/editAction',
			data: postData,
			type: 'POST',
			// dataType: 'JSON',
			success: function(data) {
				alert('Cleared data successfully');
				delBtn.val('Clear Save')
				delBtn.attr('id', btnId);
			},
			error: function(response) {				
				alert(errMsg);
				console.log(response);
				delBtn.val('Clear Save')
				delBtn.attr('id', btnId);
			}
		}
	);
}

/* 
	* this will get the pivot or chart content for particular report type
*/
var _pivot_chart_status = false, _PivtChartReptId='', _reptSaveFor='', _PivotChart='';
function getPivotOrChartSavedContent(reptId) {
	var goFurther = true;
	$.ajax(
		{        //zcServletPrefix is global defined in homepage.html
			url: zcServletPrefix+"/custom/JSON/system/getUserOption.json",
			data: 'option_name='+reptId,
			type: 'GET',
			async: false,
			success: function(data) {
				data = JSON.parse(data);
				_PivtChartReptId = data.PK; //global set value
                _PivotChart = data.OptionValue;  //this contains json
                _PivotChart = _PivotChart.replace(/"/g, '').replace(/'/g, '"');
               	_reptSaveFor = data.InternalName;  //this contains json                	
                //if it comes empty then dont parse
                if(_reptSaveFor.trim().length !== 0) {
	                _PivotChart = JSON.parse(_PivotChart);               
	                _pivot_chart_status=true;
                }   
                
                if(_reptSaveFor === 'pivot') {                	
                	$('#tabPivotBtn').trigger('click');
                	initializePivot();
                	redrawPivotWithSaveObj(_PivotChart);
                	$('.reptTblUseInfo, #showParams').css('display', 'none');
                	$('#tabChart .reptTblUseInfo').css('display', 'block');
                	goFurther = false;
                } 
                else if(_reptSaveFor === 'chart') {                	
                	$('#tabChartBtn').trigger('click');
                	initializeChart();
                	redrawChartWithSaveObj(_PivotChart);
                	$('.reptTblUseInfo, #showParams').css('display', 'none');                	
                	$('#tabPivot .reptTblUseInfo').css('display', 'block');

                	goFurther = false;
                } 

			},
		error: function(response) {
			alert('Failed to retrive saved pivot or chart content.');
			console.log(response);
		}
		}
	);

	//now show edit or save buttons
	console.log('user='+session_login + '- owner='+ reptCreatedBy);
	if(session_login == reptCreatedBy) {
		$('#savePivot, #deleteChartSave, #deletePivotSave').css('display', 'block');
		// $('#editSavePivot').css('display', 'none');
	} else {		
       	var targeEle = $('#pivot-menu-container, #reptChartInstr');
       	targeEle.children('#reptOwner').remove();
       	targeEle.append('<span id="reptOwner">  You can edit layout, but only <span>owner</span> can save</span>');
	}

	//hide the  pivot columns
	$('#rows,#cols,#vals,#unused').addClass('pivotCustHide');
	$('#renderer').parent().addClass('pivotCustHide');

	return goFurther;
}



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
	var htmlStr;
	if(_reptPaginationFlag === true)
		htmlStr =  '<span id="reptPageDec" class="reptPaginationCont"></span>' + 'Page '+ _reptPagination + ' ' + _reptPageSize +' recs per page, at '+ df+ '<span id="reptPageInc" class="reptPaginationCont"></span>';
	else 
		htmlStr = 'Refreshed: '+ df;

	$('#dtRefreshedAt').html(htmlStr);
}

/*
	* this gives the value of variable from url
	* need 1 parameter, which is variable name
 */
 function getValueFromUrl(name, forSave) {
 	var query = $('.subMnuSpan_current').parent().attr('href'); //document.URL;
 	//get ir value
 	if(name === 'i' && forSave !== undefined) { 
 		return getValueForIrFromUrl(query);
 	}
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
	//get ir value
	if(nameVar === '')
		return getValueForIrFromUrl(query);

 	return nameVar;
 }

 /* 
	* this gets the ir value from url
 */
 function getValueForIrFromUrl(query) {
	var reg = /=ir[0-9]+./;
	var val, len, lc; //lc last char code
	if(val = query.match(reg)) {
		val = val[0].replace('=ir', '');	
		len = val.length;
		lc = val.charCodeAt(len-1);
		if(!(lc >= 48 && lc <= 57))
		val = val.substr(0, len -1);
	return val;
	}
 }


/* 
	* replots the data table
	* first it removes everything then adds new data
*/
function reloadDataTable(data) {
	
	if(typeof oTable != undefined) {
		$('#tabData').children().remove();
		$('#tabData').html('<div class="reptShowLoading" id="dtLoading"><p>Loading data..Wait</p><img src="/atCRM/images/loadingbar.gif" width="128" height="15" alt="loadingbar.gif" /></div><table id="reportData"> </table>');	
		//remove filters		
		for(var i=0, len = data['dataTblHdr'].length; i < len; i++) {
			oTable.fnFilter('', i);
		}		
		iniFnFilter();
	}

	totalColCntDt = true; //this means, calculate total once again
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

	//show hack scroll
	showDuplicateScrollForReptDt();
}

/* 
	* plot datatable
*/
function plotDataTable(data) {
	dataTblHdr = data.dataTblHdr;
	dataTblData = formatNumbering(data.dataTblData, dataTblHdr); //returns valid numbers	;

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
			"bStateSave": false, //true = saves the states, comment this if cookies are big
			"oLanguage": {
				"sSearch": "Search all columns:"
			},
			"oTableTools": {
				"aButtons": [ "print"], //"xls","copy", "csv", "pdf"  
				"sSwfPath": "/atCRM/javascript/jquery/swf/copy_csv_xls_pdf.swf"
			},
			"fnRowCallback": function( nRow, aData, iDisplayIndex ) { 
			// 	//this call back makes slow while filtering
			// 	var len = aData.length, cn, td, num, val;
			// 	for(var i=0;i<len; i++) {
			// 		td = $('td:eq('+i+')', nRow);
			// 		cn = td[0]['className']; //this is assumption that in zero will find class name
			// 		val = aData[i];
			// 		if(cn.match(/Integer/g)) {
			// 			td.html(Math.floor(val));
			// 		}
			// 		if(cn.match(/Number/g)) {
			// 			num = Math.round(val * 100) / 100;
			// 			td.html(val);
			// 		}
			// 	}
			//add class for each row
			$(nRow).addClass('reptRowLvlClick');
			// console.log(nRow);
			},
			"fnDrawCallback": function() {
				//this is called when data table has been drawn completely 
				addTrForShowingTotal();

				//show or hide cols after dt modifying
				showOrHideColsAfterDtModifying();
			}
	});

		
	//show total entries _reptPaginatioArr
	var str;	
	_reptTmpResultCnt  = _reptCurrentResultCnt;
	_reptCurrentResultCnt = dataTblData.length;
	if(_reptPaginationStatus == 'increment') {
		str = ' (Showing '+ _reptTmpResultCnt + ' - ' +  _reptCurrentResultCnt + ')';
		_reptPaginatioArr.push(str);
		str = _reptPaginatioArr[_reptPagination];
	} else if(_reptPaginationStatus == 'decrement') {
		str = _reptPaginatioArr[_reptPagination];
	} else {
		str = ' (Showing 0 - ' +  _reptCurrentResultCnt + ')';
		_reptPaginatioArr.push(str);
	}
	$('#reportData_length label').append( str );
	
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
		var tr = $('<tr></tr>'), td, t, cls, toNum,cls;
		for(var i=0; i<colHdrLen; i++) {
			t=0;
			cls = dataTblHdr[i]['sClass'];			
			if(cls === undefined)
				cls = '';
			if($.inArray(cls, colTotReq) != -1 ) {
				// indexOfTotalCols.push(i);
				t =0;
				for(var j=0; j<colDtLen; j++) {
					toNum  = reptReturnNumber( dataTblData[j][i] );
					t = +t + +toNum; //it converts to number
				}
				t = Math.round(t);
				td = '<td style="text-align:right;padding:3px 18px 3px 10px;min-width:60px;max-width:60px;" class="dtTotal '+cls+'">'+ t + '</td>';	
			} 
			else {
				td = '<td class="'+cls+'" style="font-weight:bold;padding:3px 18px 3px 10px;min-width:60px;max-width:60px;"></td>'; //dataTblHdr[i]['sTitle'] 
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

//return valid arithmatic number
function reptReturnNumber(str) {
	var tempNum = '', tempStr='', strlen = str.length;
	for(var i=0; i<strlen; i += 1) {
		tempStr += reptReturnValidArithmaticChar(str.charAt(i)); 
	}
	return tempNum + tempStr;
}
//return valid character for arithmatic
function reptReturnValidArithmaticChar(c) {
	var code = c.charCodeAt(0);
	if((code >= 48 && code <= 57) || code == 46) 
		return c;
	else
		return '';
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

 	// 	var uri = 'data:application/vnd.ms-excel;base64,'
		// 	, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
		//     , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		//     , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
		
		// var ctx = {worksheet: name || 'Worksheet', table: htmlData};

		//  htmlData = uri + base64(format(template, ctx));
		    
       	var dt = new Date();
        var day = dt.getDate();
        var month = dt.getMonth() + 1;
        var year = dt.getFullYear();
        var hour = dt.getHours();
        var mins = dt.getMinutes() + 'mins';
        var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
        var name = 'canvera_'+postfix;

        $('#rD').val(htmlData);
        $('#rN').val(name);        
        $('#exelDownloadForm').trigger('submit');


    // 	$.ajax({
    // 		url: '/atCRM/custom/adhocReports/rXL.xls',
    // 		type: 'POST',
    // 		data: 'tableData='+htmlData+'&rN=canvera_'+postfix,
    // 		success: function(template) {

	   //  		var dt = new Date();
		  //       var day = dt.getDate();
		  //       var month = dt.getMonth() + 1;
		  //       var year = dt.getFullYear();
		  //       var hour = dt.getHours();
		  //       var mins = dt.getMinutes() + 'mins';
		  //       var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
				// //var data_type = 'data:application/vnd.ms-excel';
				// var a = document.createElement('a'); 
				// a.id = 'download_xl';
				// //a.href =  data_type + ', ' + htmlData;
				// a.href = template;
		  //       //setting the file name
		  //       a.download = 'canvera_'+postfix+ '.xls';
		  //       //triggering the function
		  //       a.click();

    // 		},
    // 		error: function(response) {
    // 			alert('Failed to download..');
    // 			console.log(response);
    // 		}

    // 	});		

    	//send data wrapped properly in table, sending as string
       	// downloadAsExcel(htmlData); //this is causing some extension issue in diffrent system fix it later #shoib

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

	//now show edit or save buttons
	if(session_login == reptCreatedBy) {
		$('#saveChart').css('display', 'block');	
	} 

	return;
}


/*
	* initializes the pivot, and removes previous initilized data
*/
function initializePivot() {
/*  Set up the Kruchten pivot table */
$("#k_results").children().remove(); //empty if any
 var id = getValueFromUrl('i');
 if(id == '') {
 	$('#pvtLoading').css('display', 'none');
 	return alert('Abort: i values is mission from url.');
 }	
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
					var piv_hdrs = data.pivot_fields;
					piv_jason = formatNumbering(data.piv_json, piv_hdrs);
					console.log(data);
					// var piv_jason = data.piv_json;					
					//send json to pivot init funct
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
			//show hack scroll for big vertical data
			showDuplicateScrollForReptPivot();
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
			console.log(response);
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

var reptTblFilterIndx=0, reptEntityColumns, reptFilterRowStatus;
//draw filter row
function reptDrawFilterRow(cnt, toTbl, singleSelect) {
	
	var tr, col, opt, sel, n, inp, imgDiv, colSel, oprSel, textBoxClass, reptFilterRowStatus=false, typ;
	for(var i=1; i<=cnt; i++) {
		tr = $('<tr id="filterTblRow_'+reptTblFilterIndx+'"></tr>');

		if(singleSelect == false) {
			
			//this shows and condition text for each row
			col = $('<td style="width:40px;"></td>');		
			if(reptFilterRowStatus == true) {
				col.text('and');
			}
			else {
				col.text('');
				reptFilterRowStatus = true; 
			}
			
			tr.append(col);

			 colSel = 'reptFilterEntityColsPopUp';
			 oprSel = 'reptFilterOprColsPopUp';
			 textBoxClass = '';
		} else {
			 colSel = 'reptFilterEntityCols';
			 oprSel = 'reptFilterEntityOpr';
			 textBoxClass = 'reptAddEditFilterTextBox';
		}


		col = $('<td class="toPostCol"></td>');
		sel = $('<select class="'+colSel+' toPostVal" id="filterCol_'+reptTblFilterIndx+'" ></select>');
		sel.append('<option value="" type="">---</option>');
		$.each(reptEntityColumns,function(k,v) {
			typ = v['type'];
			if(typ in reptRulesTriggerMappings['colMapName']) {
				n = v['name'];
				opt = "<option value="+v['id']+" type="+typ+">"+n+"</option>";
				sel.append(opt);
			}
		});
		col.append(sel);
		tr.append(col);

		//second column of row
		col = $('<td class="toPostCol"></td>');
		sel = $('<select class="'+oprSel+' toPostVal" id="filterOpr_'+reptTblFilterIndx+'"></select>');
		sel.append('<option value="" type="">---</option>');
		col.append(sel);
		tr.append(col);

		//third  column
		col = $('<td class="toPostCol"></td>');		
		inp = "<input class='toPostVal "+textBoxClass+"' type='text' value='' name='' id='filterEntTxt_"+reptTblFilterIndx+"' />";
		col.append(inp);
		tr.append(col);

		//fourth column, contains date list
		col = $('<td style="width:25px;display:none;" id="filterDateCol_'+reptTblFilterIndx+'" ></td>');
		tr.append(col);

		//fifth column, contains date list
		if(singleSelect === true) {
			col = $('<td style="width:100px;"><input type="button" value="" title="Go Quick-filter"  id="reptSingleFilterSub" /><input type="button" value="More" title="Add more Quick-filter conditions" id="reptMoreFilterCond" class="reptFilterOprColsPopUp" /></td>');
			tr.append(col);
		}

		if(singleSelect === false) {
			col = $('<td style="width:35px;"></td>');
			imgDiv = $('<div id="filterEntAddOrDel_'+reptTblFilterIndx+'"></div>');
			if(i == cnt) {			
				imgDiv.addClass('reptAddNewCondForFilter');
			} else {			
				imgDiv.addClass('reptRemoveCondForFilter');
			}
			col.append(imgDiv);
			tr.append(col);
		}


		//now add the row to table
		toTbl.append(tr);
		
		reptTblFilterIndx++;
		
	}
}


//this will shows the filter columns for single select
function reptShowColumnsForSingleSelect () {
	if(reptEntityName === '') {
		alert('No entity list id or name');
		return;
	}

	//hit the url and get columns for entity id
	var udm = '/atCRM/custom/metadata/eC.html?e=8892';//+reptEntityName;
	// console.log('filters...');
	//get  list of columns for particular entity
	$.ajax({
		url: udm,
		dataType: 'JSON',
		// async: false,
		success: function(data) {	
			reptEntityColumns = data['columns']; //colsForEntity is global var
			var dest = $('#reptSingleCondFilter');
			if(dest.children().length == 0)			
				reptDrawFilterRow(1, dest, true);	
				reptDrawFilterRow(5, $('#commonPopupDiv #filterTbl'), false);			
		},
		error: function(response) {
			console.log('Error while getgin entity columns..');
			console.log(response);
		},
	});
}


//contains different operators, for different column types
//currently supporting, text, number, date
var reptRulesTriggerMappings = {
		"colMapName": {
			"Text": "text",
			"Textbox": "text",
			"Multi": "text",
			"Combo": "text",
			"Decimal": "number",
			"Number": "number",
			"Integer": "number",
			"Date": "date",
			"DateTime": "date",
		},
		"colProperties": {
            "number": {
                "eq": "equal to",
                "ne": "not equal to",
                "lt": "less than",
                "gt": "greater than",
				"nu": "is null",
				"nn": "is not null"
		       },
		       "numberpk": {
		       "eq": "equal to",
		       "ne": "not equal to",
			   "nu": "is null",
			   "nn": "is not null"
		       },
		       "date": {
		       "eq": "equal to",
		       "ne": "not equal to" ,
		       "lt": "less than",
		       "gt": "greater than",
			   "nu": "is null",
			   "nn": "is not null"
		       },
		       "text": {
		       "eq": "equal to",
		       "ne": "not equal to",
		       "ct": "contains",
		       "sw": "starts with",
		       "ew": "ends with",
			   "nu": "is null",
			   "nn": "is not null"
		       }
       }
   };


function reptShowFilterPopUp() {	
	//show pop up
	$( "#commonPopupDiv" ).dialog({
			resizable: false,
			autoOpen:true,
			modal: true,
			title:"Add Filter",
			width:800,
			height:350,
			closeOnEscape: false,
			position: 'center'
	});
	var btn = $('#reptCanU #reptMoreFilterCond'); 
	if(!btn.hasClass('reptMoreFilterCondApplied')) {
		//prepare html contents first
		var container = "<div><div id='filterShowLoading'><center><img src='/atCRM/images/JSON/loading.gif'><p>Loading filters..</p></center></div><div id='filterContainer'><form id='filterTblForm'><table id='filterTbl'></table></form><input type='button' value='Go' id='reptFilterTblSubmit' style='float:right;width:40px;' /><input type='button' value='Clear' id='reptFilterTblClear' style='float:right;margin-right:4px;' /></div></div>";
		$('#commonPopupDiv').html(container);
		reptDrawFilterTableOpt();
		btn.addClass('reptMoreFilterCondApplied');
	}
	
}

function reptDrawFilterTableOpt() {	

	reptDrawFilterRow(5, $('#commonPopupDiv #filterTbl'), false);

	//hide loading 
	$('#filterShowLoading').remove();
}

function formatNumbering(data, header) {
	//store index of integer columns
	var indexOfIntegers = [], sc;
	$.each(header, function(k,v) {
		sc = v['sClass'].toLowerCase();
		if(sc === 'number' || sc === 'integer' || sc === 'decimal') {
			indexOfIntegers.push(k);
		}
	});

	var dataLen = data.length;
	for (var i = 0; i < dataLen; i +=1) {
		$.each(data[i], function(k,v) {
			if($.inArray(k, indexOfIntegers) != -1) {
				data[i][k] = reptGetFormatedNumber(v);
			}
		});		
	};
	console.log(data);
	return data;
}

//returns the number in proper format
//ex: 1.0002 will be 1.00, 100000 = 100, 000;
function reptGetFormatedNumber(num) {
	num = num.toString();
	num = reptReturnNumber(num); //this will contain only numbers and dot
	if(num.indexOf('.') > -1) {
		num = (Math.round(num*100)/100).toString();
		var arr = num.split('.');
		num = reptGetCommaSeparatedNum(arr[0]) + '.' + arr[1];
	} else {
		num = reptGetCommaSeparatedNum(num);		
	}

	return num;
}

//reurns comma separated number
function reptGetCommaSeparatedNum(num) {
	var len = num.toString().length, temp='',digit;
	for(var i=0; i<len; i +=1) {
		digit = num.charAt(i);
		if((i%3)==0 && i != 0 && len > 5){
			temp = temp + ', ' + digit;	
		} else {
			temp = temp + '' + digit;
		}		
	}
	return temp;
}

//get filter data from ran.htm
function getFilterForRan(urlPath) {
	$.ajax(
		{
			url: urlPath,
			type: 'POST',
			dataType: 'JSON',
			success: function(data) {
				alert(typeof data);
				console.log(data);
			},
			error: function(response) {
				alert('Failed');
				console.log(response);
			}
		}
	);
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


