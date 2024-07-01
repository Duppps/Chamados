import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import ThemeSelector from "./components/themeSelector";

const Header = ({ pageName }) => {
    const router = useRouter();
    const pathname = usePathname();
    let buttonBack = null;

    if (pathname !== '/') {
        buttonBack = (
            <button onClick={() => router.back()} className="btn btn-secondary">
                <FaArrowLeft /> Voltar
            </button>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <div className="row w-100 py-2">
                    <div className="col-3">
                        {buttonBack}
                    </div>
                    <div className="col-6 d-flex justify-content-center align-items-center text-end">
                        <h3 className="fw-bold">{pageName}</h3>
                    </div>
                    <div className="col-3 text-end">
                        <ThemeSelector />                        
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
