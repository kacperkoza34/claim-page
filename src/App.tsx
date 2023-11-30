import { ContractStateProvider } from "@src/utils/context/ContractStateContext";
import { ClaimingPage } from "./components/ClaimingPage/ClaimingPage";
import HederaWalletsProvider from "@src/utils/context/HederaWalletsContext";
import { ModalProvider } from "@src/utils/context/ModalContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <ModalProvider>
      <HederaWalletsProvider>
        <ContractStateProvider>
          <div className="border-[24px] border-[#D7D7DC] relative w-full min-h-[100vh] px-12 py-10 flex flex-col grow-1">
            <div className="max-w-[1400px] min-w-[320px] mx-auto">
              <ClaimingPage />
            </div>

            <ToastContainer position='bottom-center'/>
          </div>
        </ContractStateProvider>
      </HederaWalletsProvider>
    </ModalProvider>
  );
};

export default App;
