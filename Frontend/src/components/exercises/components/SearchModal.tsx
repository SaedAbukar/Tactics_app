import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useExercises } from "../../../context/ExercisesProvider";
import { useDebounce } from "../../../hooks/useDebounce";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import {
  ShareRole,
  type PublicUserResponse,
  type CollaboratorDTO,
} from "../../../types/types";
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
    const { t } = useTranslation(["exercises", "common"]);

    const [query, setQuery] = useState("");
    const [role, setRole] = useState<ShareRole>("VIEWER");
    const debounced = useDebounce(query, 300);

    // Selection states for confirmation modals
    const [selectedUser, setSelectedUser] = useState<PublicUserResponse | null>(
      null
    );
    const [existingCollab, setExistingCollab] =
      useState<CollaboratorDTO | null>(null);
    const [userToRevoke, setUserToRevoke] = useState<CollaboratorDTO | null>(
      null
    );

    const loaderRef = useRef<HTMLDivElement>(null);

    // Search Logic (Specific to the Search VM, doesn't affect DetailView)
    useEffect(() => {
      sVm.setSearchTerm(debounced);
    }, [debounced, sVm]);

    // Infinite Scroll Observer
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && sVm.hasNextPage && !sVm.isLoading)
            sVm.loadNextPage();
        },
        { threshold: 0.1 }
      );
      if (loaderRef.current) observer.observe(loaderRef.current);
      return () => observer.disconnect();
    }, [sVm.hasNextPage, sVm.isLoading, sVm]);

    const handleUserClick = (user: PublicUserResponse) => {
      // Check against the collaborators list already in the Exercises ViewModel
      const alreadyExists = eVm.collaborators.find((c) => c.id === user.id);
      if (alreadyExists) {
        setExistingCollab(alreadyExists);
      } else {
        setSelectedUser(user);
      }
    };

    const handleConfirmShare = async () => {
      if (selectedUser) {
        await eVm.shareItem(itemType, itemId, selectedUser.id, role);
        // Refresh local collaborator list in VM after sharing
        await eVm.loadCollaborators(itemType, itemId);
        setSelectedUser(null);
      }
    };

    const handleConfirmRevoke = async () => {
      if (userToRevoke) {
        await eVm.revokeUserAccess(itemType, itemId, userToRevoke.id);
        // Refresh local collaborator list in VM after revoking
        await eVm.loadCollaborators(itemType, itemId);
        setUserToRevoke(null);
      }
    };

    return (
      <>
        <div className="share-overlay-underlay" onClick={onClose} />
        <div className="share-modal-fixed">
          <div className="included-header">
            <h3 className="panel-title">{t("exercises:sharing.title")}</h3>
            <button className="btn-remove-absolute" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* SECTION: Current Collaborators (Directly from Store) */}
          <div className="section-label collaborator-header">
            {t("exercises:sharing.currentCollaborators")}
          </div>
          <div
            className="virtual-list-wrapper collaborator-list-box"
            style={{ height: "140px", marginBottom: "10px" }}
          >
            {eVm.isLoading ? (
              <LoadingSpinner />
            ) : eVm.collaborators.length > 0 ? (
              <div className="card-list">
                {eVm.collaborators.map((collab) => (
                  <div key={collab.id} className="item-card collaborator-card">
                    <div className="collab-info">
                      <span className="card-title">{collab.name}</span>
                      <span className="role-tag">
                        {t(
                          `exercises:sharing.roles.${collab.role.toLowerCase()}` as any
                        )}
                      </span>
                    </div>
                    <button
                      className="btn-action danger small-btn"
                      onClick={() => setUserToRevoke(collab)}
                    >
                      {t("common:delete")}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state-text">
                {t("exercises:sharing.noCollaborators")}
              </p>
            )}
          </div>

          <hr className="modal-divider" />

          {/* SECTION: Search and Add */}
          <div className="section-label">{t("exercises:sharing.addNew")}</div>
          <div className="add-controls-row share-controls">
            <input
              className="session-select"
              placeholder={t("exercises:sharing.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="session-select role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as ShareRole)}
            >
              <option value="VIEWER">
                {t("exercises:sharing.roles.viewer")}
              </option>
              <option value="EDITOR">
                {t("exercises:sharing.roles.editor")}
              </option>
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
                    {t(`exercises:sharing.roles.${role.toLowerCase()}` as any)}
                  </span>
                </div>
              ))}
            </div>
            <div ref={loaderRef} className="scroll-sentinel">
              {sVm.isLoading && <LoadingSpinner />}
            </div>
          </div>
        </div>

        {/* MODAL: Confirm Share */}
        <Modal
          isOpen={!!selectedUser}
          title={t("exercises:sharing.confirmTitle")}
          confirmText={t("exercises:sharing.confirmAction")}
          onConfirm={handleConfirmShare}
          onClose={() => setSelectedUser(null)}
        >
          <p>
            {t("exercises:sharing.confirmMessage", {
              role: t(`exercises:sharing.roles.${role.toLowerCase()}` as any),
              email: selectedUser?.email,
            })}
          </p>
        </Modal>

        {/* MODAL: Already a Collaborator */}
        <Modal
          isOpen={!!existingCollab}
          title={t("exercises:sharing.alreadySharedTitle")}
          onConfirm={() => setExistingCollab(null)}
          onClose={() => setExistingCollab(null)}
        >
          <p>
            {t("exercises:sharing.alreadySharedMessage", {
              name: existingCollab?.name,
              role: t(
                `exercises:sharing.roles.${existingCollab?.role.toLowerCase()}` as any
              ),
            })}
          </p>
        </Modal>

        {/* MODAL: Revoke Access */}
        <Modal
          isOpen={!!userToRevoke}
          title={t("exercises:sharing.revokeTitle")}
          confirmText={t("common:delete")}
          onConfirm={handleConfirmRevoke}
          onClose={() => setUserToRevoke(null)}
        >
          <p>
            {t("exercises:sharing.revokeMessage", {
              email: userToRevoke?.name,
            })}
          </p>
        </Modal>
      </>
    );
  }
);
