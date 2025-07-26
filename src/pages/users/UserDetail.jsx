import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Spin,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getClientProfile, getTechnicienProfile, getUserById } from '../../services/userApi';

const ROLE_LABELS = {
  client: 'Client',
  technicien: 'Technicien',
  admin: 'Administrateur',
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Modal pour affichage document
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDocUrl, setModalDocUrl] = useState('');
  const [modalDocName, setModalDocName] = useState('');

  // Chargement des données utilisateur et profils
  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then((res) => {
        setUser(res.data);
        if (res.data.role === 'client') loadClientProfile(id);
        else if (res.data.role === 'technicien') loadTechnicienProfile(id);
        else setProfile(null);
      })
      .catch(() => {
        setUser(null);
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const loadClientProfile = (userId) => {
    setProfileLoading(true);
    getClientProfile(userId)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  };

  const loadTechnicienProfile = (userId) => {
    setProfileLoading(true);
    getTechnicienProfile(userId)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  };

  // Ouvre la modal avec document
  const openDocumentModal = (fileUrl) => {
    if (!fileUrl) return;
    setModalDocUrl(fileUrl);
    const fileName = fileUrl.split('/').pop();
    setModalDocName(fileName);
    setModalVisible(true);
  };

  // Ferme la modal
  const closeModal = () => {
    setModalVisible(false);
    setModalDocUrl('');
    setModalDocName('');
  };

  // Rendu du lien document cliquable
  const DocumentLink = ({ url }) => {
    if (!url) return <i>Non renseigné</i>;

    const fileName = url.split('/').pop();
    return (
      <button
        onClick={() => openDocumentModal(url)}
        style={{
          background: 'none',
          border: 'none',
          color: '#1890ff',
          cursor: 'pointer',
          padding: 0,
          textDecoration: 'underline',
          fontSize: 'inherit',
          fontFamily: 'inherit',
        }}
        type="button"
      >
        {fileName}
      </button>
    );
  };

  if (loading) return <Spin tip="Chargement..." style={{ marginTop: 100 }} />;

  if (!user) return <Alert type="error" message="Utilisateur introuvable" />;

  return (
    <>
      <div style={{ maxWidth: "100%", margin: '0 auto', padding: 24 }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <Link to="/dashboard/users/list">Utilisateurs</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Détail</Breadcrumb.Item>
        </Breadcrumb>

        <Space style={{ marginBottom: 24, justifyContent: 'space-between', width: '100%' }}>
          <h1>Détail utilisateur</h1>
          <Button type="primary" onClick={() => navigate(`/dashboard/users/${id}/edit`)}>
            Modifier
          </Button>
        </Space>

        {/* Division en 2 colonnes */}
        <Row gutter={24}>
          {/* Colonne gauche - Informations générales */}
          <Col xs={24} md={12}>
            <Descriptions bordered column={1} size="middle" title="Résumé utilisateur" style={{ marginBottom: 32 }}>
              <Descriptions.Item label="Prénom">{user.first_name || <i>Non renseigné</i>}</Descriptions.Item>
              <Descriptions.Item label="Nom">{user.last_name || <i>Non renseigné</i>}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Rôle">
                <Tag color={user.role === 'admin' ? 'red' : user.role === 'technicien' ? 'blue' : 'green'}>
                  {ROLE_LABELS[user.role]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Téléphone">{user.phone_number || <i>Non renseigné</i>}</Descriptions.Item>
            </Descriptions>

            {profileLoading ? (
              <Spin tip="Chargement du profil..." />
            ) : user.role === 'client' && profile ? (
              <>
                <Divider orientation="left">Profil Client</Divider>
                <Descriptions bordered column={1} size="small" style={{ marginBottom: 32 }}>
                  <Descriptions.Item label="Adresse">{profile.address || <i>Non renseigné</i>}</Descriptions.Item>
                  <Descriptions.Item label="Consommation annuelle moyenne (kWh)">
                    {profile.consommation_annuelle_moyenne_kwh ?? <i>Non renseigné</i>}
                  </Descriptions.Item>
                </Descriptions>
              </>
            ) : user.role === 'technicien' && profile ? (
              <>
                <Divider orientation="left">Profil Technicien</Divider>
                <Descriptions bordered column={1} size="small" style={{ marginBottom: 32 }}>
                  <Descriptions.Item label="Certifications">{profile.certifications || <i>Non renseigné</i>}</Descriptions.Item>
                  <Descriptions.Item label="Zone de couverture">{profile.zone_couverture || <i>Non renseigné</i>}</Descriptions.Item>
                  <Descriptions.Item label="Certifié">{profile.is_certified ? 'Oui' : 'Non'}</Descriptions.Item>
                </Descriptions>
              </>
            ) : null}
          </Col>

          {/* Colonne droite - Documents (uniquement pour technicien) */}
          <Col xs={24} md={12}>
            {user.role === 'technicien' && profile && (
              <>
                <Divider orientation="left">Documents</Divider>
                <Descriptions bordered column={1} size="small" style={{ marginBottom: 32 }}>
                  <Descriptions.Item label="Document d'identité">
                    <DocumentLink url={profile.id_document} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Document de formation">
                    <DocumentLink url={profile.formation_document} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Documents de certification">
                    <DocumentLink url={profile.certification_docs} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Documents d'autorisation">
                    <DocumentLink url={profile.autorisation_docs} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Autres documents">
                    <DocumentLink url={profile.autres_docs} />
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </Col>
        </Row>
      </div>


      {/* Modal personnalisée avec iframe natif */}
      {modalVisible && (
        <>
          {/* Fond semi-transparent */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              cursor: 'pointer',
            }}
          />
          
          {/* Contenu modal */}
          <div
            style={{
              position: 'fixed',
              top: '5vh',
              left: '5vw',
              width: '90vw',
              height: '90vh',
              backgroundColor: 'white',
              borderRadius: 4,
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
          >
            <div
              style={{
                padding: 12,
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 id="modalTitle" style={{ margin: 0, fontWeight: 'bold' }}>
                {modalDocName}
              </h3>
              <Button onClick={closeModal}>Fermer</Button>
            </div>
            <iframe
              src={modalDocUrl}
              title={modalDocName}
              style={{ flexGrow: 1, border: 'none' }}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </>
      )}
    </>
  );
}
