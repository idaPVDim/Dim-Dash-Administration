import { UploadOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Upload,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getClientProfile,
  getTechnicienProfile,
  getUserById,
  updateClientProfile,
  updateTechnicienProfile,
  updateUser,
  updateUserPassword,
} from '../../services/userApi';

const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

const ROLE_LABELS = {
  client: 'Client',
  technicien: 'Technicien',
  admin: 'Administrateur',
};

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then((res) => {
        setUser(res.data);
        form.setFieldsValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone_number: res.data.phone_number,
        });
        if (res.data.role === 'client') loadClientProfile(id);
        else if (res.data.role === 'technicien') loadTechnicienProfile(id);
        else setProfile(null);
      })
      .catch(() => message.error("Erreur de chargement de l'utilisateur"))
      .finally(() => setLoading(false));
  }, [id, form]);

  const loadClientProfile = (userId) => {
    setProfileLoading(true);
    getClientProfile(userId)
      .then((res) => {
        setProfile(res.data);
        if (res.data) {
          form.setFieldsValue({
            address: res.data.address,
            consommation_annuelle_moyenne_kwh: res.data.consommation_annuelle_moyenne_kwh,
          });
        }
      })
      .catch(() => message.error('Erreur chargement profil client'))
      .finally(() => setProfileLoading(false));
  };

  const loadTechnicienProfile = (userId) => {
    setProfileLoading(true);
    getTechnicienProfile(userId)
      .then((res) => {
        setProfile(res.data);
        if (res.data) {
          form.setFieldsValue({
            certifications: res.data.certifications,
            zone_couverture: res.data.zone_couverture,
            is_certified: res.data.is_certified,
          });
        }
      })
      .catch(() => message.error('Erreur chargement profil technicien'))
      .finally(() => setProfileLoading(false));
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await updateUser(id, {
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        role: user.role,
      });

      if (user.role === 'client' && profile) {
        await updateClientProfile(profile.id, {
          address: values.address,
          consommation_annuelle_moyenne_kwh: values.consommation_annuelle_moyenne_kwh,
        });
      } else if (user.role === 'technicien' && profile) {
        const formData = new FormData();
        formData.append('certifications', values.certifications || '');
        formData.append('zone_couverture', values.zone_couverture || '');
        formData.append('is_certified', values.is_certified || false);

        ['id_document', 'formation_document', 'certification_docs', 'autorisation_docs', 'autres_docs'].forEach((field) => {
          if (values[field] && values[field].length > 0) {
            formData.append(field, values[field][0].originFileObj);
          }
        });

        await updateTechnicienProfile(profile.id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (values.password) {
        await updateUserPassword(id, { password: values.password, password2: values.password2 });
        message.success('Mot de passe mis à jour avec succès.');
      }

      message.success('Utilisateur mis à jour avec succès.');
      navigate('/dashboard/users/list');
    } catch (error) {
      const detail =
        error.response?.data?.detail ||
        (error.response?.data && JSON.stringify(error.response.data)) ||
        error.message ||
        'Erreur inconnue';
      message.error(`Erreur lors de la mise à jour : ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || profileLoading) return <Spin tip="Chargement..." style={{ marginTop: 100 }} />;

  if (!user)
    return (
      <div style={{ padding: 24 }}>
        <p>Utilisateur introuvable.</p>
      </div>
    );

  return (
    <div style={{ maxWidth: "100%", margin: '0 auto', padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard/users/list">Utilisateurs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Mise à jour</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Modifier l'utilisateur</h1>

      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off" scrollToFirstError>
        <Row gutter={24}>
          {/* Colonne gauche - Informations de base */}
          <Col xs={24} md={12}>
            <Divider orientation="left">Informations de base</Divider>

            {/* Prénom et Nom côte-à-côte */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Prénom"
                  name="first_name"
                  rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
                >
                  <Input placeholder="Prénom" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nom"
                  name="last_name"
                  rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
                >
                  <Input placeholder="Nom" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Téléphone" name="phone_number">
              <Input placeholder="Numéro de téléphone" />
            </Form.Item>

            {/* Profil client champs texte */}
            {user.role === 'client' && (
              <>
                <Divider orientation="left">Profil Client</Divider>
                <Form.Item label="Adresse" name="address">
                  <Input.TextArea rows={3} placeholder="Adresse complète" />
                </Form.Item>

                <Form.Item
                  label="Consommation annuelle moyenne (kWh)"
                  name="consommation_annuelle_moyenne_kwh"
                  rules={[
                    {
                      type: 'number',
                      min: 0,
                      message: 'Doit être un nombre positif',
                      transform: (v) => (v === '' || v == null ? undefined : Number(v)),
                    },
                  ]}
                >
                  <Input type="number" placeholder="Ex: 2500" />
                </Form.Item>
              </>
            )}

            {/* Profil technicien champs texte et switch */}
            {user.role === 'technicien' && (
              <>
                <Divider orientation="left">Profil Technicien</Divider>
                <Form.Item label="Certifications" name="certifications">
                  <Input.TextArea rows={4} placeholder="Certifications" />
                </Form.Item>

                <Form.Item label="Zone de couverture" name="zone_couverture">
                  <Input placeholder="Ville, région..." />
                </Form.Item>

                <Form.Item label="Certifié" name="is_certified" valuePropName="checked" initialValue={false}>
                  <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                </Form.Item>
              </>
            )}

            {/* Section mot de passe */}
            <Divider orientation="left">Changer le mot de passe</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Nouveau mot de passe"
                  name="password"
                  hasFeedback
                  rules={[
                    {
                      min: 8,
                      message: 'Le mot de passe doit contenir au moins 8 caractères',
                    },
                  ]}
                >
                  <Input.Password placeholder="Laissez vide pour ne pas changer" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Confirmer le nouveau mot de passe"
                  name="password2"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirmez le mot de passe" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Colonne droite - Documents */}
          <Col xs={24} md={12}>
            {user.role === 'technicien' && (
              <>
                <Divider orientation="left">Documents de certification</Divider>

                {[
                  { label: "Document d'identité (CNIB / Passeport)", name: "id_document" },
                  { label: "Document de formation", name: "formation_document" },
                  { label: "Documents de certification", name: "certification_docs" },
                  { label: "Documents d'autorisation", name: "autorisation_docs" },
                  { label: "Autres documents", name: "autres_docs" },
                ].map(({ label, name }) => (
                  <Form.Item
                    key={name}
                    label={label}
                    name={name}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="Formats acceptés : PDF, JPG, JPEG, PNG"
                  >
                    <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.jpeg,.png">
                      <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                    </Upload>
                  </Form.Item>
                ))}
              </>
            )}
          </Col>
        </Row>

        {/* Boutons en bas */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Enregistrer
            </Button>
            <Button onClick={() => navigate('/dashboard/users/list')}>Annuler</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
