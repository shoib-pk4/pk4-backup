function getUTC(dateTime,offset) {
    d = new Date(dateTime);
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000*offset));
    return nd.toLocaleString();
}

function getValues(variableName,varHistoryData) {
	for(i=0;i<varHistoryData.length;i++) {
		varDataArray = varHistoryData[i].split("=");
		L_label = varDataArray[0];
		L_data  = varDataArray[1];
		if(L_label == variableName)
		{
			return L_data;
			break;
		}
	}
}

function hideSmartSuggests() {
	$("#smartSuggestDiv").hide();
	$("#multiSelectSugg").hide();
	$("#smartFill").hide();
	$("#mappedSmartFill").hide();
	$("#smartSuggestFill").hide();
	$("#mappedSmartFillWiz").hide();
	$("#autosuggestUsers").hide();
}

function pageload(hash) {
	hideSmartSuggests();
	if(hash) {
		var L_hashArr = hash.split("?");
		var L_historyGrp  = L_hashArr[0];
		var L_historyData = L_hashArr[1].split("&");
		if(L_historyGrp == "mainMenu") {
			if(flg_firstLoad) {  
				L_menuId = getValues("menuId",L_historyData);
				var JSONURL=zcServletPrefix + "/banner.html";
				$.getJSON(JSONURL,'',function(json){
					setupMainMenuUrlHistory(json,hash);  
				});
				flg_firstLoad=false;
			} else {
				L_menuId = getValues("menuId",L_historyData);
				checkMenuOrder(L_menuId);
			}  
		} else if(L_historyGrp == "thirdLevelMenu") {
			L_mnuId =  getValues("mnuId",L_historyData);
			L_uri =  getValues("uri",L_historyData);
			L_fromMnu =  getValues("drop",L_historyData);
			L_dropIndex =  getValues("dropIndex",L_historyData);
		
			if(flg_firstLoad) {
				var JSONURL=zcServletPrefix + "/banner.html";
				$.getJSON(JSONURL,'',function(json){setupMainMenuUrlHistory(json,hash);});
				flg_firstLoad=false;
			} else {
				L_url =  getValues("uri",L_historyData);
				L_mnuId_para = L_mnuId.split("_");
				L_mnuId_para  = L_mnuId_para[1];
				$.ajax
				({
					type: "GET",
					contentType: "application/x-www-form-urlencoded",
					url: zcServletPrefix + "/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
					dataType: "json",
					sync:true,
					success: function(data) {
						L_data=eval(data);
						L_id = L_data.mnuItmIdname[0].id;
						showMainMenuHistory("mnuList_"+L_id,true);	
					}
				 });
			
				L_uri = L_uri.replace(/~/g,"?");
				L_uri = L_uri.replace(/@/g,"&");
				L_uri = L_uri.replace(/\*/g,"=");
				L_fromMnu =  getValues("drop",L_historyData);
				L_dropIndex =  getValues("dropIndex",L_historyData);
				L_Reload =  getValues("reload",L_historyData);
				showSubMenu(L_mnuId,L_uri,L_fromMnu,L_dropIndex,L_Reload) ;
			}
		}
		else if(L_historyGrp == "subMenu" )
		{   
			L_mnuId =  getValues("mnuId",L_historyData);
			L_Reload =  getValues("reload",L_historyData);
			if(flg_firstLoad)
			{
				var JSONURL=zcServletPrefix + "/banner.html";
				$.getJSON(JSONURL,'',function(json){setupMainMenuUrlHistory(json,hash);});
				flg_firstLoad=false;
			}
			else
			{
				L_url	=  getValues("url",L_historyData);
				if((L_url.indexOf('Contact.htm')>0)||(L_url.indexOf('Account.htm')>0)||(L_url.indexOf('Opportunity.htm')>0))
				{
					getAddDataFrmCache(L_url);
					return false;
				}
				else
				{
					L_mnuId_para = L_mnuId.split("_");
					L_mnuId_para  = L_mnuId_para[1];
					$.ajax
					({
						type: "GET",
						contentType: "application/x-www-form-urlencoded",
						url: zcServletPrefix + "/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
						dataType: "json",
						sync:true,
						success: function(data)
						{
							L_data=eval(data);
							L_id = L_data.mnuItmIdname[0].id;
							showMainMenuHistory("mnuList_"+L_id,true);	
						}
					 });
					 showSubMenu(L_mnuId,'','','',L_Reload) ;
				 }
			}
		}
		else if(L_historyGrp == "setUpPageParameters")
		{
			if(flg_firstLoad)
			{
				var JSONURL=zcServletPrefix + "/banner.html";
				$.getJSON(JSONURL,'',function(json){setupMainMenuUrlHistory(json,hash);});
				flg_firstLoad=false;
			}
			else
			{
				L_mnuId =  getValues("shownSubMenu",L_historyData);
				L_url	=  getValues("url",L_historyData);

				if (L_mnuId != "null" )
				{
					L_mnuId_para = L_mnuId.split("_");
					L_mnuId_para  = L_mnuId_para[1];
					$.ajax
					({
						type: "GET",
						contentType: "application/x-www-form-urlencoded",
						url: zcServletPrefix+"/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
						dataType: "json",
						sync:true,
						success: function(data)
						{
							L_data=eval(data);
							L_id = L_data.mnuItmIdname[0].id;
							
							showMainMenuHistory("mnuList_"+L_id,true);	
						 }
					 });
					showViewEdit(L_mnuId) 
					viewUrl = getValues("viewUrl",L_historyData);
					viewUrl = viewUrl.replace(/~/g,"?");
					viewUrl = viewUrl.replace(/@/g,"&");
					viewUrl = viewUrl.replace(/\*/g,"=");
					L_entityDiv = getValues("entityDiv",L_historyData);
					setUpPageParameters(viewUrl,L_entityDiv)
				}
				else
				{
					viewUrl = getValues("viewUrl",L_historyData);
					viewUrl = viewUrl.replace(/~/g,"?");
					viewUrl = viewUrl.replace(/@/g,"&");
					viewUrl = viewUrl.replace(/\*/g,"=");
					setUpPageParameters(viewUrl)
				}
			}			
		}
	}
	else
	{
		if(flg_firstLoad)
		{   
			reloadPage();
		}
	}
	if(flg_pageLoad)
	{
		showNotification();
	}
}


