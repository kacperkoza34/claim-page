import { ClaimingButtons } from "@src/components/ClaimingPage/ClaimingButtons";
import { ImageColumn } from "@src/components/ClaimingPage/ImageColumn";
import { MetadataColumn } from "@src/components/ClaimingPage/MetadataColumn";
import { WalletConnectionModal } from "@src/components/modals/WalletConnectionModal";
import { Button } from "@src/components/shared/Button";
import { SMART_CONTRACT_ID_DECIMAL } from "@src/utils/constants/appInfo";
import { ClaimingPageContext } from "@src/utils/context/ClaimingPageContext";
import { useClaiming } from "@src/utils/hooks/useClaiming";
import useContractState from "@src/utils/hooks/useContractState";
import useHederaWallets from "@src/utils/hooks/useHederaWallets";
import { useModal } from "@src/utils/hooks/useModal";
import React from "react";

export const ClaimingPage: React.FC = () => {
  const { toggleModal } = useModal("WalletConnectionModal");
  const { userWalletId, disconnect, isWalletConnected } = useHederaWallets();
  const { isDataLoading } = useContractState();
  const { toggleModal: toggleWalletConnectionModal } = useModal(
    "WalletConnectionModal"
  );
  const { nftCollectionOnChainMetadata } = useContractState();
  const claimingPageContextValues = useClaiming(
    SMART_CONTRACT_ID_DECIMAL
  );

  if (isDataLoading) {
    return (
      <p className="w-full font-extrabold flex justify-center text-xl">
        Loading...
      </p>
    );
  }

  return (
    <ClaimingPageContext.Provider value={claimingPageContextValues}>
      <WalletConnectionModal />
      <div className="left-0 flex items-center mb-6 w-full top-10 z-0">
        <p className="w-full text-center text-lg">
          Conctract Number
          <span className="ml-6 text-black text-xl">
            {SMART_CONTRACT_ID_DECIMAL}
          </span>
        </p>
        <div className="absolute right-12">
          <Button
            size="small"
            label={isWalletConnected ? "Disconnect" : "Connect Wallet"}
            className="bg-secondary text-textDefault text-[15px] "
            onClick={isWalletConnected ? disconnect : toggleModal}
          />
          {isWalletConnected && (
            <span className="absolute top-8 left-0 w-full whitespace-nowrap	text-[12px]">
              Wallet ID: {userWalletId}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col max-w-[684px] mx-auto mt-10">
        <div className="p-6 flex gap-12">
          <div className="flex flex-col w-1/2">
            <ImageColumn />

            <div className="flex flex-col justify-center align-center gap-3 mt-8">
              {userWalletId && nftCollectionOnChainMetadata?.token_id && (
                <>
                  {!claimingPageContextValues.isAccountAssociatedToToken && (
                    <Button
                      type="submit"
                      className="mx-auto"
                      onClick={async () =>
                        await claimingPageContextValues.associateToken(
                          nftCollectionOnChainMetadata?.token_id || ""
                        )
                      }
                      disabled={!userWalletId}
                    >
                      Associate token
                    </Button>
                  )}

                  <ClaimingButtons />
                </>
              )}

              {!userWalletId && (
                <div className="text-warning max-w-md flex justify-center align-center">
                  <Button
                    className="mx-auto"
                    label="Connect Wallet"
                    onClick={toggleWalletConnectionModal}
                  />
                </div>
              )}
            </div>
          </div>
          <MetadataColumn />
        </div>
      </div>
    </ClaimingPageContext.Provider>
  );
};
