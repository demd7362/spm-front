import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import NotFound from '../pages/NotFound';
import React, {createContext, ReactElement, useMemo, useState} from 'react';
import Header from '../components/common/Header';
import Board from '../pages/Board';
import Quiz from '../pages/Quiz';
import Modal from '../components/common/Modal';
import useModal from '../hooks/useModal';
import BoardPost from '../components/board/BoardPost';

const ModalDefaultValue: ModalContext = {
    props: {
        title: '',
        content: '',
    },
    setProps: () => {},
    open: () => {},
    close: () => {},
    setAuto: (arg1, arg2) => {},
};
const HeaderDefaultValue: HeaderContext = {
    menu: <></>,
    setMenu: () => {},
    setDefault: () => {}
}


interface ContextStorage {
    modal:ModalContext;
    header:HeaderContext;
}

export const ContextStorage = createContext<ContextStorage>({
    modal: ModalDefaultValue,
    header: HeaderDefaultValue,
})
export default function AppRouter() {
    const [menu, setMenu] = useState<ReactElement>(<></>);
    const setDefault = () => {
        setMenu(()=> <></>);
    }
    const modal = useModal();
    return (
        <BrowserRouter>
            <ContextStorage.Provider value={{
                modal: modal,
                header: {menu,setMenu,setDefault}
            }}>
                <Modal {...modal.props}/>
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/board/:page" element={<Board />}/>
                    <Route path="/board/post" element={<BoardPost />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="sign/in" element={<SignIn />} />
                    <Route path="sign/up" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ContextStorage.Provider>
        </BrowserRouter>
    );
}
