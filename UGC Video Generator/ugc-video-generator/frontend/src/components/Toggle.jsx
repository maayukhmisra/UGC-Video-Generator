export default function Toggle({ label, state, setState }) {
  return (
    <div className="toggle-container">
      <span className="toggle-label">{label}</span>
      <button
        onClick={() => setState(!state)}
        className={`toggle-btn ${state ? 'active' : 'inactive'}`}
      >
        <div className="toggle-circle" />
      </button>
    </div>
  );
}