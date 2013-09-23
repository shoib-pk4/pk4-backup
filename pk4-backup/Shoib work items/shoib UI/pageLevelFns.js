function oppty2Quote(id,contDriven)
{
	var url=zcServletPrefix+"/custom/JSON/add/quote_header.htm?cont_driven="+contDriven+"&opptyId="+id;
	setUpPageParameters(url);
}

function oppty2Order(id,contDriven)
{
	var url=zcServletPrefix+"/custom/JSON/add/orders.htm?cont_driven="+contDriven+"&opptyId="+id;
	setUpPageParameters(url);
}


/********* Functions related to Quote Add starts here*****************/

var prodTotalAmnt4Quote=new Array();

function addQuotePageSetUp(myForm,params)
{
	prodTotalAmnt4Quote.length=0;
	var params=params.split(',');
	if(params[0])
	{
		document.getElementById('0-1-4001hdn').value=params[0];
		blockMappedObjectFields('0-1-4001','0-1-4001hdn');
	}
	else if(params[1])
	{
		document.getElementById('0-1-1901hdn').value=params[1];
		blockMappedObjectFields('0-1-1901','0-1-1901hdn');
	}
	if(document.getElementById('taxType'))
	{
		var taxTypeObj=document.getElementById('taxType');
		taxTypeObj.style.width="60%";
		taxTypeObj.style.cssFloat="right";
	}
	if(document.getElementById('0-1-9')&&document.getElementById('0-4101')&&document.getElementById('0-1-9_date_value'))
	{
		document.getElementById('0-1-9_date_value').value = document.getElementById('0-4101').value;
		document.getElementById('0-1-9').value = document.getElementById('0-4101').value;
	}
}

function QuoteTotalCalc(myForm,rows)
{ 
	for(var x=0; x<rows; x++)
	{
		var obj=document.getElementById('0-1501:'+x+'-401-411');
		//alert(document.getElementById('0-1501:'+x+'-401-2201').value);
		var prdName = document.getElementById('0-1501:'+x+'-401-2201').value; 
		if(prdName && prdName != "2 chars or **") blockMappedObjectFields('0-1501:'+x+'-401-2201','0-1501:'+x+'-401-418');
		calculateQuoteTotal(myForm, obj);
	}
}
function calculateQuoteTotal(myForm, Obj)
{	
	var elemId=Obj.id;	
	document.getElementById('addEditErrorDiv').style.display="none";
	var srcZcRank=elemId.split(':')[1].split('-')[0];
	var descount=document.getElementById(elemId).value;
	var listPriceObj=document.getElementById('0-1501:'+srcZcRank+'-401-410');
	var descPctObj=document.getElementById('0-1501:'+srcZcRank+'-401-431');
	var descAmntObj=document.getElementById('0-1501:'+srcZcRank+'-401-434');
	var actualPriceObj=document.getElementById('0-1501:'+srcZcRank+'-401-411');
	var noOfUnitsObj=document.getElementById('0-1501:'+srcZcRank+'-401-403');
	var totalPriceObj=document.getElementById('0-1501:'+srcZcRank+'-401-433');
	
	if(priKeyVal =="" && elemId=='0-1501:'+srcZcRank+'-401-2201')
	{ 
		descPctObj.value='';descAmntObj.value='';actualPriceObj.value='';noOfUnitsObj.value='';totalPriceObj.value='';
		descAmntObj.disabled=false;
		descPctObj.disabled=false;
	}
	if(elemId=='0-1501:'+srcZcRank+'-401-431')
	{
		var discPct=descPctObj.value;
		if(discPct>100)
		{ 
			var msg="Enter the discount percent less than 100.";
			document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul><li>"+msg+"</ul>";
			document.getElementById('addEditErrorDiv').style.display="block";
			descPctObj.focus();
			if(document.getElementById('0-1501:'+srcZcRank+'-401-411'))document.getElementById('0-1501:'+srcZcRank+'-401-411').focus();
			descPctObj.style.border="1px solid #CC0000";
			descAmntObj.disabled=true;
			descAmntObj.value="";
			return false;
		}
		else
		{  
			descPctObj.style.border="1px solid #CCCCCC";
			document.getElementById('addEditErrorDiv').style.display="none";
			var descAmnt=(ReplaceAll(descPctObj.value,",","")*ReplaceAll(listPriceObj.value,",",""))/100;
			if(descAmnt>0)descAmntObj.value=descAmnt.toFixed(2);
			else if(descAmnt<=0)descAmntObj.value='';
		}
		if(descAmntObj.value!=""||descPctObj.value!="")descAmntObj.disabled=true;
		else if(descAmntObj.value=="")descAmntObj.disabled=false;
		descPctObj.disabled=false;
	}
	else if(elemId=='0-1501:'+srcZcRank+'-401-434')
	{
		var descamt=0;
		descamt=descAmntObj.value;
		descamt=parseFloat(descamt);
		descamt=descamt.toFixed(2);	
		
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		descamt=ReplaceAll(descAmntObj.value,",","")
		if(descamt)descPctObj.value=descpct.toFixed(2);
		else descPctObj.value='';

		if(descPctObj.value!=""||descAmntObj.value!="")descPctObj.disabled=true;
		else if(descPctObj.value=="")descPctObj.disabled=false;
		descAmntObj.disabled=false;
	}
	else if(elemId=='0-1501:'+srcZcRank+'-401-411')
	{
		var discPct=listPriceObj.value-actualPriceObj.value;
		if(discPct==0)descAmntObj.value='';
		else descAmntObj.value=discPct.toFixed(2);
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		if(descpct)descPctObj.value=descpct.toFixed(2);
	}
	else if(elemId=='0-1501:'+srcZcRank+'-401-410')
	{
		var actPri=listPriceObj.value-descAmntObj.value;
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		if(descpct)descPctObj.value=descpct.toFixed(2);
		if(actPri==0)actualPriceObj.value='';
		else actualPriceObj.value=actPri;
	}
	else
	{ 
		if(descPctObj&&descAmntObj){descPctObj.disabled=false;descAmntObj.disabled=false;}
	}
	if(listPriceObj&&listPriceObj.value!="")
	{
		var listPrice=ReplaceAll(listPriceObj.value,",","");
		listPrice=parseFloat(listPrice);
		listPriceObj.value=listPrice.toFixed(2);
		var actPri=ReplaceAll(listPriceObj.value,",","")-ReplaceAll(descAmntObj.value,",","");
			actualPriceObj.value=actPri.toFixed(2);
		if (noOfUnitsObj.value=="")noOfUnitsObj.value=1;

		var finalAmount=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",",""));
		totalPriceObj=finalAmount.toFixed(2);
		document.getElementById('0-1501:'+srcZcRank+'-401-433').value=totalPriceObj;
		prodTotalAmnt4Quote['0-1501:'+srcZcRank+'-401-433']=finalAmount;
		calculateProdTotalPriceForQuote();
	}
}

function calculateProdTotalPriceForQuote(myForm,Obj,from_unblock)
{ 
	var totalAmntOfProds=0;
	for (var i in prodTotalAmnt4Quote)
	{
		var srcZcRank=i.split(':')[1].split('-')[0];
		if(document.getElementById('0-1501:'+srcZcRank+'-401-418') && document.getElementById('0-1501:'+srcZcRank+'-401-418').value!="")
			totalAmntOfProds=totalAmntOfProds+prodTotalAmnt4Quote[i];
	}

	if(document.getElementById('0-1501:0-401-418'))
		document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);

	var grandTotalAmnt=totalAmntOfProds;

	if(document.getElementById("0-1-179"))
	{
		var taxTypeAmnt1=document.getElementById('0-1-150txt').value;
		parentTaxId1=document.getElementById('0-1-150Par').value;
		if(parentTaxId1)
		{
			parentTaxVal1=getParentAmtForQuote(parentTaxId1);
			var tax1=(parentTaxVal1*taxTypeAmnt1)/100;
		}
		else
			var tax1=(totalAmntOfProds*taxTypeAmnt1)/100;
		document.getElementById('0-1-150').value=tax1.toFixed(2);
		grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-150').value);
	}
	if(document.getElementById("0-1-180"))
	{
		var taxTypeAmnt2=document.getElementById('0-1-157txt').value;
		parentTaxId2=document.getElementById('0-1-157Par').value;
		if(parentTaxId2)
		{
			parentTaxVal2=getParentAmtForQuote(parentTaxId2);
			var tax2=(parentTaxVal2*taxTypeAmnt2)/100;
		}
		else
			var tax2=(totalAmntOfProds*taxTypeAmnt2)/100;
		document.getElementById('0-1-157').value=tax2.toFixed(2);
		grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-157').value);
	}
	if(document.getElementById("0-1-181"))
	{		
		var taxTypeAmnt3=document.getElementById('0-1-164txt').value;
		parentTaxId3=document.getElementById('0-1-164Par').value;
		if(parentTaxId3)
		{
			parentTaxVal3=getParentAmtForQuote(parentTaxId3);
			var tax3=(parentTaxVal3*taxTypeAmnt3)/100;
		}
		else
			var tax3=(totalAmntOfProds*taxTypeAmnt3)/100;
		document.getElementById('0-1-164').value=tax3.toFixed(2);
		grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-164').value);
	}
	if(document.getElementById("0-1-182"))
	{
		var taxTypeAmnt4=document.getElementById('0-1-171txt').value;
		parentTaxId4=document.getElementById('0-1-171Par').value;
		if(parentTaxId4)
		{
			parentTaxVal4=getParentAmtForQuote(parentTaxId4);
			var tax4=(parentTaxVal4*taxTypeAmnt4)/100;
		}
		else
			var tax4=(totalAmntOfProds*taxTypeAmnt4)/100;
		document.getElementById('0-1-171').value=tax4.toFixed(2);
		grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-171').value);
	}
	if(document.getElementById("0-1-183"))
	{
		var taxTypeAmnt5=document.getElementById('0-1-178txt').value;
		parentTaxId5=document.getElementById('0-1-178Par').value;
		if(parentTaxId5)
		{
			parentTaxVal5=getParentAmtForQuote(parentTaxId5);
			var tax5=(parentTaxVal5*taxTypeAmnt5)/100;
		}
		else
			var tax5=(totalAmntOfProds*taxTypeAmnt5)/100;
		document.getElementById('0-1-178').value=tax5.toFixed(2);
		grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-178').value);
	}
	document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
}

function getParentAmtForQuote(parentTaxId)
{
	var selectBoxIds=new Array('0-1-144','0-1-151','0-1-158','0-1-165','0-1-172');
	var selectAmtIds=new Array('0-1-150','0-1-157','0-1-164','0-1-171','0-1-178');
	var parentAmt;
	for(i=0;i<selectBoxIds.length;i++)
	{
	   var selectedVal=document.getElementById(selectBoxIds[i]).value;
		if(selectedVal==parentTaxId)
		{
			parentAmt=selectAmtIds[i];
			break;
		}
	}
	return document.getElementById(parentAmt).value;
}

function clearTaxForQuote(img,taxPct,objId,taxName,taxPercent)
{ 
	if(img.src.indexOf("/atCRM/images/JSON/delete-icon.png")>=0)
	{
		document.getElementById(taxPct).value="0.00";
		document.getElementById(taxName).style.textDecoration="line-through";
		document.getElementById(taxPercent).style.textDecoration="line-through";
		img.src="/atCRM/images/JSON/addIcon.png";
		img.title="Add";
		calculateQuoteTotal('addEditForm',document.getElementById(objId));
	}
	else
	{
		$.ajax({
			type:"GET",
			url: zcServletPrefix+"/custom/Quote/getTaxType.xml?id="+document.getElementById(taxName).value,
			dataType: "xml",
			success: function(doc){
				TaxType=doc.getElementsByTagName('TaxType');
				var def_pct= TaxType[0] ? TaxType[0].getAttribute ("def_pct") : '';
				document.getElementById(taxPct).value=def_pct;
				calculateQuoteTotal('addEditForm',document.getElementById(objId));
			}			
		});
		
		document.getElementById(taxName).style.textDecoration="none";
		document.getElementById(taxPercent).style.textDecoration="none";
		img.src="/atCRM/images/JSON/delete-icon.png";
		img.title="Delete";
	}
}

function quote2Order(id)
{
	var url=zcServletPrefix+"/custom/JSON/add/orders.htm?cont_driven=1&quoteHeaderId="+id;
	setUpPageParameters(url);
}
/********* Functions related to Quote Add ends here*****************/

/********* Functions related to Order Add starts here*****************/

var prodTotalAmnt4Order=new Array();

function addOrderPageSetUp(myForm,contId,acctId)
{
	prodTotalAmnt4Order.length=0;
	if(contId)
	{
		document.getElementById('0-1-4001hdn').value=contId;
		blockMappedObjectFields('0-1-4001','0-1-4001hdn');
	}
	else if(acctId)
	{
		document.getElementById('0-1-1901hdn').value=acctId;
		blockMappedObjectFields('0-1-1901','0-1-1901hdn');
	}
	prodTotalAmnt4Order=new Array();
	var fieldsToBeDisabled=new Array("combo_0-1201-1357");
	for (fldsCntr=0;fldsCntr<fieldsToBeDisabled.length;fldsCntr++)
	{
		if (document.getElementById(fieldsToBeDisabled[fldsCntr]))
		{
					document.getElementById(fieldsToBeDisabled[fldsCntr]).disabled=true;
					document.getElementById(fieldsToBeDisabled[fldsCntr]).style.border="1px solid #DDDDDD";
		}
	}
	if (document.getElementById('div_0-1201-1357'))
	{
		document.getElementById('div_0-1201-1357').style.display="none";
	}
}

function orderTotalCalc(myForm,rows)
{ 
	for(var x=0; x<rows; x++)
	{
		var obj=document.getElementById('0-1501:'+x+'-401-438');
		var prodName = document.getElementById('0-1501:'+x+'-401-2201').value;
		if(prodName && prodName != "2 chars or **") blockMappedObjectFields('0-1501:'+x+'-401-2201','0-1501:'+x+'-401-418');
		calculateOrderTotal(myForm, obj);
	}		
}

function calculateOrderTotal(myForm, Obj)
{ 
	var elemId=Obj.id;
	var srcZcRank=elemId.split(':')[1].split('-')[0];
	var descount=document.getElementById(elemId).value;

	if(document.getElementById('0-1501:'+srcZcRank+'-401-410'))
	var listPriceObj=document.getElementById('0-1501:'+srcZcRank+'-401-410');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-438'))
	var descPctObj=document.getElementById('0-1501:'+srcZcRank+'-401-438');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-453'))
	var descAmntObj=document.getElementById('0-1501:'+srcZcRank+'-401-453');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-411'))
	var actualPriceObj=document.getElementById('0-1501:'+srcZcRank+'-401-411');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-403'))
	{
		var noOfUnitsObj=document.getElementById('0-1501:'+srcZcRank+'-401-403');
		var maxNoOfUnits=parseFloat(document.getElementById('0-1501:'+srcZcRank+'-401-403-max').value);
	}
	if(document.getElementById('0-1501:'+srcZcRank+'-401-452'))
	var totalPriceObj=document.getElementById('0-1501:'+srcZcRank+'-401-452');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-593'))

	var taxtypeAmnt1Obj=document.getElementById('0-1501:'+srcZcRank+'-401-593');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-600'))
	var taxtypeAmnt2Obj=document.getElementById('0-1501:'+srcZcRank+'-401-600');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-608'))
	var taxtypeAmnt3Obj=document.getElementById('0-1501:'+srcZcRank+'-401-608');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-615'))
	var taxtypeAmnt4Obj=document.getElementById('0-1501:'+srcZcRank+'-401-615');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-622'))
	var taxtypeAmnt5Obj=document.getElementById('0-1501:'+srcZcRank+'-401-622');

	if(document.getElementById('0-1-822'))
		var freightAmtObj = document.getElementById('0-1-822');
	if(document.getElementById('0-1-850'))
		var totDiscAmtObj = document.getElementById('0-1-850');
	if(document.getElementById('0-1-851'))
		var totDiscPctObj = document.getElementById('0-1-851');
	if(document.getElementById('grandTotalPrice'))
		var grandTotalPriceObj = document.getElementById('grandTotalPrice');

	if(document.getElementById('0-1501:'+srcZcRank+'-401-593'))
	var taxtype1Obj=document.getElementById('0-1501:'+srcZcRank+'-401-593');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-600'))
	var taxtype2Obj=document.getElementById('0-1501:'+srcZcRank+'-401-600');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-608'))
	var taxtype3Obj=document.getElementById('0-1501:'+srcZcRank+'-401-608');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-615'))
	var taxtype4Obj=document.getElementById('0-1501:'+srcZcRank+'-401-615');
	if(document.getElementById('0-1501:'+srcZcRank+'-401-622'))
	var taxtype5Obj=document.getElementById('0-1501:'+srcZcRank+'-401-622');

	var taxtypeAmnt1=0;
	var taxtypeAmnt2=0;
	var taxtypeAmnt3=0;
	var taxtypeAmnt4=0;
	var taxtypeAmnt5=0;

	if(maxNoOfUnits && (noOfUnitsObj.value>maxNoOfUnits)){document.getElementById('0-1501:'+srcZcRank+'-401-403').style.border="1px solid red";document.getElementById('0-1501:'+srcZcRank+'-401-403').title="No of units more than Quoted"}
    /******Get oppty id, if it is oppty to order conversion********/
	var opptyId = "";
	if(document.getElementById('0-1201').value) opptyId = document.getElementById('0-1201').value;
	if(opptyId =="" && elemId=='0-1501:'+srcZcRank+'-401-2201')
	{  
		if(descPctObj)descPctObj.value='';
		if(descAmntObj)descAmntObj.value='';
		if(actualPriceObj)actualPriceObj.value='';
		noOfUnitsObj.value='';
		totalPriceObj.value='';
		if(descAmntObj)descAmntObj.disabled=false;
		if(descPctObj)descPctObj.disabled=false;
		if(freightAmtObj)
		freightAmtObj.value='';
		totDiscAmtObj.value='';
		totDiscAmtObj.disabled=false;
		totDiscPctObj.value='';
		totDiscPctObj.disabled=false;
		grandTotalPriceObj.value=0.00;
	}
	
	if(elemId=='0-1501:'+srcZcRank+'-401-438' && descount!='')
	{
		descAmntObj.disabled=true;
		descPctObj.disabled=false;
		var descAmnt=(ReplaceAll(descPctObj.value,",","")*ReplaceAll(listPriceObj.value,",",""))/100;
		descAmntObj.value=descAmnt;
	}
	else if(elemId=='0-1501:'+srcZcRank+'-401-453' && descount!='')
	{
		descPctObj.disabled=true;
		descAmntObj.disabled=false;
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		descPctObj.value=descpct;
	}
	else
	{
		descPctObj.disabled=false;
		descAmntObj.disabled=false;
	}

	if(listPriceObj.value!="")
	{
		if(actualPriceObj)
			actualPriceObj.value=ReplaceAll(listPriceObj.value,",","")-ReplaceAll(descAmntObj.value,",","");
		else
			listPriceObj.value=ReplaceAll(listPriceObj.value,",","")-ReplaceAll(descAmntObj.value,",","");

		if (noOfUnitsObj.value=="")
		{
			noOfUnitsObj.value=1;
		}
		if(taxtypeAmnt1Obj)
		{
			if(actualPriceObj)
				taxtypeAmnt1=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*taxtypeAmnt1Obj.value)/100;
			else if(listPriceObj)
				taxtypeAmnt1=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*taxtypeAmnt1Obj.value)/100;
		}
		if(taxtypeAmnt2Obj)
		{
			if(actualPriceObj)
				taxtypeAmnt2=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*taxtypeAmnt2Obj.value)/100;
			else if(listPriceObj)
				taxtypeAmnt2=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*taxtypeAmnt2Obj.value)/100;
		}
		if(taxtypeAmnt3Obj)
		{
			if(actualPriceObj)
				taxtypeAmnt3=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*taxtypeAmnt3Obj.value)/100;
			else if(listPriceObj)
				taxtypeAmnt3=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*taxtypeAmnt3Obj.value)/100;
		}
		if(taxtypeAmnt4Obj)
		{
			if(actualPriceObj)
			taxtypeAmnt4=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*ReplaceAll(taxtypeAmnt4Obj.value,",",""))/100;
			else if(listPriceObj)
			taxtypeAmnt4=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*ReplaceAll(taxtypeAmnt4Obj.value,",",""))/100;
		}
		if(taxtypeAmnt5Obj)
		{
			if(actualPriceObj)
				taxtypeAmnt5=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*ReplaceAll(taxtypeAmnt5Obj.value,",",""))/100;
			else if(listPriceObj)
				taxtypeAmnt5=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",","")*ReplaceAll(taxtypeAmnt5Obj.value,",",""))/100;
		}

		if(actualPriceObj)
		var finalAmount=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",",""))+taxtypeAmnt1+taxtypeAmnt2+taxtypeAmnt3+taxtypeAmnt4+taxtypeAmnt5;
		else if(listPriceObj)
		var finalAmount=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",",""))+taxtypeAmnt1+taxtypeAmnt2+taxtypeAmnt3+taxtypeAmnt4+taxtypeAmnt5;

		totalPriceObj.value=finalAmount.toFixed(2);
		prodTotalAmnt4Order['0-1501:'+srcZcRank+'-401-452']=finalAmount;
		calculateProdTotalPriceForOrder();
	}
}

function calculateProdTotalPriceForOrder(myForm, Obj)
{
	if(document.getElementById('0-1-178'))
	var taxType1=document.getElementById('0-1-178');
	if(document.getElementById('0-1-185'))
	var taxType2=document.getElementById('0-1-185');
	if(document.getElementById('0-1-192'))
	var taxType3=document.getElementById('0-1-192');
	if(document.getElementById('0-1-199'))
	var taxType4=document.getElementById('0-1-199');
	if(document.getElementById('0-1-206'))
	var taxType5=document.getElementById('0-1-206');

	totalAmntOfProds=0;
	for (var i in prodTotalAmnt4Order) 
	{
		var srcZcRank=i.split(':')[1].split('-')[0];
		if(document.getElementById('0-1501:'+srcZcRank+'-401-418') && document.getElementById('0-1501:'+srcZcRank+'-401-418').value!="")
			totalAmntOfProds=totalAmntOfProds+prodTotalAmnt4Order[i];
	}
	if(document.getElementById('0-1501:0-401-418'))
		document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);

		var grandTotalAmnt=totalAmntOfProds;

		if(taxType1&&taxType1.value!='')
		{
			var taxTypeAmnt1=document.getElementById('0-1-184txt').value;
			parentTaxId1=document.getElementById('0-1-184Par').value;
			if(parentTaxId1)
			{
				parentTaxVal1=getParentAmtForOrder(parentTaxId1);
				var tax1=(parentTaxVal1*taxTypeAmnt1)/100;
			}
			else
				var tax1=(totalAmntOfProds*taxTypeAmnt1)/100;
			document.getElementById('0-1-184').value=tax1.toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-184').value);
		}
		if(taxType2&&taxType2.value!='')
		{
			var taxTypeAmnt2=document.getElementById('0-1-191txt').value;
			parentTaxId2=document.getElementById('0-1-191Par').value;
			if(parentTaxId2)
			{
				parentTaxVal2=getParentAmtForOrder(parentTaxId2);
				var tax2=(parentTaxVal2*taxTypeAmnt2)/100;
			}
			else
				var tax2=(totalAmntOfProds*taxTypeAmnt2)/100;
			document.getElementById('0-1-191').value=tax2.toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-191').value);
		}
		if(taxType3&&taxType3.value!='')
		{
			var taxTypeAmnt3=document.getElementById('0-1-198txt').value;
			parentTaxId3=document.getElementById('0-1-198Par').value;
			if(parentTaxId3)
			{
				parentTaxVal3=getParentAmtForOrder(parentTaxId3);
				var tax3=(parentTaxVal3*taxTypeAmnt3)/100;
			}
			else
				var tax3=(totalAmntOfProds*taxTypeAmnt3)/100;
			document.getElementById('0-1-198').value=tax3.toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-198').value);
		}
		if(taxType4&&taxType4.value!='')
		{
			var taxTypeAmnt4=document.getElementById('0-1-205txt').value;
			parentTaxId4=document.getElementById('0-1-205Par').value;
			if(parentTaxId4)
			{
				parentTaxVal4=getParentAmtForOrder(parentTaxId4);
				var tax4=(parentTaxVal4*taxTypeAmnt4)/100;
			}
			else
				var tax4=(totalAmntOfProds*taxTypeAmnt4)/100;
			document.getElementById('0-1-205').value=tax4.toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-205').value);
		}
		if(taxType5&&taxType5.value!='')
		{
			var taxTypeAmnt5=document.getElementById('0-1-212txt').value;
			parentTaxId5=document.getElementById('0-1-212Par').value;
			if(parentTaxId5)
			{
				parentTaxVal5=getParentAmtForOrder(parentTaxId5);
				var tax5=(parentTaxVal5*taxTypeAmnt5)/100;
			}
			else
				var tax5=(totalAmntOfProds*taxTypeAmnt5)/100;
			document.getElementById('0-1-212').value=tax5.toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-212').value);
		}

		document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
}

function getParentAmtForOrder(parentTaxId)
{
	var selectBoxIds=new Array('0-1-178','0-1-185','0-1-192','0-1-199','0-1-206');
	var selectAmtIds=new Array('0-1-184','0-1-191','0-1-198','0-1-205','0-1-212');

	var parentAmt;
	for(i=0;i<selectBoxIds.length;i++)
	{
	   var selectedVal=document.getElementById(selectBoxIds[i]).value;
		if(selectedVal==parentTaxId)
		{
			parentAmt=selectAmtIds[i];
			break;
		}
	}
	return document.getElementById(parentAmt).value;
}

function clearTaxForOrder(img,taxPct,objId,taxName,taxPercent)
{
	if(img.src.indexOf("/atCRM/images/JSON/delete-icon.png")>=0)
	{
		document.getElementById(taxPct).value="0.00";
		document.getElementById(taxName).style.textDecoration="line-through";
		document.getElementById(taxPercent).style.textDecoration="line-through";
		img.src="/atCRM/images/JSON/addIcon.png";
		img.title="Add";
		calculateOrderTotal('addEditForm',document.getElementById(objId));
	}
	else
	{
		$.ajax({
			type:"GET",
			url: zcServletPrefix+"/custom/Quote/getTaxType.xml?id="+document.getElementById(taxName).value,
			dataType: "xml",
			success: function(doc){
				TaxType=doc.getElementsByTagName('TaxType');
				var def_pct= TaxType[0] ? TaxType[0].getAttribute ("def_pct") : '';
				document.getElementById(taxPct).value=def_pct;
				calculateOrderTotal('addEditForm',document.getElementById(objId));
			}			
		});
		
		document.getElementById(taxName).style.textDecoration="none";
		document.getElementById(taxPercent).style.textDecoration="none";
		img.src="/atCRM/images/JSON/delete-icon.png";
		img.title="Delete";
	}
}

/********* Functions related to Order Add ends here*****************/

function SetPreferences(prefId,prefName,udmName,enttdiv,pageType,caption,recordId,userId) 
{
	if(!prefId)prefId='';
	if(!prefName)prefName='';
	if(!udmName)udmName='';
	if(!enttdiv)enttdiv='';
	if(!pageType)pageType='';
	if(!caption)caption='';
	if(!recordId)recordId='';
	if(!userId)userId='';
	if(recordId&&(recordId.indexOf(".")>0))
	{
    recordId=recordId.replace(/\,/g,"");
	recordId=recordId.split(".");
    recordId=recordId[0];
	}
    var queryString = "prefId=" + prefId + "&prefName=" + prefName + "&udmName=" + udmName + "&enttdiv=" + enttdiv + "&pageType=" + pageType + "&caption=" + caption +"&recordId=" + recordId+"&userId=" + userId;
	mainUrl=zcServletPrefix+"/custom/JSON/system/changePageLayout.html?" + queryString;
	setUpPageParameters(mainUrl);
}

function viewSalesAutomation(pkVal)
{
	setUpPageParameters(zcServletPrefix+'/custom/advancedAdd/viewAccContOppAcct.htm?id='+pkVal,entityDiv)
}

function viewInventoryDetails(pkVal)
{
	var url = zcServletPrefix+"/custom/JSON/view/tranx_header360View.htm?id="+pkVal;
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();	
}

function backPage(currDiv,lastDiv)
{
	if(currDiv.indexOf('-addEditDiv')!='-1')
	{
		currDiv=currDiv.replace("-addEditDiv","");
	}
	if(lastDiv.indexOf('-addEditDiv')!='-1')
	{
		lastDiv=lastDiv.replace("addEditDiv","DataDiv");
	}
	document.getElementById(currDiv+"-addEditDiv").style.display='none';
	var htmlIndex=currDiv.indexOf('.html');
	if(htmlIndex > 0)
	{
		currDiv=currDiv.split("-DataDiv")[0];
		document.getElementById('htmlIframe').style.display='block';
		document.getElementById('htmlIframe').src=currDiv;		
		entityDiv=currDiv+"-addEditDiv";
	}
	else
	{
		document.getElementById(lastDiv).style.display='block';
		document.title=document.getElementById(mnuItmId+'-pageTitle').value+' - Impel';		
		entityDiv=lastDiv;
		showMainMenu('mnuList_'+mnuItmId);
	}
	document.location.hash="";
}

function responsePage(mnuItm,response,reload,action,currPageUDM,formSubmitPostFun,noResponse)
{
	console.log(mnuItm,response,reload,action,currPageUDM,formSubmitPostFun,noResponse);
	if(noResponse!="noResponse")
	{
		document.getElementById("addEditDiv").style.display='none';
		var mainDataDiv = document.getElementById(parent.entityDiv);
		
		if(currPageUDM == 'custom/JSON/add/loy_pgm_xn'&& action == 'Add')
		{ 
			dispRecentVoucher();
			goToUrlListPage(zcServletPrefix+'/custom/JSON/list/loy_pgm_xn.htm');
			return;
		}
		if(currPageUDM == 'custom/JSON/add/loy_pgm_xn'&& action == 'Edit')
		{
			goToUrlListPage(zcServletPrefix+'/custom/JSON/list/loy_pgm_xn.htm');
			return;
		}
		if(currPageUDM == 'custom/JSON/add/loy_pgm_tier')
		{
			goToUrlListPage(zcServletPrefix+'/custom/JSON/list/loy_pgm_tier.htm');
			return;
		}
		if(currPageUDM == 'custom/JSON/add/loy_pgm_member')
		{
			goToUrlListPage(zcServletPrefix+'/custom/JSON/list/loy_pgm_member.htm');
			return;
		}
		if(currPageUDM == 'custom/JSON/add/loy_pgm_award')
		{
			goToUrlListPage(zcServletPrefix+'/custom/JSON/list/loy_pgm_award.htm');
			return;
		}
		if(currPageUDM == 'custom/JSON/add/loy_program')
		{
			goToUrlListPage(zcServletPrefix+'/custom/JSON/list/loy_program.htm');
			return;
		}
		var htmlIndex=mnuItm.indexOf('.html');
		if(htmlIndex > 0)
		{
			if(currPageUDM=='custom/JSON/add/orders')
			{
				dispRecentOrder();
			}
			document.getElementById('htmlIframe').style.display='block';
			document.getElementById('htmlIframe').src=mnuItm;
		}
		else
		{
			var objId='mnuList_'+subMnuItmId;
			//showSubMenu (objId,uri,fromMnu,dropIndex,reloadFlag);
			switch (response)
			{
				case "list":	
							if((action=="Add"||action=="Edit")&&reload==true)
							{
								if(document.getElementById(mnuItm+'-URL')){
								document.getElementById(mnuItm+'-URL').value=changeParameterValue (document.getElementById(mnuItm+'-URL').value,'page__number__1','1');
								document.getElementById(mnuItm+'-URL').value=deleteParameter (document.getElementById(mnuItm+'-URL').value,'condition__1',true);}
							}
							var uri=document.getElementById(mnuItm+'-URL').value; 
							//To remember pagination in list on save/cancel from add/Edit. By Hamsa.
							if(uri.indexOf('&order__by__1=')<0)
							{
							var uriWithoutPaginateParam = uri.slice(0,uri.lastIndexOf("&"));
							var uriWithPaginateParam = uri.substr(uri.lastIndexOf("&"),uri.lastIndexOf(" "));
							uri = uriWithoutPaginateParam+'&order__by__1='+uriWithPaginateParam;
							}
							if((uri.indexOf('?userEnt=All ')>0)&&(uri.indexOf('&filterCategory=')>0))
							{
								showSubMenu(objId,uri,'','',reloadFlag);
								break;
							}
							var fromMnu=dropMnuIndex
							var dropIndex=dropMnuIndex;
							var reloadFlag=reload;
									uri = uri.replace(/\?/g,"~");
									uri = uri.replace(/&/g,"@");
									uri = uri.replace(/=/g,"*"); 	
							if(dropIndex){
								window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#thirdLevelMenu?mnuId="+objId+"&uri="+uri+"&drop=drop&dropIndex="+dropIndex+"&reload="+reloadFlag;
							}
							else{
								window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#subMenu?mnuId="+objId+"&url="+uri+"&reload="+reloadFlag;
							}
						break;
				case "add":	
							var uri=document.getElementById('addEdit-URL').value;
								uri = uri.replace(/\?/g,"~");
								uri = uri.replace(/&/g,"@");
								uri = uri.replace(/=/g,"*");
							window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#subMenu?mnuId="+objId+"&url="+uri+"&reload=true&sid="+Math.random();
						break;
				case "view":
							var uri=document.getElementById('360View-URL').value;
								uri = uri.replace(/\?/g,"~");
								uri = uri.replace(/&/g,"@");
								uri = uri.replace(/=/g,"*");
							window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+uri+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
						break;
			}		
		}
	}
	// To call post submission function from add/edit page, By Hamsa.
	if(formSubmitPostFun)
	{
		var parnthsis = formSubmitPostFun.indexOf('(');
		var params="";
		if(parnthsis>0)
		{
			params = formSubmitPostFun.substring(parnthsis+1,(formSubmitPostFun.length)-1);
			var paramArray=params.split(",");
			formSubmitPostFun=formSubmitPostFun.substring(0,parnthsis);
		}
		var uri=document.getElementById(mnuItm+'-URL').value;
		dispatch(formSubmitPostFun,paramArray);
	}
	
}
function imposeMaxLength(Object, MaxLen)
 {
 	 if(Object.value.length > MaxLen)
	 {
	 	return false;
	 }
 }  
