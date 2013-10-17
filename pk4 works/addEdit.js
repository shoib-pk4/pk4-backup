var fieldItems=new Array();
var fieldItemsListRowHeaders=new Array();
var listFieldItems=new Array();
var multiListFieldItems=new Array();
var noOfColumns=3;
var formAction;
var mandatoryFlds=new Array();
var mandatoryFldLbls=new Array();
var mandatoryFldElem=new Array();
var dateFlds=new Array();
var nonHiddenFlds;
var popupDiv;
var fromPage;
var currPageUDM;
var action;
var showAddLayout=false;
var listTblBdy;
var noOfRowsCreated=0;	
var noOfRowsCreated1=0;
var noOfRowsCreated2=0;
var returnFromEval=false;
var uniqueBoxMsg="";
var typingTimer4Ajax;
var doneTypingInterval = 1000;
var addData;
var priKeyVal="";
var G_data = '';
var dltDtlCSV ="";
var qtyUdtDtlCSV = "";
var dltDtlRowIndex= new Array();
var invQtyArray = new Array();

function handleAddEditJsonData(data,popupDiv,entityTilediv,popupAddUrl,popupListUrl,popupaddCaption,popuplistCaption,objId,strBck)
{	
	G_data = data;
	returnFromEval=false;
	showAddLayout=true;
	fieldItems.length=0;
	listFieldItems.length=0;
	multiListFieldItems.length=0;
	dateFlds.length=0;
	mandatoryFlds.length=0;
	mandatoryFldLbls.length=0;
	closeLoadingDiv();
	if(data.PrimaryKeyValue) priKeyVal = data.PrimaryKeyValue;
	else priKeyVal="";
	//Create div for addEdit
	if(!popupDiv)		
	{		
		if(entityDiv)
		{
		var entityListDiv=entityDiv;
		document.getElementById(entityDiv).style.display="none";
		if(entityDiv=="360ViewDiv")
			fromPage="view";
		else if(entityDiv.match("addEditDiv"))
			fromPage="add";
		else if(entityDiv.match("-DataDiv"))
			fromPage="list";
		}

		action = data.PageAction;
		currPageUDM = data.UDMName;
		entityDiv="addEditDiv";
		var mainDiv=document.getElementById('detailDataDiv');
		if(document.getElementById("addEditDiv"))
		{			
			var dataDiv=document.getElementById("addEditDiv");
			dataDiv.innerHTML="";				
			dataDiv.style.display='block';
		}
		else var dataDiv=CreateDIV(mainDiv,'',"addEditDiv",'','100%');					
	}
	else
	{
		var dataDiv=document.getElementById(popupDiv);
		dataDiv.innerHTML="";
	    mnuItmId=popupDiv;
	}

	//Check access rights for Edit
	if(data.territoryReadAccess==1)
	var ReadOnly=true;
	else
	var ReadOnly=false;
	var pageHeading=data.PageCaption;	
	document.title=pageHeading+' - Impel';	


	//Create the form fields, if user has "Edit" access, else show error message 
	if(ReadOnly==false)
	{
		var addEditForm=document.createElement("form");
		addEditForm.setAttribute("id","addEditForm");
		addEditForm.setAttribute("name","addEditForm");
		formAction=zcServletPrefix+data.editAction;
		dataDiv.appendChild(addEditForm);

		var mainTable=CreateTable(addEditForm,"",mnuItmId+"-MainTable","","","");
		var mainBody=CreateBody(mainTable,"","");
		var mainTR=CreateTR(mainBody,"","","");
		var mainTD=CreateTD(mainTR,"jsonHeading",mnuItmId+"-MainTd","");
		mainTable.style.width="100%";
		mainTable.style.align="center";
			//Create page top menu only for non popup screens
		if(!popupDiv)
		{	
			mainTD.innerHTML="<span class='jsonHeading' id='addEdit-Caption' name='addEdit-Caption'>"+pageHeading+"</span>";	
			var topMenuTbl = CreateTable(mainTD);
			var topMenuTbdy = CreateBody(topMenuTbl);	
			topMenuTbl.align="right";
			var topMenuTr=CreateTR(topMenuTbdy);	
			var prefsTd=CreateTD(topMenuTr);

			// Pass primary key value if its edit 
			if(data.PrimaryKeyValue)
			{
				var PkValue=data.PrimaryKeyValue;
				PkValue=PkValue.replace(/\,/g,"");
				PkValue=PkValue.split(".")
				PkValue=PkValue[0];
            }
			var prefsAncTxt="javascript:SetPreferences('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+data.PageCaption+"','"+PkValue+"')";			
		}
	 /*	var urlForMenu=zcServletPrefix+'/custom/JSON/admin/readMenuItems.htm?menu_level=4&orig_menu_name='+data.PrefsName;
		$.getJSON(urlForMenu,'',function(json)
		{
			var page_topMenu=json.page_topMenu;
			for(var topMenu=0;topMenu<page_topMenu.length; topMenu++)
			{
				var mnuName=page_topMenu[topMenu].menu[0];				
				if(mnuName=="Layout")showAddLayout=true;
			}
			
		});	*/
		/*********Check for the showLayout in the hidden element********/
		var showLayout = document.getElementById("input_layout").value;
		if(showLayout == "true")
			{
				var prefsAnc=CreateA(prefsTd, "tabIconNormalViewClass", "tab_Prefs", prefsAncTxt, null, "Layout","Change page layout");
				AddOnMouseOverEventListener(prefsAnc,function (){tabIconOnOverView('tab_Prefs')});
				AddOnMouseOutEventListener(prefsAnc,function (){tabIconNormalView(' ')});
			}
	 		
		var errorDiv=CreateDIV(mainTD,"jsonErrorDiv",'addEditErrorDiv',"");	
		CreateDIV(mainTD,"","blockedFieldsInfo","");
	}
	else
	{
		var errDiv=CreateDIV(dataDiv,'commonErrPopupDiv','addEditErrorDiv','','98%');
		errDiv.style.display="block";
		errDiv.style.width="600px";		
		var leftPos=((window.document.body.clientWidth)-900)/2;			
		errDiv.style.left=leftPos+"px";
		var findrecName=pageHeading.indexOf(":");
		var recName=pageHeading.substring(findrecName+2);
		errDiv.innerHTML="Oops! '"+recName+"' belongs to read-only territory, you do not have edit privilege";	
		return;
	}

	for(i in data){if(i=="TopPanel"){for(j in data[i]){fieldItems.push(data[i][j]);}}} 
	
	//Get Hidden fields count
	var hiddenFieldCount=0;
	for(var countforHF=0; countforHF<fieldItems.length; countforHF++)
	{
		var fieldType=fieldItems[countforHF].dataColumn[2];
		if (fieldType=="hiddenField")
		hiddenFieldCount++;
	}
	nonHiddenFlds=fieldItems.length-hiddenFieldCount;

	//Show an error message, if there is no prefs
	if(!data.PrefsId || nonHiddenFlds==0)
	{	
		if(data.PrimaryKeyValue)
			{
				var PkValue=data.PrimaryKeyValue;
				PkValue=PkValue.replace(/\,/g,"");
				PkValue=PkValue.split(".");
				PkValue=PkValue[0];
            }
		var errDiv=CreateDIV(dataDiv,'commonErrPopupDiv','addEditErrorDiv','','98%');
		errDiv.style.display="block";
		errDiv.style.width="600px";		
		var leftPos=((window.document.body.clientWidth)-900)/2;			
		errDiv.style.left=leftPos+"px";
		errDiv.innerHTML="Oops! It seems you don't have a page layout set up for this page. Click<a href=\"javascript:SetPreferences ('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+data.PageCaption+"','"+PkValue+"')\"> here</a> to set up this page's layout. Impel will remember your layout for future logins.";
		return;
	}

	//Build Form and form fields.
	var formLoadFun=data.onFormLoad;
	var formSubmitFun=data.onFormSubmission;
	//To get post submission function from json data, By Hamsa.
	var formSubmitPostFun=data.onFormPostSubmission;
	var addEditForm=document.getElementById("addEditForm");
	formName="addEditForm";	
	buildFields(data,popupDiv,formName);
	//return;
	builtListFields(data,formName);
	builtFooterListFields(data); 
	fillMultiSelectValues(); 
	buttonDiv=CreateDIV(addEditForm,'','addButtonDiv');
	buttonDiv.setAttribute("style","text-align:right;width:90%;margin-bottom:10px");	
	var butnLabel=data.actionLabel;
	var addNewBtnWidth;

	if(butnLabel)
	{
		updateButton=CreateButton(buttonDiv, "", "updateButton", butnLabel);
		$("#updateButton").button();
		updateButton.setAttribute("style","margin-right:15px;width:120px;");
	}
	else
	{
		if(data.PageAction=='Add')
		{	
			//Added by Dony on 05 Nov 2012
			addNewButton=CreateButton(buttonDiv, "", "addNnewButton", 'Add & New');
			$("#addNnewButton").button();
			AddClickEventListener(addNewButton,function(){updateData(formSubmitFun,formSubmitPostFun,'addNew')});
			addNewBtnWidth=document.getElementById("addNnewButton").offsetWidth;
            if(data.addLabel) var addLabel=data.addLabel;
			else var addLabel="Add";
            addNewButton.setAttribute("style","margin-right:15px;");
			updateButton=CreateButton(buttonDiv, "", "updateButton", addLabel);
			$("#updateButton").button();
			addData=data;
		}
		if(data.PageAction=='Edit')
		{
			updateButton=CreateButton(buttonDiv, "", "updateButton", 'Save');
			$("#updateButton").button();
		if(fromPage!="view")
			fromPage="list";
		}
		//updateButton.setAttribute("style","margin-right:15px;width:60px");
		updateButton.setAttribute("style","margin-right:15px;");
		if(data.PageAction=='Add') document.getElementById("updateButton").style.minWidth=addNewBtnWidth+'px';
	}
	AddClickEventListener(updateButton,function(){updateData(formSubmitFun,formSubmitPostFun)});
	
	if(!popupDiv)		
	{
		cancelButton=CreateButton(buttonDiv, "", "cancelButton", "Cancel");
		$("#cancelButton").button();
		//cancelButton.setAttribute("style","width:60px");
		if(fromPage!="view")
		fromPage="list";
		AddClickEventListener(cancelButton,function (){responsePage(mnuItmId,fromPage,false,action);});
		document.getElementById("cancelButton").style.minWidth=addNewBtnWidth+'px';
		//document.getElementById("cancelButton").style.height="35px";
        if(data.PageAction=='Edit'){
			var cancelBtnWidth=document.getElementById("cancelButton").offsetWidth;
			document.getElementById("updateButton").style.minWidth=cancelBtnWidth+'px';
		}
	}
	
	//To show cash memo(adding invoice without taxes) on add invoice, By Hamsa.
	if(data.UDMName=="custom/JSON/add/invoices")
	{  
		var isCashMemo= getParameterValue (document.getElementById('addEdit-URL').value,'cashMemo');
		if(isCashMemo=="true")
		{
		if(document.getElementById('FrieghtDivId')){var FrieghtDiv=document.getElementById('FrieghtDivId');
		if(document.getElementById('grandTotalDivId'))var grandTotalDivObj=document.getElementById('grandTotalDivId');
			grandTotalDivObj.style.visibility="visible";
			FrieghtDiv.appendChild(grandTotalDivObj);

		var updateCashButton=CreateButton(FrieghtDiv, "greenButton", "updateCashButton", "Cash Memo");}
		else{if(document.getElementById('totalDivId'))var totalDiv=document.getElementById('totalDivId');
		var updateCashButton=CreateButton(totalDiv, "greenButton", "updateCashButton", "Cash Memo");}
		updateCashButton.setAttribute("style","margin-right:30px;width:80px");
		AddClickEventListener(updateCashButton,function()
		{
			if(document.getElementById('FrieghtDivId')){var FrieghtDivObj=document.getElementById('FrieghtDivId');
			FrieghtDivObj.style.visibility="visible";}
			else{if(document.getElementById('totalDivId'))var totalPriceObj=document.getElementById('totalDivId');
			totalPriceObj.style.visibility="visible";}
			if(document.getElementById('updateCashButton'))var updateCashButtonObj=document.getElementById('updateCashButton');
			updateData(formSubmitFun,formSubmitPostFun);
		});
			cancelButton=CreateButton(FrieghtDiv, "greenButton", "cancelButton", "Cancel");
			cancelButton.setAttribute("style","width:60px");
			if(fromPage!="view")
			fromPage="list";
			AddClickEventListener(cancelButton,function (){responsePage(mnuItmId,fromPage,false,action);});
			document.getElementById('footerTable').style.display="none";
			document.getElementById('addButtonDiv').style.display="none";
		}
	}
	if(formLoadFun)
	{
		var loadfunct=formLoadFun.split('~)');
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
					var fnName=formLoadFun.substring(0,q); 
				}
				addEditForm.onLoad=dispatch(loadfunct[i],params2use);
			}
		}
	}
 }

function addMoreRows(data)
{
	builtMultiAddListFields(data);
}

//This is to build the entire page with field items and labels.
function buildFields(data,popupDiv,formName)
{

	var mainTD=document.getElementById(mnuItmId+"-MainTd");
	var numFieldsWritten=0;
	var firstFldName=fieldItems[0].dataColumn[0];
	var fldObj;
	var udmName = data.UDMName;
	var priKey = data.PrimaryKeyValue;
	if((firstFldName!="n")&&((firstFldName.split('~)').length)!=2))
	{
		var sectionDivMain=CreateDIV(mainTD);		
		var sectionDiv=CreateDIV(sectionDivMain,"","","");	
		if(!popupDiv)sectionDivMain.style.marginTop="15px";
		fieldTable=CreateTable(sectionDiv,"","","white","0","3");
		fieldTable.style.width="100%";
		fieldTable.cellPadding="3";
		var fieldTblBdy=CreateBody(fieldTable,"","");
		console.log(udmName + '-' + mnuItmId + '-' + priKey);
	}
	for(var x=0; x<fieldItems.length; x++)
	{
		var fieldName=fieldItems[x].dataColumn[0];
		var elemId=fieldItems[x].dataColumn[1];
		var fieldType=fieldItems[x].dataColumn[2];
		var nullableFld=fieldItems[x].dataColumn[5];		
		var fldVal=fieldItems[x].dataColumn[6];		
        var columnName=fieldItems[x].dataColumn[10];		
		var strColumnName=fieldItems[x].dataColumn[11];
		/*If invoice edit mode dont show the header discount fields and create with modified fields id's. 
		Which is used on the creation of footer discout fields(values will be copied to the footer discount fields).*/
		if(udmName=="custom/JSON/add/invoices" && priKey !="" &&(elemId=="0-1-850"||elemId=="0-1-851"))
		{
			   fieldType = "hiddenField";
			   elemId +="_hdn";
		}

		if(numFieldsWritten%noOfColumns==0&&fieldType!='hiddenField')
		{  
			fieldTblTr=CreateTR(fieldTblBdy,"","","");
		}
	  
		if(fieldItems[x].dataColumn.length>1)
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
						mandatoryFlds.push(elemId_new);
					}
					else
					mandatoryFlds.push(elemId);
					mandatoryFldLbls.push(fieldName);
					var labelClass="ItemLabel";
					fieldName=fieldName+"<font color='#FF0000'>*</font><br />";	
				}
				//Create Label for form field
				if(fieldType!="Button")
				{
					var fieldTblTd=CreateTD(fieldTblTr,labelClass,fieldName);				
					fieldTblTd.innerHTML = fieldName+"\n";
					fieldTblTd.style.width="13%";
				}
					if(popupDiv)
					{
						
						fieldTblTd.style.width="33%";
						var fieldElemTd=fieldTblTd;
						fieldTblTd.style.verticalAlign="top";
					}
					else
					{
						var fieldElemTd=CreateTD(fieldTblTr,"WhiteItemLabel");
						fieldElemTd.style.width="20%";
						if(fieldType!="Button")fieldElemTd.colSpan="2";
					}
				
				//Create Form field			
				fldObj= createFormFields(fieldElemTd,fieldItems[x],formName,data);
				numFieldsWritten++;
				//if(popupDiv) fldObj.style.marginTop="2px";	
			}
			else{
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
				var exp = desc.split('~(')[1]; 	
				desc=desc.split('~(')[0];
				numFieldsWritten=0;				
				var sectionDivMain=CreateDIV(mainTD);
				var sectionDivHdr=CreateDIV(sectionDivMain,'sectionDivHdr');
				var sectionDiv=CreateDIV(sectionDivMain,"sectionDiv","addEdit_sec_div"+x,"");			
				sectionDivHdr.innerHTML=desc;
				sectionDivMain.style.marginTop="15px";
				fieldTable=CreateTable(sectionDiv,"",'addEdit_sec_tbl_'+x,"white","0","3");			
				fieldTable.style.width="100%";
				fieldTable.cellPadding="3";
				fieldTblBdy=CreateBody(fieldTable,"","");
				if(exp=="C")
				{
					fieldTable.style.display="none";	
					sectionDiv.style.display="none";	
					sectionDivHdr.innerHTML+='<img id="addEdit_sec_img_'+x+'" name="addEdit_sec_img_'+x+'" src="/atCRM/stylesheets/JSON/jquery/images/uup.png" title="Expand" style="float: left;padding-right:8px;margin-top:5px;">';
					
				}	
				else
				{
					fieldTable.style.display="";	
					sectionDiv.style.display="";	
					sectionDivHdr.innerHTML+='<img id="addEdit_sec_img_'+x+'" name="addEdit_sec_img_'+x+'" src="/atCRM/stylesheets/JSON/jquery/images/ddn.png" title="Expand" style="float: left;padding-right:8px;margin-top:5px;">';
				}
				AddClickEventListener(sectionDivHdr,(function(x) {return function()
					{
					document.getElementById('addEdit_sec_tbl_'+x).style.display="";
					expandSection('addEdit_sec_img_'+x,'addEdit_sec_div'+x);
					};})(x)); 
				   sectionDivHdr.style.cursor="pointer"; 	 		
				  	
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
	if(numFieldsWritten%noOfColumns!=0)
	{
		var colSpan=(noOfColumns-(numFieldsWritten%noOfColumns))*2;
		var fieldTblTd=CreateTD(fieldTblTr,"WhiteItemLabel","fieldLblTd",colSpan);
	}
}

