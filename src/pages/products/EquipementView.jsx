import { Breadcrumb, Button, Card, Descriptions, Space, Spin, message } from 'antd';
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
    return <Spin tip="Chargement..." style={{ display: 'block', marginTop: 100 }} />;
  }

  if (!equipement) {
    return <p>Équipement introuvable.</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: 'auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/equipements">Équipements</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{equipement.nom || 'Détail'}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Boutons Retour et Modifier alignés */}
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate(-1)}>Retour</Button>
        <Button type="primary" onClick={() => navigate(`/dashboard/equipements/${id}/edit`)}>
          Modifier
        </Button>
      </Space>

      <Card title={`Détails de l'équipement : ${equipement.nom}`} bordered>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Nom">{equipement.nom || '-'}</Descriptions.Item>
          <Descriptions.Item label="Description">{equipement.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="Catégorie">{equipement.categorie?.nom || '-'}</Descriptions.Item>
          <Descriptions.Item label="Marque">{equipement.marque?.nom || '-'}</Descriptions.Item>
          <Descriptions.Item label="Puissance (W)">{equipement.puissance_W ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Tension (V)">{equipement.tension_V ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Fréquence (Hz)">{equipement.frequence_Hz ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Capacité (Ah)">{equipement.capacite_Ah ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Taille">{equipement.taille || '-'}</Descriptions.Item>
          <Descriptions.Item label="Type équipement">{equipement.type_equipement || '-'}</Descriptions.Item>
          <Descriptions.Item label="Mode">{equipement.mode || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
