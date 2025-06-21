const input = document.getElementById('user-input');
const output = document.getElementById('output');
const btn = document.getElementById('echo-btn');

btn.addEventListener('click', () => {
    output.textContent = input.value;
});
