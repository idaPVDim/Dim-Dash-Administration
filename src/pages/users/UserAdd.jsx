import {
    Breadcrumb,
    Button,
    Form,
    Input,
    message,
    Select,
    Space,
    Spin,
} from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ROLE_LABELS = {
  client: 'Client',
  technicien: 'Technicien',
  admin: 'Administrateur',
};

export default function UserAdd() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const onFinish = async (values) => {
    setSaving(true);

    try {
      if (values.password !== values.password2) {
        message.error('Les mots de passe ne correspondent pas');
        setSaving(false);
        return;
      }

      const payload = {
        email: values.email,
        password: values.password,
        password2: values.password2,
        role: values.role,
        phone_number: values.phone_number || '',
      };

      await axios.post('http://127.0.0.1:8000/user/api/register/', payload);

      message.success('Utilisateur créé avec succès');
      navigate('/dashboard/users/list');
    } catch (error) {
      console.error(error);
      const detail =
        error.response?.data?.detail ||
        (error.response?.data && JSON.stringify(error.response.data)) ||
        error.message ||
        'Erreur inconnue';
      message.error(`Erreur lors de la création : ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a href="/dashboard/users/list">Utilisateurs</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Créer un utilisateur</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Créer un nouvel utilisateur</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        scrollToFirstError
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Veuillez saisir l\'email' },
            { type: 'email', message: "L'email est invalide" },
          ]}
        >
          <Input placeholder="Adresse email" />
        </Form.Item>

        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            { required: true, message: 'Veuillez saisir un mot de passe' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Mot de passe" />
        </Form.Item>

        <Form.Item
          label="Confirmer le mot de passe"
          name="password2"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Veuillez confirmer le mot de passe' },
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
          <Input.Password placeholder="Confirmer le mot de passe" />
        </Form.Item>

        <Form.Item
          label="Rôle"
          name="role"
          initialValue="client"
          rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
        >
          <Select placeholder="Sélectionnez un rôle">
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <Option key={key} value={key}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Téléphone" name="phone_number">
          <Input placeholder="Numéro de téléphone (optionnel)" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Créer
            </Button>
            <Button htmlType="button" onClick={() => navigate('/dashboard/users/list')}>
              Annuler
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Optionnel : un spinner quand on sauvegarde */}
      {saving && <Spin tip="Enregistrement..." style={{ marginTop: 16 }} />}
    </div>
  );
}
