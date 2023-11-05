import {useEffect, useState} from "react";

export default function useAuthorization (jwt:Jwt)  {
    const [isAuthorized, setAuthorized] = useState<boolean>(false);
    useEffect(()=>{
        // 인증 요청을 하는 코드
    },[])
}

