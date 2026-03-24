// const BASE_URL = "http://localhost:3000";
const BASE_URL = window.location.origin;

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const nav = document.getElementById("main-nav");

if (currentUser) {
  nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="create-campaign.html">Start Campaign</a>
    <a href="userDashboard.html">Dashboard</a>
    <span>Hi, ${currentUser.name}</span>
    <button onclick="logout()">Logout</button>
  `;
} else {
  nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="login.html">Login</a>
    <a href="register.html">Register</a>
  `;
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

async function loadCampaigns(query = "") {
  let url = `${BASE_URL}/campaigns?isApproved=true`;
  if (query) url += `&q=${query}`;

  const res = await fetch(url);
  const campaigns = await res.json();

  renderCampaigns(campaigns);
}

async function renderCampaigns(campaigns) {
  const container = document.getElementById("campaigns-container");
  container.innerHTML = "";

  if (campaigns.length === 0) {
    container.innerHTML = "<p>No campaigns found.</p>";
    return;
  }

  for (const campaign of campaigns) {
    const pledgesRes = await fetch(`${BASE_URL}/pledges?campaignId=${campaign.id}`);
    const pledges = await pledgesRes.json();
    const raised = pledges.reduce((sum, p) => sum + p.amount, 0);
    const percent = Math.min((raised / campaign.goal) * 100, 100).toFixed(0);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${campaign.image || 'images/placeholder.png'}" alt="${campaign.title}" />
      <div class="card-body">
        <h3>${campaign.title}</h3>
        <p>${campaign.description}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${percent}%"></div>
        </div>
        <div class="card-meta">
          <span>$${raised} raised of $${campaign.goal}</span>
          <span>${percent}%</span>
        </div>
        <div class="card-meta">
          <span>Deadline: ${campaign.deadline}</span>
        </div>
        <button class="btn btn-green" onclick="window.location.href='campaigns.html?id=${campaign.id}'">
          View Campaign
        </button>
      </div>
    `;
    container.appendChild(card);
  }
}

document.getElementById("search-input").addEventListener("input", (e) => {
  loadCampaigns(e.target.value.trim());
});

loadCampaigns();