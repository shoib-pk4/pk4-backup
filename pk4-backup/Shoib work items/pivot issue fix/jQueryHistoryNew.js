
function setupMainMenuUrlHistory(menuDoc,hash)
{
	 menuDoc = eval(menuDoc);
	 defMenu = menuDoc['BannerInfo'].defMenu;
		
	 var mnuCnt = menuDoc['BannerInfo'].menus.length;
	 var mnuObjs = menuDoc['BannerInfo'].menus;
	 for(i=0;i < mnuCnt;i++)
	 {
		 var aa = mnuObjs[i].submenu;
		 for(j=0;j < mnuObjs[i].submenu.length;j++)
			menuLinks ['link_'+i+'_'+j] = zcServletPrefix+"/"+aa[j].smenu[4];
	 }
	 var usrName = menuDoc['BannerInfo'].user;
	 var company = menuDoc['BannerInfo'].company;
	 
	 if(!defMenu)defMenu=mnuObjs[0].menuId;

	 var userNameCell = document.getElementById('userNameCell');
	 userNameCell.innerHTML='Hi '+usrName+', '+company;

	 var msgSpan = document.getElementById('MessagesSpan');
	 msgSpan.innerHTML='Messages ('+menuDoc['BannerInfo'].msgCount+')';

	 create_mainMenu(mnuObjs,mnuCnt);	
	 create_subMenu(mnuCnt,mnuObjs);

	 
	 var L_hashArr = hash.split("?");
	 var L_historyGrp  = L_hashArr[0];
	 var L_historyData = L_hashArr[1].split("&");

	if(L_historyGrp == "mainMenu")
	{
		var L_mnuId =  getValues("menuId",L_historyData);
		showMainMenu(L_mnuId,true);	
	}
	else if(L_historyGrp == "subMenu" )
	{
		L_mnuId =  getValues("mnuId",L_historyData);
		L_url	=  getValues("url",L_historyData);
		L_mnuId_para = L_mnuId.split("_");
		L_mnuId_para  = L_mnuId_para[1];
		$.ajax
		({
			type: "GET",
			url: "/atCRM/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
			dataType: "json",
			sync:true,
			success: function(data)
			{
				L_data=eval(data);
				L_id = L_data.mnuItmIdname[0].id;
				if(!mnuItmId)mnuItmId=L_id;
				
				showMainMenuHistory("mnuList_"+L_id,true);	
			 }
		 })
		 showSubMenu(L_mnuId) 
	}
	else if(L_historyGrp == "setUpPageParameters" )
	{
		L_mnuId =  getValues("shownSubMenu",L_historyData);
		L_url	=  getValues("url",L_historyData);
		L_mnuId_para = L_mnuId.split("_");
		L_mnuId_para  = L_mnuId_para[1];
		$.ajax
		({
			type: "GET",
			url: "/atCRM/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
			dataType: "json",
			sync:true,
			success: function(data)
			{
				L_data=eval(data);
				L_id = L_data.mnuItmIdname[0].id;
				if(!mnuItmId)mnuItmId=L_id;
				showMainMenuHistory("mnuList_"+L_id,true);	
			 }
		 })
		
		viewUrl = getValues("viewUrl",L_historyData);
		viewUrl = viewUrl.replace(/~/g,"?");
		viewUrl = viewUrl.replace(/@/g,"&");
		viewUrl = viewUrl.replace(/\*/g,"=");
		L_entityDiv = getValues("entityDiv",L_historyData);
		showSubMenuHistory(L_mnuId,null,null,null,null,viewUrl,L_entityDiv) 
		//setUpPageParameters(viewUrl,L_entityDiv);
	}
	else if(L_historyGrp == "thirdLevelMenu" )
	{
		L_mnuId =  getValues("mnuId",L_historyData);
		L_uri =  getValues("uri",L_historyData);
		L_fromMnu =  getValues("drop",L_historyData);
		L_dropIndex =  getValues("dropIndex",L_historyData);

		L_mnuId_para = L_mnuId.split("_");
		L_mnuId_para  = L_mnuId_para[1];
		$.ajax
		({
			type: "GET",
			url: "/atCRM/custom/JSON/system/getParentMnuItmId.htm?subMnuId="+L_mnuId_para,
			dataType: "json",
			sync:true,
			success: function(data)
			{
				L_data=eval(data);
				L_id = L_data.mnuItmIdname[0].id;
				if(!mnuItmId)mnuItmId=L_id;
				showMainMenuHistory("mnuList_"+L_id,true);	
			 }
		 })

		L_uri = L_uri.replace(/~/g,"?");
		L_uri = L_uri.replace(/@/g,"&");
		L_uri = L_uri.replace(/\*/g,"=");
		L_fromMnu =  getValues("drop",L_historyData);
		L_dropIndex =  getValues("dropIndex",L_historyData);
		showSubMenu(L_mnuId,L_uri,L_fromMnu,L_dropIndex) ;
	}

}

