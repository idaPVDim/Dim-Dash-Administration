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
  Row,
  Col,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, getUsers } from '../../services/userApi';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    pageSize: 14,
    total: 0,
  });

  const [searchText, setSearchText] = useState('');
  const [searchInput, setSearchInput] = useState(''); // controlled input state

  // fetch users from backend
  const fetchUsers = useCallback(
    (page = 1, pageSize = 10, search = '') => {
      setLoading(true);
      getUsers(page, pageSize, null, search)
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

  // reload users when pagination or searchText changes
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

  // On Search button or Enter key pressed
  const onSearch = () => {
    setSearchText(searchInput.trim());
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const exportToExcel = () => {
    const dataToExport = users.map(({ id, last_name, first_name, email, role, phone_number }) => ({
      ID: id,
      Nom: last_name || '',
      Prénom: first_name || '',
      Email: email,
      Rôle: ROLE_LABELS[role] || role,
      Téléphone: phone_number || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'utilisateurs.xlsx');
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a, b) => (a.last_name || '').localeCompare(b.last_name || ''),
      render: (text) => text || <i>-</i>,
    },
    {
      title: 'Prénom',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: (a, b) => (a.first_name || '').localeCompare(b.first_name || ''),
      render: (text) => text || <i>-</i>,
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
      render: (phone) => phone || <i>-</i>,
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
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item>Utilisateurs</Breadcrumb.Item>
            <Breadcrumb.Item>Liste</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={() => navigate('/dashboard/users/add')}>
              Ajouter un utilisateur
            </Button>
            <Button onClick={exportToExcel}>
              Exporter en Excel
            </Button>
            <Search
              placeholder="Rechercher par nom, prénom, email..."
              allowClear
              enterButton
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={onSearch}
              style={{ width: 300 }}
            />
          </Space>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        size="small"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['12', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range} sur ${total} utilisateurs`,
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}