function hintQuestion(email)
{	
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Hint Question',
		minHeight:260,
		minWidth:420,	
		width:535,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var convertDivContent = "<table style='border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='hintQuestion' frameborder='0' src='"+zcServletPrefix+"/custom/LinkUser/addHintQuesAndAns.html?name="+email+"' width='530px' style='border:0px solid red' height='395px'></iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}
function showFullContent(elem,ev,tblName,colName,pkId,pkColumn,cTitle)
{
	if(!cTitle){
		var cTitle="";
	}
	if(document.all)
	{
	var X = (event.clientX);
	var Y = event.clientY;
	}
	else
	{
	var X = (ev.clientX);
	var Y = ev.clientY;
	}
	var JSONURL=zcServletPrefix+"/custom/JSON/system/retrieveColumnContent.html?tblName="+tblName+"&colName="+colName+"&pkId="+pkId+"&pkColumn="+pkColumn;
	$.ajax({
	type: "GET",			
	url: JSONURL,			
	success: function (data)
	{
		data=ReplaceAll(data,"\t","");
		data=ReplaceAll(data,"\n"," ");
		data=ReplaceAll(data,"\r","");
		doc = JSON.parse(data, function (key, value) 
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
		var content = doc["content"];	
		maxPos=document.documentElement.clientWidth-600;
		if(X>maxPos)X=maxPos;
		$(elem).closest('tr').attr("class","rowSelectedClass");
		document.getElementById("commonHoverDiv").style.display = "block";
		document.getElementById("commonHoverDiv").innerHTML="<div id='commonHoverDivHead' class='commonHoverHead'>"+cTitle+"<div style='text-align: right;cursor:pointer;color:#CC0066;padding-top:0px;padding-right:4px;float:right;width:25px;font-size: 11px;line-height:1' onclick='hideFullContent()'>Close</div></div><div id='commonHoverDivContent' name='commonHoverDivContent' style='padding:5px;text-align:justify;word-wrap: break-word;'></div>";
		document.getElementById("commonHoverDiv").style.top=Y+"px";
		document.getElementById("commonHoverDiv").style.left=X+"px";
		document.getElementById("commonHoverDiv").style.borderWidth="5px";
		document.getElementById("commonHoverDivContent").innerHTML = content;
	}
	});	
}  
//This function will be for activity add appointment and task
function AssignAppointmentTask(myForm)
{
	if(myForm == "quickAdd-form")
	{
		/*****Main activity setp starts here******/
		if(document.getElementById('QA_0-1-17')&&document.getElementById('QA_0-1-17').checked == true)
			document.getElementById('QA_0-1-17').value = 1;
		else
		{
			if(document.getElementById('QA_0-1-17')&&document.getElementById('QA_0-1-17').checked == false)
			document.getElementById('QA_0-1-17').value = 0;
		}
		
		if((document.getElementById('QA_0-1-13')&&document.getElementById('QA_0-1-13').value!="")||(document.getElementById('QA_0-1-10')&&document.getElementById('QA_0-1-10').value!=""))
		{
			if(document.getElementById('QA_0-1-16'))
			document.getElementById('QA_0-1-16').value = 1;
		}
		else
		{
			if(document.getElementById('QA_0-1-16'))
			document.getElementById('QA_0-1-16').value = 0;
		}

		if(document.getElementById('QA_0-1-96'))
		{
			if(document.getElementById('QA_0-1-17')&&document.getElementById('QA_0-1-17').checked == true)
			{
				var datetime = document.getElementById('QA_0-1-96').value;
				var dt = datetime.split(' ');
				var date = dt[0];
				var time = "00:00:00";
				var new_dt = date +" "+time;
				document.getElementById('QA_0-1-96').value = new_dt;
			}
		}
		if(document.getElementById('QA_0-1-5'))
		{
			if(document.getElementById('QA_0-1-17')&&document.getElementById('QA_0-1-17').checked == true)
			{
				var datetime = document.getElementById('QA_0-1-5').value;
				var dt = datetime.split(' ');
				var date = dt[0];
				var time = "23:59:59";
				var new_dt = date +" "+time;
				document.getElementById('QA_0-1-5').value = new_dt;
				if(document.getElementById('QA_0-1-5_date_value')&&document.getElementById('QA_0-1-5_date_value').value=="")
				{
					document.getElementById('QA_0-1-5_date_value').value=document.getElementById('QA_0-1-96_date_value').value;
					if(document.getElementById('QA_0-1-5_time_value')&&document.getElementById('QA_0-1-5_time_value').value=="")
					document.getElementById('QA_0-1-5_time_value').value="23:59:59";
					document.getElementById('QA_0-1-5').value = document.getElementById('QA_0-1-5_date_value').value +" "+document.getElementById('QA_0-1-5_time_value').value;
				}
			}
		}
		if(document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96').value!=""&&document.getElementById('QA_0-1-10'))
		{
			var dt = new Date();
			var curDate = dt.getDate('dd/MM/yyyy');
			var curMnth = dt.getMonth()+1;
			var curYr = dt.getFullYear();
			var currentDt = curDate + "/" + curMnth + "/" + curYr;
			var startDt = document.getElementById('QA_0-1-96').value;
			var stDt = startDt.split(' ');
			var st_dt = stDt[0];
			var dateValue = MaxDate(st_dt,currentDt,'dd/MM/yyyy');
			if(document.getElementById('QA_0-1-17'))
			{
				if(dateValue == 1 && document.getElementById('QA_0-1-17').checked == false)
				{
						if(document.getElementById('QA_0-1-13')&&document.getElementById('QA_0-1-13').value!="")
						{
							setReminderTimeinPage(document.getElementById('QA_0-1-13').value,myForm);
						}
							document.getElementById('QA_0-1-10').value=document.getElementById('QA_0-1-10').value;
				}
					else
					{
							if(document.getElementById('QA_0-1-13')&&document.getElementById('QA_0-1-13').value!="")
							{
								setReminderTimeinPage(document.getElementById('QA_0-1-13').value,myForm);
							}
							document.getElementById('QA_0-1-10').value=document.getElementById('QA_0-1-10').value;
					}
			}
			else
			{
					if(document.getElementById('QA_0-1-13')&&document.getElementById('QA_0-1-13').value!="")
					{
						setReminderTimeinPage(document.getElementById('QA_0-1-13').value,myForm);
						document.getElementById('QA_0-1-10').value = document.getElementById('QA_0-1-10').value;
					}
			}
		}

		if(document.getElementById('QA_0-1-96_time_value')&&document.getElementById('QA_0-1-96_time_value').value!=""&&document.getElementById('QA_0-1-5_time_value')&&document.getElementById('QA_0-1-5_time_value').value!="")
		{	
		  var FirstDt = document.getElementById('QA_0-1-96_date_value').value;
		  var FirstTm = document.getElementById('QA_0-1-96_time_value').value;
		  var SecDt = document.getElementById('QA_0-1-5_date_value').value;
		  var SecTm = document.getElementById('QA_0-1-5_time_value').value;
		  exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
		  if(document.getElementById('QA_0-1-7'))
			document.getElementById('QA_0-1-7').value = exactMinutes;
		}
        /*****Main activity setup ends here******/
        /*****Followup activity setup starts here**********/
		if(document.getElementById('QA_0-2201-2217')&&document.getElementById('QA_0-2201-2217').checked == true)
			document.getElementById('QA_0-2201-2217').value = 1;
		else
		{
			if(document.getElementById('QA_0-2201-2217')&&document.getElementById('QA_0-2201-2217').checked == false)
			document.getElementById('QA_0-2201-2217').value = 0;
		}
		
		if((document.getElementById('QA_0-2201-2213')&&document.getElementById('QA_0-2201-2213').value!="")||(document.getElementById('QA_0-2201-2210')&&document.getElementById('QA_0-2201-2210').value!=""))
		{
			if(document.getElementById('QA_0-2201-2216'))
			document.getElementById('QA_0-2201-2216').value = 1;
		}
		else
		{
			if(document.getElementById('QA_0-2201-2216'))
			document.getElementById('QA_0-2201-2216').value = 0;
		}

		if(document.getElementById('QA_0-2201-2296'))
		{
			if(document.getElementById('QA_0-2201-2217')&&document.getElementById('QA_0-2201-2217').checked == true)
			{
				var datetime = document.getElementById('QA_0-2201-2296').value;
				var dt = datetime.split(' ');
				var date = dt[0];
				var time = "00:00:00";
				var new_dt = date +" "+time;
				document.getElementById('QA_0-2201-2296').value = new_dt;
			}
		}
		if(document.getElementById('QA_0-2201-2205'))
		{
			if(document.getElementById('QA_0-2201-2217')&&document.getElementById('QA_0-2201-2217').checked == true)
			{
				var datetime = document.getElementById('QA_0-2201-2205').value;
				var dt = datetime.split(' ');
				var date = dt[0];
				var time = "23:59:59";
				var new_dt = date +" "+time;
				document.getElementById('QA_0-2201-2205').value = new_dt;
				if(document.getElementById('QA_0-2201-2205_date_value')&&document.getElementById('QA_0-2201-2205_date_value').value=="")
				{
					document.getElementById('QA_0-2201-2205_date_value').value=document.getElementById('QA_0-2201-2296_date_value').value;
					if(document.getElementById('QA_0-2201-2205_time_value')&&document.getElementById('QA_0-2201-2205_time_value').value=="")
					document.getElementById('QA_0-2201-2205_time_value').value="23:59:59";
					document.getElementById('QA_0-2201-2205').value = document.getElementById('QA_0-2201-2205_date_value').value +" "+document.getElementById('QA_0-2201-2205_time_value').value;
				}
			}
		}
		if(document.getElementById('QA_0-2201-2296')&&document.getElementById('QA_0-2201-2296').value!="")
		{ // &&document.getElementById('QA_0-2201-2210')
			var dt = new Date();
			var curDate = dt.getDate('dd/MM/yyyy');
			var curMnth = dt.getMonth()+1;
			var curYr = dt.getFullYear();
			var currentDt = curDate + "/" + curMnth + "/" + curYr;
			var startDt = document.getElementById('QA_0-2201-2296').value;
			var stDt = startDt.split(' ');
			var st_dt = stDt[0];
			var dateValue = MaxDate(st_dt,currentDt,'dd/MM/yyyy');
			if(document.getElementById('QA_0-2201-2217'))
			{
				if(dateValue == 1 && document.getElementById('QA_0-2201-2217').checked == false)
				{
						if(document.getElementById('QA_0-2201-2213')&&document.getElementById('QA_0-2201-2213').value!="")
						{
							setReminderTimeinPage(document.getElementById('QA_0-2201-2213').value,myForm);
						}
							document.getElementById('QA_0-2201-2210').value=document.getElementById('QA_0-2201-2210').value;
				}
					else
					{
							if(document.getElementById('QA_0-2201-2213')&&document.getElementById('QA_0-2201-2213').value!="")
							{
								setReminderTimeinPage(document.getElementById('QA_0-2201-2213').value,myForm);
							}
							document.getElementById('QA_0-2201-2210').value=document.getElementById('QA_0-2201-2210').value;
					}
			}
			else
			{
					if(document.getElementById('QA_0-2201-2213')&&document.getElementById('QA_0-2201-2213').value!="")
					{
						setReminderTimeinPage(document.getElementById('QA_0-2201-2213').value,myForm);
						document.getElementById('QA_0-2201-2210').value = document.getElementById('QA_0-2201-2210').value;
					}
			}
		}

		if(document.getElementById('QA_0-2201-2296_time_value')&&document.getElementById('QA_0-2201-2296_time_value').value!=""&&document.getElementById('QA_0-2201-2205_time_value')&&document.getElementById('QA_0-2201-2205_time_value').value!="")
		{	
		  var FirstDt = document.getElementById('QA_0-2201-2296_date_value').value;
		  var FirstTm = document.getElementById('QA_0-2201-2296_time_value').value;
		  var SecDt = document.getElementById('QA_0-2201-2205_date_value').value;
		  var SecTm = document.getElementById('QA_0-2201-2205_time_value').value;
		  exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
		  if(document.getElementById('QA_0-2201-2207'))
			document.getElementById('QA_0-2201-2207').value = exactMinutes;
		}
		/*********followup activity setup ends here**********/
		if(validateAppointment(myForm))
			return true;
		else 
			return false;
	}
	else
	{
		if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').checked == true)
			document.getElementById('0-1-17').value = 1;
		else
		{
			if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').checked == false)
			document.getElementById('0-1-17').value = 0;
		}
		
		if((document.getElementById('0-1-13')&&document.getElementById('0-1-13').value!="")||(document.getElementById('0-1-10')&&document.getElementById('0-1-10').value!=""))
		{
			if(document.getElementById('0-1-16'))	
			document.getElementById('0-1-16').value = 1;
		}
		else
		{
			if(document.getElementById('0-1-16'))
			document.getElementById('0-1-16').value = 0;
		}
		
		if(document.getElementById('0-1-96'))
		{
			if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').checked == true)
			{
				var datetime = document.getElementById('0-1-96').value;
				var dt = datetime.split(' ');
				var date = dt[0];
				var time = "00:00:00";
				var new_dt = date +" "+time;
				document.getElementById('0-1-96').value = new_dt;
			}
		}
		if(document.getElementById('0-1-5'))
		{
			if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').checked == true)
			{
				var datetime = document.getElementById('0-1-5').value;
				var dt = datetime.split(' ');
				var date = dt[0];
				var time = "23:59:59";
				var new_dt = date +" "+time;
				document.getElementById('0-1-5').value = new_dt;
				if(document.getElementById('0-1-5_date_value')&&document.getElementById('0-1-5_date_value').value=="")
				{
					document.getElementById('0-1-5_date_value').value=document.getElementById('0-1-96_date_value').value;
					if(document.getElementById('0-1-5_time_value')&&document.getElementById('0-1-5_time_value').value=="")
					document.getElementById('0-1-5_time_value').value="23:59:59";
					document.getElementById('0-1-5').value = document.getElementById('0-1-5_date_value').value +" "+document.getElementById('0-1-5_time_value').value;
				}
			}
		}
		
		if(document.getElementById('0-1-96')&&document.getElementById('0-1-96').value!=""&&document.getElementById('0-1-10'))
		{
			var dt = new Date();
			var curDate = dt.getDate('dd/MM/yyyy');
			var curMnth = dt.getMonth()+1;
			var curYr = dt.getFullYear();
			var currentDt = curDate + "/" + curMnth + "/" + curYr;
			var startDt = document.getElementById('0-1-96').value;
			var stDt = startDt.split(' ');
			var st_dt = stDt[0];
			var dateValue = MaxDate(st_dt,currentDt,'dd/MM/yyyy');
			if(document.getElementById('0-1-17'))
			{
				if(dateValue == 1 && document.getElementById('0-1-17').checked == false)
				{
						if(document.getElementById('0-1-13')&&document.getElementById('0-1-13').value!="")
						{
							setReminderTimeinPage(document.getElementById('0-1-13').value,myForm);
						}
							document.getElementById('0-1-10').value=document.getElementById('0-1-10').value;
				}
					else
					{
							if(document.getElementById('0-1-13')&&document.getElementById('0-1-13').value!="")
							{
								setReminderTimeinPage(document.getElementById('0-1-13').value,myForm);
							}
							document.getElementById('0-1-10').value=document.getElementById('0-1-10').value;
					}
			}
			else
			{
					if(document.getElementById('0-1-13')&&document.getElementById('0-1-13').value!="")
					{
						setReminderTimeinPage(document.getElementById('0-1-13').value,myForm);
						document.getElementById('0-1-10').value = document.getElementById('0-1-10').value;
					}
			}
		}
		if(document.getElementById('0-2201-2213')&&document.getElementById('0-2201-2213').value!="")
		{
			if(document.getElementById('0-2201-2216'))	
			document.getElementById('0-2201-2216').value = 1;
		}
		else
		{
			if(document.getElementById('0-2201-2216'))
			document.getElementById('0-2201-2216').value = 0;
		}
		if(document.getElementById('0-2201-2296')&&document.getElementById('0-2201-2296').value!=""&&document.getElementById('0-2201-2210'))
		{
			var dt = new Date();
			var curDate = dt.getDate('dd/MM/yyyy');
			var curMnth = dt.getMonth()+1;
			var curYr = dt.getFullYear();
			var currentDt = curDate + "/" + curMnth + "/" + curYr;
			if(document.getElementById('0-2201-2296'))
			var startDt = document.getElementById('0-2201-2296').value;
			var stDt = startDt.split(' ');
			var st_dt = stDt[0];
			var dateValue = MaxDate(st_dt,currentDt,'dd/MM/yyyy');
			if(document.getElementById('0-2201-2217'))
			{
				if(dateValue == 1 && document.getElementById('0-2201-2217').checked == false)
				{
						if(document.getElementById('0-2201-2213')&&document.getElementById('0-2201-2213').value!="")
						{
							setReminderTime4Folwup(document.getElementById('0-2201-2213').value,myForm);
						}
						document.getElementById('0-2201-2210').value=document.getElementById('0-2201-2210').value;
				}
				else
				{
						if(document.getElementById('0-2201-2213')&&document.getElementById('0-2201-2213').value!="")
						{
							setReminderTime4Folwup(document.getElementById('0-2201-2213').value,myForm);
						}
						document.getElementById('0-2201-2210').value=document.getElementById('0-2201-2210').value;
				}
			}
			else
			{
					if(document.getElementById('0-2201-2213')&&document.getElementById('0-2201-2213').value!="")
					{
						setReminderTime4Folwup(document.getElementById('0-2201-2213').value,myForm);
					}
					document.getElementById('0-2201-2210').value=document.getElementById('0-2201-2210').value;
			}
		}
		if(document.getElementById('0-1-96_time_value')&&document.getElementById('0-1-96_time_value').value!=""&&document.getElementById('0-1-5_time_value')&&document.getElementById('0-1-5_time_value').value!="")
		{	
		  var FirstDt = document.getElementById('0-1-96_date_value').value;
		  var FirstTm = document.getElementById('0-1-96_time_value').value;
		  var SecDt = document.getElementById('0-1-5_date_value').value;
		  var SecTm = document.getElementById('0-1-5_time_value').value;
		  exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
		  if(document.getElementById('0-1-7'))
			document.getElementById('0-1-7').value = exactMinutes;
		}
		if(validateAppointment(myForm))
			return true;
		else 
			return false;
	}	
}

function addSubstractDateTimeinPage(isAdd,remMinutes,toDate)
{
	var fmt="dd/MM/yyyy";
	var startDateTime = toDate.split(" ");
	if (startDateTime[1]=="" || startDateTime[1]=="0")
	{
		startDateTime[1]="H:i:s";
	}
	var date1 = startDateTime[0].split("/");
	var time1 = startDateTime[1].split(":");
	//switched formats
	if(!fmt || fmt=="dd.MM.yyyy" || fmt=="dd/MM/yyyy")
	{
		var dd1 = date1[0];
		var MM1 = date1[1];
		var yyyy1 = date1[2];
		var hh1 = time1[0];
		var min1 = time1[1];
		var ss1 = time1[2];
	}
	dt1 = new Date(yyyy1, MM1-1, dd1, hh1, min1, ss1);
	var changeInDays = 0;
	var changeInMilliseconds = 0;
	if (remMinutes)
	{
		changeInMilliseconds = 60000 * remMinutes;
	}
	if (isAdd)
	{
		dt1.setTime(dt1.getTime() + changeInMilliseconds);
		dt1.setDate(dt1.getDate() + changeInDays);
	}
	else
	{
		
		dt1.setTime(dt1.getTime() - changeInMilliseconds);
		dt1.setDate(dt1.getDate() - changeInDays);
	}
	return dt1;
}

function setReminderTimeinPage(val,myForm)
{
	var setRemBeforeMins = 0;
	setRemBeforeMins = val;
	if(myForm == "quickAdd-form")
	{
		if(document.getElementById('QA_0-1-96') && document.getElementById('QA_0-1-96').value!="")
		{
			var reminderDateTime = new Date(addSubstractDateTimeinPage(false,setRemBeforeMins,document.getElementById('QA_0-1-96').value));
			var hh = reminderDateTime.getHours();
			if (hh < 10){hh = "0" + hh}
			var mm = reminderDateTime.getMinutes();
			if (mm < 10){mm = "0" + mm}
			var ss = reminderDateTime.getSeconds();
			if (ss < 10){ss = "0" + ss}
			document.getElementById('QA_0-1-10').value = reminderDateTime.getDate() + "/" + (reminderDateTime.getMonth()+1) + "/" +  reminderDateTime.getFullYear()+" "+ hh + ":" + mm + ":" +ss;
		}
		if(document.getElementById('QA_0-2201-2296') && document.getElementById('QA_0-2201-2296').value!="")
		{
			var reminderDateTime = new Date(addSubstractDateTimeinPage(false,setRemBeforeMins,document.getElementById('QA_0-2201-2296').value));
			var hh = reminderDateTime.getHours();
			if (hh < 10){hh = "0" + hh}
			var mm = reminderDateTime.getMinutes();
			if (mm < 10){mm = "0" + mm}
			var ss = reminderDateTime.getSeconds();
			if (ss < 10){ss = "0" + ss}
			document.getElementById('QA_0-2201-2210').value = reminderDateTime.getDate() + "/" + (reminderDateTime.getMonth()+1) + "/" +  reminderDateTime.getFullYear()+" "+ hh + ":" + mm + ":" +ss;
		}
	}
	else
	{
		if(document.getElementById('0-1-96').value!="")
		{
			var reminderDateTime = new Date(addSubstractDateTimeinPage(false,setRemBeforeMins,document.getElementById('0-1-96').value));
			var hh = reminderDateTime.getHours();
			if (hh < 10){hh = "0" + hh}
			var mm = reminderDateTime.getMinutes();
			if (mm < 10){mm = "0" + mm}
			var ss = reminderDateTime.getSeconds();
			if (ss < 10){ss = "0" + ss}
			document.getElementById('0-1-10').value = reminderDateTime.getDate() + "/" + (reminderDateTime.getMonth()+1) + "/" +  reminderDateTime.getFullYear()+" "+ hh + ":" + mm + ":" +ss;
		}
	}
}
function setReminderTime4Folwup(val,myForm)
{
	var setRemBeforeMins = 0;
	setRemBeforeMins = val;
	if(document.getElementById('0-2201-2296').value!="")
	{
		var reminderDateTimeF = new Date(addSubstractDateTimeinPage(false,setRemBeforeMins,document.getElementById('0-2201-2296').value));
		var hh = reminderDateTimeF.getHours();
		if (hh < 10){hh = "0" + hh}
		var mm = reminderDateTimeF.getMinutes();
		if (mm < 10){mm = "0" + mm}
		var ss = reminderDateTimeF.getSeconds();
		if (ss < 10){ss = "0" + ss}
		document.getElementById('0-2201-2210').value = reminderDateTimeF.getDate() + "/" + (reminderDateTimeF.getMonth()+1) + "/" +  reminderDateTimeF.getFullYear()+" "+ hh + ":" + mm + ":" +ss;
	}
}

function timeDifference(FirstDt,FirstTm,SecDt,SecTm)
{
	var date1temp1 = FirstDt;
	var date1 = date1temp1.split("/")
	date1 = date1[1] + "/" + date1[0] + "/" + date1[2]
	var date1temp2 = FirstTm;
	var finaldate1 = date1 + " " + date1temp2

	var first_Date = new Date(finaldate1);
	var year1 = first_Date.getFullYear()
	var month1 = first_Date.getMonth()+1
	var date1 = first_Date.getDate()
	var hour1 = first_Date.getHours()
	var minute1 = first_Date.getMinutes()

	var date2temp2 = SecDt;
	var date2 = date2temp2.split("/")
	date2 = date2[1] + "/" + date2[0] + "/" + date2[2]
	var date2temp2 = SecTm;
	var finaldate2 = date2 + " " + date2temp2

	var second_Date = new Date(finaldate2); 
	var year2 = second_Date.getFullYear()
	var month2 = second_Date.getMonth()+1
	var date2 = second_Date.getDate()
	var hour2 = second_Date.getHours()
	var minute2 = second_Date.getMinutes()

	var difference = second_Date - first_Date;

	var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
	difference -= daysDifference * 1000 * 60 * 60 * 24
	var daystominutes = (daysDifference * 60 * 24);

	var hoursDifference = Math.floor(difference/1000/60/60);
	difference -= hoursDifference*1000*60*60
	var hourstominutes = (hoursDifference * 60)

	var minutesDifference = Math.floor(difference/1000/60);
	difference -= minutesDifference*1000*60
	var minutes = minutesDifference 

	var exactMinutes = minutes+hourstominutes+daystominutes;

	return exactMinutes;
}

function validateAppointment(myForm)
{
	var msg='';
	var dt = new Date();
	var curDate = dt.getDate('dd/MM/yyyy');
	var curMnth = dt.getMonth()+1;
	var curYr = dt.getFullYear();
	var currentDt = curDate + "/" + curMnth + "/" + curYr;
	var hh = dt.getHours();
	var mm = dt.getMinutes();
	var ss = dt.getSeconds();
	var currentTime =  hh+":"+mm+":"+ss;
	
	if(myForm == "quickAdd-form")
	{
		if(document.getElementById('QA_0-3901')) 
		var DtAndTm= document.getElementById('QA_0-3901').value;
	}
	else
	{
		if(document.getElementById('0-3901')) 
		var DtAndTm= document.getElementById('0-3901').value;
	}
	var SplitVal = DtAndTm.split(' ');
	var curentSrvrDt = SplitVal[0];
	var curentSrvrTm = SplitVal[1];
	var ap = SplitVal[2];
	if(myForm == "quickAdd-form")
	{
		if(document.getElementById('QA_0-1-59')&&document.getElementById('QA_0-1-59').value!="")
		{
			var startDt = document.getElementById('QA_0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var dt = new Date();
			var curDate = dt.getDate('dd/MM/yyyy');
			var curMnth = dt.getMonth()+1;
			var curYr = dt.getFullYear();
			var currentDt = curDate + "/" + curMnth + "/" + curYr;
			var dateValue = MaxDate(stDt,currentDt,'dd/MM/yyyy');
			var selIndx = document.getElementById('QA_0-1-59');
			var txt = selIndx.options[selIndx.selectedIndex].text;
			if(dateValue == 1 && txt == "Completed")
			{
				msg += "\n<li>Status can not be completed for future start date.</li>";
			}
		}
		if((document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96').value!="")&&(document.getElementById('QA_0-1-5')&&document.getElementById('QA_0-1-5').value!=""))
		{
			var startDt = document.getElementById('QA_0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var endDt = document.getElementById('QA_0-1-5').value;
			var endSplitDt = endDt.split(' ');
			var eDt = endSplitDt[0];
			var dateValue = MaxDate(stDt,eDt,'dd/MM/yyyy');
			if(dateValue == 1)
			{
				msg += "\n<li> Start date cannot be greater than End date.</li>";
			}
			if(dateValue == 0)
			{
				 if(document.getElementById('QA_0-1-96_date_value'))
				 var FirstDt = document.getElementById('QA_0-1-96_date_value').value;
				 if(document.getElementById('QA_0-1-96_time_value'))
				 var FirstTm = document.getElementById('QA_0-1-96_time_value').value;
				 if(document.getElementById('QA_0-1-5_date_value'))
				 var SecDt = document.getElementById('QA_0-1-5_date_value').value;
				 if(document.getElementById('QA_0-1-5_time_value'))
				 var SecTm = document.getElementById('QA_0-1-5_time_value').value;
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0)
					 msg += "\n<li> End date time cannot be earlier than or equal to start date time.</li>";
			}
		}
		if((document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96').value!="")&&(document.getElementById('QA_0-1-10_date_value')&&document.getElementById('QA_0-1-10_date_value').value!=""))
		{
			var startDt = document.getElementById('QA_0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var RemindDt = document.getElementById('QA_0-1-10').value;
			var remSplitDt = RemindDt.split(' ');
			var rDt = remSplitDt[0];
			var dateValue = MaxDate(stDt,rDt,'dd/MM/yyyy');

			if(dateValue == 2)
				msg += "\n<li> Reminder date cannot be greater than Start date.</li>";
			
			if(dateValue == 1 || dateValue == 0)
			{ 
				var FirstDt = curentSrvrDt;
				var FirstTm = curentSrvrTm+" "+ap;
				if(document.getElementById('QA_0-1-10_date_value'))
				 var SecDt =document.getElementById('QA_0-1-10_date_value').value;
				if(document.getElementById('QA_0-1-10_time_value'))
				 var SecTm =document.getElementById('QA_0-1-10_time_value').value;
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0){
					 msg += "\n  Reminder Date Time cannot set for earlier time.";
					 document.getElementById('QA_0-1-10').value = "";
				 }
			}
		}
		if((document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96').value!="")&&(document.getElementById('QA_0-1-13')&&document.getElementById('QA_0-1-13').value!=""))
		{
			var startDt = document.getElementById('QA_0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var RemindDt = document.getElementById('QA_0-1-10').value;
			var remSplitDt = RemindDt.split(' ');
			var rDt = remSplitDt[0];
			var dateValue = MaxDate(stDt,rDt,'dd/MM/yyyy');
			if(dateValue == 2)
			{
				msg += "\n<li>Reminder cannot be greater than Start date.</li>";
			}
			if(dateValue == 0 || dateValue == 1)
			{ 
				var FirstDt = curentSrvrDt;
				var FirstTm = curentSrvrTm+" "+ap;
				var SecDt = rDt;
				var SecTm = remSplitDt[1];
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0){
					 msg += "\n  Reminder cannot set for earlier time.";
					 document.getElementById('QA_0-1-10').value = "";
				 }
			}
		}
		if(msg)
		{
			 document.getElementById('errorDivQuickAdd').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			 document.getElementById('errorDivQuickAdd').style.display="block";
			 return false;
		}
		else 
		return true;
	}
	else
	{
		if(document.getElementById('0-2201-2203') && document.getElementById('0-2201-2203').value != "")
		{
			if((document.getElementById('0-2201-2296_date_value').value == "" || document.getElementById('0-2201-2296_time_value').value == "")||(!document.getElementById('0-2201-2296_date_value').value || !document.getElementById('0-2201-2296_time_value').value))
			{
				 msg += "\n<li>Non empty value needed for follow up start date time.</li>";
				 document.getElementById('0-2201-2296_date_value').style.border="1px solid #CC0000";
				 document.getElementById('0-2201-2296_date_value').focus();
			}
		}
		if(document.getElementById('0-1-59')&&document.getElementById('0-1-59').value!="")
		{
			var startDt = document.getElementById('0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var dateValue = MaxDate(stDt,currentDt,'dd/MM/yyyy');
			var selIndx = document.getElementById('0-1-59');
			var txt = selIndx.options[selIndx.selectedIndex].text;
			if(dateValue == 1 && txt == "Completed")
			{
				msg += "\n<li>Status can not be completed for future start date.</li>";
			}
		}
		if((document.getElementById('0-1-96')&&document.getElementById('0-1-96').value!="")&&(document.getElementById('0-1-5')&&document.getElementById('0-1-5').value!=""))
		{
			var startDt = document.getElementById('0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var endDt = document.getElementById('0-1-5').value;
			var endSplitDt = endDt.split(' ');
			var eDt = endSplitDt[0];
			var dateValue = MaxDate(stDt,eDt,'dd/MM/yyyy');
			if(dateValue == 1)
			{
				msg += "\n<li> Start date cannot be greater than End date.</li>";
			}
			if(dateValue == 0)
			{
				 if(document.getElementById('0-1-96_date_value'))
				 var FirstDt = document.getElementById('0-1-96_date_value').value;
				 if(document.getElementById('0-1-96_time_value'))
				 var FirstTm = document.getElementById('0-1-96_time_value').value;
				 if(document.getElementById('0-1-5_date_value'))
				 var SecDt = document.getElementById('0-1-5_date_value').value;
				 if(document.getElementById('0-1-5_time_value'))
				 var SecTm = document.getElementById('0-1-5_time_value').value;
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0)
					 msg += "\n<li> End date time cannot be earlier than or equal to start date time.</li>";
			}
		}
		if((document.getElementById('0-1-96')&&document.getElementById('0-1-96').value!="")&&(document.getElementById('0-1-10_date_value')&&document.getElementById('0-1-10_date_value').value!=""))
		{
			var startDt = document.getElementById('0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var RemindDt = document.getElementById('0-1-10').value;
			var remSplitDt = RemindDt.split(' ');
			var rDt = remSplitDt[0];
			var dateValue = MaxDate(stDt,rDt,'dd/MM/yyyy');
			if(dateValue == 2)
				msg += "\n<li>Reminder date cannot be greater than Start date.</li>";
			if(dateValue == 1 || dateValue == 0)
			{
				var FirstDt = curentSrvrDt;
				var FirstTm = curentSrvrTm+" "+ap;
				if(document.getElementById('0-1-10_date_value'))
				 var SecDt =document.getElementById('0-1-10_date_value').value;
				if(document.getElementById('0-1-10_time_value'))
				 var SecTm =document.getElementById('0-1-10_time_value').value;
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0){
					 msg += "\n Reminder Date Time cannot set for earlier time.";
					 document.getElementById('0-1-10').value = "";
				 }
			}
		}
		if((document.getElementById('0-1-96')&&document.getElementById('0-1-96').value!="")&&(document.getElementById('0-1-13')&&document.getElementById('0-1-13').value!=""))
		{
			var startDt = document.getElementById('0-1-96').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var RemindDt = document.getElementById('0-1-10').value;
			var remSplitDt = RemindDt.split(' ');
			var rDt = remSplitDt[0];
			var dateValue = MaxDate(stDt,rDt,'dd/MM/yyyy');
			if(dateValue == 2)
			{
				msg += "\n<li>Reminder cannot be greater than Start date.</li>";
			}
			if(dateValue == 0 || dateValue == 1)
			{ 
				var FirstDt = curentSrvrDt;
				var FirstTm = curentSrvrTm+" "+ap;
				var SecDt = rDt;
				var SecTm = remSplitDt[1];
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0){
					 msg += "\n Reminder cannot set for earlier time.";
					 document.getElementById('0-1-10').value = "";
				 }
					
			}
		}
		if((document.getElementById('0-2201-2296')&&document.getElementById('0-2201-2296').value!="")&&(document.getElementById('0-2201-2213')&&document.getElementById('0-2201-2213').value!=""))
		{
			var startDt = document.getElementById('0-2201-2296').value;
			var strtSplitDt = startDt.split(' ');
			var stDt = strtSplitDt[0];
			var RemindDt = document.getElementById('0-2201-2210').value;
			var remSplitDt = RemindDt.split(' ');
			var rDt = remSplitDt[0];
			var dateValue = MaxDate(stDt,rDt,'dd/MM/yyyy');
			if(dateValue == 2)
			{
				msg += "\n<li> Reminder cannot be greater than Start date.</li>";
			}
			if(dateValue == 0 || dateValue == 1)
			{ 
				var FirstDt = curentSrvrDt;
				var FirstTm = curentSrvrTm+" "+ap;
				var SecDt = rDt;
				var SecTm = remSplitDt[1];
				 exactMinutes = timeDifference(FirstDt,FirstTm,SecDt,SecTm);
				 if(exactMinutes <= 0){
					 msg += "\n Reminder cannot set for earlier time.";
					 document.getElementById('0-2201-2210').value = "";
				 }

			}
		}
		if(msg)
		{
			 document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			 document.getElementById('addEditErrorDiv').style.display="block";
			 return false;
		}
		else 
		return true;
	}
}

function disableReminder(myForm,val)
{
	if(myForm == "quickAdd-form")
	{	
		if(val)
		{
			var start_dt_param = val.split(',')[0];
			var stdt_val = start_dt_param.split(' ');
			var calndr_stdt = stdt_val[0];
			var calndr_sttm = stdt_val[1];

			var end_dt_param = val.split(',')[1];
			var endt_val = end_dt_param.split(' ');
			var calndr_endt = endt_val[0];
			var calndr_endtm = endt_val[1];

			var assigned_user_id = val.split(',')[2];
			if(document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96_date_value'))
			{
				document.getElementById('QA_0-1-96_date_value').value = calndr_stdt;
				if(document.getElementById('QA_0-1-96_time_value'))
				document.getElementById('QA_0-1-96_time_value').value = calndr_sttm;
			}
			if(document.getElementById('QA_0-1-5')&&document.getElementById('QA_0-1-5_date_value')&&document.getElementById('QA_0-1-5_time_value'))
			{
				document.getElementById('QA_0-1-5_date_value').value = calndr_endt;
				if(document.getElementById('QA_0-1-5_time_value'))
				document.getElementById('QA_0-1-5_time_value').value = calndr_endtm;
			}
		}
		else
		{
			if(document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96_date_value'))
			{
				if(document.getElementById('QA_0-3901')) 
				var DtAndTm= document.getElementById('QA_0-3901').value;
				var SplitVal = DtAndTm.split(' ');
				var curentSrvrDt = SplitVal[0];
				var curentSrvrTm = SplitVal[1];
				var ap = SplitVal[2];
				document.getElementById('QA_0-1-96_date_value').value = curentSrvrDt;
				if(document.getElementById('QA_0-1-96_time_value'))
				document.getElementById('QA_0-1-96_time_value').value = curentSrvrTm +" "+ ap;
			}
			if(document.getElementById('QA_0-1-5')&&document.getElementById('QA_0-1-5_date_value')&&document.getElementById('QA_0-1-5_time_value'))
			{
				if(document.getElementById('QA_0-4001')) 
				var DtAndTm= document.getElementById('QA_0-4001').value;
				var SplitVal = DtAndTm.split(' ');
				var curentSrvrEndDt = SplitVal[0];
				var curentSrvrEndTm = SplitVal[1];
				var ap = SplitVal[2];
				document.getElementById('QA_0-1-5_date_value').value = curentSrvrEndDt;
				if(document.getElementById('QA_0-1-5_time_value'))
				document.getElementById('QA_0-1-5_time_value').value = curentSrvrEndTm +" "+ ap;
			}
			if(document.getElementById('QA_0-1-2')&&document.getElementById('QA_0-1-2').value!="")
			{
				if(document.getElementById('QA_0-1-17')&&document.getElementById('QA_0-1-17').checked == true)
				{
					if(document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96_date_value')&&document.getElementById('QA_0-1-96_date_value').value!="")
						if(document.getElementById('QA_0-1-5')&&document.getElementById('QA_0-1-5_date_value')&&document.getElementById('QA_0-1-5_date_value').value == "")
					{
						document.getElementById('QA_0-1-5_date_value').value = document.getElementById('QA_0-1-96_date_value').value;
						if(document.getElementById('QA_0-1-5_time_value'))
						document.getElementById('QA_0-1-5_time_value').value =  "11:30 PM";
					}
					if(document.getElementById('QA_0-1-96_time_value')&&document.getElementById('QA_0-1-5_time_value'))
					{
						document.getElementById('QA_0-1-96_time_value').disabled = true;
						document.getElementById('QA_0-1-5_time_value').disabled = true;
					}
				}
				else
				{
					if(document.getElementById('QA_0-1-17')&&document.getElementById('QA_0-1-17').checked == false)
					{
						if(document.getElementById('QA_0-1-96_time_value')&&document.getElementById('QA_0-1-5_time_value'))
						{
							document.getElementById('QA_0-1-96_time_value').disabled = false;
							document.getElementById('QA_0-1-5_time_value').disabled = false;
						}
					}
				}
			}
		}
	}
	else
	{
		if(document.getElementById('0-1-96')&&document.getElementById('0-1-96_date_value')&&document.getElementById('0-1-2')&&document.getElementById('0-1-2').value=="")
		{
			if(document.getElementById('0-3901')) 
			var DtAndTm= document.getElementById('0-3901').value;
			var SplitVal = DtAndTm.split(' ');
			var curentSrvrDt = SplitVal[0];
			var curentSrvrTm = SplitVal[1];
			var ap = SplitVal[2];
			document.getElementById('0-1-96_date_value').value = curentSrvrDt;
			if(document.getElementById('0-1-96_time_value'))
			document.getElementById('0-1-96_time_value').value = curentSrvrTm +" "+ ap;
		}
		if(document.getElementById('0-1-5')&&document.getElementById('0-1-5_date_value')&&document.getElementById('0-1-2')&&document.getElementById('0-1-2').value==""&&document.getElementById('0-1-5_time_value'))
		{
			if(document.getElementById('0-4001')) 
			var DtAndTm= document.getElementById('0-4001').value;
			var SplitVal = DtAndTm.split(' ');
			var curentSrvrEndDt = SplitVal[0];
			var curentSrvrEndTm = SplitVal[1];
			var ap = SplitVal[2];
			document.getElementById('0-1-5_date_value').value = curentSrvrEndDt;
			if(document.getElementById('0-1-5_time_value'))
			document.getElementById('0-1-5_time_value').value = curentSrvrEndTm +" "+ ap;
		}
		
		if(document.getElementById('0-1-2')&&document.getElementById('0-1-2').value!="")
		{
			if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').checked == true)
			{
				if(document.getElementById('0-1-96')&&document.getElementById('0-1-96_date_value')&&document.getElementById('0-1-96_date_value').value!="")
					if(document.getElementById('0-1-5')&&document.getElementById('0-1-5_date_value')&&document.getElementById('0-1-5_date_value').value == "")
				{
					document.getElementById('0-1-5_date_value').value = document.getElementById('0-1-96_date_value').value;
					if(document.getElementById('0-1-5_time_value'))
					document.getElementById('0-1-5_time_value').value =  "11:30 PM";
				}
				if(document.getElementById('0-1-96_time_value')&&document.getElementById('0-1-5_time_value'))
				{
					document.getElementById('0-1-96_time_value').disabled = true;
					document.getElementById('0-1-5_time_value').disabled = true;
				}
			}
			else
			{
				if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').checked == false)
					if(document.getElementById('0-1-96_time_value')&&document.getElementById('0-1-5_time_value'))
					{
						document.getElementById('0-1-96_time_value').disabled = false;
						document.getElementById('0-1-5_time_value').disabled = false;
					}
			}
		}
	}
}

function disableReminderForAllDay(myForm,obj)
{
	var dt = new Date();
	var curDate = dt.getDate('dd/MM/yyyy');
	var curMnth = dt.getMonth()+1;
	var curYr = dt.getFullYear();
	var currentDt = curDate + "/" + curMnth + "/" + curYr;
	if(myForm == "quickAdd-form")
	{
			if(document.getElementById('QA_0-1-17').checked == true)
			{
				if(document.getElementById('QA_0-1-96')&&document.getElementById('QA_0-1-96_date_value')&&document.getElementById('QA_0-1-96_date_value').value!="")
					if(document.getElementById('QA_0-1-5')&&document.getElementById('QA_0-1-5_date_value')&&document.getElementById('QA_0-1-5_date_value').value == "")
					document.getElementById('QA_0-1-5_date_value').value = document.getElementById('QA_0-1-96_date_value').value;
			
				if(document.getElementById('QA_0-1-96_time_value'))
				document.getElementById('QA_0-1-96_time_value').value = "12:00 AM";
				if(document.getElementById('QA_0-1-5_time_value'))
				document.getElementById('QA_0-1-5_time_value').value = "11:30 PM";
				document.getElementById('QA_0-1-96_time_value').disabled = true;
				document.getElementById('QA_0-1-5_time_value').disabled = true;
			}
			else
			{
				if(document.getElementById('QA_0-1-17').checked == false)
				{
					document.getElementById('QA_0-1-96_time_value').disabled = false;
					document.getElementById('QA_0-1-5_time_value').disabled = false;
					if(document.getElementById('QA_0-3901')) 
					var DtAndTm= document.getElementById('QA_0-3901').value;
					var SplitVal = DtAndTm.split(' ');
					var curentSrvrTm = SplitVal[1];
					var ap1 = SplitVal[2];
					if(document.getElementById('QA_0-1-96_time_value'))
					document.getElementById('QA_0-1-96_time_value').value = curentSrvrTm +" "+ ap1;
					if(document.getElementById('QA_0-4001')) 
					var DtAndTm= document.getElementById('QA_0-4001').value;
					var SplitVal = DtAndTm.split(' ');
					var curentSrvrEndTm = SplitVal[1];
					var ap2 = SplitVal[2];
					if(document.getElementById('QA_0-1-5_time_value'))
					document.getElementById('QA_0-1-5_time_value').value = curentSrvrEndTm +" "+ ap2;
				}
			}
	}
	else
	{
			if(document.getElementById('0-1-17').checked == true)
			{
				if(document.getElementById('0-1-96')&&document.getElementById('0-1-96_date_value')&&document.getElementById('0-1-96_date_value').value!="")
					if(document.getElementById('0-1-5')&&document.getElementById('0-1-5_date_value')&&document.getElementById('0-1-5_date_value').value == "")
					document.getElementById('0-1-5_date_value').value = document.getElementById('0-1-96_date_value').value;
				
				if(document.getElementById('0-1-96_time_value'))
				document.getElementById('0-1-96_time_value').value = "12:00 AM";
				if(document.getElementById('0-1-5_time_value'))
				document.getElementById('0-1-5_time_value').value = "11:30 PM";
				document.getElementById('0-1-96_time_value').disabled = true;
				document.getElementById('0-1-5_time_value').disabled = true;
			}
			else
			{
				if(document.getElementById('0-1-17').checked == false)
				{
					document.getElementById('0-1-96_time_value').disabled = false;
					document.getElementById('0-1-5_time_value').disabled = false;
					if(document.getElementById('0-3901')) 
					var DtAndTm= document.getElementById('0-3901').value;
					var SplitVal = DtAndTm.split(' ');
					var curentSrvrTm = SplitVal[1];
					var ap1 = SplitVal[2];
					if(document.getElementById('0-1-96_time_value'))
					document.getElementById('0-1-96_time_value').value = curentSrvrTm +" "+ ap1;
					if(document.getElementById('0-4001')) 
					var DtAndTm= document.getElementById('0-4001').value;
					var SplitVal = DtAndTm.split(' ');
					var curentSrvrEndTm = SplitVal[1];
					var ap2 = SplitVal[2];
					if(document.getElementById('0-1-5_time_value'))
					document.getElementById('0-1-5_time_value').value = curentSrvrEndTm +" "+ ap2;
				}
			}
	}
}

function checkStatus(myForm,chkBoxvalues)
{
	 var status_chkbx = chkBoxvalues.split(',')[0];
	var includ_onlin_chkbx = chkBoxvalues.split(',')[1];

	if(document.getElementById('0-1-96'))
	  if(status_chkbx==0)
		document.getElementById('0-1-96').checked = false;
	  else if(status_chkbx==1)
		document.getElementById('0-1-96').checked = true;

	if(document.getElementById('0-1-155'))
	  if(includ_onlin_chkbx==0)
		document.getElementById('0-1-155').checked = false;
	  else if(includ_onlin_chkbx==1)
		document.getElementById('0-1-155').checked = true;
}

function selectSMSTmplt(myForm,obj){
	if(obj.checked){
		$.ajax({
			type: "GET",
			url: zcServletPrefix+"/custom/JSON/SMSTemplate/listSMSTemplates.htm",
			dataType: "json",
			async:false,
			success: function(data)
			{
				showSMSTmplt(obj, data);
			 }
		 })
	}else{
		obj.value="";
	}
}

function showSMSTmplt(obj, data){
	var commonPopupDivObj=document.getElementById('templateSelector');
	commonPopupDivObj.innerHTML="<div style='font-size:10px;'>Please select the template or enter the message you want to use for sending SMS. <br /> 1. Click \"Send SMS\" to send SMS. <br /> 2. Close the dialog box for not to send SMS. <br /> Note: If you close the dialog box, SMS will not be sent but the data will be added.</div>";
	commonPopupDivObj.innerHTML+="<div class='jsonErrorDiv' id='sendSMSErrorMsg'></div>";
	commonPopupDivObj.style.margin="10px";
	var smsTable=CreateTable(commonPopupDivObj,'','','',0,0, 'left');
	smsTable.width="90%";
	var smsTbody=CreateBody(smsTable,'','');
	var smsTD;
	var smsTR;

	smsTR=CreateTR(smsTbody,'','');
	smsTD=CreateTD(smsTR,'','');
	var rowData=data.RowData;
	if(rowData.length>0)smsTD.innerHTML="Templates: ";
	smsTD=CreateTD(smsTR,'','');
	if(rowData.length>0){
		var tmpltSelectBox=CreateSelectBox(smsTD, 'inputFieldClass', 'templateId', '','');
		var tmpltOptions;

		for(rows=0;rows<rowData.length;rows++){
			tmpltOptions=CreateOptionBox(tmpltSelectBox, '', '', rowData[rows]['dataColumn'][0], rowData[rows]['dataColumn'][1]);
		}
		AddChangeEventListener(tmpltSelectBox,function (){showSelectedTmplt(obj, tmpltSelectBox.value, rowData)});
	}

	smsTR=CreateTR(smsTbody,'','');
	smsTD=CreateTD(smsTR,'','');
	smsTD.innerHTML="Message: ";
	smsTD.vAlign="top";
	smsTD=CreateTD(smsTR,'','');
	var tmpltMsgEle=CreateTEXTAREA(smsTD, 'inputFieldClass', 'templateMsg', '','');
	tmpltMsgEle.rows="4";
	if(rowData.length>0)tmpltMsgEle.value=rowData[0]['dataColumn'][3];
	$('#templateMsg').setCounter(159);
	
	var trigger = "";

	$('#templateSelector').dialog('open');
	$('#templateSelector').dialog({
		autoOpen:true,
		modal: true,
		width: 355,
		height:285,
		closeOnEscape:true,
		buttons: {
				'Send SMS': function() {
						trigger = "create";
						if(addTmpltIdToSMS(obj))
						$('#templateSelector').dialog('close');
				}
		},
		close: function() {
				if (trigger != "create")
					dontAddTmpltIdToSendSMS(obj);
				else if(trigger == "create")
					addTmpltIdToSendSMS(obj);
		}
	});
}

function addTmpltIdToSendSMS(obj){
	if(document.getElementById("templateMsg").value==""){
		document.getElementById('sendSMSErrorMsg').innerHTML="Please enter the message or click don't send SMS button.";
		document.getElementById('sendSMSErrorMsg').style.display="block";
		document.getElementById('sendSMSErrorMsg').style.width="90%";
		document.getElementById('sendSMSErrorMsg').style.display="block";
		return false;
	}else{
		obj.value=document.getElementById("templateMsg").value;
		document.getElementById('sendSMSErrorMsg').style.display="none";
		return true;
	}
}
function dontAddTmpltIdToSendSMS(obj){
	obj.value="";
	obj.checked=false;
}
function showSelectedTmplt(obj, tmpltId, rowData){
	for(rows=0;rows<rowData.length;rows++){
		if(rowData[rows]['dataColumn'][0]==tmpltId){
			document.getElementById('templateMsg').value=rowData[rows]['dataColumn'][3];
			obj.value=rowData[rows]['dataColumn'][3];
		}
	}
}
function campaignReport(id,rowName,rowId)
{   
   setUpPageParameters (zcServletPrefix+"/custom/govardhan/CampaginReport.html?mktpgm="+id,entityDiv);  
}
function campaignSendmail(id,rowName,rowId)
{
	var Flag=0;
	var Tmplt_Id="";
	setUpPageParameters (zcServletPrefix+"/custom/govardhan/setupCampaignDetails.html?Mktg_ProgramId="+id+"&Tmplt_Id="+Tmplt_Id+"&Flag="+Flag,entityDiv);
}
function populateOpptySource(myForm,Id)
{
	var contId = Id.split(',')[0];
	var opptyId = Id.split(',')[1];
	var OrgId = Id.split(',')[2];
	var JSONURL = zcServletPrefix+"/custom/JSON/system/getOpportunitySourcValue.htm?contactId="+contId+"&OpportunityId="+opptyId;
	$.ajax({
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				var OpptySrcName = doc.getOpportunitySourcValue.getOpptySource;
				var OpptyContName = doc.getOpportunitySourcValue.getLinkedContact;
				var OpptyAcctName = doc.getOpportunitySourcValue.getLinkedAccount;
				var OpptyMktgPgmName = doc.getOpportunitySourcValue.getLinkedMktgCamp;
				var OpptySrcId = doc.getOpportunitySourcValue.getOpptySourceId;
				var OpptyContId = doc.getOpportunitySourcValue.getLinkedContactId;
				var OpptyAcctId = doc.getOpportunitySourcValue.getLinkedAccountId;
				var OpptyMktgPgmId = doc.getOpportunitySourcValue.getLinkedMktgCampId;
				if(OpptySrcId)
				document.getElementById('0-801-842').value = OpptySrcId;
				if(OpptyContId)
				document.getElementById('0-5301').value = OpptyContId;
				if(OpptyAcctId)
				document.getElementById('0-5301').value = OpptyAcctId;
				if(OpptyMktgPgmId)
				document.getElementById('0-5301').value = OpptyMktgPgmId;
				if(OpptyAcctName)
				document.getElementById('0-801-842anc').innerHTML = OpptySrcName+":"+OpptyAcctName;
				if(OpptyContName)
				document.getElementById('0-801-842anc').innerHTML = OpptySrcName+":"+OpptyContName;
				if(OpptyMktgPgmName)
				document.getElementById('0-801-842anc').innerHTML = OpptySrcName+":"+OpptyMktgPgmName;
				if(document.getElementById('0-801-842anc')&&(!OpptyAcctName)&&(!OpptyContName)&&(!OpptyMktgPgmName))
				document.getElementById('0-801-842anc').innerHTML = OpptySrcName;
			}
		});

		if(document.getElementById('0-801-802')&&document.getElementById('0-801-802').value!="")
		{
			if(document.getElementById('0-801-841')&&document.getElementById('0-801-841').value!="")
			{
				var str_loc = document.getElementById('0-801-841').value;
				var new_str = unescape(str_loc).replace("&#39;","'");
				document.getElementById('0-801-841').value = new_str;
			}
			if(document.getElementById('0-1-63')&&document.getElementById('0-1-63').value!="")
			{
				var str_loc = document.getElementById('0-1-63').value;
				var str_unesc = unescape(str_loc).replace("&#39;","'");
				document.getElementById('0-1-63').value = str_unesc;
			}
		}
		if(OrgId)
		{	
			var formName=document.getElementById('addEditForm');
			var layoutLinks=formName.getElementsByTagName('a');
			if(OrgId == 18)
			{
				for (i=0;i<layoutLinks.length;i++)
				{
					if(layoutLinks[i].id=='tab_Prefs')
						layoutLinks[i].style.display="none";
				}
			}
		}
}
function resetPwd(id, name, rowId)
{
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Reset Password - '+name,
		minHeight:100,
		minWidth:200,	
		width:450,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Do you want to reset password for <span style='font-weight:bold;'>"+name+"</span></div><div>If you click on yes, changed password will be sent to user through email.</div><span style='float:right; margin-right:50px; margin-top:20px;margin-bottom:20px;'><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;aprovedToReset("+id+",\""+name+"\")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";
}
function fetchTimeZnValForOrg(myForm,time_values)
{
	if(time_values.split(',')[0])
	var time_zn_val = time_values.split(',')[0];
	if(time_values.split(',')[1])
	var strt_org_time = time_values.split(',')[1];
	if(time_values.split(',')[2])
	var end_org_time = time_values.split(',')[2];

	 if(time_zn_val!=''&&document.getElementById('0-1-250'))
	{	
		var gmt_str_value = '';
		 if(time_zn_val == -12.00)
			gmt_str_value += "(GMT -12:00) Eniwetok, Kwajalein";
		 else if(time_zn_val == -11.00)
			gmt_str_value += "(GMT -11:00) Midway Island, Samoa";
		 else if(time_zn_val == -10.00)
			gmt_str_value += "(GMT -10:00) Hawaii";
		 else if(time_zn_val == -9.00)
			gmt_str_value += "(GMT -9:00) Alaska";
		 else if(time_zn_val == -8.00)
			gmt_str_value += "(GMT -8:00) Pacific Time (US &amp; Canada)";
		 else if(time_zn_val == -7.00)
			gmt_str_value += "(GMT -7:00) Mountain Time (US &amp; Canada)";
		 else if(time_zn_val == -6.00)
			gmt_str_value += "(GMT -6:00) Central Time (US &amp; Canada), Mexico City";
		 else if(time_zn_val == -5.00)
			gmt_str_value += "(GMT -5:00) Eastern Time (US &amp; Canada)";
		 else if(time_zn_val == -4.00)
			gmt_str_value += "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz";
		 else if(time_zn_val == -3.50)
			 gmt_str_value += "(GMT -3:30) Newfoundland";
		 else if(time_zn_val == -3.00)
			gmt_str_value += "(GMT -3:00) Brazil, Buenos Aires, Georgetown";
		 else if(time_zn_val == -2.00)
			gmt_str_value += "(GMT -2:00) Mid-Atlantic";
		 else if(time_zn_val == -1.00)
			gmt_str_value += "(GMT -1:00 hour) Azores, Cape Verde Islands";
		 else if(time_zn_val == -0.00)
			gmt_str_value += "(GMT) Western Europe Time, London, Lisbon, Casablanca";
		 else if(time_zn_val == 1.00)
			gmt_str_value += "(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris";
		 else if(time_zn_val == 2.00)
			gmt_str_value += "(GMT +2:00) Kaliningrad, South Africa";
		 else if(time_zn_val == 3.00)
			gmt_str_value += "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg";
		 else if(time_zn_val == 3.50)
			gmt_str_value += "(GMT +3:30) Tehran";
		 else if(time_zn_val == 4.00)
			gmt_str_value += "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi";
		 else if(time_zn_val == 4.50)
			gmt_str_value += "(GMT +4:30) Kabul";
		 else if(time_zn_val == 5.00)
			gmt_str_value += "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent";
		 else if(time_zn_val == 5.50)
			gmt_str_value += "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi";
		 else if(time_zn_val == 5.75)
			gmt_str_value += "(GMT +5:45) Kathmandu";
		 else if(time_zn_val == 6.00)
			gmt_str_value += "(GMT +6:00) Almaty, Dhaka, Colombo";
		 else if(time_zn_val == 7.00)
			gmt_str_value += "(GMT +7:00) Bangkok, Hanoi, Jakarta";
		 else if(time_zn_val == 8.00)
			gmt_str_value += "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong";
		 else if(time_zn_val == 9.00)
			gmt_str_value += "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk";
		 else if(time_zn_val == 9.50)
			gmt_str_value += "(GMT +9:30) Adelaide, Darwin";
		 else if(time_zn_val == 10.00)
			gmt_str_value += "(GMT +10:00) Eastern Australia, Guam, Vladivostok";
		 else if(time_zn_val == 11.00)
			gmt_str_value += "(GMT +11:00) Magadan, Solomon Islands, New Caledonia";
		 else if(time_zn_val == 12.00)
			gmt_str_value += "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka";
	}
	if(time_zn_val==''||time_zn_val==null)
	{
		var gmt_str_value = "None";
	}
	if(document.getElementById('0-1-250')) {
		var selIndx = document.getElementById('0-1-250');
		if(gmt_str_value)
		selIndx.options[selIndx.selectedIndex].text = gmt_str_value;
		document.getElementById('0-1-250').selected = true;
	}
	if(strt_org_time&&document.getElementById('0-1-30'))
		document.getElementById('0-1-30').value = strt_org_time;

	if(end_org_time&&document.getElementById('0-1-31'))
		document.getElementById('0-1-31').value = end_org_time;
}
function aprovedToReset(id, name)
{
	$.ajax({
		type:"GET",
		async: true,
		url: zcServletPrefix+"/custom/adminNew/resetPassword.html?id="+id,
		success: function(){}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You have successfully reseted password for <span style='font-weight:bold;'>"+name+"</span></div><div>Changed password has been sent to user through email.</div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closePopup()'/></span></div>";
}
function validateAddInventory(myForm,multiple_values)
{ 
	var msg = '';
	var flag = 0;
	var count = multiple_values.split(',')[0];
	var branch_id = multiple_values.split(',')[1];
	for(var i=0;i<=count;i++)
	{
		if(i == 0)
		if(document.getElementById("0-101:"+i+"-601-615")&&document.getElementById("0-101:"+i+"-601-615").value == "")
		{
			msg += "\n<li> Non empty value needed for Product(Brand).</li>";
			document.getElementById("0-101:"+i+"-601-615").style.border="1px solid #CC0000";
		}
		
		if(document.getElementById("0-101:"+i+"-601-615")&&document.getElementById("0-101:"+i+"-601-615").value != "")
			if(document.getElementById("0-101:"+i+"-601-621")&&document.getElementById("0-101:"+i+"-601-621").value == "")
			{
				msg += "\n<li> Non empty value needed for 'Quantity'.</li>";
				document.getElementById("0-101:"+i+"-601-621").style.border="1px solid #CC0000";
			}
	}

	if(document.getElementById('0-1-84')&&document.getElementById('0-1-90')&&document.getElementById('0-1-84').value!=""&&document.getElementById('0-1-90').value!="")
		if(document.getElementById('0-1-84').value == document.getElementById('0-1-90').value)
			msg += "\n<li> From Branch and To Branch cannot be same.</li>";

	if(document.getElementById('0-801')&&document.getElementById('0-801').value=="betwnwhse")
	{
		if(document.getElementById('0-1-46')&&document.getElementById('0-1-46').checked==true)
			document.getElementById('0-1-46').value=1;
		else if(document.getElementById('0-1-46')&&document.getElementById('0-1-46').checked==false)
			document.getElementById('0-1-46').value=0;
	}
	if(document.getElementById('0-801')&&document.getElementById('0-801').value=="betwnwhse"||document.getElementById('0-801').value=="inward")
	if(document.getElementById('0-1-90')&&document.getElementById('0-1-90').value!="")
	 if(branch_id)
		document.getElementById('0-1-90').value = branch_id;
	 else
		document.getElementById('0-1-90').value = document.getElementById('0-1-90').value;

	if(msg)
	{
		 document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		 document.getElementById('addEditErrorDiv').style.display="block";
		 return false;
	}
	else 
	return true;
}

 function addInventoryPageSetUp(myForm,flag)
{
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	for (i=0;i<layoutLinks.length;i++)
	{
		if(layoutLinks[i].id=='tab_Prefs')
			layoutLinks[i].style.display="none";
	}
	if(document.getElementById('0-801')&&document.getElementById('0-801').value=="betwnwhse")
	{
		if(document.getElementById('0-1-46'))
			document.getElementById('0-1-46').checked=true;
		if(document.getElementById('0-1-46')&&document.getElementById('0-1-46').checked==true)
			document.getElementById('0-1-46').value=1;
		else if(document.getElementById('0-1-46')&&document.getElementById('0-1-46').checked==false)
			document.getElementById('0-1-46').value=0;
	}
	if(document.getElementById('0-1-49_date_value')&&document.getElementById('0-1801'))
		document.getElementById('0-1-49_date_value').value = document.getElementById('0-1801').value;
	if(document.getElementById('0-1-84')&&document.getElementById('0-1-84txt')&&document.getElementById('0-2701-2703')&&document.getElementById('0-2601'))
	{
		if(document.getElementById('0-2701-2703').value!="")
		document.getElementById('0-1-84txt').value = document.getElementById('0-2701-2703').value;
		if(document.getElementById('0-2601').value!="")
		document.getElementById('0-1-84').value = document.getElementById('0-2601').value;
	}
	if(flag == "inward")
	 if(document.getElementById('0-1-90')&&document.getElementById('0-2701-2703')&&document.getElementById('0-2601'))
		if((document.getElementById('0-2701-2703').value!="")&&(document.getElementById('0-2601').value!=""))
		{
			document.getElementById('0-1-90txt').value = document.getElementById('0-2701-2703').value;
			document.getElementById('0-1-90').value = document.getElementById('0-2601').value;
		}
	if(flag == "inward" || flag == "betwnwhse")
		if(document.getElementById('0-1-90')&&document.getElementById('0-1-90').value!="")
			document.getElementById('0-1-90').disabled = true;
}

function AssignCheckBoxValue(myForm,obj)
{
	elemId = obj.id;
	if(document.getElementById(elemId).checked == true)
		document.getElementById(elemId).value = 1;
	else
		document.getElementById(elemId).value = 0;
}

function addIndentPageSetUp(myForm,id)
{
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	for (i=0;i<layoutLinks.length;i++)
	{
		if(layoutLinks[i].id=='tab_Prefs')
			layoutLinks[i].style.display="none";
	}
	
	if(document.getElementById('0-1-4_date_value')&&document.getElementById('0-1601')&&document.getElementById('0-1-2')=='')
		document.getElementById('0-1-4_date_value').value = document.getElementById('0-1601').value;
    
	if(id==null)
	{
	if(document.getElementById('0-1-35')&&document.getElementById('0-1301-1303')&&document.getElementById('0-1101-1250'))
		if((document.getElementById('0-1101-1250').value!="")&&(document.getElementById('0-1301-1303').value!=""))
		{	
			document.getElementById('0-1-35txt').value = document.getElementById('0-1301-1303').value;
			document.getElementById('0-1-35').value = document.getElementById('0-1101-1250').value;
			document.getElementById('0-1-35').disabled = true;
		}
	}
	else if(id!=null)
		{
			if(document.getElementById('0-1-35')&&document.getElementById('0-1-35').value!="")
			document.getElementById('0-1-35').disabled = true;
		}
}

function validateAddIndent(myForm,values)
{
	var msg = '';
	var Id = values.split(',')[0];
	var count = values.split(',')[1];

	if(document.getElementById('0-1-31')&&document.getElementById('0-1-31').checked == true)
		document.getElementById('0-1-31').value=1;
	else if(document.getElementById('0-1-31')&&document.getElementById('0-1-31').checked == false)
		document.getElementById('0-1-31').value=0;

	for(var i=0;i<=count;i++)
	{
		if(i == 0)
		if(document.getElementById("0-901:"+i+"-1001-1009")&&document.getElementById("0-901:"+i+"-1001-1009").value == "")
		{
			msg += "\n<li> Non empty value needed for Product(Brand).</li>";
			document.getElementById("0-901:"+i+"-1001-1009").style.border="1px solid #CC0000";
		}
		
		if(document.getElementById("0-901:"+i+"-1001-1009")&&document.getElementById("0-901:"+i+"-1001-1009").value != "")
			if(document.getElementById("0-901:"+i+"-1001-1015")&&document.getElementById("0-901:"+i+"-1001-1015").value == "")
			{
				msg += "\n<li> Non empty value needed for 'Quantity'.</li>";
				document.getElementById("0-901:"+i+"-1001-1015").style.border="1px solid #CC0000";
			}
	}

	if(document.getElementById('0-1-35')&&document.getElementById('0-1-35').value!=""&&document.getElementById('0-1-41')&&document.getElementById('0-1-41').value!="")
		if(document.getElementById('0-1-35').value == document.getElementById('0-1-41').value)
			msg += "\n<li> Requested From Branch and Requested To Branch cannot be same.</li>";
	
	if(document.getElementById('0-1-35')&&document.getElementById('0-1-35').value!="")
	{ 
		if(Id)
			document.getElementById('0-1-35').value = Id;
		else
			document.getElementById('0-1-35').value = document.getElementById('0-1-35').value;
	}
	if(msg)
	{
		 document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		 document.getElementById('addEditErrorDiv').style.display="block";
		 return false;
	}
	else 
	return true;
}


function goToUrlListPage(url)
{
	if(document.getElementById(mnuItmId+'-URL'))
	{
		document.getElementById(mnuItmId+'-URL').value=url;
		entityDiv=mnuItmId+'-DataDiv';
		parent.setUpPageParameters (url,parent.entityDiv,1);
		//setUpPageParameters(url,entityDiv,"sub");
	}
	else
	{
		mnuItmId="usrdef";
		if(document.getElementById(mnuItmId+'-URL'))
			document.getElementById(mnuItmId+'-URL').value=url;
		setUpPageParameters(url,"usrdef","sub");
	}
}

function goToUrlForSearch(tableName,searchBx,searchBxVal)
{
	if(document.getElementById(mnuItmId+'-URL'))
		document.getElementById(mnuItmId+'-URL').value="/atCRM/custom/JSON/list/loy_pgm_member.htm";
	//entityDiv=mnuItmId+'-DataDiv';
	setUpPageParameters("/atCRM/custom/JSON/list/loy_pgm_member.htm","usrdef","sub");
	doJsonSearch(tableName,searchBx,searchBxVal);
	if(document.getElementById(mnuItmId+'searchTxt'))
		document.getElementById(mnuItmId+'searchTxt').value=searchBxVal;
}

function hideLayoutlink(id,OrgId)
{
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	if(OrgId == 18)
	{
		for (i=0;i<layoutLinks.length;i++)
		{
			if(layoutLinks[i].id=='tab_Prefs')
				layoutLinks[i].style.display="none";
		}
	}
}

var prodTotalAmnt=new Array();
var L_frieght_rate4Inv=0;
var L_frieghtRateEarlrVal="";
var totalTaxAmt=0;
var prodTaxInfo='';
var amtColTotalAmnt=0;
var reqPageURI="";
var blockDtl="";
function addInvoicePageSetUp(myForm,autoOrgflag)
{
	callAllTaxItems();
	/********Block inv dtl fields starts here**********/
	var flagData = flagsJSON;  //'flagsJSON' is a global variable
	var orgFlagData = flagData[0]["org_flags"];
	for(var t=0;t<orgFlagData.length;t++)
	 {
		var flagName = orgFlagData[t]["name"];
		var flagVal = orgFlagData[t]["flag_value"];
		if(flagName == "block_detail_fields")
		 {
		    blockDtl = flagVal;
			break;
		 }
	}
	if(blockDtl == "1") blockDtlFileds();
	/********Block inv dtl fields ends here**********/
	if(screen.width<1280){document.getElementById('addEditDiv').style.width = "98%";}
	var L_tax_resp_data;
	prodTotalAmnt=new Array();
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	for (i=0;i<layoutLinks.length;i++)
	{
		if(layoutLinks[i].id=='tab_Prefs')
			layoutLinks[i].style.display="none";
	}

	var fieldsToBeDisabled=new Array("combo_0-1201-1357","combo_0-901-4022");
	for (fldsCntr=0;fldsCntr<fieldsToBeDisabled.length;fldsCntr++)
	{
		if(document.getElementById(fieldsToBeDisabled[fldsCntr]))
		{
			document.getElementById(fieldsToBeDisabled[fldsCntr]).disabled=true;
			//document.getElementById(fieldsToBeDisabled[fldsCntr]).style.border="0px";
			document.getElementById(fieldsToBeDisabled[fldsCntr]).style.border="1px solid #DDDDDD";
		}
	}
	if(document.getElementById('addEdit-Caption')&&autoOrgflag==1)
	{
		var pageCaptionSpan = document.getElementById('addEdit-Caption');
		var pageCaptionDiv=CreateDIV(pageCaptionSpan,"",'pageCaptionDivId');
		pageCaptionDiv.align="right";
		pageCaptionDiv.style.cssFloat="right";
		pageCaptionDiv.style.width="300px";
		pageCaptionDiv.innerHTML = '<span style="font-size:10px;font-family:Tahoma,Verdana;color:red;">Invoice auto-generated format INV-3286-6845.</span>';
	}
	var DiscountAmt="";
	var DiscountPercent="";
	var grandTotalPriceOfInv="";
	var L_frieght_rate4Inv="";
	var L_frieghtRateEarlrVal="";

	if(document.getElementById('0-1-822')&&document.getElementById('totalDivId'))
	{	
		totalDivId=document.getElementById('totalDivId');
		var FrieghtDiv=CreateDIV(totalDivId,"",'FrieghtDivId');
		FrieghtDiv.align="right";
		FrieghtDiv.style.cssFloat="right";
		FrieghtDiv.style.width="100%";
		if(document.getElementById('Freight amount'))
		var FrieghtAmtTd=document.getElementById('Freight amount');
		if(FrieghtAmtTd){
		FrieghtAmtTd.style.width="40%";
		frieghtTextBox = document.getElementById('0-1-822');
		var parent = frieghtTextBox.parentNode;
		frieghtTextBox.style.width="150px";
		frieghtTextBox.style.align="right";
		//frieghtTextBox.style.textAlign="right";
		FrieghtDiv.appendChild(FrieghtAmtTd);
		FrieghtDiv.appendChild(parent);
		}
	}

	if(document.getElementById('div_0-1201-1357'))
		document.getElementById('div_0-1201-1357').style.display="none";
	if(document.getElementById('div_0-901-4022'))
		document.getElementById('div_0-901-4022').style.display="none";

	var prodTotElmIds=new Array('0-1001:0-1101-1125','0-1001:1-1101-1125','0-1001:2-1101-1125','0-1001:3-1101-1125','0-1001:4-1101-1125','0-1001:5-1101-1125','0-1001:6-1101-1125','0-1001:7-1101-1125','0-1001:8-1101-1125','0-1001:9-1101-1125','0-1001:10-1101-1125');
	var prodTotal=0;
	for (prodTotCntr=0; prodTotCntr<prodTotElmIds.length; prodTotCntr++)
	{
		if(document.getElementById(prodTotElmIds[prodTotCntr]))
		{
			if((document.getElementById(prodTotElmIds[prodTotCntr]).value))
			{
				prodTotal=parseFloat(parseFloat(prodTotal)+parseFloat(document.getElementById(prodTotElmIds[prodTotCntr]).value));
				prodTotalAmnt[prodTotElmIds[prodTotCntr]]=parseFloat(document.getElementById(prodTotElmIds[prodTotCntr]).value);
			}
		}
	}
	document.getElementById('totalPrice').value=prodTotal.toFixed(2);
	calculateProdTotalPriceForInvoice();

	var amtColTotElmIds=new Array('0-4301:0-4306','0-4301:1-4306','0-4301:2-4306');
	var amtColTotal=0;
	for (amtColTotCntr=0; amtColTotCntr<amtColTotElmIds.length; amtColTotCntr++)
	{
		if(document.getElementById(amtColTotElmIds[amtColTotCntr]))
		{
			if((document.getElementById(amtColTotElmIds[amtColTotCntr]).value))
			{
				amtColTotal=parseFloat(parseFloat(amtColTotal)+parseFloat(document.getElementById(amtColTotElmIds[amtColTotCntr]).value));
			}
		}
	}
	amtColTotalAmnt=amtColTotal;
	if(document.getElementById('totalCollection'))
	document.getElementById('totalCollection').innerHTML="Collected: "+amtColTotal.toFixed(2);

	if(document.getElementById('0-1-850')&& document.getElementById('0-1-851'))
	{
		var disct_amtObj = document.getElementById('0-1-850');
		var disct_pctObj = document.getElementById('0-1-851');
		disct_amtObj.disabled=false;
		disct_pctObj.disabled=false;
	}
	if(document.getElementById('updateCashButton'))
		document.getElementById('updateCashButton').style.display="block";

	if(document.getElementById('0-6101')&&document.getElementById('0-1-16')&&document.getElementById('0-1-16_date_value')){
		document.getElementById('0-1-16_date_value').value = document.getElementById('0-6101').value;
		document.getElementById('0-1-16').value = document.getElementById('0-6101').value;}

	if(document.getElementById('0-1-83')||document.getElementById('0-1-84')||document.getElementById('0-1-85'))
	{
		if(document.getElementById('0-1-83') && document.getElementById('0-1-83').value=="")
		document.getElementById('0-1-83').value = 0;
		if(document.getElementById('0-1-84') && document.getElementById('0-1-84').value=="")
		document.getElementById('0-1-84').value = 0;
		if(document.getElementById('0-1-85') && document.getElementById('0-1-85').value=="")
		document.getElementById('0-1-85').value = 0;
	}
	if(document.getElementById('0-1-17')&&document.getElementById('0-1-17').value!=""&&(document.getElementById('0-1-4801hdn')&&document.getElementById('0-1-4801hdn').value!=""||document.getElementById('0-1-4801hdn').value!=undefined))
	{	
		document.getElementById('0-1-4801').disabled="true";
		document.getElementById('0-1-4801_unlock').style.visibility="visible";
	}
	/*****Assign current id values to currRecIDJSON*****/

}

function blockDtlFileds()
{
	if(blockDtl == "1" ) {
	var fieldsArray = Array('0-1001:i-1101-1127','0-1001:i-1101-1134','0-1001:i-1101-1135','0-1001:i-1101-1104','0-1001:i-1101-886','0-1001:i-1101-6301','0-1001:i-1101-1125');
	for(var t=0;t<10;t++)
	{
		var listPrice = fieldsArray[0].replace(/i/g,t);
		var discPct = fieldsArray[1].replace(/i/g,t);
		var discAmt = fieldsArray[2].replace(/i/g,t);
		var actPrice = fieldsArray[3].replace(/i/g,t);
		var actPriceIncltax = fieldsArray[4].replace(/i/g,t);
		var tax = fieldsArray[5].replace(/i/g,t);
		var extdAmt = fieldsArray[6].replace(/i/g,t);
		if(document.getElementById(listPrice)) document.getElementById(listPrice).disabled=true;
		if(document.getElementById(discPct)) document.getElementById(discPct).disabled=true;
		if(document.getElementById(discAmt)) document.getElementById(discAmt).disabled=true;
		if(document.getElementById(actPrice)) document.getElementById(actPrice).disabled=true;
		if(document.getElementById(actPriceIncltax)) document.getElementById(actPriceIncltax).disabled=true;
		if(document.getElementById(tax)) document.getElementById(tax).disabled=true;
		if(document.getElementById(extdAmt)) document.getElementById(extdAmt).disabled=true;
	}
	}
}

var discSqlRepId="";
var lockDiscAmt = false;
var priceInclTaxFlg =""; 
function calculateTotForInv(myForm,Obj)
{ 
	var flagData = flagsJSON;  //'flagsJSON' is a global variable
	var orgFlagData = flagData[0]["org_flags"];
	for(var t=0;t<orgFlagData.length;t++)
	 {
		var flagName = orgFlagData[t]["name"];
		var flagVal = orgFlagData[t]["flag_value"];
		if(flagName == "actual_price_includes_tax")
		 {
		    priceInclTaxFlg = flagVal;
			break;
		 }
	}
	
	var elemId=Obj.id;
	var srcZcRank=elemId.split(':')[1].split('-')[0];
	var discount=document.getElementById(elemId).value;

	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1127'))
	var listPriceObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1127');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1134'))
	var descPctObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1134');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1135'))
	var descAmntObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1135');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1104'))
	var actualPriceObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1104');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-886')){
	var actualPriceInclTaxObj=document.getElementById('0-1001:'+srcZcRank+'-1101-886');
	actualPriceInclTaxObj.disabled=true;}
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1103'))
	var noOfUnitsObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1103');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1125'))
	var totalPriceObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1125');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-1129-1130'))
	var baseWeightObj =document.getElementById('0-1001:'+srcZcRank+'-1101-1129-1130');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-5102'))
	var baseWeightAmt = document.getElementById('0-1001:'+srcZcRank+'-1101-5102');

	if(document.getElementById('0-1001:'+srcZcRank+'-1101-593'))
	var taxtypeAmnt1Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-593');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-600'))
	var taxtypeAmnt2Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-600');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-608'))
	var taxtypeAmnt3Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-608');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-615'))
	var taxtypeAmnt4Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-615');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-622'))
	var taxtypeAmnt5Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-622');

	if(document.getElementById('0-1001:'+srcZcRank+'-1101-593'))
	var taxtype1Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-593');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-600'))
	var taxtype2Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-600');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-608'))
	var taxtype3Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-608');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-615'))
	var taxtype4Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-615');
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-622'))
	var taxtype5Obj=document.getElementById('0-1001:'+srcZcRank+'-1101-622');
	if(document.getElementById('0-1001:'+srcZcRank+'-401-403'))
	var orderedQtyObj = document.getElementById('0-1001:'+srcZcRank+'-401-403');
	if(document.getElementById('0-1001:'+srcZcRank+'-401-5701'))
	var invoicedQtyObj = document.getElementById('0-1001:'+srcZcRank+'-401-5701');

	if(document.getElementById('0-1-851')&&(document.getElementById('0-1-851').value=="")||(isNaN(document.getElementById('0-1-851').value)))
		document.getElementById('0-1-851').value =0;

	var taxtypeAmnt1=0;
	var taxtypeAmnt2=0;
	var taxtypeAmnt3=0;
	var taxtypeAmnt4=0;
	var taxtypeAmnt5=0;
	var zcrank=0;
	//totalTaxAmt=0;

	var baseWeightArray=new Array();
	
	if(elemId=='0-1001:'+srcZcRank+'-1101-2201')
	{
		//descPctObj.value='';descAmntObj.value='';actualPriceObj.value='';noOfUnitsObj.value='';totalPriceObj.value='';
		if(descAmntObj)
		descAmntObj.disabled=false;
		if(descPctObj)
		descPctObj.disabled=false;
	}

	if(document.getElementById('addEditErrorDiv'))
	document.getElementById('addEditErrorDiv').style.display="none";
    
    discSqlRepId ="";
	if(elemId == '0-1001:'+srcZcRank+'-1101-1103' && document.getElementById(elemId).value)
    {
		var prodQty = noOfUnitsObj.value;
		currentRecIdsJSON["prod_qty"] = prodQty;
		var flagData = parent.flagsJSON;
		var orgFlagData = flagData[0]["org_flags"];
		for(var t=0;t<orgFlagData.length;t++)
		{
			var flagName = orgFlagData[t]["name"];
			var flagVal = orgFlagData[t]["flag_value"];
			if(flagName == "line_level_discount_engine_sql_query_id")
			{
				 discSqlRepId = flagVal;
				 break;
			}
		}
		if(discSqlRepId && discSqlRepId !="")
		{
            currentRecIdsJSON["rep_id"] = discSqlRepId;
			var curRecJSON = currentRecIdsJSON;
			var brchId ;
			var stateId;
	        if(curRecJSON["brch_id"]) brchId = curRecJSON["brch_id"];
			else if(document.getElementById("0-1-251"))  brchId =document.getElementById("0-1-251").value;
			if(curRecJSON["state_id"]) stateId = curRecJSON["state_id"];
			else if(document.getElementById("0-1-261"))  stateId =document.getElementById("0-1-261").value;
            var paramStr = curRecJSON["acct_id"];
			paramStr += "~)"+curRecJSON["cont_id"];
			paramStr += "~)"+ brchId;
			paramStr += "~)"+stateId;
			paramStr += "~)"+curRecJSON["rep_id"];
			paramStr += "~)"+curRecJSON["prod_id"];
			paramStr += "~)"+curRecJSON["prod_qty"];
			paramStr = encodeURI(paramStr);
			var url2hit = "/atCRM/custom/JSON/system/discountCalcnEngine.htm";
               $.ajax({
				 type:'GET',
				 url:url2hit,
				 dataType:'json',
				 data:'paramStr='+paramStr,
				 cache:false,
				 async:true,
				 success: function (data)
				   { 
					 var acctType = data["acctType"];acctType = acctType.toLowerCase();
                     var discPct = data["disc_pct"];discPct = parseFloat(discPct).toFixed(2);
					 var discAmt = data["discAmt"];
					 var prodPrice = data["default_price"];
					 var minOrdVal = data["minOrdVal"];
					// if(document.getElementById("0-1001:"+srcZcRank+"-1101-1134")) document.getElementById("0-1001:"+srcZcRank+"-1101-1134").value=discPct;
					/* if(prodPrice && prodPrice!='') document.getElementById("0-1001:"+srcZcRank+"-1101-1127").value=prodPrice;
					 if(discPct){ 
						 lockDiscAmt = true;
						 if(descAmntObj && lockDiscAmt) descAmntObj.disabled=true;
			             if(descPctObj && lockDiscAmt)  descPctObj.disabled=true;
						 calculateTotForInv('',document.getElementById("0-1001:"+srcZcRank+"-1101-1134"));
					 }*/
					 var totAmount=0;
					 for(var t=0;t<10;t++)
					   {
						  if(document.getElementById("0-1001:"+t+"-1101-1125") && document.getElementById("0-1001:"+t+"-1101-1125").value!="") {
							  var extndAmt = document.getElementById("0-1001:"+t+"-1101-1125").value;
                              totAmount +=extndAmt;
						  } 
					   }
					 if(acctType == "corporate")
					   {
						 if(document.getElementById("totalPrice"))
						   {
							 //var totPrice = document.getElementById("totalPrice").value;
						       if(parseFloat(totAmount) > 500)
							   {
							      if(document.getElementById("0-1-851")) document.getElementById("0-1-851").value = "15";
                                  calculateProdTotalPriceForInvoice(myForm, "0-1-851","","grndTot");
								  toGetTaxValues(srcZcRank);
							   }
							   else if(parseFloat(totAmount) > 250) 
							   {
                                  if(document.getElementById("0-1-851")) document.getElementById("0-1-851").value = "10";
                                  calculateProdTotalPriceForInvoice(myForm, "0-1-851","","grndTot");
								  toGetTaxValues(srcZcRank);
							   }
							   else{
								   if(document.getElementById("0-1-851")) document.getElementById("0-1-851").value = "0";
                                   calculateProdTotalPriceForInvoice(myForm, "0-1-851","","grndTot");
								   toGetTaxValues(srcZcRank);
							   }
							   //if(document.getElementById("grandTotalPrice")) document.getElementById("grandTotalPrice").value = totPrice;
						   }
					   }
					 else 
					   { 
						 if(document.getElementById("totalPrice"))
						   {
						 //var totPrice = document.getElementById("totalPrice").value;
						       if(parseFloat(totAmount) > 500)
							   {
								 if(document.getElementById("0-1-851")) document.getElementById("0-1-851").value = "10";
								 calculateProdTotalPriceForInvoice(myForm, "0-1-851","","grndTot");
								 toGetTaxValues(srcZcRank);
								 //if(document.getElementById("grandTotalPrice")) document.getElementById("grandTotalPrice").value = totPrice;
							   }
							   else{
								   if(document.getElementById("0-1-851")) document.getElementById("0-1-851").value = "0";
                                   calculateProdTotalPriceForInvoice(myForm, "0-1-851","","grndTot");
								   toGetTaxValues(srcZcRank);
							   }
						   }
					   }
				   }
				});
		}
	}

	if(elemId=='0-1001:'+srcZcRank+'-1101-1134')
	{
		var discPct=descPctObj.value;
		if(discPct>100)
		{
			var msg="Enter the discount percent less than 100";
			document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul><li>"+msg+"</ul>";
			document.getElementById('addEditErrorDiv').style.display="block";
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1103'))
			document.getElementById('0-1001:'+srcZcRank+'-1101-1103').focus();
			descPctObj.style.border="1px solid #CC0000";
			descAmntObj.disabled=true;
			return;
			//document.getElementById('0-1001:'+srcZcRank+'-1101-1134').focus();
		}
		else
		{
			document.getElementById('addEditErrorDiv').style.display="none";
			descPctObj.style.border="1px solid #CCCCCC";
			var descAmnt=(ReplaceAll(descPctObj.value,",","")*ReplaceAll(listPriceObj.value,",",""))/100;
			if(descAmnt&&descAmntObj)
			descAmntObj.value=descAmnt.toFixed(2);
			else{
				if(descAmntObj)
				descAmntObj.value='';	
				if(descPctObj&&descPctObj.value!="")
				descPctObj.value = descPctObj.value;}

			if(isNaN(document.getElementById('0-1-851').value))document.getElementById('0-1-851').value=0;
		}
		descPctObj.onchange = function (){changeColorOfDescPrcnt(descPctObj)};
		descPctObj.onchange();
		if(isNaN(document.getElementById('0-1-851').value))document.getElementById('0-1-851').value=0;
	}
	else if(elemId=='0-1001:'+srcZcRank+'-1101-1135')
	{	
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		var descamt=ReplaceAll(descAmntObj.value,",","")
		if(descamt&&descPctObj)
			descPctObj.value=descpct.toFixed(2);
		else{
			if(descPctObj)
			descPctObj.value='';
			if(descAmntObj&&descAmntObj.value!="")
			descAmntObj.value =descAmntObj.value;}
	
		descAmntObj.onchange = function (){changeColorOfDescAmnt(descAmntObj)};
		descAmntObj.onchange();
		if(isNaN(document.getElementById('0-1-851').value))document.getElementById('0-1-851').value=0;
	}
	else if(priceInclTaxFlg != "1" && elemId=='0-1001:'+srcZcRank+'-1101-1104'&&descAmntObj)
	{	
		var discPct=listPriceObj.value-actualPriceObj.value;
		if(descPctObj&&discPct==0)
			descAmntObj.value='';
		else 
			descAmntObj.value=discPct.toFixed(2);
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		if(descpct&&descPctObj)
		descPctObj.value=descpct.toFixed(2);
		if(descPctObj&&descPctObj.value!="")
			descPctObj.disabled = true;
		else if(descPctObj&&descPctObj.value=="")
			if(discSqlRepId =="" && !lockDiscAmt) descPctObj.disabled = false;

		if(actualPriceObj.value==listPriceObj.value)
		{descPctObj.value = ""; descAmntObj.value="";}
		actualPriceObj.onchange = function (){changeColorOfactualPriceObj(actualPriceObj,descPctObj,descAmntObj)};
		actualPriceObj.onchange();
	}
	else if(priceInclTaxFlg == "1" && elemId=='0-1001:'+srcZcRank+'-1101-886'&&descAmntObj)
	{	
		var discPct=listPriceObj.value-actualPriceInclTaxObj.value;
		if(descPctObj&&discPct==0)
			descAmntObj.value='';
		else 
			descAmntObj.value=discPct.toFixed(2);
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
		if(descpct&&descPctObj)
		descPctObj.value=descpct.toFixed(2);
		if(descPctObj&&descPctObj.value!="")
			descPctObj.disabled = true;
		else if(descPctObj&&descPctObj.value=="")
			if(discSqlRepId =="" && !lockDiscAmt) descPctObj.disabled = false;

		if(actualPriceInclTaxObj.value==listPriceObj.value)
		{descPctObj.value = ""; descAmntObj.value="";}
		actualPriceInclTaxObj.onchange = function (){changeColorOfactualPriceObj(actualPriceInclTaxObj,descPctObj,descAmntObj)};
		actualPriceInclTaxObj.onchange();
	}
	else if(elemId=='0-1001:'+srcZcRank+'-1101-1127'&&descAmntObj)
	{		
		if(descAmntObj){
		var actPri=listPriceObj.value-descAmntObj.value;
		var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");}
		if(descpct&&descPctObj)
			descPctObj.value=descpct.toFixed(2);
		if(priceInclTaxFlg != "1"){
		if(actualPriceObj&&actPri==0)
			actualPriceObj.value='';
		else if(actualPriceObj)
			actualPriceObj.value=actPri;
		}
		else
		{
          if(actualPriceInclTaxObj&&actPri==0)
			actualPriceInclTaxObj.value='';
		  else if(actualPriceInclTaxObj)
			actualPriceInclTaxObj.value=actPri;
		 // if(actualPriceInclTaxObj && actualPriceInclTaxObj.value !="" && actualPriceObj && noOfUnitsObj && noOfUnitsObj.value !="")
		 if(actualPriceInclTaxObj && actualPriceInclTaxObj.value !="" && actualPriceObj && noOfUnitsObj && noOfUnitsObj.value !="")
			{
              var txtAmt=toGetTaxValues(srcZcRank);
			  var unitQty = noOfUnitsObj.value;
			  var priceInclTax = actualPriceInclTaxObj.value;
              actualPriceObj.value = (ReplaceAll(priceInclTax,",",""))-(txtAmt/unitQty);
			  actualPriceObj.disabled =true;
			  totalPriceObj.disabled =true;
			}
		}
	}
	else if(priceInclTaxFlg != "1" && elemId=='0-1001:'+srcZcRank+'-1101-1104')
	{
		if(actualPriceObj.value==listPriceObj.value)
		{descPctObj.value = ""; descAmntObj.value="";}
		elemId.onchange = function(){changeColorOfactualPriceObj(elemId,descPctObj,descAmntObj)};
		elemId.onchange();
	}
	else if(priceInclTaxFlg == "1" && elemId=='0-1001:'+srcZcRank+'-1101-886')
	{
		if(actualPriceInclTaxObj.value==listPriceObj.value)
		{descPctObj.value = ""; descAmntObj.value="";}
		elemId.onchange = function(){changeColorOfactualPriceObj(elemId,descPctObj,descAmntObj)};
		elemId.onchange();
	}
	else
	{   
		if(descPctObj&&descAmntObj && discSqlRepId =="" && !lockDiscAmt){
		descPctObj.disabled=false;
		descAmntObj.disabled=false;}
	}

		if(taxtype1Obj)
		{
			taxtype1Obj.disabled=true;
			taxtype1Obj.style.border="0px";
			taxtype1Obj.style.borderBottom="1px solid #DDDDDD";
		}

		if(taxtype2Obj)
		{
			taxtype2Obj.disabled=true;
			taxtype2Obj.style.border="0px";
			taxtype2Obj.style.borderBottom="1px solid #DDDDDD";
		}

		if(taxtype3Obj)
		{
			taxtype3Obj.disabled=true;
			taxtype3Obj.style.border="0px";
			taxtype3Obj.style.borderBottom="1px solid #DDDDDD";
		}
		
		if(taxtype4Obj)
		{
			taxtype4Obj.disabled=true;
			taxtype4Obj.style.border="0px";
			taxtype4Obj.style.borderBottom="1px solid #DDDDDD";
		}
		
		if(taxtype5Obj)
		{
			taxtype5Obj.disabled=true;
			taxtype5Obj.style.border="0px";
			taxtype5Obj.style.borderBottom="1px solid #DDDDDD";
		}


		if(elemId=='0-1001:'+srcZcRank+'-1101-1134' && discount!='')
		{	
			if(descAmntObj)
			descAmntObj.disabled=true;
			if(discSqlRepId =="" && !lockDiscAmt) descPctObj.disabled=false;
			var descAmnt=(ReplaceAll(descPctObj.value,",","")*ReplaceAll(listPriceObj.value,",",""))/100;
			if(descAmntObj)
			descAmntObj.value=descAmnt.toFixed(2);
			else if(priceInclTaxFlg != "1"){
				var actPri=listPriceObj.value-descAmnt;
				if(priceInclTaxFlg != "1" && actualPriceObj)
				actualPriceObj.value=actPri;
				}
			else {
				var actPriInclTax=listPriceObj.value-descAmnt;
				if(priceInclTaxFlg != "1" && actualPriceInclTaxObj)
				actualPriceInclTaxObj.value=actPriInclTax;
				if(actualPriceInclTaxObj && actualPriceInclTaxObj.value !="" && actualPriceObj && noOfUnitsObj && noOfUnitsObj.value !="")
				{
				  var txtAmt=toGetTaxValues(srcZcRank);
				  var unitQty = noOfUnitsObj.value;
				  var priceInclTax = actualPriceInclTaxObj.value;
				  actualPriceObj.value = (ReplaceAll(priceInclTax,",",""))-(txtAmt/unitQty); 
				  actualPriceObj.disabled =true;
				  totalPriceObj.disabled =true;
				}
			}
		if(isNaN(document.getElementById('0-1-851').value))document.getElementById('0-1-851').value=0.00;
		if(descPctObj.value=="")descAmntObj.value="";
		}
		else if(elemId=='0-1001:'+srcZcRank+'-1101-1135' && discount!='')
		{
			if(descPctObj)
			descPctObj.disabled=true;
			if(!discSqlRepId && discSqlRepId =="" && !lockDiscAmt) descAmntObj.disabled=false;
			var descpct=(ReplaceAll(descAmntObj.value,",","")*100)/ReplaceAll(listPriceObj.value,",","");
			if(descPctObj)
			descPctObj.value=descpct.toFixed(2);
			if(isNaN(document.getElementById('0-1-851').value))document.getElementById('0-1-851').value=0.00;
		}
		else
		{
			if(descPctObj && discSqlRepId =="" && !lockDiscAmt)
			descPctObj.disabled=false;
			if(descAmntObj && discSqlRepId =="" && !lockDiscAmt)
			descAmntObj.disabled=false;
		}

		if(elemId=='0-1001:'+srcZcRank+'-1101-1103'&&document.getElementById('0-1-17')&&document.getElementById('0-1-17').value!="")
		{
			var currentQty = 0; var ordQty = 0; var invcdQty=0; var remngQty = 0;
			if(noOfUnitsObj.value!="")currentQty = noOfUnitsObj.value;
			if(isNaN(currentQty))currentQty=0;else currentQty=parseInt(currentQty);
			if(orderedQtyObj&&orderedQtyObj.value!="")ordQty = orderedQtyObj.value;
			if(isNaN(ordQty))ordQty=0;else ordQty=parseInt(ordQty);
			if(invoicedQtyObj&&invoicedQtyObj.value!="")invcdQty=invoicedQtyObj.value;
			if(isNaN(invcdQty))invcdQty=0;else invcdQty=parseFloat(invcdQty);
			var remngQty = parseInt(ordQty)-parseInt(invcdQty);
			if(isNaN(remngQty))remngQty=0;else remngQty=parseInt(remngQty);
			if(parseInt(remngQty)>0&&parseInt(currentQty)>parseInt(remngQty))
			{
				var msg="Quantity should not be greater than "+remngQty+".";
				document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul><li>"+msg+"</ul>";
				document.getElementById('addEditErrorDiv').style.display="block";
				document.getElementById('0-1001:'+srcZcRank+'-1101-1103').focus();
				noOfUnitsObj.style.border="1px solid #CC0000";
				noOfUnitsObj.value='';
			//	noOfUnitsObj.value=parseInt(remngQty);
				return false;
				//noOfUnitsObj.focus();
			}
			else
			{
				document.getElementById('addEditErrorDiv').style.display="none";
				noOfUnitsObj.style.border="1px solid #CCCCCC";
				//return true;
			}
		}
		if(document.getElementById('0-1001:'+srcZcRank+'-1101-6301'))
			document.getElementById('0-1001:'+srcZcRank+'-1101-6301').value = "0.00";
		
		/*if((elemId=='0-1001:'+srcZcRank+'-1101-1103')&&(document.getElementById('0-1001:'+srcZcRank+'-1101-6301')))
		{
			totalTaxAmt=toGetTaxValues(srcZcRank);
		}*/
		
		if(listPriceObj&&listPriceObj.value!="")
		{
			if(listPriceObj&&listPriceObj.value>0)
				listPriceObj.disabled = true;
			else
				listPriceObj.disabled = false;
			
			if(priceInclTaxFlg != "1" && actualPriceObj)
			{
				if(descAmntObj&&descAmntObj.value!="")
				actualPriceObj.value=(ReplaceAll(listPriceObj.value,",","")-ReplaceAll(descAmntObj.value,",","")).toFixed(2);
				else if(!descAmntObj&&descPctObj){
					var discAmnt=(ReplaceAll(descPctObj.value,",","")*ReplaceAll(listPriceObj.value,",",""))/100;
					actualPriceObj.value = (ReplaceAll(listPriceObj.value,",","") - discAmnt).toFixed(2);}
				else
					actualPriceObj.value=(ReplaceAll(listPriceObj.value,",",""));
			}
			else if(priceInclTaxFlg == "1" && actualPriceInclTaxObj)
			{
				if(descAmntObj&&descAmntObj.value!="")
				actualPriceInclTaxObj.value=(ReplaceAll(listPriceObj.value,",","")-ReplaceAll(descAmntObj.value,",","")).toFixed(2);
				else if(!descAmntObj&&descPctObj){
					var discAmnt=(ReplaceAll(descPctObj.value,",","")*ReplaceAll(listPriceObj.value,",",""))/100;
					actualPriceInclTaxObj.value = (ReplaceAll(listPriceObj.value,",","") - discAmnt).toFixed(2);}
				else
					actualPriceInclTaxObj.value=(ReplaceAll(listPriceObj.value,",",""));
				if(actualPriceInclTaxObj && actualPriceInclTaxObj.value !="" && actualPriceObj && noOfUnitsObj && noOfUnitsObj.value !="")
				{
				  var txtAmt=toGetTaxValues(srcZcRank);
				  var unitQty = noOfUnitsObj.value;
				  var priceInclTax = actualPriceInclTaxObj.value;
				  actualPriceObj.value = ((ReplaceAll(priceInclTax,",",""))-parseFloat(txtAmt/unitQty)).toFixed(2);
				  actualPriceObj.disabled =true;
				  totalPriceObj.disabled =true;
				}
			}
			else
			{
				if(descAmntObj&&descAmntObj.value!="")
				listPriceObj.value=(ReplaceAll(listPriceObj.value,",","")-ReplaceAll(descAmntObj.value,",","")).toFixed(2);
				else
				listPriceObj.value=(ReplaceAll(listPriceObj.value,",",""));
			}

			if(priceInclTaxFlg != "1" && actualPriceObj)
			{
				var finalAmount=0;
				finalAmount=(ReplaceAll(actualPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",",""))+taxtypeAmnt1+taxtypeAmnt2+taxtypeAmnt3+taxtypeAmnt4+taxtypeAmnt5;
			}
			else if(priceInclTaxFlg == "1" && actualPriceInclTaxObj)
			{
				var finalAmount=0;
				finalAmount=(ReplaceAll(actualPriceInclTaxObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",",""));
					//+taxtypeAmnt1+taxtypeAmnt2+taxtypeAmnt3+taxtypeAmnt4+taxtypeAmnt5;
			}
			else if(listPriceObj)
			{
				var finalAmount=0;
				finalAmount=(ReplaceAll(listPriceObj.value,",","")*ReplaceAll(noOfUnitsObj.value,",",""))+taxtypeAmnt1+taxtypeAmnt2+taxtypeAmnt3+taxtypeAmnt4+taxtypeAmnt5;
			}
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-6301'))
			{
				totalTaxAmt=toGetTaxValues(srcZcRank);
				if(priceInclTaxFlg != "1" && totalTaxAmt){finalAmount=parseFloat(finalAmount)+parseFloat(totalTaxAmt);}
			}
			totalPriceObj.value=finalAmount.toFixed(2);
			prodTotalAmnt['0-1001:'+srcZcRank+'-1101-1125']=finalAmount;
			
			if(document.getElementById('0-1-822')&&baseWeightObj)
			{
				baseWeightArray.length=0;
				
				for(var i=0;i<=srcZcRank;i++)
				{	
					if(document.getElementById('0-1001:'+i+'-1101-5102')&&document.getElementById('0-1001:'+i+'-1101-1103')&&document.getElementById('0-1001:'+i+'-1101-1129-1130'))
					document.getElementById('0-1001:'+i+'-1101-5102').value=((parseInt(ReplaceAll(document.getElementById('0-1001:'+i+'-1101-1103').value),",",""))*(parseInt(document.getElementById('0-1001:'+i+'-1101-1129-1130').value)));
					baseWeightArray.push(document.getElementById('0-1001:'+i+'-1101-5102').value);
				}
								
				var totalBaseWt=0;
				var BaseWtPrevVal=0;
				for(var k in baseWeightArray)
				{
					BaseWtPrevVal=baseWeightArray[k];
					if(isNaN(BaseWtPrevVal))
						BaseWtPrevVal = 0.00;
					else
						BaseWtPrevVal=parseFloat(BaseWtPrevVal);
					totalBaseWt+=parseFloat(BaseWtPrevVal);
				}
				totalBaseWt = parseFloat(totalBaseWt);
				if(isNaN(totalBaseWt))
					totalBaseWt = 0.00;
				else
					totalBaseWt=parseFloat(totalBaseWt);

				if(document.getElementById('0-901-4022'))
					var stateId = document.getElementById("0-901-4022").selectedValue;
				else if(document.getElementById('0-1201-1357'))
					var stateId = document.getElementById("0-1201-1357").selectedValue;
					
					if(stateId==undefined)
						var sI = "";
					else
						var sI = stateId;
					$.ajax({
					type:"GET",
					url : zcServletPrefix+"/custom/JSON/system/frieghtChargesApplicable.htm?sI="+sI+"&wT="+totalBaseWt,
					dataType:"json",
					async: false,
					success:function(doc)
					{
						var L_frieghtrate = doc["frieght_rate"];
						var L_frieght_min_wt = doc["min_weight"];
						var L_frieght_max_wt = doc["max_weight"];
					
						if(document.getElementById('0-1-822'))
						{
						if(L_frieghtrate=="")
						document.getElementById('0-1-822').value=L_frieghtRateEarlrVal;
						else
						document.getElementById('0-1-822').value=L_frieghtrate;
						
						L_frieght_rate4Inv=document.getElementById('0-1-822').value;
						}

						if(document.getElementById('grandTotalPrice'))
						{
							if(L_frieghtrate)
							{
									if(isNaN(L_frieghtrate)||L_frieghtrate==""){L_frieghtrate=0;}else{L_frieghtrate=parseFloat(L_frieghtrate);}
									document.getElementById('grandTotalPrice').value=document.getElementById('grandTotalPrice').value+L_frieghtrate;
							}
							else {document.getElementById('grandTotalPrice').value=document.getElementById('grandTotalPrice').value;}
						baseWtOnDisct=totalBaseWt;
						}
					}
					});
			}
			calculateProdTotalPriceForInvoice();
			lockDiscAmt = false;
		}
		blockDtlFileds();
}
/******* Get tax values and calculate the amount for the product************/
function toGetTaxValues(srcZcRank)
{
			totalTaxAmt = 0;
			var extndAmt = 0;
			var MRPAmt = 0;
			var totalTaxAmtOfProd=0;
				
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-2201hdn'))
				var product_id = document.getElementById('0-1001:'+srcZcRank+'-1101-2201hdn').value;
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-2201'))
				var product_name = document.getElementById('0-1001:'+srcZcRank+'-1101-2201').value;

			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1103')&&document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value=="")
				document.getElementById('0-1001:'+srcZcRank+'-1101-1125').value = 0.00;
			else{
			if(priceInclTaxFlg !="1" && document.getElementById('0-1001:'+srcZcRank+'-1101-1104')&&document.getElementById('0-1001:'+srcZcRank+'-1101-1104').value!="")
				extndAmt = (document.getElementById('0-1001:'+srcZcRank+'-1101-1104').value)*(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
			else if(priceInclTaxFlg =="1" && document.getElementById('0-1001:'+srcZcRank+'-1101-886')&&document.getElementById('0-1001:'+srcZcRank+'-1101-886').value!=""){
				/***Extended amount will be based on the discount.****/
				/**If header discount exist calculate line level discnt for the same % and deduct the discount from the extnd amt**/
				if(document.getElementById("0-1-851")&&document.getElementById("0-1-851").value){
					var discountPercent = document.getElementById("0-1-851").value;
				    extndAmt = (document.getElementById('0-1001:'+srcZcRank+'-1101-886').value)*(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
					var discntAmt = (discountPercent*extndAmt)/100;discntAmt=discntAmt.toFixed(2);
                    extndAmt = extndAmt - discntAmt;
				}
				/**If not calculate the extended amount without discount**/
				else{
					extndAmt = (document.getElementById('0-1001:'+srcZcRank+'-1101-886').value)*(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
				}
			}
			if(document.getElementById("0-1001:"+srcZcRank+"-1101-1127")&&document.getElementById("0-1001:"+srcZcRank+"-1101-1127").value !="")   MRPAmt = (document.getElementById("0-1001:"+srcZcRank+"-1101-1127").value) *(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
			}
			/******Send branch Id if it exist on the page,for line level tax calculation*******/
			var branchId="";
			if(document.getElementById("0-1-251") && document.getElementById("0-1-251").value !=""){
				branchId = document.getElementById("0-1-251").value;
			}
			/*****Get tax detail********/
			var detUrl=zcServletPrefix+'/custom/JSON/system/getTaxDet4Prod.htm?product_id='+product_id+'&branch_id='+branchId;
			
			$.ajax(
			{
				type: "GET",
				url:detUrl,
				dataType: "json",
				async:false,
				success: function (doc)
				{
					prodTaxInfo=doc['taxInfo'].split('~)');
					if(prodTaxInfo.length>=1)
					{
						for(var taxTypeCntr=0;taxTypeCntr<prodTaxInfo.length;taxTypeCntr++)
						{
							var taxDetails=prodTaxInfo[taxTypeCntr].split('--');
							var taxTypeName=taxDetails[0];
							var taxTypePct=taxDetails[1];
							var taxOnOther=taxDetails[2];
							var calcTaxOn = taxDetails[3];
							var taxTypeId = taxDetails[4];
							var tax2BeCalcOnAmt =0;
                            if(calcTaxOn && calcTaxOn == "list_price") tax2BeCalcOnAmt=MRPAmt;
							else tax2BeCalcOnAmt=extndAmt;
							if(taxOnOther){var parTaxAmt=parseFloat((taxOnOther/100)*parseFloat(tax2BeCalcOnAmt)); 
							var taxAmt = parseFloat((taxTypePct/100)*parseFloat(parTaxAmt));}
							else {
								var taxAmt = 0;
								if(priceInclTaxFlg !="1")
								 taxAmt = parseFloat((taxTypePct/100)*parseFloat(tax2BeCalcOnAmt));
								else {
									 var taxPct4Divd = parseFloat(taxTypePct)+100;
									taxAmt = parseFloat((taxTypePct/taxPct4Divd)*parseFloat(tax2BeCalcOnAmt));
								}
							}
							if(taxAmt)
							  totalTaxAmtOfProd=parseFloat(totalTaxAmt)+parseFloat(taxAmt);

							//if(document.getElementById('0-1001:'+srcZcRank+'-1101-6301'))
							//document.getElementById("0-1001:"+srcZcRank+"-1101-6301").value = totalTaxAmtOfProd.toFixed(2);
							if(taxTypeCntr==0)
							{
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1644')&&taxTypePct)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1644').value = taxTypePct;
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1604')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1604').value = taxAmt.toFixed(2);
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1600')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1600').value = taxTypeId;
							}
							if(taxTypeCntr==1)
							{
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1645')&&taxTypePct)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1645').value = taxTypePct;
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1611')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1611').value = taxAmt.toFixed(2);
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1605')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1605').value = taxTypeId;
							}
							if(taxTypeCntr==2)
							{
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1651')&&taxTypePct)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1651').value = taxTypePct;
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1617')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1617').value = taxAmt.toFixed(2);
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1612')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1612').value = taxTypeId;
							}
							if(taxTypeCntr==3)
							{
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1652')&&taxTypePct)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1652').value = taxTypePct;
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1626')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1626').value = taxAmt.toFixed(2);
							if(document.getElementById('0-1001:'+srcZcRank+'-1101-1618')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1618').value = taxTypeId;
							}
							if(taxTypeCntr==4)
							{
								if(document.getElementById('0-1001:'+srcZcRank+'-1101-1653')&&taxTypePct)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1653').value = taxTypePct;
								if(document.getElementById('0-1001:'+srcZcRank+'-1101-1643')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1643').value = taxAmt.toFixed(2);
								if(document.getElementById('0-1001:'+srcZcRank+'-1101-1627')&&taxAmt)
								document.getElementById('0-1001:'+srcZcRank+'-1101-1627').value = taxTypeId;
							}
							totalTaxAmt=totalTaxAmtOfProd;
						}
						
						if(document.getElementById('0-1001:'+srcZcRank+'-1101-6301')){
							if(priceInclTaxFlg !="1") document.getElementById("0-1001:"+srcZcRank+"-1101-6301").value = totalTaxAmt.toFixed(2);
							else document.getElementById("0-1001:"+srcZcRank+"-1101-6301").value = Math.floor(totalTaxAmt * 100) / 100;
						}
						if(document.getElementById('0-1001:'+srcZcRank+'-1101-1657')){
							if(priceInclTaxFlg =="1") document.getElementById('0-1001:'+srcZcRank+'-1101-1657').value = parseFloat(document.getElementById('0-1001:'+srcZcRank+'-1101-1125').value);
							else document.getElementById('0-1001:'+srcZcRank+'-1101-1657').value = parseFloat(totalTaxAmt) + parseFloat(document.getElementById('0-1001:'+srcZcRank+'-1101-1125').value);
						}
					}
				}
			});
	return totalTaxAmt;
}


