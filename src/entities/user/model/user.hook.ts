import { useAtom } from "jotai";

import { isUserModalOpenAtom, selectedUserAtom } from "./user.atom";
import { userApi } from "../api/user.api";

export function useSelectedUser() {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [isUserModalOpen, setIsUserModalOpen] = useAtom(isUserModalOpenAtom);

  const closeUserModal = () => setIsUserModalOpen(false);

  const openUserModal = async (id: number) => {
    const user = await userApi.getById(id);
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  return {
    selectedUser,
    setSelectedUser,
    isUserModalOpen,
    setIsUserModalOpen,
    openUserModal,
    closeUserModal,
  } as const;
}
