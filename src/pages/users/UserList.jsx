import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, getUsers } from '../../services/userApi';

const { Search } = Input;

const ROLE_LABELS = {
  client: 'Client',
  technicien: 'Technicien',
  admin: 'Administrateur',
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchText, setSearchText] = useState('');

  // fetchUsers prend en compte la pagination et la recherche full text
  const fetchUsers = useCallback(
    (page = 1, pageSize = 10, search = '') => {
      setLoading(true);
      getUsers(page, pageSize, null, search) // on passe la recherche au backend
        .then((res) => {
          setUsers(res.data.results || res.data);
          setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
            total:
              res.data.count ||
              (res.data.results ? res.data.results.length : res.data.length),
          }));
        })
        .catch(() => {
          message.error('Erreur lors du chargement des utilisateurs');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  // Chargement initial et à chaque changement de pagination ou recherche
  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize, searchText);
  }, [fetchUsers, pagination.current, pagination.pageSize, searchText]);

  const handleDelete = (id) => {
    setLoading(true);
    deleteUser(id)
      .then(() => {
        message.success('Utilisateur supprimé');
        fetchUsers(pagination.current, pagination.pageSize, searchText);
      })
      .catch(() => {
        message.error('Erreur lors de la suppression');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTableChange = (pag) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current,
      pageSize: pag.pageSize,
    }));
  };

  // Au moment de déclencher la recherche (clic ou Entrée)
  const onSearch = (value) => {
    setSearchText(value.trim());
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a, b) => (a.last_name || '').localeCompare(b.last_name || ''),
      render: (text) => text || <i>Non renseigné</i>,
    },
    {
      title: 'Prénom',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: (a, b) => (a.first_name || '').localeCompare(b.first_name || ''),
      render: (text) => text || <i>Non renseigné</i>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      filters: Object.entries(ROLE_LABELS).map(([key, label]) => ({
        text: label,
        value: key,
      })),
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'technicien' ? 'blue' : 'green'}>
          {ROLE_LABELS[role] || role}
        </Tag>
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (phone) => phone || <i>Non renseigné</i>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Visualiser">
            <Link to={`/dashboard/users/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link to={`/dashboard/users/${record.id}/edit`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
          <Popconfirm
            title="Confirmer la suppression ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Tooltip title="Supprimer">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Utilisateurs</Breadcrumb.Item>
        <Breadcrumb.Item>Liste</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Liste des utilisateurs</h1>

      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Button type="primary" onClick={() => navigate('/dashboard/users/add')}>
          Ajouter un utilisateur
        </Button>
        <Search
          placeholder="Rechercher par nom, prénom, email..."
          allowClear
          enterButton
          onSearch={onSearch}
          style={{ maxWidth: 300 }}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} utilisateurs`,
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}
