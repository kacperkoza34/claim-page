export const convertContractAddress = (address) => {
  if (address.startsWith("0x")) {
    const hexPart = address.slice(2);
    const decimal = parseInt(hexPart, 16).toString();

    return "0.0." + decimal;
  } else if (address.includes(".")) {
    const decimalParts = address.split(".");
    const decimal = decimalParts.join("");
    const hexPart = parseInt(decimal).toString(16).padStart(40, "0");
    return "0x" + hexPart;
  } else {
    throw new Error("Invalid address format");
  }
};
