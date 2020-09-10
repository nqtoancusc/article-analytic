function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;  
    }

    return true;
}

function getText(node) {
    let text = "";
    for(let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i];
        if ((childNode.nodeType != Node.ELEMENT_NODE) && (childNode.nodeType != Node.TEXT_NODE)) {
            continue;
        }
        text += childNode.nodeType != 1 ? childNode.nodeValue : getText(childNode);
    }
    return text;
}

function countWordNumber(html) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    let bodyNode = doc.getElementsByTagName("body")[0];
    let text = getText(bodyNode);
    let wordCount = text.split(' ').length;
    return wordCount;
}