import { TokenId } from "@hashgraph/sdk";
import { SMART_CONTRACT_ID_HEXADECIMAL } from "@src/utils/constants/appInfo";
import { DEFAULT_POST_REQUEST_CONFIG } from "@src/utils/constants/defaultPostRequestConfig";
import { adjustNumberWithDecimals } from "@src/utils/helpers/adjustNumberWithDecimals";
import { convertContractAddress } from "@src/utils/helpers/convertContractAddress";
import { NFTData } from "@src/utils/types/NFTDataInterface";
import { TokenDataInterface } from "@src/utils/types/TokenDataInterface";
import axios, { AxiosError } from "axios";
import { ethers } from "ethers";

const HEDERA_NETWORK = import.meta.env.VITE_HEDERA_NETWORK as string;

const consoleWarnAxiosError = (e: unknown) => {
  if (e instanceof AxiosError) {
    console.warn({
      axiosError: {
        response: e.response,
        body: JSON.parse(e?.config?.data),
        messages: e.response?.data?._status?.messages,
      },
    });
  }
};

export default class MirrorNode {
  static url = `https://${
    HEDERA_NETWORK === "mainnet" ? "mainnet-public" : HEDERA_NETWORK
  }.mirrornode.hedera.com/api/v1`;
  static readonly instance = axios.create({
    baseURL: MirrorNode.url,
  });

  static async getFromContract(
    contract: ethers.Interface,
    method: string,
    value?: [string]
  ) {
    try {
      const data = contract.encodeFunctionData(method, value);
      const requestBody = {
        data,
        to: SMART_CONTRACT_ID_HEXADECIMAL,
        ...DEFAULT_POST_REQUEST_CONFIG,
      };
      const response = await this.instance.post(`/contracts/call`, requestBody);
      const json = await response.data;
      const decodedData = contract.decodeFunctionResult(method, json.result);

      return decodedData;
    } catch (e) {
      consoleWarnAxiosError(e);

      return null;
    }
  }

  static async getTokenData(
    tokenId: string
  ): Promise<{ symbol: string; decimals: string; name: string }> {
    const response = await this.instance.get(`/tokens/${tokenId}`);
    const { symbol, decimals, name, token_id, max_supply } =
      await response.data;
    const objectToReturn = { symbol, decimals, name, token_id, max_supply };

    return objectToReturn;
  }

  static async getNFTData(
    tokenId: string | undefined,
    serialNumber: string
  ): Promise<NFTData> {
    const response = await this.instance.get<NFTData>(
      `/tokens/${tokenId}/nfts/${serialNumber}`
    );
    return response.data;
  }

  static async getBalanceOfToken(
    tokenId: string,
    walletId: string
  ): Promise<number | undefined> {
    const {
      data: { tokens },
    } = await this.instance.get(
      `/accounts/${walletId}/tokens?token.id=${tokenId}`
    );

    return tokens[0]?.balance;
  }

  // TODO dlaczego to robi cos z prices zamiast tylko fetchowac dane tokenow?
  static async getTokensData(
    tokensId: string[],
    prices?: number[]
  ): Promise<TokenDataInterface[]> {
    const promises = tokensId.map((id) => {
      if (id === "0x0000000000000000000000000000000000000000") {
        return Promise.resolve({
          name: "HBAR",
          symbol: "HBAR",
          decimals: "8",
        });
      }

      const convertedID = convertContractAddress(id);
      return MirrorNode.getTokenData(convertedID);
    });

    let responses = (await Promise.all(promises)) as TokenDataInterface[];

    if (prices) {
      responses = responses.map((response, index) => ({
        ...response,
        price: adjustNumberWithDecimals(prices[index], response.decimals),
      }));
    }

    return responses;
  }

  static async checkTokenAssociationStatus(tokenId: string, accountId: string) {
    tokenId = tokenId.startsWith("0x")
      ? TokenId.fromSolidityAddress(tokenId).toString()
      : tokenId;

    const { data } = await this.instance.get(
      `/accounts/${accountId}/tokens?token.id=${tokenId}`
    );

    return Boolean(data.tokens.length);
  }

  static async getAllowancesForToken(
    wallet: string,
    contractId: string,
    tokenId: string
  ) {
    try {
      const { data } = await this.instance.get<{
        allowances: { amount: number }[];
      }>(
        `accounts/${wallet}/allowances/tokens?spender.id=${contractId.toString()}&token.id=${tokenId}`
      );

      const approvals = data.allowances || [];

      return approvals.length ? approvals[0]?.amount || 0 : 0;
    } catch (e) {
      return 0;
    }
  }
}
