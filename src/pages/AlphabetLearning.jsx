import { useState } from "react";
import { useNavigate } from "react-router-dom";
import shinchan from "../assets/characters/shinchan-veshti.jpg";
import ChapterQuiz from "../components/ChapterQuiz";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphabetAssets = import.meta.glob(
  "../assets/Shinchan A - Z/*_Shinchan.jpg",
  { eager: true, import: "default", query: "?url" },
);

const assetByLetter = Object.entries(alphabetAssets).reduce(
  (assets, [path, image]) => {
    const letter = path.split("/").pop()?.charAt(0).toUpperCase();
    if (letter) assets[letter] = image;
    return assets;
  },
  {},
);

const descriptions = {
  A: "Make a fist with your thumb resting beside your fingers.",
  B: "Keep your fingers straight together and fold your thumb across your palm.",
  C: "Curve your hand into the shape of a letter C.",
  D: "Point your index finger up and touch your other fingertips to your thumb.",
  E: "Curl your fingers down toward your palm with your thumb across them.",
  F: "Touch your thumb and index finger together while keeping the other fingers up.",
  G: "Point your index finger sideways with your thumb beside it.",
  H: "Point your index and middle fingers sideways together.",
  I: "Raise your little finger while keeping the others folded.",
  J: "Start with your little finger raised and draw a J in the air.",
  K: "Raise your index and middle fingers with your thumb between them.",
  L: "Raise your index finger and thumb to form an L.",
  M: "Fold your thumb under your first three fingers.",
  N: "Fold your thumb under your first two fingers.",
  O: "Bring all your fingertips together to form a rounded O.",
  P: "Shape your hand like K and angle it downward.",
  Q: "Shape your hand like G and point it down.",
  R: "Cross your index and middle fingers while the other fingers fold in.",
  S: "Make a fist with your thumb resting across the front of your fingers.",
  T: "Make a fist with your thumb tucked between your index and middle fingers.",
  U: "Raise your index and middle fingers together.",
  V: "Raise your index and middle fingers apart in a V shape.",
  W: "Raise your index, middle, and ring fingers apart.",
  X: "Raise your index finger and hook it gently like a small curve.",
  Y: "Extend your thumb and little finger while folding the others in.",
  Z: "Trace a Z in the air with your index finger.",
};

const quizQuestions = [
  {
    id: "alphabet-a",
    type: "choice",
    prompt: "Which letter is shown in this lesson image?",
    options: ["A", "B", "C", "D"],
    answer: "A",
    image: alphabetAssets["../assets/Shinchan A - Z/A_Shinchan.jpg"],
    imageAlt: "Shinchan showing the sign for A",
  },
  {
    id: "alphabet-b-description",
    type: "choice",
    prompt:
      "Which letter keeps the fingers straight together with the thumb folded across the palm?",
    options: ["B", "F", "L", "Y"],
    answer: "B",
  },
  {
    id: "alphabet-complete",
    type: "trueFalse",
    prompt: "The ISL alphabet has 26 letters.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    id: "alphabet-fill",
    type: "fill",
    prompt: "Type the last letter of the alphabet.",
    answer: "Z",
  },
  {
    id: "alphabet-v-description",
    type: "choice",
    prompt:
      "Which letter uses the index and middle fingers apart in a V shape?",
    options: ["U", "V", "W", "X"],
    answer: "V",
  },
];

function readCompletedLetters() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("islAlphabetProgress") || "[]",
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readAlphabetScore() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("islAlphabetQuizScore") || "null",
    );
    return typeof saved === "number" ? saved : null;
  } catch {
    return null;
  }
}

export default function AlphabetLearning() {
  const navigate = useNavigate();
  const [completedLetters, setCompletedLetters] =
    useState(readCompletedLetters);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(readAlphabetScore);

  const openLetter = (letter) => {
    const nextCompleted = completedLetters.includes(letter)
      ? completedLetters
      : [...completedLetters, letter];

    setCompletedLetters(nextCompleted);
    localStorage.setItem("islAlphabetProgress", JSON.stringify(nextCompleted));
    setSelectedLetter(letter);
  };

  const completedCount = completedLetters.length;
  const selectedImage = selectedLetter
    ? assetByLetter[selectedLetter] || shinchan
    : null;

  return (
    <div className="alphabet-page">
      <header className="alphabet-header">
        <button
          className="alphabet-back-button"
          onClick={() =>
            navigate("/dashboard", { state: { openModules: true } })
          }
        >
          <span aria-hidden="true">&#8592;</span> Dashboard
        </button>
        <div>
          <h1>ISL Alphabet</h1>
        </div>
        <div className="alphabet-progress-summary">
          <strong>{completedCount}/26</strong>
          <span>letters learned</span>
        </div>
      </header>

      <main className="alphabet-main">
        <section className="alphabet-intro">
          <div>
            <p className="modal-eyebrow">LEARN WITH SHINCHAN</p>
            <h2>Meet every letter with your hands.</h2>
            <p>Choose a letter to see its sign and learn how to make it.</p>
          </div>
          <div
            className="alphabet-progress-track"
            aria-label={`${completedCount} of 26 letters learned`}
          >
            <span style={{ width: `${(completedCount / 26) * 100}%` }} />
          </div>
        </section>

        <section className="alphabet-grid" aria-label="ISL alphabet letters">
          {letters.map((letter) => {
            const completed = completedLetters.includes(letter);
            return (
              <button
                key={letter}
                className={`letter-button${completed ? " completed" : ""}`}
                onClick={() => openLetter(letter)}
                aria-label={`Learn the sign for ${letter}`}
              >
                <span>{letter}</span>
                {completed && <small aria-label="Completed">&#10003;</small>}
              </button>
            );
          })}
        </section>

        <section className="chapter-quiz-section">
          <button
            className="attempt-quiz-button"
            disabled={completedCount !== 26}
            onClick={() => setShowQuiz(true)}
          >
            Attempt Quiz
          </button>
          {quizScore !== null && <span>Last score: {quizScore}/5</span>}
        </section>
      </main>

      <footer className="dashboard-footer alphabet-footer">
        <strong>
          <span className="footer-mark">S</span> Sign<span>Toon</span>
        </strong>
        <span>One sign at a time.</span>
        <small>
          {completedCount === 26 ? "Alphabet complete!" : "Keep exploring"}
        </small>
      </footer>

      {selectedLetter && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelectedLetter(null)
          }
        >
          <section
            className="letter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-modal-title"
          >
            <button
              className="close-button"
              onClick={() => setSelectedLetter(null)}
              aria-label="Close letter lesson"
            >
              &times;
            </button>
            <p className="modal-eyebrow">SIGN OF THE DAY</p>
            <h2 id="letter-modal-title">Letter {selectedLetter}</h2>
            <div className="letter-image-frame">
              <img
                src={selectedImage}
                alt={`Shinchan showing the sign for ${selectedLetter}`}
              />
            </div>
            <p className="letter-description">{descriptions[selectedLetter]}</p>
            <span className="completed-badge">&#10003; Letter learned</span>
          </section>
        </div>
      )}

      <ChapterQuiz
        chapter="Alphabet"
        questions={quizQuestions}
        storageKey="islAlphabetQuizScore"
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={setQuizScore}
      />
    </div>
  );
}
