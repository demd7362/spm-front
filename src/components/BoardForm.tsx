import useFetch from '../hooks/useFetch';
import {
    ChangeEvent,
    ReactElement,
    useCallback,
    useEffect, useLayoutEffect,
    useState,
} from 'react';
import dateUtil from '../utils/dateUtil';
import React from 'react';
import Spinner from "./Spinner";
import BoardInput from "./BoardInput";

const BOTTOM_SIZE = 5;
const PAGE_SIZE_MULTIPLE_VALUE = 5;
export default function BoardForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const ajax = useFetch();
    const [data, setData] = useState<BoardInfo[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 5,
        totalPage: 1,
    });
    useEffect(() => {
        const getBoardData = async () => {
            const result = await ajax.get(
                `/board/list/${pagination.page}/${pagination.pageSize}`,
            );
            const { status, message, boardInfoList } = result;
            switch (status) {
                case 200:
                    setData(boardInfoList);
                    if (boardInfoList.length > 0) {
                        const { page, pageSize, totalPage } = boardInfoList[0];
                        setPagination({
                            pageSize,
                            totalPage,
                            page,
                        });
                    }
                    break;
                default:
                    alert(message);
            }
        };
        getBoardData();
    }, [pagination.page, pagination.pageSize]);
    const handlePrev = () => {
        setPagination((prev) => {
            let prevPage = (prev.page || 1) - BOTTOM_SIZE;
            if (prevPage < 1) prevPage = 1;
            return {
                ...prev,
                page: prevPage,
            };
        });
    };
    const handleNext = () => {
        setPagination((prev) => {
            let nextPage = (prev.page || 1) + BOTTOM_SIZE;
            if (nextPage > prev.totalPage) nextPage = prev.totalPage;
            return {
                ...prev,
                page: nextPage,
            };
        });
    };
    const handleClickPages = (pageIndex: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page: pageIndex,
            };
        });
    };
    const handleOptionChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        let pageSize = Number(e.target.value);
        if(isNaN(pageSize)) return;
        setPagination((prev: Pagination) => {
            return {
                ...prev,
                page: 1,
                pageSize,
            };
        });
    },[])

    const renderPages = useCallback(() => {
        const { page, totalPage } = pagination;
        const firstNumber = page - (page % BOTTOM_SIZE) + 1;
        let lastNumber = page - (page % BOTTOM_SIZE) + BOTTOM_SIZE;
        if (lastNumber > totalPage) lastNumber = totalPage;
        const jsx: ReactElement[] = [];
        for (let i = firstNumber; i <= lastNumber; i++) {
            jsx.push(
                <li
                    key={i}
                    onClick={() => handleClickPages(i)}
                    className={'float-left space-x-3 cursor-pointer'}
                >
                    {i}
                </li>,
            );
        }
        return jsx;
    }, [pagination]);
    const renderOptions = useCallback(() => {
        return [...new Array(6)].map((v, i) => {
            return <option value={(i + 1) * PAGE_SIZE_MULTIPLE_VALUE}>{(i + 1) * PAGE_SIZE_MULTIPLE_VALUE}</option>;
        });
    }, []);
    if(loading) return <Spinner/>
    return (
        <>
            <div className={'container mx-auto'}>
                <div className={'flex items-baseline'}>
                    <BoardInput />
                    <select className={'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'}
                        onChange={handleOptionChange}
                    >
                        <option selected>선택</option>
                        {renderOptions()}
                    </select>
                </div>
                {data.map((row) => {
                    const { years, months, days, hours, minutes } =
                        dateUtil.parseDate(row.biChanged);
                    return (
                        <div
                            className={
                                'bg-gray-800 text-white py-2 px-4'
                            }
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
            <ul className={'mx-auto'}>
                <li className={'cursor-pointer'} onClick={handlePrev}>
                    뒤로
                </li>
                {renderPages()}
                <li className={'cursor-pointer'} onClick={handleNext}>
                    앞으로
                </li>
            </ul>
        </>
    );
}
