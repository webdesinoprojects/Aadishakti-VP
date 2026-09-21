import { QueryClient } from '@tanstack/react-query';

const identityStorageKey = (role) => `portal_${role}_account_id`;

export const portalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        const status = error?.response?.status || 0;
        return ![401, 403, 404, 501].includes(status) && failureCount < 1;
      },
    },
  },
});

export const getPortalAccountId = (role) => sessionStorage.getItem(identityStorageKey(role)) || 'unknown';

export const setPortalSessionIdentity = (role, session) => {
  const nextAccountId = session?.accountId ? String(session.accountId) : null;
  const previousAccountId = sessionStorage.getItem(identityStorageKey(role));
  if (previousAccountId && previousAccountId !== nextAccountId) {
    portalQueryClient.removeQueries({ queryKey: ['portal-cis', role] });
  }
  if (nextAccountId) sessionStorage.setItem(identityStorageKey(role), nextAccountId);
  else sessionStorage.removeItem(identityStorageKey(role));
};

export const clearPortalRoleCache = (role) => {
  portalQueryClient.removeQueries({ queryKey: ['portal-cis', role] });
  sessionStorage.removeItem(identityStorageKey(role));
};

export const portalCisQueryKey = (role, resource, parameters = {}) => [
  'portal-cis',
  role,
  getPortalAccountId(role),
  resource,
  parameters,
];
