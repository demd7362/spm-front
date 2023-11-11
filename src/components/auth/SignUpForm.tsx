import React, { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { ContextStorage } from '../../router/AppRouter';

export default function SignUpForm() {
    const navigate = useNavigate();
    const fetch = useFetch();
    const { modal } = useContext(ContextStorage);
    const [formData, setFormData] = useState<UserForm>({
        id: '',
        password: '',
        passwordCheck: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { id, password, passwordCheck } = formData;
        if (password !== passwordCheck) {
            modal.setAuto('비밀번호 불일치', '동일한 비밀번호를 입력해주세요.');
            return;
        }
        const data: User = {
            id,
            password,
        };
        const result: FetchResult = await fetch.post('/auth/sign-up', data);
        const { text, status, message } = result;
        fetch.resultHandler(result, () => {
            navigate('/sign/in');
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        className="block text-sm font-bold"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="block w-full mt-1 p-2 border rounded"
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label
                        className="block text-sm font-bold"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="block w-full mt-1 p-2 border rounded"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-bold"
                        htmlFor="password"
                    >
                        Password Check
                    </label>
                    <input
                        className="block w-full mt-1 p-2 border rounded"
                        type="password"
                        name="passwordCheck"
                        value={formData.passwordCheck}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button
                    className="block w-full mt-4 p-2 bg-blue-500 text-white rounded"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
        </>
    );
}
