$(document).ready(function () {

	//this will append scripts to body dynamically
 	addHomepageScripts();

 /* end of document ready */
});

/* 
  * note whenever you add or remove any new script here, dont forget to edit in loadedScriptsAndStyles arr which is in
  * homepagefunctions.js
*/
function addHomepageScripts() {
  /* using labjs library for syncronous scripts loading */
  var jsPath = "/atCRM/javascript/JSON/";
  $LAB
  	.script(jsPath + "quickAddPopup.js")
  	.script(jsPath + "contextualMenus.js")
  	.script(jsPath + "jsonList.js?rn=1")
  	.script(jsPath + "adhocList.js?rn=1")
  	.script(jsPath + "adh360View.js?rn=1")
  	.script(jsPath + "pageLevelFns.js?rn=1")
  	.script(jsPath + "addEdit.js?rn=1")
  	
  	.script(jsPath + "view.js")
  	.script(jsPath + "search.js?rn=1")
  	.script(jsPath + "commonElementFunction.js")
	  .script(jsPath + "menu.js?rn=1")
  	.script(jsPath + "pickList.js")
  	
  	.script(jsPath + "multiLvlPckList.js")
  	.script(jsPath + "quickAdd.js")
  	.script(jsPath + "dateFormat.js")
  	.script(jsPath + "utils.js?rn=1")
  	.script(jsPath + "json2_1.js")
  	.script(jsPath + "validations.js?rn=1")
  	
  	.script(jsPath + "linkList.js")
  	.script(jsPath + "invoiceWizardAddEdit.js")
  	.script(jsPath + "filter.js")
  	.script(jsPath + "smartsuggestNew.js")
  	.script(jsPath + "dashBoard.js?r=2")
  	.script(jsPath + "jQueryHistoryNew.js?rn=1")
  	.script(jsPath + "pointsOnMap.js")
  	.script(jsPath + "date-time-validation.js")
  	
  	.script(jsPath + "report-a-bug.js")
  	.script(jsPath + "addEditTemplates.js")
  	
  	.script(jsPath + "jquery-migrate-1.2.1.js").wait()
  	.script(jsPath + "jquery-ui.min.js").wait()
  	.script(jsPath + "jquery/cjquery_unmin.js").wait()
  	
  	.script(jsPath + "jquery/jquery.ui.droppable.js")
  	.script(jsPath + "jquery/jquery.ui.slider.js")
  	.script(jsPath + "jquery/jquery.effects.core.js")
  	.script(jsPath + "jquery/jquery.effects.slide.js")
  	.script(jsPath + "jquery/jquery.ui.tabs.js")
    .script(jsPath + "jquery/jquery.ui.dialog.js")

  	.script(jsPath + "jquery/flexigrid.js")
  	.script(jsPath + "jquery/jquery.scrollabletab.js")
  	.script("/atCRM/javascript/descriptor.js")
  	.script("/atCRM/javascript/dateValidate.js")
  	.script("/atCRM/javascript/custom/advancedAdd/Activity.js")
  	.script("/atCRM/javascript/validate.js")
  	.script(jsPath + "ckeditor/ckeditor.js")
  	
  	.script("/atCRM/javascript/runReportJ.js")
  //http://datatables.net/media/javascript/complete.min.js
  	.script("/atCRM/javascript/jquery/jquery.dataTables.js")
  .script("/atCRM/javascript/jquery/FixedHeader.min.js")
    // .script("http://datatables.net/release-datatables/extras/TableTools/media/js/TableTools.min.js")
    
  	.script("/atCRM/javascript/hc_3.0.5/js/highcharts.js")
    .script("/atCRM/javascript/hc_3.0.5/js/highcharts-more.js")
  	.script("/atCRM/javascript/hc_3.0.5/js/modules/exporting.js")
  	.script("/atCRM/javascript/hc_3.0.5/js/modules/funnel.src.js")
  	
    .script(jsPath + "k_pivot.js")
  	.script("/atCRM/javascript/jquery/pivot/accounting.min.js")
  	.script("/atCRM/javascript/jquery/pivot/subnav.js")
  	// .script("http://nicolaskruchten.github.io/pivottable/examples/pivot.js")
  	.script("/atCRM/javascript/jquery/pivot/jquery_pivot.js?r=2")
  	.script("/atCRM/javascript/jquery/pivot/dataTables.bootstrap.js")
  	//.script("/atCRM/javascript/jquery/pivot/jquery.dataTables.min.js")
  	
  	.script(jsPath + "rept.js")
    .script(jsPath + "l2.js")
  	.script("/atCRM/javascript/jquery/ZeroClipboard.js")
  	
  	.script("/atCRM/javascript/jquery/TableTools.js")
  	.script("/atCRM/javascript/jquery/ColReorderWithResize.js")
  	.script(jsPath + "jquery/jquery.hoverIntent.js?nv=1")
  	.script("/atCRM/javascript/jquery/FixedColumns.js")
  	.script(jsPath + "jquery/jquery.layout.js")
  	.script("/atCRM/javascript/changePageLayout.js")
  	.script(jsPath + "jquery/jquery.window.js")
  	
  	.script(jsPath + "reminders.js")
  	.script("http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&key=AIzaSyAFeVSvJqCa9vaqGZWHCBHWQDf_s3_IXCM")
  	.script(jsPath + "markerclusterer.js")
  	.script("/atCRM/javascript/jquery/tree.jquery.js")
  	.script(jsPath + "socket.io.min.js")  	
  	.script(jsPath + "homePageFunctions.js")

  	.wait(function () {
  	 
  	 //call webload on dom ready
 	   webload();	
 	 
   	 if(userType == "Call Center") 
   	 	showChangeCampaign();

  	 // on click of anchor element
     var tempTabId;
  	 $("body").on('click', 'a[rel=histroy], .lineMnuLiAnc', function() {

        if($(this).hasClass('mnuSpan')) {
          var id = $(this).attr('id').split('_');
          tempTabId = id[1];
        }
  			
        var hash = $(this).attr('href'); //used to check if it contains javascript
         /* change page loading logic, I guess i am doing wrong: shoib*/
        if(!hash.match('javascript') && hash.match('\\?')) {         
          hash = this.href;
    			hash = hash.replace(/^.*#/, '');          
    			pageload(hash);
        }
  	 });

    //  on mouseenter show sublevel menus based
     $("body").on('mouseenter', 'a.mnuSpan', function() {
        if(tempTabId == undefined)     {
          var id = $('.firstLevelMenu_current').attr('id').split('_');
          id = id[1]; 
          tempTabId = id; // saving global var
        }
        var cid = $(this).attr('id').split('_');
            cid = cid[1];
        $('.secondLevelMenu_ul').css('display', 'none'); //first display none all
        var subId = 'secondLevelMenuUL_'+cid; 
        //then show current hover tab
        $('#'+subId).css('display', 'block');        
     });
     
     //roll back mouseenter action, on mouseleave
     $("body").on('mouseleave', '#pageContent #menuTable', function() {  
       if(tempTabId != undefined)     {
        $('.secondLevelMenu_ul').css('display', 'none'); //first display none all
        var subId = 'secondLevelMenuUL_'+tempTabId; 
        //then show current hover tab
        $('#'+subId).css('display', 'block');        
       }        
     });

     //if moused over on first tr then roll back mouseenter event on menu
     $("body").on('mouseover', '#pageContent #menuTable tr:first-child', function() {  
       if(tempTabId != undefined)     {
        $('.secondLevelMenu_ul').css('display', 'none'); //first display none all
        var subId = 'secondLevelMenuUL_'+tempTabId; 
        //then show current hover tab
        $('#'+subId).css('display', 'block');        
       }        
     });

     //user clicks on second level child,then update its 
     //first level tab status
     $('body').on('click', '.secondLevelMenu_li', function() {
        var cid = $(this).parent().attr('id').split('_');
            cid = cid[1];
            tempTabId = cid;
          //remove class from selected element
          $('.firstLevelMenu_current').addClass('firstLevelMenu_li').removeClass('firstLevelMenu_current');
          //now add to the clicked element
          $('#mnuList_'+cid).addClass('firstLevelMenu_current');
     });


     From_User = session_login_name;

  })
  	.script("/atCRM/nodeJSFiles/multychat/impelChat_client.js").wait()  
    .script(jsPath + "jquery/jquery.1.10.3.ui.js")  	
    .script(jsPath + "jquery/jquery.cookie.js")
    .script(jsPath + "mAdd.js")
    .script(jsPath + "l_add.js")
    
    
    	
}