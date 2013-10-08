var fieldItemsQ=new Array();
var nonNullFieldItemsQ=new Array();
var noOfColumnsQ=2;
var formActionQ;
var dateFldsQ=new Array();
var mandatoryFldsQ=new Array();
var mandatoryFldLblsQ=new Array();
var mandatoryFldElemQ=new Array();
var QickAddContainerDiv="";
var assgnUsrId;

function handleQuickAddPopup(container,errorDiv,vURL,objId,actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth,dispNameFrCalCen,qWindwPos) {
	//customized by govardhan for email client purpose (added 2 params for handleQuickAddPopup function)
	QickAddContainerDiv=container;
	fieldItemsQ.length=0;
	dateFldsQ.length=0;
	mandatoryFldsQ.length=0;
	mandatoryFldLblsQ.length=0;
	mandatoryFldElemQ.length=0;
	var url2hit="";
	
	if (vURL) {
      url2hit = vURL;
	} else {
		 url2hit="/atCRM/custom/JSON/add/customObject.htm?objId=14677";
	}
	var vURLsearch = vURL.search("custom/JSON/add/Contact.htm");
	if (vURL.indexOf('?') > -1) {
        var splitUrl = vURL.split("?")[1].split("&");
    } else {
      var splitUrl = new Array();
      splitUrl[0] = vURL;
    }
	var firstParam = splitUrl[0];
	var isFrmViewAdd = splitUrl[0].search("prefsName");
	if(G_quickAddResponse_Contact&&vURLsearch >=0 && isFrmViewAdd > 0)
		quickAddContainer(G_quickAddResponse_Contact,container,errorDiv,vURL,objId,actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	else
	$.ajax ({
	  type: "GET",
	  url: url2hit,
	  success: function (data) {	
		data=ReplaceAll(data,"\t","");
		data=ReplaceAll(data,"\n"," ");
		data=ReplaceAll(data,"\r","");
		data=ReplaceAll(data,"\xa0"," ");
		doc = JSON.parse(data,function (key,value) {
			var type;
			if (value && typeof value === 'object') {
				type = value.type;
				if (typeof type === 'string' && typeof window[type] === 'function') {
					return new (window[type])(value);
				}
			}
			return value;
		}); 
		quickAddContainer(doc,container,errorDiv,vURL,objId,actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth,dispNameFrCalCen,qWindwPos);
		//commented because quickaddpopup was not working for Lead
		/*if(formLoadFun)
		{
			var q=formLoadFun.indexOf('('); 
			var params="";
			if(q>0)
			{
				params=formLoadFun.substring(q+1,(formLoadFun.length)-1); 
				formLoadFun=formLoadFun.substring(0,q); 
			}
			quickAddForm.onLoad=dispatch(formLoadFun,[formName,params]);
		}*/
	  },
	  error: function (req, stat, err) {alert ("Oops! Looks like we did not get a decent response from the server. Error: " + err + ", Status: " + stat);}
	});
}

function quickAddContainer(data,container,errorDiv,vURL,objId,actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth,dispNameFrCalCen,qWindwPos) {
	//if($('#'+varDiv).dialog('open')==true)
	//{
	//	$('#'+varDiv).dialog('close');
	//	$('#'+varDiv).dialog('destroy');
	//}
    if(parent.windowData) windowData.close();
    $.window.prepare({
          dock: 'bottom'       // change the dock direction: 'left', 'right', 'top', 'bottom'
	});
	var windowHeight=$(window).height();
	var windowWidth=$(window).width();
	var jqryWinHt=windowHeight-40;
	var jqryWinWdth=windowWidth-120;
	var modatlVal = false;
	if((dispNameFrCalCen ||dispNameFrCalCen !="") && dispNameFrCalCen =="0") {
		L_title = "Add activity";
		modatlVal = true;
	}
	if(dispNameFrCalCen && dispNameFrCalCen !="0"){
		L_title = "Name - "+dispNameFrCalCen;
		varWidth = "225px";
	}
	$.window({
		showModal: modatlVal,
		title: L_title,
		content: "<div id='quickAddWindowDiv'></div>",
		width: varWidth,
		height: 500,
		maxWidth: 400,
		maxHeight: 500,
		resizable: false,
		onClose: function(wnd) { 
                     chngPos(L_varDiv);
				  try{
						var IframeElem = document.getElementById('htmlIframe');
						var innerDoc = IframeElem.contentDocument || IframeElem.contentWindow.document;
						//To store the LoginId in the Hidden Elem, used for Jquery Calendar...
						var TostoreLoginValue = innerDoc.getElementById('SelectUsr').value;
						innerDoc.getElementById('ToStoreUserLoginId').value = TostoreLoginValue;
						//To store the Type of Calendar in Hidden Elem, used for Jquery Calendar...
						//var StrCalendarType = innerDoc.getElementById('ToStoreMWD').value;
						//alert('StrCalendarType = '+StrCalendarType);
						
						if(IframeElem.contentWindow.InitialFunction2LoadActvt())
							IframeElem.contentWindow.InitialFunction2LoadActvt();
						innerDoc.getElementById('ToStoreUserLoginId').value='';
					}
					catch(e){}
					windowData = null;
			   },
		onShow: function(wnd) {
				   var windowId = wnd.getWindowId();
				   // console.log(qWindwPos);
				   //if(dispNameFrCalCen || dispNameFrCalCen !="") wnd.minimize();
				   document.getElementsByClassName("window_frame ui-widget-content no-draggable no-resizable ")[0].style.minHeight="400px";
				  windowData = wnd;              //store window instance in a global element
				  /*Chenage background of titlebar*/
				   var titleElem=document.getElementsByClassName('window_header window_header_normal ui-widget-header no-resizable ')[0];
				   titleElem.style.backgroundColor="#CEE2EE";
				   titleElem.style.borderRadius="0px";
				   /*Remove footer bar from the window*/
				   var footerDiv = document.getElementsByClassName("window_footer ui-widget-content no-draggable no-resizable ")[0];
				   $(footerDiv).remove();
				  // document.getElementsByClassName('window_frame ui-widget-content no-draggable no-resizable ')[0].style.backgroundColor="white";
                   /*Change layout functionality added here*/
                 // if(is_load==0){
					   var windowElem=document.getElementById(windowId);
					   var titleBarIconDiv=windowElem.getElementsByClassName("window_function_bar")[0];
					   var titleBar=windowElem.getElementsByClassName("window_header window_header_normal ui-widget-header no-resizable ")[0];
					   $(titleBar).css("background-color","#CEE2EE");
					   $(titleBarIconDiv).append("<img id='layout_img' src='/atCRM/images/JSON/layout-gray.png' onmouseover='javascript:changeImg();' onmouseout='javascript:retainImg();' title='Change page layout'/>");
					//	is_load=1;
						titleBarIconDiv.style.width="80px";
						var layoutImg=document.getElementById("layout_img");
						//layoutImg.style.position="absolute";
						//layoutImg.style.left="404px";
						layoutImg.style.marginTop="3px";
						layoutImg.style.cursor="pointer";
					//}
					console.log(dispNameFrCalCen);
					if(dispNameFrCalCen !="" && dispNameFrCalCen !=undefined) {
					   document.getElementById(windowId).style.left =qWindwPos; 
					   document.getElementById(windowId).style.top ="20px";
					   var closeImg;
					 if(dispNameFrCalCen !="0" && document.getElementsByClassName("closeImg window_icon_button no-draggable")[1]) closeImg= document.getElementsByClassName("closeImg window_icon_button no-draggable")[1];
					 else if(dispNameFrCalCen =="0" && document.getElementsByClassName("closeImg window_icon_button no-draggable")[0]) closeImg= document.getElementsByClassName("closeImg window_icon_button no-draggable")[0];
					   //closeImg.style.display ="none";
					 if(closeImg) $(closeImg).remove();
					   $("#layout_img").css({"display":"none"});
				   }
					if(document.getElementById("layout_img"))
					{
						var layoutImg=document.getElementById("layout_img");
						layoutImg.onclick=function()
						{
						  //close dialogBox and show changePage layout page
						 // $('#'+varDiv).dialog('close');
						  wnd.close();
						  SetPreferences(data.PrefsId,data.PrefsName,data.UDMName,entityDiv,data.PageType,data.PageCaption);
						}
					}


				   container = document.getElementById("quickAddWindowDiv");
				   	//	document.getElementById(varDiv).style.minHeight="250px";
				   var quickAddForm=document.createElement("form");
					quickAddForm.id="quickAdd-form";
					quickAddForm.name="quickAdd-form";
					//myForm.id="quickAdd-form";

					//To get the Selected User Id from the Calendar Page...
					if(document.getElementById('htmlIframe') && document.getElementById('htmlIframe') != null){
						var IframeElem = document.getElementById('htmlIframe');
						var innerDoc = IframeElem.contentDocument || IframeElem.contentWindow.document;
						var	SelectedUser;
						if(innerDoc.getElementById('SelectUsr')){
							var	SelectedUser = innerDoc.getElementById('SelectUsr').value;
							if(SelectedUser && SelectedUser!='Me')
								formActionQ=zcServletPrefix+data.editAction+"?for_user="+SelectedUser;
							else
								formActionQ=zcServletPrefix+data.editAction;
						}
						else
							formActionQ=zcServletPrefix+data.editAction;
					}
					else
						formActionQ=zcServletPrefix+data.editAction;

					container.style.display="block";
					container.appendChild(quickAddForm);
					var mainTable=CreateTable(quickAddForm,"","quickAdd-MainTable");
					var mainBody=CreateBody(mainTable);
					var mainTR=CreateTR(mainBody);
					var mainTD=CreateTD(mainTR,"jsonHeading","quickAdd-MainTdQ");
					var pageHeading=data.PageCaption;
					mainTable.style.width="100%";
					mainTable.style.align="center";
					//mainTD.innerHTML=pageHeading;

					// Link for Layout
					var topMenuTbl = CreateTable(mainTD);
					topMenuTbl.width="100%";
					var topMenuTbdy = CreateBody(topMenuTbl); 
					var topMenuTr=CreateTR(topMenuTbdy);
					var prefsTd=CreateTD(topMenuTr);	

					var errorDiv=CreateDIV(prefsTd,"jsonErrorDiv","errorDivQuickAdd","");
					errorDiv.style.width = "90%";
					errorDiv.style.margin = "10% auto";
					//Get all the field items to be populated
					var prefs4QA=data.PrefsId;
					if(!prefs4QA){errorDiv.style.display="block";errorDiv.innerHTML="Oops! It seems you don't have a page layout set up for this page.<br/>Click <a style='text-decoration:underline;color:blue;padding-bottom:3px;' href='#' onclick=\"javascript:windowData.close();SetPreferences ('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+data.PageCaption+"')\">here</a> to to set up this page's layout. Impel will remember your layout for future logins.";
						errorDiv.style.fontSize="11px";
					var errorDtlAddTR=CreateTR(mainBody);
					var errorDtlAddTD=CreateTD(errorDtlAddTR,"","errorDtlAddTD");
					errorDtlAddTD.align="center";
					div_dtlAdd=CreateDIV(errorDtlAddTD,"","div_dtlAdd");
					div_dtlAdd.style.textAlign="right";
					div_dtlAdd.style.width="90%";
					detailAddLink=CreateA(div_dtlAdd, "", "detailAddLink","#","","Detailed add","Detailed Add");
					detailAddLink.style.position="relative";
					detailAddLink.style.right="30px";
					$("#detailAddLink").css({"text-decoration":"underline","font-size":"14px","color":"#0000FF"});
					//$("#detailAddLink").css("color","#0000FF");
					detailAddLink.setAttribute("onclick","showDetailAdd('"+vURL+"','"+appType+"','"+windowId+"')");
					return;
					}


					for(i in data){
					  if(i=="TopPanel"){
						for(j in data[i]){
							fieldItemsQ.push(data[i][j]);
						}
					  }
					}

					var formLoadFun=data.onFormLoad;
					var formSubmitFun=data.onFormSubmission;

					var quickAddForm=document.getElementById("quickAdd-form");
					formName="quickAdd-form";

					if(fieldItemsQ.length>0){
						buildFieldsQA(data,formName,appType,vURL)
					}

					buttonDiv=CreateDIV(quickAddForm,"","buttonDiv","");
					buttonDiv.style.textAlign="right";
					buttonDiv.style.width="90%";

					detailAddLink=CreateA(buttonDiv, "", "detailAddLink","#","","Detailed add","Detailed Add");
					detailAddLink.style.position="relative";
					detailAddLink.style.right="30px";
					detailAddLink.style.verticalAlign="middle";
					$("#detailAddLink").css({"text-decoration":"underline","font-size":"14px","color":"#0000FF"});
					//$("#detailAddLink").css("text-decoration","underline");
					//$("#detailAddLink").css("color","#0000FF");
					detailAddLink.setAttribute("onclick","showDetailAdd('"+vURL+"','"+appType+"','"+windowId+"')");
					updateButton=CreateButton(buttonDiv, "greenButton", "updateButton", data.PageAction);
					updateButton.style.marginRight="15px";
					//updateButton.style.marginBottom="15px";
					updateButton.style.marginTop="7px";
					updateButton.style.width="60px";
					AddClickEventListener(updateButton,function(){updateQAData(formSubmitFun,eml_obj,ssElem)});
		// document.getElementsByClassName("closeImg window_icon_button no-draggable")[0].style.display="none";
	   }
	});

		/*$('#'+varDiv).dialog({
		autoOpen:true,
		stack:true,
		title:L_title,
		modal: false,
		//position:L_position,
		width:varWidth,*/
		//beforeclose: function() {/*dilogB4Close();*/},
		/*close: function() {
					chngPos(L_varDiv);
					try{
						var IframeElem = document.getElementById('htmlIframe');
						var innerDoc = IframeElem.contentDocument || IframeElem.contentWindow.document;
						//To store the LoginId in the Hidden Elem, used for Jquery Calendar...
						var TostoreLoginValue = innerDoc.getElementById('SelectUsr').value;
						innerDoc.getElementById('ToStoreUserLoginId').value = TostoreLoginValue;
						//To store the Type of Calendar in Hidden Elem, used for Jquery Calendar...
						//var StrCalendarType = innerDoc.getElementById('ToStoreMWD').value;
						//alert('StrCalendarType = '+StrCalendarType);
						
						if(IframeElem.contentWindow.InitialFunction2LoadActvt())
							IframeElem.contentWindow.InitialFunction2LoadActvt();
						innerDoc.getElementById('ToStoreUserLoginId').value='';
					}
					catch(e){}
			   }
		});
		$('#'+varDiv).dialog('open');*/
		/*if(is_load==0){
		   $("#"+varDiv).parent().find('.ui-dialog-titlebar').append("<img id='layout_img' src='/atCRM/images/JSON/layout-gray.png' onmouseover='javascript:changeImg();' onmouseout='javascript:retainImg();' title='Change page layout'/>");
			is_load=1;
			var layoutImg=document.getElementById("layout_img");
			layoutImg.style.position="absolute";
			layoutImg.style.left="404px";
			layoutImg.style.marginTop="1px";
			layoutImg.style.cursor="pointer";
		}
		if(document.getElementById("layout_img"))
	    {
			var layoutImg=document.getElementById("layout_img");
			layoutImg.onclick=function()
			{
			  //close dialogBox and show changePage layout page
              $('#'+varDiv).dialog('close');
			  SetPreferences(data.PrefsId,data.PrefsName,data.UDMName,entityDiv,data.PageType,data.PageCaption);
			}
        }*/

}

function changeImg(){
	var imgElem=document.getElementById("layout_img");
	imgElem.src="/atCRM/images/JSON/layout.png";
}

function retainImg(){
	var imgElem=document.getElementById("layout_img");
	imgElem.src="/atCRM/images/JSON/layout-gray.png";
}

/*Function to show detail Add page*/
function showDetailAdd(url,appType,windowId,wnd){
  //$("#quickAddPopupDiv").dialog("close");
  windowData.close();
  var addURL;
  var splitURL=url.split("?");
  var enttParam=splitURL[1].split("&");
  paramFirst=enttParam[0];
  if(appType=="OPP"||appType=="ACCT"){
	  if(enttParam.length>2)
	  {
	    var JSONURL=splitURL[0]+"?"+paramFirst;
			$.ajax({
				type: "GET",
				url: JSONURL,
				async:false,
				dataType: "json",
				success: function (data){
					if(appType=="OPP") G_jsonresponse_Opportunity = eval(data);
					else if(appType=="ACCT") G_jsonresponse_Account = eval(data);
					else if(appType=="CONCT") G_jsonresponse_Contact = eval(data);
				}
			});
        getAddDataFrmCache(splitURL[0]+"?"+paramFirst);
	  }
	  else{
        getAddDataFrmCache(splitURL[0]);
	  }
	  //getAddDataFrmCache(url);
  } else if(appType=="CONCT") {
    if(enttParam[0].indexOf("prefsName")!=-1) {
	  //alert("First-"+enttParam[0]);
	  getAddDataFrmCache(splitURL[0]);
	} else {
	 //alert("Second-"+enttParam[0]);
	  var JSONURL=splitURL[0]+"?"+paramFirst;
	  $.ajax({
		type: "GET",
		url: JSONURL,
		async:false,
		dataType: "json",
		success: function (data){
            G_jsonresponse_Contact = eval(data);
		}
		});
        getAddDataFrmCache(splitURL[0]+"?"+paramFirst);
	 }
  } else if(appType=="APTMT"||appType=="TSK") {
	  addURL=url.replace("is_DetailedAdd=0","is_DetailedAdd=1");
	  setUpPageParameters(addURL);
  } else {
	  addURL=splitURL[0];
	  setUpPageParameters(addURL);
  }
}
//This is to build the entire page with field items and labels.
var NoOfFields;
var contIndex=0;
var acctIndex=0;
var opptyIndex=0;
var userIndex=0;
var assgnUsrIndex=0;
function buildFieldsQA(data,formName,appType,vURL)
{
	if(data.UserId) assgnUsrId=data.UserId;
	var mainTD=document.getElementById("quickAdd-MainTdQ");
	var numFieldsWritten=0;
	var firstFldName=fieldItemsQ[0].dataColumn[0];
	var fldObj;
	NoOfFields=fieldItemsQ.length;
	if((firstFldName!="n")&&((firstFldName.split('~)').length)!=2))
	{
		var sectionDivMain=CreateDIV(mainTD);
		var sectionDiv=CreateDIV(sectionDivMain);	
		fieldTable=CreateTable(sectionDiv,"","","white","0","3");
		fieldTable.style.width="100%";
		fieldTable.cellPadding="3";
		var fieldTblBdy=CreateBody(fieldTable);
	}
	for(var x=0; x<fieldItemsQ.length; x++)
	{
		if(fieldItemsQ[x].dataColumn[1]){var a=fieldItemsQ[x].dataColumn[1].search("QA_");if(a<0){fieldItemsQ[x].dataColumn[1]="QA_"+fieldItemsQ[x].dataColumn[1];}}

		var fieldName=fieldItemsQ[x].dataColumn[0];
		var elemId=fieldItemsQ[x].dataColumn[1];
		var fieldType=fieldItemsQ[x].dataColumn[2];
		var nullableFld=fieldItemsQ[x].dataColumn[5];		
		var fldVal=fieldItemsQ[x].dataColumn[6];			
        var columnName=fieldItemsQ[x].dataColumn[10];		
		var strColumnName=fieldItemsQ[x].dataColumn[11];
		
		if(numFieldsWritten%noOfColumnsQ==0&&fieldType!='hiddenField')
		{  
			fieldTblTr=CreateTR(fieldTblBdy);
		}
	
		if(fieldItemsQ[x].dataColumn.length>1)
		{ 
			try{
				if(columnName){
					if(columnName.indexOf("str_udef_fkey")!=-1){
						if(!document.getElementById(elemId)){
							var strFld=CreateHIDDEN(mainTD, "", elemId, fldVal,columnName);	
							//strFld.type="text";
							//strFld.border="1px solid red";

						}
					}
				 }
			 }catch(e){
				//alert(e);
			 }

			if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
			{			
				var labelClass="ItemLabel";

				//Write all manadatory fields into an array
				if(nullableFld=="0")
				{
					if(fieldType=="multiSelect")
					{
						var elemId_new = elemId.substr(0,elemId.lastIndexOf("-"));
						mandatoryFldsQ.push(elemId_new);
					}
					else
					mandatoryFldsQ.push(elemId);
					mandatoryFldLblsQ.push(fieldName);
					var labelClass="ItemLabel";
					fieldName=fieldName+"<font color='#FF0000'>*</font><br />";	
				}
                
				//Create Label for form field
				//var fieldTblTd=CreateTD(fieldTblTr,labelClass);
				//fieldTblTd.innerHTML = fieldName+"\n";
				//fieldTblTd.style.width="13%";
				//var fieldElemTd=CreateTD(fieldTblTr,"WhiteItemLabel");
				var fieldElemTd=CreateTD(fieldTblTr,labelClass);
				fieldElemTd.style.width="50%";

				//Create Form field			
				fldObj=createQAFormFields(fieldElemTd,fieldItemsQ[x],formName,data,appType);
				numFieldsWritten++;
				
			}
			else
			{
				if(!document.getElementById(elemId)){
					CreateHIDDEN(mainTD, "", elemId, fldVal);
				}
			}
		}
		else
		{
			if(fieldName=="#")
			{			
				var colSpan=2;
				var fieldTblTd=CreateTD(fieldTblTr,"WhiteItemLabel","fieldLblTd",colSpan);
				numFieldsWritten++;
			}
			else if(fieldName=="n")
			{
				numFieldsWritten=0;
				var sectionDivMain=CreateDIV(mainTD);
				var sectionDiv=CreateDIV(sectionDivMain,"sectionDiv","","");			
				sectionDivMain.style.marginTop="15px";
				fieldTable=CreateTable(sectionDiv,"","","white","0","3");
				fieldTable.style.width="100%";
				fieldTable.cellPadding="3";
				fieldTblBdy=CreateBody(fieldTable,"","");				
			}
			else if((fieldName.split('n~)').length)==2)
			{
				var desc=fieldName.split('~)')[1];				
				numFieldsWritten=0;				
				var sectionDivMain=CreateDIV(mainTD);
				var sectionDivHdr=CreateDIV(sectionDivMain,'sectionDivHdr');	
				var sectionDiv=CreateDIV(sectionDivMain,"sectionDiv","","");			
				sectionDivHdr.innerHTML=desc;
				sectionDivMain.style.marginTop="15px";
				fieldTable=CreateTable(sectionDiv,"","","white","0","3");
				fieldTable.style.width="100%";
				fieldTable.cellPadding="3";
				fieldTblBdy=CreateBody(fieldTable,"","");
			}
			else if((fieldName.split('L~)').length)==2)
			{
				var desc=fieldName.split('~)')[1];				
				numFieldsWritten=0;				
				var sectionDivMain=CreateDIV(mainTD);
				var sectionDivHdr=CreateDIV(sectionDivMain,'sectionDivHdr');			
				sectionDivHdr.innerHTML=desc;
				sectionDivMain.style.marginTop="15px";
			}
		}
	}
	/*Create hidden fields for acct/contct/oppty/assgnTouser if elemnts does'nt exist in Actvty QA*/
	if(appType == "APTMT" || appType == "TSK" )
	 {
		var acctId;var contId;var opptyId;
		var idStr=vURL.split("?")[1].split("&")[2];
		if(idStr && idStr.search("acct_id")>-1) acctId=idStr.split("=")[1];
		else if(idStr && idStr.search("Contact_id")>-1) contId=idStr.split("=")[1];
		else if(idStr && idStr.search("Opportunity_Id")>-1) opptyId=idStr.split("=")[1];
		if(acctIndex == 0 && acctId) CreateHIDDEN(mainTD,"","QA_0-1-2401",acctId,"QA_0-1-2401");
		if(contIndex == 0 && contId) CreateHIDDEN(mainTD,"","QA_0-1-1701",contId,"QA_0-1-1701");
		if(opptyIndex == 0 && opptyId) CreateHIDDEN(mainTD,"","QA_0-1-3001",opptyId,"QA_0-1-3001");
		if(assgnUsrIndex == 0 && assgnUsrId) CreateHIDDEN(mainTD,"","QA_0-1-29",assgnUsrId,"QA_0-1-29");
	 }
	 /*Ends here*/
	 /*Create hidden field for contact_id on account QA page*/
	if(appType == "ACCT")
	 {
		  var contId;var opptyId;var actvtyId;
          var idStr=vURL.split("?")[1].split("&")[0];
		  if(idStr.search("Contact_id")>-1) contId = idStr.split("=")[1];
		  else if(idStr.search("Opportunity_Id")>-1) opptyId = idStr.split("=")[1];
		  else if(idStr.search("actvtid")>-1) actvtyId= idStr.split("=")[1];
		  if(contId) CreateHIDDEN(mainTD,"","QA_0-1301",contId,"QA_0-1301");
		  if(opptyId) CreateHIDDEN(mainTD,"","QA_0-1401",opptyId,"QA_0-1401");
		  if(actvtyId) CreateHIDDEN(mainTD,"","QA_0-1801",actvtyId,"QA_0-1801");
	 }
	 /*Ends here*/
	 if(appType == "CONCT")
	 {
		 var opptyId;var actvtyId;
         var idStr=vURL.split("?")[1].split("&")[0];
		 if(idStr.search("Opportunity_Id")>-1) opptyId = idStr.split("=")[1];
		 else if(idStr.search("actvtid")>-1) actvtyId= idStr.split("=")[1];
		 if(opptyId) CreateHIDDEN(mainTD,"","QA_0-1301",opptyId,"QA_0-1301");
		 if(actvtyId) CreateHIDDEN(mainTD,"","QA_0-1701",actvtyId,"QA_0-1701");
	 }
	 if(appType == "OPP")
	 {
		 var actvtyId;
         var idStr=vURL.split("?")[1].split("&")[0];
         if(idStr.search("actvtid")>-1) actvtyId= idStr.split("=")[1];
		 if(actvtyId) CreateHIDDEN(mainTD,"","QA_0-2501",actvtyId,"QA_0-2501");
	 }
	if(numFieldsWritten%noOfColumnsQ!=0)
	{
		var colSpan=(noOfColumnsQ-(numFieldsWritten%noOfColumnsQ))*2;
		var fieldTblTd=CreateTD(fieldTblTr,"WhiteItemLabel","fieldLblTd",colSpan);
	}
}

var filedNumberIndex=0;
function createQAFormFields(fieldElemTd,fldData,formName,data,appType)
{
	var fieldName=fldData.dataColumn[0];
	var elemId=fldData.dataColumn[1];
	var fieldType=fldData.dataColumn[2];
	var extendedType=fldData.dataColumn[3];
	var maxLength=fldData.dataColumn[4];
	var nullableFld=fldData.dataColumn[5];		
	var fldVal=fldData.dataColumn[6];		
	var smartSuggURL=fldData.dataColumn[7];		
	var dropDwnData=fldData.dataColumn[8];		
	var tblName=fldData.dataColumn[9];		
	var colName=fldData.dataColumn[10];
	var objEvent=fldData.dataColumn[11];
	var objEventFun=fldData.dataColumn[12];
	var fnctToCall=fldData.dataColumn[13];
	var paramName=fldData.dataColumn[14];
	var readNodeId=fldData.dataColumn[15];
	/*Check acct/cont/oppty/user fields exist on actvty QA page*/
	if(appType == "APTMT" || appType == "TSK" )
	 {
		  var acctSearch = elemId.search("0-1-2401");
		  var contSearch = elemId.search("0-1-1701");
		  var opptySearch = elemId.search("0-1-3001");
		  var userSearch = elemId.search("0-1-1201");
		  var assignToUsr = elemId.search("0-1-29");
          if(acctSearch>0) acctIndex=1;
		  if(contSearch>0) contIndex=1;
		  if(opptySearch>0) opptyIndex=1;
		  if(userSearch>0) userIndex=1;
		  if(assignToUsr>0) assgnUsrIndex=1;
	 }
	 /*Actvty check ends here*/
	if(readNodeId)
	readNodeId = 'QA_'+readNodeId;
	
	if(fieldType!="hiddenField" && fieldType!="PrimaryKey"){
		if(nullableFld=="0")
			fieldElemTd.innerHTML=fieldName+"<font color='#FF0000'>*</font><br />";
		else
			fieldElemTd.innerHTML=fieldName+"<br />";
	}

	switch (fieldType)
	{ 
		case "textBox":
		case "Text":	
						fldObj=CreateTEXTBOX(fieldElemTd,"inputFieldClass",elemId,fldVal,maxLength);
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;

		case "label":
						if(extendedType=='password')
						{
							fieldElemTd.innerHTML+="<span class='inputFieldClass' style='border:0'>"+fldVal+"</span>";
						}
						else
						{
							fieldElemTd.innerHTML+="<span class='inputFieldClass' style='border:0'>"+fldVal+"<input type='hidden' name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"'></span>";		  
						}
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;


		case "dropDownList":					            
													
						fldObj=CreateSelectBox(fieldElemTd, "inputFieldClass", elemId, fldVal);
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
						if(dropDwnData)
						{
							var dropDownElems=dropDwnData.split("~)");  
							for(var dElem=0;dElem<dropDownElems.length;dElem++)
							{	
								val=dropDownElems[dElem].split('--');  	
								fldObj[dElem]=new Option(val[1], val[0]);
								if(fldVal==val[0])fldObj[dElem].selected = true;
							}
						}
					break;
		
		case "multiLevelDropdown":	
						if(fldVal){var lastIndex=fldVal.lastIndexOf(">>")>0?fldVal.lastIndexOf(">>")+2:0; var fldVal2Disp=fldVal.substring(lastIndex);}else var fldVal2Disp='...';
						fieldElemTd.innerHTML="<input type='hidden' id='"+elemId+"' value='"+fldVal+"'><span id=\""+elemId+"-mnuspan\" class='dropDownMenuSpan'><a href='javascript:showMultiLevelDropData(\""+elemId+"-mnu\",\""+tblName+"\",\""+colName+"\")' id=\""+elemId+"-href\" class='dropDownMenuHref'>"+fldVal2Disp+"</a></span>";	
					break;

		case "TextArea":
		case "textArea":
						fldObj=CreateTEXTAREA(fieldElemTd, "inputFieldClass", elemId, fldVal);
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;										
				
		case "Integer":
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event);");
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;
				
		case "Decimal":
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event,true);");
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;

		case "checkBox":
		case "Check":
						fldObj=CreateCheckbox(fieldElemTd, "", elemId, fldVal);
						if(fldVal)fldObj.checked=true;
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;	

		case "uniqueBox":
						var validationURL=zcServletPrefix+smartSuggURL;
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);	
						fldObj.setAttribute("onblur","callUniqueValidationAjax('"+validationURL+"',this,'"+fldData.dataColumn[0]+"');");
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;
				
		case "Multi":
		case "Combo":
						if(fieldType=="Multi"){fldname='virtual'+elemId;var multi=true;} else {fldname=elemId;var multi="";}
						if(nullableFld=="0")mandatoryFldElemQ.push(fldname);
						fldObj=CreateSelectBox(fieldElemTd, "inputFieldClass",fldname, fldVal,multi);	
						if(dropDwnData)
						{
							var dropDownElems=dropDwnData.split("~)"); 
							var optnObj;
							for(var dElem=0;dElem<dropDownElems.length;dElem++)
							{	
								val=dropDownElems[dElem].split('--');  
								optnObj=CreateOptionBox(fldObj, '', '', val[0], val[1]);
								
								if(fieldType=="Combo")
								{
									if(fldVal==val[0])optnObj.selected = true;
								}
								else
								{
									var vals=fldVal.split('~)');
									for(var k=0; k<vals.length;k++)
										if(vals[k]==val[0]){optnObj.selected = true;}
									
								}
							}
						}
						else
						{
							var url2Hit=zcServletPrefix+"/custom/JSON/smartSuggest/custom_pckLstValues.htm?enttName="+tblName+"&enttClmn="+colName;
							$.ajax(
							{
								type: "GET",
								url:url2Hit,
								dataType: "json",
								async:false,
								success: function (pckDoc)
								{   
									var column_value=pckDoc.PickListItems;
									var j=0;
									if(fieldType=="Combo")
									{
										fldObj[0]=new Option('<None>', '');
										j++;
									}
									if(column_value)
									{
										var lst=column_value.split('~)');
										for(var i=0; i<lst.length; i++,j++)
										{
											fldObj[j]=new Option(lst[i], lst[i]);
											if(fieldType=="Combo")
											{
												if(fldVal==lst[i]){fldObj[j].selected = true;}
											}
											else
											{
												var vals=fldVal.split('~)');
												for(var k=0; k<vals.length;k++)
												if(vals[k]==lst[i]){fldObj[j].selected = true;}
											}
										}
									}
								}
							});
						}
						if(fieldType=="Multi")
						{
							AddBlurEventListener(fldObj, function(){getAllSelected(fldname,formName)})
							CreateHIDDEN(fieldElemTd , "", elemId ,"");
						}
					break;	
				
		case "Date":
		case "dateOnly":
						fieldElemTd.innerHTML+="<table cellpadding='0' cellspacing='0'><tr><td><input type='hidden' id='"+elemId+"' value='"+fldVal+"' /><input id='"+elemId+"_date_value' class='inputFieldClass' onblur=\"changeDate('"+elemId+"_date_value');\" size=12 maxlength=12 style='width:80px' value='"+fldVal.replace(' 00:00:00','')+"'/></td><td><img src='/atCRM/images/calendar.gif' id='"+elemId+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td></tr></table>";
						new Calendar({
							  inputField: elemId+'_date_value',
							  dateFormat: "%d/%m/%Y", 
							  trigger: elemId+"_cal",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {
								 this.hide();
								 var obj=document.getElementById(elemId+'_date_value');
								 obj.focus();
								//document.forms[formName].elements[elemId+'_date_value'].focus(); 
							  }
						});							
						dateFldsQ.push(elemId);                          			
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;		
				
		case "dateAndTime":
		case "DateTime":
						fieldElemTd.innerHTML+="<table cellpadding='0' cellspacing='0'><tr><td><input type='hidden' id='"+elemId+"' value='"+fldVal+"' /><input id='"+elemId+"_date_value' class='inputFieldClass' onblur=\"changeDate('"+elemId+"_date_value');\" size=12 maxlength=12 style='width:80px' value='"+fldVal.slice(0,10)+"'/></td><td><img src='/atCRM/images/calendar.gif' id='"+elemId+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td><td><div class='combo' ><input id='"+elemId+"_time_value' class='inputFieldClass' size=10 maxlength=8 style='width:70px' value='"+fldVal.slice(11)+"'/><ul><li>12:00 AM</li><li>12:30 AM</li><li>01:00 AM</li><li>01:30 AM</li><li>02:00 AM</li><li>02:30 AM</li><li>03:00 AM</li><li>03:30 AM</li><li>04:00 AM</li><li>04:30 AM</li><li>05:00 AM</li><li>05:30 AM</li><li>06:00 AM</li><li>06:30 AM</li><li>07:00 AM</li><li>07:30 AM</li><li>08:00 AM</li><li>08:30 AM</li><li>09:00 AM</li><li>09:30 AM</li><li>10:00 AM</li><li>10:30 AM</li><li>11:00 AM</li><li>11:30 AM</li><li>12:00 PM</li><li>12:30 PM</li><li>01:00 PM</li><li>01:30 PM</li><li>02:00 PM</li><li>02:30 PM</li><li>03:00 PM</li><li>03:30 PM</li><li>04:00 PM</li><li>04:30 PM</li><li>05:00 PM</li><li>05:30 PM</li><li>06:00 PM</li><li>06:30 PM</li><li>07:00 PM</li><li>07:30 PM</li><li>08:00 PM</li><li>08:30 PM</li><li>09:00 PM</li><li>09:30 PM</li><li>10:00 PM</li><li>10:30 PM</li><li>11:00 PM</li><li>11:30 PM</li></ul></div></td></tr></table>";
						new TimeCombo(elemId+'_time_value','#FFFFFF','#FFFFFF');
						changeTime(elemId+'_time_value');
						fieldElemTd.style.fontFamily="Tahoma, Verdana";
						fieldElemTd.style.fontSize="12px";
						new Calendar({
							  inputField: elemId+'_date_value',
							  dateFormat: "%d/%m/%Y", 
							  trigger: elemId+"_cal",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {this.hide();
							  //document.getElementById(elemId+'_date_value').focus();
							  }
						});
						dateFldsQ.push(elemId);						
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
						break;		

		case "dropDown-terr":	
						fldObj=CreateSelectBox(fieldElemTd, "inputFieldClassDrop", elemId, fldVal);
						var dispVal="";
						//L_cmb_quick_add.style.width='100px';
						var terrUrl=zcServletPrefix+"/custom/JSON/system/territoriesInSession.htm";
						$.ajax(
						{
								type: "GET",
								url:terrUrl,
								dataType: "json",
								async:false,
								success: function (doc)
								{   
									var allTerrs = doc["allTerrs"];	
									if(!fldVal){
										var defaultTerr = doc["defaultTerr"];
										fldVal=defaultTerr;
									}
									var allTerrsLength =  allTerrs.length;												
									var isIE = document.all ? true : false;
									 
									for(i=0,j=0;i<allTerrsLength;i++,j++)
									{
										
										terrName = allTerrs[j]["territories"];
										terrId =  allTerrs[j]["terrId"];
										readOnly=  allTerrs[j]["readOnly"];
										
										if(fldVal==terrId)
										{	
											fldObj[i]=new Option(terrName, terrId);
											fldObj[i].selected = true;														
											dispVal=fldObj.options[i].text;
											L_valueArr = dispVal ;
											L_valueArr = L_valueArr.split(">");
											dispVal=L_valueArr[L_valueArr.length-1];	
										}
										else	
										{
											fldObj[i]=new Option(terrName, terrId);		
										  
										}
								 }
								}
						});
						if(dispVal == "")
						{
							 dispVal = "None";
							 for(f=0;f<fldObj.length;f++)
							 {
								 try
								 {
									 if(dispVal.toUpperCase()  == (fldObj.options[f].text).toUpperCase() )
									 {
										dispVal[f].selected = true;
										break;
									 }
								 }
								 catch (e)
								 {
									 continue;
								 }
							 }
						}
						makeComboSearchable(dispVal,false,elemId);										
						$(".inputFieldClassDrop").combobox();						
						if(nullableFld=="0")mandatoryFldElemQ.push('combo_'+elemId);								
					break;

		case "dropDown-state":
						var newDiv=CreateDIV(fieldElemTd,"",elemId+'_state')
						newDiv.innerHTML="";
						fldObj=CreateSelectBox(newDiv, "inputFieldClassDrop", elemId, fldVal);
						
						var dispValstate = "";
						fldObj.style.width='100px';
						var stateUrl=zcServletPrefix+"/custom/JSON/system/states.htm?id="+fldVal;	
						
						$.ajax(
								{
									type: "GET",
									url:stateUrl,
									dataType: "json",
									async:false,
									success: function (doc)
										{  
											var allStates = doc["allStates"];										
											var allStatesLength =  allStates.length;

											for(k=0,l=0;k<allStatesLength;k++,l++)
											{
												stateName = allStates[l]["State"];
												stateId =  allStates[l]["stateId"];

												if(fldVal==stateId)
												{		
													fldObj[k]=new Option(stateName, stateId);
													fldObj[k].selected = true;
													dispValstate=fldObj.options[k].text;

													L_valueArr = dispValstate;
													L_valueArr = L_valueArr.split(">");
													dispValstate=L_valueArr[L_valueArr.length-1];

												}
												else						
													fldObj[k]=new Option(stateName, stateId);
											}
										}

							   });
							if(dispValstate == "")
							{
								 dispValstate= "None";
								 for(m=0;m<fldObj.length;m++)
								 {
									try
									{
										if(dispValstate.toUpperCase()  == (fldObj.options[m].text).toUpperCase() )
										 {
											dispValstate[m].selected = true;
											break;
										 }	
									}
									catch (e)
									{
										continue;
									}
								 }
							}										
							makeComboSearchable(dispValstate,'',elemId);	
							$(".inputFieldClassDrop").combobox();								
							if(nullableFld=="0")mandatoryFldElemQ.push('combo_'+elemId);								
						break;

		case "multiSelect":
							maxMultiCnt=objEvent;
							var smartSuggestURL=zcServletPrefix+smartSuggURL;			
							window["array_" + ReplaceAll(elemId,"-","_")] = new Array();
							if(fldData.dataColumn[13])
							var fun2callonFill=fldData.dataColumn[13];
							else		
							var fun2callonFill="";

							fieldElemTd.innerHTML+="<table style='width:98%' cellpadding=0 cellspacing=0><tr><td><input type='hidden'  name='"+elemId.replace("-multi","")+"' id='"+elemId.replace("-multi","")+"'><input type='hidden'  name='"+elemId+"' id='"+elemId+"'><input type='hidden' name='"+elemId+"-max' id='"+elemId+"-max' value='"+maxMultiCnt+"'><input type='hidden' name='"+elemId+"-fun' id='"+elemId+"-fun' value='"+fun2callonFill+"'><input type='text' name='"+elemId+"txt' id='"+elemId+"txt' class='ui-corner-all multiSelectTxt' onkeyup=\"callAjax('multiSelectSugg',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeMultiTxt(this);' onblur='changeMultiTxt(this);' value='2 chars or **'></td></tr><tr><td><div class='multiSelectBox' name='"+elemId+"-multiSelDiv' id='"+elemId+"-multiSelDiv'></div></td></tr></table>";

							var listData=objEventFun.split('~)');
							for(var i=0;i<listData.length;i++)
							{
								val=listData[i].split('--')[0];
								label=listData[i].split('--')[1];
								fillMultiSelect(val,label,elemId);
							}			
							if(nullableFld=="0")mandatoryFldElemQ.push(elemId+"txt");
						break;
		case "smartSuggest":
						var smartSuggestURL=zcServletPrefix+smartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var pckListId=getParameterValue (smartSuggestURL,'pckListId');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;

						var fldvalId=fldVal.split('--')[0];
						var fldvalTxt=fldVal.split('--')[1];
						labelClass="inputFieldClass";
						fldVal="2 chars or **";
						if(!fldvalId)labelClass="inputGrayTextClass";else fldVal=fldvalTxt;			
						if(pckListId)
		                { 
							fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldvalId+"'><input type='text'  name='"+elemId+"txt' id='"+elemId+"txt'  value='"+fldVal+"' onkeypress=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','"+elemId+"txt','','0','"+mnuItmId+"-form');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";
						}
						else
						{
							fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldvalId+"'><input type='text'  name='"+elemId+"txt' id='"+elemId+"txt'  value='"+fldVal+"' onkeypress=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListName+"','"+elemId+"txt','','0','"+mnuItmId+"-form');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";	
						}
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId+"txt");
					break;		
				
		case "smartFill":
						var smartSuggestURL=zcServletPrefix+smartSuggURL
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;		
						labelClass="inputFieldClass";
						if(fldVal==""||fldVal=="--")
						{
							labelClass="inputGrayTextClass";
							fldVal="2 chars or **";					
						}
						else
						{
							var fldvalId=fldVal.split('--')[0];
							var fldVal=fldVal.split('--')[1];
						}
						fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+tblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"hdn' id='"+elemId+"hdn' value='"+fldvalId+"'><input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeypress=\"callAjax('smartFill',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"unblockObjectRelatedFields('"+elemId+"','"+tblName+"','"+formName+"');\"><img id='"+elemId+"_unlock' style=\"cursor:pointer;margin-left:4px;visibility:hidden;\" src='/atCRM/images/unlock.jpeg' title='Unlock fields'></a>";
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);

						var relCols="";
						var relPk="";
						for(var tblClm=0; tblClm<fieldItemsQ.length; tblClm++)
						{
							var relfieldType=fieldItemsQ[tblClm].dataColumn[2];
							var relTblName=fieldItemsQ[tblClm].dataColumn[9];
							var relColName=fieldItemsQ[tblClm].dataColumn[10];
							
							if(relTblName==tblName)
							if(relfieldType!="hiddenField" &&  relfieldType!="PrimaryKey")
							{
								if(relCols)relCols+=","+relColName;else relCols+=relColName;
							}
							else if (relfieldType=="PrimaryKey")
								relPk=relColName
						}
						fieldElemTd.innerHTML+="<input type='hidden' name='"+elemId+"fillColumns' id='"+elemId+"fillColumns' value='"+relCols+"'><input type='hidden' name='"+elemId+"fillPk' id='"+elemId+"fillPk' value='"+relPk+"'>";

					break;	

		case "pickList":
						var smartSuggestURL=zcServletPrefix+smartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');						
						var pckListId=getParameterValue (smartSuggestURL,'pckListId');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;

						labelClass="inputFieldClass";
						if(!fldVal)
						{
							fldVal="2 chars or **";
							labelClass="inputGrayTextClass";
						}
						
						if(pckListId) 
						{
							fieldElemTd.innerHTML+="<input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeypress=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','"+elemId+"','','0','"+mnuItmId+"-form');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";	
						}
						else
						{
							fieldElemTd.innerHTML+="<input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeypress=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListName+"','"+elemId+"','','0','"+mnuItmId+"-form');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";															
						}
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;
					
		case "multiLevelPickList":
						var smartSuggestURL=zcServletPrefix+smartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;
													
						fieldElemTd.innerHTML+="<span  name='"+elemId+"anc' id='"+elemId+"anc' class='ItemLabel' style='text-decoration:underline;cursor:pointer' onclick=\"populateMultiLvlPicklist('"+tblName4Pkclist+"','"+pckListName+"','"+elemId+"','"+mnuItmId+"-form');\">Select</span><input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"'";
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;
					
		case "password":
						fldObj=CreatePASSWORD(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);														
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
					break;	
	  

		default:
						if(fieldType!='None' && fieldType!='none')
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);														
						if(nullableFld=="0")mandatoryFldElemQ.push(elemId);
						break;		
	}

	//Call functions on field events
	if(objEventFun&&objEvent)
	{
		var event=objEvent.split('~)');
		var objFun=objEventFun.split('~)');
		for(var i=0; i<event.length; i++)
		{
			var objFunc=objFun[i];
			var q=objFunc.indexOf('('); 
			var params="";
			if(q>0)
			{
				objFunc=objFunc.substring(0,q); 
				params=objFun[i].substring(q+1,(objFun[i].length)-1); 
			}

			switch(event[i])
			{
				case "onclick":		
								AddClickEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onblur":		
								AddBlurEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onfocus":		
								AddFocusEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onkeyup":		
								AddKeyUpEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onkeypress":	
								AddOnKeyPressEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onkeydown":	
								AddKeyDownEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onmouseover":	
								AddOnMouseOverEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onmouseout":	
								AddOnMouseOutEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
				case "onchange":
								AddChangeEventListener(fldObj,(function(objFunc,fldObj,params){return function(){dispatch(objFunc,[formName,fldObj,params]);};})(objFunc,fldObj,params));
								break;
			}
		}
	}
}


