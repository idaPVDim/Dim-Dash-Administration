import { Breadcrumb, Button, Card, Col, Form, Input, message, Row, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProfile } from '../services/userApi';

export default function Profile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await getMyProfile();
        const user = response.data;
        form.setFieldsValue({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          role: user.role,
        });
      } catch (error) {
        console.error(error);
        message.error('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [form]);

  if (loading) {
    return <Spin tip="Chargement..." style={{ marginTop: 100, display: 'block' }} />;
  }

  const colSpan = 12;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/users/list">Liste utilisateurs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Mon Profil</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Mon Profil" bordered>
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={16}>
            <Col span={colSpan}>
              <Form.Item label="Prénom" name="first_name">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Nom" name="last_name">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Numéro de téléphone" name="phone_number">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Rôle" name="role">
                <Input disabled />
              </Form.Item>
            </Col>

            {/* Vous pouvez cacher ou afficher password si vous voulez, ici on ne l’affiche pas */}
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" onClick={() => navigate('/dashboard/profile/update')}>
                Modifier mon profil
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
