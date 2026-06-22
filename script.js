const messages = [
  "Systems Development Technician // initializing profile...",
  "Junior Full Stack Developer // loading skills...",
  "Software & hardware automation // problem solving active...",
  "Based in Curitiba, PR — Brazil // location set ✔",
  "Building secure and scalable systems // optimizing performance...",
  "Continuous learning mode // career evolving..."
];

let messageIndex = 0;
let charIndex = 0;
let currentText = "";

const typedEl = document.getElementById("typed-text");

function type() {
  if (charIndex < messages[messageIndex].length) {
    currentText += messages[messageIndex].charAt(charIndex);
    typedEl.innerHTML = currentText;
    charIndex++;
    setTimeout(type, 40);
  } else {
    setTimeout(erase, 1400);
  }
}

function erase() {
  if (charIndex > 0) {
    currentText = currentText.slice(0, -1);
    typedEl.innerHTML = currentText;
    charIndex--;
    setTimeout(erase, 20);
  } else {
    messageIndex = (messageIndex + 1) % messages.length;
    setTimeout(type, 300);
  }
}

window.addEventListener("load", type);