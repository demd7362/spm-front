import { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { ContextStorage } from '../../router/AppRouter';

export default function BoardEditor() {
    const [text, setText] = useState('');
    const {header} = useContext(ContextStorage);
    const handleSubmit = () => {
        console.log(text); // 텍스트를 콘솔에 로깅하거나 서버로 전송하는 등의 작업을 수행
    };
    useEffect(() => {
        header.setMenu(() => {
            return <button onClick={handleSubmit}>제출</button>
        })
        return () => {
            header.setDefault();
        }
    }, []);

    const handleChange = (content: string) => {
        setText(content);
    };



    return (
        <div>
            <ReactQuill value={text} onChange={handleChange} />

        </div>
    );
}
