import React from 'react';
import AppRouter from './router/AppRouter';
import {Provider} from "react-redux";
import authStore from "./stores/authStore";

export default function App() {
    return (
        <Provider store={authStore}>
            <AppRouter />
        </Provider>
    )
}
