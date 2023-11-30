import { useEffect, createContext, useReducer, useState } from "react";
import { TokenDataInterface } from "@src/utils/types/TokenDataInterface";
import { NFTData } from "@src/utils/types/NFTDataInterface";
import { contractReducer } from "@src/utils/reducers/contractReducer";
import { 
  setTokenGatingRequiredFungibleTokenList, 
  setRemainingDistributionAvailable, 
  setTokenGatingRequiredNonFungibleTokenList, 
  setMintLimit, 
  setPaymentEnabled, 
  setTokensDistributed, 
  setTokensPriceData, 
  setNFTCollectionOnChainMetadata, 
  setSerialData, 
  setTokenGated,
  setNFTSerialOffChainMetadata,
  setPreviewImage,
  setDistributionDates
} from "@src/utils/reducers/contractActions";
import { Metadata, OffChainMetadata } from "@src/utils/services/Metadata";
import { DistributionDates } from "@src/utils/entity/NFTInfo";
import { HederaDistributionContract, TokenGatingRequiredToken } from "@src/utils/services/HDC";

export interface ContractState {
  remainingDistributionAvailable: number;
  mintLimit: string;
  paymentEnabled: boolean;
  tokenGatingRequiredFungibleTokenList: TokenGatingRequiredToken[];
  tokenGatingRequiredNonFungibleTokenList: TokenGatingRequiredToken[];
  tokenGated: boolean | null;
  tokensDistributed: number;
  tokensPriceData: TokenDataInterface[];
  nftCollectionOnChainMetadata: TokenDataInterface | null;
  nftSerialData: NFTData | null;
  nftSerialOffChainMetadata: OffChainMetadata | null;
  previewImage: string | null;
  distributionDates: DistributionDates | null;
  isDataLoading: boolean;
}

const INITIAL_CONTRACT_STATE = {
  remainingDistributionAvailable: 0,
  mintLimit: "",
  paymentEnabled: false,
  tokenGatingRequiredFungibleTokenList: [],
  tokenGatingRequiredNonFungibleTokenList: [],
  tokenGated: null,
  tokensDistributed: 0,
  tokensPriceData: [],
  nftCollectionOnChainMetadata: null,
  nftSerialData: null,
  nftSerialOffChainMetadata: null,
  previewImage: null,
  distributionDates: null,
  isDataLoading: true,
};

export const ContractStateContext = createContext<ContractState>(
  INITIAL_CONTRACT_STATE
);

export const ContractStateProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): React.ReactNode => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [state, dispatch] = useReducer(contractReducer, INITIAL_CONTRACT_STATE);

  const getNFTdata = async (): Promise<void> => {
    const onChainData =
      await HederaDistributionContract.getCollectionOnChainMetadata();

    if (onChainData) {
      setNFTCollectionOnChainMetadata(onChainData, dispatch);

      if (!onChainData.token_id) {
        return;
      }

      const serialData = await HederaDistributionContract.getSerialData(
        onChainData.token_id
      );

      if (!serialData) {
        return;
      }

      setSerialData(serialData, dispatch);

      const metadata = new Metadata(serialData.metadata);
      const offChainMetadata = await metadata.getMetadata();

      setNFTSerialOffChainMetadata(offChainMetadata, dispatch);
    }
  };

  const fetchContractStateData = async () => {
    setIsDataLoading(true);

    const [
      remainingDistributionAvailableGateValue,
      tokenGatingRequiredFungibleTokenListValue,
      tokenGatingRequiredNonFungibleTokenListValue,
      mintLimitGateValue,
      enablePaymentGateValue,
      nftsDistributedGateValue,
      tokensPriceDataGateValue,
      previewImageGateValue,
      datesGateValue,
    ] = await Promise.all([
      HederaDistributionContract.getRemainingDistributionAvailable(),
      HederaDistributionContract.getTokenGatingRequiredTokenList('fungible'),
      HederaDistributionContract.getTokenGatingRequiredTokenList('non-fungible'),
      HederaDistributionContract.getMintLimit(),
      HederaDistributionContract.getEnablePayment(),
      HederaDistributionContract.getSNFTSDistributed(),
      HederaDistributionContract.getTokensPriceData(),
      HederaDistributionContract.getPreviewImage(),
      HederaDistributionContract.getDates(),
      getNFTdata(),
    ]);

    if (remainingDistributionAvailableGateValue) {
      setRemainingDistributionAvailable(
        remainingDistributionAvailableGateValue,
        dispatch
      );
    }

    if (tokenGatingRequiredFungibleTokenListValue) {
      setTokenGatingRequiredFungibleTokenList(tokenGatingRequiredFungibleTokenListValue, dispatch);
    }

    if (tokenGatingRequiredNonFungibleTokenListValue) {
      setTokenGatingRequiredNonFungibleTokenList(tokenGatingRequiredNonFungibleTokenListValue, dispatch);
    }

    if (mintLimitGateValue) {
      setMintLimit(mintLimitGateValue, dispatch);
    }

    if (enablePaymentGateValue) {
      setPaymentEnabled(enablePaymentGateValue, dispatch);
    }

    if (nftsDistributedGateValue) {
      setTokensDistributed(nftsDistributedGateValue, dispatch);
    }

    if (tokensPriceDataGateValue) {
      setTokensPriceData(tokensPriceDataGateValue, dispatch);
    }

    if (previewImageGateValue) {
      setPreviewImage(previewImageGateValue, dispatch);
    }

    if (datesGateValue) {
      setDistributionDates(datesGateValue, dispatch);
    }

    setIsDataLoading(false);
  };

  useEffect(() => {
    fetchContractStateData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTokenGated(!!(state.tokenGatingRequiredFungibleTokenList.length || state.tokenGatingRequiredNonFungibleTokenList.length), dispatch);
  }, [state.tokenGatingRequiredFungibleTokenList, state.tokenGatingRequiredNonFungibleTokenList]);

  return <ContractStateContext.Provider value={{...state, isDataLoading}}> 
    {children}
  </ContractStateContext.Provider>
};
