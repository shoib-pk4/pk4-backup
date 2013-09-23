var viewItems=new Array(); 
var currPage="";
var lastElem="x";
var viewPageTab;
var prevViewPageTab;
var viewPageEntt;
var viewNavIds="";
var currListURL4View;
var maxPageNo4List=1;
var viewNavLastEvent;
var pageTopMenuDiv="inline";
var beforeSelectIndex;
var bottomMnuCnt=0;
var viewMainUrl;
var tabSelId;
var isFrmQuickAdd=false;
var showViewLayout=false;
var contactName='';
var tableName='';
var formLoadFunction='';
var PkValue='';

function handleJson360ViewData(data,objId)
{	
	viewMainUrl=window.top.location;
	var caption=data.PageCaption; 	
	var getHyphenIndex=caption.indexOf('-');
	currPage=data.ViewUrl; 
	tableName=data.tableName;
	formLoadFunction=data.onFormLoad;
	if(data.PrimaryKeyValue)
	{
		PkValue=data.PrimaryKeyValue;
		PkValue=PkValue.replace(",","");
		PkValue=PkValue.split(".")
		PkValue=PkValue[0];
	}
	

	lastElem="x";
	viewItems.length=0;
	closeLoadingDiv();

	if(objId=="viewMappedRecordPopUp")
	{
		dataDiv=document.getElementById("viewMappedRecordPopUp");
	}
	else if(objId=="windowDiv")
	{
        dataDiv=document.getElementById("windowDiv");
	}
	else
	{
		document.getElementById(entityDiv).style.display="none";
		entityDiv="360ViewDiv";
		var mainDiv=document.getElementById('detailDataDiv');
		var mainDataDiv=document.getElementById(entityDiv);

		if(document.getElementById("360ViewDiv"))
		{
			document.getElementById("360ViewDiv").style.display='block';
			var dataDiv=document.getElementById("360ViewDiv");
		}
		else
		{
			var dataDiv=CreateDIV(mainDiv,'',"360ViewDiv",'','100%');
		}		
	}

/*  Get all the field items to be populated from JSON's TopPanel, fill into viewItems structure for later use
*/
		for(i in data){
		  if(i=="TopPanel"){
			for(j in data[i]){
				viewItems.push(data[i][j]);
			}
		  }
		}

	dataDiv.innerHTML="";	
	var mainTable=CreateTable(dataDiv,"","360ViewTable","","","");
	var mainBody=CreateBody(mainTable);
	var mainTR=CreateTR(mainBody);
	var mainTD=CreateTD(mainTR,"","360ViewTd","");
	var pageHeading=data.PageCaption;
	contactName=data.PageCaption.substring(getHyphenIndex+1);
	mainTable.style.width="100%";
	mainTable.style.align="center";

	if(tableName.toLowerCase() == 'contact')
	{
		
		mainTD.innerHTML="<div id='ContactImage' style='position:relative; z-index:75; display:inline;'><img src='/atCRM/images/JSON/NoImage.png' style='width:70px;height:70px; display:inline;'/><div class='changeText'>Change Photo</div></div><div  id='imageUploadDiv' style='display:none;'></div><span class='jsonHeading' style='position: relative; left:-15px; top:-30px; white-space:nowrap;	padding-top: 19px;'>"+contactName+"</span>";
		//<span class='profDetails'>|Comapny|Designation</span>
		
		$('document').ready(function(){
			$('#ContactImage > .changeText').hide();
			
			$('#ContactImage').on('mouseenter',function(){
				$('#ContactImage > .changeText').show();	
				}).on('mouseleave',function(){
				$('#ContactImage > .changeText').hide();	
				});
				
			$('#ContactImage').on('click',function(event)
				{
					showDialogForImage(event);
						
				});
			
		});
	
	}
	else
		mainTD.innerHTML="<span class='jsonHeading'>"+pageHeading+"</span>";
	
	if((!data.PrefsId) || (viewItems.length==0))
	{	
		var LstPgnDiv=CreateDIV(dataDiv,'commonErrPopupDiv',mnuItmId+'errorDiv','','98%');
		LstPgnDiv.style.display="block";
		LstPgnDiv.style.width="600px";		
		LstPgnDiv.style.border="0px solid red";
		var leftPos=((window.document.body.clientWidth)-900)/2;			
		LstPgnDiv.style.left=leftPos+"px";
		LstPgnDiv.innerHTML="Oops! It seems you don't have a page layout set up for this page. Click<a href=\"javascript:SetPreferences ('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+data.PageCaption+"','"+PkValue+"')\"> here</a> to set up this page's layout. Impel will remember your layout for future logins.";
		return;
	}
	writeViewPageTopMenus(mainTD,data);
	CreateHIDDEN(dataDiv, '', mnuItmId+'-clipBoardId');
	CreateHIDDEN(dataDiv,'', 'pkval', PkValue);
	
    var phoneNumsCSV="";
	/*Create array of phone numbers*/
    for(var j=0; j<viewItems.length; j++)
	{
		var fieldValue=viewItems[j].dataColumn[1];	
		var fieldColName=viewItems[j].dataColumn[2];
		if(fieldValue && fieldColName && fieldColName.search("phone")>-1)
		{
			var phNums="";
			var numbers="";
			numbers = fieldValue.match(/[0-9]/g);
			var phY;
			if(numbers){if(numbers.length>10) phY=(numbers.length)-10;else phY=0;
			for(var phx=phY;phx<numbers.length;phx++)phNums+=numbers[phx];}
			if(phNums)
			{
			 if(phoneNumsCSV == "") phoneNumsCSV = "'"+phNums+"'";
			 else phoneNumsCSV = phoneNumsCSV +","+"'"+phNums+"'";
			}
		}
		if(tableName == 'ticket')
		{
			if (viewItems[j].dataColumn[0]== 'tkt_status_id')
			{
				CreateHIDDEN(dataDiv,'', 'tktStatusId', viewItems[j].dataColumn[8]);
			}
			if (viewItems[j].dataColumn[0]== 'name')
			{
				CreateHIDDEN(dataDiv,'', 'tktStatusName', viewItems[j].dataColumn[8]);
			}
			if (viewItems[j].dataColumn[0]== 'OrgName')
			{
				CreateHIDDEN(dataDiv,'', 'orgName', viewItems[j].dataColumn[8]);
			}
		}

	}
	
	var phNumsUrl="http://prod.impelcrm.in/impelMobile/custom/system/validate4DNC.json?phNums="+phoneNumsCSV;//+"&callback=?";
    if(phoneNumsCSV && phoneNumsCSV != ""){
		 $.ajax(
			{
				type: "GET",
				url:phNumsUrl,
				dataType: "jsonp",
				crossDomain:true,
				async:false,
			    jsonp : "callback",
                jsonpCallback: "parseRequest",          //parseRequest is the function name to be called on the request complete
				complete:function()
				{
					buildViewFields(data);
					//buildViewFields(data);	
					if(data.layout)
						var viewLayout=data.layout;
					else
						var viewLayout="tabs";
					var isBrowser = navigator.appVersion;
					if (isBrowser.indexOf('MSIE') > -1)
					{
							buildPanes(data);
					}
					else
					{
						if(viewLayout=="tabs")
							buildTabs(data);
						else	
							buildPanes(data);
					}
				}
			});
		}
		else 
	    { 
			DNDNumbers="";
			buildViewFields(data);	
			if(data.layout)
				var viewLayout=data.layout;
			else
				var viewLayout="tabs";
			var isBrowser = navigator.appVersion;
			if (isBrowser.indexOf('MSIE') > -1)
			{
					buildPanes(data);
			}
			else
			{
				if(viewLayout=="tabs")
					buildTabs(data);
				else	
					buildPanes(data);
			}
		}
	//updateRecentlyVisited(data);
}
function showDialogForImage(event)					//profile image 
	{
			document.getElementById("imageUploadDiv").innerHTML= "";
			var dialogTilte= 'Choose image for '+contactName;
			$('#imageUploadDiv').dialog({
				open: function()
					{ 		
						var remdrUrl = "/atCRM/custom/JSON/admin/profileImgUpload.html";
						$('#imageUploadDiv').append($("<iframe id='imageUploadFrame'/>").attr({src: remdrUrl,height:'95%',width:'97%',frameBorder:'0'}));;
						$('#imageUploadDiv').css('overflow','hidden');
					}, 
				modal: true,
				title: dialogTilte,
				width: 300,
				height:175,
				resizable:false,
				closeOnEscape: true
			});
			

	}

function writeViewPageTopMenus(mainTD,data)
{
	var topMenuDiv=CreateDIV(mainTD,'','viewPageTopMenuDiv','',pageWidth1+'px');
	topMenuDiv.style.display=pageTopMenuDiv;
	var page_topMenuAll=data.page_topMenu;
	var page_topMenu= new Array();
	for(var topMenu=0; topMenu<page_topMenuAll.length; topMenu++)
	{
		var mnuName=page_topMenuAll[topMenu].menu[0];	
		var mnuLink=page_topMenuAll[topMenu].menu[2];	
		//if(mnuName=="Layout")showViewLayout=true;
		if(mnuLink)page_topMenu.push(page_topMenuAll[topMenu]);
	}
	if(pageTopMenuDiv=="none")
	{
		var topMenuDiv1=CreateDIV(mainTD,'','viewPageTopMenuDiv1');
		var topMenuTbl = CreateTable(topMenuDiv1);
		var topMenuTbdy = CreateBody(topMenuTbl); 
		topMenuTbl.align="right";
		//topMenuTbl.style.marginTop="15px";
		var topMenuTr=CreateTR(topMenuTbdy);		
		if(data.EditUrl)
		var editURL=data.EditUrl;
		else var editURL= "";
		var pkVal=getParameterValue(editURL,'id');
		var getHyphenIndex=data.PageCaption.indexOf('-');
		var rcdName=data.PageCaption.substring(getHyphenIndex+1);
		var enttName=data.PageCaption.substring(0,getHyphenIndex);

		//Create menu to Edit Entity
		if(data.EditUrl)
		{
			var editTd=CreateTD(topMenuTr);	
			editUrl = data.EditUrl.replace(/\?/g,"~");
			editUrl = editUrl.replace(/&/g,"@");
			editUrl = editUrl.replace(/=/g,"*");
			var editAncTxt='#setUpPageParameters?viewUrl='+editUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu
			var editAnc=CreateA(editTd, "pageTopMenu", "tab_edit", editAncTxt, null, "Edit","Edit "+enttName);
		}
	}
	else
	{
		var topMenuTblDiv = CreateDIV(topMenuDiv,'','topMenuTblDiv');
		topMenuTblDiv.style.display=pageTopMenuDiv;
		var topMenuTbl = CreateTable(topMenuTblDiv,'','topMenuTbl');
		var topMenuTbdy = CreateBody(topMenuTbl); 
		topMenuTbl.align="right";
		//topMenuTbl.style.marginTop="-15px";
			if(data.tableName == 'Contact')
				{
				topMenuTbl.style.marginTop="15px";
				}
		var topMenuTr=CreateTR(topMenuTbdy);
		var prevTd=CreateTD(topMenuTr,'','prevTd');
		var nextTd=CreateTD(topMenuTr,'','nextTd');
		nextTd.valign="bottom";
		prevTd.setAttribute("valign","bottom");
		nextTd.setAttribute("valign","bottom");
		if(data.EditUrl)
		{
			var editURL=data.EditUrl;
			var pkVal=getParameterValue(editURL,'id');
			var getHyphenIndex=data.PageCaption.indexOf('-');
			var rcdName=data.PageCaption.substring(getHyphenIndex+1);
			var enttName=data.PageCaption.substring(0,getHyphenIndex);
		}
		else
		{
			var editURL= data.ViewUrl;
			var pkVal=getParameterValue(editURL,'id');
			var getHyphenIndex=data.PageCaption.indexOf('-');
			var rcdName=data.PageCaption.substring(getHyphenIndex+1);
			var enttName=data.PageCaption.substring(0,getHyphenIndex);
		}

		//Create menu to Edit Entity
		if(data.EditUrl)
		{
			var editTd=CreateTD(topMenuTr,'','editTD');	
			editUrl = data.EditUrl.replace(/\?/g,"~");
			editUrl = editUrl.replace(/&/g,"@");
			editUrl = editUrl.replace(/=/g,"*");
			var editAncTxt='#setUpPageParameters?viewUrl='+editUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu
			var editAnc=CreateA(editTd, "pageTopMenu", "tab_edit", editAncTxt, null, "Edit","Edit "+enttName);
		}
		else
		{
			var editTd=CreateTD(topMenuTr,'','editTD');	
			editUrl = data.ViewUrl.replace(/\?/g,"~");
			var editAncTxt='#setUpPageParameters?viewUrl='+editUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu
			var editAnc=CreateA(editTd, "pageTopMenu", "tab_edit", editAncTxt, null, "Edit","Edit "+enttName);
			document.getElementById('tab_edit').style.display = "none";
		}
		
		/****Add layout link if the hidden element in the homepage is set true***/
		var showLayout = document.getElementById("input_layout").value;
		if(showLayout == "true")
		{
			// Pass primary key value if its edit or view 
				if(data.PrimaryKeyValue)
				{
					PkValue=data.PrimaryKeyValue;
					PkValue=PkValue.replace(",","");
					PkValue=PkValue.split(".")
					PkValue=PkValue[0];
				}
			var prefsTd=CreateTD(topMenuTr,'','layoutTD');	
			var prefsAncTxt="javascript:SetPreferences('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+data.PageCaption+"','"+PkValue+"')";
			var prefsAnc=CreateA(prefsTd, "pageTopMenu", "tab_Prefs", prefsAncTxt, null, "Layout","Change page layout");
		}
		//Create Third level menu items //Added for fixing undefined error (&&page_topMenu[topMenu])
		for(var topMenu=0; topMenu<4&&page_topMenu[topMenu]; topMenu++)
		{
			var mnuName=page_topMenu[topMenu].menu[0];
			var mnuDesc=page_topMenu[topMenu].menu[1];
			var mnuLink=page_topMenu[topMenu].menu[2];
			var mnuOrder=page_topMenu[topMenu].menu[3];	
		
			if(mnuLink)
			{
			mnuLink=mnuLink.replace("pk",pkVal);		
			mnuLink=mnuLink.replace("recordName","'"+rcdName+"'"); 
			mnuLink=mnuLink.replace('rowName','"'+data.PageCaption+'"');
			mnuLink=mnuLink.replace('rowId','""');
			mnuLink=mnuLink.replace('entity','"'+data.tableName+'"'); //to pass entity name as param for page top menu's by Hamsa.
			mnuLink=mnuLink.replace('enttName','"'+data.EntityName+'"'); //to pass entity name as param for page top menu's by Kishore.
			mnuLink=mnuLink.replaceAll('\'','"');
			var topMnuTd=CreateTD(topMenuTr,'','customFunTD');
				if(mnuName=='Change stage')
				{
					var topMnuAnc=CreateA(topMnuTd, "pageTopMenu", "tab_"+mnuName, "javascript:void(0)", null, mnuName,mnuDesc);
					AddOnMouseOverEventListener(topMnuAnc,function (){changeOpportunityStage(pkVal)});
					AddOnMouseOutEventListener(topMnuAnc,function (){hideMenu()});
					CreateDIV(topMnuTd, '', 'stageChangeDiv', '',40);
				}
				else
				{
					var topMnuAnc=CreateA(topMnuTd, "pageTopMenu", "tab_"+mnuName, "javascript:executeContextualMenu();"+mnuLink, null, mnuName,mnuDesc);
				}
			}
		}


		 if(page_topMenu.length>4)
		 {
			var topMnuTd=CreateTD(topMenuTr);		
			topMnuTd.setAttribute("valign","bottom");
			var TopMenuDiv =  CreateDIV(topMnuTd, 'hover-menu', "categories-menu","More");		 
			TopMenuDiv.setAttribute("style","text-align:center;position:relative;width:50px;margin:0px;cursor:pointer");
			var TopMenuUL = CreateUL(TopMenuDiv, 'actions no-style');
			TopMenuUL.setAttribute("style","width:150px;position:absolute;display:none;border-width:0px;left:-55px");

			for(tm=4;tm<page_topMenu.length;tm++)
			{
				var mnuName=page_topMenu[tm].menu[0];
			var mnuDesc=page_topMenu[tm].menu[1];
			var mnuLink=page_topMenu[tm].menu[2];
			var mnuOrder=page_topMenu[tm].menu[3];	
			var editURL=data.EditUrl;
				if(mnuLink)
				{
				mnuLink=mnuLink.replace("pk",pkVal); 		
				mnuLink=mnuLink.replace("recordName","'"+rcdName+"'"); 
				mnuLink=mnuLink.replace('rowName','"'+data.PageCaption+'"');
				mnuLink=mnuLink.replace('rowId','""');
				mnuLink=mnuLink.replace('entity','"'+data.tableName+'"');  //to pass entity name as param for page top menu's by Hamsa.
				mnuLink=mnuLink.replaceAll('\'','"');
			
				var topMenuname=page_topMenu[tm].menu[0];
				if(page_topMenu[tm].length>12)
				topMenuname=topMenuname.substring(0,12)+"..";
				
				if(tm==parseInt((page_topMenu.length)-1))
				{	
					TopMenuUL.innerHTML += "<li style='width:100px;border-bottom-width:1px' class='actions' onclick='javascript:executeContextualMenu();"+mnuLink+"' title='"+page_topMenu[tm].menu[0]+"'><a class='actions' href='javascript:executeContextualMenu();"+mnuLink+"' style='width:100px;'>"+topMenuname+"</a></li>";
				}
				else
				{	
					TopMenuUL.innerHTML += "<li style='width:100px' class='' onclick='javascript:executeContextualMenu();"+mnuLink+"' title='"+page_topMenu[tm].menu[0]+"'><a class='' href='javascript:executeContextualMenu();"+mnuLink+"' style='width:100px;'>"+topMenuname+"</a></li";	
				}
				}
			}

			$(document).ready(function() 
			{
				function show() {				
					var menu = $(this);
					menu.children(".actions").slideDown();
				}

				function hide() { 
					var menu = $(this);
					menu.children(".actions").slideUp();
				}
			
				$(".hover-menu").hoverIntent({
					sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
					interval: 50,   // number = milliseconds for onMouseOver polling interval
					over: show,     // function = onMouseOver callback (required)
					timeout: 300,   // number = milliseconds delay before onMouseOut
					out: hide       // function = onMouseOut callback (required)
				});
			});
		}	
		if(viewPageEntt&&viewPageEntt!=data.tableName){if(viewPageTab)prevViewPageTab=viewPageTab;viewNavIds="";viewPageTab="";
		if(mnuItmId&&document.getElementById(mnuItmId+'-URL'))currListURL4View=document.getElementById(mnuItmId+'-URL').value;}
		viewPageEntt=data.tableName;
		if(!currListURL4View)
		{if(mnuItmId&&document.getElementById(mnuItmId+'-URL'))currListURL4View=document.getElementById(mnuItmId+'-URL').value;}

		if(viewNavIds=="")
			getListItemIds(data,enttName);
		else
			writePrevNext(data,enttName);
	}
}

