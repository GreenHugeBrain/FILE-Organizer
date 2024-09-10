document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("myForm");
    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const dateofbirth = document.getElementById("dateofbirth");
    const submitRegister = document.getElementById("submit");

    const registerUser = () => {
        submitRegister.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('https://avatarzone-api.onrender.com/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: nameInput.value,
                        email: emailInput.value,    
                        password: passwordInput.value,
                        dateOfBirth: dateofbirth.value
                    })
                });

                if (response.ok) {
                    alert('Registration successful! Please check your email to confirm your account.');
                } else {
                    alert('Registration failed. Please try again.');
                }
            } catch (error) {
                console.log(error);
                alert('An error occurred during registration. Please try again later.');
            }
        });
    };

    registerUser();
});
