import { useState } from "react";

function isCorrect(question, answer) {
  if (question.type === "fill") {
    return (
      answer.trim().toLowerCase() === String(question.answer).toLowerCase()
    );
  }
  return answer === question.answer;
}

export default function ChapterQuiz({
  chapter,
  questions,
  storageKey,
  isOpen,
  onClose,
  onComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id] || "";

  const chooseAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));
  };

  const submitAnswer = () => {
    const nextScore =
      (score || 0) + (isCorrect(currentQuestion, currentAnswer) ? 1 : 0);

    if (currentIndex === questions.length - 1) {
      localStorage.setItem(storageKey, JSON.stringify(nextScore));
      setScore(nextScore);
      setQuizFinished(true);
      onComplete(nextScore);
      return;
    }

    setScore(nextScore);
    setCurrentIndex((index) => index + 1);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(null);
    setQuizFinished(false);
  };

  if (!isOpen) return null;

  if (quizFinished) {
    return (
      <div className="modal-backdrop">
        <section className="quiz-modal" role="dialog" aria-modal="true">
          <p className="modal-eyebrow">QUIZ COMPLETE</p>
          <h2>{chapter} quiz score</h2>
          <strong className="quiz-score">{score}/5</strong>
          <p className="quiz-result">
            Your score has been saved for this chapter.
          </p>
          <div className="quiz-actions">
            <button className="quiz-retry-button" onClick={restartQuiz}>
              Try again
            </button>
            <button className="quiz-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <section
        className="quiz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close quiz"
        >
          &times;
        </button>
        <p className="modal-eyebrow">QUESTION {currentIndex + 1} OF 5</p>
        <h2 id="quiz-title">{chapter} quiz</h2>
        {currentQuestion.image && (
          <img
            className="quiz-question-image"
            src={currentQuestion.image}
            alt={currentQuestion.imageAlt}
          />
        )}
        <p className="quiz-question">{currentQuestion.prompt}</p>

        {currentQuestion.type === "fill" ? (
          <input
            className="quiz-fill-input"
            value={currentAnswer}
            onChange={(event) => chooseAnswer(event.target.value)}
            placeholder="Type your answer"
            aria-label="Your answer"
            autoFocus
          />
        ) : (
          <div className="quiz-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`quiz-option${currentAnswer === option ? " selected" : ""}`}
                onClick={() => chooseAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <button
          className="quiz-next-button"
          onClick={submitAnswer}
          disabled={!currentAnswer}
        >
          {currentIndex === questions.length - 1
            ? "Finish quiz"
            : "Next question"}
          <span aria-hidden="true">&#8250;</span>
        </button>
      </section>
    </div>
  );
}