function showNotification() {
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: zcServletPrefix + "/notificationMsgs.htm",
		dataType: "json",
		success: function (data) {
			//alert(data.notificationTitle);
		}	
	});
}

function reloadPage()
{
	var JSONURL=zcServletPrefix + "/banner.html";
	$.getJSON(JSONURL,'',function(json){setupMainMenuUrl(json);});
}

function initialize()
{  
	var isBrowser = navigator.appVersion;
	if (isBrowser.indexOf('MSIE') == -1) {
		document.getElementById("pageContent").style.display="block";
	}
	checkForExpiryDate();
	var imgWidth = $("#orgLogo").width();
	var imgheight = $("#orgLogo").height();
	if(imgWidth>180)document.getElementById('orgLogo').style.width="180px";
	if(imgheight>45)document.getElementById('orgLogo').style.height="47px";

	mLeft=(document.documentElement.clientWidth-100)/2;
	document.getElementById('loadingDiv').style.left=mLeft+"px";
	mLeft=(document.documentElement.clientWidth-450)/2;
	document.getElementById('commonErrorDiv').style.left=mLeft+"px";
	detailDataTdWidth=window.document.body.clientWidth-100;

	// try { 
	// 	jQuery.history.init(pageload);
	// 	jQuery("a[@rel='history']").click(function()
	// 	{
	// 		// 
	// 		var hash = this.href;
	// 		hash = hash.replace(/^.*#/, '');
	// 		$j.history.load(hash);
	// 	});		
	// }
	// catch (e) {
	
	// }

	pageload();
  
   /* loadScripts();              //Load the js files, By  Dony*/
   $.ajax({
	   type: "GET",
	   contentType: "application/x-www-form-urlencoded",
	   url: zcServletPrefix + "/custom/JSON/admin/getFlagsData.htm",
	   dataType: "json",
	   success : function(data) {
		 flagsJSON = data["flag_data"];
	     var flagData = data["flag_data"];
		 /********Get orgflags data*********/
		 var orgFlgData = flagData[0]["org_flags"];
	     for(var i=0;i<orgFlgData.length;i++) {
		   var orgflgName  = orgFlgData[i]["name"];
		   var orgflgValue = orgFlgData[i]["flag_value"];
		 }
		 document.getElementById("input_layout").value = "false";
	   }
	 });

/*
$.ajax ({
	type: "GET",
	url: zcServletPrefix + "/custom/ki1/enttDet.html",
	success: function(data) {
		parent.g_curr_obj = JSON.parse(data);
	},
	error: function(err) {
		alert ("Error in Entity Detail Data: ", err);
	}
 });
*/

	  /*****Set load img position******/
	  var divObj = document.getElementById("detailDataDiv");
	  var position=$(divObj).offset();
	  var topPos=position.top;
	  var mainWidth=$(window).width();
	  //var mainHeight=divObj.offsetHeight;
	  var mainHeight=$(window).height();
	  var reqWidth = parseInt(mainWidth)/2;reqWidth +=10;
      var reqHt  = parseInt(mainHeight)/2;
	  $("#loader_Img").offset({top:reqHt,left:reqWidth});
      currentRecIdsJSON =JSON.parse('{"acct_id":"","cont_id":"'+usrCont+'","state_id":"","brch_id":"","prod_id":"","prod_qty":"","rep_id":""}');
} 

