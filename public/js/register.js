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
  const confirm = document.getElementById("confirm-password").value.trim();
  if (!confirm) { showError("confirm-password", "confirm-error", "Please confirm your password."); return false; }
  if (password !== confirm) { showError("confirm-password", "confirm-error", "Passwords do not match."); return false; }
  clearError("confirm-password", "confirm-error");
  return true;
}

document.getElementById("name").addEventListener("input", validateName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("password").addEventListener("input", validatePassword);
document.getElementById("confirm-password").addEventListener("input", validateConfirm);

document.getElementById("register-btn").addEventListener("click", async () => {
  if (![validateName(), validateEmail(), validatePassword(), validateConfirm()].every(Boolean)) return;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const checkRes = await fetch(`${BASE_URL}/users?email=${email}`);
    const existing = await checkRes.json();

    if (existing.length > 0) {
      showError("email", "email-error", "Email already registered.");
      return;
    }

    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "user", isActive: true})
    });

    const user = await res.json();
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";

  } catch {
    document.getElementById("general-error").textContent = "Something went wrong. Try again.";
  }
});