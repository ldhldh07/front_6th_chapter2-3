import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { prefetchUserById, getUserFromCache } from "@/entities/user/model/user.query";

import { isUserDetailOpenAtom, selectedUserAtom } from "./user-detail-modal.atoms";

export function useUserDetailModal() {
  const [isOpen, setIsOpen] = useAtom(isUserDetailOpenAtom);
  const [user, setUser] = useAtom(selectedUserAtom);
  const queryClient = useQueryClient();

  const openById = async (id: number) => {
    const cached = getUserFromCache(queryClient, id);
    if (cached) setUser(cached);
    await prefetchUserById(queryClient, id);
    setUser(getUserFromCache(queryClient, id) ?? cached ?? null);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, setIsOpen, user, setUser, openById, close } as const;
}
