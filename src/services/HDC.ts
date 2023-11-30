import {
  ContractExecuteTransaction,
  ContractId,
  TokenId
} from "@hashgraph/sdk";
import { default as DistributionConctractAbi, default as SNFTSDistributedAbi, default as distributionContract } from "@src/utils/abi/DistributionContract.sol/DistributionContract.json";
import EndTimestampAbi from "@src/utils/abi/gates/EndTimestampGate.sol/EndTimestampGateContract.json";
import FTGateAbi from "@src/utils/abi/gates/FTGateContract.sol/FTGateContract.json";
import MintLimitAbi from "@src/utils/abi/gates/MintLimitGate.sol/MintLimitGateContract.json";
import NFTGateAbi from "@src/utils/abi/gates/NFTGateContract.sol/NFTGateContract.json";
import StartTimestampAbi from "@src/utils/abi/gates/StartTimestampGate.sol/StartTimestampGateContract.json";
import IPaymentAbi from "@src/utils/abi/interfaces/IPaymentModule.sol/IPaymentModule.json";
import CurrentSerialNumberAbi from "@src/utils/abi/modules/DefaultSerialNumberGeneratorContract.sol/DefaultSerialNumberGeneratorContract.json";
import HBARAndFTPaymentAbi from "@src/utils/abi/modules/HBARAndFTPaymentContract.sol/HBARAndFTPaymentContract.json";
import { DistributionDates } from "@src/utils/entity/NFTInfo";
import { handleSDKError } from "@src/utils/helpers/handleHashgraphSdkError";
import { NFTData } from "@src/utils/types/NFTDataInterface";
import { TokenDataInterface } from "@src/utils/types/TokenDataInterface";
import { ethers } from "ethers";
import map from "lodash/map";
import MerkleTree from "merkletreejs";
import { keccak256 } from "web3-utils";
import { HederaContractService } from "./HCS";
import MirrorNode from "./MirrorNode";

export type Address = `0x${string}` | string;

export type TokenGatingRequiredToken = {
  tokenData: TokenDataInterface;
  address: string;
  amount: number;
};

export interface GetNFT {
  merkleProof: Array<string>;
  paymentToken: Address;
}

