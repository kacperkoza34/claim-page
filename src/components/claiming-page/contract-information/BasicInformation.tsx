import { TooltipIcon } from "@src/assets/icons/TooltipIcon";
import { CurrentPricePanel } from "@src/components/claiming-page/CurrentPricePanel";
import { DatePanel } from "@src/components/claiming-page/DatePanel";
import { Tooltip } from "@src/components/shared/Tooltip";
import {
  remainingDistributionTooltipText
} from "@src/utils/constants/tooltipText";
import useContractState from "@src/utils/hooks/contract/useContractState";

export const BasicInformation = ({
  tokenName,
  remainingDistributionAvailable,
  tokensDistributed,
}: Pick<
  ReturnType<typeof useContractState>,
  | "remainingDistributionAvailable"
  | "tokensDistributed"
> & {
  tokenName: string;
}) => {
  return (
    <div className='grid gap-y-5'>
      <h2 className="">{tokenName}</h2>

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
    </div>
  );
};
