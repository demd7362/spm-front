import {Dispatch, MouseEventHandler, SetStateAction} from 'react';
declare global {
    type UserInfo = {
        uiNum?: number;
        uiId: string;
        uiPwd: string;
    };

    type User = {
        id: string;
        password: string;
    };

    type UserForm = User & {
        passwordCheck: string;
    };

    type Jwt = {
        grantType: string;
        accessToken: string;
        refreshToken?: string;
        tokenExpiresIn: number;
    };
    type BoardInfo = {
        biNum?: number;
        biId: string;
        biContent: string;
        biCreated?: string;
        biChanged?: string;
        biActive?: number;
    };

    type DateTime = {
        years: string | number;
        months: string | number;
        days: string | number;
        hours: string | number;
        minutes: string | number;
        seconds: string | number;
        date?: Date;
    };

    type FetchResult = {
        message: string;
        response: string;
        data?: object;
        text: string;
        status: number;
    };

    type Paginations = {
        page: number;
        pageSize: number;
        totalPage: number;
    };

    type QuizInfo = {
        qiNum?: number;
        qiId: string;
        qiTitle: string;
        qiContent: string;
        qiAnswer: string;
        qiLevel: number;
        qiActive: number;
        qiCreated?: string;
        qiChanged?: string;
        qiParam: string;
    };

    type QuizSubmit = {
        qsNum?: number;
        qsId: string;
        qsTry?: number;
        qsSolved?: number;
    };
    type PaginationProps = {
        pagination: Pagination;
        handlePrev: () => void;
        handleNext: () => void;
        handleClickPage: (page: number) => void;
        prevText?: string;
        nextText?: string;
        bottomSize: number;
    };

    type UseModalProps = {
        title: string;
        content: string;
        isOpen?: boolean;
        closeText?: string;
        onClose?: () => void;
    };



    type ModalReturnProps = {
        props: UseModalProps;
        setProps: Dispatch<SetStateAction<UseModalProps>>;
        open: () => void;
        close: (callback?:()=>void) => void;
        setAuto: (title: string, content: string, onClose?:() => void) => void;
    };
}

