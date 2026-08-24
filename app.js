const STORAGE_KEY = "our_little_world_v3";

let data = loadData();

let currentPin = "";

let loveValue = 100;

let heartCount = 0;

const surprises = [
  "Parašyk jai vieną dalyką, kurį joje labiausiai mėgsti. ❤️",
  "Nusiųskite vienas kitam savo mėgstamiausią jūsų nuotrauką. 📸",
  "Šiandien padarykite spontanišką mažą pasimatymą. ✨",
  "Pasakyk jai: „Aš labai džiaugiuosi, kad turiu tave.“ 🥹",
  "Apkabinkite vienas kitą bent 20 sekundžių. 🫂",
  "Sugalvokite vieną vietą, kurią norite aplankyti kartu. 🌍"
];

const $ = id => document.getElementById(id);


function loadData() {

  try {

    return JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

  } catch {

    return null;

  }
}


function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}


function hasPIN() {

  return !!data?.pin;

}


function setupApp() {

  if (!data) {

    $("setupScreen")
      .classList
      .remove("hidden");

    return;

  }

  $("setupScreen")
    .classList
    .add("hidden");


  if (hasPIN() && !sessionStorage.getItem("coupleUnlocked")) {

    $("lockScreen")
      .classList
      .remove("hidden");

    $("mainScreen")
      .classList
      .add("hidden");

    createPinDots();

  } else {

    openMain();

  }

}


function openMain() {

  $("lockScreen")
    .classList
    .add("hidden");

  $("setupScreen")
    .classList
    .add("hidden");

  $("mainScreen")
    .classList
    .remove("hidden");

  render();

}


function createPinDots() {

  const container = $("pinDots");

  container.innerHTML = "";

  for (let i = 0; i < 4; i++) {

    const dot = document.createElement("span");

    dot.className = "pin-dot";

    container.appendChild(dot);

  }

}


function updatePinDots() {

  document
    .querySelectorAll(".pin-dot")
    .forEach((dot, index) => {

      dot.classList.toggle(
        "filled",
        index < currentPin.length
      );

    });

}


function addPinDigit(digit) {

  if (currentPin.length >= 4) {
    return;
  }

  currentPin += digit;

  updatePinDots();

  if (currentPin.length === 4) {

    setTimeout(checkPin, 150);

  }

}


function deletePinDigit() {

  currentPin =
    currentPin.slice(
      0,
      -1
    );

  updatePinDots();

}


function checkPin() {

  if (currentPin === data.pin) {

    sessionStorage.setItem(
      "coupleUnlocked",
      "true"
    );

    currentPin = "";

    openMain();

    showToast(
      "Sveiki sugrįžę į jūsų pasaulį ❤️"
    );

  } else {

    $("pinError")
      .textContent =
      "Neteisingas PIN.";

    $("lockScreen")
      .querySelector(".lock-card")
      .classList
      .add("shake");

    setTimeout(() => {

      $("lockScreen")
        .querySelector(".lock-card")
        .classList
        .remove("shake");

    }, 400);

    currentPin = "";

    updatePinDots();

  }

}


function createWorld() {

  const yourName =
    $("yourName").value.trim();

  const partnerName =
    $("partnerName").value.trim();

  const startDate =
    $("startDate").value;

  const songName =
    $("songName").value.trim();

  const songUrl =
    $("songUrl").value.trim();

  const pin =
    $("setupPin").value.trim();


  if (
    !yourName ||
    !partnerName ||
    !startDate
  ) {

    showToast(
      "Užpildyk vardus ir datą ❤️"
    );

    return;

  }


  if (
    pin &&
    !/^\d{4}$/.test(pin)
  ) {

    showToast(
      "PIN turi būti tiksliai 4 skaitmenys."
    );

    return;

  }


  data = {

    yourName,
    partnerName,
    startDate,

    songName,
    songUrl,

    pin,

    hearts: 0,

    love: 100,

    hugDate: "",

    hugStreak: 0,

    createdAt:
      new Date().toISOString()

  };


  saveData();

  sessionStorage.setItem(
    "coupleUnlocked",
    "true"
  );

  openMain();

  particles(20);

}


function updateRelationshipTime() {

  if (!data?.startDate) {
    return;
  }


  const start =
    new Date(
      `${data.startDate}T00:00:00`
    );

  const now =
    new Date();


  let diff =
    now.getTime() -
    start.getTime();


  if (diff < 0) {
    diff = 0;
  }


  const totalSeconds =
    Math.floor(
      diff / 1000
    );


  const days =
    Math.floor(
      totalSeconds / 86400
    );


  const hours =
    Math.floor(
      (totalSeconds % 86400) / 3600
    );


  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );


  const seconds =
    totalSeconds % 60;


  $("daysTogether")
    .textContent =
    days.toLocaleString("lt-LT");


  $("hours")
    .textContent =
    String(hours)
      .padStart(2, "0");


  $("minutes")
    .textContent =
    String(minutes)
      .padStart(2, "0");


  $("seconds")
    .textContent =
    String(seconds)
      .padStart(2, "0");


  updateAchievements(days);

}


