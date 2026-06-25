import type { HeaderProps } from "../../types/api";

export default function Header({ onRefresh }: HeaderProps) {
  return (
    <header>
      <h1>Home Lab Status API</h1>
      <p>Infrastructure Management Dashboard</p>
      <button type="button" onClick={onRefresh}>
        Refresh Services
      </button>
    </header>
  );
}
