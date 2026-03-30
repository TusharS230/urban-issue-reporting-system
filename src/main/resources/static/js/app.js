document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const roleSelect = document.getElementById("role");
  const departmentContainer = document.getElementById("departmentContainer");
  const messageBox = document.getElementById("message");

  // Show/Hide Department field
  roleSelect.addEventListener("change", function () {
    if (this.value === "WORKER") {
      departmentContainer.style.display = "block";
    } else {
      departmentContainer.style.display = "none";
    }
  });

  // Register Form Submit
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    messageBox.innerText = "";

    const user = {
      name: document.getElementById("name").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      role: roleSelect.value,
      location: document.getElementById("location").value,
      department:
        roleSelect.value === "WORKER"
          ? document.getElementById("department").value
          : null,
    };

    fetch("http://localhost:8080/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        messageBox.innerText = "User registered successfully!";

        form.reset();
        departmentContainer.style.display = "none";
        console.log(data);

        setTimeout(() => {
          messageBox.innerText = "";
        }, 3000);
      })
      .catch((error) => {
        document.getElementById("message").innerText = "Error registering user";
        console.error(error);
      });
  });
});
