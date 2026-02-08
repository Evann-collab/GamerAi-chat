function login() {
  const username = document.getElementById("username").value.trim();
  const language = document.getElementById("language").value;

  if (!username) {
    alert("اكتب اسمك أولاً!");
    return;
  }

  localStorage.setItem("username", username);
  localStorage.setItem("language", language);

  window.location.href = "chat.html";  // الانتقال لصفحة الدردشة
}

window.login = login; // لتتمكن من استخدامها من الـ HTML