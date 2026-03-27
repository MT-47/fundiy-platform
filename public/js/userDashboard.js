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

document.getElementById("welcome-msg").textContent =
  "Welcome, " + currentUser.name + "!";

function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("modal-message");
    const yes = document.getElementById("confirm-yes");
    const no = document.getElementById("confirm-no");

    msg.textContent = message;
    modal.classList.remove("hidden");

    const cleanup = () => {
      modal.classList.add("hidden");
      yes.onclick = null;
      no.onclick = null;
    };

    yes.onclick = () => {
      cleanup();
      resolve(true);
    };
    no.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).classList.add("input-error");
}

function clearError(fieldId, errorId) {
  document.getElementById(errorId).textContent = "";
  document.getElementById(fieldId).classList.remove("input-error");
}

function validateTitle() {
  const value = document.getElementById("edit-title").value.trim();
  if (!value) {
    showError("edit-title", "edit-title-error", "Title is required.");
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(value)) {
    showError(
      "edit-title",
      "edit-title-error",
      "Title must contain letters only."
    );
    return false;
  }
  if (value.length < 3) {
    showError(
      "edit-title",
      "edit-title-error",
      "Title must be at least 3 characters."
    );
    return false;
  }
  clearError("edit-title", "edit-title-error");
  return true;
}

function validateDescription() {
  const value = document
    .getElementById("edit-description")
    .value.trim();
  if (!value) {
    showError(
      "edit-description",
      "edit-description-error",
      "Description is required."
    );
    return false;
  }
  if (value.length < 10) {
    showError(
      "edit-description",
      "edit-description-error",
      "Description must be at least 10 characters."
    );
    return false;
  }
  clearError("edit-description", "edit-description-error");
  return true;
}

function validateGoal() {
  const value = Number(document.getElementById("edit-goal").value);
  if (!value && value !== 0) {
    showError("edit-goal", "edit-goal-error", "Goal amount is required.");
    return false;
  }
  if (value <= 0) {
    showError("edit-goal", "edit-goal-error", "Goal must be greater than $0.");
    return false;
  }
  clearError("edit-goal", "edit-goal-error");
  return true;
}

function validateDeadline() {
  const value = document.getElementById("edit-deadline").value;
  if (!value) {
    showError(
      "edit-deadline",
      "edit-deadline-error",
      "Deadline is required."
    );
    return false;
  }
  const today = new Date().toISOString().split("T")[0];
  if (value <= today) {
    showError(
      "edit-deadline",
      "edit-deadline-error",
      "Deadline must be in the future."
    );
    return false;
  }
  clearError("edit-deadline", "edit-deadline-error");
  return true;
}

function showEditModal(campaign) {
  return new Promise((resolve) => {
    const modal = document.getElementById("edit-modal");

    document.getElementById("edit-title").value = campaign.title;
    document.getElementById("edit-description").value =
      campaign.description;
    document.getElementById("edit-goal").value = campaign.goal;
    document.getElementById("edit-deadline").value =
      campaign.deadline;

    modal.classList.remove("hidden");

    document.getElementById("edit-title").oninput = validateTitle;
    document.getElementById("edit-description").oninput =
      validateDescription;
    document.getElementById("edit-goal").oninput = validateGoal;
    document.getElementById("edit-deadline").onchange =
      validateDeadline;

    const save = document.getElementById("edit-save");
    const cancel = document.getElementById("edit-cancel");

    const cleanup = () => {
      modal.classList.add("hidden");
      save.onclick = null;
      cancel.onclick = null;
    };

    save.onclick = async () => {
      const isValid = [
        validateTitle(),
        validateDescription(),
        validateGoal(),
        validateDeadline(),
      ].every(Boolean);

      if (!isValid) return;

      const title = document.getElementById("edit-title").value.trim();
      const description = document
        .getElementById("edit-description")
        .value.trim();
      const goal = Number(document.getElementById("edit-goal").value);
      const deadline = document.getElementById("edit-deadline").value;
      const imageFile =
        document.getElementById("edit-image").files[0];

      let image = campaign.image;
      if (imageFile) {
        image = await toBase64(imageFile);
      }

      cleanup();
      resolve({ title, description, goal, deadline, image });
    };

    cancel.onclick = () => {
      cleanup();
      resolve(null);
    };
  });
}

async function loadMyCampaigns() {
  const res = await fetch(
    `${BASE_URL}/campaigns?creatorId=${currentUser.id}`
  );
  const campaigns = await res.json();

  const container = document.getElementById("my-campaigns-container");
  container.innerHTML = "";

  if (campaigns.length === 0) {
    container.innerHTML =
      "<p>You have no campaigns yet. <a href='create-campaign.html'>Create one!</a></p>";
    return;
  }

  for (const campaign of campaigns) {
    const pledgesRes = await fetch(
      `${BASE_URL}/pledges?campaignId=${campaign.id}`
    );
    const pledges = await pledgesRes.json();
    const raised = pledges.reduce((sum, p) => sum + p.amount, 0);

    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <h4>${campaign.title}</h4>
      <p>Status: ${
        campaign.isApproved ? "✅ Approved" : "⏳ Pending Approval"
      }</p>
      <p>Goal: $${campaign.goal} | Raised: $${raised}</p>
      <p>Deadline: ${campaign.deadline}</p>
      <button class="btn btn-green" onclick="editCampaign(${campaign.id})">Edit</button>
      <button class="btn btn-red" onclick="deleteCampaign(${campaign.id})">Delete</button>
    `;
    container.appendChild(div);
  }
}

async function editCampaign(id) {
  const res = await fetch(`${BASE_URL}/campaigns/${id}`);
  const campaign = await res.json();

  const updated = await showEditModal(campaign);
  if (!updated) return;

  await fetch(`${BASE_URL}/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  loadMyCampaigns();
}

async function deleteCampaign(id) {
  const ok = await showConfirm(
    "Are you sure you want to delete this campaign?"
  );
  if (!ok) return;

  await fetch(`${BASE_URL}/campaigns/${id}`, {
    method: "DELETE",
  });

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