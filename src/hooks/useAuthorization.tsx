import {useEffect, useState} from "react";

const useAuthorization = (jwt:Jwt) => {
    const [isAuthorized, setIsAuthorized] = useState<Boolean>(false);
    useEffect(()=>{
        // 인증 요청을 하는 코드
    },[])
}

export default useAuthorization;
