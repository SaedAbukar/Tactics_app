import React from "react";
import { useTranslation } from "react-i18next";
import type { Session, Practice, GameTactic } from "../../types/types";
import { SessionForm } from "./SessionForm";

type Category = "personal" | "userShared" | "groupShared";

interface SessionListProps {
  title: string;
  items: (Session | Practice | GameTactic)[];
  category: Category;
  expandedCategory: Category | null;
  setExpandedCategory: (c: Category | null) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onSelect: (item: any) => void;
  onSave: (data: any) => void;
  onDelete: (id: number) => void;
  viewType: string;
  availableSessions: Session[];
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
        <span className="arrow">{isExpanded ? "▼" : "▶"}</span>
        {title}
        <span className="badge">{items.length}</span>
      </button>

      {isExpanded && (
        <div className="category-items">
          {items.length === 0 && (
            <div className="empty-text">
              {t("sessionSelector.empty", "No items")}
            </div>
          )}
          {items.map((item) => {
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
            return (
              <div key={item.id} className="list-item-card">
                <div className="item-main" onClick={() => onSelect(item)}>
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">
                    {item.description?.slice(0, 40)}...
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="icon-btn-mini"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(item.id);
                      onSelect(item);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="icon-btn-mini danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
