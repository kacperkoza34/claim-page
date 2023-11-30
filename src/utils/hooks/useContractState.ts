import { useContext } from "react";
import {
  ContractState,
  ContractStateContext,
} from "@src/utils/context/ContractStateContext";

const useContractState = (): ContractState => useContext(ContractStateContext);

export default useContractState;
