import { Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { getInstallations } from '../../services/installationApi';

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

  useEffect(() => {
    setLoading(true);
    getInstallations()
      .then((res) => {
        setInstallations(res.data);
      })
      .catch(() => {
        message.error('Erreur lors du chargement des installations');
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Client',
      dataIndex: ['client', 'user', 'email'],
      key: 'client',
      render: (email) => email || '—',
      sorter: (a, b) => (a.client?.user?.email || '').localeCompare(b.client?.user?.email || ''),
    },
    {
      title: 'Technicien',
      dataIndex: ['technicien', 'user', 'email'],
      key: 'technicien',
      render: (email) => email || '—',
      sorter: (a, b) => (a.technicien?.user?.email || '').localeCompare(b.technicien?.user?.email || ''),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      filters: Object.entries(STATUS_LABELS).map(([key, label]) => ({ text: label, value: key })),
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
      render: (date) => (date ? new Date(date).toLocaleDateString() : '—'),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Liste des installations</h1>
      <Table
        rowKey="id"
        dataSource={installations}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        bordered
      />
    </div>
  );
}
