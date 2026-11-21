import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Placeholder } from "@/components/ui/placeholder";
import { siteConfig } from "@/lib/site-config";
import { ContactInquiryForm } from "@/components/forms/contact-inquiry-form";
import { ContactFaqList } from "@/components/contact/contact-faq-list";

const { contact } = siteConfig;

const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function ScooterIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="2.4 10.4 19.4 9.8"
    >
      <circle cx="5.5" cy="17" r="2.4" />
      <circle cx="18.5" cy="17" r="2.4" />
      <path d="M8 17h5.6l2.5-5.5" />
      <path d="M9.2 13.2h3.9" />
      <path d="M15.8 11.5h2.9" />
      <path d="M18.5 17 15.9 12.4" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact KM100 Skills and Training Center, Inc. — ${contact.address}.`,
};

export default function ContactPage() {
  // Directions API link: empty origin means "use my current location", so this
  // opens straight onto the route to the school instead of its place page.
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodeURIComponent(
    `${siteConfig.name}, ${contact.address}`,
  )}`;

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Call, email, or send a message — whichever is easiest for you."
      />

      <section className="px-4 pb-16 pt-8 sm:px-6 lg:pb-24 lg:pt-10">
        <div className="mx-auto w-full max-w-7xl">
        {/* Slender reach row: rules only, no card. */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-km-charcoal/15 pb-6 text-[13.5px]">
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-2 text-km-charcoal/70 transition-colors hover:text-km-orange"
          >
            <PhoneIcon className="h-[15px] w-[15px] shrink-0 text-km-orange" />
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 text-km-charcoal/70 transition-colors hover:text-km-orange"
          >
            <MailIcon className="h-[15px] w-[15px] shrink-0 text-km-orange" />
            Email us
          </a>
          <a
            href={contact.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-km-charcoal/70 transition-colors hover:text-km-orange"
          >
            <FacebookIcon className="h-[15px] w-[15px] shrink-0 text-km-orange" />
            Message on Facebook
          </a>
          <span className="inline-flex max-w-full items-start gap-2 text-km-charcoal/50">
            <MapPinIcon className="mt-0.5 h-[15px] w-[15px] shrink-0 text-km-orange" />
            <span className="min-w-0 break-words">{contact.address}</span>
          </span>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-km-orange hover:underline"
          >
            <ScooterIcon className="h-[18px] w-[18px] shrink-0" />
            Get directions
          </a>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Column one: message + office hours, set as text on the page. */}
          <div className="lg:col-span-7">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-km-orange">
              Send a message
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-[2rem] leading-[1.1] text-balance sm:text-[2.4rem]">
              How can we help?
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-[1.75] text-km-charcoal/60">
              Include the program you&rsquo;re asking about so we can answer in
              one reply. Messages sent after closing are answered on the next
              working day.
            </p>

            <div className="mt-11">
              <ContactInquiryForm />
            </div>

            <div className="mt-16">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-km-charcoal/30 pb-3">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-km-charcoal/50">
                  Office hours
                </p>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-km-charcoal/35">
                  Bogo City
                </span>
              </div>
              <dl>
                {contact.hours.map((hour) => (
                  <div
                    key={hour.days}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-km-charcoal/10 py-3.5"
                  >
                    <dt className="text-[15px] text-km-charcoal/70">
                      {hour.days}
                    </dt>
                    <dd className="text-[15px] tabular-nums text-km-charcoal">
                      {hour.time}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 max-w-md text-xs leading-relaxed text-km-charcoal/40">
                Campus visits are best on weekday mornings, while classes and
                laboratory sessions are running.
              </p>
            </div>
          </div>

          {/* Column two: the map, running the full height of the details beside it. */}
          <aside className="lg:col-span-5">
            <div className="h-full overflow-hidden ring-1 ring-km-charcoal/15">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  title="KM100 campus location"
                  className="block h-[24rem] w-full sm:h-[28rem] lg:h-full lg:min-h-[28rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <Placeholder
                  label="Google Maps embed (set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL in .env)"
                  className="h-[24rem] rounded-none border-0 sm:h-[28rem] lg:h-full lg:min-h-[28rem]"
                />
              )}
            </div>
          </aside>
        </div>

        {/* FAQs. */}
        <div className="mt-24 border-t border-km-charcoal/15 pt-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-km-orange">
              FAQs
            </p>
            <h2 className="mt-3 font-heading text-[1.9rem] leading-tight text-balance sm:text-[2.4rem]">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-10">
            <ContactFaqList />
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
