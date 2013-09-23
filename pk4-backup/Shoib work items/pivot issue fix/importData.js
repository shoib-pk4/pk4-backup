var dataJson;
var dataJSONTest;
var entityName;
var entityDescName;
var titleDoc;
var listDataJSON;
var countNum=0;
var countCheck=0;
var countDate=0;
var countDateTime=0;
var brwsrValue;
var errDataTds=null;
var titleIndex=0;
var recNum=0;
var dispNameInd;
var firstLoad=0;
var firstNameInd;
var loginName;
var reloadPageInd=0;
var DrpDwnIndexArray=new Array();      //Array to store selected index of enttCols dropDowns of DataTable
var enttDrpDwnIndexArray=new Array();  //Array to store selected index of Entity dropDowns of DataTable
var checkLstArray="";
var checkedValues;
var isFileUpload=0;
var uploadFileData;
var UploadIndex=0;
var splitTitleIndex=0;
var relEntities;                     //List of entities
var relEntitiesData;                 //variable to store ralated Entities data
var relatedEnttIdArray=new Array();  //Array to store related entities id
var mainEnttCondn="";                //Variable to store main entities unique value condition
var relEnttCondnArray=new Array();   //Array to store relateded entities unique value conditions
var parseFailIndex=0;                //Value 1 will be assigned to this variable if parsing get fails
var mapJSON = "";
//Function for listing entity names
function populateEntityList(enttName)
{
	var entityList=document.getElementById('entity_select');
	//var entityId=getQueryParameter("entt_id");
	if(!enttName)var enttName=getQueryParameter('enttName');
	entityList.innerHTML="";
			var UrlForList="/atCRM/custom/entityView/listEntitiesFrUpload.htm";
				  $.ajax({
						type: "GET",		
						url:UrlForList,
						cache:false,
						async:false,
						dataType: "json",			
						success: function (doc)
						{
							var ActvtObj= eval(doc);
							listDataJSON=eval(doc);
							var L_EntityList = ActvtObj['EntityList']; 
							var L_listData = L_EntityList['listData'];
							loginName= L_EntityList['loginName'];
								for(i=0; i<parseInt(L_listData.length); i++)
								 {		
									var L_rv_obj = L_listData[i];
									var L_entityId = L_rv_obj['entityId'];
									var L_entityName = L_rv_obj['entityName'];
									var L_description = L_rv_obj['description'];
									var L_descName = L_rv_obj['descName'];
									var L_RelEntities=L_rv_obj['relEnttsCSV'];
									//Store related entities csv in a global variable
									if((i==0)&&L_RelEntities) {
										var splitRelEnt=L_RelEntities.split(";");
										var relatedEnttNames;
										for(var m=0;m<parseInt(splitRelEnt.length);m++)
										{
                                            var relaEnttNames=splitRelEnt[m].split(":")[0];
											if(!relatedEnttNames) relatedEnttNames = relaEnttNames;
											else relatedEnttNames = relatedEnttNames+","+relaEnttNames;
											//else relatedEnttNames = relaEnttNames;
										}
										relEntities=relatedEnttNames;
										//relEntities=L_RelEntities;
									}
									if(i==0) {
									   entityName = L_entityName; 
									   entityDescName=L_descName;
									 }
									 if(L_descName)
									 {
									   entityList[i]=new Option(L_descName,L_entityId);
									 // if(L_entityId==entityId){
										if(L_descName==enttName){
										  entityList[i].selected = true;
										  entityName = L_entityName;
										  entityDescName=L_descName;
										  if(L_RelEntities) {
											  var splitRelEnt=L_RelEntities.split(";");
											  var relatedEnttNames;
												for(var j=0;j<parseInt(splitRelEnt.length);j++)
												{
													var relaEnttNames=splitRelEnt[j].split(":")[0];
													if(relatedEnttNames) relatedEnttNames = relatedEnttNames+","+relaEnttNames;
													else relatedEnttNames = relaEnttNames;
												}
												relEntities=relatedEnttNames;
											  //relEntities=L_RelEntities;
										   }
										  }
									 }
									 else                              
										 entityList[i]=new Option(L_description,L_entityId);
									 
								 }
								//if(!entityId) entityList[0].selected = true;
								if(!enttName) entityList[0].selected = true;
							}
							});
}
/*Function loads related entities data and their corresponding entt_columns details*/
/*Creates load page unique value conditions section*/
function loadRelatedEnttColList()
{
  if(relEntities){
     var UrlForList="/atCRM/custom/entityView/listEnttColsForEntities.htm?entitiesCSV="+relEntities;
	  $.ajax({
			 type: "GET",		
			 url:UrlForList,
			 cache:false,
			 async:false,
			 dataType: "json",			
			 success: function (doc)
			  {
				 relEntitiesData=doc["entities"];
		      }
		});
  }
}
/*Function ends here*/
var setHeightIndex=0;

 function initialize(enttDescName)
	   {
		  parent.document.body.style.overflow="hidden";
		  getEntityListData();
	      //var entityId=getQueryParameter("entt_id");
		  if(!enttDescName)var enttDescName=getQueryParameter('enttName');
		  var valBrwsr = navigator.userAgent.toLowerCase();
		  brwsrValue=valBrwsr;
		  //Check for entt_id parameter and if exist select the entt_id from the list
		 // if(entityId!='null')
		  if(enttDescName!='null')
		  {
		     var enttSelectBox=document.getElementById("entity_select");
             var selectlength=enttSelectBox.length;
			 for(var i=0;i<selectlength;i++)
			 {
			   var enttId=enttSelectBox.options[i].value;
			   var slctEnttDescName=enttSelectBox.options[i].innerHTML;
			  // if(enttId==entityId)
			   if(slctEnttDescName==enttDescName)
			   {
			      enttSelectBox.options[i].selected = true;
				  $("#entity_select").attr("disabled", true);
				  document.getElementById("head_td").innerHTML="Import Data to "+enttSelectBox.options[i].innerHTML;
				  getEntityName(enttSelectBox.value)
				  break;
			   }
			 }
		  }
		  else
		  {
		    document.getElementById("head_td").innerHTML="Import Data";
		  }
		  //Set page height based on browser
		  var iframeHeight=parent.document.getElementById('htmlIframe').height;
		  iframeHeight=parseInt(iframeHeight);
		  var reqrdHt=iframeHeight-20+"px";
		  if(firstLoad==0){
			 // loadRelatedEnttColList();
			  parent.document.getElementById('htmlIframe').height=reqrdHt;
			/**********load scripts**********/
			  $("head").append($("<link rel='stylesheet' type='text/css' href='/atCRM/stylesheets/JSON/jquery/jquery.window.css'>"));
			  $.getScript("/atCRM/javascript/JSON/jquery/jquery.window.js");
			  firstLoad=1;
		  }
		  var scrollX = $(window).width();
		  if(scrollX>1200)
		  {
			if(valBrwsr.indexOf("firefox") > -1)
			   {
				 document.getElementById("txtAr").rows="23";
			   } 
		   else
			   {
				 document.getElementById("txtAr").rows="29";
			   }
		  }
		  else if(scrollX>950)
		  {
			if(valBrwsr.indexOf("firefox") > -1)
			   {
				 document.getElementById("txtAr").rows="9";
			     document.getElementById("prelimPage").style.maxHeight="375px";     //"395px";
				 document.getElementById("ConditionSetupPage").style.maxHeight="365px";
			   } 
		    else
			   {
				 document.getElementById("txtAr").rows="13";
				 document.getElementById("prelimPage").style.maxHeight="410px";              //"440px";
				 document.getElementById("ConditionSetupPage").style.maxHeight="410px";
			   }
		  }
	  }
function createCondnOrDiv(mainDivId,orLnkId,currDivId,condnSelectVal)
{
	  var mainDiv=document.getElementById(mainDivId);
	  var currDiv=document.getElementById(currDivId);
	  var orLinkElem=document.getElementById(orLnkId);
	  var divIndArray=new Array();
	  divIndArray=currDivId.split("_");
	  var baseInd=divIndArray[1];
	  var secInd=divIndArray[2];
	  currDiv.setAttribute("name","condnDiv_row");
	  //Check for related entity id in the mainDiv id
	  var relEnttId;
	  var splitMainDivId=mainDivId.split("_");
	  if(splitMainDivId[2]) relEnttId=splitMainDivId[2];
      //create first selectBox and add image
      var spanSelect=CreateSPAN(currDiv,"","span_select"+baseInd+"_"+secInd+"_1");
	  spanSelect.style.width="10%";
	  spanSelect.style.marginLeft="5px";
	  var uniqueSelectBox=CreateSelectBox(spanSelect,"uniqueSelectStyle","uniqueSelectBox"+baseInd+"_"+secInd+"_1");
	  $(uniqueSelectBox).mousedown(function(){
           document.getElementById("selectIndex").value="";
           document.getElementById("selectIndex").value=uniqueSelectBox.selectedIndex;
	  });
	  uniqueSelectBox.setAttribute("onchange","checkSelectedColumn(this,this.value,'"+currDivId+"')");
	  if(brwsrValue.indexOf("firefox") > -1)
		{
		  uniqueSelectBox.style.borderStyle="ridge";
		} 
	  else
		{
		  uniqueSelectBox.style.borderStyle="solid";
		}
	  if(relEnttId) populateConditionBoxes(uniqueSelectBox.id,relEnttId,"",condnSelectVal);
	  else populateConditionBoxes(uniqueSelectBox.id,"","",condnSelectVal);
	  var spanAddImg=CreateSPAN(currDiv,"","span_Img"+baseInd+"_"+secInd+"_1");
	  spanAddImg.style.position="relative";
	  spanAddImg.style.top="3px";
      spanAddImg.style.marginLeft="3px";
      var imgAdd=CreateIMG(spanAddImg,"","img_Add"+baseInd+"_"+secInd+"_1","/atCRM/images/JSON/add3.jpg","Add");
	  imgAdd.style.width="15px";
      imgAdd.style.height="15px";
	  var orlink=document.getElementById(orLnkId);
	  orlink.style.display="none";
	  var orArray=new Array();
	  orArray=orLnkId.split("_");
      var currOrInd=orArray[2];
      var orSpan=document.getElementById("span_or_"+baseInd+"_"+currOrInd);
      var orLabel=CreateLABEL(orSpan,"", "lbl_or_"+baseInd+"_"+currOrInd,"Or");
      $(imgAdd).click(function(){
			  addCell(spanAddImg.id,currDivId,relEnttId);
		});

      //create new or div
	  secInd=parseInt(secInd)+1;
	  var orIndex=parseInt(secInd)-1;
	  if(orIndex<5){
	  var NewDiv=document.createElement("div");
	  NewDiv.id="condnDiv_"+baseInd+"_"+secInd;
	  mainDiv.appendChild(NewDiv);
	  NewDiv.style.marginTop="5px";
	  var spanOrLnk=CreateSPAN(NewDiv,"","span_or_"+baseInd+"_"+orIndex);
	  spanOrLnk.style.width="10%";
	  var newOrLink=CreateA(spanOrLnk,"","orLink_"+baseInd+"_"+orIndex,"#","","Or","Click here to add or condition");
	  newOrLink.style.color="blue";
   	  newOrLink.style.textDecoration="underline";

      $(newOrLink).click(function(){
			 createCondnOrDiv(mainDivId,newOrLink.id,NewDiv.id)
		  });
      }
}
function addCell(spanImgId,divId,relEnttId,condnSelectVal)
{
	  var divElem=document.getElementById(divId);
	  var idArray=new Array();
	  idArray=spanImgId.split("_");
	  var colInd=idArray[3];
	  colInd=parseInt(colInd)+1;
	  var rwArray=new Array();
	  rowArray=divId.split("_");
	  var baseInd=rowArray[1];
	  var rowInd=rowArray[2];
	  rowInd=parseInt(rowInd);
	  if(colInd>2)
	    {
           var delSpan=document.getElementById("span_Delete_"+baseInd+"_"+rowInd);
		   $("#span_Delete_"+baseInd+"_"+rowInd).remove();
		}
	  var spanSelect=CreateSPAN(divElem,"","span_select"+baseInd+"_"+rowInd+"_"+colInd);
	  spanSelect.style.width="10%";
	  spanSelect.style.marginLeft="3px";
	  var uniqueSelectBox=CreateSelectBox(spanSelect,"uniqueSelectStyle","uniqueSelectBox"+baseInd+"_"+rowInd+"_"+colInd);
	  $(uniqueSelectBox).mousedown(function(){
           document.getElementById("selectIndex").value="";
           document.getElementById("selectIndex").value=uniqueSelectBox.selectedIndex;
	  });
	  uniqueSelectBox.setAttribute("onchange","checkSelectedColumn(this,this.value,'"+divId+"')");
	  if(brwsrValue.indexOf("firefox") > -1)
		{
		  uniqueSelectBox.style.borderStyle="ridge";
			   } 
	  else
		{
		  uniqueSelectBox.style.borderStyle="solid";
		}
	  if(relEnttId) populateConditionBoxes(uniqueSelectBox.id,relEnttId,"",condnSelectVal);
	  else populateConditionBoxes(uniqueSelectBox.id,"","",condnSelectVal);
	  var spanImg;
	  if(colInd<5){
		 spanImg=CreateSPAN(divElem,"","span_Img"+baseInd+"_"+rowInd+"_"+colInd);
		 spanImg.style.position="relative";
		 spanImg.style.marginLeft="3px";
		 spanImg.style.top="3px";
		 var imgAdd=CreateIMG(spanImg,"","img_Add"+baseInd+"_"+rowInd+"_"+colInd,"/atCRM/images/JSON/add3.jpg","Add");
		 imgAdd.style.width="15px";
		 imgAdd.style.height="15px";
		 var spanImageId=spanImg.id;
		 $(imgAdd).click(function(){
				  addCell(spanImageId,divId,relEnttId);
		 });
	  }
	  colInd=colInd-1;
	  var imgPrevAdd=document.getElementById("img_Add"+baseInd+"_"+rowInd+"_"+colInd);
	//  $(imgPrevAdd).remove();
	  if(imgPrevAdd) imgPrevAdd.style.display="None";
	  var preImgSpan=document.getElementById(spanImgId);
	  var imgAnd=CreateIMG(preImgSpan,"","img_And"+baseInd+"_"+rowInd+"_"+colInd,"/atCRM/images/JSON/ampersand1.jpg","And");
	  imgAnd.style.width="15px";
      imgAnd.style.height="15px";
	  	 var spanDelImg=CreateSPAN(divElem,"","span_Delete_"+baseInd+"_"+rowInd);
		 spanDelImg.style.position="relative";
		 spanDelImg.style.marginLeft="3px";
		 spanDelImg.style.top="3px";
		 var imgDelete=CreateIMG(spanDelImg,"","img_Delete_"+baseInd+"_"+rowInd,"/atCRM/images/deleteFG.png","Delete");
		 imgDelete.style.width="15px";
		 imgDelete.style.height="15px";
		 var spanDeleteImageId=spanDelImg.id;
		 var spanAddImgId;
		 if(spanImg) spanAddImgId=spanImg.id
         imgDelete.setAttribute("onclick","DeleteSpan('"+spanSelect.id+"','"+imgAnd.id+"','"+spanAddImgId+"','"+imgDelete.id+"')");
}
function DeleteSpan(spanSelectId,andImgId,addImgSpanId,delImgId)
{
    $("#"+spanSelectId).remove();
	if(addImgSpanId) $("#"+addImgSpanId).remove();
    $("#"+andImgId).remove();
	var prevAddImgId=andImgId.replace("And","Add");
	$("#"+prevAddImgId).css("display","inline");
	var delImg=document.getElementById(delImgId);

    var splitSpanSelectId=spanSelectId.split("_");
	var lastValSpan=splitSpanSelectId[3];
	var lastValSpan=parseInt(lastValSpan)-1;

	var spanAddImgId=prevAddImgId.replace("img","span");
	spanAddImgId=spanAddImgId.replace("Add","Img");
	if(lastValSpan>1)
	{
		var prevSpanSelectId=splitSpanSelectId[0]+"_"+splitSpanSelectId[1]+"_"+splitSpanSelectId[2]+"_"+lastValSpan;

		var splitAndImgId=andImgId.split("_");
		var lastValImg=splitAndImgId[3];
		var lastValImg=parseInt(lastValImg)-1;
		var prevAndImgId=splitAndImgId[0]+"_"+splitAndImgId[1]+"_"+splitAndImgId[2]+"_"+lastValImg; 

		delImg.setAttribute("onclick","DeleteSpan('"+prevSpanSelectId+"','"+prevAndImgId+"','"+spanAddImgId+"','"+delImgId+"')");
	}
	else
	{ 
		var spanDeleteId=delImgId.replace("img","span");
		$("#"+spanDeleteId).remove();
	}
}
/*Function to populate select box of main entities entt-columns*/
function populateSlctForMainEntt(selectId,isMostSignfct)
{
    var selectBox=document.getElementById(selectId);  //select boxes 
	selectBox.innerHTML="";
	var TblObj= dataJSONTest["entities"][0];
	var L_ColMostSignfct=TblObj['colMostSignt'];
	var L_enttColumns=TblObj['enttColumns'];
    selectBox[0]=new Option("None","");
	var ptrnVal=new RegExp(L_ColMostSignfct,"gi");
	var drpDwnCnt=1;
		for(j=0;j<L_enttColumns.length;j++)
			{
			 try			
			  {
				var L_inner_tds_data =L_enttColumns[j]["cols"];
				L_col_id		= L_inner_tds_data[0];
				L_col_DescName	= L_inner_tds_data[1];
				L_col_name		= L_inner_tds_data[7];
				L_isMandatory   = L_inner_tds_data[9];
				var new_col_name=L_col_name.toLowerCase();
				if(new_col_name!="created_by"&&new_col_name!="created_date"&&new_col_name!="createddate"&&new_col_name!="createdby"&&new_col_name!="createdby_id"&&new_col_name!="modified_by"&&new_col_name!="modified_date"&&new_col_name!="modifiedby"&&new_col_name!="modifieddate"&&new_col_name!="modifiedby_id"){
				//L_col_name=L_col_name.toString();
				if(L_col_DescName)
				{
					 selectBox[drpDwnCnt]=new Option(L_col_DescName,L_col_id);
					 if(L_isMandatory == "0") selectBox.options[drpDwnCnt].style.color="red";
					 if((isMostSignfct=="1")&&ptrnVal.test(L_col_name)==true) {
						 selectBox[drpDwnCnt].selected = true;
					 }
					 drpDwnCnt=drpDwnCnt+1;
				}
				}
		      }
			 catch (e)
			  {
				continue;
			  }
			}
			if(isMostSignfct!="1") selectBox[0].selected = true;
}
/*Function to populate select boxes for related entities*/
function populateSlctForRelEntities(selectId,relEntId,dtTbl,isMostSignfct,enttCol2BSelected)
{
   var selectBox=document.getElementById(selectId);
   selectBox.innerHTML="";
    var dataLength=relEntitiesData.length;
	for(var i=0;i<dataLength;i++)
		{
		  var enttId=relEntitiesData[i]["Id"];
		  var descName=relEntitiesData[i]["descName"];
		  var colMostSignfnt=relEntitiesData[i]["colMostSignt"];
		  var L_enttColumns=relEntitiesData[i]["enttColumns"];
		  var ptrnVal=new RegExp(colMostSignfnt,"gi");
		  //If dataTable dropDown populate first option as 'Do not import'
		  if(dtTbl=="dt") selectBox[0]=new Option("<Do not import>","");
		  else selectBox[0]=new Option("None","");
		  var drpDwnCnt=1;
		  if(enttId==relEntId){
			  for(j=0;j<L_enttColumns.length;j++)
				{
					 try			
					  {
						var L_inner_tds_data =L_enttColumns[j]["cols"];
						L_col_id		= L_inner_tds_data[0];
						L_col_DescName	= L_inner_tds_data[1];
						L_ColName       = L_inner_tds_data[7];
						L_isMandatory   = L_inner_tds_data[9];
						var new_col_name = L_ColName.toLowerCase();
						if(new_col_name!="created_by"&&new_col_name!="created_date"&&new_col_name!="createddate"&&new_col_name!="createdby"&&new_col_name!="createdby_id"&&new_col_name!="modified_by"&&new_col_name!="modified_date"&&new_col_name!="modifiedby"&&new_col_name!="modifieddate"&&new_col_name!="modifiedby_id"){
						if(L_col_DescName)
						{
							 selectBox[drpDwnCnt]=new Option(L_col_DescName,L_col_id);
							 if(L_isMandatory == "0") selectBox.options[drpDwnCnt].style.color="red";
							 drpDwnCnt=drpDwnCnt+1;
						}
						}
					  }
					 catch (e)
					  {
						continue;
					  }
				}
		  }
		 if(isMostSignfct!="1") selectBox[0].selected = true;
		}
	/*If its datTable droppDown then check if its pageload after tile split else match the Select option text with the Head label */
	if(dtTbl=="dt")
	{
		var colInd=selectId.replace("selectBox-","");
		var headLbl=document.getElementById("lblHead_"+colInd).innerHTML;
		var drpDwnObj=document.getElementById(selectId);
		//If this is called after pageload for title split check for the existing selected options else match
		if(reloadPageInd==1)
		{
			/*Get the column number of title*/
			var titleColNum;
			var  selectObjects=document.getElementsByName("fieldSelect");
			for(var f=0;f<selectObjects.length;f++)
			{
				var colLabel=document.getElementById("lblHead_"+f).innerHTML;
				if(colLabel.toLowerCase().indexOf("title")>-1)
				{
					titleColNum=f;
					break;
				}
			}
			/*Code for get col number ends here*/
           for(var t=0;t<DrpDwnIndexArray.length;t++)
			{
               if(t==colInd)
				{
				   if(colInd<titleColNum) drpDwnObj[DrpDwnIndexArray[t]].selected=true;
				   else if((colInd>titleColNum)) drpDwnObj[DrpDwnIndexArray[t-1]].selected=true;
				}
			}
		}
		else{
			/*****If enttCOl2bSelected exist then map the column using mapJSON******/
			if(enttCol2BSelected){
			  $("#"+selectId).val(enttCol2BSelected).attr('selected',true);
			}
			else{
			 for(var i=0; i<drpDwnObj.length; i++)
			  {
				 var optionName=drpDwnObj.options[i].text;
				 var ptrnVal=new RegExp(headLbl,"gi");
				 if(ptrnVal.test(optionName))
					{
					 drpDwnObj[i].selected = true;
					 break;
					}
			  }
		   }
		}
	 /*Match section ends here*/
	}
	var enttColSelBoxId=selectId.replace("enttBox","selectBox");
	var enttColValue=document.getElementById(enttColSelBoxId).value;
	checkSameOption(enttColValue,enttColSelBoxId)
}
//Function to get the entityname of a selected entity 
function getEntityName(entityId)
{
	 if(firstLoad!=0) initialize();
	// getEntityListData();
	 var listJSON= listDataJSON;
	 var L_EntityList = listJSON['EntityList']; 
	 var L_listData = L_EntityList['listData'];
	 for(i=0; i<parseInt(L_listData.length); i++)
		{		
			L_rv_obj = L_listData[i];
			L_entityId = L_rv_obj['entityId'];
			L_entityName = L_rv_obj['entityName'];
			L_descName = L_rv_obj['descName'];
			if(L_entityId==entityId)
			{
               entityName = L_entityName;
               entityDescName=L_descName;
			   //save related entities CSV in global variable
               var relaEnttlist=L_rv_obj['relEnttsCSV'];
				   var reEnttName;
				   var splitRelEntities = relaEnttlist.split(";");
				   for(var k=0;k<parseInt(splitRelEntities.length);k++)
				   {
                     var relaEnttNames=splitRelEntities[k].split(":")[0];
					 if(reEnttName) reEnttName = reEnttName+","+relaEnttNames;
					 else reEnttName = relaEnttNames;
				   }
				   relEntities = reEnttName;
			}
		}
	loadRelatedEnttColList();
}
function showHideFile(num)
{
  if(num=="1"){
  document.getElementById("fileUpload").style.visibility="visible";
  document.getElementById("txtAr").style.display="none";
  document.getElementById("lbl_txtArea").style.visibility="hidden";
  document.getElementById("divUploadText").style.visibility="visible";
  document.getElementById("FldSepRad1").disabled=true;
  document.getElementById("FldSepRad2").disabled=true;
  document.getElementById("FldSepRad3").disabled=true;
  document.getElementById("FldSepRad4").disabled=true;
  document.getElementById("FldSepRad1").checked=true;
  document.getElementById("lbl_seperator").style.color="lightgrey";
  document.getElementById("td_seperator").style.visibility="hidden";
  isFileUpload=0;
  }
  else{
  document.getElementById("fileUpload").style.visibility="hidden";
  document.getElementById("txtAr").style.display="block";
  document.getElementById("lbl_txtArea").style.visibility="visible";
  document.getElementById("divUploadText").style.visibility="hidden";
  document.getElementById("FldSepRad1").disabled=false;
  document.getElementById("FldSepRad2").disabled=false;
  document.getElementById("FldSepRad3").disabled=false;
  document.getElementById("FldSepRad4").disabled=false;
  document.getElementById("FldSepRad1").checked=true;
  document.getElementById("FldSepRad2").checked=false;
  document.getElementById("FldSepRad3").checked=false;
  document.getElementById("FldSepRad4").checked=false;
  document.getElementById("lbl_seperator").style.color="black";
  document.getElementById("td_seperator").style.visibility="visible";
  var scrollX = $(window).width();
		  if(scrollX>1200)
		  {
			if(valBrwsr.indexOf("firefox") > -1)
			   {
				 document.getElementById("txtAr").rows="23";
			   } 
		   else
			   {
				 document.getElementById("txtAr").rows="29";
			   }
		  }
		  else if(scrollX>950)
		  {
			if(valBrwsr.indexOf("firefox") > -1)
			   {
				 document.getElementById("txtAr").rows="9";
				 document.getElementById("prelimPage").style.maxHeight="375px";        // "395px";
			   } 
		    else
			   {
				 document.getElementById("txtAr").rows="13";
				 document.getElementById("prelimPage").style.maxHeight="410px";           //"440px";
			   }
		  }
  isFileUpload=0;
  }
}
function cancelPage()
  {
	  document.getElementById("fileUpload").style.visibility="hidden";
      document.getElementById("txtAr").style.display="block";
	  document.getElementById("txtAr").value="";
	  document.getElementById("lbl_txtArea").style.display="block";
	  document.getElementById('entity_select')[0].selected=true;
	  document.getElementById('rad_reject').checked=true;
	  document.getElementById("fileUpload").value="";
	  document.getElementById("sourceRad1").checked=true;
	  document.getElementById("sourceRad2").checked=false;
	  document.getElementById("date_india").checked=true;
	  document.getElementById("date_us").checked=false;
	  document.getElementById("FldSepRad1").checked=true;
	  document.getElementById("FldSepRad2").checked=false;
	  document.getElementById("FldSepRad3").checked=false;
	  document.getElementById("FldSepRad1").disabled=true;
	  document.getElementById("FldSepRad2").disabled=true;
	  document.getElementById("FldSepRad3").disabled=true;
	  $("#tabs").tabs('enable', 0);
	  $("#tabs").tabs('select', 0);
	  $("#tabs").tabs({disabled:[1,2,3]});
	  setHeightIndex=0;
	  initialize();
 }
