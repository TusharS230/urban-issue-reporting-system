document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageBox = document.getElementById("message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    messageBox.innerText = "";

    const loginData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        return data;
      })
      .then((data) => {
        messageBox.innerText = "Login successful!";
        // console.log(data);

        // save to localStorage
        localStorage.setItem("user", JSON.stringify(data));

        if (data.role === "CITIZEN") {
          window.location.href = "citizen-dashboard.html";
        } else if (data.role === "WORKER") {
          window.location.href = "worker-dashboard.html";
        } else if (data.role === "ADMIN") {
          window.location.href = "admin-dashboard.html";
        }
      })
      .catch((error) => {
        messageBox.innerText = error.message;
      });
  });
});
