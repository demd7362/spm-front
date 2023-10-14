import { useEffect, useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';

export default function Quiz() {
    const editorRef = useRef<Monaco | null>(null);
    const [quizInfo,setQuizInfo] = useState('');
    const [result, setResult] = useState('');
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
        console.log(durationTime+'ms');
        setResult(result);
    };
    useEffect(() => {
        if (result) {
            alert(result);
        }
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
            <div className={'bg-black w-1/2 text-white text-'} contentEditable={true}>
            </div>
        </div>
    );
}
