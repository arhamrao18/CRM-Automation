import ContactPage from "./pages/ContactPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;