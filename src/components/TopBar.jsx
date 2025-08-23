import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Input, Layout, Menu, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../services/userApi'; // Exemple service API à créer

const { Header } = Layout;

export default function TopBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin' }); // default value
  const [loading, setLoading] = useState(true);

  // Récupérer le profil utilisateur au chargement
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await getProfile();
        setUser({
          name: response.data.name || response.data.username || 'Utilisateur',
          avatarUrl: response.data.avatar || null, // si vous avez une url avatar
          email: response.data.email || '',
        });
      } catch (error) {
        console.error('Erreur chargement profil', error);
        message.error('Impossible de récupérer le profil utilisateur');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Gestion déconnexion
  const handleLogout = async () => {
    try {
      await logout(); // APi logout côté backend (nettoyage token)
      localStorage.removeItem('authToken'); // ou autre stockage de token
      message.success('Vous êtes déconnecté');
      navigate('/login'); // redirection vers login
    } catch (error) {
      console.error('Erreur déconnexion', error);
      message.error('Erreur lors de la déconnexion');
    }
  };

  const userMenu = (
  <Menu>
    <Menu.Item key="profile" icon={<UserOutlined />}>
      <Link to="/dashboard/profile">Profil</Link>
    </Menu.Item>
    <Menu.Item key="settings" icon={<SettingOutlined />}>
      <Link to="/dashboard/settings">Paramètres</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
      Déconnexion
    </Menu.Item>
  </Menu>
  );

  const notificationMenu = (
    <Menu>
      <Menu.Item key="1">Nouvelle demande client</Menu.Item>
      <Menu.Item key="2">Intervention programmée</Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 0 10px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        zIndex: 1,
      }}
    >
      {/* Logo / Titre */}
      <div style={{ fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>
      Dim+ Admin
      </div>
      {/* Barre de recherche + actions */}
      <Space size="large" align="center">
        <Input
          placeholder="Recherche rapide..."
          prefix={<SearchOutlined />}
          style={{ width: 200, borderRadius: 4 }}
          disabled={loading}
        />

        <Dropdown overlay={notificationMenu} trigger={['click']}>
          <Badge count={3}>
            <Button icon={<BellOutlined />} type="text" />
          </Badge>
        </Dropdown>

        {/* Menu utilisateur avec avatar et nom dynamique */}
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              style={{ backgroundColor: '#1677ff' }}
              icon={!user.avatarUrl ? <UserOutlined /> : null}
              src={user.avatarUrl || undefined}
              alt="avatar"
            />
            <span style={{ color: '#333', fontWeight: 500 }}>
              {loading ? 'Chargement...' : user.name}
            </span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