function getListItemIds(data,enttName,prevNext)
{
	var tempIds="";
	if(currListURL4View)
	{
		var pageParam='page__number__1';
		if(currListURL4View.indexOf('/JSON/list/container.htm')>0&&document.getElementById(subMnuItmId+'-reportUrl'))
		{
			currListURL4View=document.getElementById(subMnuItmId+'-reportUrl').value;
			pageParam='page_no';
		}
		var currPageNo=parseInt(getParameterValue (currListURL4View,pageParam));
		if(!currPageNo)currPageNo=1;

		if(prevNext=="prev")currPageNo--;
		else if(prevNext=="next"){currPageNo++;if(viewNavLastEvent=="prev")currPageNo++;}
		if(currPageNo>0)
		currListURL4View=changeParameterValue (currListURL4View,pageParam,currPageNo);

		if(currPageNo>0&&currPageNo<=maxPageNo4List)
		$.ajax({
		type: "GET",
		url: currListURL4View,
		success: function (doc)
		{
			viewNavLastEvent=prevNext;
			doc=ReplaceAll(doc,"\t","");
			doc=ReplaceAll(doc,"\n"," ");
			doc=ReplaceAll(doc,"\r","");
			doc = JSON.parse(doc, function (key, value) 
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
			if(data.tableName==doc.TableName)
			{
				var RowData=doc.RowData; 
				maxPageNo4List=doc.LinkCount;
				for(var rows=0; rows<RowData.length; rows++)
				{	if(viewNavIds)
					{
						if(prevNext=="prev"){if(tempIds)tempIds=tempIds+","+RowData[rows].pkId;else tempIds=RowData[rows].pkId;}
						else viewNavIds=viewNavIds+","+RowData[rows].pkId;
					}
					else
						viewNavIds=RowData[rows].pkId;
				}
				if(prevNext=="prev")
				viewNavIds=tempIds+','+viewNavIds;
				writePrevNext(data,enttName);
			}
		}
		});
	}
}

function writePrevNext(data,enttName)
{
	var viewURL=data.ViewUrl;
	//commented below line by Govardhan
	//var pkVal=getParameterValue(viewURL,'id');
	//written below line to replace the above commented one.
	var pkVal=data.PrimaryKeyValue;

	var nextId=viewNavIds.slice(viewNavIds.indexOf(pkVal)+(pkVal.length+1));
	if(nextId.indexOf(',')>0)
		nextId=nextId.slice(0,nextId.indexOf(','));
	else
		nextId=nextId.slice(0);

	var nextURL=viewURL.replace(pkVal,nextId);

	if(viewNavIds.indexOf(pkVal)>0)
	{
		var prevId=viewNavIds.slice(0,viewNavIds.indexOf(pkVal)-1);
		prevId=prevId.slice(prevId.lastIndexOf(',')+1);
	}
	var prevURL=viewURL.replace(pkVal,prevId);

	if(!prevId)getListItemIds(data,enttName,'prev');else if(!nextId)getListItemIds(data,enttName,'next');
	if(prevId)	
	document.getElementById('prevTd').innerHTML="<div title='Previous "+enttName+"'  class='prevNextDiv' onclick=\"moveRecord ('"+prevURL+"')\"><span class='prevSpan'></span></div>";
	else
	document.getElementById('prevTd').innerHTML="<div title='Previous "+enttName+"'  class='prevNextDiv'><span class='prevGraySpan'></span></div>";

	if(nextId)
	document.getElementById('nextTd').innerHTML="<div title='Next "+enttName+"' class='prevNextDiv' onclick=\"moveRecord ('"+nextURL+"')\"><span class='nextSpan'></span></div>";
	else
	document.getElementById('nextTd').innerHTML="<div title='Next "+enttName+"' class='prevNextDiv'><span class='nextGraySpan'></span></div>";
}

function moveRecord(url)
{
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}
var DNDNumbers;
function parseRequest(response)
            {
                try 
                {
					DNDNumbers=response.getValues;
                }
                catch(an_exception) 
                {
                    alert("Error");
                }
            }
function buildViewFields(data)
{
	var mainTD=document.getElementById("360ViewTd");
	var numFieldsWritten=0;
	var errorDiv=CreateDIV(mainTD,"jsonErrorDiv",'viewErrorDiv');	
	errorDiv.style.width="300px";
	var click2Edit=false;
 
	var colWidths=((pageWidth1-200)/3);
	var headColWidth=colWidths/3;
	var contColWidth=colWidths-headColWidth;
	var firFieldName=viewItems[0].dataColumn[0];
	if((firFieldName!="n")&&((firFieldName.split('~)').length)!=2))
	{
		var sectionDivMain=CreateDIV(mainTD,'','','',pageWidth1+'px');		
		var sectionDiv=CreateDIV(sectionDivMain,"sectionDiv","sectionDiv","");			
		sectionDivMain.style.marginTop="1px"; // bfore it was --> sectionDivMain.style.marginTop="25px";
		fieldTable=CreateTable(sectionDiv,"","","","0","3");
		fieldTable.style.width="100%";
		fieldTable.cellPadding="3";
		fieldTblBdy=CreateBody(fieldTable,"","");
	} 
	for(var x=0; x<viewItems.length; x++)
	{
		var fldLabel=viewItems[x].dataColumn[0];
		var fldValue=viewItems[x].dataColumn[1];	
		var fldColName=viewItems[x].dataColumn[2];		
	    var fldPriKeyVal=viewItems[x].dataColumn[9];	
		var fldExtType=viewItems[x].dataColumn[8];
		var fldPriKeyColm=viewItems[x].dataColumn[10];
       
	    if (tableName == "ticket") 
		{
			var viewLblId = 'lbl_'+viewItems[x].dataColumn[13]; 
			var viewValId = 'val_'+viewItems[x].dataColumn[13];
			var viewFldId = 'fld_'+viewItems[x].dataColumn[13];
		}
		else 
		{
			var viewLblId = 'view_lbl_'+x; 
			var viewValId = 'view_val_'+x;
			var viewFldId = 'view_fld_'+x;
		}
		if(viewItems[x].dataColumn.length>1)
		{ 				
			if(numFieldsWritten%noOfColumns==0)
			fieldTblTr=CreateTR(fieldTblBdy);

			var fldNum=Math.floor(x/noOfColumns);	
			var fieldTblTd=CreateTD(fieldTblTr,"ItemLabelView");
			fieldTblTd.innerHTML = fldLabel;				
			fieldTblTd.style.width="13%";		
			
			var fieldElemTd=CreateTD(fieldTblTr,"flexigrid");
			if(fldValue)
			{
				switch(fldExtType)
				{	
					case "decimal": 
					case "double": 
					case "float": 
					case "money":
					case "Decimal":
									fldValue=ReplaceAll(fldValue,",","");
									fldValue=parseFloat(fldValue).toFixed(2);		
									fldValue=FormatNumber(fldValue,1,2);
									break;
					
					case "Integer":
					case "integer": 
									fldValue=ReplaceAll(fldValue,",","");
									fldValue=parseFloat(fldValue).toFixed(0);		                
									fldValue=FormatNumber(fldValue,1,0);
									break;

//08/06/2011 10:51 AM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.

					case "dateOnly":
					case "Date":
									fldValue=parseString_Date(fldValue,'dd/MM/yyyy');
									var d1 = new Date (fldValue);
									d1.setMinutes (d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
									fldValue=dateFormat(d1, "dd-mmm-yyyy");
									var fldValueWithTimeZone = fldValue+' '+utzToShow;
									fldValue = fldValueWithTimeZone;	
									break;
//08/06/2011 10:51 AM By Vadiraj	

					case "timeOnly": 
					case "dateAndTime":						
					case "DateTime":
									fldValue=parseString_Date(fldValue,'dd/MM/yyyy');
									var d1 = new Date (fldValue);
									d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
//									fldValue=dateFormat(fldValue, "dd-mmm-yyyy, hh:MM TT");
									fldValue=dateFormat(d1, "dd-mmm-yyyy, hh:MM TT");
									var fldValueWithTimeZone = fldValue+' '+utzToShow;
									fldValue = fldValueWithTimeZone;	
//									alert(fldValueWithTimeZone);
//08/06/2011 10:51 AM By Vadiraj									
									break;
					case "Multi":
									fldValue=ReplaceAll(fldValue,"~)","<br>");
					case "multiLevelDropdown":
									var lastIndex=fldValue.lastIndexOf(">>")>0?fldValue.lastIndexOf(">>")+2:0;
									fldValue=fldValue.substring(lastIndex);
					case "Check":
						            if(fldValue == "1") fldValue="Yes";
					                else if(fldValue == "0") fldValue="No";
					
				}
			}
			
			//Created by / Created date / Modified by / Modified date /guid / external guid
			var colm=viewItems[x].dataColumn[2].toLowerCase();
				if((colm.match('created')&&!colm.match('created_at_branch'))||(colm.match('modified'))||(colm.match('guid'))||(colm.match('external_guid')))
				viewItems[x].dataColumn[4]='label';
			var imgUrl;
			var imgTitle;
			if(DNDNumbers){
			var DNDNumsArray=DNDNumbers.split(",");
			var dndLen=DNDNumsArray.length;
			for(var t=0;t<parseInt(dndLen);t++)
			{
				var pagePhNumber="";
						var numbers="";
				numbers = fldValue.match(/[0-9]/g);
				if(numbers){if(numbers.length>10)var phY=(numbers.length)-10;else phY=0;
				for(var phX=phY;phX<numbers.length;phX++)pagePhNumber+=numbers[phX];}

				var phNumber=DNDNumsArray[t].split("_")[0];
				var listing_agency=DNDNumsArray[t].split("_")[1];
				if(pagePhNumber == phNumber){
                   imgUrl = '/atCRM/images/JSON/dndImg4.jpg';
				   imgTitle = 'This number is listed in the Do Not Call registry by '+listing_agency;
				   break;
				}
				else{
				   imgUrl = '/atCRM/images/ServiceCallIcon.png';
				   imgTitle = 'Call this number';
				}
			}
			}
			else 
			{
				imgUrl = '/atCRM/images/ServiceCallIcon.png';
				imgTitle = 'Call this number';
			}
			if(data.fieldLevelEdit=="YES")
			click2Edit=true;

			if(data.territoryReadAccess==1)			
			click2Edit=false;
            
			if((!fldPriKeyVal||fldPriKeyVal=='')&&fldPriKeyColm!='udef_data_id') click2Edit=false;
			if(fldValue)
			var click2Call="";
			    var fldLblSpanId;
			    if(data.click2Call && data.click2Call!="" && fldColName && data.CallDtl && fldColName.search("phone")>-1)
				{
                    click2Call=data.click2Call;
					click2CallExtUrl=click2Call.split('--');
				}
				else if(data.click2Call && data.click2Call!="" && fldColName && fldColName.search("phone")>-1)
				{
					click2Call=data.click2Call;
					click2CallExtUrl=click2Call.split('--');
				}

			 
				if(fldValue)
				{
					/*Click to call feature added here*/
					var callDtl=data.CallDtl;
					var cti_provider=data.cti_provider;
                    /*Click to call for knowlarity by Dony*/
					if(cti_provider == "knowlarity" && click2Call != "" && callDtl != "")
					{
                        var callDtlSplit=callDtl.split("__");
						var srNumber=callDtlSplit[0];
						var apikey=callDtlSplit[1];
                        click2CallUrl=ReplaceAll(click2CallExtUrl[0],"api_key_val", apikey);
						click2Call=ReplaceAll(click2CallUrl,"srNumber",srNumber);
						var agentNum=click2CallExtUrl[1];
						var agentNumLen=parseInt(agentNum.toString().length);
						if(agentNumLen > 10) {
							if(agentNum.toString()[0]=='0') agentNum = agentNum.toString().replace('0','+91');
							else if(agentNum.toString().substr(0,2) =="91"){ 
								agentNum='+'+agentNum;
							}
						}
						else if(agentNumLen == 10) agentNum = '+91'+agentNum.toString();
						var customerNum;
						var numLen=parseInt(fldValue.length);
						if(numLen > 10) {
							if(fldValue.toString()[0]=='0') customerNum = fldValue.toString().replace('0','+91');
							else if(fldValue.toString().substr(0,2) =="91"){ 
								customerNum='+'+fldValue;
							}
						}
						else if(numLen == 10) customerNum='+91'+fldValue;
						var fldDispLblSpan=CreateSPAN(fieldElemTd, '', viewLblId);
						var fldLblSpan=CreateSPAN(fldDispLblSpan, '', '', fldValue);
						fldLblSpan.innerHTML+="&nbsp;";
						var fldVlick2Call=CreateA(fldDispLblSpan, "", "", "javascript:callKnowlarity('"+click2Call+"','"+agentNum+"','"+customerNum+"','"+apikey+"','"+srNumber+"')");
						var phoneImg=CreateIMG(fldVlick2Call, '', '', imgUrl,imgTitle);

						/*Set position for image if its DNC image*/
						var isDeleteImg=imgUrl.search("dndImg4.jpg");
						isDeleteImg=parseInt(isDeleteImg);
						if(isDeleteImg>-1){
							phoneImg.style.position="relative";
							phoneImg.style.top="2px";
						}
						/*Code ends here for set position*/
					}
					if(cti_provider == "ozonetel" && click2Call != "" && callDtl != "")
					{
                        var callDtlSplit=callDtl.split("__");
						var srNumber=callDtlSplit[0];
						var apikey=callDtlSplit[1];
                        click2CallUrl=ReplaceAll(click2CallExtUrl[0],"api_key_val", apikey);
						click2Call=ReplaceAll(click2CallUrl,"srNumber",srNumber);
						var agentNum=click2CallExtUrl[1];
						var agentNumLen=parseInt(agentNum.toString().length);
						if(agentNumLen > 10) {
							if(agentNum.toString()[0]=='0') agentNum = agentNum.toString().replace('0','+91');
							else if(agentNum.toString().substr(0,2) =="91"){ 
								agentNum='+'+agentNum;
							}
						}
						else if(agentNumLen == 10) agentNum = '+91'+agentNum.toString();
						var customerNum;
						var numLen=parseInt(fldValue.length);
						if(numLen > 10) {
							if(fldValue.toString()[0]=='0') customerNum = fldValue.toString().replace('0','+91');
							else if(fldValue.toString().substr(0,2) =="91"){ 
								customerNum='+'+fldValue;
							}
						}
						else if(numLen == 10) customerNum='+91'+fldValue;
						var fldDispLblSpan=CreateSPAN(fieldElemTd, '', viewLblId);
						var fldLblSpan=CreateSPAN(fldDispLblSpan, '', '', fldValue);
						fldLblSpan.innerHTML+="&nbsp;";
						var fldVlick2Call=CreateA(fldDispLblSpan, "", "", "javascript:callKnowlarity('"+click2Call+"','"+agentNum+"','"+customerNum+"','"+apikey+"','"+srNumber+"')");
						var phoneImg=CreateIMG(fldVlick2Call, '', '', imgUrl,imgTitle);

						/*Set position for image if its DNC image*/
						var isDeleteImg=imgUrl.search("dndImg4.jpg");
						isDeleteImg=parseInt(isDeleteImg);
						if(isDeleteImg>-1){
							phoneImg.style.position="relative";
							phoneImg.style.top="2px";
						}
						/*Code ends here for set position*/
					}
					/*This 'If' section is created to connect Exotel customer and agent*/
					else if(click2Call!=""&& callDtl !="" && callDtl){

						var callDtlSplit=callDtl.split("_");
						var extl_sid=callDtlSplit[0];
						var extl_token=callDtlSplit[1];
                        click2CallUrl=ReplaceAll(click2CallExtUrl[0],"~exotel_sid~", extl_sid);
						click2Call=ReplaceAll(click2CallUrl,"~exotel_token~",extl_token);
						var agentNum=click2CallExtUrl[1];
						var agentNumLen=agentNum.toString().length;
						if(agentNumLen==10&&agentNum.toString()[0]=='9') agentNum="0"+agentNum;
						var customerNum;
						var numLen=parseInt(fldValue.length);
						if(numLen > 10) customerNum=fldValue;
						else if(numLen == 10) customerNum='0'+fldValue;
						//var lblSpanElem=document.getElementById(fldLblSpanId);
						var fldDispLblSpan=CreateSPAN(fieldElemTd, '', viewLblId);
						var fldLblSpan=CreateSPAN(fldDispLblSpan, '', '', fldValue);
						fldLblSpan.innerHTML+="&nbsp;";
						var fldVlick2Call=CreateA(fldDispLblSpan, "", "", "javascript:callExotel('"+click2Call+"','"+agentNum+"','"+customerNum+"')");
						var phoneImg=CreateIMG(fldVlick2Call, '', '', imgUrl,imgTitle);
						/*Set position for image if its DNC image*/
						var isDeleteImg=imgUrl.search("dndImg4.jpg");
						isDeleteImg=parseInt(isDeleteImg);
						if(isDeleteImg>-1){
							phoneImg.style.position="relative";
							phoneImg.style.top="2px";
						}
						/*Code ends here for set position*/
					}
					/*First if ends here*/
					else if(click2Call!="")
					{
						click2CallUrl=ReplaceAll(click2CallExtUrl[0],"#phone#", fldValue);
						click2Call=ReplaceAll(click2CallUrl,"#extension#",click2CallExtUrl[1]);
						var fldDispLblSpan=CreateSPAN(fieldElemTd, '', viewLblId);
						var fldLblSpan=CreateSPAN(fldDispLblSpan, '', '', fldValue);
						fldLblSpan.innerHTML+="&nbsp;";
						var fldVlick2Call=CreateA(fldLblSpan, '', '', 'javascript:makeClick2Call(\''+click2Call+'\')');
						var phoneImg=CreateIMG(fldVlick2Call, '', '', imgUrl,imgTitle);
						/*Set position for image if its DNC image*/
						var isDeleteImg=imgUrl.search("dndImg4.jpg");
						isDeleteImg=parseInt(isDeleteImg);
						if(isDeleteImg>-1){
							phoneImg.style.position="relative";
							phoneImg.style.top="2px";
						}
						/*Code ends here for set position*/
					}
				else
					{
						var fldDispLblSpan=CreateSPAN(fieldElemTd, '', viewLblId);
						var fldLblSpan=CreateSPAN(fldDispLblSpan, '', 'fldLbl_'+viewLblId, fldValue);
						fldLblSpan.innerHTML+="&nbsp;";
						if(fldValue && fldColName && fldColName.search("phone")>-1)
						{
							var isDeleteImg=imgUrl.search("dndImg4.jpg");
							isDeleteImg=parseInt(isDeleteImg);
							if(isDeleteImg>-1){
								var deleteImg=CreateIMG(fldDispLblSpan, '', '', imgUrl,imgTitle);
								deleteImg.style.position="relative";
								deleteImg.style.top="2px";
							}
							else
							{
								var deleteImg=CreateIMG(fldDispLblSpan, '', '', '/atCRM/images/JSON/tick_green.gif','This number is not listed in the Do Not Call registry');
								deleteImg.style.position="relative";
								deleteImg.style.top="2px";
							}
						}
					}
			} 
			else if(click2Edit==true && (viewItems[x].dataColumn[4]!="label"))
				{
					var fldLblSpan=CreateDIV(fieldElemTd, '', viewLblId, 'Click to edit');fldLblSpan.style.color='#d6d6d6';
				fldLblSpan.style.wordWrap="break-word";
				fldLblSpan.style.width=contColWidth+"px";
				}
			

			if(click2Edit==true && (viewItems[x].dataColumn[4]!="label"))
			{	
				
				fldLblSpan.style.cursor='pointer';
				var fldValSpan=CreateSPAN(fieldElemTd, '', viewValId);
				var url= data.ViewUrl;
				var mainPK=getParameterValue(url,'id');
				//fldLblSpan.addEventListener('click', test, false);
				AddClickEventListener(fldLblSpan, (function(x,mainPK) {return function() {createField2Edit(x,mainPK);};})(x,mainPK));
			}

			fieldElemTd.style.width="20%";
			numFieldsWritten++;
		}
		else
		{
			if((firFieldName!="n")&&((firFieldName.split('~)').length)!=2))
			if(numFieldsWritten%noOfColumns==0)
			fieldTblTr=CreateTR(fieldTblBdy);

			if(fldLabel=="#")
			{
				var fieldTblTd=CreateTD(fieldTblTr,"WhiteItemLabel","fieldLblTd",2);
				numFieldsWritten++;				
			}
			else if(fldLabel=="n")
			{
				numFieldsWritten=0;
				var sectionDivMain=	(mainTD);
				var sectionDiv=CreateDIV(sectionDivMain,"sectionDiv","","");			
				sectionDivMain.style.marginTop="15px";
				fieldTable=CreateTable(sectionDiv,"","","","0","3");
				fieldTable.style.width="100%";
				fieldTable.cellPadding="3";
				fieldTblBdy=CreateBody(fieldTable,"","");				
			}
			else if((fldLabel.split('~)').length)==2)
			{
				var desc=fldLabel.split('~)')[1];	
				var exp = desc.split('~(')[1];
				desc=desc.split('~(')[0];
				numFieldsWritten=0;				
				var sectionDivMain=CreateDIV(mainTD);
				var sectionDivHdr=CreateDIV(sectionDivMain,'sectionDivHdr','sectionDivHdr');	
				var sectionDiv=CreateDIV(sectionDivMain,"sectionDiv","view_sec_div"+x,"");			
				sectionDivHdr.innerHTML=desc;
				sectionDivMain.style.marginTop="15px";

				fieldTable=CreateTable(sectionDiv,"",'view_sec_tbl_'+x,"","0","3");
				fieldTable.style.width="100%";
				fieldTable.cellPadding="3";
				fieldTblBdy=CreateBody(fieldTable,"","");
				if(exp=="C")
				{
					fieldTable.style.display="none";	
					sectionDiv.style.display="none";	
					sectionDivHdr.innerHTML+='<img id="view_sec_img_'+x+'" name="view_sec_img_'+x+'" src="/atCRM/stylesheets/JSON/jquery/images/uup.png" title="Expand" style="float: left;padding-right:8px;margin-top:5px;">';				
				}
				else
				{
					fieldTable.style.display="";	
					sectionDiv.style.display="";	
					sectionDivHdr.innerHTML+='<img id="view_sec_img_'+x+'" name="view_sec_img_'+x+'" src="/atCRM/stylesheets/JSON/jquery/images/ddn.png" title="Expand" style="float: left;padding-right:8px;margin-top:5px;">';
				}
				AddClickEventListener(sectionDivHdr,(function(x) {return function()
					{ 					
					document.getElementById('view_sec_tbl_'+x).style.display="";					
					expandSection('view_sec_img_'+x,'view_sec_div'+x);
					};})(x)); 
					sectionDivHdr.style.cursor="pointer";				}
		}		
	}
	if(numFieldsWritten%noOfColumns!=0)
	{
		var colSpan=(noOfColumns-(numFieldsWritten%noOfColumns))*2;
		var fieldTblTd=CreateTD(fieldTblTr,"WhiteItemLabel","fieldLblTd",colSpan);
	}
	if(formLoadFunction)
	{
		var loadfunct=formLoadFunction.split('~)');
		for(var i=0; i<loadfunct.length; i++)
		{
			if(loadfunct[i])
			{
				var q=loadfunct[i].indexOf('('); 
				var params="";			
				var q1=loadfunct[i].indexOf('{'); 
				if(q>0&&q1<0)
				{
					params=loadfunct[i].substring(q+1,(loadfunct[i].length)-1); 
					params=formName+','+params;
					var params2use=params.split(',');
					loadfunct[i]=loadfunct[i].substring(0,q); 
					var fnName=formLoadFunction.substring(0,q); 
				}
				dispatch(loadfunct[i],params2use);
			}
		}
	}
}

function createField2Edit(x,mainPK,checkFalg)
{
	var fldLabel=viewItems[x].dataColumn[0];
	var fldValue=viewItems[x].dataColumn[1];	
	var fldColumn=viewItems[x].dataColumn[2];
	var fldTable=viewItems[x].dataColumn[3];
	var fldType=viewItems[x].dataColumn[4];
	var fldForignKeyTbl=viewItems[x].dataColumn[5];
	var fldSmartSuggURL=viewItems[x].dataColumn[6];
	var fldDbVal=viewItems[x].dataColumn[7];
	var fldExtType=viewItems[x].dataColumn[8];
	var fldPriKeyVal=viewItems[x].dataColumn[9];
	var fldPriKeyColumn=viewItems[x].dataColumn[10];
	var fldIsNullable=viewItems[x].dataColumn[11];
	var fldMaxLength=viewItems[x].dataColumn[12];
	var paramName=viewItems[x].dataColumn[13];
	var readNodeId=viewItems[x].dataColumn[14];
	var fldDbValText;
	if(lastElem!="x")
	{
//Vadiraj for now only Ticket view JSON delivers node numbers, so for only ticket entity span id will be the node numbers. Will make this a generic change later.
		if (tableName == "ticket")
		{
			document.getElementById('lbl_'+viewItems[lastElem].dataColumn[13]).style.display='block';	
			document.getElementById('val_'+viewItems[lastElem].dataColumn[13]).innerHTML='';
			document.getElementById('val_'+viewItems[lastElem].dataColumn[13]).style.display='none';
		}
		else
		{
			document.getElementById('view_lbl_'+lastElem).style.display='block';	
			document.getElementById('view_val_'+lastElem).innerHTML='';
			document.getElementById('view_val_'+lastElem).style.display='none';
		}
	}
	lastElem=x;

	if (tableName == "ticket") 
	{
		var viewLblId = 'lbl_'+viewItems[x].dataColumn[13]; 
		var viewValId = 'val_'+viewItems[x].dataColumn[13];
		var viewFldId = 'fld_'+viewItems[x].dataColumn[13];
	}
	else 
	{
		var viewLblId = 'view_lbl_'+x; 
		var viewValId = 'view_val_'+x;
		var viewFldId = 'view_fld_'+x;
	}


	document.getElementById(viewLblId).style.display='none';	
	document.getElementById(viewValId).style.display='block';
	document.getElementById(viewValId).innerHTML='';
	valFld=document.getElementById(viewValId);	
	switch (fldType)
	{ 
		case "textBox":
		case "Text":		
						fldObj=CreateTEXTBOX(valFld, "inputFieldClass", viewFldId, fldValue, fldMaxLength);
						fldObj.focus();
					break;
		
		case "dropDownList":	
						fldDbVal=ReplaceAll(fldDbVal,",","");
						valFld.innerHTML='<span><img border="0" src="/atCRM/images/loading5.gif"></span>';
						var url2Hit=zcServletPrefix+"/custom/JSON/smartSuggest/dropDownDataForView.htm?entity="+fldForignKeyTbl+'&page__size__401=0';
							$.ajax(
							{
								type: "GET",
								url: encodeURI(url2Hit),
								dataType: "json",
								async:false,
								success: function (pckDoc)
								{
									valFld.innerHTML='';
									fldObj=CreateSelectBox(valFld, "inputFieldClass", viewFldId);
									var dataArray=pckDoc['PickListItems'].listData;		
									for(var i=0; i<dataArray.length; i++)
									{										
										val=dataArray[i].columnData.split('~)');
										fldObj[i]=new Option(val[1], val[0]);
										if(fldDbVal==val[0])fldObj[i].selected = true;
									}
									w = document.getElementById(viewFldId).selectedIndex;
									fldDbValText = document.getElementById(viewFldId).options[w].text;
									if(fldColumn=="OpportunityStage_id")
									{
                                       beforeSelectIndex=document.getElementById(viewFldId).selectedIndex;
									}
								}
							});						
						fldObj.focus();
					break;

		case "TextArea":
		case "textArea":
						fldObj=CreateTEXTAREA(valFld, "inputFieldClass", viewFldId, fldValue,fldMaxLength);		
						fldObj.focus();
					break;	
					
		case "Integer":
						var fldValue=ReplaceAll(fldValue,",","");
						fldObj=CreateTEXTBOX(valFld, "inputFieldClass", viewFldId, fldValue,fldMaxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event);");						
						fldObj.focus();
					break;
				
		case "Decimal":
						var fldValue=ReplaceAll(fldValue,",","");
						fldObj=CreateTEXTBOX(valFld, "inputFieldClass", viewFldId, fldValue,fldMaxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event,true);");
						fldObj.focus();
					break;

		case "checkBox": 
		case "Check":   
			            
						fldObj=CreateCheckbox(valFld, "", viewFldId, fldValue);
						/*Second time edit of the checkbox*/
						if(checkFalg && checkFalg =="Yes") fldObj.checked=true;
						else if(checkFalg && checkFalg =="No") fldObj.checked=false;
						/*first time edit of the checkbox*/
						else if(fldValue && (fldValue.toLowerCase() == "yes" || fldValue == "1")) fldObj.checked=true;
						else fldObj.checked=false;
						fldObj.focus();
					break;	

		case "Multi":
		case "Combo":
						if(fldType=="Multi"){fldname='virtual'+viewFldId;var multi=true;} else {fldname=viewFldId;var multi="";}
						valFld.innerHTML='<span><img border="0" src="/atCRM/images/loading5.gif"></span>';
						var url2Hit=zcServletPrefix+"/custom/JSON/smartSuggest/custom_pckLstValues.htm?enttName="+fldTable+"&enttClmn="+fldColumn;
						$.ajax(
						{
							type: "GET",
							url: encodeURI(url2Hit),
							dataType: "json",
							async:false,
							success: function (pckDoc)
							{   
								valFld.innerHTML='';
								fldObj=CreateSelectBox(valFld, "inputFieldClass",fldname, fldValue,multi);	
								var column_value=pckDoc.PickListItems;
								var j=0;
								if(fldType=="Combo")
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
										if(fldType=="Combo")
										{
											if(fldValue==lst[i]){fldObj[j].selected = true;}
										}
										else
										{
											var vals=fldValue.split('~)');
											for(var k=0; k<vals.length;k++)
											if(vals[k]==lst[i]){fldObj[j].selected = true;}
										}
									}
								}
							}
						});
						if(fldType=="Multi")
						{
							AddBlurEventListener(fldObj, function(){getAllSelected(fldname)})
							CreateHIDDEN(valFld , "", viewFldId ,"");
						}
						fldObj.focus();
					break;	
		
		case "multiLevelDropdown":	
						if(fldValue){var lastIndex=fldValue.lastIndexOf(">>")>0?fldValue.lastIndexOf(">>")+2:0; var fldVal2Disp=fldValue.substring(lastIndex);}else var fldVal2Disp='...';
						var elemId=viewFldId;
						valFld.innerHTML="<input type='hidden' id='"+elemId+"' value='"+fldValue+"'><span id=\""+elemId+"-mnuspan\" class='dropDownMenuSpan'><a href='javascript:showMultiLevelDropData(\""+elemId+"-mnu\",\""+fldTable+"\",\""+fldColumn+"\")' id=\""+elemId+"-href\" class='dropDownMenuHref'>"+fldVal2Disp+"</a></span>";	
					break;
				
		case "Date":
		case "dateOnly":
//08/06/2011 6:10 PM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.
						if (fldValue)
						{
							fieldvaldateArr = fldValue.split('/');
							fieldvaldatetIme = fieldvaldateArr[1]+'/'+fieldvaldateArr[0]+'/'+fieldvaldateArr[2];
							var d1 = new Date (fieldvaldatetIme);
							d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
							fldValue=dateFormat(d1, "dd/mm/yyyy");
						}
						
//08/06/2011 6:10 PM By Vadiraj

						valFld.innerHTML="<table cellpadding='0' cellspacing='0'><tr><td><input type='hidden' id='view_fld_"+x+"'/><input id='view_fld_"+x+"_date_value' class='inputFieldClass' onblur=\"changeDate('view_fld_"+x+"_date_value');\" size=12 maxlength=12 style='width:100px' value='"+fldValue.replace(' 00:00:00','')+"'/></td><td><img src='/atCRM/images/calendar.gif' id='view_fld_"+x+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td></tr></table>";
						new Calendar({
							  inputField: viewFldId+'_date_value',
							  dateFormat: "%d/%m/%Y", 
							  trigger: viewFldId+"_cal",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {this.hide();}
						});	
					break;	

		case "timeOnly":			          
						valFld.innerHTML="<table cellpadding='0' cellspacing='0'><tr><td><div class='combo' ><input id='view_fld_"+x+"' class='inputFieldClass' size=10 maxlength=8 style='width:70px' value='"+fldValue.slice(11)+"'/><ul><li>12:00 AM</li><li>12:30 AM</li><li>01:00 AM</li><li>01:30 AM</li><li>02:00 AM</li><li>02:30 AM</li><li>03:00 AM</li><li>03:30 AM</li><li>04:00 AM</li><li>04:30 AM</li><li>05:00 AM</li><li>05:30 AM</li><li>06:00 AM</li><li>06:30 AM</li><li>07:00 AM</li><li>07:30 AM</li><li>08:00 AM</li><li>08:30 AM</li><li>09:00 AM</li><li>09:30 AM</li><li>10:00 AM</li><li>10:30 AM</li><li>11:00 AM</li><li>11:30 AM</li><li>12:00 PM</li><li>12:30 PM</li><li>01:00 PM</li><li>01:30 PM</li><li>02:00 PM</li><li>02:30 PM</li><li>03:00 PM</li><li>03:30 PM</li><li>04:00 PM</li><li>04:30 PM</li><li>05:00 PM</li><li>05:30 PM</li><li>06:00 PM</li><li>06:30 PM</li><li>07:00 PM</li><li>07:30 PM</li><li>08:00 PM</li><li>08:30 PM</li><li>09:00 PM</li><li>09:30 PM</li><li>10:00 PM</li><li>10:30 PM</li><li>11:00 PM</li><li>11:30 PM</li></ul></div></td></tr></table>";
						new TimeCombo(viewFldId,'#FFFFFF','#FFFFFF');
						changeTime(viewFldId);
						valFld.style.fontFamily="Tahoma, Verdana";
						valFld.style.fontSize="11px";
					break;
				
		case "dateAndTime":
		case "DateTime":
//08/06/2011 6:10 PM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.
						if (fldValue)
						{	
							var fieldvalArr = fldValue.split(' ');
							var fieldvaldate  = fieldvalArr[0];
							var fieldvaldateArr = fieldvaldate.split('/');
							var fieldvaldatetIme = fieldvaldateArr[1]+'/'+fieldvaldateArr[0]+'/'+fieldvaldateArr[2]+' '+fieldvalArr[1];
							var d1 = new Date (fieldvaldatetIme);
							d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
							fldValue=dateFormat(d1, "dd/mm/yyyy HH:MM:ss");
						}

//08/06/2011 6:10 PM By Vadiraj

						valFld.innerHTML="<table cellpadding='0' cellspacing='0'><tr><td><input type='hidden' id='view_fld_"+x+"'/><input id='view_fld_"+x+"_date_value' class='inputFieldClass' onblur=\"changeDate('view_fld_"+x+"_date_value');\" size=12 maxlength=12 style='width:80px' value='"+fldValue.slice(0,10)+"'/></td><td><img src='/atCRM/images/calendar.gif' id='view_fld_"+x+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td><td><div class='combo' ><input id='view_fld_"+x+"_time_value' class='inputFieldClass' size=10 maxlength=8 style='width:70px' value='"+fldValue.slice(11)+"'/><ul><li>12:00 AM</li><li>12:30 AM</li><li>01:00 AM</li><li>01:30 AM</li><li>02:00 AM</li><li>02:30 AM</li><li>03:00 AM</li><li>03:30 AM</li><li>04:00 AM</li><li>04:30 AM</li><li>05:00 AM</li><li>05:30 AM</li><li>06:00 AM</li><li>06:30 AM</li><li>07:00 AM</li><li>07:30 AM</li><li>08:00 AM</li><li>08:30 AM</li><li>09:00 AM</li><li>09:30 AM</li><li>10:00 AM</li><li>10:30 AM</li><li>11:00 AM</li><li>11:30 AM</li><li>12:00 PM</li><li>12:30 PM</li><li>01:00 PM</li><li>01:30 PM</li><li>02:00 PM</li><li>02:30 PM</li><li>03:00 PM</li><li>03:30 PM</li><li>04:00 PM</li><li>04:30 PM</li><li>05:00 PM</li><li>05:30 PM</li><li>06:00 PM</li><li>06:30 PM</li><li>07:00 PM</li><li>07:30 PM</li><li>08:00 PM</li><li>08:30 PM</li><li>09:00 PM</li><li>09:30 PM</li><li>10:00 PM</li><li>10:30 PM</li><li>11:00 PM</li><li>11:30 PM</li></ul></div></td></tr></table>";
						new TimeCombo(viewFldId+'_time_value','#FFFFFF','#FFFFFF');
						changeTime(viewFldId+'_time_value');
						valFld.style.fontFamily="Tahoma, Verdana";
						valFld.style.fontSize="11px";
						new Calendar({
							  inputField: viewFldId+'_date_value',
							  dateFormat: "%d/%m/%Y", 
							  trigger: viewFldId+"_cal",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {this.hide();}
						});
						break;	

		case "dropDown-terr":								
						fldDbVal=ReplaceAll(fldDbVal,",","");
						valFld.innerHTML='<span><img border="0" src="/atCRM/images/loading5.gif"></span>';
						var dispVal="";
						var terrUrl=zcServletPrefix+"/custom/JSON/system/territoriesInSession.htm";
						$.ajax({
								type: "GET",
								url:terrUrl,
								dataType: "json",
								async:false,
								success: function (doc)
								{   
									valFld.innerHTML='';
									fldObj=CreateSelectBox(valFld, "inputFieldClassDrop", viewFldId, fldDbVal);
									var allTerrs = doc["allTerrs"];	
									if(!fldDbVal){
										var defaultTerr = doc["defaultTerr"];
										//fldDbVal=defaultTerr;
									}
									var allTerrsLength =  allTerrs.length;												
									var isIE = document.all ? true : false;
									 
									for(i=0,j=0;i<allTerrsLength;i++,j++)
									{
										terrName = allTerrs[j]["territories"];
										terrId =  allTerrs[j]["terrId"];
										readOnly=  allTerrs[j]["readOnly"];
										
										if(fldDbVal==terrId)
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
						makeComboSearchable(dispVal,false,viewFldId);										
						$(".inputFieldClassDrop").combobox();						
					break;

		case "dropDown-state":	
						fldDbVal=ReplaceAll(fldDbVal,",","");					
						valFld.innerHTML='<span><img border="0" src="/atCRM/images/loading5.gif"></span>';
						var dispValstate = "";
						var stateUrl=zcServletPrefix+"/custom/JSON/system/states.htm?id="+fldDbVal;	
						$.ajax({
								type: "GET",
								url:stateUrl,
								dataType: "json",
								async:false,
								success: function (doc)
								{  		
									valFld.innerHTML='';
									fldObj=CreateSelectBox(valFld, "inputFieldClassDrop", viewFldId, fldDbVal);
									var allStates = doc["allStates"];										
									var allStatesLength =  allStates.length;

									for(k=0,l=0;k<allStatesLength;k++,l++)
									{
										stateName = allStates[l]["State"];
										stateId =  allStates[l]["stateId"];

										if(fldDbVal==stateId)
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
							makeComboSearchable(dispValstate,'',viewFldId);	
							$(".inputFieldClassDrop").combobox();								
						break;

		case "smartSuggest":
						fldDbVal=ReplaceAll(fldDbVal,",","");
						var smartSuggestURL=zcServletPrefix+fldSmartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var pckListId=getParameterValue (smartSuggestURL,'pckListId');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;				
//                        console.log(smartSuggestURL,pckListName,pckListId);
						var fldvalId=fldDbVal;
						var fldvalTxt=fldValue;
						
						if(document.getElementById(viewLblId).innerHTML && document.getElementById(viewLblId).innerHTML!="Click to edit") 
						//fldvalTxt= document.getElementById(viewLblId).innerHTML;
						labelClass="inputFieldClass";
						fldValue="2 chars or **";
						
						if(!fldvalId)labelClass="inputGrayTextClass";else fldValue=fldvalTxt;
						//Sending pckListId if picklistId present else pckListName--Priya
						if(pckListId)
		                {
							
						valFld.innerHTML="<input type='hidden'  name='view_fld_"+x+"' id='view_fld_"+x+"' value='"+fldvalId+"'><input type='text'  name='view_fld_"+x+"txt' id='view_fld_"+x+"txt'  value='"+fldValue+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value);\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','view_fld_"+x+"txt','','0','addEditForm');\" id='view_fld_"+x+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";
		                }
						else
		                {							
						valFld.innerHTML="<input type='hidden'  name='view_fld_"+x+"' id='view_fld_"+x+"' value='"+fldvalId+"'><input type='text'  name='view_fld_"+x+"txt' id='view_fld_"+x+"txt'  value='"+fldValue+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value);\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListName+"','view_fld_"+x+"txt','','0','addEditForm');\" id='view_fld_"+x+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";
						}
						if(fldColumn=="OpportunityStage_id")
									{
                                       beforeSelectIndex=document.getElementById(viewFldId).selectedIndex;
									}
		
					break;		

		case "pickList":
						var smartSuggestURL=zcServletPrefix+fldSmartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;

						labelClass="inputFieldClass";
						if(!fldValue)
						{
							fldValue="2 chars or **";
							labelClass="inputGrayTextClass";
						}
						//Sending pckListId if pckListId present else pckListName--Priya
						valFld.innerHTML="<input type='text'  name='view_fld_"+x+"' id='view_fld_"+x+"' value='"+fldValue+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value);\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListName+"','view_fld_"+x+"','','0','addEditForm');\" id='view_fld_"+x+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a>";	
						if(fldColumn=="OpportunityStage_id")
							{
                                 beforeSelectIndex=document.getElementById(viewFldId).selectedIndex;
							}
					break;
		case "uniqueBox":
						var smartSuggestURL=zcServletPrefix+fldSmartSuggURL;
						var fldValue=ReplaceAll(fldValue,",","");
						if(fldValue!=""||fldValue!=null)
						fldObj=CreateTEXTBOX(valFld, "inputFieldClass",viewFldId, fldValue,fldMaxLength);	
						//fldObj.setAttribute("onblur","callUniqueValidationAjaxFromView('"+smartSuggestURL+"',this,'"+fldLabel+"','"+fldValue+"');");
					break;

			default:
						fldObj=CreateTEXTBOX(valFld, "inputFieldClass", viewFldId, fldValue, fldMaxLength);		
						fldObj.focus();
						break;
	}
	if (fldDbVal=='')
	{
		fldDbVal=null;
	}

	var savCancel="<table align='right'><tr><td><a class='tabIconNormalViewClass' title='Click to save' href=\"javascript:saveFieldVal("+x+",'"+fldColumn+"','"+fldTable+"','"+fldPriKeyVal+"','"+fldPriKeyColumn+"','"+fldExtType+"','"+fldIsNullable+"','"+fldLabel+"','"+fldDbVal+"','"+fldDbValText+"','"+fldType+"','"+smartSuggestURL+"','"+mainPK+"')\"  style='cursor:pointer;'>Save</a></td><td><a class='tabIconNormalViewClass' href='javascript:disableEditMode("+x+")' title='Click to disable Edit mode' style='cursor:pointer;'>Cancel</a></td></tr></table>";

	
	var buttonsDiv=CreateSPAN(valFld,'','but_'+viewFldId);
	buttonsDiv.innerHTML=savCancel;
}

function saveFieldVal(x,colmn,tblNm,pkVal,pkCol,type,mandatory,label,dbVal,dbValTxt,fldType,smartSuggestURL,mainPK)
{
	if (tableName == "ticket") 
	{
		var viewLblId = 'lbl_'+viewItems[x].dataColumn[13]; 
		var viewValId = 'val_'+viewItems[x].dataColumn[13];
		var viewFldId = 'fld_'+viewItems[x].dataColumn[13];
	}
	else 
	{
		var viewLblId = 'view_lbl_'+x; 
		var viewValId = 'view_val_'+x;
		var viewFldId = 'view_fld_'+x;
	}
	if(type=="dateAndTime"||type=="DateTime"||type=="dateOnly"||type=="Date")
	{
		if((document.getElementById(viewFldId+'_time_value'))&&(document.getElementById(viewFldId+'_time_value').value))
		{			
			var timeVal=document.getElementById(viewFldId+'_time_value').value;
			var ap = timeVal.split(' ')[1];
			var hour = (timeVal.split(' ')[0]).split(':')[0];
			var minute = (timeVal.split(' ')[0]).split(':')[1];
			var second = "00";
			if(ap == "AM")
				{if (hour == 12)hour = "00";}
			else
				{hour=parseFloat(hour);if(hour < 12){hour = hour+12;};}
			timeVal = hour +':' +minute +':' +second;
		}
		else
		timeVal="00:00:00";
		if(document.getElementById(viewFldId+'_date_value').value)
		document.getElementById(viewFldId).value= document.getElementById(viewFldId+'_date_value').value +" "+timeVal;
		
//08/06/2011 3:20 PM Vadiraj
//Below written code will convert the user selected date value to server timezone before submission.
		var valToSubmit = document.getElementById(viewFldId).value;
		var valToSubmitArr = valToSubmit.split(' ');
		var valToSubmitdate  = valToSubmitArr[0];
		var valToSubmitdateArr = valToSubmitdate.split('/');
		var valToSubmitdatetIme = valToSubmitdateArr[1]+'/'+valToSubmitdateArr[0]+'/'+valToSubmitdateArr[2]+' '+valToSubmitArr[1];
		
		var d1 = new Date (valToSubmitdatetIme);
		d1.setMinutes ( d1.getMinutes() + srvrtimeDiffInMin - timeDiffInMin);
		valToSubmit=dateFormat(d1, "dd/mm/yyyy HH:MM:ss");
		viewItems[x].dataColumn[1] = valToSubmit;
//08/06/2011 3:21 PM Vadiraj

	}
	if(fldType=="dropDownList"||fldType=="dropDown-terr"||fldType=="dropDown-state")
	{	type='integer';	
	document.getElementById(viewFldId).value=jQuery.trim(document.getElementById(viewFldId).value);
	dbVal = dbValTxt;
	}
	
//If the value to be submitted is of date object then

	if(type=="dateAndTime"||type=="DateTime"||type=="dateOnly"||type=="Date")
	{
		val = valToSubmit;
	}
	else
	{
		val=document.getElementById(viewFldId).value;
	}

	if(val=='2 chars or **')
	{
		val='';
		document.getElementById(viewFldId).value='';
	}

//08/09/2011 Vadiraj While saving phone numbers, if the number starts with '+' symbol, encode it.
	 if (type=="text" && val.indexOf('+')==0)
    {
		val = val.replace('+','%2B');
    }
	 if(fldType.toLowerCase()=="check"||fldType.toLowerCase()=="checkbox")
	{
		if(document.getElementById(viewFldId).checked) val="1";
		else val="0";
	}



//22/09/2011 Vadiraj

   if(document.getElementById(viewFldId+'txt'))
   var textfldVal= document.getElementById(viewFldId+'txt').value;
   if(textfldVal=='2 chars or **')
   textfldVal="";
	if(mandatory=="0"&&(val=="" || val=="NaN/NaN/NaN NaN:NaN:NaN")){document.getElementById('viewErrorDiv').style.display="block";document.getElementById('viewErrorDiv').innerHTML="<ul><li>Non-empty value needed for '"+label+"'</li></ul>";document.getElementById(viewFldId).focus();return}	
    //22/09/2011 Vadiraj If the new value is null set val to null	
   if (!val)
	 {
		val=null
	 }	   

	document.getElementById('viewErrorDiv').style.display="none";	
	var strcol=colmn.replace("udef_fkey","str_udef_fkey");
	//On click to edit if field in udef_Fkey-- Priya
	if(colmn.indexOf("udef_fkey")!="-1") {
	var url2Hit = zcServletPrefix+"/custom/JSON/system/updateOnClick/editAction";
	} else {	
	var url2Hit = zcServletPrefix+"/custom/JSON/system/updateOnClick/editAction";
	}
	if(1)//dbVal!=val
	{
		var post_val = { "colVal": val.replaceAll("'","''"), "colName": colmn, "tblName": tblNm, "pkVal": pkVal, "pkCol": pkCol, "type": type, "strcol": strcol,"txtFldVal": textfldVal, "mainPK": mainPK };

		$.ajax(
		{
			type: "POST",
			contentType: "application/x-www-form-urlencoded",
			url: url2Hit,
			data: post_val,
			async: false,
			success: function (doc)
			{
				val=document.getElementById(viewFldId).value;
				var w;
				if(fldType=="dropDownList"||fldType=="dropDown-terr"||fldType=="dropDown-state")
				{
					type='text';	
					viewItems[x].dataColumn[7]=val;
					w = document.getElementById(viewFldId).selectedIndex;
					var val = document.getElementById(viewFldId).options[w].text;
						if(fldType=="dropDown-terr"||fldType=="dropDown-state")
						if(val.lastIndexOf('>')>0)val=val.substring(val.lastIndexOf('>')+2);
				}
				else if(fldType=="smartSuggest")
				{
					var val = document.getElementById(viewFldId+'txt').value;
					w = document.getElementById(viewFldId).selectedIndex;   //by Dony, to get the index of selected value
				}
				else if(fldType=="pickList")
				{
					w = document.getElementById(viewFldId).selectedIndex;   //by Dony, to get the index of selected value
				}//For uniqueBox type validation on click to edit, By Hamsa.
				else if(fldType=="uniqueBox")
				{
					retVal = callUniqueValidationAjaxFromView(smartSuggestURL,val,label,dbVal);
					if(retVal == true)
						{
							var msg="'"+label+"' already exist. Please enter unique value.";
							document.getElementById('viewErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
							document.getElementById('viewErrorDiv').style.display="block";
							return false;
						}
				}
				else
					viewItems[x].dataColumn[1]=val;
				if(val)
				switch(type)
				{	
					case "decimal": 
					case "double": 
					case "float": 
					case "money":
					case "Decimal":	
									val=ReplaceAll(val,",","");
									val=parseFloat(val).toFixed(2);	
									val=FormatNumber(val,1,2);
									break;
					
					case "Integer":
					case "integer": 
									val=ReplaceAll(val,",","");
									val=parseFloat(val).toFixed(0);		                
									val=FormatNumber(val,1,0);
									break;

					case "dateOnly":
					case "Date":
									val=parseString_Date(val,'dd/MM/yyyy')
									val=dateFormat(val, "dd-mmm-yyyy");
									break;

					case "timeOnly": 
					case "dateAndTime":						
					case "DateTime":
									viewItems[x].dataColumn[1]=valToSubmit;
									val=parseString_Date(val,'dd/MM/yyyy')
									val=dateFormat(val, "dd-mmm-yyyy, hh:MM TT");
									break;
					case "Multi":
									val=ReplaceAll(val,"~)","<br>");
									break;
					case "multiLevelDropdown":
									var lastIndex=val.lastIndexOf(">>")>0?val.lastIndexOf(">>")+2:0;
									val=val.substring(lastIndex);
				}
				if(val)
					document.getElementById(viewLblId).innerHTML=val;
				else
					document.getElementById(viewLblId).innerHTML="Click to edit";
				//by Dony, To change the layout of opportunity view page according to the stage selected.
				if(fldType=="dropDownList"||fldType=="smartSuggest"||fldType=="pickList")
				{
					if(parent.type_based_layouts_supported_flag == 1&&tblNm=="Opportunity"&&colmn=="OpportunityStage_id"&&w!=beforeSelectIndex)
					{
                       changeStageTypeBasedView(tblNm,pkVal);
					}
				}
				else if(fldType.toLowerCase()=="check"||fldType.toLowerCase()=="checkbox")
				{
					var chkLblSpan=document.getElementById(viewLblId);
					var checkFalg;
					if(document.getElementById(viewFldId).checked == true) {
						document.getElementById(viewLblId).innerHTML="Yes";
						checkFalg="Yes";
					}
					else {
						document.getElementById(viewLblId).innerHTML="No";
                        checkFalg="No";
					}
					chkLblSpan.style.cursor='pointer';
					//chkLblSpan.onclick=""
					AddClickEventListener(chkLblSpan, (function(x,mainPK,checkFalg) {return function() {createField2Edit(x,mainPK,checkFalg);};})(x,mainPK,checkFalg));
				}
			}
		});
	}
	disableEditMode(x);
}

function disableEditMode(x)
{
	if (tableName == "ticket") 
	{
		var viewLblId = 'lbl_'+viewItems[x].dataColumn[13]; 
		var viewValId = 'val_'+viewItems[x].dataColumn[13];
		var viewFldId = 'fld_'+viewItems[x].dataColumn[13];
	}
	else 
	{
		var viewLblId = 'view_lbl_'+x; 
		var viewValId = 'view_val_'+x;
		var viewFldId = 'view_fld_'+x;
	}
	document.getElementById(viewLblId).style.display='block';
	document.getElementById(viewValId).style.display='none';
	if(document.getElementById(viewLblId).innerHTML=="Click to edit")
	{
		document.getElementById(viewLblId).style.color='#d6d6d6';
	}
	else
	{
		document.getElementById(viewLblId).style.color='#000000';
	}
}

function buildTabs(data)
{
	var rows=0;
	var mainTD=document.getElementById("360ViewTd");
	var tabNames=data.PageTabs;	
	tableName=data.tableName
	if(tabNames.length>0)
	{		
		var tabsDiv=CreateDIV(mainTD,"","tabsDiv");
		tabsDiv.style.marginTop="30px";		
		tabsDiv.style.width=pageWidth1+"px";		
		var tabsUL = CreateUL(tabsDiv ,"tabs-nav", "view-tabsUL");
		tabsUL.style.height="50px";
		var url= data.ViewUrl;
		//commented below line by Govardhan
		//var pkVal=getParameterValue(url,'id');		
		//written below line to replace the above commented one.
		var pkVal=data.PrimaryKeyValue;
		for(var tabs=0; tabs<tabNames.length; tabs++)
		{
			var tabText=tabNames[tabs].tabName;
			if(tabText=='Attachments')
			{ 
				var rowCnt;
				$.ajax(
				{
				   type: "GET",
				   url:zcServletPrefix+"/custom/JSON/admin/attachmentCount.htm?entity="+tableName+"&pk="+pkVal,
				   dataType: "json",
				   async:false,
				   success: function (data)
					{
						rowCnt=data.attachmentCount;
					}									
				});	
			}
			else
				var rowCnt=tabNames[tabs].rowCount;
			var tabDivId=tabNames[tabs].tabId;
			var tabDivName="tabsDiv-"+tabNames[tabs].tabId;
			var tabDivCnt=tabNames[tabs].rowCount;
			var tabHeaders=tabNames[tabs].PageTabHeader;
			var tabListData=tabNames[tabs].PageTabData;
			var viewUrl=tabNames[tabs].viewURL;
			var addUrl=tabNames[tabs].addURL;
			var addPopupUrl=tabNames[tabs].addPopupURL;
			var deleteUrl=tabNames[tabs].deleteURL;
			if(!deleteUrl)deleteUrl='';
			var printUrl=tabNames[tabs].printURL;
			if(!printUrl)printUrl='';
			var tabsLi=CreateLI(tabsUL,'',tabDivId);
			var currPageNo=tabNames[tabs].currPage;
			if(currPageNo>1)viewPageTab=tabDivId;
			if(tabText=='Attachments')
				tabDivName="tabsDiv-Attachments";
			var tabsLiAnc = CreateA(tabsLi , "", "" , "#"+tabDivName, "", "<span id='"+tabDivName+"-span'>"+rowCnt+" "+tabText+"</span>", "" );
			tabsLiAnc.setAttribute("onclick","javascript:storeTabDivId('"+tabDivId+"')");
			var tabsContentDiv=CreateDIV(tabsDiv,"",tabDivName);	

			if(tabText!='Attachments')
			{
				buildTabsData(tabDivName,tabHeaders,tabListData,viewUrl,addUrl,deleteUrl,printUrl,tabText,'',tabNames[tabs].Editable,tabDivId,tabNames[tabs].pagAmt,tabNames[tabs].currPage,tabNames[tabs].totalPages,tabNames[tabs].rowCount,addPopupUrl,pkVal);
			}
		}
// 10-06-2013 Vadiraj -- Below piece of code commented because, laying out of columns of the custom object was not taken care compltely. Ex:- Contact Policy object in Mediassist, customObjData JSON was delivering the data, but the tab was not being layed out properly.
		$.ajax(
		{
			type: "GET",
			url:zcServletPrefix+"/custom/JSON/admin/customObject4Entity.htm?entityName="+tableName+"&pk="+pkVal,
			dataType: "json",
			success: function (doc)
			{
				var objectsArray=doc['custom_objects'];	
				for(z in objectsArray)
				{
					var tabCCount=objectsArray[z].objCnt;
					var tabText=objectsArray[z].objName;
					var tabDivId=objectsArray[z].objId;
					var tabDivName="tabsDiv-"+"cusObj"+tabDivId;
					var tabsLi=CreateLI(tabsUL,'',tabDivId);
					var tabsLiAnc = CreateA(tabsLi , "", "" , "#"+tabDivName, "", "<span id='"+tabDivName+"-span'>"+tabCCount+" "+tabText+"</span>", "" );
					var tabsContentDiv=CreateDIV(tabsDiv,"",tabDivName);				
				}
				$('#tabsDiv').tabs({ fxAutoHeight: true });
				//var $tabs= $('#tabsDiv').tabs().scrollabletab();
				var getHyphenIndex=data.PageCaption.indexOf('-');
				var rcdName=data.PageCaption.substring(getHyphenIndex+2);
				var baseObjctVal=pkVal+"--"+rcdName;
				var startPage=1;
				var pageRef='';
				$('#tabsDiv').bind('tabsselect', function(event, ui) {		
					var isAttachments=ui.tab.toString().indexOf("Attachments");
					tabName=ui.tab.toString()+"_cnt";
					var isCusObj=ui.tab.toString().indexOf("cusObj");
					if(isAttachments!= -1)buildAttachments(startPage,pkVal,pageRef,tableName);
					else if(isCusObj!=-1)
					{
						tabDivId=ui.tab.toString().substring(isCusObj+6);
						$.ajax(
						{
							type: "GET",
							url:zcServletPrefix+"/custom/JSON/admin/customObjData.htm?entity="+tableName+"&custom_obj="+tabDivId+"&pk="+pkVal,
							dataType: "json",
							success: function (doc)
							{								
								var tabHeaders=doc.PageTabHeader;
								var tabListData=doc.PageTabData;
								var viewUrl="";
								subObjectData("tabsDiv-"+"cusObj"+tabDivId,tabHeaders,tabListData,tabText,"custom/JSON/view/customObject.htm?objId="+tabDivId,"custom/JSON/add/customObject.htm?objId="+tabDivId+"&baseVal="+baseObjctVal,'100','1');
							}
						});
					}
					});
			}
		});
		if(isFrmQuickAdd && tabSelId && document.getElementById(tabSelId)) document.getElementById(tabSelId).className="ui-tabs-selected";
		else if(viewPageTab){document.getElementById(viewPageTab).className="ui-tabs-selected";}else if(prevViewPageTab){document.getElementById(prevViewPageTab).className="ui-tabs-selected";}	
	}	
}

function storeTabDivId(tabDivId)
{
	tabSelId=tabDivId;
}
function buildAttachments(page,pkVal,pageRef,tableName)
{	
	var tabsDataDiv=document.getElementById("tabsDiv-Attachments");
	$("#tabsDiv-Attachments").hide();
	tabsDataDiv.innerHTML="";
	tabsDataDiv.style.padding="0px";
	var count=0;
	var screenWidth = getScreenSize('width');
	if(screenWidth>1030)var attachmentURL=zcServletPrefix+"/custom/JSON/list/attachmentView.htm?entity="+tableName+"&pk="+pkVal+"&page__size__201=33&page__number__201="+page;else var attachmentURL=zcServletPrefix+"/custom/JSON/list/attachmentView.htm?entity="+tableName+"&pk="+pkVal+"&page__size__201=24&page__number__201="+page;
	tabsDataDiv.innerHTML="<div style=\"width:100%;text-align:right;\"><a class=\"tabIconNormalViewClass\" style=\"color:blue;\" classname=\"tabIconNormalViewClass\"  href=\"javascript:uploadFile('"+tableName+"',"+pkVal+")\" title=\"Add \">Add</a></div>";
	$.ajax(
	{
		type: "GET",
		url:attachmentURL,
		async: false,		
		dataType: "json",
		success: function (doc)
		{
			var dataArray=doc['Attachments'].listData;
			var currentPage=doc['Attachments'].currentPage;
			var TotalPages=doc['Attachments'].totalPages;
			var totCount=doc['Attachments'].count;
			document.getElementById('tabsDiv-Attachments-span').innerHTML=totCount+' Attachments'
			if (dataArray=="")
			{	
				tabsDataDiv.innerHTML+="<table cellpadding='5' width='100%'><tr><td class='flexigrid' align='center'>No Attachments available</td></tr></table>";
				$("#tabsDiv-Attachments").show();
			}
			else
			{
				var backPage=page-1;	
				var nextPage=page+1;
				tabsDataDiv.innerHTML+="<table cellpadding='0' cellspacing='0' width='100%'><tr><td valign='middle'><a href='javascript:rightSlide("+backPage+","+pkVal+",\""+tableName+"\");' id='iconPrevPage' style='display:none;margin-top: 10px;'><img src='/atCRM/images/fileIcons/arrowleft.png'></a></td><td id='iconPageTd' width='95%'></td><td valign='middle'><div><a href='javascript:leftSlide("+nextPage+","+pkVal+",\""+tableName+"\");' id='iconNextPage' style='display:none;margin-top: 10px;'><img src='/atCRM/images/fileIcons/arrowright.png'></a></div></td></tr></table>";

				if(currentPage!=1)
				{					
					document.getElementById('iconPrevPage').style.display="block";
				}	
				if((currentPage!=TotalPages) && (TotalPages>1))
				{
					document.getElementById('iconNextPage').style.display="block";
				}		
				var iconPageTd=document.getElementById('iconPageTd');
				var atchmntDiv=CreateDIV(iconPageTd,"flextab","iconPage");	
				atchmntDiv.setAttribute("style","width:100%;padding-top:5px")
				var iconLst=CreateUL(atchmntDiv,'iconbox','iconbox');				
				
				for(var i=0; i<dataArray.length; i++)
				{										
					var val=dataArray[i].columnData.split('~)');
					var iconTitleOname=val[0];
					var iconTitleName=val[1];
					var iconTitleCby=val[4];
					var iconTitleCdt=val[5];
					var iconId=val[7];
					var downLoadUrl=zcServletPrefix+"/custom/JSON/view/fetchAttachments.html?id="+iconId;
					var fileType=findFileType(iconTitleOname);	
					var fileIcon=categoriseFileType(fileType);
					if(iconTitleOname.length>11)var listDataLabel=iconTitleOname.substr(0,9)+"...";else var listDataLabel=iconTitleOname;
					iconName4Del=escape(iconTitleOname);

					var fileList=CreateLI(iconLst);
					var iconDiv=CreateDIV(fileList);
					
					if(fileIcon!="gif")
					{
						fileList.innerHTML="<div class='deleteIcon' title='Delete File' onclick='deleteAttachment(\""+tableName+"\","+pkVal+","+iconId+",\""+iconName4Del+"\");'><span class='ui-icon ui-icon-closethick'>close</span></div><div align='center'><img src='/atCRM/images/fileIcons/"+fileIcon+".png' style='border-radius: 10px; border: 1px solid transparent;max-width:50px;' title='Download' onclick='window.open(\""+downLoadUrl+"\");'><br/>"+listDataLabel+"</div><div align='left' class='viewIcon' id='viewIcon' name='viewIcon'>Name:&nbsp;"+iconTitleOname+"<br>Created By:&nbsp;"+iconTitleCby+"<br>Created Date:&nbsp;"+iconTitleCdt+"</div>";
					}
					else
					{
						var imgSrc="/atCRM/thumbnails/"+iconTitleName;
						$.ajax({
							url:imgSrc,
							type:'HEAD',
							async:false,
							error: function()
							{
								fileList.innerHTML+="<div class='deleteIcon' title='Delete File' onclick='deleteAttachment(\""+tableName+"\","+pkVal+","+iconId+",\""+iconName4Del+"\");'><span class='ui-icon ui-icon-closethick'>close</span></div><div align='center;'><img src='/atCRM/images/fileIcons/gif.png' onclick='showImgLightBx(\""+downLoadUrl+"\");' style='border-radius: 10px; border: 1px solid transparent;max-width:50px;max-height:50px;'><br/>"+listDataLabel+"</div><div align='left' class='viewIcon' id='viewIcon' name='viewIcon'>Name:&nbsp;"+iconTitleOname+"<br>Created By:&nbsp;"+iconTitleCby+"<br>Created Date:&nbsp;"+iconTitleCdt+"</div>";
							},
							success: function()
							{
								fileList.innerHTML+="<div class='deleteIcon' title='Delete File' onclick='deleteAttachment(\""+tableName+"\","+pkVal+","+iconId+",\""+iconName4Del+"\");'><span class='ui-icon ui-icon-closethick'>close</span></div><div align='center'><img src='/atCRM/thumbnails/"+iconTitleName+"' onclick='showImgLightBx(\""+downLoadUrl+"\");' style='border-radius: 10px; border: 1px solid transparent;max-width:50px;' ><br/>"+listDataLabel+"</div><div align='left' class='viewIcon' id='viewIcon' name='viewIcon'>Name:&nbsp;"+iconTitleOname+"<br>Created By:&nbsp;"+iconTitleCby+"<br>Created Date:&nbsp;"+iconTitleCdt+"</div>";
							}
						});
					}
					//fileList.innerHTML="<div align='center'><a class='"+fileType+"' href='"+downLoadUrl+"'>&nbsp;</a><br/>"+listDataLabel+"</div><div align='left' class='viewIcon' id='viewIcon' name='viewIcon'>Name:&nbsp;"+iconTitleOname+"<br>Created By:&nbsp;"+iconTitleCby+"<br>Created Date:&nbsp;"+iconTitleCdt+"</div>";

				}
				if(pageRef==0)
				$("#tabsDiv-Attachments").show("slide", { direction: "right" },1000);
				if(pageRef==1)
				$("#tabsDiv-Attachments").show("slide", { direction: "left" },1000);
			}
		}
	});
}

function showImgLightBx(url)
{
	document.getElementById('modelOverlayDiv').style.display="block";
	//$("#lightBoxDiv").show("clip");
	document.getElementById('lightBoxDiv').innerHTML="<a href='javascript:void(0)' onclick='window.open(\""+url+"\");' style='position: absolute; padding: 5px;'><img src='/atCRM/images/fileIcons/download-icon.png' alt='Download' title='Download' ></a><a href='javascript:void(0)' onclick='hideImgLightBx();' style='z-index: 10005; margin-left: -50px; float: right; padding: 5px; position: relative;'><img src='/atCRM/images/fileIcons/close.png' alt='Close' title='Close' ></a><img id='lightBoxImage' src='"+url+"' style='min-height:150px;min-width:150px;max-height:600px;max-width:800px'>";
	setTimeout(function (){var scrWidth=screen.width;var imgWidth=document.getElementById('lightBoxImage').width;if(imgWidth>800)imgWidth=800;var lftSpc=(scrWidth-imgWidth)/2;document.getElementById('lightBoxDiv').style.marginLeft=lftSpc+'px';$("#lightBoxDiv").show("slide", { direction: "top" },500);var lHeight=screen.height+50;document.getElementById('modelOverlayDiv').style.height=lHeight+'px';},500)		
}

function deleteAttachment(tableName,pkVal,id,fName)
{
	$("#commonPopupDiv").dialog({
		autoOpen: true,
		resizable: false,
		title:'Delete Attachment?',	
		modal: true,	
		closeOnEscape:true,
		width: 400,	
		height:130,
		beforeClose: function() {$(this).dialog("option", "buttons", null);},
		buttons: {
		'Yes': function() 
		{
			$.ajax({
				url:zcServletPrefix+"/custom/JSON/admin/deleteAttachment.html?id="+id,
				async:false,
				dataType: "text",
				success: function (data)
				{	
					if(data.search("Deleted")>=0)
					{
						document.getElementById("commonPopupDiv").innerHTML = '<div style="text-align:center;margin-top:10px;"><img src="/atCRM/images/JSON/loading.gif"><br>Deleting...</div>'; 
						$("#commonPopupDiv").dialog("option", "buttons", null);
						setTimeout("closeAttachments("+pkVal+",'"+tableName+"');",1500);
					}
				}
				});
		},
		'No': function() {$(this).dialog('close');}
		},
		open: function() {$(this).siblings('.ui-dialog-buttonpane').find('button:eq(1)').focus();}
	});
	document.getElementById("commonPopupDiv").innerHTML = "<span style='word-wrap:break-word;font-weight:bold'>"+unescape(fName)+"</span> will be permanently deleted and cannot be recovered. Do you want to continue?"; 
}

function hideImgLightBx()
{
	document.getElementById('modelOverlayDiv').style.display="none";
	document.getElementById('lightBoxDiv').style.display="none";
}

function findFileType(fname)
{
	  var pos = fname.lastIndexOf(".");
  var strlen = fname.length;
  if (pos != -1 && strlen != pos + 1)
  {
	  var ext = fname.split(".");
	  var len = ext.length;
	  var extension = ext[len - 1].toLowerCase();
  }
  else 
  {
    extension = "invalid";
  }
  return(extension);
}

function categoriseFileType(fileType)
{
	switch(fileType)
	{
		case "ppt":
		case "odp":
		case "pps":
					var fileIcon="ppt";
					break;
		case "gif":
		case "png":
		case "bmp":
		case "jpg":
		case "jpeg":
					var fileIcon="gif";
					break;
		case "rar":
		case "zip":
					var fileIcon="rar";
					break;
		case "doc":
		case "docx":
		case "rtf":
		case "dot":
		case "dotx":
		case "odt":
					var fileIcon="doc";
					break;
		case "xls":
		case "xlsx":
		case "ods":
		case "csv":
					var fileIcon="xls";
					break;
		case "wav":
		case "wma":
		case "mp2":
		case "mp3":
		case "swa":
					var fileIcon="wav";
					break;
		case "avi":
		case "dat":
		case "3gp":
		case "flv":
		case "mpeg":
		case "mpg":
		case "swf":
		case "wmv":
		case "mp4":
					var fileIcon="avi";
					break;
		case "pdf":
					var fileIcon="pdf";
					break;
		case "txt":
					var fileIcon="txt";
					break;
		case "html":
					var fileIcon="html";
					break;
		default:
					var fileIcon="file";
					break;
	}
	return fileIcon;
}

function leftSlide(page,pkVal,tableName)
{	var pageRef=0;
	$("#tabsDiv-Attachments").hide("slide", { direction: "left" },500);
	buildAttachments(page,pkVal,pageRef,tableName);
}
function rightSlide(page,pkVal,tableName)
{	var pageRef=1;
	$("#tabsDiv-Attachments").hide("slide", { direction: "right" },500);
	buildAttachments(page,pkVal,pageRef,tableName);
}

function uploadFile(tableName,pkVal)
{
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,			
		width: 500,		
		height: 395,
		title:'Add Attachment(s)',	
		closeOnEscape:true
	});
	iframeSrc=zcServletPrefix+"/custom/JSON/admin/fileUpload.html?entity="+tableName+"&pkVal="+pkVal
	document.getElementById("commonPopupDiv").innerHTML = "<iframe src='"+iframeSrc+"' style='width:100%;height:361px' frameborder='0'></iframe>"; 
}

function closeAttachments(pkVal,tableName)
{
	$('#commonPopupDiv').dialog('close');
	if(pkVal)buildAttachments(1,pkVal,0,tableName);
}

function buildPanes(data)
{
	var rows=0;
	var mainTD=document.getElementById("360ViewTd");	
	var tabNames=data.PageTabs;	
	if(tabNames.length>0)
	{		
		var panesDiv=CreateDIV(mainTD,"","panesDiv");
		panesDiv.style.marginTop="30px";		
		for(var tabs=0; tabs<tabNames.length; tabs++)
		{
			var tabText=tabNames[tabs].tabName;
			var rowCnt=tabNames[tabs].rowCount;
			var tabDivId=tabNames[tabs].tabId;
			var tabDivName="tabsDiv-"+tabNames[tabs].tabId;
			var tabDivCnt=tabNames[tabs].rowCount;
			var tabHeaders=tabNames[tabs].PageTabHeader;
			var tabListData=tabNames[tabs].PageTabData;
			var viewUrl=tabNames[tabs].viewURL;
			var addUrl=tabNames[tabs].addURL;
			var addPopupUrl=tabNames[tabs].addPopupURL;
			var panesDiv=CreateDIV(panesDiv);	
			var panesDivHdr=CreateDIV(panesDiv,'sectionDivHdr');
			panesDiv.style.marginTop="15px";
			var tabsLiAnc = CreateA(panesDivHdr , "", "" , "#"+tabDivName, "", rowCnt+" "+tabText, "" );
			tabsLiAnc.setAttribute("onclick","javascript:storeTabDivId('"+tabDivId+"')");
			var tabsContentDiv=CreateDIV(panesDiv,"",tabDivName);	
			buildTabsData(tabDivName,tabHeaders,tabListData,viewUrl,addUrl,'',tabText,'',tabNames[tabs].Editable,tabDivId,tabNames[tabs].pagAmt,tabNames[tabs].currPage,tabNames[tabs].totalPages,tabNames[tabs].rowCount,'',addPopupUrl);	
		}	
	}
}
function buildTabsData(tabDivName,tabHeaders,tabListData,viewUrl,addUrl,deleteUrl,printUrl,tabText,layout,Editable,tabId,pagAmt,currPageNo,totalPages,rowCount,addPopupUrl,pkValue)
{
	var tabsDataDiv=document.getElementById(tabDivName);
	var isBrowser = navigator.appVersion;
	addUrl=jQuery.trim(addUrl);
	if(addUrl!=""&&addUrl!="#")
	{
		var addIsfunction=addUrl.indexOf('javascript');
		if(addIsfunction==0)
		{
			var URLAdd;
			if(addPopupUrl) URLAdd=addPopupUrl;
			else URLAdd=addUrl.replace('PkVal','\'\'')
			tabsDataDiv.innerHTML="<div style=\"width:100%;text-align:right;margin-top:-13px\"><a class=\"tabIconNormalViewClass\" style=\"color:blue;\" classname=\"tabIconNormalViewClass\"  href=\""+URLAdd+"\" title=\"Add "+tabText+"\">Add</a></div>";
		}
		else 
		{
			tabsDataDiv.innerHTML="<div style=\"width:100%;text-align:right;margin-top:-13px\"><a class=\"tabIconNormalViewClass\" style=\"color:blue;\" classname=\"tabIconNormalViewClass\"  href=\"javascript:setUpPageParameters ('"+zcServletPrefix+"/"+addUrl+"','"+entityDiv+"')\" title=\"Add "+tabText+"\">Add</a></div>";
		}
	}
	else
	{
			tabsDataDiv.innerHTML="<div style=\"width:100%;text-align:right;margin-top:-13px\">&nbsp;</div>";	
	}

	if (isBrowser.indexOf('MSIE') > -1)
		tabsDataDiv.innerHTML+="<br>";

	if (tabListData.length=="0")
	{	
		tabsDataDiv.innerHTML+="<table cellpadding='5' width='100%'><tr><td class='flexigrid' align='center'>No " + tabText + " available"+"</td></tr></table>";
	}
	else
	{	
		var listDataTbl = CreateTable(tabsDataDiv,'flextab','','','0','5');	
		var tabsPaginationDiv=CreateDIV(tabsDataDiv,"pagination","pagin"+tabId);
			createSubPagination(tabsPaginationDiv,pagAmt,currPageNo,totalPages,rowCount,tabId);

		var listDataTbhd = CreateThead(listDataTbl);
		var listDataTbdy = CreateBody(listDataTbl);
		var tabpageWidth=pageWidth1-150;
		if(tabHeaders.length>5)var tabpageWidth=pageWidth1-220;
		var colWidth=parseInt((tabpageWidth-25)/tabHeaders.length);		
		subMnuItmId="viewpage";
		/*if(tabHeaders.length==1)
		{
			colWidth=tabpageWidth+50;
		}
		else if(tabHeaders.length==2)
		{
			colWidth=parseInt(((tabpageWidth-25)/tabHeaders.length)+45);
		}
		else if(tabHeaders.length==3)
		{
			colWidth=parseInt(((tabpageWidth-25)/tabHeaders.length)+25);
		}
		else if(tabHeaders.length==4)
		{
			colWidth=parseInt(((tabpageWidth-25)/tabHeaders.length)+15);
		}
		else
		{
			colWidth=parseInt(((tabpageWidth-25)/tabHeaders.length)+(1.5*tabHeaders.length));
		}*/

		// Create Tab Headers
		var listHdrTr=CreateTR(listDataTbhd,'');
		for(var hdr=-1; hdr<tabHeaders.length; hdr++)
		{
			if(hdr==-1)
			{
				var listDataTh=CreateTH(listHdrTr,'TblHead','',colHeadTxt,'center');
				listDataTh.innerHTML="&nbsp;";
				listDataTh.width=25;
				
			}
			else
			{

				var colHeadTxt=tabHeaders[hdr].colmnDesc;
				var listDataTh=CreateTH(listHdrTr,'TblHead','',colHeadTxt,'center');
				listDataTh.width=colWidth;	
			}
		}
    }
	var rowNum=parseFloat((currPageNo)-1)*parseFloat(pagAmt);
	// Create Tab Line Items
	for(var rows=0; rows<tabListData.length; rows++)
	{
		rowNum++;
		var rowHdnFld=mnuItmId+'-row-hdn-'+rows;
		var rowId=mnuItmId+'-row-'+rows;
		CreateHIDDEN(document.getElementById(entityDiv), '', mnuItmId+'-row-hdn-'+rows);
		var listDataTr=CreateTR(listDataTbdy,'rowClass',rowId);
		var j=0;
		for(var cols=-1;cols<tabHeaders.length;cols++)
		{
			/***Show row in different color if the batch exists in the list and its assigned to the product****/
			if(tabText=="Invoice detail")
			{
			   var headerTxt=""; var colVal;
			   if(tabHeaders[cols]) {headerTxt=  tabHeaders[cols].colmnDesc;headerTxt=headerTxt.toLowerCase();}
			   if(tabListData[rows].data[cols]) colVal = tabListData[rows].data[cols].colTxt;
			   if(headerTxt.indexOf("batch")!=-1 && colVal !="")
				{
				   $(listDataTr).css({"background-color":"#E7E7FF"});
				}
			}
			/***Assign batch ends here****/

			if(cols!=-1)
			{
				var dataType=tabListData[rows].data[cols].colType;
				var listDataTxt=tabListData[rows].data[cols].colTxt;
				var txtAlign='';
				if(listDataTxt)
				switch(dataType)
				{
					case "decimal": 
					case "double": 
					case "float": 
					case "money":
					case "Decimal":
									txtAlign='right';	
									listDataTxt=ReplaceAll(listDataTxt,",","");
									listDataTxt=parseFloat(listDataTxt).toFixed(2);
									listDataTxt=FormatNumber(listDataTxt,1,2);
									break;
					
					case "Integer":
					case "integer": 
									txtAlign='right';	
									listDataTxt=ReplaceAll(listDataTxt,",","");
									listDataTxt=parseFloat(listDataTxt).toFixed(0);	
									listDataTxt=FormatNumber(listDataTxt,1,0);
									break;
					
					case "dateOnly":
					case "Date":
									txtAlign='center';
									listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy');
									if(Date.parse(listDataTxt))
										listDataTxt=dateFormat(listDataTxt, "dd-mmm-yyyy");
									else
										listDataTxt=tabListData[rows].data[cols].colTxt;
									break;

					case "timeOnly": 
					case "dateAndTime":
					case "DateTime":
									txtAlign='center';
									listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy');
									if(Date.parse(listDataTxt)){
										var d1 = new Date (listDataTxt);
										d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
										listDataTxt=dateFormat(d1, "dd-mmm-yyyy, hh:MM TT");
										var listDataTxtWithTimeZone = listDataTxt+' '+utzToShow;
										listDataTxt = listDataTxtWithTimeZone;
									}
									else
										listDataTxt=tabListData[rows].data[cols].colTxt;
									break;

					case "Multi":
									listDataTxt=ReplaceAll(listDataTxt,"~)",", ");

					case "multiLevelDropdown":
									var lastIndex=listDataTxt.lastIndexOf(">>")>0?listDataTxt.lastIndexOf(">>")+2:0;
									listDataTxt=listDataTxt.substring(lastIndex);
					default:
									txtAlign='left';break;

				}
				else var listDataTxt="--";				
				var listDataTd=CreateTD(listDataTr,'','','',txtAlign);				
				
				var moreLink=listDataTxt.indexOf('showFullContent');
				if(moreLink<0 && viewUrl!="" && viewUrl!="#")
				{
					listDataTd.style.cursor="pointer";						
					AddClickEventListener(listDataTd, 
						(function(viewIsFun,view2Url) { 
							return function() { 
								click2ViewData(viewIsFun,view2Url);
							}; 
						})(viewIsFun,view2Url) 
					);
				}
				listDataTd.innerHTML+=listDataTxt;
			}
			else
			{					
				var listDataTd=CreateTD(listDataTr,'','','','center');
				var view2Url;
				var viewIsURL=viewUrl.indexOf('url:');
				var viewIsFun=viewUrl.indexOf('javascript:');
				if(viewIsURL==0)view2Url=viewUrl.slice(4);else view2Url=viewUrl;

				if(viewIsFun!=0)
				{
					var viewParam=viewUrl.indexOf('?');
					if(viewParam>0)view2Url=zcServletPrefix+"/"+view2Url+"&id="+tabListData[rows].pkId;else view2Url=zcServletPrefix+"/"+view2Url+"?id="+tabListData[rows].pkId;
					view2Url = view2Url.replace(/\?/g,"~");
					view2Url = view2Url.replace(/&/g,"@");
					view2Url = view2Url.replace(/=/g,"*");
				}
				var url2Delete;
				var deleteIsURL=deleteUrl.indexOf('url:');
				var deleteIsFun=deleteUrl.indexOf('javascript:');
				if(deleteIsURL==0)url2Delete=deleteUrl.slice(4);else url2Delete=deleteUrl;
				
				if(viewIsFun==0)
				view2Url=view2Url.replace('PkVal',tabListData[rows].pkId);
				if(deleteIsFun!=0)
				{
					var deleteParam=deleteUrl.indexOf('?');
					if(deleteParam>0)url2Delete=zcServletPrefix+"/"+deleteUrl+"&id="+tabListData[rows].pkId;else  url2Delete=zcServletPrefix+"/"+url2Delete+"?id="+tabListData[rows].pkId;
					url2Delete = url2Delete.replace(/\?/g,"~");
					url2Delete = url2Delete.replace(/&/g,"@");
					url2Delete = url2Delete.replace(/=/g,"*");
				}

				if(deleteIsFun==0)
				url2Delete=url2Delete.replace('PkVal',tabListData[rows].pkId);

				//to give print url on sub tab lists for order,invoice.By Hamsa.
				var url2Print;
				var printIsURL=printUrl.indexOf('url:');
				var printIsFun=printUrl.indexOf('javascript:');
				if(printIsURL==0)url2Print=printUrl.slice(4);else url2Print=printUrl;
				
				if(printIsFun==0)
				url2Print=url2Print.replace('PkVal',tabListData[rows].pkId);
				if(printIsFun!=0)
				{
					var printParam=printUrl.indexOf('?');
					if(printParam>0)url2Print=zcServletPrefix+"/"+printUrl+"&id="+tabListData[rows].pkId;else  url2Print=zcServletPrefix+"/"+url2Print+"?id="+tabListData[rows].pkId;
					url2Print = url2Print.replace(/\?/g,"~");
					url2Print = url2Print.replace(/&/g,"@");
					url2Print = url2Print.replace(/=/g,"*");
				}

				if(printIsFun==0)
				url2Print=url2Print.replace('PkVal',tabListData[rows].pkId);
				
				var editParam=addUrl.indexOf('?');
				if(editParam>0)var editURL=zcServletPrefix+"/"+addUrl+"&id="+tabListData[rows].pkId;else var editURL=zcServletPrefix+"/"+addUrl+"?id="+tabListData[rows].pkId;

				if(Editable&&Editable=="No")
				addUrl="";
				
				if((viewUrl!="" && viewUrl!="#")||(addUrl!="" && addUrl!="#")||(deleteUrl!="" && deleteUrl!="#")||(printUrl!="" && printUrl!="#"))
				{
					var lineLevelMnu=CreateSPAN(listDataTd,'lineMnuSpan');
					lineLevelMnu.style.marginTop="17px";
					//var lineLevelMnuJoin=CreateSPAN(listDataTd,'lineLevelMnuJoin');
					var lineMenuUL = CreateUL(lineLevelMnu,'lineMnuUL');	
					
					if(viewUrl!="" && viewUrl!="#")
					{
						var viewAnc='#setUpPageParameters?viewUrl='+view2Url+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+Math.random();
						var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						if(viewIsURL==0) var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", view2Url, null, "View","View "+tabText); else if(viewIsFun==0) var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "",view2Url, null, "View","View "+tabText);else var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", viewAnc, null, "View","View "+tabText);
						lineMnuAnc.setAttribute('style','display: block;');
					}
					if(deleteUrl!="" && deleteUrl!="#")
					{
						var deleteAnc='#setUpPageParameters?deleteUrl='+url2Delete+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+Math.random();
						var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						if(deleteIsURL==0) var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", url2Delete, null, "Delete","Delete "+tabText); else if(deleteIsFun==0) var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "",url2Delete, null, "Delete","Delete "+tabText);else var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", deleteAnc, null, "Delete","Delete "+tabText);
						lineMnuAnc.setAttribute('style','display: block;');
					}
					if(addUrl!="" && addUrl!="#")
					{	
						if(addIsfunction!=0)
						{
							editURL = editURL.replace(/\?/g,"~");
							editURL = editURL.replace(/&/g,"@");
							editURL = editURL.replace(/=/g,"*");
							var editAnc='#setUpPageParameters?viewUrl='+editURL+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+Math.random();
						}
						var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						if(addIsfunction==0)var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", addUrl.replace('PkVal',tabListData[rows].pkId), null, "Edit","Edit "+tabText);else var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", editAnc, null, "Edit","Edit "+tabText);
						lineMnuAnc.setAttribute('style','display: block;');
					}
					if(printUrl!="" && printUrl!="#")
					{
						var printAnc='#setUpPageParameters?printUrl='+url2Print+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+Math.random();
						var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						if(printIsURL==0) var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", url2Print, null, "Print","Print "+tabText); else if(printIsFun==0) var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "",url2Print, null, "Print","Print "+tabText);else var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", printAnc, null, "Print","Print "+tabText);
						lineMnuAnc.setAttribute('style','display: block;');
					}
					/*if(tabText=="Invoice detail"&&tabId==501)
				    { 
						  var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						  var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", "javascript:editInvoiceDtl("+tabListData[rows].pkId+","+pkValue+")", null, "Edit","Edit");
						   lineMnuAnc.setAttribute('style','display: block;');
					}*/
					listDataTd.className='firstListColumn';
				}
				//For line level status change of invoice, By Hamsa.
				if(tabText=="Invoice detail"&&tabId==501)
				{   
					parent.G_allIdsForMassStatus=document.getElementById(mnuItmId+'-clipBoardId').value;
					var idExists=parent.G_allIdsForMassStatus.match(tabListData[rows].pkId);
					if(idExists)
						listDataTd.innerHTML+="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-"+tabListData[rows].pkId+"' name='"+mnuItmId+"-"+tabListData[rows].pkId+"' onclick=writeInClipBookView(this); checked><label for="+mnuItmId+"-"+tabListData[rows].pkId+"></label>";
					else
						listDataTd.innerHTML+="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-"+tabListData[rows].pkId+"' name='"+mnuItmId+"-"+tabListData[rows].pkId+"' onclick=writeInClipBookView(this);><label for="+mnuItmId+"-"+tabListData[rows].pkId+"></label>";

				}
				else listDataTd.innerHTML+="<img src='/atCRM/images/JSON/moreIcon.png'>";
				//listDataTd.innerHTML+=rowNum;
			}
		}
	}
	$('.flextab').flexigrid({height:'auto',striped:false});	
}