function nextPage()
{
	isFileUpload=0;
	parseFailIndex=0;          //set parsing fail index to 0;
	var selctObj=document.getElementById("entity_select");
	var selctEntityIndex=selctObj.selectedIndex;
	if(selctEntityIndex == 0) getEntityName(selctObj.value);
	var fileRad=document.getElementById("sourceRad2");
	var entitySel=document.getElementById("entity_select").value;
	if(fileRad.checked)
	{
		var csvFilePath=$('#fileUpload').val();
		if(csvFilePath==""||csvFilePath==null)
		{
			//alert("File is not selected");
			var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>Please select the file to upload</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){//checkContinue(v,fieldIdList);
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
		}
		else
		{
			/*  Validate file extension  */
			var filePath=document.getElementById("fileUpload").value;
			var filePathArray=new Array();
			filePathArray=filePath.split("\\");
			var arrLen=filePathArray.length;
			var fileName=filePathArray[arrLen-1];
			var fileExtArr=new Array();
			fileExtArr=fileName.split(".");
			var fileExt=fileExtArr[fileExtArr.length-1];
			fileExt=fileExt.toLowerCase();
			if(fileExt=='csv')
			{
				$("#tabs").tabs({disabled: [2,3]});
				$("#tabs").tabs('select', 1);
				$("#tabs").tabs('enable', 1);
				createSetUpFieldPage();
			}
			else
			{
				var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>Only CSV file can be uploaded.</td></tr></table>";
				$.prompt(prmptTxt,{
					buttons: { OK: true},
					show:'slideDown',
					submit: function(v,m,f){
						if(v==true)
							{
							  return;
							}
						}
				});
			}

		}
	}
	else
	{
	  var txtArVal=document.getElementById("txtAr").value;
	  if(txtArVal=="")
	  {
		document.getElementById("div_error").style.visibility="visible";
		document.getElementById("txtAr").focus();
		setTimeout("fadeout()",3000);
	  }
	  else if(!entitySel)
		{
           alert("Please select the entity");
           document.getElementById("entity_select").focus();
		}
	  else{
	  document.getElementById("loadData_Img").style.display="block";
	  document.body.style.cursor="wait";
	  setTimeout(function()
		  {
		    $("#tabs").tabs({disabled: [0,2,3]});
		    $("#tabs").tabs('select', 1);
		    $("#tabs").tabs('enable', 1);
		    var txtAreaData=document.getElementById("txtAr").value;
		    document.getElementById("txtAr").value=txtAreaData.trim();
		    createSetUpFieldPage();
		  },500);
		}
	}
}
function backPage(ind)
{
	$('#tabs').tabs('select', ind);
}
function RefreshPage()
{
  var objTxtArea=document.getElementById("txtAr");
  $("#tabs").tabs({disabled: [2]});
  $("#tabs").tabs({disabled: [3]});
  $("#tabs").tabs('select', 1);
  $("#tabs").tabs('enable', 1);
  setHeightIndex=0;
  var tbldata=objTxtArea.value;
  if(UploadIndex==1)
	{
	   createSetUpFieldPage(uploadFileData);
	}
  else
	{
      createSetUpFieldPage(tbldata);
	}
}
function fadeout() {
	 document.getElementById("div_error").style.visibility="hidden";
}
function createSetUpFieldPage(Data)
{
  getEntityListData();
  var SepVal;
  var fieldSeperator=document.getElementsByName("FldSepRad");
  for(var i=0;i<fieldSeperator.length;i++)
	{
        if(fieldSeperator[i].checked==true)
		{
           SepVal=fieldSeperator[i].value;
		}
	}
  var objTxtArea=document.getElementById("txtAr");
  var txtArVal=objTxtArea.value;
  //Create SetUp Page
  var MainDIV=document.getElementById("setUpPage");
   MainDIV.innerHTML="";
  var mainTbl=CreateTable(MainDIV,"","mainTable","","","","center");
  mainTbl.style.width="100%";
  mainTbl.style.borderCollapse="collapse";
  mainTbl.style.position="relative";
  mainTbl.style.top="-5px";
  //First row of the page starts here
  var stUpTr1=CreateTR(mainTbl,"","stUpTr1");
  var stUpTd11=CreateTD(stUpTr1,"","stUpTd11");
  stUpTd11.className="headingText";
  stUpTd11.style.width="40%";
  var stUpTd12=CreateTD(stUpTr1,"","stUpTd12");
  stUpTd12.setAttribute("width","30%");
  stUpTd12.align="center";
  var stUpTd13=CreateTD(stUpTr1,"","stUpTd13");
  stUpTd13.setAttribute("width","30%");
  stUpTd13.align="right";
  var imgCancel=CreateIMG(stUpTd13,"","imgCancel2","/atCRM/images/JSON/Refresh.jpg","Refresh","35","35"); 
  imgCancel.style.cursor="pointer";
  imgCancel.setAttribute("onclick","javascript:RefreshPage();");
  var imgBack=CreateIMG(stUpTd13,"","imgBack1","/atCRM/images/JSON/back_btn.jpg","Back");
  imgBack.setAttribute("height","37px");
  imgBack.setAttribute("width","37px");
  imgBack.style.cursor="pointer";
  imgBack.setAttribute("onclick","javascript:backPage(0);");
  imgBack.style.position="relative";
  imgBack.style.left="1px";
  var imgNext=CreateIMG(stUpTd13,"","imgNext2","/atCRM/images/JSON/nextBtnBig.JPG","Next");
  imgNext.setAttribute("height","37px");
  imgNext.setAttribute("width","37px");
  imgNext.style.cursor="pointer";
  imgNext.style.position="relative";
  imgNext.style.top="2px";
  imgNext.setAttribute("onclick","javascript:validateData();");
  //Second row starts here
  var stUpTr2=CreateTR(mainTbl,"","stUpTr2");
  var stUpTd21=CreateTD(stUpTr2,"","stUpTd21","3");
  //Datagrid table starts-->
  var stUpTr3=CreateTR(mainTbl,"","stUpTr3");
  var stUpTd31=CreateTD(stUpTr3,"","stUpTd31","3");
  stUpTd31.align="center";
  stUpTd31.innerHTML="<img id='load_Img' style='display:none;' src='/atCRM/images/LoadImg/ajax-loader.gif'/>";
  /*  Display checked items if it reload after title split   */
  if(reloadPageInd==1&&checkedValues) document.getElementById("stUpTd21").innerHTML=checkedValues;
  var dataArray;
  if(Data) {dataArray=Data}
  else dataArray=txtArVal;
   var fileRad1=document.getElementById("sourceRad1");
   var fileRad=document.getElementById("sourceRad2");
   if(isFileUpload==0)
	{
		if(fileRad.checked)
		{
		   uploadFile();
		}
		else if(fileRad1.checked)
		{
			if(SepVal=="1"&&splitTitleIndex==0)
			{
				functionForComma(dataArray);
			}
			else if(SepVal=="2"&&splitTitleIndex==0)
			{
				functionForTab(dataArray);
			}
			else if(SepVal=="3"&&splitTitleIndex==0){
				functionForAnyChar(dataArray,SepVal);
			}
			else if(SepVal=="4"&&splitTitleIndex==0){
				functionForAnyChar(dataArray,SepVal);
			}
			else if(splitTitleIndex==1) functionForComma(dataArray);   //After title split this will be called
		}
		else
		{
			alert("Please select the Data Source");
		}
	}
	else
	{
         functionForComma(dataArray);
	}
}
function uploadFile()
{
        $('#uploadForm').ajaxSubmit({ 
		         type : 'POST',
                 dataType: 'json',
			     enctype : 'multipart/form-data',
   			     url : 'http://192.168.11.11:81/uploadProcess/upload.php',
				 beforeSend: function() {
					    $('#load_Img').show();
				  },
				 complete: function(){
					   $('#load_Img').hide();
				  },
				 success: function (data,status)
					   {
						   var fileName=data[0]["name"];
						   getDataFromServer(fileName);
						}
            }); 
}
function getDataFromServer(fileName)
{
	     UploadIndex=0;
         var txtFile=null;
		 if (window.XMLHttpRequest) {
		    //for firefox, opera and safari browswers
		    txtFile = new XMLHttpRequest();
	       }
		 else if (window.ActiveXObject)
		    {// code for IE6, IE5
		     txtFile=new ActiveXObject("Microsoft.XMLHTTP");
		    }
		
		 if (txtFile!=null)
		  {
			txtFile.open("GET","/atCRM/custom/CSV/readCSVFile.json?fileName="+fileName,false);
			txtFile.send(null);
			var allText = txtFile.responseText;
		   uploadFileData=allText;
		   UploadIndex=1;
           functionForComma(allText);
		  }
}
function functionForTab(dataArray)
	{
		var mainTd=document.getElementById("stUpTd31");
		var valBrwsr = navigator.userAgent.toLowerCase();
		var scrollX = $(window).width();             //*58/100;
		var WindowHeight = $(window).height();
		var reqdHt;
		if(valBrwsr.indexOf("firefox") > -1)
		{
			reqdHt=WindowHeight-298;         
		}
		else{
			 reqdHt=WindowHeight-286;        
		}
		//Add 20px to iframe height
		if(setHeightIndex==0){
		var iframeHeight=parent.document.getElementById('htmlIframe').height;
		iframeHeight=parseInt(iframeHeight);
		var reqrdHt=iframeHeight+20+"px";
        setHeightIndex=1;
		}

		//ends here
		var mainTabDiv=document.getElementById("setUpPage");
		if(dataArray.indexOf("\t")<0)
		{
           var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>It seems have selected the wrong field seperator</td></tr></table>";
				       $.prompt(prmptTxt,{
						   buttons: { OK: true},
						   show:'slideDown',
						   submit: function(v,m,f){
							   if(v==true)
							   {
								   mainTabDiv.innerHTML="";
								   $("#tabs").tabs('enable', 0);
								   $("#tabs").tabs('select', 0);
								   $("#tabs").tabs({disabled:[1,2,3]});
								   document.getElementById("loadData_Img").style.display="none";
								   document.body.style.cursor="auto";
								   return;
							   }
						   }
					    });
		}
        var csvArray = $.csv.toArrays(dataArray, {
		  separator:'\t'                 // sets a field separator character
		});
		var dataTbl=CreateTable(mainTabDiv,"","gridMain","","","","center"); 
		var indexNum="";
		recNum=csvArray.length;
		var frstrwColCnt=0;
		var lastRwNum=csvArray.length-1;
        if(recNum<10000){
		for(var i=0; i<csvArray.length; i++) {
				   var noTDS=csvArray[i];
				   if(noTDS.length==1){
				   if((noTDS.length==1)&&parseFailIndex==0) {
					  var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>It seems your data contains only one column.Have you selected the right field seperator?</td></tr></table>";
				       $.prompt(prmptTxt,{
						   buttons: { Yes: true, No: false },
						   show:'slideDown',
						   submit: function(v,m,f){
							   if(v==false)
							   {
								   mainTabDiv.innerHTML="";
								   $("#tabs").tabs('enable', 0);
								   $("#tabs").tabs('select', 0);
								   $("#tabs").tabs({disabled:[1,2,3]});
								   document.getElementById("loadData_Img").style.display="none";
								   document.body.style.cursor="auto";
								   return;
							   }
						   }
					    });
					   parseFailIndex=1;
				   }
		          }
				  var rowsColCnt=0;
				   if(i==0){
				   var dataThead=CreateThead(dataTbl,"","dataThead"+i);
				   var dataTR=CreateTR(dataThead,"","dataTrB"+i);
				   frstrwColCnt=noTDS.length;
				   }
				   else if(i==1){
				   rowsColCnt=noTDS.length;
                   var dataTblBody=CreateBody(dataTbl,"","dataTbody"+i);
				   var dataTR=CreateTR(dataTblBody,"","dataTr"+i);
				   //Compare the record column number with header columns
				   if(frstrwColCnt!=rowsColCnt && i != lastRwNum){
						      mainTabDiv.innerHTML="";
						      $("#tabs").tabs('enable', 0);
							  $("#tabs").tabs('select', 0);
							  $("#tabs").tabs({disabled:[1,2,3]});
							  document.getElementById("loadData_Img").style.display="none";
							  document.body.style.cursor="auto";
							  var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>There is no match between the column numbers in the data header and the records</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){//checkContinue(v,fieldIdList);
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
							  break;
					   }
				   }
				   else {
					     var dataTR=CreateTR(dataTblBody,"","dataTr"+i);
						 rowsColCnt=noTDS.length;
				       //Compare the record column number with header columns
                         if(frstrwColCnt!=rowsColCnt && i != lastRwNum){
						      mainTabDiv.innerHTML="";
						      $("#tabs").tabs('enable', 0);
							  $("#tabs").tabs('select', 0);
							  $("#tabs").tabs({disabled:[1,2,3]});
							  document.getElementById("loadData_Img").style.display="none";
							  document.body.style.cursor="auto";
							    var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>There is no match between the column numbers in the data header and the records</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){//checkContinue(v,fieldIdList);
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
							  break;
					     }
				   }
				   if(i != lastRwNum){
				   for(var j=0;j<noTDS.length;j++)
						 {
					        if(i==0){var dataTh
								    dataTh="DataTH-"+j;
								   dataTh =CreateTH(dataTR,"","dataTh"+j);
								   var lblHead=document.createElement("label");
									lblHead.id="lblHead_"+j;
									var cellVal=noTDS[j];
									cellVal=cellVal.trim();
									cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
									cellVal=cellVal.trim();
									lblHead.innerHTML=cellVal;
									dataTh.appendChild(lblHead);
									var innerHtmlTxt=dataTh.innerHTML;
									innerHtmlTxt=innerHtmlTxt+"<br/><select name='enttSelect' id='enttBox-"+j+"' style='width:120px' title='Entity' onchange='loadEnttColmns(this.value,this.id)'></select>";
									innerHtmlTxt=innerHtmlTxt+"<br/><select name='fieldSelect' id='selectBox-"+j+"' style='width:120px' title='Import to field'  onchange='checkSameOption(this.value,this.id)'></select>";
								    dataTh.innerHTML=innerHtmlTxt;
									var fieldDropDn=document.getElementById("selectBox-"+j);
							   }
							else{
								var dataTd=CreateTD(dataTR,"","dataTd_"+i+"_"+j);
								var cellVal=noTDS[j];
								 cellVal=cellVal.trim();
								 cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
								 cellVal=cellVal.trim();
								 dataTd.innerHTML=cellVal;
								 if(isNaN(cellVal))
									{
                                       dataTd.align="left";
									}
									else dataTd.align="right";
							   }
						 }
				   }
				   else{
					   for(var j=0;j<frstrwColCnt;j++)
						 {
							 var dataTd=CreateTD(dataTR,"","dataTd_"+i+"_"+j);
							 var cellVal="";
							 if(noTDS[j]) cellVal=noTDS[j];
							 cellVal=cellVal.trim();
							 cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
							 cellVal=cellVal.trim();
							 dataTd.innerHTML=cellVal;
							 if(isNaN(cellVal))
							   {
								  dataTd.align="left";
							   }
							 else dataTd.align="right";
						 }
				   }
			     }
			 $(document).ready(function() {
				var oTable=$('#gridMain').dataTable({
								  "bJQueryUI": true,
								  "bPaginate": false,
								  "bSort": false,
								  "bInfo": false,
								  "asStripClasses": null,
								  "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
								  "sScrollY": reqdHt,
								  "fnInitComplete": function(oSettings, json) {
									  document.getElementById("loadData_Img").style.display="none";
									  document.body.style.cursor="auto";
									  var mainTableDiv=document.getElementById("gridMain_wrapper");
									  mainTableDiv.style.position="relative";
									  mainTableDiv.style.top="-8px";
									  var scrnWidth=$(window).width();
										if(scrnWidth>1200)
										{
										  document.getElementsByClassName("dataTables_scroll")[0].style.width="1190px";
										}
										else if(scrnWidth>950)
										{
										 document.getElementsByClassName("dataTables_scroll")[0].style.width="954px";
										}

									   document.getElementsByClassName("dataTables_scroll")[0].style.overflowX="auto";
									   var widthReq=document.getElementsByClassName("dataTables_scrollHeadInner")[0].style.width;
									   widthReq=widthReq.replace("px","");
									   var widthOrgnl=document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width;
									   widthOrgnl=widthOrgnl.replace("px","");
									   if(widthOrgnl<widthReq) {
									      document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width=widthReq+"px";
									      document.getElementsByClassName("dataTables_scrollBody")[0].style.width=widthReq+"px";
										}
									   var tableWidth=document.getElementsByClassName("dataTables_scroll")[0].style.width;
									   tableWidth=tableWidth.replace("px","");
										if(parseInt(tableWidth)>parseInt(widthReq))
										  {
											document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width=tableWidth+"px";
											document.getElementsByName("gridMain")[0].style.width=tableWidth+"px";
											document.getElementsByClassName("dataTables_scrollBody")[0].style.width=tableWidth+"px";
										  }
									},

								  "bScrollCollapse": true
								});
			});
		populateSelectBoxes();
		populateLnkEntts();
		titleIndex=0;
		splitTitleIndex=0;
	  }
	  else {
		   //alert("Maximum 10,000 records can be uploaded");
           var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>Maximum 10,000 records can be uploaded</td></tr></table>";
			$.prompt(prmptTxt,{
				buttons: { OK: true},
				show:'slideDown',
				submit: function(v,m,f){//checkContinue(v,fieldIdList);
					if(v==true)
					{
					   return;
					}
				}
			});
		   mainTabDiv.innerHTML="";
		   $("#tabs").tabs('enable', 0);
		   $("#tabs").tabs('select', 0);
		   $("#tabs").tabs({disabled:[1,2,3]});
	  }
 }
