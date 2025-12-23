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
import { Pencil, Eye, ChevronDown, Check } from "lucide-react";

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
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const debounced = useDebounce(query, 300);

    const [selectedUser, setSelectedUser] = useState<PublicUserResponse | null>(
      null
    );
    const [existingCollab, setExistingCollab] =
      useState<CollaboratorDTO | null>(null);
    const [userToRevoke, setUserToRevoke] = useState<CollaboratorDTO | null>(
      null
    );

    const loaderRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close custom dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsRoleOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      sVm.setSearchTerm(debounced);
    }, [debounced, sVm]);

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
        await eVm.loadCollaborators(itemType, itemId);
        setSelectedUser(null);
      }
    };

    const handleConfirmRevoke = async () => {
      if (userToRevoke) {
        await eVm.revokeUserAccess(itemType, itemId, userToRevoke.id);
        await eVm.loadCollaborators(itemType, itemId);
        setUserToRevoke(null);
      }
    };

    const roleOptions = [
      {
        val: "VIEWER" as ShareRole,
        label: t("exercises:sharing.roles.viewer"),
        icon: Eye,
      },
      {
        val: "EDITOR" as ShareRole,
        label: t("exercises:sharing.roles.editor"),
        icon: Pencil,
      },
    ];

    const currentRoleObj = roleOptions.find((r) => r.val === role)!;

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

          <div className="section-label collaborator-header">
            {t("exercises:sharing.currentCollaborators")}
          </div>
          <div className="virtual-list-wrapper collaborator-list-box">
            {eVm.isLoading ? (
              <LoadingSpinner />
            ) : eVm.collaborators.length > 0 ? (
              <div className="card-list">
                {eVm.collaborators.map((collab) => (
                  <div key={collab.id} className="item-card collaborator-card">
                    <div className="collab-info">
                      <span className="card-title">{collab.name}</span>
                      <span className="role-tag-container">
                        {collab.role === "EDITOR" ? (
                          <Pencil size={10} />
                        ) : (
                          <Eye size={10} />
                        )}
                        <span className="role-tag">
                          {t(
                            `exercises:sharing.roles.${collab.role.toLowerCase()}` as any
                          )}
                        </span>
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

          <div className="section-label">{t("exercises:sharing.addNew")}</div>
          <div className="add-controls-row share-controls">
            <input
              className="session-select"
              placeholder={t("exercises:sharing.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="custom-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`dropdown-trigger ${isRoleOpen ? "active" : ""}`}
                onClick={() => setIsRoleOpen(!isRoleOpen)}
              >
                <currentRoleObj.icon size={14} className="icon-muted" />
                <span className="trigger-label">{currentRoleObj.label}</span>
                <ChevronDown
                  size={14}
                  className={`chevron ${isRoleOpen ? "open" : ""}`}
                />
              </button>

              {isRoleOpen && (
                <div className="dropdown-menu">
                  {roleOptions.map((opt) => (
                    <div
                      key={opt.val}
                      className={`dropdown-item ${
                        role === opt.val ? "selected" : ""
                      }`}
                      onClick={() => {
                        setRole(opt.val);
                        setIsRoleOpen(false);
                      }}
                    >
                      <opt.icon size={14} />
                      <span className="item-label">{opt.label}</span>
                      {role === opt.val && (
                        <Check size={12} className="check-mark" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <span className="type-badge role-badge">
                    {role === "EDITOR" ? (
                      <Pencil size={10} />
                    ) : (
                      <Eye size={10} />
                    )}
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
