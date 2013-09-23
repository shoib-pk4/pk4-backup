var defMenu;
var shownMainMenu;
var shownSubMenu;
var shownDropMenu;
var LastMainMenu;
var LastSubMenu=new Array();
var AllURIs=new Array();
var menuLinks = new Array();

function setupMainMenuUrl(menuDoc)
{
	 menuDoc = eval(menuDoc);
	 defMenu = menuDoc['BannerInfo'].defMenu;
	 
	 var mnuCnt = menuDoc['BannerInfo'].menus.length;
	 var mnuObjs = menuDoc['BannerInfo'].menus;
	 for(i=0;i < mnuCnt;i++)
	 {
		 var aa = mnuObjs[i].submenu;
		 for(j=0;j < mnuObjs[i].submenu.length;j++){
			menuLinks ['link_'+i+'_'+j] = zcServletPrefix+"/"+aa[j].smenu[4];
		}
	 }
	 var usrName = menuDoc['BannerInfo'].user;
	 var company = menuDoc['BannerInfo'].company;
	 
	 if(!defMenu)defMenu=mnuObjs[0].menuId;

	 var userNameCell = document.getElementById('userNameCell');
	 userNameCell.innerHTML='Hi '+usrName+', '+company;
	 session_login_name=usrName;

	 var msgSpan = document.getElementById('MessagesSpan');
	 msgSpan.innerHTML='Messages ('+menuDoc['BannerInfo'].msgCount+')';

	 create_mainMenu(mnuObjs,mnuCnt);	
	 create_subMenu(mnuCnt,mnuObjs);
	 showMainMenu ('mnuList_'+defMenu);
	 
	 if(flg_firstLoad)
	 {
		window.location.hash = '#mainMenu?menuId=mnuList_'+defMenu;
		flg_firstLoad  = false;
	 }
}

