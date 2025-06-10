import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import MainApp from "./MainApp";

export default function App() {
  return (
    <Router basename="/optima-official-site">
      <Routes>
        <Route path="/verify" element={<EmailVerifyPage />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}
