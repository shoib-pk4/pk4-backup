function validateFormFldsForFinance () {
	var postFlag = false;
	$('#addEditForm tbody#listItemsTableBody tr').each(function() {
		var rowValidFlg = false
		//check for mandatory fields
		$(this).find('input[type=text]').each(function() {
			if($(this).val() != '') {
				rowValidFlg = true; //set current 
				postFlag = true; //this means form content has something to post
			}	
		});

		//this will mark rows tr's to submit
		if(rowValidFlg == false) { 
			$(this).find('input[type=text]').css('border','solid 1px red');			
			$(this).addClass('dontSubmit');
		} else {
			$(this).removeClass('dontSubmit').addClass('toSubmit');
		}
		
	});

	//return true if any row found to post
	if(postFlag == true) {
		return true;
	}	
	else {
		$('#addEditForm tbody#listItemsTableBody tr').find('input[type=text]').css('border','solid 1px red');
		return false;
	}	
	
		
}



//post data
function submitFinanceAddEditForm(formSubmitPostFun,isAddNew)
{
	console.log('form submit');

	document.getElementById('addEditErrorDiv').style.display="none";

	//prepare post fields
	//
	//remove unwanted rows from the fields
	var flds2Submit = {}, fldId,fldVal,rowInd;
	$('#addEditForm tbody#listItemsTableBody tr.toSubmit').each(function() {		
		rowInd = $(this).index();
		fldId = '0-1:'+rowInd+'-101-102';
		flds2Submit[fldId] = "";
		$(this).find('.inputFieldClass').each(function() {
			fldId  = $(this).attr('id');
			fldVal = $(this).val();
			flds2Submit[fldId] = fldVal.replace(/(\r\n|\n|\r|\s)/gm,""); //remove unwanted chars;
		});
	});


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