var totalPriceOfInv=0;
var grandTotalPriceOfInv=0;
from_unblock=0;
var taxTypeAmnt1PrvVal=0;
var taxTypeAmnt2PrvVal=0;
var baseWtOnDisct=0;
var parentIdFor1=null;
var parentIdFor2=null;
var parentIdFor3=null;
var parentIdFor4=null;
var parentIdFor5=null;
function calculateProdTotalPriceForInvoice(myForm, Obj,from_unblock,chngGrndTot)
{
	if(document.getElementById('0-1-39'))
	var taxType1=document.getElementById('0-1-39');
	if(document.getElementById('0-1-46'))
	var taxType2=document.getElementById('0-1-46');
	if(document.getElementById('0-1-53'))
	var taxType3=document.getElementById('0-1-53');
	if(document.getElementById('0-1-60'))
	var taxType4=document.getElementById('0-1-60');
	if(document.getElementById('0-1-67'))
	var taxType5=document.getElementById('0-1-67');
	var taxTypeAmnt1=0;
	var taxTypeAmnt2=0;
	var taxTypeAmnt3=0;
	var taxTypeAmnt4=0;
	var taxTypeAmnt5=0;
	var zcrank=0;

	totalAmntOfProds = 0;
	var baseWtArr = new Array();
	totalBaseWeightOfProd=0;
	//var grandTotalAmnt=0;

	for (var i in prodTotalAmnt) 
		{
			var srcZcRank=i.split(':')[1].split('-')[0];
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-2201'))
			var prodObj=document.getElementById('0-1001:'+srcZcRank+'-1101-2201');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1127'))
			var listPriceObj=document.getElementById('0-1001:'+srcZcRank+'-1101-1127');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1104'))
			var actualPriceObj = document.getElementById('0-1001:'+srcZcRank+'-1101-1104');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-886'))
			var actualPriceInclTaxObj = document.getElementById('0-1001:'+srcZcRank+'-1101-886');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1103'))
			var qtyObj = document.getElementById('0-1001:'+srcZcRank+'-1101-1103');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1125'))
			var extndAmtObj = document.getElementById('0-1001:'+srcZcRank+'-1101-1125');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1129-1130'))
			var baseWeightObj =document.getElementById('0-1001:'+srcZcRank+'-1101-1129-1130');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-5102'))
			var baseWeightAmt = document.getElementById('0-1001:'+srcZcRank+'-1101-5102');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1134'))
			var discPrct = document.getElementById('0-1001:'+srcZcRank+'-1101-1134');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1135'))
			var discAmt = document.getElementById('0-1001:'+srcZcRank+'-1101-1135');
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-6301'))
			var lineLvlTaxObj = document.getElementById('0-1001:'+srcZcRank+'-1101-6301');
			if(document.getElementById('0-1001:'+srcZcRank+'0-1101-2201'))
			var prodObj = document.getElementById('0-1001:'+srcZcRank+'0-1101-2201');
			if(prodObj&&prodObj.value==""||prodObj.value=="2 chars or **")
			{
				if(listPriceObj)listPriceObj.value='';
				if(actualPriceObj)actualPriceObj.value='';
				if(actualPriceInclTaxObj)actualPriceInclTaxObj.value='';
				if(qtyObj)qtyObj.value='';
				if(extndAmtObj)extndAmtObj.value='';
				if(discPrct)discPrct.value='';
				if(discAmt)discAmt.value=''; 
				if(lineLvlTaxObj)lineLvlTaxObj.value = '';
			}
			//if(prodObj.disabled==true)
			//	prodObj.disabled=false;
		}

	if(from_unblock==1)
	{
		for (var i in prodTotalAmnt) 
		{
			var srcZcRank=i.split(':')[1].split('-')[0];
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1125') && document.getElementById('0-1001:'+srcZcRank+'-1101-1125').value!="")
				totalAmntOfProds=totalAmntOfProds+prodTotalAmnt[i];
			if((document.getElementById('0-1-45').value>0)||(document.getElementById('0-1-52').value>0)||(document.getElementById('0-1-59').value>0)||(document.getElementById('0-1-66').value>0)||(document.getElementById('0-1-73').value>0))
			{	
				if(isNaN(document.getElementById('0-1-45').value))document.getElementById('0-1-45').value=0.00;
				if(isNaN(document.getElementById('0-1-52').value))document.getElementById('0-1-52').value=0.00;
				if(isNaN(document.getElementById('0-1-59').value))document.getElementById('0-1-59').value=0.00;
				if(isNaN(document.getElementById('0-1-66').value))document.getElementById('0-1-66').value=0.00;
				if(isNaN(document.getElementById('0-1-73').value))document.getElementById('0-1-73').value=0.00;
				document.getElementById('totalPrice').value = totalAmntOfProds;
				document.getElementById('grandTotalPrice').value=parseFloat(totalAmntOfProds)+parseFloat(document.getElementById('0-1-45').value)+parseFloat(document.getElementById('0-1-52').value)+parseFloat(document.getElementById('0-1-59').value)+parseFloat(document.getElementById('0-1-66').value)+parseFloat(document.getElementById('0-1-73').value);
				alert(document.getElementById('grandTotalPrice').value);
			}
			else
			{
				document.getElementById('totalPrice').value = totalAmntOfProds.toFixed(2);
				document.getElementById('grandTotalPrice').value = totalAmntOfProds.toFixed(2);
				alert("Tot1-"+document.getElementById('grandTotalPrice').value);
			}
		}
	}
	else
	{
		for (var i in prodTotalAmnt) 
		{
			var srcZcRank=i.split(':')[1].split('-')[0];
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1128') && document.getElementById('0-1001:'+srcZcRank+'-1101-1128').value!="")
				totalAmntOfProds=totalAmntOfProds+prodTotalAmnt[i];
		}
	}
	
	if(document.getElementById('0-1-851')&&document.getElementById('0-1-851').value!="")
	{	
		var discPct=document.getElementById('0-1-851').value;
		if(isNaN(discPct))discPct=0.00;
		if(document.getElementById('0-1-850'))document.getElementById('0-1-850').value=((parseFloat(totalAmntOfProds)*(parseFloat(discPct)))/100);
		totalAmntOfProds=((parseFloat(totalAmntOfProds))-((parseFloat(totalAmntOfProds)*(parseFloat(discPct)))/100));
		document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);
	}
	else if(document.getElementById('0-1-850')&&document.getElementById('0-1-850').value!="")
	{
		var discAmt=document.getElementById('0-1-850').value;
		if(isNaN(discAmt))discAmt=0.00;
		if(document.getElementById('0-1-851'))
				document.getElementById('0-1-851').value=(parseFloat((discAmt*100)/totalAmt)).toFixed(2);
		var totalAmt = parseFloat(totalAmt)-parseFloat(discAmt);
		document.getElementById('totalPrice').value=totalAmt.toFixed(2);
	}
	else if((document.getElementById('0-1-850')&&document.getElementById('0-1-850').value=="")&&(document.getElementById('0-1-851')&&document.getElementById('0-1-851').value==""))
	{  alert("totalAmntOfProds-"+totalAmntOfProds);
		if(document.getElementById('0-1001:0-1101-1128'))
			document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);
	}
	else
	{
		if(document.getElementById('0-1001:0-1101-1128'))
			document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);
	}
	alert(totalAmntOfProds);
	totalPriceOfInv=document.getElementById('totalPrice').value;
	var grandTotalAmnt=totalAmntOfProds;
	if(Obj && Obj.value)
	{
		var taxTypeId=Obj.value;
		var taxTypeElmId=Obj.id;
		$.ajax({
			type:"GET",
			url: zcServletPrefix+"/custom/Quote/getTaxType.xml?id="+taxTypeId,
			dataType: "xml",
			success: function(doc){
				TaxType=doc.getElementsByTagName('TaxType');
				var def_pct= TaxType[0] ? TaxType[0].getAttribute ("def_pct") : '';
				var parentTaxId= TaxType[0] ? TaxType[0].getAttribute ("parent_taxId") : '';
				var parent_taxName= TaxType[0] ? TaxType[0].getAttribute ("parent_taxName") : '';
				var retVal="";
				if(taxTypeElmId=='0-1-39')
				{
					if(parentTaxId!=''){ 
						retVal=validateChildTax(parentTaxId,parent_taxName,"0-1-39");
						if(retVal=="0")
							{
							 //  return true;
							}
							else{document.getElementById('0-1-45txt').value=def_pct;}
						}
					else {
						  document.getElementById('0-1-45txt').value=def_pct;}
				}
				else if(taxTypeElmId=='0-1-46')
				{
					if(parentTaxId!=''){ 
						retVal=validateChildTax(parentTaxId,parent_taxName,"0-1-46");
						if(retVal=="0")
							{
							//   return true;
							}
							else{document.getElementById('0-1-52txt').value=def_pct;}
						}
				    else document.getElementById('0-1-52txt').value=def_pct;
				}
				else if(taxTypeElmId=='0-1-53')
				{
					if(parentTaxId!=''){
						retVal=validateChildTax(parentTaxId,parent_taxName,"0-1-53");
						if(retVal=="0")
							{
							 //  return true;
							}
							else{document.getElementById('0-1-59txt').value=def_pct;}
						}
					else document.getElementById('0-1-59txt').value=def_pct;
				}
				else if(taxTypeElmId=='0-1-60')
				{
					if(parentTaxId!=''){
						retVal=validateChildTax(parentTaxId,parent_taxName,"0-1-60");
						if(retVal=="0")
							{
							 //  return;
							}
							else{document.getElementById('0-1-66txt').value=def_pct;}
						}
					else document.getElementById('0-1-66txt').value=def_pct;
				}
				else if(taxTypeElmId=='0-1-67')
				{
					if(parentTaxId!=''){
						retVal=validateChildTax(parentTaxId,parent_taxName,"0-1-67");
						if(retVal=="0")
							{
							//   return;
							}
							else document.getElementById('0-1-73txt').value=def_pct;
						}
					else document.getElementById('0-1-73txt').value=def_pct;
				}
				if(taxType1&&taxType1.value!='')
				{
					document.getElementById("0-1-83").type="text";
					var taxRateObj = document.getElementById("0-1-83");
					taxRateObj.style.border ="0px";
					taxRateObj.style.width="50px";
					taxRateObj.readOnly=true;
					taxRateObj.style.textAlign="center";
					taxRateObj.style.fontFamily="Tahoma,Verdana";
					document.getElementById("0-1-83").value=document.getElementById('0-1-45txt').value+"%";
					taxTypeAmnt1=document.getElementById('0-1-45txt').value;
                    var taxAmtVal1=0;
							if((parentTaxId!='')&&(taxTypeElmId=='0-1-39'))
							{
								var parentAmt=getParentAmt(parentTaxId);
								taxAmtVal1=parentAmt;
								parentIdFor1=parentTaxId;
							}
							else if(parentIdFor1&&(taxTypeElmId!='0-1-39'))
							{
                                var parentAmt=getParentAmt(parentIdFor1,taxType1);
								taxAmtVal1=parentAmt;
								parentIdFor1=parentIdFor1;
							}
							else {
								taxAmtVal1=totalAmntOfProds;
								 parentIdFor1=null;}
                     
					  document.getElementById('0-1-45').value=((taxAmtVal1*taxTypeAmnt1)/100).toFixed(2);
					  grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-45').value);
					//document.getElementById('0-1-45').value=((totalAmntOfProds*taxTypeAmnt1)/100).toFixed(2);
					//grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-45').value);
				}
				if(taxType2&&taxType2.value!='')
				{
						document.getElementById("0-1-84").type="text";
						var taxRateObj = document.getElementById("0-1-84");
						
						taxRateObj.style.border ="0px";
						taxRateObj.style.width="50px";
						taxRateObj.readOnly=true;
						taxRateObj.style.textAlign="center";
						taxRateObj.style.fontFamily="Tahoma,Verdana";
						document.getElementById("0-1-84").value=document.getElementById('0-1-52txt').value+"%";
						taxTypeAmnt2=document.getElementById('0-1-52txt').value;
						var taxAmtVal2=0;
							if((parentTaxId!='')&&(taxTypeElmId=='0-1-46'))
							{
								var parentAmt=getParentAmt(parentTaxId);
								taxAmtVal2=parentAmt;
								parentIdFor2=parentTaxId;
							}
							else if(parentIdFor2&&(taxTypeElmId!='0-1-46'))
							{
                                var parentAmt=getParentAmt(parentIdFor2,taxType2);
								taxAmtVal2=parentAmt;
								parentIdFor2=parentIdFor2;
							}
							else{
								taxAmtVal2=totalAmntOfProds;
								 parentIdFor2=null;}
					   
						document.getElementById('0-1-52').value=((taxAmtVal2*taxTypeAmnt2)/100).toFixed(2);
						grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-52').value);
				}
				if(taxType3&&taxType3.value!='')
				{
					    document.getElementById("0-1-85").type="text";
						var taxRateObj = document.getElementById("0-1-85");
					
						taxRateObj.style.border ="0px";
						taxRateObj.style.width="50px";
						taxRateObj.readOnly=true;
						taxRateObj.style.textAlign="center";
						taxRateObj.style.fontFamily="Tahoma,Verdana";
						document.getElementById("0-1-85").value=document.getElementById('0-1-59txt').value+"%";
						taxTypeAmnt3=document.getElementById('0-1-59txt').value;
						var taxAmtVal=0;
							if((parentTaxId!='')&&(taxTypeElmId=='0-1-53'))
							{
								var parentAmt=getParentAmt(parentTaxId);
								taxAmtVal=parentAmt;
								parentIdFor3=parentTaxId;
							}
							else if(parentIdFor3&&(taxTypeElmId!='0-1-53'))
							{
                                var parentAmt=getParentAmt(parentIdFor3,taxType3);
								taxAmtVal=parentAmt;
								parentIdFor3=parentIdFor3;
							}
							else
							{
                               taxAmtVal=totalAmntOfProds;
								parentIdFor3=null;
							}
					
						document.getElementById('0-1-59').value=((taxAmtVal*taxTypeAmnt3)/100).toFixed(2);
						grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-59').value);
				}
				if(taxType4&&taxType4.value!='')
				{
						document.getElementById("0-1-86").type="text";
						var taxRateObj = document.getElementById("0-1-86");
					
						taxRateObj.style.border ="0px";
						taxRateObj.style.width="50px";
						taxRateObj.readOnly=true;
						taxRateObj.style.textAlign="center";
						taxRateObj.style.fontFamily="Tahoma,Verdana";
						document.getElementById("0-1-86").value=document.getElementById('0-1-66txt').value+"%";
						taxTypeAmnt4=document.getElementById('0-1-66txt').value;
						var taxAmtVal=0;
							if((parentTaxId!='')&&(taxTypeElmId=='0-1-60'))
							{
								var parentAmt=getParentAmt(parentTaxId);
								taxAmtVal=parentAmt;
								parentIdFor4=parentTaxId;
							}
							else if(parentIdFor4&&(taxTypeElmId!='0-1-60'))
							{
                                var parentAmt=getParentAmt(parentIdFor4,taxType4);
								taxAmtVal=parentAmt;
								parentIdFor4=parentIdFor4;
							}
							else
							{
                               taxAmtVal=totalAmntOfProds;
								parentIdFor4=null;
							}
					
						document.getElementById('0-1-66').value=((taxAmtVal*taxTypeAmnt4)/100).toFixed(2);
						grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-66').value);
				}
				if(taxType5&&taxType5.value!='')
				{
						document.getElementById("0-1-87").type="text";
						var taxRateObj = document.getElementById("0-1-87");
					
						taxRateObj.style.border ="0px";
						taxRateObj.style.width="50px";
						taxRateObj.readOnly=true;
						taxRateObj.style.textAlign="center";
						taxRateObj.style.fontFamily="Tahoma,Verdana";
						document.getElementById("0-1-87").value=document.getElementById('0-1-73txt').value+"%";
						taxTypeAmnt5=document.getElementById('0-1-73txt').value;
						var taxAmtVal=0;
							if((parentTaxId!='')&&(taxTypeElmId=='0-1-67'))
							{
								var parentAmt=getParentAmt(parentTaxId);
								taxAmtVal=parentAmt;
								parentIdFor5=parentTaxId;
							}
							else if(parentIdFor5&&(taxTypeElmId!='0-1-67'))
							{
                                var parentAmt=getParentAmt(parentIdFor5,taxType5);
								taxAmtVal=parentAmt;
								parentIdFor5=parentIdFor5;
							}
							else
							{
                               taxAmtVal=totalAmntOfProds;
								parentIdFor5=null;
							}
					
						document.getElementById('0-1-73').value=((taxAmtVal*taxTypeAmnt5)/100).toFixed(2);
						grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-73').value);
				}
				if(L_frieght_rate4Inv)
				{
					grandTotalAmnt=grandTotalAmnt+parseFloat(L_frieght_rate4Inv);
					document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
					L_frieghtRateEarlrVal=L_frieght_rate4Inv;
				}
				else
				{
					document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
					grandTotalPriceOfInv=document.getElementById('grandTotalPrice').value;
				}
			}
		});
	}
	else
	{
		if(taxType1&&taxType1.value!='')
		{
			taxTypeAmnt1=document.getElementById('0-1-45txt').value;
            var taxAmtVal1=0;
			if(parentIdFor1)
			{
               var parentAmt=getParentAmt(parentIdFor1);
			   taxAmtVal1=parentAmt;
			   parentIdFor1=parentIdFor1;
			}
			else {
			  taxAmtVal1=totalAmntOfProds;
			  //parentIdFor1=null;
			  }
			 document.getElementById('0-1-45').value=((taxAmtVal1*taxTypeAmnt1)/100).toFixed(2);
			//document.getElementById('0-1-45').value=((totalAmntOfProds*taxTypeAmnt1)/100).toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-45').value);
			taxTypeAmnt1PrvVal=parseFloat(document.getElementById('0-1-45').value);
		}
		if(taxType2&&taxType2.value!='')
		{
			taxTypeAmnt2=document.getElementById('0-1-52txt').value;
            var taxAmtVal2=0;
			if(parentIdFor2&&(taxTypeElmId!='0-1-46'))
				{
                  var parentAmt=getParentAmt(parentIdFor2,taxType2);
				  taxAmtVal2=parentAmt;
				  parentIdFor2=parentIdFor2;
				}
			else{
				taxAmtVal2=totalAmntOfProds;
				//parentIdFor2=null;
				}
            document.getElementById('0-1-52').value=((taxAmtVal2*taxTypeAmnt2)/100).toFixed(2);
			//document.getElementById('0-1-52').value=((totalAmntOfProds*taxTypeAmnt2)/100).toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-52').value);
			taxTypeAmnt2PrvVal=parseFloat(document.getElementById('0-1-52').value);
		}
		if(taxType3&&taxType3.value!='')
		{
			taxTypeAmnt3=document.getElementById('0-1-59txt').value;
            var taxAmtVal=0;
			if(parentIdFor3&&(taxTypeElmId!='0-1-53'))
			 {
               var parentAmt=getParentAmt(parentIdFor3,taxType3);
			   taxAmtVal=parentAmt;
			   parentIdFor3=parentIdFor3;
			  }
			else
			 {
               taxAmtVal=totalAmntOfProds;
			   //parentIdFor3=null;
			   }
             document.getElementById('0-1-59').value=((taxAmtVal*taxTypeAmnt3)/100).toFixed(2);
			//document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-59').value);
		}
		if(taxType4&&taxType4.value!='')
		{
			taxTypeAmnt4=document.getElementById('0-1-66txt').value;
            var taxAmtVal=0;
			if(parentIdFor4&&(taxTypeElmId!='0-1-60'))
			 {
               var parentAmt=getParentAmt(parentIdFor4,taxType4);
			   taxAmtVal=parentAmt;
			   parentIdFor4=parentIdFor4;
			  }
			else
			 {
               taxAmtVal=totalAmntOfProds;
			   //parentIdFor3=null;
			   }
             document.getElementById('0-1-66').value=((taxAmtVal*taxTypeAmnt4)/100).toFixed(2);
			//document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-66').value);
		}
		if(taxType5&&taxType5.value!='')
		{
			taxTypeAmnt5=document.getElementById('0-1-73txt').value;
            var taxAmtVal=0;
			if(parentIdFor5&&(taxTypeElmId!='0-1-67'))
			 {
               var parentAmt=getParentAmt(parentIdFor5,taxType5);
			   taxAmtVal=parentAmt;
			   parentIdFor5=parentIdFor5;
			  }
			else
			 {
               taxAmtVal=totalAmntOfProds;
			   //parentIdFor3=null;
			   }
             document.getElementById('0-1-73').value=((taxAmtVal*taxTypeAmnt5)/100).toFixed(2);
			//document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
			grandTotalAmnt=grandTotalAmnt+parseFloat(document.getElementById('0-1-73').value);
		}

		if(from_unblock==1)
		{
			totalBaseWeightOfProd=0;
			if(document.getElementById('0-1-822')&&baseWeightObj)
			{
				baseWtArr.length=0;
				for (var i in prodTotalAmnt) 
				{
					var srcZcRank=i.split(':')[1].split('-')[0];
					zcrank=srcZcRank;
				}
				for(var i=0;i<zcrank;i++)
				{
					if(document.getElementById('0-1001:'+i+'-1101-5102')&&document.getElementById('0-1001:'+i+'-1101-1103')&&document.getElementById('0-1001:'+i+'-1101-1129-1130')){
					document.getElementById('0-1001:'+i+'-1101-5102').value=((parseInt(ReplaceAll(document.getElementById('0-1001:'+i+'-1101-1103').value),",",""))*(parseInt(document.getElementById('0-1001:'+i+'-1101-1129-1130').value)));}
					baseWtArr.push(document.getElementById('0-1001:'+i+'-1101-5102').value);
				}
				for(var j in baseWtArr)
				{
					var BaseWtPrv=0;
					BaseWtPrv = baseWtArr[j];
					if(isNaN(BaseWtPrv))
						BaseWtPrv = 0.00;
					else
						BaseWtPrv=parseFloat(BaseWtPrv);
					totalBaseWeightOfProd += parseFloat(BaseWtPrv);
				}
				totalBaseWeightOfProd = parseFloat(totalBaseWeightOfProd);
				if(isNaN(totalBaseWeightOfProd))
					totalBaseWeightOfProd=0.00
				else
					totalBaseWeightOfProd=parseFloat(totalBaseWeightOfProd);
				
				if(document.getElementById('0-901-4022'))
					var stateId = document.getElementById("0-901-4022").selectedValue;
				else if(document.getElementById('0-1201-1357'))
					var stateId = document.getElementById("0-1201-1357").selectedValue;
					
					if(stateId==undefined)
						var sI = "";
					else
						var sI = stateId
				
					$.ajax({
					type:"GET",
					url : zcServletPrefix+"/custom/JSON/system/frieghtChargesApplicable.htm?sI="+sI+"&wT="+totalBaseWeightOfProd,
					dataType:"json",
					async: false,
					success:function(doc)
					{
						var L_frieghtrate = doc["frieght_rate"];
						var L_frieght_min_wt = doc["min_weight"];
						var L_frieght_max_wt = doc["max_weight"];
						
						if(L_frieghtrate=="")
						document.getElementById('0-1-822').value=L_frieghtRateEarlrVal;
						else
						document.getElementById('0-1-822').value=L_frieghtrate;
						
						L_frieght_rate4Inv=document.getElementById('0-1-822').value
						if(document.getElementById('grandTotalPrice'))
						{
							if(isNaN(L_frieghtrate)||L_frieghtrate==""){L_frieghtrate=0;}else{L_frieghtrate=parseFloat(L_frieghtrate);}
							document.getElementById('grandTotalPrice').value=document.getElementById('grandTotalPrice').value+L_frieghtrate;
						}
					}
					});
					if(totalBaseWeightOfProd>0)
					{
						grandTotalAmnt=grandTotalAmnt+parseFloat(L_frieght_rate4Inv);
						document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
						L_frieghtRateEarlrVal=L_frieght_rate4Inv;
					}
					else{
					document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
					grandTotalPriceOfInv=document.getElementById('grandTotalPrice').value;
					baseWtOnDisct=totalBaseWeightOfProd;}
			}
		}
		else
		{
			if(L_frieght_rate4Inv)
			{
				grandTotalAmnt=grandTotalAmnt+parseFloat(L_frieght_rate4Inv);
				document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
				L_frieghtRateEarlrVal=L_frieght_rate4Inv;
			}
			else{ 
			document.getElementById('grandTotalPrice').value=grandTotalAmnt.toFixed(2);
			grandTotalPriceOfInv=document.getElementById('grandTotalPrice').value;}
		}
	
	if(document.getElementById('totalPrice')&&document.getElementById('totalPrice').value==0.00)
	{
		if(document.getElementById('0-1-822'))
		document.getElementById('0-1-822').value='';
		if(document.getElementById('0-1-850'))
		document.getElementById('0-1-850').value='';
		if(document.getElementById('0-1-851'))
		document.getElementById('0-1-851').value='';
		if(document.getElementById('grandTotalPrice'))
		document.getElementById('grandTotalPrice').value='';
		L_frieghtRateEarlrVal='';
		if(document.getElementById('0-1-850'))
		document.getElementById('0-1-850').disabled=false;
		if(document.getElementById('0-1-851'))
		document.getElementById('0-1-851').disabled=false;
	}
  }
  if(chngGrndTot=="grndTot" && document.getElementById("grandTotalPrice")) document.getElementById("grandTotalPrice").value = document.getElementById('totalPrice').value;
}
function validateChildTax(parentTaxId,parentTaxName,elemId)
{
	var selectBoxIds=new Array('0-1-39','0-1-46','0-1-53','0-1-60','0-1-67');
	var selectAmtIds=new Array('0-1-45','0-1-52','0-1-59','0-1-66','0-1-73');
	var selectRateIds=new Array('0-1-83','0-1-84','0-1-85','0-1-86','0-1-87');

	var found=0;
	  for(i=0;i<selectBoxIds.length;i++)
		{
		  if(document.getElementById(selectBoxIds[i]))
			{
			   var selectedVal=document.getElementById(selectBoxIds[i]).value;
				if(selectedVal==parentTaxId)
				{
					found=found+1;
				}
			}
		}
		if(found==0)
		{
			if(elemId=="0-1-39")
			{
                document.getElementById("0-1-39")[0].selected=true;
				document.getElementById("0-1-83").value="";
				document.getElementById("0-1-45").value='0.00';
				document.getElementById("0-1-45txt").innerHTML = '0';
				alert(parentTaxName+" is not selected");
		        return "0";
			}
			else if(elemId=="0-1-46")
			{
                document.getElementById("0-1-46")[0].selected=true;
				document.getElementById("0-1-84").value="";
				document.getElementById("0-1-52").value='0.00';
				document.getElementById("0-1-52txt").innerHTML = '0';
				alert(parentTaxName+" is not selected");
		        return "0";
			}
			else if(elemId=="0-1-53")
			{
				document.getElementById("0-1-53")[0].selected=true;
				document.getElementById("0-1-85").value="";
				document.getElementById("0-1-59").value='0.00';
				document.getElementById("0-1-59txt").innerHTML = '0';
				alert(parentTaxName+" is not selected");
		        return "0";
			}
			else if(elemId=="0-1-60")
			{
				document.getElementById("0-1-60")[0].selected=true;
				document.getElementById("0-1-86").value="";
				document.getElementById("0-1-66").value='0.00';
				document.getElementById("0-1-66txt").innerHTML = '0';
				alert(parentTaxName+" is not selected");
		        return "0";
			}
			else if(elemId=="0-1-67")
			{
				document.getElementById("0-1-67")[0].selected=true;
				document.getElementById("0-1-87").value="";
				document.getElementById("0-1-73").value='0.00';
				document.getElementById("0-1-73txt").innerHTML = '0';
				alert(parentTaxName+" is not selected");
		        return "0";
			}
		}
}
function getParentAmt(parentTaxId,elem)
{
	var selectBoxIds=new Array('0-1-39','0-1-46','0-1-53','0-1-60','0-1-67');
	var selectAmtIds=new Array('0-1-45','0-1-52','0-1-59','0-1-66','0-1-73');
	var selectRateIds=new Array('0-1-83','0-1-84','0-1-85','0-1-86','0-1-87');

	var selectId;
	if(elem){var elemId=elem.id;}
	for(i=0;i<selectBoxIds.length;i++)
		{
		   var selectedVal=document.getElementById(selectBoxIds[i]).value;
			if(selectedVal==parentTaxId)
			{
				selectId=selectBoxIds[i];
				break;
			}
		}
		if(selectId=="0-1-39")
		{
            return document.getElementById("0-1-45").value;
		}
		else if(selectId=="0-1-46")
		{
           return document.getElementById("0-1-52").value;
		}
		else if(selectId=="0-1-53")
		{
			return document.getElementById("0-1-59").value;
		}
		else if(selectId=="0-1-60")
		{
			return document.getElementById("0-1-59").value;
		}
		else if(selectId=="0-1-67")
		{
			return document.getElementById("0-1-59").value;
		}
		else if((!selectId)||(selectId="undefined"))
		{
			if(elemId=="0-1-39")
			{
				var selectedTxt=elem.options[elem.selectedIndex].text;
                document.getElementById("0-1-39")[0].selected=true;
				document.getElementById("0-1-83").value="";
				document.getElementById("0-1-45").value='';
				document.getElementById("0-1-45txt").innerHTML = '0';
				alert("Parent tax for "+selectedTxt+" is not selected");
		        return false;
			}
			else if(elemId=="0-1-46")
			{
				var selectedTxt=elem.options[elem.selectedIndex].text;
                document.getElementById("0-1-46")[0].selected=true;
				document.getElementById("0-1-84").value="";
				document.getElementById("0-1-52").value='';
				document.getElementById("0-1-52txt").innerHTML = '0';
				alert("Parent tax for \""+selectedTxt+"\" is not selected");
		        return false;
			}
			else if(elemId=="0-1-53")
			{
				var selectedTxt=elem.options[elem.selectedIndex].text;
                document.getElementById("0-1-53")[0].selected=true;
				document.getElementById("0-1-85").value="";
				document.getElementById("0-1-59").value='';
				document.getElementById("0-1-59txt").innerHTML = '0';
				alert("Parent tax for \""+selectedTxt+"\" is not selected");
		        return false;
			}
			else if(elemId=="0-1-60")
			{
				var selectedTxt=elem.options[elem.selectedIndex].text;
                document.getElementById("0-1-60")[0].selected=true;
				document.getElementById("0-1-86").value="";
				document.getElementById("0-1-66").value='';
				document.getElementById("0-1-66txt").innerHTML = '0';
				alert("Parent tax for \""+selectedTxt+"\" is not selected");
		        return false;
			}
			else if(elemId=="0-1-67")
			{
				var selectedTxt=elem.options[elem.selectedIndex].text;
                document.getElementById("0-1-67")[0].selected=true;
				document.getElementById("0-1-87").value="";
				document.getElementById("0-1-73").value='';
				document.getElementById("0-1-73txt").innerHTML = '0';
				alert("Parent tax for \""+selectedTxt+"\" is not selected");
		        return false;
			}
		}
}



