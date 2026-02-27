import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  Play,
} from "lucide-react";
import {
  ShareRole, // Import the ShareRole constant
  type SessionSummary,
  type PracticeSummary,
  type GameTacticSummary,
} from "../../types/types";
import { SessionForm } from "./SessionForm";

type Category = "personal" | "userShared" | "groupShared";

interface SessionListProps {
  title: string;
  items: (SessionSummary | PracticeSummary | GameTacticSummary)[];
  category: Category;
  expandedCategory: Category | null;
  setExpandedCategory: (c: Category | null) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onSelect: (item: any, isEdit?: boolean) => void;
  onSave: (data: any) => void;
  onDelete: (id: number) => void;
  viewType: string;
  availableSessions: SessionSummary[];
}

export const SessionList: React.FC<SessionListProps> = ({
  title,
  items,
  category,
  expandedCategory,
  setExpandedCategory,
  editingId,
  setEditingId,
  onSelect,
  onSave,
  onDelete,
  viewType,
  availableSessions,
}) => {
  const { t } = useTranslation("tacticalEditor");
  const isExpanded = expandedCategory === category;

  return (
    <div className="category-group">
      <button
        className={`category-header ${isExpanded ? "active" : ""}`}
        onClick={() => setExpandedCategory(isExpanded ? null : category)}
      >
        <span className="arrow">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        {title}
        <span className="badge">{items.length}</span>
      </button>

      {isExpanded && (
        <div className="category-items">
          {items.length === 0 && (
            <div className="empty-text">{t("sessionSelector.empty")}</div>
          )}

          {items.map((item) => {
            // LOGIC CHANGE: Check permissions per item
            const canEdit =
              item.role === ShareRole.OWNER || item.role === ShareRole.EDITOR;
            const isOwner = item.role === ShareRole.OWNER;

            if (editingId === item.id) {
              return (
                <SessionForm
                  key={item.id}
                  initialData={item}
                  viewType={viewType as any}
                  availableSessions={availableSessions}
                  onSave={onSave}
                  onCancel={() => setEditingId(null)}
                />
              );
            }

            const attachedSessions =
              "sessions" in item ? (item as PracticeSummary).sessions : [];
            const hasAttachments =
              attachedSessions && attachedSessions.length > 0;

            return (
              <div
                key={item.id}
                className={`list-item-card ${!canEdit ? "read-only" : ""}`}
              >
                <div className="item-main" onClick={() => onSelect(item)}>
                  <div className="item-header-row">
                    <div className="item-name">{item.name}</div>
                    {hasAttachments && (
                      <span className="count-badge">
                        {attachedSessions.length}
                      </span>
                    )}
                  </div>
                  <div className="item-desc">
                    {item.description?.slice(0, 40)}...
                  </div>
                </div>

                {hasAttachments && (
                  <div className="sub-sessions-list">
                    <div className="sub-sessions-label">
                      {t("sessionSelector.includes")}
                    </div>
                    <div className="sub-sessions-grid">
                      {attachedSessions.map((sub: SessionSummary) => (
                        <button
                          key={sub.id}
                          className="sub-session-chip"
                          onClick={async (e) => {
                            e.stopPropagation();
                            onSelect(sub);
                          }}
                        >
                          <Play size={10} fill="currentColor" /> {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="item-actions">
                  {/* Show Edit button for both Owner and Editor */}
                  {canEdit && (
                    <button
                      className="icon-btn-mini"
                      title={t("common:edit" as any)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(item.id);
                        onSelect(item, true);
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                  )}

                  {/* Show Delete button ONLY for Owner */}
                  {isOwner && (
                    <button
                      className="icon-btn-mini danger"
                      title={t("common:delete" as any)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {/* Show View Only icon for Viewers */}
                  {!canEdit && (
                    <span
                      className="view-only-icon"
                      title={t("sessionSelector.readOnly")}
                    >
                      <Eye size={16} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
