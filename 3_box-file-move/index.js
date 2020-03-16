var BoxSDK = require('box-node-sdk');

var jsonConfig = require('./box.json');
var sdk = BoxSDK.getPreconfiguredInstance(jsonConfig);

/**
  * @param 移動させるファイルIDと、移動先のフォルダID
  *
  * @return ファイル移動の処理結果
**/
function myAction(params){
    var client = sdk.getAppAuthClient('user', params.userID);

    return new Promise (function(resolve, reject){
        var sourcefileID = params.fileID;
        var targetFolderID = params.targetFolderID;

        client.files.move(sourcefileID, targetFolderID, 
            function(err, res){
                if (err)
                    reject(err);
                else
                    resolve({ message: "success!"});
            }); 
    });
}

exports.main = myAction;