function functionForComma(dataArray)
	{
        var mainTd=document.getElementById("stUpTd31");
		var valBrwsr = navigator.userAgent.toLowerCase();
		var scrollX = $(window).width();             //*58/100;
		var WindowHeight = $(window).height();
		var reqdHt;
		var columns;
		if(valBrwsr.indexOf("firefox") > -1)
		{
			  reqdHt=WindowHeight-298;
		}
		else{
			  reqdHt=WindowHeight-286;
		}
		     //Add 20px to iframe height
			if(setHeightIndex==0){
			var iframeHeight=parent.document.getElementById('htmlIframe').height;
			iframeHeight=parseInt(iframeHeight);
			var reqrdHt=iframeHeight+20+"px";
			setHeightIndex=1;
		}
		//ends here
	    var mainTabDiv=document.getElementById("setUpPage");
		dataArray=dataArray.trim();
        var csvArray = $.csv.toArrays(dataArray);         /*Convert CSV data into array */
		var dataTbl=CreateTable(mainTabDiv,"","gridMain","","","","center");
		var indexNum="";
		recNum=csvArray.length;
		var frstrwColCnt=0;
		var lastRwNum=csvArray.length-1;
		if(recNum<10000){
		 for(var i=0; i<csvArray.length; i++) {
				   var noTDS=csvArray[i];
				   if(noTDS.length==1){
				   if((noTDS.length==1)&&parseFailIndex==0) {
					  var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>It seems your data contains only one column.Have you selected the right field seperator?</td></tr></table>";
				       $.prompt(prmptTxt,{
						   buttons: { Yes: true, No: false },
						   show:'slideDown',
						   submit: function(v,m,f){
							   if(v==false)
							   {
								   mainTabDiv.innerHTML="";
								   $("#tabs").tabs('enable', 0);
								   $("#tabs").tabs('select', 0);
								   $("#tabs").tabs({disabled:[1,2,3]});
								   document.getElementById("loadData_Img").style.display="none";
								   document.body.style.cursor="auto";
								   return;
							   }
						   }
					    });
					   parseFailIndex=1;
				     } 
				   }
				   var rowsColCnt=0;
				   if(i==0){
				   var dataThead=CreateThead(dataTbl,"","dataThead"+i);
				   var dataTR=CreateTR(dataThead,"","dataTrB"+i);
				   frstrwColCnt=noTDS.length;
				   }
				   else if(i==1){
				   rowsColCnt=noTDS.length;
                   var dataTblBody=CreateBody(dataTbl,"","dataTbody"+i);
				   var dataTR=CreateTR(dataTblBody,"","dataTr"+i);
				   //Compare the record column number with header columns
				   if(frstrwColCnt!=rowsColCnt && i != lastRwNum){
						      mainTabDiv.innerHTML="";
						      $("#tabs").tabs('enable', 0);
							  $("#tabs").tabs('select', 0);
							  $("#tabs").tabs({disabled:[1,2,3]});
							  document.getElementById("loadData_Img").style.display="none";
							  document.body.style.cursor="auto";
							    var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>There is no match between the column numbers in the data header and the records</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){//checkContinue(v,fieldIdList);
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
							  break;
					   }
				   }
				   else {
					   var dataTR=CreateTR(dataTblBody,"","dataTr"+i);
					   rowsColCnt=noTDS.length;
					   //Compare the record column number with header columns
                       if(frstrwColCnt!=rowsColCnt && i != lastRwNum){
						      mainTabDiv.innerHTML="";
						      $("#tabs").tabs('enable', 0);
							  $("#tabs").tabs('select', 0);
							  $("#tabs").tabs({disabled:[1,2,3]});
							  document.getElementById("loadData_Img").style.display="none";
							  document.body.style.cursor="auto";
							    var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>There is no match between the column numbers in the data header and the records</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
							  break;
					   }
				   }
				   if(i != lastRwNum){
				   for(var j=0;j<noTDS.length;j++)
						 {
					   columns=noTDS.length;
					   columns=columns*1;
					        if(i==0){
								   var dataTh;
								    dataTh="DataTH-"+j;
								   dataTh =CreateTH(dataTR,"","dataTh"+j);
								    var lblHead=document.createElement("label");
									lblHead.id="lblHead_"+j;
									var cellVal=noTDS[j];
									cellVal=cellVal.trim();
									cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
									cellVal=cellVal.trim();
									lblHead.innerHTML=cellVal;
									dataTh.appendChild(lblHead);
									var innerHtmlTxt=dataTh.innerHTML;
									innerHtmlTxt=innerHtmlTxt+"<br/><select name='enttSelect' id='enttBox-"+j+"' style='width:120px' title='Entity' onchange='loadEnttColmns(this.value,this.id)'></select>";
									innerHtmlTxt=innerHtmlTxt+"<br/><select name='fieldSelect' id='selectBox-"+j+"' title='Import to field' style='width:120px' onchange='checkSameOption(this.value,this.id)'></select>"; 
								    dataTh.innerHTML=innerHtmlTxt;
									var fieldDropDn=document.getElementById("selectBox-"+j);
							   }
							else{
								 var dataTd=CreateTD(dataTR,"","dataTd_"+i+"_"+j); 
							     var cellVal=noTDS[j];
								 cellVal=cellVal.trim();
								 cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
								 cellVal=cellVal.trim();
								 dataTd.innerHTML=cellVal;
								  if(isNaN(cellVal))
									{
                                       dataTd.align="left";
									}
									else dataTd.align="right";
							   }
						 }
		           }
				   else{
					   for(var j=0;j<frstrwColCnt;j++)
						 {
							 var dataTd=CreateTD(dataTR,"","dataTd_"+i+"_"+j);
							 var cellVal="";
							 if(noTDS[j]) cellVal=noTDS[j];
							 cellVal=cellVal.trim();
							 cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
							 cellVal=cellVal.trim();
							 dataTd.innerHTML=cellVal;
							 if(isNaN(cellVal))
							   {
								  dataTd.align="left";
							   }
							 else dataTd.align="right";
						 }
				   }
			     }
			$(document).ready(function() {
				var oTable=$('#gridMain').dataTable({
								  "bJQueryUI": true,
								  "bPaginate": false,
								  "bSort": false,
								  "bInfo": false,
								  "asStripClasses": null,
								  "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
								  "sScrollY":reqdHt,
								  "fnInitComplete": function(oSettings, json) {
									  document.getElementById("loadData_Img").style.display="none";
									  document.body.style.cursor="auto";
									   var mainTableDiv=document.getElementById("gridMain_wrapper");
									  mainTableDiv.style.position="relative";
									  mainTableDiv.style.top="-8px";
									  var scrnWidth=$(window).width();
										if(scrnWidth>1200)
										{
										  document.getElementsByClassName("dataTables_scroll")[0].style.width="1190px";
										}
										else if(scrnWidth>950)
										{
										 document.getElementsByClassName("dataTables_scroll")[0].style.width="954px";
										}
									     document.getElementsByClassName("dataTables_scroll")[0].style.overflowX="auto";
										 var widthReq=document.getElementsByClassName("dataTables_scrollHeadInner")[0].style.width;
										 widthReq=widthReq.replace("px","");
										 var widthOrgnl=document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width;
										 widthOrgnl=widthOrgnl.replace("px","");
										 if(widthOrgnl<widthReq) {
									      document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width=widthReq+"px";
									      document.getElementsByClassName("dataTables_scrollBody")[0].style.width=widthReq+"px";
										 }
										 var tableWidth=document.getElementsByClassName("dataTables_scroll")[0].style.width;
									     tableWidth=tableWidth.replace("px","");
										  if(parseInt(tableWidth)>parseInt(widthReq))
										  {
											document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width=tableWidth+"px";
											document.getElementsByName("gridMain")[0].style.width=tableWidth+"px";
											document.getElementsByClassName("dataTables_scrollBody")[0].style.width=tableWidth+"px";
										  }
									   }, 
								  "bScrollCollapse": true
								});
			});
		populateSelectBoxes();
		populateLnkEntts();
		titleIndex=0;
		splitTitleIndex=0;
		}
	  else 
		{ 
		  //alert("Maximum 10,000 records can be uploaded");
		  var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>Maximum 10,000 records can be uploaded</td></tr></table>";
			$.prompt(prmptTxt,{
				buttons: { OK: true},
				show:'slideDown',
				submit: function(v,m,f){//checkContinue(v,fieldIdList);
					if(v==true)
					{
					   return;
					}
				}
			});
		   mainTabDiv.innerHTML="";
		   $("#tabs").tabs('enable', 0);
		   $("#tabs").tabs('select', 0);
		   $("#tabs").tabs({disabled:[1,2,3]});
	  }
}

