function changeParameterValue (urlParameters,parameterName,paramValue,isURL) 
{	
	//alert('urlParameters='+urlParameters);alert('parameterName='+parameterName);alert('paramValue='+paramValue);alert('isURL='+isURL);
	if(isURL==true)
	{
		var quesIndex=urlParameters.indexOf('?') != "-1" ? urlParameters.indexOf('?'): urlParameters.length;
		var baseURL=urlParameters.substring(0,quesIndex);
		urlParameters=urlParameters.substring(quesIndex+1,urlParameters.length); 
	}
	var urlParams;
	var parameterExists=0;
    if (urlParameters)
	{
        var params = urlParameters.split ("&");		
        for (var i = 0; i < params.length; i++) 
		{
            var substring = params[i].substr (0, params[i].indexOf('=')+1);	
            var substring1 = params[i].substr (params[i].indexOf('=')+1,params[i].length );
			
			if (substring == parameterName + "=") 
			{
				parameterExists++;
				substring1=paramValue;
            }

			if(urlParams)
			urlParams=urlParams+'&'+substring+substring1;
			else
			urlParams=substring+substring1;
        }
    }
	if(parameterExists==0)
	{
		if(urlParams)
		urlParams=urlParams+'&'+ parameterName + "=" + paramValue;
		else
		urlParams=parameterName + "=" + paramValue;
	}
	if(isURL==true)
	{
		urlParams=baseURL+"?"+urlParams
	}
    return urlParams;
}

function getParameterValue (url,parameterName) 
{
	//changes done by govardhan :- Purpose Single Sign On
	if(url.indexOf('/SSO/index.php') != "-1")
	{
		var quesIndex=url.lastIndexOf('?') != "-1" ? url.lastIndexOf('?'): url.length; 
		var urlParameters=url.substring(quesIndex+1,url.length); 
	}
	else
	{
		var quesIndex=url.indexOf('?') != "-1" ? url.indexOf('?'): url.length; 
		var urlParameters=url.substring(quesIndex+1,url.length); 
	}

    if (urlParameters) 
	{
        var params = urlParameters.split ("&");		
        for (var i = 0; i < params.length; i++) 
		{
            var substring = params[i].substr (0, params[i].indexOf('=')+1);	
            var substring1 = params[i].substr (params[i].indexOf('=')+1,params[i].length );
			
			if (substring == parameterName + "=") 
			{
			    return substring1;
            }
        }
    }
}

function deleteParameter (urlParameters,parameterName,isURL) 
{
	if(isURL==true)
	{
		var quesIndex=urlParameters.indexOf('?') != "-1" ? urlParameters.indexOf('?'): urlParameters.length;
		var baseURL=urlParameters.substring(0,quesIndex);
		urlParameters=urlParameters.substring(quesIndex+1,urlParameters.length); 
	}

	var urlParams;
    if (urlParameters) 
	{
        var params = urlParameters.split ("&");		
        for (var i = 0; i < params.length; i++) 
		{
            var substring = params[i].substr (0, params[i].indexOf('=')+1);	
            var substring1 = params[i].substr (params[i].indexOf('=')+1,params[i].length );
			
			if (substring != parameterName + "=") 
			{
				if(urlParams)
				urlParams=urlParams+'&'+substring+substring1;
				else
				urlParams=substring+substring1;
            }			
        }
    }
	if(isURL==true)
	{
		urlParams=baseURL+"?"+urlParams
	}
    return urlParams;
}

function GetDecimalDelimiter(countryCode)
{
	switch (countryCode)
	{
		case 3: 
		return '#';
		case 2: 
		return ',';
		default:
		return '.';
	}
}

function GetCommaDelimiter(countryCode)
{
	switch (countryCode)
	{ 
		case 3: 
		return '*';
		case 2: 
		return ',';
		default:
		return ',';
	}
}

function FormatClean(num)
{
	var sVal='';
	var nVal = num.length;
	var sChar='';

	try
	{
		for(c=0;c<nVal;c++)
		{
			sChar = num.charAt(c);
			nChar = sChar.charCodeAt(0);
			if ((nChar >=48) && (nChar <=57)) { sVal += num.charAt(c); }
		}
	}
	catch (exception) { AlertError("Format Clean",exception); }
	return sVal;
}


