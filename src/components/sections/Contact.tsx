import CooperationRequest from "@/components/home/CooperationRequest";
import Section from "./Section";
import Card from "../ui/Card";
import { contact } from "@/content/site";

export default function Contact() {
  return (
    <Section id="contact" title="تماس با ما" lead="راه‌های ارتباط با شرکت معین پارسیان پارس">
      <address className="grid gap-4 not-italic md:grid-cols-2">
        <Card className="md:row-span-2">
          <h3 className="text-sm font-semibold text-bronze">نشانی دفتر</h3>
          <p className="mt-4 text-lg leading-9 text-ink/75">{contact.address}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-bronze">تلفن تماس</h3>
          <a href={contact.phoneHref} dir="ltr" className="mt-4 inline-block text-xl text-ink hover:text-bronze focus-visible:outline-2 focus-visible:outline-bronze">{contact.phone}</a>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-bronze">پست الکترونیکی</h3>
          <ul className="mt-4 space-y-3">
            {contact.emails.map(email => <li key={email}><a href={`mailto:${email}`} dir="ltr" className="inline-block max-w-full break-all text-sm text-ink/75 hover:text-bronze focus-visible:outline-2 focus-visible:outline-bronze">{email}</a></li>)}
          </ul>
        </Card>
      </address>
      <CooperationRequest />
    </Section>
  );
}
