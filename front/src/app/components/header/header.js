import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import styles from "./header.css";

import ThemeSelector from "../themeSelector";
import getUserData from "../getUserData";

const Header = ({ pageName }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getUserData();
            setUser(userData);
        };
        fetchData();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        location.reload();
    }

    let buttonBack = null;

    if (pathname !== '/') {
        buttonBack = (
            <button onClick={() => router.back()} className="btn btn-go-back">
                <FaArrowLeft /> Voltar
            </button>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg header-style">
            <div className="container">
                <div className="row w-100 py-2">
                    <div className="col-3">
                        {buttonBack}
                    </div>
                    <div className="col-6 d-flex justify-content-center">
                        <h3 className="fw-bold my-auto">{pageName}</h3>
                    </div>
                    <div className="col-3 text-end">
                        <button className="btn btn-settings" data-bs-toggle="modal" data-bs-target="#configModal">
                            <FaGear />
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="configModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Configurações</h5>
                            <div className="ms-auto"><ThemeSelector /></div>
                        </div>
                        <div className="modal-body">
                            {user ? (
                                <div className="row">
                                    <div className="col">
                                        <span className="fw-semibold">
                                            {user.name} </span>
                                        <button type="button" className="btn btn-warning btn-sm ms-3" onClick={logout}>
                                            Sair
                                        </button><br />
                                        {user.sub} <br />
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
