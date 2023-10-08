import { useCallback, useEffect, useMemo, useState } from 'react';

const PREFIX = process.env.REACT_APP_API_URL;


export default function useFetch() {
    const [jwt, setJwt] = useState<Jwt>((): Jwt => {
        const key = localStorage.getItem('key') || '{}';
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
            if(response.status === 500){
                return {
                    message: '인증되지 않은 사용자입니다.',
                    status: 500
                }
            }
            return await response.json();
        },
        [defaultHeaders]
    );

    const post = useCallback(
        async (url: string, body: object) => {
            console.log('url', url);
            console.log('defaultHeaders', defaultHeaders.headers);
            console.log('body', body);
            const response = await fetch(PREFIX + url, {
                ...defaultHeaders,
                method: 'POST',
                body: JSON.stringify(body),
            });
            console.log('response',response)
            if(response.status === 500){
                return {
                    message: '인증되지 않은 사용자입니다.',
                    status: 500
                }
            }
            return await response.json();
        },
        [defaultHeaders],
    );

    return { get, post };
}
