let currentIssueId = null;

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  // const worker = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "WORKER") {
    alert("Invalid session");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }

  document.getElementById("workerId").innerText = user.id;
  document.getElementById("workerName").innerText = user.name;
  document.getElementById("workerUsername").innerText = user.username;
  document.getElementById("workerDepartment").innerText = user.department;
  document.getElementById("workerLocation").innerText = user.location;

  loadWorkerStats(user.id);
  filterIssues();
});

function loadWorkerStats(workerId) {
  fetch(`http://localhost:8080/issues/worker/stats/${workerId}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("assignedCount").innerText = data.assigned;
      document.getElementById("resolvedCount").innerText = data.resolved;
      document.getElementById("totalCount").innerText = data.total;
    });
}

function loadIssues(workerId) {
  fetch(`http://localhost:8080/issues/worker/${workerId}`)
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
        <td>${issue.status}</td>
        <td>
          ${
            issue.status === "ASSIGNED"
              ? `<button onclick="resolveIssue(${issue.id}, ${workerId})">Resolve</button>`
              : "Resolved"
          }
        </td>
        <td>
        <img src="http://localhost:8080/uploads/${issue.imagePath}" width="80">
        </td>

        <td>
        <button onclick="showComments(${issue.id})">Comments</button>
        </td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.log("Error loading issues", error);
    });
}

function resolveIssue(issueId, workerId) {
  fetch(`http://localhost:8080/issues/resolve/${issueId}/${workerId}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("message").innerText =
        "Issue resolved successfully!";

      filterIssues();
    })
    .catch((error) => {
      console.log("Error resolving issue", error);
    });
}

function filterIssues() {
  const user = JSON.parse(localStorage.getItem("user"));
  const status = document.getElementById("statusFilter").value;

  let url = "";

  if (status === "ALL") {
    url = `http://localhost:8080/issues/worker/${user.id}`;
  } else {
    url = `http://localhost:8080/issues/worker/${user.id}/status/${status}`;
  }

  fetch(url)
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
        <td>${issue.status}</td>
        <td>
          ${
            issue.status === "ASSIGNED"
              ? `<button onclick="resolveIssue(${issue.id}, ${user.id})">Resolve</button>`
              : "Resolved"
          }
        </td>

        <td>
        ${
          issue.imagePath
            ? `<img src="http://localhost:8080/uploads/${issue.imagePath}" width="80">`
            : "No image"
        }
        </td>

        <td>
        <button onclick="showComments(${issue.id})">Comments</button>
        </td>
      `;

        tableBody.appendChild(row);
      });
    });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
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

        const role = c.user.role.toLowerCase();

        div.innerHTML = `
      <b>${c.user.name} (${role})</b>
      <br>
      ${c.comment}
      <br>
      <small>${c.createdAt.substring(0, 16)}</small>
      <hr>
      `;
        list.appendChild(div);
      });
      document.getElementById("commentSection").style.display = "block";
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
  document.getElementById("commentSection").style.display = "none";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
