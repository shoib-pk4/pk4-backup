
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



function AutoSuggest(divName,elem,suggestionsVal,zcrank)
	{
	if (elem.addEventListener) {
	elem.addEventListener("blur", hideDiv, false);
	} else if (elem.attachEvent) {
		elem.attachEvent("onblur", hideDiv);
	}


		L_sugg_text = suggestionsVal ;
		if(L_sugg_text  == "")
		{
			return false;
		} 
	var suggestion = true;
	field = document.getElementById(elem.id);	
	var classInactive = "sf_inactive";
	var classActive = "sf_active";
	var classText = "sf_text";
	var classSuggestion = "sf_suggestion";
	{
		
		field.c = field.className;		
		field.className = field.c + " " + classInactive;
		if (suggestion){
			field.setAttribute("autocomplete", "off");
			sugg_div  = document.getElementById(divName);
			if(!sugg_list)
			{
				sugg_list = document.createElement("ul");
			}
			//sugg_list.style.display = "block";
			document.getElementById(divName).style.display = 'block';
			sugg_div.className = classSuggestion;
			sugg_list.style.width = field.offsetWidth + "px";
			sugg_div.appendChild(sugg_list);

			if(divName=='smartSuggestDiv'){
				var x=findPosOfObj(elem)[0];
				var y=findPosOfObj(elem)[1];
				sugg_div.style.left=x+"px";
				sugg_div.style.top=y+20+"px";
			}else{
				field.parentNode.appendChild(sugg_div);
			}

			
			//field.parentNode.appendChild(sugg_div);	

				
			field.onkeydown = function(e){
			   var key = getKeyCode(e);
			   if( key == 33 || key ==   34  || key == 36  || key == 18 || key ==  17)
				{
				   return;
				}

				switch(key){
				case 13:
					selectList(elem,divName);
					return false;
					break;			
				case 27:  // esc
					field.value = "";
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
	};
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
							suggestion = suggestion.substring(0,(suggestion.toLowerCase().indexOf(key)))+"<font style='font-weight:bold;' >"+suggestion.substring((suggestion.toLowerCase().indexOf(key)),(suggestion.toLowerCase().indexOf(key)+key.length+1))+"</font>"+suggestion.substring((suggestion.toLowerCase().indexOf(key)+key.length+1),suggestion.length-1);
						}
						else
						{
							l_chk_flg = -1;
						}
				
						a.innerHTML = suggestion;
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
							return false;
						};					
						
						li.appendChild(a);
						
						sugg_list.setAttribute("tabindex", "-1");
						sugg_list.appendChild(li);	
						
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
					L_field_id = document.getElementById(L_field_id_arr[0]);
					L_field_id.value = L_field_id_val;
					field.value = document.getElementById("cmb_search_id").options[selectedIndex-1].value;

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
			index1=temp1.indexOf("txt");
			hiddFld=temp1.substr(0,index1);
			
			var genericAutoSuggFldStr=divName.split('!!!');

			if(divName=="autosuggestCont")
			{
				temp1=this.elem.name;
				index1=temp1.indexOf("txt");
				hiddFld=temp1.substr(0,index1);

				assignValues4Contact(hiddFld);
			}
			else if(divName=="autosuggestAcc")
			{
				temp1=this.elem.name;
				index1=temp1.indexOf("txt");
				hiddFld=temp1.substr(0,index1);

				assignValues4Account(hiddFld);
			}
			else if(divName=="autosuggestProd")
			{
				assignValues4Product(zcrankval);
			}
			else if(divName=="autosuggestProduct")
			{
				assignValues4Products(zcrank);
			}
			else if(divName=="autosuggestProductEdit")
			{
				assignValues4ProductsEdit(zcrank);
			}
			else if(divName=="autosuggestPriCont")
			{
				assignValues4PriContact();
			}
			else if(divName=="autosuggestSecCont")
			{
				assignValues4SecContact();
			}
			else if(divName=="autosuggestComment")
			{
				assignValues4Contact_Comment();
			}
			else if(divName=="autosuggestProductInstance")
			{
				assignValues4PdtInstance(zcrank);
			}
			else if(divName=="autosuggestProductInstance4Edit")
			{
				assignValues4PdtInstance4Edit(zcrank);
			}
			else if(divName=="autosuggestProductAcct")
			{
				assignValues4ProductsAcct(zcrank);
			}
			else if(divName=="autosuggestProductEditAcct")
			{
				assignValues4ProductsEditAcct(zcrank);
			}
			else if(divName=="autosuggestName")
			{
				assignValues4Contact();
			}
			else if(divName=="autosuggestCRM")
			{
				assignValues4CRM(zcrank);
			}
			else if(divName=="autosuggestQuestions")
			{
				assignValuesQuesAndAns(globalHidden,this.elem);
			}
			else if(genericAutoSuggFldStr[0]=='genericSmartSuggest')
			{
				blockObjectRelatedFields(genericAutoSuggFldStr[1]);
			}
			else if(genericAutoSuggFldStr[0]=='multiSelectSugg')
			{
				callMultiSelect(this.elem.name,hiddFld);
			}
			else
			{
				try
				{
					return4mSmartSuggest(this.elem.name,hiddFld);
				}
				catch (e)
				{
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
