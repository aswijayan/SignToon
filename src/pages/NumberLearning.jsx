import { useState } from "react";
import { useNavigate } from "react-router-dom";
import shinchan from "../assets/characters/shinchan-veshti.jpg";
import ChapterQuiz from "../components/ChapterQuiz";

const numbers = Array.from({ length: 10 }, (_, index) => String(index));
const numberAssets = import.meta.glob(
  "../assets/Shinchan Numbers/Shinchan_*.jpg",
  { eager: true, import: "default", query: "?url" },
);

const assetByNumber = Object.entries(numberAssets).reduce(
  (assets, [path, image]) => {
    const number = path.match(/Shinchan_(\d)\.jpg$/)?.[1];
    if (number !== undefined) assets[number] = image;
    return assets;
  },
  {},
);

const descriptions = {
  0: "Make a rounded shape with your hand to show zero.",
  1: "Raise your index finger to show one.",
  2: "Raise your index and middle fingers to show two.",
  3: "Raise your thumb, index, and middle fingers to show three.",
  4: "Raise four fingers while keeping your thumb folded in.",
  5: "Raise all five fingers with your palm open.",
  6: "Use the sign shown to learn the number six.",
  7: "Use the sign shown to learn the number seven.",
  8: "Use the sign shown to learn the number eight.",
  9: "Use the sign shown to learn the number nine.",
};

const quizQuestions = [
  {
    id: "number-zero",
    type: "choice",
    prompt: "Which number is shown in this lesson image?",
    options: ["0", "1", "2", "3"],
    answer: "0",
    image: numberAssets["../assets/Shinchan Numbers/Shinchan_0.jpg"],
    imageAlt: "Shinchan showing the sign for zero",
  },
  {
    id: "number-five-description",
    type: "choice",
    prompt: "Which number is shown with all five fingers raised?",
    options: ["3", "4", "5", "6"],
    answer: "5",
  },
  {
    id: "number-count",
    type: "trueFalse",
    prompt: "This chapter contains ten number lessons, from 0 to 9.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    id: "number-fill",
    type: "fill",
    prompt: "Type the number that comes after 7.",
    answer: "8",
  },
  {
    id: "number-one-description",
    type: "choice",
    prompt: "Which number is shown by raising the index finger?",
    options: ["0", "1", "2", "9"],
    answer: "1",
  },
];

function readCompletedNumbers() {
  try {
    const saved = JSON.parse(localStorage.getItem("islNumberProgress") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readNumberScore() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("islNumberQuizScore") || "null",
    );
    return typeof saved === "number" ? saved : null;
  } catch {
    return null;
  }
}

export default function NumberLearning() {
  const navigate = useNavigate();
  const [completedNumbers, setCompletedNumbers] =
    useState(readCompletedNumbers);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(readNumberScore);

  const openNumber = (number) => {
    const nextCompleted = completedNumbers.includes(number)
      ? completedNumbers
      : [...completedNumbers, number];

    setCompletedNumbers(nextCompleted);
    localStorage.setItem("islNumberProgress", JSON.stringify(nextCompleted));
    setSelectedNumber(number);
  };

  const completedCount = completedNumbers.length;
  const selectedImage =
    selectedNumber !== null ? assetByNumber[selectedNumber] || shinchan : null;

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
          <h1>ISL Numbers</h1>
        </div>
        <div className="alphabet-progress-summary">
          <strong>{completedCount}/10</strong>
          <span>numbers learned</span>
        </div>
      </header>

      <main className="alphabet-main">
        <section className="alphabet-intro">
          <div>
            <p className="modal-eyebrow">LEARN WITH SHINCHAN</p>
            <h2>Count every number with your hands.</h2>
            <p>Choose a number to see its sign and learn how to make it.</p>
          </div>
          <div
            className="alphabet-progress-track"
            aria-label={`${completedCount} of 10 numbers learned`}
          >
            <span style={{ width: `${(completedCount / 10) * 100}%` }} />
          </div>
        </section>

        <section className="alphabet-grid" aria-label="ISL number lessons">
          {numbers.map((number) => {
            const completed = completedNumbers.includes(number);
            return (
              <button
                key={number}
                className={`letter-button${completed ? " completed" : ""}`}
                onClick={() => openNumber(number)}
                aria-label={`Learn the sign for ${number}`}
              >
                <span>{number}</span>
                {completed && <small aria-label="Completed">&#10003;</small>}
              </button>
            );
          })}
        </section>

        <section className="chapter-quiz-section">
          <button
            className="attempt-quiz-button"
            disabled={completedCount !== 10}
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
          {completedCount === 10 ? "Numbers complete!" : "Keep exploring"}
        </small>
      </footer>

      {selectedNumber !== null && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelectedNumber(null)
          }
        >
          <section
            className="letter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="number-modal-title"
          >
            <button
              className="close-button"
              onClick={() => setSelectedNumber(null)}
              aria-label="Close number lesson"
            >
              &times;
            </button>
            <p className="modal-eyebrow">SIGN OF THE DAY</p>
            <h2 id="number-modal-title">Number {selectedNumber}</h2>
            <div className="letter-image-frame">
              <img
                src={selectedImage}
                alt={`Shinchan showing the sign for ${selectedNumber}`}
              />
            </div>
            <p className="letter-description">{descriptions[selectedNumber]}</p>
            <span className="completed-badge">&#10003; Number learned</span>
          </section>
        </div>
      )}

      <ChapterQuiz
        chapter="Numbers"
        questions={quizQuestions}
        storageKey="islNumberQuizScore"
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={setQuizScore}
      />
    </div>
  );
}
