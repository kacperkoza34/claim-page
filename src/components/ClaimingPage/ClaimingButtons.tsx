import { ClaimingButton } from "@src/components/ClaimingPage/ClaimingButton";
import { MultiPriceClaimModal } from "@src/components/modals/MultiPriceClaimModal";
import { Button } from "@src/components/shared/Button";
import { useClaimingPageContext } from "@src/utils/hooks/useClaimingPageContext";
import useContractState from "@src/utils/hooks/useContractState";
import useHederaWallets from "@src/utils/hooks/useHederaWallets";
import { useModal } from "@src/utils/hooks/useModal";
import { useMemo } from "react";

export const ClaimingButtons = () => {
  const { claimToken, isAccountAssociatedToToken, requiredAllowances } =
    useClaimingPageContext();
  const { toggleModal: toogleMultiPriceClaimModal } = useModal(
    "MultiPriceClaimModal"
  );
  const { userWalletId } = useHederaWallets();
  const { tokensPriceData } = useContractState();

  const isFreeToClaim = useMemo(
    () => tokensPriceData.length <= 0,
    [tokensPriceData.length]
  );

  if (!userWalletId) {
    return;
  }

  if (isFreeToClaim) {
    return (
      <Button
        type="submit"
        className="mx-auto bg-black text-textDefault"
        disabled={!isAccountAssociatedToToken}
        onClick={async () =>
          await claimToken("0x0000000000000000000000000000000000000000")
        }
      >
        Claim for free
      </Button>
    );
  }

  if (requiredAllowances.length === 1) {
    return (
      <ClaimingButton className="w-max mx-auto" {...requiredAllowances[0]} />
    );
  }

  return (
    <>
      <MultiPriceClaimModal prices={requiredAllowances} />

      <Button
        className="mx-auto"
        disabled={!isAccountAssociatedToToken}
        onClick={toogleMultiPriceClaimModal}
      >
        Claim
      </Button>
    </>
  );
};
