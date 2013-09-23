var multiLvlPckParams;
var popupNamesArr=new Array();

function populateMultiLvlPicklist(entity,name,elemId,formName,str,pageParams,title)
{  
	if(pageParams)
	{var url=zcServletPrefix+"/custom/JSON/smartSuggest/multiLevelPickList.html?pckListName="+name+pageParams;multiLvlPckParams=pageParams;}
	else if(str)
	{var url=zcServletPrefix+"/custom/JSON/smartSuggest/multiLevelPickList.html?pckListName="+name+'&str='+str;multiLvlPckParams=str;}
	else
	{var url=zcServletPrefix+"/custom/JSON/smartSuggest/multiLevelPickList.html?pckListName="+name;multiLvlPckParams="";}

	if(!title){selectMltPcklstItm('','',elemId,formName);}

	var mltLvlPopUp=name+'multiLvlPck';
	if(mltLvlPopUp)popupNamesArr.push(mltLvlPopUp);
	
	if(!document.getElementById(name+'multiLvlPck'))
	{
		var _body = document.getElementsByTagName('body') [0];
		var multiLvlPckDiv=CreateDIV(_body, 'popup', name+'multiLvlPck', '');

		var loadingPckDiv=CreateDIV(multiLvlPckDiv, '', name+'loadingPckDiv', '<img src="/atCRM/images/loading3.gif"/>');
		loadingPckDiv.setAttribute("style", "display:block;text-align:center;position:absolute;width:98%;top:100px;");		

		var pckLstTblDiv=CreateDIV(multiLvlPckDiv,'',name+'pckLstTblDiv');
		pckLstTblDiv.setAttribute("style", "display:none;margin:8px");

		var searchPckDiv=CreateDIV(pckLstTblDiv);
		searchPckDiv.setAttribute("style", "text-align:right;margin:10px 10px 3px 0px;");

		//Text called 'All' that shows all data.
		var pckHref=CreateA(searchPckDiv, 'ItemLabel', name+'pckLstHref', '', '', 'All', 'Show all');
		pckHref.setAttribute("style", "padding:0px 8px 0px 5px;text-decoration:underline;cursor:pointer;visibility:hidden");		
		AddClickEventListener(pckHref,function (){populateMultiLvlPicklist(entity,name,elemId,formName,'*');});

		//Create a textbox to search in the picklist.
		var pckSearch=CreateTEXTBOX(searchPckDiv, 'inputsearch', name+'pckSearchBox', '',20);
		AddOnKeyPressEventListener(pckSearch,function (event){var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)populateMultiLvlPicklist(entity,name,elemId,formName,pckSearch.value);});
		

		//Create table with 10 rows and 4 columns.
		var pckTbl=CreateTable(pckLstTblDiv,'pckListTable',name+'pckLstTbl','','1','3', 'center');								
		pckTbl.style.width="400px";

		var pckTblBdy=CreateBody(pckTbl,"","");
		for(var i=0;i<=10;i++)
		{
			var pckTblTr=CreateTR(pckTblBdy,"","","");
			for(var j=0;j<4;j++)
			{
				var pckTblTd = CreateTD(pckTblTr,'ItemLabel');
				pckTblTd.style.width="25%";
			}
		}	
		if(title)var titleTxt='Picklist - '+title;
		else var titleTxt='Picklist';
		$('#'+mltLvlPopUp).dialog({
			autoOpen:true,
			modal: true,
			title:titleTxt,
			width:'420px',
			close: function() {deletePckLst(name+'multiLvlPck')}
		});
	}
	else
	{
		if(title)var titleTxt='Picklist - '+title;
		else var titleTxt='Picklist';

		var loadingPckDiv=document.getElementById(name+'loadingPckDiv');
		var pckLstTblDiv=document.getElementById(name+'pckLstTblDiv');
		var pckTbl=document.getElementById(name+'pckLstTbl');
		if(!pageParams)
		$('#'+mltLvlPopUp).dialog({
			autoOpen:true,
			modal: true,
			title:titleTxt,
			width:'420px',
			close: function() {deletePckLst(name+'multiLvlPck')}
		});
	}

	if(str)document.getElementById(name+'pckLstHref').style.visibility="visible";
	else document.getElementById(name+'pckLstHref').style.visibility="hidden";

	$.getJSON(url,
		function(data)
		{		
			loadingPckDiv.style.display='none';
			pckLstTblDiv.style.display='block';

			pckListVal = eval(data);			
			var rows = pckTbl.getElementsByTagName('tr');
			var columnHeadArray=pckListVal['PickListItems'].columnHeaders.split('~)');
			var dataArray=pckListVal['PickListItems'].listData;			
			var currntPage=pckListVal['PickListItems'].currntPage;
			var totalPages=pckListVal['PickListItems'].totalPages;
			var pickListCount=pckListVal['PickListItems'].pickListCount;
			var pckListTitle='Picklist - '+pckListVal['PickListItems'].pickListName+'<span style="font-weight:normal"> ('+pickListCount+' Items)</span>';

			if(!title)document.getElementById('ui-dialog-title-'+mltLvlPopUp).innerHTML=pckListTitle;
			
			createMltPckPagination(pckLstTblDiv,currntPage,totalPages,entity,name,elemId,formName);
			
			//Write the header information
			var celHeader = rows[0].getElementsByTagName('td');
			for(var colmn=0; colmn<4; colmn++)
			{
				var pckColmn=celHeader[colmn];
				
				if(columnHeadArray[colmn])
				{           
					pckColmn.innerHTML=columnHeadArray[colmn];
					pckColmn.className='pckListHeading';
					pckColmn.style.display='block';
					pckColmn.style.display='';
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

					for(var colmn=0; colmn<4; colmn++)
					{
						var pckColmn=cels[colmn];
						if(columnHeadArray[colmn])
						{					
							var pclColmnData=dataArray[row-1].columnData.split('~)');
							if(colmn==0)
							{
								if(pclColmnData[5])
									pckColmn.innerHTML='<a onclick="populateMultiLvlPicklist(\''+pclColmnData[7]+'\',\''+pclColmnData[6]+'\',\''+elemId+'\',\''+formName+'\',\'\',\'\',\''+pclColmnData[1]+'\');selectMltPcklstItm('+pclColmnData[0]+',\''+pclColmnData[1]+'\',\''+elemId+'\',\''+formName+'\',\'multi\',\''+mltLvlPopUp+'\');" style="text-decoration:underline;cursor:pointer">'+pclColmnData[1]+'</a>';
								else
									pckColmn.innerHTML='<a onclick="selectMltPcklstItm('+pclColmnData[0]+',\''+pclColmnData[1]+'\',\''+elemId+'\',\''+formName+'\',\'\',\''+mltLvlPopUp+'\');" style="text-decoration:underline;cursor:pointer">'+pclColmnData[1]+'</a>';
							}
							else
								pckColmn.innerHTML=pclColmnData[colmn+1];
								pckColmn.style.width=(100/columnHeadArray.length)+'%';
								pckColmn.style.display='block';									
								pckColmn.style.display='';
								pckColmn.colSpan='1';
								pckColmn.setAttribute('style','text-align:left');
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
						cels[0].setAttribute('style','text-align:center');

						for(var colmn=1; colmn<4; colmn++)
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
	);
}

function createMltPckPagination(pckLstTblDiv,currntPage,totalPages,entity,name,elemId,formName)
{
	if(!document.getElementById(name+'pckLstPagDiv'))
	var pckLstPagDiv=CreateDIV(pckLstTblDiv,'',name+'pckLstPagDiv');
	else
	var pckLstPagDiv=document.getElementById(name+'pckLstPagDiv')

		pckLstPagDiv.setAttribute("style", "text-align:right;margin:10px 10px 5px 0px;width:98%");

		var nxtPage=parseInt(currntPage)+1;
		var prePage=parseInt(currntPage)-1;

		var pckLstPagDivContent="";
		if(totalPages!=1){
			if(currntPage==totalPages){
				pckLstPagDivContent = "<img title='First Page'src='/atCRM/images/first.gif' onclick='mltPckLstPagination(1,"+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\");' style='cursor:pointer'><img title='Previous Page' src='/atCRM/images/Pprev.gif' style='cursor:pointer' onclick='mltPckLstPagination("+prePage+","+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\");'><input type='text' class='paginationBox' id='currntPckLstPage' value='"+currntPage+"' title='Current page' onkeypress='validChars(event,\"1234567890\")' onkeyup='if(event.keyCode==13)mltPckLstPagination(this.value,"+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\")'/><span style='vertical-align:top;font-size:11px'>  of "+totalPages+"</span>";
			}else if(currntPage==1){
				pckLstPagDivContent = "<input type='text' class='paginationBox' id='currntPckLstPage' value='"+currntPage+"' title='Current page' onkeypress='validChars(event,\"1234567890\")' onkeyup='if(event.keyCode==13)mltPckLstPagination(this.value,"+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\")'/><span style='vertical-align:top;font-size:11px'>  of "+totalPages+"</span><img title='Next Page' src='/atCRM/images/Nnext.gif' onclick='mltPckLstPagination("+nxtPage+","+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\");' style='cursor:pointer'><img title='Last Page' src='/atCRM/images/last.gif' onclick=mltPckLstPagination("+totalPages+","+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\") style='cursor:pointer'>";
			}else{
				pckLstPagDivContent = "<img title='First Page'src='/atCRM/images/first.gif' onclick='mltPckLstPagination(1,"+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\");' style='cursor:pointer'><img title='Previous Page' src='/atCRM/images/Pprev.gif' style='cursor:pointer' onclick='mltPckLstPagination("+prePage+","+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\");'><input type='text' class='paginationBox' id='currntPckLstPage' value='"+currntPage+"' title='Current page' onkeypress='validChars(event,\"1234567890\")' onkeyup='if(event.keyCode==13)mltPckLstPagination(this.value,\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\")'/><span style='vertical-align:top;font-size:11px'>  of "+totalPages+"</span><img title='Next Page' src='/atCRM/images/Nnext.gif' onclick='mltPckLstPagination("+nxtPage+","+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\");' style='cursor:pointer'><img title='Last Page' src='/atCRM/images/last.gif' onclick=mltPckLstPagination("+totalPages+","+totalPages+",\""+entity+"\",\""+name+"\",\""+elemId+"\",\""+formName+"\") style='cursor:pointer'>";
			}
		}
	pckLstPagDiv.innerHTML=pckLstPagDivContent;
}

function mltPckLstPagination(pgNo,max,entity,name,elemId,formName)
{
	if(pgNo<=max&&pgNo>0)
	{
		var pageParams='&page__number__101='+pgNo;
		multiLvlPckParams=pageParams;
		populateMultiLvlPicklist(entity,name,elemId,formName,'',pageParams)
	}
}

function selectMltPcklstItm(id,val,elemId,formName,multi,mltLvlPopUp)
{
	//This function gets both selected primary key id and the display text that is filled in appropriate elements.
	var mltPckListForm=document.getElementById(formName);
	var elem=document.getElementById(elemId+'anc');
	var formFlds=mltPckListForm.elements;
	var hddnElem="";
	for(i=0;i<formFlds.length;i++)
	{
		if(formFlds[i].id==elemId)hddnElem=formFlds[i];
	}
	if(id)
	{
		if(!multi&&elem.innerHTML!='Select')hddnElem.value+=":"+id;
		else hddnElem.value=id;

		if(!multi&&elem.innerHTML!='Select')elem.innerHTML+=":"+val.slice(0,12);
		else elem.innerHTML=val.slice(0,12);
		
		if(!multi&&elem.innerHTML!='Select')elem.title+=":"+val;
		else elem.title=val;
	}
	else if(multiLvlPckParams=="")
	{
		hddnElem.value="";
		elem.innerHTML='Select';
		elem.title='Select';
	}

	if(!multi)
		{

		for(var z=0;z<popupNamesArr.length;z++)
			{var pop2Close=popupNamesArr[z];
			$('#'+pop2Close).dialog("close"); }
		}
}

function deletePckLst(name)
{
	$('#'+name).remove();	
}
