var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if(Date.parse(date))
			if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};
		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};



//	START------Date suggest functionality -- Chandan
/*	New Date validation function starts from here*/

function changeDate(id)
{
	var s = document.getElementById(id);
	var d = parseDate(s.value);
	if(d==null)
	{
	if(s.value != '')
		{
		s.value = "";
		alert("Format incorrect \n Example: dd/MM/yyyy or MM/dd/yyyy");	
		s.focus();
		}
	} 
	else
	{
	s.value = formatDate(d,'dd/MM/yyyy');
	}
}

function changeTime(id)
{
	var s = document.getElementById(id);
	var d = parseTime(s.value);
	if(d==null)
	{
	if(s.value != '')
		{
		s.value = ""; 
		alert("Format incorrect \n Example: HH:mm or HH:mm:ss");	
		s.focus();
		}
	} 
	else{
		s.value = formatDate(d,'hh:mm a');
	}
}

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');


function LZ(x)
	{
	return(x<0||x>9?"":"0")+x
	}


function isDate1(val,format)
{
	var date=getDateFromFormat(val,format);
	if(date==0)
	{
		return false;
	}
	return true;
}


function compareDates(date1,dateformat1,date2,dateformat2)
{
	var d1=getDateFromFormat(date1,dateformat1);
	var d2=getDateFromFormat(date2,dateformat2);
	if(d1==0 || d2==0){return -1;}else if(d1 > d2)
	{
		return 1;
	}
	return 0;
}


function formatDate(date,format)
	{
		format=format+"";
		var result="";
		var i_format=0;
		var c="";
		var token="";
		var y=date.getYear()+"";
		var M=date.getMonth()+1;
		
		var d=date.getDate();
		var E=date.getDay();
		var H=date.getHours();
		var m=date.getMinutes();
		var s=date.getSeconds();
		var yyyy,yy,MMMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
		var value=new Object();
		if(y.length < 4)
		{
			y=""+(y-0+1900);
		}
	value["y"]=""+y;value["yyyy"]=y;
	value["yy"]=y.substring(2,4);
	value["M"]=M;
	value["MM"]=LZ(M);
	value["MMMM"]=MONTH_NAMES[M-1];
	value["MMM"]=MONTH_NAMES[M+11];
	value["d"]=d;
	value["dd"]=LZ(d);
	value["E"]=DAY_NAMES[E+7];
	value["EE"]=DAY_NAMES[E];
	value["H"]=H;
	value["HH"]=LZ(H);
	if(H==0)
	{
		value["h"]=12;
	}
	else if(H>12)
	{
		value["h"]=H-12;
	}
	else
	{
		value["h"]=H;
	}
	value["hh"]=LZ(value["h"]);
	if(H>11)
	{
		value["K"]=H-12;
	}
	else
	{
		value["K"]=H;
	}
	value["k"]=H+1;
	value["KK"]=LZ(value["K"]);
	value["kk"]=LZ(value["k"]);
	if(H > 11)
	{
		value["a"]="PM";
	}
	else
	{
		value["a"]="AM";}value["m"]=m;
		value["mm"]=LZ(m);
		value["s"]=s;
		value["ss"]=LZ(s);
		while(i_format < format.length)
		{
			c=format.charAt(i_format);
			token="";
			while((format.charAt(i_format)==c) &&(i_format < format.length))
			{
				token += format.charAt(i_format++);
			}
			if(value[token] != null)
			{
				result=result + value[token];
			}
			else
			{
				result=result + token;
			}
		}
		return result;
	}



function _isInteger(val)
{
	var digits="1234567890";
	for(var i=0;i < val.length;i++)
	{
		if(digits.indexOf(val.charAt(i))==-1)
		{
			return false;
		}
	}
	return true;
}


function _getInt(str,i,minlength,maxlength)
{
	for(var x=maxlength;x>=minlength;x--)
	{
		var token=str.substring(i,i+x);
		if(token.length < minlength)
		{
			return null;
		}
		if(_isInteger(token))
		{
			return token;
		}
	}
	return null;
}


