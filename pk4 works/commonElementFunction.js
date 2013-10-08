var defaultTxtFldWidth = 20;
var defaultTxtFldCorrWidth = 5;
var defaultTxtFldMaxWidth = 50;


function CreateTEXTBOX(appendTo, className, id, value,maxLength) {
	
	var element = document.createElement("INPUT");
	element.setAttribute("type", "text");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value) {
		element.value = value;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	if (maxLength) {
		element.maxLength = maxLength;
	}

	return element;
}	

function CreatePASSWORD(appendTo, className, id, value,maxLength) {
	var element = document.createElement("INPUT");
	element.setAttribute("type", "password");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value) {
		element.value = value;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	if (maxLength) {
		element.maxLength = maxLength;
	}
	return element;
}	


function CreateHIDDEN(appendTo, className, id, value,name) {
	
	var element = document.createElement("INPUT");
	element.setAttribute("type", "hidden");
	if (className){
		SetClass(element, className);
	}
	if (id){
		element.setAttribute("id", id);
		//element.setAttribute("name", id);
	}
	if (name)
	element.setAttribute("name", name);
	else
	element.setAttribute("name", id);
		
		
	if (value){
		element.value = value;
	}
	if (appendTo){
		appendTo.appendChild(element);
	}
	return element;
}	

function CreateTEXTAREA(appendTo, className, id, value,maxLength) {
	var element = document.createElement("textarea");
	if (className){
		SetClass(element, className);
	}
	if (id){
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value){
		element.value = value;
	}
	if (appendTo){
		appendTo.appendChild(element);
	}
	if (maxLength) {
		element.maxLength = maxLength;
	}
	element.height="60px";
	return element;
}

function Createlink(appendTo, className, id, value) {
	//alert(appendTo+","+className+","+id+","+value)
	var element = document.createElement('a');
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value){
		element.value = value;
		//alert(element.value+"mmmmmccccc")
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	
	element.height="60px";
	//document.getElementById(id).style.

	return element;
}


function CreateCheckbox(appendTo, className, id, value) {
	var element = document.createElement("INPUT");
	element.setAttribute("type", "checkbox");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value) {
		element.value = value;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}

	return element;
}	

function CreateListBox(appendTo, className, id) {
	var element = document.createElement("listbox");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}		
	if (appendTo) {
		appendTo.appendChild(element);
	}
	return element;
}	

function CreateListItem (appendTo, className,label) {
	var element = document.createElement("listbox");
	if (className) {
		SetClass(element, className);
	}
	if (label) {
		element.setAttribute("label", label);
	}	
	if (appendTo) {
		appendTo.appendChild(element);
	}
	return element;
}	


function CreateSelectBox(appendTo, className, id, value, multiple) {
	var element = document.createElement("SELECT");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value) {
		element.value = value;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	element.setAttribute("name", id);
	if(multiple) {
		element.multiple=multiple;
		element.size="3";
	}
	return element;
}	

function CreateOptionBox(appendTo, className, id, value, text) {
	var element = document.createElement("OPTION");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	
	if (appendTo) {
		appendTo.appendChild(element);
	}
	element.setAttribute("value", value);
	if(text){
		element.text=text;
	}else{
		element.setAttribute("value", value);
	}

	return element;
}


function CreateRadioButton(appendTo, className, id, value) {
	var element = document.createElement("INPUT");
	element.setAttribute("type","RADIO")
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	
	if (appendTo) {
		appendTo.appendChild(element);
	}
	element.setAttribute("value", value);

	return element;
}

/*
''--- its wrong 
function CreateLABEL(appendTo, className, id, value) {
	var element = document.createElement("INPUT");
	element.setAttribute("type", "label");

	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value) {
		element.value = value;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	return element;
	''--- its wrong 
}
*/

function CreateLABEL(appendTo, className, id, txt) {
	var element = document.createElement("LABEL");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	
	if (appendTo) {
		appendTo.appendChild(element);
	}

	element.appendChild (document.createTextNode(txt));

	return element;
}


