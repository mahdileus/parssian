import Section from "./Section";
import CustomerDirectory from "@/components/home/CustomerDirectory";

export default function Group() {
  return (
    <Section id="group" title="مشتریان ما" lead="بانک پارسیان و شرکت‌های معرفی‌شده در فهرست مشتریان معین پارسیان پارس.">
      <CustomerDirectory />
    </Section>
  );
}
