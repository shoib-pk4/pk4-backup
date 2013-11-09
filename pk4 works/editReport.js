

// --------------------------- Copyright (C) sfaFinity Inc. ------------------------------------
//
// All rights reserved
//
// No part of this code may be reproduced in any form without explicit written permission from
// sfaFinity Inc.
//
//         http://www.sfaFinity.com
//
// ---------------------------------------------------------------------------------------------






// Javascript support for editing a report.
// M. A. Sridhar



// Set up the global metadata map.
if (typeof (MetadataMap) == "undefined") {
    var bannerFrame = typeof (getBannerFrame) == "function" ? getBannerFrame() : null;
    MetadataMap = bannerFrame != null ? bannerFrame.MetadataMap : null;
    if (MetadataMap == null) {
        alert ("EditReport: Cannot find metadata. Please close your browser and log in again.");
    }
}

var MAX_COLS_IN_REPORT = 50;

var shownOutputCategoryElt = null;
function toggleOutputCategoryVisibility (eltId) {
    shownOutputCategoryElt = toggleElementVisibility (eltId, shownOutputCategoryElt);
}

function validate (forSaveAndRun) {
    var nameBox = getZcFormElement(document.mainForm, "0-301-303");
    var name = nameBox.value;
    if (name) name = name.trim();
    if (name == "") {
        alert ("Please provide a name for the report.");
        nameBox.focus();
        return false;
    }
    var chosenOutputs = _getChosenOutputs();
    if (chosenOutputs.length <= 0) {
        alert ("Please choose at least one output column.");
        return false;
    }
    if (chosenOutputs.length >= MAX_COLS_IN_REPORT) {
        alert ("Too many output columns: at most " + MAX_COLS_IN_REPORT +
               " allowed.\nPlease remove some columns.")
        return null;
    }

    var entityName = entityNameBeingEdited();
    var xml = _computeReportXML (entityName, chosenOutputs);
    if (!xml || xml == "") return false;
    getZcFormElement (document.mainForm, "0-301-306").value = xml;
    xml = _computeLayoutXML (chosenOutputs);
    if (!xml || xml == "") return false;
    getZcFormElement (document.mainForm, "0-301-307").value = xml;
	
    // Clean out the multi-select boxes so that zeroCode doesn't complain.
    var selectors = document.getElementsByTagName ("select");
    var n = selectors ? selectors.length : 0;
    for (var i = 0; i < n; i++) {
        var sel = selectors[i];
        if (sel.multiple) {
            for (var j = 0; j < sel.options.length; j++) {
                sel.options[j].selected = false;
            }
        }
    }

    // Set up the response URI if any.
    if (!forSaveAndRun) {
        var backto = getQueryParameter ("backto");
        if (backto) document.mainForm.elements["response__uri"].value = backto;
    }
    return true;
}

var _numberAggregates  = {
    "avg": "average",
    "count": "count",
    "max": "max",
    "min": "min",
    "sum": "sum"
};

var _dateAggregates  = {
    "count": "count",
    "max": "most recent",
    "min": "oldest"
};

var _defaultAggregates = {
    "count": "count",
    "max" : "max",
    "min" : "min"
};

var _stringDisplayTypes = {
    "text" : "text"
};

var _dateDisplayTypes = {
    "dd/MM/yyyy" : "dd/mm/yyyy",
    "dd/MM/yyyy hh:mm a" : "dd/mm/yyyy hh:mm",
    "MM/dd/yyyy" : "mm/dd/yyyy",
    "MM/dd/yyyy hh:mm a" : "mm/dd/yyyy hh:mm"
};

var _numberDisplayTypes = {
	"Decimal": "Whole number with commas",
	"Integer": "Whole number, no commas",
    "Money":   "Currency",
    "Number":  "Fractional number"
};

