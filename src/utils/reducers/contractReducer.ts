import { TokenGatingRequiredToken } from "@src/utils/services/HDC";
import { OffChainMetadata } from "@src/utils/services/Metadata";
import { ContractState } from "@src/utils/context/ContractStateContext";
import { DistributionDates } from "@src/utils/entity/NFTInfo";
import { NFTData } from "@src/utils/types/NFTDataInterface";
import { TokenDataInterface } from "@src/utils/types/TokenDataInterface";

export enum ContractStateActions  {
  'SET_REMAINING_DISTRIBUTION',
  "SET_TOKEN_GATING_REQUIRED_FUNGIBLE_TOKEN_LIST",
  "SET_TOKEN_GATING_REQUIRED_NON_FUNGIBLE_TOKEN_LIST",
  "SET_MINT_LIMIT",
  "SET_PAYMENT_ENABLED",
  "SET_TOKENS_DISTRIBUTED",
  "SET_TOKENS_PRICE_DATA",
  "SET_NFT_COLLECTION_ON_CHAIN_METADATA",
  "SET_TOKEN_GATED",
  "SET_NFT_SERIAL_DATA",
  "SET_NFT_SERIAL_OFF_CHAIN_METADATA",
  "SET_PREVIEW_IMAGE",
  "SET_DISTRIBUTION_DATES"
}

export type Action =
  | { type: ContractStateActions.SET_REMAINING_DISTRIBUTION; payload: number }
  | { type: ContractStateActions.SET_TOKEN_GATING_REQUIRED_FUNGIBLE_TOKEN_LIST; payload: TokenGatingRequiredToken[] }
  | { type: ContractStateActions.SET_TOKEN_GATING_REQUIRED_NON_FUNGIBLE_TOKEN_LIST; payload: TokenGatingRequiredToken[] }
  | { type: ContractStateActions.SET_MINT_LIMIT; payload: string }
  | { type: ContractStateActions.SET_PAYMENT_ENABLED; payload: boolean }
  | { type: ContractStateActions.SET_TOKENS_DISTRIBUTED; payload: number }
  | { type: ContractStateActions.SET_TOKENS_PRICE_DATA; payload: TokenDataInterface[] }
  | { type: ContractStateActions.SET_NFT_COLLECTION_ON_CHAIN_METADATA; payload: TokenDataInterface | null }
  | { type: ContractStateActions.SET_TOKEN_GATED; payload: boolean }
  | { type: ContractStateActions.SET_NFT_SERIAL_DATA; payload: NFTData | null }
  | { type: ContractStateActions.SET_NFT_SERIAL_OFF_CHAIN_METADATA; payload: OffChainMetadata | null }
  | { type: ContractStateActions.SET_PREVIEW_IMAGE; payload: string | null }
  | { type: ContractStateActions.SET_DISTRIBUTION_DATES; payload: DistributionDates | null };

export const contractReducer = (state: ContractState, action: Action): ContractState => {
  switch (action.type) {
    case ContractStateActions.SET_REMAINING_DISTRIBUTION:
      return { ...state, remainingDistributionAvailable: action.payload };
    case ContractStateActions.SET_TOKEN_GATING_REQUIRED_FUNGIBLE_TOKEN_LIST:
      return { ...state, tokenGatingRequiredFungibleTokenList: action.payload };
    case ContractStateActions.SET_TOKEN_GATING_REQUIRED_NON_FUNGIBLE_TOKEN_LIST:
      return { ...state, tokenGatingRequiredNonFungibleTokenList: action.payload };
    case ContractStateActions.SET_MINT_LIMIT:
      return { ...state, mintLimit: action.payload };
    case ContractStateActions.SET_PAYMENT_ENABLED:
      return { ...state, paymentEnabled: action.payload };
    case ContractStateActions.SET_TOKENS_DISTRIBUTED:
      return { ...state, tokensDistributed: action.payload };
    case ContractStateActions.SET_TOKENS_PRICE_DATA:
      return { ...state, tokensPriceData: action.payload };
    case ContractStateActions.SET_NFT_COLLECTION_ON_CHAIN_METADATA:
      return { ...state, nftCollectionOnChainMetadata: action.payload };
    case ContractStateActions.SET_TOKEN_GATED: 
      return { ...state, tokenGated: action.payload }
    case ContractStateActions.SET_NFT_SERIAL_DATA:
      return { ...state, nftSerialData: action.payload };
    case ContractStateActions.SET_NFT_SERIAL_OFF_CHAIN_METADATA:
      return { ...state, nftSerialOffChainMetadata: action.payload };
    case ContractStateActions.SET_PREVIEW_IMAGE:
        return { ...state, previewImage: action.payload };
    case ContractStateActions.SET_DISTRIBUTION_DATES:
      return { ...state, distributionDates: action.payload };
    default:
      return state;
  }
};
