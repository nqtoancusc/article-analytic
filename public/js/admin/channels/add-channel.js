
const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let name = inputs[0].value || '';
    if (name === '') {
        let promptElement = document.getElementById('channelNamePrompt');
        promptElement.innerText = "Missing channel name";
        promptElement.style.display = "block";
        setTimeout(function(){
            promptElement.style.display = "none";
        }, 3000);
        return;
    }

    const postData = {
        name: inputs[0].value
    };

    fetch('/api/get-channel-by-name', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        if (json.channel) {
            let promptElement = document.getElementById('channelNamePrompt');
            promptElement.innerText = "Channel name already exists";
            promptElement.style.display = "block";
            setTimeout(function(){
                promptElement.style.display = "none";
            }, 3000);
        } else {
            fetch('/api/add-new-channel', {
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
                }
            });
        }
    });
})