function addOutputAttribute (atrName, atrCaption, agFn, displayType, sortDescending, enttName, origEntName) {

    //shoib
    //validation for header and details, any one is allowed
    var status = allowHeaderOrDetail(origEntName);
    if(!status) {
        alert('You cannot perform this action. You can either choose a field from header object or a field from detail object!');
        return;
    }

	// alert(atrName + "<> " + enttName);
	// Kishore: Don't create the output row if internal ID
	if (atrCaption == "internalId") {
		return;
	}
    var atrProps = _getAtrMetadata (atrName);
    if (!atrProps) {
        alert ("Internal error: Cannot find metadata for '" + atrName + "'");
        return;
    }

    var entityName = entityNameBeingEdited();
    var atrDesc = atrProps.de;
    var atrEntityName = atrProps.eN;
    var caption = atrCaption ? atrCaption : atrDesc;
    
    var table = document.getElementById ('outputAtrsTable');
    var rowCount = table.rows.length;
    if (!rowCount || rowCount <= 1) {
        var outputTblHdr = table.getElementsByTagName ("tr");
        if (outputTblHdr && outputTblHdr[0]) outputTblHdr[0].style.display = "";
    }

    var shownAtrsMap = table.shownAtrsMap;
    if (!shownAtrsMap) {
        var shownAtrsMap = new Array();
        table.shownAtrsMap = shownAtrsMap;
    }
    var atrRowNumberStr = shownAtrsMap[atrName];
    if (atrRowNumberStr) {
        // Already chosen.
        alert ("The column '" + caption + "' is already chosen as an output.");
        return;
    }
    shownAtrsMap[atrName] = "" + rowCount; // Remember that it is shown now.
    
    var row = table.insertRow (rowCount);
    row.id = "outputRow_" + rowCount;
    row.className = "outputAttributeRow";
    var checkboxCell = row.insertCell (0);
    var checkboxValue = atrEntityName + ":" + atrName;
    var imageDivId = "dragDiv_" + rowCount;
    var moveIndicator = null;
    if (document.all) {
        moveIndicator = "<span " +
            "style=\"font-family: Webdings; font-size: 8pt; cursor: move\" " +
            "id=\"" + imageDivId + "\" " +
            "title=\"Click and drag to move this data element\" >" +
            String.fromCharCode (126) + "</span>";
    } else {
        moveIndicator = "<div id=\"" + imageDivId + "_div\" style=\"display:inline\">" +
            "<img id=\"" + imageDivId + "\" src=\"" + AppContext.imageURI ("dragHandle.gif") + "\" " +
            "style=\"cursor:move\" width=\"15\" " +
            "title=\"Click and drag to move this data element\" /></div>";
    }
    checkboxCell.innerHTML = moveIndicator +
        "<input type=\"checkbox\" for = '"+origEntName+"' class='hdrOrDetCbx' id=\"output_" + atrName + "\"" +
        " name=\"output_" + atrName + "\" checked value=\"" + checkboxValue + "\">";
    checkboxCell.nowrap = 1;
    var imageDiv = document.getElementById (imageDivId);
    if (document.all) {
        imageDiv.onmousedown = _pickIt;
        document.onmouseup   = _dropIt;
        document.onmousemove = _dragIt;
    } else {
        imageDiv.addEventListener ("mousedown", _pickIt, false);
        document.addEventListener ("mousemove", _dragIt, false);
        document.addEventListener ("mouseup",   _dropIt, false);
    }
    imageDiv.attributeName = atrEntityName + ":" + atrName;
    var categoryCell = row.insertCell (1);
    var mappedAtrEntityName = MetadataMap.getMappedEntityName (atrEntityName);
    categoryCell.innerHTML = "<label for=\"output_" + enttName + "\">" + enttName + "</label>";
    categoryCell.id = "outputCategory_" + rowCount;
    
    var contentCell = row.insertCell (2);
    contentCell.innerHTML = "<label for=\"output_" + atrName + "\">" + caption + "</label>";
    contentCell.id = "outputAtrName_" + rowCount;
    
    var selectCell = row.insertCell (3);
    var optionList = null;
    var aggregates = (atrProps.dT == "Number" || atrProps.dT == "Money") ?
        _numberAggregates :
        (atrProps.dT == "Datetime" ? _dateAggregates : _defaultAggregates);
    if (atrProps.aggregateFunction && atrProps.aggregateFunction != "") {
        optionList = "<option value=\"" + atrProps.aggregateFunction + "\">" +
            aggregates[atrProps.aggregateFunction] + "</option>";
    } else {
        optionList = "<option value=\"value\">value</option>\n";
        for (var x in aggregates) {
            optionList += "<option value=\"" + x + "\" " +
                (agFn == x ? "selected" : "") + ">" + aggregates[x] +"</option>";
        }
    }
    var selectCellHtml = "<select name=\"outputType_" + atrName +
        "\" class=\"smallFontElement\">\n" + optionList +
        "</select>";
    selectCell.innerHTML = selectCellHtml;
    var captionBoxCell = row.insertCell (4);
    captionBoxCell.innerHTML = "<input name=\"caption_" + atrName +
        "\" class=\"smallFontElement\" type=\"text\" value=\"" + caption + "\" >";

    var extTypeCell = row.insertCell (5);
    var displayTypeMap = null;
    if (atrProps.aggregateFunction && atrProps.aggregateFunction == "count" ||
        atrProps.dT == "Number" || atrProps.dT == "Money"  || atrProps.dT == "Decimal" ||
        atrProps.dT == "Integer"  ) {
        displayTypeMap = _numberDisplayTypes;
		
    } else if (atrProps.dT == "Datetime") {
        displayTypeMap = _dateDisplayTypes;
    } else {
        displayTypeMap = _stringDisplayTypes;
    }
    var str = "";
    for (var dType in displayTypeMap) {
        str += "<option value=\"" + dType + "\"" +
            (displayType && displayType == dType ? " selected" : "") + ">" + displayTypeMap[dType] +
            "</option>\n";
    }
    extTypeCell.innerHTML = "<select name=\"displayType_" + atrName +
        "\" class=\"smallFontElement\">\n" + str +
        "</select>";

    var sortOrderCell = row.insertCell (6);
    sortOrderCell.align = "center";
    var sorterHtml = "<img id=\"sortOrderImg_" + atrName + "\" " +
        "onclick=\"toggleSort(this)\" class=\"toolbarButton\" title=\"" +
        (sortDescending == "1" ? "Sort descending" : "Sort ascending") + "\" " +
        "src=\"" + AppContext.imageURI (sortDescending == "1" ? "sort_down.gif" : "sort_up.gif") + "\" >\n";
    sortOrderCell.innerHTML = sorterHtml;
}


