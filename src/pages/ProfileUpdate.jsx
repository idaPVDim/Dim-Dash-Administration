// src/pages/ProfileUpdate.jsx
import { Breadcrumb, Button, Card, Col, Form, Input, message, Row, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../services/userApi';

export default function ProfileUpdate() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const onFinish = async (values) => {
    setSaving(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { role: _role, password, confirm, ...updateData } = values;
      if (password) {
        if (password !== confirm) {
          message.error('Les mots de passe ne correspondent pas');
          setSaving(false);
          return;
        }
        updateData.password = password;
      }
      await updateMyProfile(updateData);
      message.success('Profil mis à jour avec succès');
      navigate('/dashboard/users/list'); // Réoriente vers la liste des utilisateurs
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

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
        <Breadcrumb.Item>Modifier Profil</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Modifier le profil" bordered>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={colSpan}>
              <Form.Item
                label="Prénom"
                name="first_name"
                rules={[{ required: true, message: 'Veuillez saisir votre prénom' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                label="Nom"
                name="last_name"
                rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Veuillez saisir votre email' },
                  { type: 'email', message: 'Email invalide' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Numéro de téléphone" name="phone_number">
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Rôle" name="role">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                label="Mot de passe"
                name="password"
                hasFeedback
                rules={[
                  {
                    min: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères',
                  },
                ]}
                extra="Laissez vide pour ne pas changer"
              >
                <Input.Password placeholder="Nouveau mot de passe" />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                label="Confirmer le mot de passe"
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirmez le nouveau mot de passe" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                Enregistrer
              </Button>
              <Button onClick={() => navigate(-1)}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
