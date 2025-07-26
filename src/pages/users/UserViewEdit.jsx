import { Alert, Breadcrumb, Button, Descriptions, Divider, Form, Input, Select, Space, Spin, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getClientProfile, getTechnicienProfile, getUserById, updateClientProfile, updateTechnicienProfile, updateUser } from '../../services/userApi';

const { Option } = Select;

const ROLE_LABELS = {
  client: 'Client',
  technicien: 'Technicien',
  admin: 'Administrateur',
};

export default function UserViewEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null); // Profil client ou technicien
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Chargement de l'utilisateur
  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then(res => {
        setUser(res.data);
        form.setFieldsValue(res.data);
        if (res.data.role === 'client') loadClientProfile(id);
        else if (res.data.role === 'technicien') loadTechnicienProfile(id);
      })
      .catch(() => message.error('Erreur de chargement de l\'utilisateur'))
      .finally(() => setLoading(false));
  }, [id, form]);

  // Chargement des profils
  const loadClientProfile = (userId) => {
    setProfileLoading(true);
    getClientProfile(userId)
      .then(res => setProfile(res.data))
      .catch(() => message.error('Erreur chargement profil client'))
      .finally(() => setProfileLoading(false));
  };

  const loadTechnicienProfile = (userId) => {
    setProfileLoading(true);
    getTechnicienProfile(userId)
      .then(res => setProfile(res.data))
      .catch(() => message.error('Erreur chargement profil technicien'))
      .finally(() => setProfileLoading(false));
  };

  // Gestion de la mise à jour
  const onFinish = async (values) => {
    setSaving(true);
    try {
      await updateUser(id, {
        phone_number: values.phone_number,
        role: user.role // le champ role n'est modifiable que par admin, ici on garde l'existant
      });

      // Mise à jour des profils spécifiques si champs remplis
      if (user.role === 'client' && profile) {
        await updateClientProfile(id, {
          address: values.address,
          consommation_annuelle_moyenne_kwh: values.consommation_annuelle_moyenne_kwh
        });
      }
      if (user.role === 'technicien' && profile) {
        await updateTechnicienProfile(id, {
          certifications: values.certifications,
          zone_couverture: values.zone_couverture,
          is_certified: values.is_certified,
        });
      }

      message.success('Utilisateur mis à jour.');
      navigate('/dashboard/users/list');
    } catch (e) {
      message.error('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin tip="Chargement..." style={{ marginTop: 100 }} />;
  if (!user) return <Alert type="error" message="Utilisateur introuvable" />;

  return (
    <div style={{ maxWidth: 650, margin: '0 auto', padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard/users/list">Utilisateurs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Détail & Mise à jour</Breadcrumb.Item>
      </Breadcrumb>

      <Descriptions bordered column={1} size="middle" title="Résumé utilisateur" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Rôle">
          <Tag color={user.role === 'admin' ? 'red' : user.role === 'technicien' ? 'blue' : 'green'}>
            {ROLE_LABELS[user.role]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Téléphone">{user.phone_number || <i>Non renseigné</i>}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Mise à jour</Divider>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          phone_number: user.phone_number,
          ...(profile || {})
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Champs utilisateur de base */}
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Numéro de téléphone" name="phone_number">
          <Input placeholder="Numéro" />
        </Form.Item>
        {/* Champs spécifiques au rôle */}
        {user.role === 'client' && (
          <>
            <Form.Item label="Adresse" name="address">
              <Input placeholder="Adresse complète" />
            </Form.Item>
            <Form.Item
              label="Consommation annuelle moyenne (kWh)"
              name="consommation_annuelle_moyenne_kwh"
              rules={[
                { type: 'number', min: 0, message: 'Doit être positif', transform: v => v === '' ? null : Number(v) }
              ]}
            >
              <Input type="number" placeholder="Ex: 2500" />
            </Form.Item>
          </>
        )}
        {user.role === 'technicien' && (
          <>
            <Form.Item label="Certifications" name="certifications">
              <Input.TextArea rows={2} placeholder="Liste des certifications" />
            </Form.Item>
            <Form.Item label="Zone de couverture" name="zone_couverture">
              <Input placeholder="Ville, Région..." />
            </Form.Item>
            <Form.Item label="Certifié" name="is_certified" valuePropName="checked">
              <Select>
                <Option value={true}>Oui</Option>
                <Option value={false}>Non</Option>
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Enregistrer les modifications
            </Button>
            <Button onClick={() => navigate('/dashboard/users/list')}>Annuler</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
