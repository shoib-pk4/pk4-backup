var gblPckEntity;
var gblPckName;
var url4PckLst='';
var pckPageParams;
var myElementId;
var myElementVal;
var pckListForm;
var myElement;
var pckLstURLForURL='';
var searchParam='';
var gblPicklistCont;

//function populatePicklist(entity,name,elemId,strVal,txtbxval,elem,pckLstURL,pckLstTitle,udmName,paramName,readNodeId)
function populatePicklist(cont, entity,name,elemId,strVal,txtbxval,elem,pckLstURL,pckLstTitle,udmName,paramName,readNodeId)
{ 		
	
	gblPicklistCont = cont;
	document.getElementById(gblPicklistCont).innerHTML = "";
	//Open the common popup div if its not open
	if(url4PckLst=='')
	{
		$('#'+gblPicklistCont).dialog({
			autoOpen:true,
			modal: false,
			title:'Picklist - ',
			position: 'center',
			close: function() {url4PckLst='';}
		});
	}

	var pickListParams="";
	if(paramName&&readNodeId)
	{
		var parameter=paramName.split('~)');
		var readNodes=readNodeId.split('~)');
		for(var x=0; x<parameter.length;x++)
		{
			if(document.getElementById(readNodes[x]))
			switch(parameter[x])
			{
			  case "cId": 
						pickListParams+="&cId="+document.getElementById(readNodes[x]).value;
						break;
			  case "aId": 
						pickListParams+="&aId="+document.getElementById(readNodes[x]).value;
						break;
			  case "cuId": 
						pickListParams+="&cuId="+document.getElementById(readNodes[x]).value;
						break; 
			  case "pcId": 
						pickListParams+="&pcId="+document.getElementById(readNodes[x]).value;
						break;
			  case "cusObjCid": 
						pickListParams+="&cusObjCid="+document.getElementById(readNodes[x]).value;
						break;
			  case "p1": 
						pickListParams+="&p1="+document.getElementById(readNodes[x]).value;
						break;
			  case "p2": 
						pickListParams+="&p2="+document.getElementById(readNodes[x]).value;
						break;
			  case "p3": 
						pickListParams+="&p3="+document.getElementById(readNodes[x]).value;
						break;
			}
		}
	}

	if(strVal&&url4PckLst!='')
	{
		pckLstURL=url4PckLst
	}
	else
	{
		if(parseInt(name)==name)
			//var pckLstURL=zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.htm?entt_tbl_col="+entity+"&pckListId="+name+pickListParams;
			var pckLstURL="/atCRM/custom/JSON/smartSuggest/genericPicklist.htm?entt_tbl_col="+entity+"&pckListId="+name+pickListParams;
		else 
			//var pckLstURL=zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.htm?entt_tbl_col="+entity+"&pckListName="+name+pickListParams;
			var pckLstURL="/atCRM/custom/JSON/smartSuggest/genericPicklist.htm?entt_tbl_col="+entity+"&pckListName="+name+pickListParams;
	}

	myElement=document.getElementById(elemId);
	myElementId=elemId;myElementVal=myElement.value;gblPckEntity=entity;gblPckName=name;
	if(!strVal&&myElementVal!="2 chars or **")strVal=myElementVal;
	if(document.getElementById('pckLstHref'))document.getElementById('pckLstHref').style.visibility='hidden';
	var pckTbl=writeTable(pckLstURL);

	//Get URL to hit based on the search criterion.	
	if(strVal)
	{
		searchParam=strVal;
		if(strVal=='*')
		{
			document.getElementById('pckSearchBox').value='';
			pckLstURL=deleteParameter(pckLstURL,'str',true);
		}
		else
		{
			document.getElementById('pckLstHref').style.visibility='visible';
			document.getElementById('pckSearchBox').value=strVal;
			pckLstURL=changeParameterValue(pckLstURL,'str',document.getElementById('pckSearchBox').value);
		}
	}

	var url=pckLstURL;
	if(pckPageParams)url=url+pckPageParams;		
	if(url4PckLst!=url)                
	{		
		$.ajax({
		type: "GET",
		url: encodeURI(url),
		success: function (data)
		{
			data=ReplaceAll(data,"\t","");
			data=ReplaceAll(data,"\n"," ");
			data=ReplaceAll(data,"\r","");
			data=ReplaceAll(data,"\xa0"," ");
			
			pckListVal = JSON.parse(data,function (key,value)
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
			document.getElementById('pckLstTblDiv').style.display='block'; 			
			document.getElementById('loadingPckDiv').style.display='none';
			
			//Get json data from the picklist url and parse it.
			var rows = pckTbl.getElementsByTagName('tr');
			var columnHeadArray=pckListVal['PickListItems'].columnHeaders.split('~)');
			if(columnHeadArray.length>4)var width4Popup=(columnHeadArray.length*100); else var width4Popup=420;
			var widthForTd=width4Popup/columnHeadArray.length;
			//alert(width4Popup);
			$("#"+gblPicklistCont).dialog( "option", "width", width4Popup);

			var dataArray=pckListVal['PickListItems'].listData;			
			var currntPage=pckListVal['PickListItems'].currntPage;
			var totalPages=pckListVal['PickListItems'].totalPages;
			var pickListCount=pckListVal['PickListItems'].pickListCount;
			var pckListTitle='Picklist - '+pckListVal['PickListItems'].pickListName+'<span style="font-weight:normal"> ('+pickListCount+' Items)</span>';
			var PckName=pckListVal['PickListItems'].pickListName;
			if(pckLstTitle && pckLstTitle!="")
				pckListTitle='Picklist - '+pckLstTitle+'<span style="font-weight:normal"> ('+pickListCount+' Items)</span>';
				//Write appropriate Title to the picklist.
			document.getElementById('ui-dialog-title-'+gblPicklistCont).innerHTML=pckListTitle;
			//document.getElementById('commonPickListDiv').innerHTML=pckListTitle;
			
			createPckPagination(currntPage,totalPages,paramName,readNodeId);
			//Write the header information
			var celHeader = rows[0].getElementsByTagName('td');
			for(var colmn=0; colmn<19; colmn++)
			{
				var pckColmn=celHeader[colmn];
				
				if(columnHeadArray[colmn])
				{           
					pckColmn.innerHTML=columnHeadArray[colmn];
					pckColmn.className='pckListHeading';
					pckColmn.style.display='block';
					pckColmn.style.display='';
					pckColmn.style.width=widthForTd='px';
				}
				else
				{
					pckColmn.style.display='none';
				}
			}

			for (var row=1; row<rows.length;row++) 
			{          
				//Write appropriate data in each cell
				if(row<=dataArray.length)
				{			
					var cels = rows[row].getElementsByTagName('td');

					for(var colmn=0; colmn<19; colmn++)
					{
						var pckColmn=cels[colmn];
						if(columnHeadArray[colmn])
						{					
							var pclColmnData=dataArray[row-1].columnData.split('~)');
							if(colmn==0)
							pckColmn.innerHTML='<a onclick="selectPcklstItm('+pclColmnData[0]+',\''+pclColmnData[1].replace("'","\\'")+'\',\''+PckName+'\');" style="text-decoration:underline;cursor:pointer">'+pclColmnData[1]+'</a>';
							else
							pckColmn.innerHTML=pclColmnData[colmn+1];
							pckColmn.style.width=(100/columnHeadArray.length)+'%';
							pckColmn.style.display='block';									
							pckColmn.style.display='';
							pckColmn.style.wordWrap='break-word';
							pckColmn.colSpan='1';
							//pckColmn.setAttribute('style','text-align:left');
							pckColmn.style.textAlign="left";
						}
						else
						{
							pckColmn.style.display='none';							
						}
					}										
					rows[row].style.display='block';									
					rows[row].style.display='';
				}
				else
				{
					//Hide the unwanted rows and show 'no data' message. 
					if(dataArray.length==0)
					{
						var cels = rows[1].getElementsByTagName('td');						
						cels[0].innerHTML='No data matching your search.';
						cels[0].colSpan=columnHeadArray.length;
						//cels[0].setAttribute('style','text-align:center');
						cels[0].style.textAlign="center";

						for(var colmn=1; colmn<19; colmn++)
						{
							cels[colmn].style.display='none';									
						}	
						rows[row].style.display='none';									
						rows[1].style.display='block';									
						rows[1].style.display='';
						if(document.getElementById('pckLstPagDiv'))
						document.getElementById('pckLstPagDiv').style.display='none';
					}
					else
					{
						rows[row].style.display='none';
					}
				}
			}
		}
		});	
	}
	url4PckLst=url;
	pckLstURLForURL=pckLstURL;
}


function writeTable(pckLstURL)
{
	var srchPckLstVal=getParameterValue(pckLstURL,'str');
	if(!srchPckLstVal)srchPckLstVal="";

	//Write the table through DOM if table does not exist.
	if(!document.getElementById('pckLstTbl'))
	{
		var commonPickListDiv=document.getElementById(gblPicklistCont);
		
		//Div that contains loading image
		var loadingPckDiv=CreateDIV(commonPickListDiv, '', 'loadingPckDiv', '<img src="/atCRM/images/loading3.gif"/>');
		//loadingPckDiv.setAttribute("style", "display:block;text-align:center;position:absolute;width:98%;top:100px;");		
		loadingPckDiv.style.display="block";
		loadingPckDiv.style.textAlign="center";
		loadingPckDiv.style.position="absolute";
		loadingPckDiv.style.width="98%";
		loadingPckDiv.style.top="100px";

		var pckLstTblDiv=CreateDIV(commonPickListDiv,'','pckLstTblDiv');
		pckLstTblDiv.style.display="none";

		var searchPckDiv=CreateDIV(pckLstTblDiv);
		searchPckDiv.style.textAlign="right";
		searchPckDiv.style.margin="10px 10px 3px 0px";

		//Text called 'All' that shows all data.
		var pckHref=CreateA(searchPckDiv, 'ItemLabel', 'pckLstHref', '', '', 'All', 'Show all');
		//pckHref.setAttribute("style", "padding:0px 8px 0px 5px;text-decoration:underline;cursor:pointer;visibility:hidden");
		pckHref.style.padding="0px 8px 0px 5px";
		pckHref.style.textDecoration="underline";
		pckHref.style.cursor="pointer";
		pckHref.style.visibility="hidden";
		AddClickEventListener(pckHref,function (){populatePicklist(gblPicklistCont,gblPckEntity,gblPckName,myElementId,'*');});

		//Create a textbox to search in the picklist.
		var pckSearch=CreateTEXTBOX(searchPckDiv, 'inputsearch', 'pckSearchBox', srchPckLstVal,20);
		AddOnKeyPressEventListener(pckSearch,function (event){reWritePckList(pckSearch,event)});
		
		//Create table with 10 rows and 19 columns.
		var pckTbl=CreateTable(pckLstTblDiv,'pckListTable','pckLstTbl','','1','3', 'center');								
		pckTbl.style.width="95%";
	
		var pckTblBdy=CreateBody(pckTbl,"","");
		for(var i=0;i<=10;i++)
		{
			var pckTblTr=CreateTR(pckTblBdy,"","","");
			for(var j=0;j<19;j++)
			{
				var pckTblTd = CreateTD(pckTblTr,'ItemLabel');
				pckTblTd.style.width="100px";
			}
		}
	}
	return document.getElementById('pckLstTbl');
}

function reWritePckList(elem,event,pckLstURL)
{
	//Rewrite picklist on enter key.
	if(isIE)var e = event.keyCode;
	else var e =event.which;
	if (e==13)
	{
		pckPageParams="";
		var strData=elem.value;
		if(!isIE)strData=strData.trim();
		elem.value=strData;
		//Rewrite picklist if there is any search string.
		if(strData!='')populatePicklist(gblPicklistCont,gblPckEntity,gblPckName,myElementId,strData);
	}
}

function selectPcklstItm(Id,val,PckName)
{
	//This function gets both selected primary key id and the display text that is filled in appropriate elements.
	var hiddnFld=myElementId.split("txt")[0];
	myElementhidden=document.getElementById(hiddnFld);
	myElementhidden.value=Id;
	myElement.value=val;
	myElement.focus();
	var myElementAnc=hiddnFld+"Anc"
	if(document.getElementById(myElementAnc))document.getElementById(myElementAnc).innerHTML="Selected "+PckName+"</br><span class='jsonHeading' style='display: inline-block;margin-left: 50px;padding-top: 0;text-decoration: none !important;'>"+val+"</span>";
	try{
		if(myElement.className=="inputFieldClass"||myElement.className=="inputGrayTextClass")
		changeSmartSuggestTxt(myElement)
	}catch(e){}
	$("#"+gblPicklistCont).dialog("close");
	/*If picklist called from invoice wizard for customer name,done by Dony 29 Oct 2012*/
	if(document.getElementById('pageType'))
	if(document.getElementById('pageType').value &&document.getElementById('pageType').value =='invoiceWizard')
	{
		if(myElementId == "0-1-4801") 
		 {
			document.getElementById("0-1-4801hdn").value=Id;
			blockMappedObjectFields4Wizard(myElementId,myElementId+"hdn");
		 }
	}
	/*Invoice wizard code ends here*/
}

function createPckPagination(currntPage,totalPages,paramName,readNodeId)
{	
	
	var pckLstTblDiv=document.getElementById('pckLstTblDiv');

	if(document.getElementById('pckLstPagDiv'))
		pckLstPagDiv=document.getElementById('pckLstPagDiv')
	else
		var pckLstPagDiv=CreateDIV(pckLstTblDiv,'','pckLstPagDiv');

	//pckLstPagDiv.setAttribute("style", "text-align:right;margin:10px 10px 5px 0px;width:98%");
	pckLstPagDiv.style.textAlign="right";
	pckLstPagDiv.style.margin="10px 10px 5px 0px";
	pckLstPagDiv.style.width="98%";

	var nxtPage=parseInt(currntPage)+1;
	var prePage=parseInt(currntPage)-1;

	var pckLstPagDivContent="";
	if(totalPages!=1){
		if(currntPage==totalPages){
		
			pckLstPagDivContent = "<img title='First Page'src='/atCRM/images/first.gif' onclick=\"pckLstPagination('1','"+totalPages+"','"+paramName+"','"+readNodeId+"');\" style='cursor:pointer'><img title='Previous Page' src='/atCRM/images/Pprev.gif' style='cursor:pointer' onclick=\"pckLstPagination('"+prePage+"','"+totalPages+"','"+paramName+"','"+readNodeId+"');\"><input type='text' class='paginationBox' id='currntPckLstPage' value='"+currntPage+"' title='Current page' onkeypress='validChars(event,\"1234567890\")' onkeyup=\"if(event.keyCode==13)pckLstPagination('this.value','"+totalPages+"','"+paramName+"','"+readNodeId+"')\"/><span style='vertical-align:top;font-size:11px'>  of "+totalPages+"</span>";
		}else if(currntPage==1){
			
			pckLstPagDivContent = "<input type='text' class='paginationBox' id='currntPckLstPage' value='"+currntPage+"' title='Current page' onkeypress='validChars(event,\"1234567890\")' onkeyup=\"if(event.keyCode==13)pckLstPagination('this.value','"+totalPages+"','"+paramName+"','"+readNodeId+"')\"/><span style='vertical-align:top;font-size:11px'>  of "+totalPages+"</span><img title='Next Page' src='/atCRM/images/Nnext.gif' onclick=\"pckLstPagination('"+nxtPage+"','"+totalPages+"','"+paramName+"','"+readNodeId+"');\" style='cursor:pointer'><img title='Last Page' src='/atCRM/images/last.gif' onclick=\"pckLstPagination('"+totalPages+"','"+totalPages+"','"+paramName+"','"+readNodeId+"')\" style='cursor:pointer'>";
		}else{
		
			pckLstPagDivContent = "<img title='First Page'src='/atCRM/images/first.gif' onclick=\"pckLstPagination('1','"+totalPages+"','"+paramName+"','"+readNodeId+"');\" style='cursor:pointer'><img title='Previous Page' src='/atCRM/images/Pprev.gif' style='cursor:pointer' onclick=\"pckLstPagination('"+prePage+"','"+totalPages+"','"+paramName+"','"+readNodeId+"');\"><input type='text' class='paginationBox' id='currntPckLstPage' value='"+currntPage+"' title='Current page' onkeypress='validChars(event,\"1234567890\")' onkeyup=\"if(event.keyCode==13)pckLstPagination('this.value','"+totalPages+"','"+paramName+"','"+readNodeId+"')\"/><span style='vertical-align:top;font-size:11px'>  of "+totalPages+"</span><img title='Next Page' src='/atCRM/images/Nnext.gif' onclick=\"pckLstPagination('"+nxtPage+"','"+totalPages+"','"+paramName+"','"+readNodeId+"');\" style='cursor:pointer'><img title='Last Page' src='/atCRM/images/last.gif' onclick=\"pckLstPagination('"+totalPages+"','"+totalPages+"','"+paramName+"','"+readNodeId+"')\" style='cursor:pointer'>";
		}
	}
	pckLstPagDiv.innerHTML=pckLstPagDivContent;
}

function pckLstPagination(pgNo,max,paramName,readNodeId)
{ 
	pgNo=parseInt(pgNo);
	max=parseInt(max);
	if(pgNo<=max&&pgNo>0)
	{
		pckPageParams='&page__number__101='+pgNo;
		populatePicklist(gblPicklistCont,gblPckEntity,gblPckName,myElementId,searchParam,'','','','','',paramName,readNodeId);
	}
}