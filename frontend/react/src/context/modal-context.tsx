import React, { useCallback, useEffect, useState } from 'react';
import { Context } from 'vm';
import ReceivePopUp from '../components/ReceivePopUp/ReceivePopUp';

const ModalContext = React.createContext({});


const Modal = (({ modal, unSetModal }:any) => {
    useEffect(() => {
        const bind = (event:any) => {
            console.log(event.keyCode);
            unSetModal();
        }

        document.addEventListener('keyup', bind);
        return () => document.removeEventListener('keyup', bind);
    }, [modal, unSetModal])

    return (
        <ReceivePopUp />
    )
});

const useModal = () :Context => {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

const ModalProvider = (props: any) => {
    const [modal, setModal] = useState();

    const unSetModal = useCallback(() => {
        setModal(undefined);
    }, [setModal])

    return (
        <ModalContext.Provider value={{unSetModal, setModal }} {...props}>
            {props.children}
            {modal && <Modal modal={modal} unSetModal={unSetModal} />}
        </ModalContext.Provider>
    );
}

export { ModalProvider, useModal }
