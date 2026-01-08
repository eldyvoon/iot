import { useState } from "react";
import RunningClock from "./components/RunningClock";
import UserList from "./components/UserList";
import { solution } from "./utils/isCycle";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"clock" | "cycle" | "users">(
    "clock"
  );

  // Test cases for IsCycle
  const cycleTests = [
    { A: [3, 1, 2], B: [2, 3, 1], expected: true },
    { A: [1, 2, 1], B: [2, 3, 3], expected: false },
    { A: [1, 2, 3, 4], B: [2, 1, 4, 4], expected: false },
    { A: [1, 2, 3, 4], B: [2, 1, 4, 3], expected: false },
    { A: [1, 3, 2, 4], B: [4, 1, 3, 2], expected: true },
  ];

  return (
    <div className="app">
      <nav className="tabs">
        <button
          className={activeTab === "clock" ? "active" : ""}
          onClick={() => setActiveTab("clock")}
        >
          Task 1: Running Clock
        </button>
        <button
          className={activeTab === "cycle" ? "active" : ""}
          onClick={() => setActiveTab("cycle")}
        >
          Task 2: IsCycle Check
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Task 3: UserList (Optimized)
        </button>
      </nav>

      <main className="content">
        {activeTab === "clock" && (
          <section>
            <h2>Running Clock - Countdown Timer</h2>
            <RunningClock />
          </section>
        )}

        {activeTab === "cycle" && (
          <section>
            <h2>IsCycle Check - Graph Algorithm</h2>
            <p>Testing if directed graphs form a single cycle:</p>
            <table>
              <thead>
                <tr>
                  <th>A (Sources)</th>
                  <th>B (Destinations)</th>
                  <th>Expected</th>
                  <th>Result</th>
                  <th>Pass</th>
                </tr>
              </thead>
              <tbody>
                {cycleTests.map((test, index) => {
                  const result = solution(test.A, test.B);
                  const pass = result === test.expected;
                  return (
                    <tr key={index}>
                      <td>[{test.A.join(", ")}]</td>
                      <td>[{test.B.join(", ")}]</td>
                      <td>{test.expected.toString()}</td>
                      <td>{result.toString()}</td>
                      <td style={{ color: pass ? "green" : "red" }}>
                        {pass ? "✓" : "✗"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "users" && (
          <section>
            <h2>UserList - Performance Optimized</h2>
            <UserList />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