function builtListFields(data)
{	
	noOfRowsCreated=0;
	noOfRowsCreated1=0;
	noOfRowsCreated2=0;
	var recId;
	invQtyArray = [];
	dltDtlRowIndex = [];
	if(data.PrimaryKeyValue) recId = data.PrimaryKeyValue;
	var ListPanelHeaders=data.ListPanelHeaders; 
	var ListPanelRows=data.ListPanelRows; 
	var mainTD=document.getElementById(mnuItmId+"-MainTd");
	var rowNum;
	if(recId && data.quoteDtlRows) 
		rowNum=data.quoteDtlRows;
	else if(recId && data.invDtlRows) 
		rowNum=data.invDtlRows;
	else if(doc.PrefsName && doc.PrefsName=='finTransMAdd')
		rowNum=ListPanelRows.length; 
	else
	 rowNum=5;

	if(ListPanelHeaders)
	{
	if(ListPanelHeaders&&ListPanelHeaders.length>0)
	{	
		//adding prefs name as class
		if(doc.PrefsName && doc.PrefsName=='finTransMAdd')
			lstTable=CreateTable(mainTD,"sectionDiv "+doc.PrefsName+"_tbl","","","0","1");
		else
			lstTable=CreateTable(mainTD,"sectionDiv","","","0","3");

		lstTable.style.width="100%";
		// lstTable.cellPadding="3";
		//lstTable.style.marginTop="15px";
		var listTblHd = CreateThead(lstTable); 
		listTblBdy = CreateBody(lstTable,'','listItemsTableBody'); 
		var listHdTr=CreateTR(listTblHd);

		var listTh=CreateTH(listHdTr,'TblHead','','#','center');
		for(var cols=0;cols<ListPanelHeaders.length;cols++)
		{
			var colHeadTxt=ListPanelHeaders[cols].colmnDesc;
			var listTh=CreateTH(listHdTr,'TblHead','',colHeadTxt,'center');
		}
		
		for(var rows=0;rows<rowNum;rows++)
		{   
			var listTr=CreateTR(listTblBdy);
			if(ListPanelRows[rows])
			{
			var colmns=(ListPanelRows[rows].columns.length);
			var cnt=rows+1
			var fieldLstTd=CreateTD(listTr,'ItemLabel','','','',cnt);
			fieldLstTd.setAttribute("style", "text-align:center");
			for(var cols=0;cols<colmns;cols++)
			{
				var fieldName=ListPanelRows[rows].columns[cols].dataColumn[0];
				var elemId=ListPanelRows[rows].columns[cols].dataColumn[1];
				var fieldType=ListPanelRows[rows].columns[cols].dataColumn[2];
				var nullableFld=ListPanelRows[rows].columns[cols].dataColumn[5];
				var fldVal=ListPanelRows[rows].columns[cols].dataColumn[6];
				listFieldItems.push(ListPanelRows[rows].columns[cols]);
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				{
					if(nullableFld=="0")
					{
						var labelClass="ItemLabel";	
						if(fieldType=="multiSelect")
						{  	
							var elemId_new = elemId.substr(0,elemId.lastIndexOf("-"));
							mandatoryFlds.push(elemId_new);
						}
						else
						mandatoryFlds.push(elemId);
						mandatoryFldLbls.push(fieldName);
						var labelClass="ItemLabel";
						fieldName=fieldName+"<font color='#FF0000'>*</font><br />";	
					}
					var fieldLstTd=CreateTD(listTr,'ItemLabel');
					createFormFields(fieldLstTd,ListPanelRows[rows].columns[cols],'',data);
				}
				else
				CreateHIDDEN(mainTD, "", elemId, fldVal);
				/*If invoice edit page store qty values in an array 'invQtyArray' and create delete dtl image*/
				 if(data.UDMName=="custom/JSON/add/invoices"&& recId){
                     if(elemId == "0-1001:"+rows+"-1101-1103") invQtyArray.push(fldVal);
					 if(elemId == "0-1001:"+rows+"-1101-2201" && document.getElementById("0-1001:"+rows+"-1101-2201")) document.getElementById("0-1001:"+rows+"-1101-2201").disabled=true;
					 if(elemId == "0-1001:"+rows+"-1101-2201_add" && document.getElementById("0-1001:"+rows+"-1101-2201_add")) document.getElementById("0-1001:"+rows+"-1101-2201_add").style.display="none";
					 if(cols==(colmns-1)){
					 var dtlPriKey = document.getElementById("0-1001:"+rows+"-1101-1102").value;
                     $(fieldLstTd).append("<span id='invDtl_spn_dlt_"+rows+"' style='position:absolute;float:right;z-index:20;right:-7px;'><img src='/atCRM/images/JSON/delete-icon.png' id='dlt_img_"+rows+"' title='Remove this row' onclick='javascript:deleteInvDtl(this,\""+recId+"\",\""+dtlPriKey+"\");' style='cursor:pointer;vertical-align:bottom;'/></span>");
				    }
			      }
			 }
			}
		}
		buttonDiv=CreateDIV(mainTD);
		buttonDiv.setAttribute("id","moreLinkDivId");
		buttonDiv.setAttribute("style","align:right;text-align:right;width:98%");
		if(data.multiAdd == 1)
		{
			var AddRowsAnch = CreateA(buttonDiv, "tabIconNormalViewClass", "MoreLinkId",null,null,"+More Lines","Click For More Lines");
			AddClickEventListener(AddRowsAnch,function (){addMoreRows(data)});
		}
	}
	}
	
	var ListPanelHeaders1=data.ListPanelHeaders1;
	if(ListPanelHeaders1)
	{
	var ListPanelRows1=data.ListPanelRows1;
	if(ListPanelHeaders1&&ListPanelHeaders1.length>0)
	{		
		lstTable=CreateTable(mainTD,"sectionDiv","","","0","3");
		lstTable.style.width="100%";
		lstTable.cellPadding="3";
		//lstTable.style.marginTop="15px";
		var listTblHd = CreateThead(lstTable);

		if(data.UDMName=="custom/JSON/add/salesAutomation" || data.UDMName=="custom/JSON/add/Lead")
		{	
		var listHdTrforSection=CreateTR(listTblHd);
		listHdTrforSection.style.width="100%";
		var listHdTrforSectionTD=CreateTD(listHdTrforSection);
		listHdTrforSectionTD.colSpan="5";
		var secDiv4Cat=CreateDIV(listHdTrforSectionTD,'sectionDivHdr')
		secDiv4Cat.style.width="99.5%";
		secDiv4Cat.style.height="100%";
		secDiv4Cat.style.marginLeft="-3px";
		secDiv4Cat.style.marginTop="-3px";
		secDiv4Cat.innerHTML="Category Break up";
		}

		listTblBdy = CreateBody(lstTable); 
		var listHdTr=CreateTR(listTblHd);	

		var listTh=CreateTH(listHdTr,'TblHead','','#','center');
		for(var cols=0;cols<ListPanelHeaders1.length;cols++)
		{
			var colHeadTxt=ListPanelHeaders1[cols].colmnDesc;
			var listTh=CreateTH(listHdTr,'TblHead','',colHeadTxt,'center');
		}
		
		for(var rows=0;rows<ListPanelRows1.length;rows++)
		{
			var listTr=CreateTR(listTblBdy);
			var colmns=(ListPanelRows1[rows].columns.length);
			var cnt=rows+1
			var fieldLstTd=CreateTD(listTr,'ItemLabel','','','',cnt);
			fieldLstTd.setAttribute("style", "text-align:center");
			for(var cols=0;cols<colmns;cols++)
			{
				var fieldName=ListPanelRows1[rows].columns[cols].dataColumn[0];

				var elemId=ListPanelRows1[rows].columns[cols].dataColumn[1];
				
				var fieldType=ListPanelRows1[rows].columns[cols].dataColumn[2];
				
				var fldVal=ListPanelRows1[rows].columns[cols].dataColumn[6];
			

				listFieldItems.push(ListPanelRows1[rows].columns[cols]);
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				{
					var fieldLstTd=CreateTD(listTr,'ItemLabel');
					createFormFields(fieldLstTd,ListPanelRows1[rows].columns[cols],'',data);
				}
				else
				CreateHIDDEN(mainTD, "", elemId, fldVal);
			}
		}
		buttonDiv=CreateDIV(mainTD);
		buttonDiv.setAttribute("style","text-align:right;width:95%");
		if(data.multiAdd == 1)
		{
			var AddRowsAnch = CreateButton(buttonDiv, "greenButton", "updateButton", '+More');
			AddClickEventListener(AddRowsAnch,function (){addMoreRows(data)});
		} 
	}
	} 


	var ListPanelHeaders2=data.ListPanelHeaders2;
	if(ListPanelHeaders2)
	{
	var ListPanelRows2=data.ListPanelRows2;
	if(ListPanelHeaders2&&ListPanelHeaders2.length>0)
	{		
		lstTable=CreateTable(mainTD,"sectionDiv","","","0","3");
		lstTable.style.width="100%";
		lstTable.cellPadding="3";
		//lstTable.style.marginTop="15px";
		var listTblHd = CreateThead(lstTable); 
		listTblBdy = CreateBody(lstTable); 
		var listHdTr=CreateTR(listTblHd);

		var listTh=CreateTH(listHdTr,'TblHead','','#','center');
		for(var cols=0;cols<ListPanelHeaders2.length;cols++)
		{
			var colHeadTxt=ListPanelHeaders2[cols].colmnDesc;
			var listTh=CreateTH(listHdTr,'TblHead','',colHeadTxt,'center');
		}
		
		for(var rows=0;rows<ListPanelRows2.length;rows++)
		{
			var listTr=CreateTR(listTblBdy);
			var colmns=(ListPanelRows2[rows].columns.length);
			var cnt=rows+1
			var fieldLstTd=CreateTD(listTr,'ItemLabel','','','',cnt);
			fieldLstTd.setAttribute("style", "text-align:center");
			for(var cols=0;cols<colmns;cols++)
			{
				var fieldName=ListPanelRows2[rows].columns[cols].dataColumn[0];

				var elemId=ListPanelRows2[rows].columns[cols].dataColumn[1];
				
				var fieldType=ListPanelRows2[rows].columns[cols].dataColumn[2];
				
				var fldVal=ListPanelRows2[rows].columns[cols].dataColumn[6];
			

				listFieldItems.push(ListPanelRows2[rows].columns[cols]);
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				{
					var fieldLstTd=CreateTD(listTr,'ItemLabel');
					createFormFields(fieldLstTd,ListPanelRows2[rows].columns[cols],'',data);
				}
				else
				CreateHIDDEN(mainTD, "", elemId, fldVal);
			}
		}
		buttonDiv=CreateDIV(mainTD);
		buttonDiv.setAttribute("style","text-align:right;width:95%");
		if(data.multiAdd == 1)
		{
			var AddRowsAnch = CreateButton(buttonDiv, "greenButton", "updateButton", '+More');
			AddClickEventListener(AddRowsAnch,function (){addMoreRows(data)});
		} 
	}
	}

}

function builtFooterListFields(data)
{	
	var ListFooterHeaders=data.ListFooterHeaders; 
	var ListFooterRows=data.ListFooterRows; 
	var totalPrice=data.totalPrice;
	var priKey=data.PrimaryKeyValue;
	var mainTD=document.getElementById(mnuItmId+"-MainTd");
	if(ListFooterHeaders&&ListFooterHeaders.length>0)
	{	
		var sectionDivMain=CreateDIV(mainTD);
		
		var totalDiv=CreateDIV(sectionDivMain,'totalDiv','totalDivId');
		totalDiv.align="right";
		totalDiv.style.cssFloat="right";
		totalDiv.style.width="350px";
		totalDiv.style.paddingRight='20px';
		var totalSpan=CreateSPAN(totalDiv, 'subHeadingBig', '', 'Total (Rs) ');
		var total=CreateTEXTBOX(totalDiv, 'inputFieldBig', 'totalPrice');
		total.style.width="150px";
		total.style.textAlign="right";
		total.disabled=true;
		if(data.UDMName=="custom/JSON/add/invoices")
		{
			var discTotalDiv=CreateDIV(sectionDivMain,'totalDiv','DisctotalDivId');
			discTotalDiv.align="right";
			discTotalDiv.style.cssFloat="right";
			discTotalDiv.style.width="550px";
			var discPctLbl = CreateLABEL(discTotalDiv, 'ItemLabel', '', 'Discount (%) ');
			discPctLbl.style.display="inline";
			var disc_pct=CreateTEXTBOX(discTotalDiv, 'inputFieldClass', '0-1-851');
			disc_pct.setAttribute("onkeypress","return numbersonly(this,event,true,false);");
			disc_pct.style.width="80px";
			disc_pct.style.textAlign="right";
			AddBlurEventListener(disc_pct,function (){calDisPctTotalPrice4Inv(document.getElementById('0-1-851').value)});
			//If edit get the discount percent value and assign it to the disc pct elemt
			if(priKey !="" && document.getElementById("0-1-851_hdn")) disc_pct.value=document.getElementById("0-1-851_hdn").value;
			var discAmtLbl=CreateLABEL(discTotalDiv, 'ItemLabel', '', ' OR Discount (Rs) ');
			discAmtLbl.style.display="inline";
			var disc_amt=CreateTEXTBOX(discTotalDiv, 'inputFieldClass', '0-1-850');
			disc_amt.setAttribute("onkeypress","return numbersonly(this,event,true,false);");
			disc_amt.style.width="80px";
			disc_amt.style.textAlign="right";
			AddBlurEventListener(disc_amt,function (){calDisAmtTotalPrice4Inv(document.getElementById('0-1-850').value)});
			//If edit get the discount percent value and assign it to the disc pct elemt
			if(priKey !="" && document.getElementById("0-1-850_hdn")){
				var discAmt = document.getElementById("0-1-850_hdn").value; discAmt=discAmt.replace(/,/g,"");discAmt=discAmt.replace(/Rs./g,"");
				disc_amt.value=discAmt;
			}
		}
		footerTable=CreateTable(mainTD,"","footerTable");
		footerTable.width="100%";
		var ftrTblBdy = CreateThead(footerTable);
		var ftrTblTr=CreateTR(ftrTblBdy);
		var ftrTblTd1=CreateTD(ftrTblTr);
	
		var sectionDivMain=CreateDIV(ftrTblTd1);
		var sectionDivHdr=CreateDIV(sectionDivMain,'sectionDivHdr');			
		sectionDivHdr.innerHTML="Collection";
		sectionDivMain.style.marginTop="5px";
		var totalCollection=CreateSPAN(sectionDivHdr,'','totalCollection');
		totalCollection.style.cssFloat="right";
		ftrTable=CreateTable(ftrTblTd1,"sectionDiv","","","0","3");
		ftrTable.style.width="100%";
		ftrTable.cellPadding="3";
		var listTblHd = CreateThead(ftrTable); 
		ftrTblBdy = CreateBody(ftrTable); 
		var listHdTr=CreateTR(listTblHd);

		if(data.UDMName=="custom/JSON/add/quote_header")
		{
			sectionDivHdr.innerHTML="";
			sectionDivHdr.style.display="none";
			ftrTable.style.display="none";
		}
		//var listTh=CreateTH(listHdTr,'TblHead','','#','center');
		for(var cols=0;cols<ListFooterHeaders.length;cols++)
		{
			var colHeadTxt=ListFooterHeaders[cols].colmnDesc;
			var listTh=CreateTH(listHdTr,'TblHead','',colHeadTxt,'center');
		}
		
		for(var rows=0;rows<ListFooterRows.length;rows++)
		{
			var listTr=CreateTR(ftrTblBdy);
			var colmns=ListFooterRows[rows].columns.length;
			var cnt=rows+1
			//var fieldftrTd=CreateTD(listTr,'ItemLabel','','','',cnt);
		//	fieldftrTd.setAttribute("style", "text-align:center");
			
			for(var cols=0;cols<colmns;cols++)
			{
				var fieldftrTd=CreateTD(listTr,'ItemLabel');
				var fieldName=ListFooterRows[rows].columns[cols].dataColumn[0];
				var elemId=ListFooterRows[rows].columns[cols].dataColumn[1];
				var fieldType=ListFooterRows[rows].columns[cols].dataColumn[2];
				var fldVal=ListFooterRows[rows].columns[cols].dataColumn[6];
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				createFormFields(fieldftrTd,ListFooterRows[rows].columns[cols],'',data);
				else
				CreateHIDDEN(mainTD, "", elemId, fldVal);	
			}
		}
		var ListFootertaxType=data.ListFootertaxType; 
		if(ListFootertaxType && ListFootertaxType.length>0)
		{
			var ftrTblTd2=CreateTD(ftrTblTr);
			//ftrTblTd2.innerHTML="Tax Type";
			ftrTable=CreateTable(ftrTblTd2,"taxType","taxType","","0","3");
			ftrTable.style.width="100%";
			ftrTable.cellPadding="3";
			ftrTblBdy = CreateBody(ftrTable); 

			for(var rows=0;rows<ListFootertaxType.length;rows++)
			{
				var listTr=CreateTR(ftrTblBdy);
				var colmns=ListFootertaxType[rows].taxTypeRows.length;
				var cnt=rows+1
				var fieldftrTd=CreateTD(listTr,'ItemLabel','','','',' ');
				fieldftrTd.setAttribute("style", "text-align:right;width:1%");
				fieldftrTd.align="right";
				
				
				for(var cols=0;cols<colmns;cols++)
				{
					var fieldName=ListFootertaxType[rows].taxTypeRows[cols].dataColumn[0];
					var elemId=ListFootertaxType[rows].taxTypeRows[cols].dataColumn[1];
					var fieldType=ListFootertaxType[rows].taxTypeRows[cols].dataColumn[2];
					var fldVal=ListFootertaxType[rows].taxTypeRows[cols].dataColumn[6];
					if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
					{
						var fieldftrTd=CreateTD(listTr,'ItemLabel');
						if(cols==0)fieldftrTd.style.width="56%";else fieldftrTd.style.width="20%";
						if(fieldType=="dropDownList"){var fieldftrTd=CreateDIV(fieldftrTd);fieldftrTd.style.width="100%";fieldftrTd.style.overflow="hidden";}
						var taxBoxes=createFormFields(fieldftrTd,ListFootertaxType[rows].taxTypeRows[cols],'',data,'hideDropBox');
					}
					else
					CreateHIDDEN(mainTD, "", elemId, fldVal);	
				}
			}
		}
		var grndTotTable =CreateTable(mainTD,"","grndTot_tbl");
		grndTotTable.width="100%";
		var totTblTr=CreateTR(grndTotTable);
		//var ftrTblTd1=CreateTD(totTblTr); 
		//var listTr=CreateTR(ftrTblBdy);
		var fieldftrTd=CreateTD(totTblTr,'','grandTotalTd');
		//fieldftrTd.colSpan="4";
		fieldftrTd.align="right";
		var grandTotalDiv=CreateDIV(fieldftrTd,'grandTotalDiv','grandTotalDivId');
		grandTotalDiv.align="right";
		//grandTotalDiv.style.cssFloat="right";
		//grandTotalDiv.style.width="350px";
		$(grandTotalDiv).css({"float":"right","width":"350px","vertical-align":"middle"});
		//grandTotalDiv.style.display="none";
		var grandTotalLbl=CreateSPAN(grandTotalDiv, 'subHeadingBig', '', 'Grand Total (Rs) ');
		$(grandTotalLbl).css({"position":"relative","left":"15%"});
		var total=CreateTEXTBOX(grandTotalDiv, 'inputFieldBig', 'grandTotalPrice');
		//total.style.width="150px";
		//total.style.textAlign="right";
		$(total).css({"width":"150px","text-align":"right","margin-top":"-2%","margin-right":"5%"});
		total.readOnly=true; 
	}
	else if(totalPrice&&totalPrice=='YES')
	{
		var sectionDivMain=CreateDIV(mainTD);
		var totalDiv=CreateDIV(sectionDivMain,'totalDiv');
		totalDiv.align="right";
		totalDiv.style.cssFloat="right";
		totalDiv.style.width="300px";
		CreateLABEL(totalDiv, 'ItemLabel', '', 'Total(Rs) ');
		var total=CreateTEXTBOX(totalDiv, 'inputFieldClass', 'totalPrice');
		total.style.width="150px";
		var grndTotTable =CreateTable(mainTD,"","grndTot_tbl");
		grndTotTable.width="100%";
		var totTblTr=CreateTR(grndTotTable);
		//var ftrTblTd1=CreateTD(totTblTr); 
		//var listTr=CreateTR(ftrTblBdy);
		var fieldftrTd=CreateTD(totTblTr,'','grandTotalTd');
		//fieldftrTd.colSpan="4";
		fieldftrTd.align="right";
		var grandTotalDiv=CreateDIV(fieldftrTd,'grandTotalDiv','grandTotalDivId');
		grandTotalDiv.align="right";
		//grandTotalDiv.style.cssFloat="right";
		//grandTotalDiv.style.width="350px";
		$(grandTotalDiv).css({"float":"right","width":"350px","vertical-align":"middle"});
		//grandTotalDiv.style.display="none";
		var grandTotalLbl=CreateSPAN(grandTotalDiv, 'subHeadingBig', '', 'Grand Total (Rs) ');
		$(grandTotalLbl).css({"position":"relative","left":"15%"});
		var total=CreateTEXTBOX(grandTotalDiv, 'inputFieldBig', 'grandTotalPrice');
		//total.style.width="150px";
		//total.style.textAlign="right";
		$(total).css({"width":"150px","text-align":"right","margin-top":"-2%","margin-right":"5%"});
		total.readOnly=true; 
	}
}

