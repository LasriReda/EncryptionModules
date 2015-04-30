
/*
 * Generate password for AES encryption
 */
function AESGeneratePSW(){
	var chars = "0123456789AabBCcDdeEFfgGHhIiJjKkLlmMNnoOpPQqRrsStTUuvVWwxXyYZz_-+/*,";
	var size = 50;
	var passWord = '';
	for (var i=0; i<size; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		passWord += chars.substring(rnum,rnum+1);
	}
	return passWord;
}