function FormatNumber(num,countryCode,decimalPlaces)
{ 
var minus='';
var comma='';
var dec='';
var preDecimal='';
var postDecimal='';

	try 
	{

	decimalPlaces = parseInt(decimalPlaces);
	comma = GetCommaDelimiter(countryCode);
	dec = GetDecimalDelimiter(countryCode);

	if (decimalPlaces < 1) { dec = ''; }
	if (num.lastIndexOf("-") == 0) { minus='-'; }

	preDecimal = FormatClean(num);

	// preDecimal doesn't contain a number at all.
	// Return formatted zero representation.

	if (preDecimal.length < 1)
	{
		return minus + FormatEmptyNumber(dec,decimalPlaces);
	}

	// preDecimal is 0 or a series of 0's.
	// Return formatted zero representation.

	if (parseInt(preDecimal) < 1)
	{
		return minus + FormatEmptyNumber(dec,decimalPlaces);
	}

	// predecimal has no numbers to the left.
	// Return formatted zero representation.

	if (preDecimal.length == decimalPlaces)
	{
		return minus + '0' + dec + preDecimal;
	}

	// predecimal has fewer characters than the
	// specified number of decimal places.
	// Return formatted leading zero representation.

	if (preDecimal.length < decimalPlaces)
	{
		if (decimalPlaces == 2)
		{
			return minus + FormatEmptyNumber(dec,decimalPlaces - 1) + preDecimal;
		}
		return minus + FormatEmptyNumber(dec,decimalPlaces - 2) + preDecimal;
	}

	// predecimal contains enough characters to
	// qualify to need decimal points rendered.
	// Parse out the pre and post decimal values
	// for future formatting.

	if (preDecimal.length > decimalPlaces)
	{
		postDecimal = dec + preDecimal.substring(preDecimal.length - decimalPlaces,
		preDecimal.length);
		preDecimal = preDecimal.substring(0,preDecimal.length - decimalPlaces);
	}

	// Place comma oriented delimiter every 3 characters
	// against the numeric represenation of the "left" side
	// of the decimal representation. When finished, return
	// both the left side comma formatted value together with
	// the right side decimal formatted value.

	var regex = new RegExp('(-?[0-9]+)([0-9]{3})');

	while(regex.test(preDecimal))
	{
		preDecimal = preDecimal.replace(regex, '$1' + comma + '$2');
	}

	}
	catch (exception) { AlertError("Format Number",exception); }
	return minus + preDecimal + postDecimal;
}

function FormatEmptyNumber(decimalDelimiter,decimalPlaces)
{
	var preDecimal = '0';
	var postDecimal = '';

	for(i=0;i<decimalPlaces;i++)
	{
		if (i==0) { postDecimal += decimalDelimiter; }
		postDecimal += '0';
	}
	return preDecimal + postDecimal;
}


function AlertError(methodName,e)
{
	if (e.description == null) { alert(methodName + " Exception: " + e.message); }
	else { alert(methodName + " Exception: " + e.description); }
}


function parseString_Date(d1,fmt)
{
	if(d1)
	{
		var dateTime = d1.split(" ");
		if(dateTime.length==1)
		{
			if(!fmt || fmt=="dd.MM.yyyy" || fmt=="dd/MM/yyyy")
			{
				if(dateTime[0].indexOf("/")>-1) var date1 = dateTime[0].split("/");
				else if(dateTime[0].indexOf("-")>-1) var date1 = dateTime[0].split("-");
				var dd1 = date1[0];
				var MM1 = date1[1];
				var yyyy1 = date1[2];
			}
			else if(!fmt || fmt=="yyyy-MM-dd")
			{
				var date1 = dateTime[0].split("-");
				var dd1 = date1[2];
				var MM1 = date1[1];
				var yyyy1 = date1[0];
			}
			dt1=new Date(yyyy1, MM1-1, dd1);
			return dt1;
		}
		else
		{
			if (dateTime[1]=="" || dateTime[1]=="0")
			{
				dateTime[1]="00:00:00";
			}
			if(!fmt || fmt=="dd.MM.yyyy" || fmt=="dd/MM/yyyy")
			{
				var date1 = dateTime[0].split("/");
				var time1 = dateTime[1].split(":");
				var dd1 = date1[0];
				var MM1 = date1[1];
				var yyyy1 = date1[2];
				var hh1 = time1[0];
				var min1 = time1[1];
				var ss1 = time1[2];
			}
			else if(!fmt || fmt=="yyyy-MM-dd")
			{
				var date1 = dateTime[0].split("-");
				var time1 = dateTime[1].split(":");
				var dd1 = date1[2];
				var MM1 = date1[1];
				var yyyy1 = date1[0];
				var hh1 = time1[0];
				var min1 = time1[1];
				var ss1 = time1[2];
			}
			dt1=new Date(yyyy1, MM1-1, dd1, hh1, min1, ss1);
			return dt1;
		}
	}
}

