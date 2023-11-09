import React, { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authSlice from '../../slices/authSlice';
import useFetch from '../../hooks/useFetch';
import { ModalContext } from '../../router/AppRouter';

export default function SignInForm() {
    const navigate = useNavigate();
    const modal = useContext(ModalContext);
    const dispatch = useDispatch();
    const fetch = useFetch();
    const [formData, setFormData] = useState<User>({
        id: '',
        password: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { id, password } = formData;

        const body: User = {
            id,
            password,
        };
        const result: FetchResult = await fetch.post('/auth/sign-in', body);
        const { text, status, data, message } = result;
        fetch.resultHandler(result, () => {
            sessionStorage.setItem('key', JSON.stringify(data));
            sessionStorage.setItem('name', id);
            dispatch(authSlice.actions.set(data));
            navigate('/');
            window.location.reload();
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
                        {' '}
                        Username{' '}
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

                <button
                    className="block w-full mt-4 p-2 bg-blue-500 text-white rounded"
                    type="submit"
                >
                    Sign In
                </button>
            </form>
        </>
    );
}
