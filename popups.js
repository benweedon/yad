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
let newNodes = [];
let node;
while (node = walk.nextNode()) {
    let val = node.nodeValue;
    let toAdd = [];
    let result;
    while (result = val.match(/(?:^|\s)\S{3}(?=$|\s)/)) {
        let addend = val[result.index].match(/\s/) ? 1 : 0;
        let preceding = val.substring(0, result.index + addend);
        if (preceding.length != 0) {
            toAdd.push(document.createTextNode(preceding));
            val = val.substring(result.index + addend);
        }
        let underlined = document.createElement("u");
        underlined.appendChild(document.createTextNode(result[0].substring(addend)));
        toAdd.push(underlined);
        val = val.substring(result[0].length - addend);
    }
    if (val.length != 0) {
        toAdd.push(document.createTextNode(val));
    }
    newNodes.push([node, toAdd]);
}
for (let [node, sibs] of newNodes) {
    for (let newNode of sibs) {
        node.parentNode.insertBefore(newNode, node);
    }
    node.parentNode.removeChild(node);
}
