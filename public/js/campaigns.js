const currentUser = getCurrentUser();
if (currentUser?.role === "admin") {
  window.location.href = "adminDashboard.html";
}
const nav = document.getElementById("main-nav");

nav.innerHTML = currentUser ? getAuthenticatedNav(currentUser.name) : getGuestNav();

const params = new URLSearchParams(window.location.search);
const campaignId = params.get("id");
if (!campaignId) window.location.href = "index.html";

async function loadCampaign() {
  const res = await fetch(`${BASE_URL}/campaigns/${campaignId}`);
  const campaign = await res.json();

  const pledgesRes = await fetch(`${BASE_URL}/pledges?campaignId=${campaignId}`);
  const pledges = await pledgesRes.json();
  const raised = pledges.reduce((sum, p) => sum + p.amount, 0);
  const percent = Math.min((raised / campaign.goal) * 100, 100).toFixed(0);

  document.getElementById("campaign-details").innerHTML = `
    <img src="${campaign.image || 'images/placeholder.png'}" alt="${campaign.title}" />
    <h2>${campaign.title}</h2>
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
  `;

  renderPledges(pledges);
}

async function renderPledges(pledges) {
  const container = document.getElementById("pledges-container");
  container.innerHTML = "";

  if (pledges.length === 0) {
    container.innerHTML = "<p>No pledges yet. Be the first!</p>";
    return;
  }

  for (const pledge of pledges) {
    const userRes = await fetch(`${BASE_URL}/users/${pledge.userId}`);
    const user = await userRes.json();

    const div = document.createElement("div");
    div.classList.add("pledge-item");
    div.innerHTML = `<span>${user.name}</span><span>$${pledge.amount}</span>`;
    container.appendChild(div);
  }
}

document.getElementById("pledge-btn").addEventListener("click", async () => {
  const pledgeMsg = document.getElementById("pledge-msg");
  pledgeMsg.className = "";

  if (!currentUser) {
    pledgeMsg.textContent = "Please login to pledge.";
    pledgeMsg.classList.add("error");
    return;
  }

  const amount = Number(document.getElementById("pledge-amount").value);
  if (!amount || amount <= 0) {
    pledgeMsg.textContent = "Please enter a valid amount.";
    pledgeMsg.classList.add("error");
    return;
  }

  const confirmed = await showConfirm(`Confirm pledge of $${amount}?`);
  if (!confirmed) {
    pledgeMsg.textContent = "Pledge cancelled.";
    return;
  }

  await fetch(`${BASE_URL}/pledges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId: Number(campaignId), userId: currentUser.id, amount })
  });

  pledgeMsg.textContent = "✅ Pledge successful! Thank you!";
  pledgeMsg.classList.add("success");
  document.getElementById("pledge-amount").value = "";
  loadCampaign();
});

loadCampaign();