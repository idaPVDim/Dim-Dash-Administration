import { useEffect, useState } from 'react';
import { Descriptions, Tag, List, Typography, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { getInstallationById } from '../../services/installationApi';

const STATUS_LABELS = {
  pending: 'En attente',
  in_progress: 'En cours',
  proposed: 'Proposé',
  accepted: 'Accepté',
  rejected: 'Rejeté',
  installed: 'Installé',
  canceled: 'Annulé',
};

const STATUS_COLORS = {
  pending: 'orange',
  in_progress: 'blue',
  proposed: 'purple',
  accepted: 'green',
  rejected: 'red',
  installed: 'cyan',
  canceled: 'gray',
};

export default function InstallationDetail() {
  const { id } = useParams();
  const [installation, setInstallation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getInstallationById(id)
      .then((res) => setInstallation(res.data))
      .catch(() => {
        message.error("Erreur lors du chargement de l'installation");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />;
  if (!installation)
    return <Typography.Text>Installation non trouvée.</Typography.Text>;

  const {
    client,
    technicien,
    source_donnees,
    province,
    budget_client,
    surface_disponible_m2,
    contraintes_specifiques,
    status,
    date_creation,
    date_derniere_mise_a_jour,
    equipements_proposes,
  } = installation;

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Détails Installation #{installation.id}</Typography.Title>

      <Descriptions bordered column={2} size="middle" title="Informations Générales">
        <Descriptions.Item label="Client" span={2}>
          {client?.first_name} {client?.last_name} <br />
          Email: {client?.email} <br />
          Adresse: {client?.address || '—'} <br />
          Consommation annuelle moyenne: {client?.consommation_annuelle_moyenne_kwh || '—'} kWh
        </Descriptions.Item>

        <Descriptions.Item label="Technicien" span={2}>
          {technicien?.first_name} {technicien?.last_name} <br />
          Email: {technicien?.email} <br />
          Certifié: {technicien?.is_certified ? 'Oui' : 'Non'} <br />
          Zone de couverture: {technicien?.zone_couverture || '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Documents Technicien" span={2}>
          <div>
            <div>Id Document: {technicien?.id_document ? <a href={technicien.id_document} target="_blank" rel="noreferrer">Voir</a> : 'Aucun'}</div>
            <div>Formation Document: {technicien?.formation_document ? <a href={technicien.formation_document} target="_blank" rel="noreferrer">Voir</a> : 'Aucun'}</div>
            <div>Certification Docs: {technicien?.certification_docs ? <a href={technicien.certification_docs} target="_blank" rel="noreferrer">Voir</a> : 'Aucun'}</div>
            <div>Autorisation Docs: {technicien?.autorisation_docs ? <a href={technicien.autorisation_docs} target="_blank" rel="noreferrer">Voir</a> : 'Aucun'}</div>
            <div>Autres Docs: {technicien?.autres_docs ? <a href={technicien.autres_docs} target="_blank" rel="noreferrer">Voir</a> : 'Aucun'}</div>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Province" span={2}>
          {province?.nom} <br /> Irradiation: {province?.irradiation || '—'}
        </Descriptions.Item>


        <Descriptions.Item label="Budget Client">
          {budget_client ? `${Number(budget_client).toLocaleString()} XOF` : '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Surface disponible (m²)">
          {surface_disponible_m2 || '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Contraintes spécifiques" span={2}>
          {contraintes_specifiques || 'Aucune'}
        </Descriptions.Item>

        <Descriptions.Item label="Statut">
          <Tag color={STATUS_COLORS[status] || 'default'}>
            {STATUS_LABELS[status] || status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Source données" span={2}>
          {source_donnees === 'client'
            ? 'Données fournies par le client'
            : 'Données renseignées par le technicien'}
        </Descriptions.Item>

        <Descriptions.Item label="Date de création">
          {date_creation ? new Date(date_creation).toLocaleString() : '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Dernière mise à jour">
          {date_derniere_mise_a_jour ? new Date(date_derniere_mise_a_jour).toLocaleString() : '—'}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={4} style={{ marginTop: 32 }}>
        Équipements proposés
      </Typography.Title>

      {equipements_proposes?.length ? (
        <List
          bordered
          dataSource={equipements_proposes}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Typography.Text strong>{item.equipement.nom}</Typography.Text> — Quantité : {item.quantite} — Source : {item.source}
              <br />
              Description : {item.equipement.description}
              <br />
              Catégorie : {item.equipement.categorie?.nom}
              <br />
              Marque : {item.equipement.marque?.nom}
              {/* Ajoutez ici des propriétés supplémentaires selon vos besoins */}
            </List.Item>
          )}
        />
      ) : (
        <Typography.Text>Aucun équipement proposé</Typography.Text>
      )}
    </div>
  );
}
