'use strict';

/* === eslint === */
/* global browser */
/* ============== */

var dict = null;

let minDictRequest = new XMLHttpRequest();
minDictRequest.addEventListener('readystatechange', function() {
    if (minDictRequest.readyState == 4 && minDictRequest.status == 200) {
        dict = JSON.parse(minDictRequest.responseText)
    }
});
minDictRequest.open('GET', 'https://benweedon.github.io/yiddish_dictionary/min.json', true);
minDictRequest.send(null);

function handleMessage(msg, sender, sendResponse) {
    if (dict != null) {
        if (msg in dict) {
            sendResponse(dict[msg]);
        } else {
            sendResponse('');
        }
        return false;
    } else {
        setTimeout(handleMessage, 100, msg, sender, sendResponse);
        return true;
    }
}

browser.runtime.onMessage.addListener(handleMessage);
