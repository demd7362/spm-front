import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import NotFound from '../pages/NotFound';
import React from 'react';
import Search from '../pages/Search';
import Header from "../components/Header";
import Board from "../pages/Board";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={'/'} element={<Main />} />
                <Route path={'/board'} element={<Board />} />
                <Route path={'/sign/in'} element={<SignIn />} />
                <Route path={'/sign/up'} element={<SignUp />} />
                <Route path={'*'} element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
