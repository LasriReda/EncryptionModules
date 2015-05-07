
/* JavaScript content from js/SendRetreiveData.js in folder common */
var busyIndicator = null;
busyIndicator = new WL.BusyIndicator('appBody');

var data="";
var id="";
$("#send").on("click",sendData);

var PublicKey="";
var PrivatKey="";
var PassWord="";

function sendData(){
	id=$("#ID").val();
	data=$("#device2adapter").val();
	busyIndicator.show();
	var invocationData = {
			adapter : 'RSA_KeyGeneration',
			procedure : 'checkDevice',
			parameters : [id],
			compressResponse: true
		};
	
	WL.Client.invokeProcedure(invocationData,{
		timeout : 90000,
		onSuccess : getPublicKeySuccess,
		onFailure : getPublicKeyFailure
	});
}

function getPublicKeySuccess(result){
	WL.Logger.debug("retreive public key success");
	if (result.invocationResult.pubkey != "error")
	{
		PublicKey = result.invocationResult.pubkey;
		///alert(PublicKey);
		WL.Logger.debug("got public key");
		WL.Logger.debug("generationg secret key ...");
		PassWord=AESGeneratePSW();
		WL.Logger.debug("secret key generated"+PassWord);
		WL.Logger.debug("encrypting data with secret key ...");
		var cypherText = EncryptData(data,PassWord);
		WL.Logger.debug("data encrypted");
		WL.Logger.debug("encrypting secret key with the rsa public key ...");
		var encryptedSKey = Encrypt(PassWord,PublicKey);
		WL.Logger.debug("seecret key encrypted");
		WL.Logger.debug("sending the encrypted data and the encrypted secret key");
		sendEncryptedData(cypherText,encryptedSKey);
	}
	else {
		busyIndicator.hide();
		alert("error !");
	}
	
}

function sendEncryptedData(cypherText, encryptedSKey){
	var invocationData = {
			adapter : 'RSA_Encryption',
			procedure : 'Device2adapter',
			parameters : [id, cypherText, encryptedSKey],
			compressResponse: true
		};
	
	WL.Client.invokeProcedure(invocationData,{
		timeout : 60000,
		onSuccess : sendEncryptedDataSuccess,
		onFailure : sendEncryptedDataFailure
	});
}

function sendEncryptedDataSuccess(result){
	WL.Logger.debug("Send encrypted data success");
	busyIndicator.hide();
	if(result.invocationResult.isSuccessful && result.invocationResult.state){
		alert("Data sent successfuly !");
	}
}

function sendEncryptedDataFailure(result){
	WL.Logger.error("Send encrypted data failure");
	busyIndicator.hide();
	alert("Cannot send the data !");
	/*WL.SimpleDialog.show("Server", "Cannot send data !", 
			[{
				text : 'Reload App',
				handler : WL.Client.reloadApp
			}]);*/
}

function getPublicKeyFailure(result){
	WL.Logger.error("retreive public key failure");
	busyIndicator.hide();
	alert("Server error !");
	/*WL.SimpleDialog.show("RSA", "Cannot get pblic key !", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp
	}]);*/
}