function toggleSort (sortImage) {
    var src = sortImage.src;
    sortImage.src = AppContext.imageURI (src.endsWith ("sort_up.gif") ? "sort_down.gif" : "sort_up.gif");
}


function updateBarChartChoices () {
    _updateVBarChartChoices();
    _updateHBarChartChoices();
}



function _updateVBarChartChoices() {
    var table = document.getElementById ('outputAtrsTable');
    var shownAtrsMap = table.shownAtrsMap;
    if (!shownAtrsMap) return;
    var labelSelector = document.getElementById ("vbarchart_label");
    var currentLabelAtr = null;
    if (labelSelector.options) {
        var index = labelSelector.selectedIndex ? labelSelector.selectedIndex : 0;
        if (index >= 0 && index < labelSelector.options.length) {
            currentLabelAtr = labelSelector.options[index].value;
        }
        labelSelector.options.length = 0;
    }
    var yAxisSelector = document.getElementById ("vbarchart_y_axis");
    var currentYAxisAtr = null;
    if (yAxisSelector.options) {
        var index = yAxisSelector.selectedIndex ? yAxisSelector.selectedIndex : 0;
        if (index >= 0 && index < yAxisSelector.options.length) {
            currentYAxisAtr = yAxisSelector.options[index].value;
        }
        yAxisSelector.options.length = 0;
    }
    for (var atrName in shownAtrsMap) {
        var atrLabel = document.mainForm.elements["caption_" + atrName].value;
        var atrProps = _getAtrMetadata (atrName);
        if (atrProps.dT == "Number") {
            var opt =  new Option (atrLabel, atrName);
            yAxisSelector.options[yAxisSelector.options.length] = opt;
            if (currentYAxisAtr && currentYAxisAtr == atrName) {
                yAxisSelector.selectedIndex = yAxisSelector.options.length-1;
            }
        }
        var opt =  new Option (atrLabel, atrName);
        labelSelector.options[labelSelector.options.length] = opt;
        if (currentLabelAtr && currentLabelAtr == atrName) {
            labelSelector.selectedIndex = labelSelector.options.length-1;
        }
    }
}


