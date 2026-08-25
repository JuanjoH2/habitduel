import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Arena from "./pages/Arena";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arena/:userId" element={<Arena />} />
      </Routes>
    </Router>
  );
}
