
var lAddCalendarIndx  = 2; //becuase in rept.js date time has id with 0 and 1
var lAddPicklistIndx  = 1; //global picklist index
var lAddCurrentdateId = ''; //global date variable
var listAddOTable; //global var for list add data table
var hdrs; //this is global contains datatable headers
var paymentModeArr = [];

function exec_l_add(doc, intoDiv, mainUrl) {

		// console.log('l add page parsing...');
		//** write code to destroy previos datatable and to parse new one

		//check if data table already initialized, then remove if so
		if(listAddOTable != null) {
			listAddOTable.fnDestroy();
			$('#listAddTblContainer').remove();
		}
				
		var submitUrl = doc.SubmitUrl;
		
		var styles = '<style type="text/css"> #listAddTblContainer {width:1200px;} .listAndAddTbl {width:100%;border-collapse: collapse;border:none;text-align:center;}';
			styles += '.lAddParamsLbl {max-width: 190px;font-weight: bold; font-family:candara, "sans-serif"; font-size: 14px; letter-spacing: 1px; margin: 4px 0;}.DynarchCalendar-topCont {top:25% !important; left: 40% !important; position: fixed !important;} .lAddFrmBtns {float:right;} .lAddFrmBtns:hover, #lAddListSubmit:hover {background-color:#014464 !important;color:white;} #lAddtblDivListData {margin:10px auto;overflow:hidden; width:100%;height:auto;} .lAddDateClass {width: 80px;} ';
			styles += '.multiSelectBox {position:absolute;width:170px;background-color:white;} #lAddMPLParmsCont .lAddSinglePickList , #lAddSPLParmsCont .lAddSinglePickList {width: 170px;} #lAddMPLParmsCont {width: 200px;height:30px;} #lAddSPLParmsCont {width: 200px;height:30px;} #lAddMPLDtCont {width: 125px;height:30px;} #lAddSPLDtCont {width: 125px;height:30px;}  #lAddDCont {width: 125px;height:30px;} #lAddDTCont {width: 215px;} #paramsTbl, #lAddtblDivParams, #lAddSlideUpDwnCont {width:100%;} #paramsTbl .odd {background-color: #E2E4FF;} #paramsTbl tr {background-color: rgb(253, 245, 245);vertical-align: top;} #lAddtblDivParams {margin: 13px auto;}  .listAndAddTbl .odd {background-color: #E2E4FF;} .listAndAddTbl .even {background-color: white;} #lAddListSubmit, #lAddListSubmit_wait {float:right;} .lAddDrpDwn, .lAddSinglePickList {width:100px;} .lAddParamsDesc {font-size: 12px;display: block; color:grey;}';
			styles += '.lAddRowSelected td {background-color: rgb(246, 247, 159) !important;} .dataTables_scrollHeadInner {float:left;} #listAndAddTbl_length select, #listAndAddTbl_filter input {display:inline;} .multiSelectBox {visibility:hidden;} .lAddMPLTd:hover .multiSelectBox {visibility:visible;} ';
			styles += '.submitColsCont  {position:relative;display:block;} .lAddDisableUserInpts {position:absolute;top:0;right:0;left:0;bottom:0;background-color:rgba(0,0,0,0);} ';
			styles += '.listAndAddTbl td {padding: 5px 0 !important;} .listAndAddTbl th, .listAndAddTbl td { width: 100px !important;min-width: 100px !important;max-width: 100px !important; } .dataTables_scrollBody { padding:0 0 22px 0; }';
			styles += '</style>';

		
		//in this div only everythings is and these is finally add to into_div 
		var d = $('<div id="listAddTblContainer"></div>');

		//add style to d
		d.append(styles);

		//draw paramerters section
		if(doc.Parameters) {			
			var params    = doc.Parameters;
			lAdddrawParamsConditions(params, d);
		}

		var tbl = $('<table class="listAndAddTbl" id="listAndAddTbl"></table>');

		var thead = $('<thead></thead>');
		var htr   = $('<tr></tr>'), th, n, typ, nid, cth,dataType;

		cth = $('<th>Checkbox</th>'); 
		htr.append(cth); //this col will contain checkboxes

		//make headers
		hdrs        = doc.ColumnHeaders;
		var submitIndex = [];
		$.each(hdrs, function(k,v) {
			n   = v.colmnDesc; 
			nid = v.nodeId;
			dataType = v.dataType;

			th = $('<th></th>');
			if(dataType == 'Decimal' || dataType == 'Integer')
				th.css('text-align', 'right');
			else
				th.css('text-align', 'left');	

			if(v.action) {
				submitIndex.push(k); //add the index
				if(v.hidden == 1) 
					th.css('display', 'none');	
			}	
			
			
			th.attr('id', nid);
			th.text(n);

			htr.append(th); //add th to header row
		});

		//now add complete tr to thead
		thead.append(htr);
		//thead to table
		tbl.append(thead);
		
		var tbody = $('<tbody></tbody>'), btr, btd, bpk, rdata, cVal, dataLen, remainingLen, inpTypes, plces;

		//draw body 
		var clas = 'odd';
		var tbodyData = doc.RowData, dataType;
		$.each(tbodyData, function(k, v) {
			
			//each row
			btr = $('<tr></tr>');

			//add check box, for each row
			bpk = v.pkId;
			btr.append('<td><input type="checkbox" id="'+bpk+'" class="lAddRowCbx" /></td>'); 

			//this is to add, odd or even rows
			if(clas == 'odd') {
				btr.addClass('odd');
				clas = 'even';
			} else {
				btr.addClass('even');
				clas = 'odd';
			}				
			
			//draw table body here
			rdata  = v.data;			
			$.each(rdata, function(k1, v1) {
				
				btd = $('<td></td>');
				if($.inArray(k1, submitIndex) == -1) { //this means its only view
					cVal = v1.colTxt;
					//get datetype from hdrs, using k1 as index
					dataType = hdrs[k1]['dataType'];
					
					if(dataType == 'Decimal' || dataType == 'Integer')
						btd.css('text-align', 'right');
					else
						btd.css('text-align', 'left');

					if((dataType == 'Date' || dataType == 'DateTime') && cVal.length > 0)  {
						cVal = retDateOrDateTime(cVal, dataType);
					} 

					if(dataType == 'Decimal') {

						if(hdrs[k1]['afterDecimal']) {
							plces = hdrs[k1]['afterDecimal'];						
							cVal = lAddLimitDecimal(cVal, plces);	
						} else {
							cVal = lAddLimitDecimal(cVal, 2);	
						}
						
					}

					//add value to td
					btd.text(cVal);	
					
					

				} else { //this means data to submit
					btd.addClass('lAddFldsToSubmitCol');
					var tmpDiv = $('<div class="submitColsCont"></div>');
					var hdrsTemp =  hdrs[k1];
					//for labels we need to hide cols
					if(hdrsTemp.dataType == 'Label')
						btd.css('display', 'none');

					lAddDrawTypeOfUserInput(tmpDiv, hdrsTemp, v1);
					tmpDiv.append("<div class='lAddDisableUserInpts'></div>");
					btd.append(tmpDiv);
				}

				btr.append(btd); //add to tr,
			});
			
			//finall add tr to tbody
			tbody.append(btr);
		});

		//add tbody to tbl
		tbl.append(tbody);

		var tblDiv = $('<div id="lAddtblDivListData"></div>');
			tblDiv.append(tbl); //wrap table in div

		//now add tbl to div
		d.append(tblDiv);

		//add submition button
		d.append('<input type="button" value="Submit" id="lAddListSubmit" class="blueButton" url="'+submitUrl+'" reloadurl = "'+mainUrl+'"/>');

		//add div to dom
		intoDiv.append(d);

		// //this is for calendar initialization
		// //initilizing last because, it doen't initilize if does not find element on dom
		var dateId;
		$('.lAddDateClass').each(function() {
			dateId = $(this).attr('id').split('_');
			lAddInitializeCalendar(dateId[1]); //initialize calendar
		});


		//initialize with datatable
		listAddOTable = $('#listAndAddTbl').dataTable(
			{
				  "bPaginate": true,
		          "bFilter": true,		           
		          "aLengthMenu":[[10,  25, 50, 100, -1], [10, 25, 50, 100, "All"]],
		          'iDisplayLength': -1,
		          "sScrollY": "600",
		          "sScrollX": "1200",
		          //"bStateSave": true,//saves the states, comment this if cookies are big
		          // "sScrollXInner": "400%",
		          "bScrollCollapse": true
			}
		);

		// $('#detailDataDiv #l_add_loading').remove();
		//new FixedHeader( listAddOTable ); //this will make table header fixed. #shoib this has bug if headers is wider

	/* end of exec_l_add function */
}



