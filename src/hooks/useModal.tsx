import React, { useCallback, useState } from 'react';

export default function useModal() {
    const [props, setProps] = useState<UseModalProps>({
        title: '',
        content: '',
        isOpen: false,
    });

    const open = useCallback(() => {
        setProps((prev) => {
            return {
                ...prev,
                isOpen: true,
            };
        });
    }, []);

    const close = useCallback(() => {
        setProps((prev) => {
            return {
                ...prev,
                isOpen: false,
            };
        });
    }, []);

    const setAuto = useCallback((title: string, content: string) => {
        setProps((prev) => {
            return {
                ...prev,
                title,
                content,
                isOpen: true,
            };
        });
    }, []);

    return {
        props,
        setProps,
        open,
        close,
        setAuto,
    };
}
