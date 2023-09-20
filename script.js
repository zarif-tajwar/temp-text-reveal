"use strict";

const scrollThreshold = 0.8;
const defaultDurationInMs = 700;
const defaultEasing = "ease";

async function sleep(delayInMS) {
  return new Promise((res) => setTimeout(res, delayInMS));
}

const revealTextParents = document.querySelectorAll(".reveal-text-parent");

revealTextParents.forEach((revealTextParent) => {
  const wordsArray = revealTextParent.textContent
    .split(/\s+/)
    .filter((word) => word != "");

  revealTextParent.textContent = "";

  wordsArray.forEach((word) => {
    revealTextParent.insertAdjacentHTML(
      "beforeend",
      `<span class='reveal-text-container'><span class='reveal-text reveal-text--hidden'>${word}&nbsp;</span></span>`
    );
  });
});

function animateText(revealTextParent) {
  const duration =
    Number.parseInt(revealTextParent.dataset.durationInMs) ||
    defaultDurationInMs;
  const ease = revealTextParent.dataset.durationInMs || defaultEasing;

  const lines = [];

  const wordElemets = Array.from(
    revealTextParent.querySelectorAll(".reveal-text")
  );

  wordElemets.forEach((el) => {
    el.style.transition = `all ${duration}ms ${ease}`;
  });

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

  (async () => {
    for (let i = 0; i < lines.length; i++) {
      if (i !== 0) {
        await sleep(0.3);
      }
      lines[i].forEach((lineText) => {
        lineText.classList.remove("reveal-text--hidden");
      });
    }
  })();
}

const textObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      const revealTextParent = entry.target;
      if (entry.isIntersecting) {
        animateText(revealTextParent);
        textObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: scrollThreshold }
);

revealTextParents.forEach((parent) => {
  textObserver.observe(parent);
});