function _updateHBarChartChoices() {
    var table = document.getElementById ('outputAtrsTable');
    var shownAtrsMap = table.shownAtrsMap;
    if (!shownAtrsMap) return;
    var labelSelector = document.getElementById ("hbarchart_label");
    var currentLabelAtr = null;
    if (labelSelector.options) {
        var index = labelSelector.selectedIndex ? labelSelector.selectedIndex : 0;
        if (index >= 0 && index < labelSelector.options.length) {
            currentLabelAtr = labelSelector.options[index].value;
        }
        labelSelector.options.length = 0;
    }
    var yAxisSelector = document.getElementById ("hbarchart_x_axis");
    var currentYAxisAtr = null;
    if (yAxisSelector.options) {
        var index = yAxisSelector.selectedIndex ? yAxisSelector.selectedIndex : 0;
        if (index >= 0 && index < yAxisSelector.options.length) {
            currentYAxisAtr = yAxisSelector.options[index].value;
        }
        yAxisSelector.options.length = 0;
    }
    for (var atrName in shownAtrsMap) {
        var atrLabel = document.mainForm.elements["caption_" + atrName].value;
        var atrProps = _getAtrMetadata (atrName);
        if (atrProps.dT == "Number") {
            var opt =  new Option (atrLabel, atrName);
            yAxisSelector.options[yAxisSelector.options.length] = opt;
            if (currentYAxisAtr && currentYAxisAtr == atrName) {
                yAxisSelector.selectedIndex = yAxisSelector.options.length-1;
            }
        }
        var opt =  new Option (atrLabel, atrName);
        labelSelector.options[labelSelector.options.length] = opt;
        if (currentLabelAtr && currentLabelAtr == atrName) {
            labelSelector.selectedIndex = labelSelector.options.length-1;
        }
    }
}




function _getAtrMetadata (atrInternalName) {
    return MetadataMap.getAttributeData (atrInternalName);
}


function _computeLayoutXML (chosenOutputs) {
    var layoutCheckboxes = ["layout_tabular", "layout_collapsed", "layout_matrix",
                            "layout_vBarChart", "layout_hBarChart"];
    var xml = "<?xml version=\"1.0\"?>\n" +
        "<layout version=\"0.91\">\n";
    var nLayouts = 0;
    for (var i = 0; i < layoutCheckboxes.length; i++) {
        var box = document.mainForm.elements[layoutCheckboxes[i]];
        if (box && box.checked) {
            var layoutType = layoutCheckboxes[i].substring (7);
            xml += "  <" + layoutType;
            if (box.id == "layout_vBarChart") {
                var vBarChartXml = _computeVBarChartXML (chosenOutputs);
                if (!vBarChartXml) return null;
                xml += vBarChartXml + " />\n";
            } else if (box.id == "layout_hBarChart") {
                var hBarChartXml = _computeHBarChartXML (chosenOutputs);
                if (!hBarChartXml) return null;
                xml += hBarChartXml + " />\n";
            } else {
                xml += " value=\"1\"";
                if (layoutType == "tabular") {
                    if (!window.layoutDescriptor) {
                        alert ("Internal error: Can't find layout descriptor.");
                        return null;
                    }
                    var layoutObj = new ReportLayout (window.layoutDescriptor());
                    var styleSpec = layoutObj.getStyleForTabularLayout();
                    styleSpec = styleSpec && styleSpec != "" ? styleSpec.htmlUnescape() : "";
                    xml += ">\n" + styleSpec + "\n</tabular>\n";
                } else {
                    xml += " />";
                }
            }
            nLayouts++;
        }
    }
    if (nLayouts <= 0) {
        showTab ("layout");
        alert ("Please choose at least one layout.");
        return null;
    }
    xml += "</layout>";
    return xml;
}



