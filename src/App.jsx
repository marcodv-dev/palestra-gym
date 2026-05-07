import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/dashboard.jsx";
import Train from "./pages/train.jsx";
import AddExercise from "./pages/addExercise.jsx";
import ModExercise from "./pages/modExercise.jsx";
import ViewTrain from "./pages/view.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import { useState, useEffect } from "react";
import { isAuthenticated } from "./db.js";

function AnimatedRoutes() {
  const location = useLocation();
  const [page, setPage] = useState('training');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={isAuthenticated() ? <Dashboard page={page} setPage={(p) => setPage(p)} /> : <Navigate to="/login" replace />} />
        <Route path="/train" element={isAuthenticated() ? <Train /> : <Navigate to="/login" replace />} />
        <Route path="/addExercise" element={isAuthenticated() ? <AddExercise /> : <Navigate to="/login" replace />} />
        <Route path="/modExercise" element={isAuthenticated() ? <ModExercise /> : <Navigate to="/login" replace />} />
        <Route path="/view" element={isAuthenticated() ? <ViewTrain /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={200}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        theme={isDark ? "dark" : "light"}
      />
    </>
  );
}

export default App;
