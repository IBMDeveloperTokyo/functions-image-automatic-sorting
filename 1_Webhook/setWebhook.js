const BoxSDK = require('box-node-sdk');

/* Boxの自分のユーザーIDを入力 */
var userID = '';

/* 今回利用するBoxのフォルダIDを入力 */
var parentFolderID = '';

/* Webhookの送り先のURL（watson-box-appアクションのエンドポイント）を入力 */
var webhookurl = '';


var jsonConfig = require('../box.json');
var sdk = BoxSDK.getPreconfiguredInstance(jsonConfig);
var client = sdk.getAppAuthClient('user', userID);

// ファイルがアップロードされたときにWebhookを送るようセットする
client.webhooks.create(
    parentFolderID,
    client.itemTypes.FOLDER,
    webhookurl,
    [
        client.webhooks.triggerTypes.FILE.UPLOADED
    ],
    function (err, res) {
        if (err)
            console.error(err);
        else
            console.log(res);
    }
);
