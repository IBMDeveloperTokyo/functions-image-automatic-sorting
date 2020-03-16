var BoxSDK = require('box-node-sdk');
var request = require('request');
var jsonConfig = require('./box.json');
var sdk = BoxSDK.getPreconfiguredInstance(jsonConfig);

/**
  * @param Boxから送られたWebhook
  *
  * @return ファイルIDと移動先のフォルダID
**/
function myAction(params){
    var client = sdk.getAppAuthClient('user', params.created_by.id);
    var parentFolder = params.source.parent.id;
    var sourcefileID = params.source.id;
    var apiKey = params.api_key;                                                                // Visual RecognitionのAPIキー
    var classifierids = [params.classifier_id];                                                 // Visual RecognitionのカスタムクラスID

    return new Promise (function(resolve, reject){
        client.files.getDownloadURL(sourcefileID)                                               // アップロードされたファイルのurlを取得
            .then(downloadURL => {
                    request({                                                                   // Watson Visual Recognitionで分類
                        method: 'POST',
                        url:    'https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?' +
                                'version=2018-03-19',
                        auth: {
                                user: "apikey",
                                password: apiKey
                              },
                        formData: {
                                url: downloadURL,
                                classifier_ids:classifierids
                        },
                        json: true
                    }, (err, response, body) => {
                        if (err) {
                          reject (err);
                        } else {
                            var top_class = body.images[0].classifiers[0].classes[0].class;
                            client.folders.get(parentFolder, null,                              // Visual Recognitionの分類結果のクラスに該当するフォルダのIDを取得
                                function(err, res){
                                        var array = res.item_collection.entries;
                                        for (let index = 0; index < array.length; index++) {
                                            const element = array[index].name;
                                            if (element === top_class){
                                                var folderID = array[index].id;
                                            }
                                        }
                                        resolve({"fileID": sourcefileID, "targetFolderID": folderID, "userID":params.created_by.id});
                                }
                            );
                        }
                      });
            });
    });
}

exports.main = myAction;