function updateQAData(funOnsubmit,eml_obj,ssElem)
{
	var quickAddForm=document.getElementById("quickAdd-form");
	formName="quickAdd-form";
	//for date flds	

	if(dateFldsQ)
	{
		for(var x=0; x<dateFldsQ.length; x++)
		{
			var mandateDtElem=false;
			var elemId=dateFldsQ[x];
			var date_value = "";
			var time_value = "";
			if(document.getElementById(elemId+"_date_value"))
			date_value = document.getElementById(elemId+"_date_value").value;
			if(document.getElementById(elemId+"_time_value"))
			var time_value = document.getElementById(elemId+"_time_value").value;
			if(date_value&&time_value)
			{
				if(time_value != "")
				{
						var ap = time_value.split(' ')[1];
						var hour = (time_value.split(' ')[0]).split(':')[0];
						var minute = (time_value.split(' ')[0]).split(':')[1];
						var second = "00";
						if(ap == "AM")
							{if (hour == 12)hour = "00";}
						else
							{hour=parseFloat(hour);if(hour < 12){hour = hour+12;};}
						time_value = hour +':' +minute +':' +second;
						document.getElementById(elemId).value = date_value +" "+ time_value;
				}
			}
			else if(date_value&&time_value == "")
			{
				if(document.getElementById(elemId+"_time_value")){
					for(var i=0;i<mandatoryFldsQ.length;i++){
						if(mandatoryFldsQ[i]==elemId)
							mandateDtElem=true;
					}
					if(mandateDtElem)
						document.getElementById(elemId+"_time_value").value = "";
					else
						document.getElementById(elemId).value = date_value +" "+"00:00:00";
				}
				else if(date_value&&!time_value)
				document.getElementById(elemId).value = date_value +" "+"00:00:00";
			}
			else
			{
				document.getElementById(elemId).value ="";
				document.getElementById(elemId+"_date_value").value ="";			
				if(document.getElementById(elemId+"_time_value"))
				document.getElementById(elemId+"_time_value").value ="";		
			}		
		}
	}
		if(validateFormFlds(formName,funOnsubmit))
		{
			submitQAForm(eml_obj,ssElem);
		}	
}

