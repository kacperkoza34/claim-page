import useContractState from "@src/utils/hooks/contract/useContractState";
import { RequiredToken } from "@src/components/claiming-page/other-guards/RequiredToken";
import map from "lodash/map";

export const TokenGating = ({
  tokenGated,
  tokenGatingRequiredFungibleTokenList,
  tokenGatingRequiredNonFungibleTokenList,
}: Pick<
  ReturnType<typeof useContractState>,
  | "tokenGated"
  | "tokenGatingRequiredFungibleTokenList"
  | "tokenGatingRequiredNonFungibleTokenList"
>) => {
  return (
    <div className="grid grid-cols-2 gap-y-2 mt-2">
      <div>
        <h4 className="text-gray">
          {tokenGated ? "You need to hold at least:" : "Token Gated"}
        </h4>
      </div>
      <div>
        <p className="mr-6">{tokenGated ? "" : "No"}</p>
      </div>
      {tokenGatingRequiredFungibleTokenList.length > 0 && (
        <>
          <h4 className="text-black list-inside ml-4">• Fungible Tokens</h4>
          <div className="flex-col">
            {map(
              tokenGatingRequiredFungibleTokenList,
              ({ tokenData: { name, token_id, symbol }, amount }) => (
                <>
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                </>
              )
            )}
          </div>
        </>
      )}

      {tokenGatingRequiredNonFungibleTokenList.length > 0 && (
        <>
          <h4 className="text-black list-inside ml-4">• Non Fungible Tokens</h4>

          <div>
            {map(
              tokenGatingRequiredNonFungibleTokenList,
              ({ tokenData: { name, token_id, symbol }, amount }) => (
                <>
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                  <RequiredToken
                    tokenName={name}
                    tokenId={token_id}
                    tokenSymbol={symbol}
                    amount={amount}
                  />
                </>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};
