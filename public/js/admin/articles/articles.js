function deleteArticle(article_id) {
    const postData = {
        article_id: article_id
    };

    fetch('/api/delete-article', {
            method: 'POST',
            body: JSON.stringify(postData),
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

document.getElementById('wordCountRange').addEventListener('change', function() {
    let wordCountRangeId = this.value;
    const postData = {
        word_count_range_id: wordCountRangeId
    };
    fetch('/api/filter-articles', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {
        let articleListElement = document.getElementById('article-list');
        let htmlArticleList = '';
        for(const article of json.articles) {
            htmlArticleList = htmlArticleList + 
                '<tr>' + 
                    '<td>' + article.source_name + '</td>' + 
                    '<td title="' + article.source_url + '">' +
                        (article.source_url.length <= 50 ? article.source_url : (article.source_url.substring(0, 50) + '...')) + 
                    '</td>' + 
                    '<td>' + article.word_count + '</td>' +
                    '<td><a href="/admin/article/' + article.uuid + '"><span class="oi oi-pencil"></span></a></td>' + 
                    '<td><span onClick="deleteArticle(' + article.uuid + ')">x</span></td>' + 
                '</tr>';
        }
        articleListElement.innerHTML = htmlArticleList;
    });
});