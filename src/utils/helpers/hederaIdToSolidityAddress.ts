import { AccountId, TokenId } from "@hashgraph/sdk";

export const hederaIdToSolidityAddress = (id: string, type: 'tokenId' | 'accountId' = 'tokenId') =>
  "0x" + (type === 'tokenId' ? TokenId : AccountId).fromString(id).toSolidityAddress().toString();