function setUpPageParameters(uri,objId,fromMnu,subItmId,reloadFlag,listPopup,dropIndex,isCancel,recId) {
	L_frm_lz=false;
	try{
		L_frm_value=window.location.hash;
		if(L_frm_value.indexOf('LZValue')>0){
			L_frm_lz= true;
		}
	}
	catch(e){
		L_frm_lz = false;
	}

    if(recId !="undefined"&& recId &&(isCancel==true)) //&&(uri.indexOf('/add/Opportunity.htm')>0)
	{
	  uri=uri+"?id="+recId;
	}
	if(L_frm_lz == false){ 
	 var param=uri.substr(uri.indexOf("?"),uri.indexOf("="));
		if(((G_from_layout!=true)&&((uri.indexOf('/add/Contact.htm')>0)||(uri.indexOf('/add/Account.htm')>0)||(uri.indexOf('/add/Opportunity.htm')>0))&&(param.length<1)&&(isCancel!=true)&&(uri.indexOf('?Account_Id')<0)&&(uri.indexOf('?Contact_id')<0)&&(uri.indexOf('?Opportunity_Id')<0)))
		{
			return;
		}
	}
	// $("#commonPopupDiv").dialog("close");
	hideSmartSuggests();
	if(subItmId){subMnuItmId=subItmId;}
	if(fromMnu){dropMnuIndex=dropIndex;}

	if(document.getElementById('htmlIframe'))
	document.getElementById('htmlIframe').src="";
	
	dataDiv=document.getElementById('detailDataDiv');

	/*  Change by Kishore to deal with .htm files  */
	if (uri.indexOf('.html') > 0) {
		htmlIndex = -1;
	} else if (uri.indexOf('.htm') > 0) { 
		uriArray = uri.split('.htm');
		htmlIndex = uri.indexOf('.htm');
	} else if (uri.indexOf('.json') > 0) {
		uriArray = uri.split('.json');
		htmlIndex = uri.indexOf('.json');
	}
	openLoadingDiv();

	var isFunction=uri.indexOf('ret_fun:'); 
	hideFullContent();
	if(isFunction>0)
	{
	    if($("#dyna_html").html() !="") $("#dyna_html").html("");
		var fun2Call=uri.substring(isFunction+8); 
		if(document.getElementById('htmlIframe'))document.getElementById('htmlIframe').style.display="none";
		if(document.getElementById(entityDiv))document.getElementById(entityDiv).style.display="none";
		dispatch(fun2Call);
		closeLoadingDiv();
	}
	else if(htmlIndex > 0)
	{ 
	    if($("#dyna_html").html() !="") $("#dyna_html").html("");
		//hideLeftPannel(false);
		retrieveJSONdata(uri,objId,fromMnu,true,reloadFlag,listPopup);
	}
	else
	{
	   if($("#dyna_html").html() !="") $("#dyna_html").html("");
		//hideLeftPannel(true);
		showHtmlIframe(uri,objId);
	}
	if(uri.indexOf('invoices_wizard.htm')>0)
	{
		hideLeftPannel(true);
		document.getElementById('detailDataTd').style.width = '100%';
	}

	/*if (flg_firstLoad && timeZoneOffset != timeDiffInMin)
	{
		timeZoneDiff(timeZoneOffset,timeDiffInMin);
	}*/
}

function showHtmlIframe(uri,objId)
{
	if(document.getElementById(entityDiv))
	{
		document.getElementById(entityDiv).style.display="none";
	}
	var htmlFile;
	if(uri.indexOf("?") != -1)
	{
		var fileUri=uri.split("?");
        var splitUri=fileUri[0].split("/");
		var uriSplitLastIndex=parseInt(splitUri.length)-1;
		htmlFile=splitUri[uriSplitLastIndex];
	}
	else{
		var splitUri=uri.split("/");
		var uriSplitLastIndex=parseInt(splitUri.length)-1;
		htmlFile=splitUri[uriSplitLastIndex];
	}
	if(htmlFile.indexOf("runReportJ1.html") != -1 || htmlFile.indexOf("editReport.html") != -1)//|| htmlFile.indexOf("changePageLayout.html") != -1
	{ 
        // prompt("runReport---",$("#dyna_html").html());
		// if($("#dyna_html").html() !="") {alert("Not empty");$("#dyna_html").html("");}
		 var $div = $("#dyna_html");
		 var $parent = $div.parent();
		/* var position=$div.offset();
		 var topPos=position.top;
		 var windowHeight=$(window).height();
		 var height=(parseInt(windowHeight)-parseInt(topPos))+"px";
		 $($div).css({"overflow-y":"scroll","height":height});*/
		 $div.detach();
         $div.load(uri);
         $parent.append($div);
	}
	else{
		if(document.getElementById('htmlIframe'))
		{  
		    if($("#dyna_html").html() !="") $("#dyna_html").html("");
			//prompt("If-InnerHTML-",$("#dyna_html").html());
			//document.getElementById("dyna_html").innerHTML="";
			document.getElementById('htmlIframe').src=uri;
			document.getElementById('htmlIframe').style.display='block';
		}
		else
		{   
		  // prompt("Else-InnerHTML-",$("#dyna_html").html());
		   if($("#dyna_html").html() !="") $("#dyna_html").html("");
		   //document.getElementById("dyna_html").innerHTML="";
			htmlIframe=document.createElement("iframe");
			htmlIframe.align="left";
			htmlIframe.width="100%";
			htmlIframe.border="0";
			htmlIframe.frameBorder="0";
			htmlIframe.scrollBars="no";	
			htmlIframe.id="htmlIframe";
			dataDiv.appendChild(htmlIframe);
			htmlIframe.src=uri;
			var screenWidth = getScreenSize('width');
			htmlIframe.width=(screenWidth-10)+"px";
			var screenHeight = getScreenSize('height');
			var xyCoordinates = findPos('lastDivOnPage')[1];
			var bannerHeight = findPos('commonFnDiv')[1]+10;
			htmlIframe.height = screenHeight-((screenHeight*13)/100)+"px";
			 
		}
	}
    //$("#dyna_html") .load(uri);  
	closeLoadingDiv();
}

