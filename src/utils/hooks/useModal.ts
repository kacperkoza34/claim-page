import { useContext } from 'react'
import { ModalContext, ModalTypes } from '../context/ModalContext';

export const useModal = (modalType: ModalTypes) => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  const isOpen = context.modalState[modalType] || false;

  const setModalState = (open: boolean) => {
    context.setModalState({
      ...context.modalState,
      [modalType]: open,
    });
  };
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);
  const switchModal = (type: ModalTypes) => {
    context.setModalState({
      [type]: true,
    });
  };
  const toggleModal = () => setModalState(!isOpen);

  return {
    modalOpen: isOpen,
    openModal,
    closeModal,
    switchModal,
    toggleModal,
    setModalState,
  };
};
