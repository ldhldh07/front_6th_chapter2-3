import { useAtom } from "jotai";

import { userApi } from "@/entities/user";

import { isUserDetailOpenAtom, selectedUserAtom } from "./user-detail-modal.atoms";

export function useUserDetailModal() {
  const [isOpen, setIsOpen] = useAtom(isUserDetailOpenAtom);
  const [user, setUser] = useAtom(selectedUserAtom);

  const openById = async (id: number) => {
    const data = await userApi.getById(id);
    setUser(data);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, setIsOpen, user, setUser, openById, close } as const;
}
