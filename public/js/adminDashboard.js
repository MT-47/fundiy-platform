const BASE_URL = "http://localhost:3000";


const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}

document.getElementById("admin-name").textContent = `Welcome, ${currentUser.name}`;


document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});


async function loadUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  const users = await res.json();

  const container = document.getElementById("users-container");
  container.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <p><strong>${user.name}</strong> - ${user.email} - ${user.role}</p>
      <p>Status: ${user.isActive ? "✅ Active" : "🚫 Banned"}</p>
      <button class="btn btn-red" onclick="banUser(${user.id}, ${user.isActive})">
        ${user.isActive ? "Ban" : "Unban"}
      </button>
    `;
    container.appendChild(div);
  });
}

async function banUser(id, isActive) {
  await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: !isActive })
  });
  loadUsers();
}


async function loadCampaigns() {
  const res = await fetch(`${BASE_URL}/campaigns`);
  const campaigns = await res.json();

  const container = document.getElementById("campaigns-container");
  container.innerHTML = "";

  campaigns.forEach(campaign => {
    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <p><strong>${campaign.title}</strong></p>
      <p>Status: ${campaign.isApproved ? "✅ Approved" : "⏳ Pending"}</p>
      <button class="btn btn-green" onclick="approveCampaign(${campaign.id}, ${campaign.isApproved})">
        ${campaign.isApproved ? "Reject" : "Approve"}
      </button>
      <button class="btn btn-red" onclick="deleteCampaign(${campaign.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}


async function approveCampaign(id, isApproved) {
  await fetch(`${BASE_URL}/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isApproved: !isApproved })
  });
  loadCampaigns();
}


async function deleteCampaign(id) {
  if (!confirm("Are you sure you want to delete this campaign?")) return;
  await fetch(`${BASE_URL}/campaigns/${id}`, { method: "DELETE" });
  loadCampaigns();
}


loadUsers();
loadCampaigns();