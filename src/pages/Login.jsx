import { Alert, Button, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/userApi';

const { Title } = Typography;

function parseError(error) {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (error.detail) return error.detail;
  if (typeof error === 'object') return Object.values(error).flat().join(' ');
  return 'Erreur inconnue';
}

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const onFinish = async (values) => {
  setError(null);
  setLoading(true);
  try {
    const response = await login({
      email: values.email,
      password: values.password,
    });

    console.log('Login response:', response.data);

    const token = response.data.token || response.data.access || response.data.auth_token;

    if (!token) {
      throw new Error('Token non reçu');
    }

    localStorage.setItem('authToken', token);

    navigate('/dashboard'); // Assurez-vous que cette route existe et affiche le dashboard
  } catch (err) {
    const msg = parseError(err.response?.data);
    setError(msg || 'Erreur de connexion');
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        maxWidth: 400,
        margin: '6rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Connexion
      </Title>

      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 20 }}
        />
      )}

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          label="Adresse email"
          name="email"
          rules={[
            { required: true, message: 'Veuillez saisir votre email' },
            { type: 'email', message: 'Format d’email invalide' },
          ]}
        >
          <Input placeholder="exemple@domain.com" />
        </Form.Item>

        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
