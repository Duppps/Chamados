"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
    { value: "name", label: "Nome" },
    { value: "address", label: "Endereço" }
];

const Units = () => {
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [submitType, setSubmitType] = useState('');
    const [currentUnit, setCurrentUnit] = useState({
        id: '',
        name: '',
        address: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/units/`);
                if (res.status === 200) {
                    setData(res.data);
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleModalOpen = async (action, mode, idUnit) => {
        setModalTitle(`${action} Unidade`);
        setModeModal(mode);

        if (mode != "add") {
            try {
                const res = await axios.get(`${API_BASE_URL}/units/${idUnit}`);
                if (res.status === 200) {
                    setCurrentUnit({
                        id: res.data.id,
                        name: res.data.name,
                        address: res.data.address
                    });
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentUnit({
                id: '',
                name: '',
                address: ''
            });
        }
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUnit({
            ...currentUnit,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;

            if (submitType === "delete") {
                res = await axios.delete(`${API_BASE_URL}/units/${currentUnit.id}`);
            } else if (submitType === "add") {
                res = await axios.post(`${API_BASE_URL}/units/`, currentUnit);
            } else if (submitType === "update") {
                res = await axios.put(`${API_BASE_URL}/units/${currentUnit.id}`, currentUnit);
            } else {
                console.error('Invalid submit type');
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentUnit({
                    id: '',
                    name: '',
                    address: '',
                });

                window.location.reload();
            } else {
                console.error('Error', res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <Header pageName="Gerenciar Unidades" />
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/units`}
                    onCreate={() => handleModalOpen('Criar', 'add')}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                />
                <Table
                    columns={columns}
                    data={data}
                    modalID="modal"
                    mode="admin"
                    handleModalOpen={handleModalOpen}
                    filterText={filterText}
                />
            </div>

            <div className="modal fade" id="modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="title_modal">
                                {modalTitle}
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {modeModal != "delete" && (
                                    <>
                                        <div>
                                            <label htmlFor="name" className="form-label">
                                                Nome
                                            </label>
                                            <input
                                                name="name"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentUnit.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="address" className="form-label">
                                                Endereço
                                            </label>
                                            <input
                                                name="address"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentUnit.address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {modeModal === "delete" && (
                                    <>
                                        Deseja excluir a unidade {currentUnit.name}?
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                {modeModal === "update" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType('update')}
                                    >
                                        Atualizar
                                    </button>
                                )}
                                {modeModal === "add" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType('add')}
                                    >
                                        Criar
                                    </button>
                                )}
                                {modeModal === "delete" && (
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() => setSubmitType('delete')}
                                    >
                                        Excluir
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Units;
