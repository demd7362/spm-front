import { useEffect, useRef, useState } from 'react';
import { Editor, Monaco, OnMount, useMonaco } from '@monaco-editor/react';

export default function Quiz() {
    const editorRef = useRef<Monaco | null>(null);
    const [result, setResult] = useState('');
    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };
    const runCode = () => {
        // @ts-ignore
        const code = editorRef.current.getValue();
        const result = new Function(code + 'return runtime()')();
        setResult(result);
    };
    useEffect(() => {
        if(result){
            alert(result);
        }
    }, [result]);

    return (
        <>
            <button onClick={runCode}>run code</button>
            <Editor
                className='border-4 w-full h-90vh'
                defaultLanguage="javascript"
                defaultValue="function runtime(){ /* 여기에 코드를 작성해주세요. */ }"
                options={{
                    fontSize: 15,
                    minimap: { enabled: true },
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
        </>
    );
}
