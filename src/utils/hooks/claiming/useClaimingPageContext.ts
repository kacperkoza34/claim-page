import { useContext } from "react";
import { ClaimingPageContext } from "@src/utils/context/ClaimingPageContext";

export const useClaimingPageContext = () => {
  const context = useContext(ClaimingPageContext);

  return context;
};
