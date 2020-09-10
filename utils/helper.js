const DomParser = require('dom-parser');

function __getText(node) {
    let text = "";
    for(let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i];
        /*
        - nodeType = 1: An Element node like <p> or <div>.
        - nodeType = 3: The actual Text inside an Element or Attr.
        Reference: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        */
        if ((childNode.nodeType != 1) && (childNode.nodeType != 3)) {
            continue;
        }
        text += childNode.nodeType != 1 ? childNode.textContent : __getText(childNode);
    }
    return text;
}

exports.countWordNumber = (html) => {
    const parser = new DomParser();
    let doc = parser.parseFromString(html);
    let bodyNode = doc.getElementsByTagName("body")[0];
    let text = __getText(bodyNode);
    return text.split(' ').length;
}