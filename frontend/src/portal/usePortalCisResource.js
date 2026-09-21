import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portalCisQueryKey } from './portalQueryClient';

const normalizeError = (error, fallbackMessage) => ({
  status: error?.response?.status || 0,
  message: error?.response?.data?.error || (error?.code === 'ECONNABORTED'
    ? 'The CIS service is temporarily unavailable.'
    : fallbackMessage),
});

export const usePortalCisResource = ({
  role,
  resource,
  parameters,
  load,
  enabled = true,
  fallbackMessage,
}) => {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: portalCisQueryKey(role, resource, parameters),
    queryFn: load,
    enabled,
    placeholderData: keepPreviousData,
  });
  const error = query.error ? normalizeError(query.error, fallbackMessage) : null;

  useEffect(() => {
    if (error?.status === 401) navigate('/login', { replace: true });
  }, [error?.status, navigate]);

  return {
    data: query.data ?? null,
    loading: enabled && query.isPending,
    refreshing: query.isFetching && !query.isPending,
    error,
    refetch: query.refetch,
  };
};
