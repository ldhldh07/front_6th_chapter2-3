import { UserDetailDialog } from "@/entities/user";

import { useUserDetailModal } from "../model/user-detail-modal.hook";

export function UserDetailDialogContainer() {
  const { isOpen, setIsOpen, user } = useUserDetailModal();
  return <UserDetailDialog open={isOpen} onOpenChange={setIsOpen} user={user} />;
}
