document.addEventListener("DOMContentLoaded", () => {
    fetch('https://avatarzone-api.onrender.com/adminpanel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        data.forEach(user => {
            fetch('https://avatarzone-api.onrender.com/checkBase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email }),
            })
        });
    })
    
})