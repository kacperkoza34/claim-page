import { AccountId } from "@hashgraph/sdk";

export const fromEVMAddressToHederaAccountId = (evm: string) =>
  AccountId.fromEvmAddress(0, 0, evm).toString();
