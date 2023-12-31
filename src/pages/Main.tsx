import React from 'react';
import Header from '../components/common/Header';
import dog from '../assets/dog.jpg';
import ajax from '../hooks/useFetch';
import useFetch from "../hooks/useFetch";

const API_URL = process.env.REACT_APP_API_URL;
export default function Main() {
    const fetch = useFetch();
    return (
        <>
            <div className={'h-screen flex items-center'}>
                <div className={'container m-auto'}>
                    <div className={'mb-3 flex items-center justify-center'}>
                        <img src={dog} onClick={async ()=> {
                            const {refreshToken} = fetch.jwt;
                            console.log(refreshToken)
                            const result:FetchResult = await fetch.get('/auth/info');
                            console.log(result)
                        }}/>
                    </div>
                    <div className={'bg-red-100 text-center space'}>
                    </div>
                </div>
            </div>
        </>
    );
}