function subObjectData(tabDivName,tabHeaders,tabListData,tabText,viewUrl,addUrl,pagAmt,currPageNo)
{
	var tabsDataDiv=document.getElementById(tabDivName);
	tabsDataDiv.innerHTML="<div style=\"width:100%;text-align:right;margin-top:-10px\"><a class=\"tabIconNormalViewClass\" style=\"color:blue;\" classname=\"tabIconNormalViewClass\"  href=\"javascript:setUpPageParameters ('"+zcServletPrefix+"/"+addUrl+"','"+entityDiv+"')\" title=\"Add\">Add</a></div>";

	if (tabListData.length=="0")
	{	
		tabsDataDiv.innerHTML+="<table cellpadding='5' width='100%'><tr><td class='flexigrid' align='center'>No " + tabText + " available"+"</td></tr></table>";
	}
	else
	{	
		var listDataTbl = CreateTable(tabsDataDiv,'flextab','','','0','5');	
		var listDataTbhd = CreateThead(listDataTbl);
		var listDataTbdy = CreateBody(listDataTbl);
		var tabpageWidth=pageWidth1-150;
		var colWidth=parseInt((tabpageWidth)/tabHeaders.length);
		
		// Create Tab Headers
		var listHdrTr=CreateTR(listDataTbhd,'');
		for(var hdr=-1; hdr<tabHeaders.length; hdr++)
		{
			if(hdr==-1)
			{
				var listDataTh=CreateTH(listHdrTr,'TblHead','',colHeadTxt,'center');
				listDataTh.innerHTML="#";
				listDataTh.width=25;
			}
			else
			{
				var colHeadTxt=tabHeaders[hdr].colmnDesc;
				var listDataTh=CreateTH(listHdrTr,'TblHead','',colHeadTxt,'center');
				listDataTh.width=colWidth;	
			}
		}
    }
	
	var rowNum=parseFloat((currPageNo)-1)*parseFloat(pagAmt);
	// Create Tab Line Items
	for(var rows=0; rows<tabListData.length; rows++)
	{
		rowNum++;
		var rowHdnFld=mnuItmId+'-row-hdn-'+rows;
		var rowId=mnuItmId+'-row-'+rows;
		CreateHIDDEN(document.getElementById(entityDiv), '', mnuItmId+'-row-hdn-'+rows);
		var listDataTr=CreateTR(listDataTbdy,'rowClass',rowId);
		var j=0;
		for(var cols=-1;cols<tabHeaders.length;cols++)
		{
			if(cols!=-1)
			{
				var dataType=tabListData[rows].data[cols].colType;
				var listDataTxt=tabListData[rows].data[cols].colTxt;
				var txtAlign='';
				if(listDataTxt)
				switch(dataType)
				{
					case "decimal": 
					case "double": 
					case "float": 
					case "money":
					case "Decimal":
									txtAlign='right';	
									listDataTxt=ReplaceAll(listDataTxt,",","");
									listDataTxt=parseFloat(listDataTxt).toFixed(2);
									listDataTxt=FormatNumber(listDataTxt,1,2);
									break;
					
					case "Integer":
					case "integer": 
									txtAlign='right';	
									listDataTxt=ReplaceAll(listDataTxt,",","");
									listDataTxt=parseFloat(listDataTxt).toFixed(0);	
									listDataTxt=FormatNumber(listDataTxt,1,0);
									break;
					
					case "dateOnly":
					case "Date":
									txtAlign='center';
									listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy');
									if(Date.parse(listDataTxt))
										listDataTxt=dateFormat(listDataTxt, "dd-mmm-yyyy");
									else
										listDataTxt=tabListData[rows].data[cols].colTxt;
									break;

					case "timeOnly": 
					case "dateAndTime":
					case "DateTime":
									txtAlign='center';
									listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy');
									if(Date.parse(listDataTxt)){
										var d1 = new Date (listDataTxt);
										d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
										listDataTxt=dateFormat(d1, "dd-mmm-yyyy, hh:MM TT");
										var listDataTxtWithTimeZone = listDataTxt+' '+utzToShow;
										listDataTxt = listDataTxtWithTimeZone;
									}
									else
										listDataTxt=tabListData[rows].data[cols].colTxt;
									break;

					case "Multi":
									listDataTxt=ReplaceAll(listDataTxt,"~)",", ");

					case "multiLevelDropdown":
									var lastIndex=listDataTxt.lastIndexOf(">>")>0?listDataTxt.lastIndexOf(">>")+2:0;
									listDataTxt=listDataTxt.substring(lastIndex);
					default:
									txtAlign='left';break;

				}
				else var listDataTxt="--";				
				var listDataTd=CreateTD(listDataTr,'','','',txtAlign);				
				
				var moreLink=listDataTxt.indexOf('showFullContent');
				if(moreLink<0 && viewUrl!="" && viewUrl!="#")
				{
					listDataTd.style.cursor="pointer";						
					AddClickEventListener(listDataTd, 
						(function(viewIsFun,view2Url) { 
							return function() { 
								click2ViewData(viewIsFun,view2Url);
							}; 
						})(viewIsFun,view2Url) 
					);
				}
				listDataTd.innerHTML+=listDataTxt;
			}
			else
			{					
				var listDataTd=CreateTD(listDataTr,'','','','center');				
				//listDataTd.innerHTML+=rowNum;
				listDataTd.innerHTML+="<img src='/atCRM/images/JSON/moreIcon.png'>";
			}
		}
	}
	$('.flextab').flexigrid({height:'auto',striped:false});	
}

