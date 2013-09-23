
function getUTC(dateTime,offset)
		{
			  // create Date object for current location
		    d = new Date(dateTime);
		   
		    // convert to msec
		    // add local time zone offset
		    // get UTC time in msec
		    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		   
		    // create new Date object for different city
		    // using supplied offset
		    nd = new Date(utc + (3600000*offset));

			// return time as a string
		    return nd.toLocaleString();
		}
function getValues(variableName,varHistoryData)
{
	for(i=0;i<varHistoryData.length;i++)
	{
		varDataArray = varHistoryData[i].split("=");
		L_label = varDataArray[0];
		L_data  = varDataArray[1];
		if(L_label == variableName)
		{
			return L_data;
			//break;
		}
	}
}

function hideSmartSuggests()
{
	$("#smartSuggestDiv").hide();
	$("#multiSelectSugg").hide();
	$("#smartFill").hide();
	$("#mappedSmartFill").hide();
	$("#smartSuggestFill").hide();
	$("#mappedSmartFillWiz").hide();
	$("#autosuggestUsers").hide();
}
function pageload(hash) 
{
	hideSmartSuggests();
	if(hash)
	{
		var L_hashArr = hash.split("?");
		var L_historyGrp  = L_hashArr[0];
		var L_historyData = L_hashArr[1].split("&");
		if(L_historyGrp == "mainMenu")
		{
			if(flg_firstLoad)
			{   
				L_menuId = getValues("menuId",L_historyData);
				var JSONURL=zcServletPrefix+"/custom/JSON/banner.html";

				$.getJSON(JSONURL,'',function(json){setupMainMenuUrlHistory(json,hash);});
				flg_firstLoad=false;
			}
			else {
				L_menuId = getValues("menuId",L_historyData);
				checkMenuOrder(L_menuId);
			}
		}
		else if(L_historyGrp == "thirdLevelMenu" )
		{
			L_mnuId =  getValues("mnuId",L_historyData);
			L_uri =  getValues("uri",L_historyData);
			L_fromMnu =  getValues("drop",L_historyData);
			L_dropIndex =  getValues("dropIndex",L_historyData);
		
			if(flg_firstLoad)
			{
				var JSONURL=zcServletPrefix+"/custom/JSON/banner.html";
				$.getJSON(JSONURL,'',function(json){setupMainMenuUrlHistory(json,hash);});
				flg_firstLoad=false;
			}
			else
			{
				//L_url= getValue("url",L_historyData);
				L_url =  getValues("uri",L_historyData);
		/*		if((L_url.indexOf('Contact.htm')>0)||(L_url.indexOf('Account.htm')>0)||(L_url.indexOf('Opportunity.htm')>0))
				{
					getAddDataFrmCache(L_url);
					return false;
				}
				else*/
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
			
				L_uri = L_uri.replace(/~/g,"?");
				L_uri = L_uri.replace(/@/g,"&");
				L_uri = L_uri.replace(/\*/g,"=");
				L_fromMnu =  getValues("drop",L_historyData);
				L_dropIndex =  getValues("dropIndex",L_historyData);
				L_Reload =  getValues("reload",L_historyData);
				showSubMenu(L_mnuId,L_uri,L_fromMnu,L_dropIndex,L_Reload) ;
				}
			}
		}
		else if(L_historyGrp == "subMenu" )
		{
			L_mnuId =  getValues("mnuId",L_historyData);
			L_Reload =  getValues("reload",L_historyData);
			if(flg_firstLoad)
			{
				var JSONURL=zcServletPrefix+"/custom/JSON/banner.html";
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
					 showSubMenu(L_mnuId,'','','',L_Reload) ;
				 }
			}
		}
		else if(L_historyGrp == "setUpPageParameters")
		{
			if(flg_firstLoad)
			{
				var JSONURL=zcServletPrefix+"/custom/JSON/banner.html";
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
						url: "/atCRM/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
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
		getJSONResponse();
		showNotification();
	}
}

