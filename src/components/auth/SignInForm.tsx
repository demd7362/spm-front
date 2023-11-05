import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authSlice from '../../slices/authSlice';
import useFetch from '../../hooks/useFetch';
import useModal from "../../hooks/useModal";
import Modal from "../common/Modal";

export default function SignInForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetch = useFetch();
    const modal = useModal();
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
        const result = await fetch.post('/auth/sign-in', body);
        const { text, status, data, message } = result;
        switch (status) {
            case 200:
                localStorage.setItem('key', JSON.stringify(data));
                localStorage.setItem('name',id);
                dispatch(authSlice.actions.set(data));
                navigate('/');
                window.location.reload();
                break;
            default:
                modal.setAuto(message,text);
        }
    };

    return (
        <>
            <Modal props={modal.props} onClose={modal.close}/>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold" htmlFor="username">
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
                    <label className="block text-sm font-bold" htmlFor="password">
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
