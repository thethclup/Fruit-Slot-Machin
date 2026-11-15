import { useState, useCallback, useEffect } from 'react';
import {
  useAccount,
  useSendTransaction,
  useSendCalls,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useCallsStatus,
} from 'wagmi';
import { parseEther } from 'viem';
import { BASE_MAINNET_CHAIN_ID, DENIM_BLOCK_TIME_MS } from '../config/wagmi';
import { useWalletCapabilities } from './useWalletCapabilities';

const GM_CONTRACT_ADDRESS = '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7' as const;
const ERC8021_SUFFIX = '0x80218021802180218021802180218021' as const;

export function useDenimTransaction() {
  const { isConnected, chainId: walletChainId } = useAccount();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSendingTx } = useSendTransaction();
  const { sendCallsAsync, isPending: isSendingCalls } = useSendCalls();
  const { supportsBatching } = useWalletCapabilities(BASE_MAINNET_CHAIN_ID);

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [callsId, setCallsId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && walletChainId !== undefined && walletChainId !== BASE_MAINNET_CHAIN_ID;

  // Poll canonical 200ms blocks via eth_getTransactionReceipt (no Flashblocks/pending state)
  const {
    data: txReceipt,
    isLoading: isWaitingTx,
    isSuccess: isTxConfirmed,
    error: txReceiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: BASE_MAINNET_CHAIN_ID,
    pollingInterval: DENIM_BLOCK_TIME_MS,
    query: {
      enabled: Boolean(txHash),
    },
  });

  // Poll EIP-5792 call status against 200ms canonical blocks
  const {
    data: callsStatus,
    isLoading: isWaitingCalls,
    error: callsStatusError,
  } = useCallsStatus({
    id: callsId ?? '',
    query: {
      enabled: Boolean(callsId),
      refetchInterval: (query) =>
        query.state.data?.status === 'success' || query.state.data?.status === 'failure'
          ? false
          : DENIM_BLOCK_TIME_MS,
    },
  });

  useEffect(() => {
    if (txReceiptError) {
      setError(txReceiptError.message);
    } else if (callsStatusError) {
      setError(callsStatusError.message);
    } else if (callsStatus?.status === 'failure') {
      setError('Transaction bundle reverted on Base Mainnet.');
    }
  }, [txReceiptError, callsStatusError, callsStatus]);

  const switchToBaseMainnet = useCallback(async () => {
    setError(null);
    await switchChainAsync({ chainId: BASE_MAINNET_CHAIN_ID });
  }, [switchChainAsync]);

  const sendGM = useCallback(async () => {
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return false;
    }

    setError(null);
    setTxHash(undefined);
    setCallsId(undefined);

    try {
      if (walletChainId !== BASE_MAINNET_CHAIN_ID) {
        await switchChainAsync({ chainId: BASE_MAINNET_CHAIN_ID });
      }

      if (supportsBatching && sendCallsAsync) {
        const result = await sendCallsAsync({
          chainId: BASE_MAINNET_CHAIN_ID,
          calls: [
            {
              to: GM_CONTRACT_ADDRESS,
              data: '0x',
              value: BigInt(0),
            },
          ],
          capabilities: {
            dataSuffix: {
              value: ERC8021_SUFFIX,
              optional: true,
            },
          },
        });
        setCallsId(result.id);
        return true;
      }

      const hash = await sendTransactionAsync({
        chainId: BASE_MAINNET_CHAIN_ID,
        to: GM_CONTRACT_ADDRESS,
        data: ERC8021_SUFFIX,
        value: parseEther('0'),
      });
      setTxHash(hash);
      return true;
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Transaction failed');
      return false;
    }
  }, [isConnected, walletChainId, switchChainAsync, supportsBatching, sendCallsAsync, sendTransactionAsync]);

  const reset = useCallback(() => {
    setTxHash(undefined);
    setCallsId(undefined);
    setError(null);
  }, []);

  const callsConfirmed = callsStatus?.status === 'success';
  const confirmedBlockNumber =
    txReceipt?.blockNumber ?? callsStatus?.receipts?.[0]?.blockNumber;
  const confirmedHash =
    txHash ?? callsStatus?.receipts?.[0]?.transactionHash;

  return {
    sendGM,
    switchToBaseMainnet,
    reset,
    isWrongNetwork,
    isSwitchingChain,
    isPending: isSendingTx || isSendingCalls || isSwitchingChain,
    isConfirming:
      Boolean(txHash && isWaitingTx) ||
      Boolean(callsId && !callsConfirmed && !callsStatusError && (isWaitingCalls || callsStatus?.status === 'pending' || callsStatus === undefined)),
    isConfirmed: isTxConfirmed || callsConfirmed,
    txHash: confirmedHash,
    blockNumber: confirmedBlockNumber,
    error,
  };
}
