import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Popconfirm, Space, Table, Tabs, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCategorie, deleteMarque, getCategories, getMarques } from '../../services/productApi';

const { TabPane } = Tabs; // ou dans AntD v5+ : import { Tabs } from 'antd'; et utiliser items props

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);


  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingMarques, setLoadingMarques] = useState(false);

  const [paginationCategories, setPaginationCategories] = useState({ current: 1, pageSize: 10, total: 0 });
  const [paginationMarques, setPaginationMarques] = useState({ current: 1, pageSize: 10, total: 0 });


  const [sorterCategories, setSorterCategories] = useState({});
  const [sorterMarques, setSorterMarques] = useState({});


  const navigate = useNavigate();

  // --- Chargement catégories ---
  const fetchCategories = useCallback(async (page = 1, pageSize = 10, sortField, sortOrder) => {
    setLoadingCategories(true);
    try {
      let ordering = '';
      if (sortField) ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
      const response = await getCategories(page, pageSize, '', ordering);
      const data = response.data;
      setCategories(data.results || data);
      setPaginationCategories({
        current: page,
        pageSize,
        total: data.count || (data.results ? data.results.length : data.length),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // --- Chargement marques ---
  const fetchMarques = useCallback(async (page = 1, pageSize = 10, sortField, sortOrder) => {
    setLoadingMarques(true);
    try {
      let ordering = '';
      if (sortField) ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
      const response = await getMarques(page, pageSize, '', ordering);
      const data = response.data;
      setMarques(data.results || data);
      setPaginationMarques({
        current: page,
        pageSize,
        total: data.count || (data.results ? data.results.length : data.length),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMarques(false);
    }
  }, []);



  // Chargement initial
  useEffect(() => {
    fetchCategories(paginationCategories.current, paginationCategories.pageSize, sorterCategories.field, sorterCategories.order);
    fetchMarques(paginationMarques.current, paginationMarques.pageSize, sorterMarques.field, sorterMarques.order);
 
  }, [fetchCategories, fetchMarques]);

  // Handlers de changement table avec pagination et tri
  const handleTableChangeCategories = (pag, filters, sort) => {
    setPaginationCategories({ ...paginationCategories, current: pag.current, pageSize: pag.pageSize });
    setSorterCategories({ field: sort.field, order: sort.order });
    fetchCategories(pag.current, pag.pageSize, sort.field, sort.order);
  };

  const handleTableChangeMarques = (pag, filters, sort) => {
    setPaginationMarques({ ...paginationMarques, current: pag.current, pageSize: pag.pageSize });
    setSorterMarques({ field: sort.field, order: sort.order });
    fetchMarques(pag.current, pag.pageSize, sort.field, sort.order);
  };



  // Suppression
  const handleDeleteCategorie = async (id) => {
    setLoadingCategories(true);
    try {
      await deleteCategorie(id);
      fetchCategories(paginationCategories.current, paginationCategories.pageSize, sorterCategories.field, sorterCategories.order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleDeleteMarque = async (id) => {
    setLoadingMarques(true);
    try {
      await deleteMarque(id);
      fetchMarques(paginationMarques.current, paginationMarques.pageSize, sorterMarques.field, sorterMarques.order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMarques(false);
    }
  };



  // Colonnes

  const columnsCategories = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: true,
      width: 300,
      fixed: 'left',
    },
    {
      title: 'Catégorie parente',
      dataIndex: ['parent', 'nom'],
      key: 'parent',
      sorter: true,
      width: 300,
      render: (text) => text || <i>Aucune</i>,
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
              onClick={() => navigate(`/dashboard/categories/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              type="link"
              onClick={() => navigate(`/dashboard/categories/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Confirmer la suppression ?"
              onConfirm={() => handleDeleteCategorie(record.id)}
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

  const columnsMarques = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: true,
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
              onConfirm={() => handleDeleteMarque(record.id)}
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
        <Breadcrumb.Item>Gestion</Breadcrumb.Item>
      </Breadcrumb>

      <Tabs defaultActiveKey="1" type="line" destroyInactiveTabPane={false}>
        <TabPane tab="Catégories" key="1">
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/dashboard/categories/add')}
          >
            Ajouter une catégorie
          </Button>
          <Table
            columns={columnsCategories}
            dataSource={categories}
            rowKey="id"
            loading={loadingCategories}
            pagination={paginationCategories}
            scroll={{ x: 800 }}
            onChange={handleTableChangeCategories}
            bordered
          />
        </TabPane>

        <TabPane tab="Marques" key="2">
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/dashboard/marques/add')}
          >
            Ajouter une marque
          </Button>
          <Table
            columns={columnsMarques}
            dataSource={marques}
            rowKey="id"
            loading={loadingMarques}
            pagination={paginationMarques}
            scroll={{ x: 600 }}
            onChange={handleTableChangeMarques}
            bordered
          />
        </TabPane>

      
      </Tabs>
    </div>
  );
}
