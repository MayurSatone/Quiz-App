import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/Dashboard";
import AuthWrapper from "./components/AuthWrapper";
import Home from "./pages/Home";
import Quizes from "./pages/Quizes";
import Quiz from "./pages/Quiz";
import AdminHero from "./pages/admin/AdminHero";
import CreateQuiz from "./pages/admin/CreateQuiz";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminHero/>} />
        <Route element={<AuthWrapper />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="quizes" element={<Quizes />} />
            <Route path="admin" element={<AdminHero/>} />
            <Route path="create-quiz" element={<CreateQuiz/>} />
          </Route>
          {/* Moved Quiz route here - not nested under Dashboard */}
          <Route path="/quiz/:id" element={<Quiz />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;