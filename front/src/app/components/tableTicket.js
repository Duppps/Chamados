import React, { useState, useEffect } from 'react';
import Pagination from './pagination/pagination';
import ItemsPerPage from './pagination/itemsPerPage';
import axiosInstance from "../components/axiosConfig";
import { format } from 'date-fns';
import styles from "./table/table.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TableTicket = ({ viewMode = 'readonly' }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('Aberto');

    const columns = [
        { label: 'ID', value: 'id' },
        { label: 'Assunto', value: 'name' },
        { label: 'Status', value: 'status' },
        { label: 'Urgência', value: 'urgency' },
        { label: 'Data de Criação', value: 'createdAt' },
        { label: 'Última Atualização', value: 'updatedAt' }
    ];

    if (viewMode === 'edit') {
        columns.push({ label: 'Usuário', value: 'user.name' });
    }

    const fetchData = async () => {
        try {
            let url;

            switch (viewMode) {
                case 'edit':
                    url = `${API_BASE_URL}/tickets/pageable?page=${currentPage}&size=${pageSize}&status=${status}`;
                    break;
                case 'readonly':
                    url = `${API_BASE_URL}/tickets/user?page=${currentPage}&size=${pageSize}&status=${status}`;
                    break;
                default:
                    break;
            }

            const res = await axiosInstance.get(url);

            if (res.status === 200) {
                setData(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                console.error('Erro:', res.status);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, status, viewMode]);

    const handleSearch = async (e) => {
        const query = e.target.value;

        if (query.length >= 3) {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/tickets/search`, {
                    params: { query },
                });

                if (res.status === 200) {
                    setData(res.data);
                } else {
                    console.error('Erro na pesquisa:', res.status);
                }
            } catch (error) {
                console.log('Search Error:', error);
            }
        } else {
            fetchData();
        }
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setCurrentPage(0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    return (
        <div className="container">
            <div className="row align-items-center my-3">
                <div className="col">
                    <ItemsPerPage
                        onPageSizeChange={handlePageSizeChange}
                        pageSize={pageSize}
                    />
                </div>
                <div className="col">
                    <select value={status} onChange={handleStatusChange}>
                        <option value="Novo">Abertos</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Fechado">Fechados</option>
                        <option value="ALL">Todos</option>
                    </select>
                </div>
                <div className="col-2">
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        className="input-text"
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <table className='w-100 table table-custom table-hover'>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.value === 'name' ? (
                                        <a href={`chamados/${item.id}`} className="fw-semibold text-decoration-underline">
                                            {getNestedValue(item, column.value)}
                                        </a>
                                    ) : column.value.includes('createdAt') ||
                                        column.value.includes('updatedAt') ||
                                        column.value.includes('closedAt') ? (
                                        formatDate(item[column.value])
                                    ) : (
                                        getNestedValue(item, column.value) || 'N/A'
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default TableTicket;
