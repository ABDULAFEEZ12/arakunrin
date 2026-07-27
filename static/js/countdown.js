/* static/js/countdown.js
   ARÁKÙNRIN, The Gathering 2026 countdown.
   Vanilla JS, no dependencies. Counts down to EVENT_DATE and swaps
   the timer for a completion message at zero.
*/
(function () {
  "use strict";

  // Single source of truth for the target date/time, change here only.
  const EVENT_DATE = "2026-09-27T15:00:00+01:00";

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function setValue(el, value) {
    if (!el) return;
    if (el.textContent === value) return;
    el.textContent = value;
    el.classList.add("is-updating");
    window.setTimeout(function () {
      el.classList.remove("is-updating");
    }, 250);
  }

  function init() {
    const cards = document.getElementById("cd-cards");
    const ended = document.getElementById("cd-ended");
    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };

    // If the markup isn't on this page, do nothing.
    if (!els.days || !els.hours || !els.minutes || !els.seconds) return;

    const targetTime = new Date(EVENT_DATE).getTime();
    if (isNaN(targetTime)) return;

    let intervalId;

    function showEnded() {
      if (intervalId) window.clearInterval(intervalId);
      if (cards) cards.style.display = "none";
      if (ended) ended.style.display = "block";
    }

    function tick() {
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        showEnded();
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setValue(els.days, pad(days));
      setValue(els.hours, pad(hours));
      setValue(els.minutes, pad(minutes));
      setValue(els.seconds, pad(seconds));
    }

    tick();
    intervalId = window.setInterval(tick, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
