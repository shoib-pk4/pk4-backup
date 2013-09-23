function chooseCont()
{
	document.getElementById("textbx_contactcttxt").value=document.getElementById("pcrCont_FirstNametxt").value+" "+document.getElementById("pcrCont_LastName").value;
	document.getElementById("textbx_contactcttxt").className="clas_txt_key_in_chng";

	if(document.getElementById("pcrAcc_AccountId").value!='')
	{
		document.getElementById("pcrAcc_AccountId1txt").value=document.getElementById("pcrAcc_AccountIdtxt").value;
		document.getElementById("pcrAcc_AccountId1txt").className="clas_txt_key_in_chng";
	}
	else
	{
		document.getElementById("pcrAcc_AccountId1txt").value="Key in first two chars of Account.";
		document.getElementById("pcrAcc_AccountId1txt").className="clas_txt_key_in";
	}
	$('#contactContainer').dialog('close');
}

function afterSavedContact()
{
	document.getElementById('Contact_Part2_Save').innerHTML = "<a href='javascript:saveNewContact();'>Save</a></div>";
}

function showErrorDiv(txt,errDIV)
{
	document.getElementById(errDIV).innerHTML = txt;
	document.getElementById(errDIV).style.display = "block";
}

function removeError(obj)
{	
	document.getElementById(obj).innerHTML = "";
	document.getElementById(obj).style.display = "none";
}

function getAccounts(divName,txtId,L_event,val)
{
    key =  (window.event) ? window.event.keyCode : ((L_event) ? L_event.which : null);
	if(key==13)
	{
		return false;
	}
	else
	{
		if(val.length>=1)
		{
			L_SearchStr = val + String.fromCharCode(key);
			$.ajax(
			{
				type: "GET",
				async: false,
				url: zcServletPrefix+"/custom/advancedAdd/getMatchingAccounts.xml?str="+L_SearchStr,
				dataType: "xml",
				success: function (docCont)
				{
					var name= docCont.getElementsByTagName("name");
					var account_Id = docCont.getElementsByTagName("account_Id");
										
					var listcount=docCont.getElementsByTagName("listcount") ;
					var count=listcount[0]?listcount[0].getAttribute("count") : null;
					var names='';
										
					var contids='';
					var displaystring='';

					for(i=0;i<count;i++)
					{
						AccountName=name[i]?name[i].getAttribute("AccountName") : null;
						id=account_Id[i]?account_Id[i].getAttribute("id"): null;
						if(displaystring)
						{
							if(AccountName)
							{
								displaystring=displaystring+'~'+AccountName;
							}
							if(id)
							{
								displaystring=displaystring+'--'+id;
							}
						}
						else
						{
							if(AccountName)
							{
								displaystring=AccountName;
							}
							if(id)
							{
								displaystring=displaystring+'--'+id;
							}
												
						}
					 }
					
					var temp = new Array();
					temp = displaystring.split('~');
					new AutoSuggest(divName,document.getElementById(txtId),temp,'','no',100,122,4);
				}
			  });
		}
	}
}

function getAccounts1(divName,txtId,L_event,val)
{
   key =  (window.event) ? window.event.keyCode : ((L_event) ? L_event.which : null);
   if(key==13)
	{
		return false;
	}
	else
	{
		if(val.length>=1)
		{
			L_SearchStr = val + String.fromCharCode(key);
			$.ajax({
						type: "GET",
						async: false,
						url: zcServletPrefix+"/custom/advancedAdd/getMatchingAccounts.xml?str="+L_SearchStr,
						dataType: "xml",
						success: function (docCont)
						{
							var name= docCont.getElementsByTagName("name");
							var account_Id = docCont.getElementsByTagName("account_Id");
							var listcount=docCont.getElementsByTagName("listcount") ;
							var count=listcount[0]?listcount[0].getAttribute("count") : null;
							var names='';
							
							var contids='';
							var displaystring='';
							
							for(i=0;i<count;i++)
							{
								AccountName=name[i]?name[i].getAttribute("AccountName") : null;
								id=account_Id[i]?account_Id[i].getAttribute("id"): null;
								if(displaystring)
								{
									if(AccountName)
									{
										displaystring=displaystring+'~'+AccountName;
									}
									if(id)
									{
										displaystring=displaystring+'--'+id;
									}
											
								}
								else
								{
									if(AccountName)
									{
										displaystring=AccountName;
									}
									if(id)
									{
										displaystring=displaystring+'--'+id;
									}
								}
							}
							var temp = new Array();
							temp = displaystring.split('~');
							new AutoSuggest(divName,document.getElementById(txtId),temp,'','no',100,122,4);
						}
					 });
			}
	}
 }

function getAccounts2(divName,txtId,L_event,val)
{
	
	key =  (window.event) ? window.event.keyCode : ((L_event) ? L_event.which : null);
	if((document.getElementById("oppContainer").style.display!="none")||(document.getElementById("contactContainer").style.display!="none"))
	{
		if(key==13)
		{
			return false;
		}
		else
		{
			if(val.length>=1)
			{
				L_SearchStr = val + String.fromCharCode(key);
				$.ajax({
				type: "GET",
				async: false,
				url: zcServletPrefix+"/custom/advancedAdd/getMatchingAccounts.xml?str="+L_SearchStr,
				dataType: "xml",
				success: function (docCont)
					{
						var name= docCont.getElementsByTagName("name");
						var account_Id = docCont.getElementsByTagName("account_Id");
						var pri_city= docCont.getElementsByTagName("pri_city");
						var zipcode= docCont.getElementsByTagName("zipcode");
						var pri_phone= docCont.getElementsByTagName("pri_phone");
						var pri_addr_line1= docCont.getElementsByTagName("pri_addr_line1");
						var pri_addr_line2= docCont.getElementsByTagName("pri_addr_line2");
						var AccountType_id=docCont.getElementsByTagName("AccountType_id");
						var listcount=docCont.getElementsByTagName("listcount") ;
						var count=listcount[0]?listcount[0].getAttribute("count") : null;
						var names='';
						var contids='';
						var displaystring='';
						for(i=0;i<count;i++)
						{
							AccountName=name[i]?name[i].getAttribute("AccountName") : null;
							id=account_Id[i]?account_Id[i].getAttribute("id"): null;
							city=pri_city[i]?pri_city[i].getAttribute("city"): null;
							phoneno=pri_phone[i]?pri_phone[i].getAttribute("phoneno"): null;
							line1=pri_addr_line1[i]?pri_addr_line1[i].getAttribute("line1"): null;
							line2=pri_addr_line2[i]?pri_addr_line2[i].getAttribute("line2"): null;
							zip=zipcode[i]?zipcode[i].getAttribute("zip"): null;
							accType=AccountType_id[i]?AccountType_id[i].getAttribute("accType"): null;

							if(displaystring)
							{
								if(AccountName)
								{
									displaystring=displaystring+'~'+AccountName;
								}
								if(id)
								{
									displaystring=displaystring+'--'+id;
								}
							/*	if(city)
								{
									displaystring=displaystring+'(-)'+city;
								}
								if(phoneno)
								{
									displaystring=displaystring+'(-)'+phoneno;
								}
								if(line1)
								{
									displaystring=displaystring+'(-)'+line1;
								}
								if(line2)
								{
									displaystring=displaystring+'(-)'+line2;
								}
								if(zip)
								{
									displaystring=displaystring+'(-)'+zip;
								}
								if(accType)
								{
									displaystring=displaystring+'(-)'+accType;
								}
								*/
							}
							else
							{
								if(AccountName)
								{
									displaystring=AccountName;
								}
								if(id)
								{
									displaystring=displaystring+'--'+id;
								}
							/*	if(city)
								{
									displaystring=displaystring+'(-)'+city;
								}
								if(phoneno)
								{
									displaystring=displaystring+'(-)'+phoneno;
								}
								if(line1)
								{
									displaystring=displaystring+'(-)'+line1;
								}
								if(line2)
								{
									displaystring=displaystring+'(-)'+line2;
								}
								if(zip)
								{
									displaystring=displaystring+'(-)'+zip;
								}
								if(accType)
								{
									displaystring=displaystring+'(-)'+accType;
								}
								*/
							}
						}
						
						var temp = new Array();
						temp = displaystring.split('~');
						
						var tempid = new Array();
						tempid = displaystring.split('--');
						var tempcity = new Array();
						tempcity = displaystring.split('(-)');
						var tempPhone = new Array();
						tempPhone = displaystring.split('(?)');
						var tempLine1 = new Array();
						tempLine1 = displaystring.split('(^)');
						var tempLine2 = new Array();
						tempLine2 = displaystring.split('(/)');
						var tempzip = new Array();
						tempzip = displaystring.split('(\)');
						new AutoSuggest(divName,document.getElementById(txtId),temp,'','no',100,122,4);
					}
				});
			}
		}
	}
}


function getAccounts4Plan1(divName,id,L_event) 
{	
	key =  (window.event) ? window.event.keyCode : ((L_event) ? L_event.which : null);
	if(key==13)
	{
		return false;
	}
	else if (document.getElementById(id).value.length >= 3)
	{
	   var temp = new Array();
	   temp=id.split('txt');

	   //Set account id field to null
	   document.getElementById(temp[0]).value="";

	   var urlGetAccountList=zcServletPrefix+"/custom/Inventory/getMatchingAccountsByType.xml";
	   var urlGetAccountListData="str="+document.getElementById(id).value;

	   $.ajax({
	   type: "GET",
	   url: urlGetAccountList,
	   data: urlGetAccountListData,
	   dataType: "xml",
	   async: false,
	   success: function (docAcc){
			var primaryAccountInfo= docAcc.getElementsByTagName("Account_NameId");
			var primaryAccountInformation=primaryAccountInfo[0]?primaryAccountInfo[0].getAttribute("AccountNameId") : null;
			var temp = new Array();
			if(primaryAccountInformation)
			{
				temp = primaryAccountInformation.split('~)');
			}
			new AutoSuggest(divName,document.getElementById(id),temp); 
			}

		});
	}
}

function toggleLabelDisplay(displayTxt,elem,isDisplay)
{
	if (isDisplay == '1')
	{
		if (elem.value=="")
		{
			elem.value = displayTxt;
			SetClass(elem,"thinColorClass");
		}
	}
	else
	{
		if (elem.value==displayTxt)
		{
			elem.value = "";
			SetClass(elem,"thickColorClass");
		}
	}

}

function toggleLabelDisplay1(displayTxt,elem,isDisplay)
{
	if (isDisplay == '1')
	{
		if (elem.value=="")
		{
			elem.value = displayTxt;
			SetClass(elem,"thinColorClass_mdt");
		}
	}
	else
	{
		if (elem.value==displayTxt)
		{
			elem.value = "";
			SetClass(elem,"thickColorClass");
		}
	}

}

function toggleLabelDisplay1Green(displayTxt,elem,isDisplay)
{
	if (isDisplay == '1')
	{
		if (elem.value=="")
		{
			elem.value = displayTxt;
			SetClass(elem,"thinColorClassGreen");
		}
	}
	else
	{
		if (elem.value==displayTxt)
		{
			elem.value = "";
			SetClass(elem,"thickColorClass");
		}
	}

}

function toggleLabelDisplay1Greenmob(displayTxt,elem,isDisplay,id,val)
{
	if (isDisplay == '1')
	{
		if (elem.value=="")
		{
			elem.value = displayTxt;
			SetClass(elem,"thinColorClassGreen");
		}
	}
	else
	{
		if (elem.value==displayTxt)
		{
			elem.value = "";
			SetClass(elem,"thickColorClass");
		}
	}
}

function toggleLabelDisplay2(displayTxt,elem,isDisplay)
{
	if (isDisplay == '1')
	{
		if (elem.value=="")
		{
			elem.value = displayTxt;
			document.getElementById("pcrAcc_AccountId1").value = "";
			SetClass(elem,"clas_txt_key_in");
		}
	}
	else
	{
		if (elem.value==displayTxt)
		{
			elem.value = "";
			SetClass(elem,"clas_txt_key_in_chng");
		}
	}
} 

function toggleLabelDisplay2Grey(displayTxt,elem,isDisplay)
{
	if (isDisplay == '1')
	{
		if (elem.value=="")
		{
			elem.value = displayTxt;
			SetClass(elem,"clas_txt__wide_key_in");
		}
	}
	else
	{
		if (elem.value==displayTxt)
		{
			elem.value = "";
			SetClass(elem,"clas_txt_key_in_chng");
		}
	}

}

function writeAccSuggestTxt()
{
	var e = (window.event) ? event : this;
	
	var AccountTexBoxtDiv = document.getElementById("AccountTexBoxtDiv");
	AccountTexBoxtDiv.style.display = "none";
	var AccountSuggestDiv = document.getElementById("AccountSuggestDiv");
	AccountSuggestDiv.style.display = "block";
}

function getContacts(divName,id,L_event,val)
{
    key=(window.event) ? window.event.keyCode : ((L_event) ? L_event.which : null);
	if(document.getElementById(id).value.length>=1)
	{
		if(key==13)
		{
			return false;
		}
		else
		{      
			L_SearchStr = val + String.fromCharCode(key);			
			accounId=document.getElementById("pcrAcc_AccountId1").value;
			if(accounId)
			{
				var url2hit=zcServletPrefix+"/custom/advancedAdd/getMatchingContacts.xml?str="+L_SearchStr +"&acctId="+accounId;
			}
			else
			{
				url2hit=zcServletPrefix+"/custom/advancedAdd/getMatchingContacts.xml?str="+L_SearchStr;
			}
			{
               //contactAjax
			   	$.ajax({
				type: "GET",
				url:url2hit,
				async: false,
				dataType: "xml",
				success: function (docCont){
					var cont_displayName= docCont.getElementsByTagName("cont_displayName");
					var acct_name= docCont.getElementsByTagName("acct_name");
					var accID= docCont.getElementsByTagName("acct_id");
					var cont_id = docCont.getElementsByTagName("cont_id");
					var listcount=docCont.getElementsByTagName("listcount") ;
					var count=listcount[0]?listcount[0].getAttribute("count") : null;
					var names='';
					var accName='';
				    var contids='';
					var accntId='';
					var displaystring='';

					for(i=0;i<count;i++)
					{
					names=cont_displayName[i]?cont_displayName[i].getAttribute("displayName") : null;
					contids=cont_id[i]?cont_id[i].getAttribute("id"): null;
					accName=acct_name[i]?acct_name[i].getAttribute("accountName"): null;
					accntId=accID[i]?accID[i].getAttribute("accountId"):null;

					if(displaystring)
					{
						if(names)
						{
						
							displaystring=displaystring+'~'+names;
						}
						if(contids)
						{
							displaystring=displaystring+'--'+contids;
						}
						if(accName)
						{
						displaystring=displaystring+'::'+accName;
						}
						if(accntId)
						{
						displaystring=displaystring+'::'+accntId;
						}
						
					}
					else
					{
						if(names)
						{
						
							displaystring=names;
						}
						if(contids)
						{
							displaystring=displaystring+'--'+contids;
						}
						if(accName)
						{
						displaystring=displaystring+'::'+accName;
						}
						if(accntId)
						{
						displaystring=displaystring+'::'+accntId;
						}
						
					}
					}
					var temp = new Array();
					temp = displaystring.split('~');
					var temp1=new Array();
					var accN=temp[1];
					var accID=temp[2];
					new AutoSuggest(divName,document.getElementById(id),temp,'',L_SearchStr,100,122,4);
				}

			});
		    }
		}
	}
}

function hideAutoSuggDiv()
{
	document.getElementById("autosuggestUsers").style.display="none";
}

function changeCol()
{
	document.getElementById("0-1-12__date").style.color="black";
}