function callCenterProcess()
{
    /*This part is for knowlarity integration added by Dony*/
	var cti_provider=cti_provider;
	var agentNum=home_user_pbx_ext;
	var numLen=parseInt(agentNum.toString().length);
	if(numLen > 10) {
		if(agentNum.toString()[0]=='0') agentNum = agentNum.toString().replace('0','+91');
		else agentNum=agentNum;
	}
	else if(numLen == 10) agentNum = '+91'+agentNum.toString();
	var userId=session_login;
	var browser= navigator.userAgent;
	if(cti_provider)
	{
	   if(cti_provider == "knowlarity")
		 {
				   var socket = io.connect('http://api.knowlarity.com:8088/');
				   var api_key=home_getuserflag;                                 //userLevel apikey
				   if(api_key == "") api_key=home_getFlagValIfNoUserId;         //orgLevel apikey
				   socket.emit('feedapp', api_key+'_'+agentNum);
				   socket.on('message', function(msg) {
				   msg = msg.replace(/\'/g, '\"');
				   var respData=JSON.parse(msg);
				   var dispNumber=respData.dispnumber;var primPhone=respData.caller_id;var extension=respData.extension;
				   var callid=respData.callid;var destination=respData.destination;var action=respData.action;var inbound_event=respData.event;
				   dispNumber=dispNumber.toString().replace('+','');primPhone=primPhone.toString().replace('+','');destination=destination.toString().replace('+','');
				   var postData='0-1-3= knowlarity-Inbound call&0-1-6=1&0-1-385='+escape(dispNumber)+'&0-1-386='+escape(extension)+'&0-1-387='+escape(callid)+'&0-1-388='+escape(destination)+'&0-1-389='+escape(primPhone)+'&0-1-390='+escape(action)+'&0-1-391='+escape(inbound_event);
				   var url2Hit=zcServletPrefix+"/custom/JSON/add/Activity/editAction";
					$.ajax({
					  	type: "POST",
						contentType: "application/x-www-form-urlencoded",
						url:url2Hit,
						data: postData,
						success: function (data)
						 {
						   data=JSON.parse(data);
						   var actvtyId = data.addedId;
							/*Open window page and show the detail*/
									$.window.prepare({
									   dock: 'bottom'       // change the dock direction: 'left', 'right', 'top', 'bottom'
									});
									var templtIcon="";
								   // var divContent="<iframe src="+callUrl+" height='100%' width='100%' border='0'/>";
									var divContent="<div id='windowDiv' style='height:100%;width:100%'></div><input type='hidden' id='blink_index_input' value='0'/>"
									var windowHeight=$(window).height();
									var windowWidth=$(window).width();
									var jqryWinHt=windowHeight-40;
									var jqryWinWdth=windowWidth-120;
									var titleHTML;var intervalId;var windowId;var isMinimize='0';var pageTitle;
									//var blinkIndex=0;
									browser = browser.toLowerCase();
									//prompt("Browser",browser)
									if(browser.indexOf("firefox")>-1) 
									titleHTML="<span style='width:80%' id='title_text'></span><span style='width:20%;color:red;text-decoration:blink;margin-left:70%;'>Inbound Call</span>";
									else{
									titleHTML="<span style='width:80%' id='title_text'></span><span style='width:20%;float:right;color:red;'><span id='spn_inbound'>****Inbound Call****</span></span>";
									}
									$.window({
											showModal: false,
											modalOpacity: 0.5,
											//icon: templtIcon,
											//title: titleHTML,
											width: jqryWinWdth,
											height: jqryWinHt,
											maxWidth: 870,
											maxHeight: 570,
											resizable: false,
											content: divContent,
											onShow: function(wnd) {
												 windowId = wnd.getWindowId();
												 var windowElem=document.getElementById(windowId);
												 windowElem.getElementsByClassName("window_title_text")[0].innerHTML=titleHTML;
												 if(browser.indexOf("firefox")<0){
												   intervalId=window.setInterval(function(){
													 blinkIndex=document.getElementById("blink_index_input").value;
													 if(blinkIndex == "0") {
														if($('#spn_inbound').length > 0){
														//document.getElementById('spn_inbound').style.visibility="hidden";
														$('#spn_inbound').css('visibility', 'hidden');
														$('#blink_index_input').val('1');
														//document.getElementById("blink_index_input").value ="1";
														}
														}
													 else {
														 if($('#spn_inbound').length > 0){
														 	$('#spn_inbound').css('visibility', 'visible');
															$('#blink_index_input').val('0');
															 // document.getElementById('spn_inbound').style.visibility="visible";
															 // document.getElementById("blink_index_input").value ="0";
														 }
														 }
													 },500);
												 }
												var phone_num=primPhone.replace("91","0");
												var url2Hit=zcServletPrefix+"/custom/JSON/view/contact360View.htm?pri_phone="+phone_num;
												$.ajax({
												  type: "GET",
												  contentType: "application/x-www-form-urlencoded",
												  url:url2Hit,
												  dataType: "json",
												  success: function (data)
													{
													   var contactId= data.PrimaryKeyValue;
													   pageTitle= data.PageCaption;
													  // document.getElementById("title_text").innerHTML=pageTitle;
													   $('#title_text').html(pageTitle);
													   //titleHTML=pageTitle;
													   if(contactId !='') {
															handleJson360ViewData(data,'windowDiv');
															QaddAdd4Activity(actvtyId,userId,'','');
															if($("#viewPageTopMenuDiv table")) $("#viewPageTopMenuDiv table").hide();
													   }
													   else 
													   {
														  // var mainDiv=document.getElementById("windowDiv");
														  // mainDiv.innerHTML="<div id='errorDiv' style='width:100%;color:red;text-align:center;'>Contact detail not available.</div>";
														  $('#windowDiv').html("<div id='errorDiv' style='width:100%;color:red;text-align:center;'>Contact detail not available.</div>");
														  QaddAdd4Activity(actvtyId,userId,'','');
													   }
													}
												});	
											 },
											 onClose: function(wnd) { 
												  if(intervalId) window.clearInterval(intervalId);
											  },
											  afterMinimize: function(wnd) { // a callback function after window minimized
												  isMinimize='1';
											   },
											 afterCascade: function(wnd) { // a callback function after window cascaded
												  if(isMinimize == '1'){
													var windowObj=document.getElementById(wnd.getWindowId());
													windowObj.getElementsByClassName("window_title_text")[0].innerHTML=titleHTML;
													//document.getElementById("title_text").innerHTML=pageTitle;
													$('#title_text').html(pageTitle);
												  }
											  }
										  });  /**** jquery window function ends *****/
									 }
								 });           /*****Activity add function ends  ******/
							});                /*****Socket connection function ends here*****/
		 }                             /*****Knowlarity integration codes end here*****/
		else if(cti_provider == "ozonetel")
		  {
			 var userId=session_login;
             var userName = session_login_name;
			 /***Function defined in pageLevelFns.js it will show the popup for contact and activity**/
			 processOzoneTel(userId,userName);
		  }
	 }
}

function showNotification()
{
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: zcServletPrefix+"/custom/Messages/notificationMsgs.htm",
		dataType: "json",
		success: function (data)
		{
			//alert(data.notificationTitle);
		}	
	});
}

