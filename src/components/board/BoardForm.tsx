import useFetch from '../../hooks/useFetch';
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import dateUtil from '../../utils/dateUtil';
import Spinner from '../common/Spinner';
import BoardInput from './BoardInput';
import Pagination from '../common/Pagination';
import {useLocation, useSearchParams} from "react-router-dom";
import {ModalContext} from "../../router/AppRouter";

const BOTTOM_SIZE = 5;
const PAGE_SIZE_MULTIPLE_VALUE = 5;

export default function BoardForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const modal = useContext(ModalContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [renderTrigger,setRenderTrigger] = useState<number>(0);
    const fetch = useFetch();
    const [data, setData] = useState<BoardInfo[]>([]);
    const [pagination, setPagination] = useState<Paginations>({
        page: Number(searchParams.get('page') || '1'),
        pageSize: 5,
        totalPage: 1,
    });
    useEffect(() => {
        console.log('Fetch Effect')
        fetch.get(
            `/board/list/${pagination.page}/${pagination.pageSize}`,
        ).then(result => {
            const { text, data, message } = result;
            fetch.resultHandler(result,()=>{
                setData(data);
                if (data.length > 0) {
                    const { page, pageSize, totalPage } = data[0];
                    setPagination({
                        pageSize,
                        totalPage,
                        page,
                    });
                    setSearchParams({page:page.toString()})
                } else {
                    modal.setAuto(message,text);
                }
            })
        })
    }, [pagination.page,pagination.pageSize,renderTrigger]);
    const handlePrev = () => {
        setPagination((prev) => {
            const { page:prevPage, totalPage } = prev;
            const page = Math.max(prevPage - BOTTOM_SIZE, 1);
            const firstNumber = Math.floor((page - 1) / BOTTOM_SIZE) * BOTTOM_SIZE + 1;
            const lastNumber = Math.min(firstNumber + BOTTOM_SIZE - 1, totalPage);
            const currentPage = Math.floor(Math.max((prevPage - 1),1) / BOTTOM_SIZE ) === 0 ? 1 : lastNumber;
            return {
                ...prev,
                page: currentPage,
            };
        });
    };
    const handleNext = () => {
        setPagination((prev) => {
            const { page:prevPage, totalPage } = prev;
            const page = Math.min(prevPage + BOTTOM_SIZE, totalPage);
            const firstNumber = page - (page % BOTTOM_SIZE) + 1;
            // const lastNumber = Math.min(firstNumber + BOTTOM_SIZE - 1, totalPage);
            let currentPage = Math.min(firstNumber, page);
            currentPage = totalPage - prevPage < BOTTOM_SIZE ? totalPage : currentPage;
            return {
                ...prev,
                page: currentPage,
            };
        });
    };
    const handleClickPage = (page: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page,
            };
        });
    };
    const handleOptionChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            const pageSize = Number(e.target.value);
            if (isNaN(pageSize)) return;
            setPagination((prev: Paginations) => {
                return {
                    ...prev,
                    page: 1,
                    pageSize,
                };
            });
        },
        [],
    );

    const renderOptions = useCallback(() => {
        return [...new Array(6)].map((_, index) => {
            return (
                <React.Fragment key={index}>
                    <option value={(index + 1) * PAGE_SIZE_MULTIPLE_VALUE}>
                        {(index + 1) * PAGE_SIZE_MULTIPLE_VALUE}
                    </option>
                </React.Fragment>
            );
        });
    }, []);
    if (loading) return <Spinner />;
    return (
        <>
            <div className={'container mx-auto'}>
                <div className={'flex items-baseline'}>
                    <BoardInput setRenderTrigger={setRenderTrigger}/>
                    <select
                        className={
                            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        }
                        onChange={handleOptionChange}
                    >
                        {renderOptions()}
                    </select>
                </div>
                {data.map((row) => {
                    const { years, months, days, hours, minutes } =
                        dateUtil.parseDate(row.biChanged);
                    return (
                        <div
                            className={'bg-gray-800 text-white py-2 px-4'}
                            key={row.biNum}
                        >
                            <div className={'text-left py-3 px-4'}>
                                #{row.biNum}
                            </div>
                            <div className={'text-left py-3 px-4'}>
                                ID : {row.biId}
                            </div>
                            <div className={'text-left py-3 px-4'}>
                                &gt; {row.biContent}
                            </div>
                            <div
                                className={'text-left py-3 px-4'}
                            >{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분`}</div>
                        </div>
                    );
                })}
            </div>
            <div className={'container mx-auto py-2'}>
                {data.length > 0 && (
                    <Pagination
                        pagination={pagination}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        handleClickPage={handleClickPage}
                        bottomSize={BOTTOM_SIZE}
                    />
                )}
            </div>
        </>
    );
}
