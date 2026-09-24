import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Historia } from './pages/Historia';
import { Catalogo } from './pages/Catalogo/Catalogo';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ContentDetail } from './pages/ContentDetail/ContentDetail';
import { TABLE_NAMES } from './types/content';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock" element={<Catalogo />} />
            <Route path="/historia" element={<Historia />} />
            {TABLE_NAMES.flatMap((table) => [
              // Bare category URLs (/usados, /motos, /utilitarios) land on the
              // filtered stock page.
              <Route key={table} path={`/${table}`} element={<Navigate to={`/stock?tipo=${table}`} replace />} />,
              // Keyed by table so moving between categories remounts the page
              // (its hooks seed state from `table` only on mount).
              <Route key={`${table}-detail`} path={`/${table}/:id`} element={<ContentDetail key={table} table={table} />} />,
            ])}
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