function ReplaceAll(Source,stringToFind,stringToReplace)
{

  var temp = Source;
  var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
}

function dispatch(fn, args) 
{ 
	var funct=fn.indexOf('{'); 
	if (funct<0)
	{
		fn = (typeof fn == "function") ? fn : window[fn];  // Allow fn to be a function object or the name of a global function
	    return fn.apply(this, args || []);  // args is optional, use an empty array by default
	}
	else
	{
		eval(fn);
		return returnFromEval;
	}   
}

function TimeCombo(id,h,l) 
{
	var self = this; 
	self.h = h; 
	self.l = l; 
	self.inp = document.getElementById(id); 
	self.hasfocus = false; 
	self.sel = -1; 
	self.ul = self.inp.nextSibling; 
	while (self.ul.nodeType == 3) 
	self.ul = self.ul.nextSibling; 
	self.ul.onmouseover = function() 
	{
		self.ul.className = '';
	}; 
		self.ul.onmouseout = function()
	{
		self.ul.className = 'focused'; 
		if (!self.hasfocus) self.ul.style.display = 'none';
	}; 
	self.list = self.ul.getElementsByTagName('li');
	for (var i=self.list.length - 1; i >= 0; i--) 
	{
		self.list[i].onclick = function() 
		{
		self.inp.value = this.firstChild.data; 
		try{
			var dateFldId=self.inp.id;
			assignToDateFld(dateFldId.substring(0,dateFldId.length-11));
		}catch(e){}
		self.rset(self);
		self.inp.blur();
		}
	} 
	self.inp.onfocus = function() 
	{
		self.ul.style.display = 'block'; 
		self.ul.className = 'focused'; 
		self.hasfocus = true; self.sel = -1;
	};
	self.inp.onblur = function() 
	{
		if(self.ul.className=='focused') 
		{
			self.rset(self);
		} 
		self.ul.className = ''; 
		self.hasfocus = false;
		changeTime(this.id);
		try{
			var dateFldId=self.inp.id;
			assignToDateFld(dateFldId.substring(0,dateFldId.length-11));
		}catch(e){}
	}; 
		self.inp.onkeyup = function(e) 
		{
			var k = (e)? e.keyCode : event.keyCode; 
			if (k == 40 || k == 13) 
			{
				if (self.sel == self.list.length-1) 
				{
					self.list[self.sel].style.backgroundColor = self.l; self.sel = -1;
				} 
					if (self.sel > -1)
					self.list[self.sel].style.backgroundColor = self.l;
					self.inp.value = self.list[++self.sel].firstChild.data; 
					self.list[self.sel].style.backgroundColor = self.h;
			} 
			else if (k == 38 && self.sel > 0)
			{
				self.list[self.sel].style.backgroundColor = self.l; 
				self.inp.value = self.list[--self.sel].firstChild.data; 
				self.list[self.sel].style.backgroundColor = self.h;
			}
			return false;
		};
}
TimeCombo.prototype.rset = function(self) 
{
	self.ul.style.display = 'none'; self.sel = -1; 
	for (var i=self.list.length - 1; i >= 0; i--)
	{
		self.list[i].style.backgroundColor = self.l;
	}
	return false;
};



// Return the value of the query string parameter with the specified name.
function getQueryParameter (parameterName) {
    var qs = window.location.search;
    var result = null;
    if (qs && qs != "") {
        if (qs.charAt (0) == '?') qs = qs.substr(1);
        var params = qs.split ("&");
        for (var i = 0; i < params.length; i++) {
            var substring = params[i].substr (0, parameterName.length + 1);
            if (substring == parameterName + "=") {
                result = unescape (params[i].substr(parameterName.length + 1));
                break;
            }
        }
    }
    return result;
}
