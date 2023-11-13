import {ChangeEvent, ChangeEventHandler, useCallback, useContext, useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import { ContextStorage } from '../../router/AppRouter';
import useFetch from "../../hooks/useFetch";
import {useNavigate} from "react-router-dom";

export default function BoardEditor() {
    const [data,setData] = useState<BoardInfo>({
        biTitle: '',
        biContent: ''
    });
    const {header} = useContext(ContextStorage);
    const fetch = useFetch();
    const navigate = useNavigate();
    const handleSubmit = useCallback(() => {
        fetch.post('/board/insert',data)
            .then(result => {
                fetch.resultHandler(result,()=>{
                    navigate('/board/1');
                });
            })
    },[data])
    useEffect(() => {
        console.log('header effect')
        header.setMenu(() => {
            return <button onClick={handleSubmit}>[작성 완료]</button>
        })
        return () => {
            header.setDefault();
        }
    }, [handleSubmit]);

    const handleTitleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({
            ...prev,
            biTitle: e.target.value
        }))
    };
    const handleContentChange = (content:string) => {
        setData(prev => ({
            ...prev,
            biContent: content
        }))

    };



    return (
        <div className={'p-2'}>
            <input type="text" onChange={handleTitleChange} value={data.biTitle} className={'w-full max-w-[calc(100%-1rem)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 m-2 focus:border-transparent'} placeholder="제목을 입력하세요" />
            <ReactQuill className={'m-2 h-80vh'} value={data.biContent} onChange={handleContentChange} />
        </div>
    );
}
