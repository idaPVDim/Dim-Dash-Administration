import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Input,
  message,
  Popconfirm,
  Row,
  Col,
  Space,
  Table,
  Tabs,
  Tooltip,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCategorie, deleteMarque, getCategories, getMarques } from '../../services/productApi';

const { TabPane } = Tabs;
const { Search } = Input;

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingMarques, setLoadingMarques] = useState(false);

  const [paginationCategories, setPaginationCategories] = useState({ current: 1, pageSize: 20, total: 0 });
  const [paginationMarques, setPaginationMarques] = useState({ current: 1, pageSize: 20, total: 0 });

  const [sorterCategories, setSorterCategories] = useState({});
  const [sorterMarques, setSorterMarques] = useState({});

  const [searchCategories, setSearchCategories] = useState('');
  const [searchMarques, setSearchMarques] = useState('');

  const [activeTab, setActiveTab] = useState('1');

  const navigate = useNavigate();

  const fetchCategories = useCallback(async (page, pageSize, sortField, sortOrder, search) => {
    setLoadingCategories(true);
    try {
      let ordering = '';
      if (sortField) ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
      const response = await getCategories(page, pageSize, search, ordering);
      const data = response.data;
      setCategories(data.results || data);
      setPaginationCategories({
        current: page,
        pageSize,
        total: data.count || (data.results ? data.results.length : data.length),
      });
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des catégories");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const fetchMarques = useCallback(async (page, pageSize, sortField, sortOrder, search) => {
    setLoadingMarques(true);
    try {
      let ordering = '';
      if (sortField) ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
      const response = await getMarques(page, pageSize, search, ordering);
      const data = response.data;
      setMarques(data.results || data);
      setPaginationMarques({
        current: page,
        pageSize,
        total: data.count || (data.results ? data.results.length : data.length),
      });
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des marques");
    } finally {
      setLoadingMarques(false);
    }
  }, []);

  useEffect(() => {
    if(activeTab === '1') {
      fetchCategories(paginationCategories.current, paginationCategories.pageSize, sorterCategories.field, sorterCategories.order, searchCategories);
    } else if(activeTab === '2') {
      fetchMarques(paginationMarques.current, paginationMarques.pageSize, sorterMarques.field, sorterMarques.order, searchMarques);
    }
  }, [activeTab,
      fetchCategories, fetchMarques,
      paginationCategories, paginationMarques,
      sorterCategories, sorterMarques,
      searchCategories, searchMarques
    ]);

  const handleDeleteCategorie = async (id) => {
    setLoadingCategories(true);
    try {
      await deleteCategorie(id);
      message.success("Catégorie supprimée");
      fetchCategories(paginationCategories.current, paginationCategories.pageSize, sorterCategories.field, sorterCategories.order, searchCategories);
    } catch {
      message.error("Erreur lors de la suppression");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleDeleteMarque = async (id) => {
    setLoadingMarques(true);
    try {
      await deleteMarque(id);
      message.success("Marque supprimée");
      fetchMarques(paginationMarques.current, paginationMarques.pageSize, sorterMarques.field, sorterMarques.order, searchMarques);
    } catch {
      message.error("Erreur lors de la suppression");
    } finally {
      setLoadingMarques(false);
    }
  };

  const handleTableChangeCategories = (pag, filters, sort) => {
    setPaginationCategories({ ...paginationCategories, current: pag.current, pageSize: pag.pageSize });
    setSorterCategories({ field: sort.field, order: sort.order });
  };

  const handleTableChangeMarques = (pag, filters, sort) => {
    setPaginationMarques({ ...paginationMarques, current: pag.current, pageSize: pag.pageSize });
    setSorterMarques({ field: sort.field, order: sort.order });
  };

  const columnsCategories = [
    { title: 'Nom', dataIndex: 'nom', key: 'nom', sorter: true, width: 300, fixed: 'left' },
    { title: 'Catégorie parente', dataIndex: ['parent', 'nom'], key: 'parent', sorter: true, width: 300, render: text => text || <i>Aucune</i> },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" split="|">
          <Tooltip title="Visualiser">
            <Button icon={<EyeOutlined />} type="link" onClick={() => navigate(`/dashboard/categories/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button icon={<EditOutlined />} type="link" onClick={() => navigate(`/dashboard/categories/${record.id}/edit`)} />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm title="Confirmer la suppression ?" onConfirm={() => handleDeleteCategorie(record.id)} okText="Oui" cancelText="Non">
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnsMarques = [
    { title: 'Nom', dataIndex: 'nom', key: 'nom', sorter: true, width: 300, fixed: 'left' },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" split="|">
          <Tooltip title="Visualiser">
            <Button icon={<EyeOutlined />} type="link" onClick={() => navigate(`/dashboard/marques/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button icon={<EditOutlined />} type="link" onClick={() => navigate(`/dashboard/marques/${record.id}/edit`)} />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm title="Confirmer la suppression ?" onConfirm={() => handleDeleteMarque(record.id)} okText="Oui" cancelText="Non">
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/dashboard">Tableau de bord</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Gestion</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="line" destroyInactiveTabPane={false} >
            <TabPane
              tab={
                <Space>
                  Catégories
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/dashboard/categories/add');
                    }}
                  >
                    Ajouter
                  </Button>
                  <Search
                    placeholder="Rechercher catégories"
                    allowClear
                    size="small"
                    enterButton
                    onSearch={(text) => setSearchCategories(text.trim())}
                    style={{ width: 180 }}
                    onClick={e => e.stopPropagation()} // Empêche switch onglet si clic sur input
                  />
                </Space>
              }
              key="1"
            />
            <TabPane
              tab={
                <Space>
                  Marques
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/dashboard/marques/add');
                    }}
                  >
                    Ajouter
                  </Button>
                  <Search
                    placeholder="Rechercher marques"
                    allowClear
                    size="small"
                    enterButton
                    onSearch={text => setSearchMarques(text.trim())}
                    style={{ width: 180 }}
                    onClick={e => e.stopPropagation()}
                  />
                </Space>
              }
              key="2"
            />
          </Tabs>
        </Col>
      </Row>

      {activeTab === '1' && (
        <Table
          columns={columnsCategories}
          dataSource={categories}
          rowKey="id"
          size='small'
          loading={loadingCategories}
          pagination={paginationCategories}
          scroll={{ x: 800 }}
          onChange={handleTableChangeCategories}
          bordered
        />
      )}

      {activeTab === '2' && (
        <Table
          columns={columnsMarques}
          dataSource={marques}
          rowKey="id"
          size='small'
          loading={loadingMarques}
          pagination={paginationMarques}
          scroll={{ x: 600 }}
          onChange={handleTableChangeMarques}
          bordered
        />
      )}
    </div>
  );
}
