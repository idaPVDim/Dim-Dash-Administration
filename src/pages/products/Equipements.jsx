import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  message,
  Popconfirm,
  Row,
  Col,
  Space,
  Table,
  Tag,
  Tooltip,
  Input,
} from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEquipement, getEquipements } from '../../services/productApi';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Search } = Input;

export default function Equipements() {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 13, total: 0 });
  const [sorter, setSorter] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchEquipements = useCallback(
    async (page = 1, pageSize = 10, sortField, sortOrder, search = '') => {
      setLoading(true);
      try {
        let ordering = '';
        if (sortField) {
          ordering = (sortOrder === 'descend' ? '-' : '') + sortField;
        }
        const response = await getEquipements(page, pageSize, search, ordering);
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
    },
    []
  );

  useEffect(() => {
    fetchEquipements(pagination.current, pagination.pageSize, sorter.field, sorter.order, searchText);
  }, [fetchEquipements, pagination.current, pagination.pageSize, sorter, searchText]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteEquipement(id);
      message.success('Équipement supprimé');
      fetchEquipements(pagination.current, pagination.pageSize, sorter.field, sorter.order, searchText);
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
  };

  const onSearch = () => {
    setSearchText(searchInput.trim());
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const exportToExcel = () => {
    const dataToExport = equipements.map(({ id, nom, categorie, type_equipement, marque, mode }) => ({
      ID: id,
      Nom: nom || '',
      Catégorie: categorie?.nom || '',
      Type: type_equipement || '',
      Marque: marque?.nom || '',
      Mode: mode || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Équipements');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'equipements.xlsx');
  };

  const columns = [
    { title: 'Nom', dataIndex: 'nom', key: 'nom', sorter: true, render: t => t || <i>-</i>, fixed: 'left', width: 200 },
    { title: 'Catégorie', dataIndex: ['categorie', 'nom'], key: 'categorie', sorter: true, render: (_, r) => r.categorie?.nom || <i>-</i>, width: 180 },
    { title: 'Type', dataIndex: 'type_equipement', key: 'type_equipement', render: v => v || <i>-</i>, width: 150 },
    { title: 'Marque', dataIndex: ['marque', 'nom'], key: 'marque', sorter: true, render: (_, r) => r.marque?.nom || <i>-</i>, width: 150 },
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
      render: val => <Tag color={val === 'AC' ? 'blue' : val === 'DC' ? 'green' : 'purple'}>{val}</Tag>,
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
            <Button onClick={() => navigate(`/dashboard/equipements/${record.id}`)} icon={<EyeOutlined />} type="link" />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button onClick={() => navigate(`/dashboard/equipements/${record.id}/edit`)} icon={<EditOutlined />} type="link" />
          </Tooltip>
          <Popconfirm title="Confirmer la suppression ?" onConfirm={() => handleDelete(record.id)} okText="Oui" cancelText="Non">
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
      <Row align="middle" justify="space-between" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/dashboard">Tableau de bord</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Équipements</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Space size="middle" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/dashboard/equipements/add')}
            >
              Ajouter un équipement
            </Button>

            <Button
              onClick={() => navigate('/dashboard/categories')}
            >
              Caractéristiques
            </Button>

            <Button icon={<DownloadOutlined />} onClick={exportToExcel}>
              Exporter en Excel
            </Button>

            <Search
              placeholder="Rechercher un équipement..."
              allowClear
              enterButton
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onSearch={onSearch}
              style={{ width: 300, minWidth: 200 }}
            />
          </Space>
        </Col>
      </Row>

      

      <Table
        columns={columns}
        dataSource={equipements}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={pagination}
        scroll={{ x: 1300 }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}
