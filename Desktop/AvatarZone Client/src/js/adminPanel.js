document.addEventListener("DOMContentLoaded", () => {
    // Check if user is admin
    const cachedUserData = localStorage.getItem("userData");

    if (!cachedUserData) {
        // No user data found, redirect to index.html
        window.location.href = 'index.html';
        return;
    }

    const userData = JSON.parse(cachedUserData);
    const token = userData.token; // Assuming token is stored in userData

    if (userData.username !== 'AdminUser') {
        // User is not an admin, redirect to index.html
        window.location.href = 'index.html';
        return;
    }

    // Proceed with fetching data if user is admin
    fetch('https://avatarzone-api.onrender.com/adminpanel', {
        method: 'POST', // Changed to GET for fetching data
        headers: {
            'Authorization': `Bearer ${token}`, // Include token in headers
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('tbody');
        
        if (tableBody) {
            data.forEach(user => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.confirmed ? 'Yes' : 'No'}</td>
                    <td>${user.basicProduct ? 'Yes' : 'No'} 
                        <input type="date" class="expire-date" data-id="${user._id}" data-perm="basicProduct">
                        <button class="btn btn-secondary give-perm-btn" data-id="${user._id}" data-perm="basicProduct">Give Perm</button>
                    </td>
                    <td>${user.standartProduct ? 'Yes' : 'No'} 
                        <input type="date" class="expire-date" data-id="${user._id}" data-perm="standartProduct">
                        <button class="btn btn-secondary give-perm-btn" data-id="${user._id}" data-perm="standartProduct">Give Perm</button>
                    </td>
                    <td>${user.premiumProduct ? 'Yes' : 'No'} 
                        <input type="date" class="expire-date" data-id="${user._id}" data-perm="premiumProduct">
                        <button class="btn btn-secondary give-perm-btn" data-id="${user._id}" data-perm="premiumProduct">Give Perm</button>
                    </td>
                    <td>${user.proProduct ? 'Yes' : 'No'} 
                        <input type="date" class="expire-date" data-id="${user._id}" data-perm="proProduct">
                        <button class="btn btn-secondary give-perm-btn" data-id="${user._id}" data-perm="proProduct">Give Perm</button>
                    </td>
                    <td>${user.dateOfBirth}</td>
                `;
                
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.give-perm-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const userId = event.target.getAttribute('data-id');
                    const permType = event.target.getAttribute('data-perm');
                    const expireDate = document.querySelector(`.expire-date[data-id="${userId}"][data-perm="${permType}"]`).value;
                    givePermission(userId, permType, expireDate);
                });
            });
        } else {
            console.error('Table body not found');
        }
    })
    .catch(error => console.error('Error fetching data:', error));

    function givePermission(userId, permType, expireDate) {
        fetch('https://avatarzone-api.onrender.com/permissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify({
                userId: userId,
                permType: permType,
                expireDate: expireDate // Send expiration date
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Permission granted:', data);
            // Optionally, refresh the table or provide feedback
        })
        .catch(error => console.error('Error granting permission:', error));
    }
});
