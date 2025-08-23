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
  Steps,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEquipement, getCategories, getMarques } from '../../services/productApi';

const { Option } = Select;
const { Step } = Steps;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

export default function EquipementAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
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
        message.error('Erreur lors du chargement des catégories et marques');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const steps = [
    {
      title: 'Identification',
      content: (
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Catégorie"
              name="categorie_id"
              rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
            >
              <Select placeholder="Sélectionnez une catégorie" showSearch optionFilterProp="children" allowClear>
                {categories.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.nom}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Marque" name="marque_id">
              <Select placeholder="Sélectionnez une marque" showSearch optionFilterProp="children" allowClear>
                {marques.map(m => (
                  <Option key={m.id} value={m.id}>{m.nom}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Type équipement" name="type_equipement">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Mode"
              name="mode"
              initialValue="AC"
              rules={[{ required: true, message: 'Veuillez sélectionner un mode' }]}
            >
              <Select>
                <Option value="AC">Alternatif (AC)</Option>
                <Option value="DC">Continu (DC)</Option>
                <Option value="DC/AC">Continu / Alternatif (Hybride)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Puissance & Tension',
      content: (
        <Row gutter={24}>
          {[
            { label: 'Puissance (W)', name: 'puissance_W' },
            { label: 'Puissance (VA)', name: 'puissance_VA' },
            { label: 'Puissance nominale (W)', name: 'puissance_nominale_W' },
            { label: 'Tension (V)', name: 'tension_V' },
            { label: 'Tension entrée DC (V)', name: 'tension_entree_DC_V' },
            { label: 'Tension sortie AC (V)', name: 'tension_sortie_AC_V' },
            { label: 'Fréquence (Hz)', name: 'frequence_Hz', number: true },
            { label: 'Capacité (Ah)', name: 'capacite_Ah' },
            { label: 'Énergie (Wh)', name: 'energie_Wh' },
            { label: 'Efficacité (%)', name: 'efficacite_module_pourcent' },
          ].map(({ label, name, number }) => (
            <Col span={8} key={name}>
              <Form.Item
                label={label}
                name={name}
                rules={
                  number
                    ? [{ type: 'number', min: 0, message: 'Entrez un nombre valide' }]
                    : [{ pattern: /^\d*\.?\d*$/, message: 'Veuillez saisir un nombre' }]
                }
              >
                {number ? <InputNumber style={{ width: '100%' }} /> : <Input />}
              </Form.Item>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      title: 'Caractéristiques & Divers',
      content: (
        <Row gutter={24}>
          {[
            'taille',
            'courant_puissance_max_Imp',
            'tension_puissance_max_VMP',
            'tension_circuit_ouvert_VOC',
            'courant_court_circuit_ISC',
            'tolerance_puissance_W',
            'tension_maximale_systeme_V',
            'temperature_module_fonctionnement_C',
            'calibre_max_fusibles_serie_A',
            'cycle_vie_cycles',
            'ir_initiale_mOhm',
            'poids_kg',
            'forme_onde',
            'rendement_pourcent',
            'courant_charge_A',
            'tension_systeme_V',
            'tension_max_PV_V',
            'puissance_PV_max_12V',
            'puissance_PV_max_24V',
            'puissance_PV_max_48V',
            'conditions_test',
            'type_stockage',
          ].map((name) => (
            <Col span={8} key={name}>
              <Form.Item
                label={name.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())}
                name={name}
                rules={[{ pattern: /^\d*\.?\d*$/, message: 'Veuillez saisir un nombre' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  const next = () => {
    form
      .validateFields()
      .then(() => setCurrentStep(currentStep + 1))
      .catch(() => {});
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
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
      message.error("Erreur lors de l'ajout de l’équipement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: '100%', margin: 'auto' }}>
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
        <Form
          form={form}
          layout="horizontal"
          {...formItemLayout}
          labelAlign="left"
          size="middle"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Steps current={currentStep} style={{ marginBottom: 24 }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div>{steps[currentStep].content}</div>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              {currentStep > 0 && <Button onClick={prev}>Précédent</Button>}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  Suivant
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" htmlType="submit" loading={saving}>
                  Enregistrer
                </Button>
              )}
              <Button onClick={() => navigate('/dashboard/equipements')}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
