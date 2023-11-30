import React from "react";
import { useClaiming } from "@src/utils/hooks/useClaiming";

export const ClaimingPageContext = React.createContext<ReturnType<typeof useClaiming>>({
  approveTokenAllowance: () => Promise.resolve(undefined),
    associateToken: () => Promise.resolve(undefined),
    claimToken: () => Promise.resolve(undefined),
    checkIfIsAllowedToClaimWithFT: () => Promise.resolve(undefined),
    isAccountAssociatedToToken: false,
    requiredAllowances: []
});
