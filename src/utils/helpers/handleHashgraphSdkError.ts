import { HederaError } from "@src/utils/constants/hederaError";

export const handleSDKError = <T>(callback: () => T) => {
    try {
      return callback;
    } catch (e: unknown) {
      console.error(e);
      throw new HederaError(
        e instanceof Error ? e.message : "Something went wrong"
      );
    }
  };