/**
	* this will function will create type of input and appends to tr
 */
function lAddDrawTypeOfUserInput(td, hdrs, rowData)  {

	var typ = hdrs.dataType, nodeId = hdrs.nodeId, picklistId, opts, sel,dval = hdrs.def_val;;	


	switch(typ) {

			case 'Picklist Single-select': 
				picklistId = hdrs.picklist_id;			
				lAddDrawSinglePickList(picklistId, td, nodeId, (picklistId+lAddPicklistIndx), 'lAddSPLDtCont');
				lAddPicklistIndx++; //for multiple picklist in a single page
				break;

			case 'Picklist Multi-select': 
				picklistId = hdrs.picklist_id;
				td.addClass('lAddMPLTd');
				lAddDrawMultiPickList(picklistId, td, nodeId, nodeId, (picklistId+lAddPicklistIndx), 'lAddMPLDtCont');
				lAddPicklistIndx++; //for multiple picklist in a single page
				break;

			case 'Date': 
				lAddDrawDate(td, nodeId);
				break;

			case 'DateTime': 
				lAddDrawDateTime(td, nodeId);
				break;

			case 'Checkbox': 
				lAddDrawCbx(td);
				break;
			
			case 'Text': 
				td.append('<input class="lAddParamsElem" type="text" name="'+nodeId+'" value="" style="width:100px;" nodeid="'+nodeId+'" />');
				break;	
			
			case 'Decimal': 
				td.append('<input class="lAddParamsElem lAddlimitDecimal" type="text" name="'+nodeId+'" value="" style="width:100px;" nodeid="'+nodeId+'" />');
				break;	

			case 'Integer':
				  td.append('<input class="lAddParamsElem lAddIntegerOnly" type="text" name="'+nodeId+'" value="" style="width:100px;" nodeid="'+nodeId+'" />');
				  break;	
				
			case 'Drop-down': 
				sel = $('<select class="lAddDrpDwn lAddParamsElem"></select>');
				sel.attr('nodeid',nodeId);				
				var pkId = hdrs.picklist_id ;
				
				if(pkId != '' && paymentModeArr.length == 0) {
					console.log('genericPicklist');
					//getting select elements from ajax
					var opts =  getValuesForPaymentMode(pkId);
					$.each(opts, function(k,v) {
						var opts = v['columnData'].split('~)');
						if(opts.length > 0) {
							sel.append('<option value="'+opts[0]+'">'+opts[1]+'</option>');
						}
					});

				} else if(pkId != '') {
					//paymentModeArr this global arra
					$.each(paymentModeArr, function(k,v) {
						var opts = v['columnData'].split('~)');
						if(opts.length > 0) {
							sel.append('<option value="'+opts[0]+'">'+opts[1]+'</option>');
						}
					});
				}

				sel.val(rowData['colTxt']);
				td.append(sel);
				break;	

			case 'Label': 
				var lblVal;
				if(dval !=  '') {
					//obviously javascript for dval
					lblVal = eval(dval);
					lblVal = retValidDateTime(lblVal);
				}	
				 else {
				 	lblVal = rowData['colTxt'];
				} 	

				td.append('<input class="lAddParamsElem" type="hidden" name="'+nodeId+'" value="'+lblVal+'" nodeid="'+nodeId+'" />');
				 break;	



			default: console.log('Invalid param type: ' +  typ + ' is not defined');
				 break;
		}
}