function reloadPage()
{
	var JSONURL=zcServletPrefix+"/custom/JSON/banner.html";
	$.getJSON(JSONURL,'',function(json){setupMainMenuUrl(json);});
}

function customeInitialize() {
	var isBrowser = navigator.appVersion;
	if (isBrowser.indexOf('MSIE') == -1) {
		//document.getElementById("pageContent").style.display="block";
		$('#pageContent').css('display', 'block');
	}
	updateSession();
	checkReminder();            //Added by Venkatesh for reminder
	checkForExpiryDate();       //Added by Venkatesh for license expiry
	loadScreen(); 
	callCenterProcess();       /**Based on cti_provider open soket for call , by Dony**/  
	var imgWidth = $("#orgLogo").width();
	var imgheight = $("#orgLogo").height();
	if(imgWidth>180)
		//document.getElementById('orgLogo').style.width="180px";
		$('#orgLogo').css('width', '180px');
	if(imgheight>45)
		//document.getElementById('orgLogo').style.height="47px";
		$('#orgLogo').css('width', '47px');

	mLeft=(document.documentElement.clientWidth-100)/2;
	$('#loadingDiv').css('left', mLeft+'px'); //document.getElementById('loadingDiv').style.left=mLeft+"px";

	mLeft=(document.documentElement.clientWidth-450)/2;
	$('#commonErrorDiv').css('left', mLeft+'px'); //document.getElementById('commonErrorDiv').style.left=mLeft+"px";

	detailDataTdWidth=window.document.body.clientWidth-100;

	/** Start: Mail Downloads */
	if (home_org_pis !='' && home_org_pip!='' && home_org_ssl_enb!='' && home_org_client_mail_prot!='' && home_user_mail_login_name!='' && home_user_mail_pwd!='')
	{
		if(mailFolderInbox != "" && rp != "" && un != "") {
			// setTimeout("callEmailProcessor('"+mailFolderInbox+"','"+rp+"','"+un+"')", 5000);	
			eval("callEmailProcessor('"+mailFolderInbox+"','"+rp+"','"+un+"')")	;
		}
	}
	
	try {
		jQuery.history.init(pageload);
		jQuery("a[@rel='history']").click(function()
		{
			// 
			var hash = this.href;
			hash = hash.replace(/^.*#/, '');
			// moves to a new page. 
			// pageload is called at once. 
			$j.history.load(hash);
		});		
	}
	catch (e) {
		console.log(e);
	}
  
   loadScripts();              //Load the js files, By  Dony
   $.ajax({
	   type: "GET",
	   contentType: "application/x-www-form-urlencoded",
	   url: zcServletPrefix+"/custom/JSON/admin/getFlagsData.htm",
	   dataType: "json",
	   success : function(data)
	   {
	     var disbl_layout_org= "";
	     var enbl_layout_usr = "";
		 flagsJSON = data["flag_data"];
	     var flagData = data["flag_data"];
		 /********Get orgflags data*********/
		 var orgFlgData = flagData[0]["org_flags"];
	     for(var i=0;i<orgFlgData.length;i++)
		 {
		   var orgflgName  = orgFlgData[i]["name"];
		   var orgflgValue = orgFlgData[i]["flag_value"];
		   if(orgflgName == "disable_layout"){
		     disbl_layout_org=orgflgValue;
		   }
		   
		 }
		 /***********Get user enable_layout flag*************/
		 var usrFlgData = flagData[1]["user_flags"];
	     for(var i=0;i<usrFlgData.length;i++)
		 {
		   var usrflgName  = usrFlgData[i]["name"];
		   var usrflgValue = usrFlgData[i]["value"];
		   if(usrflgName == "enable_layout")
		   {
		     enbl_layout_usr=usrflgValue;
		   }
		 }
		 /******Set showLayout flag based on the org and user flags*****/
		 if(enbl_layout_usr != "" && enbl_layout_usr == "0") 
		 	$('#input_layout').val('false'); //document.getElementById("input_layout").value = "false";
		 else if(enbl_layout_usr != "" && enbl_layout_usr == "1") 
		 	$('#input_layout').val('true'); //document.getElementById("input_layout").value = "true";
		 else if(disbl_layout_org != "" && disbl_layout_org == "1") 
		 	$('#input_layout').val('false'); //document.getElementById("input_layout").value = "false";
		 else if(disbl_layout_org != "" && disbl_layout_org == "0") 
		 	$('#input_layout').val('true'); //document.getElementById("input_layout").value = "true";
		 else 
		 	$('#input_layout').val('true'); //document.getElementById("input_layout").value = "true";
	   }
	 });

	$.ajax ({
		type: "GET",
		url: zcServletPrefix+"/custom/ki1/enttDet.html",
		success: function(data) {
			parent.g_curr_obj = JSON.parse(data);
		},
		/* error: function(err) {
			alert ("Error in Entity Detail Data: ", err); 
		}*/
	 });


	  /*****Set load img position******/
	  //var divObj = document.getElementById("detailDataDiv");
	  var position=$('#detailDataDiv').offset(); //$(divObj).offset();
	  var topPos=position.top;
	  var mainWidth=$(window).width();
	  //var mainHeight=divObj.offsetHeight;
	  var mainHeight=$(window).height();
	  var reqWidth = parseInt(mainWidth)/2;reqWidth +=10;
      var reqHt  = parseInt(mainHeight)/2;
	  $("#loader_Img").offset({top:reqHt,left:reqWidth});
      currentRecIdsJSON =JSON.parse('{"acct_id":"","cont_id":"","state_id":"","brch_id":"","prod_id":"","prod_qty":"","rep_id":""}');
} 

function updateSession()
{
	$.ajax({
	   type: "GET",
       contentType: "application/x-www-form-urlencoded",
	   async: false,
	   url: zcServletPrefix+"/custom/system/createTerrSessionVariable.html"
	 });
}


function setUpPageParameters(uri,objId,fromMnu,subItmId,reloadFlag,listPopup,dropIndex,isCancel,recId)
{
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
    $("#commonPopupDiv").dialog("close");
    hideSmartSuggests();
    if(subItmId){subMnuItmId=subItmId;}
    if(fromMnu){dropMnuIndex=dropIndex;}

    // if(document.getElementById('htmlIframe'))
    // 	document.getElementById('htmlIframe').src="";
    if($('#htmlIframe').length > 0)
    	$('#htmlIframe').attr('src', '');
    
    dataDiv= document.getElementById('detailDataDiv');

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
    //openLoadingDiv();

    var isFunction=uri.indexOf('ret_fun:'); 
    hideFullContent();
    if(isFunction>0)
    {
        if($("#dyna_html").html() !="") $("#dyna_html").html("");
        var fun2Call=uri.substring(isFunction+8); 
        
        // if(document.getElementById('htmlIframe'))
        // 	document.getElementById('htmlIframe').style.display="none";
        // if(document.getElementById(entityDiv))
        // 	document.getElementById(entityDiv).style.display="none";

        if($('#htmlIframe').length > 0)
        	$('#htmlIframe').css('display', 'none');

        if($('#'+entityDiv).length > 0)
        	$('#'+entityDiv).css('display', 'none');

        dispatch(fun2Call);
        closeLoadingDiv();
    }
    else if(htmlIndex > 0)
    { 
        if($("#dyna_html").html() !="") $("#dyna_html").html("");
        hideLeftPannel(false);
        retrieveJSONdata(uri,objId,fromMnu,true,reloadFlag,listPopup);
    }
    else
    {
       if($("#dyna_html").html() !="") 
       	$("#dyna_html").html("");

       hideLeftPannel(true);
       showHtmlIframe(uri,objId);
    }
    if(uri.indexOf('invoices_wizard.htm')>0)
    {
        hideLeftPannel(true);
        $('#detailDataTd').css('width', '100%'); //document.getElementById('detailDataTd').style.width = '100%';
    }
 	if(!homePage) {
        if(!homepage_org_flag_id) {
	        alert("You have not chosen a hint question and answer. Please choose it now.");
	        hintQuestion(un);
        }
    }
    if (flg_firstLoad && timeZoneOffset != timeDiffInMin)
    {
        timeZoneDiff(timeZoneOffset,timeDiffInMin);
    }
}



function showHtmlIframe(uri,objId)
{
	if($('#'+entityDiv).length > 0)
	{
		$('#'+entityDiv).css('display', 'none'); //document.getElementById(entityDiv).style.display="none";
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
		if($('#htmlIframe').length > 0)
		{  
		    if($("#dyna_html").html() !="") $("#dyna_html").html("");
			//prompt("If-InnerHTML-",$("#dyna_html").html());
			//document.getElementById("dyna_html").innerHTML="";
			$('#htmlIframe').attr('src',uri);
			$('#htmlIframe').css('display', 'block'); //document.getElementById('htmlIframe').style.display='block';
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
			dataDiv.append(htmlIframe);
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
	$('#loadingDiv').css('display', 'block'); //document.getElementById('loadingDiv').style.display="block";
	$('#loadingDiv').html('Loading..'); //document.getElementById('loadingDiv').innerHTML="Loading...";
	milisec=0;
	seconds=10; 
	$('#stillWorking').val('10.0'); //document.getElementById('stillWorking').value="10.0"
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
	//if(document.getElementById('loadingDiv').style.display=="block")
	if($('#loadingDiv').css('display') =="block")
	{
		//if(document.getElementById('stillWorking').value=="0.0")
		if($('#stillWorking').val() =="0.0")
		{
			//document.getElementById('loadingDiv').innerHTML="Still working...";
			$('#loadingDiv').html('Still working..');
			return;
		}
		if (milisec<=0){ 
			milisec=9 
			seconds-=1 
		} 
		milisec-=1 
		//document.getElementById('stillWorking').value=seconds+"."+milisec 
		$('#stillWorking').val(seconds+"."+milisec);
		setTimeout("stillLoading()",100) 
	}
	else
		return;
}

function closeLoadingDiv()
{
	// document.getElementById('loadingDiv').innerHTML="Loading...";
	// document.getElementById('loadingDiv').style.display="none";
	$('#loadingDiv').html('Loading..').css('display', 'none');
	$("#pageLoad").hide(); 
}

function errorInProcess(from_info) {
	closeLoadingDiv();
	//document.getElementById('commonErrorDiv').style.display="block";
	$('#commonErrorDiv').css('display', 'block');
	hideErrorDiv(from_info);
	
}

function hideErrorDiv(from_info) {
	if (from_info) {
		//document.getElementById('commonErrorDiv').innerHTML= from_info;
		$('#commonErrorDiv').html(from_info);
	} else {
		//document.getElementById('commonErrorDiv').innerHTML="Oops! Something broke! Syslog has been written. We'll fix it ASAP.";
		$('#commonErrorDiv').html("Oops! Something broke! Syslog has been written. We'll fix it ASAP.");
	}
	setTimeout(function() { $('#commonErrorDiv').css('display', 'none'); },5000);
}

function retrieveJSONdata(uri,objId,fromMnu,add2History,reloadFlag,listPopup)
{  
	//console.log(uri,objId,fromMnu,add2History,reloadFlag,listPopup);
	//var parURI=uri.search("custom/JSON/system/getParentMnuItmId.htm");
	//if(parURI<0&&xhr_request)xhr_request.abort();
	if(reloadFlag=="true")reloadFlag=true;else if(reloadFlag=="false") reloadFlag=false; else  reloadFlag="neither";
	
	// if(document.getElementById('htmlIframe'))
	// 	document.getElementById('htmlIframe').style.display="none";
	// if(document.getElementById(entityDiv))
	// 	document.getElementById(entityDiv).style.display="none";

	if($('#htmlIframe').length > 0)
		$('#htmlIframe').css('display', 'none');
	if($('#'+entityDiv).length > 0 )
		$('#'+entityDiv).css('display', 'none');
	
	if(uri.search("custom/JSON/list/linkList.htm")>=0)reloadFlag=true;
	//if(uri.search("custom/JSON/list/container.json")>=0)reloadFlag=true;
	//if(document.getElementById(subMnuItmId+"-lstTbl")&&fromMnu=='main'){console.log('common list');handleCommonList();}

	if(fromMnu) {
		mnuItmId=objId;
		var addPage=uri.indexOf('/add/');
		var adHocList=uri.indexOf('/JSON/list/container');
		if(addPage>0)
		entityDiv='addEditDiv';
		else if(adHocList>0)
		entityDiv=subMnuItmId+'-adList';	
		else
		entityDiv=objId+'-DataDiv';
		var fromHTML=entityDiv.indexOf('.html');
		if($('#'+entityDiv).length > 0) {
			if(fromHTML < 0) {
				$('#'+entityDiv).css('display', 'block') ; 
				if($('#'+mnuItmId+'-pageTitle').length > 0)
				document.title=$('#'+objId+'-pageTitle').val() +' - Impel';
				var hdnURL= $('#'+ objId+'-URL').val(); //document.getElementById(objId+'-URL').value;		

				if(hdnURL==uri&&reloadFlag!=true) {	
					closeLoadingDiv();
					return;
				}
				else //if same entity reloaded
				{	
					if(entityDiv!="addEditDiv")
					{
						try{
							var pagingAmt= $('#'+mnuItmId+'-pagAmt').val(); //document.getElementById(mnuItmId+'-pagAmt').value;
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
				//document.getElementById(objId+'-URL').value=uri;
				$('#'+objId+'-URL').val(uri);
			}
		}
		else
		{
			var detailDataDiv=document.getElementById('detailDataDiv');
			CreateDIV(detailDataDiv,'',entityDiv);
			if($('#'+objId+'-URL').length>0)
				$('#'+objId+'-URL').val(uri); //document.getElementById(objId+'-URL').value=uri;
			else
				CreateHIDDEN(document.getElementById('detailDataDiv'), '', objId+'-URL', uri);
		}
		
	}
	if($('#'+entityDiv).length > 0)
	{
		//document.getElementById(entityDiv).style.display="block";
		$('#'+entityDiv).css('display', 'block');
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
			if(home_org_org_id == "668")
			{				
				window.location.href=zcServletPrefix+"/index.html?u=2&fromUdm=custom/JSON/homePage.html";
			}
			else
			{
				window.location.href=zcServletPrefix+"/index.html?fromUdm=custom/JSON/homePage.html";
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
			if($('#'+objId+'-pageTitle').length > 0)
				$('#'+objId+'-pageTitle').val(doc.PageCaption); //document.getElementById(objId+'-pageTitle').value=doc.PageCaption;
			else
			{
				CreateHIDDEN(document.getElementById('detailDataDiv'), '', objId+'-pageTitle', doc.PageCaption);
			}

			document.title=$('#'+objId+'-pageTitle').val() +' - Impel';

			jsonPageType=doc.PageType;
			switch(jsonPageType)
			{
			case "List":
						if(listPopup==true)
							handleJsonList(doclst,'listPopUp',popUpWidth,popUpHeight,$('#'+mnuItmId+'-URL').val());
						else
							handleJsonList(doc,null,null,null,objId,add2History);
						break;
			case "adhocList":
							handleCommonList(doc);
						break;
			case "Add/Edit":
						if($('#addEdit-URL').length > 0)
							$('#addEdit-URL').val(mainUrl); //document.getElementById('addEdit-URL').value=mainUrl;
						else
							CreateHIDDEN(document.getElementById('detailDataDiv'), '', 'addEdit-URL', mainUrl);
							handleAddEditJsonData(doc);
						break;
			case "360View":
						if($('#360View-URL').length > 0)
							$('#360View-URL').val(mainUrl); //document.getElementById('360View-URL').value=mainUrl;
						else
							CreateHIDDEN(document.getElementById('detailDataDiv'), '', '360View-URL', mainUrl);
							handleJson360ViewData(doc,objId,add2History);
						break;
			case "adh360View":
			               adhoc360ViewData(doc,objId);
			case "linkList":
							bldLinkList(doc,objId,$('#'+mnuItmId+'-URL').val());				
						break;
			case "InvoiceWizardAddEdit":
							hideLeftPannel(true);
						if($('#addEdit-URL').length > 0 )
							$('#addEdit-URL').val(mainUrl); //document.getElementById('addEdit-URL').value=mainUrl;
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
						// var mainDataDiv = document.getElementById(entityDiv);
						// $(mainDataDiv).html(doc.content);
						var mainDataDiv = $('#'+entityDiv);
						$(mainDataDiv).html(doc.content);
			case "rept":
						hideLeftPannel(true);
						var into_div = $('#detailDataDiv'); //document.getElementById('detailDataDiv');
						entityDiv = into_div;
						closeLoadingDiv();
						exec_rept(doc,into_div);
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
	//var targetObj = document.getElementById('detailDataDiv');
	var xyCoordinates = findPos('lastDivOnPage');
	//targetObj.style.height = (isIE)?parseInt(xyCoordinates[1])-157:parseInt(xyCoordinates[1])-70;
	var h = (isIE)?parseInt(xyCoordinates[1])-157:parseInt(xyCoordinates[1])-70;
	$('#detailDataDiv').css('height', h)
	pageWidth = (window.document.body.clientWidth)-345;
	pageWidth1 = (screen.width)-30;
	//document.getElementById('headerMenuIts').style.width=pageWidth1+'px';
	//alert(window.innerWidth+" "+document.body.clientHeight/Width)
}


function checkForExpiryDate()
{
	if(reDate(home_getLicExpDate)<reDate(home_getTodaysDate))
	{
		alert('Your license has expired. Please contact your systems administrator or contact us at support@impelcrm.in');
		//Changes done by Govardhan: if-else condtn
		if(home_org_org_id == "668")
		{				
			window.location.href=zcServletPrefix+"/index.html?u=2";
		}
		else
		{
			window.location.href=zcServletPrefix+"/index.html";
		}		
	}
}

function reDate(dmy)
{
    var d=dmy.split(/\D+/);
    return new Date(d[2],d[1]-1,d[0]);
}




	// document.getElementsByClassName = function(){
	// 	if(document.hasChildNodes && arguments[0]){
	// 		var data = new Array();
	// 		for(a=0;a<document.getElementsByTagName("*").length;a++){
	// 			if(document.getElementsByTagName("*")[a].className == arguments[0]){
	// 			data.push(document.getElementsByTagName("*")[a]);
	// 			}
	// 		}
	// 	return data;
	// 	}
	// }
//call for email processor 
function callEmailProcessor(folder_id,rp,un){
	if(folder_id)
	{
		$.ajax({
		   type: "GET",
		   contentType: "application/x-www-form-urlencoded",
		   url: "http://192.168.11.125:81/emailProcessor/emailProcessor.php?un="+un+"&rp="+rp+"&uefid="+folder_id,
		   dataType: "text",
		   success: function(data){
				var outputString = data;					   
 				if (outputString.indexOf('Invalid Email Configuration')!= "-1")
				{
					//document.getElementById("timerTD").innerHTML = "<font color='#CC0000'>Invalid email server configuration.</font>";
					$('#timerTD').html("<font color='#CC0000'>Invalid email server configuration.</font>");
				}
				if (outputString.indexOf('Invalid Email username and password')!= "-1")
				{
					//document.getElementById("timerTD").innerHTML = "<font color='#CC0000'>Invalid email username and password.</font>";
					$('#timerTD').html("<font color='#CC0000'>Invalid email username and password.</font>");
				}
				if (outputString.indexOf('Invalid Mail folder name')!= "-1")
				{						
					//document.getElementById("timerTD").innerHTML = "<font color='#CC0000'>Invalid mail folder name.</font>";
					$('#timerTD').html("<font color='#CC0000'>Invalid mail folder name.</font>");
				}
				if (outputString.indexOf('Invalid Server Paramaters')!= "-1")
				{						
					//document.getElementById("timerTD").innerHTML = "<font color='#CC0000'>Invalid server paramaters.</font>";
					$('#timerTD').html("<font color='#CC0000'>Invalid server paramaters.</font>");
				}				   
				if (outputString.indexOf('Zero new mails found')!= "-1")
				{						
					//document.getElementById("timerTD").innerHTML = "No new emails.";
					$('#timerTD').html("No new emails.");
				}					
				setTimeout("callEmailProcessor('"+mailFolderInbox+"','"+rp+"','"+un+"')", 1200000);		  
			},
			error: function(request,status,errorThrown) {
				// document.getElementById("content").style.visibility="hidden";
				// document.getElementById("timerTD").innerHTML = "<font color='#CC0000'>Internal server error.</font>";		
				$('#content').css('visibility', 'hidden');
				$('#timerTD').html("<font color='#CC0000'>Internal server error.</font>");
				setTimeout("callEmailProcessor('"+mailFolderInbox+"','"+rp+"','"+un+"')", 1200000);		
			}
			});			
	}
}
/*function readAllhrefs()
{
	var a_link = document.form.getElementsByTagName('a');
	alert(a_link);
	/*for (i=0;i<a_link.length;i++)
	{
		if(a.innerText
	}
}*/

function getJSONResponse()
{
	var JSONURL=zcServletPrefix+"/custom/JSON/add/Contact.htm";
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: JSONURL,
		cache: true,
		dataType: "json",
		success: function (data){
			G_jsonresponse_Contact = eval(data);
		}	
	});
	var JSONURL_Acct=zcServletPrefix+"/custom/JSON/add/Account.htm";
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: JSONURL_Acct,
		cache: true,
		dataType: "json",
		success: function (data){
			G_jsonresponse_Account = eval(data);
		}	
	});
	var JSONURL_Oppor=zcServletPrefix+"/custom/JSON/add/Opportunity.htm";
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: JSONURL_Oppor,
		cache: true,
		dataType: "json",
		success: function (data){
			G_jsonresponse_Opportunity = eval(data);
		}	
	});
	var JSONURL_QACont=zcServletPrefix+"/custom/JSON/add/Contact.htm?prefsName=quickAddContactPrefs&qA=1&objId=480563";
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: JSONURL_QACont,
		cache: true,
		dataType: "json",
		success: function (data){
			G_quickAddResponse_Contact = eval(data);
		}	
	});
	
	flg_pageLoad=false;
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
				//document.getElementById("commonPopupDiv").innerHTML = "";
				$('#commonPopupDiv').html('');
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
			//document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			$('#commonPopupDiv').html(convertDivContent);
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
	// if(document.getElementById(entityDiv))
	// 	document.getElementById(entityDiv).style.display="none";

	if($('#'+entityDiv).length > 0)
		$('#'+entityDiv).css('display', 'none');

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
					$('#commonPopupDiv').html(''); //document.getElementById("commonPopupDiv").innerHTML = "";
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
					
					var prefsName = "add_" + home_org_org_id + "_"+prefEntity+'_'+id;
					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
					convertDivContent+="<tr><td colspan='2'><div align='center' style='margin-top:30px;'><center> Oops! It seems you don't have a page layout set up for this page. Click OK to add prefs else cancel.</center><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:SetPreferences('"+G_data.PrefsId+"','"+prefsName+"','"+G_data.UDMName+"','addEditDiv','"+G_data.PageType+"','"+G_data.PageCaption+"')\"  class='greenButton' type='button' value='OK' id='commonPopupOK' name='commonPopupOK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup()\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>";
					convertDivContent += "</table></center>";
					//document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
					$('#commonPopupDiv').html(convertDivContent);
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

function createCookie(name, value, days)
{
	if (days) 
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else
	var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

//Function which checks whether the user has set remember me option

function SetCookieAndMoveNextPage()
{	
	if($('#0-1601').val() == 'zxcv')
	{	
		var name="zeroCode.atCRM";
		var value= getCookie('zeroCode.atCRM');
		createCookie(name,value,15);
		var remMe = "rem.Me";
		var remMeValue = un;
		createCookie(remMe,remMeValue,15)
	}
}


function hidePannel()
{
	if($('#td_left_pannel').css('display') == "none")
	{ 
	  //  $("#accordianMainDiv").animate("slow");
      // $("#accordianMainDiv").slideToggle(2000);
	    //$("#accordianMainDiv").slideDown(2000);
		//document.getElementById('td_left_pannel').style.display = "block";
		$('#td_left_pannel').css('display', 'block');
		var slidertd = document.getElementById('slidertd');
		slidertd.className = "slider";
		document.getElementById('slidertd').title="click here to hide the left pannel";
	}
	else 
	{
		// $("#accordianMainDiv").animate("slow");
	  // $("#accordianMainDiv").slideToggle(2000);
	   //$("#accordianMainDiv").animate({.slideUp},"slow");
	    // $("#accordianMainDiv").slideUp(2000);
		//document.getElementById('td_left_pannel').style.display = "none";
		$('#td_left_pannel').css('display', 'none');

		var slidertd = document.getElementById('slidertd');
		slidertd.className = "sliderImgChange";
		document.getElementById('slidertd').title="click here to open the left pannel";
	}
}


function webload()
{
	var isBrowser = navigator.appVersion;
	if (isBrowser.indexOf('MSIE') > -1)
	{			
		// var pcEle = document.getElementById("pageContent");
		// pcEle.style.display = "block";
		$('#pageContent').css('display', 'block');
		customeInitialize();
		resizeContentDiv();
	}
	else
	{		
		customeInitialize();
		//setTimeout("customeInitialize()", 3000);
		resizeContentDiv();		
	}
}

//customLogout function written by Govardhan :- For custom index page redirection
function customLogout()
{
	var logoutURL=zcServletPrefix+"/logout.html";
	$.ajax({
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		url: logoutURL,		
		async: false			
	});
	document.cookie = "zeroCode.atCRM=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
	if(home_org_org_id == "668")
	{
		window.location.href=zcServletPrefix+"/index.html?u=2";
	}
	else
	{
		window.location.href=zcServletPrefix+"/index.html";
	}
}

//  Function for Meteor - Kishore, 28 Jun 2012
function respondToMeteor(data) {
  //alert ("In Meteor Response: " + data);
  //document.getElementById("Experience").innerHTML = decodeURIComponent(data);
  $('#Experience').html(decodeURIComponent(data));
}
function getPageVal(){
	var iframe = document.getElementById('htmlIframe');
	var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
	//alert(innerDoc.getElementById('username_field').value);

//alert(document.getElementById('htmlIframe').src);
//alert(document.getElementById('username_field').value);
}


/*  Commented by Kishore, 21 Aep. 2012 - don't know why this is here at all...
$t = $("#table");
$("#pageLoad").css({
  opacity : 0.5,
  top     : $t.offset().top,
  width   : $t.outerWidth(),
  height  : $t.outerHeight()
});
*/

 
