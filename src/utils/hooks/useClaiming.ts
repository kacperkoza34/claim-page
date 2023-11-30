import { type ContractId } from "@hashgraph/sdk";
import { HederaDistributionContract } from "@src/services/HDC";
import { HederaTokenService } from "@src/services/HTS";
import MirrorNode from "@src/services/MirrorNode";
import { TokenDataInterface } from "@src/utils//types/TokenDataInterface";
import { fromEVMAddressToHederaAccountId } from "@src/utils/helpers/fromEVMAddressToHederaId";
import useClaimCounter from "@src/utils/hooks/useClaimCounter";
import useContractState from "@src/utils/hooks/useContractState";
import useHederaWallets from "@src/utils/hooks/useHederaWallets";
import findIndex from "lodash/findIndex";
import map from "lodash/map";
import { useCallback, useEffect, useState } from "react";

export type RequiredAllowance = Pick<
  TokenDataInterface,
  "symbol" | "price" | "token_id"
> & {
  userAllowancesGivenForContractToSpendFT: number;
};

export const useClaiming = (contractId: ContractId | string) => {
  const { sendTransaction, userWalletId } = useHederaWallets();
  const { nftCollectionOnChainMetadata, tokensPriceData, distributionDates } = useContractState();
  const claimCounter = useClaimCounter(distributionDates);
  const [requiredAllowances, setRequiredAllowances] = useState<
    RequiredAllowance[]
  >([]);
  const [isAccountAssociatedToToken, setIsAccountAssociatedToToken] =
    useState(false);
  const [associationWasSetManually, setAssociationWasSetManually] =
    useState(false);

  const approveTokenAllowance = useCallback(
    async (tokenId: string, amount: string) => {
      if (!userWalletId) {
        return;
      }

      if (tokenId.startsWith("0x")) {
        tokenId = fromEVMAddressToHederaAccountId(tokenId);
      }

      const approveAllowanceForTokenTransaction =
        HederaTokenService.createAccountAllowanceApproveTransaction(
          tokenId,
          userWalletId,
          contractId.toString(),
          amount
        );

      const receipt = await sendTransaction(
        approveAllowanceForTokenTransaction
      );

      if (!receipt) {
        return;
      }

      return !!receipt;
    },
    [userWalletId, contractId, sendTransaction]
  );

  const associateToken = useCallback(
    async (tokenId: string) => {
      if (!userWalletId) {
        return;
      }

      const associateTokenTransaction =
        HederaTokenService.createAssociateTokenTransaction(
          userWalletId,
          tokenId
        );

      const receipt = await sendTransaction(associateTokenTransaction);

      if (!receipt) {
        return;
      }

      setIsAccountAssociatedToToken(true);
      setAssociationWasSetManually(true);
    },
    [sendTransaction, userWalletId]
  );

  const checkIfIsAllowedToClaimWithFT = useCallback(
    async (tokenId: string, price: string) => {
      if (!userWalletId) {
        return;
      }

      const allowances = await MirrorNode.getAllowancesForToken(
        userWalletId,
        contractId.toString(),
        tokenId
      );
      const isTokenAllowedToClaim = allowances >= Number(price);

      const indexOfFTInRequiredAllowances = findIndex(
        requiredAllowances,
        ({ token_id }) => token_id === tokenId
      );

      if (indexOfFTInRequiredAllowances > -1) {
        setRequiredAllowances((prev) => {
          prev[
            indexOfFTInRequiredAllowances
          ].userAllowancesGivenForContractToSpendFT = allowances;

          return prev;
        });
      }

      return isTokenAllowedToClaim;
    },
    [contractId, requiredAllowances, userWalletId]
  );

  const checkIfAccountIsAssociatedToToken = useCallback(
    async (tokenId: string) => {
      if (!userWalletId) {
        return;
      }

      const isAccountAssociatedToToken =
        await MirrorNode.checkTokenAssociationStatus(tokenId, userWalletId);

      setIsAccountAssociatedToToken(isAccountAssociatedToToken);
      setAssociationWasSetManually(true);
      return isAccountAssociatedToToken;
    },
    [userWalletId]
  );

  const claimToken = useCallback(
    async (paymentToken: string, price?: string, leaves: string[] = []) => {
      if (!userWalletId) {
        return;
      }

      const claimTransaction =
        await HederaDistributionContract.createClaimTransaction(
          userWalletId,
          contractId.toString(),
          leaves,
          paymentToken,
          price ?? ""
        );

      const receipt = await sendTransaction(claimTransaction);

      if (!receipt) {
        throw new Error(
          "Something went wrong while approving the token allowance."
        );
      }
    },
    [contractId, sendTransaction, userWalletId]
  );

  const initialCheckIfTokenIsAssociatedWithPairedUserWalletId =
    useCallback(async () => {
      if (!nftCollectionOnChainMetadata?.token_id) {
        return;
      }

      await checkIfAccountIsAssociatedToToken(
        nftCollectionOnChainMetadata?.token_id
      );
    }, [
      checkIfAccountIsAssociatedToToken,
      nftCollectionOnChainMetadata?.token_id,
    ]);

  const initialCheckForTokenPricesAndAllowances = useCallback(async () => {
    if (tokensPriceData && userWalletId) {
      setRequiredAllowances(
        await Promise.all(
          map(tokensPriceData, async ({ token_id, price, symbol }) => ({
            token_id,
            price,
            symbol,
            userAllowancesGivenForContractToSpendFT: token_id // No token ID means it is HBAR.
              ? await MirrorNode.getAllowancesForToken(
                  userWalletId,
                  contractId.toString(),
                  token_id ?? ""
                )
              : 0,
          }))
        )
      );
    }
  }, [contractId, tokensPriceData, userWalletId]);

  useEffect(() => {
    if (userWalletId) {
      setAssociationWasSetManually(false);
    }
  }, [userWalletId]);

  useEffect(() => {
    if (!associationWasSetManually) {
      initialCheckIfTokenIsAssociatedWithPairedUserWalletId();
    }

    if (!requiredAllowances.length && tokensPriceData) {
      initialCheckForTokenPricesAndAllowances();
    }
  }, [
    initialCheckIfTokenIsAssociatedWithPairedUserWalletId,
    initialCheckForTokenPricesAndAllowances,
    isAccountAssociatedToToken,
    requiredAllowances.length,
    tokensPriceData,
    associationWasSetManually,
  ]);

  return {
    approveTokenAllowance,
    associateToken,
    claimToken,
    checkIfIsAllowedToClaimWithFT,
    isAccountAssociatedToToken,
    requiredAllowances,
    claimCounter,
  };
};
