import React from "react";
import type { Session, Practice, GameTactic } from "../../types/types";
import { SessionForm } from "./SessionForm";

type Category = "personal" | "userShared" | "groupShared";

interface SessionListProps {
  title: string;
  items: (Session | Practice | GameTactic)[];
  category: Category;
  expandedCategory: Category | null;
  setExpandedCategory: (c: Category | null) => void;

  // Editing State passed down
  editingId: number | null;
  setEditingId: (id: number | null) => void;

  // Handlers
  onSelect: (item: any) => void;
  onSave: (data: any) => void;
  onDelete: (id: number) => void;

  // Context info
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
          {items.length === 0 && <div className="empty-text">No items</div>}
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
                {/* Clicking the card body just loads the pitch (standard behavior) */}
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
                      e.stopPropagation(); // Prevent triggering the card body click twice
                      setEditingId(item.id); // 1. Open Form
                      onSelect(item); // 2. Load Pitch
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
