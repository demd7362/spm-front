import React, {ChangeEvent, FormEvent, KeyboardEventHandler, useState} from 'react';
import useFetch from "../hooks/useFetch";

export default function WriteBoard() {
    const [content,setContent] = useState('');
    const ajax = useFetch();
    const handleSubmit = async () => {
        const result = await ajax.post('/board/insert',{
            biContent: content
        });
        const {message,status} = result;
        switch(status){
            case 200 :
                window.location.reload();
                break;
            default :
                alert(message);
        }
    }
    const handleKeyUp = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') handleSubmit();
    }
    const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }
    return (
        <>
            <input onChange={handleInputChange} onKeyUp={handleKeyUp} value={content} className={'bg-blue-200'}/>
            <button onClick={handleSubmit} >글쓰기</button>
        </>
    )
}
