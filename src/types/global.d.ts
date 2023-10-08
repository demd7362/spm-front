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

interface Response {
    status: string;
    message: string;
}

type Pagination = {
    page: number,
    pageSize: number,
    offset?: number,
    totalPage: number,
}
