function deleteChannel(channelId) {
    const postData = {
        channelId: channelId
    };

    fetch('/api/delete-channel', {
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