function submitQAForm(eml_obj,ssElem)
{
	var quickAddForm=document.getElementById("quickAdd-form");

	document.getElementById('errorDivQuickAdd').style.display="none";

	for(var x=0; x<fieldItemsQ.length; x++)
	{
		var elemId=fieldItemsQ[x].dataColumn[1];		
		var columnName=fieldItemsQ[x].dataColumn[10];	
		var strColumnName=fieldItemsQ[x].dataColumn[11];
		var L_strColName = "";
		 if(columnName)
		{
			 if(columnName.indexOf("udef_fkey")!=-1 && strColumnName)
			{				 
				if(document.getElementById(elemId) && document.getElementById(elemId).value && document.getElementById(elemId+"txt") && document.getElementById(elemId+"txt").value &&  document.getElementById(elemId+"txt").value!="2 chars or **")
				{					
						var L_strColName= document.getElementsByName(strColumnName);	
						var pElemId=elemId.substring(0,elemId.lastIndexOf("-"))
						for(var z=0;z<L_strColName.length;z++)
						{
							var cstrCol=L_strColName[z].id;
							if(cstrCol.search(pElemId)>=0)
							{
								var idOfStrCol=L_strColName[z].id;	
								document.getElementById(idOfStrCol).value= document.getElementById(elemId+"txt").value;
							}
						}
						
				}
				else{			
						var L_strColName= document.getElementsByName(strColumnName);	
						var pElemId=elemId.substring(0,elemId.lastIndexOf("-"))	
						for(var z=0;z<L_strColName.length;z++)
						{
							var cstrCol=L_strColName[z].id;
							if(cstrCol.search(pElemId)>=0)
							{
								var idOfStrCol=L_strColName[z].id;
								document.getElementById(idOfStrCol).value='';
							}
						}				
				}
			}
		}
	}	

	var flds2Submit="";
	var formFlds=quickAddForm.elements;

	for(var i=0; i<formFlds.length;i++)
	{
		var fldValue=formFlds[i].value;
		if(formFlds[i].type=='checkbox'&&formFlds[i].checked==false)fldValue="";
		if(fldValue=='2 chars or **')fldValue="";
		var frmFldId=formFlds[i].id;
		if(frmFldId.substr(0,3)=="QA_")frmFldId=frmFldId.substr(3,frmFldId.length);
		else frmFldId=formFlds[i].id;
		if(flds2Submit)flds2Submit=flds2Submit+"&"+frmFldId+"="+escape(fldValue);
		else flds2Submit=frmFldId+"="+escape(fldValue);
	}
	$.ajax({
	type: "POST",
	url: formActionQ,
	data:flds2Submit,
	success: function (data)
	{  
		if(data){
			try{
					doc = JSON.parse(data);
					document.getElementById(ssElem).value=doc.addedTxt;
					var L_field_id  =  ssElem;
					if(L_field_id.search('txt')<0)
					{	
						L_field_id = document.getElementById(L_field_id+'hdn');
						L_field_id.value=doc.addedId;
						if(document.getElementById('pageType').value &&document.getElementById('pageType').value =='invoiceWizard')
						{
							blockMappedObjectFields4Wizard(ssElem,ssElem+'hdn');
						}
						else
						{
							blockObjectRelatedFields(ssElem,ssElem+'hdn');
							blockMappedObjectFields(ssElem,ssElem+'hdn');
						}
					}
					else
					{
						L_field_id = document.getElementById(L_field_id.replace('txt',''));
						L_field_id.value=doc.addedId;
						smartAddView(L_field_id,'view');
					}
				}catch(e){}
			}
		if(document.getElementById("QA_0-1-65")&&document.getElementById("QA_0-1-65").value!="") var disposition = $("#QA_0-1-65").find(":selected").text();
		else var disposition = "No disposition";
        if(document.getElementById("QA_0-1-4")&&document.getElementById("QA_0-1-4").value!="") var comments = document.getElementById("QA_0-1-4").value;
		else var comments = "No comments";
		//document.getElementById("QA_0-1-65").value;
		//$(QickAddContainerDiv).dialog('close');
		windowData.close();
		if(windowContView) windowContView.close();
		viewReloadForQuickAdd();
		/*******If activity save from callCenter process hit disposition url********/
		var callJSONObj;
		var callJSONStr;
		if(document.getElementById("hidd_call_JSON")){
			callJSONObj = document.getElementById("hidd_call_JSON").value;
			callJSONStr = parent.callJSON;
		}
		if(callJSONObj){
		var phNum=callJSONStr["phNum"];var ucid=callJSONStr["ucid"];var did=callJSONStr["did"];
		var callerID=callJSONStr["callerID"];var skillName=callJSONStr["skillName"];var agentID=callJSONStr["agentID"];
		var campaignId=callJSONStr["campaignId"];var monitorUcid=callJSONStr["monitorUcid"];var type=callJSONStr["type"];
		var uui=callJSONStr["uui"];var customer=callJSONStr["customer"];
		$("#hidd_call_JSON").remove();
		var url2Hit="http://cloudagent.in/OCCDV2/dispositionapi.html?action=set&disposition="+disposition+"&ucid="+ucid+"&did="+did+"&comments="+comments+"&customer="+customer+"&agentID="+agentID+"&apiKey=KK0cffeaeccf91b3c9daa05c5e90a9bf95&responseType=json";
			$.ajax({
			type: "POST",
			url: url2Hit,
			dataType: "jsonp",
			crossDomain:true,
			success: function (data)
			{
			},
			error: function(jqXHR, textStatus, errorThrown)
				{
				  console.log(jqXHR, textStatus, errorThrown);
				}
			});
	    }
		/*******Call disposition process ends here********/
		/*try{
			var IframeElem = document.getElementById('htmlIframe');
			var innerDoc = IframeElem.contentDocument || IframeElem.contentWindow.document;
			var CalendarElem = innerDoc.getElementById('calendar');
			//$('#calendar').fullCalendar('refetchEvents');
			//$(CalendarElem).fullCalendar('refetchEvents');
			//$('#calendar').fullCalendar('refetchEvents');
			//$('#calendar').fullCalendar('rerenderEvents');
				//$('#calendar').fullCalendar('removeEvents');
				//$('#calendar').fullCalendar('rerenderEvents');
			//$(CalendarElem).fullCalendar('rerenderEvents');
		}
		catch(e){}*/
	}
	});	
	if(eml_obj)
	{
		emailClientRefresh = 1;
		eml_obj.style.display = "none";	
	}
}