function builtMultiAddListFields(data)
{
	var ListPanelHeaders=data.ListPanelHeaders;	
	if(data.seqNoCol)
	{
		var seqNoCol=data.seqNoCol;
		var seqNoColP1=seqNoCol.split(':')[0];
		var seqNoColZcRank=seqNoCol.split(':')[1].split('-');
		seqNoColP2=seqNoColZcRank.splice(1).join("-");
	}

	var noOfCols=ListPanelHeaders.length;	
	var ListPanelRows=data.ListPanelRows;	
	var mainTD=document.getElementById(mnuItmId+"-MainTd");
	var ListPanelRowsCntPrev = ListPanelRows.length;	
	noOfRowsCreated=noOfRowsCreated+ListPanelRows.length;
	var listTblBdy=document.getElementById('listItemsTableBody');
	var existingTrs=listTblBdy.getElementsByTagName("tr");
	/**Tr count changed on 06 June 2013 by Dony**/
	var trRowCount=0;
	for(var g=0;g<existingTrs.length;g++)
	{
      var trParentNode = existingTrs[g].parentNode;
	  if(trParentNode.id && trParentNode.id =="listItemsTableBody") trRowCount+=1;
	}
	//if(existingTrs.length<ListPanelRows.length)var max2Add=existingTrs.length+5;else var max2Add=ListPanelRows.length;
	if(trRowCount<ListPanelRows.length)var max2Add=trRowCount+5;else var max2Add=ListPanelRows.length;
	//prompt("Test",listTblBdy.innerHTML);
	if(max2Add==ListPanelRows.length)document.getElementById('MoreLinkId').style.visibility="hidden";
	if(ListPanelHeaders)
	{
		//for(var rows=existingTrs.length;rows<max2Add;rows++)
		for(var rows=trRowCount;rows<max2Add;rows++)
		{
			var noOfCols=ListPanelRows[rows].columns.length;
			var listTr=CreateTR(listTblBdy);
			var cnt=parseFloat(parseFloat(rows)+1);
			var fieldLstTd=CreateTD(listTr,'ItemLabel','','','',cnt);
			fieldLstTd.setAttribute("style", "text-align:center");
			cnt=cnt-1;

			for(var cols=0;cols<noOfCols;cols++)
			{
				var fieldName=ListPanelRows[rows].columns[cols].dataColumn[0];
				var listElemId = ListPanelRows[rows].columns[cols].dataColumn[1];
				if(listElemId.indexOf(':')>0)
				{
					var spltElmId = listElemId.split(':');
					var partOne = spltElmId[0];
					var partTwo = spltElmId[1];
					var zcrank = partTwo.substr(0,partTwo.indexOf("-"));
					var partThreeCntr=2;
					if(zcrank.length>1)
						partThreeCntr=partThreeCntr+1;
					var partThree = partTwo.substr(partThreeCntr,partTwo.lastIndexOf(''));
					var elemId = partOne+":"+cnt+"-"+partThree;
				}
				else
					var elemId=ListPanelRows[rows].columns[cols].dataColumn[1];

				ListPanelRows[rows].columns[cols].dataColumn[1] = elemId;
				var fieldType=ListPanelRows[rows].columns[cols].dataColumn[2];
				var fldVal=ListPanelRows[rows].columns[cols].dataColumn[6];
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				{
					ListPanelRows[rows].columns[cols].dataColumn[6]="";
					var fieldLstTd=CreateTD(listTr,'ItemLabel');
					createFormFields(fieldLstTd,ListPanelRows[rows].columns[cols],'',data);
				}
				else
				{
					if (seqNoColP1 && seqNoColP2 && elemId==seqNoColP1+":"+cnt+"-"+seqNoColP2)
					{
						fldVal=cnt+1;
					}
					CreateHIDDEN(mainTD, "", elemId, fldVal);
				}
				listFieldItems.push(ListPanelRows[rows].columns[cols]);
			}
		}
	}

	var ListPanelHeaders1=data.ListPanelHeaders1;
	if(ListPanelHeaders1)
	{ 	
		var ListPanelRows1=data.ListPanelRows1;
		var ListPanelRows1=data.ListPanelRows1; 
		var ListPanelRowsCntPrev1 = ListPanelRows1.length;
		var noOfCols1=ListPanelHeaders1.length;
		noOfRowsCreated1=noOfRowsCreated1+ListPanelRows1.length;

		for(var rows=0;rows<ListPanelRows.length;rows++)
		{
			var noOfCols=ListPanelRows1[rows].columns.length;
			var listTr=CreateTR(listTblBdy);
			var cnt=noOfRowsCreated1+rows+1
			var fieldLstTd=CreateTD(listTr,'ItemLabel','','','',cnt);
			fieldLstTd.setAttribute("style", "text-align:center");
			cnt=cnt-1;

			for(var cols=0;cols<noOfCols1;cols++)
			{
				var fieldName=ListPanelRows[rows].columns[cols].dataColumn[0];
				var listElemId = ListPanelRows[rows].columns[cols].dataColumn[1];
				var spltElmId = listElemId.split(':');
				var partOne = spltElmId[0];
				var partTwo = spltElmId[1];
				var zcrank = partTwo.substr(0,partTwo.indexOf("-"));
				var partThreeCntr=2;
				if(zcrank.length>1)
					partThreeCntr=partThreeCntr+1;
				var partThree = partTwo.substr(partThreeCntr,partTwo.lastIndexOf(''));
				var elemId = partOne+":"+cnt+"-"+partThree;
				ListPanelRows1[rows].columns[cols].dataColumn[1] = elemId;
				var fieldType=ListPanelRows[rows].columns[cols].dataColumn[2];
				var fldVal=ListPanelRows[rows].columns[cols].dataColumn[6];
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				{
					var fieldLstTd=CreateTD(listTr,'ItemLabel');
					createFormFields(fieldLstTd,ListPanelRows[rows].columns[cols],'',data);
				}
				else
				CreateHIDDEN(mainTD, "", elemId, fldVal);
				listFieldItems.push(ListPanelRows[rows].columns[cols]);
			}
		}
	}


	var ListPanelHeaders2=data.ListPanelHeaders2;
	if(ListPanelHeaders2)
	{ 	
		var ListPanelRows2=data.ListPanelRows2;
		var ListPanelRows2=data.ListPanelRows2; 
		var ListPanelRowsCntPrev2 = ListPanelRows2.length;
		var noOfCols1=ListPanelHeaders2.length;
		noOfRowsCreated2=noOfRowsCreated1+ListPanelRows2.length;

		for(var rows=0;rows<ListPanelRows.length;rows++)
		{
			var noOfCols=ListPanelRows2[rows].columns.length;
			var listTr=CreateTR(listTblBdy);
			var cnt=noOfRowsCreated2+rows+1
			var fieldLstTd=CreateTD(listTr,'ItemLabel','','','',cnt);
			fieldLstTd.setAttribute("style", "text-align:center");
			cnt=cnt-1;

			for(var cols=0;cols<noOfCols2;cols++)
			{
				var fieldName=ListPanelRows[rows].columns[cols].dataColumn[0];
				var listElemId = ListPanelRows[rows].columns[cols].dataColumn[1];
				var spltElmId = listElemId.split(':');
				var partOne = spltElmId[0];
				var partTwo = spltElmId[1];
				var zcrank = partTwo.substr(0,partTwo.indexOf("-"));
				var partThreeCntr=2;
				if(zcrank.length>1)
					partThreeCntr=partThreeCntr+1;
				var partThree = partTwo.substr(partThreeCntr,partTwo.lastIndexOf(''));
				var elemId = partOne+":"+cnt+"-"+partThree;
				ListPanelRows2[rows].columns[cols].dataColumn[1] = elemId;
				var fieldType=ListPanelRows[rows].columns[cols].dataColumn[2];
				var fldVal=ListPanelRows[rows].columns[cols].dataColumn[6];
				if(fieldType!="hiddenField" && fieldType!="PrimaryKey")
				{
					var fieldLstTd=CreateTD(listTr,'ItemLabel');
					createFormFields(fieldLstTd,ListPanelRows[rows].columns[cols],'',data);
				}
				else
				CreateHIDDEN(mainTD, "", elemId, fldVal);
				listFieldItems.push(ListPanelRows[rows].columns[cols]);
			}
		}
	}
	blockDtlFileds();
}

function createFormFields(fieldElemTd,fldData,formName,data,hideDropBox)
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
	var filedFormat = fldData.dataColumn[16];
	
	switch (fieldType)
	{ 
		case "textBox":
		case "Text":	if( (tblName == 'Contact' && elemId == '0-401-409' && colName == 'FirstName') || (tblName == 'Account' && elemId == '0-1-3' && colName == 'AccountName')  )
						{
						
							var smartSuggestURL=zcServletPrefix+smartSuggURL;
							fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);
							fldObj.setAttribute("onkeyup","callAjax('smartDialog',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');hideDivOnLengthZero(this);");
							fldObj.setAttribute("onblur","hideSmartDialog(event);");
							if(nullableFld=="0")mandatoryFldElem.push(elemId+"txt");
							
						}
						else
						{
							fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);
							if(nullableFld=="0")mandatoryFldElem.push(elemId);
							if(extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
						}
					break;

		case "Button":	
						fldObj=CreateButton(fieldElemTd, '', elemId, fieldName);
					break;

		case "disabledField":	
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);
						fldObj.disabled=true;
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="integer" || extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
						fldObj.style.color="buttontext";
					break;		

		/*case "readOnlyBox":	
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);
						fldObj.readOnly=true;
						fldObj.style.cursor="default";
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="integer" || extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
						fldObj.style.border="0px solid #ffffff";
						fldObj.style.borderBottom="1px dashed #BEBEBE";
					break;*/

		case "label":
						if(extendedType=='password')
						{
							fieldElemTd.innerHTML="<span class='inputFieldClass' style='border:0'>"+fldVal+"</span>";
						}
						else
						{
							var fieldVal=fldVal.split('--');
							if(fieldVal[1]){
								fieldElemTd.innerHTML="<span class='inputFieldClass' style='border:0;'>"+fieldVal[1]+"<input type='hidden' name='"+elemId+"' id='"+elemId+"' value='"+fieldVal[0]+"'></span>";
							}
							else{
								fieldElemTd.innerHTML="<span class='inputFieldClass' style='border:0;'>"+fldVal+"<input type='hidden' name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"'></span>";}		  
						}
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="integer" || extendedType=="decimal")fieldElemTd.style.textAlign="right";
					break;
	  case "plainLabel":
						fldObj=CreateTEXTBOX(fieldElemTd, "", elemId, fldVal,maxLength);
						fldObj.readOnly=true;
						fldObj.style.border='0px solid #ffffff';
						fldObj.style.background='#ffffff';
						fldObj.style.borderBottom="1px dashed black";
						fldObj.style.width="fixed";
						fldObj.style.width="100px";
						fldObj.style.fontFamily="Tahoma,Verdana";
						fldObj.style.fontSize="12px";
						fldObj=document.getElementById(elemId);
						if(extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right"; else fldObj.style.textAlign="left";
						fldObj.style.cursor="default";
					break;
		case "dropDownList":	
						fldObj=CreateSelectBox(fieldElemTd, "inputFieldClass", elemId, fldVal);
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(dropDwnData)
						{
							var dropDownElems=dropDwnData.split("~)");  
							for(var dElem=0;dElem<dropDownElems.length;dElem++)
							{	
								val=dropDownElems[dElem].split('--');
								if(nullableFld=="0"&&val[0]=="")var noNone=true;
								fldObj[dElem]=new Option(val[1], val[0]);
								if(fldVal==val[0])fldObj[dElem].selected = true;
							}

							if (noNone==true)fldObj.remove(0);
						}
						if(hideDropBox){fldObj.style.width="120%";fldObj.style.border="0px solid transparent";fldObj.disabled=true;fldObj.style.color="buttontext";}	
					break;
		case "multiLevelDropdown":	
						if(fldVal){var lastIndex=fldVal.lastIndexOf(">>")>0?fldVal.lastIndexOf(">>")+2:0; var fldVal2Disp=fldVal.substring(lastIndex);}else var fldVal2Disp='...';
						fieldElemTd.innerHTML="<input type='hidden' id='"+elemId+"' value='"+fldVal+"'><span id=\""+elemId+"-mnuspan\" class='dropDownMenuSpan'><a href='javascript:showMultiLevelDropData(\""+elemId+"-mnu\",\""+tblName+"\",\""+colName+"\")' id=\""+elemId+"-href\" class='dropDownMenuHref'>"+fldVal2Disp+"</a></span>";	
					break;

		case "TextArea":
		case "textArea":
						fldObj=CreateTEXTAREA(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
					break;	
		
		case "hyperLink":
						   fldObj=CreateA(fieldElemTd,  "", elemId, fnctToCall, "", "Clear", "Clear"); 
						   fldObj.style.textDecoration="Underline";
						   if(nullableFld=="0")mandatoryFldElem.push(elemId);
					break;			
		
		case "hyperLinkImg":
							//fldObj=CreateIMG(fieldElemTd, "", "", fldVal, fieldName,"","",fnctToCall);
							fieldElemTd.innerHTML="<img src='"+fldVal+"' id='"+elemId+"' title='"+fieldName+"' onclick="+fnctToCall+" style='cursor:pointer'>";
					break;
				
		case "Integer":
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event);");
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="integer" || extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
					break;
				
		case "Decimal":
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event,true);");
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
					break;
		case "NonNegDecimal":
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);	
						fldObj.setAttribute("onkeypress","return numbersonly(this,event,true,false);");
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
					break;

		case "checkBox":
		case "Check":
						fldObj=CreateCheckbox(fieldElemTd, "", elemId, fldVal);
						if(fldVal && fldVal == "1") fldObj.checked=true;
						else fldObj.checked=false;
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
					break;	

		case "uniqueBox":
						var validationURL=zcServletPrefix+smartSuggURL;
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass",elemId,fldVal,maxLength);	
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(fldVal!=""||fldVal!=null)
						{
							if(action=="Add")
							fldObj.setAttribute("onblur","callUniqueValidationAjax('"+validationURL+"',this,'"+fldData.dataColumn[0]+"','"+fldVal+"');");
							else if(action == "Edit")
							fldObj.setAttribute("onblur","callUniqueValidationAjax('"+validationURL+"',this,'"+fldData.dataColumn[0]+"','"+fldVal+"');");
						}
					break;
				
		case "Multi":
		case "Combo":
						if(fieldType=="Multi"){fldname='virtual'+elemId;var multi=true;} else {fldname=elemId;var multi="";}
						if(nullableFld=="0")mandatoryFldElem.push(fldname);
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
								url: encodeURI(url2Hit),
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
							AddBlurEventListener(fldObj,(function(fldname,formName){return function(){getAllSelected(fldname,formName);};})(fldname,formName));
							CreateHIDDEN(fieldElemTd , "", elemId ,fldVal);
						}
					break;	
				
		case "Date":
		case "dateOnly":