function _computeVBarChartXML (chosenOutputs) {
    var labelSelector = document.getElementById ("vbarchart_label");
    var label = labelSelector.options && labelSelector.options.length ?
        labelSelector.options[labelSelector.selectedIndex].value : null;
    if (!label) {
        alert ("Please choose a label for the vertical bar chart.");
        showTab ("layout");
        labelSelector.focus();
        return null;
    }
    var yAxisSelector = document.getElementById ("vbarchart_y_axis");
    var yAxis = yAxisSelector.options && yAxisSelector.options.length ?
        yAxisSelector.options[yAxisSelector.selectedIndex].value : null;
    if (!yAxis) {
        alert ("Please choose a y-axis attribute for the vertical bar chart.");
        showTab ("layout");
        yAxisSelector.focus();
        return null;
    }
    // Make sure that the user has chosen available fields.
    if (_indexInArray (chosenOutputs, label) < 0) {
        alert ("Please choose the vertical bar chart's label attribute from among " +
               "the report's outputs.");
        showTab ("layout");
        labelSelector.focus();
        return null;
    }
    // Make sure that the user has chosen available fields.
    if (_indexInArray (chosenOutputs, yAxis) < 0) {
        alert ("Please choose the vertical bar chart's y-axis attribute from among " +
               "the report's outputs.");
        showTab ("layout");
        yAxisSelector.focus();
        return null;
    }
    var w = _getIntValue ("vbarchart_width", "Please provide a number for chart width.");
    if (!w) {
        return null;
    }
    var h = _getIntValue ("vbarchart_height", "Please provide a number for chart height.");
    if (!h) {
        return null;
    }
    return " width=\"" + w + "\" height=\"" + h + "\" labels=\"" + label +
        "\" values=\"" + yAxis + "\"";
}




function _computeHBarChartXML (chosenOutputs) {
    var labelSelector = document.getElementById ("hbarchart_label");
    var label = labelSelector.options && labelSelector.options.length ?
        labelSelector.options[labelSelector.selectedIndex].value : null;
    if (!label) {
        alert ("Please choose a label for the horizontal bar chart.");
        showTab ("layout");
        labelSelector.focus();
        return null;
    }
    var xAxisSelector = document.getElementById ("hbarchart_x_axis");
    var xAxis = xAxisSelector.options && xAxisSelector.options.length ?
        xAxisSelector.options[xAxisSelector.selectedIndex].value : null;
    if (!xAxis) {
        alert ("Please choose a x-axis attribute for the horizontal bar chart.");
        showTab ("layout");
        xAxisSelector.focus();
        return null;
    }
    // Make sure that the user has chosen available fields.
    if (_indexInArray (chosenOutputs, label) < 0) {
        alert ("Please choose the horizontal bar chart's label attribute from among " +
               "the report's outputs.");
        showTab ("layout");
        labelSelector.focus();
        return null;
    }
    // Make sure that the user has chosen available fields.
    if (_indexInArray (chosenOutputs, xAxis) < 0) {
        alert ("Please choose the horizontal bar chart's y-axis attribute from among " +
               "the report's outputs.");
        showTab ("layout");
        xAxisSelector.focus();
        return null;
    }
    var w = _getIntValue ("hbarchart_width", "Please provide a number for chart width.");
    if (!w) {
        return null;
    }
    var h = _getIntValue ("hbarchart_height", "Please provide a number for chart height.");
    if (!h) {
        return null;
    }
    return " width=\"" + w + "\" height=\"" + h + "\" labels=\"" + label +
        "\" values=\"" + xAxis + "\"";
}



function _indexInArray (anArray, aValue) {
    for (var i = 0; i < anArray.length; i++) {
        if (anArray[i] == aValue) return i;
    }
    return -1;
}


function _getIntValue (eltId, message) {
    var box = document.getElementById (eltId);
    if (!box) return null;
    var value = box.value;
    if (!isInteger (value, false) || parseInt (value) <= 0) {
        showTab ("layout");
        box.focus();
        alert (message);
        return null;
    }
    return value;
}