function functionForAnyChar(dataArray,sepVal)
{
        var mainTd=document.getElementById("stUpTd31");
		var valBrwsr = navigator.userAgent.toLowerCase();
		var scrollX = $(window).width();
		var WindowHeight = $(window).height();
		var reqdHt;
		if(valBrwsr.indexOf("firefox") > -1)
		{
			 reqdHt=WindowHeight-298;
		}
		else{
			  reqdHt=WindowHeight-286;
		}
		//Add 20px to iframe height
		if(setHeightIndex==0){
		var iframeHeight=parent.document.getElementById('htmlIframe').height;
		iframeHeight=parseInt(iframeHeight);
		var reqrdHt=iframeHeight+20+"px";
        setHeightIndex=1;
		}
		/* Ends here */
	      var mainTabDiv=document.getElementById("setUpPage");
		 /*Convert CSV data into array*/
		  var csvArray
		  /********If data is seperated by semicolon or pipe character*********/
		  if(sepVal=="3"){
			  csvArray= $.csv.toArrays(dataArray, {
		      separator:';'                    // sets a custom field separator character
		      });
		  }
		   /********If data is seperated by pipe character*********/
		  else if(sepVal=="4"){
              csvArray= $.csv.toArrays(dataArray, {
		      separator:'|'                   // sets a custom field separator character
		      });
		  }
		var dataTbl=CreateTable(mainTabDiv,"","gridMain","","","","center");
		var indexNum="";
		recNum=csvArray.length;
		var frstrwColCnt=0;
		var lastRwNum=csvArray.length-1;
		if(recNum<10000){
		 for(var i=0; i<csvArray.length; i++) {
				   var noTDS=csvArray[i];
				    var rowsColCnt=0;
					if(noTDS.length==1){
					if((noTDS.length==1)&&parseFailIndex==0) {
					  var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>It seems your data contains only one column.Have you selected the right field seperator?</td></tr></table>";
				       $.prompt(prmptTxt,{
						   buttons: { Yes: true, No: false },
						   show:'slideDown',
						   submit: function(v,m,f){
							   if(v==false)
							   {
								   mainTabDiv.innerHTML="";
								   $("#tabs").tabs('enable', 0);
								   $("#tabs").tabs('select', 0);
								   $("#tabs").tabs({disabled:[1,2,3]});
								   document.getElementById("loadData_Img").style.display="none";
								   document.body.style.cursor="auto";
								   return;
							   }
						   }
					    });
					   parseFailIndex=1;
				    }
				   }
				   if(i==0){
				   var dataThead=CreateThead(dataTbl,"","dataThead"+i);
				   var dataTR=CreateTR(dataThead,"","dataTrB"+i);
				   frstrwColCnt=noTDS.length;
				   }
				   else if(i==1){
					   rowsColCnt=noTDS.length;
                   var dataTblBody=CreateBody(dataTbl,"","dataTbody"+i);
				   var dataTR=CreateTR(dataTblBody,"","dataTr"+i);
				   //Compare the record column number with header columns
				   if(frstrwColCnt!=rowsColCnt && i != lastRwNum){
						      mainTabDiv.innerHTML="";
						      $("#tabs").tabs('enable', 0);
							  $("#tabs").tabs('select', 0);
							  $("#tabs").tabs({disabled:[1,2,3]});
							  document.getElementById("loadData_Img").style.display="none";
							  document.body.style.cursor="auto";
							    var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>There is no match between the column numbers in the data header and the records</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
							  break;
					   }
				   }
				   else {
					   var dataTR=CreateTR(dataTblBody,"","dataTr"+i);
					    rowsColCnt=noTDS.length;
					   //Compare the record column number with header columns
                       if(frstrwColCnt!=rowsColCnt && i != lastRwNum){
						      mainTabDiv.innerHTML="";
						      $("#tabs").tabs('enable', 0);
							  $("#tabs").tabs('select', 0);
							  $("#tabs").tabs({disabled:[1,2,3]});
							  document.getElementById("loadData_Img").style.display="none";
							  document.body.style.cursor="auto";
							     var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>There is no match between the column numbers in the data header and the records</td></tr></table>";
							    $.prompt(prmptTxt,{
								   buttons: { OK: true},
								   show:'slideDown',
								   submit: function(v,m,f){
									   if(v==true)
									   {
										   return;
									   }
								   }
								 });
							  break;
					   }
					   }
				  if(i != lastRwNum){
				   for(var j=0;j<noTDS.length;j++)
						 {
					        if(i==0){
								    var dataTh;
								    dataTh="DataTH-"+j;
								   dataTh =CreateTH(dataTR,"","dataTh"+j);
								    var lblHead=document.createElement("label");
									lblHead.id="lblHead_"+j;
									var cellVal=noTDS[j];
									cellVal=cellVal.trim();
									cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
									cellVal=cellVal.trim();
									lblHead.innerHTML=cellVal;
									dataTh.appendChild(lblHead);
									var innerHtmlTxt=dataTh.innerHTML;
									innerHtmlTxt=innerHtmlTxt+"<br/><select name='enttSelect' id='enttBox-"+j+"' style='width:120px' title='Entity' onchange='loadEnttColmns(this.value,this.id)'></select>";
								    innerHtmlTxt=innerHtmlTxt+"<br/><select name='fieldSelect' id='selectBox-"+j+"' title='Import to field' style='width:120px' onchange='checkSameOption(this.value,this.id)'></select>";
								    dataTh.innerHTML=innerHtmlTxt;
									var fieldDropDn=document.getElementById("selectBox-"+j);
							   }
							else{
								     var dataTd=CreateTD(dataTR,"","dataTd_"+i+"_"+j); 
							         var cellVal=noTDS[j];
									cellVal=cellVal.trim();
									cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
									cellVal=cellVal.trim();
                                    dataTd.innerHTML=cellVal;
								 if(isNaN(cellVal))
									{
                                       dataTd.align="left";
									}
									else dataTd.align="right";
							   }
						 }
		             }
					 else{
					   for(var j=0;j<frstrwColCnt;j++)
						 {
							 var dataTd=CreateTD(dataTR,"","dataTd_"+i+"_"+j);
							 var cellVal="";
							 if(noTDS[j]) cellVal=noTDS[j];
							 cellVal=cellVal.trim();
							 cellVal=cellVal.replace(/(^\")|(\"$)/g, "");
							 cellVal=cellVal.trim();
							 dataTd.innerHTML=cellVal;
							 if(isNaN(cellVal))
							   {
								  dataTd.align="left";
							   }
							 else dataTd.align="right";
						 }
				   }
			     }
			$(document).ready(function() {
				var oTable=$('#gridMain').dataTable({
								  "bJQueryUI": true,
								  "bPaginate": false,
								  "bSort": false,
								  "bInfo": false,
								  "asStripClasses": null,
								  "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
								  "sScrollY":reqdHt,
								  "fnInitComplete": function(oSettings, json) {
									  document.getElementById("loadData_Img").style.display="none";
									  document.body.style.cursor="auto";
									   var mainTableDiv=document.getElementById("gridMain_wrapper");
									  mainTableDiv.style.position="relative";
									  mainTableDiv.style.top="-8px";
									  var scrnWidth=$(window).width();
										if(scrnWidth>1200)
										{
										  document.getElementsByClassName("dataTables_scroll")[0].style.width="1190px";
										}
										else if(scrnWidth>950)
										{
										 document.getElementsByClassName("dataTables_scroll")[0].style.width="954px";
										}
									   document.getElementsByClassName("dataTables_scroll")[0].style.overflowX="auto";
									   var widthReq=document.getElementsByClassName("dataTables_scrollHeadInner")[0].style.width;
									   widthReq=widthReq.replace("px","");
									   var widthOrgnl=document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width;
									   widthOrgnl=widthOrgnl.replace("px","");
									   if(widthOrgnl<widthReq) {
									      document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width=widthReq+"px";
									      document.getElementsByClassName("dataTables_scrollBody")[0].style.width=widthReq+"px";
										}
									   var tableWidth=document.getElementsByClassName("dataTables_scroll")[0].style.width;
									   tableWidth=tableWidth.replace("px","");
									   if(parseInt(tableWidth)>parseInt(widthReq))
										  {
											document.getElementsByClassName("dataTables_scrollHead ui-state-default")[0].style.width=tableWidth+"px";
											document.getElementsByName("gridMain")[0].style.width=tableWidth+"px";
											document.getElementsByClassName("dataTables_scrollBody")[0].style.width=tableWidth+"px";
										  }
									},
								  "bScrollCollapse": true
								});
			});
		populateSelectBoxes();
		populateLnkEntts();
		titleIndex=0;
		splitTitleIndex=0;
		}
	  else 
		{ 
		   //alert("Maximum 10,000 records can be uploaded");
		   var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>Maximum 10,000 records can be uploaded</td></tr></table>";
			$.prompt(prmptTxt,{
				buttons: { OK: true},
				show:'slideDown',
				submit: function(v,m,f){//checkContinue(v,fieldIdList);
					if(v==true)
					{
					   return;
					}
				}
			});
		   mainTabDiv.innerHTML="";
		   $("#tabs").tabs('enable', 0);
		   $("#tabs").tabs('select', 0);
		   $("#tabs").tabs({disabled:[1,2,3]});
	  }
}

function delayedAlert()
{
  timeoutID = window.setTimeout(closeDlg, 1500);
}

function closeDlg()
{
   $("#dialog-message").dialog('close');	
}
function populateCkeckList(drpDwnObj)
{
   var entitySel=document.getElementById("entity_select").value;
   $(document).ready(function(){
    var $select = $(drpDwnObj).multiselect();  //apply the plugin
    $select.multiselect('disable');            //disable it initially
	var TblObj= dataJSONTest["entities"][0];
	var L_enttColumns=TblObj['enttColumns'];
	var drpDwnCnt=0;
		for(j=0;j<L_enttColumns.length;j++)
			{
			 try			
			  {
				var L_inner_tds_data =L_enttColumns[j]["cols"];
				L_col_id		= L_inner_tds_data[0];
				L_col_Name		= L_inner_tds_data[1];
				if(L_col_Name)
				{
					 drpDwnObj[drpDwnCnt]=new Option(L_col_Name,L_col_id);
					 drpDwnCnt=drpDwnCnt+1;
				}	 
		      }
			 catch (e)
			  {
				continue;
			  }
			}
			$(drpDwnObj).multiselect('refresh');
			$select.multiselect('enable'); 
 });

}

/* Function to load entt columns*/
function getEntityListData()
{
  var entitySel=document.getElementById("entity_select").value;
  var urltxtEnttCol="/atCRM/custom/entityView/enttColsInOrg.htm?entity="+entitySel+"&isUpload=1";
	$.ajax({
			type:"GET",
			url:urltxtEnttCol,
			async:false,
			dataType:"json",
			success: function (data)
			{
               dataJSONTest=eval(data);
			}
			});
}

//Function to populate the entt columns select box on load of the page
function populateSelectBoxes()
{
    var fieldSelects=document.getElementsByName("fieldSelect");  //select boxes 
	var NoOfSelects=fieldSelects.length;
	/************map JSON ***********/
	var doMap = 0;
	if(mapJSON && mapJSON !=""){
		var locMapJSON  = mapJSON;
		var selectsData = locMapJSON[1]["tableSelects"];
		var selectsLen  = selectsData.length;
		if(NoOfSelects == selectsLen) doMap = 1;
      }
	/************map JSON ***********/
	var TblObj= dataJSONTest["entities"][0];
	var L_enttColumns=TblObj['enttColumns'];
	for(var k=0;k<NoOfSelects;k++)
	{
        var drpDwnObj=fieldSelects[k];
		var drpDwnObjId=drpDwnObj.id;
		var headLblId="lblHead_"+k;
		var headLbl=document.getElementById(headLblId).innerHTML;
		headLbl=headLbl.trim();
        drpDwnObj[0]=new Option("<Do not import>","");
	    var drpDwnCnt=1;
		for(j=0;j<L_enttColumns.length;j++)
			{
			 try			
			  {
				var L_inner_tds_data =L_enttColumns[j]["cols"];
				L_col_id		= L_inner_tds_data[0];
				L_colDesc_Name		= L_inner_tds_data[1];
				L_col_name		= L_inner_tds_data[7];
				L_isMandatory   = L_inner_tds_data[9];
				var new_col_name=L_col_name.toLowerCase();
				if(new_col_name!="created_by"&&new_col_name!="created_date"&&new_col_name!="createddate"&&new_col_name!="createdby"&&new_col_name!="createdby_id"&&new_col_name!="modified_by"&&new_col_name!="modified_date"&&new_col_name!="modifiedby"&&new_col_name!="modifieddate"&&new_col_name!="modifiedby_id"){
				if(L_colDesc_Name)
				{
					 drpDwnObj[drpDwnCnt]=new Option(L_colDesc_Name,L_col_id);
					 if(L_isMandatory == "0") drpDwnObj.options[drpDwnCnt].style.color="red";
					 drpDwnCnt=drpDwnCnt+1;
				}
				}
		      }
			 catch (e)
			  {
				continue;
			  }
			}
			  if(doMap == 1){
				   var selVal = selectsData[k]["enttCol"];
                   $("#"+drpDwnObjId).val(selVal).attr('selected',true);
			  }
			  else{
				  drpDwnObj[0].selected = true;
				  //Select option text if matches with Head label 
				  for(var i=0; i<drpDwnObj.length; i++)
					{
					  var optionName=drpDwnObj.options[i].text;
					  var ptrnVal=new RegExp(headLbl,"gi");
					  if(ptrnVal.test(optionName))
						{
						 drpDwnObj[i].selected = true;
						 break;
						}
					}
			  }
	}
	//Set dropdown options of reload after title split
	if(reloadPageInd==1)
	{
		 var titleIndex=0;
        for(var k=0;k<NoOfSelects;k++)
		   {
			   var drpDwnObj=fieldSelects[k];
		       var drpDwnObjId=drpDwnObj.id;
			   var headLblId="lblHead_"+k;
		       var headLbl=document.getElementById(headLblId).innerHTML;
		       headLbl=headLbl.trim().toLowerCase();
			   if(titleIndex==1)
			   {
                  var index=DrpDwnIndexArray[k-1];
                  drpDwnObj[index].selected = true;
			   }
               if(headLbl!="title"&&titleIndex==0){   
			   var index=DrpDwnIndexArray[k];
               drpDwnObj[index].selected = true;
			   }
			   else{titleIndex=1;}
		   }
		   checkedIndex=1;
	}
}

var continueVal="0";
var checkedIndex=0;
function validateData()
{
	        drpDwnIds="";                   /*To initiate the global variable everytime this function called*/
			countNum=0;
			countCheck=0;
			countDate=0;
			countDateTime=0;
			var fieldSelects=document.getElementsByName("fieldSelect");
			var NoOfSelects=fieldSelects.length;
			var fieldIdList="";
			var notSelectLbls="";
			var notSelectLblList="";
			for(var k=0;k<NoOfSelects;k++)
			{
				var drpDwnObj=fieldSelects[k];
				var fieldId=drpDwnObj.value;
				if(fieldId){
					if(fieldIdList=="")
					{
						fieldIdList=fieldId;
					}
					else {fieldIdList=fieldIdList+","+fieldId;}
				}
				else
				{
					var notSelectLblId="lblHead_"+k;
					var notSelLbl=document.getElementById(notSelectLblId).innerHTML;
					if(notSelectLbls=="")
					{
						notSelectLbls=notSelLbl;
					}
					else {notSelectLbls=notSelectLbls+", "+notSelLbl;}
				}
			}
			notSelectLblList=notSelectLbls.split(",")
			if((notSelectLblList!="")&&(notSelectLblList.length>0)&&checkedIndex==0)
			{
				var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>You have not mapped the data in column/s&nbsp;<b>"+notSelectLbls+"</b>&nbsp;in your import file to Impel fields</td></tr><tr><td style='height:10px'></td></tr><tr><td align='center' style='font-size:12px;font-family:tahoma;font-weight:normal'>Are you sure you want to continue importing the rest of the data?</td></tr></table>";
				$.prompt(prmptTxt,{
						 buttons: { Yes: true, No: false },
						 show:'slideDown',
						 submit: function(v,m,f){checkBtnVal(v,fieldIdList);}
					  });
			}
			else
			{
			  var checkMsg=validateMandatoryCols();
			  if(checkMsg==0){
				 vaidateNow(fieldIdList) ;
			  }
			  else{
				  document.getElementById("error_span").innerHTML=checkMsg;
				  document.getElementById("error_span").style.display="inline";
				  setTimeout("document.getElementById('error_span').style.display='none'",6000);
			  }
			}
}
function checkBtnVal(btnVal,validateIds)
{
	if(btnVal)
	{
	  document.getElementById("jqibox").style.display="none";
	  continueVal="1";
	 // vaidateNow(validateIds) ;
      var checkMsg=validateMandatoryCols();
	  if(checkMsg==0){
	     vaidateNow(validateIds) ;
	  }
	  else{
		  document.getElementById("error_span").innerHTML=checkMsg;
		  document.getElementById("error_span").style.display="inline";
		  setTimeout("document.getElementById('error_span').style.display='none'",6000);
	  }
	}
	else
	{
		return;
	}
}
var jsonData;
var drpDwnIds="";
function vaidateNow(fieldIdList)
 {
     var compareVals="";
	 var urlForValues="/atCRM/custom/JSON/system/getFieldValuesForEnttCol.htm?fieldIds="+fieldIdList;
	 $.ajax({
			type: "GET",		
			url:urlForValues,
			dataType: "json",
			beforeSend: function() {
				$('#loadData_Img').show();
				document.body.style.cursor="wait";
			},
			complete: function(){
				$('#loadData_Img').hide();
                document.body.style.cursor="auto";
			},
			success: function (doc)
			{
			  jsonData=doc;
              var valueData=doc["getValues"];
			  var dataLen=valueData.length;
			  var errorFields ="";
			  for(var i=0;i<dataLen;i++)
				{
                  var valueInnerData=valueData[i]["fieldId"];
				  for(var t=1;t<valueInnerData.length;t++)
					{
						var valueNameData=valueInnerData[t];
						if(valueNameData["Error"])
						{
							if(errorFields =="") errorFields=valueNameData["Error"];
							else errorFields=errorFields+","+valueNameData["Error"];
						}
					}
				   if(drpDwnIds=="")
					{
                     drpDwnIds=valueInnerData[0];                //field id's dropDown
					}
					else
					{
					 drpDwnIds=drpDwnIds+","+valueInnerData[0];
					}
				}
				if(errorFields =="") findSelectBox();
				else {
					  var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''>It seems there is a mis-configuration for the Impel field/s <b>"+errorFields+"</b>  Please contact your sys admin to fix this. In the meantime, in this import, you can change the mapping of data in that column to '<do not import>' and continue with your importing data.</td></tr></table>";
				       $.prompt(prmptTxt,{
						   buttons: { OK : true},
						   show:'slideDown',
						   submit: function(v,m,f){
							   if(v==true)
							   {
								 return;
							   }
						   }
					    });
				}
			},
			error:function() 																							  
				{
					var prmptTxt="<table style='width:390px'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal''It seems there is a mis-configuration for the Impel field/s.</td></tr></table>";
					$.prompt(prmptTxt,{
						buttons: { OK: true},
						show:'slideDown',
						submit: function(v,m,f){
							if(v==true)
							{
							   return;
							}
						}
					});
				}
	 });
}
//Function to find out any opened select boxes on the table
function findSelectBox()
{
	var foundSelect=0;
	$('#gridMain tr').each(function(){                                   //Iterate through the table rows
	$(this).find('td').each(function(){  
        var cellVal=$(this).html();
		var cellId= $(this).attr('id');
		var columnInd=($(this).parent("tr").children().index(this));
		var textTpCompare=/<select/i;
		if(textTpCompare.test(cellVal))
			{
			  foundSelect=foundSelect+1;
			}
		});
	});
	if(foundSelect>0)
	{
		alert("Select any value for the opened select box");
		return;
	}
	else
	{
		if((entityName.toLowerCase()=="contact")&&titleIndex==0)
		{
	      var retVal=checkForTitleOrGender();    //check for title column in the table 
		  if(retVal=="0")
			{
			  validateTbldata();
              startCompare();
			}
			else {       
				   var urlTitle="/atCRM/custom/JSON/system/getTitleList.htm";
					 $.ajax({
							type: "GET",		
							url:urlTitle,
							dataType: "json",
							async:false,
							success: function (doc)
							{
							  titleDoc=eval(doc);  
							}
					 });
                   checkTitleInName();          //This will check for the existance of Title,if not ask for creation of newColumn
			}
		}
		else{
		  validateTbldata();
          startCompare();
		}
	}
}
function checkForTitleOrGender()
{
   	 var headSelects=document.getElementsByName("fieldSelect");
	 var NoOfSelects=headSelects.length;
     for(var k=0;k<NoOfSelects;k++)
	   {
		  var selectObj=headSelects[k];
		  var fieldId=selectObj.value;
          var selectId=selectObj.id;
          var drpBwnVal=$(selectObj).find(":selected").text();
          var patt=/title/i;
		  if(patt.test(drpBwnVal))
		   {
              return "0";
		   }

	   }
}
var columnIndex;
var firstNameArray=new Array();
var dispNameArray=new Array();
function checkTitleInName()
{	 
	 var headSelects=document.getElementsByName("fieldSelect");
	 var NoOfSelects=headSelects.length;
	 var foundA=0;
	 var foundB=0;
	 var foundSelectNames;
	 var fieldIds;
	 var cellFrstName=null;
	 var cellDispName=null;
     for(var k=0;k<NoOfSelects;k++)
	   {
		  var selectObj=headSelects[k];
		  var fieldId=selectObj.value;
          var selectId=selectObj.id;
		  var colInd=selectId.replace("selectBox-","");
          var drpBwnVal=$(selectObj).find(":selected").text();
		  var ptrnValA=/first[\s*]+name/gi;
	      var ptrnValB=/display[\s*]+name/gi;
          var ptrnValAA=new RegExp("firstname","i");
		  var ptrnValBB=new RegExp("displayname","i");
		  var matchA=ptrnValA.test(drpBwnVal);
		  var matchB=ptrnValB.test(drpBwnVal);
          var matchAA=ptrnValAA.test(drpBwnVal);
		  var matchBB=ptrnValBB.test(drpBwnVal);

			if(matchA||matchAA)
				{
				    var cnt=0;
					firstNameInd=1;                                            //First name exist check index
				  	$('#gridMain tr').each(function(){                                   //Iterate through the table rows
					$(this).find('td').each(function(){  
						var cellVal=$(this).html();
						var cellId= $(this).attr('id');
						var columnInd=($(this).parent("tr").children().index(this));
						   if(colInd==columnInd)
							{
                               	  var valueData=titleDoc["getTitles"];
								  var dataLen=valueData.length;
								  //start comparing with the json data
								  for(var i=0;i<dataLen;i++)
									{
									  var titleName=valueData[i]["titleName"];
									  var ptrnVal=new RegExp("^"+titleName,"i");
									  if(ptrnVal.test(cellVal))
						                {
                                          foundA=foundA+1;
										  if(foundSelectNames) foundSelectNames=foundSelectNames+","+drpBwnVal;
										  else foundSelectNames=drpBwnVal;
										  var nameTitle;
										  if(cellVal.indexOf(".")>-1) nameTitle=cellVal.split(".");
										  else if(cellVal.indexOf(" ")>-1) nameTitle=cellVal.split(" ");
										  if(nameTitle) cellFrstName=nameTitle[0];
										}
									}
									return false;
							}
						});
						firstNameArray[cnt]=cellFrstName;
						cellFrstName=null;
						cnt=cnt+1;
					});
				}
				else if(matchB||matchBB)
				   {
					var cnt=0;
					dispNameInd=1;                                          // display name exist check index
						$('#gridMain tr').each(function(){                                   //Iterate through the table rows
						$(this).find('td').each(function(){  
							var cellVal=$(this).html();
							var cellId= $(this).attr('id');
							var columnInd=($(this).parent("tr").children().index(this));
							   if(colInd==columnInd)
								{
									  var valueData=titleDoc["getTitles"];
									  var dataLen=valueData.length;
									  //start comparing with the json data
									  for(var i=0;i<dataLen;i++)
										{
										  var titleName=valueData[i]["titleName"];
										  var ptrnVal=new RegExp("^"+titleName,"i");
										  if(ptrnVal.test(cellVal))
											{
											  foundB=foundB+1;
											  if(foundSelectNames) foundSelectNames=foundSelectNames+","+drpBwnVal;
										      else foundSelectNames=drpBwnVal;
											 var valLength=parseInt(cellVal.length);
											 var nameTitle;
										     if(cellVal.indexOf(".")>-1) {nameTitle=cellVal.split(".");}
										     else if(cellVal.indexOf(" ")>-1&&cellVal.split(" ")[0].length<5){ nameTitle=cellVal.split(" ");}
										     if(nameTitle) cellDispName=nameTitle[0];
											}
										}
								}
							});
							dispNameArray[cnt]=cellDispName;
							cellDispName=null;
							cnt=cnt+1;
						});
				   }
				   if(fieldId) fieldIds=fieldIds+","+fieldId;
				   else fieldIds=fieldId;
	     }
	if(foundA>0||foundB>0)
		   {
		       var selectNames=foundSelectNames.split(",");
			   var foundNameList;
			   for(i=0;i<selectNames.length;i++)
			   {
				    var firstName=selectNames[0];
					var secondName;      
					if(i!=0&&selectNames[i]==firstName) continue;
					else if(secondName&&secondName==selectNames[i])  continue;
					else 
					   {
						 if(foundNameList) {
							 foundNameList=foundNameList+", "+selectNames[i];
							 secondName=selectNames[i];
							 }
						 else foundNameList=selectNames[i];
					   }
			   }
               columnIndex=colInd;
               var dispTxt="<table style='width:100%'><tr><td style='font-size:12px;font-family:tahoma;font-weight:normal'>Your data in the column <label style='font-weight:bold;'>"+foundNameList+"</label> contains Titles. I can parse that out and show the <label style='font-weight:bold;'>'Title'</label> in a seperate column, So that your data is more meaningful.</td></tr><tr><td style='height:25px;font-size:12px;font-family:tahoma;font-weight:normal;'> Would you like me to do that? If you say 'No' I will leave your data unchanged.</td></tr><tr><td align='center' style='font-size:12px;font-family:tahoma'></td></tr></table>";
				$.prompt(dispTxt,{
						 buttons: { Yes: true, No: false },
						 show:'slideDown',
						 submit: function(v,m,f){checkBtnValForTitle(v,fieldIds);}
					  });
		   }
		   else
		   {
				validateTbldata();
                startCompare();
		   }
}
function checkBtnValForTitle(btnVal,validateIds)
{
	if(btnVal)
	{
	 splitColumnForTitle();
	}
	else
	{
		titleIndex=1;
		validateTbldata();
        startCompare();
	}
}
function validateTbldata()
{
	  errDataTds=null;
	  var mainEntityId=document.getElementById("entity_select").value;
	  var enttSelects=document.getElementsByName("enttSelect");
	  var NoOfSelects=enttSelects.length;
	  var fieldType;
	  var is_Mandatory;
	  for(var k=0;k<NoOfSelects;k++)
	   {
		    var enttDrpDwnObj= enttSelects[k];
			var enttDrpDwnObjId=enttDrpDwnObj.id;
			var enttSelectedId=enttDrpDwnObj.value;
			var fieldObjId=enttDrpDwnObjId.replace("enttBox","selectBox");
            var drpDwnObj= document.getElementById(fieldObjId);                  //fieldSelects[k];
		    var fieldId=drpDwnObj.value;
            var drpDwnObjId=drpDwnObj.id;
		    var fieldText=$(drpDwnObj).find(":selected").text();
            var colIndex=drpDwnObjId.replace("selectBox-","");
			if(fieldId=='') continue;
            /*Check entt_column of  Main entity or Link entity*/
			  if(mainEntityId==enttSelectedId)       //If selected entity is main entity
		      {
				  var TblObj= dataJSONTest["entities"][0];
				  var L_enttColumns=TblObj['enttColumns'];
					for(j=0;j<L_enttColumns.length;j++)
						{
							var L_inner_tds_data =L_enttColumns[j]["cols"];
							L_col_id	= L_inner_tds_data[0];
							L_col_Name	= L_inner_tds_data[1];
							L_col_dataType = L_inner_tds_data[4];
							L_isMandatory   = L_inner_tds_data[9];
							L_entt_refTo    = L_inner_tds_data[8];
							if(L_col_id==fieldId)
							{
								fieldType    = L_col_dataType;
								is_Mandatory = L_isMandatory;
								entt_ref_to = L_entt_refTo;
								break;
							}	 
						  }
		      }
			  else{                                //If selected entity is related entity
                    var dataLength=relEntitiesData.length;
				    for(var i=0;i<dataLength;i++)
				    {
					   var enttId=relEntitiesData[i]["Id"];
                       var L_enttColumns=relEntitiesData[i]["enttColumns"];
                       if(enttSelectedId==enttId){
						  for(m=0;m<L_enttColumns.length;m++)
							{
								var L_inner_tds_data =L_enttColumns[m]["cols"];
								L_col_id		= L_inner_tds_data[0];
								L_col_Name		= L_inner_tds_data[1];
								L_col_dataType = L_inner_tds_data[4];
								L_isMandatory   = L_inner_tds_data[9];
								L_entt_refTo    = L_inner_tds_data[8];
								if(L_col_id==fieldId)
							    {
									fieldType=L_col_dataType;
									is_Mandatory = L_isMandatory;
									entt_ref_to = L_entt_refTo;
									break;
							     }	
							}
					   }
				   }
			  }
			/*Check entity and get field type ends here*/
				$('#gridMain tr').each(function(){                                   //Iterate through the table rows
			    $(this).find('td').each(function(){                                  //Iterate through the cells
				if(($(this).parent("tr").children().index(this))==colIndex)          //if the cell index is drpDwn index
				{
				   var cellVal=$(this).html();
				   cellVal = cellVal.trim();
				   var cellId= $(this).attr('id');
				   if((cellVal == "" || cellVal == "NULL") && is_Mandatory =="0" && !entt_ref_to && (fieldType != "Multi" || fieldType != "Combo")) {
					   cellId=cellId+"_mandatory";
                        if(errDataTds)
						{
						   errDataTds=errDataTds+","+cellId;
						}
						else{errDataTds=cellId;}
				   }
				   else if(cellVal && cellVal != "NULL")
					{
					   cellId=cellId+"_"+fieldType;
                     switch(fieldType)
						{
						 case "decimal": 
						 case "double": 
						 case "float": 
						 case "money":
						 case "Decimal":
						 case "Integer":
                         case "integer":
                             if(isNaN(cellVal)){
							   if(errDataTds)
								 {
								   errDataTds=errDataTds+","+cellId;
								 }
							   else{errDataTds=cellId;}
							   countNum=countNum+1;
						     }
							 break;
						 case "dateOnly":
                         case "Date":
						       if(cellVal=='')
							        {
									   return false;
							        }
						        var getDate=chkDate(cellVal);
                                if(getDate=="0")
								 {
                                    if(errDataTds)
										 {
										   errDataTds=errDataTds+","+cellId;
										 }
									   else{errDataTds=cellId;}
                                       countDate=countDate+1;
								 }
								else
								{
                                  cellId=cellId.replace("_"+fieldType,"");
                                  document.getElementById(cellId).innerHTML=getDate;
								}
								break;
                         case "timeOnly":
                         case "dateAndTime":
                         case "DateTime":
						 case "dateTime":
							 //check the date and time format dd/mm/yyyy HH:mm:ss
								  var getDateTime=chkDateTime(cellVal);
								   if(cellVal=='')
							        {
									   return false;
							        }
									if(getDateTime=="0")
									{
										if(errDataTds)
										 {
										   errDataTds=errDataTds+","+cellId;
										 }
									   else{errDataTds=cellId;}
									   countDateTime=countDateTime+1;
									 }
									else
									{
									  cellId=cellId.replace("_"+fieldType,"");
									  document.getElementById(cellId).innerHTML=getDateTime;
									}
								  break;
						 case "Check":
							   if(cellVal != '1' && cellVal != '0'){
									if(errDataTds){
									   errDataTds=errDataTds+","+cellId;
									 }
								    else{
										errDataTds=cellId;
									}
								    countCheck=countCheck+1;
								}
								break;
						}
					}
				}
				});
				});
	   }
}

var indexNext="0";
var realvalues = [];
var textvalues = [];
var selValues = [];
var selectedValues="";
function startCompare()
{
	var fieldIds=drpDwnIds;
	var data=jsonData;
	var drpDwnValFileds=fieldIds.split(",");
	var fieldSelects=document.getElementsByName("fieldSelect");
	var NoOfSelects=fieldSelects.length;
	var notFoundtdIds;
	 for(var k=0;k<NoOfSelects;k++)
	   {
           var drpDwnObj=fieldSelects[k];
		   var fieldId=drpDwnObj.value;
           var drpDwnObjId=drpDwnObj.id;
           var colIndex=drpDwnObjId.replace("selectBox-","");
		   if(fieldId == "") continue;
		   /*check if the field id exist in the returned array of dropdown field entt_column_id's*/
		    for(var j=0;j<drpDwnValFileds.length;j++)
	        { 
			  var fieldType=null;
			  var is_Mandatory;
			  var drpDwnValFiledValId=drpDwnValFileds[j];
			   if(fieldId==drpDwnValFileds[j])
			   {
				 /*Read the field type of the entt_col_id's*/
					var TblObj= dataJSONTest["entities"][0];
					var L_enttColumns=TblObj['enttColumns'];
					for(var m=0;m<L_enttColumns.length;m++)
						{
							var L_inner_tds_data =L_enttColumns[m]["cols"];
							L_col_id		= L_inner_tds_data[0];
							L_col_Name		= L_inner_tds_data[1];
							L_col_dataType  = L_inner_tds_data[4];
							L_isMandatory   = L_inner_tds_data[9];
							if(L_col_id==drpDwnValFiledValId)
							{
								fieldType=L_col_dataType;
								is_Mandatory=L_isMandatory;
								break;
							}	 
						  }
			     /*End here*/
				$('#gridMain tr').each(function(){                            //Iterate through the table rows
			    $(this).find('td').each(function(){                           //Iterate through the cells
				if(($(this).parent("tr").children().index(this))==colIndex)   //if the cell index is drpDwn index
				{
					var cellVal=$(this).html();
					cellVal=cellVal.trim();
					var cellId= $(this).attr('id');
					if((cellVal == "" || cellVal == "NULL") && is_Mandatory =="0"){
						cellId=cellId+"_mandatory";
                        if(notFoundtdIds)
						{
						   notFoundtdIds=notFoundtdIds+","+cellId;
						}
						else{notFoundtdIds=cellId;}
				     }
					else if(cellVal && cellVal != "NULL")
					{
					  var valueData=data["getValues"];
					  var dataLen=valueData.length;
					  var found=0;
					 if(fieldType=="Multi")
					  {
						  var SepVal;
						  var delimeter="";;
						  var splitCelVal;
						  var fieldSeperator=document.getElementsByName("FldSepRad");
						  for(var i=0;i<fieldSeperator.length;i++)
							{
								if(fieldSeperator[i].checked==true)
								{
								   SepVal=fieldSeperator[i].value;
								}
							} 
						if(cellVal){
						  if(SepVal=="1"){
						      splitCelVal=cellVal.split(";");
							  delimeter=";";
						  }
						  else if(SepVal=="2"){
							  splitCelVal=cellVal.split(";");
							  delimeter=";";
						  }
						  else {
							  splitCelVal=cellVal.split("~");
							  delimeter="~";
						  }
						  var valLen = splitCelVal.length;
						  for(var c=0;c< splitCelVal.length;c++)
                            {
							  var splitValue=splitCelVal[c];
							  var newCellValue;
							  for(var i=0;i<dataLen;i++)
									{
									  var valueInnerData=valueData[i]["fieldId"]; 
									  if(valueInnerData[0]==fieldId)
										{
										  for(var t=1;t<valueInnerData.length;t++)
											{
											  if(valueInnerData[t]["NoValue"]||valueInnerData[t]["Error"])
												{
												  found++;
												  continue;
												}
											  else
									            {
												  var valueNameData=valueInnerData[t];
												  var valueName=valueNameData["valueName"];
												  var newValuName=valueName.toLowerCase();
												  splitValue=splitValue.toLowerCase();
												  if(splitValue&&(splitValue==newValuName))
													{
														found++;
														if(newCellValue){newCellValue=newCellValue+delimeter+valueName;}
														else{ newCellValue=valueName;}
													}
												}
											}
                                            if(found==0) break;
										}
									}
							 if(found == parseInt(valLen))
								{
								 document.getElementById(cellId).innerHTML=newCellValue;
								}
							 if(found==0)
								{
								    cellIdAlt=cellId+"_"+fieldType;
									if(notFoundtdIds){notFoundtdIds=notFoundtdIds+","+cellIdAlt;}
									else{ notFoundtdIds=cellIdAlt;}
									break;
								}
								found=0;
							}
						} 
					
					}
					else{
					  //start comparing with the json data
					  for(var i=0;i<dataLen;i++)
						{
						  var valueInnerData=valueData[i]["fieldId"]; 
						  if(valueInnerData[0]==fieldId)
							{
							  for(var t=1;t<valueInnerData.length;t++)
								{

								  if(valueInnerData[t]["NoValue"]||valueInnerData[t]["Error"])
									{
									  found++;
									  continue;
									}
								  else
									{
									  var valueNameData=valueInnerData[t];
									  var valueName=valueNameData["valueName"];
									  var newValuName=valueName.toLowerCase();
									  cellVal=cellVal.toLowerCase();
									  if(cellVal==newValuName||!cellVal)
										{
											found=found+1;
											if(cellVal==newValuName) document.getElementById(cellId).innerHTML=valueName;
										}
								    }
								}
							}
						}
						if(found==0)
						{
							if(notFoundtdIds){notFoundtdIds=notFoundtdIds+","+cellId;}
							else{ notFoundtdIds=cellId;}
						}
				  }
				}
				}
		   });
		  }); 
		 }
        }
	   }
	   if(notFoundtdIds||errDataTds){
		   displayErrorMsg(notFoundtdIds);
		   }
	  else{
          if(indexNext=="0"){
				  createEnttColArray();                //createEnttColAray for data post
				  showConditionPage();
	    }
		else
			{
			     createEnttColArray();                //createEnttColAray for data post
			     if(!notFoundtdIds&&errDataTds==null){
					 showConditionPage();
				 }
				 $('#error_div').dialog('close'); 
				 var nextImg=document.getElementById("imgNext2");
				 nextImg.setAttribute("onclick","javascript:showConditionPage();");
			}
	  }  
   }
var firstErLen=0;
/* Function to display error msg for foreign or multi and combo fields */
function displayErrorMsg(tdIds)
 {
  var splitTds;
  if(tdIds)
   {
	splitTds=tdIds.split(",");
	var tdsLen=splitTds.length;
	firstErLen=tdsLen;
	document.getElementById("error_div").innerHTML = "";
	$('#error_div').html("");
		$('#error_div').dialog('open');
		$('#error_div').dialog({
			autoOpen:true,			
			minHeight:180,
			minWidth:275,	
			height:'auto',
			width:'auto',
			closeOnEscape:true,
			close: function(event, ui) {
				 var nextImg=document.getElementById("imgNext2");
				 nextImg.setAttribute("onclick","validateData();"); 
				 }
			});	
	$('#error_div').dialog({ title:'Data errors'});
	$('#error_div').html("<table id='errTable' align='center' style='width:100%;overflow:scroll'></table>");
    var tblError=document.getElementById("errTable");
	var errorThead=CreateThead(tblError,"","errorThead");
	var errorTRHd=CreateTR(errorThead,"","errTrHead");
    var errTh1 =CreateTH(errorTRHd,"errThStyle","errTh1","Row","center","Row index");
	var errTh2 =CreateTH(errorTRHd,"errThStyle","errTh2","Column","center","Column index");
	var errTh3 =CreateTH(errorTRHd,"errThStyle","errTh3","Error message","center");
    var errorTblBody=CreateBody(tblError,"","errTbody");
	for(var i=0;i<tdsLen;i++)
	{
		var fieldType=null;
		var tdPart=splitTds[i];
		var tdIdSplit=tdPart.split("_");
		var tdRow=tdIdSplit[1];
		var tdCol=tdIdSplit[2]*1;
        if(tdIdSplit[3]) fieldType=tdIdSplit[3];
		var drpDwnId="selectBox-"+tdCol;
		var drpDwnObj=document.getElementById(drpDwnId);
        tdCol=tdCol+1;
		var tdVal
		if(!fieldType) tdVal=document.getElementById(tdPart).innerHTML;
		else {
            tdPart=tdIdSplit[0]+"_"+tdIdSplit[1]+"_"+tdIdSplit[2];
			tdVal=document.getElementById(tdPart).innerHTML;
		}
		//var tdVal=document.getElementById(tdPart).innerHTML;
		var drpBwnVal=$(drpDwnObj).find(":selected").text();
		/* If td value is multi  */
    /*    if(fieldType&&fieldType=="Multi"){
               var SepVal;
			   var splitCelVal=getSeperatorValue(tdVal);
			   var fieldSeperator=document.getElementsByName("FldSepRad");
			   for(var r=0;r<fieldSeperator.length;r++)
				 {
				   if(fieldSeperator[r].checked==true)
					 {
					   SepVal=fieldSeperator[r].value;
					 }
				  } 
				if(tdVal){
					if(SepVal=="1"){
					    splitCelVal=tdVal.split(";");
					}
					else if(SepVal=="2"){
						splitCelVal=tdVal.split(";");
					}
					else {
						splitCelVal=tdVal.split("~");
					}
				var valLen=splitCelVal.length; 
				}
		    var errorTr=CreateTR(errorTblBody,"","errTr_"+i);
			for(var k=0;k<3;k++)
			{
				var errorTd=CreateTD(errorTr,"","errTd_"+k);
				if(k==0)
				{
				  errorTd.innerHTML=tdRow;
				  errorTd.align="center";
				}
				else if(k==1)
				{
				  errorTd.innerHTML=tdCol;
				  errorTd.align="center";
				}
				else
				{
				 // errorTd.innerHTML="<a href='#' onclick='showTD("+tdPart+")' id='errLink_"+i+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
				 errorTd.innerHTML="<a href='#' style='color:blue;' id='errLink_"+i+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
				  var linkElem=document.getElementById("errLink_"+i);
				  linkElem.setAttribute("onclick","javascript:showTD('"+tdPart+"','Multi')");
				  linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
				  errorTd.align="left";
				}
			}
		 }*/
		/*Multi case ends here*/
		//else{
		//First row of the page starts here
		var errorTr=CreateTR(errorTblBody,"","errTr_"+i);
		for(var k=0;k<3;k++)
		{
			var errorTd=CreateTD(errorTr,"","errTd_"+k);
			if(k==0)
			{
              errorTd.innerHTML=tdRow;
			  errorTd.align="center";
			}
			else if(k==1)
			{
              errorTd.innerHTML=tdCol;
			  errorTd.align="center";
			}
			else
			{
			 // errorTd.innerHTML="<a href='#' onclick='showTD("+tdPart+")' id='errLink_"+i+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
			 if(fieldType=="mandatory") errorTd.innerHTML="<a href='#' style='color:blue;' id='errLink_"+i+"'>'"+drpBwnVal+"' can not be <b>NULL</b> (Mandatory field)</a>";
			 else errorTd.innerHTML="<a href='#' style='color:blue;' id='errLink_"+i+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
			  var linkElem=document.getElementById("errLink_"+i);
			  // If its multi select send text multi
			  if(fieldType=="Multi") linkElem.setAttribute("onclick","javascript:showTD('"+tdPart+"','Multi')");
              else linkElem.setAttribute("onclick","javascript:showTD('"+tdPart+"','select')");
			  linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
			  errorTd.align="left";
			}
		}
	//  }
	}
  }
  else if(errDataTds)
   {
     document.getElementById("error_div").innerHTML = "";
	$('#error_div').html("");
		$('#error_div').dialog('open');
		$('#error_div').dialog({
			autoOpen:true,			
			minHeight:180,
			minWidth:275,	
			height:'auto',
			width:'auto',
			closeOnEscape:true,
				 close: function(event, ui) {var nextImg=document.getElementById("imgNext2");
				 nextImg.setAttribute("onclick","validateData();"); }
			});	
		$('#error_div').dialog({ title:'Data errors'});
	$('#error_div').html("<table id='errTable' align='center' style='width:100%;overflow:scroll'></table>");
    var tblError=document.getElementById("errTable");
	var errorThead=CreateThead(tblError,"","errorThead");
	var errorTRHd=CreateTR(errorThead,"","errTrHead");
    var errTh1 =CreateTH(errorTRHd,"errThStyle","errTh1","Row","center","Row index");
	var errTh2 =CreateTH(errorTRHd,"errThStyle","errTh2","Column","center","Column index");
	var errTh3 =CreateTH(errorTRHd,"errThStyle","errTh3","Error message","center");
    var errorTblBody=CreateBody(tblError,"","errTbody");
   }
   else{
	    showConditionPage(); 
	   }
	addDataErrorsToDialog();
	document.getElementById("error_div").focus(); 
	document.getElementById("imgNext2").onclick="";
	indexNext="1";
}

//This will appends fieldtype data validation errors to the dialog box
function addDataErrorsToDialog()
{
  if(errDataTds)
	{
	var splitTds=errDataTds.split(",");
	var tdsLen=splitTds.length;
	tdsLen=tdsLen+firstErLen;
	var loopCount=0;
	var rowCount=firstErLen;
	var intRow=0;
	var dateTimeRow=0;
	var dateRow=0;
	var checkRow=0;
	for(var i=firstErLen;i<tdsLen;i++)
	  {
        var tdPart=splitTds[loopCount];
		var tdIdSplit=tdPart.split("_");
		var tdRow=tdIdSplit[1];
		var tdCol=tdIdSplit[2]*1;
		var dataType=tdIdSplit[3];
		var drpDwnId="selectBox-"+tdCol;
		var drpDwnObj=document.getElementById(drpDwnId);
		var tdId="dataTd_"+tdRow+"_"+tdCol;
        tdCol=tdCol+1;
		var tdVal=document.getElementById(tdId).innerHTML;
		var drpBwnVal=$(drpDwnObj).find(":selected").text();
        var errorTblBody=document.getElementById("errTbody");
		//First row of the page starts here
		switch(dataType)
						{
						 case "decimal": 
						 case "double": 
						 case "float": 
						 case "money":
						 case "Decimal":
						 case "Integer":
                         case "integer":
							 if(countNum>15)
								{
							      if(intRow==0){
                                   var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
							       for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<label >'"+drpBwnVal+"' contains invalid data.</label>";
											 // var linkElem=document.getElementById("errLink_"+i);
											 // linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"')");
											 // linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
											  errorTd.align="left";
											}
								      }
									  rowCount=rowCount+1;
									  intRow=1;
							       }   
								}
							 else
								{
								  var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
								  for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML=tdRow;
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML=tdCol;
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<a style='color:blue;' href='#' id='errLink_"+rowCount+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
											  var linkElem=document.getElementById("errLink_"+rowCount);
											  linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"','textbox')");
											  linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
											  errorTd.align="left";
											}
								      } 
                                rowCount=rowCount+1;
								}
							 break;
						 case "dateOnly":
                         case "Date":
							   if(countDate>15)
								{
							      if(dateRow==0){
								   var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
							       for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<label title='Date should be in dd/MM/yyyy format'>'"+drpBwnVal+"' contains more than 15 invalid date format records.</label>";
											  errorTd.align="left";
											}
								      }
									  rowCount=rowCount+1;
									  dateRow=1;
							       }
								}
							 else
								{
								  var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
								  for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML=tdRow;
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML=tdCol;
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<a href='#' style='color:blue;' title='Date should be in dd/MM/yyyy format' id='errLink_"+rowCount+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
											  var linkElem=document.getElementById("errLink_"+rowCount);
											  linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"','textBox')");
											  linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+".(Click to show the cell)";
											  errorTd.align="left";
											}
								      } 
								rowCount=rowCount+1;
								}
						     break;
                         case "timeOnly":
                         case "dateAndTime":
                         case "DateTime":
						 case "dateTime":
							 if(countDateTime>15)
								{
							      if(dateTimeRow==0){
								   var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
							       for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<label title='This field should be in dd/MM/yyyy HH:mm:ss format'>'"+drpBwnVal+"' contains more than 15 invalid date and time format columns.</label>";
											  errorTd.align="left";
											}
								      }
									  rowCount=rowCount+1;
							       }
								   dateTimeRow=1;
								}
							 else
								{
								  var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
								  for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML=tdRow;
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML=tdCol;
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<a href='#' title='Field should be in dd/MM/yyyy HH:mm:ss format' style='color:blue;' id='errLink_"+rowCount+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'</a>";
											  var linkElem=document.getElementById("errLink_"+rowCount);
											  linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"','textBox')");
											  linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
											  errorTd.align="left";
											}
								      } 
								rowCount=rowCount+1;
								}
							 break;
					   case "Check":
						   if(countCheck>15)
							{
						      if(checkRow==0){
                                   var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
							       for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML="--";
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<label >'"+drpBwnVal+"' contains invalid data.It must be '1' or '0'</label>";
											 // var linkElem=document.getElementById("errLink_"+i);
											 // linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"')");
											 // linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
											  errorTd.align="left";
											}
								      }
									  rowCount=rowCount+1;
									  checkRow=1;
							       }   
							}
						   else
							{
							     var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
								  for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML=tdRow;
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML=tdCol;
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<a style='color:blue;' href='#' id='errLink_"+rowCount+"'>'"+tdVal+"' is not a valid '"+drpBwnVal+"'.It must be '1' or '0'</a>";
											  var linkElem=document.getElementById("errLink_"+rowCount);
											  linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"','textbox')");
											  linkElem.title="'"+tdVal+"' is not a valid '"+drpBwnVal+"'.(Click to show the cell)";
											  errorTd.align="left";
											}
								      } 
                                rowCount=rowCount+1;
							}
							break;
							case "mandatory":
								  var errorTr=CreateTR(errorTblBody,"","errTr_"+rowCount);
								  for(var k=0;k<3;k++)
										{
											var errorTd=CreateTD(errorTr,"","errTd_"+k);
											if(k==0)
											{
											  errorTd.innerHTML=tdRow;
											  errorTd.align="center";
											}
											else if(k==1)
											{
											  errorTd.innerHTML=tdCol;
											  errorTd.align="center";
											}
											else
											{
											  errorTd.innerHTML="<a style='color:blue;' href='#' id='errLink_"+rowCount+"'>'"+drpBwnVal+"' can not be <b>NULL</b>(Mandatory field)</a>";
											  var linkElem=document.getElementById("errLink_"+rowCount);
											  linkElem.setAttribute("onclick","javascript:showTD('"+tdId+"','textbox')");
											  linkElem.title=drpBwnVal+"' can not be NULL.(Click to show the cell)";
											  errorTd.align="left";
											}
								      } 
                                rowCount=rowCount+1;
						}
		loopCount=loopCount+1;
	  }
  }
}

