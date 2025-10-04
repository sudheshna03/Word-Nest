const authScreen = document.getElementById("auth-screen");
const loginScreen = document.getElementById("login-screen");
const signupScreen = document.getElementById("signup-screen");
const welcomeScreen = document.getElementById("welcome-screen");
const dictionaryScreen = document.getElementById("dictionary-screen");
const thankYouScreen = document.getElementById("thankyou-screen");
const teamScreen = document.getElementById("team-screen");

const signupUsername = document.getElementById("signup-username");
const signupPassword = document.getElementById("signup-password");
const signupRepassword = document.getElementById("signup-repassword");
const signupEmail = document.getElementById("signup-email");
const signupPhone = document.getElementById("signup-phone");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const wordTxt = document.getElementById("word-txt");
const typeTxt = document.getElementById("type-txt");
const phoneticTxt = document.getElementById("phonetic-txt");
const soundBtn = document.getElementById("sound-btn");
const definitionTxt = document.getElementById("definition-txt");
const exampleElem = document.getElementById("example-elem");
const synonymsElem = document.getElementById("synonyms-elem");
const antonymsElem = document.getElementById("antonyms-elem");
const wordDetailsElem = document.querySelector(".word-details");
const errTxt = document.querySelector(".errTxt");

const audio = new Audio();

function showLogin() {
  authScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function showSignup() {
  authScreen.classList.add("hidden");
  signupScreen.classList.remove("hidden");
}

function authScreenBack() {
  loginScreen.classList.add("hidden");
  signupScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
}

function signup() {
  const username = signupUsername.value;
  const password = signupPassword.value;
  const repassword = signupRepassword.value;
  const email = signupEmail.value;
  const phone = signupPhone.value;

  if (username && password && repassword && email && phone) {
    if (password !== repassword) {
      alert("Passwords do not match.");
      return;
    }
    localStorage.setItem("happyNestUser", JSON.stringify({ username, password, email, phone }));
    alert("Signup successful! Please login.");
    signupScreen.classList.add("hidden");
    authScreen.classList.remove("hidden");
  } else {
    alert("Please fill all fields.");
  }
}

function login() {
  const username = loginUsername.value;
  const password = loginPassword.value;
  const storedUser = JSON.parse(localStorage.getItem("happyNestUser"));

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    loginScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
  } else {
    alert("Invalid credentials. Try again.");
  }
}

function showDictionary() {
  welcomeScreen.classList.add("hidden");
  teamScreen.classList.add("hidden");
  dictionaryScreen.classList.remove("hidden");
}

function logout() {
  dictionaryScreen.classList.add("hidden");
  thankYouScreen.classList.remove("hidden");
}

function showTeam() {
  dictionaryScreen.classList.add("hidden");
  teamScreen.classList.remove("hidden");
}

async function getWordDetails(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  const data = await res.json();
  const wordData = data[0];
  const phonetics = wordData.phonetics || [];

  let phoneticText = "", phoneticAudio = "";

  for (const phonetic of phonetics) {
    if (phonetic.text && !phoneticText) phoneticText = phonetic.text;
    if (phonetic.audio && !phoneticAudio) phoneticAudio = phonetic.audio;
    if (phoneticText && phoneticAudio) break;
  }

  const meaning = wordData.meanings[0];
  return {
    word: word.toLowerCase(),
    phonetic: { text: phoneticText, audio: phoneticAudio },
    speechPart: meaning.partOfSpeech,
    definition: meaning.definitions[0].definition,
    synonyms: meaning.synonyms,
    antonyms: meaning.antonyms,
    example: meaning.definitions[0].example || ""
  };
}

searchBox.addEventListener("submit", async e => {
  e.preventDefault();
  if (searchInput.value.trim() === "") {
    errTxt.textContent = "Please Enter a Word";
  } else {
    wordDetailsElem.classList.remove("active");
    try {
      errTxt.textContent = "";
      const wordDetails = await getWordDetails(searchInput.value);
      wordTxt.textContent = wordDetails.word;
      typeTxt.textContent = wordDetails.speechPart;
      phoneticTxt.textContent = wordDetails.phonetic.text;
      audio.src = wordDetails.phonetic.audio;
      definitionTxt.textContent = wordDetails.definition;
      exampleElem.querySelector("p").textContent = wordDetails.example;
      synonymsElem.querySelector("p").textContent = wordDetails.synonyms.join(", ");
      antonymsElem.querySelector("p").textContent = wordDetails.antonyms.join(", ");
      exampleElem.style.display = wordDetails.example === "" ? "none" : "block";
      synonymsElem.style.display = wordDetails.synonyms.length === 0 ? "none" : "block";
      antonymsElem.style.display = wordDetails.antonyms.length === 0 ? "none" : "block";
      wordDetailsElem.classList.add("active");
    } catch {
      errTxt.textContent = "Word Not Found";
    }
  }
});

soundBtn.addEventListener("click", () => {
  audio.play();
});
