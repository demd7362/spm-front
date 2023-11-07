import { useCallback, useContext, useMemo, useState } from 'react';
import { ModalContext } from '../router/AppRouter';

const PREFIX = process.env.REACT_APP_API_URL;

export default function useFetch() {
    const modal = useContext(ModalContext);
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
            console.log('url', url);
            console.log('defaultHeaders', defaultHeaders.headers);
            const response = await fetch(PREFIX + url, defaultHeaders);
            return await response.json();
        },
        [defaultHeaders],
    );

    const post = useCallback(
        async (url: string, body?: object) => {
            console.log('url', url);
            console.log('defaultHeaders', defaultHeaders.headers);
            console.log('body', body);
            const response = await fetch(PREFIX + url, {
                ...defaultHeaders,
                method: 'POST',
                body: JSON.stringify(body),
            });
            console.log('response', response);
            return await response.json();
        },
        [defaultHeaders],
    );

    const handler = useCallback(
        (
            { text, status, message, response, data }: FetchResult,
            callback?: () => void | null,
        ) => {
            if (status === 200 && callback) {
                callback();
            } else {
                modal.setAuto(message,text);
            }
        },
        [],
    );

    return { get, post, jwt, handler };
}
