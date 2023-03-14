/*
TODO:

- Получить данные по АПИ
- Вставить полученное слово в контейнер (results-word)
- Добавить функционал для воспроизведения слова в аудио-формате
- Вставить в контейнер с результатами

*/

let state = {
	word: "",
	meanings: [],
	phonetics: [],
};

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.getElementById("word-input");
const form = document.querySelector(".form");
const containerWord = document.querySelector(".results-word");
const soundBtn = document.querySelector(".results-sound");
const resultsWrapper = document.querySelector(".results");
const resultsList = document.querySelector(".results-list");
const containerError = document.querySelector(".error");

const getDefinition = (definitions) => {
	return definitions.map(renderDefinition).join("");
};

const renderDefinition = (itemDefinition) => {
	const example = itemDefinition.example
		? `
          <div class="results-item__example">
            <p>Example: <span>${itemDefinition.example}</span></p>
          </div>
          `
		: "";
	return `<div class="results-item__definition">
            <p>${itemDefinition.definition}</p>
            ${example}
          </div>`;
};

const renderItem = (item) => {
	return `<div class="results-item">
            <div class="results-item__part">${item.partOfSpeech}</div>

            <div class="results-item__definitions">
              ${getDefinition(item.definitions)}
            </div>
          </div>`;
};

const insertWord = () => {
	containerWord.innerHTML = state.word;
};

const showResults = () => {
	containerError.style.display = "none";
	resultsWrapper.style.display = "block";
	resultsList.innerHTML = "";

	state.meanings.forEach((item) => {
		resultsList.innerHTML += renderItem(item);
	});
};

const showError = (error) => {
	(containerError.style.display = "block"),
		(resultsWrapper.style.display = "none");

	containerError.innerHTML = error.message;
};

const handleKeyup = (e) => {
	const value = e.target.value;

	state.word = value;
};

const handleSubmit = async (e) => {
	e.preventDefault();

	if (!state.word.trim()) return;

	try {
		const response = await fetch(`${url}${state.word}`);
		const data = await response.json();

		if (response.ok && data.length) {
			const item = data[0];

			state = {
				...state,
				meanings: item.meanings,
				phonetics: item.phonetics,
			};
			insertWord();
			showResults();
		} else {
			showError(data);
		}
	} catch (err) {
		console.log(err);
	}
};

const handleSound = () => {
	if (state.phonetics.length) {
		let sound = 0;

		state.phonetics.forEach((item, index) => {
			sound = state.phonetics[index];
		});

		if (sound.audio) {
			new Audio(sound.audio).play();
		}
	}
};

input.addEventListener("keyup", handleKeyup);
form.addEventListener("submit", handleSubmit);
soundBtn.addEventListener("click", handleSound);
