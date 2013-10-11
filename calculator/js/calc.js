(function() {
	var res=0, opr, temp_res='', doc = document, lbls = doc.getElementsByTagName('label'), lbl_len = lbls.length,
		res_obj = doc.getElementById('result'), pre_num='';

	//attach click event to each label
	for(var i=0; i<lbl_len; i += 1) {
		lbls[i].addEventListener('click', performCalculation);
	}

	function performCalculation(e) {		
		//get the text it may be number or operator, get asci val of character
		var val = e['target']['innerText'].trim(), asci = val.charCodeAt(0), inp_res = res_obj.value, fin_res; 
		 
		//perform the calculation here
		if(asci == 61) {				
			fin_res  = eval(temp_res + res_obj.value);
			res_obj.value = fin_res;
			temp_res = 	fin_res;
			pre_num = '';			
			return;
		}

		//empty the result
		if(asci == 65) {
			res_obj.value = '';
			return;
		}

		//check if it is other than number
		if(isNaN(val)) {
			temp_res += pre_num + '' + val;
			res_obj.value = '';
			return;
		}

		//if it is number then just concat and show it user
		pre_num = res_obj.value += '' + val;

	}
})();