import { useAtom } from "jotai";

import { isUserModalOpenAtom, selectedUserAtom } from "./user.atom";

import type { User } from "./user.types";

export function useSelectedUser() {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [isUserModalOpen, setIsUserModalOpen] = useAtom(isUserModalOpenAtom);

  const openUserModalWith = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => setIsUserModalOpen(false);

  return {
    selectedUser,
    setSelectedUser,
    isUserModalOpen,
    setIsUserModalOpen,
    openUserModalWith,
    closeUserModal,
  } as const;
}
