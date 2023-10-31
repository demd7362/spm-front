import useFetch from '../../hooks/useFetch';
import {
    ChangeEvent,
    ReactElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import dateUtil from '../../utils/dateUtil';
import React from 'react';
import Spinner from '../common/Spinner';
import BoardInput from './BoardInput';
import Pagination from "../common/Pagination";

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
        ajax.get(
            `/board/list/${pagination.page}/${pagination.pageSize}`,
        ).then(data => {
            const { status, message, boardInfoList } = data;
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
        })



    }, [pagination.page, pagination.pageSize]);
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
            setPagination((prev: Pagination) => {
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
                    <BoardInput />
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
                        prevText={'이전'}
                        nextText={'다음'}
                        bottomSize={BOTTOM_SIZE}
                    />
                )}
            </div>
        </>
    );
}