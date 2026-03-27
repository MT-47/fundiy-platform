const BASE_URL = "http://localhost:3000";
// const BASE_URL = window.location.origin;

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
  document.querySelectorAll(".form-group input").forEach(el => el.classList.remove("input-error"));
}

function showError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).classList.add("input-error");
}

function clearError(fieldId, errorId) {
  document.getElementById(errorId).textContent = "";
  document.getElementById(fieldId).classList.remove("input-error");
}

function validateName() {
  const name = document.getElementById("name").value.trim();
  if (!name) { showError("name", "name-error", "Name is required."); return false; }
  if (!/^[a-zA-Z\s]+$/.test(name)) { showError("name", "name-error", "Name must contain letters only."); return false; }
  if (name.length < 3) { showError("name", "name-error", "Name must be at least 3 letters."); return false; }
  clearError("name", "name-error");
  return true;
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
  if (password.length < 6) { showError("password", "password-error", "Password must be at least 6 characters."); return false; }
  clearError("password", "password-error");
  return true;
}

function validateConfirm() {
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  if (!confirmPassword) { showError("confirm-password", "confirm-error", "Please confirm your password."); return false; }
  if (password !== confirmPassword) { showError("confirm-password", "confirm-error", "Passwords do not match."); return false; }
  clearError("confirm-password", "confirm-error");
  return true;
}

document.getElementById("name").addEventListener("input", validateName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("password").addEventListener("input", validatePassword);
document.getElementById("confirm-password").addEventListener("input", validateConfirm);

document.getElementById("register-btn").addEventListener("click", async () => {
  const isValid = [validateName(), validateEmail(), validatePassword(), validateConfirm()].every(Boolean);
  if (!isValid) return;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const checkRes = await fetch(`${BASE_URL}/users?email=${email}`);
    const existingUsers = await checkRes.json();

    if (existingUsers.length > 0) {
      showError("email", "email-error", "Email already registered.");
      return;
    }

    const newUser = {
      name,
      role: "user",
      isActive: true,
      email,
      password
    };

    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    const user = await res.json();
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";

  } catch (err) {
    showError("email", "email-error", "Something went wrong. Try again.");
  }
});