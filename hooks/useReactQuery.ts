// hooks/useReactQuery.ts — add a public variant
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getApiMethos, getPublicApiMethod } from "../services/global";
import { APICONSTANT, APIKeys } from "../services/apiconfig";

function useReactQuery<TData = unknown>(
  key: APIKeys,
  query_string = "",
  enabled = true,
  isPublic = false,
): UseQueryResult<TData> {
  return useQuery<TData>({
    queryKey: [key, APICONSTANT[key], query_string],
    queryFn: isPublic ? getPublicApiMethod : getApiMethos,
    enabled,
    retry: 0,
    refetchOnMount: true,
  });
}

export default useReactQuery;