import { Table, Tag, message, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstallations, deleteInstallation } from '../../services/installationApi';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

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

export default function InstallationList() {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = () => {
    setLoading(true);
    getInstallations()
      .then((res) => setInstallations(res.data))
      .catch(() => message.error('Erreur lors du chargement des installations'))
      .finally(() => setLoading(false));
  };

  const handleDelete = useCallback((id) => {
    setLoading(true);
    deleteInstallation(id)
      .then(() => {
        setInstallations((prev) => prev.filter((item) => item.id !== id));
        message.success('Installation supprimée');
      })
      .catch(() => message.error('Erreur lors de la suppression'))
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 70,
    },
    {
      title: 'Client',
      key: 'client_fullname',
      render: (_, record) => {
        const firstName = record.client?.first_name || '';
        const lastName = record.client?.last_name || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : '—';
      },
      sorter: (a, b) => {
        const nameA = `${a.client?.first_name || ''} ${a.client?.last_name || ''}`.trim();
        const nameB = `${b.client?.first_name || ''} ${b.client?.last_name || ''}`.trim();
        return nameA.localeCompare(nameB);
      },
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Adresse Client',
      dataIndex: ['client', 'address'],
      key: 'client_address',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Technicien',
      key: 'technicien_fullname',
      render: (_, record) => {
        const firstName = record.technicien?.first_name || '';
        const lastName = record.technicien?.last_name || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : '—';
      },
      sorter: (a, b) => {
        const nameA = `${a.technicien?.first_name || ''} ${a.technicien?.last_name || ''}`.trim();
        const nameB = `${b.technicien?.first_name || ''} ${b.technicien?.last_name || ''}`.trim();
        return nameA.localeCompare(nameB);
      },
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Technicien Certifié',
      dataIndex: ['technicien', 'is_certified'],
      key: 'technicien_certifie',
      render: (certified) => (certified ? 'Oui' : 'Non'),
      filters: [
        { text: 'Oui', value: true },
        { text: 'Non', value: false },
      ],
      onFilter: (value, record) => record.technicien?.is_certified === value,
      width: 130,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      filters: Object.entries(STATUS_LABELS).map(([key, label]) => ({ text: label, value: key })),
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>{STATUS_LABELS[status] || status}</Tag>
      ),
      width: 120,
    },
    {
      title: 'Province',
      dataIndex: ['province', 'nom'],
      key: 'province_nom',
      render: (text) => text || '—',
      width: 150,
    },
    {
      title: 'Budget',
      dataIndex: 'budget_client',
      key: 'budget_client',
      render: (text) => (text ? `${Number(text).toLocaleString()} XOF` : '—'),
      sorter: (a, b) => (Number(a.budget_client) || 0) - (Number(b.budget_client) || 0),
      width: 130,
    },
    {
      title: 'Surface dispo. (m²)',
      dataIndex: 'surface_disponible_m2',
      key: 'surface_disponible_m2',
      sorter: (a, b) => (Number(a.surface_disponible_m2) || 0) - (Number(b.surface_disponible_m2) || 0),
      width: 130,
    },
    {
      title: 'Date de création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
      render: (date) => (date ? new Date(date).toLocaleDateString() : '—'),
      width: 130,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <>
          <Tooltip title="Voir">
            <EyeOutlined
              style={{ color: '#1890ff', marginRight: 12, cursor: 'pointer' }}
              onClick={() => navigate(`/dashboard/installation/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <EditOutlined
              style={{ color: '#52c41a', marginRight: 12, cursor: 'pointer' }}
              onClick={() => console.log('Modifier', record.id)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Confirmer la suppression ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ], [handleDelete, navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Liste des installations</h1>
      <Table
        rowKey="id"
        dataSource={installations}
        columns={columns}
        loading={loading}
        size="small"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        bordered
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0 }}>
              <p><b>Consommation annuelle moyenne (client):</b> {record.client?.consommation_annuelle_moyenne_kwh || '—'} kWh</p>
              <p><b>Adresse:</b> {record.client?.address || '—'}</p>
              <p><b>Zone de couverture (technicien):</b> {record.technicien?.zone_couverture || '—'}</p>
              <p><b>Date dernière mise à jour:</b> {record.date_derniere_mise_a_jour ? new Date(record.date_derniere_mise_a_jour).toLocaleString() : '—'}</p>
              <p><b>Contraintes spécifiques:</b> {record.contraintes_specifiques || 'Aucune'}</p>
              {/* Ajoutez d'autres détails dans cette zone si besoin */}
            </div>
          ),
          rowExpandable: (record) => !!record.client,
        }}
      />
    </div>
  );
}