/* 
	* this will draw prams condtions
	* check the length when ever it is called and redraw it and redraw datatable
	* this happens at load time
*/
function lAdddrawParamsConditions(paramsData, intoDiv) {
		
	var desc, lbl, picklistId='', name, td, name,type;
	var tblDiv = $('<div id="lAddtblDivParams"></div>'), tbl=$('<table id="paramsTbl" cellspacing="5"></table>'),tr = $('<tr></tr>'), colLen = 3,p;
	var clas = 'odd';

	$.each(paramsData, function(k, v) {
		name = v['name'];
		desc = v['description'];
		type = v['param_type'];
		lbl  = v['label'];
		td   = $('<td></td>');
		if(clas == 'odd') {
			td.addClass('odd');
			clas = 'even';
		} else {
			td.addClass('even');
			clas = 'odd';
		}
		td.attr('name', name).attr('type',type);

		//add element to dom based on type
		switch(type) {

			case 'Picklist Single-select': 
				picklistId = (v['picklist']=='')?picklistId:v['picklist'];
				p = '<p class="lAddParamsLbl">'+lbl+'<span class="lAddParamsDesc">'+desc+'</span></p>';
				td.append(p);
				lAddDrawSinglePickList(picklistId, td, '', (picklistId+lAddPicklistIndx), 'lAddSPLParmsCont');
				lAddPicklistIndx++; //for multiple picklist in a single page
				break;

			case 'Picklist Multi-select': 
				picklistId = (v['picklist']=='')?picklistId:v['picklist'];
				p = '<p class="lAddParamsLbl">'+lbl+'<span class="lAddParamsDesc">'+desc+'</span></p>';	
				td.append(p).addClass('lAddMPLTd');				
				lAddDrawMultiPickList(picklistId, td, '', (picklistId+lAddPicklistIndx), 'lAddMPLParmsCont');
				lAddPicklistIndx++; //for multiple picklist in a single page
				break;

			case 'Date': 
				var p = '<p class="lAddParamsLbl">'+lbl+'<span class="lAddParamsDesc">'+desc+'</span></p>';	
				td.append(p);
				lAddDrawDate(td, '');
				break;

			case 'DateTime': 
				var p = '<p class="lAddParamsLbl">'+lbl+'<span class="lAddParamsDesc">'+desc+'</span></p>';	
				td.append(p);
				lAddDrawDateTime(td, '');
				break;

			case 'Checkbox': 
				var p = '<p class="lAddParamsLbl">'+lbl+'<span class="lAddParamsDesc">'+desc+'</span></p>';	
				td.append(p);
				lAddDrawCbx(td);
				break;
			
			case 'Text': 
				var p = '<p class="lAddParamsLbl">'+lbl+'<span class="lAddParamsDesc">'+desc+'</span></p>';	
				td.append(p);
				td.append('<input type="text" name="'+name+'" value="" style="width:100px;" />');
				break;	

			default: alert('Invalid param type: ' +  type + ' is not defined');
				 break;
		}

		
		//add tds to tr
		tr.append(td);

	});

	//append rest of tr which could not add to tbl because length condtion did not satisfied
	//add buttons for submission and cancellin purpose
	tr.append("<td style='vertical-align:bottom;'><input type='button' id='getLAddData' value='Refresh' class='blueButton lAddFrmBtns' /></td>");
	tbl.append(tr);
			

	//add final tbl to tblDiv
	tblDiv.append(tbl);

	//add buttons for submission and cancellin purpose
	// var frmBtns = "<input type='button' id='getLAddData' value='Refresh' class='blueButton lAddFrmBtns' />";
	// //btns to div
	// tblDiv.append(frmBtns);

	//slide up and down div cont
	var slideUpDwnCont = $('<div></div>');
		slideUpDwnCont.attr('id', 'lAddSlideUpDwnCont');
		slideUpDwnCont.append(tblDiv); //add tbl div into this container

	//finally add to div to dom
	intoDiv.append(slideUpDwnCont);

	
	
}


