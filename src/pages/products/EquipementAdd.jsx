import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space,
    Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEquipement, getCategories, getMarques } from '../../services/productApi';

const { Option } = Select;

export default function EquipementAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catsRes, marqRes] = await Promise.all([
          getCategories(1, 1000),
          getMarques(1, 1000),
        ]);

        setCategories(catsRes.data.results || catsRes.data);
        setMarques(marqRes.data.results || marqRes.data);
      } catch (error) {
        console.error(error);
        message.error('Erreur lors du chargement des catégories et marques');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      // Préparer le payload selon votre API (attention à ne pas envoyer les objets complets)
      const payload = {
        ...values,
        categorie: undefined,
        marque: undefined,
        categorie_id: values.categorie_id,
        marque_id: values.marque_id,
      };
      await createEquipement(payload);
      message.success('Équipement ajouté avec succès');
      navigate('/dashboard/equipements');
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de l\'ajout de l’équipement');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <Spin tip="Chargement..." style={{ marginTop: 100, display: 'block' }} />;

  const colSpan = 12;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: 'auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/equipements">Équipements</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Ajouter</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Ajouter un nouvel équipement">
        <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
          <Row gutter={16}>
            <Col span={colSpan}>
              <Form.Item
                label="Nom"
                name="nom"
                rules={[{ required: true, message: 'Veuillez saisir le nom de l’équipement' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                label="Catégorie"
                name="categorie_id"
                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
              >
                <Select
                  placeholder="Sélectionnez une catégorie"
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Marque" name="marque_id">
                <Select
                  placeholder="Sélectionnez une marque"
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {marques.map((m) => (
                    <Option key={m.id} value={m.id}>
                      {m.nom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Puissance (W)" name="puissance_W" rules={[{ type: 'number', min: 0 }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Tension (V)" name="tension_V" rules={[{ type: 'number', min: 0 }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Fréquence (Hz)" name="frequence_Hz" rules={[{ type: 'number', min: 0 }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Capacité (Ah)" name="capacite_Ah" rules={[{ type: 'number', min: 0 }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Taille" name="taille">
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item label="Type équipement" name="type_equipement">
                <Input />
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                label="Mode"
                name="mode"
                rules={[{ required: true, message: 'Veuillez sélectionner un mode' }]}
                initialValue="AC"
              >
                <Select>
                  <Option value="AC">Alternatif (AC)</Option>
                  <Option value="DC">Continu (DC)</Option>
                  <Option value="DC/AC">Continu / Alternatif (Hybride)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                Enregistrer
              </Button>
              <Button onClick={() => navigate('/dashboard/equipements')}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
