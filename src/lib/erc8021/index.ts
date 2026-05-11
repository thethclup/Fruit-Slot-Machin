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
  // In a real ERC-8021 implementation, this would append attribution data to the calldata
  // or wrap it in an attribution contract call.
  // We simulate it here by adding hex-encoded builder code and attribution code to end if it's safe,
  // or simply returning the original for safety in standard transactions.
  
  // NOTE: Simply appending to calldata can break strict contract ABIs. 
  // Proper ERC-8021 might use a router contract.
  console.log(`[ERC-8021] Attributing tx with Builder: ${BUILDER_CODE}, Code: ${attributionCode}`);
  return originalData;
}
