import Section from "./Section";
import Card from "../ui/Card";
import { group } from "@/content/site";

export default function Group() {
  return (
    <Section id="group" title="گروه پارسیان" lead="شرکت‌های گروه که هر کدام بخشی از مسیر مالی شما را پوشش می‌دهند.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {group.map((g) => (
          <Card key={g.name} hover className="flex h-full flex-col">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-bronze/40 text-lg font-bold text-bronze transition-colors duration-300 group-hover:bg-bronze group-hover:text-paper">{g.mark}</span>
            <h3 className="mt-5 font-semibold text-ink">{g.name}</h3>
            <p className="mt-2 flex-1 text-sm text-ink/60">{g.desc}</p>
            <span className="mt-5 block h-px w-8 bg-bronze transition-all duration-500 group-hover:w-full" />
          </Card>
        ))}
      </div>
    </Section>
  );
}
