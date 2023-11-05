import { useEffect, useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import useFetch from '../hooks/useFetch';

export default function Quiz() {
    const editorRef = useRef<Monaco | null>(null);
    const [quizInfo, setQuizInfo] = useState('');
    const [result, setResult] = useState('');
    const fetch = useFetch();
    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };
    const runCode = () => {
        // @ts-ignore
        const code = editorRef.current.getValue();
        const start = +new Date();
        const result = new Function(code + `return runtime()`)();
        const end = +new Date();
        const durationTime: number = end - start;
        console.log(durationTime + 'ms');
        setResult(result);
    };
    useEffect(() => {
        const getQuizInfo = async () => {
            const {message,status,quizInfoList} = await fetch.get('/quiz/list');
            console.log(message)
            console.log(status)
            console.log(quizInfoList)

        }
        getQuizInfo();
    }, [result]);

    return (
        <div className={'flex justify-center h-90vh mt-5'}>
            <button onClick={runCode}>run</button>
            <div className={'border-black w-1/2'}>
                <Editor
                    defaultLanguage="javascript"
                    defaultValue="function runtime(param){ /* 여기에 코드를 작성해주세요. */ }"
                    options={{
                        fontSize: 15,
                        minimap: { enabled: false },
                        scrollbar: {
                            vertical: 'auto',
                            horizontal: 'auto',
                        },
                        glyphMargin: true,
                        scrollBeyondLastLine: true,
                        automaticLayout: true,
                    }}
                    onMount={handleEditorDidMount}
                />
            </div>
            <div
                className={'bg-black w-1/2 text-white text-'}
                contentEditable={true}
            ></div>
        </div>
    );
}
