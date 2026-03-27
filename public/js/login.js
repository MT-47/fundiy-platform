const BASE_URL = "http://localhost:3000";
// const BASE_URL = window.location.origin;

function showError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).classList.add("input-error");
}

function clearError(fieldId, errorId) {
  document.getElementById(errorId).textContent = "";
  document.getElementById(fieldId).classList.remove("input-error");
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  if (!email) { showError("email", "email-error", "Email is required."); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("email", "email-error", "Please enter a valid email (e.g. user@example.com)."); return false; }
  clearError("email", "email-error");
  return true;
}

function validatePassword() {
  const password = document.getElementById("password").value.trim();
  if (!password) { showError("password", "password-error", "Password is required."); return false; }
  clearError("password", "password-error");
  return true;
}

document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("password").addEventListener("input", validatePassword);

document.getElementById("login-btn").addEventListener("click", async () => {
  const isValid = [validateEmail(), validatePassword()].every(Boolean);
  if (!isValid) return;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
    const users = await res.json();

    if (users.length === 0) {
      showError("email", "email-error", "Invalid email or password.");
      return;
    }

    const user = users[0];

    if (!user.isActive) {
      showError("email", "email-error", "Your account has been banned.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "admin") {
      window.location.href = "adminDashboard.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (err) {
    document.getElementById("general-error").textContent = "Something went wrong. Try again.";
  }
});