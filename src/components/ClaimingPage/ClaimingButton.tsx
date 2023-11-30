import { Button } from "@src/components/shared/Button";
import { Tooltip } from "@src/components/shared/Tooltip";
import MirrorNode from "@src/services/MirrorNode";
import { hederaIdToSolidityAddress } from "@src/utils/helpers/hederaIdToSolidityAddress";
import { RequiredAllowance } from "@src/utils/hooks/useClaiming";
import { useClaimingPageContext } from "@src/utils/hooks/useClaimingPageContext";
import useContractState from "@src/utils/hooks/useContractState";
import useHederaWallets from "@src/utils/hooks/useHederaWallets";
import { useCallback, useEffect, useState } from "react";

export const ClaimingButton = ({
  symbol,
  price,
  token_id,
  userAllowancesGivenForContractToSpendFT,
  className,
}: RequiredAllowance & {
  className?: string;
}) => {
  const { userWalletId } = useHederaWallets();
  const { nftCollectionOnChainMetadata } = useContractState();
  const [
    isContractAllowedToSpendUserFungibleTokens,
    setIsContractAllowedToSpendUserFungibleTokens,
  ] = useState(false);
  const [
    isUserAssociatedWithClaimingCurrency,
    setIsUserAssociatedWithClaimingCurrency,
  ] = useState(false);
  const {
    checkIfIsAllowedToClaimWithFT,
    approveTokenAllowance,
    isAccountAssociatedToToken,
    claimToken,
    claimCounter: { claimingStatus, timeToDistributionStart },
  } = useClaimingPageContext();

  useEffect(() => {
    if (userAllowancesGivenForContractToSpendFT >= Number(price?.toNumber())) {
      setIsContractAllowedToSpendUserFungibleTokens(true);
    }
  }, [price, userAllowancesGivenForContractToSpendFT]);

  const handleClaimToken = useCallback(
    async (price?: string, tokenId?: string) => {
      if (!nftCollectionOnChainMetadata?.token_id) {
        throw new Error("No token ID returned from contract!");
      }

      if (tokenId && price) {
        const isContractAllowedToSpendUserFungibleTokensResponse =
          await checkIfIsAllowedToClaimWithFT(tokenId, price);

        if (isContractAllowedToSpendUserFungibleTokensResponse) {
          setIsContractAllowedToSpendUserFungibleTokens(
            isContractAllowedToSpendUserFungibleTokensResponse
          );
        } else {
          await approveTokenAllowance(tokenId, price.toString());
        }

        return await claimToken(tokenId, price);
      }

      await claimToken("0x0000000000000000000000000000000000000000", price);
    },
    [
      approveTokenAllowance,
      checkIfIsAllowedToClaimWithFT,
      claimToken,
      nftCollectionOnChainMetadata?.token_id,
    ]
  );

  const checkIfUserIsAssociatedWithClaimingCurrency = useCallback(async () => {
    if (price && symbol !== "HBAR" && token_id && userWalletId) {
      const isFTAssociatedWithUser =
        await MirrorNode.checkTokenAssociationStatus(token_id, userWalletId);

      setIsUserAssociatedWithClaimingCurrency(isFTAssociatedWithUser);
    }
  }, [price, symbol, token_id, userWalletId]);

  useEffect(() => {
    checkIfUserIsAssociatedWithClaimingCurrency();
  }, [checkIfUserIsAssociatedWithClaimingCurrency]);

  const renderTooltip = useCallback((showClaimingCurrencyAssociatingError = false) => {
    let tooltipMessage: string | null = null;

    if (claimingStatus === "countToStart") {
      tooltipMessage = `Claiming will begin at ${timeToDistributionStart}`;
    }

    if (claimingStatus === 'expired') {
      tooltipMessage = "Claiming expired"
    }

    if (
      !isUserAssociatedWithClaimingCurrency &&
      showClaimingCurrencyAssociatingError
    ) {
      tooltipMessage = `You are not associated with ${symbol}`
    }

    if (tooltipMessage) {
      return (
        <Tooltip position="top" tooltip={tooltipMessage}>
          <span className="border-1 rounded-full bg-error w-6 h-6 flex text-center justify-center items-center  text-white">
            !
          </span>
        </Tooltip>
      );
    }
  }, [claimingStatus, isUserAssociatedWithClaimingCurrency, symbol, timeToDistributionStart])

  if (symbol === "HBAR" && price) {
    return (
      <Button
        className={className}
        type="submit"
        disabled={!isAccountAssociatedToToken || claimingStatus === 'countToStart' || claimingStatus === 'expired'}
        onClick={async () => await handleClaimToken(price.toString())}
      >
        Claim

        {renderTooltip()}
      </Button>
    );
  }

  if (!token_id) {
    console.warn("No token ID returned from contract!");
    return null;
  }

  if (!price) {
    console.warn("No token price returned from contract!");
    return null;
  }

  return (
    <>
      <Button
        className={className + " relative"}
        type="submit"
        disabled={
          !isAccountAssociatedToToken ||
          claimingStatus === "countToStart" ||
          claimingStatus === "expired" ||
          !isUserAssociatedWithClaimingCurrency
        }
        onClick={() => {
          handleClaimToken(
            price?.toString(),
            hederaIdToSolidityAddress(token_id)
          );
        }}
      >
        {isContractAllowedToSpendUserFungibleTokens
          ? "Claim"
          : "Approve and claim"}

        <span className="absolute -top-2 -right-2 text-white">
          {renderTooltip(true)}
        </span>
      </Button>
    </>
  );
};
