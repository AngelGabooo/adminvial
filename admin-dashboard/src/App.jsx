import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminMap } from './pages/AdminMap';
import { HeatmapPage } from './pages/HeatmapPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { ReportsList } from './pages/ReportsList';
import { ReportDetail } from './pages/ReportDetail';
import { UserManagement } from './pages/UserManagement';
import { ReportModeration } from './pages/ReportModeration';
import { ExportData } from './pages/ExportData';
import { AdminProfile } from './pages/AdminProfile';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta de login - SIN sidebar */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas - CON sidebar y layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/mapa" element={
            <ProtectedRoute>
              <AppLayout>
                <AdminMap />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/heatmap" element={
            <ProtectedRoute>
              <AppLayout>
                <HeatmapPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/estadisticas" element={
            <ProtectedRoute>
              <AppLayout>
                <StatisticsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/reportes" element={
            <ProtectedRoute>
              <AppLayout>
                <ReportsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/reportes/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <ReportDetail />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout>
                <UserManagement />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/moderacion" element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout>
                <ReportModeration />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/exportar" element={
            <ProtectedRoute>
              <AppLayout>
                <ExportData />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <AppLayout>
                <AdminProfile />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/configuracion" element={
            <ProtectedRoute>
              <AppLayout>
                <AdminProfile />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ayuda" element={
            <ProtectedRoute>
              <AppLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Ayuda</h1>
                  <p className="text-gray-600 mt-2">Página de ayuda en construcción...</p>
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;