//09/06/2011 10:58 AM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.
                     if(!filedFormat || filedFormat=='dd/MM/yyyy'){
						if (fldVal)
						{
							fieldvaldateArr = fldVal.split('/');
							fieldvaldatetIme = fieldvaldateArr[1]+'/'+fieldvaldateArr[0]+'/'+fieldvaldateArr[2];
							var d1 = new Date (fieldvaldatetIme);
							d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
							fldVal=dateFormat(d1, "dd/mm/yyyy");
						}
//09/06/2011 10:58 AM By Vadiraj
						fieldElemTd.innerHTML="<table cellpadding='0' cellspacing='0'><tr><td><input type='hidden' id='"+elemId+"' value='"+fldVal+"' /><input id='"+elemId+"_date_value' class='inputFieldClass' onblur=\"changeDate('"+elemId+"_date_value');\" size=12 maxlength=12 style='width:65px' value='"+fldVal.replace(' 00:00:00','')+"'/></td><td><img src='/atCRM/images/calendar.gif' id='"+elemId+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td></tr></table>";
						
						new Calendar({
							  inputField: elemId+'_date_value',
							  dateFormat: "%d/%m/%Y", 
							  trigger: elemId+"_cal",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {this.hide();}
						});							
						dateFlds.push(elemId);                          			
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						fldObj=document.getElementById(elemId+'_date_value');
	                  }
					  else if(filedFormat=='MM/yyyy' || filedFormat=='MMM/yyyy'){
						  var monthNum="";var yearNum="";
                          if (fldVal)
							{
								fieldvaldateArr = fldVal.split('/');
                                monthNum = fieldvaldateArr[1];
                                yearNum = getYearForAddEdit(fieldvaldateArr[2]);
                                fldVal = getFormatedDateForAddEdit(monthNum, yearNum);
							}
						  fieldElemTd.innerHTML="<table cellpadding='0' cellspacing='0' style='margin-left:7%;'><tr><td ><input type='hidden' id='"+elemId+"' value='"+fldVal+"' class='dateHiddenField' /><input id='"+elemId+"_month_value' class='inputFieldClass addEditMonth'  maxlength=3 style='width:50px' value='"+monthNum+"' placeholder='MM/MMM'  /><input id='"+elemId+"_year_value' class='inputFieldClass addEditIntegerOnly addEditYear' maxlength=4 style='width:50px;margin-left:3px;' value='"+yearNum+"' placeholder='YYYY' /></td></tr></table>";
					  }
					  // else if(filedFormat=='MMM/yyyy'){
						 //  var monthNum="";var yearNum="";
       //                    if (fldVal)
							// {
							// 	fieldvaldateArr = fldVal.split('/');
       //                          monthNum = validateThreeDigitMonth(fieldvaldateArr[1]);
       //                          yearNum = getYearForAddEdit(fieldvaldateArr[2]);
       //                          var validMonth = getThreeDigitMonth(monthNum);
       //                          fldVal = getFormatedDateForAddEdit(validMonth, yearNum);
							// }
						 //  fieldElemTd.innerHTML="<table cellpadding='0' cellspacing='0' style='margin-left:7%;'><tr><td ><input type='hidden' id='"+elemId+"' value='"+fldVal+"' class='dateHiddenField' /><input id='"+elemId+"_month_value' class='inputFieldClass addEditAlphaOnly threeDigitMonth addEditMonth' maxlength=3 style='width:25px' value='"+monthNum+"' placeholder='MMM' /><input id='"+elemId+"_year_value' class='inputFieldClass addEditYear' maxlength=4 style='width:75px;margin-left:3px;' value='"+yearNum+"' placeholder='YYYY' onblur=\"validateMonthYear('"+elemId+"')\"/></td></tr></table>";
					  // }
						
					break;	
		case "timeOnly":			          
						fieldElemTd.innerHTML="<table cellpadding='0' cellspacing='0'><tr><td><div class='combo' ><input id='"+elemId+"' class='inputFieldClass' size=10 maxlength=8 style='width:70px' value='"+fldVal.slice(11)+"'/><ul><li>12:00 AM</li><li>12:30 AM</li><li>01:00 AM</li><li>01:30 AM</li><li>02:00 AM</li><li>02:30 AM</li><li>03:00 AM</li><li>03:30 AM</li><li>04:00 AM</li><li>04:30 AM</li><li>05:00 AM</li><li>05:30 AM</li><li>06:00 AM</li><li>06:30 AM</li><li>07:00 AM</li><li>07:30 AM</li><li>08:00 AM</li><li>08:30 AM</li><li>09:00 AM</li><li>09:30 AM</li><li>10:00 AM</li><li>10:30 AM</li><li>11:00 AM</li><li>11:30 AM</li><li>12:00 PM</li><li>12:30 PM</li><li>01:00 PM</li><li>01:30 PM</li><li>02:00 PM</li><li>02:30 PM</li><li>03:00 PM</li><li>03:30 PM</li><li>04:00 PM</li><li>04:30 PM</li><li>05:00 PM</li><li>05:30 PM</li><li>06:00 PM</li><li>06:30 PM</li><li>07:00 PM</li><li>07:30 PM</li><li>08:00 PM</li><li>08:30 PM</li><li>09:00 PM</li><li>09:30 PM</li><li>10:00 PM</li><li>10:30 PM</li><li>11:00 PM</li><li>11:30 PM</li></ul></div></td></tr></table>";
						new TimeCombo(elemId,'#FFFFFF','#FFFFFF');
						changeTime(elemId);
						fieldElemTd.style.fontFamily="Tahoma, Verdana";
						fieldElemTd.style.fontSize="11px";
					break;
				
		case "dateAndTime":
		case "DateTime":
		
//09/06/2011 10:58 AM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.

						if (fldVal)
						{
							var fieldvalArr = fldVal.split(' ');
							var fieldvaldate  = fieldvalArr[0];
							var fieldvaldateArr = fieldvaldate.split('/');
							var fieldvaldatetIme = fieldvaldateArr[1]+'/'+fieldvaldateArr[0]+'/'+fieldvaldateArr[2]+' '+fieldvalArr[1];
							var d1 = new Date (fieldvaldatetIme);
							d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
							fldVal=dateFormat(d1, "dd/mm/yyyy HH:MM:ss");
						}
//09/06/2011 10:58 AM By Vadiraj
						fieldElemTd.innerHTML="<table cellpadding='0' cellspacing='0'><tr><td><input type='hidden' id='"+elemId+"' value='"+fldVal+"' /><input id='"+elemId+"_date_value' class='inputFieldClass' onblur=\"changeDate('"+elemId+"_date_value');\" size=12 maxlength=12 style='width:80px' value='"+fldVal.slice(0,10)+"'/></td><td><img src='/atCRM/images/calendar.gif' id='"+elemId+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td><td><div class='combo' ><input id='"+elemId+"_time_value' class='inputFieldClass' size=10 maxlength=8 style='width:70px' value='"+fldVal.slice(11)+"'/><ul><li>12:00 AM</li><li>12:30 AM</li><li>01:00 AM</li><li>01:30 AM</li><li>02:00 AM</li><li>02:30 AM</li><li>03:00 AM</li><li>03:30 AM</li><li>04:00 AM</li><li>04:30 AM</li><li>05:00 AM</li><li>05:30 AM</li><li>06:00 AM</li><li>06:30 AM</li><li>07:00 AM</li><li>07:30 AM</li><li>08:00 AM</li><li>08:30 AM</li><li>09:00 AM</li><li>09:30 AM</li><li>10:00 AM</li><li>10:30 AM</li><li>11:00 AM</li><li>11:30 AM</li><li>12:00 PM</li><li>12:30 PM</li><li>01:00 PM</li><li>01:30 PM</li><li>02:00 PM</li><li>02:30 PM</li><li>03:00 PM</li><li>03:30 PM</li><li>04:00 PM</li><li>04:30 PM</li><li>05:00 PM</li><li>05:30 PM</li><li>06:00 PM</li><li>06:30 PM</li><li>07:00 PM</li><li>07:30 PM</li><li>08:00 PM</li><li>08:30 PM</li><li>09:00 PM</li><li>09:30 PM</li><li>10:00 PM</li><li>10:30 PM</li><li>11:00 PM</li><li>11:30 PM</li></ul></div></td></tr></table>";
						new TimeCombo(elemId+'_time_value','#FFFFFF','#FFFFFF');
						changeTime(elemId+'_time_value');
						fieldElemTd.style.fontFamily="Tahoma, Verdana";
						fieldElemTd.style.fontSize="11px";
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
						dateFlds.push(elemId);						
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						fldObj=document.getElementById(elemId+'_date_value');
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
						makeComboSearchable(dispVal,false,elemId,fieldType);										
						$(".inputFieldClassDrop").combobox();						
						if(nullableFld=="0")mandatoryFldElem.push('combo_'+elemId);								
					break;

		case "dropDown-state":

						var newDiv=CreateDIV(fieldElemTd,"",elemId+'_state');
						newDiv.innerHTML="";
						fldObj=CreateSelectBox(newDiv, "inputFieldClassDrop", elemId, fldVal);
						var dispValstate = "";
						fldObj.style.width='100px';
						var stateUrl=zcServletPrefix+"/custom/JSON/system/states.htm?id="+fldVal;	
						
						//alert(stateUrl);
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

												if(fldVal!="" && fldVal==stateId)
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
							makeComboSearchable(dispValstate,'',elemId,fieldType);	
							$(".inputFieldClassDrop").combobox();								
							if(nullableFld=="0")mandatoryFldElem.push('combo_'+elemId);								
						break;

		case "multiSelect":
						maxMultiCnt=objEvent;
						var smartSuggestURL=zcServletPrefix+smartSuggURL;
						window["array_" + ReplaceAll(elemId,"-","_")] = new Array();
						if(fldData.dataColumn[13])
						var fun2callonFill=fldData.dataColumn[13];
						else		
						var fun2callonFill="";
						 
						fieldElemTd.innerHTML="<table style='width:98%' cellpadding=0 cellspacing=0><tr><td><input type='hidden'  name='"+elemId.replace("-multi","")+"' id='"+elemId.replace("-multi","")+"'><input type='hidden'  name='"+elemId+"' id='"+elemId+"'><input type='hidden' name='"+elemId+"-max' id='"+elemId+"-max' value='"+maxMultiCnt+"'><input type='hidden' name='"+elemId+"-fun' id='"+elemId+"-fun' value='"+fun2callonFill+"'><input type='text' name='"+elemId+"txt' id='"+elemId+"txt' class='ui-corner-all multiSelectTxt' onkeyup=\"callAjax('multiSelectSugg',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeMultiTxt(this);' onblur='changeMultiTxt(this);' value='2 chars or **'></td></tr><tr><td><div class='multiSelectBox' name='"+elemId+"-multiSelDiv' id='"+elemId+"-multiSelDiv'></div></td></tr></table>";

						var listData=objEventFun.split('~)');
						for(var i=0;i<listData.length;i++)
						{
							val=listData[i].split('--')[0];
							label=listData[i].split('--')[1];
							fillMultiSelect(val,label,elemId);
						}						
						if(nullableFld=="0")mandatoryFldElem.push(elemId+"txt");
					break;
				
		case "smartSuggest":							
						var smartSuggestURL=zcServletPrefix+smartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var pckListId=getParameterValue (smartSuggestURL,'pckListId');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						var fillTblName=tblName4Pkclist!='' ? tblName4Pkclist : tblName;
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;

						var fldvalId=fldVal.split('--')[0];
						var fldvalTxt=fldVal.split('--')[1];
						labelClass="inputFieldClass";
						fldVal="2 chars or **";
						var udmNameforpcklist=data.UDMName;						
						if(!fldvalId)labelClass="inputGrayTextClass";else fldVal=fldvalTxt;	
						if(pckListId)
		                { 	
							if (tblName == "ticket")
							{
								if (elemId == "0-1-26")
								{
									var qkAddName = "Contact";
								}
								if (elemId == "0-1-32")
								{
									var qkAddName = "Account";
								}
								fieldElemTd.innerHTML="<input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldvalId+"'><input type='text'  name='"+elemId+"txt' id='"+elemId+"txt'  value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:65%\">";
								fieldElemTd.innerHTML+="<span id='"+elemId+"_add'><img  style=\"cursor:pointer;margin-left:1px;vertical-align:top\" src='/atCRM/images/JSON/qadd.png' title='Add' onclick='showAQDialog(\""+tblName+"\",\"\",\"\",\"\",\"\",\""+elemId+"\",\""+qkAddName+"\")'></span>";
								fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+fillTblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"fillCol' id='"+elemId+"fillCol' value='"+readNodeId+"'><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','"+elemId+"txt','','0','addEditForm','','','"+udmNameforpcklist+"','"+paramName+"','"+readNodeId+"');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:2px;\" src='/atCRM/images/JSON/picklist.png'></a>";
							}
							else
							{
								fieldElemTd.innerHTML="<input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldvalId+"'><input type='text'  name='"+elemId+"txt' id='"+elemId+"txt'  value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:65%\">";
								fieldElemTd.innerHTML+="<span id='"+elemId+"_add'><img  style=\"cursor:pointer;margin-left:1px;width:15px\" src='/atCRM/images/JSON/qadd.png' title='Add' onclick='showAQDialog(\""+tblName+"\",\"\",\"\",\"\",\"\",\""+elemId+"\")'></span>";
								fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+fillTblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"fillCol' id='"+elemId+"fillCol' value='"+readNodeId+"'><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','"+elemId+"txt','','0','addEditForm','','','"+udmNameforpcklist+"','"+paramName+"','"+readNodeId+"');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:3px;width:13px;height:13px;\" src='/atCRM/images/JSON/picklist.png'></a>";
							}
							
						}
						else
		                { 	
							if (tblName == "ticket")
							{
								if (elemId == "0-1-26")
								{
									var qkAddName = "Contact";
								}
								if (elemId == "0-1-32")
								{
									var qkAddName = "Account";
								}
								fieldElemTd.innerHTML="<input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldvalId+"'><input type='text'  name='"+elemId+"txt' id='"+elemId+"txt'  value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:65%\">";
								fieldElemTd.innerHTML+="<span id='"+elemId+"_add'><img  style=\"cursor:pointer;margin-left:1px;vertical-align:top\" src='/atCRM/images/JSON/qadd.png' title='Add' onclick='showAQDialog(\""+tblName+"\",\"\",\"\",\"\",\"\",\""+elemId+"\",\""+qkAddName+"\")'></span>";
								fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+fillTblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"fillCol' id='"+elemId+"fillCol' value='"+readNodeId+"'><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','"+elemId+"txt','','0','addEditForm','','','"+udmNameforpcklist+"','"+paramName+"','"+readNodeId+"');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:2px;\" src='/atCRM/images/JSON/picklist.png'></a>";
							}
							else
							{
								fieldElemTd.innerHTML="<input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldvalId+"'><input type='text'  name='"+elemId+"txt' id='"+elemId+"txt'  value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:65%\">";
								fieldElemTd.innerHTML+="<span id='"+elemId+"_add'><img id='"+elemId+"_add' style=\"cursor:pointer;margin-left:1px;vertical-align:top\" src='/atCRM/images/JSON/qadd.png' title='Add' onclick='showAQDialog(\""+tblName+"\",\"\",\"\",\"\",\"\",\""+elemId+"\")'></span>"
								fieldElemTd.innerHTML+="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+fillTblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"fillCol' id='"+elemId+"fillCol' value='"+readNodeId+"'><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListName+"','"+elemId+"txt','','0','addEditForm','','','"+udmNameforpcklist+"','"+paramName+"','"+readNodeId+"');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:2px;\" src='/atCRM/images/JSON/picklist.png'></a>";
							}
		                }
						if(nullableFld=="0")mandatoryFldElem.push(elemId+"txt");
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
						fieldElemTd.innerHTML="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+tblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"hdn' id='"+elemId+"hdn' value='"+fldvalId+"'><input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeyup=\"callAjax('smartFill',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:70%\"><a onclick=\"unblockObjectRelatedFields('"+elemId+"','"+tblName+"','"+formName+"');\"><img id='"+elemId+"_unlock' style=\"cursor:pointer;margin-left:2px;visibility:hidden;width:!0px;height:14px;\" src='/atCRM/images/JSON/lock.png' title='Unlock fields'></a>";
						if(nullableFld=="0")mandatoryFldElem.push(elemId);

						var relCols="";
						var relPk="";
						for(var tblClm=0; tblClm<fieldItems.length; tblClm++)
						{
							var relfieldType=fieldItems[tblClm].dataColumn[2];
							var relTblName=fieldItems[tblClm].dataColumn[9];
							var relColName=fieldItems[tblClm].dataColumn[10];
							
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

		case "mappedSmartFill":
						var smartSuggestURL=zcServletPrefix+smartSuggURL
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist= pckListName == 'PurchOrd_Product'?'Product':pckListName;
						var mappedSmartFillData=data.mappedSmartFill;
						
						for(mSFDataCntr=0;mSFDataCntr<mappedSmartFillData.length;mSFDataCntr++)
						{
							if(mappedSmartFillData[mSFDataCntr].tableName==tblName4Pkclist)
							{
								var mappedColsToBeFetched=mappedSmartFillData[mSFDataCntr].details[0].colsToBeFetched;
								var mappedFldsToBeUpdated=mappedSmartFillData[mSFDataCntr].details[1].fieldsToBeUpdated;
							}
						}
						
						labelClass="inputFieldClass";
						if(fldVal==""||fldVal=="--")
						{
							labelClass="inputGrayTextClass";
							fldVal="2 chars or **";
							var fldvalId="";
						}
						else
						{
							var fldvalId=fldVal.split('--')[0];
							var fldVal=fldVal.split('--')[1];
						}
						if(typeof paramName != 'undefined'){/*Do nothing*/} else {	paramName='';}
						if(typeof readNodeId != 'undefined'){/*Do nothing*/} else {	readNodeId='';}
						fieldElemTd.innerHTML="<input type='hidden'  name='"+elemId+"fillTbl' id='"+elemId+"fillTbl' value='"+tblName+"' autocomplete=off><input type='hidden'  name='"+elemId+"hdn' id='"+elemId+"hdn' value='"+fldvalId+"'><input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeyup=\"callAjax('mappedSmartFill',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur=\"changeSmartSuggestTxt(this);\" class='"+labelClass+"' style=\"width:72%\">";
						fieldElemTd.innerHTML+="<span id='"+elemId+"_add'><img id='"+elemId+"_add' style=\"cursor:pointer;margin-left:1px;vertical-align:top\" src='/atCRM/images/JSON/qadd.png' title='Add' onclick='showAQDialog(\""+tblName+"\",\"\",\"\",\"\",\"\",\""+elemId+"\")'></span>";
						fieldElemTd.innerHTML+="<a onclick=\"unblockMappedObjectFields('"+elemId+"','"+tblName+"','"+formName+"');\"><img id='"+elemId+"_unlock' style=\"cursor:pointer;margin-left:2px;visibility:hidden;\" src='/atCRM/images/JSON/lock.png' title='Unlock fields'></a>";
						if(nullableFld=="0")mandatoryFldElem.push(elemId);

						if(mappedColsToBeFetched && mappedFldsToBeUpdated)
						{
							var relCols="";
							var relFlds="";
							var relPk="";
							relPk=mappedColsToBeFetched[0];
							relCols=mappedColsToBeFetched.join(",");

							var isZcRankedElem=elemId.indexOf(':'); 
							if(isZcRankedElem!="-1")
							{
								var srcZcRank=elemId.split(':')[1].split('-')[0];

								for (iii=0;iii<mappedFldsToBeUpdated.length;iii++)
								{
									var part1=mappedFldsToBeUpdated[iii].split(':')[0];
									var part2=mappedFldsToBeUpdated[iii].split(':')[1].split('-');
									part2.splice(0,1);
									part2=part2.join("-");

									mappedFldsToBeUpdated[iii]=part1+":"+srcZcRank+"-"+part2;
								}
							}
							relFlds=mappedFldsToBeUpdated.join(",");
							
							fieldElemTd.innerHTML+="<input type='hidden' name='"+elemId+"fillColumns' id='"+elemId+"fillColumns' value='"+relCols+"'><input type='hidden' name='"+elemId+"fillFields' id='"+elemId+"fillFields' value='"+relFlds+"'><input type='hidden' name='"+elemId+"fillPk' id='"+elemId+"fillPk' value='"+relPk+"'>";
						}

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
							fieldElemTd.innerHTML="<input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListId+"','"+elemId+"','','0','addEditForm','','','"+udmNameforpcklist+"','"+paramName+"','"+readNodeId+"');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:2px;\" src='/atCRM/images/JSON/picklist.png'></a>";			
						}
						else
						{
							fieldElemTd.innerHTML="<input type='text'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'"+paramName+"','"+readNodeId+"');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='"+labelClass+"' style=\"width:80%\"><a onclick=\"populatePicklist('"+tblName4Pkclist+"','"+pckListName+"','"+elemId+"','','0','addEditForm','','','"+udmNameforpcklist+"','"+paramName+"','"+readNodeId+"');\" id='"+elemId+"pck'><img style=\"cursor:pointer;margin-left:2px;\" src='/atCRM/images/JSON/picklist.png'></a>";
						}																
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
					break;
					
		case "multiLevelPickList":
						var smartSuggestURL=zcServletPrefix+smartSuggURL;
						var pckListName=getParameterValue (smartSuggestURL,'pckListName');
						var tblName4Pkclist=getParameterValue (smartSuggestURL,'tblName');	
						if(!tblName4Pkclist)tblName4Pkclist=pckListName;
													
						fieldElemTd.innerHTML="<span  name='"+elemId+"anc' id='"+elemId+"anc' class='ItemLabel' style='text-decoration:underline;cursor:pointer' onclick=\"populateMultiLvlPicklist('"+tblName4Pkclist+"','"+pckListName+"','"+elemId+"','addEditForm');\">Select</span> <input type='hidden'  name='"+elemId+"' id='"+elemId+"' value='"+fldVal+"'>";
						if(nullableFld=="0")mandatoryFldElem.push(elemId+"anc");
					break;
					
		case "password":
						fldObj=CreatePASSWORD(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);														
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
					break;	
		
		case "defaultTeritory":

					if(fieldType!='None' && fieldType!='none')
					createDefaultTeritory(fieldElemTd, "inputFieldClass", elemId);
					if(nullableFld=="0")mandatoryFldElem.push(elemId);
					break;

		default:
						if(fieldType!='None' && fieldType!='none')
						fldObj=CreateTEXTBOX(fieldElemTd, "inputFieldClass", elemId, fldVal,maxLength);														
						if(nullableFld=="0")mandatoryFldElem.push(elemId);
						if(extendedType=="float" || extendedType=="money" || extendedType=="decimal")fldObj.style.textAlign="right";
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
			var funct=objFunc.indexOf('{'); 
			var q=objFunc.indexOf('('); 
			var params="";
			if(q>0&&funct<0)
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
	 if(data.PageAction=='Edit'&&fieldType=="checkBox")
	{
		if(fldVal == 1)
			fldObj.checked = true;
		else if(fldVal == 0)
			fldObj.checked = false;
	}
	
}