function changeColorOfDescAmnt(disctAmtObj)
{
	disctAmtObj.style.color="black";
	disctAmtObj.style.fontWeight="bold";
	return;
}

function changeColorOfactualPriceObj(elemId,descPctObj,descAmntObj)
{
	if(descPctObj)
	descPctObj.style.color = "grey";
	if(descAmntObj)
	descAmntObj.style.color = "grey";
	elemId.style.fontWeight="bold";
	elemId.style.color="black";
	return;
}
function changeColorOfDescPrcnt(descPctObj)
{
	descPctObj.style.color="black";
	descPctObj.style.fontWeight="bold";
	return;
}

var DiscountAmt="";
function calDisAmtTotalPrice4Inv(discAmt)
{
	var totalAmt = 0;
	if(document.getElementById('0-1-850'))
	var disct_amtObj = document.getElementById('0-1-850');
	if(document.getElementById('0-1-851'))
	var disct_pctObj = document.getElementById('0-1-851');

	disct_pctObj.disabled=true;
	if(DiscountAmt!=discAmt)
	{
		if(document.getElementById('0-1-850').value==""){
			document.getElementById('0-1-851').value="";DiscountAmt="";}
		if(discAmt&&document.getElementById('totalPrice')&&document.getElementById('totalPrice').value!="")
		{
			
			//totalAmt = totalPriceOfInv //document.getElementById('totalPrice').value;
			totalAmt = 0;
				for (var i in prodTotalAmnt) 
				{
					var srcZcRank=i.split(':')[1].split('-')[0];
					if(document.getElementById('0-1001:'+srcZcRank+'-1101-1128') && document.getElementById('0-1001:'+srcZcRank+'-1101-1128').value!="")
					totalAmt=totalAmt+prodTotalAmnt[i];
				}
			
			if(document.getElementById('0-1-851'))
				document.getElementById('0-1-851').value=(parseFloat((discAmt*100)/totalAmt)).toFixed(2);
			var totalAmt = parseFloat(totalAmt)-parseFloat(discAmt);
			document.getElementById('totalPrice').value=totalAmt.toFixed(2);
			if(document.getElementById('0-1-83'))
			var taxTypeAmnt1=(document.getElementById('0-1-83').value).split("(")[0];
			if(isNaN(taxTypeAmnt1))taxTypeAmnt1=0;
				else {taxTypeAmnt1=parseFloat(taxTypeAmnt1);}
			if(document.getElementById('0-1-45'))
			{
				var taxAmtVal1=0;
				if(parentIdFor1)
				 {
                   var parentAmt=getParentAmt(parentIdFor1);
				   taxAmtVal1=parentAmt;
				   parentIdFor1=parentIdFor1;
				 }
				 else {
					taxAmtVal1=totalAmt;
				 }
				document.getElementById('0-1-45').value=((taxAmtVal1*taxTypeAmnt1)/100).toFixed(2);
			   //document.getElementById('0-1-45').value=((totalAmt*taxTypeAmnt1)/100).toFixed(2);
			}
			if(document.getElementById('0-1-84'))
			var taxTypeAmnt2=(document.getElementById('0-1-84').value).split("(")[0];
			if(isNaN(taxTypeAmnt2))taxTypeAmnt2=0;
				else {taxTypeAmnt2=parseFloat(taxTypeAmnt2);}
			if(document.getElementById('0-1-52'))
			{
				var taxAmtVal2=0;
				if(parentIdFor2)
				 {
                    var parentAmt=getParentAmt(parentIdFor2);
					taxAmtVal2=parentAmt;
					parentIdFor2=parentIdFor2;
				 }
				else{
					taxAmtVal2=totalAmt;
				 }
				document.getElementById('0-1-52').value=((taxAmtVal2*taxTypeAmnt2)/100).toFixed(2);
			    //document.getElementById('0-1-52').value=((totalAmt*taxTypeAmnt2)/100).toFixed(2);
			}
			if(document.getElementById('0-1-85'))
			var taxTypeAmnt3=(document.getElementById('0-1-85').value).split("(")[0];
			if(isNaN(taxTypeAmnt3))taxTypeAmnt3=0;
				else {taxTypeAmnt3=parseFloat(taxTypeAmnt3);}
			if(document.getElementById('0-1-59'))
			{
			   var taxAmtVal=0;
			   if(parentIdFor3)
			    {
                  var parentAmt=getParentAmt(parentIdFor3);
				  taxAmtVal=parentAmt;
				  parentIdFor3=parentIdFor3;
				}
			   else
				{
                  taxAmtVal=totalAmt;
				}
			   document.getElementById('0-1-59').value=((taxAmtVal*taxTypeAmnt3)/100).toFixed(2);
			   //document.getElementById('0-1-59').value = ((totalAmt*taxTypeAmnt3)/100).toFixed(2);
			}		
			
			if(document.getElementById('0-1-86'))
			var taxTypeAmnt4=(document.getElementById('0-1-86').value).split("(")[0];
			if(isNaN(taxTypeAmnt4))taxTypeAmnt4=0;
				else {taxTypeAmnt4=parseFloat(taxTypeAmnt4);}
			if(document.getElementById('0-1-66'))
			{
			   var taxAmtVal=0;
			   if(parentIdFor4)
			    {
                  var parentAmt=getParentAmt(parentIdFor4);
				  taxAmtVal=parentAmt;
				  parentIdFor4=parentIdFor4;
				}
			   else
				{
                  taxAmtVal=totalAmt;
				}
			   document.getElementById('0-1-66').value=((taxAmtVal*taxTypeAmnt4)/100).toFixed(2);
			   //document.getElementById('0-1-59').value = ((totalAmt*taxTypeAmnt3)/100).toFixed(2);
			}				
			
			if(document.getElementById('0-1-87'))
			var taxTypeAmnt5=(document.getElementById('0-1-87').value).split("(")[0];
			if(isNaN(taxTypeAmnt5))taxTypeAmnt5=0;
				else {taxTypeAmnt5=parseFloat(taxTypeAmnt5);}
			if(document.getElementById('0-1-73'))
			{
			   var taxAmtVal=0;
			   if(parentIdFor5)
			    {
                  var parentAmt=getParentAmt(parentIdFor5);
				  taxAmtVal=parentAmt;
				  parentIdFor5=parentIdFor5;
				}
			   else
				{
                  taxAmtVal=totalAmt;
				}
			   document.getElementById('0-1-73').value=((taxAmtVal*taxTypeAmnt5)/100).toFixed(2);
			   //document.getElementById('0-1-59').value = ((totalAmt*taxTypeAmnt3)/100).toFixed(2);
			}

			if(isNaN(document.getElementById('0-1-45').value))document.getElementById('0-1-45').value=0;
			if(isNaN(document.getElementById('0-1-52').value))document.getElementById('0-1-52').value=0;
			if(isNaN(document.getElementById('0-1-59').value))document.getElementById('0-1-59').value=0;
			if(isNaN(document.getElementById('0-1-66').value))document.getElementById('0-1-66').value=0;
			if(isNaN(document.getElementById('0-1-73').value))document.getElementById('0-1-73').value=0;
			var grandTotalAmt = totalAmt+parseFloat(document.getElementById('0-1-45').value)+parseFloat(document.getElementById('0-1-52').value)+parseFloat(document.getElementById('0-1-59').value)+parseFloat(document.getElementById('0-1-66').value)+parseFloat(document.getElementById('0-1-73').value);
			
			if(document.getElementById('0-1-822')&&document.getElementById('0-1-822').value!=""&&document.getElementById('totalPrice').value>0&&baseWtOnDisct>0)
			{
				var grandTotalAmtFm = grandTotalAmt+ parseFloat(document.getElementById('0-1-822').value);
				document.getElementById('grandTotalPrice').value=grandTotalAmtFm.toFixed(2);
			}
			else if(document.getElementById('totalPrice').value!="")
				document.getElementById('grandTotalPrice').value = grandTotalAmt.toFixed(2);
			if(document.getElementById('0-1-850'))
			DiscountAmt =document.getElementById('0-1-850').value;
		}
	}
	if(((document.getElementById('0-1-850').value=="")||(document.getElementById('0-1-850').value==0))&&((document.getElementById('0-1-851').value=="")||(document.getElementById('0-1-851').value==0))&&document.getElementById('totalPrice').value>0)
	{
		totalAmntOfProds = 0;
		for (var i in prodTotalAmnt) 
		{
			var srcZcRank=i.split(':')[1].split('-')[0];
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1128') && document.getElementById('0-1001:'+srcZcRank+'-1101-1128').value!="")
			totalAmntOfProds=totalAmntOfProds+prodTotalAmnt[i];
		}
		document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);
		//document.getElementById('totalPrice').value=totalPriceOfInv;
		//document.getElementById('0-1-45').value=taxTypeAmnt1PrvVal;
		//document.getElementById('0-1-52').value=taxTypeAmnt2PrvVal;
		//document.getElementById('grandTotalPrice').value=grandTotalPriceOfInv;

		if(document.getElementById('0-1-83'))
			var taxTypeAmnt1=(document.getElementById('0-1-83').value).split("(")[0];
		var taxAmtVal1=0;
		if(parentIdFor1)
		 {
              var parentAmt=getParentAmt(parentIdFor1);
			  taxAmtVal1=parentAmt;
			  parentIdFor1=parentIdFor1;
		 }
		 else {
		   taxAmtVal1=totalAmntOfProds;
		 }
		document.getElementById('0-1-45').value=((taxAmtVal1*taxTypeAmnt1)/100).toFixed(2);
		//document.getElementById('0-1-45').value=((totalAmntOfProds*taxTypeAmnt1)/100).toFixed(2);


		if(document.getElementById('0-1-84'))
			var taxTypeAmnt2=(document.getElementById('0-1-84').value).split("(")[0];
		var taxAmtVal2=0;
		if(parentIdFor2)
		 {
            var parentAmt=getParentAmt(parentIdFor2);
			taxAmtVal2=parentAmt;
			parentIdFor2=parentIdFor2;
		 }
		else{
			taxAmtVal2=totalAmntOfProds;
		}
		document.getElementById('0-1-52').value=((taxAmtVal2*taxTypeAmnt2)/100).toFixed(2);
		//document.getElementById('0-1-52').value=((totalAmntOfProds*taxTypeAmnt2)/100).toFixed(2);

		if(document.getElementById('0-1-85'))
			var taxTypeAmnt3=(document.getElementById('0-1-85').value).split("(")[0];
        if(document.getElementById('0-1-59'))
			{
			   var taxAmtVal=0;
			   if(parentIdFor3)
			    {
                  var parentAmt=getParentAmt(parentIdFor3);
				  taxAmtVal=parentAmt;
				  parentIdFor3=parentIdFor3;
				}
			   else
				{
                  taxAmtVal=totalAmntOfProds;
				}
			   document.getElementById('0-1-59').value=((taxAmtVal*taxTypeAmnt3)/100).toFixed(2);
			}
		
		if(document.getElementById('0-1-86'))
			var taxTypeAmnt4=(document.getElementById('0-1-86').value).split("(")[0];
        if(document.getElementById('0-1-66'))
			{
			   var taxAmtVal=0;
			   if(parentIdFor4)
			    {
                  var parentAmt=getParentAmt(parentIdFor4);
				  taxAmtVal=parentAmt;
				  parentIdFor4=parentIdFor4;
				}
			   else
				{
                  taxAmtVal=totalAmntOfProds;
				}
			   document.getElementById('0-1-66').value=((taxAmtVal*taxTypeAmnt4)/100).toFixed(2);
			}
		
		if(document.getElementById('0-1-87'))
			var taxTypeAmnt5=(document.getElementById('0-1-87').value).split("(")[0];
        if(document.getElementById('0-1-73'))
			{
			   var taxAmtVal=0;
			   if(parentIdFor5)
			    {
                  var parentAmt=getParentAmt(parentIdFor5);
				  taxAmtVal=parentAmt;
				  parentIdFor5=parentIdFor5;
				}
			   else
				{
                  taxAmtVal=totalAmntOfProds;
				}
			   document.getElementById('0-1-73').value=((taxAmtVal*taxTypeAmnt5)/100).toFixed(2);
			}
		
		//	if(document.getElementById('0-1-59'))
		//	document.getElementById('0-1-59').value = ((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
		if(isNaN(document.getElementById('0-1-45').value))document.getElementById('0-1-45').value=0;
		if(isNaN(document.getElementById('0-1-52').value))document.getElementById('0-1-52').value=0;
		if(isNaN(document.getElementById('0-1-59').value))document.getElementById('0-1-59').value=0;
		if(isNaN(document.getElementById('0-1-66').value))document.getElementById('0-1-66').value=0;
		if(isNaN(document.getElementById('0-1-73').value))document.getElementById('0-1-73').value=0;
		var grandTotalAmt = totalAmntOfProds+parseFloat(document.getElementById('0-1-45').value)+parseFloat(document.getElementById('0-1-52').value)+parseFloat(document.getElementById('0-1-59').value)+parseFloat(document.getElementById('0-1-66').value)+parseFloat(document.getElementById('0-1-73').value);
		
		if(document.getElementById('0-1-822')&&document.getElementById('0-1-822').value!=""&&document.getElementById('totalPrice').value>0)
		{
			var grandTotalAmtFm = grandTotalAmt+ parseFloat(document.getElementById('0-1-822').value);
			document.getElementById('grandTotalPrice').value=grandTotalAmtFm.toFixed(2);
		}
		else if(document.getElementById('totalPrice').value!=""){
			document.getElementById('grandTotalPrice').value = grandTotalAmt.toFixed(2);}
		//if(document.getElementById('totalPrice').value!="")
		//	document.getElementById('grandTotalPrice').value = grandTotalAmt.toFixed(2);
		
	}
		
	if(disct_amtObj.value!='')
	 disct_pctObj.disabled=true;
	else if(disct_amtObj.value=='')	 disct_pctObj.disabled=false;
	
}

