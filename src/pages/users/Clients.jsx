import { Column, Pie } from '@ant-design/charts';
import { ClockCircleOutlined, SafetyCertificateOutlined, TeamOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Statistic, Table } from 'antd';

export default function StaticStats() {
  // Données statiques
  const totalUsers = 150;
  const totalClients = 100;
  const totalTechnicians = 30;
  const totalAdmins = 15;
  const totalInactive = 5;

  const usersByRole = [
    { type: 'Client', value: 100 },
    { type: 'Technicien', value: 30 },
    { type: 'Admin', value: 15 },
    { type: 'Inactif', value: 5 },
     { type: 'actif', value: 5 },
  ];

  const recentRegistrations = [
    { date: '2025-07-20', count: 5 },
    { date: '2025-07-21', count: 8 },
    { date: '2025-07-22', count: 7 },
    { date: '2025-07-23', count: 10 },
    { date: '2025-07-24', count: 6 },
  ];

  const recentUsers = [
    { key: 1, name: 'Alice Dupont', email: 'alice@example.com', role: 'Client', joined: '2025-07-20' },
    { key: 2, name: 'Bob Martin', email: 'bob@example.com', role: 'Technicien', joined: '2025-07-19' },
    { key: 3, name: 'Claire Bernard', email: 'claire@example.com', role: 'Client', joined: '2025-07-18' },
    { key: 4, name: 'David Petit', email: 'david@example.com', role: 'Admin', joined: '2025-07-17' },
    { key: 5, name: 'Emma Roche', email: 'emma@example.com', role: 'Client', joined: '2025-07-16' },
  ];

  // Configuration graphique camembert
  const pieConfig = {
    data: usersByRole,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // Configuration graphique colonnes
  const columnConfig = {
    data: recentRegistrations,
    xField: 'date',
    yField: 'count',
    label: {
      position: 'middle',
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
    meta: {
      date: { alias: 'Date' },
      count: { alias: 'Nouveaux utilisateurs' },
    },
    interactions: [{ type: 'active-region' }],
  };

  // Colonnes du tableau utilisateurs récents
  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Rôle', dataIndex: 'role', key: 'role' },
    { title: 'Date d\'inscription', dataIndex: 'joined', key: 'joined' },
  ];

  return (
    <div style={{ maxWidth: "100%", margin:  'auto', padding: 24 }}>
      {/* Cartes statistiques */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col span={4}>
          <Card>
            <Statistic title="Total utilisateurs" value={totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Clients" value={totalClients} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Techniciens" value={totalTechnicians} prefix={<ToolOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Admins" value={totalAdmins} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Utilisateurs inactifs" value={totalInactive} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
         <Col span={4}>
          <Card>
            <Statistic title="Utilisateurs actifs" value={totalInactive} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Divider>Répartition des utilisateurs par rôle</Divider>
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col span={12}>
          <Card>
            <Pie {...pieConfig} />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <h3>Inscriptions récentes</h3>
            <Column {...columnConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Divider>Derniers utilisateurs inscrits</Divider>
      <Card>
        <Table columns={columns} dataSource={recentUsers} pagination={false} />
      </Card>
    </div>
  );
}