function CreateButton(appendTo, className, id, value) {
	var element = document.createElement("INPUT");
	element.setAttribute("type","button");

	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (value) {
		element.value = value;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}

	return element;
}


function CreateIMG(appendTo, className, id, src, title, width, height, handler) {

	var element = document.createElement("IMG");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (src) {
		element.src = src;
	}
	if (title) {
		element.title = title;
	}
	if (width) {
		element.width = width;
	}
	if (height) {
		element.height = height;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	if(handler)
	{
	
	if (element.addEventListener) {
	element.addEventListener("click", handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("onclick", handler);
	}
	}
	return element;
}


function SetClass(e, cName) {
	var isBrowser = navigator.appVersion;
	if (isBrowser.indexOf('MSIE') > -1)
	{
		e.setAttribute("className", cName);	
	}
  else
	{
	e.setAttribute("class", cName);
	}
}


function CreateSPAN(appendTo, className, id, innerHTML, trimItTo, titleTxt)

{

	var element = document.createElement("span");
	if (className)
	{
		SetClass(element, className);
	}
	if (id)
	{
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (innerHTML)
	{
		//innerHTML = innerHTML.replace("<br />","");

		if (trimItTo && innerHTML.length > trimItTo)
		{
			element.innerHTML = innerHTML.substring(0,trimItTo-1)+'..';
		}
		else
		{
			element.innerHTML = innerHTML;
		}
		if(titleTxt)
		{
			element.title=titleTxt;
		}
		else
		{
			//element.title=innerHTML.replace("<br />","");
		}
	}

	if (appendTo)
	{
		appendTo.appendChild(element);
	}

	return element;
}

function CreateTable(appendTo,className,Id,bordercolor,cellspacing,cellpadding,algn)
{
  var element=document.createElement("TABLE");
  
  if (appendTo) 
	{
		appendTo.appendChild(element);
	}
  
  if(className)
	{
		SetClass(element,className);
	}
  if(Id)
	{
		element.setAttribute("id",Id);
		element.setAttribute("name", Id);
	}
	if(cellspacing)
	{
			element.setAttribute("cellSpacing",cellspacing);
	}
	if(cellpadding)
	{
			element.setAttribute("cellPadding",cellpadding);
	}
	if(algn)
	{
			element.setAttribute("align",algn);
	}
	if(bordercolor)
	{
			element.style.border='1px solid white';
			element.style.borderColor=bordercolor;
	}


	return element;
}

function CreateBody(appendTo,className,Id)
{
  var element=document.createElement("TBODY");
  
  if (appendTo) 
	{
		appendTo.appendChild(element);
	}
  
  if(className)
	{
		SetClass(element,className);
	}
  if(Id)
	{
		element.setAttribute("id",Id);
		element.setAttribute("name", Id);
	}
	return element;
}

function CreateThead(appendTo,className,Id)
{
  var element=document.createElement("thead");
  
  if (appendTo) 
	{
		appendTo.appendChild(element);
	}
  
  if(className)
	{
		SetClass(element,className);
	}
  if(Id)
	{
		element.setAttribute("id",Id);
		element.setAttribute("name", Id);
	}
	return element;
}

function CreateTR(appendTo,className,Id)
{
  var element=document.createElement("TR");
  
  if (appendTo) 
	{
		appendTo.appendChild(element);
	}
  
  if(className)
	{
		SetClass(element,className);
	}
  if(Id)
	{
		element.setAttribute("id",Id);
		element.setAttribute("name", Id);
	}
	return element;
}

function CreateTD(appendTo,className,Id,spanNum,txtAlign,txt,title)
{
  var element=document.createElement("TD");
  element.setAttribute("align", "left");
  
  if(className)
	{
		SetClass(element,className);
	}
  if(Id)
	{
		element.setAttribute("id",Id);
		element.setAttribute("name", Id);
	}
  if(spanNum)
	{
		element.setAttribute("colSpan",spanNum);
	}
  if (appendTo) 
	{
		appendTo.appendChild(element);
	}
 if(txtAlign)
	{
		element.align=txtAlign;
	}

if (txt) 
	{
		element.appendChild (document.createTextNode(txt));
	}

if (title) element.title = title;
	return element;
}


function CreateTH(appendTo,className,Id,txt,txtAlign,title)
{
  var element=document.createElement("TH");
  
  if (appendTo) 
	{
		appendTo.appendChild(element);
	}
  
  if(className)
	{
		SetClass(element,className);
	}
  if(Id)
	{
		element.setAttribute("id",Id);
		element.setAttribute("name", Id);
	}
if (txt) 
	{
		element.appendChild (document.createTextNode(txt));
	}
	 if(txtAlign)
	{
		element.align=txtAlign;
	}
	if (title) {
		element.title = title;
	}

	return element;
}



function CreateA(appendTo, className, id, href, target, innerHTML, title) {
	
	var element = document.createElement("A");
	if (className) {
		SetClass(element, className);
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (href) {
		element.href = href;
	}
	if (target) {
		element.target = target;
	}
	if (innerHTML) {
		element.innerHTML = innerHTML;
	}
	if (title) {
		element.title = title;
	}

	if (appendTo) {
		appendTo.appendChild(element);
	}

	return element;
}

function CreateDIV(appendTo, className, id, innerHTML,divWidth) {
	var element = document.createElement("DIV");
	if (className) {
		SetClass(element, className);
		
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (innerHTML) {
		element.innerHTML = innerHTML;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	if (divWidth) {
		element.style.width = divWidth;
	}
	
	return element;
}

function CreateUL(appendTo, className, id) {
	var element = document.createElement("ul");
	if (className) {
		SetClass(element, className);
		
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	
	return element;
}

function CreateLI(appendTo, className, id) {
	//alert(appendTo+","+ className+","+ id)
	var element = document.createElement("li");
	if (className) {
		SetClass(element, className);
		
	}
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	
	return element;
}

function AddClickEventListener1(element, handler) {	
	if (element.addEventListener) {
	element.addEventListener("click", function (){handler(element.id);}, false);
	} else if (element.attachEvent) {
		element.attachEvent("onclick", function (){handler(element.id);});
	}
}

function AddClickEventListener(element, handler) {	
	if (element.addEventListener) {
	element.addEventListener("click", function (){handler(element.id);}, false);
	} else if (element.attachEvent) {
		element.attachEvent("onclick", function (){handler(element.id);});
	}
}
function AddLoadEventListener(element, handler) {	
	if (element.addEventListener) {
	element.addEventListener("load", handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("onLoad", handler);
	}
}
function AddKeyUpEventListener(element, handler)
{	
	if (element.addEventListener) {
	element.addEventListener("keyup", handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("onkeyup", handler);
	}
}

function AddBlurEventListener(element, handler) 
{	
	if (element.addEventListener) {
	element.addEventListener("blur",  function (){handler(element);}, false);
	} else if (element.attachEvent) {
		element.attachEvent("onblur",  function (){handler(element);});
	}
}

function AddFocusEventListener(element, handler)
{	
	if (element.addEventListener) {
	element.addEventListener("focus",  function (){handler(element);}, false);
	} else if (element.attachEvent) {
		element.attachEvent("onfocus",  function (){handler(element);});
	}
}

function AddOnKeyPressEventListener(element, handler)
{	
	if (element.addEventListener) {
	element.addEventListener("keypress", handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("onkeypress", handler);
	}
}

function AddKeyDownEventListener(element, handler)
{
	if (element.addEventListener) {
	element.addEventListener("keyup", handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("onkeyup", handler);
	}
}

function AddOnMouseOverEventListener(element, handler)
{	
	if (element.addEventListener) {
	element.addEventListener("mouseover", function (){handler(element);}, false);
	} else if (element.attachEvent) {
		element.attachEvent("onmouseover",function (){handler(element);});
	}
}

function AddOnMouseOutEventListener(element, handler)
{	
	if (element.addEventListener) {
	element.addEventListener("mouseout", function (){handler(element);}, false);
	} else if (element.attachEvent) {
		element.attachEvent("onmouseout",function (){handler(element);});
	}
}

function AddChangeEventListener(element, handler)
{	
	if (element.addEventListener) {
	element.addEventListener("change", handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("onchange", handler);
	}
}


//-------------------------------------------------
//-----     Additions after May 14th 2009     -----
//-------------------------------------------------

function getEffectiveElementWidth(strWidth)
{
	//alert(((strWidth>0)?(strWidth + defaultTxtFldCorrWidth):(defaultTxtFldWidth)));
	var effectiveWidth = strWidth + defaultTxtFldCorrWidth;
	return ((strWidth>0)?(((effectiveWidth > defaultTxtFldMaxWidth)?defaultTxtFldMaxWidth:effectiveWidth)):(defaultTxtFldWidth));
}


function CreateFORM(appendTo, action , id, method ) {
	var element = document.createElement("FORM");
	element.setAttribute("action",action );
	
	if (id) {
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}	
	if (method) {
		element.setAttribute("method", method);
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	return element;
}	

function CreateHeader(appendTo, className, id, innerHTML,headerLevel)
{
	if(headerLevel == 2)
	{
		var element = document.createElement("H2");

	}
	else if(headerLevel == 3)
	{
		var element = document.createElement("H3");

	}
	else if(headerLevel == 4)
	{
		var element = document.createElement("H4");

	}
	else if(headerLevel == 5)
	{
		var element = document.createElement("H5");

	}
	else if(headerLevel == 6)
	{
		var element = document.createElement("H6");

	}
	else
	{
		var element = document.createElement("H1");
	}
	if (className) 
	{
		SetClass(element, className);
	}
	if (id) 
	{
		element.setAttribute("id", id);
		element.setAttribute("name", id);
	}
	if (innerHTML) 
	{
		element.innerHTML = innerHTML;
	}
	if (appendTo) 
	{
		appendTo.appendChild(element);
	}
	return element;
}
/*~~~~~~~~FUNCTION TO CREATE THE HEADING TAG ENS HERE ~~~~~~~~~*/

// Function to validate the characters entered in it. This function allows only chars mentioned in "goods".
function validCharsDOM(e, goods)
{
	var key, keychar;
	key = (window.event) ? window.event.keyCode : ((e) ? e.which : null); 
	if (key == null) 
		return true;
	keychar = String.fromCharCode(key);
	keychar = keychar.toLowerCase();
	goods = goods.toLowerCase(); 
	if (goods.indexOf(keychar) >= 0)
	{
		return true; 
	}
	else if (key==null || key==0 || key==8 || key==9 || key==13 || key==27)
	{
		return true;
	}	
	return false;
}

//This functions allows user to enter only numbers, it also allows decimal points, -ve numbers
function numbersonly(elem,e,dec,isNeg)
{
	var key, keychar;
	key = (window.event) ? window.event.keyCode : ((e) ? e.which : null); 
	if (key == null) 
		return true;
	keychar = String.fromCharCode(key);

	// control keys
	if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
	return true;

	// numbers
	else if (('0123456789'.indexOf(keychar) > -1))
	return true;

	//For -ve numbers
	else if((key==45)&&isNeg!=false)
	{
		var val=elem.value+keychar;
		if(val.lastIndexOf(keychar)==0)
		return true;	
		else
		return false;
	}
	//For +ve numbers
	else if((key==43))
	{
		var val=elem.value+keychar;
		if(val.lastIndexOf(keychar)==0)
		return true;	
		else
		return false;
	}
	//For . (decimalPoint)
	else if((key==46)&&dec==true)
	{
		var val=elem.value;
		decCnt=val.split('.').length-1;
		if(decCnt==0)
		return true;	
		else
		return false;
	}
	else
	return false;
 }