function createSubPagination(pgnDiv,pagningAmt,currntPage,totalPages,noItems,tabId)
{
	if(parseInt(currntPage)<parseInt(totalPages))var nxtPage=parseInt(currntPage)+1;else var nxtPage=currntPage;
	if(parseInt(currntPage)>1)var prePage=parseInt(currntPage)-1;else prePage=currntPage;
	var recStNo=eval((currntPage - 1) * pagningAmt)+parseInt(1);
	var recEnNo=(parseInt(recStNo)+parseInt(pagningAmt))-1;
	var paginationContent='';
	if(totalPages>1)
		paginationContent="<td style='vertical-align:middle'><img  title='First Page'src='/atCRM/images/JSON/first.gif' onclick='paginateSubTab(1,"+totalPages+","+currntPage+","+pagningAmt+","+tabId+");' style='cursor:pointer'><img  title='Previous Page' src='/atCRM/images/JSON/Pprev.gif' style='cursor:pointer' onclick='paginateSubTab("+prePage+","+totalPages+","+currntPage+","+pagningAmt+","+tabId+");'></td><td class='flexigrid' style='vertical-align:middle'>Page</td><td><input type='text' class='paginationBox' value='"+currntPage+"' title='Current page' onkeypress='return validCharsDOM(event,\"1234567890\")' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)paginateSubTab(this.value,"+totalPages+","+currntPage+","+pagningAmt+","+tabId+")' style='margin: 3px 2px 2px 2px'/><td class='flexigrid' style='vertical-align:middle'>of "+totalPages+"</td><td style='vertical-align:middle'><img title='Next Page' src='/atCRM/images/JSON/Nnext.gif' onclick='paginateSubTab("+nxtPage+","+totalPages+","+currntPage+","+pagningAmt+","+tabId+");' style='cursor:pointer'><img title='Last Page' src='/atCRM/images/JSON/last.gif' onclick=paginateSubTab("+totalPages+","+totalPages+","+currntPage+","+pagningAmt+","+tabId+") style='cursor:pointer'>";

		pgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' align='right' style='height: 25px;margin-right:25px'><tr valign='bottom'>"+paginationContent+"</tr></table>";
}

