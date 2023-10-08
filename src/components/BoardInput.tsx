import React, {
    ChangeEvent,
    FormEvent,
    KeyboardEventHandler,
    useState,
} from 'react';
import useFetch from '../hooks/useFetch';

export default function BoardInput() {
    const [content, setContent] = useState('');
    const ajax = useFetch();
    const handleSubmit = async () => {
        if(content.length > 50){
            alert('글은 50자 이상 적을 수 없습니다.');
            return;
        }
        const result = await ajax.post('/board/insert', {
            biContent: content,
        });
        const { message, status } = result;
        switch (status) {
            case 200:
                window.location.reload();
                break;
            default:
                alert(message);
        }
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };
    return (
        <div className={'container mx-auto flex py-2 items-center space-x-3'}>
            <div>
                <input
                    onChange={handleInputChange}
                    onKeyUp={handleKeyUp}
                    value={content}
                    className={
                        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    }
                />
            </div>
            <button
                className={
                    'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                }
                onClick={handleSubmit}
            >
                글쓰기
            </button>
        </div>
    );
}
