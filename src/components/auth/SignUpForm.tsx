import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useModal from "../../hooks/useModal";
import Modal from "../common/Modal";

export default function SignUpForm() {
    const navigate = useNavigate();
    const fetch = useFetch();
    const modal = useModal();
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
            modal.setAuto('비밀번호 불일치','동일한 비밀번호를 입력해주세요.');
            return;
        }
        const data: User = {
            id,
            password,
        };
        const result = await fetch.post('/auth/sign-up', data);
        console.log(result)
        const { text, status, message } = result;
        switch (status) {
            case 200:
                navigate('/sign/in');
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
                <div>
                    <label className="block text-sm font-bold" htmlFor="password">
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
