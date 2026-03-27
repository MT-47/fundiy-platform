
const BASE_URL = window.location.origin;

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function getAuthenticatedNav(name) {
  return `
    <span id="user-name">Hi, ${name}</span>
    <a href="index.html">Home</a>
    <a href="create-campaign.html">Start Campaign</a>
    <a href="userDashboard.html">Dashboard</a>
    <button onclick="logout()">Logout</button>
  `;
}

function getGuestNav() {
  return `
    <a href="index.html">Home</a>
    <a href="login.html">Login</a>
    <a href="register.html">Register</a>
  `;
}

function showError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).classList.add("input-error");
}

function clearError(fieldId, errorId) {
  document.getElementById(errorId).textContent = "";
  document.getElementById(fieldId).classList.remove("input-error");
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    document.getElementById("modal-message").textContent = message;
    modal.classList.remove("hidden");

    const cleanup = () => {
      modal.classList.add("hidden");
      document.getElementById("confirm-yes").onclick = null;
      document.getElementById("confirm-no").onclick = null;
    };

    document.getElementById("confirm-yes").onclick = () => { cleanup(); resolve(true); };
    document.getElementById("confirm-no").onclick = () => { cleanup(); resolve(false); };
  });
}