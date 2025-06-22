document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('greetBtn');
  if (button) {
    button.addEventListener('click', () => {
      alert('Hello from app.js!');
    });
  }
});
