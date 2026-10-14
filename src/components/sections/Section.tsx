type Side = "start" | "end" | "full";

// "start" = right column in RTL, "end" = left column. The flower sits on the opposite side.
export default function Section({ id, title, lead, side = "full", children }: { id: string; title: string; lead?: string; side?: Side; children: React.ReactNode }) {
  const w = side === "full" ? "" : "md:w-[52%]";
  return (
    <section id={id} className="scroll-mt-16 py-28 md:min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`${w} ${side === "end" ? "ms-auto" : ""}`}>
          <h2 className="text-3xl font-bold text-ink md:text-4xl">{title}</h2>
          <span className="mt-4 block h-px w-12 bg-bronze" />
          {lead && <p className="mt-4 max-w-xl text-ink/60">{lead}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