function showTD(tdId,elemType)
{
  var tdObj=document.getElementById(tdId);
  tdObj.style.border="1px solid red";
  tdObj.focus();
  //$(tdId).attr("onclick","javascript:EditCell()");
  if(elemType=='select'){
  tdObj.setAttribute("onclick","javascript:EditCell('"+tdId+"')");
  }
  else if(elemType=='Multi'){
    tdObj.setAttribute("onclick","javascript:EditCellMulti('"+tdId+"')");
  }
  else{tdObj.setAttribute("onclick","javascript:EditCellTextBox('"+tdId+"')");}
  tdObj.title="Click to edit the cell";
}

var firstTxt="";
var prevCellText="";
var drpDwnObjId="";

function EditCell(tdId)
{
	var cellObj=document.getElementById(tdId);
	cellObj.title="";
	var celltext=cellObj.innerHTML;
	celltext=celltext.trim();
	if(firstTxt="")
	{
		firstTxt=celltext;
	}else{
	prevCellText=celltext;}
	cellObj.style.border="0px solid red";
    var tdIdSplit=tdId.split("_");
	var colIndex=tdIdSplit[2];
	var colSelectBoxId="selectBox-"+colIndex;
	var fieldId=document.getElementById(colSelectBoxId).value;
	//This will check for already opened select boxes
	$('#gridMain tr').each(function(){                                   //Iterate through the table rows
			    $(this).find('td').each(function(){  
                     var cellVal=$(this).html();
					 var cellId= $(this).attr('id');
					 var columnInd=($(this).parent("tr").children().index(this));
					 var textTpCompare=/<select/i;
					 if(textTpCompare.test(cellVal))
						{
						 var drpId="drpDwnBox-"+columnInd;
						 if(prevCellText=""){
                         retainTdDisp(firstTxt,cellId,drpId,'select');}
						 else{
							 retainTdDisp(prevCellText,cellId,drpId,'select');}
						}
				});
	});
	 //create dropDwm list for the values
	 cellObj.innerHTML="";
	 var drpDwnList=document.createElement('select');	
	 drpDwnList.setAttribute("id","drpDwnBox_"+colIndex);
	 drpDwnList.style.width="100%";
	 drpDwnList.name="selectBox_valid";
	 drpDwnList.setAttribute("onchange","changeTdDisp('"+celltext+"','"+tdId+"','"+drpDwnList.id+"','select')");
	 drpDwnList.setAttribute("onblur","retainTdDisp('"+celltext+"','"+tdId+"','"+drpDwnList.id+"','select')");
 	 //drpDwnList.className="inputFieldClass";
	 cellObj.appendChild(drpDwnList);
	  var valueData=jsonData["getValues"];
	  var dataLen=valueData.length;
      var ntFoundLoop = 0;
	  for(var i=0;i<dataLen;i++)
		{
		 var valueInnerData=valueData[i]["fieldId"]; 
		 var jsonFieldId=valueInnerData[0];              //field id from json data
			if(jsonFieldId==fieldId)
			 {
			 var selectedIndex=0;
			 for(var t=1;t<valueInnerData.length;t++)
				{
				 var valueNameData=valueInnerData[t];
				 var valueName=valueNameData["valueName"];
				 var valueId=valueNameData["valueId"];
				 valueId=valueId.replace(",","");
				 var DrpInd=t-1;
				  if(valueName)
					 {
                      drpDwnList[DrpInd]=new Option(valueName,valueId);
					  var fieldValCompare=new RegExp(celltext,"i");
					  if(fieldValCompare.test(valueName)) selectedIndex =DrpInd+1;
					 }
				}
				drpDwnList.add(new Option("None", ""), drpDwnList.options[0]); 
				drpDwnList[selectedIndex].selected = true;
				drpDwnList.focus();
			}
			else 
			{
				ntFoundLoop++;
			}
		}
		/*If it doesnt find any matching entt column then dont dipslay dropdown and */
		if(ntFoundLoop == dataLen)
	      {
			drpDwnList.style.display="none";
			cellObj.innerHTML=celltext;
			var nextImg=document.getElementById("imgNext2");
     		nextImg.setAttribute("onclick","javascript:validateData();");
	      }
	cellObj.setAttribute("onclick","");
}
function EditCellMulti(tdId)
{
	var cellObj=document.getElementById(tdId);
	cellObj.title="";
	var celltext=cellObj.innerHTML;
	celltext=celltext.trim();
	if(firstTxt="")
	{
	  firstTxt=celltext;
	}else{
	prevCellText=celltext;}
	cellObj.style.border="0px solid red";
    var tdIdSplit=tdId.split("_");
	var colIndex=tdIdSplit[2];
	var colSelectBoxId="selectBox-"+colIndex;
	var fieldId=document.getElementById(colSelectBoxId).value;
	 //create dropDwm list for the values
	   cellObj.innerHTML="";
	   var multiCheckList=CreateSelectBox(cellObj,"","multiSelect_"+tdIdSplit[1]+"_"+colIndex);
	   var multiId=multiCheckList.id;
	  multiCheckList.setAttribute("multiple","multiple");  
	 var valueData=jsonData["getValues"];
	  var dataLen=valueData.length;
	  for(var i=0;i<dataLen;i++)
		{
		 var valueInnerData=valueData[i]["fieldId"]; 
		 var jsonFieldId=valueInnerData[0];              //field id from json data
			if(jsonFieldId==fieldId)
			 {
			 for(var t=1;t<valueInnerData.length;t++)
				{
				 var valueNameData=valueInnerData[t];
				 var valueName=valueNameData["valueName"];
				 var valueId=valueNameData["valueId"];
				 valueId=valueId.replace(",","");
				 var DrpInd=t-1;
				  if(valueName)
					 {
                      multiCheckList[DrpInd]=new Option(valueName,valueId);
					 }
				}
			}
		}
	  var splitCellTxt=getSeperatorValue(celltext);
	  if(splitCellTxt){
	  for(var t=0;t<splitCellTxt.length;t++)
		{
           var splitVal=splitCellTxt[t];
		   splitVal=splitVal.toLowerCase();
			for ( var i = 0, l = multiCheckList.options.length, o; i < l; i++ )
			{
			  var o = multiCheckList.options[i];
			  var optionTxt = o.text;
			  optionTxt=optionTxt.toLowerCase();
			  if (splitVal == optionTxt )
			  {
				o.selected = true;
			  }
			}
		}
	  }
      $(document).ready(function(){                          //Apply jquery multiselect
						$("#"+multiId).multiselect();
				 });
	 multiCheckList.setAttribute("onblur","changeTdDisp('"+celltext+"','"+tdId+"','"+multiCheckList.id+"','Multi')");
	 $("#"+multiId).bind("multiselectclose", function(event, ui){
	      changeTdDisp(celltext,tdId,multiCheckList.id,"Multi");
      });
	cellObj.setAttribute("onclick","");
}
function changeTdDisp(cellTxt,tdId,Objid,elemType)
{
   var cellObj=document.getElementById(tdId);
   if(elemType=='select')
	{
	   var drpDownObj=document.getElementById(Objid);
	   drpDownObj.setAttribute("onblur","");
	   var drpdwnVal=$(drpDownObj).find(":selected").text();
	   drpDownObj.style.display="none";
	   if(drpdwnVal=="None") cellObj.innerHTML="NULL";
	   else cellObj.innerHTML=drpdwnVal;
	   drpDownObj.setAttribute("onblur","retainTdDisp('"+cellTxt+"','"+tdId+"','"+Objid+"','select')");
	   cellObj.setAttribute("onclick","javascript:EditCell('"+tdId+"')");
   }
   else if(elemType=='Multi')
	{
	   var multiCheckList=document.getElementById(Objid);
	  //  var $select = $(multiCheckList).multiselect();  //apply the plugin
    //    $select.multiselect('disable');            //disable it initially
	   var selectedVals="";
	   for ( var i = 0, l = multiCheckList.options.length, o; i < l; i++ )
			{
			  var o = multiCheckList.options[i];
			  var optionTxt = o.text;
			  /*Get the field seperator type*/
			  var SepVal;
			  var splitCelVal;
			  var fieldSeperator=document.getElementsByName("FldSepRad");
			  for(var r=0;r<fieldSeperator.length;r++)
				{
				  if(fieldSeperator[r].checked==true)
					{
					  SepVal=fieldSeperator[r].value;
					  break;
					}
				} 
				/*Get field seperator ends here*/
			  if (o.selected==true)
			  {
				 if(selectedVals=="") selectedVals=optionTxt;
				 else{ 
					 if(SepVal=="1"||SepVal=="2"){
						 selectedVals=selectedVals+";"+optionTxt;
					 }
					 else {
						 selectedVals=selectedVals+"~"+optionTxt;
					 }
				 }
			  }
			}
	//	$(multiCheckList).multiselect('refresh');
	//	$select.multiselect('enable'); 
	    multiCheckList.style.display="none";
	   cellObj.innerHTML=selectedVals;
	   cellObj.setAttribute("onclick","javascript:EditCellMulti('"+tdId+"')");
	  /* var drpDownObj=document.getElementById(Objid);
	   drpDownObj.setAttribute("onblur","");
	   var drpdwnVal=$(drpDownObj).find(":selected").text();
	   drpDownObj.style.display="none";
	   if(drpdwnVal=="None") cellObj.innerHTML="";
	   else cellObj.innerHTML=drpdwnVal;
	   drpDownObj.setAttribute("onblur","retainTdDisp('"+cellTxt+"','"+tdId+"','"+Objid+"','select')");
	   */
	}
   else{
       var textBoxObj=document.getElementById(Objid);
	   textBoxObj.setAttribute("onblur","");
	   var txtBoxVal=textBoxObj.value;
	   if(txtBoxVal=='')
	   {
		   var r=confirm("There is no value. Do you wish to continue?");
		   if(r==true) 
		   {
			 textBoxObj.style.display="none";
	         cellObj.innerHTML=txtBoxVal;
             if(isNaN(txtBoxVal)) cellObj.align="Left";
			 else cellObj.align="right";
			 textBoxObj.setAttribute("onblur","retainTdDisp('"+cellTxt+"','"+tdId+"','"+Objid+"','textBox')");
			 cellObj.setAttribute("onclick","javascript:EditCellTextBox('"+tdId+"')");
		   }
		   else return true;
	   }
	   else{
             textBoxObj.style.display="none";
	         cellObj.innerHTML=txtBoxVal;
             if(isNaN(txtBoxVal)) cellObj.align="Left";
			 else cellObj.align="right";
			 textBoxObj.setAttribute("onblur","retainTdDisp('"+cellTxt+"','"+tdId+"','"+Objid+"','textBox')");
			 cellObj.setAttribute("onclick","javascript:EditCellTextBox('"+tdId+"')");
	   }
	   
   }   
   
   cellObj.title="Click to edit cell";
   countNum=0;
   countDateTime=0;
   validateTbldata();
   startCompare();
}
function retainTdDisp(prevTxt,tdId,objId,elemType)
{
	var cellObj=document.getElementById(tdId);
	var found=0;
	if(elemType=='select')
	{
	var drpDownObj=document.getElementById(objId);
	drpDownObj.style.display="none";
	cellObj.setAttribute("onclick","javascript:EditCell('"+tdId+"')");
    //Onblur check if value already selected from the dropdown or value not exist in the dropdown
	for(var i=0;i<drpDownObj.length;i++)
		{
		    var optionVal=drpDownObj.options[i].text;
			if(optionVal==prevTxt)
			{
			  found=1;
              break;
			}
		}
		if(found==0)  
		{
			prevTxt=drpDownObj.options[0].text;
		}
	}
/*	else if(elemType=='Multi')
	{
	}*/
	else
	{
		var txtBoxObj=document.getElementById(objId);
		cellObj.setAttribute("onclick","javascript:EditCellTextBox('"+tdId+"')");
	}
	if(prevTxt=="None") cellObj.innerHTML="NULL"; 
	else cellObj.innerHTML=prevTxt;
	if(found==0)
	{
           validateTbldata();
            startCompare();
	}
	cellObj.title="Click to edit cell";
}
function EditCellTextBox(tdId)
{
	var cellObj=document.getElementById(tdId);
	cellObj.title="";
	var celltext=cellObj.innerHTML;
	celltext=celltext.trim();
		if(firstTxt="")
	     {
		firstTxt=celltext;
	     }else{
		prevCellText=celltext;}
		cellObj.style.border="0px solid red";
		var tdIdSplit=tdId.split("_");
        var rowIndex=tdIdSplit[1];
		var colIndex=tdIdSplit[2];
		var colSelectBoxId="selectBox-"+colIndex;
		var fieldId=document.getElementById(colSelectBoxId).value;
        //create textBox for the values
		 cellObj.innerHTML="";
		 var editDiv=CreateDIV(cellObj, "", "editDiv_"+rowIndex+"_"+colIndex,"");
		 editDiv.align="center";
		 var editTxtBox=CreateTEXTBOX(editDiv,"","txtBox_"+rowIndex+"_"+colIndex,celltext);	
         editTxtBox.focus();
		 cellObj.setAttribute("onclick","");
		// editTxtBox.setAttribute("onkeypress","textBoxEdit(event)");
		editTxtBox.onkeypress=function(event){
				 if (!event) var event = window.event
				 if (event.keyCode) code = event.keyCode;
				 else if (event.which) code = event.which;
				 if(code==13)
				  {	
					 changeTdDisp(celltext,tdId,editTxtBox.id,'textBox');
				  }
		};
		editTxtBox.setAttribute("onblur","retainTdDisp('"+celltext+"','"+tdId+"','"+editTxtBox.id+"','textBox')");
}
function showConditionPage()
{
  createUniquenessPage();
  $("#tabs").tabs({disabled: [3]});
  $("#tabs").tabs('select', 2);
  $("#tabs").tabs('enable', 2);
}
function createImportDataPage()
{
	 $("#tabs").tabs('enable', 3);
	 $("#tabs").tabs('select', 3);
  var importPageInnerHTML = "<table id='importTable' align='center' style='width:100%'><tr id='importTr1'>";
  importPageInnerHTML +="<td id='importTd12' colspan='2' align='center' style='width:70%;'>";
  /*importPageInnerHTML +="<span id='span_map' onclick='rememberUploadSelection()'>Save data map</span>";*/
  importPageInnerHTML +="<div id='loading_div' align='center' class='loadDivStyle'><img id='imgLoading' src='/atCRM/images/LoadImg/ajax-loader-1.gif'/>";
  importPageInnerHTML += "<br/>Processing...</div><div id='map_div' style='width:40%;'></div></td><td id='importTd13' style='width:30%' align='right'>";
  importPageInnerHTML +="<img id='imgBack2' src='/atCRM/images/JSON/back_btn.jpg' title='Back' style='width:37px;height:37px;cursor:pointer' onclick='javascript:backPage(1);'/>";
  importPageInnerHTML += "<img id='import_btn' src='/atCRM/images/JSON/importData-1.jpg' title='Import Data' style='width:37px;height:37px;cursor:pointer' onclick='javascript:postData();'/></td></tr>";
  importPageInnerHTML +="<tr id='importTr2'><td id='importTd21' colspan='3'></td></tr>";
  importPageInnerHTML +="<tr id='importTr3'><td id='importTd31' colspan='3'><table id='subTable' align='center' style='width:100%;'>";
  importPageInnerHTML +="<tr id='subTr1'><td id='SubTd11' style='width:100%;'></td></tr>";
  importPageInnerHTML +="<tr id='subTr2'><td id='SubTd21' class='headingText' style='width:100%;'>Mapped Fields :</td></tr>";
  importPageInnerHTML +="<tr id='subTr3'><td id='SubTd31' style='width:100%;'></td></tr></table></td></tr></table>";

	//Store selected values and texts of multiSelect in a array
  var importDataDiv=document.getElementById("importPage");
  importDataDiv.innerHTML="";
  importDataDiv.innerHTML=importPageInnerHTML;
  createImportFldsTbl();
}
function createImportFldsTbl()
{
	getConditions();                     //Get the unique data conditions for entites and store it in a array
	var mainTd=document.getElementById("SubTd31");
	var fieldsTbl=CreateTable(mainTd,"","fieldTbl","","","");
	fieldsTbl.style.borderCollapse="collapse";
	fieldsTbl.style.width="100%";
	var fieldsThead=CreateThead(fieldsTbl,"","fieldThead");
	var fieldsHeadTr=CreateTR(fieldsThead,"","fieldHeadTr");
	fieldsHeadTr.bgColor = "lightblue";
	var fieldTh1 =CreateTH(fieldsHeadTr,"","dataTh1");
	fieldTh1.style.border="1px solid";
    fieldTh1.innerHTML="#";
	var fieldTh2 =CreateTH(fieldsHeadTr,"","dataTh2");
	fieldTh2.style.border="1px solid";
	fieldTh2.innerHTML="CSV fields";
	var fieldTh3 =CreateTH(fieldsHeadTr,"","dataTh3");
	fieldTh3.style.border="1px solid";
	fieldTh3.innerHTML="Impel Fields";
	var fieldsTblBody=CreateBody(fieldsTbl,"","fieldsTbody");
	var fieldSelects=document.getElementsByName("fieldSelect");  //select boxes 
	var NoOfSelects=fieldSelects.length;
	var fieldIdList="";
	var notSelectLbls="";
	var notSelectLblList="";
	var records=0;
	var colNum=1;
	for(var k=0;k<NoOfSelects;k++)
	{
        var drpDwnObj=fieldSelects[k];
		var fieldId=drpDwnObj.value;
		var fieldVal=$(drpDwnObj).find(":selected").text();
		var headLblId="lblHead_"+k;
		var headLbl=document.getElementById(headLblId).innerHTML;
		var fieldsTR=CreateTR(fieldsTblBody,"","fieldTr_"+k);
		if(fieldId){
			for(var i=0;i<3;i++)
			{
                var fieldTd=CreateTD(fieldsTR,"","fieldTd_"+k+"_"+i);
                fieldTd.style.border="1px solid";
				if(i==0)
				{
                    fieldTd.innerHTML=colNum;
					fieldTd.align="center";
				}
				else if(i==1){
				    fieldTd.innerHTML="&nbsp;&nbsp;"+headLbl;
				}
				else{
                    fieldTd.innerHTML="&nbsp;&nbsp;"+fieldVal;
				}
			}
			records=records+1;
			colNum=colNum+1;
		}
	}
	document.getElementById("importTd21").innerHTML="Total records :"+((recNum*1)-1);
	document.getElementById("SubTd31").innerHTML += "<a id='map_btn' class='classname' href='#' onclick='javascript:rememberUploadSelection();' title='Click to save data map' style='float:right;'>Save this data map</a>";
	$("#fieldTbl").dataTable({
		"bJQueryUI": true,
		"bPaginate": false,
		"bSort": false,
		"bInfo": false,
		"asStripClasses": null,
		"bFilter": false,
		"fnInitComplete": function(oSettings, json) {
			document.getElementById("fieldTbl_wrapper").style.width="70%";
		}
	});
	//CreateTEXTAREA(mainTd, "", "synctext", "") ;
}
/*Function to populate DataTable Header's EntityList Select Boxes*/
function populateLnkEntts()
{
    var fieldSelects=document.getElementsByName("enttSelect");  //select boxes 
	var NoOfSelects=fieldSelects.length;
	/************map JSON ***********/
	var doMap = 0;
	if(mapJSON && mapJSON !=""){
		var locMapJSON  = mapJSON;
		var selectsData = locMapJSON[1]["tableSelects"];
		var selectsLen  = selectsData.length;
		if(NoOfSelects == selectsLen) doMap = 1;
      }
	/************map JSON ***********/
    var mainEnttId=document.getElementById("entity_select").value;
	var mainEntityDescName=$("#entity_select").find(":selected").text();
	for(var k=0;k<NoOfSelects;k++)
	{
        var drpDwnObj=fieldSelects[k];
		//var drpDwnObjId=drpDwnObj.id;
		var drpDwnObjId=$(drpDwnObj).attr("id");
		var headLblId="lblHead_"+k;
		var headLbl=document.getElementById(headLblId).innerHTML;
		headLbl=headLbl.trim();
        drpDwnObj[0]=new Option(mainEntityDescName,mainEnttId);  //populate first option as main entity
		//Populate related entities to the select Box
		var drpDwnCnt=1;
        var dataLength;
		if(relEntitiesData) 
		{
			dataLength=relEntitiesData.length;
			for(var i=0;i<dataLength;i++)
				{
				   var enttId=relEntitiesData[i]["Id"];
				   var descName=relEntitiesData[i]["descName"];
				   drpDwnObj[drpDwnCnt]=new Option(descName,enttId);
				   drpDwnCnt++;
				}
			drpDwnObj[0].selected = true;
		}
		/******If mapJSON exist then check the index.If not first entity then call loadEnttColumns for that entt******/
		if(doMap == 1){ 
				   var selVal = selectsData[k]["Entity"];
				   var enttSelVal = selectsData[k]["enttCol"];
                   $("#"+drpDwnObjId).val(selVal).attr('selected',true);
				   var EnttDrpDwnSelectInd=$("#"+drpDwnObjId+" option").index($("#"+drpDwnObjId+" option:selected"));
				   if(EnttDrpDwnSelectInd > 0) loadEnttColmns(selVal,drpDwnObjId,enttSelVal);
		}
	}
   	//Set dropdown options of reload after title split
	if(reloadPageInd==1)
	{
		var titleIndex=0;
        for(var k=0;k<NoOfSelects;k++)
		   {
			   var drpDwnObj=fieldSelects[k];
		       var drpDwnObjId=drpDwnObj.id;
			   var selctdVal;
			   var headLblId="lblHead_"+k;
		       var headLbl=document.getElementById(headLblId).innerHTML;
			   var enttColSelectId=drpDwnObjId.replace("enttBox","selectBox");
		       headLbl=headLbl.trim();
			   if(titleIndex==1)
			   {
                  var index=enttDrpDwnIndexArray[k-1];
                  drpDwnObj[index].selected = true;
				  selctdVal=drpDwnObj.value;          //Set enttCol value based on selected entity
				  if(enttDrpDwnIndexArray[k-1]!=0) {populateSlctForRelEntities(enttColSelectId,selctdVal,"dt");}
			   }
               if(headLbl!="Title"&&titleIndex==0){   
			    var index=enttDrpDwnIndexArray[k];
                drpDwnObj[index].selected = true;
			    selctdVal=drpDwnObj.value;    //Set enttCOl value based on selected entity
			    if(enttDrpDwnIndexArray[k]!=0) populateSlctForRelEntities(enttColSelectId,selctdVal,"dt")
			   }
			   else{titleIndex=1;}
               
		   }
		   //checkedIndex=1;
	}
}
/*Function to load entt_columns onchange of the entt in the dataTable entity select boxes*/
function loadEnttColmns(selctdVal,drpDownId,enttCol2BSelected)
{  
	var colInd=drpDownId.split("-")[1];
	var enttColDrpDwnId="selectBox-"+colInd;
	var mainEnttId=document.getElementById("entity_select").value;
	if(selctdVal==mainEnttId) populateSlctForMainEntt(enttColDrpDwnId);
	else populateSlctForRelEntities(enttColDrpDwnId,selctdVal,"dt","",enttCol2BSelected);
	 /* var headLbl=document.getElementById("lblHead_"+colInd).innerHTML;
	var drpDwnObj=document.getElementById(enttColDrpDwnId);
    for(var i=0; i<drpDwnObj.length; i++)
	  {
		 var optionName=drpDwnObj.options[i].text;
		 var ptrnVal=new RegExp(headLbl,"gi");
		 if(ptrnVal.test(optionName))
			{
			 drpDwnObj[i].selected = true;
			 break;
			}
	  }*/
}
function checkSameOption(fieldVal,selectId)
{
	 var fieldSelects=document.getElementsByName("fieldSelect");
	 thisSelectObj=document.getElementById(selectId);
	 var NoOfSelects=fieldSelects.length;
	 for(var k=0;k<NoOfSelects;k++)
	   {
           var drpDwnObj=fieldSelects[k];
		   var fieldId=drpDwnObj.value;
           var drpDwnObjId=drpDwnObj.id;
		   var drpBwnVal=$(drpDwnObj).find(":selected").text();
		   if(selectId!=drpDwnObjId)
		   {
			   if(fieldId&&(fieldId==fieldVal))
			   {
				   alert("Column value already exist");
				   thisSelectObj[0].selected = true;
				   thisSelectObj[0].focus();
				   break;
			   }
		   }
	   }
}
var enttColArray=new Array();
//Function to store the entt col details in an array
function createEnttColArray()
{
    var mainEntityId=document.getElementById("entity_select").value;
	var fieldSelects=document.getElementsByName("fieldSelect");  //entt_column select boxes 
	var NoOfSelects=fieldSelects.length;
	for(var k=0;k<NoOfSelects;k++)
	{
        var drpDwnObj=fieldSelects[k];
		var fieldSelectId=drpDwnObj.id;
		var enttSelectId=fieldSelectId.replace("selectBox","enttBox");
		var enttSelectedId=document.getElementById(enttSelectId).value;
		var enttColId=drpDwnObj.value;
		var drpBwnVal=$(drpDwnObj).find(":selected").text();
		if(enttColId=='') 
		{
            enttColArray[k]="";
		}
		else if(enttSelectedId==mainEntityId){
			var TblObj= dataJSONTest["entities"][0];
			var L_enttDescName=TblObj['descName'];
	        var L_enttColumns=TblObj['enttColumns'];
			for(j=0;j<L_enttColumns.length;j++)
			  {
				 try			
				  {
					var L_inner_tds_data =L_enttColumns[j]["cols"];
					L_col_id		= L_inner_tds_data[0];
					L_colDesc_Name		= L_inner_tds_data[1];
					L_apiFieldName  = L_inner_tds_data[2];
					L_col_dataType  = L_inner_tds_data[4];
					L_colName = L_inner_tds_data[7];
					L_enttRefTo = L_inner_tds_data[8];
					if(L_col_id==enttColId)
					{
						enttColArray[k]=L_col_id+"-"+L_colDesc_Name+"-"+L_apiFieldName+"-"+L_col_dataType+"-"+enttSelectedId+"-"+L_enttDescName+"-"+L_colName+"-"+L_enttRefTo;
					}	 
				  }
				 catch (e)
				  {
					continue;
				  }
			 }
		}
		else{
			var dataLength=relEntitiesData.length;
			for(var i=0;i<dataLength;i++)
			  {
				var enttId=relEntitiesData[i]["Id"];
				var L_enttDescName=relEntitiesData[i]['descName'];
                var L_enttColumns=relEntitiesData[i]["enttColumns"];
                if(enttSelectedId==enttId){
					for(m=0;m<L_enttColumns.length;m++)
					  {
						var L_inner_tds_data =L_enttColumns[m]["cols"];
						L_col_id		= L_inner_tds_data[0];
						L_colDesc_Name		= L_inner_tds_data[1];
						L_apiFieldName  = L_inner_tds_data[2];
						L_col_dataType = L_inner_tds_data[4];
						L_colName = L_inner_tds_data[7];
						L_enttRefTo = L_inner_tds_data[8];
						if(L_col_id==enttColId)
						  {
							enttColArray[k]=L_col_id+"-"+L_colDesc_Name+"-"+L_apiFieldName+"-"+L_col_dataType+"-"+enttSelectedId+"-"+L_enttDescName+"-"+L_colName+"-"+L_enttRefTo;
						  }	
					  }
			  }
			}
		}
   }
}
//This function is to get the data from the datatable in csv format
function getTableData()
{
	var tableData;
	var rowIndex=1;
	var dataIndex=0;
    var fieldSelects=document.getElementsByName("fieldSelect");  //select boxes 
	var NoOfSelects=fieldSelects.length;
	for(var k=0;k<NoOfSelects;k++)
	{
		 var headLblId="lblHead_"+k;
		 var headLbl=document.getElementById(headLblId).innerHTML;
		 headLbl=headLbl.trim();
		 if(tableData) tableData=tableData+","+headLbl;
		 else tableData=headLbl;
	}
	$('#gridMain tr').each(function(){                         //Iterate through the table rows
		 if(dataIndex==1) tableData=tableData+"\n";
			    $(this).find('td').each(function(){
                     var cellVal=$(this).html();
					 var cellId= $(this).attr('id');
					 var columnInd=($(this).parent("tr").children().index(this));
					 if(tableData&&(rowIndex==0)) {tableData=tableData+","+cellVal;}
					 else if(tableData&&(rowIndex==1)) {tableData=tableData+cellVal;}
					 else {tableData=cellVal;}
					 rowIndex=0;
				});
				rowIndex=1;
				dataIndex=1;
	});
	return tableData;
}

