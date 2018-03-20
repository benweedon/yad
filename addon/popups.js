'use strict';

const wordBoundary = /[\s`~!@#$%^&*()-_+={}[\]\\|;:'"<>,./?־\u2000-\u206F\u2E00-\u2E7F]/u;

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
        /י/,
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
    str = str.replace(/י\u05B4/ug, 'יִ');
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

function underline(text) {
    let underlined = document.createElement('u');
    underlined.appendChild(document.createTextNode(text));
    return underlined;
}

function replaceWithNodes(node, newNodes) {
    for (let newNode of newNodes) {
        node.parentNode.insertBefore(newNode, node);
    }
    node.parentNode.removeChild(node);
}

const regex = yiddishRegex();
for (let node of getTextNodes()) {
    let newNodes = produceNewNodes(normalize(node.nodeValue), regex, underline);
    replaceWithNodes(node, newNodes);
}
