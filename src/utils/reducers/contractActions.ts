import { TokenGatingRequiredToken } from "@src/utils/services/HDC";
import { OffChainMetadata } from "@src/utils/services/Metadata";
import { DistributionDates } from "@src/utils/entity/NFTInfo";
import {
  Action,
  ContractStateActions,
} from "@src/utils/reducers/contractReducer";
import { NFTData } from "@src/utils/types/NFTDataInterface";
import { TokenDataInterface } from "@src/utils/types/TokenDataInterface";

export const setRemainingDistributionAvailable = async (
  payload: number,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_REMAINING_DISTRIBUTION,
    payload,
  });

export const setTokenGatingRequiredFungibleTokenList = async (
  payload: TokenGatingRequiredToken[],
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_TOKEN_GATING_REQUIRED_FUNGIBLE_TOKEN_LIST,
    payload,
  });

export const setTokenGatingRequiredNonFungibleTokenList = async (
  payload: TokenGatingRequiredToken[],
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_TOKEN_GATING_REQUIRED_NON_FUNGIBLE_TOKEN_LIST,
    payload,
  });

export const setMintLimit = async (
  payload: string,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_MINT_LIMIT,
    payload,
  });

export const setPaymentEnabled = async (
  payload: boolean,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_PAYMENT_ENABLED,
    payload,
  });

export const setTokensDistributed = async (
  payload: number,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_TOKENS_DISTRIBUTED,
    payload,
  });

export const setTokensPriceData = async (
  payload: TokenDataInterface[],
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_TOKENS_PRICE_DATA,
    payload,
  });

export const setNFTCollectionOnChainMetadata = async (
  payload: TokenDataInterface,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_NFT_COLLECTION_ON_CHAIN_METADATA,
    payload,
  });

export const setSerialData = async (
  payload: NFTData,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_NFT_SERIAL_DATA,
    payload,
  });

export const setTokenGated = async (
  payload: boolean,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_TOKEN_GATED,
    payload,
  });

export const setNFTSerialOffChainMetadata = async (
  payload: OffChainMetadata,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_NFT_SERIAL_OFF_CHAIN_METADATA,
    payload,
  });

export const setPreviewImage = async (
  payload: string | null,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_PREVIEW_IMAGE,
    payload,
  });

export const setDistributionDates = async (
  payload: DistributionDates,
  dispatch: React.Dispatch<Action>
) =>
  dispatch({
    type: ContractStateActions.SET_DISTRIBUTION_DATES,
    payload,
  });
