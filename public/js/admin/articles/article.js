const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let channelElement = document.getElementById("channel");
    let channelId = channelElement.options[channelElement.selectedIndex].value || '';
    let articleId = inputs[0].value || '';
    let articleSourceName = inputs[1].value || '';
    let articleSourceURL = inputs[2].value || '';
    let hiddenArticleSourceURL = inputs[3].value || '';

    imageInput = inputs[4];
    const formData = new FormData();
    formData.append("article_id", articleId);
    formData.append("channel_id", channelId);
    formData.append("source_name", articleSourceName);
    formData.append("source_url", articleSourceURL);
    formData.append("image", imageInput.files[0]);

    if (channelId === '') {
        let promptElementChannel = document.getElementById('channelPrompt');
        promptElementChannel.style.display = "block";
        setTimeout(function(){
            promptElementChannel.style.display = "none";
        }, 3000);
        return;
    }
    if (articleSourceName === '') {
        let promptElementSourceName = document.getElementById('articleSourceNamePrompt');
        promptElementSourceName.style.display = "block";
        setTimeout(function(){
            promptElementSourceName.style.display = "none";
        }, 3000);
        return;
    }
    if ((articleSourceURL === '') || !(isValidUrl(articleSourceURL))) {    
        let promptElementSourceURL = document.getElementById('articleSourceURLPrompt');
        promptElementSourceURL.innerText = "Missing Source URL";
        promptElementSourceURL.style.display = "block";
        setTimeout(function(){
            promptElementSourceURL.style.display = "none";
        }, 3000);
        return;
    }

    const postSourceURLData = {
        source_url: articleSourceURL
    };

    fetch('/api/get-article-by-source-url', {
        method: 'POST',
        body: JSON.stringify(postSourceURLData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        if ((json.article.source_url) && (hiddenArticleSourceURL !== articleSourceURL)) {
            let promptElementSourceURL = document.getElementById('articleSourceURLPrompt');
            promptElementSourceURL.innerText = "Source URL already exists";
            promptElementSourceURL.style.display = "block";
            setTimeout(function(){
                promptElementSourceURL.style.display = "none";
            }, 3000);
        } else {
            const postArticleData = {
                article_id: articleId,
                channel_id: channelId,
                source_name: articleSourceName,
                source_url: articleSourceURL,
                image: image
            };
            fetch('/api/update-article', {
                    method: 'POST',
                    body: formData, //JSON.stringify(postArticleData),
                    headers: {
                        //'Content-type': 'application/json; charset=UTF-8'
                        //"Content-Type": "multipart/form-data"
                    }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (json.message === 'success') {
                    //window.location.replace("/admin/articles");
                }
            });
        }
    });
})

function getBase64Image(imgElem) {
    // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
    var canvas = document.createElement("canvas");
    canvas.width = imgElem.clientWidth;
    canvas.height = imgElem.clientHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElem, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}