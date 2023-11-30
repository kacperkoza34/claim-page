import useContractState from "@src/utils/hooks/contract/useContractState";
import { Separator } from "@src/components/shared/Separator";
import { BasicInformation } from "@src/components/claiming-page/contract-information/BasicInformation";
import { OnChainTokenMetadata } from "@src/components/claiming-page/contract-information/OnChainTokenMetadata";
import { OtherGuards } from "@src/components/claiming-page/contract-information/OtherGuards";

export const ContractInformationColumn: React.FC = () => {
  const {
    mintLimit,
    tokenGatingRequiredNonFungibleTokenList,
    tokenGatingRequiredFungibleTokenList,
    tokenGated,
    remainingDistributionAvailable,
    tokensDistributed,
    nftCollectionOnChainMetadata,
  } = useContractState();

  return (
    <div className="w-1/2 min-w-[420px] flex flex-col gap-3">
      <BasicInformation
        tokenName={nftCollectionOnChainMetadata?.name || "-"}
        remainingDistributionAvailable={remainingDistributionAvailable}
        tokensDistributed={tokensDistributed}
      />

      <Separator />

      <OtherGuards
        tokenGated={tokenGated}
        mintLimit={mintLimit}
        tokenGatingRequiredFungibleTokenList={
          tokenGatingRequiredFungibleTokenList
        }
        tokenGatingRequiredNonFungibleTokenList={
          tokenGatingRequiredNonFungibleTokenList
        }
      />

      <Separator />

      <OnChainTokenMetadata
        nftCollectionOnChainMetadata={nftCollectionOnChainMetadata}
      />

      <Separator />
    </div>
  );
};
