const currentUser = getCurrentUser();
if (currentUser?.role === "admin") {
  window.location.href = "adminDashboard.html";
}
if (!currentUser) {
  window.location.href = "login.html";
}

const nav = document.getElementById("main-nav");
nav.innerHTML = getAuthenticatedNav(currentUser.name);

function validateTitle() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    showError("title", "title-error", "Title is required.");
    return false;
  }
  if (title.length < 3) {
    showError("title", "title-error", "Title must be at least 3 characters.");
    return false;
  }
  clearError("title", "title-error");
  return true;
}

function validateDescription() {
  const desc = document.getElementById("description").value.trim();
  if (!desc) {
    showError("description", "description-error", "Description is required.");
    return false;
  }
  if (desc.length < 10) {
    showError(
      "description",
      "description-error",
      "Description must be at least 10 characters.",
    );
    return false;
  }
  clearError("description", "description-error");
  return true;
}

function validateGoal() {
  const goal = Number(document.getElementById("goal").value);
  if (!goal && goal !== 0) {
    showError("goal", "goal-error", "Goal amount is required.");
    return false;
  }
  if (goal <= 0) {
    showError("goal", "goal-error", "Goal must be greater than $0.");
    return false;
  }
  clearError("goal", "goal-error");
  return true;
}

function validateDeadline() {
  const deadline = document.getElementById("deadline").value;
  if (!deadline) {
    showError("deadline", "deadline-error", "Deadline is required.");
    return false;
  }
  const today = new Date().toISOString().split("T")[0];
  if (deadline <= today) {
    showError("deadline", "deadline-error", "Deadline must be in the future.");
    return false;
  }
  clearError("deadline", "deadline-error");
  return true;
}

document.getElementById("title").addEventListener("input", validateTitle);
document
  .getElementById("description")
  .addEventListener("input", validateDescription);
document.getElementById("goal").addEventListener("input", validateGoal);
document
  .getElementById("deadline")
  .addEventListener("change", validateDeadline);

document.getElementById("create-btn").addEventListener("click", async () => {
  const isValid = [
    validateTitle(),
    validateDescription(),
    validateGoal(),
    validateDeadline(),
  ].every(Boolean);
  if (!isValid) return;

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const goal = Number(document.getElementById("goal").value);
  const deadline = document.getElementById("deadline").value;
  const imageFile = document.getElementById("image").files[0];

  let image = "";
  if (imageFile) {
    image = await toBase64(imageFile);
  }

  const newCampaign = {
    title,
    description,
    creatorId: currentUser.id,
    goal,
    deadline,
    isApproved: false,
    image,
  };

  try {
    await fetch(`${BASE_URL}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCampaign),
    });

    window.location.href = "index.html";
  } catch (err) {
    document.getElementById("general-error").textContent =
      "Something went wrong. Try again.";
  }
});
