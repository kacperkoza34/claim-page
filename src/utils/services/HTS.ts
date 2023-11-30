import {
  AccountAllowanceApproveTransaction,
  TokenAssociateTransaction
} from "@hashgraph/sdk";
import { handleSDKError } from "@src/utils/helpers/handleHashgraphSdkError";

export class HederaTokenService {
  public static createAccountAllowanceApproveTransaction(
    tokenId: string,
    owner: string,
    spender: string,
    amount: string
  ) {
    return handleSDKError(() =>
      new AccountAllowanceApproveTransaction().approveTokenAllowance(
        tokenId,
        owner,
        spender,
        Number(amount) ?? 0
      )
    )();
  }

  public static createAssociateTokenTransaction(userAccountId: string, tokenId: string) {
    return handleSDKError(() =>
      new TokenAssociateTransaction({ accountId: userAccountId }).setTokenIds([tokenId])
    )();
  }
}
