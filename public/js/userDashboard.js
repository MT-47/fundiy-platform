const BASE_URL = window.location.origin;

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role === "admin") {
  window.location.href = "login.html";
}

const nav = document.getElementById("main-nav");
nav.innerHTML = `
  <a href="index.html">Home</a>
  <a href="create-campaign.html">Start Campaign</a>
  <a href="userDashboard.html">Dashboard</a>
  <span>Hi, ${currentUser.name}</span>
  <button onclick="logout()">Logout</button>
`;

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

document.getElementById("welcome-msg").textContent = `Welcome, ${currentUser.name}!`;

async function loadMyCampaigns() {
  const res = await fetch(`${BASE_URL}/campaigns?creatorId=${currentUser.id}`);
  const campaigns = await res.json();

  const container = document.getElementById("my-campaigns-container");
  container.innerHTML = "";

  if (campaigns.length === 0) {
    container.innerHTML = "<p>You have no campaigns yet. <a href='create-campaign.html'>Create one!</a></p>";
    return;
  }

  for (const campaign of campaigns) {
    const pledgesRes = await fetch(`${BASE_URL}/pledges?campaignId=${campaign.id}`);
    const pledges = await pledgesRes.json();
    const raised = pledges.reduce((sum, p) => sum + p.amount, 0);

    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <h4>${campaign.title}</h4>
      <p>Status: ${campaign.isApproved ? "✅ Approved" : "⏳ Pending Approval"}</p>
      <p>Goal: $${campaign.goal} | Raised: $${raised}</p>
      <p>Deadline: ${campaign.deadline}</p>
      <button class="btn btn-green" onclick="editDeadline(${campaign.id}, '${campaign.deadline}')">
        Edit Deadline
      </button>
      <button class="btn btn-red" onclick="deleteCampaign(${campaign.id})">
        Delete
      </button>
    `;
    container.appendChild(div);
  }
}

async function editDeadline(id, currentDeadline) {
  const newDeadline = prompt("Enter new deadline (YYYY-MM-DD):", currentDeadline);
  if (!newDeadline) return;

  const today = new Date().toISOString().split("T")[0];
  if (newDeadline <= today) {
    alert("Deadline must be in the future.");
    return;
  }

  await fetch(`${BASE_URL}/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deadline: newDeadline })
  });

  alert("✅ Deadline updated!");
  loadMyCampaigns();
}

async function deleteCampaign(id) {
  if (!confirm("Are you sure you want to delete this campaign?")) return;

  await fetch(`${BASE_URL}/campaigns/${id}`, { method: "DELETE" });
  loadMyCampaigns();
}

async function loadMyPledges() {
  const res = await fetch(`${BASE_URL}/pledges?userId=${currentUser.id}`);
  const pledges = await res.json();

  const container = document.getElementById("my-pledges-container");
  container.innerHTML = "";

  if (pledges.length === 0) {
    container.innerHTML = "<p>You have not pledged to any campaign yet.</p>";
    return;
  }

  for (const pledge of pledges) {
    const campaignRes = await fetch(`${BASE_URL}/campaigns/${pledge.campaignId}`);
    const campaign = await campaignRes.json();

    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <p>Campaign: <strong>${campaign.title}</strong></p>
      <p>Amount: <strong>$${pledge.amount}</strong></p>
    `;
    container.appendChild(div);
  }
}

loadMyCampaigns();
loadMyPledges();