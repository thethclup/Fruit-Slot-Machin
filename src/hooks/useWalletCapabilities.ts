import { useCapabilities } from 'wagmi';
import { useMemo } from 'react';

export function useWalletCapabilities(chainId: number) {
  const { data: capabilities } = useCapabilities();

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[chainId]?.atomic;
    return atomic?.status === 'ready' || atomic?.status === 'supported';
  }, [capabilities, chainId]);

  const supportsPaymaster = useMemo(() => {
    return capabilities?.[chainId]?.paymasterService?.supported === true;
  }, [capabilities, chainId]);

  return { supportsBatching, supportsPaymaster };
}
