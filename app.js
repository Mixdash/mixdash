function joinWaitlist(e) {
  e.preventDefault();
  document.getElementById("success").classList.remove("hidden");
}

function showPass() {
  const f = document.getElementById("feedback");
  f.innerHTML = "Good control. Energy stayed consistent.";
  f.classList.remove("hidden");
}

function showFail() {
  const f = document.getElementById("feedback");
  f.innerHTML = "Energy rose too fast. Let the groove breathe.";
  f.classList.remove("hidden");
}
