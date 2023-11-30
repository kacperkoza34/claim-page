import { Button } from "@src/components/shared/Button";
import { SUPPORTED_WALLETS } from "@src/utils/constants/supportedWallets";
import { generateButtonLabel } from "@src/utils/helpers/generateButtonLabel";
import useHederaWallets from "@src/utils/hooks/useHederaWallets";
import { useCallback } from "react";
import { Modal } from "@src/components/shared/Modal";
import { useModal } from "@src/utils/hooks/useModal";

export const WalletConnectionModal: React.FC = () => {
  const { closeModal, modalOpen, toggleModal } = useModal(
    "WalletConnectionModal"
  );

  const { connect, disconnect, connectedWalletType } = useHederaWallets();

  const handleConnectWallet = useCallback(
    (connectionType, disabled: boolean | undefined) => {
      if (disabled) return;
      if (connectedWalletType === connectionType) {
        disconnect();
      } else connect(connectionType);

      closeModal();
    },
    [closeModal, connect, connectedWalletType, disconnect]
  );

  const buttonWithIconContainerClassName =
    "w-2/3 mx-auto flex flex-col justify-center rounded font-medium transition duration-200";

  return (
    <Modal open={modalOpen} handleOnOpenChange={toggleModal}>
      <div className="max-w-[446px] mx-auto mb-10 flex flex-col justify-center items-center gap-3.5 text-center">
        <h2>Connect your wallet</h2>
        <h3 className="text-black text-[18px]">
          If you don't have a wallet, you can select a provider and create one
          now.
        </h3>
      </div>
      {SUPPORTED_WALLETS.map(
        ({ label, icon, disabled, connectionType }, index) => (
          <div key={index} className={buttonWithIconContainerClassName}>
            <Button
              label={generateButtonLabel(
                label,
                connectionType,
                disabled,
                connectedWalletType
              )}
              icon={icon}
              className={`w-full text-black px-4 py-2.5 flex justify-center items-center gap-4 border-2 mb-6 ${
                !disabled ? "hover:bg-hover" : ""
              } `}
              disabled={disabled}
              onClick={() => handleConnectWallet(connectionType, disabled)}
            />
          </div>
        )
      )}
    </Modal>
  );
};
