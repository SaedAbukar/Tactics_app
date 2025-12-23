import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useExercises } from "../../../context/ExercisesProvider";
import { useDebounce } from "../../../hooks/useDebounce";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ShareRole, type PublicUserResponse } from "../../../types/types";
import { Modal } from "../../ui/Modal";

interface ShareModalProps {
  itemId: number;
  itemType: "session" | "practice" | "tactic";
  onClose: () => void;
}

export const ShareModal = observer(
  ({ itemId, itemType, onClose }: ShareModalProps) => {
    const { userSearchViewModel: sVm, exercisesViewModel: eVm } =
      useExercises();
    const { t } = useTranslation("exercises");

    const [query, setQuery] = useState("");
    const [role, setRole] = useState<ShareRole>("VIEWER");
    const debounced = useDebounce(query, 300);

    const [selectedUser, setSelectedUser] = useState<PublicUserResponse | null>(
      null
    );
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      sVm.setSearchTerm(debounced);
    }, [debounced, sVm]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && sVm.hasNextPage && !sVm.isLoading) {
            sVm.loadNextPage();
          }
        },
        { threshold: 0.1 }
      );

      if (loaderRef.current) observer.observe(loaderRef.current);
      return () => observer.disconnect();
    }, [sVm.hasNextPage, sVm.isLoading, sVm]);

    const handleUserClick = (user: PublicUserResponse) => {
      setSelectedUser(user);
      setIsConfirmOpen(true);
    };

    const handleConfirmShare = async () => {
      if (selectedUser) {
        await eVm.shareItem(itemType, itemId, selectedUser.id, role);
        setIsConfirmOpen(false);
        onClose();
      }
    };

    return (
      <>
        <div className="share-overlay-underlay" onClick={onClose} />

        <div className="share-modal-fixed">
          <div className="included-header">
            <h3 className="panel-title">{t("sharing.title")}</h3>
            <button className="btn-remove-absolute" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="add-controls-row share-controls">
            <input
              className="session-select"
              placeholder={t("sharing.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="session-select role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as ShareRole)}
            >
              <option value="VIEWER">{t("sharing.roles.viewer" as any)}</option>
              <option value="EDITOR">{t("sharing.roles.editor" as any)}</option>
            </select>
          </div>

          <div className="virtual-list-wrapper share-list-scroll">
            <div className="card-list">
              {sVm.users.map((user) => (
                <div
                  key={user.id}
                  className="item-card clickable-card"
                  onClick={() => handleUserClick(user)}
                >
                  <span className="card-title">{user.email}</span>
                  <span className="type-badge">
                    {t(`sharing.roles.${role.toLowerCase()}` as any)}
                  </span>
                </div>
              ))}
            </div>

            <div ref={loaderRef} className="scroll-sentinel">
              {sVm.isLoading && <LoadingSpinner />}
            </div>

            {!sVm.hasNextPage && sVm.users.length > 0 && (
              <p className="list-end-text">{t("sharing.noMoreUsers")}</p>
            )}

            {sVm.users.length === 0 && !sVm.isLoading && debounced && (
              <p className="empty-state">{t("sharing.noUsersFound")}</p>
            )}
          </div>
        </div>

        <Modal
          isOpen={isConfirmOpen}
          title={t("sharing.confirmTitle")}
          confirmText={t("sharing.confirmAction")}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmShare}
        >
          <p>
            {t("sharing.confirmMessage", {
              role: t(`sharing.roles.${role.toLowerCase()}` as any),
              email: selectedUser?.email,
            })}
          </p>
        </Modal>
      </>
    );
  }
);
