import { Breadcrumb, Button, Card, Descriptions, Space, Spin, message, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEquipementById } from '../../services/productApi';

export default function EquipementView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipement, setEquipement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipement() {
      setLoading(true);
      try {
        const response = await getEquipementById(id);
        setEquipement(response.data);
      } catch (error) {
        console.error(error);
        message.error('Erreur lors du chargement de l’équipement');
      } finally {
        setLoading(false);
      }
    }
    fetchEquipement();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin tip="Chargement..." size="large" />
      </div>
    );
  }

  if (!equipement) {
    return <p style={{ textAlign: 'center', marginTop: 100 }}>Équipement introuvable.</p>;
  }

  const renderField = (label, value, suffix = '') =>
    value !== undefined && value !== null && value !== '' ? (
      <Descriptions.Item label={label}>
        {value}{suffix}
      </Descriptions.Item>
    ) : null;

  return (
    <div style={{ padding: 24, maxWidth: '100%', margin: 'auto' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><Link to="/dashboard">Tableau de bord</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/dashboard/equipements">Équipements</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{equipement.nom || 'Détail'}</Breadcrumb.Item>
      </Breadcrumb>

      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate(-1)}>Retour</Button>
        <Button type="primary" onClick={() => navigate(`/dashboard/equipements/${id}/edit`)}>
          Modifier
        </Button>
      </Space>

      <Card title={`Détails de l'équipement : ${equipement.nom}`} bordered>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card type="inner" title="Informations Générales" bordered>
              <Descriptions column={1} size="small" bordered>
                {renderField('Nom', equipement.nom)}
                {renderField('Description', equipement.description)}
                {renderField('Catégorie', equipement.categorie?.nom)}
                {renderField('Marque', equipement.marque?.nom)}
                {renderField("Type d'équipement", equipement.type_equipement)}
                {renderField('Mode', equipement.mode)}
                {renderField('Description technique', equipement.description_technique)}
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card type="inner" title="Caractéristiques Électriques" bordered>
              <Descriptions column={1} size="small" bordered>
                {renderField('Puissance (W)', equipement.puissance_W)}
                {renderField('Puissance (VA)', equipement.puissance_VA)}
                {renderField('Puissance nominale (W)', equipement.puissance_nominale_W)}
                {renderField('Tension (V)', equipement.tension_V)}
                {renderField('Tension entrée DC (V)', equipement.tension_entree_DC_V)}
                {renderField('Tension sortie AC (V)', equipement.tension_sortie_AC_V)}
                {renderField('Fréquence (Hz)', equipement.frequence_Hz)}
                {renderField('Capacité (Ah)', equipement.capacite_Ah)}
                {renderField('Énergie (Wh)', equipement.energie_Wh)}
                {renderField('Efficacité (%)', equipement.efficacite_module_pourcent, ' %')}
                {renderField('Rendement (%)', equipement.rendement_pourcent, ' %')}
                {renderField('Tolérance puissance (W)', equipement.tolerance_puissance_W)}
                {renderField('Courant max Imp', equipement.courant_puissance_max_Imp)}
                {renderField('Courant court-circuit ISC', equipement.courant_court_circuit_ISC)}
                {renderField('Tension puissance max VMP', equipement.tension_puissance_max_VMP)}
                {renderField('Tension circuit ouvert VOC', equipement.tension_circuit_ouvert_VOC)}
                {renderField('Tension maximale système (V)', equipement.tension_maximale_systeme_V)}
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card type="inner" title="Caractéristiques Physiques & Cycle" bordered>
              <Descriptions column={1} size="small" bordered>
                {renderField('Taille', equipement.taille)}
                {renderField('Taille (mm)', equipement.taille_mm)}
                {renderField('Poids (kg)', equipement.poids_kg)}
                {renderField('Température fonctionnement (°C)', equipement.temperature_module_fonctionnement_C)}
                {renderField('Cycle de vie', equipement.cycle_vie_cycles)}
                {renderField('Résistance interne (mΩ)', equipement.ir_initiale_mOhm)}
                {renderField('Calibre max fusibles (A)', equipement.calibre_max_fusibles_serie_A)}
              </Descriptions>
            </Card>

            <Card type="inner" title="Puissances PV & Stockage" bordered style={{ marginTop: 24 }}>
              <Descriptions column={1} size="small" bordered>
                {renderField('Puissance PV max 12V', equipement.puissance_PV_max_12V)}
                {renderField('Puissance PV max 24V', equipement.puissance_PV_max_24V)}
                {renderField('Puissance PV max 48V', equipement.puissance_PV_max_48V)}
                {renderField('Tension max PV (V)', equipement.tension_max_PV_V)}
                {renderField('Tension système (V)', equipement.tension_systeme_V)}
                {renderField('Conditions de test', equipement.conditions_test)}
                {renderField('Type de stockage', equipement.type_stockage)}
              </Descriptions>
            </Card>

            <Card type="inner" title="Caractéristiques additionnelles" bordered style={{ marginTop: 24 }}>
              {equipement.caracteristiques_additionnelles && equipement.caracteristiques_additionnelles.length > 0 ? (
                <ul style={{ paddingLeft: 20 }}>
                  {equipement.caracteristiques_additionnelles.map((car, idx) => (
                    <li key={idx}>{car}</li>
                  ))}
                </ul>
              ) : (
                <p>Aucune caractéristique additionnelle.</p>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
