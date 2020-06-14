const displayTime = document.querySelector(".timer");
const focusSymbol = document.querySelector(".focus-symbol");
const controls = document.querySelector(".timer-controls");
const background = document.querySelector("body");
const spButton = document.querySelector("#start");
const displayCompletions = document.querySelector(".completion");

let duration = 60 * 28;

const breathIn = new Audio("sounds/in.mp3");
const breathOut = new Audio("sounds/out.mp3");
const audio1 = new Audio("sounds/completionL2.mp3");
const audio2 = new Audio("sounds/completion2.mp3");
let completionCount;
try {
	completionCount = localStorage.getItem("completionCount");
} catch (e) {
	console.log(e);
}

const countCompletion = () => {
	try {
		localStorage.setItem("completionCount", ++completionCount);
	} catch (e) {
		console.log(e);
		displayCompletion();
	}
};
const displayCompletion = () => {
	displayCompletions.innerHTML = `
        <span>Completions: <strong>${completionCount}</strong></span>
    `;
};
completionCount && completionCount !== "undefined"
	? displayCompletion()
	: (displayCompletions.innerHTML = ``);

let completionSound = audio1;

const app = () => {
	let timer = duration;

	let countdown = setInterval(() => {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? `0${minutes}` : minutes;
		seconds = seconds < 10 ? `0${seconds}` : seconds;

		displayTime.innerText = `${minutes}:${seconds}`;

		// when timer gets paused
		pauseApp = () => {
			clearInterval(countdown);
			clearInterval(animationInterval);
			return (duration = timer);
		};

		// when timer finishes
		if (--timer < 0) {
			timer = duration;
			displayTime.innerHTML = "Completed!";
			clearInterval(countdown);
			clearInterval(animationInterval);
			spButton.innerText = "START";
			completionSound.play();
			countCompletion();
		}
	}, 1000);

	let animationInterval = setInterval(() => {
		breathingAnimation();
	}, 16000);
	setTimeout(() => {
		breathingAnimation();
	}, 1000);
};

const breathingAnimation = () => {
	breathIn.play();
	focusSymbol.classList.remove("exhale");
	focusSymbol.classList.add("inhale");
	setTimeout(() => {
		focusSymbol.classList.remove("inhale");
		focusSymbol.classList.add("exhale");
		breathOut.play();
	}, 8000);
};

controls.addEventListener("click", e => {
	e.preventDefault();
	// finished timed animation before starting a new one
	if (!focusSymbol.classList.contains("inhale")) {
		if (e.target.innerText === "START") {
			e.target.innerText = "PAUSE";
			app();
		}
	} else if (e.target.innerText === "PAUSE") {
		e.target.innerText = "START";
		pauseApp();
	}
});

focusSymbol.addEventListener("click", e => {
	if (completionSound === audio1) {
		completionSound = audio2;
		background.classList.remove("bgA");
		background.classList.add("bgH");
	} else {
		completionSound = audio1;
		background.classList.remove("bgH");
		background.classList.add("bgA");
	}
});
