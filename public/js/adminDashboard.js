const currentUser = getCurrentUser();
if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}

document.getElementById("admin-name").textContent = `Welcome, ${currentUser.name}`;

document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
});

async function loadUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  const users = await res.json();
  const container = document.getElementById("users-container");
  container.innerHTML = "";

  users.filter(u => u.role !== "admin").forEach(user => {
    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <p><strong>${user.name}</strong> - ${user.email}</p>
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
      ${campaign.isApproved
        ? `<button class="btn btn-red" onclick="approveCampaign(${campaign.id}, ${campaign.isApproved})">Reject</button>`
        : `<button class="btn btn-green" onclick="approveCampaign(${campaign.id}, ${campaign.isApproved})">Approve</button>`
      }
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
  const ok = await showConfirm("Delete this campaign?");
  if (!ok) return;
  await fetch(`${BASE_URL}/campaigns/${id}`, { method: "DELETE" });
  loadCampaigns();
}

loadUsers();
loadCampaigns();