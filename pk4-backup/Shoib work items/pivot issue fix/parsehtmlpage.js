 /* 
	* this function will return the final html page to be shown
	* accepts url, loads it, parses it and returns
 */
 var notAllowedTags = ['meta', 'title']; //tags which are not allowed to parse
 
 var loadedScriptsAndStyles = ['jquery.alerts.css','favicon.ico','x-icon','jquery.alerts.css','ui.core.css','ui.tabs.css','ui.theme.css','jquery.dataTables.css','subnav.css','bootstrap.min.css','pivot.css','TableTools.css','TableTools_JUI.css','jquery-ui-1.8.21.custom.css','jquery.impromptu.css','eDash.css','smartSuggest.css','main.css?rn=4','quickAdd.css','flexigrid.css?rn=4','stylish-select.css','fly.css','jquery.ui.all.css','general.css?rn=3','common.css?rn=2','jquery.window.css','k_pivot.css','jquery-latest.min.js','LAB.min.js','homepage.js','quickAddPopup.js','contextualMenus.js','jsonList.js?rn=1','adhocList.js?rn=1','adh360View.js?rn=1','pageLevelFns.js?rn=1','addEdit.js?rn=1','view.js','search.js?rn=1','commonElementFunction.js','menu.js?rn=1','pickList.js','multiLvlPckList.js','quickAdd.js','dateFormat.js','utils.js?rn=1','json2_1.js','validations.js?rn=1','linkList.js','invoiceWizardAddEdit.js','filter.js','smartsuggestNew.js','dashBoard.js?r=2','jQueryHistoryNew.js?rn=1','pointsOnMap.js','date-time-validation.js','report-a-bug.js','addEditTemplates.js','jquery-migrate-1.2.1.js','jquery-ui.min.js','cjquery_unmin.js','jquery.ui.droppable.js','jquery.ui.slider.js','jquery.effects.core.js','jquery.effects.slide.js','jquery.ui.tabs.js','flexigrid.js','jquery.scrollabletab.js','descriptor.js','dateValidate.js','Activity.js','validate.js','ckeditor.js','runReportJ.js','jquery.dataTables.js','highcharts.js','exporting.js','funnel.src.js','accounting.min.js','subnav.js','pivot.js','jquery_pivot.js?r=2','dataTables.bootstrap.js','jquery.dataTables.min.js','k_pivot.js','rept.js','ZeroClipboard.js','TableTools.js','ColReorderWithResize.js','jquery.hoverIntent.js?nv=1','FixedColumns.js','jquery.layout.js','changePageLayout.js','jquery.window.js','reminders.js','js?libraries=places&sensor=false&key=AIzaSyAFeVSvJqCa9vaqGZWHCBHWQDf_s3_IXCM','markerclusterer.js','tree.jquery.js','socket.io.min.js','homePageFunctions.js','impelChat_client.js'];
 
 function getParsedHtmlPage(url) {
	$.get(uri, function(htmlStr) {
	 	
	 	var tempCont = $('<div></div>'); //used to convert html str to html nodes
	 		tempCont.append(htmlStr); //here str added
	 	var html = tempCont.children(); //here take as html nodes

	 	var htmlNodesContainer = $('<div></div>'); //temporary storage element

	 		$.each(html, function(k,v) {
	 			var nv = v['nodeName'].toLowerCase(); //node name like link, script etc
	 			if($.inArray(nv, notAllowedTags) == -1) {
	 				if(nv == 'script') { 
	 					var srcFlg = 0;
	 					var att = v['attributes'];
	 					$.each(att, function(k1,v1) {
	 						if(v1['nodeName'] == 'src') {
	 							var sr = v1['src'].split('/');
	 							var sr = sr.pop();
	 							if($.inArray(sr, loadedScriptsAndStyles) != -1) {
	 								srcFlg = 1; //if script found set flag to 1
	 							}
	 							
	 						}	 							
	 					});
	 					if(srcFlg == 0) 
	 						htmlNodesContainer.append(v); //add to container
	 				}
	 				if(nv == 'link') {
	 					var lnkFlg = 0;
	 					var lnk = v['attributes'];
	 					$.each(att, function(k1,v1) {
	 						if(v1['nodeName'] == 'href') {
	 							var paths = v1['href'].split('/'); //paths arr
	 							var fn = paths.pop(); // file name
	 							if($.inArray(fn, loadedScriptsAndStyles) != -1) {
	 								lnkFlg = 1; //if script found set flag to 1
	 							}
	 							
	 						}	 							
	 					});
	 					if(srcFlg == 0) 
	 						htmlNodesContainer.append(v); //add container
	 				}
	 				else {
	 					htmlNodesContainer.append(v);
	 				}
	 			}
	 		});

	 		return htmlNodesContainer;
	 });
 }