/* Start: Get Page Size */
function getScreenSize(width_or_height){
	var myWidth;
	var myHeight;
	if( typeof( window.innerWidth ) == 'number' ) { 	//Non-IE 
		myWidth = window.innerWidth;
		myHeight = window.innerHeight; 
	}else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {	//IE 6+ in 'standards compliant mode' 
		myWidth = document.documentElement.clientWidth; 
		myHeight = document.documentElement.clientHeight; 
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { 	//IE 4 compatible 
		myWidth = document.body.clientWidth; 
		myHeight = document.body.clientHeight; 
	} 
	if(width_or_height=='height'){
		return myHeight;
	}else if(width_or_height=='width'){
		return myWidth;
	}
}
/* End: Get Page Size */

function openLoadingDiv()
{  
	document.getElementById('loadingDiv').style.display="block";
	document.getElementById('loadingDiv').innerHTML="Loading...";
	milisec=0;
	seconds=10; 
	document.getElementById('stillWorking').value="10.0"
	stillLoading();
	/*$('#loadingDiv').dialog('open');
	$('#loadingDiv').dialog({
		autoOpen:true,
		modal: false,
		width: 230,
		height:170,
		closeOnEscape:false
	});*/

}

function stillLoading()
{
	if(document.getElementById('loadingDiv').style.display=="block")
	{
		if(document.getElementById('stillWorking').value=="0.0")
		{
			document.getElementById('loadingDiv').innerHTML="Still working...";
			return;
		}
		if (milisec<=0){ 
			milisec=9 
			seconds-=1 
		} 
		milisec-=1 
		document.getElementById('stillWorking').value=seconds+"."+milisec 
		setTimeout("stillLoading()",100) 
	}
	else
		return;
}

function closeLoadingDiv()
{
	document.getElementById('loadingDiv').innerHTML="Loading...";
	document.getElementById('loadingDiv').style.display="none";
	$("#pageLoad").hide(); 
}

function errorInProcess(from_info) {
	closeLoadingDiv();
	document.getElementById('commonErrorDiv').style.display="block";
	hideErrorDiv(from_info);
	
}

function hideErrorDiv(from_info) {
	if (from_info) {
		document.getElementById('commonErrorDiv').innerHTML= from_info;
	} else {
		document.getElementById('commonErrorDiv').innerHTML="Oops! Something broke! Syslog has been written. We'll fix it ASAP.";
	}
	setTimeout(function() { document.getElementById('commonErrorDiv').style.display="none"; },5000);
}

function retrieveJSONdata(uri,objId,fromMnu,add2History,reloadFlag,listPopup)
{  
	//var parURI=uri.search("custom/JSON/system/getParentMnuItmId.htm");
	//if(parURI<0&&xhr_request)xhr_request.abort();
	if(reloadFlag=="true")reloadFlag=true;else if(reloadFlag=="false") reloadFlag=false; else  reloadFlag="neither";
	if(document.getElementById('htmlIframe'))
	document.getElementById('htmlIframe').style.display="none";
	if(document.getElementById(entityDiv))
	{
		document.getElementById(entityDiv).style.display="none";
	}
	if(uri.search("custom/JSON/list/linkList.htm")>=0)reloadFlag=true;
	//if(uri.search("custom/JSON/list/container.json")>=0)reloadFlag=true;
	//if(document.getElementById(subMnuItmId+"-lstTbl")&&fromMnu=='main'){console.log('common list');handleCommonList();}

	if(fromMnu)
	{
		mnuItmId=objId
		var addPage=uri.indexOf('/add/');
		var adHocList=uri.indexOf('/JSON/list/container');
		if(addPage>0)
		entityDiv='addEditDiv';
		else if(adHocList>0)
		entityDiv=subMnuItmId+'-adList';	
		else
		entityDiv=objId+'-DataDiv';
		
		var fromHTML=entityDiv.indexOf('.html');
		if(document.getElementById(entityDiv))
		{
			if(fromHTML < 0)
			{
				document.getElementById(entityDiv).style.display="block";
				if(document.getElementById(mnuItmId+'-pageTitle'))
				document.title=document.getElementById(objId+'-pageTitle').value +' - Impel';
				var hdnURL=document.getElementById(objId+'-URL').value;		

				if(hdnURL==uri&&reloadFlag!=true)
				{	
					closeLoadingDiv();
					return;
				}
				else //if same entity reloaded
				{	
					if(entityDiv!="addEditDiv")
					{
						try{
							var pagingAmt=document.getElementById(mnuItmId+'-pagAmt').value;
						}catch(e){}
						var quesIndex=uri.indexOf('?') != "-1" ? uri.indexOf('?'): uri.length; 
						var hdnquesInx=hdnURL.indexOf('?') != "-1" ? hdnURL.indexOf('?'): hdnURL.length; 
						var mainUrlPath=uri.substring(0,quesIndex); 
						var hdnUrlPath=hdnURL.substring(0,hdnquesInx); 
						if(mainUrlPath==hdnUrlPath)
						{
							var mainUrlParms=uri.substring(quesIndex+1,uri.length); 
							var currOrder=getParameterValue (hdnURL,'order__by__1');
							var currWidth=getParameterValue (hdnURL,'list__column__width');
							var currFilter=getParameterValue (hdnURL,'filterName');
							var pageNumber=getParameterValue (hdnURL,'page__number__1'); 

							if (!currFilter)currFilter="";
							if (!currOrder)currOrder="";
							//Parameters to remember: "Order by","Paging size","Column width","Filter",
							var mainUrlParms=changeParameterValue (mainUrlParms,'order__by__1',currOrder);
							if(pagingAmt)mainUrlParms=changeParameterValue (mainUrlParms,'page__size__1',pagingAmt);	
							if(currWidth)mainUrlParms=changeParameterValue (mainUrlParms,'list__column__width',currWidth);
							if(currFilter)mainUrlParms=changeParameterValue (mainUrlParms,'filterName',currFilter);	
							if(pageNumber)mainUrlParms=changeParameterValue (mainUrlParms,'page__number__1',pageNumber);	
							uri=mainUrlPath+"?"+mainUrlParms;
							if(hdnURL!=uri)
							{	
								if(pageNumber)mainUrlParms=deleteParameter (mainUrlParms,'page__number__1');
								uri=mainUrlPath+"?"+mainUrlParms;
							}
							if(fromMnu=="sub"&&reloadFlag=="neither")
							{
								uri=mainUrlPath+"?"+mainUrlParms;
							}
						}
						if(hdnURL==uri&&reloadFlag!=true)
						{	
							closeLoadingDiv();
							return;
						}
					}
				}
				document.getElementById(objId+'-URL').value=uri;
			}
		}
		else
		{
			var detailDataDiv=document.getElementById('detailDataDiv');
			CreateDIV(detailDataDiv,'',entityDiv);
			if(document.getElementById(objId+'-URL'))
				document.getElementById(objId+'-URL').value=uri;
			else
				CreateHIDDEN(document.getElementById('detailDataDiv'), '', objId+'-URL', uri);
		}
		
	}
	if(document.getElementById(entityDiv))
	{
		document.getElementById(entityDiv).style.display="block";
				
		var htmlIndex=entityDiv.indexOf('.html');
		if(htmlIndex > 0)
		{	
			mnuItmId=entityDiv.split("-DataDiv")[0];
		}
	}

    mainUrl=uri;
	xhr_request = $.ajax({
	type: "GET",
	contentType: "application/x-www-form-urlencoded",
	url: mainUrl,
	async:callAsync,
	success: function (data)
	{
		xhr_request="";
		var loginPage=data.indexOf("<title>Impel login page</title>");
		var errorPage=data.indexOf("<title>Something wrong!</title>");
		if(loginPage>0)
		{
			//Changes done by Govardhan: if-else condtn
			if("${homePage.orgDetails.OrgName_Id}" == "668")
			{				
				window.location.href=zcServletPrefix + "/index.html?u=2&fromUdm=custom/JSON/homePage.html";
			}
			else
			{
				window.location.href=zcServletPrefix + "/index.html?fromUdm=custom/JSON/homePage.html";
			}			
		}
		else if (errorPage>0)
		{
			errorInProcess();
			return;
		}
		else
		{
			data=ReplaceAll(data,"\t","");
			data=ReplaceAll(data,"\n"," ");
			data=ReplaceAll(data,"\r","");
			data=ReplaceAll(data,"\xa0"," ");
			
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
			if(document.getElementById(objId+'-pageTitle'))
			document.getElementById(objId+'-pageTitle').value=doc.PageCaption;
			else
			{
				CreateHIDDEN(document.getElementById('detailDataDiv'), '', objId+'-pageTitle', doc.PageCaption);
			}

			document.title=document.getElementById(objId+'-pageTitle').value +' - Impel';

			jsonPageType=doc.PageType;
			switch(jsonPageType)
			{
			case "List":
						if(listPopup==true)
							handleJsonList(doclst,'listPopUp',popUpWidth,popUpHeight,document.getElementById(mnuItmId+'-URL').value);
						else
							handleJsonList(doc,null,null,null,objId,add2History);
						break;
			case "adhocList":
							handleCommonList(doc);
						break;
			case "Add/Edit":
						if(document.getElementById('addEdit-URL'))
							document.getElementById('addEdit-URL').value=mainUrl;
						else
							CreateHIDDEN(document.getElementById('detailDataDiv'), '', 'addEdit-URL', mainUrl);
							handleAddEditJsonData(doc);
						break;
			case "360View":
						if(document.getElementById('360View-URL'))
							document.getElementById('360View-URL').value=mainUrl;
						else
							CreateHIDDEN(document.getElementById('detailDataDiv'), '', '360View-URL', mainUrl);
							handleJson360ViewData(doc,objId,add2History);
						break;
			case "linkList":
							bldLinkList(doc,objId,document.getElementById(mnuItmId+'-URL').value);				
						break;
			case "InvoiceWizardAddEdit":
							hideLeftPannel(true);
						if(document.getElementById('addEdit-URL'))
							document.getElementById('addEdit-URL').value=mainUrl;
						else
							CreateHIDDEN(document.getElementById('detailDataDiv'), '', 'addEdit-URL', mainUrl);
							handleInvoiceWizardAddEditJsonData(doc);
						break;
			case "Map":
						setUpMap(doc);
						break;
			case "listTemplate":
						hideLeftPannel(true);
						var tempType=doc.tempType;
						loadTemplatesForType(tempType);
						setTimeout("listTemplate('templateTd_0',\'"+tempType+"\')",1000); 			
						break;
			case "dTbl":
						hideLeftPannel(true);
						writeDTbl(dTblHdr, dTblData);
			case "htm":
						hideLeftPannel(true);
						var mainDataDiv = document.getElementById(entityDiv);
						$(mainDataDiv).html(doc.content);
			}
		}
	},
	error: function(request,status,errorThrown) 
	{
	}
	});		
	callAsync=true;
}

function findPos(objId) 
{
	var targetObj = document.getElementById(objId);
	var curleft = curtop = 0;
	if (targetObj.offsetParent) {
		do {
				curleft += targetObj.offsetLeft;
				curtop += targetObj.offsetTop;
			} while (targetObj = targetObj.offsetParent);
	}
	return [curleft,curtop];
}


function resizeContentDiv()
{
	//body.scroll='none'
	var targetObj = document.getElementById('detailDataDiv');
	var xyCoordinates = findPos('lastDivOnPage');
	targetObj.style.height = (isIE)?parseInt(xyCoordinates[1])-157:parseInt(xyCoordinates[1])-70;
	pageWidth = (window.document.body.clientWidth)-345;
	pageWidth1 = (screen.width)-30;
	//document.getElementById('headerMenuIts').style.width=pageWidth1+'px';
	//alert(window.innerWidth+" "+document.body.clientHeight/Width)
}


function checkForExpiryDate()
{  
	if(reDate('${homePage.getLicExpDate}')<reDate('${homePage.getTodaysDate}'))
	{
		alert('Your license has expired. Please contact your systems administrator or contact us at support@impelcrm.in');
		//Changes done by Govardhan: if-else condtn
		if("${homePage.orgDetails.OrgName_Id}" == "668")
		{				
			window.location.href=zcServletPrefix + "/index.html?u=2";
		}
		else
		{  
			window.location.href=zcServletPrefix + "/index.html";
		}		
	}
}

function reDate(dmy)
{
    var d=dmy.split(/\D+/);
    return new Date(d[2],d[1]-1,d[0]);
}

	document.getElementsByClassName = function(){
		if(document.hasChildNodes && arguments[0]){
			var data = new Array();
			for(a=0;a<document.getElementsByTagName("*").length;a++){
				if(document.getElementsByTagName("*")[a].className == arguments[0]){
				data.push(document.getElementsByTagName("*")[a]);
				}
			}
		return data;
		}
	}

function getAddDataFrmCache(url)
{
 //changes done by govardhan :- Purpose Single Sign On
 if(url.indexOf('/SSO/index.php') != "-1")
 {
	var quesIndex=url.lastIndexOf('?') != "-1" ? url.lastIndexOf('?'): url.length; 
	var url=url.substring(quesIndex+1,url.length); 
 } 
 if(url.indexOf('?')>0)
 {
	var urlArr = url.split("?");
	var urlLeft  = urlArr[0];
	var urlLeftArr = urlLeft.split("/");
	var urlLeftArrLen=urlLeftArr.length;
	var lastElem= urlLeftArr[urlLeftArrLen-1];
	var entityArr=lastElem.split(".");
	var entityName=entityArr[0];
	entityName=entityName.trim();
	G_EntityName=entityName;
  }
  else
  {
     var urlLeftArr = url.split("/");
	 var urlLeftArrLen=urlLeftArr.length;
	 var lastElem= urlLeftArr[urlLeftArrLen-1];
	 var entityArr=lastElem.split(".");
	 var entityName=entityArr[0];
	 entityName=entityName.trim();
	 G_EntityName=entityName;
  }
  if(entityName&&entityName=="Opportunity")
  {
     var EntityStageType=entityName+"Stage";
	 var ent=entityName.toLowerCase();
	 var entitystagetype=ent+"stage";
	 var str="stage";
  }
  else
  {
     var EntityStageType=entityName+"Type";
	 var entitystagetype=entityName.toLowerCase()+"type";
	 var str="type";
  }
  
     var Entity=entityName.toLowerCase();
	 var urlLower=url.toLowerCase();
	 var urlString = urlLower.indexOf('?'+entitystagetype+'_id');
	 var urlStringWithCont = urlLower.indexOf('?'+entityName.toLowerCase()+'_id');

	 var G_jResponse='G_jsonresponse_'+entityName;
     var Entitytype=entityName+str;
    var G_jResponse_type=G_jResponse+"."+Entitytype;
	if((type_based_layouts_supported_flag == 1 && urlString < 0) || (type_based_layouts_supported_flag == 1 && urlStringWithCont < 0 && urlString < 0 ))
	{
			document.getElementById("commonPopupDiv").innerHTML = "";
				$('#commonPopupDiv').dialog({
				autoOpen:true,
				modal: true,
				title:entityName+" "+str+'s',
				minHeight:340,
				minWidth:310,	
				width:399,
				height:340,
				closeOnEscape:true,
				beforeclose: function() {}
			});
			var convertDivContent = "<div width='100' id='accordion' class='actions ui-helper-clearfix' style='font-family:Tahoma,Verdana;padding-top:8px'>&nbsp;&nbsp;&nbsp;Please select the " + str + " of " + Entity + " that you want to add."
			var listLength =eval(G_jResponse_type).length; 
			var EntityStageTypeId=EntityStageType+"Id[1]";
			var EntityStageTypeName=EntityStageType+"Name";
			
			for(var i=0,j=0;i<listLength;i++,j++)
			{
			 var TypeOrStageName=eval(G_jResponse+"."+Entitytype+"["+j+"]."+EntityStageTypeId+"."+EntityStageTypeName);
			 var typeOrStageId=eval(G_jResponse+"."+Entitytype+"["+j+"]."+EntityStageType+"Id[0]");

			if (TypeOrStageName!=""){ convertDivContent += "<ul class='ui-multiselect'><li class='ui-helper-hidden-accessible' style='display:none;'></li><li class='typeBasedButton'><a href=\"javascript:sendResponseToHandleEntity('"+typeOrStageId+"','"+G_EntityName+"');\" style='display:block' >"+TypeOrStageName+"</a></li></ul>";}               
			}
			convertDivContent += "</div>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	}
	else
	{
		if(type_based_layouts_supported_flag == 0)
		{
			CreateHIDDEN(document.getElementById('detailDataDiv'), '', 'addEdit-URL', url);
			handleAddEditJsonData(eval(G_jResponse));
		}
		else
		{
			if(type_based_layouts_supported_flag == 1 && urlString > 0)
			{
				var id_str=url.substring(url.lastIndexOf("="),+url.lastIndexOf(""));
				var EntityTypeId=id_str.split("=")[1];
				sendResponseToHandleEntity(EntityTypeId,G_EntityName);
			}
		}
	}
	
}

function sendResponseToHandleEntity(id,entityName)
{
	if(document.getElementById(entityDiv))document.getElementById(entityDiv).style.display="none";
	if(entityName&&entityName=="Opportunity")
		  {
			 var EntityStageType=entityName+"Stage";
			 var ent=entityName.toLowerCase();
			 var entitystagetype=ent+"stage";
			 var str="stage";
		  }
		  else
		  {
			 var EntityStageType=entityName+"Type";
			 var entitystagetype=entityName.toLowerCase()+"type";
			 var str="type";
		  }

	 var G_jResponse='G_jsonresponse_'+entityName;               //Ex. G_jsonresponse_Contact
	 var Entitytype=entityName+str;                              //Ex. Contacttype or Opportunitystage
	 var G_jResponse_type=G_jResponse+"."+Entitytype;

	var listLength = eval(G_jResponse_type).length; 
	for(var i=0,j=0;i<listLength;i++,j++)
	{
		var typeStageId = eval(G_jResponse+"."+Entitytype+"["+j+"]."+EntityStageType+"Id[0]");
		 if(typeStageId == id)
		 {
			addEditdata = eval(G_jResponse+"."+Entitytype+"["+j+"]."+EntityStageType+"Id[1]");

			var G_data=eval(addEditdata);
			if(G_data.PrefsId!="")
			{
				setTimeout("closeCommonPopup()",1000);
				if(G_data.PageType=="Add/Edit");
				handleAddEditJsonData(G_data);
				return;
				break;
			}
			else
			{
				if(typeStageId == id)
				{
					var prefEntity;  //type of updatePrefsIdOnType  action sequence
					if(entityName=="Contact"){
							  prefEntity="Cont";
						}
						else if(entityName=="Account"){
							  prefEntity="Acct";
						}
						else if(entityName=="Opportunity"){
							 prefEntity="Oppty";
						}
					document.getElementById("commonPopupDiv").innerHTML = "";
					$('#commonPopupDiv').dialog({
						autoOpen:true,
						modal: true,
						title:'Set Layout',
						minHeight:170,
						minWidth:220,	
						width:300,
						height:170,
						closeOnEscape:true,
						beforeclose: function() {}
					});
					
					var prefsName = 'add_${homePage.orgDetails.OrgName_Id}_'+prefEntity+'_'+id;
					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
					convertDivContent+="<tr><td colspan='2'><div align='center' style='margin-top:30px;'><center> Oops! It seems you don't have a page layout set up for this page. Click OK to add prefs else cancel.</center><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:SetPreferences('"+G_data.PrefsId+"','"+prefsName+"','"+G_data.UDMName+"','addEditDiv','"+G_data.PageType+"','"+G_data.PageCaption+"')\"  class='greenButton' type='button' value='OK' id='commonPopupOK' name='commonPopupOK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup()\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>";
					convertDivContent += "</table></center>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
					break;
				}
			}
			break;
		}
	}
	return;
}
//$(window).load(function(){alert('yes');}

//Gets the value of the given cookie name

function getCookie(c_name)
{
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	  }
	return "";
}

//Creates a cookie with the given name and the value and sets the expiry date to the given number of days

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else
	var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

//Function which checks whether the.getPortalUser.has set remember me option

function SetCookieAndMoveNextPage() {	
	if(document.getElementById('0-1601').value == 'zxcv') {	
		var name="zeroCode.atCRM";
		var value= getCookie('zeroCode.atCRM');
		createCookie(name,value,15);
		var remMe = "rem.Me";
		var remMeValue = "${homePage.getPortalUser.LoginName}";
		createCookie(remMe,remMeValue,15)
	}
}

function hidePannel() {
	if(document.getElementById('td_left_pannel').style.display == "none") { 
		document.getElementById('td_left_pannel').style.display = "block";
		var slidertd = document.getElementById('slidertd');
		slidertd.className = "slider";
		document.getElementById('slidertd').title="click here to hide the left pannel";
	} else {
		document.getElementById('td_left_pannel').style.display = "none";
		var slidertd = document.getElementById('slidertd');
		slidertd.className = "sliderImgChange";
		document.getElementById('slidertd').title="click here to open the left pannel";
	}
}
function webload() {
	var isBrowser = navigator.appVersion;
	if (isBrowser.indexOf('MSIE') > -1) {			
		var pcEle = document.getElementById("pageContent");
		pcEle.style.display = "block";
		initialize();
		resizeContentDiv();
	} else {		
		setTimeout("initialize()", 3000);
		resizeContentDiv();		
	}
}

//customLogout function written by Govardhan :- For custom index page redirection
function customLogout()
{
	var logoutURL=zcServletPrefix + "/logout.html";
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: logoutURL,		
		async: false			
	});
	document.cookie = "zeroCode.atCRM=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
	if("${homePage.orgDetails.OrgName_Id}" == "668")
	{
		window.location.href=zcServletPrefix + "/index.html?u=2";
	}
	else
	{   
		window.location.href=zcServletPrefix + "/index.html";
	}
}

//  Function for Meteor - Kishore, 28 Jun 2012
function respondToMeteor(data) {
  //alert ("In Meteor Response: " + data);
  document.getElementById("Experience").innerHTML = decodeURIComponent(data);
}
function getPageVal(){
	var iframe = document.getElementById('htmlIframe');
	var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
}