function updateUI() {

  $("helloText")
    .textContent =
    `Labas, ${data.partnerName} ❤️`;


  $("yourInitial")
    .textContent =
    firstLetter(data.yourName);


  $("partnerInitial")
    .textContent =
    firstLetter(data.partnerName);


  $("songTitle")
    .textContent =
    data.songName ||
    "Jūsų daina";


  $("modalSongName")
    .textContent =
    data.songName ||
    "Jūsų daina";


  heartCount =
    Number(data.hearts || 0);


  loveValue =
    Number(data.love ?? 100);


  updateHeartUI();

  updateLoveUI();

  updateHugUI();

}


function firstLetter(text) {

  return (
    text
      .trim()
      .charAt(0)
      .toUpperCase()
    || "?"
  );

}


/* =========================
   TAP HEART
========================= */

function tapHeart() {

  data.hearts =
    Number(data.hearts || 0) + 1;

  heartCount =
    data.hearts;


  loveValue =
    Math.min(
      100,
      Number(data.love ?? 100) + 1
    );

  data.love =
    loveValue;


  saveData();

  updateHeartUI();

  updateLoveUI();

  updateAchievements(
    getDaysTogether()
  );

  particles(4);

  $("tapHeart")
    .animate(
      [
        {
          transform: "scale(1)"
        },
        {
          transform: "scale(.78)"
        },
        {
          transform: "scale(1.15)"
        },
        {
          transform: "scale(1)"
        }
      ],
      {
        duration: 350
      }
    );

}


function updateHeartUI() {

  $("heartCount")
    .textContent =
    heartCount
      .toLocaleString("lt-LT");


  const progress =
    Math.min(
      100,
      heartCount % 100
    );


  $("heartProgress")
    .style
    .width =
    `${progress || (heartCount > 0 ? 100 : 0)}%`;


  if (heartCount >= 100) {

    $("heartMessage")
      .textContent =
      "Heart Storm unlocked! 🌪️❤️";

  } else if (heartCount >= 10) {

    $("heartMessage")
      .textContent =
      "Jūs pradedate kurti savo Love Streak 💕";

  } else {

    $("heartMessage")
      .textContent =
      "Pradėkite savo Love Streak ❤️";

  }

}


/* =========================
   DAILY HUG
========================= */

function todayKey() {

  return new Date()
    .toISOString()
    .slice(0, 10);

}


function dailyHug() {

  const today =
    todayKey();


  if (data.hugDate === today) {

    showToast(
      "Šiandien jau apsikabinote 🫂"
    );

    return;

  }


  data.hugDate =
    today;


  data.hugStreak =
    Number(data.hugStreak || 0) + 1;


  saveData();

  updateHugUI();

  updateAchievements(
    getDaysTogether()
  );

  particles(12);

  showToast(
    "Daily Hug užskaitytas 🫂❤️"
  );

}


function updateHugUI() {

  const done =
    data.hugDate === todayKey();


  if (done) {

    $("hugStatus")
      .textContent =
      `🫂 Šiandien jau apsikabinote · ${data.hugStreak} dienų streak`;

    $("hugButton")
      .textContent =
      "✅ HUGGED TODAY";

    $("hugButton")
      .disabled = true;

    $("hugButton")
      .style
      .opacity = ".7";

  } else {

    $("hugStatus")
      .textContent =
      "Šiandien dar nepažymėta.";

    $("hugButton")
      .textContent =
      "🫶 I HUG YOU";

    $("hugButton")
      .disabled = false;

    $("hugButton")
      .style
      .opacity = "1";

  }

}


/* =========================
   LOVE METER
========================= */

function updateLoveUI() {

  $("lovePercent")
    .textContent =
    loveValue;


  $("meterFill")
    .style
    .width =
    `${loveValue}%`;


  let message =
    "Per daug meilės vienam ekranui 🥹";


  if (loveValue <= 35) {

    message =
      "Reikia daugiau apkabinimų 🫂";

  }

  else if (loveValue <= 70) {

    message =
      "Meilė auga... 💗";

  }

  else if (loveValue < 100) {

    message =
      "Jūs labai cute 🥹";

  }


  $("loveText")
    .textContent =
    message;

}


function increaseLove() {

  loveValue =
    Math.min(
      100,
      loveValue + 1
    );


  data.love =
    loveValue;


  saveData();

  updateLoveUI();

  particles(7);

  showToast(
    loveValue === 100
      ? "100% LOVE 🥹❤️"
      : "LOVE +1 💗"
  );

  updateAchievements(
    getDaysTogether()
  );

}


/* =========================
   SONG
========================= */

function openSong() {

  if (
    !data.songUrl
  ) {

    showToast(
      "Dainos nuoroda dar nenustatyta 🎵"
    );

    return;

  }


  $("songLink")
    .href =
    data.songUrl;


  $("songModal")
    .classList
    .remove("hidden");

}


function closeSong() {

  $("songModal")
    .classList
    .add("hidden");

}


/* =========================
   SURPRISE
========================= */

