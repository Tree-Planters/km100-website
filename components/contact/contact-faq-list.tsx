import { contactFaqs } from "@/lib/contact-faqs";

export function ContactFaqList() {
  return (
    <div className="grid gap-x-16 gap-y-0 md:grid-cols-2">
      {contactFaqs.map((faq) => (
        <details
          key={faq.question}
          className="group border-b border-km-charcoal/10"
        >
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden
              className="mt-px grid h-7 w-7 shrink-0 place-items-center rounded-full border border-km-charcoal/15 text-[13px] font-medium text-km-orange transition-colors group-hover:border-km-orange/40"
            >
              ?
            </span>
            <span className="flex-1 text-[15px] font-medium leading-snug text-km-charcoal">
              {faq.question}
            </span>
            <span
              aria-hidden
              className="mt-0.5 text-lg leading-none text-km-charcoal/25 transition-transform duration-200 ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-6 pl-11 pr-6 text-sm leading-[1.75] text-km-charcoal/60">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
