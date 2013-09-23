$(document).ready(function () {

	//this will append scripts to body dynamically
 	addHomepageScripts();

 	//alert(zcServletPrefix+"/custom/JSON/banner.html");


 
 


 /* end of document ready */
});

function addHomepageScripts() {
  /* using labjs library for syncronous scripts loading */
  var jsPath = "/atCRM/javascript/JSON/";
  $LAB
  	//.script(jsPath + "jquery-latest.min.js").wait()
  	.script(jsPath + "quickAddPopup.js").wait()
  	.script(jsPath + "contextualMenus.js").wait()
  	.script(jsPath + "jsonList.js?rn=1").wait()
  	.script(jsPath + "adhocList.js?rn=1").wait()
  	.script(jsPath + "adh360View.js?rn=1").wait()
  	.script(jsPath + "pageLevelFns.js?rn=1").wait()
  	.script(jsPath + "addEdit.js?rn=1").wait()
  	.script(jsPath + "view.js").wait()
  	.script(jsPath + "search.js?rn=1").wait()
  	.script(jsPath + "commonElementFunction.js").wait()
	.script(jsPath + "menu.js?rn=1").wait()
  	.script(jsPath + "pickList.js").wait()
  	.script(jsPath + "multiLvlPckList.js").wait()
  	.script(jsPath + "quickAdd.js").wait()
  	.script(jsPath + "dateFormat.js").wait()
  	.script(jsPath + "utils.js?rn=1").wait()
  	.script(jsPath + "json2_1.js").wait()
  	.script(jsPath + "validations.js?rn=1").wait()
  	.script(jsPath + "linkList.js").wait()
  	.script(jsPath + "invoiceWizardAddEdit.js").wait()
  	.script(jsPath + "filter.js").wait()
  	.script(jsPath + "smartsuggestNew.js").wait()
  	.script(jsPath + "dashBoard.js?r=2").wait()
  	.script(jsPath + "jQueryHistoryNew.js?rn=1").wait()
  	.script(jsPath + "pointsOnMap.js").wait()
  	.script(jsPath + "date-time-validation.js").wait()
  	.script(jsPath + "report-a-bug.js").wait()
  	.script(jsPath + "addEditTemplates.js").wait()
  	.script(jsPath + "jquery-migrate-1.2.1.js").wait()
  	.script(jsPath + "jquery/cjquery_unmin.js").wait()
  	.script(jsPath + "jquery-ui.min.js").wait()
  	.script(jsPath + "jquery/jquery.ui.droppable.js").wait()
  	.script(jsPath + "jquery/jquery.ui.slider.js").wait()
  	.script(jsPath + "jquery/jquery.effects.core.js").wait()
  	.script(jsPath + "jquery/jquery.effects.slide.js").wait()
  	.script(jsPath + "jquery/jquery.scrollabletab.js").wait()
  	.script(jsPath + "jquery/jquery.ui.tabs.js").wait()
  	.script("/atCRM/javascript/descriptor.js").wait()
  	.script("/atCRM/javascript/dateValidate.js").wait()
  	.script("/atCRM/javascript/custom/advancedAdd/Activity.js").wait()
  	.script("/atCRM/javascript/validate.js").wait()
  	.script(jsPath + "ckeditor/ckeditor.js").wait()
  	.script("/atCRM/javascript/runReportJ.js").wait()
  	.script("/atCRM/javascript/jquery/jquery.dataTables.js").wait()
  	.script("/atCRM/javascript/hc/js/highcharts.js").wait()
  	.script("/atCRM/javascript/hc/js/modules/exporting.js").wait()
  	.script("/atCRM/javascript/jquery/funnel.src.js").wait()
  	.script("/atCRM/javascript/jquery/pivot/accounting.min.js").wait()
  	.script("/atCRM/javascript/jquery/pivot/subnav.js").wait()
  	.script("/atCRM/javascript/jquery/pivot/pivot.js").wait()
  	.script("/atCRM/javascript/jquery/pivot/jquery_pivot.js?r=2").wait()
  	.script("/atCRM/javascript/jquery/pivot/dataTables.bootstrap.js").wait()
  	.script("/atCRM/javascript/jquery/pivot/jquery.dataTables.min.js").wait()
  	.script(jsPath + "k_pivot.js").wait()
  	.script("/atCRM/javascript/jquery/ZeroClipboard.js").wait()
  	.script("/atCRM/javascript/jquery/TableTools.js").wait()
  	.script("/atCRM/javascript/jquery/ColReorderWithResize.js").wait()
  	.script(jsPath + "jquery/jquery.hoverIntent.js?nv=1").wait()
  	.script("/atCRM/javascript/jquery/FixedColumns.js").wait()
  	.script(jsPath + "jquery/jquery.layout.js").wait()
  	.script("/atCRM/javascript/changePageLayout.js").wait()
  	.script(jsPath + "jquery/jquery.window.js").wait()
  	.script(jsPath + "reminders.js").wait()
  	.script("http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&key=AIzaSyAFeVSvJqCa9vaqGZWHCBHWQDf_s3_IXCM").wait()
  	.script(jsPath + "markerclusterer.js").wait()
  	.script("/atCRM/javascript/jquery/tree.jquery.js").wait()
  	.script(jsPath + "rept.js").wait()
  	.script(jsPath + "socket.io.min.js").wait()
  	.script(jsPath + "impelChat.js").wait()
  	.script(jsPath + "homePageFunctions.js").wait()
  	.wait(function () {
  	 
  	 //call webload on dom ready
 	 webload();	
 	 
 	 if(userType == "Call Center") 
 	 	showChangeCampaign();

	 var indexofdot= session_login_name.indexOf('.');
	 var user_name_for_Chat = session_login_name.substring(0, indexofdot != -1 ? indexofdot : session_login_name.length);
	 From_User = user_name_for_Chat.replace(/[^a-zA-Z0-9]/g,'_');
  	})
		/*

//concatenate all the script tags in a single string and finally append it to body
	var scripts = '';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/quickAddPopup.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/contextualMenus.js"></script>';	
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jsonList.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/adhocList.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/adh360View.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/pageLevelFns.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/addEdit.js?rn=1"></script> ';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/view.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/search.js?rn=1" ></script> ';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/commonElementFunction.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/menu.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/pickList.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/multiLvlPckList.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/quickAdd.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/dateFormat.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/utils.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/json2_1.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/validations.js?rn=1"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/linkList.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/invoiceWizardAddEdit.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/filter.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/simpleJSONlist.js"></script>	';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/smartsuggestNew.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/dashBoard.js?r=2"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jQueryHistoryNew.js?rn=1" ></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/pointsOnMap.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/date-time-validation.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/report-a-bug.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/addEditTemplates.js"></script>';
		// scripts += '<script src="/atCRM/javascript/JSON/jquery-migrate-1.2.1.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/cjquery_unmin.js"></script>';
		// scripts += '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>';
		
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/flexigrid.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.ui.droppable.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.ui.slider.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.effects.core.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.effects.slide.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.scrollabletab.js"></script>';
		scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.ui.tabs.js"></script>';
		
		$('body').append(scripts);

		var scripts = '';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/descriptor.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/dateValidate.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/custom/advancedAdd/Activity.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/validate.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/ckeditor/ckeditor.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/runReportJ.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/jquery.dataTables.js"></script>';
		// scripts += '<script src="/atCRM/javascript/hc/js/highcharts.js"></script>';
		// scripts += '<script src="/atCRM/javascript/hc/js/modules/exporting.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/funnel.src.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/accounting.min.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/subnav.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/pivot.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/jquery_pivot.js?r=2"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/dataTables.bootstrap.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/pivot/jquery.dataTables.min.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/k_pivot.js"></script>';		
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/ZeroClipboard.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/TableTools.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/ColReorderWithResize.js"></script>';
		// scripts += '<script src="/atCRM/javascript/JSON/jquery/jquery.hoverIntent.js?nv=1" type="text/javascript"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/jquery/FixedColumns.js"></script>';
		// scripts += '<script src="/atCRM/javascript/JSON/jquery/jquery.layout.js" type="text/javascript"></script>';
		// scripts += '<script src="/atCRM/javascript/changePageLayout.js" type="text/javascript"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.window.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/reminders.js"></script>';
		// scripts += '<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&key=AIzaSyAFeVSvJqCa9vaqGZWHCBHWQDf_s3_IXCM"></script>';
		// scripts += '<script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>';
		// scripts += '<script src="/atCRM/javascript/jquery/tree.jquery.js"></script>';
		// scripts += '<script type="text/javascript" src="/atCRM/javascript/JSON/rept.js"></script>';
		// scripts += '<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.10/socket.io.min.js"></script>';


		//now append to body
		try {
			$('body').append(scripts);
		}
		catch(e) {
			alert('Unable to append scripts dynamically!!-->' + e);
		}
		
*/
}