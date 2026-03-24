const BASE_URL = window.location.origin;

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (!email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
    const users = await res.json();

    if (users.length === 0) {
      errorMsg.textContent = "Invalid email or password.";
      return;
    }

    const user = users[0];

    if (!user.isActive) {
      errorMsg.textContent = "Your account has been banned.";
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "admin") {
      window.location.href = "adminDashboard.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (err) {
    errorMsg.textContent = "Something went wrong. Try again.";
  }
});