export class HederaDistributionContract extends HederaContractService {
  private static encodeDistributionFunctionCall(
    functionName: string,
    parameters: Array<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Buffer {
    return this.encodeFunctionCall(
      distributionContract.abi,
      functionName,
      parameters
    );
  }

  private static createGetNFTTransaction = async (
    contractId: string | ContractId,
    getNFT: GetNFT,
    price: string
  ) => {
    return handleSDKError(() => {
      const functionCallAsUint8Array = this.encodeDistributionFunctionCall(
        "getNFT",
        [getNFT]
      );

      const transaction = new ContractExecuteTransaction()
        .setContractId(
          contractId instanceof ContractId
            ? contractId
            : ContractId.fromString(contractId)
        )
        .setFunctionParameters(functionCallAsUint8Array);

      if (
        getNFT.paymentToken === "0x0000000000000000000000000000000000000000" &&
        price
      ) {
        transaction.setPayableAmount(price);
      }

      return transaction.setGas(this.getGas("getNFT"));
    })();
  };

  public static async createClaimTransaction(
    walletId: string,
    contractId: string,
    leaves: string[],
    paymentToken: string,
    price: string
  ) {
    const merkleProof = leaves.length
      ? new MerkleTree(leaves, keccak256, { sortPairs: true }).getHexProof(
          keccak256(walletId)
        )
      : [];

    return this.createGetNFTTransaction(
      contractId,
      { merkleProof, paymentToken },
      price
    );
  }

  static async getRemainingDistributionAvailable(): Promise<number | null> {
    const distributionConctract = new ethers.Interface(
      DistributionConctractAbi.abi
    );
    const result = await MirrorNode.getFromContract(
      distributionConctract,
      "getSLeftToDistribute"
    );

    if (!result) {
      return result;
    }

    const number = Number(result);

    return number;
  }

  static async getDates(): Promise<DistributionDates> {
    const startTimestampContract = new ethers.Interface(StartTimestampAbi.abi);
    const endTimestampContract = new ethers.Interface(EndTimestampAbi.abi);
    let startDateTimestamp = 0;
    let endDateTimestamp = 0;

    try {
      startDateTimestamp = Number(
        await MirrorNode.getFromContract(
          startTimestampContract,
          "getConfigStartTimestamp"
        )
      );
    } catch {
      /* empty */
    }

    try {
      endDateTimestamp = Number(
        await MirrorNode.getFromContract(
          endTimestampContract,
          "getConfigEndTimestamp"
        )
      );
    } catch {
      /* empty */
    }

    return { startDateTimestamp, endDateTimestamp };
  }

  static async getTokenGatingTokenAddresses(type: 'fungible' | 'non-fungible' = 'fungible'): Promise<
    Omit<TokenGatingRequiredToken, "tokenData">[] | null
  > {
    const contract = new ethers.Interface(type === 'fungible' ? FTGateAbi.abi : NFTGateAbi.abi);
    const contractCallSurfix = type === "fungible" ? "getRequiredFT" : "getRequiredNFT";
    
    const result = await MirrorNode.getFromContract(
      contract,
      `${contractCallSurfix}Addresses`
    );

    if (!result) {
      return result;
    }

    const addresses: Omit<TokenGatingRequiredToken, "tokenData">[] =
      await Promise.all(
        result[0].map(async (address: string) => {
          const amount = await MirrorNode.getFromContract(
            contract,
            `${contractCallSurfix}Balance`,
            [address]
          );

          return {
            address,
            amount: amount.toString(),
          };
        })
      );

    return addresses;
  }

  static async getMintLimit(): Promise<string | null> {
    const mintLimitContract = new ethers.Interface(MintLimitAbi.abi);
    const result = await MirrorNode.getFromContract(
      mintLimitContract,
      "getConfigMintLimitPerWallet"
    );

    if (!result) {
      return result;
    }

    const mintLimit = result.toString();

    return mintLimit;
  }

  static async getEnablePayment(): Promise<boolean | null> {
    const iPaymentContract = new ethers.Interface(IPaymentAbi.abi);
    const result = await MirrorNode.getFromContract(
      iPaymentContract,
      "getEnablePayment"
    );

    if (!result) {
      return result;
    }

    return result[0];
  }

  static async getSNFTSDistributed(): Promise<number> {
    const tokensDistributedContract = new ethers.Interface(
      SNFTSDistributedAbi.abi
    );
    const result = await MirrorNode.getFromContract(
      tokensDistributedContract,
      "getSNFTSDistributed"
    );
    const number = Number(result);

    return number;
  }

  static async getHBARAndFTPaymentData(): Promise<{
    paymentAddresses: string[];
    formattedPaymentAmountResult: number[];
  }> {
    const hbarAndFTPaymentContract = new ethers.Interface(
      HBARAndFTPaymentAbi.abi
    );
    const paymentAddressesResult = await MirrorNode.getFromContract(
      hbarAndFTPaymentContract,
      "getTokenPaymentAddresses"
    );
    const paymentAddresses = ((paymentAddressesResult ?? [])[0] ?? []).map(
      (address: string) => address
    );

    const paymentAmountResult = paymentAddresses.map(
      async (address: string) => {
        const response = await MirrorNode.getFromContract(
          hbarAndFTPaymentContract,
          "getTokenPaymentAmount",
          [address]
        );

        return response;
      }
    );

    const responseArray = await Promise.all(paymentAmountResult);
    const formattedPaymentAmountResult = responseArray.map((amount) =>
      Number(amount)
    );

    return { paymentAddresses, formattedPaymentAmountResult };
  }

  static async getSNFTSDistributedAddress(): Promise<string | null> {
    const tokensDistributedAddressContract = new ethers.Interface(
      SNFTSDistributedAbi.abi
    );
    const result = await MirrorNode.getFromContract(
      tokensDistributedAddressContract,
      "getSNFTToDistributeAddress"
    );

    if (!result) {
      return result;
    }

    return result[0];
  }

  static async getLastMintedSerialNumber(): Promise<string | null> {
    const currentSerialNumberContract = new ethers.Interface(
      CurrentSerialNumberAbi.abi
    );
    const result = await MirrorNode.getFromContract(
      currentSerialNumberContract,
      "getLastMintedSerialNumber"
    );

    if (!result) {
      return result;
    }

    return result.toString();
  }

  static async getPreviewImage(): Promise<string> {
    const abiInterface = new ethers.Interface(DistributionConctractAbi.abi);
    const result = await MirrorNode.getFromContract(
      abiInterface,
      "getSClaimingPreviewImageURL"
    );

    return String(result);
  }

  static async getTokenGatingRequiredTokenList(type: 'fungible' | 'non-fungible' = 'fungible'): Promise<
    TokenGatingRequiredToken[] | null
  > {
    const addresses = await HederaDistributionContract.getTokenGatingTokenAddresses(type);

    if (!addresses) {
      return addresses;
    }

    const addressesWithTokenData = await Promise.all(
      map(addresses, async (address) => ({
        ...address,
        tokenData: await MirrorNode.getTokenData(
          TokenId.fromSolidityAddress(address.address).toString()
        ),
      }))
    );

    return addressesWithTokenData;
  }

  static async getTokensPriceData(): Promise<TokenDataInterface[] | null> {
    const { paymentAddresses, formattedPaymentAmountResult } =
      await HederaDistributionContract.getHBARAndFTPaymentData();

    if (!paymentAddresses) {
      return null;
    }

    return MirrorNode.getTokensData(
      paymentAddresses,
      formattedPaymentAmountResult
    );
  }

  static async getCollectionOnChainMetadata(): Promise<TokenDataInterface | null> {
    const address =
      await HederaDistributionContract.getSNFTSDistributedAddress();

    if (!address) {
      return null;
    }

    const data = await MirrorNode.getTokensData([address]);

    return data[0];
  }

  static async getSerialData(tokenId: string): Promise<NFTData | null> {
    const currentSerial =
      await HederaDistributionContract.getLastMintedSerialNumber();

    if (!currentSerial) {
      return null;
    }

    return MirrorNode.getNFTData(tokenId, currentSerial);
  }
}