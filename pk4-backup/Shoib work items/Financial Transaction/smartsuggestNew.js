var field = "";
var sugg_div ;
var sugg_list ;
var sugg_src ;
var selectedIndex = 0;
var L_sugg_text;

function hideDiv()
{
	sugg_div.style.display='none';
}

function AutoSuggest(divName,elem,suggestionsVal,entt)
{
	if(divName == 'smartDialog') 
	{	
		var stringToDisplay='';
		for (x in suggestionsVal)
		{
			var smartSuggestString=suggestionsVal[x].split('--');
				stringToDisplay+="<div class='sujjestDiv' style='background-color: #FFFD6B;'><h5>"+smartSuggestString[0]+"</h5></div>";
		}
		var x=findPosOfObj(elem)[0];
		if( x >= ($(document).width())*(0.6) ) x-=450;
		else x+=250;
		$("#smartDialog").dialog({
									title:"Matching Items",
									position: [x,100],
									minHeight: 'auto',
									resizable: false
								}); 
		$("#smartDialog").dialog().css( { 'max-height' : '450px' } );
		if($(elem).val() == '')
		{
			$("#smartDialog").closest('.ui-dialog').hide(); 
		}
		else
		{	
			$("#smartDialog").closest('.ui-dialog').show();
			$(elem).focus();
			if(suggestionsVal == '')$("#smartDialog").html("<div class='sujjestDiv' style='background-color:#FFD519;border:1px solid #FF4F4F;'><h5>No similar item(s) found..</h5></div>");
			else
			{
				$("#smartDialog").html(stringToDisplay);
			}	
		}
	}
	else
	{
		if (elem.addEventListener) {
		elem.addEventListener("blur", hideDiv, false);
		} else if (elem.attachEvent) {
			elem.attachEvent("onblur", hideDiv);
		}
	
		var suggestion = true;
		field = document.getElementById(elem.id);	
		var classInactive = "sf_inactive";
		var classActive = "sf_active";
		var classText = "sf_text";
		var classSuggestion = "sf_suggestion";
		field.c = field.className;		
		field.className = field.c + " " + classInactive;
		if (suggestion){
			field.setAttribute("autocomplete", "off");
			sugg_div  = document.getElementById(divName);
			if(!sugg_list)
			{
				sugg_list = document.createElement("ul");
			}
			sugg_list.style.display = "block";
			document.getElementById(divName).style.display = 'block';
			sugg_div.className = classSuggestion;
			if(field.offsetWidth>0)
			sugg_list.style.width = field.offsetWidth + 50 + "px";
			sugg_div.appendChild(sugg_list);
	
			//if(divName=='smartSuggestDiv'||divName=='multiSelectSugg'||divName=='smartFill'){
				//var x=findPosOfObj(elem)[0];
				//var y=findPosOfObj(elem)[1];
				//sugg_div.style.left=x+"px";
				//sugg_div.style.top=y+20+"px";

			   var position=$(elem).offset();
			   var topPos=position.top;
			   topPos +=25;
			   var leftPos=position.left;
               $(sugg_div).offset({top:topPos,left:leftPos});
			//}else{field.parentNode.appendChild(sugg_div);}
	
	
		L_sugg_text = suggestionsVal ;
		if(L_sugg_text  == "")
		{
			if(!sugg_list)
			{
				sugg_list = document.createElement("ul");
			}
			resetList();
			sugg_list.style.display = "block";
			document.getElementById(divName).style.display = 'block';
				sugg_list.innerHTML+="<li><a href='' style='color:#FF0000'>No matches</a></li>";
			switch(entt)
			{
				case "Account":
						sugg_list.innerHTML+="<li onmousedown='showAQDialog(\"ACCT\",\"\",\"\",\"\",\"\",\""+elem.id+"\")'><a style='color:#0071E1;text-decoration:underline'>Create a new Account</a></li>";
						break;
				case "Contact":
						sugg_list.innerHTML+="<li onmousedown='showAQDialog(\"CONCT\",\"\",\"\",\"\",\"\",\""+elem.id+"\")'><a style='color:#0071E1;text-decoration:underline'>Create a new Contact</a></li>";
						break;
				default:				
						sugg_list.innerHTML+="<li onmousedown='showAQDialog(\"Vehicle\",\"\",\"\",\"\",\"\",\""+elem.id+"\")'><a style='color:#0071E1;text-decoration:underline'>Create new "+entt+"</a></li>";
						break;
			}
	
			field.onkeydown = function(e){
			var key = getKeyCode(e);
			if( key == 33 || key ==   34  || key == 36  || key == 18 || key ==  17)
				{
				return;
				}
	
				switch(key){
				case 27:  // esc
				//case 9:  // tab
					//field.value = "";
					selectedIndex = 0;
					sugg_list.style.display = "none";
					document.getElementById(divName).style.display = 'none';
					break;				
				};
			};
	
			return false;
		} 
	
	
			startList(suggestionsVal ,elem,divName);			
		
			//field.parentNode.appendChild(sugg_div);	
			
			field.onkeydown = function(e){
			var key = getKeyCode(e);
			if( key == 33 || key ==   34  || key == 36  || key == 18 || key ==  17)
				{
				return;
				}
	
				switch(key){
				case 13: //enter key			
					selectList(elem,divName);
					$(elem).blur();
					return false;
					break;
				case 9:  // tab	
				//alert(155)
					selectList(elem,divName);
					$(elem).blur();
					//return false;
					break;			
				case 27:  // esc
					//field.value = "";
					selectedIndex = 0;
					clearList(divName,elem);
					break;				
				case 38: // up
					navList("up");
					break;
				case 40: // down
					navList("down");		
					break;
				default:
					startList(suggestionsVal ,elem,divName);			
					break;
				};
			};
		};
	}
};

	 function startList(varSuggestionsVal,elem,divName){
		var sugg_arr = getListItems(field.value,varSuggestionsVal);
		if(field.value.length > 0){
			createList(sugg_arr,elem,divName);
		} else {
			clearList(elem,divName);
		};	
	};
			
			function getListItems(value,varSuggestionsVal){
				var sugg_arr = new Array();
				var sugg_src =varSuggestionsVal;
				var arrSrc1 = new Array();
				var arrSrc1 = sugg_src;
				for(i=0;i<arrSrc1.length;i++)
				{
					sugg_arr.push(arrSrc1[i]);
				};		
				return sugg_arr;
			};
			
			function createList(sugg_arr,elem,divName){	
				resetList();
				if(eval(document.getElementById("cmb_search_id")))
				{
					L_sugg_cmb = document.getElementById("cmb_search_id");
				}
				else
				{
					L_sugg_cmb = document.createElement("select");
					L_sugg_cmb.setAttribute("id","cmb_search_id");
				}
				L_sugg_cmb.length = sugg_arr.length;
				L_sugg_cmb.style.display='none';
				
				if(sugg_arr.length > 0) {

					for(i=0;i<sugg_arr.length;i++){				
						li = document.createElement("li");
						a = document.createElement("a");
						a.href = "javascript:void(0);";
						
						a.i = i+1;
						L_value_arr  =sugg_arr[i].split("--");
						
						key = elem.value;
						key  = key.toLowerCase();
						suggestion = L_value_arr[0]
						L_search_str = key;
						l_chk_flg = suggestion.toLowerCase().indexOf(L_search_str);
						if(l_chk_flg >= 0 )
						{
							suggestion = suggestion.substring(0,(suggestion.toLowerCase().indexOf(key)))+"<font style='font-weight:bold;' >"+suggestion.substring((suggestion.toLowerCase().indexOf(key)),(suggestion.toLowerCase().indexOf(key)+key.length))+"</font>"+suggestion.substring((suggestion.toLowerCase().indexOf(key)+key.length),suggestion.length);
						}
						else
						{
							l_chk_flg = -1;
						}
						if((L_value_arr[2]&&L_value_arr[2]!="")||(L_value_arr[3]&&L_value_arr[3]!="") || (L_value_arr[4]&&L_value_arr[4]!="")){
							suggestion+="<br/><font style='font-size:9px;'>";
							if(L_value_arr[2]&&L_value_arr[2]!=""){
								suggestion+=L_value_arr[2];
							}
							if((L_value_arr[2]&&L_value_arr[2]!="")&&(L_value_arr[3]&&L_value_arr[3]!="")){
								suggestion+=" | "+L_value_arr[3];
							}
							if((L_value_arr[3]&&L_value_arr[3]!="")&&(L_value_arr[4]&&L_value_arr[4]!="")){
								suggestion+=" | ";
							}
							if(L_value_arr[4]&&L_value_arr[4]!=""){
								suggestion+=L_value_arr[4];
							}
							suggestion+="</font>";
						}
						a.innerHTML = suggestion;
						if(divName=='mailSmartSuggestDiv')
							L_sugg_cmb.options[i].text = L_value_arr[0]+' <'+L_value_arr[2]+'>';
						else
							L_sugg_cmb.options[i].text = L_value_arr[1];

						L_sugg_cmb.options[i].value = L_value_arr[0];
						sugg_list.appendChild(L_sugg_cmb);
						
						li.i = i+1;
						
						li.onmouseover = function(){
							navListItem(this.i);
						};
						a.onmousedown = function(){
							selectedIndex = this.i;
							selectList(elem,divName);
								$(elem).blur();		
							return false;
						};					
						
						li.appendChild(a);
						
						sugg_list.setAttribute("tabindex", "-1");
						sugg_list.appendChild(li);	
						
						//If only one item found select it automatically
						//if(sugg_arr.length=="1")$(a).mousedown();						
					};	
					sugg_list.style.display = "block";				
				} else {
					clearList(elem,divName);
				};
			};	
			

			function resetList()
			{
				if(sugg_list)
				{
					var li = sugg_list.getElementsByTagName("li");
					var len = li.length;
					for(var i=0;i<len;i++)
					{
						sugg_list.removeChild(li[0]);
					};
					sugg_list.innerHTML = "";
				 }
				 //L_sugg_text="";
			};
			
			function navList(dir)
			{	
				selectedIndex += (dir == "down") ? 1 : -1;
				li = sugg_list.getElementsByTagName("li");
				if (selectedIndex < 1) selectedIndex =  li.length;
				if (selectedIndex > li.length) selectedIndex =  1;
				navListItem(selectedIndex);
			};
			
			function navListItem(index){	
				selectedIndex = index;
				li = sugg_list.getElementsByTagName("li");
				for(var i=0;i<li.length;i++)
					{
						li[i].className = (i==(selectedIndex-1)) ? "selected" : "";
					};
			};
			
			function selectList(elem,divName)
			{
				if(selectedIndex <= 0 )
				{
					return false;
				}

				li = sugg_list.getElementsByTagName("li");	
				a = li[selectedIndex-1].getElementsByTagName("a")[0];
				L_field_id_val = document.getElementById("cmb_search_id").options[selectedIndex-1].text;

				L_field_id  =  field.id;
				L_field_id_arr = L_field_id.split("txt");

				if(divName=='smartFill' || divName=='mappedSmartFill' || divName=='mappedSmartFillWiz')
					L_field_id = document.getElementById(L_field_id+'hdn');
				else
					L_field_id = document.getElementById(L_field_id_arr[0]);

				if(divName=='mailSmartSuggestDiv')
				{
					var oldSelection=L_field_id.value;
					oldSelectionArr1=oldSelection.split(',');
					lastOldSelection1=oldSelectionArr1[oldSelectionArr1.length-1];
					oldSelectionRes=oldSelection.replace(","+lastOldSelection1, "; ");

					oldSelectionArr2=oldSelectionRes.split(';');
					lastOldSelection2=oldSelectionArr2[oldSelectionArr2.length-1];
					oldSelection=oldSelection.replace(";"+lastOldSelection2, "; ")

					if(oldSelectionArr1.length==1 && oldSelectionArr2.length==1)
						oldSelection='';

					L_field_id.value = oldSelection+L_field_id_val+"; ";
				}else
				{
					L_field_id.value = L_field_id_val;
					field.value = document.getElementById("cmb_search_id").options[selectedIndex-1].value;
				}

				clearList(elem,divName);
			};	

	function clearList(elem,divName)
	{
		if(sugg_list)
			{
				sugg_list.style.display = "none";
				selectedIndex = 0;
				resetList();
				//this.hideDiv();
			};

			this.elem = elem;
			this.div = divName;
			
			if(this.elem.value == "")
			{
				return false;
			}
			
			//this.div.style.display = 'none';
			this.highlighted = -1;
			temp1=this.elem.name;
			if(temp1){
				index1=temp1.indexOf("txt");
				hiddFld=temp1.substr(0,index1);
				
				if(divName=='smartFill')
				{
					blockObjectRelatedFields(this.elem.name,this.elem.name+'hdn');
				}
				else if(divName=='mappedSmartFill')
				{
					blockMappedObjectFields(this.elem.name,this.elem.name+'hdn');
				}
				else if(divName=='mappedSmartFillWiz')
				{
					 blockMappedObjectFields4Wizard(this.elem.name,this.elem.name+'hdn');
				}
				else if(divName=='multiSelectSugg')
				{
					callMultiSelect(this.elem.name,hiddFld);
				}
				else
				{
					try
					{	
						ToFillContextualPages();
						smartAddView(hiddFld,'view');
						return4mSmartSuggest(this.elem.name,hiddFld);
					}
					catch (e)
					{
					}
				}
			}
	};		
	
	function getKeyCode(e){
		var code;
		if (!e) var e = window.event;
		if (e.keyCode) code = e.keyCode;
		return code;
	};

function clearHidden(varFldName)
{
		if(varFldName.value == "")
		{
				L_field_id  =  field.id;
				L_field_id_arr = L_field_id.split("txt");
				L_field_id = document.getElementById(L_field_id_arr[0]);
				L_field_id.value = "";
				return4mSmartSuggest(varFldName.name,L_field_id);
		}
}

function findPosOfObj(obj) 
{
	var targetObj = obj;
	var curleft = curtop = 0;
	if (targetObj.offsetParent) {
		do {
				curleft += targetObj.offsetLeft;
				curtop += targetObj.offsetTop;
			} while (targetObj = targetObj.offsetParent);
	}
	return [curleft,curtop];
}
