import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Menu, message, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEquipement, getEquipements } from '../../services/productApi'; // adapte path

export default function Equipements() {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({});
  const navigate = useNavigate();

  const fetchEquipements = async (page = 1, pageSize = 10, sortField, sortOrder) => {
    setLoading(true);
    try {
      let ordering = '';
      if (sortField) {
        ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
      }
      const response = await getEquipements(page, pageSize, '', ordering);
      const data = response.data;
      setEquipements(data.results || data);
      setPagination({
        current: page,
        pageSize,
        total: data.count || (data.results ? data.results.length : data.length),
      });
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des équipements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipements(pagination.current, pagination.pageSize, sorter.field, sorter.order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteEquipement(id);
      message.success('Équipement supprimé');
      fetchEquipements(pagination.current, pagination.pageSize, sorter.field, sorter.order);
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pag, filters, sort) => {
    setPagination({ ...pagination, current: pag.current, pageSize: pag.pageSize });
    setSorter({ field: sort.field, order: sort.order });
    fetchEquipements(pag.current, pag.pageSize, sort.field, sort.order);
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: true,
      render: (text) => text || <i>Non renseigné</i>,
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Catégorie',
      dataIndex: ['categorie', 'nom'],
      key: 'categorie',
      sorter: true,
      render: (text, record) => record.categorie?.nom || <i>Non renseigné</i>,
      width: 180,
    },
    {
      title: 'Type',
      dataIndex: 'type_equipement',
      key: 'type_equipement',
      render: (val) => val || <i>Non renseigné</i>,
      width: 150,
    },
    {
      title: 'Marque',
      dataIndex: ['marque', 'nom'],
      key: 'marque',
      sorter: true,
      render: (text, record) => record.marque?.nom || <i>Non renseigné</i>,
      width: 150,
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      filters: [
        { text: 'AC', value: 'AC' },
        { text: 'DC', value: 'DC' },
        { text: 'DC/AC', value: 'DC/AC' },
      ],
      onFilter: (value, record) => record.mode === value,
      render: (val) => (
        <Tag color={val === 'AC' ? 'blue' : val === 'DC' ? 'green' : 'purple'}>{val}</Tag>
      ),
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Space size="small" split="|">
          <Tooltip title="Visualiser">
            <Button
              onClick={() => navigate(`/dashboard/equipements/${record.id}`)}
              icon={<EyeOutlined />}
              type="link"
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              onClick={() => navigate(`/dashboard/equipements/${record.id}/edit`)}
              icon={<EditOutlined />}
              type="link"
            />
          </Tooltip>
          <Popconfirm
            title="Confirmer la suppression ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Tooltip title="Supprimer">
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Équipements</Breadcrumb.Item>
      </Breadcrumb>

      {/* Bouton Ajouter */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/dashboard/equipements/add')}
        >
          Ajouter un équipement
        </Button>
      </div>
      <h1>Liste des équipements</h1>

      {/* Barre de navigation vers catégories, types, marques */}
      <Menu mode="horizontal" selectable={false} style={{ marginBottom: 16 }}>
        <Menu.Item key="categories">
          <Link to="/dashboard/categories">Carracteristiques</Link>
        </Menu.Item>
    
      </Menu>

      <Table
        columns={columns}
        dataSource={equipements}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        scroll={{ x: 1300 }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}