var DiscountPercent="";
function calDisPctTotalPrice4Inv(discPct)
{
	if(document.getElementById('0-1-850'))
	var discount_amountObj=document.getElementById('0-1-850');
	if(document.getElementById('0-1-851'))
	var discount_percentObj=document.getElementById('0-1-851');
	discount_percentObj.disabled=false;
	//document.getElementById('0-1-851').tabIndex="1";
	//document.getElementById('0-1-850').tabIndex="10";
	discount_amountObj.disabled=true;

	if(DiscountPercent!=discPct)
	{
		var totalAmntOfProds = 0;
		document.getElementById('addEditErrorDiv').style.display="none";
		if(discPct>100)
		{
			var msg="Enter the discount percent less than 100";
			document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul><li>"+msg+"</ul>";
			document.getElementById('addEditErrorDiv').style.display="block";
			discount_percentObj.style.border="1px solid #CC0000";
			discount_percentObj.value='';
			return;
		}
		else
		{
			if(document.getElementById('0-1-851'))
			document.getElementById('0-1-851').style.border="1px solid #CCCCCC";
				if(document.getElementById('0-1-851').value==""){
					document.getElementById('0-1-850').value="";DiscountPercent="";}
			if(discPct&&document.getElementById('totalPrice')&&document.getElementById('totalPrice').value!="")
			{
				//totalAmntOfProds = totalPriceOfInv; //document.getElementById('totalPrice').value;
				totalAmntOfProds = 0;
				for (var i in prodTotalAmnt) 
				{
					var srcZcRank=i.split(':')[1].split('-')[0];
					if(document.getElementById('0-1001:'+srcZcRank+'-1101-1128') && document.getElementById('0-1001:'+srcZcRank+'-1101-1128').value!="")
					totalAmntOfProds=totalAmntOfProds+prodTotalAmnt[i];
				}
				if(document.getElementById('0-1-850'))
				{
					document.getElementById('0-1-850').value=((parseFloat(totalAmntOfProds)*(parseFloat(discPct)))/100);
				totalAmntOfProds=((parseFloat(totalAmntOfProds))-((parseFloat(totalAmntOfProds)*(parseFloat(discPct)))/100));
				document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);
				if(document.getElementById('0-1-83'))
				var taxTypeAmnt1=(document.getElementById('0-1-83').value).split("(")[0];
				if(isNaN(taxTypeAmnt1))taxTypeAmnt1=0;
				else {taxTypeAmnt1=parseFloat(taxTypeAmnt1);}
				if(document.getElementById('0-1-45'))
					{
					  var taxAmtVal1=0;
					  if(parentIdFor1)
							{
                                var parentAmt=getParentAmt(parentIdFor1);
								taxAmtVal1=parentAmt;
								parentIdFor1=parentIdFor1;
							}
							else {
								taxAmtVal1=totalAmntOfProds;
								// parentIdFor1=null;
								 }
						document.getElementById('0-1-45').value=((taxAmtVal1*taxTypeAmnt1)/100).toFixed(2);
				      //document.getElementById('0-1-45').value=((totalAmntOfProds*taxTypeAmnt1)/100).toFixed(2);
					}
				if(document.getElementById('0-1-84'))
				     var taxTypeAmnt2=(document.getElementById('0-1-84').value).split("(")[0];
				if(isNaN(taxTypeAmnt2))taxTypeAmnt2=0;
				else {taxTypeAmnt2=parseFloat(taxTypeAmnt2)};
				if(document.getElementById('0-1-52'))
					{
					 var taxAmtVal2=0;
					 if(parentIdFor2)
						{
                           var parentAmt=getParentAmt(parentIdFor2);
							taxAmtVal2=parentAmt;
							parentIdFor2=parentIdFor2;
						}
						else{
							taxAmtVal2=totalAmntOfProds;
							//parentIdFor2=null;
							}
					  document.getElementById('0-1-52').value=((taxAmtVal2*taxTypeAmnt2)/100).toFixed(2);
				     //document.getElementById('0-1-52').value=((totalAmntOfProds*taxTypeAmnt2)/100).toFixed(2);
					}
				if(document.getElementById('0-1-85'))
				var taxTypeAmnt3=(document.getElementById('0-1-85').value).split("(")[0];
				if(isNaN(taxTypeAmnt3))taxTypeAmnt3=0;
				else {taxTypeAmnt3=parseFloat(taxTypeAmnt3);}
				if(document.getElementById('0-1-59'))
					{
					 var taxAmtVal=0;
					 if(parentIdFor3)
						{
                          var parentAmt=getParentAmt(parentIdFor3);
						  taxAmtVal=parentAmt;
						  parentIdFor3=parentIdFor3;
						}
					else
						{
                          taxAmtVal=totalAmntOfProds;
						  //parentIdFor3=null;
						}
					  document.getElementById('0-1-59').value=((taxAmtVal*taxTypeAmnt3)/100).toFixed(2);
				     // document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
					}
				
				if(document.getElementById('0-1-86'))
				var taxTypeAmnt4=(document.getElementById('0-1-86').value).split("(")[0];
				if(isNaN(taxTypeAmnt4))taxTypeAmnt4=0;
				else {taxTypeAmnt4=parseFloat(taxTypeAmnt4);}
				if(document.getElementById('0-1-66'))
					{
					 var taxAmtVal=0;
					 if(parentIdFor4)
						{
                          var parentAmt=getParentAmt(parentIdFor4);
						  taxAmtVal=parentAmt;
						  parentIdFor4=parentIdFor4;
						}
					else
						{
                          taxAmtVal=totalAmntOfProds;
						  //parentIdFor3=null;
						}
					  document.getElementById('0-1-66').value=((taxAmtVal*taxTypeAmnt4)/100).toFixed(2);
				     // document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
					}
				
				if(document.getElementById('0-1-87'))
				var taxTypeAmnt5=(document.getElementById('0-1-87').value).split("(")[0];
				if(isNaN(taxTypeAmnt5))taxTypeAmnt5=0;
				else {taxTypeAmnt5=parseFloat(taxTypeAmnt5);}
				if(document.getElementById('0-1-73'))
					{
					 var taxAmtVal=0;
					 if(parentIdFor5)
						{
                          var parentAmt=getParentAmt(parentIdFor5);
						  taxAmtVal=parentAmt;
						  parentIdFor5=parentIdFor5;
						}
					else
						{
                          taxAmtVal=totalAmntOfProds;
						  //parentIdFor3=null;
						}
					  document.getElementById('0-1-73').value=((taxAmtVal*taxTypeAmnt5)/100).toFixed(2);
				     // document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
					}


				if(isNaN(document.getElementById('0-1-45').value))document.getElementById('0-1-45').value=0;
				if(isNaN(document.getElementById('0-1-52').value))document.getElementById('0-1-52').value=0;
				if(isNaN(document.getElementById('0-1-59').value))document.getElementById('0-1-59').value=0;

				var grandTotalAmt = parseFloat(totalAmntOfProds)+parseFloat(document.getElementById('0-1-45').value)+parseFloat(document.getElementById('0-1-52').value)+parseFloat(document.getElementById('0-1-59').value);
				
				if(document.getElementById('0-1-822')&&document.getElementById('0-1-822').value!=""&&document.getElementById('totalPrice').value>0.00&&baseWtOnDisct>0)
				{
					var grandTotalAmtFm = grandTotalAmt + parseFloat(document.getElementById('0-1-822').value);
					document.getElementById('grandTotalPrice').value = grandTotalAmtFm.toFixed(2);
				//	document.getElementById('0-1-851').tabIndex="1";
				//	document.getElementById('0-1-850').tabIndex="10";
					if(document.getElementById('0-1-39'))
					document.getElementById('0-1-39').focus();
					discount_amountObj.disabled=true;
				}
				else if(document.getElementById('totalPrice').value>0.00)
					document.getElementById('grandTotalPrice').value = grandTotalAmt.toFixed(2);
				else if(document.getElementById('totalPrice').value==0){
					document.getElementById('grandTotalPrice').value=0.00}
				if(document.getElementById('0-1-851'))
				 DiscountPercent =document.getElementById('0-1-851').value;
				}
			}
		}
	}
	if(document.getElementById('0-1-850').value==""&&document.getElementById('0-1-851').value==""&&document.getElementById('totalPrice').value>0)
	{
		totalAmntOfProds = 0;
		for (var i in prodTotalAmnt) 
		{
			var srcZcRank=i.split(':')[1].split('-')[0];
			if(document.getElementById('0-1001:'+srcZcRank+'-1101-1128') && document.getElementById('0-1001:'+srcZcRank+'-1101-1128').value!="")
			totalAmntOfProds=totalAmntOfProds+prodTotalAmnt[i];
		}
		document.getElementById('totalPrice').value=totalAmntOfProds.toFixed(2);
		//document.getElementById('0-1-45').value=taxTypeAmnt1PrvVal;
		//document.getElementById('0-1-52').value=taxTypeAmnt2PrvVal;
		if(document.getElementById('0-1-83'))
		var taxTypeAmnt1=(document.getElementById('0-1-83').value).split("(")[0];
		if(isNaN(taxTypeAmnt1))taxTypeAmnt1=0;
		else {taxTypeAmnt1=parseFloat(taxTypeAmnt1);}
		if(document.getElementById('0-1-45'))
		{
			var taxAmtVal1=0;
			if(parentIdFor1)
		     {
                 var parentAmt=getParentAmt(parentIdFor1);
				 taxAmtVal1=parentAmt;
				 parentIdFor1=parentIdFor1;
			 }
			else {
				taxAmtVal1=totalAmntOfProds;
				// parentIdFor1=null;
			}
			document.getElementById('0-1-45').value=((taxAmtVal1*taxTypeAmnt1)/100).toFixed(2);
		    //document.getElementById('0-1-45').value=((totalAmntOfProds*taxTypeAmnt1)/100).toFixed(2);
		}
		if(document.getElementById('0-1-84'))
		var taxTypeAmnt2=(document.getElementById('0-1-84').value).split("(")[0];
		if(isNaN(taxTypeAmnt2))taxTypeAmnt2=0;
		else {taxTypeAmnt2=parseFloat(taxTypeAmnt2)};
		if(document.getElementById('0-1-52'))
		{
			var taxAmtVal2=0;
			if(parentIdFor2)
			  {
                 var parentAmt=getParentAmt(parentIdFor2);
				 taxAmtVal2=parentAmt;
				 parentIdFor2=parentIdFor2;
			  }
			else{
				taxAmtVal2=totalAmntOfProds;
				//parentIdFor2=null;
			}
		   document.getElementById('0-1-52').value=((taxAmtVal2*taxTypeAmnt2)/100).toFixed(2);
		  //document.getElementById('0-1-52').value=((totalAmntOfProds*taxTypeAmnt2)/100).toFixed(2);
		}
		if(document.getElementById('0-1-85'))
		var taxTypeAmnt3=(document.getElementById('0-1-85').value).split("(")[0];
		if(isNaN(taxTypeAmnt3))taxTypeAmnt3=0;
		else {taxTypeAmnt3=parseFloat(taxTypeAmnt3);}
		if(document.getElementById('0-1-59'))
		{
			var taxAmtVal=0;
			if(parentIdFor3)
			  {
                var parentAmt=getParentAmt(parentIdFor3);
				taxAmtVal=parentAmt;
				parentIdFor3=parentIdFor3;
			  }
			else
			 {
                taxAmtVal=totalAmntOfProds;
				//parentIdFor3=null;
			 }
		   document.getElementById('0-1-59').value=((taxAmtVal*taxTypeAmnt3)/100).toFixed(2);
		  // document.getElementById('0-1-59').value=((totalAmntOfProds*taxTypeAmnt3)/100).toFixed(2);
		}
		if(isNaN(document.getElementById('0-1-45').value))document.getElementById('0-1-45').value=0;
		if(isNaN(document.getElementById('0-1-52').value))document.getElementById('0-1-52').value=0;
		if(isNaN(document.getElementById('0-1-59').value))document.getElementById('0-1-59').value=0;
		var grandTotalAmt = totalAmntOfProds+parseFloat(document.getElementById('0-1-45').value)+parseFloat(document.getElementById('0-1-52').value)+parseFloat(document.getElementById('0-1-59').value);
	
		if(document.getElementById('0-1-822')&&document.getElementById('0-1-822').value!=""&&document.getElementById('totalPrice').value>0)
		{
			var grandTotalAmtFm = grandTotalAmt+ parseFloat(document.getElementById('0-1-822').value);
			document.getElementById('grandTotalPrice').value=grandTotalAmtFm.toFixed(2);
		}
		else if(document.getElementById('totalPrice').value!="")
			document.getElementById('grandTotalPrice').value = grandTotalAmt.toFixed(2);
	}
	if(discount_percentObj.value!='')
		discount_amountObj.disabled = true;
	else if(discount_percentObj.value==''||discount_percentObj.value==null)
		discount_amountObj.disabled=false;
	
	if(document.getElementById('0-1-39'))
	document.getElementById('0-1-39').focus();
}


