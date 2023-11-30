import { TooltipIcon } from '../../assets/icons/TooltipIcon'
import { Separator } from '../shared/Separator'
import useContractState from '@src/utils/hooks/useContractState'
import { DatePanel } from '@src/components/ClaimingPage/DatePanel'
import { CurrentPricePanel } from '@src/components/ClaimingPage/CurrentPricePanel'
import { Tooltip } from '@src/components/shared/Tooltip'
import {
  remainingDistributionTooltipText,
  otherGuardsTooltipText,
  NFTCollectionMetadataTooltipText,
} from '@src/utils/constants/tooltipText'

export const MetadataColumn: React.FC = () => {
  const {
    mintLimit,
    tokenGatingRequiredFungibleTokenList,
    tokenGatingRequiredNonFungibleTokenList,
    tokenGated,
    remainingDistributionAvailable,
    tokensDistributed,
    nftCollectionOnChainMetadata,
    nftSerialOffChainMetadata
  } = useContractState()

  const { token_id, symbol, name, max_supply } = nftCollectionOnChainMetadata || {}
  const tokenName = name || nftSerialOffChainMetadata?.properties?.collection || '-';

  return (
    <div className="w-1/2 min-w-[420px] flex flex-col gap-3">
      <h2 className="">{name}</h2>

      <div className="flex w-full justify-between gap-4">
        <CurrentPricePanel />

        <div className="w-1/2">
          <div className="flex mb-1.5 items-center gap-1">
            <p className="text-[12px]">Remaining Distribution Available</p>
            <Tooltip tooltip={remainingDistributionTooltipText}>
              <TooltipIcon />
            </Tooltip>
          </div>

          {remainingDistributionAvailable ? (
            <h4 className="mb-1.5">{`${remainingDistributionAvailable} / ${
              remainingDistributionAvailable + tokensDistributed
            }`}</h4>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>

      <DatePanel />
      <Separator />

      <div className="">
        <div className="flex mb-1.5 items-center gap-1">
          <p>Other Guards</p>
          <Tooltip tooltip={otherGuardsTooltipText}>
            <TooltipIcon />
          </Tooltip>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col">
            <h4 className="text-black mb-1.5">Token Gated</h4>
            <h4 className="text-black">Mint Limit</h4>
          </div>
          <div className="mb-1.5">
            <div className="flex">
              <p className="mb-1.5 mr-6">{tokenGated ? "Yes" : "No"}</p>
              {tokenGated && <p className="mr-1.5">Gated by</p>}
              {tokenGated && (
                <div className="mb-1.5">
                  <br />
                  <div className="mb-1.5">
                    {tokenGatingRequiredFungibleTokenList.map(
                      ({ tokenData: token, amount }, index, array) => (
                        <p key={token.symbol} className="mr-1.5">
                          {amount} of {token.symbol} ({token.name}) [
                          {token.token_id}]{index < array.length - 1 ? "," : ""}
                        </p>
                      )
                    )}
                  </div>
                  <div className="mb-1.5">
                    {tokenGatingRequiredNonFungibleTokenList.map(
                      ({ tokenData: token, amount }, index, array) => (
                        <p key={token.symbol} className="mr-1.5">
                          {amount} of {token.symbol} ({token.name}) [
                          {token.token_id}]{index < array.length - 1 ? "," : ""}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <p>
              {mintLimit
                ? `Maximum of ${mintLimit} NFtokenGatedTs per user`
                : "-"}
            </p>
          </div>
        </div>
      </div>
      <Separator />

      <div>
        <div className="flex mb-1.5 items-center gap-1">
          <p>NFT Collection On-Chain Metadata</p>
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
            <p>{token_id ? token_id : "-"}</p>
            <p>{symbol ? symbol : "-"}</p>
            <p>{tokenName}</p>
            <p>{max_supply === "0" || !max_supply ? "INFINITE" : max_supply}</p>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
