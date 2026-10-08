import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import shinchan from "../assets/characters/shinchan-veshti.jpg";

const modules = [
  {
    icon: "hand",
    title: "ISL Alphabet",
    detail: "Learn A-Z hand shapes",
    lessons: 26,
    progress: 0,
  },
  {
    icon: "spark",
    title: "Daily Greetings",
    detail: "Hello, welcome, and more",
    lessons: 8,
    progress: 0,
  },
  {
    icon: "number",
    title: "Numbers",
    detail: "Count confidently from 1-100",
    lessons: 10,
    progress: 0,
  },
  {
    icon: "book",
    title: "Everyday Signs",
    detail: "Useful signs for daily life",
    lessons: 16,
    progress: 0,
  },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useState(() => {
    const fallback = { username: "Learner", email: "", dob: "", id: "" };
    try {
      return {
        ...fallback,
        ...(JSON.parse(localStorage.getItem("user") || "null") || {}),
      };
    } catch {
      localStorage.removeItem("user");
      return fallback;
    }
  });
  const [alphabetProgress] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("islAlphabetProgress") || "[]",
      );
      return Array.isArray(saved) ? saved.length : 0;
    } catch {
      return 0;
    }
  });
  const [numberProgress] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("islNumberProgress") || "[]",
      );
      return Array.isArray(saved) ? saved.length : 0;
    } catch {
      return 0;
    }
  });
  const [showModules, setShowModules] = useState(
    () => location.state?.openModules === true,
  );
  const [showProfile, setShowProfile] = useState(false);

  const initials = (user.username || "L").slice(0, 1).toUpperCase();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="greeting">
            VANAKKAM, {(user.username || "Learner").toUpperCase()}!
          </p>
          <h1>Ready to sign today?</h1>
        </div>
        <div className="profile-wrap">
          <button
            className="profile-button"
            onClick={() => setShowProfile((open) => !open)}
            aria-label="Open profile"
          >
            {initials}
          </button>
          {showProfile && (
            <div className="profile-popover">
              <div className="profile-popover-heading">
                <span className="profile-avatar">{initials}</span>
                <div>
                  <strong>{user.username}</strong>
                  <small>SignToon learner</small>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>{user.email || "Not available"}</dd>
                </div>
                <div>
                  <dt>Date of birth</dt>
                  <dd>{user.dob || "Not available"}</dd>
                </div>
                <div>
                  <dt>Learner ID</dt>
                  <dd>{user.id || "Not available"}</dd>
                </div>
              </dl>
              <button className="logout-button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <section className="adventure-hero">
          <div className="adventure-copy">
            <div className="adventure-tag">
              <span>+</span> TODAY&apos;S ADVENTURE
            </div>
            <h2>
              Talk with
              <br />
              your
              <br />
              hands.
              <br />
              <em>Shine</em>
              <br />
              with
              <br />
              every
              <br />
              sign.
            </h2>
            <p>
              Learn Indian Sign Language through playful lessons made for
              curious minds.
            </p>
            <button
              className="start-button"
              onClick={() => setShowModules(true)}
            >
              <span className="play-icon">&#9654;</span> Start Learning{" "}
              <span className="arrow">&#8250;</span>
            </button>
          </div>
          <div className="hero-character-frame">
            <div className="wave-character">
              <img src={shinchan} alt="Shinchan waving" />
            </div>
          </div>
        </section>

        <section className="dashboard-summary">
          <div>
            <span>YOUR STREAK</span>
            <strong>
              7 <small>days</small>
            </strong>
          </div>
          <div>
            <span>SIGNS LEARNED</span>
            <strong>{alphabetProgress}</strong>
          </div>
          <div>
            <span>THIS WEEK</span>
            <strong>
              4 <small>lessons</small>
            </strong>
          </div>
          <div>
            <span>KEEP GOING</span>
            <strong className="summary-accent">You&apos;re on fire!</strong>
          </div>
        </section>
        <section className="quote-strip">
          <span>&ldquo;</span>
          <p>Every sign is a step towards connection.</p>
          <span>&rdquo;</span>
        </section>
      </main>

      <footer className="dashboard-footer">
        <strong>
          <span className="footer-mark">S</span> Sign<span>Toon</span>
        </strong>
        <span>Learn. Practice. Connect.</span>
        <small>Made for curious hands</small>
      </footer>

      {showModules && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setShowModules(false)
          }
        >
          <section
            className="module-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="module-title"
          >
            <button
              className="close-button"
              onClick={() => setShowModules(false)}
              aria-label="Close learning modules"
            >
              &times;
            </button>
            <p className="modal-eyebrow">YOUR LEARNING PATH</p>
            <h2 id="module-title">Choose a module</h2>
            <p className="modal-intro">
              Start small, practise daily, and celebrate every new sign.
            </p>
            <div className="module-grid">
              {modules.map((module) => {
                const progress =
                  module.title === "ISL Alphabet"
                    ? Math.round((alphabetProgress / 26) * 100)
                    : module.title === "Numbers"
                      ? Math.round((numberProgress / 10) * 100)
                      : module.progress;

                return (
                  <article className="module-card" key={module.title}>
                    <div className={`module-icon ${module.icon}`}>
                      {module.icon === "hand"
                        ? "O"
                        : module.icon === "spark"
                          ? "+"
                          : module.icon === "number"
                            ? "A"
                            : "[]"}
                    </div>
                    <span className="lesson-count">
                      {module.lessons} lessons
                    </span>
                    <h3>{module.title}</h3>
                    <p>{module.detail}</p>
                    <div className="progress-track">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <div className="module-bottom">
                      <span>{progress}% complete</span>
                      <button
                        onClick={() => {
                          setShowModules(false);
                          if (module.title === "ISL Alphabet") {
                            navigate("/learn/alphabet");
                          } else if (module.title === "Numbers") {
                            navigate("/learn/numbers");
                          }
                        }}
                      >
                        {progress ? "Continue" : "Start"} <b>&#8250;</b>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
