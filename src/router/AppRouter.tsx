import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import NotFound from '../pages/NotFound';
import React, {createContext, useMemo} from 'react';
import Header from '../components/common/Header';
import Board from '../pages/Board';
import Quiz from '../pages/Quiz';
import Modal from '../components/common/Modal';
import useModal from '../hooks/useModal';

const defaultValue: ModalReturnProps = {
    props: {
        title: '',
        content: '',
    },
    setProps: () => {},
    open: () => {},
    close: () => {},
    setAuto: (arg1, arg2) => {},
};
export const ModalContext  = createContext<ModalReturnProps>(defaultValue);
export default function AppRouter() {
    const modal = useModal();
    const modalProviderValue = useMemo(() => ({...modal}), [modal]);
    return (
        <BrowserRouter>
            <ModalContext.Provider value={modalProviderValue}>
                <Modal {...modalProviderValue.props}/>
                <Header />
                <Routes>
                    <Route path={'/'} element={<Main />} />
                    <Route path={'/board'} element={<Board />} />
                    <Route path={'/quiz'} element={<Quiz />} />
                    <Route path={'/sign/in'} element={<SignIn />} />
                    <Route path={'/sign/up'} element={<SignUp />} />
                    <Route path={'*'} element={<NotFound />} />
                </Routes>
            </ModalContext.Provider>
        </BrowserRouter>
    );
}