function _computeReportXML (entityName, chosenOutputs) {
    // This is an ugly hack, because we need a quick-and-dirty way to set up the report
    // contents. We'll do better at some point.

    var formElements = document.mainForm.elements;

    // "Special provision" (read: hack) for the 'case' and 'lead' entities:
    var tblName = entityName == "Case" ? "Case_record" : (entityName == "Lead" ? "Opportunity" : entityName);
    var str =
        "<?xml version=\"1.0\"?>\n" +
        "<report name=\"main\">\n" +
        "  <query name=\"q1\" sourceEntity=\"db." + entityName + "\" tableName=\"" + tblName + "\">\n";
	
    var firstRec = _getIntValue("firstRec","Please specify a positive integer as first record.");
    if (firstRec == null) return null;
    var lastRec = _getIntValue ("lastRec", "Please specify a positive integer as last record.");
	
    if (lastRec == null) return null;
    var maxRecs = "25000";
	//window.getMaxRecsPerQuery(); (max record has been changed to 25,000)
	
    if (lastRec - firstRec + 1 > maxRecs) {
        alert ("Cannot return more than " + maxRecs + " records.");
        return null;
    }
    str += "    <recordRange first=\"" + (firstRec-1) + "\" last=\"" + (lastRec-1) + "\" />\n";
    // Compute the XML for the filter, if any.
    var filterElements = getFilterElements();
    if (filterElements != null && filterElements.length > 0) {
        var filterXml = computeFilterXml (filterElements, "    ");
        if (filterXml == null) {
            showTab ("filters");
            return null;
        }
        str += filterXml;
    }

    // Compute the XML for the data elements.
    var sortOrderStr = "    <sortOrder>\n";
    str += "    <dataElementsToGet>\n";
    for (var i = 0; i < chosenOutputs.length; i++) {
        var atrInternalName = chosenOutputs[i];
        var atrProps = _getAtrMetadata (atrInternalName);
        if (!atrProps) {
            alert ("Internal error: Can't find metadata for '" + atrInternalName + "'");
            return null;
        }
        str += "      <" + atrInternalName.replaceAll (" ", "_") + "__" + i +
            " attributeName=\"" + atrInternalName + "\" ";
        var desc = formElements["caption_" + atrInternalName].value.trim();
        if (desc == "") {
            alert ("Please provide a label for '" + atrProps.de + "'");
            formElements["caption_" + atrInternalName].focus();
            return "";
        }
        if (desc.indexOf ('"') >= 0) {
            alert ("Please do not use double quotes in captions.");
            formElements["caption_" + atrInternalName].focus();
            return "";            
        }
        str += " description=\"" + desc + "\"";
        var agfnSelector = formElements["outputType_" + atrInternalName];
        var agfn = agfnSelector.options[agfnSelector.selectedIndex].value;
        if (agfn != "value") {
            str += " aggregateFunction=\"" + agfn + "\"";
        }
        var displayTypeSel = formElements["displayType_" + atrInternalName];
        var displayType = displayTypeSel.options [displayTypeSel.selectedIndex].value;
        str += " displayType=\"" + displayType + "\"";
        str += "/>\n";
        var sortImg = document.getElementById ("sortOrderImg_" + atrInternalName);
        if (sortImg && sortImg.src.endsWith ("sort_down.gif")) {
            sortOrderStr += "      <" + atrInternalName + " order=\"down\" />\n";
        }
    }
    str +=
        "    </dataElementsToGet>\n";
    sortOrderStr += "    </sortOrder>\n";
    str += sortOrderStr;
    str += 
        "  </query>\n" +
        "</report>\n";
    // Check that, if the matrix layout has been chosen, the last chosen attribute is an aggregate
    // fn.
    if (document.getElementById ("layout_matrix").checked && chosenOutputs.length > 0) {
        var lastAtrName = chosenOutputs[chosenOutputs.length-1];
        var agfnSel = formElements["outputType_" + lastAtrName];
        var agfn = agfnSel.options[agfnSel.selectedIndex].text;
        if (agfn == "value") {
            alert ("Since you have chosen a matrix layout, the last chosen output column must " +
                   "be an aggregate function such as count, min or max.");
            return null;
        }
    }

    // All done
    return str;
}


