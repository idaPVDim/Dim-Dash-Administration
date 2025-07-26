import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
// Users
import Clients from './pages/users/Clients';
import Techniciens from './pages/users/Techniciens';
import UserList from './pages/users/UserList';
// Products
import Caracteristiques from './pages/products/Caracteristiques';
import Categories from './pages/products/Categories';
import EquipementAdd from './pages/products/EquipementAdd';
import Equipements from './pages/products/Equipements';
import EquipementUpdate from './pages/products/EquipementUpdate';
import EquipementView from './pages/products/EquipementView';
import Marques from './pages/products/Marques';
// Installations
import Acceptes from './pages/installations/Acceptes';
import Devis from './pages/installations/Devis';
import InstallationList from './pages/installations/InstallationList';
import Propositions from './pages/installations/Propositions';
import UserAdd from './pages/users/UserAdd';
import UserDetail from './pages/users/UserDetail';
import UserEdit from './pages/users/UserEdit';
// Maintenance
import Incidents from './pages/maintenance/Incidents';
import Interventions from './pages/maintenance/Interventions';
import QuestionsMaintenance from './pages/maintenance/QuestionsMaintenance';
import ProfileUpdate from './pages/ProfileUpdate';
// Autres pages
 
import Parametres from './pages/Parametres';
import Statistiques from './pages/Statistiques';

// Composant pour protéger les routes privées
function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique: page login accessible à la racine */}
        <Route path="/" element={<Login />} />

        {/* Routes privées protégées sous /dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  {/* Dashboard */}
                  <Route index element={<Dashboard />} />

                  {/* Users */}
                  <Route path="users/list" element={<UserList />} />
                  <Route path="users/clients" element={<Clients />} />
                  <Route path="users/techniciens" element={<Techniciens />} />
                 <Route path="users/:id" element={<UserDetail />} />
                <Route path="users/:id/edit" element={<UserEdit />} />
                <Route path="users/add" element={<UserAdd />} />
                  {/* Products */}
                  <Route path="equipements" element={<Equipements />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="marques" element={<Marques />} />
                    <Route path="equipements/add" element={<EquipementAdd />} />
                  <Route path="equipements/:id" element={<EquipementView />} />
   <Route path="/profile/update" element={<ProfileUpdate />} />
        {/* Route vers la page de modification d'un équipement */}
        <Route path="equipements/:id/edit" element={<EquipementUpdate />} />
                  <Route path="caracteristiques" element={<Caracteristiques />} />

                  {/* Installations */}
                  <Route path="installations/list" element={<InstallationList />} />
                  <Route path="installations/propositions" element={<Propositions />} />
                  <Route path="installations/acceptées" element={<Acceptes />} />
                  <Route path="devis" element={<Devis />} />

                  {/* Maintenance */}
                  <Route path="maintenance/interventions" element={<Interventions />} />
                  <Route path="incidents/list" element={<Incidents />} />
                  <Route path="questions-maintenance" element={<QuestionsMaintenance />} />

                  {/* Autres */}
                  <Route path="statistiques" element={<Statistiques />} />
                  <Route path="parametres" element={<Parametres />} />

  <Route path="/profile" element={<Profile />} />
  <Route path="/settings" element={<Settings />} />
                  {/* Redirection par défaut si sous-chemin inconnu sous /dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Redirection globale si route non trouvée */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
