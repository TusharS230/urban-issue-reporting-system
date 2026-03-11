let currentIssueId = null;

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  // check login
  if (!user || user.role !== "CITIZEN") {
    alert("Invalid session");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }

  const form = document.getElementById("issueForm");
  const messageBox = document.getElementById("message");

  const profile = JSON.parse(localStorage.getItem("user"));

  document.getElementById("userId").innerText = profile.id;
  document.getElementById("userName").innerText = profile.name;
  document.getElementById("userUsername").innerText = profile.username;
  document.getElementById("userLocation").innerText = profile.location;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    messageBox.innerText = "";

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append(
      "description",
      document.getElementById("description").value,
    );
    formData.append("category", document.getElementById("category").value);
    formData.append("priority", document.getElementById("priority").value);
    formData.append("location", document.getElementById("location").value);

    const imageFile = document.getElementById("image").files[0];
    formData.append("image", imageFile);

    fetch(`http://localhost:8080/issues/create/${user.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        messageBox.innerText = "Issue submitted successfully!";
        form.reset();
        loadMyIssues(user.id);
      })
      .catch((error) => {
        messageBox.innerText = "Error submitting issue";
        console.log(error);
      });
  });

  loadMyIssues(user.id);
});

function loadMyIssues(citizenId) {
  fetch(`http://localhost:8080/issues/citizen/${citizenId}`)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#issueTable tbody");
      tableBody.innerHTML = "";

      data.forEach((issue) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td>${issue.description}</td>
      <td>${issue.priority}</td>
      <td>${formatStatus(issue.status)}</td>

      <td>
      ${issue.assignedWorker ? issue.assignedWorker.name : "Not Assigned"}
      </td>

      <td class="date-col">${issue.createdAt ? issue.createdAt.substring(0, 10) : ""}</td>

      <td>
      ${
        issue.imagePath
          ? `<img src="http://localhost:8080/uploads/${issue.imagePath}" width="80">`
          : "No image"
      }
      </td>

      <td>
      <button onclick="showComments(${issue.id})">View</button>
      </td>

      <td>
      <button onclick="showTimeline(${issue.id})">Timeline</button>
      </td>
      `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.log("Error loading issues", error);
    });
}

function formatStatus(status) {
  if (status === "OPEN") {
    return `<span class="status-open">OPEN</span>`;
  }

  if (status === "ASSIGNED") {
    return `<span class="status-assigned">ASSIGNED</span>`;
  }

  if (status === "RESOLVED") {
    return `<span class="status-resolved">RESOLVED</span>`;
  }
}

function showComments(issueId) {
  currentIssueId = issueId;

  fetch(`http://localhost:8080/comments/issue/${issueId}`)
    .then((response) => response.json())
    .then((data) => {
      const list = document.getElementById("commentList");
      list.innerHTML = "";

      data.forEach((c) => {
        const div = document.createElement("div");

        div.innerHTML = `
      <b>${c.user.name}</b> :
      ${c.comment}
      <br>
      <small>${c.createdAt.substring(0, 16)}</small>
      <hr>
      `;

        list.appendChild(div);
      });

      document.getElementById("commentModal").style.display = "flex";
    });
}

function addComment() {
  const user = JSON.parse(localStorage.getItem("user"));
  const commentText = document.getElementById("newComment").value;

  fetch(`http://localhost:8080/comments/add/${currentIssueId}/${user.id}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(commentText),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("newComment").value = "";
      showComments(currentIssueId);
    });
}

function closeComments() {
  document.getElementById("commentModal").style.display = "none";
}

function showTimeline(issueId) {
  fetch(`http://localhost:8080/timeline/issue/${issueId}`)
    .then((response) => response.json())
    .then((data) => {
      const list = document.getElementById("timelineList");
      list.innerHTML = "";

      data.forEach((t) => {
        const div = document.createElement("div");
        const role = t.user.role ? t.user.role.toLowerCase() : "";

        div.innerHTML = `
          <div class="timeline-item">
          <strong>${t.action.replace("_", " ")}</strong> by ${t.user.name} (${role})
          <br>
          <small>${t.time.substring(0, 16)}</small>
          </div>
          <hr>
        `;

        list.appendChild(div);
      });

      document.getElementById("timelineModal").style.display = "flex";
    });
}

function closeTimeline() {
  document.getElementById("timelineModal").style.display = `none`;
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
