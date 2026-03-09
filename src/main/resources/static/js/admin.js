let workers = [];

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    alert("Access Denied");
    window.location.href = "login.html";
    return;
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
        <td>${worker.department}</td>
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
      <td>${issue.department}</td>
      <td>${issue.priority}</td>
      <td>${issue.status}</td>

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
      `;

        tableBody.appendChild(row);
      });
    });
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

  fetch(`http://localhost:8080/issues/assign/${issueId}/${workerId}`, {
    method: "PUT",
  })
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

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
