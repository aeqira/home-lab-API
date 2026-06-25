import type { HeaderProps } from "../../types/api";

export default function Header({ onRefresh, onCreate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-content">
        <h1>Home Lab Status API</h1>
        <p>Infrastructure Management Dashboard</p>
      </div>

      <div className="app-header-actions">
        <button onClick={onRefresh}>Refresh</button>

        <button type="button" onClick={onCreate}>
          Create Service
        </button>
      </div>
    </header>
  );
}