function lAddInitializeCalendar(lAddCalendarIndx) {

	new Calendar({
                inputField: 'eachParamCondName_'+lAddCalendarIndx,
                dateFormat: "%Y-%m-%d", 
                trigger: 'calendar_'+lAddCalendarIndx,
                bottomBar: true,
                fdow:0,
                min: 19000101,
                max: 29991231,
                align: "BL",
                onSelect: function(data, data1) {
                  
                  this.hide();

                  setTimeout("lAddvalidateDateTime(00,00);", 500); //fix for proper date
                  
                }
            });   

      addClickListener('calendar_'+lAddCalendarIndx);        
}

//this will add click listener for calendar
//this is for validating proper date field
function addClickListener(id) {
	document.getElementById(id).addEventListener('click', function() {
		lAddCurrentdateId = 'eachParamCondName_'+ $(this).attr('id').split('_').pop(); 		
	});
}

function lAddvalidateDateTime(h, m) {	
	
	var d = $('#'+lAddCurrentdateId).val().split('-');
	if(d.length == 0)	{
		alert('Invalid date format.');
		return false;
	}
		
	var d = new Date(d[0], d[1]-1, d[2], h, m); //d contains time in miliseconds

	//get the date validation function from json
	var fldId  = $('#'+lAddCurrentdateId);
	var nodeId = fldId.attr('nodeid'); //node needed to match json headers
	
	//get validation function from json headers
	var validationFunc = '';
	$.each(hdrs, function(k,v) {
		if(v['nodeId'] == nodeId) {
			validationFunc = v['valdn_js'];		
		}
	});
	
	if(validationFunc != '') {
		var reqFunc = eval('(' + validationFunc + ')');
		var res = reqFunc(d);			
		if(res === false) {	
			alert('Post date cannot be accepted');		
			$('#'+lAddCurrentdateId).val('');
		}
	}


	// if(d > Date.now()) {
	// 	alert('Invalid date. Please choose date less than or equal to today!');
	// 	$('#'+lAddCurrentdateId).val('');
	// }
}


