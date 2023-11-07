import {ReactElement, useState} from 'react';
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(
        sessionStorage.getItem('key') !== null
    );
    const navigate = useNavigate();
    const handleSignOut = () => {
        sessionStorage.removeItem('key');
        window.location.replace(window.location.href);
    }
    const renderByLoggedIn = (): ReactElement => {
        const commonProps = { className: "hover:text-gray-300" };
        const loggingElement = isLoggedIn ? <Link {...commonProps} to={''} onClick={handleSignOut}>로그아웃</Link> : <Link {...commonProps} to={"/sign/in"}>로그인</Link>
        return (
            <>
                {loggingElement}
                <Link {...commonProps} to={"/sign/up"}>회원가입</Link>
            </>
        );

    };
    return (
        <div className="bg-black text-white top-0 sticky z-10 w-full">
            <div className="container mx-auto flex justify-between p-4">
                <div className="font-bold text-lg space-x-3">
                    <Link to={'/'}>메인</Link>
                    <Link to={'/board'}>방명록</Link>
                    <Link to={'/quiz'}>문제</Link>
                </div>
                <nav className="space-x-4">
                    {renderByLoggedIn()}
                </nav>
            </div>
        </div>
    );
}
