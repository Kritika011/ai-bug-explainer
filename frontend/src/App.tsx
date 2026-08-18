import { useState } from "react";
import axios from "axios";
import "./App.css";

interface BugResult {
  problem: string;
  cause: string;
  solution: string;
  fixed_code: string;
  prevention: string;
  time_complexity: string;
  space_complexity: string;
}

function App() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<BugResult | null>(null);
  const [loading, setLoading] = useState(false);

  const explainBug = async () => {
    if (!code.trim() || !error.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post<BugResult>(
        "http://127.0.0.1:8000/explain",
        {
          language,
          code,
          error,
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Unable to connect to the AI backend.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setCode("");
    setError("");
    setResult(null);
  };

  const loadExample = () => {
    setLanguage("Python");
    setCode(`arr = [1, 2, 3]

for i in range(len):
    print(arr[i])`);

    setError(
      "TypeError: 'builtin_function_or_method' object cannot be interpreted as an integer"
    );
  };

  const copyCode = async () => {
    if (!result?.fixed_code) return;

    await navigator.clipboard.writeText(result.fixed_code);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">🐛</div>

          <div>
            <div className="brand-name">Bug<span>AI</span></div>
            <div className="brand-subtitle">AI Bug Explainer</div>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          Gemini AI Online
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span>✦</span> AI-POWERED DEBUGGING
        </div>

        <h1>
          Debug smarter.
          <br />
          <span>Understand faster.</span>
        </h1>

        <p>
          Paste your code and error message. Get an AI-powered explanation,
          solution, corrected code, and complexity analysis.
        </p>
      </section>

      {/* MAIN */}
      <main className="workspace">
        {/* INPUT PANEL */}
        <section className="panel input-panel">
          <div className="panel-header">
            <div>
              <span className="panel-number">01</span>
              <h2>Submit your bug</h2>
            </div>

            <button className="example-btn" onClick={loadExample}>
              Try Example
            </button>
          </div>

          {/* LANGUAGE */}
          <div className="field">
            <label htmlFor="language">LANGUAGE</label>

            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Java</option>
              <option>C++</option>
            </select>
          </div>

          {/* CODE */}
          <div className="field">
            <div className="field-label-row">
              <label htmlFor="code">YOUR CODE</label>
              <span>{code.length} characters</span>
            </div>

            <div className="editor">
              <div className="editor-top">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="file-name">
                  main.{language === "Python" ? "py" : "code"}
                </div>
              </div>

              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your ${language} code here...`}
                spellCheck={false}
              />
            </div>
          </div>

          {/* ERROR */}
          <div className="field">
            <div className="field-label-row">
              <label htmlFor="error">ERROR MESSAGE</label>
              <span>Required</span>
            </div>

            <textarea
              id="error"
              className="error-input"
              value={error}
              onChange={(e) => setError(e.target.value)}
              placeholder="Paste the error message you received..."
              spellCheck={false}
            />
          </div>

          {/* ACTIONS */}
          <div className="actions">
            <button
              className="analyze-btn"
              onClick={explainBug}
              disabled={loading || !code.trim() || !error.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Explain My Bug
                  <span className="arrow">→</span>
                </>
              )}
            </button>

            <button className="clear-btn" onClick={clearAll}>
              Clear
            </button>
          </div>
        </section>

        {/* RESULT PANEL */}
        <section className="panel result-panel">
          <div className="panel-header">
            <div>
              <span className="panel-number">02</span>
              <h2>AI diagnosis</h2>
            </div>

            {result && <div className="success-badge">✓ Analysis complete</div>}
          </div>

          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">⌁</div>

              <h3>Your diagnosis will appear here</h3>

              <p>
                Submit a code snippet and its error message to receive a
                detailed AI-powered analysis.
              </p>

              <div className="empty-features">
                <span>✦ Root cause</span>
                <span>✓ Fixed code</span>
                <span>⚡ Complexity</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="ai-loader">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <h3>Analyzing your bug...</h3>

              <p>
                Gemini is examining your code and generating a solution.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="results">
              {/* PROBLEM */}
              <article className="result-card problem-card">
                <div className="result-icon">!</div>

                <div>
                  <div className="result-label">PROBLEM</div>
                  <h3>What went wrong?</h3>
                  <p>{result.problem}</p>
                </div>
              </article>

              {/* CAUSE */}
              <article className="result-card">
                <div className="result-icon blue">⌁</div>

                <div>
                  <div className="result-label">ROOT CAUSE</div>
                  <h3>Why it happened</h3>
                  <p>{result.cause}</p>
                </div>
              </article>

              {/* SOLUTION */}
              <article className="result-card">
                <div className="result-icon green">✓</div>

                <div>
                  <div className="result-label">SOLUTION</div>
                  <h3>How to fix it</h3>
                  <p>{result.solution}</p>
                </div>
              </article>

              {/* CODE */}
              <article className="result-card code-card">
                <div className="code-result-header">
                  <div>
                    <div className="result-label">CORRECTED CODE</div>
                    <h3>Ready to use</h3>
                  </div>

                  <button onClick={copyCode} className="copy-btn">
                    ⧉ Copy
                  </button>
                </div>

                <pre>
                  <code>{result.fixed_code}</code>
                </pre>
              </article>

              {/* PREVENTION */}
              <article className="result-card">
                <div className="result-icon purple">◇</div>

                <div>
                  <div className="result-label">PREVENTION</div>
                  <h3>Avoid this next time</h3>
                  <p>{result.prevention}</p>
                </div>
              </article>

              {/* COMPLEXITY */}
              <div className="complexity-grid">
                <article className="complexity-card">
                  <span className="complexity-icon">◷</span>
                  <div>
                    <span>TIME COMPLEXITY</span>
                    <strong>{result.time_complexity}</strong>
                  </div>
                </article>

                <article className="complexity-card">
                  <span className="complexity-icon">▱</span>
                  <div>
                    <span>SPACE COMPLEXITY</span>
                    <strong>{result.space_complexity}</strong>
                  </div>
                </article>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>BugAI</span>
        <span>Built with React · FastAPI · Gemini</span>
      </footer>
    </div>
  );
}

export default App;