function showProductTaxInfo(myForm,Obj)
{
	var elemId = Obj.id;
	var extendedAmt = 0;
	var totalLineLevelTaxAmt=0;
	
	if(elemId)
		var srcZcRank=elemId.split(':')[1].split('-')[0];
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-2201'))
		var product_name = document.getElementById('0-1001:'+srcZcRank+'-1101-2201').value;
	if(document.getElementById('0-1001:'+srcZcRank+'-1101-2201hdn'))
		var product_id = document.getElementById('0-1001:'+srcZcRank+'-1101-2201hdn').value;

	if(product_id)
	{
	if(priceInclTaxFlg !="1" && document.getElementById('0-1001:'+srcZcRank+'-1101-1104')&&document.getElementById('0-1001:'+srcZcRank+'-1101-1104').value)
			extendedAmt = (document.getElementById('0-1001:'+srcZcRank+'-1101-1104').value)*(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
	else if(priceInclTaxFlg =="1" && document.getElementById('0-1001:'+srcZcRank+'-1101-886')&&document.getElementById('0-1001:'+srcZcRank+'-1101-886').value!="")
				extendedAmt = (document.getElementById('0-1001:'+srcZcRank+'-1101-886').value)*(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
     if(document.getElementById("0-1001:"+srcZcRank+"-1101-1127")&&document.getElementById("0-1001:"+srcZcRank+"-1101-1127").value !="")   MRPAmt = (document.getElementById("0-1001:"+srcZcRank+"-1101-1127").value) *(document.getElementById('0-1001:'+srcZcRank+'-1101-1103').value);
		document.getElementById("commonPopupDiv").innerHTML = "";
		/******Send branch Id if it exist for line level tax calculation*******/
			var branchId="";
			if(document.getElementById("0-1-251") && document.getElementById("0-1-251").value !=""){
				branchId = document.getElementById("0-1-251").value;
			}
			/*****Get tax detail********/
		var detUrl=zcServletPrefix+'/custom/JSON/system/getTaxDet4Prod.htm?product_id='+product_id+"&branch_id="+branchId;
			
			$.ajax(
			{
				type: "GET",
				url:detUrl,
				dataType: "json",
				success: function (doc)
				{	
					if(doc['taxInfo']!=""&&extendedAmt>0)
					{
						prodTaxInfo=doc['taxInfo'].split('~)');
						$('#commonPopupDiv').dialog({
							autoOpen:true,
							modal: true,
							title:'Taxes Applied for '+product_name,
							minHeight:100,
							minWidth:350,	
							width:455,
							closeOnEscape:true,
							beforeclose: function() {}
						});

						var convertDivContent = "<table cellspacing='1'  cellpadding='2' border='0' class='TblBdy' width='440' align='center' style='vertical-align:middle;background-color:#dddddd;margin-top:5px;border: 1px solid #AAAAAA;border-radius:5px 5px 5px 5px;'>";
						 convertDivContent += "<tr valign='middle' class='TblBdy' cellspacing='3'  border='1'><th border='1' width='1' cellspacing='3'>#</th><th border='1' width='75' cellspacing='3' >Name</th><th border='1' width='40' cellspacing='3' >Percent</th><th border='1' width='40' cellspacing='3'>Calculated on amount</th><th border='1' width='30' cellspacing='3'>Amount</th></tr>"; 
						if(prodTaxInfo!=""&&prodTaxInfo.length>=1&&prodTaxInfo!="--")
						{
								for(var taxTypeCntr=0;taxTypeCntr<prodTaxInfo.length;taxTypeCntr++)
								{
									var taxDetails=prodTaxInfo[taxTypeCntr].split('--');
									var taxTypeName=taxDetails[0];
									var taxTypePct=taxDetails[1];
									var taxOnOther=taxDetails[2];
                                    var calcTaxOn = taxDetails[3];
							
									var tax2BeCalcOnAmt =0;
									if(calcTaxOn && calcTaxOn == "list_price") tax2BeCalcOnAmt=MRPAmt;
									else tax2BeCalcOnAmt=extendedAmt;

									if(taxOnOther){var parTaxAmt=parseFloat((taxOnOther/100)*parseFloat(tax2BeCalcOnAmt)); var taxAmt = parseFloat((taxTypePct/100)*parseFloat(parTaxAmt));}
									else if(tax2BeCalcOnAmt){
										//var taxAmt = parseFloat((taxTypePct/100)*parseFloat(tax2BeCalcOnAmt));
										var taxAmt = 0;
										if(priceInclTaxFlg !="1"){
										 taxAmt = parseFloat((taxTypePct/100)*parseFloat(tax2BeCalcOnAmt));
										 taxAmt = taxAmt.toFixed(2);
									   }
										else {
											 var taxPct4Divd = parseFloat(taxTypePct)+100;
											taxAmt = parseFloat((taxTypePct/taxPct4Divd)*parseFloat(tax2BeCalcOnAmt));
											taxAmt = Math.floor(taxAmt * 100) / 100;
										}
									}
									

									if(taxAmt){
									totalLineLevelTaxAmt=parseFloat(totalLineLevelTaxAmt)+parseFloat(taxAmt);
									if(priceInclTaxFlg !="1") totalLineLevelTaxAmt=totalLineLevelTaxAmttoFixed(2);
							        else totalLineLevelTaxAmt = Math.floor(totalLineLevelTaxAmt * 100) / 100;
									}
									var count = 1;
									count = taxTypeCntr+1;

									if (taxTypeName!=""){ convertDivContent += "<tr valign='middle' border='1' cellspacing='3' cellpadding='3'><td valign='middle' border='1' width='20' class='TblBdy' align='center' cellspacing='3'  cellpadding='3'>"+ count +"</td><td valign='middle' border='1' cellspacing='3'  cellpadding='3' width='75'  class='TblBdy' style='border:0px solid red' align='left'>" + taxTypeName  + "</td><td valign='middle' border='1' width='40'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='right'>" + taxTypePct + "</td><td valign='middle' border='1' width='50'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='right'>"+tax2BeCalcOnAmt.toFixed(2)+"</td><td valign='middle' border='1' width='50'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='right'>" + taxAmt + "&nbsp;</td></tr>"; }
								}
								 convertDivContent += "<tr valign='middle' border='1' cellspacing='3' cellpadding='3'><td valign='middle' border='1' width='20' class='TblBdy' align='right' cellspacing='3'  cellpadding='3' colspan='4' style='font-weight:bold;'>Total tax (Rs.)</td><td valign='middle' border='1' width='20' class='TblBdy' align='right' cellspacing='3'  cellpadding='3' style='font-face:Tahoma;font-weight:bold;'>"+totalLineLevelTaxAmt+"</td></tr>";
								if(document.getElementById('0-1001:'+srcZcRank+'-1101-6301'))
									document.getElementById('0-1001:'+srcZcRank+'-1101-6301').value = totalLineLevelTaxAmt;
								 convertDivContent += "</table></center><br/><span style='float:right;margin-right:150px;'><input style='width:70px;margin-top:10px;align:center;' onclick=\"javascript:closePopup()\" class='bigButton' type='button' value='OK'/></span>";
								document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						}
						else
						{
							var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
								convertDivContent += "<tr><td class='flexigrid'><br/><br/><center><b>There are no taxes for this "+product_name+".</b></center><br/><br/></td></tr>"; 
								convertDivContent += "</table>";
								document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
								setTimeout("closeCommonPopup()",1000);
						}
					}
				}
			});
	}
}


function checkForExistingInvNum(myForm, Obj)
{
	var invNum=Obj.value;
	var returnVal=true;
	var urlToHit=zcServletPrefix+'/custom/JSON/system/checkForExistingInvNum.htm?invNum='+invNum;
	$.ajax({
		type: "GET",
		url:urlToHit,
		dataType: "json",
		async: false,
		success: function (doc)
		{
			var errorDiv='addEditErrorDiv';
			if(doc.invNum)
			{
				document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul><li>Sorry, Invoice Number already exists.</li></ul>";
				document.getElementById(errorDiv).style.display="block";
				Obj.style.border="1px solid #CC0000";
				Obj.focus();
				returnVal=false;
			}
			else
			{
				document.getElementById(errorDiv).innerHTML="";
				document.getElementById(errorDiv).style.display="none";
				Obj.style.border="1px solid #DDDDDD";
				returnVal=true;
			}
		}
	});
	return returnVal;
}

function checkForExistingOrdNum(myForm, Obj)
{
	var ordNum=Obj.value;
	var returnVal=true;
	var urlToHit=zcServletPrefix+'/custom/JSON/system/checkForExistingOrdNum.htm?ordNum='+ordNum;
	$.ajax({
		type: "GET",
		url:urlToHit,
		dataType: "json",
		async: false,
		success: function (doc)
		{
			var errorDiv='addEditErrorDiv';
			if(doc.ordNum)
			{
				document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul><li>Sorry, Order Number already exists.</li></ul>";
				document.getElementById(errorDiv).style.display="block";
				Obj.style.border="1px solid #CC0000";
				Obj.focus();
				returnVal=false;
			}
			else
			{
				document.getElementById(errorDiv).innerHTML="";
				document.getElementById(errorDiv).style.display="none";
				Obj.style.border="1px solid #DDDDDD";
				returnVal=true;
			}
		}
	});
	return returnVal;
}

function printOrder(orderHeaderId)
{
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Templates',
		minHeight:100,
		minWidth:200,	
		width:450,
		closeOnEscape:true
	});
	var urlToHit=zcServletPrefix+'/custom/JSON/system/getOrderTemplates.htm?headerId='+orderHeaderId+'&folder=Order';
	$.ajax({
		type: "GET",
		url:urlToHit,
		dataType: "json",
		success: function (doc)
		{
			var orderHeaderId=doc.orderHeaderId;
			var printTmplts="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Please select one of the templates from the dropdown to print your order.<br /><br /></div><span style='margin-top:20px;margin-bottom:20px;'>Please select the print template: ";
			printTmplts+="<select name='template' id='template' onchange=\"getOrdTemplateFile(this.value,'"+orderHeaderId+"')\">";
			printTmplts+="<option value=''>Select Template</option>";
			var orderEmplts=doc.orderFileNames;
			for (tmpltCntr=0;tmpltCntr<orderEmplts.length;tmpltCntr++)
			{
				printTmplts+="<option value='"+orderEmplts[tmpltCntr].value+"'>"+orderEmplts[tmpltCntr].text+"</option>";
			}
			printTmplts+="</select></span></div>";
			document.getElementById('commonPopupDiv').innerHTML=printTmplts;
		}
	});
}

