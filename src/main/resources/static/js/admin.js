let workers = [];
let currentIssueId = null;

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    alert("Invalid session");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }

  loadPendingWorkers();
  loadWorkers();
  loadStats();
  // filterIssues();
});

function loadPendingWorkers() {
  fetch(`http://localhost:8080/admin/pending`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("pendingWorkers").innerText = data.length;

      const tableBody = document.querySelector("#workerTable tbody");
      tableBody.innerHTML = "";

      data.forEach((worker) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${worker.id}</td>
        <td>${worker.name}</td>
        <td><span class="badge">${worker.department}</span></td>
        <td>${worker.location}</td>
        <td>
          <button onclick="approveWorker(${worker.id})">
            Approve
          </button>
        </td>
        `;

        tableBody.appendChild(row);
      });
    });
}

function loadWorkers() {
  fetch("http://localhost:8080/admin/workers")
    .then((response) => response.json())
    .then((data) => {
      workers = data;

      filterIssues();
    });
}

function filterIssues() {
  const status = document.getElementById("statusFilter").value;

  fetch(`http://localhost:8080/issues/status/${status}`)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#issueTable tbody");
      tableBody.innerHTML = "";

      data.forEach((issue) => {
        const row = document.createElement("tr");

        let workerColumn = "";

        if (issue.status === "OPEN") {
          workerColumn = `
            <select id="worker-${issue.id}">
              ${workers
                .map(
                  (worker) => `
                <option value="${worker.id}">
                  ${worker.name} - ${worker.department} - ${worker.location}
                </option>
                `,
                )
                .join("")}
            </select>
            <button onclick="assignIssue(${issue.id})">Assign</button>
          `;
        } else {
          workerColumn = issue.assignedWorker
            ? issue.assignedWorker.name
            : "Not Assigned";
        }

        row.innerHTML = `
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td><span class="badge">${issue.category}</span></td>
      <td>${issue.priority}</td>
      <td>${formatStatus(issue.status)}</td>
      <td class="date-col">${issue.createdAt ? issue.createdAt.substring(0, 10) : "-"}</td>
      <td class="date-col">${issue.assignedAt ? issue.assignedAt.substring(0, 10) : "-"}</td>
      <td class="date-col">${issue.resolvedAt ? issue.resolvedAt.substring(0, 10) : "-"}</td>

      <td>
      ${
        issue.imagePath
          ? `<img src="http://localhost:8080/uploads/${issue.imagePath}" width="80">`
          : "No image"
      }
      </td>

      <td>
        ${workerColumn}
      </td>

      <td>
      <button onclick="showComments(${issue.id})">View</button>
      </td>
      `;

        tableBody.appendChild(row);
      });
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

function approveWorker(workerId) {
  fetch(`http://localhost:8080/admin/approve/${workerId}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("message").innerText =
        "Worker aproved successfullt";

      loadPendingWorkers();
    });
}

function assignIssue(issueId) {
  const workerId = document.getElementById(`worker-${issueId}`).value;

  const admin = JSON.parse(localStorage.getItem("user"));

  fetch(
    `http://localhost:8080/issues/assign/${issueId}/${workerId}/${admin.id}`,
    {
      method: "PUT",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("message").innerText =
        "Issue assigned successfully";

      filterIssues();
      loadStats();
    })
    .catch((error) => {
      console.log("Error assigning issue", error);
    });
}

function loadStats() {
  fetch("http://localhost:8080/admin/stats")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("openCount").innerText = data.open;
      document.getElementById("assignedCount").innerText = data.assigned;
      document.getElementById("resolvedCount").innerText = data.resolved;
    });
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
      document.getElementById("commentModal").style.display = "flex";
    });
}

function addComment() {
  const admin = JSON.parse(localStorage.getItem("user"));
  const commentText = document.getElementById("newComment").value;

  fetch(`http://localhost:8080/comments/add/${currentIssueId}/${admin.id}`, {
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

function openCredentialModal() {
  document.getElementById("credentialModal").style.display = "flex";
}

function updateCredentials() {
  const user = JSON.parse(localStorage.getItem("user"));

  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;

  fetch(`http://localhost:8080/users/updateCredentials/${user.id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Credentials updated successfully");

      user.username = username;

      localStorage.setItem("user", JSON.stringify(user));

      closeCredentialModal();
    })
    .catch((err) => {
      alert("Username already taken");
    });
}

function closeCredentialModal() {
  document.getElementById("credentialModal").style.display = "none";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
