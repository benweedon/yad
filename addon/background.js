'use strict';

/* === eslint === */
/* global browser */
/* ============== */

var dict = null;

let latestReleaseRequest = new XMLHttpRequest();
latestReleaseRequest.addEventListener('readystatechange', function() {
    if (latestReleaseRequest.readyState == 4 && latestReleaseRequest.status == 200) {
        let response = JSON.parse(latestReleaseRequest.responseText)
        let assetUrl;
        for (let asset of response.assets) {
            if (asset.name == 'min.json') {
                assetUrl = asset.url;
            }
        }

        let dictRequest = new XMLHttpRequest();
        dictRequest.addEventListener('readystatechange', function() {
            if (dictRequest.readyState == 4 && dictRequest.status == 200) {
                dict = JSON.parse(dictRequest.responseText);
            }
        });
        dictRequest.open('GET', assetUrl, true);
        dictRequest.setRequestHeader('Accept', 'application/octet-stream');
        dictRequest.send(null);
    }
});
latestReleaseRequest.open('GET', 'https://api.github.com/repos/benweedon/yiddish_dictionary/releases/latest', true);
latestReleaseRequest.send(null);

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg in dict) {
        sendResponse(dict[msg]);
    } else {
        sendResponse('');
    }
});
