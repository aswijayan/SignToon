import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    dob: "",
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    const safeValue = typeof value === "string" ? value : "";

    if (name === "username") {
      if (!safeValue.trim()) return "Username is required.";
      return "";
    }

    if (name === "dob") {
      if (!safeValue.trim()) return "Date of birth is required.";
      return "";
    }

    if (name === "email") {
      if (!safeValue.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeValue)) {
        return "Enter a valid email.";
      }
      return "";
    }

    if (name === "password") {
      if (!safeValue) return "Password is required.";
      if (safeValue.length < 8) return "Use at least 8 characters.";
      return "";
    }

    return "";
  };

  const validateForm = () => {
    const nextErrors = {
      username: validateField("username", formData.username),
      dob: isLogin ? "" : validateField("dob", formData.dob),
      email: isLogin ? "" : validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  /* =========================================================
     EXISTING FORM LOGIC
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const body = isLogin
        ? {
            usernameOrEmail: formData.username,
            password: formData.password,
          }
        : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setDashboardLoading(true);

        window.setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setFormData({
          username: "",
          dob: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          setIsLogin(true);
          setMessage("");
        }, 1200);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     WAVE CANVAS
  ========================================================= */

  const canvasRef = useRef(null);

  const levelRef = useRef(0);
  const targetRef = useRef(0);

  /*
   * Determine how many fields are filled.
   */

  const usernameFilled = formData.username.trim().length > 0;
  const dobFilled = formData.dob.length > 0;
  const emailFilled = formData.email.trim().length > 0;
  const passwordFilled = formData.password.length > 0;

  const filledCount = isLogin
    ? [usernameFilled, passwordFilled].filter(Boolean).length
    : [usernameFilled, dobFilled, emailFilled, passwordFilled].filter(Boolean)
        .length;

  /*
   * =========================================================
   * IMPORTANT:
   *
   * Registration:
   *
   * Username -> Green
   * DOB      -> White
   * Email    -> Orange
   * Password -> Orange rises further
   *
   *
   * Login:
   *
   * Username -> Green
   * Password -> White + Orange sequentially
   *
   * =========================================================
   */

  let targetLevel = 0;

  if (isLogin) {
    if (filledCount === 1) {
      targetLevel = 1;
    }

    if (filledCount === 2) {
      targetLevel = 3;
    }
  } else {
    targetLevel = Math.min(filledCount, 3);

    /*
     * When password is filled, let saffron rise higher
     * while retaining green and white.
     */
    if (passwordFilled) {
      targetLevel = 3.5;
    }
  }

  useEffect(() => {
    targetRef.current = targetLevel;
  }, [targetLevel]);

  const whiteWaveActive = targetLevel >= 2;

  /*
   * =========================================================
   * CANVAS ANIMATION
   * =========================================================
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame;
    let time = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const drawWave = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      time += 0.016;

      /*
       * Smoothly move the current wave level
       * towards the required level.
       */
      levelRef.current += (targetRef.current - levelRef.current) * 0.045;

      const level = levelRef.current;

      /*
       * Three equal colour bands.
       *
       * Green = 1 band
       * White = 1 band
       * Orange = 1 band
       *
       * They stack vertically.
       */

      const bandHeight = Math.min(height / 3, 190);

      /*
       * Wave definitions
       *
       * Index 0 = Green
       * Index 1 = White
       * Index 2 = Orange
       */

      const layers = [
        {
          color: "#138808",
          amplitude: 18,
          speed: 0.9,
          phase: 0,
        },
        {
          color: "#FFFFFF",
          amplitude: 18,
          speed: 0.85,
          phase: 1.5,
        },
        {
          color: "#FF9933",
          amplitude: 18,
          speed: 0.8,
          phase: 3,
        },
      ];

      /*
       * Draw orange first,
       * then white,
       * then green.
       *
       * This makes each new layer appear ABOVE
       * the previous layer.
       */

      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];

        /*
         * Determine whether this layer should exist.
         */

        const appear = Math.min(Math.max(level - i, 0), 1);

        if (appear <= 0.01) continue;

        /*
         * Starting position of this layer.
         *
         * i = 0 -> Green
         * i = 1 -> White
         * i = 2 -> Orange
         */

        /*
         * The top of the current band.
         *
         * As the level increases, each new colour
         * rises from exactly where the previous one ends.
         */

        const topY = height - (i + appear) * bandHeight;

        ctx.beginPath();

        ctx.moveTo(0, height);

        /*
         * Smooth moving wave.
         */

        for (let x = 0; x <= width; x += 4) {
          const normalizedX = x / width;

          const wave1 =
            Math.sin(
              normalizedX * Math.PI * 2.2 + time * layer.speed + layer.phase,
            ) *
            layer.amplitude *
            appear;

          const wave2 =
            Math.sin(
              normalizedX * Math.PI * 5.1 -
                time * layer.speed * 0.7 +
                layer.phase,
            ) *
            layer.amplitude *
            0.35 *
            appear;

          const y = topY + wave1 + wave2;

          ctx.lineTo(x, y);
        }

        /*
         * Complete the shape.
         */

        ctx.lineTo(width, height);

        ctx.lineTo(0, height);

        ctx.closePath();

        /*
         * Slight transparency gives the same
         * soft visual appearance.
         */

        ctx.globalAlpha = 0.96 * appear;

        ctx.fillStyle = layer.color;

        ctx.fill();

        ctx.globalAlpha = 1;
      }

      animationFrame = requestAnimationFrame(drawWave);
    };

    animationFrame = requestAnimationFrame(drawWave);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  /* =========================================================
     INPUT STYLES
  ========================================================= */

  const inputClass = `
    w-full
    h-14
    rounded-xl
    border
    px-4
    text-sm
    font-medium
    outline-none
    transition-all
    duration-300
    ${
      whiteWaveActive
        ? "border-white/30 bg-[#010b1d] text-white placeholder:text-white/60 focus:border-white focus:ring-2 focus:ring-white/20"
        : "border-black/20 bg-white text-[#0B1F52] placeholder:text-black/40 focus:border-[#0B1F52] focus:ring-2 focus:ring-[#0B1F52]/15"
    }
  `;

  const labelClass = `
    mb-2
    block
    text-xs
    font-semibold
    uppercase
    tracking-[0.15em]
    ${whiteWaveActive ? "text-black" : "text-white"}
  `;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010b1d] text-white">
      {/* =====================================================
          ANIMATED WAVE
      ====================================================== */}

      <canvas
        ref={canvasRef}
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          h-full
          w-full
        "
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[680px]">
          {/* =================================================
              BRAND
          ================================================== */}

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-[0.12em] text-white sm:text-4xl">
              SignToon
            </h1>

            <p className="mt-2 text-xs font-medium tracking-wide text-white/70 sm:text-sm">
              Learn • Practice • Communicate
            </p>
          </div>

          {/* =================================================
              LOGIN / SIGN UP SWITCH
          ================================================== */}

          <div className="mb-8 flex justify-center">
            <div className="flex rounded-full border border-white/15 bg-[#010b1d] p-1 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setMessage("");
                }}
                className={`
                  rounded-full
                  px-7
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    isLogin
                      ? "bg-[#42A5F5] text-black"
                      : "text-white hover:bg-white/5"
                  }
                `}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setMessage("");
                }}
                className={`
                  rounded-full
                  px-7
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    !isLogin
                      ? "bg-[#42A5F5] text-black"
                      : "text-white hover:bg-white/5"
                  }
                `}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* USERNAME */}

            <div>
              <label htmlFor="username" className={labelClass}>
                {isLogin ? "Username or Email" : "Username"}
              </label>

              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={
                  isLogin ? "Enter username or email" : "Choose a username"
                }
                required
                aria-invalid={Boolean(errors.username)}
                className={`${inputClass} ${
                  errors.username ? "border-red-500" : ""
                }`}
              />

              {errors.username && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.username}
                </p>
              )}
            </div>

            {/* DOB */}

            {!isLogin && (
              <div>
                <label htmlFor="dob" className={labelClass}>
                  Date of Birth
                </label>

                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.dob)}
                  className={`${inputClass} ${
                    errors.dob ? "border-red-500" : ""
                  }`}
                />

                {errors.dob && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.dob}
                  </p>
                )}
              </div>
            )}

            {/* EMAIL */}

            {!isLogin && (
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  className={`${inputClass} ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />

                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            )}

            {/* PASSWORD */}

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  aria-invalid={Boolean(errors.password)}
                  className={`${inputClass} pr-20 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#42A5F5]
                    transition
                    hover:text-blue-300
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* =================================================
                MESSAGE
            ================================================== */}

            {message && (
              <div
                className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
              "
              >
                <p className="text-sm text-white">{message}</p>
              </div>
            )}

            {/* =================================================
                SUBMIT BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                mx-auto
                block
                h-14
                w-[220px]
                rounded-xl
                bg-[#42A5F5]
                text-sm
                font-bold
                uppercase
                tracking-[0.18em]
                text-black
                transition-all
                duration-300
                hover:bg-[#64B5F6]
                hover:shadow-lg
                hover:shadow-[#42A5F5]/20
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          {/* =================================================
              LOGIN / SIGNUP SWITCH
          ================================================== */}

          <p className="mt-7 text-center text-sm text-white/70">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="ml-2 font-semibold text-white transition hover:text-white/70"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </main>

      {dashboardLoading && (
        <div className="dashboard-loading" role="status" aria-live="polite">
          <div className="dashboard-loading-card">
            <span className="dashboard-loading-kicker">NAMASTE!</span>
            <h2>Getting your learning space ready</h2>
            <div className="dashboard-loading-spinner" aria-hidden="true" />
            <p>Shinchan is waiting for you...</p>
          </div>
        </div>
      )}
    </div>
  );
}
