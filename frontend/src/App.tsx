import "./App.css";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import MangasPage from "./pages/MangasPage";
import GamesPage from "./pages/GamesPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import MangaDetailPage from "./pages/MangaDetailPage";
import GameDetailPage from "./pages/GameDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import ProtectedRoute from "./features/auth/routes/ProtectedRoute";
import GuestRoute from "./features/auth/routes/GuestRoute";
import Navbar from "./shared/components/Navbar";
import AppShell from "./shared/layouts/AppShell";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes Protégées avec AppShell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate replace to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="mangas" element={<MangasPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="manga/:id" element={<MangaDetailPage />} />
              <Route path="game/:id" element={<GameDetailPage />} />
            </Route>
          </Route>

          {/* Routes Guests avec Navbar classique */}
          <Route element={<GuestRoute />}>
            <Route
              element={
                <>
                  <Navbar />
                  <main className="pt-16">
                    <Outlet />
                  </main>
                </>
              }
            >
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
