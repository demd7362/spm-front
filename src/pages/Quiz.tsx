import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import useFetch from '../hooks/useFetch';
import {ContextStorage} from "../router/AppRouter";
import Spinner from "../components/common/Spinner";

export default function Quiz() {
    const editorRef = useRef<Monaco | null>(null);
    const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
    const fetch = useFetch();
    const {modal} = useContext(ContextStorage);
    useEffect(() => {
        fetch.get(`/quiz/list/2`)
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
            if(!quizInfo) return;
            // @ts-ignore
            const code = editorRef.current.getValue();
            const start = +new Date();
            let result = new Function(code + `return runtime(${quizInfo.qiParam})`)();
            result = JSON.stringify(result);
            const end = +new Date();
            const durationTime: number = end - start;
            const answer = quizInfo.qiAnswer.replaceAll(' ','');
            const compareString = (arg1:string,arg2:string) => {
                arg1 = arg1
                    .replaceAll(' ','')
                    .toString();
                arg2 = arg2
                    .replaceAll(' ','')
                    .toString();
                return arg1 === arg2;
            }
            const isCorrect = compareString(result,answer);
            if(isCorrect) modal.setAuto('정답','축하합니다!');
            else modal.setAuto('RESULT', `Your return value is '${result}'\nCode executed in ${durationTime} ms!`);
        } catch (e:any) {
            modal.setAuto('SYNTAX_ERROR_HAS_OCCURRED',e.stack);
        }

    },[quizInfo])
    const renderQuiz = useCallback(()=>{
        // @ts-ignore
        const {qiContent,qiTitle,qiId,qiNum,qiParam}:QuizInfo = quizInfo;
        return (
            <p className={'font-bold text-black whitespace-pre-wrap'}>
                {`${qiNum}번 문제\n제목 : ${qiTitle}\n출제자 : ${qiId}\n문제 : ${qiContent.split('.').join('.\n')}다음과 같은 파라미터가 주어진다고 가정합니다.\n${qiParam}`}
            </p>
        )
    },[quizInfo])
    if(quizInfo === null) return <Spinner/>
    return (
        <div className={'flex justify-center h-90vh mt-5'}>
            <div className={'border-black w-1/2'}>
                <Editor
                    defaultLanguage="javascript"
                    defaultValue={`function runtime(param){\n    let answer = [];\n    return answer;\n}`}
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
            <div className={'w-1/2'}>
                <button className={'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'} onClick={runCode}>Run code</button>
                {renderQuiz()}
            </div>
        </div>
    );
}
