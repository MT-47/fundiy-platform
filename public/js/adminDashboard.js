const BASE_URL = "http://localhost:3000";
// const BASE_URL = window.location.origin;


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

  users.filter(user => user.role !== "admin").forEach(user => {
    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <p><strong>${user.name}</strong> - ${user.email}</p>
      <p>Status: ${user.isActive ? "✅ Active" : "🚫 Banned"}</p>
    ${`
    <button class="btn btn-red" onclick="banUser(${user.id}, ${user.isActive})">
        ${user.isActive ? "Ban" : "Unban"}
    </button>
    `}
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
  const ok = await showConfirm("Delete this campaign?");
  if (!ok) return;

  await fetch(`${BASE_URL}/campaigns/${id}`, { method: "DELETE" });
  loadCampaigns();
}

function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("modal-message");
    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    msg.textContent = message;
    modal.classList.remove("hidden");

    const cleanup = () => {
      modal.classList.add("hidden");
      yesBtn.onclick = null;
      noBtn.onclick = null;
    };

    yesBtn.onclick = () => {
      cleanup();
      resolve(true);
    };

    noBtn.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}


loadUsers();
loadCampaigns();