import { TooltipIcon } from "@src/assets/icons/TooltipIcon";
import { Tooltip } from "@src/components/shared/Tooltip";
import { uniqueId } from "lodash";

export const RequiredToken = ({
  tokenSymbol,
  amount,
  tokenName,
  tokenId,
}: {
  tokenSymbol?: string;
  amount?: number;
  tokenName?: string;
  tokenId?: string;
}) => {
  return (
    <p
      key={uniqueId(`${tokenSymbol}-${tokenName}-${tokenId}`)}
      className="flex items-center text-s"
    >
      <span className="mr-1">{amount}</span>{" "}
      <span className="text-xs inline-flex">
        of <span className="ml-1 mr-1">{tokenName}</span>{" "}
        <Tooltip
          tooltip={
            <>
              <p className="text-white  text-xs">
                Token ID: <span className="font-bold">{tokenId}</span>
              </p>
              <p className="text-white  text-xs">
                Token name: <span className="font-bold">{tokenName}</span>
              </p>
              <p className="text-white text-xs">
                Token Symbol: <span className="font-bold">{tokenSymbol}</span>
              </p>
            </>
          }
        >
          <TooltipIcon />
        </Tooltip>
      </span>
    </p>
  );
};
