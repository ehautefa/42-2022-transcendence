import React, { useCallback, useEffect, useState } from 'react';
import { Context } from 'vm';
import ReceivePopUp from '../components/ReceivePopUp/ReceivePopUp';
import AddFriendPopUp from '../components/AddFriendPopUp/AddFriendPopUp';
import { getSocketStatus } from "../App"

const ModalContext = React.createContext({});
const socket = getSocketStatus();

const Modal = (({ modal, unSetModal }: any) => {
	console.log("MODAL", modal);
	const selector = modal.type === 'addFriend' ? 'AddFriendPopUp' : 'ReceivePopUp';
	useEffect(() => {
		const bind = (event: any) => {
			console.log(event.keyCode);
			unSetModal();
		}

		document.addEventListener('keyup', bind);
		return () => document.removeEventListener('keyup', bind);
	}, [modal, unSetModal])

	return (<>
		{
			modal.type === 'addFriend'
			&& <AddFriendPopUp modal={modal} />
		}
		{
			modal.type === 'receive'
			&& <ReceivePopUp modal={modal} />
		}
	</>)
});

const useModal = (): Context => {
	const context = React.useContext(ModalContext);
	if (!context) {
		throw new Error('useModal must be used within a ModalProvider');
	}
	return context;
}

const ModalProvider = (props: any) => {
	const [modal, setModal] = useState();

	socket.on('sendInvite', (data: any) => {
		console.log("INVITE PLAYER ON", data);
		setModal(data);
	})
	socket.on('addFriend', (inviter: any) => {
		console.log("ADD FRIEND ON", inviter);
		setModal(inviter);
	})
	const unSetModal = useCallback(() => {
		setModal(undefined);
	}, [setModal])

	return (
		<ModalContext.Provider value={{ unSetModal, setModal }} {...props}>
			{props.children}
			{modal && <Modal modal={modal} unSetModal={unSetModal} />}
		</ModalContext.Provider>
	);
}

export { ModalProvider, useModal }
