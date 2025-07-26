import { Layout } from 'antd';
import { useState } from 'react';
import AdvancedSidebar from '../components/AdvancedSidebar';
import TopBar from '../components/TopBar';

const { Content } = Layout;

export default function LayoutDashboard({ children }) {
  // State pour sidebar ouvert ou fermé
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Largeur sidebar fermée / ouverte (doit être en cohérence avec AdvancedSidebar)
  const sidebarWidth = sidebarCollapsed ? 80 : 280; // ou autre valeur selon votre CSS

  return (
    <Layout>
      {/* On transmet le state et la fonction de toggle au sidebar pour qu'il puisse le détécter et modifier */}
      <AdvancedSidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <Layout style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.3s' }}>
        {/* On transmet le state au TopBar pour qu'il adapte son style */}
        <TopBar collapsed={sidebarCollapsed} />

        <Content
          style={{
            margin: 16,
            padding: 24,
            background: '#fff',
            minHeight: 360,
            transition: 'margin-left 0.3s, padding 0.3s',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