function create_mainMenu(mnuObjs,mnuCnt)
{
	var moreMenuIcon=0;
	var currentUL=document.getElementById('firstLevelMenu_ul');

	for(var i=0; i < mnuCnt; i++ )
	{
		var txt = mnuObjs[i].menu;
		var menuId = mnuObjs[i].menuId;
		if(i==0)
		{
			if(document.getElementById("mnuList_"+menuId))
			{
				break;
				return false;
			}
		}
		var menuLi = CreateLI(currentUL, 'firstLevelMenu_li', "mnuList_"+menuId);
		//AddClickEventListener(menuLi,showMainMenu);
		
		L_menu_a = CreateA(menuLi , "mnuSpan", "mnuSpan_"+menuId , "#mainMenu?menuId=mnuList_"+menuId, "", txt, txt );
		//L_menu_a = CreateA(menuLi , "mnuSpan", "mnuSpan_"+menuId , "javascript:showMainMenuTab('mnuList_"+menuId+"')", "", txt, txt );
		L_menu_a.setAttribute("rel","histroy");
		L_menu_a.style.outline="none";
		L_menu_a.style.cursor="hand";
		L_menu_a.whiteSpace="nowrap";
		
		//var menuTxt=CreateSPAN(L_menu_a, 'mnuSpan', "mnuSpan_"+menuId, txt, '', '');
		//menuTxt.setAttribute("noWrap","nowrap");

		var newSpan = CreateSPAN(menuLi, 'handle');	

		if(i>=7)
		menuLi.style.display="none";
		else
		{
			LastMainMenu=+menuId;
			menuLi.style.display="block";
		}
	}
	  $("#firstLevelMenu_ul").sortable({ 
		handle : '.handle', 
		items: 'li:not(.moreMenu)',
		update : function ()
		{ 
		  $("input#menu-log").val($('#firstLevelMenu_ul').sortable('serialize')); 
		  updateMenuOrder();
		} 
	  }); 	
	
	for(var i=0; i < mnuCnt; i++ )
	{
		if(i>=7)
		{	
			if(moreMenuIcon==0)
			{
				var tblTd=document.getElementById('firstLevelMenu')
				var moreMenu =  CreateLI(currentUL, 'moreMenu', "more");
				var moreMnuSpan=CreateSPAN(moreMenu, '', '', '&nbsp;');
				var moreMnuDiv= CreateDIV(moreMenu);
				var moreMnuUL = CreateUL(moreMnuDiv, 'moreMenuUL');
				moreMenuIcon++
			}
				var txt = mnuObjs[i].menu;
				var menuId = mnuObjs[i].menuId;
				var moreMnuLi = CreateLI(moreMnuUL, 'moreMenuLi', menuId);
				//moreMnuLi.innerHTML=txt;

				L_menu_a = CreateA(moreMnuLi ,"", "mnuSpan_"+menuId , "#mainMenu?menuId=mnuList_"+menuId, "", txt, txt );
				L_menu_a.setAttribute("rel","histroy");
				L_menu_a.style.outline="none";
				L_menu_a.style.cursor="hand";
				L_menu_a.whiteSpace="nowrap";


				//AddClickEventListener(moreMnuLi,addMoreMenu);
		}	
	}
	// Quick add menu
	var QAMenuDiv =  CreateDIV(currentUL, 'hover-menu', "categories-menu","Quick Add", "80px");
	QAMenuDiv.style.position="relative";
	var QAMenuUL = CreateUL(QAMenuDiv, 'actions no-style');
	QAMenuUL.style.position="absolute";
	QAMenuUL.style.display="none";
	var QAname;
	var QAAnchor;
	var QAListName=new Array("Account","Appointment","Contact","Lead","Opportunity","Task"); // Quick add menu name array
	var QAList=new Array("ACCT","APTMT","CONCT","LEAD","OPP","TSK"); // Quick add menu array

	for(QA=0;QA<QAList.length;QA++){
		QAname=QAListName[QA];
		if(QAListName[QA].length>12)
			QAname=QAname.substring(0,12)+"..";
		QAMenuUL.innerHTML += "<li onclick='showAQDialog(\""+QAList[QA]+"\",\"\",\"\",\"\")' title='"+QAListName[QA]+"'><a href='javascript:void(0)'>"+QAname+"</a></li>";
	}
	$(document).ready(function() {
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

function create_subMenu(cnt,mnuObjs)
{
	var secondLevelMenuTd=document.getElementById('secondLevelMenu');
	for(var i=0; i < cnt; i++ )
	{	
		var moreSubMenuIcon=0;
		var menuId = mnuObjs[i].menuId;
		var currentUL = CreateUL(secondLevelMenuTd, 'secondLevelMenu_ul', "secondLevelMenuUL_"+menuId); 
		currentUL.style.display="none";
		for (j=0;j<mnuObjs[i].submenu.length;j++)
		{
			var subMnu = mnuObjs[i].submenu[j];
			var subMnuId = subMnu.smenu[0];			
			var txt = subMnu.smenu[1]			
			var dropMenu = subMnu.smenu[2];			
			var desc = subMnu.smenu[3];		
			var url = subMnu.smenu[4];
			
			var locateSubString = url.substring(58,0);
			if(locateSubString == "custom/JSON/list/opportunityView.htm?prefId=9757&userEnt=" ){
				CreateHIDDEN(document.getElementById('detailDataDiv'), '', 'listPopUp-URL', url);
			}

			var origMnuName = subMnu.smenu[6];
			var baseURL = subMnu.smenu[7];

			var menuLi = CreateLI(currentUL, 'secondLevelMenu_li', "mnuList_"+subMnuId)
		
			if(j>=10)
				menuLi.style.display="none";
			else{
				LastSubMenu[menuId]=+subMnuId;
				menuLi.style.display="block";
			}
			if (dropMenu)
			{
				var menuTxt=CreateSPAN(menuLi, 'subMnuDropSpan', "subMnuSpan_"+subMnuId, '', '', desc);	
				var L_menu_a = CreateA(menuTxt , "", "" , "#subMenu?mnuId=mnuList_"+subMnuId+"&url="+url, "", txt, txt );
				L_menu_a.setAttribute("rel","histroy");
				L_menu_a.style.outline='none';
				L_menu_a.style.cursor="hand";
				L_menu_a.whiteSpace="nowrap";

				var subMnuDropDiv= CreateDIV(menuTxt);
				var subMnuDropUL = CreateUL(subMnuDropDiv, 'subMnuDropUL', 'mnuList_'+subMnuId);
				var menuUrl=CreateHIDDEN(menuLi, '', 'url_'+subMnuId, url);
				var BaseUrl=CreateHIDDEN(menuLi, '', 'baseUrl_'+subMnuId, baseURL);
				var menuOrigName=CreateHIDDEN(menuLi, '', 'OMnuName_'+subMnuId, menuId);
				menuUrl.style.display="none";
				create_thirdLevelMenu(dropMenu,subMnuDropUL,menuUrl,'mnuList_'+subMnuId);
			}
			else
			{
				var L_menu_a = CreateA(menuLi , "", "" , "#subMenu?mnuId=mnuList_"+subMnuId+"&url="+url, "", "", "" );
				L_menu_a.setAttribute("rel","histroy");
				L_menu_a.style.outline='none';
				L_menu_a.style.cursor="hand";
				L_menu_a.whiteSpace="nowrap";

				
				var menuTxt=CreateSPAN(L_menu_a, 'subMnuSpan', "subMnuSpan_"+subMnuId, txt, '', desc);		
				var menuUrl=CreateHIDDEN(menuLi, '', 'url_'+subMnuId, url);
				var BaseUrl=CreateHIDDEN(menuLi, '', 'baseUrl_'+subMnuId, baseURL);
				var menuOrigName=CreateHIDDEN(menuLi, '', 'OMnuName_'+subMnuId, menuId);
				menuUrl.style.display="none";		
				AddClickEventListener(menuLi,showSubMenu);
			}
			menuTxt.setAttribute("noWrap","nowrap");
			
			if(mnuObjs[i].submenu.length>1)
			{
				var newSpan = CreateSPAN(menuLi, 'subHandle');
				$("#secondLevelMenuUL_"+menuId).sortable({ 
					handle : '.subHandle', 
					update : function () 
					{ 	
						var elem=this.id;
						$("input#menu-log").val($('#'+elem).sortable('serialize')); 
						updateMenuOrder();
					} 
				}); 
			}
		}		
		for (j=0;j<mnuObjs[i].submenu.length;j++){
			if(j>=10){	
				if(moreSubMenuIcon==0){
					//var tblTd=document.getElementById('secondLevelMenu');
					var moreSubMenu =  CreateLI(currentUL, 'moreMenu', "secondMore");
					var moreSubMnuSpan=CreateSPAN(moreSubMenu, '', '', '&nbsp;');
					var moreSubMnuDiv= CreateDIV(moreSubMenu);
					var moreSubMnuUL = CreateUL(moreSubMnuDiv, 'moreMenuUL');
					moreSubMenuIcon++
				}
				var subMnu = mnuObjs[i].submenu[j];
				var txt = subMnu.smenu[1];
				var menuId = subMnu.smenu[0];
				var moreMnuLi = CreateLI(moreSubMnuUL, 'moreMenuLi', menuId);
				moreMnuLi.innerHTML=txt;
				AddClickEventListener(moreMnuLi,addMoreSubMenu);
			}	
		}
	}
}

function create_thirdLevelMenu(uri,parentUL,urlSpan,liId)
{
	var JSONURL= zcServletPrefix+"/"+uri ;
	$.ajax({
	type:"GET",
	async: true,
	url: encodeURI(JSONURL),
	success: function(doc)
	{
		try
		{
			var nextlevelSubMenu = doc.getElementsByTagName("SubMenuItems");
			var nextlevelSubMenuItems = nextlevelSubMenu[0] ? nextlevelSubMenu[0].getAttribute ("Items") : null;
			tempMenuString=nextlevelSubMenuItems.split(',');
			var dropLiId=liId.split('_')[1]+"-drop";
			var dropLiHddn=CreateHIDDEN(parentUL, '', dropLiId);

			for (i=0;i<tempMenuString.length-1;i++ )
			{
				var menuId=tempMenuString[i].split(':')[0];
				var menuString=tempMenuString[i].split(':')[1];
				var subMenuTitle=tempMenuString[i].split(':')[2];
				var newConstructedURI=urlSpan.value.split('?');
				var mainUrlParms=newConstructedURI[0]+"?"+changeParameterValue (newConstructedURI[1],'userEnt',menuString);	
				var uri=zcServletPrefix+'/'+mainUrlParms;
				//parentUL.innerHTML+="<li id= '"+dropLiId+"-"+i+"' onclick='showSubMenu(\""+liId+"\",\""+uri+"\",\"drop\","+i+")' class='subMnuDropLi' title='"+subMenuTitle+"'>"+menuString+"</li>";
				
				pURI = uri.replace(/\?/g,"~");
				pURI = pURI.replace(/&/g,"@");
				pURI = pURI.replace(/=/g,"*");

				L_href = "<a href='#thirdLevelMenu?mnuId="+liId+"&uri="+pURI+"&drop=drop&dropIndex="+i+"'>"+menuString+" </a>";
				parentUL.innerHTML+="<li id= '"+dropLiId+"-"+i+"'  class='subMnuDropLi' title='"+subMenuTitle+"'>"+L_href+"</li>";   //changed the click event to href by Jagadeesh.V
				if(i==0)
				document.getElementById(dropLiId).value=uri;
			}
			
		}
		catch (e)
		{
		}
	}});
}

function addMoreMenu(objId)
{
	document.getElementById('mnuList_'+objId).style.display="block";
	document.getElementById('mnuList_'+LastMainMenu).style.display="none";

	var LastMainMenuTxt=document.getElementById('mnuSpan_'+LastMainMenu).innerHTML;
	document.getElementById(objId).innerHTML="";

	L_menu_a = CreateA(document.getElementById(objId),"", "mnuSpan_"+LastMainMenu , "#mainMenu?menuId=mnuList_"+LastMainMenu, "", LastMainMenuTxt, LastMainMenuTxt );
	L_menu_a.setAttribute("rel","histroy");
	L_menu_a.style.outline="none";
	L_menu_a.style.cursor="hand";
	L_menu_a.whiteSpace="nowrap";
	
	document.getElementById(objId).id=LastMainMenu;
	showMainMenu ('mnuList_'+objId);
	document.getElementById('menu-log').value="";
	var n=document.getElementById('firstLevelMenu_ul').children;
	for(var i=0;i<n.length;i++)
	{
		if(document.getElementById(n[i].id).style.display=="block")
		{
		var menuId=n[i].id.split('mnuList_')[1];
		if(menuId)
		document.getElementById('menu-log').value+=menuId+",";
		}
	}
	for(var i=0;i<n.length;i++)
	{
		if(document.getElementById(n[i].id).style.display=="none")
		{
		var menuId=n[i].id.split('mnuList_')[1];
		if(menuId)
		document.getElementById('menu-log').value+=menuId+",";
		}
	}
    updateMenuOrder();
	LastMainMenu=objId;
}

function addMoreSubMenu(objId)
{
	document.getElementsByClassName = function(cl) {
		var myclass = cl;
		var elem = this.getElementsByTagName('*');
		for (var i = 0; i < elem.length; i++) {
			if(elem[i].className==myclass)
				return(elem[i].id);
		}
	}; 

	var mainMenuTabId=document.getElementsByClassName('firstLevelMenu_current');
	var mainMenuTabIdArry=mainMenuTabId.split("_");
	var mainMenuTabIdNo=mainMenuTabIdArry[1];
	document.getElementById('mnuList_'+objId).style.display="block";
	document.getElementById('mnuList_'+LastSubMenu[mainMenuTabIdNo]).style.display="none";

	var LastMainMenuTxt=document.getElementById('subMnuSpan_'+LastSubMenu[mainMenuTabIdNo]).innerHTML;
	document.getElementById(objId).innerHTML=LastMainMenuTxt;
	document.getElementById(objId).id=LastSubMenu[mainMenuTabIdNo];
	showSubMenu ('mnuList_'+objId);
	document.getElementById('menu-log').value="";
	var n=document.getElementById('secondLevelMenu').children;
	for(var i=0;i<n.length;i++)
	{
		if(document.getElementById(n[i].id).style.display=="block")
		{
		var menuId=n[i].id.split('mnuList_')[1];
		if(menuId)
		document.getElementById('menu-log').value+=menuId+",";
		}
	}
	for(var i=0;i<n.length;i++)
	{
		if(document.getElementById(n[i].id).style.display=="none")
		{
		var menuId=n[i].id.split('mnuList_')[1];
		if(menuId)
		document.getElementById('menu-log').value+=menuId+",";
		}
	}
    updateMenuOrder();
	LastSubMenu[mainMenuTabIdNo]=objId;
}

function updateMenuOrder()
{
	var mnuItems=document.getElementById('menu-log').value;
	mnuItems=ReplaceAll(mnuItems,"mnuList[]=","");
	mnuItems=ReplaceAll(mnuItems,"&",",");
	document.getElementById('menu-log').value=mnuItems;
	var url= zcServletPrefix+"/custom/JSON/system/reorderMenu.html?menus="+mnuItems;

	var mnuArray=mnuItems.split(',');
	for(var i=0;i<mnuArray.length;i++)
	{
		if(mnuArray[i])
		if(document.getElementById('mnuList_'+mnuArray[i]).style.display=="block")
		LastMainMenu=mnuArray[i];
	}

	$.ajax({
	   type: "GET",
	   async: false,
	   url: encodeURI(url)
	 });
}

var bool1 = 0 ;

function showMainMenu (objId,historyFlg,reloadFlag) 
{
	try
	{
		var i=objId.split('mnuList_')[1];
		var obj=document.getElementById("secondLevelMenuUL_"+i);
		obj.style.display = "block";
		if ((shownMainMenu)&&(shownMainMenu!="secondLevelMenuUL_"+i)) 
		{
			var shownobj=document.getElementById(shownMainMenu);
			shownobj.style.display = "none";
			var j=shownMainMenu.split('secondLevelMenuUL_')[1];
			document.getElementById("mnuList_"+j).className="firstLevelMenu_li";
		}
		shownMainMenu="secondLevelMenuUL_"+i;
		document.getElementById("mnuList_"+i).className="firstLevelMenu_current";

		var n=document.getElementById(shownMainMenu).children;
		var subMenuId=n[0].id;
		showSubMenu(subMenuId,'','main','',reloadFlag);
	}
	catch (e)
	{

	}

}

function showSubMenu (objId,uri,fromMnu,dropIndex,reloadFlag) 
{
	if(!fromMnu)fromMnu='sub'
	var i=objId.split('mnuList_')[1];
// User can add Menu item which will have link to non Impel pages. Ex:- Google, Gmail... Requirement:- Link to Kompas
//Vadiraj 9/18/2012
	var menuURL = document.getElementById('url_'+i).value;
	if(!uri && menuURL.indexOf('http://')>-1)
		var uri=menuURL;
	else
		var uri=zcServletPrefix+'/'+menuURL;

	if(shownDropMenu)
		document.getElementById(shownDropMenu).className="subMnuDropLi";
	
		
	if ((shownSubMenu)&&(shownSubMenu!=objId)) 
	{
		var shownSpnId= shownSubMenu.replace("mnuList","subMnuSpan");
		if(document.getElementById(shownSpnId).className=="subMnuDropSpan_current")
		{
		document.getElementById(shownSpnId).className="subMnuDropSpan";
		}
		else
		document.getElementById(shownSpnId).className="subMnuSpan";
	}
	if(shownSubMenu!=objId)
	{
		var spnId= objId.replace("mnuList","subMnuSpan");
		if(document.getElementById(spnId).className=="subMnuDropSpan")
		{
			document.getElementById(spnId).className="subMnuDropSpan_current";
		}
		else
		document.getElementById(spnId).className="subMnuSpan_current";
	}
	shownSubMenu=objId;
	if(dropIndex&&dropIndex>=0)
	{
		try
		{
			document.getElementById(i+'-drop-'+dropIndex).className="subMnuDropLiAct";	
		}
		catch (e)
		{}
		
		shownDropMenu=i+'-drop-'+dropIndex;
	}
	
	var OMnuName=document.getElementById('OMnuName_'+i).value;
	setUpPageParameters(uri,OMnuName,fromMnu,i,reloadFlag,'',dropIndex);
}

function showMainMenuTab(objId)
{
	window.location.href=zcServletPrefix+'/custom/JSON/homePage.html#mainMenu?menuId='+objId;
	objId=objId.replace('mnuList_','');
	if(document.getElementById(objId+'-URL')&&document.getElementById(objId+'-URL').value.indexOf('custom/JSON/list/container.htm')>0){retrieveListData();}
}