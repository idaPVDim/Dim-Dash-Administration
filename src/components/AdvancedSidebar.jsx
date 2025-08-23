import {
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  HomeOutlined,
  SettingOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function AdvancedSidebar({ collapsed, onCollapse }) {
  const location = useLocation();

  // Déterminer le(s) sous-menu(s) ouvert(s) par défaut selon le path
  const getDefaultOpenKeys = (pathname) => {
    if (pathname.startsWith('/dashboard/users')) return ['users'];
    if (pathname.startsWith('/dashboard/produits')) return ['produits'];
    if (pathname.startsWith('/dashboard/installations')) return ['installations'];
    if (pathname.startsWith('/dashboard/maintenance')) return ['maintenance'];
    if (pathname.startsWith('/dashboard/statistiques')) return ['statistiques'];
    if (pathname.startsWith('/dashboard/parametres')) return ['parametres'];
    // Par défaut rien
    return [];
  };

  // Utiliser un useState contrôlé pour openKeys afin d’éviter des problèmes avec defaultOpenKeys
  const [openKeys, setOpenKeys] = useState(getDefaultOpenKeys(location.pathname));

  // Synchroniser openKeys si l'utilisateur navigue vers une autre url (update openKeys si besoin)
  useEffect(() => {
    const keys = getDefaultOpenKeys(location.pathname);
    setOpenKeys(keys);
  }, [location.pathname]);

  // Limitation pour que 1 seul submenu soit ouvert à la fois (optionnel)
  const onOpenChange = (keys) => {
    // Garder seulement le dernier submenu ouvert pour éviter trop de sous menus ouverts
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={280}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
        backgroundColor: '#001529',
      }}
    >
      <div
        className="logo"
        style={{
          height: 64,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
          textAlign: 'center',
          lineHeight: '64px',
          userSelect: 'none',
        }}
      >
        {collapsed ? 'Dim+' : 'Dim+ Dashboard'}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Tableau de bord</Link>
        </Menu.Item>

        <SubMenu key="users" icon={<UserOutlined />} title="Utilisateurs">
          <Menu.Item key="/dashboard/users/list">
            <Link to="/dashboard/users/list">Tous les utilisateurs</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/users/clients">
            <Link to="/dashboard/users/clients">Stats utilisateurs</Link>
          </Menu.Item>
         
        </SubMenu>

        <SubMenu key="produits" icon={<AppstoreOutlined />} title="Équipements & Produits">
          <Menu.Item key="/dashboard/equipements">
            <Link to="/dashboard/equipements">Liste des équipements</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/categories">
            <Link to="/dashboard/categories">Catégories & Marques</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="installations" icon={<HomeOutlined />} title="Installations">
          <Menu.Item key="/dashboard/installations/list">
            <Link to="/dashboard/installations/list">Toutes les installations</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/installations/propositions">
            <Link to="/dashboard/installations/propositions">Propositions à traiter</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/installations/acceptées">
            <Link to="/dashboard/installations/acceptées">Installations acceptées</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/devis">
            <Link to="/dashboard/devis">Devis & Comparaisons</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="maintenance" icon={<ToolOutlined />} title="Maintenance & Incidents">
          <Menu.Item key="/dashboard/maintenance/interventions">
            <Link to="/dashboard/maintenance/interventions">Interventions</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/incidents/list">
            <Link to="/dashboard/incidents/list">Incidents signalés</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/questions-maintenance">
            <Link to="/dashboard/questions-maintenance">Questions de diagnostic</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="/dashboard/statistiques" icon={<BarChartOutlined />}>
          <Link to="/dashboard/statistiques">Statistiques</Link>
        </Menu.Item>

        <Menu.Item key="/dashboard/parametres" icon={<SettingOutlined />}>
          <Link to="/dashboard/parametres">Paramètres</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
