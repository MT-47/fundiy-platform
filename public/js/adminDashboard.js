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
      <div class="admin-card-header">
        <h4>👤 ${user.name}</h4>
        <span class="badge ${user.isActive ? "badge-green" : "badge-red"}">
          ${user.isActive ? "Active" : "Banned"}
        </span>
      </div>
      <div class="admin-card-body">
        <p><span class="label">Email</span> ${user.email}</p>
        <p><span class="label">ID</span> #${user.id}</p>
      </div>
      <div class="admin-card-actions">
        <button class="btn ${user.isActive ? "btn-red" : "btn-green"}"
          onclick="banUser(${user.id}, ${user.isActive})">
          ${user.isActive ? "Ban User" : "Unban User"}
        </button>
      </div>
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
  const [camRes, pledgeRes, userRes] = await Promise.all([
    fetch(`${BASE_URL}/campaigns`),
    fetch(`${BASE_URL}/pledges`),
    fetch(`${BASE_URL}/users`)
  ]);

  const campaigns = await camRes.json();
  const pledges   = await pledgeRes.json();
  const users     = await userRes.json();

  const container = document.getElementById("campaigns-container");
  container.innerHTML = "";

  campaigns.forEach(campaign => {
    const raised = pledges
      .filter(p => p.campaignId === campaign.id)
      .reduce((sum, p) => sum + p.amount, 0);

    const percent = Math.min(100, Math.round((raised / campaign.goal) * 100));

    const creator = users.find(u => u.id === campaign.creatorId);
    const creatorName = creator ? creator.name : `User #${campaign.creatorId}`;

    const deadline = new Date(campaign.deadline);
    const today    = new Date();
    const daysLeft = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));

    const div = document.createElement("div");
    div.classList.add("admin-card", "campaign-admin-card");
    div.innerHTML = `
      <div class="campaign-card-top">
        <img src="${campaign.image}" alt="${campaign.title}" class="campaign-thumb" />
        <div class="campaign-card-info">
          <div class="admin-card-header">
            <h4>${campaign.title}</h4>
            <span class="badge ${campaign.isApproved ? "badge-green" : "badge-yellow"}">
              ${campaign.isApproved ? "✅ Approved" : "⏳ Pending"}
            </span>
          </div>
          <p class="campaign-desc">${campaign.description}</p>
          <div class="campaign-stats">
            <span><span class="label">Creator</span> ${creatorName}</span>
            <span><span class="label">Goal</span> $${campaign.goal.toLocaleString()}</span>
            <span><span class="label">Raised</span> <strong style="color:var(--green)">$${raised.toLocaleString()}</strong></span>
            <span><span class="label">Deadline</span> ${campaign.deadline}</span>
            <span><span class="label">Days Left</span> ${daysLeft}</span>
            <span><span class="label">ID</span> #${campaign.id}</span>
          </div>
          <div class="progress-bar">
            <div class="progress" style="width:${percent}%"></div>
          </div>
          <p class="progress-label">${percent}% funded</p>
        </div>
      </div>
      <div class="admin-card-actions">
        ${campaign.isApproved
          ? `<button class="btn btn-red" onclick="approveCampaign(${campaign.id}, true)">Reject</button>`
          : `<button class="btn btn-green" onclick="approveCampaign(${campaign.id}, false)"> Approve</button>`
        }
        <button class="btn btn-red" onclick="deleteCampaign(${campaign.id})">Delete</button>
      </div>
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
  const ok = await showConfirm("Delete this campaign permanently?");
  if (!ok) return;
  await fetch(`${BASE_URL}/campaigns/${id}`, { method: "DELETE" });
  loadCampaigns();
}

loadUsers();
loadCampaigns();