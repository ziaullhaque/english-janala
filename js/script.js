// 🔹 Utility: create span buttons for synonyms
const createElements = (arr) => {
  const htmlElements = arr.map(
    (el) => `<span class="btn poppins">${el}</span>`
  );
  return htmlElements.join(" ");
};

//🔹 Speak Words
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // English
  window.speechSynthesis.speak(utterance);
}

// 🔹 Spinner show/hide
const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// 🔹 Load all lessons
const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data))
    .catch((err) => console.error("Error loading lessons:", err));
};

// 🔹 Remove active class from all lesson buttons
const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

// 🔹 Load words by lesson level
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    })
    .catch((err) => console.error("Error loading level words:", err));
};

// 🔹 Load single word details
const loadWordDetail = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
  } catch (err) {
    console.error("Error loading word details:", err);
  }
};

// 🔹 Display word details in modal
const displayWordDetails = (word) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
    <div>
      <h2 class="poppins font-semibold text-2xl">
        ${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${
    word.pronunciation
  })
      </h2>
    </div>
    <div>
      <h2 class="poppins font-semibold text-2xl">Meaning</h2>
      <p class="hind-siliguri font-medium text-xl">${word.meaning}</p>
    </div>
    <div>
      <h2 class="poppins font-semibold text-2xl">Example</h2>
      <p class="poppins font-normal text-2xl text-[#999999]">${
        word.sentence
      }</p>
    </div>
    <div>
      <h2 class="hind-siliguri font-medium text-xl">সমার্থক শব্দ গুলো / Synonyms</h2>
      <div>${createElements(word.synonyms)}</div>
    </div>
  `;
  document.getElementById("word_modal").showModal();
};

// 🔹 Display all words for a lesson
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
      <div class="text-center col-span-full my-10 space-y-5">
        <img class="mx-auto" src="./assets/alert-error.png" alt="Error" />
        <p class="hind-siliguri font-medium text-xl text-[#79716B]">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="hind-siliguri font-bold text-4xl">
          নেক্সট Lesson এ যান
        </h2>
      </div>`;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-[#FFFFFF] py-10 px-5 rounded-xl shadow-sm text-center space-y-5">
        <h2 class="inter font-bold text-3xl">
          ${word.word ? word.word : "শব্দ পাওয়া যায়নি"}
        </h2>
        <p class="inter font-medium text-xl">Meaning / Pronunciation</p>
        <div class="hind-siliguri font-semibold text-3xl">
          "${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / 
           ${
             word.pronunciation
               ? word.pronunciation
               : "Pronunciation পাওয়া যায়নি"
           }"
        </div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id})" 
                  class="btn bg-[#1A91FF] rounded-md hover:bg-[#1A91FF10] text-white">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick="pronounceWord('${
            word.word
          }')" class="btn bg-[#E8F4FF] hover:bg-[#1A91FF10] rounded-md">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;
    wordContainer.append(card);
  });

  manageSpinner(false);
};

// 🔹 Display lesson buttons
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" 
              onclick="loadLevelWord(${lesson.level_no})" 
              class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
      </button>
    `;
    levelContainer.append(btnDiv);
  }
};

// 🔹 Start
loadLessons();

// 🔹 Search
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      // console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      // console.log(filterWords);
      displayLevelWord(filterWords);
    });
});

// 🔹 Scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