function getOrdTemplateFile(tmpltId,orderHeaderId)
{
	if(tmpltId)
	{
		$('#commonPopupDiv').dialog('close');
		var url = zcServletPrefix+'/custom/JSON/system/getTempExpanderForOrder.html?tmpltId='+tmpltId+'&headerId='+orderHeaderId+'&prefsName='+tmpltId;
		window.open(url,'welcome','width=850,height=650,menubar=no,status=no,location=no,toolbar=no,scrollbars=yes');
	}
}

function printInvoice(invoiceHeaderId)
{
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Templates',
		minHeight:100,
		minWidth:200,	
		width:450,
		closeOnEscape:true
	});
	var urlToHit=zcServletPrefix+'/custom/JSON/system/getInvoiceTemplates.htm?headerId='+invoiceHeaderId+'&folder=Invoice';
	$.ajax({
		type: "GET",
		url:urlToHit,
		dataType: "json",
		success: function (doc)
		{
			var invoiceHeaderId=doc.invoiceHeaderId;
			var printTmplts="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Please select one of the templates from the dropdown to print your invoice.<br /><br /></div><span style='margin-top:20px;margin-bottom:20px;'>Please select the print template: ";
			printTmplts+="<select name='template' id='template' onchange=\"getInvTemplateFile(this.value,'"+invoiceHeaderId+"')\">";
			printTmplts+="<option value=''>Select Template</option>";
			var invoceEmplts=doc.invoiceFileNames;
			for (tmpltCntr=0;tmpltCntr<invoceEmplts.length;tmpltCntr++)
			{
				printTmplts+="<option value='"+invoceEmplts[tmpltCntr].value+"'>"+invoceEmplts[tmpltCntr].text+"</option>";
			}
			printTmplts+="</select></span></div>";
			document.getElementById('commonPopupDiv').innerHTML=printTmplts;
		}
	});
}

function getInvTemplateFile(tmpltId,invoiceHeaderId)
{
	if(tmpltId)
	{
		$('#commonPopupDiv').dialog('close');
		var url = zcServletPrefix+'/custom/JSON/system/getTempExpanderForInvoice.html?tmpltId='+tmpltId+'&headerId='+invoiceHeaderId;//+'&prefsName='+tmpltId;
		window.open(url,'welcome','width=850,height=650,menubar=no,status=no,location=no,toolbar=no,scrollbars=yes');
	}
}

function callAllTaxItems()
{
	var elemIds=new Array('0-1-39','0-1-46','0-1-53','0-1-60','0-1-67');
	for(var i=0;i<elemIds.length;i++)
	{
		var element = document.getElementById(elemIds[i]);
		checkTaxTypeForInvoice('addEditForm',element);
	}
}

function checkTaxTypeForInvoice(myForm, Obj)//(selVal,SelId,amtId,taxtypeId)
{
	if(Obj)
	{
		var selVal=ReplaceAll(Obj.value,",","");
		var SelId=Obj.id;
		calculateProdTotalPriceForInvoice(myForm, Obj);
	}
	//var selectBoxIds=new Array('0-1-39','0-1-46','0-1-53','0-1-60','0-1-67');
	//var selectAmtIds=new Array('0-1-45','0-1-52','0-1-59','0-1-66','0-1-73');
	var selectBoxIds=new Array('0-1-39','0-1-46','0-1-53','0-1-60','0-1-67');
	var selectAmtIds=new Array('0-1-45','0-1-52','0-1-59','0-1-66','0-1-73');
	var selectRateIds=new Array('0-1-83','0-1-84','0-1-85','0-1-86','0-1-87');

	for(i=0;i<selectBoxIds.length;i++)
	{
		if(selectBoxIds[i]==SelId)
		{
			var amtId=selectAmtIds[i];
			var taxtypeId=selectAmtIds[i]+'txt';
			var rateId=selectRateIds[i];
		}
	}
	if(selVal){
		for(i=0;i<selectBoxIds.length;i++)
		{
			if(selectBoxIds[i]!=SelId)
			{
				var selectBox=document.getElementById(selectBoxIds[i]);
				if(selectBox)
				if(selectBox.options[selectBox.selectedIndex].value==selVal)
				{
					document.getElementById(SelId).selectedIndex=0;
					alert("Please select different tax type");
					document.getElementById(amtId).value = '';
					document.getElementById(taxtypeId).innerHTML = '0';
					document.getElementById(rateId).value = '';
					break;
				}
				
			}
		}
	}
	else
	{
		if(selVal == "")
		{
			document.getElementById(amtId).value = '0';
			document.getElementById(taxtypeId).innerHTML = '0';
			document.getElementById(rateId).value = '';
		}
	}
}

function calculateTotalCollection(myForm, Obj)
{
	var amt_collectedId=Obj.id;
	var amt_collectedIdPart1=amt_collectedId.split(':')[0];
	var ZcRank=amt_collectedId.split(':')[1].split('-');
	var amt_collectedIdPart2=ZcRank.splice(1);
	amt_collectedIdPart2=amt_collectedIdPart2.join("-");

	var totalAmtCollected=amtColTotalAmnt;
	for (i=0; i<2; i++)
	{
		var collVal=ReplaceAll(document.getElementById(amt_collectedIdPart1+":"+i+"-"+amt_collectedIdPart2).value,",","");
		if(collVal)
			totalAmtCollected=parseFloat(totalAmtCollected)+parseFloat(collVal);
	}
	if(totalAmtCollected&&document.getElementById('totalCollection'))
		document.getElementById('totalCollection').innerHTML="Collected: "+totalAmtCollected.toFixed(2);
}

//for adhoc reports
function adHocReportdoDelete (id,rowName,rowId,reportCreateddby)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog('open');
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			minHeight:120,
		    minWidth:120,	
		    width:280,
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
			
		});
		
		$('#commonPopupDiv').dialog({ title:'Delete '});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");		
		var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		if(reportCreateddby == session_login)
		{
		convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center> Are you sure you want to delete <b>"+rowName+"?</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:deleteReportOnConfirm('"+id+"')\"  class='greenButton' type='button' value='OK' id='commonPopupOK' name='commonPopupOK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+id+"')\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>";
		}
		else
		{
			convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center> You do not have permission to delete <b>"+rowName+"?</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+id+"')\"  class='greenButton' type='button' id='commonPopupOK' value='OK'/></div></td><tr>";
		}
		 
		convertDivContent+= "</table></center>";		
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
		document.getElementById("commonPopupOK").focus(); 
}

function deleteReportOnConfirm (id)
{
	 var JSONURL=zcServletPrefix+"/custom/adhocReports/deleteReport.html?id="+id;
     $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",			
			success: function (doc)
			   {
					var delRepResult = doc[0].reportid;
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					if(delRepResult)
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Report deletion failed</b><br/><br/></td></tr>";
					else
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Report deleted successfully</b><br/><br/></td></tr>";
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				}
			});
}

function adHocRunReport (id,rowName,rowId,reportCreateddby)
{
	setUpPageParameters (zcServletPrefix+"/custom/adhocReports/runReport.html?id="+id,entityDiv);  
}

function adHocRunReportBeta (id,rowName,rowId,reportCreateddby)
{
	setUpPageParameters (zcServletPrefix+"/custom/adhocReports/runReportJ.html?id="+id,entityDiv);  
}

function adHocEditReport (id,rowName,rowId,reportCreateddby)
{
	setUpPageParameters (zcServletPrefix+"/custom/adhocReports/editReport.html?reportId="+id,entityDiv);  
}

function getEODAlert(id, rowName, rowId)
{
	if(!rowId)
	{
		rowId = "";
	}
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog('open');
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			minHeight:120,
		    minWidth:120,	
		    width:500,
			closeOnEscape:true,
			beforeclose: function() { if(rowId) { putrowClass(rowId); }}
			
		});
		
		$('#commonPopupDiv').dialog({ title:'EOD Alert (End of the Day) '});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");	
		var eodalertsrc = zcServletPrefix+"/custom/adhocReports/eodAlert.html?reportId="+id+"&rowId="+rowId;
		
		var convertDivContent = "<table width='100%' align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		
		convertDivContent+="<tr ><td colspan='2'><iframe name='eodalertpopup' id='eodalertpopup' valign='top' frameborder='0' width='100%' height='380px' src='"+eodalertsrc+"'></iframe></td><tr>";
		 
		convertDivContent+= "</table></center>";		
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
}

function onEODSubmit(msg, rowId)
{	
		var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<tr ><td colspan='2' class='flexigrid'><br/><br/><b>"+msg+"</b><br/><br/></td><tr>";
		convertDivContent+= "</table></center>";		
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
		if(rowId)
		{
			setTimeout("closeCommonPopup(1)",1000);
		}
		else
		{
			setTimeout("closeCommonPopup()",1000);
		}
}

function createAdHocReport(url)
{
	$('.actions').css("display","none");
	setUpPageParameters (url,entityDiv);  
}


function getOffers4Prod(elem_id)
{
	var prod_id=document.getElementById(elem_id+'hdn').value;
	var zcRank=elem_id.split(':')[1].split('-')[0];
	var reqURL=zcServletPrefix+"/custom/JSON/system/getOffers4Prod.htm?prod_id="+prod_id;
	$.ajax({
		type: "GET",
		url: reqURL,
		dataType: "json",
		success: function (doc)
		{
			if(doc.offers>0)
			{
				var prodElemObj=document.getElementById(elem_id);
				var offerObj=document.createElement("a");
				offerObj.href="javascript:showOffers("+prod_id+", '"+prodElemObj.value+"', "+zcRank+")";
				offerObj.innerHTML="Offer";
				prodElemObj.parentNode.appendChild(offerObj);
			}
		}
	});
}

function showOffers(prod_id,prod_name,zcRank)
{
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Bundles for product',
		minHeight:100,
		minWidth:200,	
		width:525,
		closeOnEscape:true
	});
	var commonPopupDiv=document.getElementById("commonPopupDiv");
	commonPopupDiv.innerHTML="";
	commonPopupDiv.style.paddingLeft="10px";
	commonPopupDiv.style.paddingRight="10px";
	commonPopupDiv.style.paddingBottom="20px";
	var reqURL=zcServletPrefix+"/custom/JSON/system/listBundlesForProduct.htm?prodId="+prod_id;
	$.ajax({
		type: "GET",
		url: reqURL,
		dataType: "json",
		success: function (data)
		{
			var ColumnHeaders=data.ColumnHeaders;
			var RowData=data.RowData;
			CreateDIV(commonPopupDiv, 'jsonHeading', '', prod_name+'['+RowData.length+']');
			CreateSPAN(commonPopupDiv, 'jsonGrayTxt', '', 'These are the offers available for the selected product. Click on below rows to select the offers to add it to your products list.');
			
			var tbl=CreateTable(commonPopupDiv,'flexpoptab');
			var tblHd=CreateThead(tbl);
			var tblTR=CreateTR(tblHd);
			
			for (colHdCnt=0; colHdCnt<ColumnHeaders.length; colHdCnt++)
			{
				var tblTH=CreateTH(tblTR,'','',ColumnHeaders[colHdCnt].colmnDesc);
				tblTH.width=150;
			}

			var tblBdy=CreateBody(tbl);
			for (rwCnt=0; rwCnt<RowData.length; rwCnt++)
			{
				var tblTR=CreateTR(tblBdy,'rowClass');
				var sepRowData=RowData[rwCnt].data;
				for (colCnt=0; colCnt<sepRowData.length; colCnt++)
				{
					var tblTD=CreateTD(tblTR,'','','','',sepRowData[colCnt].colTxt);
				}

				var saleOfferHdrId=RowData[rwCnt].pkId;
				tblTR.style.cursor="pointer";
				AddClickEventListener(tblTR, 
					(function(saleOfferHdrId) { 
						return function() { 
							selectOffer4prod(saleOfferHdrId);
						}; 
					})(saleOfferHdrId) 
				);	
			}

			$('.flexpoptab').flexigrid({height:'auto',striped:false});
		}
	});
}

function selectOffer4prod(saleOfferHdrId)
{
	var reqURL=zcServletPrefix+"/custom/JSON/system/listBundleDetails.htm?id="+saleOfferHdrId;
	$.ajax({
		type: "GET",
		url: reqURL,
		dataType: "json",
		success: function (data)
		{
		}
	});
}

function makeClick2Call(click2Call)
{
	$.ajax({
		type: "GET",
		url: click2Call,
		dataType: "text",
		success: function (){}
	});
}

