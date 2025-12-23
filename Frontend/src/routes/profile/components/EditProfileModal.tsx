import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useExercises } from "../../../context/ExercisesProvider";
import { useAuth } from "../../../context/Auth/AuthContext";
import { useTranslation } from "react-i18next";

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal = observer(
  ({ onClose }: EditProfileModalProps) => {
    const { user, refreshUser } = useAuth();
    const { t } = useTranslation(["profile", "common"]);
    const { exercisesViewModel: vm } = useExercises();

    /**
     * LOCAL STATE
     * We initialize by checking if user.isPublic is strictly true.
     * This avoids the use of !! and handles null/undefined as false.
     */
    const [isPublic, setIsPublic] = useState(user?.isPublic === true);

    /**
     * SYNCING
     * Ensures local state matches the global AuthContext if it updates
     * while the modal is open.
     */
    useEffect(() => {
      if (user !== null) {
        setIsPublic(user.isPublic === true);
      }
    }, [user]);

    const handleSave = async () => {
      // 1. Update the visibility on the backend
      const success = await vm.toggleProfileVisibility(isPublic);

      if (success) {
        // 2. Re-fetch user data to update the global AuthContext
        await refreshUser();
        // 3. Close the modal on success
        onClose();
      }
    };

    return (
      <>
        {/* Background Dimmer */}
        <div className="modal-overlay" onClick={onClose} />

        {/* Centered Modal */}
        <div className="share-modal-fixed profile-edit-modal">
          <div className="included-header">
            <h3 className="panel-title">{t("actions.edit", "Edit Profile")}</h3>
            <button
              className="btn-remove-absolute"
              onClick={onClose}
              disabled={vm.isLoading}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="detail-body modal-body-padding">
            <div className="toggle-row">
              <span className="section-label">
                {t("edit.publicProfile", "Public Profile")}
              </span>

              {/* Modern Switch Style */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={vm.isLoading}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <p className="description-text">
              {t(
                "edit.publicDescription",
                "When public, other users can find you by email to share sessions and tactics."
              )}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="profile-actions modal-footer">
            <button
              className="btn primary full-width-btn"
              onClick={handleSave}
              disabled={vm.isLoading}
              style={{ minHeight: "44px" }}
            >
              {vm.isLoading ? (
                <div className="dot-loader">
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                t("common:saveChanges", "Save Changes")
              )}
            </button>
          </div>
        </div>
      </>
    );
  }
);
