"use strict";

const revealTextParent = document.querySelector(".reveal-text-parent");
const btn = document.querySelector(".btn");

let isClicked = false;

const wordsArray = revealTextParent.textContent
  .split(/\s+/)
  .filter((word) => word != "");

const wordsArrayWithNewLine = revealTextParent.textContent.split();

revealTextParent.textContent = "";

async function sleep(delayInSeconds) {
  return new Promise((res) => setTimeout(res, delayInSeconds * 1000));
}

wordsArray.forEach((word) => {
  revealTextParent.insertAdjacentHTML(
    "beforeend",
    `<span class='reveal-text-container'><span class='reveal-text reveal-text--hidden'>${word}&nbsp;</span></span>`
  );
});

const lines = [];
const wordElemets = Array.from(document.querySelectorAll(".reveal-text"));
let currentLineGroup = [wordElemets[0]];

for (let i = 1; i < wordElemets.length; i++) {
  if (
    wordElemets[i].getBoundingClientRect().top ===
    wordElemets[i - 1].getBoundingClientRect().top
  ) {
    currentLineGroup.push(wordElemets[i]);
  } else {
    lines.push(currentLineGroup);
    currentLineGroup = [wordElemets[i]];
  }
}

lines.push(currentLineGroup);

lines.reverse();

btn.addEventListener("click", async () => {
  for (let i = 0; i < lines.length; i++) {
    if (i !== 0) {
      await sleep(0.2);
    }
    lines[i].forEach((lineText) => {
      lineText.classList.toggle("reveal-text--hidden");
    });
  }
});

const observer = new IntersectionObserver();
