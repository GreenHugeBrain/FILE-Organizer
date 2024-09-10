document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const accountLink = document.querySelector("#account");

    const updateAccountLink = (username) => {
        accountLink.textContent = username || "User";
        accountLink.setAttribute("href", "account.html");
    };

    const handleNotLoggedIn = () => {
        accountLink.textContent = "Register";
        accountLink.setAttribute("href", "register.html");
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch('https://avatarzone-api.onrender.com/user-loader', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                console.log("Token is invalid or expired");
                await refreshAccessToken();
                // Retry fetching user data after refreshing token
                const newToken = localStorage.getItem("token");
                if (newToken) {
                    return fetchUserData(); // Retry with new token
                } else {
                    console.error("Failed to refresh token, user needs to log in again");
                    handleNotLoggedIn();
                    return;
                }
            }

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("User not found, logging out...");
                    handleNotLoggedIn();
                    return;
                }
                throw new Error('Failed to load user data');
            }

            const data = await response.json();
            localStorage.setItem("userData", JSON.stringify(data));
            updateAccountLink(data.username);
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle unexpected errors
            handleNotLoggedIn();
        }
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) {
            console.error("Refresh token not available");
            handleNotLoggedIn();
            return;
        }

        try {
            const response = await fetch('https://avatarzone-api.onrender.com/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            if (data.token && data.refreshToken) {
                localStorage.setItem("token", data.token); // Save new access token
                localStorage.setItem("refreshToken", data.refreshToken); // Save new refresh token
                console.log("Tokens refreshed successfully");
            } else {
                throw new Error('Invalid token refresh response');
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            handleNotLoggedIn();
        }
    };

    // Load user data from localStorage if available
    const cachedUserData = localStorage.getItem("userData");
    if (cachedUserData) {
        const data = JSON.parse(cachedUserData);
        updateAccountLink(data.username);
    } else if (token) {
        await fetchUserData();
    } else {
        handleNotLoggedIn();
    }
});
    