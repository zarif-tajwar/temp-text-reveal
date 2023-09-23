"use strict";

/* Change the default values from here. These values apply for all elements by default.  */

const defaultScrollThresholdInPercentage = 80;
const defaultScrollViewportPercentage = 0;
const defaultDurationInMs = 700;
const defaultEasing = "ease";
const defaultStaggerDelayInMS = 150;

/* 
NOTES: 

These data properties can be added in "reveal-text-parent" elements to
control their animation individually.

"data-duration-in-ms"
"data-easing" 
"data-stagger-delay-in-ms"
"data-scroll-threshold-in-percentage" : between 0-100
"data-scroll-viewport-percentage" : between 0-100

*/

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
      `<span class='reveal-text-container'>
            <span class='reveal-text reveal-text--hidden'>${word}&nbsp;</span>
       </span>`
    );
  });
});

function animateText(revealTextParent) {
  let duration, staggerDelay;

  const ease = revealTextParent.dataset.easing || defaultEasing;

  const parsedDuration = Number.parseInt(revealTextParent.dataset.durationInMs);
  const parsedStaggerDelay = Number.parseInt(
    revealTextParent.dataset.staggerDelayInMs
  );

  duration =
    parsedDuration === 0 || parsedDuration
      ? parsedDuration
      : defaultDurationInMs;
  staggerDelay =
    parsedStaggerDelay === 0 || parsedDuration
      ? parsedStaggerDelay
      : defaultStaggerDelayInMS;

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

  (async () => {
    for (let i = 0; i < lines.length; i++) {
      if (i !== 0) {
        await sleep(staggerDelay);
      }
      lines[i].forEach((lineText) => {
        lineText.classList.remove("reveal-text--hidden");
      });
    }
  })();
}

revealTextParents.forEach((parent) => {
  const parsedScrollThreshold = Number.parseInt(
    parent.dataset.scrollThresholdInPercentage
  );
  const parsedScrollViewportPercentage = Number.parseInt(
    parent.dataset.scrollViewportPercentage
  );

  const scrollThreshold =
    (parsedScrollThreshold === 0 || parsedScrollThreshold
      ? parsedScrollThreshold
      : defaultScrollThresholdInPercentage) / 100;

  let rootMargin = undefined;

  let scrollViewportPercentage = defaultScrollViewportPercentage / 100;

  if (parsedScrollViewportPercentage === 0 || parsedScrollViewportPercentage) {
    scrollViewportPercentage = parsedScrollViewportPercentage / 100;
  }
  const bottomMargin =
    window.innerHeight * scrollViewportPercentage -
    parent.getBoundingClientRect().height;
  if (bottomMargin > 0) {
    rootMargin = `0px 0px -${bottomMargin}px 0px`;
  }

  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const revealTextParent = entry.target;
        if (entry.isIntersecting) {
          animateText(revealTextParent);
          textObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: scrollThreshold,
      rootMargin,
    }
  );

  textObserver.observe(parent);
});