function getDateFromFormat(val,format)
	{
		val=val+"";format=format+"";
		var i_val=0;
		var i_format=0;
		var c="";
		var token="";
		var token2="";
		var x,y;
		var now=new Date();
		var year=now.getFullYear();
		var month=now.getMonth()+1;
		var date=1;
		var hh=now.getHours();
		var mm=now.getMinutes();
		var ss=now.getSeconds();
		var ampm="";
		while(i_format < format.length)
		{
			c=format.charAt(i_format);
			token="";
			while((format.charAt(i_format)==c) &&(i_format < format.length))
			{
				token += format.charAt(i_format++);
				}
				if(token=="yyyy" || token=="yy" || token=="y")
				{
					if(token=="yyyy")
					{
						x=4;y=4;
					}
					if(token=="yy")
					{
						x=2;y=2;
					}
					if(token=="y")
					{
						x=2;y=4;
					}
				year=_getInt(val,i_val,x,y);
					if(year==null)
					{
						return 0;
					}
				i_val += year.length;
					if(year.length==2)
					{
						if(year > 50)
						{
							year=1900+(year-0);
						}
						else
						{
							year=2000+(year-0);
						}
					}
				}
				else if(token=="MMMM"||token=="MMM")
				{
					month=0;
					for(var i=0;i<MONTH_NAMES.length;i++)
					{
						var month_name=MONTH_NAMES[i];
						if(val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase())
						{
							if(token=="MMMM"||(token=="MMM"&&i>11)){month=i+1;if(month>12)
								{
									month -= 12;
								}
							i_val += month_name.length;
							break;
						}
					}
				}
				if((month < 1)||(month>12))
				{
					return 0;
				}
			}
			else if(token=="EE"||token=="E")
			{
				for(var i=0;i<DAY_NAMES.length;i++)
				{
					var day_name=DAY_NAMES[i];
					if(val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase())
					{
						i_val += day_name.length;
						break;
					}
				}
			}
			else if(token=="MM"||token=="M")
			{
				month=_getInt(val,i_val,token.length,2);
				if(month==null||(month<1)||(month>12))
				{
					return 0;
				}
				i_val+=month.length;
			}
			else if(token=="dd"||token=="d")
			{
				date=_getInt(val,i_val,token.length,2);
				if(date==null||(date<1)||(date>31))
				{
					return 0;
				}
				i_val+=date.length;
			}
			else if(token=="hh"||token=="h")
			{
				hh=_getInt(val,i_val,token.length,2);
				if(hh==null||(hh<1)||(hh>12))
				{
					return 0;
				}
				i_val+=hh.length;
			}
			else if(token=="HH"||token=="H")
			{
				hh=_getInt(val,i_val,token.length,2);
				if(hh==null||(hh<0)||(hh>23))
				{
					return 0;
				}
				i_val+=hh.length;
			}
			else if(token=="KK"||token=="K")
			{
				hh=_getInt(val,i_val,token.length,2);
				if(hh==null||(hh<0)||(hh>11))
				{
					return 0;
				}
				i_val+=hh.length;
			}
			else if(token=="kk"||token=="k")
			{
				hh=_getInt(val,i_val,token.length,2);
				if(hh==null||(hh<1)||(hh>24))
				{
					return 0;
				}
				i_val+=hh.length;hh--;
			}
			else if(token=="mm"||token=="m")
			{
				mm=_getInt(val,i_val,token.length,2);
				if(mm==null||(mm<0)||(mm>59))
				{
					return 0;
				}
				i_val+=mm.length;
			}
			else if(token=="ss"||token=="s")
			{
				ss=_getInt(val,i_val,token.length,2);
				if(ss==null||(ss<0)||(ss>59))
				{
					return 0;
				}
				i_val+=ss.length;
			}
			else if(token=="a")
			{
				if(val.substring(i_val,i_val+2).toLowerCase()=="am")
				{
					ampm="AM";
				}
				else if(val.substring(i_val,i_val+2).toLowerCase()=="pm")
				{
					ampm="PM";
				}
				else
				{
					return 0;
				}
				i_val+=2;
			}
			else
			{
				if(val.substring(i_val,i_val+token.length)!=token)
				{
					return 0;
				}
				else
				{
					i_val+=token.length;
				}
			}
		}
		if(i_val != val.length)
		{
			return 0;
			}
			if(month==2)
			{
				if( ((year%4==0)&&(year%100 != 0) ) ||(year%400==0) ){if(date > 29){return 0;}}else{if(date > 28)
				{
					return 0;
				}
			}
		}
		if((month==4)||(month==6)||(month==9)||(month==11)){if(date > 30)
		{
			return 0;
		}
	}
	if(hh<12 && ampm=="PM")
	{
		hh=hh-0+12;
	}
	else if(hh>11 && ampm=="AM")
	{
		hh-=12;
	}
	var newdate=new Date(year,month-1,date,hh,mm,ss);
	return newdate.getTime();

	}


function parseDate(val)
	{
	var preferEuro=(arguments.length==2)?arguments[1]:false;
	generalFormats=new Array('y-M-d','MMMM d, y','MMMM d,y','y-MMMM-d','d-MMMM-y','MMMM d', 'd/M/y', 'd MMMM', 'yyyy/MM/dd', 'MMMM dd yyyy', 'MMMM dd yy', 'dd/MM/yyyy', 'd-M-y', 'd MMMM, yyyy', 'd MMMM yyyy', 'd MMMM yy', 'MMMMddyy', 'MMMMddyyyy', 'MMyydd', 'yyyy MM dd', 'yyyyMMMdd', 'ddMMyyyy', 'MMMMd', 'ddMMyy', 'dMMMM', 'yyy', 'y', 'MMMM', 'ddMMMMyyyy', 'ddMMMMyy', 'ddMMyy', 'M/d/y', 'y/d/M', 'dd-MM-yyyy', 'MMddyy');
	monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMMM-d','M/d','M-d', 'M/d/yyyy');
	dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMMM','d/M','d-M', 'd/M/yyyy');
	var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
	var d=null;
	for(var i=0;i<checkList.length;i++)
		{
		var l=window[checkList[i]];
		for(var j=0;j<l.length;j++)
			{
			d=getDateFromFormat(val,l[j]);
			if(d!=0)
				{
				return new Date(d);
				}
			}
		}
		return null;
	}

function parseTime(val)
	{
	var preferEuro=(arguments.length==2)?arguments[1]:false;
	generalFormats=new Array('HH:mm a', 'HH a', 'HH mm a', 'HH:mm', 'HH mm', 'HH', 'Hmm', 'HHmm', 'HHmma', 'HH-mm', 'HH-a', 'H:mm', 'h', 'HHm', 'HHmmss', 'Hms', 'hmm', 'h m', 'h.m', 'h:m', 'HH:mm:ss');
	monthFirst=new Array('HH:mm', 'HH', 'HH mm', 'HH:mm:ss');
	dateFirst =new Array('HH:mm', 'HH', 'HH mm', 'HH:mm:ss');
	var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
	var d=null;
	for(var i=0;i<checkList.length;i++)
		{
		var l=window[checkList[i]];
		for(var j=0;j<l.length;j++)
			{
			d=getDateFromFormat(val,l[j]);
			if(d!=0)
				{
				return new Date(d);
				}
			}
		}
		return null;
	}

//												END------Date suggest functionality -- Chandan