function fillMultiSelectValues()
{	
	var frmFldItemsForMltSel = fieldItems.concat(listFieldItems).concat(multiListFieldItems);
	for(var x=0; x<frmFldItemsForMltSel.length; x++)
	{		
		var fieldType=frmFldItemsForMltSel[x].dataColumn[2];
		var elemId=frmFldItemsForMltSel[x].dataColumn[1];
		if(fieldType=="multiSelect")
		{ 			
			var multiValues=frmFldItemsForMltSel[x].dataColumn[12];			
			var listData=multiValues.split('~)');			
			for(var i=0;i<listData.length;i++)
			{					
				val=listData[i].split('--')[0];			
				label=listData[i].split('--')[1];				
				fillMultiSelect(val,label,elemId);
			}		
		}
	} 
}
function updateData(funOnsubmit,formSubmitPostFun,isAddNew)
{
	var addEditForm=document.getElementById("addEditForm");
	formName="addEditForm";
	//for date flds	

	if(dateFlds)
	{
		for(var x=0; x<dateFlds.length; x++)
		{
			var mandateDtElem=false;
			var elemId=dateFlds[x];
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
//28/07/2011 4:39 PM Vadiraj (Fixed the bug)
//Below written code will convert the user selected date value to server timezone before submission.
						var valToSubmit = document.getElementById(elemId).value;
						/******Below codes were not working so its commented ,By Dony 12/06/2013 5:29********/
						/*if(valToSubmit!="")
						{
							var valToSubmitArr = valToSubmit.split(' ');
							var valToSubmitdate  = valToSubmitArr[0];
							var valToSubmitdateArr = valToSubmitdate.split('/');
							var valToSubmitdatetIme = valToSubmitdateArr[1]+'/'+valToSubmitdateArr[0]+'/'+valToSubmitdateArr[2]+' '+valToSubmitArr[1];
							var d1 = new Date (valToSubmitdatetIme);
							d1.setMinutes ( d1.getMinutes() + srvrtimeDiffInMin - timeDiffInMin);
							valToSubmit=dateFormat(d1, "dd/mm/yyyy HH:MM:ss");
							document.getElementById(elemId).value = valToSubmit;
						}*/
                       /**By Dony 12/06/2013 5:29***/
//28/07/2011 4:39 PM Vadiraj
			}
			else if(date_value&&time_value == "")
			{
				if(document.getElementById(elemId+"_time_value")){
					for(var i=0;i<mandatoryFlds.length;i++){
						if(mandatoryFlds[i]==elemId)
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


	if(doc.PrefsName && doc.PrefsName=='finTransMAdd') {
		if(validateFormFldsForFinance())
		{  
			document.getElementById("updateButton").disabled='true';
			document.getElementById("cancelButton").disabled='true';
			if(document.getElementById("addNnewButton")) document.getElementById("addNnewButton").disabled='true';
			document.getElementById("addEditForm").style.cursor="wait";
			submitFinanceAddEditForm(formSubmitPostFun,isAddNew);
		} else {
			$('#addEditErrorDiv').html('Fields marked with red color are empty!!').css('display','block');
		}	
	} else {
		if(validateFormFlds(formName,funOnsubmit))
		{  
			document.getElementById("updateButton").disabled='true';
			document.getElementById("cancelButton").disabled='true';
			if(document.getElementById("addNnewButton")) document.getElementById("addNnewButton").disabled='true';
			document.getElementById("addEditForm").style.cursor="wait";

			if(funOnsubmit == 'validateAddSBEUser') {
				//save first teritory details
				$.ajax(
					{
						url: '/atCRM/custom/advancedAdd/addTerr.html',
						type: 'POST',
						data: '0-1-3='+$('#0-201-357').val()+'&0-1-17txt='+session_login, //session_login is global defined in homepage.html
						async: false,
						success: function(data) {
							console.log('teritory saved..');
							console.log(data);
						},
						error: function(response) {
							alert('Teritory not created..');
							console.log(response);
						}
					}
				);
				
				submitAddEditForm(formSubmitPostFun,isAddNew);	
			} else {
				submitAddEditForm(formSubmitPostFun,isAddNew);	
			}
			
		}	
	}	

	
		
}

function submitAddEditForm(formSubmitPostFun,isAddNew)
{
	console.log('form submit');

	for(var x=0; x<fieldItems.length; x++)
	{
		var elemId=fieldItems[x].dataColumn[1];		
		var columnName=fieldItems[x].dataColumn[10];	
		var strColumnName=fieldItems[x].dataColumn[11];
		var L_strColName = "";
		 if(columnName)
		{
			 if(columnName.indexOf("udef_fkey")!=-1 && strColumnName)
			{				 
				if(document.getElementById(elemId) && document.getElementById(elemId).value && document.getElementById(elemId+"txt") && document.getElementById(elemId+"txt").value &&  document.getElementById(elemId+"txt").value!="2 chars or **")
				{					
						var L_strColName= document.getElementsByName(strColumnName);	
						var idOfStrCol=L_strColName[0].id;				
						document.getElementById(idOfStrCol).value= document.getElementById(elemId+"txt").value;
				}
				else{			
						var L_strColName= document.getElementsByName(strColumnName);									
						var idOfStrCol=L_strColName[0].id;						
						document.getElementById(idOfStrCol).value='';
				
				}
			}
		}
	}	
	  	
	var addEditForm=document.getElementById("addEditForm");

	document.getElementById('addEditErrorDiv').style.display="none";

	var flds2Submit = {};
	var formFlds = addEditForm.elements;
	  
	for(var i = 0; i < formFlds.length; i++) {
		var fldValue = formFlds[i].value;
		if((formFlds[i].type=='checkbox' || formFlds[i].type=='Check') && formFlds[i].checked==false)
			fldValue="0";
		else if((formFlds[i].type=='checkbox' || formFlds[i].type=='Check') && formFlds[i].checked==true) 
			fldValue="1";
		if(fldValue=='2 chars or **') 
			fldValue="";
		var encodedFldValue = encodeURI(fldValue);
		fldValue = fldValue.replace(/(\r\n|\n|\r)/gm,""); //remove new line chars
		fldValue = fldValue.replace(/\s+/g," "); //remove extra space
		flds2Submit[formFlds[i].id] = fldValue;
	}
	openLoadingDiv();
	console.log(flds2Submit);
	$.ajax({
	type: "POST",
	contentType: "application/x-www-form-urlencoded",
	url: formAction,
	data: flds2Submit,
	beforeSend: function() {
	  $('#loader_Img').show();
	},
	complete: function(){
		$('#loader_Img').hide();
	},
	//dataType: "json",
	success: function (data)
	{
		closeLoadingDiv();
		if(data){
			try{
				   if(addData && isAddNew == "addNew")
					{
                         handleAddEditJsonData(addData);
					}
					else
				    { 
						doc = JSON.parse(data); 
						if(formSubmitPostFun){
							formSubmitPostFun=formSubmitPostFun.replace("addedId",doc.addedId);
							formSubmitPostFun=formSubmitPostFun.replace("addedTxt",doc.addedTxt);
							responsePage(mnuItmId,fromPage,true,action,currPageUDM,formSubmitPostFun,"noResponse");
					    }
						else responsePage(mnuItmId,fromPage,true,action,currPageUDM,formSubmitPostFun);
					}
				}catch(e){ 
					if(addData && isAddNew == "addNew")
					{
						handleAddEditJsonData(addData);
					}
					else {
						  responsePage(mnuItmId,fromPage,true,action,currPageUDM,formSubmitPostFun);
						}
					}
			}
		else{
		       responsePage(mnuItmId,fromPage,true,action,currPageUDM,formSubmitPostFun);
		}
		if(windowContView) windowContView.restore();
	    if(parent.windowData) parent.windowData.restore();
	},
	error: function ()
		{ 
			if(addData && isAddNew == "addNew")
					{
                         handleAddEditJsonData(addData);
					}
					else
				    {
						responsePage(mnuItmId,fromPage,true,action,currPageUDM,formSubmitPostFun);

					}
		}
	});
}
function validateFormFlds(formName,funOnsubmit)
{
	uniqueBoxMsg="";
	var errorDiv='addEditErrorDiv';
	if(errorDiv&&document.getElementById(errorDiv))
	document.getElementById(errorDiv).innerHTML="";
	var mandFldsOfForm=mandatoryFlds;
	var mandFldElmOfForm=mandatoryFldElem;
	var mandFldLblsOfForm=mandatoryFldLbls;
	var commonDateFlds=dateFlds;
	if(formName=='quickAdd-form')
	{
		errorDiv='errorDivQuickAdd';
		mandFldsOfForm=mandatoryFldsQ;
		mandFldElmOfForm=mandatoryFldElemQ;
		mandFldLblsOfForm=mandatoryFldLblsQ;
		commonDateFlds=dateFldsQ;
	}

	var msg='';
	var fld=0;
		
	for(var i=0;i<mandFldsOfForm.length;i++)
	{
		if((document.getElementById(mandFldsOfForm[i]).value=="")||(document.getElementById(mandFldsOfForm[i]).value=="2 chars or **"))
		{
			msg += "\n<li>Please enter  '" +mandFldLblsOfForm[i] + "'</li>";
			if(document.getElementById(mandFldElmOfForm[i]))
			{
				if(mandFldElmOfForm[i] == '0-201-357') {
					var dterr = $('#0-201-357');
					if(dterr.val() == '') {
						dterr.parent().css('border','solid 1px red');
					} else {
						dterr.parent().css('border','solid 1px white');
					}
				} else {
					document.getElementById(mandFldElmOfForm[i]).style.border="1px solid #CC0000";
					if(fld==0)
					{
						if(document.getElementById(mandFldsOfForm[i]).type=="text")
						document.getElementById(mandFldsOfForm[i]).focus();
					}	
				}
				
				fld++;
			}
			if(commonDateFlds)
			{
				for(var x=0; x<commonDateFlds.length; x++)
				{
					var elemId=commonDateFlds[x];
					if(document.getElementById(mandFldsOfForm[i]).id == elemId)
					{
						document.getElementById(elemId+"_date_value").style.border="1px solid #CC0000";
						document.getElementById(elemId+"_date_value").focus();
						if(document.getElementById(elemId+"_time_value")&&document.getElementById(elemId+"_time_value").value=="")
						{
						    document.getElementById(elemId+"_time_value").style.border="1px solid #CC0000";
							document.getElementById(elemId+'_time_value').focus();
						}
					}
				}
			}
		}
		if(msg=="")document.getElementById(mandFldsOfForm[i]).style.border="1px solid #DDDDDD";
	}
	for(var x=0; x<fieldItems.length; x++)
	{
		var fieldName=fieldItems[x].dataColumn[0];
		var elemId=fieldItems[x].dataColumn[1];
		var fieldType=fieldItems[x].dataColumn[2];
		var fldVal=fieldItems[x].dataColumn[6];
		var smartSuggURL=fieldItems[x].dataColumn[7];	
		if(fieldType=='uniqueBox')
		{
			var obj = document.getElementById(elemId);
			var validationURL=zcServletPrefix+smartSuggURL;
			var currVal = obj.value;
			if((obj.value!="" || obj.value!= currVal))
				callUniqueValidationAjax(validationURL,obj,fieldName,fldVal,"fromSubmit");
		}
	}
	if(uniqueBoxMsg)msg+=uniqueBoxMsg;
	if(msg)
	{	
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}
	else if(funOnsubmit)
	{
		var funct=funOnsubmit.split('~)');
		for(var i=0; i<funct.length; i++)
		{
			var q=funct[i].indexOf('('); 
			var params="";			
			var q1=funct[i].indexOf('{'); 
			if(q>0&&q1<0)
			{
				params=funct[i].substring(q+1,(funct[i].length)-1); 
				funct[i]=funOnsubmit.substring(0,q); 
			}
			return dispatch(funct[i],[formName,params]);
		}
	}
	else
	return true;
}

function changeSmartSuggestTxt(elem,tblName)
{
	if(elem.value=="2 chars or **")
	{
		elem.value="";
		elem.className="inputFieldClass";
		return;
	}
	else if(elem.value=="")
	{
		elem.value="2 chars or **";
		elem.className="inputGrayTextClass";
		var smrtSuggElmId=elem.id;
		var smrtSuggHdnElmId=smrtSuggElmId.split("txt")[0];
		if(smrtSuggElmId!=smrtSuggHdnElmId)
		{
			document.getElementById(smrtSuggHdnElmId).value="";
			smartAddView(smrtSuggHdnElmId,'add')
		}
		return;
	}
	else
	{
		elem.className="inputFieldClass";
		return;
	}
}

function changeMultiTxt(elem)
{
	if(elem.value=="2 chars or **")
	{
		elem.value="";
		elem.style.color="black";
		return;
	}
	else if(elem.value=="")
	{
		elem.value="2 chars or **";
		elem.style.color="gray";
		return;
	}
	else
	{
		elem.style.color="gray";
		return;
	}
}


function callAjax(divId,txtBox,event,smartSuggestURL,val,paramName,readNodeId)
{
	setTimeout(function(){
		if( ( $(txtBox).is(':focus') ) && ( $(txtBox).val().length >= 2) ){
			clearTimeout(typingTimer4Ajax);
			if (txtBox.value) {typingTimer4Ajax = setTimeout("callAjaxAfterDelay('"+divId+"','"+txtBox.id+"','"+event+"','"+smartSuggestURL+"','"+val+"','"+paramName+"','"+readNodeId+"')", 5);}
			}
		},doneTypingInterval);
	
	}

function callAjaxAfterDelay(divId,txtBox,event,smartSuggestURL,val,paramName,readNodeId)
{
	
	if(document.getElementById(txtBox))txtBox=document.getElementById(txtBox);
	var key = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode;
	var keychar = String.fromCharCode(key);
	var smartSuggestParams="";

	if(key==13 || key==9 || key==27 || key==32)
	{
		document.getElementById(divId).style.display="none";
		return false;  // return if the entered char is "Enter"
	}
	else
	{	
		L_SearchStr = val ;
		var quesIndex=smartSuggestURL.indexOf('?'); 
		if(quesIndex!="-1")smartSuggestURL=smartSuggestURL+"&"+"str="+L_SearchStr;
		else smartSuggestURL=smartSuggestURL+"?"+"str="+L_SearchStr;
		/***Check pickList for product. If its product pass brchId as parameter, by Dony 2 Aug 2013****/
		if(smartSuggestURL.indexOf("pckListName=Product")>-1){
			 if(document.getElementById("0-1-251") && document.getElementById("0-1-251").value !=""){
				 smartSuggestURL += "&brchId="+document.getElementById("0-1-251").value;
			 }
			 else if(document.getElementById("0-1-90") && document.getElementById("0-1-90").value !="") smartSuggestURL += "&brchId="+document.getElementById("0-1-90").value;
             else if(currentRecIdsJSON["brch_id"]) smartSuggestURL += "&brchId="+currentRecIdsJSON["brch_id"];
		}
		var parameter=paramName.split('~)');
		var readNodes=readNodeId.split('~)');
		for(var x=0; x<parameter.length;x++)
		{
			if(document.getElementById(readNodes[x]))
			switch(parameter[x])
			{
			  case "cId": 
						smartSuggestParams+="&cId="+document.getElementById(readNodes[x]).value;
						break;
			  case "aId": 
						smartSuggestParams+="&aId="+document.getElementById(readNodes[x]).value;
						break;
			  case "cuId": 
						smartSuggestParams+="&cuId="+document.getElementById(readNodes[x]).value;
						break; 
			  case "pcId": 
						smartSuggestParams+="&pcId="+document.getElementById(readNodes[x]).value;
						break;
			  case "cusObjCid": 
						smartSuggestParams+="&cusObjCid="+document.getElementById(readNodes[x]).value;
						break;
			  case "p1": 
						smartSuggestParams+="&p1="+document.getElementById(readNodes[x]).value;
						break;
			  case "p2": 
						smartSuggestParams+="&p2="+document.getElementById(readNodes[x]).value;
						break;
			  case "p3": 
						smartSuggestParams+="&p3="+document.getElementById(readNodes[x]).value;
						break;
			}
		}
		smartSuggestURL=smartSuggestURL+smartSuggestParams+"&limitData=yes";
		if(smartSuggestURL)
		{
			$.ajax({
			type: "GET",
			url: encodeURI(smartSuggestURL),
			dataType: "xml",
			async: true,
			timeout: 10000,
			success: function (doc)
			 {	
				var details= doc.getElementsByTagName("details");
				var dets = details[0]?details[0].getAttribute("dets") : null;				
				var temp = dets.split('~)');
				var entt=getParameterValue (smartSuggestURL,"pckListName");
				new AutoSuggest(divId,txtBox,temp,entt);
			 },
			error: function(jqXHR, textStatus){
				 	var x=findPosOfObj(txtBox)[0];
					var y=findPosOfObj(txtBox)[1];
					y = y + txtBox.offsetHeight;
				if(textStatus == 'timeout'){
					document.getElementById('divForError').style.left = x+'px';
					document.getElementById('divForError').style.top = y+'px';
					document.getElementById('divForError').innerHTML = 'There must be a problem in configuration of your picklist';
					document.getElementById('divForError').style.display='inline';
					setTimeout(function(){document.getElementById('divForError').style.display='none';},10000);
				}
				else{
					document.getElementById('divForError').style.left = x+'px';
					document.getElementById('divForError').style.top = y+'px';
					document.getElementById('divForError').innerHTML = 'Error in retrieving';
					document.getElementById('divForError').style.display='inline';
					setTimeout(function(){document.getElementById('divForError').style.display='none';},10000);
				}
			}
			});
		}
	}
}

function callUniqueValidationAjax(validationURL,txtBox,fieldName,fldVal,fromSubmit)
{	
	var val=txtBox.value;
	var msg="";
	var searchFlag = false;
	var errorDiv = 'addEditErrorDiv';
	document.getElementById(errorDiv).innerHTML="";

	if((action=="Add" && val !="")||(action=="Edit" && (fldVal != val && fldVal !="")))
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
					  for(var detStr=0;detStr<=dets.length;detStr++)
					  {
						try
						{
							if(dets&&((dets.indexOf('~)')>0)||(dets.indexOf('--')>0)))							
								var eachStr=(dets.split("~)")[detStr]).split("--")[0];
							else if(dets&&dets.indexOf('--')>0)
								var eachStr = dets.split("--")[0];
							if(eachStr!="undefined")
							{
								eachStr = eachStr.toUpperCase();
								eachStr = eachStr.trim();
								val = val.toUpperCase();
								val = val.trim();
								fldVal = fldVal.toUpperCase();fldVal=fldVal.trim();
								if((action=="Edit"&&fldVal != val)||action=="Add")
									if(eachStr == val){searchFlag = true;break;}
							}
						}
						catch (e)
						{}
					   }
				  }
				  if(searchFlag==true)
				  { 
				     msg+="<li>'"+fieldName+"' already exist. Please enter unique value.</li>";
					if(!fromSubmit)
					{	
						if(msg){document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
						document.getElementById(errorDiv).style.display="block";
						txtBox.style.border="1px solid #CC0000";
						txtBox.focus();}
					}
					else
						uniqueBoxMsg+=msg;
				  }
				else
					document.getElementById(errorDiv).style.display="none";
			   }
			});
	      }
      }
}


