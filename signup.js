document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const success = document.getElementById('successMessage');

  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;

    showError('errFullName', '');
    showError('errEmail', '');
    showError('errPassword', '');
    showError('errConfirm', '');

    if (!fullName) {
      showError('errFullName', 'Please enter a name.');
      valid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showError('errEmail', 'Please enter a valid email.');
      valid = false;
    }

    if (!password || password.length < 6) {
      showError('errPassword', 'Password must be at least 6 characters.');
      valid = false;
    }

    if (confirm !== password) {
      showError('errConfirm', 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    // For demo: show success and clear form. Replace with real submit logic.
    form.style.display = 'none';
    success.style.display = 'block';
  });
});
