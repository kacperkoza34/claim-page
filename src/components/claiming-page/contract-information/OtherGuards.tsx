import { TooltipIcon } from "@src/assets/icons/TooltipIcon";
import { Tooltip } from "@src/components/shared/Tooltip";
import { otherGuardsTooltipText } from "@src/utils/constants/tooltipText";
import useContractState from "@src/utils/hooks/contract/useContractState";
import { TokenGating } from "@src/components/claiming-page/other-guards/TokenGating";

export const OtherGuards = ({
  tokenGated,
  tokenGatingRequiredFungibleTokenList,
  tokenGatingRequiredNonFungibleTokenList,
  mintLimit,
}: Pick<
  ReturnType<typeof useContractState>,
  | "tokenGated"
  | "tokenGatingRequiredFungibleTokenList"
  | "tokenGatingRequiredNonFungibleTokenList"
  | "mintLimit"
>) => {
  return (
    <div>
      <div className="flex mb-1.5 items-center gap-2">
        <p className="text-[12px]">Other Guards</p>
        <Tooltip tooltip={otherGuardsTooltipText}>
          <TooltipIcon />
        </Tooltip>
      </div>

      <div className="grid grid-cols-2 gap-y-2 mt-1">
        <h4 className='text-gray'>Mint Limit</h4>
        <p>{mintLimit ? `Maximum of ${mintLimit} NFT per user` : "None"}</p>
      </div>

      <TokenGating
        tokenGated={tokenGated}
        tokenGatingRequiredFungibleTokenList={
          tokenGatingRequiredFungibleTokenList
        }
        tokenGatingRequiredNonFungibleTokenList={
          tokenGatingRequiredNonFungibleTokenList
        }
      />
    </div>
  );
};
