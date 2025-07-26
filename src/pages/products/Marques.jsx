import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteMarque, getMarques } from '../../services/productApi';

export default function MarquesList() {
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({});
  const navigate = useNavigate();

  const fetchMarques = useCallback(async (page = 1, pageSize = 10, sortField, sortOrder) => {
    setLoading(true);
    try {
      let ordering = '';
      if (sortField) {
        ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
      }
      const response = await getMarques(page, pageSize, '', ordering);
      const data = response.data;
      setMarques(data.results || data);
      setPagination({
        current: page,
        pageSize,
        total: data.count || (data.results ? data.results.length : data.length),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarques(pagination.current, pagination.pageSize, sorter.field, sorter.order);
  }, [fetchMarques, pagination.current, pagination.pageSize, sorter]);

  const handleTableChange = (pag, filters, sort) => {
    setPagination({ ...pagination, current: pag.current, pageSize: pag.pageSize });
    setSorter({ field: sort.field, order: sort.order });
    fetchMarques(pag.current, pag.pageSize, sort.field, sort.order);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteMarque(id);
      fetchMarques(pagination.current, pagination.pageSize, sorter.field, sorter.order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: true,
      render: (text) => text || <i>Non renseigné</i>,
      width: 300,
      fixed: 'left',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" split="|">
          <Tooltip title="Visualiser">
            <Button
              icon={<EyeOutlined />}
              type="link"
              onClick={() => navigate(`/dashboard/marques/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              type="link"
              onClick={() => navigate(`/dashboard/marques/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Confirmer la suppression ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Marques</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Liste des marques</h1>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/dashboard/marques/add')}
      >
        Ajouter une marque
      </Button>

      <Table
        columns={columns}
        dataSource={marques}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        scroll={{ x: 600 }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}