function _getChosenOutputs () {
    // Return the chosen attributes in the order that the user selected, accounting for any
    // drag-and-drop activity.
    var outputAtrs = new Array();
    var outputAtrTable = document.getElementById ("outputAtrsTable");
    var rows = outputAtrTable.getElementsByTagName ("tr");
    for (var i = 1; i < rows.length; i++) {
        var cell0 = rows[i].getElementsByTagName("td")[0];
        if (cell0) {
            var inputs = cell0.getElementsByTagName("input");
            if (inputs && inputs.length > 0) {
                var input0 = inputs[0];
                if (input0.type.toLowerCase() == "checkbox" && input0.checked) {
                    outputAtrs[outputAtrs.length] = input0.name.substring(7);
                }
            }
        }
    }

    return outputAtrs;
}



// Drag functionality
var dragRowIndex = null;
var imageX = null, imageY = null;
function _pickIt (evt) {
    var button = document.all ? event.button : evt.which;
    if (button == 1) {
        var elt = document.all ? event.srcElement : evt.target;
        // elt.id will look like dragDiv_nnn where nnn is the row number.
        dragRowIndex = elt.id.substring (8);
        if (document.all) {
            event.cancelBubble = true;
            imageX = event.offsetX;
            imageY = event.offsetY;
        } else {
            evt.preventDefault();
            imageX = evt.clientX;
            imageY = evt.clientY;
            var dragDiv = document.getElementById ("dragIndicator");
            dragDiv.style.left = imageX;
            dragDiv.style.top = imageY;
        }
    }
    return false;
}


function _dragIt (evt) {
    if (dragRowIndex) {
        var dragDiv = document.getElementById ("dragIndicator");
        var category = document.getElementById ("outputCategory_" + dragRowIndex).innerHTML;
        var atrName  = document.getElementById ("outputAtrName_" + dragRowIndex).innerHTML;
        dragDiv.innerHTML = category + " : " + atrName;
        var s = dragDiv.style;
        if (document.all) {
            s.pixelLeft = event.clientX - imageX + document.body.scrollLeft + 20;
            s.pixelTop  = event.clientY - imageY + document.body.scrollTop;
            s.display = "block";
            event.cancelBubble = true;
        } else {
            s.display = "block";
            s.left = evt.clientX + 15 + "px";
            s.top  = (evt.clientY - dragDiv.offsetHeight/2) + "px";
        }
        return false;
    }
}


function _dropIt (evt) {
    var dragDiv = document.getElementById ("dragIndicator");
    dragDiv.style.display = "none";
    var target = document.all ? event.srcElement : evt.target;
    var button = document.all ? event.button : evt.which;
    var theDragRowIndex = dragRowIndex;
    dragRowIndex = null;
    if (button != 1) return false;
    if (!target) return false;
    var targetRowIndex = null;
    if (target.id.startsWith ("dragDiv_")) {
        targetRowIndex = target.id.substring (8);
    } else {
        if (target.tagName.toLowerCase() == "td") target = target.parentNode;
        if (target.id.startsWith ("outputRow_")) targetRowIndex = target.id.substring (10);
    }

    if (targetRowIndex && theDragRowIndex && targetRowIndex != theDragRowIndex) {
        var eventY = document.all ? event.clientY : evt.clientY;
        var oldHTML = document.getElementById ("outputRow_" + theDragRowIndex).innerHTML;
        var table = document.getElementById ("outputAtrsTable");

        
        var cellContent = new Array();
        var rowToDelete = _findRowNumber (table, theDragRowIndex);
        var rowToInsert = _findRowNumber (table, targetRowIndex);

        if (!rowToDelete || !rowToInsert) {
            return false; // Should not happen.
        }

        // Copy the contents of the row being dragged
        var tBody = table.getElementsByTagName("tbody")[0];
        var rows = tBody.getElementsByTagName("tr");
            
        var row = rows[rowToDelete];
        var rowCells = row.getElementsByTagName ("td");
        for (var i = 0; i < rowCells.length; i++) {
            var oldContent = rowCells[i].innerHTML;
            cellContent[i] = oldContent;
        }

        // Delete that row
        table.deleteRow (rowToDelete);

        // Create a row in the new position and copy the contents into it
        var newRow = table.insertRow (rowToInsert);
        var newRowCells = new Array();
        for (var i = 0; i < cellContent.length; i++) {
            newRowCells[i] = newRow.insertCell (i);
            newRowCells[i].innerHTML = cellContent[i];
        }

        // Special case: sort spec column
        newRowCells[6].align = "center";

        // Set up the needed ids for the row and its cells
        newRowCells[1].id = "outputCategory_" + theDragRowIndex;
        newRowCells[2].id = "outputAtrName_" + theDragRowIndex;
        newRow.id = "outputRow_" + theDragRowIndex;

        // Set up the drag handler
        var imageDivId = "dragDiv_" + theDragRowIndex;
        var imageDiv = document.getElementById (imageDivId);
        if (imageDiv) {
            imageDiv.onmousedown = _pickIt;
        }
        
        // alert (newRow.innerHTML); Debug
    }
}


