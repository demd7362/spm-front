
export default function Pagination({ pagination, handlePrev, handleNext, handleClickPage,prevText,nextText,bottomSize }: PaginationProps){
    const { page, totalPage } = pagination;

    const renderPages = () => {
        const firstNumber= Math.floor((page - 1) / bottomSize) * bottomSize + 1;
        const lastNumber = Math.min(firstNumber + bottomSize - 1, totalPage);
        return Array.from({ length: lastNumber - firstNumber + 1 }, (_, index) => {
            const pageNumber = firstNumber + index;
            return (
                <li
                    key={pageNumber}
                    onClick={() => {
                        handleClickPage(pageNumber);
                    }}
                    className={`hover:text-gray-300 ${pageNumber === page ? 'font-bold' : ''}`}
                >
                    {pageNumber}
                </li>
            );
        });
    };

    return (
        <ul className={'cursor-pointer flex justify-center mx-auto space-x-5'}>
            <li className={'hover:text-gray-300'} onClick={handlePrev}>
                {prevText}
            </li>
            {renderPages()}
            <li className={'hover:text-gray-300'} onClick={handleNext}>
                {nextText}
            </li>
        </ul>
    );
};
