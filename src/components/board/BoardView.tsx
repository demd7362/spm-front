import {useNavigate, useParams} from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Spinner from "../common/Spinner";
import dateUtil from "../../utils/dateUtil";
import {ContextStorage} from "../../router/AppRouter";

export default function BoardView() {
    const params = useParams();
    const {header,modal} = useContext(ContextStorage);
    const [data,setData] = useState<BoardInfo | null>(null);
    const fetch = useFetch();
    const navigate = useNavigate();

    useEffect(() => {
        fetch.get(`/board/view/${params.num}`)
            .then(result => {
                fetch.resultHandler(result,(data:BoardInfo)=> {
                    const {biContent,biTitle,biId,biChanged,biCreated} = data;
                    setData(({
                        biContent,
                        biTitle,
                        biId,
                        biCreated,
                        biChanged
                    }));
                    const handleClickModify = async ()=>{
                        const result = await fetch.patch(`/board/update/${params.num}`);
                        fetch.resultHandler(result);
                    }
                    const handleClickDelete = async ()=> {
                        modal.confirm('게시글 삭제','게시글을 정말로 삭제할까요?',async () => {
                            const result = await fetch.$delete(`/board/delete/${params.num}`);
                            fetch.resultHandler(result,()=> {
                                navigate('/board/1');
                            });
                        })
                    }
                    header.setMenu(()=> {
                        return (
                            <>
                                <button onClick={handleClickModify}>[수정]</button>
                                <button onClick={handleClickDelete}>[삭제]</button>
                            </>
                        )
                    })
                })
            })
        return () => {
            header.setDefault();
        }
    }, []);
    const renderCreateDate = useCallback(()=> {
        if(!data) return null;
        const {years,months,days,hours,minutes,seconds} = dateUtil.parseDate(data.biCreated);
        return (
            <>
                <p className="text-sm font-light">{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분 ${seconds}초`}</p>
            </>
        )
    },[data])
    if(!data) return <Spinner/>

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{data.biTitle}</h1>
                <div className="w-full max-w-[calc(100%-1rem)]">
                    <div className="border rounded-lg p-4 shadow-md">
                        <div dangerouslySetInnerHTML={{ __html: data.biContent }} className="text-gray-700"/>
                        <div className="text-right mt-4">
                            <p className="text-sm font-light">작성자: {data.biId}</p>
                            {renderCreateDate()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
