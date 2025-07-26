import { Card, Col, Divider, Row, Statistic } from 'antd';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function Dashboard() {
  // Constantes statiques à la place des useState
  const stats = {
    totalUsers: 100,
    totalClients: 65,
    totalTechniciens: 25,
    totalAdmins: 10,
    totalInstallations: 34,
    revenue: 15000,
  };

  const revenueData = [
    { month: 'Janvier', amount: 12000 },
    { month: 'Février', amount: 25000 },
    { month: 'Mars', amount: 18000 },
    { month: 'Avril', amount: 40000 },
    { month: 'Mai', amount: 35000 },
    { month: 'Juin', amount: 45000 },
  ];

  const installationsData = [
    { month: 'Janvier', installations: 5 },
    { month: 'Février', installations: 8 },
    { month: 'Mars', installations: 3 },
    { month: 'Avril', installations: 10 },
    { month: 'Mai', installations: 4 },
    { month: 'Juin', installations: 12 },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Tableau de bord</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Utilisateurs totaux" value={stats.totalUsers} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Clients" value={stats.totalClients} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Techniciens" value={stats.totalTechniciens} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Administrateurs" value={stats.totalAdmins} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Installations" value={stats.totalInstallations} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Revenu"
              value={stats.revenue}
              suffix="FCFA"
              valueStyle={{ color: '#3f8600' , fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Évolution du revenu mensuel" bordered={false} style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Line type="monotone" dataKey="amount" stroke="#1890ff" strokeWidth={2} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} FCFA`} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Installations par mois" bordered={false} style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={installationsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="installations" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
