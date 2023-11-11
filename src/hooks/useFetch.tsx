import { useCallback, useContext, useMemo, useState } from 'react';
import {ContextStorage} from '../router/AppRouter';
import { useNavigate } from 'react-router-dom';

const PREFIX = process.env.REACT_APP_API_URL;
const SERVER_ERROR_MESSAGE = 'INTERNAL_SERVER_ERROR';
export default function useFetch() {
    const {modal} = useContext(ContextStorage);
    const navigate = useNavigate();
    const [jwt, setJwt] = useState<Jwt>((): Jwt => {
        const key = sessionStorage.getItem('key') || '{}';
        return JSON.parse(key);
    });
    const defaultHeaders = useMemo(
        () => ({
            headers: {
                'content-type': 'application/json',
                Authorization: jwt.grantType + ' ' + jwt.accessToken,
            },
        }),
        [jwt.grantType, jwt.accessToken],
    );

    const get = useCallback(
        async (url: string) => {
            try {
                const response = await fetch(PREFIX + url, defaultHeaders);
                return await response.json();
            } catch (e:any){
                modal.setAuto(SERVER_ERROR_MESSAGE,e.stack);
            }
        },
        [defaultHeaders],
    );

    const post = useCallback(
        async (url: string, body?: object) => {
            const response = await fetch(PREFIX + url, {
                ...defaultHeaders,
                method: 'POST',
                body: JSON.stringify(body),
            });
            return await response.json();
        },
        [defaultHeaders],
    );

    const resultHandler = useCallback(
        (
            { text, status, message, response, data }: FetchResult,
            callback?: (data?:any) => void,
        ) => {
            switch(status){
                case 200 :
                    callback?.(data);
                    break;
                case 401 :
                    modal.setAuto(message,text,()=>{
                        navigate('/sign/in');
                    });
                    break;
                default :
                    modal.setAuto(message,text);
            }
        },
        []
    );

    return { get, post, jwt, resultHandler };
}