function getAllSelected(selectId,formName)
{
	var oSelect=document.getElementById(selectId);
	var chosen = "";
    for (var iCount=0; oSelect.options[iCount]; iCount++)
	{		
        if (oSelect.options[iCount].selected == true)
		{			
			if(chosen)
			chosen = chosen  + "~)" + oSelect.options[iCount].value;
			else
			chosen = oSelect.options[iCount].value;
        }
    }
	var hidnFld=selectId.slice(7);
	if (document.getElementById(hidnFld))
	{
		document.getElementById(hidnFld).value=chosen;
	}
	
}

function callMultiSelect(txtId,hiddFld)
{	
	if(document.getElementById(hiddFld).value)
	{   
		var val=document.getElementById(hiddFld).value;
		var label=document.getElementById(txtId).value;
		fillMultiSelect(val,label,hiddFld);	
		document.getElementById(txtId).value='';
		document.getElementById(hiddFld).value='';
      } 
}

function fillMultiSelect(fldVal,fldLbl,hiddFld)
{ 	
	var selectedItem=false;
	var arrayName=ReplaceAll(hiddFld,"-","_");
	var maxCnt=parseFloat(document.getElementById(hiddFld+'-max').value);
	var fun2call=document.getElementById(hiddFld+'-fun').value;
	var q=fun2call.indexOf('('); 
	var params="";
	if(q>0)
	{
		params=fun2call.substring(q+1,(fun2call.length)-1); 
		fun2call=fun2call.substring(0,q); 
	}

	if(fldVal)
	{	
		var LocalWindowArray = window["array_" + arrayName];            
		if(maxCnt)
		if(maxCnt<=LocalWindowArray.length)
		{selectedItem=true;}
		for (var i=0;i<LocalWindowArray.length;i++ )
		{		
			if (LocalWindowArray[i]==fldVal)
				selectedItem=true;
		}
		if(selectedItem==false)
		{	
			window["array_" + arrayName].push(fldVal);
			
			document.getElementById(hiddFld.replace("-multi","")).value=window["array_" + arrayName];

			document.getElementById(hiddFld+'-multiSelDiv').innerHTML+="<div id='"+hiddFld+"_"+fldVal+"' title='"+fldLbl+"' class='ui-corner-all multiSelectRow'>"+fldLbl.substring(0,20)+"<span onclick='deleteMultiSltRow(\""+hiddFld+"_"+fldVal+"\",\""+fldVal+"\",\""+hiddFld+"-multiSelDiv\",\""+hiddFld+"\");' style='float:right;padding-right:1px;cursor:pointer' title='Remove'><img src='/atCRM/images/remove.gif' ></span></div>";
			if(fun2call)
			dispatch(fun2call,[fldVal,fldLbl,1,params]);
		}
	}
}

function deleteMultiSltRow(id,val,divId,hiddFld)
{	
	var fun2call=document.getElementById(hiddFld+'-fun').value;
	var arrayName=ReplaceAll(hiddFld,"-","_");

	for(i=0; i<window["array_" + arrayName].length; i++)
	{
		if(val == window["array_" + arrayName][i])
		{  
		    window["array_" + arrayName].splice(i,1);
			var parentElement=document.getElementById(divId);
			var removableElement=document.getElementById(id);
			parentElement.removeChild(removableElement);
		}
	}
	document.getElementById(hiddFld.replace("-multi","")).value=window["array_" + arrayName];
	if(fun2call)
	dispatch(fun2call,[val,'',0]);
}

function makeComboSearchable(val,searchParam,elemId,fieldType)
{	
	/***CODE TO FIND THE BROWSER DETAILS */
	var L_autoSuggElement="div";
    if(jQuery.browser.msie)
	{
      L_autoSuggElement = "div";
	}
    else
	{
      L_autoSuggElement = "div";
	}
	/***CODE TO FIND THE BROWSER DETAILS */
	(function($) {
		$.widget("ui.combobox", {
			_create: function() {
				var self = this;				
				var select = this.element.hide();
				var input = $("<input value='"+val+"' id='combo_"+elemId+"'  onblur='filterMe(this)' style='width:120px;'>" )  					
					.insertAfter(select)
					.autocomplete({
						source: function(request, response,event) {
							var matcher = new RegExp(request.term, "i");
							var noOfMatches=0;					
								response(select.children("option").map(function() {
								var text = $(this).text();								
								L_selTextArr = text;								
								L_selTextArr = L_selTextArr.split(">");
								L_selText =L_selTextArr[L_selTextArr.length-1];
								
								if(L_selText ==val )
								{
									text = '<b>'+text+'</b>'; 									   
								} 								
								if (!request.term || matcher.test(text)){
								noOfMatches++;
									return {
										id: $(this).val(),
										label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + request.term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
										value: text
									};
								}
							}));
							if(noOfMatches==0&&elemId){
								/*Call 'invokeStates' function only if the fieldType is dropDownTerr*/
								if(fieldType && fieldType == "dropDown-state") invokeStates(elemId,request.term,elemId);
								}
							
						},
						delay: 0,
						focus: function( event, ui ) 
							{
							
								ui.item.value = ui.item.value.replace("<b>","");
								ui.item.value = ui.item.value.replace("</b>","");
								ui.item.value = ui.item.value.replace('<font style="color:red">',"");
								ui.item.value = ui.item.value.replace("</font>","");
						},
						select: function(e, ui) {	
							
							ui.item.value = ui.item.value.replace("<b>","");
							ui.item.value = ui.item.value.replace("</b>","");
							ui.item.value = ui.item.value.replace('<font style="color:red">',"");
							ui.item.value = ui.item.value.replace("</font>","");
							L_arrValue = ui.item.value;
							L_arrValue = L_arrValue.split(">");
							L_arrValue =  L_arrValue[L_arrValue.length-1];
							ui.item.value = L_arrValue;	
							if (!ui.item) {	
								
								$(this).val("");
								return false;
							}
							$(this).focus();
							select.val(ui.item.id);
							self._trigger("selected", null, { 									
							item: select.find("[value='" + ui.item.id + "']")
							});	
							//reloadSamePage(ui.item.id);								
						},
						minLength: 0
					})
					.addClass("ui-widget ui-widget-content");
					
				$("<"+L_autoSuggElement +" id='div_"+elemId+"' style='left:-32px;width:15px;border:0px solid red;'>&nbsp;</div>")
				.insertAfter(input)
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"						
					},
					text: false,
					id:"'span_"+elemId+"'"
				})
				//.removeClass("ui-corner-all")
				.addClass("ui-button-icon").position({
					my: "left center",
					at: "right center",
					of: input,
					offset: "-16.5"
				}).css("top", "").click(function() {
					
					// close if already visible
					if (input.autocomplete("widget").is(":visible")) {
						input.autocomplete("close");						  	
						return;
					}
					// pass empty string as value to search for, displaying all results
					input.autocomplete("search", ""); 					
					input.focus (); 
						
				});					
				if(searchParam){ 						
					input.autocomplete("search", "");
					input.focus();							
				}					
			}				
		});		
	})(jQuery);		
}

function filterMe(varThis)
{
	L_valueArr = varThis.value;
	L_valueArr = L_valueArr.split(">");
	varThis.value=L_valueArr[L_valueArr.length-1];
}

function invokeStates(selectBoxId,searchParam,elemId)
{ 
	var selBox=document.getElementById(selectBoxId);
	if(searchParam)
	var stateUrl=zcServletPrefix+"/custom/JSON/system/states.htm?searchParam="+searchParam;			
	else
	var stateUrl=zcServletPrefix+"/custom/JSON/system/states.htm";		

	$.ajax({
		type: "GET",
		url:stateUrl,
		dataType: "json",
		async:false,
		success: function (doc){  													
			var allStates = doc["allStates"];										
			var allStatesLength =  allStates.length;
			for(k=0,l=0;k<allStatesLength;k++,l++)
			{
				stateName = allStates[l]["State"];
				stateId =  allStates[l]["stateId"];
				selBox[k]=new Option(stateName, stateId);
		   }				
		}
	});
}

function getState(id,elemId,notDisableFld)
{
	var fldVal = "none";
	var dispValstate = "";
	var selBox;
	if(id)
	 {
		var stateUrl=zcServletPrefix+"/custom/JSON/system/getState.htm?id="+id;										
		$.ajax({
			type: "GET",
			url:stateUrl,
			dataType: "text",
			async:false,
			success: function (doc)
			{  													
				if(document.getElementById('combo_'+elemId))
				{
					if(notDisableFld)
					{
						document.getElementById('combo_'+elemId).value=doc;
						document.getElementById(elemId).selectedValue=id;
					}
					else
					{
						document.getElementById('combo_'+elemId).value=doc;
						document.getElementById(elemId).value = id;
						document.getElementById('combo_'+elemId).disabled=true;
						document.getElementById('div_'+elemId).style.display="none";						
						document.getElementById('combo_'+elemId).className="inputFieldDisabledClass";
					}
				}
			}
		});
	 }
	 else
	 {
		if(notDisableFld && document.getElementById('combo_'+elemId))
		{
			document.getElementById('combo_'+elemId).value="None";
		}
		else if(document.getElementById('combo_'+elemId))
		{
			document.getElementById('combo_'+elemId).value="None";
			document.getElementById('combo_'+elemId).disabled=true;
			document.getElementById('div_'+elemId).style.display="none";						
			document.getElementById('combo_'+elemId).className="inputFieldDisabledClass";
		}
	 }
}
  
function blockObjectRelatedFields(thisElemId,hdnFld)
{
	var qckAddBlkFlds=thisElemId.substr(0,3);
	var fillTblName=document.getElementById(thisElemId+'fillTbl').value;
	var cols=document.getElementById(thisElemId+"fillColumns").value;
	var pkCol=document.getElementById(thisElemId+"fillPk").value;
	if(document.getElementById(hdnFld))
	var pkVal=document.getElementById(hdnFld).value;
	
	document.getElementById(thisElemId).blur();
	if(document.getElementById(thisElemId+'_unlock'))
	document.getElementById(thisElemId+'_unlock').style.visibility="visible";
	var detUrl=zcServletPrefix+'/custom/JSON/smartSuggest/smartFillData.htm?cols='+cols+'&tblName='+fillTblName+'&pkCol='+pkCol+'&pkVal='+pkVal;
	$.ajax(
	{
		type: "GET",
		url: encodeURI(detUrl),
		dataType: "json",
		success: function (doc)
		{
			var frmFldItemsForBlk=fieldItems;
			if(qckAddBlkFlds=="QA_")
				frmFldItemsForBlk=fieldItemsQ;

			var columns=doc['enttInfo'].cols.split('~)');
			var colData=doc['enttInfo'].data.split('~)');
			for(var fldItm=0; fldItm<frmFldItemsForBlk.length; fldItm++)
			{
				var tblName=frmFldItemsForBlk[fldItm].dataColumn[9];
				if(fillTblName==tblName)
				{
					var elemId=frmFldItemsForBlk[fldItm].dataColumn[1];
					var fieldType=frmFldItemsForBlk[fldItm].dataColumn[2];		
					var colName=frmFldItemsForBlk[fldItm].dataColumn[10];
					
					for(var k=0;k<columns.length;k++)
					{
						ColmnName=columns[k];						
						ColmnValue=colData[k];			
						
						if(colName==ColmnName)
						{ 	
							var elemId_first = thisElemId.substr(0,thisElemId.lastIndexOf("-"));
							var elemId_others = elemId.substr(0,elemId.lastIndexOf("-"));
						 	if(elemId_first == elemId_others)
							{
								if(fieldType=="dropDown-state")
								{ 	
									getState(ColmnValue,elemId)
								}
							if(ColmnValue)document.getElementById(elemId).value=ColmnValue.replace(/&quot;/g,"\"");
							document.getElementById(elemId).disabled=true;
							document.getElementById(elemId).className="inputFieldDisabledClass";
					
						switch(fieldType)
						{  
							
							case "dropDown-state":		
										document.getElementById('combo_'+elemId).disabled=true;
										document.getElementById('combo_'+elemId).className="black";
										break;	

							case "Multi":
										document.getElementById('virtual'+elemId).disabled=true;
										document.getElementById('virtual'+elemId).className="inputFieldDisabledClass";
										break;							
							case "Date":
							case "dateOnly":
										document.getElementById(elemId+'_date_value').disabled=true;
										document.getElementById(elemId+'_date_value').className="inputFieldDisabledClass";
										document.getElementById(elemId+'_cal').disabled=true;
										document.getElementById(elemId+'_cal').style.visibility='hidden';
										break;	
									
							case "dateAndTime":
							case "DateTime":
										document.getElementById(elemId+'_date_value').disabled=true;
										document.getElementById(elemId+'_date_value').className="inputFieldDisabledClass";
										document.getElementById(elemId+'_time_value').disabled=true;
										document.getElementById(elemId+'_time_value').className="inputFieldDisabledClass";
										document.getElementById(elemId+'_cal').style.visibility='hidden';
										break;		

							case "multiSelect":	
										document.getElementById(elemId+'txt').disabled=true;
										document.getElementById(elemId+'txt').className="inputFieldDisabledClass";
										document.getElementById(elemId+'-multiSelDiv').disabled=true;
										break;	
									
							case "smartSuggest":	
										document.getElementById(elemId+'txt').disabled=true;
										document.getElementById(elemId+'txt').className="inputFieldDisabledClass";
										document.getElementById(elemId+'pck').disabled=true;
										document.getElementById(elemId+'pck').style.visibility='hidden';
										break;	
									
							case "smartFill":	
										document.getElementById(elemId).className="inputFieldDisabledClass";
										break;	

							case "pickList":
							case "lookUp":
										document.getElementById(elemId+'pck').disabled=true;
										document.getElementById(elemId+'pck').style.visibility='hidden';
										break;	
							}
						  }
				    	}				
					}
				}	
			}
			
		}
		});
	document.getElementById(thisElemId).style.fontWeight = 'bold';
	smartAddView(thisElemId,'view')
}
function callblockMappedObjectFields(fn,thisElemId,hdnFld)
{  
	if(document.getElementById(thisElemId)&& document.getElementById(thisElemId).value!="" && document.getElementById(thisElemId).value!="2 chars or **") blockMappedObjectFields(thisElemId,hdnFld);
}

