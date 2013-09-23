$(document).ready(function () {

	//this will append scripts to body dynamically
 	addHomepageScripts();

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
  	.script(jsPath + "jquery-ui.min.js").wait()
  	.script(jsPath + "jquery/cjquery_unmin.js").wait()
  	
  	.script(jsPath + "jquery/jquery.ui.droppable.js").wait()
  	.script(jsPath + "jquery/jquery.ui.slider.js").wait()
  	.script(jsPath + "jquery/jquery.effects.core.js").wait()
  	.script(jsPath + "jquery/jquery.effects.slide.js").wait()
  	.script(jsPath + "jquery/jquery.ui.tabs.js").wait()

  	.script(jsPath + "jquery/flexigrid.js").wait()
  	.script(jsPath + "jquery/jquery.scrollabletab.js").wait()
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
  	.script(jsPath + "rept.js").wait()
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
  	.script(jsPath + "socket.io.min.js").wait()  	
  	.script(jsPath + "homePageFunctions.js").wait()
  	.wait(function () {
  	 
  	 //call webload on dom ready
 	 webload();	
 	 
 	 if(userType == "Call Center") 
 	 	showChangeCampaign();

	 var indexofdot= session_login_name.indexOf('.');
	 var user_name_for_Chat = session_login_name.substring(0, indexofdot != -1 ? indexofdot : session_login_name.length);
	 From_User = user_name_for_Chat.replace(/[^a-zA-Z0-9]/g,'_');
	 console.log(66);


	 $("a[rel=histroy]").live('click', function() {
			// 
			var hash = this.href;
			hash = hash.replace(/^.*#/, '');
			pageload(hash);
			// moves to a new page. 
			// // pageload is called at once. 
			// $j.history.load(hash);
			// alert(hash);
	});	

	 $('a.lineMnuLiAnc').live('click', function() {
	 	var hrf = $(this).attr('href');
	 	if(hrf.match(/#/g)) {
	 		hash = hrf.replace(/^.*#/, '');
			pageload(hash);
	 	}
	 	return;
	 });

  })
  	.script(jsPath + "impelChat.js").wait()  	

		
}