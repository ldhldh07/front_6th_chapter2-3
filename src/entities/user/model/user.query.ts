import { useQuery, type QueryClient } from "@tanstack/react-query";

import { userApi } from "@/entities/user";

import type { User } from "./user.types";

export const userQueryKeys = {
  all: ["users"] as const,
  byId: (id: number) => ["users", id] as const,
} as const;

export function useUserQuery(userId?: number | null) {
  return useQuery<User>({
    enabled: !!userId,
    queryKey: userId ? userQueryKeys.byId(userId) : userQueryKeys.all,
    queryFn: () => userApi.getById(userId as number),
    staleTime: 60_000,
  });
}

export const prefetchUserById = (client: QueryClient, id: number) =>
  client.prefetchQuery({ queryKey: userQueryKeys.byId(id), queryFn: () => userApi.getById(id) });

export const getUserFromCache = (client: QueryClient, id: number): User | undefined =>
  client.getQueryData<User>(userQueryKeys.byId(id));