function showSurprise() {

  const random =
    surprises[
      Math.floor(
        Math.random() *
        surprises.length
      )
    ];


  $("surpriseText")
    .textContent =
    random;


  $("surpriseModal")
    .classList
    .remove("hidden");

  particles(8);

}


function closeSurprise() {

  $("surpriseModal")
    .classList
    .add("hidden");

}


/* =========================
   ACHIEVEMENTS
========================= */

function unlock(id) {

  const element =
    $(id);

  if (
    element
  ) {

    element
      .classList
      .add("unlocked");

  }

}


function updateAchievements(days) {

  if (!data) {
    return;
  }


  if (data.hearts >= 1) {

    unlock(
      "achievement-first-tap"
    );

  }


  if (data.hearts >= 10) {

    unlock(
      "achievement-ten"
    );

  }


  if (data.hearts >= 100) {

    unlock(
      "achievement-hundred"
    );

  }


  if (days >= 100) {

    unlock(
      "achievement-100-days"
    );

  }


  if (days >= 365) {

    unlock(
      "achievement-year"
    );

  }


  if (data.songName) {

    unlock(
      "achievement-song"
    );

  }


}


function getDaysTogether() {

  if (!data?.startDate) {
    return 0;
  }


  const start =
    new Date(
      `${data.startDate}T00:00:00`
    );


  const now =
    new Date();


  return Math.max(
    0,
    Math.floor(
      (
        now.getTime() -
        start.getTime()
      ) / 86400000
    )
  );

}


/* =========================
   PARTICLES
========================= */

function particles(count = 8) {

  const symbols = [
    "❤️",
    "💗",
    "💕",
    "💖",
    "✨"
  ];


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const particle =
      document.createElement(
        "div"
      );


    particle.className =
      "heart-particle";


    particle.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    particle.style.left =
      `${
        35 +
        Math.random() * 30
      }%`;


    particle.style.top =
      `${
        42 +
        Math.random() * 15
      }%`;


    particle.style.animationDelay =
      `${
        Math.random() * .25
      }s`;


    document.body
      .appendChild(
        particle
      );


    setTimeout(
      () => particle.remove(),
      1600
    );

  }

}


/* =========================
   TOAST
========================= */

let toastTimer;


function showToast(text) {

  const toast =
    $("toast");


  toast.textContent =
    text;


  toast.classList
    .add("show");


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList
          .remove("show");

      },
      2200
    );

}


/* =========================
   SETTINGS
========================= */

function editSettings() {

  $("yourName").value =
    data.yourName || "";

  $("partnerName").value =
    data.partnerName || "";

  $("startDate").value =
    data.startDate || "";

  $("songName").value =
    data.songName || "";

  $("songUrl").value =
    data.songUrl || "";

  $("setupPin").value =
    data.pin || "";


  $("mainScreen")
    .classList
    .add("hidden");


  $("setupScreen")
    .classList
    .remove("hidden");

}


/* =========================
   NAVIGATION
========================= */

document
  .querySelectorAll(".nav")
  .forEach(nav => {

    nav.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".nav")
          .forEach(
            n =>
              n.classList
                .remove("active")
          );


        nav.classList
          .add("active");


        const target =
          nav.dataset.target;


        if (
          target === "top"
        ) {

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }


        if (
          target ===
          "tap-section"
        ) {

          $("tapHeart")
            .scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

        }


        if (
          target ===
          "song-section"
        ) {

          $("songTitle")
            .scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

        }


        if (
          target ===
          "achievements-section"
        ) {

          document
            .querySelector(
              ".achievement-grid"
            )
            .scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

        }

      }

    );

  });


/* =========================
   EVENT LISTENERS
========================= */

$("createWorld")
  .addEventListener(
    "click",
    createWorld
  );


$("tapHeart")
  .addEventListener(
    "click",
    tapHeart
  );


$("hugButton")
  .addEventListener(
    "click",
    dailyHug
  );


$("loveButton")
  .addEventListener(
    "click",
    increaseLove
  );


$("playSong")
  .addEventListener(
    "click",
    openSong
  );


$("surpriseButton")
  .addEventListener(
    "click",
    showSurprise
  );


$("anotherSurprise")
  .addEventListener(
    "click",
    showSurprise
  );


$("closeSong")
  .addEventListener(
    "click",
    closeSong
  );


$("closeSurprise")
  .addEventListener(
    "click",
    closeSurprise
  );


$("settingsBtn")
  .addEventListener(
    "click",
    editSettings
  );


document
  .querySelectorAll(
    "[data-pin]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        addPinDigit(
          button.dataset.pin
        );

      }
    );

  });


$("deletePin")
  .addEventListener(
    "click",
    deletePinDigit
  );


document
  .querySelectorAll(".modal-bg")
  .forEach(bg => {

    bg.addEventListener(
      "click",
      () => {

        closeSong();
        closeSurprise();

      }
    );

  });


/* =========================
   START
========================= */

setInterval(
  updateRelationshipTime,
  1000
);


if (
  "serviceWorker"
  in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator
        .serviceWorker
        .register(
          "./sw.js"
        )
        .catch(
          console.warn
        );

    }
  );

}


setupApp();


if (data) {

  updateUI();

}
