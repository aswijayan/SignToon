import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";

import Dashboard from "./pages/Dashboard";
import AlphabetLearning from "./pages/AlphabetLearning";
import NumberLearning from "./pages/NumberLearning";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Auth />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn/alphabet" element={<AlphabetLearning />} />
        <Route path="/learn/numbers" element={<NumberLearning />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
