import { createContext, useState } from "react";

export type ModalTypes =
  | "WalletConnectionModal"
  | "MultiPriceClaimModal"
  | string;

type ModalState = {
  [key in ModalTypes]?: boolean;
};

interface ModalContextProps {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined
);

interface ModalProviderProps {
  children: React.ReactNode;
}
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalState, setModalState] = useState<ModalState>({});

  return (
    <ModalContext.Provider value={{ modalState, setModalState }}>
      {children}
    </ModalContext.Provider>
  );
};