function callExotel(url2Call,agentNum,customerNum)
{
	var postString="url2Call="+encodeURI(url2Call)+"&From="+agentNum+"&To="+customerNum ;

		$.ajax({
			url:"http://192.168.11.11:81/exotel/exotelConnectAgent.php",
			type: "POST",
			data: postString,
			beforeSend: function() {
					    $('#callingImg').show();
				  },
			complete: function(){
					   $('#callingImg').hide();
				  },
			success : function(data)
			 {
			  if(data.indexOf("<Call>")==-1) alert("Connection failed");
			 },
		    error:function(jqXHR, textStatus, errorThrown){
				  alert("Connection failed");
			 }
		 });
}
function callKnowlarity(url2Call,agentNum,customerNum,apiKey,srNumber)
{
    url2Call=ReplaceAll(url2Call,"agent_number_val", agentNum);
    url2Call=ReplaceAll(url2Call,"caller_number", customerNum);
	url2Call=ReplaceAll(url2Call,"+","%2B");
    var userId=session_login;                  //User ID global variable
	$.ajax({
				type: "POST",
				url:url2Call,
				//dataType: "json",
				dataType: "jsonp",
				crossDomain:true,
				async:false,
			    jsonp : "callback",
                jsonpCallback: "knowlarityCallSuccess",
				beforeSend: function() {
					    $('#callingImg').show();
				  },
				complete:function(data)
				{
					    $('#callingImg').hide();
				},
				error:function(jqXHR, textStatus, errorThrown){
				     $('#callingImg').hide();
				     var callStatus=jqXHR.statusText;
				     if(callStatus == "success")
					  {
						  var postData='0-1-3= knowlarity-Outbound call&0-1-6=1&0-1-385='+srNumber+'&0-1-388='+customerNum+'&0-1-389='+agentNum;
						  var url2Hit="/atCRM/custom/JSON/add/Activity/editAction";
							$.ajax({
								type: "POST",
								url:url2Hit,
								data: postData,
								success: function (data)
								 {
								 data=JSON.parse(data);
								 var actvtyId=data.addedId;
								 QaddAdd4Activity(actvtyId,userId,'','');
								 }
							});
					}
				  else alert("Error in connection");
			    }
			});
}
function showSaleOffers(saleOfferHdrId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Sale Offers',
		minHeight:260,
		minWidth:420,	
		width:620,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var convertDivContent = "<table style='border:0px solid red;' cellpadding='3' width='100%'><tr><td align='center'>";
	convertDivContent+="<iframe id='saleOffers' frameborder='0' src='"+zcServletPrefix+"/custom/Inventory/viewSaleOffer.html?id="+saleOfferHdrId+"&fromPage=callCenter' width='600px' style='border:0px solid red' height='450px'></iframe>"
	convertDivContent += "</td></tr></table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}
//To get recently added invoice, By Hamsa.
function dispRecentInvoice()
{
    var show_templates="";
	var flagData = flagsJSON;
	var orgFlagData = flagData[0]["org_flags"];
	for(var t=0;t<orgFlagData.length;t++)
	 {
		var flagName = orgFlagData[t]["name"];
		var flagVal = orgFlagData[t]["flag_value"];
		if(flagName == "show_templates")
		 {
		    show_templates = flagVal;
			break;
		 }
	}
	if(show_templates != "0"){
	var reqURL=zcServletPrefix+"/custom/JSON/system/recentlyAddedInvoice.htm";
	$.ajax({
		type: "GET",
		url: reqURL,
		dataType: "json",
		success: function (doc)
		{
			Invoice_header_id = doc["Invoice_header_id"];
			printInvoice(Invoice_header_id);
		}
	});
	}
}

function dispRecentOrder()
{
	var reqURL=zcServletPrefix+"/custom/JSON/system/recentlyAddedOrder.htm";
	$.ajax({
		type: "GET",
		url: reqURL,
		dataType: "json",
		success: function (data)
		{
			var ColumnHeaders=data.ColumnHeaders;
			var RowData=data.RowData;
			var order_header_id=RowData[0];
			if(order_header_id)
			{
				document.getElementById("commonPopupDiv").innerHTML = "";
				$('#commonPopupDiv').dialog('open');
				$('#commonPopupDiv').dialog({
					autoOpen:true,
					modal: true,
					title:'Recently added Order',
					minHeight:260,
					minWidth:350,	
					width:350,
					closeOnEscape:true,
					beforeclose: function() {}

				});
				var convertDivContent = "<center><br /><br />You have added an order with below details<br /><br /><table width='100%' style='border:0px solid red;' cellpadding='3'>";
				for(i=1;i<ColumnHeaders.length;i++)
				{
					if(RowData[i])
					{
						convertDivContent+="<tr><td style='font-weight:bold;'>"+ColumnHeaders[i]+"</td>";
						convertDivContent+="<td>: "+RowData[i]+"</td></tr>";
					}
				}
				convertDivContent+="<tr><td align='center' colSpan='2'><input class='greenButton' type='button' value='Ok' onclick='closePopup()'/></td></tr>"
				convertDivContent += "</table>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
		}
	});
}

function dispRecentVoucher()
{
	var reqURL=zcServletPrefix+"/custom/JSON/system/recentlyAddedVoucher.htm";
	
	$.ajax({
		type: "GET",
		url: reqURL,
		dataType: "json",
		success: function (data)
		{
			var ColumnHeaders=data.ColumnHeaders;
			var RowData=data.RowData;
			var loy_pgm_xn_id=RowData[0];
			var loy_pgm_xn_trans_type = RowData[5];
			
			if(loy_pgm_xn_id)
			{
				document.getElementById("commonPopupDiv").innerHTML = "";
				$('#commonPopupDiv').dialog('open');
				$('#commonPopupDiv').dialog({
					autoOpen:true,
					modal: true,
					title:'Loyalty Transaction added',
					minHeight:260,
					minWidth:350,	
					width:350,
					closeOnEscape:true,
					beforeclose: function() {}
				});
				var convertDivContent = "<center><br /><br />You have added a loyalty transaction with these details<br /><br /><table width='100%' style='border:0px solid red;' cellpadding='3'>";
				for(i=1;i<ColumnHeaders.length;i++)
				{
					if(RowData[i])
					{
						convertDivContent+="<tr><td style='font-weight:bold;'>"+ColumnHeaders[i]+"</td>";
						convertDivContent+="<td>: "+RowData[i]+"</td></tr>";
					}
				}
				if(loy_pgm_xn_trans_type == "Redemption")
				{
					convertDivContent+="<tr><td align='center' colSpan='2'><input class='greenButton' type='button' value='Ok' onclick='closePopup()'/>&nbsp;<input class='greenButton' type='button' value='Print' onclick=\"javascript:printRedemption('"+loy_pgm_xn_id+"')\"/></td></tr>"
					convertDivContent += "</table>";
				}
				else
				{
					convertDivContent+="<tr><td align='center' colSpan='2'><input class='greenButton' type='button' value='Ok' onclick='closePopup()'/></td></tr>"
					convertDivContent += "</table>";
				}
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
		}
	});
}

function printRedemption(transId)
{
	if(transId)
	{
		$('#commonPopupDiv').dialog('close');
		var url = zcServletPrefix+'/custom/JSON/system/getTempExpanderForRedeem.html?transId='+transId;
		window.open(url,'welcome','width=850,height=650,menubar=no,status=no,location=no,toolbar=no,scrollbars=yes');
	}
}

function CheckBxValuesOfSBEUser(myForm,chkBoxvalues)
{
	 var gmt_str_value = '';
	 var user_can_add_adhoc = chkBoxvalues.split(',')[0];
	 var user_can_edit_adhoc = chkBoxvalues.split(',')[1];
	 var enable_email_reminder = chkBoxvalues.split(',')[2];
	 var enable_sms_reminder = chkBoxvalues.split(',')[3];
	 var gmt_value = chkBoxvalues.split(',')[4];

	if(document.getElementById('0-201-381'))
	  if(user_can_add_adhoc==0)
		document.getElementById('0-201-381').checked = false;
	  else if(user_can_add_adhoc==1)
		document.getElementById('0-201-381').checked = true;

	if(document.getElementById('0-201-382'))
	  if(user_can_edit_adhoc==0)
		document.getElementById('0-201-382').checked = false;
	  else if(user_can_edit_adhoc==1)
		document.getElementById('0-201-382').checked = true;

	if(document.getElementById('0-201-383'))
	  if(enable_email_reminder==0)
		document.getElementById('0-201-383').checked = false;
	  else if(enable_email_reminder==1)
		document.getElementById('0-201-383').checked = true;

	if(document.getElementById('0-201-384'))
	  if(enable_sms_reminder==0)
		document.getElementById('0-201-384').checked = false;
	  else if(enable_sms_reminder==1)
		document.getElementById('0-201-384').checked = true;
		
	if(gmt_value!=''&&document.getElementById('0-201-385'))
	{	
		 if(gmt_value == -12.00)
			gmt_str_value += "(GMT -12:00) Eniwetok, Kwajalein";
		 else if(gmt_value == -11.00)
			gmt_str_value += "(GMT -11:00) Midway Island, Samoa";
		 else if(gmt_value == -10.00)
			gmt_str_value += "(GMT -10:00) Hawaii";
		 else if(gmt_value == -9.00)
			gmt_str_value += "(GMT -9:00) Alaska";
		 else if(gmt_value == -8.00)
			gmt_str_value += "(GMT -8:00) Pacific Time (US &amp; Canada)";
		 else if(gmt_value == -7.00)
			gmt_str_value += "(GMT -7:00) Mountain Time (US &amp; Canada)";
		 else if(gmt_value == -6.00)
			gmt_str_value += "(GMT -6:00) Central Time (US &amp; Canada), Mexico City";
		 else if(gmt_value == -5.00)
			gmt_str_value += "(GMT -5:00) Eastern Time (US &amp; Canada)";
		 else if(gmt_value == -4.00)
			gmt_str_value += "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz";
		 else if(gmt_value == -3.50)
			 gmt_str_value += "(GMT -3:30) Newfoundland";
		 else if(gmt_value == -3.00)
			gmt_str_value += "(GMT -3:00) Brazil, Buenos Aires, Georgetown";
		 else if(gmt_value == -2.00)
			gmt_str_value += "(GMT -2:00) Mid-Atlantic";
		 else if(gmt_value == -1.00)
			gmt_str_value += "(GMT -1:00 hour) Azores, Cape Verde Islands";
		 else if(gmt_value == -0.00)
			gmt_str_value += "(GMT) Western Europe Time, London, Lisbon, Casablanca";
		 else if(gmt_value == 1.00)
			gmt_str_value += "(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris";
		 else if(gmt_value == 2.00)
			gmt_str_value += "(GMT +2:00) Kaliningrad, South Africa";
		 else if(gmt_value == 3.00)
			gmt_str_value += "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg";
		 else if(gmt_value == 3.50)
			gmt_str_value += "(GMT +3:30) Tehran";
		 else if(gmt_value == 4.00)
			gmt_str_value += "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi";
		 else if(gmt_value == 4.50)
			gmt_str_value += "(GMT +4:30) Kabul";
		 else if(gmt_value == 5.00)
			gmt_str_value += "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent";
		 else if(gmt_value == 5.50)
			gmt_str_value += "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi";
		 else if(gmt_value == 5.75)
			gmt_str_value += "(GMT +5:45) Kathmandu";
		 else if(gmt_value == 6.00)
			gmt_str_value += "(GMT +6:00) Almaty, Dhaka, Colombo";
		 else if(gmt_value == 7.00)
			gmt_str_value += "(GMT +7:00) Bangkok, Hanoi, Jakarta";
		 else if(gmt_value == 8.00)
			gmt_str_value += "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong";
		 else if(gmt_value == 9.00)
			gmt_str_value += "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk";
		 else if(gmt_value == 9.50)
			gmt_str_value += "(GMT +9:30) Adelaide, Darwin";
		 else if(gmt_value == 10.00)
			gmt_str_value += "(GMT +10:00) Eastern Australia, Guam, Vladivostok";
		 else if(gmt_value == 11.00)
			gmt_str_value += "(GMT +11:00) Magadan, Solomon Islands, New Caledonia";
		 else if(gmt_value == 12.00)
			gmt_str_value += "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka";
	}
	else if(gmt_value==''||gmt_value==null)
	{
		gmt_str_value += "None";
	}
		if(document.getElementById('0-201-385'))
		{
			$("#0-201-385 option").each(function() {
			  if($(this).text() == gmt_str_value) {
				$(this).attr('selected', 'selected');            
			  }});
		}
		/*
		var selIndx = document.getElementById('0-201-385');
		if(gmt_str_value)
		selIndx.options[selIndx.selectedIndex].text = gmt_str_value;
		document.getElementById('0-201-385').selected = true;*/
}

function validateToRedeem()
{
	var msg='';
	var returnVal=true;

		if(document.getElementById('0-1-4').value!='')
			var membr_id = document.getElementById('0-1-4').value;

		if(document.getElementById('0-1-10'))
			var tierValue = document.getElementById('0-1-10');
			var tierId = tierValue.options[tierValue.selectedIndex].value;

		if(document.getElementById('0-1-23')&&(document.getElementById('0-1-23').value!=''))
			var keydInPoints = document.getElementById('0-1-23').value;

			 var JSONURL=zcServletPrefix+"/custom/JSON/system/checkPointsToRedeem.htm?mI="+membr_id+"&tierId="+tierId;
		 $.ajax({
			type: "GET",
				url: JSONURL,
				dataType: "json",	
				async:false,
				success: function (doc)
				   {
						var current_points = doc.checkPointsToRedeem.current_points;
						var min_blnc_points = doc.checkPointsToRedeem.min_points;
						var redeemPoints = current_points - keydInPoints;
						var errorDiv='addEditErrorDiv';
						if(redeemPoints < min_blnc_points)
					   {
							msg += "\n Sorry,you can not do redemption.your current point is "+current_points+" and minimum balance required is "+min_blnc_points;
					   }
						if(msg)
						{
							 document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
							 document.getElementById('addEditErrorDiv').style.display="block";
							 returnVal=false;
						}
						else
							returnVal=true;

					}
				});
			if(returnVal == true)
			return true;
			else
			return false;
}

function showDateTimeForServReq()
{
	if(document.getElementById('0-401-402')&&document.getElementById('0-401-402').value=='')
	{
		if(document.getElementById('0-2501')) 
			var DtAndTm= document.getElementById('0-2501').value;
			var SplitVal = DtAndTm.split(' ');
			var curentSrvrDt = SplitVal[0];
			var curentSrvrTm = SplitVal[1];
			var ap = SplitVal[2];
			
	document.getElementById('0-401-434_date_value').value = curentSrvrDt
	document.getElementById('0-401-434_time_value').value =  curentSrvrTm +" "+ ap;;
	document.getElementById('0-401-434').value = document.getElementById('0-401-434_date_value').value + document.getElementById('0-401-434_time_value').value;
	}
}

function hideLayout4TypeBasedAddEditPages()
{
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	for (i=0;i<layoutLinks.length;i++)
	{
		if(layoutLinks[i].id=='tab_Prefs')
			layoutLinks[i].style.display="none";
	}
}

function printCoupons(couponPlanId)
{
	window.open(zcServletPrefix+"/custom/coupons/printCoupons.html?planId="+couponPlanId);
}

function validatecouponNumbers(formName,id)
{
	var msg='';
	var errorDiv = 'addEditErrorDiv';
	var returnVal=true;
	var prefix = document.getElementById("0-1-61").value;
	var suffix = document.getElementById("0-1-62").value;
	var startValue = document.getElementById("0-1-13").value;
	startValue = startValue.replace(/,/g,"");
	var couponNo = prefix+startValue+suffix;
	if (formName=="addEditForm")
	{
		var txtBox = document.getElementById('0-1-3');
		var val = txtBox.value;
		var validationURL = zcServletPrefix+'/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=coupon_plan&str='+val;
		$.ajax({
			   type: "GET",
			   url: validationURL,
			   dataType: "xml",
			   async:false,
			   success: function (doc)
			   {			
				  var details= doc.getElementsByTagName("details");				
				  var dets = details[0]?details[0].getAttribute("dets") : null;	
				  var detsid=dets.split("--");
				  if(detsid[1]!=id && dets!="")
				  { 
				     var msg="Coupon Plan already exist. Please enter unique value.";
				     document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
				     document.getElementById('addEditErrorDiv').style.display="block";
				     txtBox.focus();
					 if(msg)
					 {
						var retVal = false;
						returnVal = retVal;
					 }
				  }
				   else
				  {
						document.getElementById('addEditErrorDiv').style.display="none";
						var retVal = true;
						returnVal = retVal;
				  }
			   }
			});
	}
	if(returnVal)
	{
		if(id)
		{
			var urlToHit=zcServletPrefix+'/custom/JSON/system/checkForExistingPfixSfix.htm?id='+id+'&couponNo='+couponNo+'&prefix='+prefix+'&suffix='+suffix;
			$.ajax({
				type: "GET",
				url:urlToHit,
				dataType: "json",
				async: false,
				success: function (doc)
				{
					if(doc.couponNo)
					{					msg += "\n<li>A coupon with same coupon number exist</li>";
						document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
						document.getElementById(errorDiv).style.display="block";
						returnVal=false;
					}
					else if(doc.couponPlan!=id && doc.couponPlan!='' && prefix!='' && suffix!='')
					{
						msg += "\n<li>A coupon plan with same prefix and suffix exist</li>";
						document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
						document.getElementById(errorDiv).style.display="block";
						returnVal=false;
					}
					else
					{
						document.getElementById(errorDiv).innerHTML="";
						document.getElementById(errorDiv).style.display="none";
						returnVal=true;
					}
				}
			});
		}
		else{
			var urlToHit=zcServletPrefix+'/custom/JSON/system/checkForExistingPfixSfix.htm?couponNo='+couponNo+'&prefix='+prefix+'&suffix='+suffix;
			$.ajax({
				type: "GET",
				url:urlToHit,
				dataType: "json",
				async: false,
				success: function (doc)
				{
					if(doc.couponNo)
					{
						msg += "\n<li>A coupon with same coupon number exist</li>";
						document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
						document.getElementById(errorDiv).style.display="block";
						returnVal=false;
					}
					else if(doc.couponPlan)
					{
						msg += "\n<li>A coupon plan with same prefix and suffix exist</li>";
						document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
						document.getElementById(errorDiv).style.display="block";
						returnVal=false;
					}
					else
					{
						document.getElementById(errorDiv).innerHTML="";
						document.getElementById(errorDiv).style.display="none";
						returnVal=true;
					}
				}
			});
			
		
		}
	}return returnVal;
}

function validateEmpCode(myForm,id)
{
	if (myForm=="addEditForm")
	{
		var txtBox = document.getElementById('0-1-3');
		var val = txtBox.value;
		var validationURL = zcServletPrefix+'/custom/JSON/smartSuggest/genericPicklist.xml?tblName=employee_id&pckListName=employee&str='+val;
		//var returnVal = callUniqueValidationAjax (url,test,'Employee code','');
		$.ajax({
			   type: "GET",
			   url: validationURL,
			   dataType: "xml",
			   async:false,
			   success: function (doc)
			   {			
				  var details= doc.getElementsByTagName("details");				
				  var dets = details[0]?details[0].getAttribute("dets") : null;	
				  var detsid=dets.split("--");
				  if(detsid[1]!=id && dets!="")
				  { 
				     var msg="Employee code already exist. Please enter unique value.";
				     document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
				     document.getElementById('addEditErrorDiv').style.display="block";
				     txtBox.focus();
					 if(msg)
					 {
						var retVal = false;
						returnVal = retVal;
					 }
				  }
				   else
				  {
						document.getElementById('addEditErrorDiv').style.display="none";
						var retVal = true;
						returnVal = retVal;
				  }
			   }
			});
		if (returnVal)
		{
			return true;
		}
	}
}
function validatecoupons(myForm,id)
{
	var returnVal=true;
	if (myForm=="addEditForm")
	{
		var txtBox = document.getElementById('0-1-3');
		var val = txtBox.value;
		var validationURL = zcServletPrefix+'/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=coupon&str='+val;
//		var returnVal = callUniqueValidationAjax (url,test,'Coupon number','');

		$.ajax({
			   type: "GET",
			   url: validationURL,
			   dataType: "xml",
			   async:false,
			   success: function (doc)
			   {			
				  var details= doc.getElementsByTagName("details");				
				  var dets = details[0]?details[0].getAttribute("dets") : null;	
				  var detsid=dets.split("--");
				  if(detsid[1]!=id && dets!="")
				  { 
				     var msg="Coupon number already exist. Please enter unique value.";
				     document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
				     document.getElementById('addEditErrorDiv').style.display="block";
				     txtBox.focus();
					 if(msg)
					 {
						var retVal = false;
						returnVal = retVal;
					 }
				  }
				   else
				  {
						document.getElementById('addEditErrorDiv').style.display="none";
						var retVal = true;
						returnVal = retVal;
				  }
			   }
			});

		if (returnVal)
		{
			return true;
		}
	}
}

function hideLayout4SupportContractAddEdit()
{
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	for (i=0;i<layoutLinks.length;i++)
	{
		if(layoutLinks[i].id=='tab_Prefs')
			layoutLinks[i].style.display="none";
	}
}

function multiAddActivityLoadFun(myForm,Obj)
{
	hideLeftPannel(true);
	if(document.getElementById('detailDataTd'))
	{
		var detailDiv = document.getElementById('detailDataTd');
		detailDiv.style.width = "100%";
	}
	var formName=document.getElementById('addEditForm');
	var layoutLinks=formName.getElementsByTagName('a');
	for (i=0;i<layoutLinks.length;i++)
	{
		if(layoutLinks[i].id=='tab_Prefs')
			layoutLinks[i].style.display="none";
	}
	var dt = new Date();
	var curDate = dt.getDate('dd/MM/yyyy');
	var curMnth = dt.getMonth()+1;
	if(curMnth<10)
		curMnth = "0"+curMnth;
	else
		curMnth = curMnth;
	var curYr = dt.getFullYear();
	var currentDt = curDate + "/" + curMnth + "/" + curYr;
	var hh = dt.getHours();
	var mm = dt.getMinutes();
	var ss = dt.getSeconds();
	var currentTime =  hh+":"+mm+":"+ss;
	if(document.getElementById('0-1:0-101-196')&&document.getElementById('0-1:0-101-196_date_value')&&(document.getElementById('0-1:0-101-196_time_value')))
	{
		document.getElementById('0-1:0-101-196_date_value').value = currentDt;
		document.getElementById('0-1:0-101-196_time_value').value = "09:00 AM";
		document.getElementById('0-1:0-101-196').value = document.getElementById('0-1:0-101-196_date_value').value + " " +document.getElementById('0-1:0-101-196_time_value').value;
	}
}

function setTimeForMultiAddActivity(myForm,obj)
{
	var newTimeVal;
	if(obj)
	{
		var elemId = obj.id;
		if(document.getElementById(elemId).value=="")
		{
			var dt = new Date();
			var curDate = dt.getDate('dd/MM/yyyy');
			var curMnth = dt.getMonth()+1;
			if(curMnth<10)
				curMnth = "0"+curMnth;
			else
				curMnth = curMnth;
			var curYr = dt.getFullYear();
			var currentDt = curDate + "/" + curMnth + "/" + curYr;
			var prevsElemActvtTime;
			var currentElemTimeVal;
			var splitId = elemId.split(":")[1];
			var zcrank = splitId.split("-")[0];
		
			for(var i=0;i<=zcrank;i++)
			{
				var prevzcrank = zcrank-1;
				prevsElemActvtTime = document.getElementById('0-1:'+prevzcrank+'-101-196_time_value').value;
				currentElemTimeVal=prevsElemActvtTime;
				var d = currentDt + " " + currentElemTimeVal;
				var ap = currentElemTimeVal.split(' ')[1];
				var hour = (currentElemTimeVal.split(' ')[0]).split(':')[0];
				var minute = (currentElemTimeVal.split(' ')[0]).split(':')[1];
				var second = "00";
				if(ap == "AM")
				{if (hour == 12)hour = "00";}
				else
				{hour=parseFloat(hour);if(hour < 12){hour = hour+12;};}
				hour = parseFloat(hour)+1;
				if (hour < 12)
					ap = "AM";
				else
					ap = "PM";
				
				if(hour==24){ap="AM";var tomorrow = (dt.getDate()+1)+"/"+curMnth+"/"+curYr; document.getElementById('0-1:'+zcrank+'-101-196_date_value').value=tomorrow;}
				if(hour>=13)
					hour-=12;
				
				newTimeVal = hour+":"+minute+" " +ap;
			}
			if(tomorrow)
				document.getElementById(elemId).value = tomorrow;
			else
			document.getElementById(elemId).value = document.getElementById('0-1:'+prevzcrank+'-101-196_date_value').value;
			var timeElemId = document.getElementById(elemId).id;
			var timeElemId=timeElemId.split("_")[0];
			document.getElementById(timeElemId+'_time_value').value = newTimeVal;
			document.getElementById('0-1:'+zcrank+'-101-196').value = document.getElementById(elemId).value+ " " +document.getElementById(timeElemId+'_time_value').value;
		}
	}
}

function validateOnChangeMultiAddActvt(myForm,Obj,getRowCnt)
{
	var msg='';
	if(Obj&&Obj!=null)
	{
	var elemId = Obj.id;
		if(elemId.indexOf(':')>0)
		{
			var spltElmId = elemId.split(':');
			var partOne = spltElmId[0];
			var partTwo = spltElmId[1];
			var elemIdRowCnt = partTwo.slice(0,partTwo.indexOf("-"));
			for(var i=0;i<=getRowCnt;i++)
			{
				if(i==elemIdRowCnt)
				{
					var startDt = document.getElementById('0-1:'+i+'-101-196_date_value').value;
						var strtSplitDt = startDt.split(' ');
						var stDt = strtSplitDt[0];
						var dt = new Date();
						var curDate = dt.getDate('dd/MM/yyyy');
						var curMnth = dt.getMonth()+1;
						var curYr = dt.getFullYear();
						var currentDt = curDate + "/" + curMnth + "/" + curYr;
						var dateValue = MaxDate(stDt,currentDt,'dd/MM/yyyy');
						var selIndx = document.getElementById('0-1:'+i+'-101-159');
						var txt = selIndx.options[selIndx.selectedIndex].text;
						if(dateValue == 1 && txt == "Completed")
						{
							msg += "\n<li>Status can not be completed for future start date.</li>";
							document.getElementById(elemId).focus();
							document.getElementById(elemId).style.border="1px solid #CC0000";
						}
				}
			}
		}
	}
	if(msg)
	{
		 document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		 document.getElementById('addEditErrorDiv').style.display="block";
		 return false;
	}
	else
	{ 
		document.getElementById('addEditErrorDiv').style.display="none";
		return true;
	}
}

function validateOnSubmitMultiAddActvt(myForm,getListlength)
{
	var msg='';
	if(getListlength)
	{
		for(var j=0;j<=getListlength;j++)
		{
				if((document.getElementById('0-1:'+j+'-101-103')&&(document.getElementById('0-1:'+j+'-101-103').value!=""))&&(document.getElementById('0-1:'+j+'-101-196_date_value')&&document.getElementById('0-1:'+j+'-101-196_date_value').value==""))
				{
						msg+="\n <li> Please enter start date.</li>";
						document.getElementById('0-1:'+j+'-101-196_date_value').style.border="1px solid #CC0000";
						document.getElementById('0-1:'+j+'-101-196_time_value').style.border="1px solid #CC0000";
				}
				if((document.getElementById('0-1:'+j+'-101-196_date_value')&&document.getElementById('0-1:'+j+'-101-196_date_value').value!="")&&(document.getElementById('0-1:'+j+'-101-103')&&document.getElementById('0-1:'+j+'-101-103').value==""))
				{
					msg+="\n <li> Please enter subject.</li>";
					document.getElementById('0-1:'+j+'-101-103').focus();
					document.getElementById('0-1:'+j+'-101-103').style.border="1px solid #CC0000";
				}
				if(document.getElementById('0-1:'+j+'-101-159'))
				{	
					var selIndx = document.getElementById('0-1:'+j+'-101-159');
					var txt = selIndx.options[selIndx.selectedIndex].text;
					var Obj = document.getElementById('0-1:'+j+'-101-159');
					if(txt == "Completed")
					if(validateOnChangeMultiAddActvt(myForm,Obj,getListlength))
					return true;
					else 
					return false;
				}
		}
	}
	if(msg)
	{
		 document.getElementById('addEditErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		 document.getElementById('addEditErrorDiv').style.display="block";
		 return false;
	}
	else 
	{
		document.getElementById('addEditErrorDiv').style.display="none";
		return true;
	}
}

function clearTaxForInvoice(img,taxPct,objId,taxName,taxPercent)
{
	if(img.src.indexOf("/atCRM/images/JSON/delete-icon.png")>=0)
	{
		document.getElementById(taxPct).value="0.00";
		document.getElementById(taxName).style.textDecoration="line-through";
		document.getElementById(taxPercent).style.textDecoration="line-through";
		img.src="/atCRM/images/JSON/addIcon.png";
		img.title="Add";
		calculateTotForInv('addEditForm',document.getElementById(objId));
	}
	else
	{
		$.ajax({
			type:"GET",
			url: zcServletPrefix+"/custom/Quote/getTaxType.xml?id="+document.getElementById(taxName).value,
			dataType: "xml",
			success: function(doc){
				TaxType=doc.getElementsByTagName('TaxType');
				var def_pct= TaxType[0] ? TaxType[0].getAttribute ("def_pct") : '';
				document.getElementById(taxPct).value=def_pct;
				calculateTotForInv('addEditForm',document.getElementById(objId));
			}			
		});
		
		document.getElementById(taxName).style.textDecoration="none";
		document.getElementById(taxPercent).style.textDecoration="none";
		img.src="/atCRM/images/JSON/delete-icon.png";
		img.title="Delete";
	}
}
function loadScripts()
{   
	$.getScript("/atCRM/javascript/appContext.js");
	$.getScript("/atCRM/javascript/stringUtils.js");
	$.getScript("/atCRM/javascript/dateUtils.js");
	$.getScript("/atCRM/javascript/sfcrmCommon.js");
	//$.getScript("${JS_LIB_PATH}/jquery.js");
	$.getScript("/atCRM/javascript/reportLayout.js");
	$.getScript("/atCRM/javascript/xmlExtras.js");
	$.getScript("/atCRM/custom/adhocReports/valueRangeDefs.js");
	/******Scripts for report tree view popup*******/
	$("head").append($("<link rel='stylesheet' href='/atCRM/stylesheets/JSON/jquery/jquery.treeview.css'>"));
	$.getScript("/atCRM/javascript/JSON/jquery/jquery.treeview.js");
	/*************/
}
var isReload = 0;
var treeWindow;
function showTreeViewPopup()
{
    $.window.prepare({
          dock: 'left'       // change the dock direction: 'left', 'right', 'top', 'bottom'
	});
	$.window({
		showModal: false,
		title: "Users",
		content: "<div id='treeViewDiv'></div>",
		width: 250,
		height: 400,
		maxWidth: 300,
		maxHeight: 400,
		resizable: false,
		onClose: function(wnd) { 
		},
		onShow:function(wnd){
			treeWindow = wnd;
			document.getElementsByClassName("maximizeImg window_icon_button no-draggable")[0].style.display="none";
			document.getElementsByClassName("window_frame ui-widget-content no-draggable no-resizable ")[0].style.backgroundColor="white";
			var wndElem=document.getElementsByClassName("window_panel  ui-draggable")[0];
			wndElem.style.left="0px";
            wndElem.style.bottom="0px";
		},
		afterCascade: function(wnd) {
			document.getElementsByClassName("maximizeImg window_icon_button no-draggable")[0].style.display="none";
		}
	});
}
function updateTreeViewPopup()
{
	$("#treeview").treeview();
    $("#treeview span").click(function(){
		 var userIdName = this.parentNode.id;
		 var userId = userIdName.split("_");
		 var splitLen = userId.length;
		 splitLen = parseInt(splitLen)-1;
		 userId = userId[splitLen];
       //  $(this).attr("class","folder");
		 //var IframeElem = document.getElementById('htmlIframe');
		 //var innerDoc = IframeElem.contentDocument || IframeElem.contentWindow.document;
		 document.getElementById('htmlIframe').contentWindow.reploadPage(userId);
	});
}
var windowContView;
function processOzoneTel(userId,userName)
{
				var socket = io.connect("http://192.168.11.11:60050/");
				// on connection to server, ask for user's name with an anonymous callback
				socket.on('connect', function(){
					socket.emit('adduser',userName);
				});
				/*socket.on('processCDR', function(cdrId,username) {
					alert("cdrId-"+cdrId);
				});*/
				/********Function called from callProcess.js(server side)*********/
				socket.on('processCall', function(jsonStr) {
                 jsonStr = JSON.parse(jsonStr);
				 var element = document.createElement("INPUT");
	             element.setAttribute("type", "hidden");
				 element.setAttribute("id", "hidd_call_JSON");
				 document.getElementById("pageContent").appendChild(element);
				 element.value=jsonStr;
				 parent.callJSON = jsonStr;
				 //callJSON = jsonStr;
				 var phNum=jsonStr["phNum"];var ucid=jsonStr["ucid"];var did=jsonStr["did"];
				 var callerID=jsonStr["callerID"];var skillName=jsonStr["skillName"];var agentID=jsonStr["agentID"];
				 var campaignId=jsonStr["campaignId"];var monitorUcid=jsonStr["monitorUcid"];var type=jsonStr["type"];
				 var uui=jsonStr["uui"];var customer=jsonStr["customer"];
                 primPhone=phNum.toString().replace('+','');
				 callerID=callerID.toString().replace('+','');
				 /***Get the start_time***/
				 var dateTime = new Date();
				 var day = dateTime.getDate();var month = dateTime.getMonth();var year = dateTime.getFullYear();var hr = dateTime.getHours();var mints = dateTime.getMinutes();var sec = dateTime.getSeconds();
				 month +=1;
				 var newDate = day+"/"+month+"/"+year+" "+hr+":"+mints+":"+sec;
                 /*****Data to be posted******/
				 var actvtId;
				 if(uui.indexOf("actvt:") !=-1) actvtId = uui.replace(/actvt:/gi,"");
				 var subject="";
				 var callType="";
				 if(type.toLowerCase() == "inbound") {
					 subject="Inbound call from "+primPhone;
					 callType ="Inbound";
				 }
				 else if(uui.indexOf("actvt:") !=-1 && type.toLowerCase() == "progressive") {
					 subject = "Followup call to "+primPhone;
					 callType ="Followup";
				 }
				 else {
					 subject = "Outbound call to "+primPhone;
					 callType ="Outbound";
				 }
				 var postData;
                 if(isNaN(actvtId)){
				 postData='0-1-3='+subject+'&0-1-96='+newDate+'&0-1-6=1&0-1-395='+escape(ucid)+'&0-1-398='+escape(did)+'&0-1-385='+escape(did)+'&0-1-387='+escape(monitorUcid)+'&0-1-389='+escape(callerID)+'&0-1-400='+escape(skillName)+'&0-1-413='+agentID+'&0-1-397='+campaignId+'&0-1-405='+type+'&0-1-396='+uui;
				 }
				 else {
					// postData='0-1-2='+actvtId;
					 postData='0-1-2='+actvtId+'&0-1-3='+subject+'&0-1-96='+newDate+'&0-1-6=1&0-1-395='+escape(ucid)+'&0-1-398='+escape(did)+'&0-1-385='+escape(did)+'&0-1-387='+escape(monitorUcid)+'&0-1-389='+escape(callerID)+'&0-1-400='+escape(skillName)+'&0-1-413='+agentID+'&0-1-397='+campaignId+'&0-1-405='+type+'&0-1-396='+uui;
				 }
				 var url2Hit="/atCRM/custom/JSON/add/Activity/editAction";
				 $.ajax({
					type: "POST",
					url:url2Hit,
					data: postData,
					success: function (data)
					{
					   data=JSON.parse(data);
					   var actvtyId = data.addedId;
					   $.window.prepare({
							dock: 'bottom'       // change the dock direction: 'left', 'right', 'top', 'bottom'
						});
						var templtIcon="";
						var divContent="<div id='msg_div' style='display:none;text-align: center;z-index: 9999;position: absolute;opacity: .6;width: 600px;background: black;color: white;border-radius: 2px;'></div><div id='windowDiv' style='height:100%;width:100%'></div><input type='hidden' id='blink_index_input' value='0'/>"
						var windowHeight=$(window).height();
						var windowWidth=$(window).width();
						var jqryWinHt=windowHeight-40;
						var jqryWinWdth=windowWidth-120;
						var windowWidth = windowWidth - 275;

						var titleHTML;var intervalId;var windowId;var isMinimize='0';var pageTitle;
						//var blinkIndex=0;
						var browser= navigator.userAgent;
						browser = browser.toLowerCase();

						//prompt("Browser",browser)
						if(browser.indexOf("firefox")>-1) 
							titleHTML="<span style='width:80%' id='title_text'></span><span style='width:20%;color:red;text-decoration:blink;margin-left:70%;'>"+callType+" Call</span>";
						else{
							titleHTML="<span style='width:80%' id='title_text'></span><span style='width:20%;float:right;color:red;'><span id='spn_inbound'>****"+callType+" Call****</span></span>";
						}
						//var phone_num=primPhone.replace("91","0");
								var url2Hit="/atCRM/custom/JSON/view/contact360View.htm?pri_phone="+phone_num;
								$.ajax({
									type: "GET",
									url:url2Hit,
									dataType: "json",
									success: function (data)
									  { 
										var contactId= data.PrimaryKeyValue;
										var pageTitle= data.PageCaption;
										var contMnuItemId = data.ContMnuItemId;
										var dispName = pageTitle.split("-")[1];
										var message = "";
										if(hr <11) message="Good morning ";
										else if(hr >=11 && hr <15) message = "Good afternoon ";
										else message = "Good evening ";
										message += dispName+" this is "+G_userName+". How can I help you?";
										/************If contact exist for the phone number************/
										if(contactId !='') { 
											$.window({ 
												showModal: false,
												modalOpacity: 0.5,
												//icon: templtIcon,
												//title: titleHTML,
												width: windowWidth,
												height: jqryWinHt,
												maxWidth: 870,
												maxHeight: 570,
												resizable: true,
												content: divContent,
												onShow: function(wnd) {
													document.getElementById("pageContent").style.opacity=".1";
													windowId = wnd.getWindowId();
													windowContView = wnd;
													var windowElem=document.getElementById(windowId);
													windowElem.getElementsByClassName("window_title_text")[0].innerHTML=titleHTML;
													document.getElementById("title_text").innerHTML=pageTitle;
													  windowElem.style.left="15px";
													  windowElem.style.top="20px";
													  qWindwPos = windowWidth+20+10;qWindwPos +="px";
													 if(browser.indexOf("firefox")<0){
														intervalId=window.setInterval(function(){
														blinkIndex=document.getElementById("blink_index_input").value;
														if(blinkIndex == "0") {
															if(document.getElementById('spn_inbound')){
																document.getElementById('spn_inbound').style.visibility="hidden";
																document.getElementById("blink_index_input").value ="1";
																}
															}
															else {
																if(document.getElementById('spn_inbound')){
																	document.getElementById('spn_inbound').style.visibility="visible";
																	document.getElementById("blink_index_input").value ="0";
																}
															}
														},500);
													}
												    handleJson360ViewData(data,'windowDiv');
													QaddActivity4ContactWithActvt(actvtyId,userId,'','',contactId,dispName,qWindwPos);
													//if($("#viewPageTopMenuDiv table")) $("#viewPageTopMenuDiv table").hide();
													var msgDiv =document.getElementById("msg_div");
													msgDiv.innerHTML=message;
													var thisWindWidth=windowElem.offsetWidth;
													thisWindWidth=parseInt(thisWindWidth)/2;
													msgDiv.style.display = "block";
													var divWidth = msgDiv.offsetWidth;
													var div_half_Width = divWidth/2;
													var postLeft = thisWindWidth - div_half_Width;
													msgDiv.style.left = postLeft+"px";
													setTimeout("document.getElementById('msg_div').style.display='none'",30000);
												 },
												 onClose: function(wnd) { 
													if(intervalId) window.clearInterval(intervalId);
													windowContView = null;
													document.getElementById("pageContent").style.opacity="1";
												 },
												 afterMinimize: function(wnd) { // a callback function after window minimized
													isMinimize='1';
													document.getElementById("pageContent").style.opacity="1";
												 },
												/* afterMaximize: function(wnd) { // a callback function after window minimized
													isMinimize='0';
													document.getElementById("pageContent").style.opacity="1";
												 },*/
												 afterCascade: function(wnd) { // a callback function after window cascaded
													if(isMinimize == '1'){
													var windowObj=document.getElementById(wnd.getWindowId());
													windowObj.getElementsByClassName("window_title_text")[0].innerHTML=titleHTML;
													document.getElementById("title_text").innerHTML=pageTitle;
													document.getElementById("pageContent").style.opacity=".1";
												  }
												}
											});   /**** jquery window function ends *****/
								        }
										/************If contact does not exist for the phone number************/
										else 
										{
										 //var url2Hit="/atCRM/custom/JSON/list/contactView.htm?userEnt=All Contacts";
										 var usrPrefsMnuId=contMnuItemId;
										 var url="custom/JSON/list/container.htm?entityName=contacts";
										 var loadURL = "/atCRM/custom/JSON/homePage.html#subMenu?mnuId=mnuList_"+usrPrefsMnuId+"&url="+url;
										 window.location.href=loadURL;
                                         var dataTd = document.getElementsByClassName("dataPage")[0];
										 var windWidth = $(window).width();
                                         windWidth = windWidth/2;
                                         var infoDiv = document.getElementById("infoDiv");
										 infoDiv.innerHTML="";
                                         var infoDivHTML;
										 infoDivHTML = "<div style='display:block;font-size:11px;'><img title='Close' style='float:right;cursor:pointer;padding-right:3px;width: 15px;' src='/atCRM/images/JSON/close.jpg' onclick='closeDiv()'/><a title='Search contact' href='javascript:redirectPage(\"search\",\""+loadURL+"\",\""+usrPrefsMnuId+"\")' style='float:right;padding-right:26px;color:lightyellow;'>Serach contact</a><a href='javascript:redirectPage(\"invoice\")' style='float:right;padding-right:6px;color:lightyellow;' title='Add invoice'>Add invoice</a><a href='javascript:redirectPage(\"contact\")' style='float:right;padding-right:6px;color:lightyellow;' title='Add contact'>Add contact</a></div>";
                                         infoDivHTML += "<div style='display:inline-block;'>Calling number '"+phone_num+"' not found in primary phone, mobile phone, work phone, home phone, other phone, mailing phone and permanent phone.</div>";
										 infoDiv.innerHTML = infoDivHTML;
										 infoDiv.style.display = "block";
										 var divWidth = infoDiv.offsetWidth;
										 var div_half_Width = divWidth/2;
										 var postLeft = windWidth - div_half_Width;
										 infoDiv.style.left = postLeft+"px";
										 QaddAdd4Activity(actvtyId,userId,'','0');
										 setTimeout("document.getElementById('infoDiv').style.display='none'",20000);
                                                      //var qAddLeftSpace = windowWidth + 40;
													  // document.getElementById("window_1").style.left=qAddLeftSpace+"px";
												 // }
										 // });
											 //var mainDiv=document.getElementById("windowDiv");
											// mainDiv.innerHTML="<div id='errorDiv' style='width:100%;color:red;text-align:center;'>Contact detail not available.</div>";
										}
									  }
									});
						
					}         /*****Activity editAction success ends here*****/
				});           /*****Activity add function ends  ******/
		   });                /*****Socket function processCall ends here*********/
}

function closeDiv()
{
	var infoDIV = document.getElementById("infoDiv");
    infoDIV.style.display="none";
}
function redirectPage(type,loadURL,mnuItmId)
{
	if(type == "contact")
	{
		closeDiv();
		if(parent.windowData) parent.windowData.minimize();
		var addUrl = "/atCRM/custom/JSON/add/Contact.htm";
		getAddDataFrmCache(addUrl);
	}
	else if(type == "invoice")
	{
		closeDiv();
		var url2Hit=zcServletPrefix+"/custom/JSON/add/invoices.json?cont_driven=1";
		setUpPageParameters(url2Hit);
		if(parent.windowData) parent.windowData.minimize();
	}
	else
	{
		closeDiv();
		if(parent.windowData) parent.windowData.minimize();
		window.location.href=loadURL;
		if(document.getElementById(mnuItmId+"searchTxt")) document.getElementById(mnuItmId+"searchTxt").focus();
	}
}
function printObject (enttName,pkId) {
	var entt_id = '';
	var entt = enttName.replace('"','');
	for (var i = 0; i < g_curr_obj.curr_obj.length; i++) {
	  if (g_curr_obj.curr_obj[i].entity == entt) {
		entt_id = g_curr_obj.curr_obj[i].entt_id;
		break;
	  }
	}
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title: 'Available Templates',
		minHeight:100,
		minWidth:200,	
		width:500,
		closeOnEscape:true
	});
	var urlToHit = zcServletPrefix+'/custom/ki1/tmpltForObj.html?e=' + entt_id + '&i=' + pkId;
	$.ajax({
		type: "GET",
		url:urlToHit,
		success: function (tmplts)
		{
			document.getElementById('commonPopupDiv').innerHTML = tmplts;
		}
	});
	$(function() {
		$( "#xn_tmplt_list" ).selectable();
	});
}
function validateDate(elem)
{
	//alert(elem.id);
	//alert(document.getElementById("0-1-161_date_value").value);
	//alert(document.getElementById("0-1-161_time_value").value);
}
function pushCampaign(mktg_id)
{
	var evt_unq_str='mktg_'+mktg_id+'_'+Math.random();
	var postString='mktg_id='+mktg_id;
	var urlToHit = zcServletPrefix+'/custom/marketing/pushCampain2Ozonetel.html';
	$.ajax({
		url:urlToHit,
		type: "POST",
		data: postString,
		beforeSend: function() {
		  $('#loader_Img').show();
		},
		complete: function(){
			$('#loader_Img').hide();
		},
		success: function (data)
		{
			 var windWidth = $(window).width();
             windWidth = windWidth/2;
			 var infoDiv = document.getElementById("infoDiv");
			 infoDiv.innerHTML="";
             var infoDivHTML;
			 infoDivHTML = "<div style='display:block;font-size:11px;'>15 Contacts have been pushed to Ozonetel.</div>";
			 infoDiv.innerHTML = infoDivHTML;
			 $("#infoDiv").show();
			 var divWidth = infoDiv.offsetWidth;
			 var div_half_Width = divWidth/2;
			 var postLeft = windWidth - div_half_Width;
			 infoDiv.style.left = postLeft+"px";
		},
		error:function()
		{
			alert("Error");
		}
	});
}

