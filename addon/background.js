'use strict';

/* === eslint === */
/* global browser */
/* ============== */

var dict = null;

let xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        dict = JSON.parse(xmlHttp.responseText);
    }
}
xmlHttp.open('GET', 'https://raw.githubusercontent.com/benweedon/yiddish_dictionary/master/dict.json', true);
xmlHttp.send(null);

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg in dict) {
        sendResponse(dict[msg]);
    } else {
        sendResponse('');
    }
});
