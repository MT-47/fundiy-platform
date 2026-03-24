const BASE_URL = window.location.origin;

document.getElementById("register-btn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (!name || !email || !password || !confirmPassword) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters.";
    return;
  }

  try {
    const checkRes = await fetch(`${BASE_URL}/users?email=${email}`);
    const existingUsers = await checkRes.json();

    if (existingUsers.length > 0) {
      errorMsg.textContent = "Email already registered.";
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
    errorMsg.textContent = "Something went wrong. Try again.";
  }
});