import { Link } from "react-router-dom";

function EmptyState({ title, description, action, compact = false }) {
  return (
    <div className={`app-empty-state${compact ? " compact" : ""}`}>
      <p className="app-empty-state-title">{title}</p>
      {description && <p className="app-empty-state-description">{description}</p>}
      {action && (
        <Link className="app-empty-state-action" to={action.to}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
