import { TooltipIcon } from "@src/assets/icons/TooltipIcon";
import { Tooltip } from "@src/components/shared/Tooltip";
import { NFTCollectionMetadataTooltipText } from "@src/utils/constants/tooltipText";
import useContractState from "@src/utils/hooks/contract/useContractState";

export const OnChainTokenMetadata = ({
  nftCollectionOnChainMetadata,
}: Pick<
  ReturnType<typeof useContractState>,
  | "nftCollectionOnChainMetadata"
>) => {
  return (
    <div>
      <div className="flex mb-1.5 items-center gap-1">
        <p className="text-[12px]">NFT Collection On-Chain Metadata</p>
        <Tooltip tooltip={NFTCollectionMetadataTooltipText}>
          <TooltipIcon />
        </Tooltip>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-black">Token ID</h4>
          <h4 className="text-black">Token Symbol</h4>
          <h4 className="text-black">Token Name</h4>
          <h4 className="text-black">Max Supply</h4>
        </div>
        <div className="flex flex-col gap-1.5">
          <p>
            {nftCollectionOnChainMetadata?.token_id
              ? nftCollectionOnChainMetadata.token_id
              : "-"}
          </p>
          <p>
            {nftCollectionOnChainMetadata?.symbol
              ? nftCollectionOnChainMetadata.symbol
              : "-"}
          </p>
          <p>
            {nftCollectionOnChainMetadata?.name
              ? nftCollectionOnChainMetadata.name
              : "-"}
          </p>
          <p>
            {nftCollectionOnChainMetadata?.max_supply === "0" ||
            !nftCollectionOnChainMetadata?.max_supply
              ? "INFINITE"
              : nftCollectionOnChainMetadata.max_supply}
          </p>
        </div>
      </div>
    </div>
  );
};
