import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import useFetch from '../hooks/useFetch';
import {ModalContext} from "../router/AppRouter";

export default function Quiz() {
    const editorRef = useRef<Monaco | null>(null);
    const [quizInfo, setQuizInfo] = useState<QuizInfo>({
        qiActive: 1,
        qiTitle: '',
        qiLevel: 1,
        qiId: '',
        qiNum: 1,
        qiContent: '',
        qiAnswer: ''
    });
    const [result, setResult] = useState('');
    const fetch = useFetch();
    const modal = useContext(ModalContext);
    useEffect(() => {
        fetch.get(`/quiz/list/${quizInfo.qiNum}`)
            .then(result => {
                fetch.resultHandler(result,(data:QuizInfo)=> {
                    setQuizInfo(data);
                    console.log(quizInfo)
                });
            })
    }, []);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };
    const runCode = useCallback(()=>{
        try {
            // @ts-ignore
            const code = editorRef.current.getValue();
            const start = +new Date();
            const result = new Function(code + `return runtime()`)();
            const end = +new Date();
            const durationTime: number = end - start;
            console.log(durationTime + 'ms');
            setResult(result);
            modal.setAuto('RESULT', `Your answer is ${result}\nCode executed in ${durationTime} ms!`);
        } catch (e:any) {
            modal.setAuto('SYNTAX_ERROR_HAS_OCCURRED',e.stack);
        }

    },[])


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
                className={'w-1/2 '}
            >
                <p className={'font-bold text-black whitespace-pre-wrap'}>{quizInfo.qiContent}</p>
            </div>
        </div>
    );
}