function splitColumnForTitle()
{
	splitTitleIndex=1;
    var tableData;
	var rowIndex=1;
	var dataIndex=0;
    var fieldSelects=document.getElementsByName("fieldSelect");  //select boxes 
	var NoOfSelects=fieldSelects.length;
    var ptrnFrstName1=/first[\s*]+name/gi;
	var ptrnDispName1=/display[\s*]+name/gi;
	var ptrnFrstName=new RegExp("firstname","i");
	var ptrnDispName=new RegExp("displayname","i");
	var firstNameColInd;
	var dispNameColInd;
	for(var k=0;k<NoOfSelects;k++)
	{
		 var drpDwnObj=fieldSelects[k];
		 var enttDrpDownId="enttBox-"+k;                  //Entt dropDown Id
		 var EnttDrpDwnSelectInd=$("#"+enttDrpDownId+" option").index($("#"+enttDrpDownId+" option:selected"));
		 enttDrpDwnIndexArray[k]=EnttDrpDwnSelectInd;      //Store Entities selected index in a array
		 var optionName=$(drpDwnObj).find(":selected").text();
		 optionName=optionName.toLowerCase();
		 var drpDwnObjId=drpDwnObj.id;
		 var selectInd=$("#"+drpDwnObjId+" option").index($("#"+drpDwnObjId+" option:selected"));
		 DrpDwnIndexArray[k]=selectInd;
		 reloadPageInd=1;                                          //index is 1 if page reload
		 var headLblId="lblHead_"+k;
		 var headLbl=document.getElementById(headLblId).innerHTML;
		 headLbl=headLbl.trim();
		 var matchFrstName1=ptrnFrstName1.test(optionName);
		 var matchDispName1=ptrnDispName1.test(optionName); 
		 var matchFrstName=ptrnFrstName.test(optionName);
		 var matchDispName=ptrnDispName.test(optionName);
         if(matchFrstName||matchFrstName1)
		  {
			if(tableData) tableData=tableData+","+"Title,"+headLbl;
		    else tableData="Title,"+headLbl;
			firstNameColInd=k;
		  }
		 else if((matchDispName||matchDispName1)&&firstNameInd!=1)
		  {
			 if(tableData) tableData=tableData+","+"Title,"+headLbl;
		     else tableData="Title,"+headLbl;
			 dispNameColInd=k;
		  }
		 else if((matchDispName||matchDispName1)&&firstNameInd==1)
		 {
			  if(tableData) tableData=tableData+","+headLbl;
		      else tableData=headLbl;
			  dispNameColInd=k;
		 }
		 else {
			 if(tableData) tableData=tableData+","+headLbl;
		     else tableData=headLbl;
		 }
	}
	var cnt=0;
	$('#gridMain tr').each(function(){                         //Iterate through the table rows
		 if(dataIndex==1) tableData=tableData+"\n";
			    $(this).find('td').each(function(){
                     var cellVal=$(this).html();
					 var cellId= $(this).attr('id');
					 var columnInd=($(this).parent("tr").children().index(this));
					 /*check if first Name exist*/
                     if(columnInd==firstNameColInd){
                        var newCellVal=cellVal.split(".");
						var newExpression;

                        var foundTitle=0;
						var valueData=titleDoc["getTitles"];
						var dataLen=valueData.length;
						/*start comparing with the json data*/
						for(var i=0;i<dataLen;i++)
						  {
							var titleName=valueData[i]["titleName"];
							//titleName=titleName+".";
							var ptrnVal=new RegExp("^"+titleName,"i");
							if(ptrnVal.test(cellVal))
						       {
                                 foundTitle =1;
								 break;
							   }
						  }
						//split title and names 
                        if(cellVal.indexOf(".")>-1 && foundTitle == 1){ newExpression=firstNameArray[cnt]+".,"+newCellVal[1];}
						else if(cellVal.indexOf(" ")>-1 && foundTitle == 1){
                          var spaceCellVal=cellVal.split(" ");
                          newExpression=firstNameArray[cnt]+".,"+spaceCellVal[1];
						}
						else if(dispNameArray[cnt]){newExpression=dispNameArray[cnt]+".,"+cellVal;}
						else{ newExpression=","+cellVal}

                        if(tableData&&(rowIndex==0)) {tableData=tableData+","+newExpression;}
					    else if(tableData&&(rowIndex==1)) {tableData=tableData+newExpression;}
					    else {tableData=newExpression;}
					 }
					 //check if dispName exist but not first name
					 else if(columnInd==dispNameColInd&&firstNameInd!=1){
                         var newCellVal=cellVal.split(".");
                         var newExpression;

						var foundTitle=0;
						var valueData=titleDoc["getTitles"];
						var dataLen=valueData.length;
						//start comparing with the json data
						for(var i=0;i<dataLen;i++)
						  {
							var titleName=valueData[i]["titleName"];
							//titleName=titleName+".";
							var ptrnVal=new RegExp("^"+titleName,"i");
							if(ptrnVal.test(cellVal))
						       {
                                 foundTitle =1;
								 break;
							   }
						  }

						 if(cellVal.indexOf(".")>-1 && foundTitle == 1){newExpression=dispNameArray[cnt]+".,"+newCellVal[1];}
						 else if(cellVal.indexOf(" ")>-1 && foundTitle == 1){
                          var spaceCellVal=cellVal.split(" ");
                          newExpression=firstNameArray[cnt]+".,"+spaceCellVal[1];
						 }
						 else if(firstNameArray[cnt]){newExpression=firstNameArray[cnt]+".,"+newCellVal[0];}
						 else{ newExpression=","+cellVal;}

						 if(tableData&&(rowIndex==0)) {tableData=tableData+","+newExpression;}
					     else if(tableData&&(rowIndex==1)) {tableData=tableData+newExpression;}
					     else {tableData=newExpression;}
					 }
					 //Remove title from diplay name if dispname and first name both exist
					 else if(columnInd==dispNameColInd&&firstNameInd==1)
					 {
						 var newCellVal;
						 var newValue="";

						var foundTitle=0;
						var valueData=titleDoc["getTitles"];
						var dataLen=valueData.length;
						//start comparing with the json data
						for(var i=0;i<dataLen;i++)
						  {
							var titleName=valueData[i]["titleName"];
							//titleName=titleName+".";
							var ptrnVal=new RegExp("^"+titleName,"i");
							if(ptrnVal.test(cellVal))
						       {
                                 foundTitle =1;
								 break;
							   }
						  }

						 if(cellVal.indexOf(".")>-1 &&foundTitle == 1){
						    newCellVal=cellVal.split(".");
							/*if(!newCellVal[1]){
								 newValue=cellVal;
							}
							else */
								newValue=newCellVal[1];
						 }
						 else if(cellVal.indexOf(" ")>-1 && foundTitle == 1 && cellVal.split(" ")[0].length<5){
                          var spaceCellVal=cellVal.split(" ");
                          //newCellVal=spaceCellVal[1];
						  newValue=spaceCellVal[1];
						  }
						 else newValue=cellVal;
						 
                         if(tableData&&(rowIndex==0)) {tableData=tableData+","+newValue;}
					     else if(tableData&&(rowIndex==1)) {tableData=tableData+newValue;}
					     else {tableData=newValue;}
					 }
					 else{
					 if(tableData&&(rowIndex==0)) {tableData=tableData+",\""+cellVal+"\"";}
					 else if(tableData&&(rowIndex==1)) {tableData=tableData+"\""+cellVal+"\"";}
					 else {tableData="\""+cellVal+"\"";}
					 }
					 rowIndex=0;
				});
				rowIndex=1;
				dataIndex=1;
				cnt=cnt+1;
	});
	if(document.getElementById("sourceRad2").checked) isFileUpload=1;
	createSetUpFieldPage(tableData);
}
 /*Function to get the session Id from the cookie*/
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
function parseToXML(strVal) 
{ 
  strVal=strVal.trim();
  strVal=strVal.replace(/&/g,"&amp;");
  strVal=strVal.replace(/>/g,"&gt;");
  strVal=strVal.replace(/</g,"&lt;");
  strVal=strVal.replace(/\"/g,"&quot;");
  strVal=strVal.replace(/\'/g,"&apos;");
  return strVal; 
}
/*************Function to construct soaprequest and post the data******************/
function postData()
{
	var mainEntityId=document.getElementById("entity_select").value;
	var ifDuplicate;
	if(document.getElementById("rad_reject").checked) ifDuplicate=document.getElementById("rad_reject").value;
	else ifDuplicate=document.getElementById("rad_update").value;
	var G_SessionId= getCookie('zeroCode.atCRM');
	var soapHeader = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soapheader.ibm.com"><soapenv:Header><soap:apiheader><soap:sessionid>'+G_SessionId+'</soap:sessionid><soap:requestortype>ImpelUpload</soap:requestortype><soap:requestorid>'+loginName+'</soap:requestorid><soap:objectname>'+entityDescName+'</soap:objectname><soap:verb>loaddata</soap:verb><soap:ifduplicate>'+ifDuplicate+'</soap:ifduplicate></soap:apiheader></soapenv:Header><soapenv:Body><soap:loaddata>';		
    var soapFooter = '</soap:loaddata></soapenv:Body></soapenv:Envelope>';		
    var soapObjectEnttCols = "";

	var rowInd=0;
	$('#gridMain tr').each(function(){                         //Iterate through the table rows
		     var soapAddOrLinkArray=new Array();
			 var addOrLink="";
             if(rowInd!=0){soapObjectEnttCols=soapObjectEnttCols+'<soap:objects><soap:baseobject><soap:entityname>'+entityDescName+'</soap:entityname><soap:condition>'+mainEnttCondn+'</soap:condition><soap:entitycols>';
			 }
			    $(this).find('td').each(function(){
                     var cellVal=$(this).html();
					 var cellId= $(this).attr('id');
					 var columnInd=($(this).parent("tr").children().index(this));
					 var enttColDtl=enttColArray[columnInd].split("-");
                     var enttColId=enttColDtl[0];
					 var enttColDescName=enttColDtl[1];
					 var enttColApi=enttColDtl[2];
					 var enttColType=enttColDtl[3];
					 var EntityId=enttColDtl[4];
                     var enttDescName=enttColDtl[5];
					// alert(enttDescName);
					// var enttDescName=enttColDtl[8];
					 //Convert date format dd/MM/yyyy to yyyy/MM/dd format
					// if(document.getElementById("date_india").checked){
					 switch(enttColType)
						{
						 case "dateOnly":
                         case "Date":
							    if(cellVal) cellVal=changeDateFormat(cellVal);
							 break;
						 case "timeOnly":
                         case "dateAndTime":
                         case "DateTime":
						 case "dateTime":
							 if(cellVal){
							    var splitDateVal=cellVal.split(" ");
						        var newDate=changeDateFormat(splitDateVal[0]);
								var timeVal=splitDateVal[1];
                                cellVal=newDate+" "+timeVal;
						        }
							 break;
						}
					// }
					// if(cellVal&&enttColApi)
					 if(enttColApi)
						{
						    if(!cellVal) cellVal="";
							else cellVal=parseToXML(cellVal);
						    if(EntityId==mainEntityId) soapObjectEnttCols  = soapObjectEnttCols + '<'+enttColApi+'>'+cellVal+'</'+enttColApi+'>';
							else{
								for(var q=0;q<relatedEnttIdArray.length;q++)
								  {
                                    if(EntityId==relatedEnttIdArray[q])
									  {
										if(soapAddOrLinkArray[q]==null)
										  {
											soapAddOrLinkArray[q]="<soap:addorlinkobject><soap:entityname>"+enttDescName+"</soap:entityname><soap:condition>"+relEnttCondnArray[q]+"</soap:condition><soap:entitycols>";
											soapAddOrLinkArray[q]=soapAddOrLinkArray[q]+'<'+enttColApi+'>'+cellVal+'</'+enttColApi+'>';
										  }
										  else
										  {
											 soapAddOrLinkArray[q]=soapAddOrLinkArray[q]+'<'+enttColApi+'>'+cellVal+'</'+enttColApi+'>';
										  }
									  }
								  }
							}
						}
				});
				var addLinkIndex=0;
                for(var r=0;r<relatedEnttIdArray.length;r++)
					{
					  if(soapAddOrLinkArray[r])
						{
                            addOrLink=addOrLink+soapAddOrLinkArray[r]+"</soap:entitycols></soap:addorlinkobject>";
						}
					}
				if(rowInd!=0){
				soapObjectEnttCols=soapObjectEnttCols+'</soap:entitycols></soap:baseobject>'+addOrLink+'</soap:objects>';}
				rowInd+=1;
		 });
		var soapMessage=soapHeader+soapObjectEnttCols+soapFooter;
		//document.getElementById("synctext").value=soapMessage;
		var serviceUrl = 'http://192.168.11.11:81/soapapi/loaddata/loaddataE.php'; 
		
		 	$.ajax({
					url: serviceUrl,
					type: "POST",
					sync:true,
					beforeSend : function()
					{
                        document.getElementById("loading_div").style.display="inline";
						setTimeout("showMsg()",3000);
					},
					dataType: "xml",
					data: soapMessage,
					success : function(data)
					{
					},
				    error:function(data)
					{
						 alert("Sorry, error in uploading data");
					}
				});

   }
/****************Post data function ends here***************************/
   function showMsg()
   {
	   document.getElementById("loading_div").innerHTML="Your import is in progress. We will send you an email once it is completed. Please make sure you have updated your primary email in your profile.";
   }
function chkDate(date_value)
   {
      var IndexSlash=date_value.indexOf("\/");
      var IndexHy=date_value.indexOf("-");
	  if(IndexSlash<0 && IndexHy<0) return "0";
      var date_format;    //='dd/MM/yyyy';
	  if(document.getElementById("date_india").checked)	date_format='dd/MM/yyyy';
	  else if(document.getElementById("date_us").checked) date_format='MM/dd/yyyy';

	  var temp=date_value.split(/[-\/]/g);
		if(temp=="") 
		   {
			return "0";
		   }
		var month;
		var day;
		var year;
	   if (date_format=='dd/MM/yyyy')
	   {
        if(temp[1]) month=temp[1].toString();
	    if(temp[0]) day=temp[0].toString();
	    if(temp[2]) year=temp[2].toString();
	   }
	   else if(date_format=='MM/dd/yyyy')
	   {
		   if(temp[0]) month=temp[0].toString();
	       if(temp[1]) day=temp[1].toString();
	       if(temp[2]) year=temp[2].toString();
	   }
		if(year&&(year.length>4||year.length<4)){
		  return "0";
		}
		else if(month&&(month.length>2||month>12||month<1))
		{
		    return "0";
		}
		else if(day&&(day.length>2||day>31||day<1))
		{
		   return "0";
		}
	if (date_format=='MM/dd/yyyy')
	 {	var yr=temp[2];
		var mon=temp[0].length<2 ?'0'+temp[0]: temp[0];
		var day=temp[1].length<2 ?'0'+temp[1]: temp[1];
		//var yr=year.length<3 ?'20'+yr : yr;
		date_value=mon+'/'+day+'/'+yr;
		
	}
	else if (date_format=='dd/MM/yyyy')
		{
			var yr=temp[2];
			var mon=month.length<2 ?'0'+temp[1]: temp[1];
			var day=day.length<2 ?'0'+temp[0]: temp[0];
			//var yr=year.length<3 ?'20'+yr : yr;
			date_value=day+'/'+mon+'/'+yr;
		}
	return(date_value);
}
function chkDateTime(date_value)
   {
	if(date_value){
    var date_format='dd/MM/yyyy';
	if(document.getElementById("date_india").checked)	date_format='dd/MM/yyyy';
	else if(document.getElementById("date_us").checked) date_format='MM/dd/yyyy';
	var splitDateTime=date_value.split(" ");
	var checkDate;
	var checkTime;
	var AmPm;
	if(splitDateTime[2]) AmPm=splitDateTime[2].toLowerCase();
	
	if(splitDateTime[0])
		{
		  checkDate=chkDate(splitDateTime[0]);
		  if(checkDate=="0")
			{
			  return "0";
			}
	    }
	if(splitDateTime[1])
	    {
			 checkTime=chkTime(splitDateTime[1]);
			 if(checkTime=="0")
			   {
				 return "0";
			   }
	    }
	   else
	    {
		   checkTime="00:00:00";
	    }
	 var splitTime=checkTime.split(":");
	 var hr=splitTime[0];
	 var min=splitTime[1];
	 var Sec=splitTime[2];
      if(AmPm=="pm")
	   {
		 hr=splitTime[0]*1;
		 if(hr>12){
             return "0";
		 }
		 else if(hr!=12)
		   {
           hr+=12;
		 if(hr>23)
		   {
             var days=hr/24;
             hr=hr%24;
			 hr=hr.toString();
			 hr=hr.length<2 ?'0'+hr: hr;
             var splitDate=checkDate.split("/");
			 var date=(splitDate[0]*1)+(days*1);
             checkDate=date+"/"+splitDate[1]+"/"+splitDate[2];
		   }
	      }
	   }
	   else if(AmPm=="am")
	   {
		  if(hr==12) hr="00";
		  else if(hr>12) return "0";
	   }
     checkTime=hr+":"+min+":"+Sec;
     var dateTime=checkDate+" "+checkTime;
	return(dateTime);
	}
	else return null;
}
function chkTime(time_value)
{
		var temp=time_value.split(":");
		var Hr=temp[0].toString();
        var min=temp[1].toString();
	    var sec=temp[2];
		if(sec)
		  {
			sec=temp[2].toString();
		  }
		 else
			{
			 sec="00";
			}
		if(Hr=="") Hr="00";
		if(min=="") min="00";
		if(Hr.length>2||Hr.length<1||Hr>23||Hr<0){
		  return "0";
		}
		else if(min.length>2||min>59||min<0)
		{
		    return "0";
		}
		else if(sec&&(sec.length>2||sec>59||sec<0))
		{
		   return "0";
		}

		var yr=temp[2];
		var Hour=Hr.length<2 ?'0'+Hr: Hr;
		var minute=min.length<2 ?'0'+min: min;
		var second=sec.length<2 ?'0'+sec : sec;
		time_value=Hour+':'+minute+':'+second;
	return(time_value);
}
function changeDateFormat(dateVal)
{
	var date_format;
	if(document.getElementById("date_india").checked)	date_format='dd/MM/yyyy';
	else if(document.getElementById("date_us").checked) date_format='MM/dd/yyyy';
	var splitDateValue=dateVal.split("/");
	var prt1=splitDateValue[0];
	var prt2=splitDateValue[1];
	var prt3=splitDateValue[2];
	var newDate;
	//change it to yyyy-mm-dd format
	if(date_format == 'dd/MM/yyyy') newDate=prt3+"-"+prt2+"-"+prt1;
	else if(date_format =='MM/dd/yyyy') newDate=prt3+"-"+prt1+"-"+prt2;
	return newDate;
}
function getQueryParameter ( parameterName ) {
  //var queryString = window.top.location.search.substring(1);
  var queryString = window.top.location.href;
  var parameterName = parameterName + "=";
  if ( queryString.length > 0 ) {
    begin = queryString.indexOf ( parameterName );
    if ( begin != -1 ) {
      begin += parameterName.length;
      end = queryString.indexOf ( "&" , begin );
        if ( end == -1 ) {
        end = queryString.length
      }
      return unescape ( queryString.substring ( begin, end ) );
    }
  }
  return "null";
}
function getSeperatorValue(tdVal)
{
	var SepVal;
	var splitCelVal;
	var fieldSeperator=document.getElementsByName("FldSepRad");
	for(var r=0;r<fieldSeperator.length;r++)
	 {
		if(fieldSeperator[r].checked==true)
		  {
			 SepVal=fieldSeperator[r].value;
			 break;
		  }
	 } 
   if(tdVal){
   if(SepVal=="1"){
		 splitCelVal=tdVal.split(";");
   }
   else if(SepVal=="2"){
	     splitCelVal=tdVal.split(";");
   }
   else {
		splitCelVal=tdVal.split("~");
   }
   }
   return splitCelVal;
}
/*Function to get the condition for main Entity and linked entities*/
function getConditions()
{
	var mainDivs=document.getElementsByName("condnDiv");
	for(var i=0;i<mainDivs.length;i++)
	{
		var mainDivId=mainDivs[i].id;
		var enttId=mainDivId.split("_")[2];         //Get the entt Id if its  from the divId
		 var orDivs=mainDivs[i].getElementsByTagName("div");
		 var condtnStr="";
         for(var j=0;j<orDivs.length;j++)
			{
                if(j!=0)
				{
				  var OrLabel=orDivs[j].getElementsByTagName("label");
				  var OrLink=orDivs[j].getElementsByTagName("a");
				  var enttColSelects=orDivs[j].getElementsByTagName("select");
				  var enttColSelectsNum=enttColSelects.length;
				  enttColSelectsNum=parseInt(enttColSelectsNum);
				  var OrIndex=0;
				  var clsEndInd=0;
				  var selectedBox=0;
				  for(var m=0;m<enttColSelects.length;m++)
					{
					  var enttColId=enttColSelects[m].value;
					  if(enttColId){
                      var enttColName;
					  var enttColType;
					  var enttColApiName;
					  if(enttId)             //If mainDivId contains entt id then its related entity block      
						{
						  var dataLength=relEntitiesData.length;
						   for(var r=0;r<dataLength;r++)
							{
							   var lstEnttId=relEntitiesData[r]["Id"];
							   var L_enttColumns=relEntitiesData[r]["enttColumns"];
							   if(enttId==lstEnttId){
								  for(var n=0;n<L_enttColumns.length;n++)
								    {
									    var L_inner_tds_data =L_enttColumns[n]["cols"];
										var L_col_id  = L_inner_tds_data[0];
                                        if(L_col_id==enttColId){
										  // enttColName= L_inner_tds_data[1];
										   enttColApiName= L_inner_tds_data[2];
										   enttColType   = L_inner_tds_data[4];
										   enttColName   = L_inner_tds_data[7];
										   break;
										 }
									}
							   }
							}
						}
					  else                // This blocj is for main entities
						{
						   var TblObj= dataJSONTest["entities"][0];
						   var L_enttColumns=TblObj['enttColumns'];
						   for(p=0;p<L_enttColumns.length;p++)
							{
							   var L_inner_tds_data =L_enttColumns[p]["cols"];
							   var L_col_id		= L_inner_tds_data[0];
							   if(L_col_id==enttColId){
									//enttColName= L_inner_tds_data[1];
									enttColApiName= L_inner_tds_data[2];
									enttColType   = L_inner_tds_data[4];
									enttColName   = L_inner_tds_data[7];
									break;
								}
							}
						}
						/*Create Condition string*/
						switch(enttColType)
						  {
							 case "decimal": 
							 case "double": 
							 case "float": 
							 case "money":
							 case "Decimal":
							 case "Integer":
							 case "integer":
								 /*If Condition string is empty*/
                                 if(condtnStr==""&&selectedBox==0&&(m==enttColSelectsNum-1)){
                                condtnStr="(("+enttColName+"=#"+enttColApiName+"#)";
								  }
								  else if(condtnStr==""){
									 condtnStr="(("+enttColName+"=#"+enttColApiName+"#";
								  }
								  /*If Condition div contains only one selected div and remaining selects value is none*/
								  else if(condtnStr!=""&&j>1&&selectedBox==0&&(m==enttColSelectsNum-1)){
									   condtnStr=condtnStr+" or ("+enttColName+"=#"+enttColApiName+"#)";
								  }
								  /*If first condn div and if it contains one select*/
								  else if(condtnStr!=""&&j>1&&m==0&&(m==enttColSelectsNum-1)){
									 condtnStr=condtnStr+" or ("+enttColName+"=#"+enttColApiName+"#)";
								  }
								  else if(condtnStr!=""&&j>1&&OrIndex==0){
									  condtnStr=condtnStr+" or ("+enttColName+"=#"+enttColApiName+"#";
									  OrIndex++;
								  }
								  /*Selects other than last select*/
								  else if((m!=enttColSelectsNum-1)&&condtnStr!=""){
									  condtnStr=condtnStr+" and "+enttColName+"=#"+enttColApiName+"#";
								  }
								  else {
									 condtnStr=condtnStr+" and "+enttColName+"=#"+enttColApiName+"#)";
								  }
								 break;
							 default:
								 /*If Conndition string is empty*/
                                  if(condtnStr==""&&selectedBox==0&&(m==enttColSelectsNum-1)){
                                condtnStr="(("+enttColName+"='#"+enttColApiName+"#')";
								  }
								  else if(condtnStr==""){
									 condtnStr="(("+enttColName+"='#"+enttColApiName+"#'";
								  }
								  /*If Condition div contains only one selected div and remaining selects value is none*/
								  else if(condtnStr!=""&&j>1&&selectedBox==0&&(m==enttColSelectsNum-1)){
									   condtnStr=condtnStr+" or ("+enttColName+"='#"+enttColApiName+"#')";
								  }
								  /*If first condn div and if it contains one select*/
								  else if(condtnStr!=""&&j>1&&m==0&&(m==enttColSelectsNum-1)){
									 condtnStr=condtnStr+" or ("+enttColName+"='#"+enttColApiName+"#')";
								  }
								  else if(condtnStr!=""&&j>1&&OrIndex==0){
									  condtnStr=condtnStr+" or ("+enttColName+"='#"+enttColApiName+"#'";
									  OrIndex++;
								  }
								  /*Selects other than last select*/
								  else if((m!=enttColSelectsNum-1)&&condtnStr!=""){
									  condtnStr=condtnStr+" and "+enttColName+"='#"+enttColApiName+"#'";
								  }
								  else {
									 condtnStr=condtnStr+" and "+enttColName+"='#"+enttColApiName+"#')";
								  }
							}
						  /*Condition string ends here*/
                        clsEndInd=m;
						selectedBox++;
					  }
					}
                     if(enttColSelectsNum!=0&&clsEndInd!=(enttColSelectsNum-1)) {
							  condtnStr=condtnStr+")";
						}
					/*if(j==1&&(enttColSelectsNum!=0)&&(enttColSelectsNum-1==0)) {
							  condtnStr=condtnStr+")";
						}*/
				  //}
				}
			}
			if(condtnStr!="") condtnStr=condtnStr+")";
			/*Store Conditions in a varaible*/
			if(i==0) mainEnttCondn=condtnStr;          //If main entity
			else {                                     // Else if related entities
                  relEnttCondnArray[i-1]=condtnStr;
			}
	} 
}
/*Get conditions function ends here*/
/*check selected entt column width the dataTable import to field*/
function checkSelectedColumn(elem,selectedVal,codnDivId)
{
	if(selectedVal){
	var fieldSelects=document.getElementsByName("fieldSelect");  //select boxes 
	var NoOfSelects=fieldSelects.length;
	var found=0;
	var idFound=0;
	var selectedIndex=document.getElementById("selectIndex").value;
	for(var k=0;k<NoOfSelects;k++)
	{
        var drpDwnObj=fieldSelects[k];
		var drpDwnValue=drpDwnObj.value;
		if(drpDwnValue==selectedVal)
		{
			found++;
			break;
		}
	}
	/*Iterate through selects of this condition div for the existance check*/
	var condnDiv=document.getElementById(codnDivId);
	var condnSelects=condnDiv.getElementsByTagName("select");
	var selectBoxId=elem.id;
	var selectNum=selectBoxId.split("_")[2];
	selectNum=parseInt(selectNum)-1;
	var selectsLen=condnSelects.length;
	for(var j=0;j<selectsLen;j++)
	{
		if(j==selectNum) continue;
		else{
         var selectedId=condnSelects[j].value;
		 if(selectedId&&selectedId==selectedVal)
			{
			  idFound=1;
			  break;
			}
		}
	}
	/*End here*/
	if(found==0) 
	{
		alert("This field is not set as import to field");
		elem.options[selectedIndex].selected=true;
	}
	else if(idFound==1)
	{
		alert("This field is already selected for this condition");
		//elem.options[selectedIndex].selected=true;
		elem.options[0].selected=true;
	}
  }
}
/*Assign selected index to hidden variable onmousedown event of condition selectBox*/
function assignToHidden(elem)
{
	document.getElementById("selectIndex").value="";
    document.getElementById("selectIndex").value=elem.selectedIndex;
}
function createUniquenessPage()
{ 
 /*Create unique value conditions*/
	var enttSelectBox=document.getElementById("entity_select");
	var enttId=enttSelectBox.value;
	var entityName=$(enttSelectBox).find(":selected").text();
	//var codtnTD=document.getElementById("condn_td");
	var codtnTD=document.getElementById("condn_main_td");
	codtnTD.innerHTML="";
    var mainDiv=document.createElement("div");
	mainDiv.id="condnDiv_1";
	mainDiv.setAttribute("name","condnDiv");
	codtnTD.appendChild(mainDiv);
	var labelDIV=CreateDIV(mainDiv, "","labelDiv_1","");
	labelDIV.innerHTML="Make <b>"+entityName+"</b> unique by";
	/*First Div for condition*/
	var firstDIV=document.createElement("div");
	firstDIV.id="condnDiv_1_1";
	firstDIV.setAttribute("name","condnDiv_row");
	firstDIV.style.marginLeft="20px";
	firstDIV.style.marginTop="5px";
	mainDiv.appendChild(firstDIV);
	var spanSelect=CreateSPAN(firstDIV,"","span_select1_1_1");
	spanSelect.style.width="10%";
	var uniqueSelectBox1=CreateSelectBox(spanSelect,"uniqueSelectStyle","uniqueSelectBox1_1_1");
	$(uniqueSelectBox1).mousedown(function(){
        document.getElementById("selectIndex").value="";
        document.getElementById("selectIndex").value=uniqueSelectBox1.selectedIndex;
	});
	uniqueSelectBox1.setAttribute("onchange","checkSelectedColumn(this,this.value,'condnDiv_1_1')");
	 populateConditionBoxes("uniqueSelectBox1_1_1","","1");
   // populateSlctForMainEntt("uniqueSelectBox1_1_1","1");
	if(valBrwsr.indexOf("firefox") > -1)
	  {
		uniqueSelectBox1.style.borderStyle="ridge";
	  } 
	else
	  {
		uniqueSelectBox1.style.borderStyle="solid";
	  }
	var spanImg=CreateSPAN(firstDIV,"","span_Img1_1_1");
	spanImg.style.position="relative";
	spanImg.style.top="3px";
    spanImg.style.marginLeft="3px";
    var imgAdd=CreateIMG(spanImg,"","img_Add1_1_1","/atCRM/images/JSON/add3.jpg","Add");
	imgAdd.style.width="15px";
    imgAdd.style.height="15px";
	$(imgAdd).click(function(){
		addCell("span_Img1_1_1","condnDiv_1_1");
	});
	/*First div ends here*/
	/*Or div begins here*/
	var secondDIV=document.createElement("div");
	secondDIV.id="condnDiv_1_2";
	//secondDIV.setAttribute("name","condnDiv_row");
	mainDiv.appendChild(secondDIV);
	secondDIV.style.marginTop="5px";
	var span21=CreateSPAN(secondDIV,"","span_or_1_1");
	span21.style.width="10%";
	var orLink=CreateA(span21,"","orLink_1_1","#","","Or","Click here to add or condition");
	orLink.style.color="blue";
   	orLink.style.textDecoration="underline";

    $(orLink).click(function(){
		createCondnOrDiv("condnDiv_1","orLink_1_1","condnDiv_1_2");
	});
	 /*ends here*/
	/*Create Condition DIV's for related entities*/
	if(relEntitiesData){
    var dataLength=relEntitiesData.length;
	// var codtnTD=document.getElementById("condn_td");
	var codtnTD=document.getElementById("condn_main_td");
	for(var i=0;i<dataLength;i++)
	  {
		var divNum=i+2;
		var enttId=relEntitiesData[i]["Id"];
		var descName=relEntitiesData[i]["descName"];
        relatedEnttIdArray[i]=enttId;                      //store related entt id's in an array
        var mainDiv=document.createElement("div");
		mainDiv.id="condnDiv_"+divNum+"_"+enttId;
		mainDiv.setAttribute("name","condnDiv");
		codtnTD.appendChild(mainDiv);
		var labelDIV=CreateDIV(mainDiv, "","labelDiv_"+divNum,"");
		labelDIV.innerHTML="Make <b>"+descName+"</b> unique by";
        var firstDIV=document.createElement("div");
		firstDIV.id="condnDiv_"+divNum+"_1";
		firstDIV.setAttribute("name","condnDiv_row");
		mainDiv.appendChild(firstDIV);
		firstDIV.style.marginLeft="20px";
		firstDIV.style.marginTop="5px";
		var spanSelect=CreateSPAN(firstDIV,"","span_select"+divNum+"_1_1");
		spanSelect.style.width="10%";
		var uniqueSelectBox1=CreateSelectBox(spanSelect,"uniqueSelectStyle","uniqueSelectBox"+divNum+"_1_1");
        uniqueSelectBox1.setAttribute("onmousedown","assignToHidden(this)");
		/* $(uniqueSelectBox1).mousedown(function(){
			document.getElementById("selectIndex").value="";
            document.getElementById("selectIndex").value=uniqueSelectBox1.selectedIndex;
		 ;*/
		uniqueSelectBox1.setAttribute("onchange","checkSelectedColumn(this,this.value,'"+firstDIV.id+"')");
		if(brwsrValue.indexOf("firefox") > -1)
			{
			  uniqueSelectBox1.style.borderStyle="ridge";
			} 
		else
			{
			 uniqueSelectBox1.style.borderStyle="solid";
			}
		// populateSlctForRelEntities("uniqueSelectBox"+divNum+"_1_1",enttId,'','1');
		populateConditionBoxes("uniqueSelectBox"+divNum+"_1_1",enttId,"1");
		var spanImg=CreateSPAN(firstDIV,"","span_Img"+divNum+"_1_1");
		spanImg.style.position="relative";
		spanImg.style.top="3px";
		spanImg.style.marginLeft="3px";
		var imgAdd=CreateIMG(spanImg,"","img_Add"+divNum+"_1_1","/atCRM/images/JSON/add3.jpg","Add");
		imgAdd.style.width="15px";
		imgAdd.style.height="15px";
		$(imgAdd).attr("onclick","javascript:addCell('"+spanImg.id+"','"+firstDIV.id+"',"+enttId+")");
		//Or div
		var secondDIV=CreateDIV(mainDiv, "","condnDiv_"+divNum+"_2");
		secondDIV.style.marginTop="5px";
		var span21=CreateSPAN(secondDIV,"","span_or_"+divNum+"_1");
		span21.style.width="10%";
		var orLink=CreateA(span21,"","orLink_"+divNum+"_1","#","","Or","Click here to add or condition");
		orLink.style.color="blue";
		orLink.style.textDecoration="underline";
		$(orLink).attr("onclick","javascript:createCondnOrDiv('"+mainDiv.id+"','"+orLink.id+"','"+secondDIV.id+"')");
	 }
   }
     /*creation of condition divs ends here*/
     mapConditions();
}
/*Function to populate unique conditions select boxes*/
function populateConditionBoxes(selectBoxId,enttId,isMostSignfct,condnSelectVal)
{
  /*******If mapping from option get the indexes*****/
    var splitSelectBoxId=selectBoxId.split("_");
	var condnBlock   = splitSelectBoxId[0].replace("uniqueSelectBox","");
	var condnRow     = splitSelectBoxId[1];
	var selectBoxNum = splitSelectBoxId[2];
  /******mapping section ends here******/
  if(isMostSignfct) isMostSignfct=isMostSignfct.toString();
  var selectBox=document.getElementById(selectBoxId);
  var mainEnttId=document.getElementById("entity_select").value;
  var enttSelects=document.getElementsByName("enttSelect");
  var fieldSelects=document.getElementsByName("fieldSelect");
  selectBox[0]=new Option("None","");
  var drpDwnCnt=1;
  //If select box of related entities
  if(enttId){
	  var colMostSignfnt;
	  var enttColName;
	  var dataLength=relEntitiesData.length;
	  for(var i=0;i<dataLength;i++)
		{
		  if(enttId==relEntitiesData[i]["Id"]) {
			  colMostSignfnt=relEntitiesData[i]["colMostSignt"];//get mostSignctColName frm relEntt json data
		  }
		}
	  var ptrnVal=new RegExp(colMostSignfnt,"gi");
	  for(var m=0;m<enttSelects.length;m++)
		{
		  var enttSelectValue=enttSelects[m].value;
		  var optionValue=fieldSelects[m].value;
		  var optionText=$(fieldSelects[m]).find(":selected").text();
		  if(enttId==enttSelectValue&&optionValue)
			{
			  var enttColDtl=enttColArray[m].split("-");        //get enttColName from enttColDtl array
			  enttColName=enttColDtl[6];
			  enttRefTo=enttColDtl[7];
			  // filter foriegn key columns commneted on 17 Aug 2013, By Dony
			//  if(!enttRefTo)
			 // {
			    //Add new option to the select box only if it is not a foriegn key field
			    selectBox[drpDwnCnt]=new Option(optionText,optionValue);
			    //Check for the most significant column. If it is most significant column make it selected option
			    if((isMostSignfct=="1")&&ptrnVal.test(enttColName)==true) { 
						 selectBox[drpDwnCnt].selected = true;
			      }
                drpDwnCnt++;
			 // }
			}
		}
  }
  //Else if main Entity
  else
	{
	  var TblObj= dataJSONTest["entities"][0];
	  var L_ColMostSignfct=TblObj['colMostSignt'];
	  var L_enttColumns=TblObj['enttColumns'];
      var mainEnttColName;
	  var ptrnVal=new RegExp(L_ColMostSignfct,"gi");
	  for(var m=0;m<enttSelects.length;m++)
		{
		  var enttSelectValue=enttSelects[m].value;
		  var optionValue=fieldSelects[m].value;
		  var optionText=$(fieldSelects[m]).find(":selected").text();
			if(mainEnttId==enttSelectValue&&optionValue)
			 {
				  var enttColDtl=enttColArray[m].split("-");        //get enttColName from enttColDtl array
				  mainEnttColName=enttColDtl[6];
				  enttRefTo=enttColDtl[7];
				  /*Filter forien key columns commented on 17 Aug 2013, By Dony*/
				//  if(!enttRefTo)
				//  {
				    //Add new option to the select box only if it is not a foriegn key field
				    selectBox[drpDwnCnt]=new Option(optionText,optionValue);
				    if((isMostSignfct=="1")&&ptrnVal.test(mainEnttColName)==true) {
						  selectBox[drpDwnCnt].selected = true;
			         }
			 	    drpDwnCnt++;
				//  }
			 }
		}
	}
	if(condnSelectVal) $("#"+selectBoxId).val(condnSelectVal).attr('selected',true);
}
/**********Map condition boxes****************/
function mapConditions()
{
  if(mapJSON && mapJSON !="")
	{
        var locMapJSON  = mapJSON;
		var conditionsData = locMapJSON[2]["conditions"];
		var condnBlocksLen  = conditionsData.length;
		/*******Loop through the blocks of conditions*******/
		for(var m=0;m<condnBlocksLen;m++)
		  {
			 var blockNum = m+1;
             var condnBlock = conditionsData[m]["condnBlock"];
			 var condnRowsLen = condnBlock.length;
			 var enttId = conditionsData[m]["enttId"];
			 if(enttId == "undefined") enttId="";
			 var mainDivId ;
			 if(enttId == "") mainDivId= "condnDiv_"+blockNum;
			 else mainDivId = "condnDiv_"+blockNum+"_"+enttId;
			 /******Loop through the rows of conditions******/
			 for(var i=0;i<condnRowsLen;i++)
			  {
				 var rowNum = i+1;
				 var condnRow = condnBlock[i]["condnRow"];
				 var rowDiv = "condnDiv_"+blockNum+"_"+rowNum;
				 var rowNumForOr = rowNum+1;
				 var orRowDiv = "condnDiv_"+blockNum+"_"+rowNumForOr;
				 //var orLinkId="orLink_"+blockNum+"_"+rowNum;
				 var orLinkId="orLink_"+blockNum+"_"+i;
				// console.log(rowDiv);
				 var condnRowDiv = document.getElementById(rowDiv);

				// createCondnOrDiv(mainDivId,orLinkId,rowDiv)
				 var condnSelectsLen = condnRow.length;
				 /******Loop through the selects ******/
				 for(var j=0;j<condnSelectsLen;j++)
				  {
                    var condnSelectVal = condnRow[j]["enttCol"];
					if(condnSelectVal)
					  {    
						   var selectNum=j+1;
                           var selectBox = "uniqueSelectBox"+blockNum+"_"+rowNum+"_"+selectNum;
						  // var spanImgId = "span_Img"+blockNum+"_"+rowNum+"_"+selectNum;
						   var selectNumForImg = selectNum-1;
						   var divName = $(condnRowDiv).attr("name");
						   var spanImgId = "span_Img"+blockNum+"_"+rowNum+"_"+selectNumForImg;
						   if(document.getElementById(selectBox)) $("#"+selectBox).val(condnSelectVal).attr('selected',true);
						   else if(divName == "condnDiv_row" && enttId !="") addCell(spanImgId,rowDiv,enttId,condnSelectVal);
						   else if(divName == "condnDiv_row" && enttId =="") addCell(spanImgId,rowDiv,"",condnSelectVal);
						   else if(condnRowDiv && divName != "condnDiv_row"){
							   //createCondnOrDiv(mainDivId,orLinkId,orRowDiv,condnSelectVal);
							   createCondnOrDiv(mainDivId,orLinkId,rowDiv,condnSelectVal);
						   }
					  }
				  }
			  }
		  }
	}
}
/*Function to validate the data for mandatory fields*/
function validateMandatoryCols()
{
	var mandatoryColArray=new Array();
    var mainEnttId=document.getElementById("entity_select").value;
	var enttDescName=$("#entity_select").find(":selected").text();
    var TblObj= dataJSONTest["entities"][0];
	var L_entityName=TblObj['name'];
	var L_ColMostSignfct=TblObj['colMostSignt'];
	var L_enttColumns=TblObj['enttColumns'];
	var ptrnVal=new RegExp(L_ColMostSignfct,"gi");
	/*Get the mandatory columns detail*/
	for(j=0;j<L_enttColumns.length;j++)
		{
			var L_inner_tds_data =L_enttColumns[j]["cols"];
			L_col_id		= L_inner_tds_data[0];
			L_col_DescName	= L_inner_tds_data[1];
			L_col_name		= L_inner_tds_data[7];
			L_canBeNull   = L_inner_tds_data[9];
			if(L_canBeNull == "0")
			 {
				mandatoryColArray.push(mainEnttId+"-"+enttDescName+"-"+L_col_id+"-"+L_col_DescName);
			 }
		}
		/*Get the mandatory columns detail for related entities*/
    if(relEntitiesData){
     for(var i=0;i<relEntitiesData.length;i++)
		{
		   var relEnttId=relEntitiesData[i]["Id"];
		   var relEnttDescName=relEntitiesData[i]["descName"];
		   var colMostSignfnt=relEntitiesData[i]["colMostSignt"];
		   var L_enttColumns=relEntitiesData[i]["enttColumns"];
		   var ptrnVal=new RegExp(colMostSignfnt,"gi");
		   for(j=0;j<L_enttColumns.length;j++)
			  {
						var L_inner_tds_data =L_enttColumns[j]["cols"];
						L_col_id		= L_inner_tds_data[0];
						L_col_DescName	= L_inner_tds_data[1];
						L_ColName       = L_inner_tds_data[7];
						L_canBeNull   = L_inner_tds_data[9];
						if(L_canBeNull == "0")
						 {
							mandatoryColArray.push(relEnttId+"-"+relEnttDescName+"-"+L_col_id+"-"+L_col_DescName);
						 }
			  }
		}
	 }
	 /*Check for the mandatory columns in the data*/
	for(var n=0;n<mandatoryColArray.length;n++)
	  {
		var enttID=mandatoryColArray[n].split("-")[0];
		var enttDescName=mandatoryColArray[n].split("-")[1];
		var mandatoryColId=mandatoryColArray[n].split("-")[2];
		var enttColDescName=mandatoryColArray[n].split("-")[3];
		var fieldSelects=document.getElementsByName("fieldSelect");
		var enttSelects=document.getElementsByName("enttSelect");
		var foundFlag=0;
		var loopFlag=1;
		var NoOfSelects=fieldSelects.length;
		var selectaMinusOne=parseInt(NoOfSelects);
		var enttFound=0;
		var enttColIndex=0;
		var enttIndex=0;
		for(var t=0;t<NoOfSelects;t++)
		{
			 var NoSameEntties=0;
			 var fieldSelectVal=fieldSelects[t].value;
			 var enttSelectVal= enttSelects[t].value;
			 if(enttSelectVal==enttID)
			 {
				 enttFound=1;
				 enttIndex++;
				 if(!fieldSelectVal) enttColIndex++;
				 if(mandatoryColId==fieldSelectVal)
				 {
                    foundFlag=1;
				    break;
				 }
			 }
		}
		if(foundFlag == 0 && enttFound == 1 && enttColIndex != enttIndex)
        return "Mandatory column <label style='font-weight:bold'>"+enttColDescName+"</label> is not selected for <label style='font-weight:bold'>"+enttDescName+"</label> as 'Import to field'";
	 }
   return 0;
}
/*Mandatory validation ends here*/
function rememberUploadSelection()
{
	var windowElem;
    var content = "<div id='map_popup' style='padding-right:5%;padding-left:5%;padding-bottom:5%;padding-top:3%;'>";
	content +="<div id='mapHeading' style='text-align:left;font-weight:bold;margin-bottom:2%;border-bottom:1px solid;'>Save data map</div>";
	content +="<div style='font-size:10px;text-align: left;'>Save the details of your mapping, duplicate check and other selection you made in this import for future use. Give your map an easily recognisible name and description, since all users in your organization can use it.</div><div id='msg_div' style='visibility:hidden;font-size:10px;color:red;text-align:center;'>&nbsp;</div><table style='width:95%;font-family:tahoma;'><tr><td style='width:30%;font-size:14px;'>Map name</td>";
	content += "<td style='width:70%;'><input type='text' id='text_mapName' style='width:225px;border:1px solid;font-family:tahoma;font-size:12px;'/></td></tr>";
	content += "<tr><td style='width:30%;font-size:14px;'>Description</td><td style='width:70%;'><textarea id='txtArea_mapDesc' rows='3' style='width:225px;font-style:tahoma;font-size:12px;border:1px solid;'></textarea></td></tr>";
	content +="<tr><td style='height:10px;'></td><td></td></tr>";
	content +="<tr><td>&nbsp;</td><td><input type='button' id='btn_mapSave' value='Save' style='width:75px;height:32px;font-family:tahoma;font-size:16px;float:right;'/><input type='button' id='btn_mapCancel' value='Cancel' style='width:75px;height:32px;font-family:tahoma;font-size:16px;float:right;margin-right:2%;'/></td></tr></table></div>";

    var mapDiv = document.getElementById("map_div");
	mapDiv.innerHTML = "";
	mapDiv.innerHTML = content;
    mapDiv.style.display = "block";
           var btnObj = document.getElementById("map_btn");
			var btnPosition=$("#map_btn").offset();
			var btnTopPos=btnPosition.top;
			var btnLeftPos=btnPosition.left;
			var btnWidth = btnObj.offsetWidth;
			var btnHeight = btnObj.offsetHeight;
			var mapDivWidth = document.getElementById("map_div").offsetWidth;
			var diffInWidth = mapDivWidth-btnWidth;
			 btnLeftPos = btnLeftPos - diffInWidth;
			var mapDivHeight = document.getElementById("map_div").offsetHeight;
			btnTopPos = btnTopPos - mapDivHeight;
			$(mapDiv).offset({top:btnTopPos,left:btnLeftPos});

     $("#btn_mapCancel").click(function(){
		   //$("#map_div").hide("slow",{ direction: "down" }, 1000);
		   $("#map_div").hide("slow");
	 });
	 $("#btn_mapSave").click(function(){
		 var map_name= document.getElementById("text_mapName").value;
		 var msgDiv = document.getElementById("msg_div");
		 if(map_name === ""){
			  msgDiv.style.visibility = "visible";
			  msgDiv.innerHTML="Map name can not be empty";
			  setTimeout("document.getElementById('msg_div').style.visibility='hidden'",4000);
		 }
		 else
		 {
			/************Create Prelim page JSON************/
			var prelimDiv=document.getElementById("prelimPage");
			var mainEnttSel= document.getElementById("entity_select").value;
			var rad_ifDuplicate="";var rad_date="";var rad_source="";var rad_seperator="";
			if(document.getElementById("rad_reject").checked) rad_ifDuplicate = "rad_reject";
			else rad_ifDuplicate = "rad_update";
			if(document.getElementById("date_india").checked) rad_date = "date_india";
			else rad_date = "date_us";
			if(document.getElementById("sourceRad1").checked) rad_source = "sourceRad1";
			else rad_source = "sourceRad2";
			if(document.getElementById("FldSepRad1").checked) rad_seperator = "FldSepRad1";
			else if(document.getElementById("FldSepRad2").checked) rad_seperator = "FldSepRad2";
			else if(document.getElementById("FldSepRad3").checked) rad_seperator = "FldSepRad3";
			else rad_seperator = "FldSepRad4";
			var prilimDivJSON="{'EntityId':'"+mainEnttSel+"','ifDuplicate':'"+rad_ifDuplicate+"','dateItem':'"+rad_date+"',";
			prilimDivJSON +="'sourceItem':'"+rad_source+"','seperator':'"+rad_seperator+"'}";
			prilimDivJSON = prilimDivJSON.replace(/\'/gi,"\"");
			/**********Prelim page JSON part ends here***********/
			/************Create setup page JSON************/
			var setUpDivJSON="{'tableSelects':[";
			var enttSelects=document.getElementsByName("enttSelect");
			var enttSelLen = enttSelects.length;
			for(var i=0;i<enttSelLen;i++)
			{
				var enttSelect =enttSelects[i];
				var enttSelectId=enttSelect.id;
				var enttSelectValue=enttSelect.value;
				var enttColSelectId = enttSelectId.replace("enttBox","selectBox");
				var enttColSelect= document.getElementById(enttColSelectId); 
				var enttColValue=enttColSelect.value;
				if(i == 0) setUpDivJSON +="{'Entity':'"+enttSelectValue+"','enttCol':'"+enttColValue+"'}";
				else setUpDivJSON +=",{'Entity':'"+enttSelectValue+"','enttCol':'"+enttColValue+"'}";
			}
			setUpDivJSON +="]}";
			setUpDivJSON = setUpDivJSON.replace(/\'/gi,"\"");
			/**********Setup page JSON part ends here***********/
			/************Create Condition page JSON************/
			var conditionJSON ="{'conditions': [";
			 var conditionDivs = document.getElementsByName("condnDiv");
			 for(var j=0;j<conditionDivs.length;j++)
			  {
				  var conditonDiv   = conditionDivs[j];
				  var conditonDivId = conditonDiv.id;
				  var enttId = conditonDivId.split("_")[2];
				  if(enttId == "" || enttId =="undefined") enttId="";
				  if(j == 0) conditionJSON +="{'enttId':'"+enttId+"','condnBlock':[";
				  else conditionJSON +=",{'enttId':'"+enttId+"','condnBlock':[";
				  var divsRows = conditonDiv.getElementsByTagName("div");
				  var count =0;
				  for(var k=0;k<divsRows.length;k++)
				  {
					 var divRow = divsRows[k];
					 var divName = $(divRow).attr("name");
					 if(divName && divName == "condnDiv_row" ){
						 if(count == 0) conditionJSON +="{'condnRow':[";
						 else conditionJSON +=",{'condnRow':[";
						 count++;
						 var selectElems = divRow.getElementsByTagName("select");
						 for(var m=0;m<selectElems.length;m++)
						  {
							  var enttColSelectVal ="";
							  enttColSelectVal = selectElems[m].value;
							  if(m ==0) conditionJSON +="{'enttCol':'"+enttColSelectVal+"'}";
							  else conditionJSON +=",{'enttCol':'"+enttColSelectVal+"'}";
						  }
						   conditionJSON +="]}";
					 }
				  }
					  conditionJSON +="]}";
			  }
			  conditionJSON +="]}";
			  conditionJSON = conditionJSON.replace(/\'/gi,"\"");
			  var profileJSON="{\"profileJSON\":["+prilimDivJSON+","+setUpDivJSON+","+conditionJSON+"]}";
			/**********Condition page JSON part ends here***********/

            var mapDesc = document.getElementById("txtArea_mapDesc").value;
			var enttName = entityName.toLowerCase();
            var url2hit="/atCRM/custom/JSON/system/addUserUploadMap/editAction";
			var postData = "0-1-3="+map_name+"&0-1-4="+mapDesc+"&0-1-5="+enttName+"_upload&0-1-18="+entityName+"&0-1-19="+profileJSON;
			$.ajax({
				type: "POST",		
				url:url2hit,
				data: postData,
				success: function (doc)
				 {
				         msgDiv.style.visibility = "visible";
			             msgDiv.innerHTML=map_name+"-added successfully";
			             setTimeout(function(){document.getElementById('msg_div').style.visibility='hidden';
							$("#map_div").hide("slow");
						 },3000);
				 }
		 });
		 }
	 });
	
}
function mapOption(id)
{
    if(id && id !=""){
	 var url2hit="/atCRM/custom/JSON/system/getMapJSONForUpload.html?id="+id;
	 $.ajax({
		type:'GET',
		url:url2hit,
		cache:false,
		beforeSend: function() {
			$('#load_Img').show();
		},
		complete: function(){
			$('#load_Img').hide();
		},
		success: function (data)
		  {
			 var mapData = JSON.parse(data); 
			 mapJSON=mapData["profileJSON"];
			 var locMapJSON = mapJSON;
			 var jsnLen=locMapJSON.length;
			 var entityId=locMapJSON[0]["EntityId"];
             getEntityName(entityId)
			 var ifDuplicate=locMapJSON[0]["ifDuplicate"];
			 var dateItem=locMapJSON[0]["dateItem"];
			 var dataSource=locMapJSON[0]["sourceItem"];
			 var seperator=locMapJSON[0]["seperator"];
			 $("#entity_select").val(entityId).attr('selected',true);
			 if(ifDuplicate == "rad_reject") document.getElementById("rad_reject").checked = true;
			 else document.getElementById("rad_update").checked = true;
			 if(dateItem == "date_india") document.getElementById("date_india").checked = true;
			 else document.getElementById("date_us").checked = true;
			 if(dataSource == "sourceRad1") document.getElementById("sourceRad1").checked = true;
			 else {
				 document.getElementById("sourceRad2").checked = true;
				 showHideFile("1");
			 }
			 if(seperator == "FldSepRad1")  document.getElementById("FldSepRad1").checked = true;
			 else if(seperator == "FldSepRad2") document.getElementById("FldSepRad2").checked = true;
			 else if(seperator == "FldSepRad3") document.getElementById("FldSepRad3").checked = true;
			 else document.getElementById("FldSepRad4").checked = true;
		 }
	 });
   }
   else mapJSON = "";
   }
function populateUserOptions()
{
	var optionSelect = document.getElementById("map_select");
	//selectBox[0]=new Option("None","");
    var drpDwnCnt=1;
	var url2hit="/atCRM/custom/JSON/system/getUserOptions.htm";
	$.ajax({
			type:'GET',
			url:url2hit,
			dataType:'json',
			cache:false,
			success: function (data)
			{
               var listData = data["options"];
			   var listDataLen = listData.length;
			   for(var i=0;i<listDataLen;i++)
				{
				   var optionId   = listData[i]["id"];
				   var optionName = listData[i]["optionName"];
				   if(optionName) {
					   optionSelect[drpDwnCnt]=new Option(optionName,optionId);
					   drpDwnCnt++;
				   }
				}
			}
			});
}
