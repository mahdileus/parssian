/** The panel's restrained gray geometry, with no interactive or animated decoration. */
export default function AuthBackground() {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1 } as const;
  return (
    <div className="auth-geometry" aria-hidden="true">
      <svg className="rings" viewBox="0 0 120 120" {...stroke}><circle cx="60" cy="60" r="58" /><circle cx="60" cy="60" r="38" /><circle cx="60" cy="60" r="18" /></svg>
      <svg className="cross" viewBox="0 0 40 40" {...stroke}><path d="M20 6v28M6 20h28" /></svg>
      <svg className="diamond" viewBox="0 0 40 40" {...stroke}><rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" /></svg>
      <svg className="triangle" viewBox="0 0 40 40" {...stroke}><path d="M20 6 35 32H5z" /></svg>
      <svg className="dots" viewBox="0 0 90 54" fill="currentColor">{Array.from({ length: 15 }, (_, index) => <circle key={index} cx={8 + index % 5 * 18} cy={9 + Math.floor(index / 5) * 18} r="2" />)}</svg>
      <svg className="circle" viewBox="0 0 80 80" {...stroke}><circle cx="40" cy="40" r="38" /></svg>
    </div>
  );
}
