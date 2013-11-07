${runReport.report.runResult.escapedString}

<comment>
${runReport.report.runResult.result}
----------- Chopped Tabular: ----------------------
${runReport.report.runResult.chopCurrTabular}
----------- Chopped Matrix: ----------------------
${runReport.report.runResult.chopCurrMatrix}
----------- Chopped Collapsed: ----------------------
${runReport.report.runResult.chopCurrCollapsed}-------------------------
${runReport.report.runResult.result}
<if stringLib.substring (runReport.report.runResult.escapedString, "30", "36") == "matrix">
	${stringLib.prefix (runReport.report.runResult.result, stringLib.lastIndex (runReport.report.runResult.escapedString, "<!--  rept_template -->"))}
<else>
	B
</if>
${rptDtl}
${runReport.report.runResult.result}
</comment>