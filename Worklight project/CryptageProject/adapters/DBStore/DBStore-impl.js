 
var storeKeysStatement1 = WL.Server.createSQLStatement("insert into keystore values ( ? , ? , ? , ? , ?)");
var storeKeysStatement2 = WL.Server.createSQLStatement("update keystore set secretkey = ? , publickey = ? , privatekey = ? , message = ? where id = ?");
function storeKeys(id,sk,pubk,prvk,msg) {
	var exist = IDExist(id);
	if(exist){
		// update the keys in the table with the new ones
		return WL.Server.invokeSQLStatement({
			preparedStatement : storeKeysStatement2,
			parameters : [sk,pubk,prvk,msg,id]
		});
	}
	else{
		// insert a new line in the table for the new detected device 
		return WL.Server.invokeSQLStatement({
			preparedStatement : storeKeysStatement1,
			parameters : [id,sk,pubk,prvk,msg]
		});
	}
}

var getPrivateKeyStatement = WL.Server.createSQLStatement("select privatekey from keystore where id = ? ");
function getPrivateKey(id) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getPrivateKeyStatement,
		parameters : [id]
	});
}

var StoreMSGSKeyStatement = WL.Server.createSQLStatement("update keystore set message = ? , secretkey = ? where id = ?");
function StoreMSGSKey(id , plainText , Secretkey) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : StoreMSGSKeyStatement,
		parameters : [plainText , Secretkey , id]
	});
}

var SelectAllStatement = WL.Server.createSQLStatement("select * from keystore");
function SelectAllfromDB() {
	return WL.Server.invokeSQLStatement({
		preparedStatement : SelectAllStatement,
		parameters : []
	});
}

function IDExist(id){
	var DBTable = SelectAllfromDB();
	var l = DBTable.resultSet.length;
	var i=0;
	var exist=false;
	for(i=0;i<l;i++){
		if(DBTable.resultSet[i].id == id){
			exist = true;
			break;
		}
	}
	return exist;
}