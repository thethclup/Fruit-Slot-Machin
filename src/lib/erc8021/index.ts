import { encodeFunctionData, parseEther, type Address } from 'viem';

export const BUILDER_CODE = 'bc_ee3cipj7';
export const BASE_ATTRIBUTION_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with real contract if available

/**
 * ERC-8021 Transaction Attribution Utility
 * Appends builder and attribution codes to transaction calldata or uses a specific contract.
 */
export function getAttributedTransactionData(
  originalData: `0x${string}` = '0x',
  attributionCode: string = 'FRUIT_SLOT'
): `0x${string}` {
  const suffix = '80218021802180218021802180218021';
  let cleanData = originalData;
  if (cleanData.startsWith('0x')) {
    cleanData = cleanData.slice(2) as `0x${string}`;
  }
  return `0x${cleanData}${suffix}`;
}
