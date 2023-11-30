import { ContractClaimingButton } from "@src/components/claiming-page/buttons/ContractClaimingButton";
import { Button } from "@src/components/shared/Button";
import { useClaimingPageContext } from "@src/utils/hooks/claiming/useClaimingPageContext";
import useContractState from "@src/utils/hooks/contract/useContractState";
import useHederaWallets from "@src/utils/hooks/wallets/useHederaWallets";
import { useModal } from "@src/utils/hooks/useModal";

export const ContractClaimingCTAButtons = () => {
  const { toggleModal: toggleWalletConnectionModal } = useModal(
    "WalletConnectionModal"
  );
  const { userWalletId } = useHederaWallets();
  const { nftCollectionOnChainMetadata } = useContractState();
  const { associateToken, isAccountAssociatedToToken } =
    useClaimingPageContext();

  return (
    <div className="flex flex-col justify-center align-center gap-3 mt-8">
      {userWalletId && nftCollectionOnChainMetadata?.token_id && (
        <>
          {!isAccountAssociatedToToken && (
            <Button
              type="submit"
              className="mx-auto"
              onClick={async () =>
                await associateToken(
                  nftCollectionOnChainMetadata?.token_id || ""
                )
              }
              disabled={!userWalletId}
            >
              Associate token
            </Button>
          )}

          <ContractClaimingButton />
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
  );
};