function blockMappedObjectFields(thisElemId,hdnFld)
{
	var qckAddBlkFlds=thisElemId.substr(0,3); 	
	if(document.getElementById(thisElemId+'fillTbl'))var fillTblName=document.getElementById(thisElemId+'fillTbl').value;	
	if(document.getElementById(thisElemId+"fillColumns"))var cols=document.getElementById(thisElemId+"fillColumns").value;	
	if(document.getElementById(thisElemId+"fillFields"))var fillFields=document.getElementById(thisElemId+"fillFields").value;	
	if(document.getElementById(thisElemId+"fillPk"))var pkCol=document.getElementById(thisElemId+"fillPk").value;	
	if(document.getElementById(hdnFld))var pkVal=document.getElementById(hdnFld).value; 	
	
	document.getElementById(thisElemId).blur();		
	document.getElementById(thisElemId+'_unlock').style.visibility="visible";
	var udmName=G_data.UDMName;
	var detUrl=zcServletPrefix+'/custom/JSON/smartSuggest/smartFillData.htm?cols='+cols+'&tblName='+fillTblName+'&pkCol='+pkCol+'&pkVal='+pkVal;
	if(udmName=='custom/JSON/add/invoices') detUrl +='&isInvoice=1';
	/***Pass brchId if tblName and add invoice page is Product, by Dony 2 Aug 2013****/
	if(fillTblName.toLowerCase() =="product"){
		     var brchId;
             if(document.getElementById("0-1-251") && document.getElementById("0-1-251").value !=""){
				 detUrl += "&brchId="+document.getElementById("0-1-251").value;
			 }
			 else if(currentRecIdsJSON["brch_id"]) detUrl += "&brchId="+currentRecIdsJSON["brch_id"];
	}
	$.ajax(
	{
		type: "GET",
		url: encodeURI(detUrl),
		dataType: "json",
		success: function (doc)
		{
			var frmFldItemsForBlk = fieldItems.concat(listFieldItems).concat(multiListFieldItems);
			var fillFieldIds=fillFields.split(",");
			var colData=doc['enttInfo'].data.split('~)');
			var colsNames = doc['enttInfo'].cols.split('~)');
			var colData2=doc['enttInfo'].data.split('~)');
			var billAddr_line1 = '';
			var billAddr_line2 = '';
			var billAddr_city = '';
			var billAddr_state_id = '' ;
			var billAddr_zipcode = '';
			var noShippingAddr = false;
			var billIndex ='';
			colData.splice(0,1);
			for(var fldItm=0; fldItm<frmFldItemsForBlk.length; fldItm++)
			{
				var elemId=frmFldItemsForBlk[fldItm].dataColumn[1];
				var fieldType=frmFldItemsForBlk[fldItm].dataColumn[2];
				for(var k=0;k<colData.length;k++)
				{
					ColmnValue=colData[k];
					fieldId=fillFieldIds[k];
					fieldId2=fillFieldIds[k-1];
					ColmnValue2=colData2[k];
					var colName2 = colsNames[k+1];
					var colName = colsNames[k];
					if(fieldId==elemId && fieldId && fieldId!=thisElemId)
					{
						if(fieldType=="dropDown-state")
						{ 	
							getState(ColmnValue,elemId,1);
						}
						if(fieldType=="smartSuggest")
						{
							var fld="#"+fieldId+"txt";
							$(fld).focus();
							$(fld).val("**");
							$(fld).keypress();
						}
						if(ColmnValue)document.getElementById(fieldId).value=ColmnValue.replace(/&quot;/g,"\"");
						
				if( fillTblName == 'Account')
					{ 
						switch(colName) {
							case 'billing_addr_line1' : 
								billAddr_line1=ColmnValue2.replace(/&quot;/g,"\"");break;
							case 'billing_addr_line2' :	
								billAddr_line2=ColmnValue2.replace(/&quot;/g,"\"");break;
							case 'billing_city' :		
								billAddr_city=ColmnValue2.replace(/&quot;/g,"\"");break; 
							case 'billing_state_id' :
								billIndex = $('#'+fieldId2+' :selected').index();
							break;
							case 'billing_zipcode' :	
								billAddr_zipcode=ColmnValue2.replace(/&quot;/g,"\"");break;
							default : function donothing(){}
						}
					}
					if( fillTblName == 'Contact')
					{
						switch(colName) {
							case 'pri_addr_line1' :
								billAddr_line1=ColmnValue2.replace(/&quot;/g,"\"");break;
							case 'pri_addr_line2' :
								billAddr_line2=ColmnValue2.replace(/&quot;/g,"\"");break;
							case 'pri_city' :		
								billAddr_city=ColmnValue2.replace(/&quot;/g,"\"");break; 
							case 'pri_state_id' :	
								billIndex = $('#'+fieldId2+' :selected').index();
							break;
							case 'zipcode' :	
								billAddr_zipcode=ColmnValue2.replace(/&quot;/g,"\"");break;
							default : function donothing(){}
						}
					}
					if (colName == 'shipping_addr_line1')
					{	
						if(ColmnValue2 == '')noShippingAddr = true;
					}
					if(noShippingAddr){
						switch(colName) {
							case 'shipping_addr_line1' : 
								if(document.getElementById(fieldId2))
								document.getElementById(fieldId2).value=billAddr_line1;break;
							case 'shipping_addr_line2' :
								if(document.getElementById(fieldId2))
								document.getElementById(fieldId2).value=billAddr_line2;break;
							case 'shipping_city' :		
								if(document.getElementById(fieldId2))
								document.getElementById(fieldId2).value=billAddr_city;break; 
							case 'shipping_state_id' :
								if(document.getElementById('combo_'+fieldId2)){
								var stateOnly = document.getElementById(fieldId2).options[billIndex].text;
								document.getElementById(fieldId2).options[billIndex].selected = true;
								stateOnly = stateOnly.substring(stateOnly.indexOf('>')+2);
								document.getElementById('combo_'+fieldId2).value = stateOnly;
								}
								break;
							case 'shipping_zipcode' :	
								if(document.getElementById(fieldId2))
								document.getElementById(fieldId2).value=billAddr_zipcode;break;
							default : function donothing(){}
							}
							if(colName2 == 'shipping_zipcode')
							{
								document.getElementById(fieldId).value=billAddr_zipcode;
							}
						}
					}
				}
					
			}
			var enablePinBrchMapp="0";
			var flagData = parent.flagsJSON;
			var orgFlagData = flagData[0]["org_flags"];
			for(var t=0;t<orgFlagData.length;t++)
			{
				var flagName = orgFlagData[t]["name"];
				var flagVal = orgFlagData[t]["flag_value"];
				if(flagName == "enable_pincode_branch_mapping" && flagVal =="1")
				{
					 enablePinBrchMapp = flagVal;
					 break;
				}
			}
			/******Zipcode and branch mapping --- Check whether the page contains invoiced_at_branch field and entity is contact**********/
			if(enablePinBrchMapp =="1" && (fillTblName=='Contact' || fillTblName=='Account' )&& document.getElementById("0-1-251"))
			  {
				var colsData = doc['enttInfo'].data.split('~)');
				var zipCode="";var priCity="";var priStateId="";
				for(var k=0;k<colsData.length;k++)
				{
					ColumnValue=colsData[k];
					var colName = doc['enttInfo'].cols.split('~)')[k];
					if(colName == "pri_city" || colName == "billing_city") priCity = ColumnValue;
					if(colName == "pri_state_id" || colName=="billing_state_id") priStateId = ColumnValue;
					if(colName == "zipcode" || colName == "billing_zipcode"){
					  zipCode = ColumnValue.replace(/[^0-9]/g,""); /**repalce all the characters except numbers**/
                       /***Get the branch details for the selected zipcode****/
					  if((zipCode && zipCode !="")|| (priStateId && priStateId !="")){
					   url2hit = "/atCRM/custom/JSON/system/getBranchInfo4PIN.htm?zipcode="+zipCode+"&priStateId="+priStateId;
                       $.ajax({
						type:'GET',
						url:url2hit,
						dataType:'json',
						cache:false,
						success: function (data)
						{  
						  var branchData = data["branchData"];
						  var branchId = branchData[0]["branchId"];
						  var branchName = branchData[0]["branchName"];
						  var stateId = branchData[0]["state"];
						  if(document.getElementById("0-1-251").value ==""){
						  document.getElementById("0-1-251").value = branchId;
						  parent.currentRecIdsJSON["brch_id"] = branchId;
						  }
						  parent.currentRecIdsJSON["state_id"] = stateId;
						 if(document.getElementById("0-1-251txt") && branchName) document.getElementById("0-1-251txt").value = branchName;
						 else if(branchName){
                            var brchElemParent = document.getElementById("0-1-251").parentNode;
							var brchHdnElem = document.getElementById("0-1-251");
                            brchElemParent.innerHTML = branchName;
							$(brchElemParent).append(brchHdnElem);                            
						 }
						}
					   });
					 }
					}
				}		
			  }
			if(fillTblName=='Account') parent.currentRecIdsJSON["acct_id"] = pkVal;
			if(fillTblName=='Contact') parent.currentRecIdsJSON["cont_id"] = pkVal;
			if(fillTblName=='Product')
			{
				if(document.getElementById(thisElemId+"hdn")) {
					parent.currentRecIdsJSON["prod_id"] = pkVal;
				}
				/*try{
					getTaxDet4Prod(colData[0],thisElemId);
					calculateTotal('',document.getElementById(thisElemId));
				}catch(e){}*/
				try{
					calculateTotForInv('',document.getElementById(thisElemId));
				}catch(e){}
				try{
					calculateQuoteTotal('',document.getElementById(thisElemId));
				}catch(e){}
				try{
					calculateOrderTotal('',document.getElementById(thisElemId));
				}catch(e){}
				blockDtlFileds();
			}
		}
	});
	document.getElementById(thisElemId).style.fontWeight = 'bold';
	document.getElementById(thisElemId).disabled = true;
	if(document.getElementById('addEditErrorDiv')&&document.getElementById('addEditErrorDiv').style.display=="block")
	{
		document.getElementById('addEditErrorDiv').style.display="none";
		document.getElementById(thisElemId).style.border="1px solid #CCCCCC";
	}
	smartAddView(thisElemId,'view');
}

function unblockObjectRelatedFields(thisElemId,thisTblName,formName)
{
	var qckAddBlkFlds=thisElemId.substr(0,3);
	if(document.getElementById(thisElemId+'_unlock').style.visibility=="visible")
	{
		document.getElementById(thisElemId+'_unlock').style.visibility="hidden";
		var frmFldItemsForBlk=fieldItems;
		if(qckAddBlkFlds=="QA_")
			frmFldItemsForBlk=fieldItemsQ;

		for(var fldItm=0; fldItm<frmFldItemsForBlk.length; fldItm++)
		{
			var elemId=frmFldItemsForBlk[fldItm].dataColumn[1];
			var fieldType=frmFldItemsForBlk[fldItm].dataColumn[2];		
			var tblName=frmFldItemsForBlk[fldItm].dataColumn[9];
			var colName=frmFldItemsForBlk[fldItm].dataColumn[10];
			
			if(thisTblName==tblName)
			{
				var elemId_first = thisElemId.substr(0,thisElemId.lastIndexOf("-"));
				var elemId_others = elemId.substr(0,elemId.lastIndexOf("-"));
				if(elemId_first == elemId_others)
				{
					document.getElementById(elemId).value="";
					document.getElementById(elemId).disabled=false;
					document.getElementById(elemId).className="inputFieldClass";
					switch(fieldType)
					{
						case "Multi":
									document.getElementById('virtual'+elemId).disabled=false;
									document.getElementById('virtual'+elemId).className="inputFieldClass";
									break;							
						case "Date":
						case "dateOnly":
									document.getElementById(elemId+'_date_value').disabled=false;
									document.getElementById(elemId+'_date_value').value="";
									document.getElementById(elemId+'_date_value').className="inputFieldClass";
									document.getElementById(elemId+'_cal').disabled=false;
									document.getElementById(elemId+'_cal').style.visibility='visible';
									break;	
								
						case "dateAndTime":
						case "DateTime":
									document.getElementById(elemId+'_date_value').disabled=false;
									document.getElementById(elemId+'_date_value').value="";
									document.getElementById(elemId+'_date_value').className="inputFieldClass";
									document.getElementById(elemId+'_time_value').disabled=false;
									document.getElementById(elemId+'_time_value').value="";
									document.getElementById(elemId+'_time_value').className="inputFieldClass";
									document.getElementById(elemId+'_cal').style.visibility='visible';
									break;		

						case "multiSelect":	
									document.getElementById(elemId+'txt').disabled=false;
									document.getElementById(elemId+'txt').value="2 chars or **";
									document.getElementById(elemId+'txt').className="ui-corner-all multiSelectTxt";
									document.getElementById(elemId+'-multiSelDiv').disabled=false;
									break;	
								
						case "smartSuggest":	
									document.getElementById(elemId+'txt').disabled=false;
									document.getElementById(elemId+'txt').value="2 chars or **";
									document.getElementById(elemId+'txt').className="inputGrayTextClass";
									document.getElementById(elemId+'pck').disabled=false;
									document.getElementById(elemId+'pck').style.visibility='visible';
									break;	
								
						case "smartFill":	
									document.getElementById(elemId+'hdn').value="";
									document.getElementById(elemId).value="2 chars or **";
									document.getElementById(elemId).className="inputGrayTextClass";
									break;	

						case "pickList":
						case "lookUp":
									document.getElementById(elemId).value="2 chars or **";
									document.getElementById(elemId).className="inputGrayTextClass";
									document.getElementById(elemId+'pck').disabled=false;
									document.getElementById(elemId+'pck').style.visibility='visible';
									break;	
						case "dropDown-state":
									document.getElementById('combo_'+elemId).value="None";
									document.getElementById('combo_'+elemId).disabled=false;
									document.getElementById('combo_'+elemId).className="black";
									document.getElementById('div_'+elemId).style.display="";
					}
				}
			}	
		}
		document.getElementById(thisElemId).style.fontWeight = 'normal';
	}
	smartAddView(thisElemId,'add')
}

function unblockMappedObjectFields(thisElemId,thisTblName,formName)
{
	var from_unblock=1;
	var qckAddBlkFlds=thisElemId.substr(0,3);
	if(document.getElementById(thisElemId+'_unlock').style.visibility=="visible")
	{
		document.getElementById(thisElemId+'_unlock').style.visibility="hidden";
		var frmFldItemsForBlk = fieldItems.concat(listFieldItems).concat(multiListFieldItems);

		var fillFields=document.getElementById(thisElemId+"fillFields").value;
		var fillFieldIds=fillFields.split(",");

		for(var fldItm=0; fldItm<frmFldItemsForBlk.length; fldItm++)
		{
			var elemId=frmFldItemsForBlk[fldItm].dataColumn[1];
			var fieldType=frmFldItemsForBlk[fldItm].dataColumn[2];		
			var tblName=frmFldItemsForBlk[fldItm].dataColumn[9];
			
			for(fldIdsCntr=0;fldIdsCntr<fillFieldIds.length;fldIdsCntr++)
			{
				
				if(elemId==fillFieldIds[fldIdsCntr])
				{
					document.getElementById(elemId).value="";
					if(fieldType!="disabledField")
					document.getElementById(elemId).disabled=false;
					document.getElementById(elemId).className="inputFieldClass";
					switch(fieldType)
					{
						case "Multi":
									document.getElementById('virtual'+elemId).disabled=false;
									document.getElementById('virtual'+elemId).className="inputFieldClass";
									break;							
						case "Date":
						case "dateOnly":
									document.getElementById(elemId+'_date_value').disabled=false;
									document.getElementById(elemId+'_date_value').value="";
									document.getElementById(elemId+'_date_value').className="inputFieldClass";
									document.getElementById(elemId+'_cal').disabled=false;
									document.getElementById(elemId+'_cal').style.visibility='visible';
									break;	
								
						case "dateAndTime":
						case "DateTime":
									document.getElementById(elemId+'_date_value').disabled=false;
									document.getElementById(elemId+'_date_value').value="";
									document.getElementById(elemId+'_date_value').className="inputFieldClass";
									document.getElementById(elemId+'_time_value').disabled=false;
									document.getElementById(elemId+'_time_value').value="";
									document.getElementById(elemId+'_time_value').className="inputFieldClass";
									document.getElementById(elemId+'_cal').style.visibility='visible';
									break;		

						case "multiSelect":	
									document.getElementById(elemId+'txt').disabled=false;
									document.getElementById(elemId+'txt').value="2 chars or **";
									document.getElementById(elemId+'txt').className="ui-corner-all multiSelectTxt";
									document.getElementById(elemId+'-multiSelDiv').disabled=false;
									break;	
								
						case "smartSuggest":	
									document.getElementById(elemId+'txt').disabled=false;
									document.getElementById(elemId+'txt').value="2 chars or **";
									document.getElementById(elemId+'txt').className="inputGrayTextClass";
									document.getElementById(elemId+'pck').disabled=false;
									document.getElementById(elemId+'pck').style.visibility='visible';
									break;	
								
						case "smartFill":	
									document.getElementById(elemId+'hdn').value="";
									document.getElementById(elemId).value="2 chars or **";
									document.getElementById(elemId).className="inputGrayTextClass";
									break;	
						
						case "pickList":
						case "lookUp":
									document.getElementById(elemId).value="2 chars or **";
									document.getElementById(elemId).className="inputGrayTextClass";
									document.getElementById(elemId+'pck').disabled=false;
									document.getElementById(elemId+'pck').style.visibility='visible';
									break;	
						case "dropDown-state":
									document.getElementById('combo_'+elemId).value="None";
									//document.getElementById('combo_'+elemId).disabled=false;
									document.getElementById('combo_'+elemId).className="inputFieldClass";
									//document.getElementById('div_'+elemId).style.display="";
						case "textBox":
						case "Text":
									document.getElementById(elemId).value="";
									 break;
						case "Integer":document.getElementById(elemId).value="";
									 break;
						case "Decimal":
									document.getElementById(elemId).value="";
									 break;
					}
				}
			}
		}
		document.getElementById(thisElemId).style.fontWeight = 'normal';
		document.getElementById(thisElemId).value = '2 chars or **';
		document.getElementById(thisElemId).className="inputGrayTextClass";
        if(thisTblName == 'Contact' && document.getElementById("0-1-251"))
		{
			 document.getElementById("0-1-251").value = "";
			 if(document.getElementById("0-1-251txt")) document.getElementById("0-1-251txt").value = "2 chars or **";
		}
		if(thisTblName=='Product')
		{
			try{
				calculateTotal('',document.getElementById(thisElemId));
			}catch(e){}
			try{
				calculateTotForInv('',document.getElementById(thisElemId));
			}catch(e){}
			try{
				calculateQuoteTotal('',document.getElementById(thisElemId));
			}catch(e){}
			try{
				calculateProdTotalPrice();
			}catch(e){}
			if(currPageUDM=="custom/JSON/add/invoices"){
			try{
				calculateProdTotalPriceForInvoice('','',from_unblock);
			}catch(e){}}
			if(currPageUDM=="custom/JSON/add/quote_header"){
			try{
				calculateProdTotalPriceForQuote('',document.getElementById(thisElemId),from_unblock);
			}catch(e){}}
		}
	}
	smartAddView(thisElemId,'add')
}

