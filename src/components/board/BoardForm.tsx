import useFetch from '../../hooks/useFetch';
import React, {
    ChangeEvent,
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import dateUtil from '../../utils/dateUtil';
import Spinner from '../common/Spinner';
import Pagination from '../common/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import {ContextStorage} from '../../router/AppRouter';

const BOTTOM_SIZE = 5;
const PAGE_SIZE_MULTIPLE_VALUE = 20;

export default function BoardForm() {
    const params = useParams();
    const navigate = useNavigate();
    const fetch = useFetch();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<BoardInfo[]>([]);
    const [pagination, setPagination] = useState<Paginations>({
        page: Number(params.page || '1'),
        pageSize: PAGE_SIZE_MULTIPLE_VALUE,
        totalPage: 1,
    });
    useEffect(() => {
        console.log('Fetch Effect');
        fetch
            .get(`/board/list/${pagination.page}/${pagination.pageSize}`)
            .then((result) => {
                fetch.resultHandler(result, (data) => {
                    if (data.length > 0) {
                        setData(data);
                        const { page, pageSize, totalPage } = data[0];
                        setPagination({
                            pageSize,
                            totalPage,
                            page,
                        });
                        navigate(`/board/${page}`);
                    }
                });
            });
    }, [pagination.page, pagination.pageSize]);
    const handlePrev = () => {
        setPagination((prev) => {
            const { page: prevPage, totalPage } = prev;
            const page = Math.max(prevPage - BOTTOM_SIZE, 1);
            const firstNumber =
                Math.floor((page - 1) / BOTTOM_SIZE) * BOTTOM_SIZE + 1;
            const lastNumber = Math.min(
                firstNumber + BOTTOM_SIZE - 1,
                totalPage,
            );
            const currentPage =
                Math.floor(Math.max(prevPage - 1, 1) / BOTTOM_SIZE) === 0
                    ? 1
                    : lastNumber;
            return {
                ...prev,
                page: currentPage,
            };
        });
    };
    const handleNext = () => {
        setPagination((prev) => {
            const { page: prevPage, totalPage } = prev;
            const page = Math.min(prevPage + BOTTOM_SIZE, totalPage);
            const firstNumber = page - (page % BOTTOM_SIZE) + 1;
            // const lastNumber = Math.min(firstNumber + BOTTOM_SIZE - 1, totalPage);
            let currentPage = Math.min(firstNumber, page);
            currentPage =
                totalPage - prevPage < BOTTOM_SIZE ? totalPage : currentPage;
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
        return [...new Array(5)].map((_, index) => {
            return (
                <Fragment key={index}>
                    <option value={(index + 1) * PAGE_SIZE_MULTIPLE_VALUE}>
                        {(index + 1) * PAGE_SIZE_MULTIPLE_VALUE}
                    </option>
                </Fragment>
            );
        });
    }, []);
    const handlePost = useCallback(async ()=> {
        await fetch.authenticate();
        navigate('/board/post');
    },[])
    const handleClickPost = (biNum:number) => {
        navigate(`/board/view/${biNum}`);
    }
    if (loading) return <Spinner/>
    return (
        <>
            <div className={'container mx-auto'}>
                <div className={'flex items-baseline'}>
                    <div
                        className={
                            'container mx-auto flex py-2 items-center space-x-3'
                        }
                    >
                        <button
                            className={
                                'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                            }
                            onClick={handlePost}
                        >
                            글쓰기
                        </button>
                    </div>
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
                            <span className={'text-left py-3 px-4'}>
                                #{row.biNum}
                            </span>
                            <span className={'text-left py-3 px-4'}>
                                ID : {row.biId}
                            </span>
                            <span className={'text-left py-3 px-4 cursor-pointer hover:text-xl'} onClick={()=>{
                                handleClickPost(row?.biNum ?? 1);
                            }}>
                                &gt; {row.biTitle}
                            </span>
                            <span
                                className={'text-left py-3 px-4'}
                            >{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분`}</span>
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
