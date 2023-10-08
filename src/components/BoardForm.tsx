import useFetch from '../hooks/useFetch';
import {
    ChangeEvent,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react';
import dateUtil from '../utils/dateUtil';
import React from 'react';

const BOTTOM_SIZE = 5;
export default function BoardForm() {
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
            let prevPage = (prev.page || 1) - 10;
            if (prevPage < 1) prevPage = 1;
            return {
                ...prev,
                page: prevPage,
            };
        });
    };
    const handleNext = () => {
        setPagination((prev) => {
            let nextPage = (prev.page || 1) + 10;
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
    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setPagination((prev: Pagination) => {
            return {
                ...prev,
                pageSize: Number(e.target.value),
            };
        });
    }

    const renderPages = useCallback(() => {
        const { page, totalPage } = pagination;
        const firstNumber = page - (page % BOTTOM_SIZE) + 1;
        let lastNumber = page - (page % BOTTOM_SIZE) + BOTTOM_SIZE;
        if (lastNumber > totalPage) lastNumber = totalPage;
        const jsx: ReactElement[] = [];
        for (let i = firstNumber; i <= lastNumber; i++) {
            jsx.push(
                <li key={i}
                    onClick={() => handleClickPages(i)}
                    className={'float-left space-x-3'}>
                    {i}
                </li>
            );
        }
        return jsx;
    }, [pagination]);
    const renderOptions = useCallback(()=>{
        return [...new Array(6)].map((v,i)=>{
            return (
                <option value={(i+1) * 5}>{(i+1)*5}</option>
            )
        })
    },[])
    return (
        <>
            <select onChange={handleOptionChange}>
                {renderOptions()}
            </select>
            <div className={'container mx-auto '}>
                {data.map((row) => {
                    const { years, months, days, hours, minutes } =
                        dateUtil.parseDate(row.biChanged);
                    return (
                        <React.Fragment key={row.biNum}>
                            <div>No.{row.biNum}</div>
                            <div>{row.biId}</div>
                            <div>{row.biContent}</div>
                            <div>{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분`}</div>
                        </React.Fragment>
                    );
                })}
            </div>
            <ul className={'mx-auto'}>
                <li className={'float-left space-x-3'} onClick={handlePrev}>
                    뒤로
                </li>
                {renderPages()}
                <li className={'float-left space-x-3'} onClick={handleNext}>
                    앞으로
                </li>
            </ul>
        </>
    );
}