function expandSection(img,div)
{
	var expand=document.getElementById(div).style.display;
	if(expand=="block" || expand=="")		
	document.getElementById(img).src='/atCRM/stylesheets/JSON/jquery/images/uup.png';	
	else 
	document.getElementById(img).src='/atCRM/stylesheets/JSON/jquery/images/ddn.png';
	
	divID = "#"+div
	$(divID).slideToggle('slow');
}

function smartAddView(id,fn)
{
	var tableName=document.getElementById(id+'fillTbl').value;
	if(fn=="add")
	{
		document.getElementById(id+'_add').innerHTML="<img  style='cursor:pointer;margin-left:1px;vertical-align:top' src='/atCRM/images/JSON/qadd.png' title='Add' onclick='showAQDialo(g\""+tableName+"\",\"\",\"\",\"\",\"\",\""+id+"\")'>";
	}
	else
	{
		document.getElementById(id+'_add').innerHTML="<img  style='cursor:pointer;margin-left:1px;height:14px;width:14px;' src='/atCRM/images/JSON/view-detail.png' title='View Details' onclick='viewMappedRecord(\""+tableName+"\",\""+id+"\")'>";
	}
}


function viewMappedRecord(tableName,elem)
{
	if(document.getElementById(elem+'hdn'))var pk=document.getElementById(elem+'hdn').value;else var pk=document.getElementById(elem).value;
	var tN=tableName.toLowerCase();
	var mainUrl=zcServletPrefix+'/custom/JSON/view/'+tN+'360View.htm?id='+pk;
	$.ajax({
	type: "GET",
	url: encodeURI(mainUrl),
	success: function (data)
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
		var wd=screen.width-200;
		var ht=screen.height-400;

		$('#viewMappedRecordPopUp').dialog({
			autoOpen:true,
			modal: true,	
			width: wd,	
			height:ht,
			closeOnEscape:true
		});
		handleJson360ViewData(doc,'viewMappedRecordPopUp');
	}
	});
}
 
var allDatafromDropDown= new Array();
var multiLevelDD=0;

function fillMultiLevelDropData(fldObjId,val)
{
	var elemId=fldObjId.replace("-mnu","");
	var lastIndex=val.lastIndexOf(">>")>0 ? val.lastIndexOf(">>")+2 : 0;
	var val2Display=val.substring(lastIndex);
	document.getElementById(elemId).value=val;
	document.getElementById(elemId+'-href').innerHTML=val2Display;

	var dropUl=document.getElementById(fldObjId);
	var dropUlSpan=document.getElementById(elemId+'-mnuspan');
	dropUlSpan.removeChild(dropUl);
}

function showMultiLevelDropData(fldObjId,tblName,colName,nextLevel,prevParent)
{	
	var Data2showDropDown= new Array();	
	var fldObj=document.getElementById(fldObjId);
	multiLevelDD++;
	if(!nextLevel)	
	{
		multiLevelDD=0;
		allDatafromDropDown.length=0;
		var span4ul=document.getElementById(fldObjId+'span');
		if(fldObj)span4ul.removeChild(fldObj);
		span4ul.innerHTML+="<ul id='"+fldObjId+"' class='dropDownMenuUL'></ul>";
		var fldObj=document.getElementById(fldObjId);
		var url2Hit=zcServletPrefix+"/custom/JSON/smartSuggest/custom_pckLstValues.htm?enttName="+tblName+"&enttClmn="+colName;
		$.ajax(
		{
			type: "GET",
			url: encodeURI(url2Hit),
			dataType: "json",
			async:false,
			success: function (pckDoc)
			{   
				var column_value=pckDoc.PickListItems;
				allDatafromDropDown=column_value.split('~)');	
				
			}
		});
	
		//First stage
		for(var i=0; i<allDatafromDropDown.length; i++)
		{
			var id4menu=fldObjId+"-"+multiLevelDD+"-"+i;
			if(allDatafromDropDown[i].indexOf('>>')<0)
			{
				if(includeInArray(Data2showDropDown,allDatafromDropDown[i])==false)
				{
					Data2showDropDown.push(allDatafromDropDown[i]);
					fldObj.innerHTML+="<li id='"+id4menu+"' class='dropDownMenuLi'><a href='javascript:fillMultiLevelDropData(\""+fldObjId+"\",\""+allDatafromDropDown[i]+"\")'>"+allDatafromDropDown[i]+"</a></li>";
				}
			}
			else 
			{	
				var val=allDatafromDropDown[i].substring(0,allDatafromDropDown[i].indexOf('>>'));
				if(includeInArray(Data2showDropDown,val)==false)
				{
					Data2showDropDown.push(val);
					
					fldObj.innerHTML+="<li class='dropDownMenuLi' id='"+id4menu+"'><a href='javascript:showMultiLevelDropData(\""+fldObjId+"\",\""+tblName+"\",\""+colName+"\",\""+val+"\",\""+id4menu+"\")'>"+val+"...</a></li>";
				}
			}
		}	
	}
	else
	{
		var prevParentNode=document.getElementById(prevParent);
		var allSubItems=document.getElementsByClassName('dropDownMenuNxtUL');
		for(var x=0; x<allSubItems.length; x++)
		{	if(nextLevel.indexOf('>>')<=0)
			{
				var pNode=allSubItems[x].parentNode;pNode.removeChild(allSubItems[x]);
			}
			else
			{
				var subItems=prevParentNode.getElementsByClassName('dropDownMenuNxtUL');
				for(var y=0; y<subItems.length; y++)
				{var pNode=subItems[y].parentNode;pNode.removeChild(subItems[y]);}
			}
		}

		fldObj1=CreateUL(prevParentNode, 'dropDownMenuNxtUL');
		for(var i=0; i<allDatafromDropDown.length; i++)
		{
			var id4menu=fldObjId+"-"+multiLevelDD+"-"+i;
			if((allDatafromDropDown[i].indexOf(nextLevel+'>>'))>=0)
			{
				var children=allDatafromDropDown[i].substring((nextLevel.length+2),allDatafromDropDown[i].length);
				var length2show=children.indexOf('>>')>0 ? children.indexOf('>>') : children.length;
				var hasMore=children.indexOf('>>')>0 ? true : false;
				children=children.substring(0,length2show);
				{
					if(allDatafromDropDown[i].indexOf(nextLevel)>=0)
					{
						if(includeInArray(Data2showDropDown,children)==false)
						{
							Data2showDropDown.push(children);
							if(hasMore)fldObj1.innerHTML+="<li class='dropDownMenuLi' id='"+id4menu+"'><a href='javascript:showMultiLevelDropData(\""+fldObjId+"\",\""+tblName+"\",\""+colName+"\",\""+nextLevel+">>"+children+"\",\""+id4menu+"\")'>"+children+"...</a></li>";
							else fldObj1.innerHTML+="<li class='dropDownMenuLi' id='"+id4menu+"'><a href='javascript:fillMultiLevelDropData(\""+fldObjId+"\",\""+allDatafromDropDown[i]+"\")'>"+children+"</a></li>";
						}
					}
				}
			}
		}	
	}
}

function includeInArray(arr, obj) 
{
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
	return false;
}

function hideDivOnLengthZero(box)                                   			
{
	if($(box).val() == ''){	$("#smartDialog").closest('.ui-dialog').hide();}
}   
function hideSmartDialog(event)                                                    
{
$("#smartDialog").closest('.ui-dialog').hide();
}
function deleteInvDtl(dltElem,hdrPriKey,dtlPriKey)
{
   var r=confirm("Are you sure you want to delete?");
   if (r==true)
	{
	   var prtSpan=dltElem.parentNode;
	   var parntTd=prtSpan.parentNode;
	   var prntTr = parntTd.parentNode;
	   dtlPriKey=dtlPriKey.replace(/,/g,"");
	   if(dltDtlCSV=="") dltDtlCSV=dtlPriKey;
	   else dltDtlCSV = dltDtlCSV+","+dtlPriKey;
	   $(prntTr).find('td').each(function(){
		   $(this).find('input').each(function(){
			   if(this.type !="hidden" && this.type == "text"){
				   if(!(this.disabled)) this.disabled=true;
				   $(this).css({"text-decoration":"line-through"});
			   }
		   });
	   });
	   var rowIndex = dltElem.id.split("_")[2];
	   document.getElementById("0-1001:"+rowIndex+"-1101-1103").value=0;
	   document.getElementById("0-1001:"+rowIndex+"-1101-1104").value=0;
       document.getElementById("0-1001:"+rowIndex+"-1101-1127").value=0;
       document.getElementById("0-1001:"+rowIndex+"-1101-886").value=0;
       document.getElementById("0-1001:"+rowIndex+"-1101-1125").value=0;
       document.getElementById("0-1001:"+rowIndex+"-1101-2201").value="";
       document.getElementById("0-1001:"+rowIndex+"-1101-2201hdn").value="";
	   dltElem.style.display ="none";
	   var elem = document.getElementById("0-1001:"+rowIndex+"-1101-1103");
	   parent.calculateTotForInv("addEditForm",elem,"1");
	   document.getElementById("0-1001:"+rowIndex+"-1101-1102").value="";
	   dltDtlRowIndex.push(rowIndex);
	   calcInvExtTotal(rowIndex);
	}
}
function validateMonthYear(dateElem)
{
	var monthVal = document.getElementById(dateElem+"_month_value").value;
	var yrVal = document.getElementById(dateElem+"_year_value").value;
}


$(document).ready(function() {
	
	var integerOnly = [8,9,37,38,39,40,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105];
	//limit integer only
	$('body').on('keydown', '.addEditIntegerOnly', function(e) {
		 var ac = e.which;    
	    if($.inArray(ac, integerOnly) != -1) 
	        return true;
	    else
	        return false;
	});

	//limit only for characters
	// $('body').on('keydown', '.addEditAlphaOnly', function(r) {
	// 	var ac = e.which;
	// 	if((ac>=97 && ac<=122) || (ac>=37&&ac<=40) || ac==8 || ac==9 || ac==46 )
	// 		return true;
	// 	else 
	// 		return false;
	// });

	//prepare proper date format and add it to hidden div
	//applying changes on two digit month blur
	// $('body').on('blur', '.twoDigitMonth', function(e) {
	// 	var m = $(this).val();
		
	// 	if(m.length == 1)
	// 		m = '0'+''+m;

	// 	if(m > 12) {
	// 		alert('Month not found. Assumed 12');
	// 		m = 12;
	// 	}

		
	// 	$(this).val(m); //show to user what it is submitting

	// 	var	y = $(this).parent().children('.addEditYear').val();

	// 	var dt = getLastDayOfMonth()+'/'+m+'/'+y;
	// 	$(this).parent().children('.dateHiddenField').val(dt);
	// });

	//applying changes on three digit month blur
	var monthObj = {'jan':'01','feb':'02','mar':'03','apr':'04','may':'05','jun':'06','jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12'};
	$('body').on('blur', '.addEditMonth', function() {
		var m = $(this).val();
		if(isNaN(m)) { //is string
			m  = m.toLowerCase();
			if(m in monthObj) {
				m = monthObj[m];
			} else {
				alert('Month not found. Assumed Jan! Ex:- Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec');
				$(this).val('Jan');
				m = '01';
			}
		} else { //is number

			if(m.length == 1)
				m = '0'+''+m;

			if(m > 12) {
				alert('Month not found. Assumed 12');
				m = 12;
			}
			$(this).val(m);
		}


		var	y = $(this).parent().children('.addEditYear').val();
		var dt = getLastDayOfMonth()+'/'+m+'/'+y+' '+ '00:00:00';
		$(this).parent().children('.dateHiddenField').val(dt);

	});

	// $('body').on('blur', '.threeDigitMonth', function(e) {
	// 	var m = $(this).val().toLowerCase();
	// 	var mLen = m.length;
	// 	if(m.length !== 3) {
	// 		alert('Atleast three characters expected. Assumed jan. Example jan');
	// 		$(this).val('Jan');
	// 		m = '01';
	// 	} else {
	// 		if(m in monthObj) {
	// 			m = monthObj[m];
	// 		} else {
	// 			alert("Month not found. Ex:- Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec");
	// 			$(this).val('Jan');
	// 			m = '01';
	// 		}
	// 	}

	// 	var	y = $(this).parent().children('.addEditYear').val();

	// 	var dt = getLastDayOfMonth()+'/'+m+'/'+y;
	// 	$(this).parent().children('.dateHiddenField').val(dt);
	// });


	//applying changes on year blur
	$('body').on('blur', '.addEditYear', function(e) {
		var y = $(this).val();
		var yLen = y.length;
		if(yLen == 1) {
			y = '200'+''+y;
		} else if(yLen == 2) {
			y = '20'+''+y;
		} else if(yLen == 3) {
			alert('Invalid year format. Assumed current year 2013.');			
			y = 2013;
		} 
		$(this).val(y); //show to user what it is submitting
 
		var mObj = $(this).parent().children('.addEditMonth');
		var m = mObj.val();
		if(isNaN(m)) { //is string
			m  = m.toLowerCase();
			if(m in monthObj) {
				m = monthObj[m];
			} 
		} 
		var dt = getLastDayOfMonth()+'/'+m+'/'+y+' '+ '00:00:00';
		$(this).parent().children('.dateHiddenField').val(dt);
	});

	//set teritories
	$('body').on('click', '.chooseDefaultTeritory', function() {
		var v = $(this).val();

		if(v == 'fromTxtFld') { //take from login name			
			var ln = $('#0-201-203').val();
			//add ln to hidden fild and txt fld
			$('.defaultTeritoryFldValHdn, #defaultTeritoryName').val(ln);
			if(ln !== '') 
				$('.defaultTeritoryFldValHdn').parent().css('border', 'solid 1px white');

			//hide other block
			$('#defaultTeritories').css('display', 'none');
		} else {
			$('#defaultTeritories').css('display', 'block');
			var dterr = $('.defaultTeritoryFldValHdn');

			if(!$(this).hasClass('havingTerr')) {
				showDefaultTerritories();
				//make default territory select to none initial
				$('#defaultSelTerr').val('');
				$(this).addClass('havingTerr');
				dterr.val('');
			} else {
				dterr.val($('#defaultSelTerr').val());
			}

			
			if(dterr.val() !== '')
				$('.defaultTeritoryFldValHdn').parent().css('border', 'solid 1px white');
		}
	});

	//on change of default terr change the hidden default inp fld
	$('body').on('change', '#defaultSelTerr', function() {
		var v = $(this).val();
		$('.defaultTeritoryFldValHdn').val(v);
	});

	//on blur of login name, show text in default teritory place
	$('body').on('blur', '#0-201-203', function() {
		var dterr = $('#showTeritoryName');
		var v = $(this).val();
		if(dterr.length > 0) {
			dterr.text('| ' + v);
		}
		var cbx = $('.chooseDefaultTeritory');
		if(cbx.prop('checked') === true && cbx.val() === 'fromTxtFld') {
			$('#0-201-357').val(v);
		}
	});

	//end of document ready
});

//add edit get last day of month
function getLastDayOfMonth() {
	//get last day of month
	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	var lastDay = new Date(y, m + 1, 0).toString();
	lastDay = lastDay.split(' ');
	lastDay = lastDay[2];
	return lastDay;
}

//for edit, format date
function getFormatedDateForAddEdit(monthNum, yearNum) {
	
	var dt = getLastDayOfMonth() + '/'+ monthNum+'/'+yearNum+' '+ '00:00:00';

	return dt;
}

//returns two digit month
function getTwoDigitMonth(m) {
	var mLen = m.length;
	if(mLen == 1) {
		m = '0'+''+m;
	} else if(mLen == 2) {
		if(m > 12) {
			m = 12;
		}
	}
	return m;
}

//returns proper year 
function getYearForAddEdit(y) {
	var yLen = y.length;
	if(yLen == 1) {
		y = '200'+''+y;
	} else if(yLen == 2) {
		y = '20'+''+y;
	} else if(yLen == 3) {		
		y = 2013;
	} 
	return y;
}

//get valid three digit month
function getThreeDigitMonth(m) {
	var m = m.toLowerCase();
	var mLen = m.length;
	if(m.length !== 3) {		
		m = '01';
	} else {
		if(m in monthObj) {
			m = monthObj[m];
		} else {			
			m = '01';
		}
	}

	return m;
}

//get valid three digit month
function validateThreeDigitMonth(m) {
	var m = m.toLowerCase();
	var mLen = m.length;
	if(m.length !== 3) {		
		m = 'Jan';
	} else {
		if(!(m in monthObj)) {
			m = 'Jan';
		} 
	}
	
	return m;
}


//function creates default territories user input
function createDefaultTeritory(target, className, id) {
	var c = '<div>'; //this is main container for below elements
	//create radio btns with container
	c += '<table style="text-align:right;font-weight:normal;"><tr><td><input type="radio" value="fromTxtFld" name="defaultTeritory" class="chooseDefaultTeritory inputFieldClass" /></td><td style="text-align:left;">Create my teritory </td><td id="showTeritoryName" style="font-size: 12px; color: grey;" ></td></tr><tr><td><input type="radio" value="frmCmbo" name="defaultTeritory" class="chooseDefaultTeritory inputFieldClass" /></td><td style="text-align:left;">Use existing teritory </td><td></td></tr></table>';
	
	//create form with one text field
	 c += '<p> <div id="defaultTeritories" style="display:none;"></div></p></div>';

	 c += '<input type="hidden" id ="'+id+'" name="'+id+'" class="defaultTeritoryFldValHdn" />';
	
	//finally add it to td
	target.innerHTML = c; 
}

//this shows default teritories
function showDefaultTerritories() {
	
	var fldVal= "", elemId='defaultSelTerr';
	fldObj=CreateSelectBox(document.getElementById('defaultTeritories'), "inputFieldClassDrop", elemId, fldVal);
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
						// makeComboSearchable(dispVal,false,'','dropDown-terr');										
						// $(".inputFieldClassDrop").combobox();						
						// if(nullableFld=="0")mandatoryFldElem.push('combo_'+elemId);

}

