import Section from "./Section";
import Card from "../ui/Card";
import { customers } from "@/content/site";

export default function Group() {
  return (
    <Section id="group" title="مشتریان ما" lead="بانک پارسیان و شرکت‌های معرفی‌شده در فهرست مشتریان معین پارسیان پارس.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {customers.map((name) => (
          <Card key={name} hover className="flex h-full flex-col">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-bronze/40 text-lg font-bold text-bronze transition-colors duration-300 group-hover:bg-bronze group-hover:text-paper">{name.replace(/^شرکت /, "").charAt(0)}</span>
            <h3 className="mt-5 font-semibold text-ink">{name}</h3>
            <span className="mt-5 block h-px w-8 bg-bronze transition-all duration-500 group-hover:w-full" />
          </Card>
        ))}
      </div>
    </Section>
  );
}
