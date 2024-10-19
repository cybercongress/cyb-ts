import useQueryClientMethod from '../useQueryClientMethod';

function useQueryContract(address: string, query: any) {
  return useQueryClientMethod('queryContractSmart', [address, query]);
}

export default useQueryContract;
