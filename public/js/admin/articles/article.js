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
                source_url: articleSourceURL
            };
            fetch('/api/update-article', {
                    method: 'POST',
                    body: JSON.stringify(postArticleData),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
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