function _findRowNumber (table, rowIndex) {
    var tBodyList = table.getElementsByTagName("tbody");
    var tBody = tBodyList ? tBodyList[0] : null;
    var rows = tBody ? tBody.getElementsByTagName("tr") : null;
    if (!rows) return null;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].id == "outputRow_" + rowIndex) return i;
    }
    return null;
}


function addVariableAttribute () {
}


var shownTabName = null;
function showTab (tabName) {
    if (shownTabName == tabName) return;
    var tabContent = document.getElementById ('chooser_' + tabName);
    if (tabContent) tabContent.style.display = "block";
    if (shownTabName) {
        tabContent = document.getElementById ('chooser_' + shownTabName);
        if (tabContent) tabContent.style.display = "none";
    }
    var tab = document.getElementById ('tab_' + tabName);
    if (tab) tab.className = "selectedTabClass";
    var tab = document.getElementById ('tab_' + shownTabName);
    if (tab) tab.className = "tabClass";
    shownTabName = tabName;
    if (tabName == "layout") {
        updateBarChartChoices();
    }
}


function doSaveAndRun (reportId) {
    // Tell the action sequence that the user wants to save and run.
    if (validate (true)) {
        getZcFormElement (document.mainForm, "0-2001").value = 1;
		document.getElementById('0-301-319').value = document.getElementById('lastRec').value;
		//alert(getZcFormElement (document.mainForm, "0-301-322").value)
			//alert("${editReport.report.inactive}")
        document.mainForm.submit();
    }
}


function doRun (reportId) {
    window.location.href = "runReport.html?reportId=" + reportId;
}

/* 
    * shoib 2013 11 07
*/
var mappings = {
    'order_header':'order_detail',
    'order_detail':'order_header',
    'invoice_header':'invoice_detail',
    'invoice_detail':'invoice_header',
    'tranx_header':'tranx_detail',
    'tranx_detail':'tranx_header',
    'quote_header': 'quote_detail',    
    'quote_detail': 'quote_header',
    'purch_order_header': 'purch_order_detail',    
    'purch_order_detail': 'purch_order_header'
};
var entityHdrOrDetArr = []; //this global
function allowHeaderOrDetail(name) {
    //first check for whether to validate
    if((name in mappings)  == 1) {
        var v = mappings[name];
            //then match check for opposite value exists in arr if then return false,else 
            //add current name
        if($.inArray(v, entityHdrOrDetArr) == -1) {  
            entityHdrOrDetArr.push(name);
        } else {
            return false;
        }
    } 
    return true;
}
function removeEntinameFromArr(name) {
    var ind = entityHdrOrDetArr.indexOf(name);
    if(ind != -1) {
        entityHdrOrDetArr.splice(ind, 1);
    }
}


$(document).ready(function() {
    $('body').append('<script type="text/Javascript" async = "false" src="/atCRM/javascript/JSON/jquery-latest.min.js"></script>');
    $('body').on('click', '.hdrOrDetCbx', function() {
        var t = $(this), name = t.attr('for');
        if(t.is(':checked') === true) {
            if(!allowHeaderOrDetail(name)){
                alert('You cannot perform this action. You can either choose a field from header object or a field from detail object!');
                return false;
            }
        } else {
            removeEntinameFromArr(name);
        } 
    });
});
/* end of shoib code */
