import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage";
import SingleMovie from "./components/SingleMovie";

function App() {
  return (
    // Usamos HashRouter para máxima compatibilidad con GitHub Pages (evita errores 404 al recargar rutas profundas)
    <HashRouter>
      <div className="app-layout">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movies/:id" element={<SingleMovie />} />
          {/* Redirección de rutas desconocidas a inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;