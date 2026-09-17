import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Historia } from './pages/Historia';
import { Cursos } from './pages/Cursos';
import { Eventos } from './pages/Eventos';
import { Noticias } from './pages/Noticias';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ContentDetail } from './pages/ContentDetail/ContentDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/cursos/:id" element={<ContentDetail table="courses" />} />
            <Route path="/eventos/:id" element={<ContentDetail table="events" />} />
            <Route path="/noticias/:id" element={<ContentDetail table="news" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
