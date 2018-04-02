'use strict';

/* === eslint === */
/* global browser */
/* ============== */

class Popup {
    addToDocument() {
        let popup = document.createElement('div');
        popup.id = 'yad_popup';
        document.body.appendChild(popup);
        this.hide();
    }

    setDefinition(yiddish, entry) {
        let elt = document.getElementById('yad_popup');
        // remove all child elements (this is faster than setting innerHTML to '':
        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript)
        while (elt.hasChildNodes()) {
            elt.removeChild(elt.lastChild);
        }

        let newNodes = [];
        if (entry == '') {
            let p = document.createElement('p');
            p.textContent = 'No definition found';
            newNodes.push(p);
        } else {
            let yiddishHeader = document.createElement('h1');
            yiddishHeader.textContent = yiddish;
            newNodes.push(yiddishHeader);

            let posParagraph = document.createElement('p');
            let posItalic = document.createElement('i');
            posItalic.textContent = entry._pos;
            posParagraph.appendChild(posItalic);
            newNodes.push(posParagraph);

            let proParagraph = document.createElement('p');
            let proItalic = document.createElement('i');
            proItalic.textContent = entry._pro;
            proParagraph.appendChild(proItalic);
            newNodes.push(proParagraph);

            let engParagraph = document.createElement('p');
            engParagraph.textContent = entry.eng[0];
            newNodes.push(engParagraph);
        }
        for (let node of newNodes) {
            elt.appendChild(node);
        }
    }

    setLocation(x, y) {
        let elt = document.getElementById('yad_popup');
        elt.style.left = x + 'px';
        let height = elt.getBoundingClientRect().height;
        elt.style.top = (y - height) + 'px';
    }

    show() {
        document.getElementById('yad_popup').style.visibility = 'visible';
    }

    hide() {
        document.getElementById('yad_popup').style.visibility = 'hidden';
    }
}

const popup = new Popup();
popup.addToDocument();

const wordBoundary = /[\s`~!@#$%^&*()\-_+={}[\]\\|;:'"<>,./?־\u2000-\u206F\u2E00-\u2E7F]/u;

function yiddishRegex() {
    let regex = '(?:^|' + wordBoundary.source + ')';

    regex += '[';
    regex += [
        /א/u,
        /אַ/u,
        /אָ/u,
        /ב/u,
        /בּ/u,
        /בֿ/u,
        /ג/u,
        /ד/u,
        /ה/u,
        /ו/u,
        /וּ/u,
        /וֹ/u,
        /װ/u,
        /ױ/u,
        /ז/u,
        /ח/u,
        /ט/u,
        /י/u,
        /יִ/u,
        /ײ/u,
        /ײַ/u,
        /כ/u,
        /כּ/u,
        /ך/u,
        /ל/u,
        /מ/u,
        /ם/u,
        /נ/u,
        /ן/u,
        /ס/u,
        /ע/u,
        /פ/u,
        /פּ/u,
        /פֿ/u,
        /ף/u,
        /צ/u,
        /ץ/u,
        /ק/u,
        /ר/u,
        /ש/u,
        /שׂ/u,
        /ת/u,
        /תּ/u
    ].map(r => r.source).join('');
    regex += ']+';

    regex += '(?=$|' + wordBoundary.source + ')';
    return new RegExp(regex);
}

function normalize(str) {
    str = str.replace(/א\u05B7/ug, 'אַ');
    str = str.replace(/א\u05B8/ug, 'אָ');
    str = str.replace(/ב\u05BC/ug, 'בּ');
    str = str.replace(/ב\u05BF/ug, 'בֿ');
    str = str.replace(/ו\u05BC/ug, 'וּ');
    str = str.replace(/ו\u05B9/ug, 'וֹ');
    str = str.replace(/ו\u05BA/ug, 'וֹ');
    str = str.replace(/וו/ug, 'װ');
    str = str.replace(/וי/ug, 'ױ');
    str = str.replace(/י\u05B4/ug, 'יִ');
    str = str.replace(/יי/ug, 'ײ');
    str = str.replace(/יי\u05B7/ug, 'ײַ');
    str = str.replace(/ײ\u05B7/ug, 'ײַ');
    str = str.replace(/כ\u05BC/ug, 'כּ');
    str = str.replace(/פ\u05BC/ug, 'פּ');
    str = str.replace(/פ\u05BF/ug, 'פֿ');
    str = str.replace(/ש\u05C2/ug, 'שׂ');
    str = str.replace(/ת\u05BC/ug, 'תּ');
    return str;
}

function getTextNodes() {
    let walk = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                if (node.nodeValue.trim().length == 0 ||
                    ['SCRIPT', 'STYLE'].includes(node.parentNode.tagName)) {
                    return NodeFilter.FILTER_SKIP;
                } else {
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        },
        false
    );
    let nodes = [];
    let node;
    while (node = walk.nextNode()) {
        nodes.push(node);
    }
    return nodes;
}

function produceNewNodes(val, regex, f) {
    let nodes = [];
    let result;
    while (result = val.match(regex)) {
        let addend = val[result.index].match(wordBoundary) ? 1 : 0;
        let preceding = val.substring(0, result.index + addend);
        if (preceding.length != 0) {
            nodes.push(document.createTextNode(preceding));
            val = val.substring(result.index + addend);
        }
        nodes.push(f(result[0].substring(addend)));
        val = val.substring(result[0].length - addend);
    }
    if (val.length != 0) {
        nodes.push(document.createTextNode(val));
    }
    return nodes;
}

function setSpan(text) {
    let span = document.createElement('span');
    span.classList.add('yad_word');
    span.addEventListener('mouseover', function() {
        browser.runtime.sendMessage(text)
            .then(
                function(msg) {
                    popup.setDefinition(text, msg);
                    let rect = span.getBoundingClientRect();
                    popup.setLocation(rect.left, rect.top);
                    popup.show();
                },
                function() {
                    // TODO: handle error here
                }
            );
    });
    span.addEventListener('mouseout', function() {
        popup.hide();
    });
    span.appendChild(document.createTextNode(text));
    return span;
}

function replaceWithNodes(node, newNodes) {
    for (let newNode of newNodes) {
        node.parentNode.insertBefore(newNode, node);
    }
    node.parentNode.removeChild(node);
}

const regex = yiddishRegex();
for (let node of getTextNodes()) {
    let newNodes = produceNewNodes(normalize(node.nodeValue), regex, setSpan);
    replaceWithNodes(node, newNodes);
}