function lAddDrawSinglePickList(pkId, td, nodeId, pkIdGlb, wid) {
	
	//add picklist for single select
	var pkList = '<div id="'+wid+'"><input type="hidden" class="lAddParamsElem" name="0-1-'+pkIdGlb+'-'+pkIdGlb+'" id="0-1-'+pkIdGlb+'-'+pkIdGlb+'" value="" nodeid="'+nodeId+'" >';
		pkList += '<input class="lAddSinglePickList" type="text"  name="0-1-'+pkIdGlb+'-'+pkIdGlb+'txt" id="0-1-'+pkIdGlb+'-'+pkIdGlb+'txt" value="2 chars or **" onfocus="changeMultiTxt(this);" onblur="changeMultiTxt(this);" onkeyup="callAjax(\'smartSuggestDiv'+pkIdGlb+'\',this,event,\'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListId='+pkId+'\',this.value,\'\',\'undefined\');"  autocomplete="off">';
 		pkList += '<div id="smartSuggestDiv'+pkIdGlb+'"></div></div>';
 
 		//add pick list to td
 		td.append(pkList);

}

function lAddDrawMultiPickList(pkId, td, nodeId, pkIdGlb, wid) {
	//add multiple pick list
	 window["array_0_1_"+pkIdGlb+"_multi"] = []; //fix for multiple select box
	 var multipleSel = '<div id="'+wid+'"><input class="lAddParamsElem" type="hidden" name="0-1-'+pkIdGlb+'" id="0-1-'+pkIdGlb+'" nodeid="'+nodeId+'" value=""><input type="hidden" name="0-1-'+pkIdGlb+'-multi" id="0-1-'+pkIdGlb+'-multi" value=""><input type="hidden" name="0-1-'+pkIdGlb+'-multi-max" id="0-1-'+pkIdGlb+'-multi-max" value="5"><input type="hidden" name="0-1-'+pkIdGlb+'-multi-fun" id="0-1-'+pkIdGlb+'-multi-fun" value="">';
		 multipleSel += '<input type="text" name="0-1-'+pkIdGlb+'-multitxt" id="0-1-'+pkIdGlb+'-multitxt" class="ui-corner-all multiSelectTxt lAddSinglePickList" onkeyup="callAjax(\'multiSelectSugg\',this,event,\'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListId='+pkId+'\',this.value,\'undefined\',\'undefined\');" onfocus="changeMultiTxt(this);" onblur="changeMultiTxt(this);" value="2 chars or **" autocomplete="off"/><div id="multiSelectSugg" name="multiSelectSugg" class="sf_suggestion" ></div>';
		 multipleSel += '<div class="multiSelectBox" name="0-1-'+pkIdGlb+'-multi-multiSelDiv" id="0-1-'+pkIdGlb+'-multi-multiSelDiv"></div></div>'; 

	//add to td now
	td.append(multipleSel);
	
	return td;
}

function lAddDrawDate(td,nodeId) {

	var dt = '<div id="lAddDCont"><input type="text"  id="eachParamCondName_'+lAddCalendarIndx+'" class="lAddDateClass lAddParamsElem" nodeid="'+nodeId+'">';
		dt += '<img src="/atCRM/images/calendar.gif" id="calendar_'+lAddCalendarIndx+'" alt="Pick Date" style="cursor:pointer;vertical-align:middle;padding-left:1px;" ></div>';
		td.append(dt);
	lAddCalendarIndx++;
	return td;
}