var is_load=0;
 function showHideDiv(appType,varTitle,varWidth,pos,vURL,actvtID,contID,eml_obj,ssElem,dispNameForCalCent,qWindwPos)
 {
	 varDiv="quickAddPopupDiv";
	//document.getElementById("oppIdForAcct").value="";
	L_mainDiv = document.getElementById("mainContentDiv");
	L_mainDiv.innerHTML="";
	varWidth='450px';
	
	if(vURL)
	{
		var L_URL = vURL;
	}
	L_title = "";
	if(varTitle)
	{
		L_title = varTitle;
	}
	if(varDiv)
	{
		L_varDiv ="#"+ varDiv;
	}
	
	if(pos == "top" || pos == "center")
	{
		L_position=pos;
	}
	else
	{
		L_position=pos;
		L_position=eval(L_position);
	}
	 
	if(appType == "OPP")
	{
	   //setOppDefault();
	var V_oppContainer=document.getElementById("quickAddPopupDiv");
	V_oppContainer.innerHTML="";

	V_oppContainer.style.display='none';
	L_QAOpp  = CreateDIV(V_oppContainer , "headingClass","quickAddOpp", "Quick Add Opportunity" );
	L_QAOpp.style.display='none';
	L_QAOppX  = CreateDIV(L_QAOpp, "cls_close_divX","QAOppX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancellead()'><b>X</b></a>" );

	L_zc__errorDivOpp = CreateSPAN(V_oppContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivOpp.style.position = 'relative';
	L_zc__errorDivOpp.style.width = '280px';
	L_zc__errorDivOpp.style.marginLeft = '10px';
	if(!vURL)
	{
		//customized by govardhan for email client purpose
		if(actvtID != "" && contID != "")
		{
			vURL="/atCRM/custom/JSON/add/Opportunity.htm?prefsName=emailquickAddOpportunityPrefs&Contact_id="+contID+"&actvt_id="+actvtID+"&reqFrom=Email";
		}
		else
		{
			vURL="/atCRM/custom/JSON/add/Opportunity.htm?prefsName=quickAddOpportunityPrefs&qA=1";
		}
	}
	handleQuickAddPopup(V_oppContainer,L_zc__errorDivOpp,vURL,'',actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	}
	else if(appType == "CONCT")
	{
		//setContactDefault();
	var V_contContainer=document.getElementById("quickAddPopupDiv");
	V_contContainer.innerHTML="";

	V_contContainer.style.display='none';
	L_QACont  = CreateDIV(V_contContainer , "headingClass","quickAddCont", "Quick Add Contact" );
	L_QACont.style.display='none';
	L_QAContX  = CreateDIV(L_QACont, "cls_close_divX","QAContX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancellead()'><b>X</b></a>" );

	L_zc__errorDivCont = CreateSPAN(V_contContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivCont.style.position = 'relative';
	L_zc__errorDivCont.style.width = '280px';
	L_zc__errorDivCont.style.marginLeft = '10px';
	if(!vURL)
	{
		//customized by govardhan for email client purpose
		if(actvtID != "" && contID == "")
		{
			vURL="/atCRM/custom/JSON/add/Contact.htm?prefsName=emailquickAddContactPrefs&actvt_id="+actvtID+"&reqFrom=Email&qA=1";
		}
		else
		{
			vURL="/atCRM/custom/JSON/add/Contact.htm?prefsName=quickAddContactPrefs&qA=1&objId=480563";
		}
	}
	handleQuickAddPopup(V_contContainer,L_zc__errorDivCont,vURL,'',actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	}
	else if(appType == "ACCT")
	 {
			//setAccDefault();
	
	var V_acctContainer=document.getElementById("quickAddPopupDiv");
	V_acctContainer.innerHTML="";

	V_acctContainer.style.display='none';
	L_QAAcct  = CreateDIV(V_acctContainer , "headingClass","quickAddAcct", "Quick Add Account" );
	L_QAAcct.style.display='none';
	L_QAAcctX  = CreateDIV(L_QAAcct, "cls_close_divX","QAAcctX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancellead()'><b>X</b></a>" );

	L_zc__errorDivAcct = CreateSPAN(V_acctContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivAcct.style.position = 'relative';
	L_zc__errorDivAcct.style.width = '280px';
	L_zc__errorDivAcct.style.marginLeft = '10px';
	if(!vURL)
	vURL="/atCRM/custom/JSON/add/Account.htm?prefsName=quickAddAccountPrefs&qA=1";
	handleQuickAddPopup(V_acctContainer,L_zc__errorDivAcct,vURL,'','','','',ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	 }
	else if(appType == "LEAD")
	 {
			//setLeadDefault();
	var V_leadContainer=document.getElementById("quickAddPopupDiv");
	V_leadContainer.innerHTML="";

	V_leadContainer.style.display='none';
	L_QAlead  = CreateDIV(V_leadContainer , "headingClass","quickAddlead", "Quick Add leadortunity" );
	L_QAlead.style.display='none';
	L_QAleadX  = CreateDIV(L_QAlead, "cls_close_divX","QAleadX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancellead()'><b>X</b></a>" );

	L_zc__errorDivlead = CreateSPAN(V_leadContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivlead.style.position = 'relative';
	L_zc__errorDivlead.style.width = '280px';
	L_zc__errorDivlead.style.marginLeft = '10px';
	if(!vURL)
	{
		//customized by govardhan for email client purpose
		if(actvtID != "" && contID != "")
		{
			vURL="/atCRM/custom/JSON/add/Lead.htm?prefsName=emailquickAddLeadPrefs&Contact_Id="+contID+"&actvt_id="+actvtID+"&reqFrom=Email";
		}
		else
		{
			vURL="/atCRM/custom/JSON/add/Lead.htm?prefsName=quickAddLeadPrefs";
		}
	}
	//url2hit="/atCRM/custom/JSON/add/Lead.htm?prefsName=quickAddLeadPrefs";
	handleQuickAddPopup(V_leadContainer,L_zc__errorDivlead,vURL,'',actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	 }
	 else if (appType == "APTMT")
	 {
	var V_activeContainer=document.getElementById("quickAddPopupDiv");
	V_activeContainer.innerHTML="";
	
	V_activeContainer.style.display='none';
	L_QActivity  = CreateDIV(V_activeContainer , "headingClass","quickAddActivity", "L_title" );
	L_QActivity.style.display='none';
	L_QActivityX  = CreateDIV(L_QActivity, "cls_close_divX","QActivityX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancelAct()'><b>X</b></a>" );
	L_QActivityX.style.width = '450px';
	L_QActivityX.style.height = '500px';
	L_zc__errorDivAct = CreateSPAN(V_activeContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivAct.style.position = 'relative';
	L_zc__errorDivAct.style.width = '280px';
	L_zc__errorDivAct.style.marginLeft = '10px';	
	if(!vURL)
	vURL="/atCRM/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0";
	handleQuickAddPopup(V_activeContainer,L_zc__errorDivAct,vURL,'','','','',ssElem,appType,varDiv,L_title,L_varDiv,varWidth,dispNameForCalCent,qWindwPos);
	}
	else if (appType == "TSK")
	 {
	var V_activeContainer=document.getElementById("quickAddPopupDiv");
	V_activeContainer.innerHTML="";

	V_activeContainer.style.display='none';
	L_QActivity  = CreateDIV(V_activeContainer , "headingClass","quickAddActivity", "L_title" );
	L_QActivity.style.display='none';
	L_QActivityX  = CreateDIV(L_QActivity, "cls_close_divX","QActivityX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancelAct()'><b>X</b></a>" );

	L_zc__errorDivAct = CreateSPAN(V_activeContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivAct.style.position = 'relative';
	L_zc__errorDivAct.style.width = '280px';
	L_zc__errorDivAct.style.marginLeft = '10px';	
	if(!vURL)
	vURL="/atCRM/custom/JSON/add/Activity.htm?is_Appointment=0&is_DetailedAdd=0";
	handleQuickAddPopup(V_activeContainer,L_zc__errorDivAct,vURL,'','','','',ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	}
	else if (appType == "TKT")
	 {
		 //customized by govardhan for email client purpose (added new quickadd for ticket)
	var V_ticketContainer=document.getElementById("quickAddPopupDiv");
	V_ticketContainer.innerHTML="";

	V_ticketContainer.style.display='none';
	L_QTicket  = CreateDIV(V_ticketContainer , "headingClass","quickAddTicket", "L_title" );
	L_QTicket.style.display='none';
	L_QTicketX  = CreateDIV(L_QTicket, "cls_close_divX","QTicketX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancelAct()'><b>X</b></a>" );

	L_zc__errorDivTkt = CreateSPAN(V_ticketContainer, "errorDiv", "errorDivQuickAdd", "", "", "");
	L_zc__errorDivTkt.style.position = 'relative';
	L_zc__errorDivTkt.style.width = '280px';
	L_zc__errorDivTkt.style.marginLeft = '10px';	
	if(!vURL)
	{
		if(actvtID != "" && contID != "")
		{
			vURL="/atCRM/custom/JSON/add/ticket.htm?prefsName=emailaddTicketJson&Contact_id="+contID+"&actvt_id="+actvtID+"&reqFrom=Email";
		}
		else
		{
			vURL="/atCRM/custom/JSON/add/ticket.htm";
		}
	}	
	handleQuickAddPopup(V_ticketContainer,L_zc__errorDivTkt,vURL,'',actvtID,contID,eml_obj,ssElem,appType,varDiv,L_title,L_varDiv,varWidth);
	}

/*	if($('#'+varDiv).dialog('open')==true)
	{
		$('#'+varDiv).dialog('close');
		$('#'+varDiv).dialog('destroy');
	}

		$('#'+varDiv).dialog({
		autoOpen:true,
		stack:true,
		title:L_title,
		modal: false,
		//position:L_position,
		width:varWidth,*/
	//	beforeclose: function() {/*dilogB4Close();*/},
	/*	close: function() { chngPos(L_varDiv);},
		});
		$('#'+varDiv).dialog('open');
		document.getElementById(varDiv).style.minHeight="250px";
		if(is_load==0){
		   $("#"+varDiv).parent().find('.ui-dialog-titlebar').append("<img id='layout_img' src='/atCRM/images/JSON/layout.png' title='Change page layout'/>");
			is_load=1;
			var layoutImg=document.getElementById("layout_img");
			layoutImg.style.position="absolute";
			layoutImg.style.left="404px";
			layoutImg.style.marginTop="1px";
			layoutImg.style.cursor="pointer";
		}*/
 }

function chngPos(varDiv)
{
	 //BULID THIS VVIP
	/*var reloadUrl=top.frames[0].frames[1].location.href;
	top.frames[0].frames[1].location.href=reloadUrl;*/
}

/*Functions called when clicked on the new Link */
function loadAddConAcc(posVal)
{
	
	if (posVal == 3)
	{
       document.getElementById("pcrAcc_AccountIdtxt").style.display="block";   
	}
	else
	{
       document.getElementById("pcrAcc_AccountIdtxt").style.display="block";  
	}

	if(posVal == 1)
	{
		var x = parseInt($("#oppContainer").offset().left)+5; 
		var y = parseInt($("#oppContainer").offset().top)-2; 
		showHideDiv("contactContainer","Quick Add Contact","",'['+x+','+y+']');
	}
	else if (posVal == 3)
	{
		var x = parseInt($("#oppContainer").offset().left)+5; 
		var y = parseInt($("#oppContainer").offset().top)-2; 
		showHideDiv("contactContainer","Quick Add Contact","",'['+x+','+y+']');
	}
	else
	{
		var x = parseInt($("#oppContainer").offset().left)+5; 
		var y = parseInt($("#oppContainer").offset().top)-2; 
		showHideDiv("accountcontainerDiv","Quick Add Account","",'['+x+','+y+']');
	}
}

function loadAcc()
{
	var x = parseInt($("#contactContainer").offset().left)+5; 
	var y = parseInt($("#contactContainer").offset().top)-2; 
	showHideDiv("accountcontainerDiv","Quick Add Account","",'['+x+','+y+']');
}


function dilogB4Close()
{
	document.getElementById("zc__errorDivAct").style.innerHTML ='';
	document.getElementById("zc__errorDivOpp").style.innerHTML ='';
	document.getElementById("zc__errorDivCont").style.innerHTML ='';
	document.getElementById("zc__errorDivAcc").style.innerHTML ='';

	document.getElementById("zc__errorDivAct").style.display='none';
	document.getElementById("zc__errorDivOpp").style.display='none';
	document.getElementById("zc__errorDivCont").style.display='none';
	document.getElementById("zc__errorDivAcc").style.display='none';
}

/*Functions called when clicked on the new Link */
// ~~~~~~~~~~ FUCTION TO LOAD THE CREATE ACCOUNT SCREEN STARTS HERE ~~~~~~~~~~~
 function loadAddAccScreen()
 {
	L_mainDiv = document.getElementById("mainContentDiv");
	if(document.getElementById("accountcontainerDiv"))
	{
	   document.getElementById("accountcontainerDiv").style.display='block';
	   return;
	}
	L_accountcontainerDiv  = CreateDIV(L_mainDiv , "","accountcontainerDiv", "" );
	L_accountcontainerDiv.style.display='none';
	L_QAAcc  = CreateDIV(L_accountcontainerDiv , "headingClass","QAAcc", "Quick Add Account" );
	L_QAAcc.style.display='none';
	L_QAAccX  = CreateDIV(L_QAAcc, "cls_close_divX","QAAccX", "<a title='Close' class=cls_close_anchor  href='javascript:cancelAccount()'>X</a>" );

	L_spn_zc__errorDivAcc = CreateSPAN(L_accountcontainerDiv, "errorDiv", "zc__errorDivAcc", "", "", "");
	L_spn_zc__errorDivAcc.setAttribute("style","position:relative;margin-top:5px;margin-left:10px;");
	L_spn_zc__errorDivAcc.style.width = '280px';
	L_spn_zc__errorDivAcc.style.marginLeft = '10px';
	
	L_qaAcctextboxes  = CreateDIV(L_accountcontainerDiv , "","qaAcctextboxes", "" );
	
	L_table_1  = CreateTable(L_qaAcctextboxes,"default","table_1","","","1", "");
	L_table_1.style.marginLeft='10px';
	L_table_1.style.marginTop='3px';
	L_table_1.border='0';

	L_tbody_1  = CreateBody(L_table_1,"","tbody_1" );

	//-----------DUMMY ROW STARTS HERE ------------------
	L_tr_dummy  = CreateTR(L_tbody_1,"","");
	L_td_dummy  = CreateTD(L_tr_dummy ,"" ,"" ,"","","","");
	L_td_dummy.colSpan = '4' ;
	L_td_dummy.align = 'right';
	L_txt_dummy = CreateSelectBox(L_td_dummy, "", "", "","");
	L_txt_dummy.style.border='1px';
	L_txt_dummy.style.width='1px';
	L_txt_dummy.style.height='1px';
	L_txt_dummy.style.fontSize='1px';
	//-----------DUMMY ROW ENDS HERE ------------------

	//-----------ROW 1 STARTS HERE ------------------
	L_tr_1_1  = CreateTR(L_tbody_1,"","tr_1_1");
	L_tr_1_1.valign="top";
	L_td_1_1_1  = CreateTD(L_tr_1_1,"","td_1_1_1" ,"","Left","","");
	L_td_1_1_1.colSpan='4';
	L_td_1_1_1.vAlign='top';

	L_txt_box1  = CreateTEXTBOX(L_td_1_1_1 , "thinColorClass_mdt" ,"pcrAcc_NewAccountIdtxt","Key in Account name","100" );
	L_txt_box1.style.width = '90%';
	L_txt_box1.title="Key in Account name";
	AddFocusEventListener(L_txt_box1, function (){toggleLabelDisplay('Key in Account name',L_txt_box1,'0') });
	AddBlurEventListener(L_txt_box1,  function (){toggleLabelDisplay1('Key in Account name',L_txt_box1,'1') });
	//AddOnKeyPressEventListener(L_txt_box1,  function (event){getAccounts2('autosuggestUsers',L_txt_box1.id,event,L_txt_box1.value) });
	CreateHIDDEN(L_td_1_1_1 , "", "pcrAcc_NewAccountId" ,""  );
	//-----------ROW 1 ENDS HERE ------------------
	//-----------ROW 2 STARTS HERE ------------------
	L_tr_1_2  = CreateTR(L_tbody_1,"","tr_1_2");
	L_tr_1_2.valign="top";
	
	L_td_1_2_1  = CreateTD(L_tr_1_2,"" ,"td_1_2_1" ,"","Left","","");
	L_txt_box2  = CreateTEXTBOX(L_td_1_2_1, "thinColorClass" ,"pcrAcc_Line1","Line1","200" );
	L_txt_box2.title="Address Line1";
	AddFocusEventListener(L_txt_box2, function (){toggleLabelDisplay('Line1',L_txt_box2,'0') });
	AddBlurEventListener(L_txt_box2,  function (){toggleLabelDisplay('Line1',L_txt_box2,'1') });
	
	L_td_1_2_2  = CreateTD(L_tr_1_2,"" ,"td_1_2_2" ,"","Left","","");

	L_td_1_2_3  = CreateTD(L_tr_1_2,"" ,"td_1_2_3" ,"","Left","","");
	L_txt_box3  = CreateTEXTBOX(L_td_1_2_3, "thinColorClass" ,"pcrAcc_Line2","Line2","200" );
	L_txt_box3.title="Address Line2";
	AddFocusEventListener(L_txt_box3, function (){toggleLabelDisplay('Line2',L_txt_box3,'0') });
	AddBlurEventListener(L_txt_box3,  function (){toggleLabelDisplay('Line2',L_txt_box3,'1') });
	L_td_1_2_2  = CreateTD(L_tr_1_2,"" ,"td_1_2_2" ,"","Left","","");

	//-----------ROW 2 ENDS HERE ------------------
	//-----------ROW 3 STARTS  HERE ------------------
	L_tr_1_3  = CreateTR(L_tbody_1,"","tr_1_3");
	L_tr_1_3.valign="top";
	
	L_td_1_3_1  = CreateTD(L_tr_1_3,"" ,"td_1_3_1" ,"","Left","","");
	L_txt_box4  = CreateTEXTBOX(L_td_1_3_1, "thinColorClass" ,"pcrAcc_City","City","200" );
	L_txt_box4.title="City";
	AddFocusEventListener(L_txt_box4, function (){toggleLabelDisplay('City',L_txt_box4,'0') });
	AddBlurEventListener(L_txt_box4,  function (){toggleLabelDisplay('City',L_txt_box4,'1') });
	
	L_td_1_3_2  = CreateTD(L_tr_1_3,"" ,"td_1_3_2" ,"","Left","","");
	
	
	L_td_1_3_3  = CreateTD(L_tr_1_3,"" ,"td_1_3_3" ,"","Left","","");
	L_txt_box5  = CreateTEXTBOX(L_td_1_3_3, "thinColorClass" ,"pcrAcc_Pin","Pin","200" );
	L_txt_box5.title="Pin";
	AddFocusEventListener(L_txt_box5, function (){toggleLabelDisplay('Pin',L_txt_box5,'0') });
	AddBlurEventListener(L_txt_box5,  function (){toggleLabelDisplay('Pin',L_txt_box5,'1') });
	L_td_1_3_2  = CreateTD(L_tr_1_3,"" ,"td_1_2_2" ,"","Left","","");

	//-----------ROW 3 ENDS HERE ------------------
	//-----------ROW 4 STARTS  HERE ------------------
	L_tr_1_4  = CreateTR(L_tbody_1,"","tr_1_4");
	L_tr_1_4.valign="top";
	
	L_td_1_4_1  = CreateTD(L_tr_1_4,"" ,"td_1_4_1" ,"","Left","","");
	L_txt_box6  = CreateTEXTBOX(L_td_1_4_1, "thinColorClass" ,"pcrAcc_Phone","Phone","200" );
	L_txt_box6.title="Phone";
	AddFocusEventListener(L_txt_box6,function (){toggleLabelDisplay('Phone',L_txt_box6,'0') });
	AddBlurEventListener(L_txt_box6,function (){toggleLabelDisplay('Phone',L_txt_box6,'1') });
	
	L_td_1_4_2  = CreateTD(L_tr_1_4,"" ,"td_1_4_2" ,"","Left","","");
	
	L_td_1_4_2  = CreateTD(L_tr_1_4,"" ,"td_1_4_3" ,"","Left","","");
	L_td_1_4_2.cloSpan = '2';
	L_cmb_box1 =   CreateSelectBox(L_td_1_4_2, "normalInputFieldClass", "pcrAcc_AccountType", "","");
	L_cmb_box1.title = 'Account Type';
	L_cmb_box1.length=1;
	L_cmb_box1.options[0].value = "0";
	L_cmb_box1.options[0].text = "<Account Type>";
	L_cmb_box1.options[0].className ="thinColorClass";
	L_cmb_box1.style.width='135px';


	Account_Part1_cancel = CreateDIV(L_td_1_4_2 , "","Account_Part1_cancel", "<a href='javascript:cancelAccount();'>Cancel</a>" );
	Account_Part1_cancel.style.display='none';
	Account_Part1_cancel.style.border='0px solid red';
	//-----------ROW 4 ENDS HERE ------------------

	L_saveCancel  = CreateDIV(L_qaAcctextboxes , "","saveCancel", "" );
	L_Account_SaveTbl = CreateTable(L_saveCancel,"","","","","0", "");
	L_Account_SaveTbl.align='right';
	L_Account_SaveTbl.border=0;
	L_Account_SaveTbl.width='35%';
	L_Account_SaveTbl_tbody  = CreateBody(L_Account_SaveTbl ,"","" );
	L_Account_SaveTbl_tr_1  = CreateTR(L_Account_SaveTbl_tbody ,"","");

	L_Account_SaveTbl_td_1_1  = CreateTD(L_Account_SaveTbl_tr_1 ,"" ,"" ,"","","","");
	L_Account_SaveTbl_td_1_1.width='100%'
	L_Account_Save=CreateDIV(L_Account_SaveTbl_td_1_1 , "","Account_Save", "" );
	L_Account_Save.style.cssFloat='right';
	L_button_2 = CreateButton(L_Account_Save, "greenButton" , "accButton" , "Save") ;
	AddClickEventListener(L_button_2, function (){saveNewAccount()});
	
	L_Account_Choose=CreateDIV(L_Account_SaveTbl_td_1_1, "","Account_choose", "" );
	L_but_acc_choose = CreateButton(L_Account_Choose , "greenButton" , "Account_choose" , "Choose") ;
	L_but_acc_choose.style.width='40%';
	AddClickEventListener(L_but_acc_choose, function (){chooseAccount()});
	document.getElementById("Account_choose").style.display='none';
 }
// ~~~~~~~~~~ FUCTION TO LOAD THE CREATE ACCOUNT SCREEN  ENDS HERE ~~~~~~~~~~~

// ~~~~~~~~~~ FUCTION TO LOAD THE CREATE CONTACT SCREEN  STARTS HERE ~~~~~~~~~~~
function loadAddConScreen()
 {
	L_mainDiv = document.getElementById("mainContentDiv");
	if(document.getElementById("contactContainer"))
	{
	   document.getElementById("contactContainer").style.display='block';
	   return;
	}
	L_contactContainer  = CreateDIV(L_mainDiv , "","contactContainer", "" );
	L_contactContainer.style.display='none';
	L_contactContainer.style.marginTop='0px';
	L_QACon=CreateDIV(L_contactContainer , "headingClass","QACon", "Quick Add Contact" );
	L_QACon.style.display='none';
	L_QAConX  = CreateDIV(L_QACon, "cls_close_divX","QAAccX", "<a title='Close' class=cls_close_anchor  href='javascript:cancelAccount()'>X</a>" );

	L_zc__errorDivCont = CreateSPAN(L_contactContainer, "errorDiv", "zc__errorDivCont", "", "", "");
	L_zc__errorDivCont.setAttribute("style","position:relative;margin-top:5px;margin-left:10px;");
	L_zc__errorDivCont.style.width = '280px';
	L_zc__errorDivCont.style.marginLeft = '10px';

	L_contactTextBox  = CreateDIV(L_contactContainer , "","contactTextBox", "" );
	
	L_table_2 = CreateTable(L_contactTextBox,"default","table_2","","","1", "");
	L_table_2.style.width='90%';
	L_table_2.style.marginLeft='10px';
	L_table_2.style.marginTop='3px';
	L_table_2.border='0';

	L_tbody_2  = CreateBody(L_table_2,"","tbody_2" );

	//-----------DUMMY ROW STARTS HERE ------------------
	L_tr_dummy  = CreateTR(L_tbody_2,"","");
	L_tr_dummy.style.height='0px';
	L_td_dummy  = CreateTD(L_tr_dummy ,"" ,"" ,"","","","");
	L_td_dummy.style.height='0px';
	L_td_dummy.align='right';
	L_td_dummy.colSpan = '4' ;
	L_txt_dummy = CreateSelectBox(L_td_dummy, "", "", "","");
	L_txt_dummy.style.border='1px';
	L_txt_dummy.style.width='1px';
	L_txt_dummy.style.height='1px';
	L_txt_dummy.style.fontSize='1px';
	//-----------DUMMY ROW ENDS HERE ------------------

	//-----------ROW 1 STARTS HERE ------------------
	L_tr_2_1  = CreateTR(L_tbody_2,"","tr_2_1");
	L_tr_2_1.valign="top";
	
	L_td_2_1_1  = CreateTD(L_tr_2_1,"" ,"td_2_1_1" ,"","Left","","");
	L_txt_box7  = CreateTEXTBOX(L_td_2_1_1, "thinColorClass_mdt" ,"pcrCont_FirstNametxt","First name","50" );
	L_txt_box7.title="First name";
	L_txt_box7.style.width='100%'

	AddOnKeyPressEventListener(L_txt_box7,function(event){getContactsforopp('autosuggestUsers',L_txt_box7.id,event,L_txt_box7.value) });
	AddFocusEventListener(L_txt_box7, function (){toggleLabelDisplay('First name',L_txt_box7,'0') });
	AddBlurEventListener(L_txt_box7,  function (){toggleLabelDisplay1('First name',L_txt_box7,'1') });
	CreateHIDDEN(L_td_2_1_1, "", "pcrCont_FirstName" ,""  );

	L_td_2_1_2  = CreateTD(L_tr_2_1,"" ,"td_2_1_2" ,"","Left","","");

	L_td_2_1_3  = CreateTD(L_tr_2_1,"" ,"td_2_1_3" ,"","Left","","");
	L_txt_box8  = CreateTEXTBOX(L_td_2_1_3, "thinColorClass" ,"pcrCont_LastName","Last name","50" );
	L_txt_box8.title="Last name";
	L_txt_box8.style.width='100%'

	AddFocusEventListener(L_txt_box8, function (){toggleLabelDisplay('Last name',L_txt_box8,'0') });
	AddBlurEventListener(L_txt_box8,  function (){toggleLabelDisplay('Last name',L_txt_box8,'1') });
//-----------ROW 1 ENDS HERE ------------------

//-----------ROW 2 STARTS HERE ------------------
	L_tr_2_2  = CreateTR(L_tbody_2,"","tr_2_1");
	L_tr_2_2.valign="top";
	
	L_td_2_2_1  = CreateTD(L_tr_2_2,"" ,"td_2_2_1" ,"","Left","","");
	L_txt_box9  = CreateTEXTBOX(L_td_2_2_1, "thinColorClassGreen" ,"pcrCont_Email","Email","50" );
	L_txt_box9.title="Email";
	L_txt_box9.style.width='100%';

	AddFocusEventListener(L_txt_box9, function (){toggleLabelDisplay('Email',L_txt_box9,0)});
	AddBlurEventListener(L_txt_box9,  function (){toggleLabelDisplay1Green('Email',L_txt_box9,1);emailValid(L_txt_box9.value) });
	
	L_td_2_2_2  = CreateTD(L_tr_2_2,"" ,"td_2_2_2" ,"","Left","","");

	L_td_2_2_3  = CreateTD(L_tr_2_2,"" ,"td_2_2_3" ,"","Left","","");
	L_txt_box10  = CreateTEXTBOX(L_td_2_2_3, "thinColorClassGreen" ,"pcrCont_MobilePhone","Mobile phone","13" );
	L_txt_box10.title="Mobile phone";
	L_txt_box10.style.width='100%'

	AddFocusEventListener(L_txt_box10, function (){toggleLabelDisplay('Mobile phone',L_txt_box10,'0') });
	AddBlurEventListener(L_txt_box10,  function (){toggleLabelDisplay1Greenmob('Mobile phone',L_txt_box10,'1',L_txt_box10.id,L_txt_box10.value) });
	AddOnKeyPressEventListener(L_txt_box10,function (){validChars(event, '0123456789+') });
	
//-----------ROW 2 ENDS HERE ------------------
//-----------ROW 3 STARTS HERE ------------------
	L_tr_2_3  = CreateTR(L_tbody_2,"","tr_2_3");
	L_tr_2_3.valign="top";
	L_td_2_3_1  = CreateTD(L_tr_2_3,"" ,"td_2_3_1" ,"","Left","","");
	L_td_2_3_1.colSpan='3';

	L_txt_box11  = CreateTEXTBOX(L_td_2_3_1, "thinColorClass_mdt" ,"pcrAcc_AccountIdtxt","Key in first two chars of Account","100" );
	L_txt_box11.title="Key in first two chars of Account.";
	L_txt_box11.display="block";
	L_txt_box11.style.width='100%';
	AddFocusEventListener(L_txt_box11, function (){toggleLabelDisplay('Key in first two chars of Account',L_txt_box11,'0') });
	AddBlurEventListener(L_txt_box11,  function (){toggleLabelDisplay1('Key in first two chars of Account',L_txt_box11,'1') });
	AddOnKeyPressEventListener(L_txt_box11,  function (event){getAccounts2('autosuggestUsers',L_txt_box11.id,event,L_txt_box11.value) });
	
	CreateHIDDEN(L_td_2_3_1, "", "pcrAcc_AccountId" ,""  );

	L_td_2_3_4  = CreateTD(L_tr_2_3,"" ,"td_2_3_4" ,"","Left","","");
	L_newAccdiv = CreateDIV(L_td_2_3_4 , "","newAccdiv", "<a href='javascript:loadAcc();'>New </a>" );
	L_newAccdiv.style.display='none';
//-----------ROW 3 ENDS HERE ------------------
//-----------ROW 4 STARTS  HERE ------------------
	L_tr_2_4  = CreateTR(L_tbody_2,"","tr_2_4");
	L_tr_2_4 .valign="top";
	
	L_td_2_4_1  = CreateTD(L_tr_2_4,"" ,"td_2_4_1" ,"","Left","","");
	L_cmb_box2 =   CreateSelectBox(L_td_2_4_1, "normalInputFieldClass", "pcrCont_ContactType", "","");
	L_cmb_box2.title = 'Account Type';
	L_cmb_box2.length=1;
	L_cmb_box2.options[0].value = "";
	L_cmb_box2.options[0].text = "<Contact type>";
	L_cmb_box2.options[0].style.color ="#CC6633";
	L_cmb_box2.style.width='135px';

	L_td_2_4_2  = CreateTD(L_tr_2_4,"" ,"td_2_4_2" ,"","Left","","");
	L_td_2_4_3  = CreateTD(L_tr_2_4,"" ,"td_2_4_3" ,"","Left","","");
	L_td_2_4_4  = CreateTD(L_tr_2_4,"" ,"td_2_4_4" ,"","Left","","");
	//-----------ROW 4 ENDS HERE ------------------

	L_Contact_SaveTbl = CreateTable(L_contactTextBox,"","","","","0", "");
	L_Contact_SaveTbl.align='right';
	L_Contact_SaveTbl.border=0;
	L_Contact_SaveTbl.width='35%';
	L_Contact_SaveTbl_tbody  = CreateBody(L_Contact_SaveTbl ,"","" );
	L_Contact_SaveTbl_tr_1  = CreateTR(L_Contact_SaveTbl_tbody ,"","");

	L_Contact_SaveTbl_td_1_1  = CreateTD(L_Contact_SaveTbl_tr_1 ,"" ,"" ,"","","","");
	L_Contact_SaveTbl_td_1_1.width='100%';
	L_Contact_SaveTbl_td_1_1.align='right';

	L_saveCancel = CreateDIV(L_Contact_SaveTbl_td_1_1, "","saveCancelcont", "" );
	
	L_Contact_Part2_Save=CreateDIV(L_Contact_SaveTbl_td_1_1 , "","Contact_Part2_Save", "" );
	L_button_2 = CreateButton(L_Contact_Part2_Save , "greenButton" , "contButton" , "Save") ;
	L_button_2.style.width='40%';
	AddClickEventListener(L_button_2, function (){saveNewContact()});
	
	L_choose_cont=CreateDIV(L_Contact_SaveTbl_td_1_1,"","choose_cont","");
	L_button_3 = CreateButton(L_choose_cont , "greenButton" , "accChooseButton" , "Choose") ;
	AddClickEventListener(L_button_3, function(){chooseCont()});
	L_button_3.style.width='50%';
	L_choose_cont.style.display='none';
 }
// ~~~~~~~~~~ FUCTION TO LOAD THE CREATE CONTACT SCREEN  ENDS HERE ~~~~~~~~~~~

 // ~~~~~~~~~~ FUCTION TO LOAD THE CREATE LEAD SCREEN  ENDS HERE ~~~~~~~~~~~

 function loadAddleadScreen()
 {

	L_mainDiv = document.getElementById("mainContentDiv");
	L_leadContainer  = CreateDIV(L_mainDiv , "","leadContainer", "" );     // Main Window for Quick Add  leadortunity 
	L_leadContainer.style.display='none';
	L_QAlead  = CreateDIV(L_leadContainer , "headingClass","quickAddlead", "Quick Add leadortunity" );
	L_QAlead.style.display='none';
	L_QAleadX  = CreateDIV(L_QAlead, "cls_close_divX","QAleadX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancellead()'><b>X</b></a>" );

	L_zc__errorDivlead = CreateSPAN(L_leadContainer, "errorDiv", "zc__errorDivlead2", "", "", "");
	L_zc__errorDivlead.style.position = 'relative';
	L_zc__errorDivlead.style.width = '280px';
	L_zc__errorDivlead.style.marginLeft = '10px';	

	//handleQuickAddPopup(L_leadContainer,L_zc__errorDivlead);	
 }


// ~~~~~~~~~~ FUCTION TO LOAD THE ADD  OPPORTUNITY SCREEN  STARTS HERE ~~~~~~~~~~~
 function loadAddOppScreen()
 {

	L_mainDiv = document.getElementById("mainContentDiv");
	L_oppContainer  = CreateDIV(L_mainDiv , "","oppContainer", "" );     // Main Window for Quick Add  Opportunity 
	L_oppContainer.style.display='none';
	L_QAOpp  = CreateDIV(L_oppContainer , "headingClass","quickAddOpp", "Quick Add Opportunity" );
	L_QAOpp.style.display='none';
	L_QAOppX  = CreateDIV(L_QAOpp, "cls_close_divX","QAOppX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancelOpp()'><b>X</b></a>" );

	L_zc__errorDivOpp = CreateSPAN(L_oppContainer, "errorDiv", "zc__errorDivOpp", "", "", "");
	L_zc__errorDivOpp.style.position = 'relative';
	L_zc__errorDivOpp.style.width = '280px';
	L_zc__errorDivOpp.style.marginLeft = '10px';
	
	L_opptyTextboxes = CreateDIV(L_oppContainer , "","opptyTextboxes", "" );
	
	L_table_3  = CreateTable(L_opptyTextboxes,"default","table_3","","","1", "");
	L_table_3.style.marginLeft='10px';
	L_table_3.style.marginTop='3px';
	L_table_3.style.width ='85%';

	L_table_3.border='0';
	L_tbody_3  = CreateBody(L_table_3,"","tbody_3" );

	//-----------DUMMY ROW STARTS HERE ------------------
	L_tr_dummy  = CreateTR(L_tbody_3,"","");
	L_tr_dummy.style.height='0px';
	L_td_dummy  = CreateTD(L_tr_dummy ,"" ,"" ,"","","","");
	L_td_dummy.style.height='0px';
	L_td_dummy.colSpan = '3' ;
	L_td_dummy.align='right';
	L_txt_dummy = CreateSelectBox(L_td_dummy, "", "", "","");
	L_txt_dummy.style.border='1px';
	L_txt_dummy.style.width='1px';
	L_txt_dummy.style.height='1px';
	L_txt_dummy.style.fontSize='1px';
	//-----------DUMMY ROW ENDS HERE ------------------

	//-----------ROW 1 STARTS HERE ------------------
	L_tr_3_1  = CreateTR(L_tbody_3,"","tr_3_1");
	L_tr_3_1.valign="top";
	L_td_3_1_1  = CreateTD(L_tr_3_1,"" ,"td_3_1_1" ,"","Left","","");
	L_td_3_1_1.style.width='45%';

	L_txt_box12  = CreateTEXTBOX(L_td_3_1_1, "thinColorClass_mdt" ,"oppty_name","Name","100" );
	L_txt_box12.title="Name";
	AddFocusEventListener(L_txt_box12, function (){toggleLabelDisplay('Name',L_txt_box12,'0') });
	AddBlurEventListener(L_txt_box12,  function (){toggleLabelDisplay1('Name',L_txt_box12,'1') });

	L_td_3_1_2  = CreateTD(L_tr_3_1,"" ,"td_3_1_2" ,"","Left","","");
	L_td_3_1_2.style.width='10%'
	L_td_3_1_2.align="center";

	L_td_3_1_3  = CreateTD(L_tr_3_1,"" ,"td_3_1_3" ,"","Left","","");
	L_td_3_1_3.style.width='45%'
	L_txt_box13  = CreateTEXTBOX(L_td_3_1_3, "thinColorClass" ,"oppty_descp","Description","100" );
	L_txt_box13.title="Description";

	AddFocusEventListener(L_txt_box13, function (){toggleLabelDisplay('Description',L_txt_box13,'0') });
	AddBlurEventListener(L_txt_box13,  function (){toggleLabelDisplay('Description',L_txt_box13,'1') });
	
	/*L_td_3_1_4  = CreateTD(L_tr_3_1,"" ,"td_3_1_4" ,"","Left"," ","");
	L_td_3_1_4.style.width='28px'*/
	//-----------ROW 1 ENDS HERE ------------------

	//-----------ROW 2 STARTS HERE ------------------
	L_tr_3_2 = CreateTR(L_tbody_3,"","tr_3_2");
	L_tr_3_2.vAlign="top";
	L_td_3_2_1  = CreateTD(L_tr_3_2,"" ,"td_3_2_1" ,"","Left","","");
	
	L_txt_box14 = CreateTEXTBOX(L_td_3_2_1, "thinColorClass" ,"pot_val","Potential value","12" );
	L_txt_box14.title="Potential value";
	AddFocusEventListener(L_txt_box14, function (){toggleLabelDisplay('Potential value',L_txt_box14,'0')});
	AddBlurEventListener(L_txt_box14,  function (){toggleLabelDisplay('Potential value',L_txt_box14,'1') });
	AddOnKeyPressEventListener(L_txt_box14,function (event){validChars(event, '0123456789.') });

	L_td_3_2_2  = CreateTD(L_tr_3_2,"" ,"td_3_1_2" ,"","Left","","");
	L_td_3_2_3  = CreateTD(L_tr_3_2,"" ,"td_3_2_3" ,"","Left","","");

	L_cmb_box3 =   CreateSelectBox(L_td_3_2_3, "normalInputFieldClass", "Oppty_stage", "","");
	L_cmb_box3.style.width='100%';
	L_cmb_box3.title = 'Account Type';
	L_cmb_box3.length=1;
	L_cmb_box3.options[0].value = "";
	L_cmb_box3.options[0].text = "<Stage>";
	L_cmb_box3.options[0].style.color ="#CC6633";

	//L_td_3_2_4  = CreateTD(L_tr_3_2,"" ,"td_3_2_4" ,"","Left","","");
	//-----------ROW 2 ENDS HERE ------------------

	//-----------ROW 3 STARTS HERE ------------------
	L_tr_3_3  = CreateTR(L_tbody_3,"","tr_3_3");
	L_tr_3_3.valign="top";
	L_td_3_3_1  = CreateTD(L_tr_3_3,"" ,"td_3_3_1" ,"","Left","","");
	L_td_3_3_1.colSpan='3';

	L_txt_box15  = CreateTEXTBOX(L_td_3_3_1, "clas_txt_key_in" ,"textbx_contactcttxt","Keys in first two chars of Contact or click new","100" );
	L_txt_box15.style.width='100%';
	L_txt_box15.title="Key in first two chars of Contact";
	AddFocusEventListener(L_txt_box15, function (){toggleLabelDisplay2('Key in first two chars of Contact',L_txt_box15,'0'); });
	AddBlurEventListener(L_txt_box15,  function (){toggleLabelDisplay2('Key in first two chars of Contact',L_txt_box15,'1'); });
	AddOnKeyPressEventListener(L_txt_box15,  function (event){getContacts('autosuggestUsers',L_txt_box15.id,event,L_txt_box15.value);});
	CreateHIDDEN(L_opptyTextboxes, "", "textbx_contactct" ,""  );
	
	/*L_td_3_3_4  = CreateTD(L_tr_3_3,"" ,"td_3_3_4" ,"","Left","","");
	L_newAccdiv = CreateDIV(L_td_3_3_4 , "","newOppdiv", "<a href='javascript:loadAddConAcc(1);'>New</a>" );
	L_newAccdiv.title = "Click here to add new Contact";
	L_newAccdiv.style.display='none';*/
	//-----------ROW 3 ENDS HERE ------------------
	//-----------ROW 4 STARTS HERE ------------------
	L_tr_3_4  = CreateTR(L_tbody_3,"","tr_3_3");
	L_tr_3_4.valign="top";
	
	L_td_3_4_1=CreateTD(L_tr_3_4,"" ,"td_3_4_1" ,"","Left","","");
	L_td_3_4_1.colSpan='3';
	
	L_txt_box16  = CreateTEXTBOX(L_td_3_4_1, "clas_txt_key_in" ,"pcrAcc_AccountId1txt","Key in first two chars of Account","100" );
	L_txt_box16.style.width='100%';
	L_txt_box16.title="Key in first two chars of Account";
	AddFocusEventListener(L_txt_box16,function (){toggleLabelDisplay2('Key in first two chars of Account',L_txt_box16,'0');});
	AddBlurEventListener(L_txt_box16,function (){toggleLabelDisplay2('Key in first two chars of Account',L_txt_box16,'1'); });
	AddOnKeyPressEventListener(L_txt_box16,function (event){getAccounts1('autosuggestUsers',L_txt_box16.id,event,L_txt_box16.value);});
	CreateHIDDEN(L_opptyTextboxes, "", "pcrAcc_AccountId1" ,""  );

	/*L_td_3_4_4  = CreateTD(L_tr_3_4,"" ,"td_3_3_4" ,"","Left","","");
	L_newAccdiv = CreateDIV(L_td_3_4_4 , "","newOppdiv", "<a href='javascript:loadAddConAcc(2);' >New</a>" );
	L_newAccdiv.title = "Click here to add new Account";
	L_newAccdiv.style.display='none';*/
	//-----------ROW 4 STARTS HERE ------------------

	L_saveCancelopp  = CreateDIV(L_opptyTextboxes , "","saveCancelopp", "" );

	L_Account_Save=CreateDIV(L_saveCancelopp , "","oppty_Save", "" );
	L_Account_Save.style.border='0px solid red';
	L_Account_Save.style.cssFloat='right';
	

	L_button_2 = CreateButton(L_Account_Save , "greenButton" , "oppButton" , "Save") ;
	AddClickEventListener(L_button_2, function (){saveNewOppty()});
	
 }
// ~~~~~~~~~~ FUCTION TO LOAD THE CREATE ACCOUNT SCREEN  ENDS HERE ~~~~~~~~~~~

// ~~~~~~~~~~ FUCTION TO LOAD THE ADD ACTIVITY SCREEN  STARTS HERE ~~~~~~~~~~~
 function loadAddActvtScreen()
 {
	L_mainDiv = document.getElementById("mainContentDiv");
	L_activityContainer  = CreateDIV(L_mainDiv , "","activityContainer", "" );     // Main Window for Quick Add   Activity 
	L_activityContainer.style.display='none';

	L_quicAddAct  = CreateDIV(L_activityContainer , "headingClass","quicAddAct", "Quick Add Activity" );
	L_quicAddActX  = CreateDIV(L_quicAddAct, "cls_close_divX","quicAddActX", "<a title='Close' style='color: rgb(230, 57, 53);text-decoration:none;cursor:pointer;' href='javascript:cancelAct()'><b>X</b></a>" );
	L_quicAddAct.style.display='none';

	L_zc__errorDivAct = CreateSPAN(L_activityContainer, "errorDiv", "zc__errorDivAct", "", "", "");
	L_zc__errorDivAct.setAttribute("style","position:relative;margin-top:5px;margin-left:10px;");
	L_zc__errorDivAct.style.width = '293px';
	L_zc__errorDivAct.style.marginLeft = '10px';

	L_opptyTextboxes = CreateDIV(L_activityContainer , "","actTextboxes", "" );

	L_table_4  = CreateTable(L_opptyTextboxes,"default","table_4","","1","", "");
	L_table_4.style.marginLeft='10px';
	L_table_4.style.marginTop='4px';
	L_table_4.border='0';
	L_tbody_4  = CreateBody(L_table_4,"","tbody_4" );
	
	//-----------DUMMY ROW STARTS HERE ------------------
	L_tr_dummy  = CreateTR(L_tbody_4,"","");
	L_tr_dummy.style.height='0px';
	L_td_dummy  = CreateTD(L_tr_dummy ,"" ,"" ,"","","","");
	L_td_dummy.style.height='0px';
	L_td_dummy.colSpan = '3' ;
	L_td_dummy.align='right';
	L_txt_dummy = CreateSelectBox(L_td_dummy, "", "", "","");
	L_txt_dummy.style.border='1px';
	L_txt_dummy.style.width='1px';
	L_txt_dummy.style.height='1px';
	L_txt_dummy.style.fontSize='1px';
	//-----------DUMMY ROW ENDS HERE ------------------
	//-----------ROW 1 STARTS HERE ------------------
	
	L_tr_4_1  = CreateTR(L_tbody_4,"","tr_4_1");
	L_tr_4_1.valign="top";
	L_td_4_1_1  = CreateTD(L_tr_4_1,"" ,"td_4_1_1" ,"","Left","","");
	L_td_4_1_1.style.width='134px';

	L_txt_actvt_name  = CreateTEXTBOX(L_td_4_1_1, "thinColorClass_mdt" ,"actvt_name","Subject","100" );
	L_txt_actvt_name.title="Subject";
	AddFocusEventListener(L_txt_actvt_name, function (){toggleLabelDisplay('Subject',L_txt_actvt_name,'0') });
	AddBlurEventListener(L_txt_actvt_name,  function (){toggleLabelDisplay1('Subject',L_txt_actvt_name,'1') });
	
	L_td_4_1_2  = CreateTD(L_tr_4_1,"" ,"td_3_1_2" ,"","Left","","");
	L_td_4_1_2.style.width='21px'
	L_td_4_1_2.align="center";

	L_td_4_1_3  = CreateTD(L_tr_4_1,"" ,"td_4_1_3" ,"","Left","","");

	L_cmb_act_priority =   CreateSelectBox(L_td_4_1_3, "normalInputFieldClass", "act_priority", "","");
	L_cmb_act_priority.style.width='135px';
	L_cmb_act_priority.title = 'Activity Priority';
	L_cmb_act_priority.length=1;
	L_cmb_act_priority.options[0].value = "";
	L_cmb_act_priority.options[0].text = "<Activity Priority>";
	L_cmb_act_priority.options[0].style.color ="#CC6633";
	//-----------ROW 1 ENDS HERE ------------------

	//-----------ROW 2 STARTS HERE ------------------
	L_tr_4_2  = CreateTR(L_tbody_4,"","tr_4_1");
	L_tr_4_2.valign="top";
	L_td_4_2_1  = CreateTD(L_tr_4_2,"" ,"td_4_2_1" ,"","Left","","");
	
	//L_txt_0_1_96__date  = CreateTEXTBOX(L_td_4_2_1, "thinColorClass_mdt" ,"0_1_96__date","Start Date","10" );
	//L_txt_0_1_96__date.title="Start Date";
	//AddFocusEventListener(L_txt_0_1_96__date, function (){toggleLabelDisplay('Start Date',L_txt_0_1_96__date,'0') });
//	AddBlurEventListener(L_txt_0_1_96__date,  function (){changeDate(L_txt_0_1_96__date.id);toggleLabelDisplay1('Start Date',L_txt_0_1_96__date,'1') });
//	AddChangeEventListener(L_txt_0_1_96__date,  function (){changeCol() });
	
	L_td_4_2_2 = CreateTD(L_tr_4_2,"" ,"td_4_2_2" ,"","Left","","");
	L_td_4_2_2.style.width='21px'
	L_td_4_2_2.align="center";
	
	L_img1 = CreateIMG(L_td_4_2_2, "" , "", "/atCRM/images/calendar.gif", "Show date chooser", "", "",""); 
	L_img1.style.cursor ='normal';
	AddClickEventListener(L_img1, function (){calendar.attach (document.getElementById ('0-1-12__date'));increasediv() });

	L_td_4_2_3  = CreateTD(L_tr_4_2,"" ,"td_4_2_3" ,"","Left","","");

//	L_txt_0_1_96  = CreateTEXTBOX(L_td_4_2_3, "thinColorClass_mdt" ,"0-1-96","Start time","10" );
//	L_txt_0_1_96.title="Start Date";
//	AddFocusEventListener(L_txt_0_1_96, function (){toggleLabelDisplay('Start time',L_txt_0_1_96,'0') });
//	AddBlurEventListener(L_txt_0_1_96,  function (){changeTime(L_txt_0_1_96.id);toggleLabelDisplay1('Start time',L_txt_0_1_96,'1') });
	//-----------ROW 2 ENDS HERE ------------------

	//-----------ROW 3 STARTS HERE ------------------
	L_tr_4_3  = CreateTR(L_tbody_4,"","tr_4_3");
	L_tr_4_3.valign="top";
	L_td_4_3_1  = CreateTD(L_tr_4_3,"" ,"td_4_3_1" ,"","Left","","");
	
	L_txt_0_1_13__date  = CreateTEXTBOX(L_td_4_3_1, "thinColorClass" ,"0-1-13__date","End Date","10" );
	L_txt_0_1_13__date.title="End Date";
	AddFocusEventListener(L_txt_0_1_13__date, function (){toggleLabelDisplay('End Date',L_txt_0_1_13__date,'0') });
	AddBlurEventListener(L_txt_0_1_13__date,  function (){changeDate(L_txt_0_1_13__date.id);toggleLabelDisplay('End Date',L_txt_0_1_13__date,'1') });
	AddChangeEventListener(L_txt_0_1_13__date,  function (){changeCol() });
	
	L_td_4_3_2 = CreateTD(L_tr_4_3,"" ,"td_4_2_2" ,"","Left","","");
	L_td_4_3_2.style.width='21px'
	L_td_4_3_2.align="center";
	
	L_img2 = CreateIMG(L_td_4_3_2, "" , "", "/atCRM/images/calendar.gif", "Show date chooser", "", "",""); 
	L_img2.style.cursor ='normal';
	AddClickEventListener(L_img2, function (){calendar.attach(document.getElementById ('0-1-13__date'));increasediv(); });

	L_td_4_2_3  = CreateTD(L_tr_4_3,"" ,"td_4_2_3" ,"","Left","","");

	//L_txt_0_1_13  = CreateTEXTBOX(L_td_4_2_3, "thinColorClass" ,"0-1-13","End time","10" );
	//L_txt_0_1_13.title="End time";
	//AddFocusEventListener(L_txt_0_1_13, function (){toggleLabelDisplay('End time',L_txt_0_1_13,'0') });
	//AddBlurEventListener(L_txt_0_1_13,  function (){changeTime(L_txt_0_1_13.id);changeTime(L_txt_0_1_13.id),toggleLabelDisplay('End time',L_txt_0_1_13,'1') });
	//-----------ROW 3 ENDS HERE ------------------

	//-----------ROW 4 STARTS HERE ------------------
	L_tr_4_4  = CreateTR(L_tbody_4,"","tr_4_4");
	L_tr_4_4.valign="top";
	L_td_4_4_1  = CreateTD(L_tr_4_4,"" ,"td_4_4_1" ,"","Left","","");
	L_td_4_4_1.colSpan = '3';

	
	CreateHIDDEN(L_td_4_4_1,"","oppIdForAcct","");

	L_rad_appointment = CreateRadioButton(L_td_4_4_1, "", "", "1");
	L_rad_appointment.onclick=radCLicked;
	L_rad_appointment.id='rad_appointment';
	document.getElementById("rad_appointment").checked=true;
	
	L_td_4_4_1.appendChild (document.createTextNode("\ Appointment"));
	L_rad_task = CreateRadioButton(L_td_4_4_1, "", "","0");
	L_rad_task .onclick=radCLicked;
	L_rad_task .id='rad_task';
	L_td_4_4_1.appendChild (document.createTextNode("\ Task"));
	//-----------ROW 4 STARTS HERE ------------------

	L_saveCancelAcc = CreateDIV(L_opptyTextboxes , "","saveCancelAcc", "" );
	L_saveCancelAcc.style.border='0px solid red';
	L_Actvt_Save=CreateDIV(L_saveCancelAcc , "","oppty_Save", "" );
	L_Actvt_Save.style.cssFloat= 'right';
	L_Actvt_Save.style.marginTop= '0px';


	L_button_2 = CreateButton(L_Actvt_Save , "greenButton" , "actButton" , "Save") ;
	AddClickEventListener(L_button_2, function (){saveNewActvt()});
}
// ~~~~~~~~~~ FUCTION TO LOAD THE ADD ACTIVITY SCREEN  STARTS HERE ~~~~~~~~~~~

function saveNewAccount()
{
	var L_accName='';
    L_accName=document.getElementById("pcrAcc_NewAccountIdtxt").value;
    var accName=L_accName.trim();
	
	if ((accName == "Key in Account name") || (accName == ""))
	{
		showErrorDiv("Non-empty value needed for 'Account name'.",'zc__errorDivAcc');
		document.getElementById("pcrAcc_NewAccountIdtxt").focus();
		return false;
	}
	document.getElementById("accButton").disabled=true;
	var PinVal='';
	var CityVal='';
	var lineOne='';
	var lineTwo='';
	var Phone='';
	var accountType='';
	if (document.getElementById("pcrAcc_Line1").value != "Line1" && document.getElementById("pcrAcc_Line1").value != "")
    {
		lineOne=document.getElementById("pcrAcc_Line1").value;
	}
    
	if (document.getElementById("pcrAcc_Line2").value != "Line2" && document.getElementById("pcrAcc_Line2").value != "")
    {
		lineTwo=document.getElementById("pcrAcc_Line2").value;
	}
           
	if (document.getElementById("pcrAcc_Pin").value != "Pin" && document.getElementById("pcrAcc_Pin").value != "")
    {
		PinVal=document.getElementById("pcrAcc_Pin").value;
	}
	if (document.getElementById("pcrAcc_Phone").value != "Phone" && document.getElementById("pcrAcc_Phone").value != "")
	{
		Phone=document.getElementById("pcrAcc_Phone").value;
	}
	if ((document.getElementById("pcrAcc_City").value != "City") && (document.getElementById("pcrAcc_City").value != ""))
	{
		CityVal=document.getElementById("pcrAcc_City").value;
	}
	if ((document.getElementById("pcrAcc_AccountType").value != "<Account Type>") && (document.getElementById("pcrAcc_AccountType").value != ""))
	{
		accountType=document.getElementById("pcrAcc_AccountType").value;
	}
	dilogB4Close();
	document.getElementById("pcrAcc_AccountIdtxt").value=accName;
	$.ajax({
				type: "POST",
				async: false,
				url: "/atCRM/custom/entityView/QuickAddAccount.html",
			data: "name="+accName+"&addrLine1="+lineOne+"&addrLine2="+lineTwo+"&city="+CityVal+"&pin="+PinVal+"&phone="+Phone+"&AcctType="+accountType,
				
				dataType: "json",
				success: function (doc){

				var acct=doc;

				var acctId=acct.acctId;
				alert("Account added successfully");
				if (document.getElementById("leadContainer").style.display != 'none' )
				{
					document.getElementById(IdContainer+"txt").value=accName;
					document.getElementById(IdContainer+"txt").style.color="black";
					document.getElementById(IdContainer).value=acctId;
				}
				setAccDefault();

				//IdContainer


				document.getElementById("pcrAcc_AccountId2txt").value=accName;
				document.getElementById("pcrAcc_AccountId2").value=acctId;
				if(document.getElementById("contactContainer").style.display != 'none' )
				{
					document.getElementById("pcrAcc_AccountIdtxt").value=accName;
					document.getElementById("pcrAcc_AccountIdtxt").style.color="black";
					document.getElementById("pcrAcc_AccountId").value=acctId;
					$('#accountcontainerDiv').dialog('close');
				}
				else
				{
					if(document.getElementById("contactContainer").style.display =="none")
					{
						
						document.getElementById("pcrAcc_AccountId1txt").value=accName;
						document.getElementById("pcrAcc_AccountIdtxt").value="Key in first two chars of Account";
						document.getElementById("pcrAcc_AccountIdtxt").style.color="#CC6633";
						document.getElementById("pcrAcc_AccountId1txt").style.color="black";
						document.getElementById("pcrAcc_AccountId1").value=acctId;
						$('#accountcontainerDiv').dialog('close');
					}
				}

			}
			
		});
}


/****###########FUNCTION TO SET THE DEFAULT VALUES OF LEAD DIALOG STARTS HERE /****###########*/
function setLeadDefault()
{

	for(var x=0; x<fieldItemsQ.length; x++)
	{
		var nullableFld=fieldItemsQ[x].dataColumn[5];
		var fieldName=fieldItemsQ[x].dataColumn[0];
		var fieldType=fieldItemsQ[x].dataColumn[2];
		var vId=fieldItemsQ[x].dataColumn[1];
				
		if(fieldItemsQ[x].dataColumn.length>1)
		{			
			if(fieldType!="hiddenField")
			{	
				switch (fieldType)
				{
					case "textBox": 				            

					case "Text":
									if (document.getElementById(vId))
									{										
										if(nullableFld=="0")
											{
												if (document.getElementById(vId).value!=fieldName)
												{
												 document.getElementById(vId).value=fieldName;
												}
												document.getElementById(vId).className="thinColorClass_mdtQ";
											}
										else
											{		
												if (document.getElementById(vId).value!=fieldName)
												{
												 document.getElementById(vId).value=fieldName;
												}										
											 document.getElementById(vId).className="thinColorClassQ";
											}
									}
									break;

					case "dropDownList":	
									if (document.getElementById(vId))
									{
									 document.getElementById(vId).selectedIndex =  0 ;	
									}					                
									break;

					case "TextArea":
					case "textArea":
									if (document.getElementById(vId))
									{										
										if(nullableFld=="0")
											{
												if (document.getElementById(vId).value!=fieldName)
												{
												 document.getElementById(vId).value=fieldName;
												}
												document.getElementById(vId).className="thinColorClass_mdtQ";
											}
										else
											{		
												if (document.getElementById(vId).value!=fieldName)
												{
												 document.getElementById(vId).value=fieldName;
												}										
											 document.getElementById(vId).className="thinColorClassQ";
											}
									}				
									break;		
							
					case "smartSuggest":
										
									if (document.getElementById(vId+"txt"))
									{										
										if(nullableFld=="0")
											{
												if (document.getElementById(vId+"txt").value!="Key in "+fieldName)
												{
												 document.getElementById(vId+"txt").value="Key in "+fieldName;
												 document.getElementById(vId).value="";
												}
												document.getElementById(vId+"txt").className="thinColorClass_mdtQ";
											}
										else
											{		
												if (document.getElementById(vId+"txt").value!="Key in "+fieldName)
												{
												 document.getElementById(vId+"txt").value="Key in "+fieldName;
												}										
											 document.getElementById(vId+"txt").className="thinColorClassQ";
											}
									}
									break;	
							
								
					case "Combo":
					                if (document.getElementById(vId))
									{
									 document.getElementById(vId).selectedIndex =  0 ;	
									}						            
									break;
							
					case "Date":
					case "dateOnly":
									if (document.getElementById(vId+"__date"))
									{										
										if(nullableFld=="0")
											{
												if (document.getElementById(vId+"__date").value!=fieldName)
												{
												 document.getElementById(vId+"__date").value=fieldName;
												}
												document.getElementById(vId+"__date").className="thinColorClass_mdtQ";
											}
										else
											{		
												if (document.getElementById(vId+"__date").value!=fieldName)
												{
												 document.getElementById(vId+"__date").value=fieldName;
												}										
											 document.getElementById(vId+"__date").className="thinColorClassQ";
											}
									}
									break;		

					case "dropDown-terr":		
						           	if (document.getElementById(vId))
									{
									 document.getElementById(vId).selectedIndex =  0 ;	
									}			
									break;
					default:
						           if (document.getElementById(vId))
									{										
										if(nullableFld=="0")
											{
												if (document.getElementById(vId).value!=fieldName)
												{
												 document.getElementById(vId).value=fieldName;
												}
												document.getElementById(vId).className="thinColorClass_mdtQ";
											}
										else
											{		
												if (document.getElementById(vId).value!=fieldName)
												{
												 document.getElementById(vId).value=fieldName;
												}										
											 document.getElementById(vId).className="thinColorClassQ";
											}
									}
									break;					

				}
				
			}
     }

}

}




/****###########FUNCTION TO SET THE DEFAULT VALUES OF ACCOUNT DIALOG STARTS HERE /****###########*/
function setAccDefault()
{
	document.getElementById("pcrAcc_NewAccountIdtxt").value =  "Key in Account name";
	document.getElementById("pcrAcc_NewAccountIdtxt").className=  "thinColorClass_mdt";
	document.getElementById("pcrAcc_NewAccountIdtxt").size = '100';
	
	document.getElementById("pcrAcc_Line1").value =  "Line1";
	document.getElementById("pcrAcc_Line1").className=  "thinColorClass";
	document.getElementById("pcrAcc_Line2").value =  "Line2";
	document.getElementById("pcrAcc_Line2").className=  "thinColorClass";

	document.getElementById("pcrAcc_City").value =  "City";
	document.getElementById("pcrAcc_City").className=  "thinColorClass";
	document.getElementById("pcrAcc_Pin").value =  "Pin";
	document.getElementById("pcrAcc_Pin").className=  "thinColorClass";

	document.getElementById("pcrAcc_Phone").value =  "Phone";
	document.getElementById("pcrAcc_Phone").className=  "thinColorClass";
	document.getElementById("pcrAcc_AccountType").selectedIndex =  0 ;
	document.getElementById("accButton").disabled=false;
	document.getElementById("autosuggestUsers").style.display='none';
}
/****###########FUNCTION TO SET THE DEFAULT VALUES OF ACCOUNT DIALOG ENDS HERE /****###########*/

/****###########FUNCTION TO SET THE DEFAULT VALUES OF ACTIVITY DIALOG STARTS HERE /****###########*/
function setActvtDefault()
{
	document.getElementById("actvt_name").value =  "Subject";
	document.getElementById("actvt_name").className=  "thinColorClass_mdt";

	document.getElementById("act_priority").selectedIndex =  0 ;
	
	//document.getElementById("0-1-96__date").value =  "Start Date";
//	document.getElementById("0-1-96__date").className=  "thinColorClass_mdt";

	//document.getElementById("0-1-96").value =  "Start time";
	//document.getElementById("0-1-96").className=  "thinColorClass_mdt";

//	document.getElementById("0-1-5__date").value =  "End Date";
//	document.getElementById("0-1-5__date").className=  "thinColorClass";
	
//	document.getElementById("0-1-5").value =  "End time";
//	document.getElementById("0-1-5").className=  "thinColorClass";
	
	document.getElementById("actButton").disabled=false;
}
/****###########FUNCTION TO SET THE DEFAULT VALUES OF ACTIVITY DIALOG ENDS HERE /****###########*/

/****###########FUNCTION TO SET THE DEFAULT VALUES OF OPPURTUNITY DIALOG STARTS HERE /****###########*/
function setOppDefault()
{
	document.getElementById("oppty_name").value =  "Name";
	document.getElementById("oppty_name").className =  "thinColorClass_mdt";
	
	document.getElementById("oppty_descp").value =  "Description";
	document.getElementById("oppty_descp").className =  "thinColorClass";
 
	document.getElementById("pot_val").value = "Potential value";
	document.getElementById("pot_val").className ="thinColorClass";
	
	document.getElementById("Oppty_stage").selectedIndex =  0 ;
	
	document.getElementById("textbx_contactcttxt").value =  "Key in first two chars of Contact";
	document.getElementById("textbx_contactcttxt").className = "clas_txt_key_in";
	document.getElementById("textbx_contactct").value =  "";

	document.getElementById("pcrAcc_AccountId1txt").value =  "Key in first two chars of Account";
	document.getElementById("pcrAcc_AccountId1txt").className =  "clas_txt_key_in";
	document.getElementById("pcrAcc_AccountId1").className=  "";
	
	document.getElementById("oppty_Save").disabled=false;
	document.getElementById("autosuggestUsers").style.display='none';
}
/****###########FUNCTION TO SET THE DEFAULT VALUES OF OPPURTUNITY DIALOG ENDS HERE /****###########*/


/****###########FUNCTION TO SET THE DEFAULT VALUES OF CONTACT DIALOG STARTS HERE /****###########*/
function setContactDefault()
{
	document.getElementById("pcrCont_FirstNametxt").value =  "First name";
	document.getElementById("pcrCont_FirstNametxt").className=  "thinColorClass_mdt";

	document.getElementById("pcrCont_LastName").value =  "Last name";
	document.getElementById("pcrCont_LastName").className=  "thinColorClass_mdt";

	document.getElementById("pcrCont_Email").value =  "Email";
	document.getElementById("pcrCont_Email").className=  "thinColorClassGreen";

	document.getElementById("pcrCont_MobilePhone").value =  "Mobile phone";
	document.getElementById("pcrCont_MobilePhone").className=  "thinColorClassGreen";

	document.getElementById("pcrAcc_AccountIdtxt").value =  "Key in first two chars of Account";
	document.getElementById("pcrAcc_AccountIdtxt").className=  "thinColorClass_mdt";

	document.getElementById("pcrCont_ContactType").selectedIndex =  0 ;
	document.getElementById("contButton").disabled=false;
	removeError("zc__errorDivCont");
	document.getElementById("autosuggestUsers").style.display='none';
}
/****###########FUNCTION TO SET THE DEFAULT VALUES OF CONTACT DIALOG ENDS HERE /****###########*/

function saveNewContact()
{

	if ((document.getElementById("pcrCont_FirstNametxt").value=="")||(document.getElementById("pcrCont_FirstNametxt").value =="First name"))
	{   
			
		showErrorDiv("Non-empty value needed for 'First name'.",'zc__errorDivCont');
		document.getElementById("pcrCont_FirstNametxt").focus();
		return;
	}
	else
	{	
		  var contFname1=document.getElementById("pcrCont_FirstNametxt").value;
		  var contFname=contFname1.trim();
		  if(contFname=='')
		  {
			showErrorDiv("Non-empty value needed for 'Account'.",'zc__errorDivCont');
			document.getElementById("pcrCont_FirstNametxt").focus();
			return;
		 }
	}

	if (document.getElementById("pcrAcc_AccountIdtxt").value=="")
	{   
			
		showErrorDiv("Non-empty value needed for 'First name'.",'zc__errorDivCont');
		document.getElementById("pcrAcc_AccountIdtxt").focus();
		return;
	}

    if((document.getElementById("pcrCont_MobilePhone").value=="")||(document.getElementById("pcrCont_MobilePhone").value =="Mobile phone"))
	{  
		if((document.getElementById("pcrCont_Email").value=="")||(document.getElementById("pcrCont_Email").value =="Email"))
		{
			showErrorDiv("Non-empty value needed for 'Mobile phone or Email'.",'zc__errorDivCont');
			document.getElementById("pcrCont_Email").focus();
			return;
		}
	}	 
	if((document.getElementById("pcrCont_ContactType").value=="")||(document.getElementById("pcrCont_ContactType").value=="<Contact type>"))
	{
		showErrorDiv("Non-empty value needed for 'Contact type'.",'zc__errorDivCont');
		document.getElementById("pcrCont_ContactType").focus();
		return false;
	}
	document.getElementById("contButton").disabled=true;
	var existingPrimaryAccount='';
	var existingPrimaryAccountName='';
	var contlastName='';
	var contEmail='';
	var contMobile='';
	var contacType='';
	if (document.getElementById("pcrCont_LastName").value != "Last name" && document.getElementById("pcrCont_LastName").value != "")
    {
		contlastName=document.getElementById("pcrCont_LastName").value;
	}
    if (document.getElementById("pcrCont_Email").value != "Email" && document.getElementById("pcrCont_Email").value != "")
    {
		contEmail=document.getElementById("pcrCont_Email").value;
	}
	
	if (document.getElementById("pcrCont_MobilePhone").value != "Mobile phone" && document.getElementById("pcrCont_MobilePhone").value != "")
    {
		contMobile=document.getElementById("pcrCont_MobilePhone").value;
	}
	if((document.getElementById("pcrAcc_AccountId").value != ""))
	{
		existingPrimaryAccount=document.getElementById("pcrAcc_AccountId").value;
	}
	if((document.getElementById("pcrAcc_AccountIdtxt").value != ""))
	{
		existingPrimaryAccountName=document.getElementById("pcrAcc_AccountIdtxt").value;
	}
    contacType=document.getElementById("pcrCont_ContactType").value;
	dilogB4Close();

    if (document.getElementById("globleOpp"))
    {
		var oppIdpara=document.getElementById("globleOpp").value;
    }
	else
	{
        var oppIdpara="";
	}
	if (oppIdpara)
    {
		var urlData="fname="+contFname+"&PriAcct="+existingPrimaryAccount+"&lname="+contlastName+"&email="+contEmail+"&mphone="+contMobile+"&ContType="+contacType+"&oppId="+oppIdpara;
	}
	else
	{
		var urlData="fname="+contFname+"&PriAcct="+existingPrimaryAccount+"&lname="+contlastName+"&email="+contEmail+"&mphone="+contMobile+"&ContType="+contacType+"&oppId=";
	}

	$.ajax({
			type: "POST",
			url: "/atCRM/custom/entityView/QuickAddContact.html",
			data:urlData,
			dataType: "json",
			async: false,
			success: function (doc1){
			var cont=doc1;
			var contId=cont.contId;
			alert("Contact added successfully");
			setContactDefault();
            document.getElementById("textbx_contactct2txt").value=contFname;
			document.getElementById("textbx_contactct2").value=contId;

			if(document.getElementById("oppContainer").style.display != 'none' )
			{
				document.getElementById("textbx_contactcttxt").value=contFname;
				document.getElementById("textbx_contactcttxt").style.color="black";
				document.getElementById("textbx_contactct").value=contId;
				document.getElementById("pcrAcc_AccountId1txt").value=document.getElementById("pcrAcc_AccountIdtxt").value;
				document.getElementById("pcrAcc_AccountId1txt").style.color="black";
				
				document.getElementById("pcrAcc_AccountId1").value=existingPrimaryAccount;
				$('#contactContainer').dialog('close');
			}
			if (document.getElementById("leadContainer").style.display != 'none' )
			{
				document.getElementById(IdContainer+"txt").value=contFname;
				document.getElementById(IdContainer+"txt").style.color="black";
				document.getElementById(IdContainer).value=contId;
				document.getElementById("0-1-201-203txt").value=existingPrimaryAccountName;
				document.getElementById("0-1-201-203txt").style.color="black";				
				document.getElementById("0-1-201-203").value=existingPrimaryAccount;
				$('#contactContainer').dialog('close');
			}
		}
	});
	
}


function getContactsforopp(divName,id,key,val)
{  
	if(document.getElementById("oppContainer").style.display != 'none' )
	{
		if(document.getElementById(id).value.length>=1)
		{
			if(key==13)
			{
				return false;
			}
			else
			{      
				L_SearchStr = val + String.fromCharCode(key);
				$.ajax({
					type: "GET",
					async: false,
					url:zcServletPrefix+"/custom/advancedAdd/getMatchingContacts.xml?str="+L_SearchStr,
					dataType: "xml",
					success: function (docCont){
						var cont_displayName= docCont.getElementsByTagName("cont_displayName");
						var acct_name= docCont.getElementsByTagName("acct_name");
						var accID= docCont.getElementsByTagName("acct_id");
						var cont_id = docCont.getElementsByTagName("cont_id");
						var FirstName= docCont.getElementsByTagName("FirstName");
						var LastName= docCont.getElementsByTagName("LastName");
						var cont_phoneno= docCont.getElementsByTagName("cont_phoneno");
						var email= docCont.getElementsByTagName("email");
						var ContactType_id= docCont.getElementsByTagName("ContactType_id");
						
						var listcount=docCont.getElementsByTagName("listcount") ;
						var count=listcount[0]?listcount[0].getAttribute("count") : null;
						var names='';
						var accName='';
						var contids='';
						var accntId='';
						var FirstNames='';
						var LastNames='';
						var cont_phonenos='';
						var emails='';
						var ContactType_ids='';
						var displaystring='';
						

						for(i=0;i<count;i++)
						{
						names=cont_displayName[i]?cont_displayName[i].getAttribute("displayName") : null;
						contids=cont_id[i]?cont_id[i].getAttribute("id"): null;
						accName=acct_name[i]?acct_name[i].getAttribute("accountName"): null;
						accntId=accID[i]?accID[i].getAttribute("accountId"):null;
						FirstNames=FirstName[i]?FirstName[i].getAttribute("FName"):null;
						LastNames=LastName[i]?LastName[i].getAttribute("LName"):null;
						cont_phonenos=cont_phoneno[i]?cont_phoneno[i].getAttribute("phoneno"):null;
						emails=email[i]?email[i].getAttribute("priEmail"):null;
						ContactType_ids=ContactType_id[i]?ContactType_id[i].getAttribute("contType"):null;

						if(displaystring)
						{
							displaystring=displaystring+'~'+names;
							displaystring=displaystring+'--'+contids;
							displaystring=displaystring+'::'+accName;
							displaystring=displaystring+'::'+accntId;
							displaystring=displaystring+'::'+FirstNames;
							displaystring=displaystring+'::'+LastNames;
							displaystring=displaystring+'::'+cont_phonenos;
							displaystring=displaystring+'::'+emails;
							displaystring=displaystring+'::'+ContactType_ids;
							
						}
						else
						{
							
							displaystring=names;
							displaystring=displaystring+'--'+contids;
							displaystring=displaystring+'::'+accName;
							displaystring=displaystring+'::'+accntId;
							displaystring=displaystring+'::'+FirstNames;
							displaystring=displaystring+'::'+LastNames;
							displaystring=displaystring+'::'+cont_phonenos;
							displaystring=displaystring+'::'+emails;
							displaystring=displaystring+'::'+ContactType_ids;
							
						}
						}
						var temp = new Array();
						
						temp = displaystring.split('~');
						var temp1=new Array();
						var accN=temp[1];
						var accID=temp[2];
						
						new AutoSuggest(divName,document.getElementById(id),temp,'','no',100,122,4);
					}

				});
				}
			}
		}
	}
	 
/*#########FUNCTION TO SAVE OPPURTUNITY STARTS HERE ##################*/
function saveNewOppty()
{
	if((document.getElementById("oppty_name").value=='')||(document.getElementById("oppty_name").value=="Name"))
	{
		showErrorDiv("Non-empty value needed for Opportunity 'name'.",'zc__errorDivOpp');
		document.getElementById("oppty_name").focus();
		return;
	}
	else
	{
		var oppName1=document.getElementById("oppty_name").value;
		var	oppName=oppName1.trim();
		if(oppName=='')
		{
			showErrorDiv("Non-empty value needed for Opportunity 'name'.",'zc__errorDivOpp');
			document.getElementById("oppty_name").focus();
			return;
		}
	}
	if((document.getElementById("Oppty_stage").value=='')||(document.getElementById("Oppty_stage").value=="<Stage>"))
	{
		showErrorDiv("Non-empty value needed for Opportunity 'Stage'.",'zc__errorDivOpp');
		document.getElementById("Oppty_stage").focus();
		return;
	}
	if(document.getElementById("textbx_contactcttxt").value==''   || document.getElementById("textbx_contactcttxt").value=='Key in first two chars of Contact'  )
	{
		showErrorDiv("Non-empty value needed for 'Contact'. ",'zc__errorDivOpp');
		document.getElementById("textbx_contactcttxt").focus();
		return;
	}

	if(document.getElementById("pcrAcc_AccountId1txt").value=='' || document.getElementById("pcrAcc_AccountId1txt").value=='Key in first two chars of Account' )
	{
		showErrorDiv("Non-empty value needed for 'Account'.",'zc__errorDivOpp');
		document.getElementById("pcrAcc_AccountId1txt").focus();
		return;
	}
	document.getElementById("oppButton").disabled=true;

	var oppDesc='';
	var oppPV='';
	var oppStage='';
	var oppCont='';
	var oppAcc='';
	
	oppStage=document.getElementById("Oppty_stage").value;
	oppCont=document.getElementById("textbx_contactct").value;
	oppAcc=document.getElementById("pcrAcc_AccountId1").value;

	if((document.getElementById("oppty_descp").value!='')&&(document.getElementById("oppty_descp").value!="Description"))
	{
		oppDesc=document.getElementById("oppty_descp").value;
	}
	
	if((document.getElementById("pot_val").value!='')&&(document.getElementById("pot_val").value!="Potential value"))
	{
		oppPV=document.getElementById("pot_val").value;
		if(parseFloat(oppPV))
		{
			oppPV=parseFloat(oppPV);
		}
		else
		{
			oppPV='0';
		}
	}
	dilogB4Close();
	$.ajax(
			{
				type: "POST",
				url: "/atCRM/custom/entityView/QuickAddOpportunity.html",
				async: false,
				data: "opportunityname="+oppName+"&description="+oppDesc+"&value="+oppPV+"&primaryaccount="+oppAcc+"&pcontact="+oppCont+"&stage="+oppStage,
				success: function ()
					{
						alert("Opportunity added successfully");
						document.getElementById("oppButton").disabled=false;
					}
		  });

 }
/*#########FUNCTION TO SAVE OPPURTUNITY ENDS HERE ##################*/

/*#########FUNCTION TO SAVE NEW ACTIVITY STARTS HERE ##################*/
function saveNewActvt()
{
	if((document.getElementById("actvt_name").value=="Subject")||(document.getElementById("actvt_name").value==''))
	{
		 showErrorDiv("Non-empty value needed for 'subject'.",'zc__errorDivAct');
		 document.getElementById("actvt_name").focus();
		 return;
	}
	else
	{
		var actvtSubject1=document.getElementById("actvt_name").value;
		var actvtSubject=actvtSubject1.trim();
		if(actvtSubject=='')
		{
			showErrorDiv("Non-empty value needed for 'subject'.",'zc__errorDivAct');
			document.getElementById("actvt_name").focus();
			return;
		}
	}
	
	if((document.getElementById("act_priority").value=='')||(document.getElementById("act_priority").value=="<Activity Priority>"))
	{
		showErrorDiv("Non-empty value needed for Activity 'Priority'.",'zc__errorDivAct');
		document.getElementById("act_priority").focus();
		return;
	}

	/*if((document.getElementById("0-1-96__date").value=='')||(document.getElementById("0-1-96__date").value=="Start Date"))
	{
		showErrorDiv("Non-empty value needed for Activity 'Start Date'.",'zc__errorDivAct');
		document.getElementById("0-1-96__date").focus();
		return;
	}

	if((document.getElementById("0-1-96").value=='')||(document.getElementById("0-1-96").value=="Start time"))
	{
		showErrorDiv("Non-empty value needed for Activity 'Start time'.",'zc__errorDivAct');
		document.getElementById("0-1-96").focus();
		return;
	}*/


	if((document.getElementById("rad_appointment").checked == false ) && (document.getElementById("rad_task").checked == false ))
	{
		showErrorDiv("Please slecect the activity type Appointment/Task.",'zc__errorDivAct');
		document.getElementById("act_priority").focus();
		return;
	}

	var actvtPriority='';
	var startDate1='';
	var startTime1='';
	var endDate1='';
	var endTime1='';
	var actvtType='';
	var endDate='';
	
	actvtPriority=document.getElementById("act_priority").value;
//	startDate1=document.getElementById("0-1-96__date").value;
//	startTime1=document.getElementById("0-1-96").value;
//	var startDate=startDate1+' '+startTime1;

/*	if (document.getElementById("0-1-5__date").value != "End Date" && document.getElementById("0-1-5__date").value != "")
    {
		endDate1=document.getElementById("0-1-5__date").value;
		
		if (document.getElementById("0-1-5").value != "End time" && document.getElementById("0-1-5").value != "")
		{
			endTime1=document.getElementById("0-1-5").value;
		}
		else
		{
			showErrorDiv("Non-empty value needed for 'EndTime'.",'zc__errorDivAct');
			document.getElementById("0-1-5").focus();
			return;
		}
		
		endDate=endDate1+' '+endTime1;

		var strtTme=startTime1;
		var endTme=endTime1;
		var result = MaxDateTime(endDate1+" "+endTime1,startDate1+" "+startTime1,'dd/MM/yyyy');
		if(result==2 || result==0)
		{ 
			showErrorDiv("End date should be greater than Start date.",'zc__errorDivAct');
			//showErrorDiv("Non-empty value needed for 'EndTime'.");
			return false;
		}
		else
		{
			var starttime4Act=startTime1;
			var twocharsST=starttime4Act.substr(0,2);
			var endtime4Act=endTime1;
			var twocharsET=endtime4Act.substr(0,2);
			twocharsST=parseInt(twocharsST);
			twocharsET=parseInt(twocharsET);
			if(strtTme==endTme)
			{
				if(twocharsST>twocharsET)
				{
					//alert("End time should be greater than Start time.") 
					showErrorDiv("End time should be greater than Start time.",'zc__errorDivAct');
					return false;
				}
			}

		}
	}*/
	if(document.getElementById("rad_appointment").checked)
	{
		actvtType="1";
	}
	else
	{
		actvtType="0";
	}
	dilogB4Close();

    if (document.getElementById("oppIdForAcct").value)
    {
		var oppIdForAcctPopup=document.getElementById("oppIdForAcct").value;
    }


	$.ajax({
	type: "POST",
	async: false,
	url: "/atCRM/custom/entityView/QuickAddActivity.html",
	data: "sub="+actvtSubject+"&starttime="+startDate+"&endtime="+endDate+"&priority="+actvtPriority+"&task="+actvtType+"&oppId="+oppIdForAcctPopup,
	success: function ()
			{
			  alert("Activity added successfully");
			  document.getElementById("oppIdForAcct").value="";
			  $('#activityContainer').dialog('close');
			}
		});
}
/*#########FUNCTION TO SAVE NEW ACTIVITY ENDS HERE ##################*/


var tempInMeetContactIds = new Array();
var tempInMeetContactNames = new Array();
var accExpand='0';
var contExpand='0';
var oppExpand='0';
var actExpand='0';

function loadScreen()
 {
	//calendar = new CalendarControl ('calendar');
	///loadAddAccScreen();
	//loadAddConScreen();
	//loadAddOppScreen();
	//loadAddActvtScreen();
	//loadAddleadScreen();

	/*Creating DIVBlocker */
	//L_mainDiv = document.getElementById("mainContentDiv");
	//L_transDiv = CreateDIV(L_mainDiv , "cls_divBlocker","transDiv", "" ); 
//	L_lastDiv = CreateDIV(L_mainDiv , "","lastDiv", "" ); 
	/*Creating DIVBlocker */
	 
//	 loadEntityView();
//	 populateScreenData();
	 
	// populateMsgDivData()
	 createMailAlert();
	 

}

function emailValid(email)
{
	if(document.getElementById("pcrCont_Email").value!="Email")
	{
		if(!emailValidationVal(email))
		{
			showErrorDiv('Email id of this contact is invalid','zc__errorDivCont');
			return;
	    }
		else
		{
			removeError('zc__errorDivCont');
		}
    }
	else
	{
		if(document.getElementById("zc__errorDivCont").style.display!="none")
		{
			removeError('zc__errorDivCont');
		}
	}
}

function checkMobileNo(elem)
{  
	if(elem.value!="Mobile phone")
	{
		if(elem.value.length<12)
		{
			showErrorDiv('Please enter a valid mobile phone number (e.g. 919632925578).','zc__errorDivCont');
			return;
		}
		else if (elem.value.indexOf('919')!=0)
		{
			showErrorDiv('Please enter a valid mobile phone number (e.g. 919632925578).','zc__errorDivCont');
			return;
		}
		else
		{
			if(document.getElementById("zc__errorDivCont").style.display!="none")
			{
				removeError('zc__errorDivCont');
			}
		}
	}
}

function increasediv()
{ 
	return;
}

function divToggle(divId,varThis,toglIMG)
{
	alert("panel");
	L_divID = "#"+divId
	$(L_divID).slideToggle('slow', function() 
	{
		if(document.getElementById(divId).style.display == "none" && varThis.id != "AccordianHeader_4"  ) 
		{
			varThis.style.borderBottom = '1px solid #E0E0E0';
		}
		else
		{
			varThis.style.borderBottom = '1px solid #E0E0E0';
		}
		
		if(document.getElementById(divId).style.display == "none") 
		{
			document.getElementById(toglIMG).className= 'cls_tglimgleft';
		}
		else
		{
			document.getElementById(toglIMG).className= 'cls_tglimgbottom';
		}

	});
}

function loadEntityView()
{
	
	L_accordianMainDiv = document.getElementById("accordianMainDiv");
	L_accordian1  = CreateDIV(L_accordianMainDiv , "","accordion1", "" );
	G_BrowserName = navigator.appName;
	if(G_BrowserName.toUpperCase() != "MICROSOFT INTERNET EXPLORER" )
	{
		L_AccordianSec_1=CreateDIV(L_accordian1,"cls_accordianSec","AccordianSec_1", "" );
		L_AccordianHeader_1=CreateDIV(L_AccordianSec_1,"cls_subAccordianDivHeader","AccordianHeader_1", "<span class=cls_tglimgbottom id='bootomimgclock' >&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;Clock" );
		L_AccordianHeader_1.style.marginTop="0px";
	L_AccordianContent_1=CreateDIV(L_AccordianSec_1,"cls_subAccordianDiv","AccordianContent_1", "<center><canvas id='s03' width='50'      class='CoolClock:classic' style='border:0px solid black;margin-top:5px;height:100px;'></canvas></center>" );
		L_AccordianContent_1.style.height='115px';
		AddClickEventListener(L_AccordianHeader_1, function (){divToggle('AccordianContent_1',L_AccordianHeader_1,'bootomimgclock') });
		CoolClock.findAndCreateClocks();
	}
	L_accordian2  = CreateDIV(L_accordianMainDiv , "","accordion2", "" );
	L_AccordianSec_2=CreateDIV(L_accordian2,"","AccordianSec_2", "" );
	L_AccordianHeader_2=CreateDIV(L_AccordianSec_2,"cls_subAccordianDivHeader","AccordianHeader_2", "<span class=cls_tglimgbottom id='bootomimgcal' >&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;Calendar" );
	if(G_BrowserName.toUpperCase() == "MICROSOFT INTERNET EXPLORER" )
	{
		L_AccordianHeader_2.style.marginTop="-18px";
	}
	L_AccordianContent_2=CreateDIV(L_AccordianSec_2,"cls_subAccordianDiv","calendarBox2", "" );
	L_AccordianContent_2.style.height='150px';
	AddClickEventListener(L_AccordianHeader_2, function (){divToggle('calendarBox2',L_AccordianHeader_2,'bootomimgcal') })

	L_accordian3  = CreateDIV(L_accordianMainDiv , "","accordion3", "" );
	L_AccordianSec_3=CreateDIV(L_accordian3,"","AccordianSec_3", "" );
	L_AccordianHeader_3=CreateDIV(L_AccordianSec_3,"cls_subAccordianDivHeader","AccordianHeader_3", "<span class=cls_tglimgbottom id='bootomimgRV' >&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;Recently Visited" );
	L_AccordianContent_3=CreateDIV(L_AccordianSec_3,"cls_subAccordianDiv","AccordianContent_3", "" );
	L_AccordianContent_3.style.height='115px';
	AddClickEventListener(L_AccordianHeader_3, function (){divToggle('AccordianContent_3',L_AccordianHeader_3,'bootomimgRV') });


	return;
}

function showAQDialog(varThis,vURL,actvtID,contID,eml_obj,ssElem,qkAddName,dispNameForCalCent,qWindwPos)
{ 
	//govardhan added three paramaters for email client purpose.
	 L_divName="";
	 if(varThis == '')
	 {
		return false;
	 }
	 else if(varThis == 'ACCT'||varThis == 'Account'||varThis == 'actvt_acct'||varThis == 'Opportunity_Account')
	 {
		showHideDiv('ACCT',"Quick Add Account","","[85,40]",vURL,'','','',ssElem);
	 }
	 else if(varThis == 'CONCT'||varThis == 'Contact'||varThis == 'actvt_cont'||varThis == 'Opportunity_Contact')
	 {
		showHideDiv('CONCT',"Quick Add Contact","","[85,40]",vURL,actvtID,contID,eml_obj,ssElem);
	 }
	 else if(varThis == 'OPP'||varThis =='Opportunity')
	 {
		showHideDiv('OPP',"Quick Add Opportunity","","[85,40]",vURL,actvtID,contID,eml_obj,ssElem);
	 }
	 else if(varThis == 'APTMT'||varThis =='activity')
	 {
		showHideDiv('APTMT',"Quick Add Appointment","","[85,40]",vURL,'','','',ssElem,dispNameForCalCent,qWindwPos);
	 }
	 else if(varThis == 'TSK')
	 {
		showHideDiv('TSK',"Quick Add Task","","[85,40]",vURL,'','','',ssElem);
	 }
	 else if(varThis == 'LEAD')
	 {
		showHideDiv('LEAD',"Quick Add Lead","","[85,40]",vURL,actvtID,contID,eml_obj,ssElem);
	 }
	 else if(varThis == 'TKT'||varThis =='ticket')
	 {
		 if (qkAddName == "Contact")
		 {
			showHideDiv('CONCT',"Quick Add Contact","","[85,40]",vURL,actvtID,contID,eml_obj,ssElem);
		 }
		 else if (qkAddName == "Account")
		 {
			 showHideDiv('ACCT',"Quick Add Account","","[85,40]",vURL,'','','',ssElem);
		 }
		 else
		 {
			showHideDiv('TKT',"Quick Add Ticket","","[85,40]",vURL,actvtID,contID,eml_obj,ssElem);
		 }
		
	 }
	 else 
	 {
		vURL=zcServletPrefix+vURL;
		showHideDiv(varThis,"Quick Add","","[85,40]",vURL,'','','',ssElem);
	 }
}
url4QuickAdd = "";


/*Function to populate the screen data */
function populateScreenData()
{

	url="/atCRM/custom/JSON/commonFunctions.htm?sid="+Math.random();
	if(url4QuickAdd!=url)
	$.getJSON(url,function(data)
		{	
			ActvtObj= eval(data);
			var L_commonFunctions = ActvtObj['commonFunctions']; 
			var L_ActivityPriority = L_commonFunctions['ActivityPriority']; 
			var L_OpptyStage = L_commonFunctions['OpptyStage'];
			var L_accountType = L_commonFunctions['accountType']; 
			var L_contactType = L_commonFunctions['contactType']; 
			var L_recentlyVisited = L_commonFunctions['listRecent'];
		  	var currMonth=L_commonFunctions['currMonth'];
		  	var currYear=L_commonFunctions['currYear'];
			showCalendar(currMonth,currYear);
			L_rcentlyVisitedDIV = document.getElementById("AccordianContent_3");
			document.getElementById("AccordianContent_3").innerHTML = '';
			if(document.getElementById("AccordianContent_3").innerHTML=='')
			{		
			L_rcentlyVisitedDIV.style.height='100%';
			L_rcentlyVisitedDIV.style.overflow='auto';
			}
			
			L_RV_table = CreateTable(L_rcentlyVisitedDIV,"default","RV_table","","0","2", "");
			L_RV_table.style.border=1;
			L_RV_table.style.width='100%';
			L_RV_tbody  = CreateBody(L_RV_table,"","RV_tbody" );
		
			
			for(i=0;i<parseInt(L_recentlyVisited.length);i++)
			{
				L_tr_name = "tr_rv_"+i;
				
				L_rv_obj = L_recentlyVisited[i];
				try
				{
					L_imgUrl = L_rv_obj['imgUrl'];
					L_titleTxt = L_rv_obj['titleTxt'];
					L_dispTxt = L_rv_obj['dispTxt'];
					L_uri = L_rv_obj['uri'];
				}
				catch (e)
				{
					continue;
				}
				
				L_td1_value = "<a href=javascript:setUpPageParameters('"+L_uri+"');border=0 class= 'anchClass' >"; 
				L_td1_value  = L_td1_value  + "<img src='"+L_imgUrl+"' border='0'  width='16px' title='"+L_titleTxt + "-"+L_dispTxt +"'></a>"; 
				L_tr =  CreateTR(L_RV_tbody,"",L_tr_name);
			
				L_td_name1 = "td_rv_1_"+i;
				L_td1 =	CreateTD(L_tr ,"listWhiteRow" ,L_td_name1,"","Left","","");
				L_td1.style.width = '20px';
				L_td1.innerHTML = L_td1_value;
				
				//L_td2_value = "<a href=javascript:setUpPageParameters('"+L_uri+"'); border=0 class= 'anchClass' >"; 
				viewUrl = L_uri.replace(/\?/g,"~");
				viewUrl = viewUrl.replace(/&/g,"@");
				viewUrl = viewUrl.replace(/=/g,"*");
				L_td2_value = "<a href='#setUpPageParameters?viewUrl="+viewUrl+"&entityDiv="+null+"&shownSubMenu="+null+"&sid="+(Math.random()*9)+ "' border=0 class= 'anchClass' >"; 
				L_td2_value  = L_td2_value  +L_dispTxt+ "</a>";
				
				L_td_name2 = "td_rv_2_"+i;
				L_td2 =	CreateTD(L_tr ,"listWhiteRow" ,L_td_name2,"","Left","","");
				L_td2.innerHTML = L_td2_value;

			}
			/*if(document.getElementById("act_priority"))
			{
				L_cmb_ActivityPriority  = document.getElementById("act_priority");
				L_ActivityPriorityArr=L_ActivityPriority.split("~)")
				L_cmb_ActivityPriority.length = parseInt(L_ActivityPriorityArr.length)+1 ;
				for(i=1;i< parseInt(L_ActivityPriorityArr.length)+1;i++)
				{	
					L_value = L_ActivityPriorityArr[i-1].split("--");
					L_cmb_ActivityPriority.options[i].value = L_value[1];
					L_cmb_ActivityPriority.options[i].text= L_value[0];
				}
			}
			
			if(document.getElementById("Oppty_stage"))
			{
				L_cmb_Oppty_stage  = document.getElementById("Oppty_stage");
				L_cmb_Oppty_stageArr=L_OpptyStage.split("~)")
				L_cmb_Oppty_stage.length = parseInt(L_cmb_Oppty_stageArr.length)+1 ;
				for(i=1;i< parseInt(L_cmb_Oppty_stageArr.length)+1;i++)
				{	
					L_value = L_cmb_Oppty_stageArr[i-1].split("--");
					L_cmb_Oppty_stage.options[i].value = L_value[1];
					L_cmb_Oppty_stage.options[i].text= L_value[0];
				}
			}

			if(document.getElementById("pcrCont_ContactType"))
			{
				L_cmb_pcrCont_ContactType  = document.getElementById("pcrCont_ContactType");
				L_cmb_pcrCont_ContactTypeArr=L_contactType.split("~)")
				L_cmb_pcrCont_ContactType.length = parseInt(L_cmb_pcrCont_ContactTypeArr.length)+1 ;
				for(i=1;i< parseInt(L_cmb_pcrCont_ContactTypeArr.length)+1;i++)
				{	
					L_value = L_cmb_pcrCont_ContactTypeArr[i-1].split("--");
					L_cmb_pcrCont_ContactType.options[i].value = L_value[1];
					L_cmb_pcrCont_ContactType.options[i].text= L_value[0];
				}
			}

			if(document.getElementById("pcrAcc_AccountType"))
			{
				L_cmb_accountType = document.getElementById("pcrAcc_AccountType");
				L_cmb_accountTypeArr=L_accountType.split("~)");
				L_cmb_accountType.length = parseInt(L_cmb_accountTypeArr.length)+1 ;
				for(i=1;i< parseInt(L_cmb_accountTypeArr.length)+1;i++)
				{	
					L_value = L_cmb_accountTypeArr[i-1].split("--");
					L_cmb_accountType.options[i].value = L_value[1];
					L_cmb_accountType.options[i].text= L_value[0];
				}
			}*/
		}
	);
	url4QuickAdd=url;
}
/*Function to populate the screen data */

/****************Function to hide the mail div starts here **********/
function hideMailDiv()
{
   document.getElementById("div_mailAlert").style.display= 'none';
	doUpateMsgAlert();
}
/*--------Function to hide the mail div ends here -------------*/

/*Function to populate the Message Div data */
url4MsdDiv = "";
function populateMsgDivData()
{
	MsgUrl=zcServletPrefix+"/custom/Messages/listNewMessages.htm?sid="+Math.random();
	if(url4MsdDiv!=MsgUrl)
	$.getJSON(MsgUrl,function(data)
		{	
			MsgObj= eval(data);
			L_msgSub = MsgObj["contactType"];
			L_msgSubArray = L_msgSub.split("~)");
			L_finalDispSub = "";
			L_dispSub="";
			L_dispSubMore=0
			L_msgLink = zcServletPrefix+"/custom/Messages/listMsgsOfCateg.html";

			if(L_msgSubArray.length == 1 && L_msgSubArray[0] != "" )
			{		
				L_DivDispMsg="<a class='anchClass' onClick='hideMailDiv()'  href='javascript:setUpPageParameters(\""+L_msgLink+"\");'>&nbsp;" +L_msgSubArray.length + " New Message: "+ L_msgSubArray[0]+"</a>";
				document.getElementById('span_msg1').innerHTML = L_DivDispMsg;
				showMsgAlert();
			} 
			else if(L_msgSubArray.length  > 1)
			{
				L_DivDispMsg="<a class='anchClass'  onClick='hideMailDiv()'  href='javascript:setUpPageParameters(\""+L_msgLink+"\");'>&nbsp;" +L_msgSubArray.length + " New Messages.</a>";
				document.getElementById('span_msg1').innerHTML = L_DivDispMsg;
				showMsgAlert();
			}
		}
	);
	url4MsdDiv=MsgUrl;
	L_finalDispSub="<a href= "+zcServletPrefix+"custom/Messages/listMsgsOfCateg.html > ";
}
/*Function to populate the screen data */


function showCalendar(currMonth,currYear)
{
  showMonthCalendars_custom(currMonth,currYear,zcServletPrefix+"/custom/calendar/daysEvents.html?");		
}

//setTimeout("showMsgAlert()",5000);

function showMsgAlert()
{
	document.getElementById("div_mailAlert").style.dispaly='none';
	$("#div_mailAlert").show('slow', function() {});
}
//setTimeout("showMsgAlert()",10000);
function createMailAlert(varMsg)
{
	L_mailAlertDiv = document.getElementById("div_mailAlert");
	
	L_mailAlertDiv_table = CreateTable(L_mailAlertDiv ,"default","mailAlertDiv_table","","0","0", "");
	L_mailAlertDiv_table.style.width='99%';
	L_mailAlertDiv_table.border=0;
	L_mailAlertDiv_table.style.height='25px';
	L_mailAlertDivTableTbody=CreateBody(L_mailAlertDiv_table,"","mailAlertDiv_table_tbody" );

	L_MA_tr_1_1   = CreateTR(L_mailAlertDivTableTbody,"","MA_tr_1_1");
	L_MA_td_1_1_1 = CreateTD(L_MA_tr_1_1,"" ,"MA_td_1_1_1" ,"","Left","","");
	L_MA_td_1_1_1.width='97%';
	L_MA_td_1_1_1.className = "cls_mailArrivedFont";
	CreateIMG(L_MA_td_1_1_1, "" , "", "/atCRM/images/mail/ico_markunread-old.gif", "", "", "","");
	L_msg=varMsg;
	L_span_msg1 = CreateSPAN(L_MA_td_1_1_1, "", "span_msg1", L_msg, "", "")
	
	L_MA_td_1_1_2 = CreateTD(L_MA_tr_1_1,"" ,"MA_td_1_1_2" ,"","right","","");
	L_MA_td_1_1_2.vAlign="middle";
	L_MA_td_1_1_2.width='3%';
	L_close_img = CreateIMG(L_MA_td_1_1_2, "" , "", "/atCRM/images/close.png", "", "", "","");
	L_close_img.style.height = '15px';
	L_close_img.style.width = '15px';
	AddClickEventListener(L_close_img,function(){hideMailDiv();document.getElementById("div_mailAlert").style.display="none"});
}

/*Function to Update the msg alert flg starts here */
function doUpateMsgAlert()
{
	L_action =  zcServletPrefix+"/custom/Messages/updateAlertTime.html?sid="+Math.random();
	$.ajax(
			{
				type: "POST",
				url:L_action,
				async: false,
				dataType: "html"
			}
		);
}
/*Function to Update the msg alert flg ends here */

function return4mSmartSuggest(elem,hiddFld)
{
	
	if(elem=="textbx_contactcttxt")
	{
		if(document.getElementById("pcrAcc_AccountId1").value=='')
		{
			hiddenFldval=document.getElementById("textbx_contactct").value; 
			hiddenFldval1= new Array();
			hiddenFldval1=hiddenFldval.split('::');
		
			document.getElementById("textbx_contactct").value=hiddenFldval1[0];
			document.getElementById("pcrAcc_AccountId1txt").value=hiddenFldval1[1];
			document.getElementById("pcrAcc_AccountId1txt").className="clas_txt_key_in_chng";

			document.getElementById("pcrAcc_AccountId1").value=hiddenFldval1[2];
			if(!hiddenFldval1[1])
			{
				document.getElementById("pcrAcc_AccountId1txt").value='Key in first two chars of Account';
				document.getElementById("pcrAcc_AccountId1txt").className="clas_txt_key_in";
				document.getElementById("pcrAcc_AccountId1").value=''
			}
			if(document.getElementById("textbx_contactct").value=='')
			{
				document.getElementById("pcrAcc_AccountId1txt").value='Key in first two chars of Account';
				document.getElementById("pcrAcc_AccountId1").value='';
			}
		}
		 else
		{
			hiddenFldval2=document.getElementById("textbx_contactct").value;
			hiddenFldval2array=new Array();
			hiddenFldval2array=hiddenFldval2.split('::');
			document.getElementById("textbx_contactct").value=hiddenFldval2array[0];
		}
	 }
	 if(elem=="pcrAcc_AccountId1txt")
	 {
		if((document.getElementById("textbx_contactcttxt").value!='')&&(document.getElementById("textbx_contactct").value!=''))
		{
		  document.getElementById("textbx_contactcttxt").value='';
		  document.getElementById("textbx_contactct").value='';
		}
	 }
	if(elem=="pcrAcc_NewAccountIdtxt")
	{
		
		var allValues=document.getElementById("pcrAcc_NewAccountId").value;
		allValues1=new Array();
        allValues1=allValues.split('(-)')
		document.getElementById("pcrAcc_NewAccountId").value=allValues1[0];
		document.getElementById("pcrAcc_City").value=allValues1[1];
		document.getElementById("pcrAcc_City").className="thickColorClass";
		if(!allValues1[1])
		{
		    document.getElementById("pcrAcc_City").value="City";
			document.getElementById("pcrAcc_City").className="thinColorClass";
		}
		document.getElementById("pcrAcc_Phone").value=allValues1[2];
		document.getElementById("pcrAcc_Phone").className="thickColorClass";
		if(!allValues1[2])
		{
		    document.getElementById("pcrAcc_Phone").value="Phone";
			document.getElementById("pcrAcc_Phone").className="thinColorClass";
		}

		document.getElementById("pcrAcc_Line1").value=allValues1[3];
		document.getElementById("pcrAcc_Line1").className="thickColorClass";		
		if(!allValues1[3])
		{
		    document.getElementById("pcrAcc_Line1").value="Line1";
			document.getElementById("pcrAcc_Line1").className="thinColorClass";
		}
		document.getElementById("pcrAcc_Line2").value=allValues1[4];
		document.getElementById("pcrAcc_Line2").className="thickColorClass";	  
        if(!allValues1[4])
		{
		    document.getElementById("pcrAcc_Line2").value="Line2";
			document.getElementById("pcrAcc_Line2").className="thinColorClass";
		}
		document.getElementById("pcrAcc_Pin").value=allValues1[5];
		document.getElementById("pcrAcc_Pin").className="thickColorClass";	 
        if(!allValues1[5])
		{
		    document.getElementById("pcrAcc_Pin").value="Pin";
			document.getElementById("pcrAcc_Pin").className="thinColorClass";	
        }
		document.getElementById("pcrAcc_AccountType").value=allValues1[6];
		document.getElementById("pcrAcc_AccountType").className="thickColorClass";
        if(!allValues1[6])
		{
		   document.getElementById("pcrAcc_AccountType").value="<Account Type>";
		   document.getElementById("pcrAcc_AccountType").className="thinColorClass";			
        }
		document.getElementById("Account_Save").style.display="none";		
		document.getElementById("Account_choose").style.display="block";
						
		if(document.getElementById("pcrAcc_NewAccountId").value=='')
		{
		   document.getElementById("Account_Save").style.display="block";
		   document.getElementById("Account_choose").style.display="none";
		}

		if(document.getElementById("pcrAcc_NewAccountId").value=='')
		{
		   document.getElementById("pcrAcc_City").value="City";
		   document.getElementById("pcrAcc_City").disabled=false;
		   document.getElementById("pcrAcc_City").className="thinColorClass";
		   document.getElementById("pcrAcc_Phone").value="Phone";
		   document.getElementById("pcrAcc_Phone").disabled=false;
		   document.getElementById("pcrAcc_Phone").className="thinColorClass";
		   document.getElementById("pcrAcc_Line1").value="Line1";
		   document.getElementById("pcrAcc_Line1").disabled=false;
		   document.getElementById("pcrAcc_Line1").className="thinColorClass";
		   document.getElementById("pcrAcc_Line2").value="Line2";
		   document.getElementById("pcrAcc_Line2").disabled=false;
           document.getElementById("pcrAcc_Line2").className="thinColorClass";
		   document.getElementById("pcrAcc_Pin").value="Pin";
	       document.getElementById("pcrAcc_Pin").disabled=false;
		   document.getElementById("pcrAcc_Pin").className="thinColorClass";
	       document.getElementById("pcrAcc_AccountType").disabled=false;
		   document.getElementById("pcrAcc_AccountType").style.color="black";
		} 
		else
		{
		   document.getElementById("pcrAcc_City").disabled=true;
		   document.getElementById("pcrAcc_Phone").disabled=true;
		   document.getElementById("pcrAcc_Line1").disabled=true;
		   document.getElementById("pcrAcc_Line2").disabled=true;
		   document.getElementById("pcrAcc_Pin").disabled=true;
		   document.getElementById("pcrAcc_AccountType").disabled=true;		  
		}
	}		  
	
	if(elem=="pcrCont_FirstNametxt")
	{
		if(document.getElementById("pcrCont_FirstName").value!="")
		{
			var allValuesFname=document.getElementById("pcrCont_FirstName").value;
			allValuesFname1=new Array();
			allValuesFname1=allValuesFname.split('::');
		    document.getElementById("pcrCont_FirstName").value=allValuesFname1[0];
		    document.getElementById("pcrAcc_AccountIdtxt").value=allValuesFname1[1];
		    document.getElementById("pcrCont_FirstName").value=allValuesFname1[0];
		    document.getElementById("pcrAcc_AccountIdtxt").style.color="black";
		    document.getElementById("pcrAcc_AccountId").value=allValuesFname1[2];
			if(!allValuesFname1[2] || allValuesFname1[2]=="undefined")
		    {
			   document.getElementById("pcrAcc_AccountIdtxt").value="Key in first two chars of Account.";
			   document.getElementById("pcrAcc_AccountIdtxt").disabled=true;
			   document.getElementById("pcrAcc_AccountIdtxt").style.color="#CC6633";
			}
			document.getElementById("pcrCont_FirstNametxt").value=allValuesFname1[3];
			document.getElementById("pcrCont_FirstNametxt").style.color="black";
		    if(!allValuesFname1[3])
		    {			   
				document.getElementById("pcrCont_FirstNametxt").value="First name";
				document.getElementById("pcrCont_FirstNametxt").style.color="LightGrey";			   
			}
			document.getElementById("pcrCont_LastName").value=allValuesFname1[4];
		    document.getElementById("pcrCont_LastName").style.color="black";
			 if(!allValuesFname1[4])
			 {
				 document.getElementById("pcrCont_LastName").value="Last name";
				 document.getElementById("pcrCont_LastName").disabled=true;
				 document.getElementById("pcrCont_LastName").style.color="LightGrey";
			 }		
			 document.getElementById("pcrCont_MobilePhone").value=allValuesFname1[5];
			 document.getElementById("pcrCont_MobilePhone").style.color="black";
			if(!allValuesFname1[5])
			{
				document.getElementById("pcrCont_MobilePhone").value="Mobile phone";
				document.getElementById("pcrCont_MobilePhone").disabled=true;
				document.getElementById("pcrCont_MobilePhone").style.color="LightGrey";
			}		 
		   document.getElementById("pcrCont_Email").value=allValuesFname1[6];
           document.getElementById("pcrCont_Email").style.color="black";
          
		  if(!allValuesFname1[6])
		  {
			document.getElementById("pcrCont_Email").value="Email";
			document.getElementById("pcrCont_Email").disabled=true;
			document.getElementById("pcrCont_Email").style.color="LightGrey";
		  }		  
		  document.getElementById("pcrCont_ContactType").value=allValuesFname1[7];
		  if(!allValuesFname1[7])
		  {
			document.getElementById("pcrCont_ContactType").value="<Contact Type>";
		  }	  
		  if(document.getElementById("pcrCont_FirstName").value=='')
		  {
			  document.getElementById("choose_cont").style.display="none";
			  document.getElementById("Contact_Part2_Save").style.display="block";
			  document.getElementById("pcrCont_LastName").disabled=false;
			  document.getElementById("pcrCont_Email").disabled=false;
			  document.getElementById("pcrCont_MobilePhone").disabled=false;
			  document.getElementById("pcrAcc_AccountIdtxt").disabled=false;
			  document.getElementById("pcrCont_ContactType").disabled=false;
			  document.getElementById("pcrCont_FirstNametxt").style.color="black";
		  }
		  else
		  {
			document.getElementById("pcrCont_LastName").disabled = true;
			document.getElementById("pcrCont_Email").disabled = true;
			document.getElementById("pcrCont_MobilePhone").disabled = true;
			document.getElementById("pcrAcc_AccountIdtxt").disabled = true;
			document.getElementById("pcrCont_ContactType").disabled = true;
			document.getElementById("Contact_Part2_Save").style.display="none";
			document.getElementById("choose_cont").style.display="block";
		  }
	}
	else
	{
		document.getElementById("pcrCont_LastName").value='Last name';
		document.getElementById("pcrCont_LastName").style.color="LightGrey";
		document.getElementById("pcrCont_LastName").disabled=false;
		document.getElementById("pcrCont_Email").disabled=false;
		document.getElementById("pcrCont_MobilePhone").disabled=false;
		document.getElementById("pcrAcc_AccountIdtxt").disabled=false;
		document.getElementById("pcrCont_ContactType").disabled=false;
		document.getElementById("pcrCont_Email").value='Email';
		document.getElementById("pcrAcc_AccountId").value='';
		document.getElementById("pcrCont_MobilePhone").value='Mobile phone';
		document.getElementById("pcrAcc_AccountIdtxt").value='Key in first two chars of Account';
		document.getElementById("pcrCont_ContactType").value='';
		document.getElementById("pcrCont_Email").style.color="#339966";
		document.getElementById("pcrAcc_AccountIdtxt").style.color="#CC6633";
		document.getElementById("pcrCont_MobilePhone").style.color="#339966";
		document.getElementById("Contact_Part2_Save").style.display="block";
		document.getElementById("choose_cont").style.display="none";

	}
  }
}

function chooseAccount()
{
	if(document.getElementById("contactContainer").style.display!="none")
	{
		document.getElementById("pcrAcc_AccountIdtxt").value=document.getElementById("pcrAcc_NewAccountIdtxt").value;
		document.getElementById("pcrAcc_AccountId").value=document.getElementById("pcrAcc_NewAccountId").value;
		document.getElementById("pcrAcc_AccountIdtxt").className="thinColorClass_mdt";
		$('#accountcontainerDiv').dialog('close');
	}
	else
	{		
		document.getElementById("pcrAcc_AccountIdtxt").className="thinColorClass_mdt";
		document.getElementById("pcrAcc_AccountId1txt").value=document.getElementById("pcrAcc_NewAccountIdtxt").value;
		document.getElementById("pcrAcc_AccountId1").value=document.getElementById("pcrAcc_NewAccountId").value;
		$('#accountcontainerDiv').dialog('close');
	}
}

/***####################FUNCTION TO CHECK THE RADIO BUTONS STARTS HERE#########################******/
function radCLicked()
{
	if(this.value == 0)
	{
		this.checked = true;
		document.getElementById("rad_appointment").checked=false;
	}
	if(this.value == 1)
	{
		this.checked = true;
		document.getElementById("rad_task").checked=false;
	}
}
/***####################FUNCTION TO CHECK THE RADIO BUTONS ENDS HERE  #########################******/

/****FUNCTION TO HIDE LEFT PANNEL STARTS HERE *********/
function hideLeftPannel(varBool)
{
	if(screen.width<=960){
		varBool=true;
	}

	if(varBool){
		if(document.getElementById("td_left_pannel"))
			document.getElementById("td_left_pannel").style.display='none';
	}
	else{
		if(document.getElementById("td_left_pannel"))
			document.getElementById("td_left_pannel").style.display='block';
	}
}
/****FUNCTION TO HIDE LEFT PANNEL ENDS HERE *********/
