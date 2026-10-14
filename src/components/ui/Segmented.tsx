"use client";

export default function Segmented<T extends string>({ items, value, onChange, label }: { items: readonly { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-full border border-bronze/25 bg-white/60 p-1 backdrop-blur-md">
      {items.map((i) => (
        <button key={i.id} role="tab" aria-selected={value === i.id} onClick={() => onChange(i.id)}
          className={`rounded-full px-4 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-bronze ${value === i.id ? "bg-ink text-paper" : "text-ink/65 hover:text-ink"}`}>
          {i.label}
        </button>
      ))}
    </div>
  );
}