function paginateSubTab(pgNo,max,current,noItms,tabId)
{
	if(pgNo==current)
		return;
	if(pgNo<=max&&pgNo>0)
	{	
		var pagUrl=currPage;
		var quesIndex=pagUrl.indexOf('?') != "-1" ? pagUrl.indexOf('?'): pagUrl.length; 
		var pagUrlPath=pagUrl.substring(0,quesIndex); 
		var pagUrlParms=pagUrl.substring(quesIndex+1,pagUrl.length); 
		var pagUrlParms=changeParameterValue (pagUrlParms,'page__number__'+tabId,pgNo);
		pagUrl=pagUrlPath+"?"+pagUrlParms;
		setUpPageParameters (pagUrl,entityDiv);
	}	
}

function click2ViewData(viewIsFun,url)
{
	if(viewIsFun==0)
	{
		var fun=url.slice(11);
		var funName=fun.slice(0,fun.indexOf('('));
		var funParams=fun.slice((fun.indexOf('(')+1),(fun.length)-1);
		dispatch(formLoadFun,[formName,params]);
	}
	else
	{
		viewNavIds="";
		window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
	}
}

function rewriteViewPage()
{  
	if(currPage)
	setUpPageParameters (currPage,entityDiv);
}

function updateRecentlyVisited(data)
{
	var path1=data.ViewUrl;
	var path=path1.replace("/atCRM", zcServletPrefix);
	var displayName=data.PageCaption;
	var dispName=displayName.substring(displayName.indexOf("-")+1);
	tableName=data.tableName;
	if(tableName=="Account"||tableName=="Contact"||tableName=="Opportunity"||tableName=="activity"||tableName=="ticket"||tableName=="mktg_program")
	{
		var urltoupdateRV = zcServletPrefix+"/custom/system/updateRecentlyVisited.html?displayName="+dispName+"&tableName="+tableName+"&uri="+path;
		$.ajax({

			type: "GET",
			url: encodeURI(urltoupdateRV),
			dataType: "html",
			success: function (){				
			populateScreenData()
			}
		});
	}
}
//For unique field type validation on click to edit, By Hamsa.
function callUniqueValidationAjaxFromView(validationURL,txtBox,fieldName,fldVal)
{	
	var val = txtBox;
	var msg='';
	var retVal=true;
	if(fldVal != val)
	{	
	   var quesIndex=validationURL.indexOf('?'); 
	   if(quesIndex!="-1")validationURL=validationURL+"&str="+val;
	   else validationURL=validationURL+"?str="+val;
	     if (val!='')
	     {
		     $.ajax({
			   type: "GET",
			   url: validationURL,
			   dataType: "xml",
			   async:false,
			   success: function (doc)
			   {			
				  var details= doc.getElementsByTagName("details");				
				  var dets = details[0]?details[0].getAttribute("dets") : null;	
				  if(dets)
				  { 
					  retVal = false;
					  return retVal;
				  }
				  else
				  {
						 retVal = true;
						 return retVal;
				  }
			   }
			});
	      }
      }
	 return retVal;
}

