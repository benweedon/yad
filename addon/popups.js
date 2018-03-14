function yiddishRegex() {
    let regex = /(?:^|\s)/u.source;
    regex += '[';

    regex += [
        /א/u,
        /\u{FB2E}/u, // HEBREW LETTER ALEF WITH PATAH
        /\u{FB2F}/u, // HEBREW LETTER ALEF WITH QAMATS
        /ב/u,
        /\u{FB31}/u, // HEBREW LETTER BET WITH DAGESH
        /\u{FB4C}/u, // HEBREW LETTER BET WITH RAFE
        /ג/u,
        /ד/u,
        /ה/u,
        /ו/u,
        /\u{FB35}/u, // HEBREW LETTER VAV WITH DAGESH
        /\u{FB4B}/u, // HEBREW LETTER VAV WITH HOLAM
        /װ/u,
        /ױ/u,
        /ז/u,
        /ח/u,
        /ט/u,
        /י/,
        /\u{FB1D}/u, // HEBREW LETTER YOD WITH HIRIQ
        /ײ/u,
        /\u{FB1F}/u, // HEBREW LIGATURE YIDDISH YOD YOD PATAH
        /כ/u,
        /\u{FB3B}/u, // HEBREW LETTER KAF WITH DAGESH
        /ך/u,
        /ל/u,
        /מ/u,
        /ם/u,
        /נ/u,
        /ן/u,
        /ס/u,
        /ע/u,
        /פ/u,
        /\u{FB44}/u, // HEBREW LETTER PE WITH DAGESH
        /\u{FB4E}/u, // HEBREW LETTER PE WITH RAFE
        /ף/u,
        /צ/u,
        /ץ/u,
        /ק/u,
        /ר/u,
        /ש/u,
        /\u{FB2B}/u, // HEBREW LETTER SHIN WITH SIN DOT
        /ת/u,
        /\u{FB4A}/u // HEBREW LETTER TAV WITH DAGESH
    ].map(r => r.source).join('');

    regex += ']+';
    regex += /(?=$|\s)/u.source;
    return new RegExp(regex);
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
        let addend = val[result.index].match(/\s/) ? 1 : 0;
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
    let underlined = document.createElement("u");
    underlined.appendChild(document.createTextNode(text));
    return underlined;
}

function replaceWithNodes(node, newNodes) {
    for (let newNode of newNodes) {
        node.parentNode.insertBefore(newNode, node);
    }
    node.parentNode.removeChild(node);
}

for (let node of getTextNodes()) {
    let newNodes = produceNewNodes(node.nodeValue, yiddishRegex(), underline);
    replaceWithNodes(node, newNodes);
}
