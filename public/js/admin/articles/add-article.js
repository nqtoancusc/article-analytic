const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let channelElement = document.getElementById("channel");
    let channelId = channelElement.options[channelElement.selectedIndex].value || '';
    let articleSourceName = inputs[0].value || '';
    let articleSourceURL = inputs[1].value || '';
    //let articleImage = inputs[2].value || '';

    imageInput = inputs[2];
    const formData = new FormData();
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
        if (json.article) {
            let promptElementSourceURL = document.getElementById('articleSourceURLPrompt');
            promptElementSourceURL.innerText = "Article URL already exists";
            promptElementSourceURL.style.display = "block";
            setTimeout(function(){
                promptElementSourceURL.style.display = "none";
            }, 3000);
        } else {
            const postArticleData = {
                channel_id: channelId,
                source_name: articleSourceName,
                source_url: articleSourceURL,
                word_count: 0,
                //image_url: articleImage
            };
            fetch('/api/add-new-article', {
                    method: 'POST',
                    body: formData, //JSON.stringify(postArticleData),
                    headers: {
                        //'Content-type': 'application/json; charset=UTF-8'
                    }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (json.message === 'success') {
                    window.location.replace("/admin/articles");
                }
            });
        }
    });
})
