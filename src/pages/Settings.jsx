// src/pages/Settings.jsx
import { Button, Card, Form, message, Select, Space, Spin, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, updateSettings } from '../services/userApi'; // API à créer / adapter

const { Option } = Select;

export default function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await getSettings();
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error(error);
        message.error('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await updateSettings(values);
      message.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spin tip="Chargement..." style={{ marginTop: 100, display: 'block' }} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 24 }}>
      <Card title="Paramètres personnels" bordered>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email_notifications"
            label="Recevoir les notifications par email"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="theme"
            label="Thème"
            rules={[{ required: true, message: 'Veuillez choisir un thème' }]}
          >
            <Select>
              <Option value="light">Clair</Option>
              <Option value="dark">Sombre</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                Enregistrer
              </Button>
              <Button onClick={() => navigate(-1)}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
