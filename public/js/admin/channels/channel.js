const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let channelId = inputs[0].value || '';
    let channelName = inputs[1].value || '';
    if (channelName === '') {
        let promptElement = document.getElementById('channelNamePrompt');
        promptElement.style.display = "block";
        setTimeout(function(){
            promptElement.style.display = "none";
        }, 3000);
        return;
    }
    const postData = {
        channelId: channelId,
        channelName: channelName
    };

    fetch('/api/update-channel', {
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
            window.location.replace("/admin/channels");
        } else {
            let promptElement = document.getElementById('prompt');
            promptElement.style.display = "block";
            setTimeout(function(){
                promptElement.style.display = "none";
            }, 3000);
        }
    });
})