import "./Navbar.scss";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {

    const navigate = useNavigate();
    const { user, handleLogout } = useAuth();

    const onLogout = async () => {
        const success = await handleLogout();

        if (success) {
            navigate("/login");
        }
    };

    return (
        <nav className="navbar">

            <div className="navbar-left">
                <span className="navbar-user">
                    Welcome, <strong>{user?.username}</strong> 👋
                </span>
            </div>

            <div
                className="navbar-center"
                onClick={() => navigate("/")}
            >
                <h1 className="navbar-logo">
                    Career<span>Forge</span>
                </h1>

                <p className="navbar-subtitle">
                    AI Interview Preparation
                </p>
            </div>

            <div className="navbar-right">

                <button
                    className="logout-btn"
                    onClick={onLogout}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>

                    Logout
                </button>

            </div>

        </nav>
    );
};

export default Navbar;