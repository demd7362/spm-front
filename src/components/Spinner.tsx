import { ClipLoader } from 'react-spinners';
import { CSSProperties, useState } from 'react';

const override: CSSProperties = {

};

export default function Spinner() {
    return (
        <div className={'flex justify-center items-center '}>
            <ClipLoader />
        </div>
    );
}
