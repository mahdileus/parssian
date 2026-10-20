import Section from "./Section";
import Card from "../ui/Card";
import { investmentScope } from "@/content/company";

export default function Investment() {
  return (
    <Section id="insights" side="end" title="سرمایه‌گذاری و فعالیت‌های تجاری" lead="توسعه فعالیت‌های اقتصادی و خدماتی در چارچوب موضوع فعالیت شرکت و با رعایت قوانین موضوعه.">
      <div className="space-y-4">
        {investmentScope.map((item, i) => (
          <Card key={item.title} hover>
            <span className="text-sm text-bronze">{(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span>
            <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-8 text-ink/65">{item.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