function showMainMenuHistory(objId,historyFlg,reloadFlag) 
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
	}
	catch (e)
	{
	}

}

function showSubMenuHistory (objId,uri,fromMnu,dropIndex,reloadFlag,viewUrl,L_entityDiv) 
{
	if(!fromMnu)fromMnu='sub'
	var i=objId.split('mnuList_')[1];
	if(!uri&&document.getElementById('url_'+i))
	var uri=zcServletPrefix+'/'+document.getElementById('url_'+i).value;
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
		if(document.getElementById(spnId)&&document.getElementById(spnId).className=="subMnuDropSpan")
		{
			document.getElementById(spnId).className="subMnuDropSpan_current";
		}
		else if(document.getElementById(spnId))
		document.getElementById(spnId).className="subMnuSpan_current";
	}
	shownSubMenu=objId;
	if(dropIndex&&dropIndex>=0)
	{
		document.getElementById(i+'-drop-'+dropIndex).className="subMnuDropLiAct";
		shownDropMenu=i+'-drop-'+dropIndex;
	}
	if(document.getElementById('OMnuName_'+i))
	var OMnuName=document.getElementById('OMnuName_'+i).value;
	//setUpPageParametersHistory(uri,OMnuName,fromMnu,i,reloadFlag);
	createEntityDiv(viewUrl,L_entityDiv)
	setUpPageParameters(viewUrl,L_entityDiv);

}

function showViewEdit (objId,uri,fromMnu,dropIndex,reloadFlag) 
{
	if(!fromMnu)fromMnu='sub'
	var i=objId.split('mnuList_')[1];
	if(!uri)
	var uri=zcServletPrefix+'/'+document.getElementById('url_'+i).value;
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
		document.getElementById(i+'-drop-'+dropIndex).className="subMnuDropLiAct";
		shownDropMenu=i+'-drop-'+dropIndex;
	}
	
	var OMnuName=document.getElementById('OMnuName_'+i).value;
}

function createEntityDiv(uri,objIdDetailed)
{
	objIdDetailed = objIdDetailed.split("-");
	objId = objIdDetailed[1];

	var addPage=uri.indexOf('/add/');
	if(addPage>0)
		entityDiv=objId+'-addEditDiv';
	else
		entityDiv=objId+'-DataDiv';

	if(document.getElementById(entityDiv))
	{
		return;
	}
	else
	{
		var detailDataDiv=document.getElementById('detailDataDiv');
		CreateDIV(detailDataDiv,'',entityDiv);
		if(document.getElementById(objId+'-URL'))
		{
			document.getElementById(objId+'-URL').value=uri;
		}
		else
		{
			CreateHIDDEN(document.getElementById('detailDataDiv'), '', objId+'-URL', uri);
		}
	}
	
}

function checkMenuOrder(varMnuId)
{
	var inDropDown = true;
	L_mnuID = varMnuId.split('mnuList_')[1];
	var n=document.getElementById('firstLevelMenu_ul').children;
	for(var i=0;i<n.length;i++)
	{
		if(document.getElementById(n[i].id).style.display=="block")
		{
			var menuId=n[i].id.split('mnuList_')[1];

			if (menuId == L_mnuID)
			{
				inDropDown = false;
				break;
			}
		}
	}
	
	if (inDropDown)
	{
		addMoreMenu(L_mnuID);
	}
	else
	{
		showMainMenu(L_menuId);
	}
}

function addMoreMenuHistory(objId)
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