function lAddDrawDateTime(td, nodeId) {

	var dt = '<input type="text"  id="eachParamCondName_'+lAddCalendarIndx+'" class="lAddDateClass lAddParamsElem itsDateTime" nodeid="'+nodeId+'">';
		dt += '<img class="lAddDateImg" src="/atCRM/images/calendar.gif" id="calendar_'+lAddCalendarIndx+'" alt="Pick Date" style="cursor:pointer;vertical-align:middle;padding-left:1px;" >';
		//td.append(dt);

	var sl = lAddGenerateSlctTime($('<select class="lAddTime" style="width: 100px;height: 30px;"></select>'));	
	//add select box to td now
	// td.append(sl);

	var d = $('<div id="lAddDTCont" ></div>');
		d.append(dt);
		d.append(sl);

		td.append(d);

	lAddCalendarIndx++;
	return td;
}

/* 
	* gives the time select box like 1:00 AM etc..
*/
function lAddGenerateSlctTime(sl)  {
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


function lAddDrawCbx(td, nodeId) {

	var  cbx = "<input type='checkbox' class='lAddParamsElem' nodeId='"+nodeId+"'/>";
		 td.append(cbx);

		return td;
}

//this will post data to udm
function postLAddList(postData, udmUrl) {
	$('#lAddListSubmit').val('Wait...').attr('id', 'lAddListSubmit_wait');

	$.ajax(
		{
			type: 'POST',
			data: postData,
			url: udmUrl,
			success: function(data)	{
				alert('Submited successfully !');				
				$('#lAddListSubmit_wait').val('Submit').attr('id', 'lAddListSubmit');
				//reload the page
				var reloadUrl = $('#lAddListSubmit').attr('reloadurl');
				$.get(reloadUrl, function(data) {
					doc = JSON.parse(data,function (key,value)
					{
						var type;
						if (value && typeof value === 'object') 
							{
								type = value.type;
								if (typeof type === 'string' && typeof window[type] === 'function') 
								{
									return new (window[type])(value);
								}
							}
							return value;
					}); 
					exec_l_add(doc, $('#detailDataDiv'), mainUrl); //trigger back same function
				});
				
			},
			error: function(resoponse) {
				alert('Failed to submit');
				console.log(resoponse);
				$('#lAddListSubmit_wait').val('Submit').attr('id', 'lAddListSubmit');	
			},
		}
	);
}

//this will return date dd-mm-yyyy hh:mm:ss
//param miliseconds
function retValidDateTime(milisec) {
	var d = new Date(milisec);
	var day  = d.getUTCDay(); //get day;
	var mnt   = d.getUTCMonth() + 1; //get month + 1 because its starts with 0-11 
	var yyyy = d.getUTCFullYear(); //get year;
	var h = d.getHours(); //get hour
	var m = d.getMinutes(); //get min
	var s = d.getSeconds(); //get sec
	var mili = d.getMilliseconds(); //get mili sec

	return yyyy + '-' + mnt + '-' + day + ' ' + h + ':' + m + ':' + s + '.' + mili;
}

//return date or date time
var lAddMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function retDateOrDateTime(dt, typ) {
	var d = ['','','','','','']; //init
	var t = ['','','']; //init

	var dt = dt.split(' ');	
	if(dt.length > 1) {
		dts = dt[0];
		ts = dt[1];

		d = dts.split('-');
		t = ts.split(':');
	}

	if(typ === 'Date') {				
		var dtObj = new Date(d[0], d[1]-1, d[2], 0, 0, 0); //d contains time in miliseconds
		return  dtObj.getUTCDay() + '/'  + lAddMonths[dtObj.getUTCMonth()] + '/' + dtObj.getUTCFullYear();

	} else {		
		var dtObj = new Date(d[0], d[1]-1, d[2], t[0], t[1], t[2]); //d contains time in miliseconds
		// var str = dtObj.getUTCDay() + '/'  + lAddMonths[dtObj.getUTCMonth()] + '/' + dtObj.getUTCFullYear();		
		// if(dtObj.getHours() 
		
		return  dtObj.toLocaleString();

	}
}

//limit decimal value
function lAddLimitDecimal(val, plces) {
	if(val.indexOf('.') !== -1) {
		return parseFloat(val).toFixed(plces);
	} else {
		return val;
	}
}

//this gets the payment mode types
function getValuesForPaymentMode(pkId) {
	//getting select elements from ajax
	var path = '/atCRM/custom/JSON/smartSuggest/genericPicklist.htm?pckListId='+pkId; 
	$.ajax(
		{
			url: path,
			type: 'GET',
			async: false,
			success: function(data){				
				var data = JSON.parse(data);
				if(data['PickListItems']['listData']) {
					paymentModeArr = data['PickListItems']['listData'];									
				}
			},
			error: function(resp) {
				console.log('Failed to load Drop-down for '+ pkId);
				console.log(resp);
			},
		}
	);

	return paymentModeArr;
}


$(document).ready(function() {

	//show the date
	$('body').on('click','.lAddDateClass',function() {		
		var id = $(this).attr('id').split('_').pop();
		$('#calendar_'+id).trigger('click');
	});


	//on change of time validate date
	$('body').on('change', '.lAddTime', function() {
		var v = $(this).val().split(':');		
		lAddCurrentdateId = $(this).parent().children('.lAddDateClass').attr('id');
		lAddvalidateDateTime(v[0], v[1]);		
	});

	$('body').on('click', '#lAddListSubmit', function() {
		
		//post the data
		var postData = {}, t, nid, ele, val, indx, dtval, url, postErr = false; //object
		url = $(this).attr('url');
		$('.lAddRowSelected .lAddFldsToSubmitCol').each(function() {
			t   = $(this);
			indx = t.parent().index();	//this gets the row index w.r.t table #needed for replacing x in node id		
			ele = t.find('.lAddParamsElem'); 
			// console.log(ele.attr('nodeid'));
			nid = ele.attr('nodeid');
			if(typeof nid !== 'undefined') {
				nid = nid.replace('x', indx);
				val = ele.val();
				if(ele.hasClass('itsDateTime')) {
					val += 	' ' + t.find('.lAddTime').val();
				} else if(ele.attr('type') == 'checkbox') {
					val = (ele.is(':checked'))?1:0;
				}
				postData[nid] = val;
			} else {
				alert('For some variable node id is undefined. Check all columns of table');
				postErr = true;
			}

		});

		if(postErr == true) { 
			alert('Submition failed. Invalid variables found.');
			return false;
		}

		//post only if, there is anything to post
		if(Object.keys(postData).length > 0 ) {
			//post data to udm zcServletPrefix is global defined in homepage.html
			postLAddList(postData, zcServletPrefix+'/'+url);	
		} else {
			alert('No rows selected to post !');
		}

		

	});

	$('body').on('click', '.lAddRowCbx', function() {
		var t =  $(this).parent().parent();
		if(t.hasClass('lAddRowSelected')) {
			t.removeClass('lAddRowSelected');
			t.find('.lAddDisableUserInpts').css('visibility','visible');
		}	
		else  {
			t.addClass('lAddRowSelected');
			t.find('.lAddDisableUserInpts').css('visibility','hidden');
		}	
	});

	$('body').on('click', '.lAddDisableUserInpts', function() {
		alert('Selection is disabled. Enable by checking checkbox!!');
	});

	//it inclucdes valid integer asci codes
	var integerAscii = [8,9,37,38,39,40,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105];
	//limit integer only
	$('body').on('keydown', '.lAddIntegerOnly', function(e) {
		 var ac = e.which;    
	    if($.inArray(ac, integerAscii) != -1) 
	        return true;
	    else
	        return false;
	});

	$('body').on('keydown', '.lAddlimitDecimal', function(e) {
		 var ac = e.which;    					//this below for decimal
	    if($.inArray(ac, integerAscii) != -1 || (ac == 190) || (ac == 110)) 
	        return true;
	    else
	        return false;
	});

	//limit decimal upto two point
	$('body').on('blur', '.lAddlimitDecimal', function(e) {
		 var t = $(this);
		 var deci = t.val();
		 var twoDeci = Math.round(deci * 100) / 100;
		 t.val(twoDeci);
	});


	/* end of document ready */
});
