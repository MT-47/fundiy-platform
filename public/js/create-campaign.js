const BASE_URL = "http://localhost:3000";

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

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById("create-btn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const goal = Number(document.getElementById("goal").value);
  const deadline = document.getElementById("deadline").value;
  const imageFile = document.getElementById("image").files[0];
  const errorMsg = document.getElementById("error-msg");

  if (!title || !description || !goal || !deadline) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  if (goal <= 0) {
    errorMsg.textContent = "Goal must be greater than 0.";
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (deadline <= today) {
    errorMsg.textContent = "Deadline must be in the future.";
    return;
  }

  let image = "";
  if (imageFile) {
    image = await toBase64(imageFile);
  }

  const newCampaign = {
    title,
    creatorId: currentUser.id,
    goal,
    deadline,
    isApproved: false,
    description,
    image
  };

  try {
    await fetch(`${BASE_URL}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCampaign)
    });

    alert("✅ Campaign created! Waiting for admin approval.");
    window.location.href = "index.html";

  } catch (err) {
    errorMsg.textContent = "Something went wrong. Try again.";
  }
});