function changeStageTypeBasedView(EntityName,id)
{
  var url2Hit=zcServletPrefix+"/custom/JSON/view/"+EntityName.toLowerCase()+"360View.htm?id="+id;
  $.ajax(
			{
                   type: "GET",
				   url:url2Hit,
				   dataType: "json",
				   async:false,
				   success: function (data)
						{
							handleJson360ViewData(data);
						}
								
			});	
			return true;
}

//For line level invoice status change, By Hamsa. 
function writeInClipBookView(chk)
{
	val=chk.id.split('-')[1];
	if(chk.checked==true)
	{
		document.getElementById(mnuItmId+'-clipBoardId').value+=val+',';
		parent.G_allIdsForMassStatus=document.getElementById(mnuItmId+'-clipBoardId').value;
	}
	else
	{
		parent.G_allIdsForMassStatus=document.getElementById(mnuItmId+'-clipBoardId').value;
		document.getElementById(mnuItmId+'-clipBoardId').value=parent.G_allIdsForMassStatus.replace(val+',','');

	}
}

function viewReloadForQuickAdd()
{	
	if(viewMainUrl){
		var viewURlSplit=viewMainUrl.toString().split("?")[1].split("&");
		var viewUrl=viewURlSplit[0].split("=")[1];
		//viewUrl=viewUrl.replace("~","?").replace("*","=");
		viewUrl = viewUrl.replace(/~/g,"?");
        viewUrl = viewUrl.replace(/\*/g,"=");
		viewUrl = viewUrl.replace(/@/g,"&");
		$.ajax({
				type: "GET",
				url: encodeURI(viewUrl),
				cache:false,
				dataType: "json",
				success: function (data){
					isFrmQuickAdd=true;
					handleJson360ViewData(data);
				}					
		});
	}
}


