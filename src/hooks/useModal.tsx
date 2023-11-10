import React, { useCallback, useState } from 'react';

export default function useModal(): ModalReturnProps {
    const [props, setProps] = useState<UseModalProps>({
        title: '',
        content: '',
        isOpen: false,
    });

    const open = useCallback(() => {
        setProps((prev) => ({
            ...prev,
            isOpen: true,
        }));
    }, []);

    const close = useCallback(() => {
        setProps((prev) => ({
            ...prev,
            isOpen: false,
        }));
    }, []);

    const setAuto = useCallback(
        (title: string, content: string, onClose?: () => void) => {
            if(onClose === undefined) {
                onClose = close;
            }
            setProps((prev) => ({
                ...prev,
                title,
                content,
                isOpen: true,
                onClose,
            }));
        },
        [],
    );

    return {
        props,
        setProps,
        open,
        close,
        setAuto,
    };
}
