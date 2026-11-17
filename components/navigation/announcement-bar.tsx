import { siteConfig } from "@/lib/site-config";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7.5 8.5 5.5 8.5-5.5" />
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

/**
 * Slim announcement / top bar.
 * Message and contact details are edited in lib/site-config.ts.
 */
export function AnnouncementBar() {
  const { announcement, contact } = siteConfig;

  if (!announcement.visible) return null;

  return (
    <div className="border-b border-km-charcoal/10 bg-km-warm-white text-km-charcoal">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 text-[13px] sm:px-6 sm:py-2.5">
        <span className="hidden shrink-0 rounded-sm bg-km-orange px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-white sm:inline-block">
          Announcement
        </span>

        <p className="line-clamp-2 min-w-0 flex-1 text-[12px] font-medium leading-snug sm:line-clamp-1 sm:text-[13px]">
          {announcement.message}
        </p>

        {/* Desktop / large tablet: labelled contacts */}
        <div className="hidden shrink-0 items-center gap-5 border-l border-km-charcoal/15 pl-5 text-km-charcoal/60 lg:flex">
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-km-orange"
          >
            <PhoneIcon className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{contact.phone}</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="hidden items-center gap-1.5 transition-colors duration-200 hover:text-km-orange xl:inline-flex"
          >
            <MailIcon className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{contact.email}</span>
          </a>
          <a
            href={contact.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-km-orange"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Facebook</span>
          </a>
        </div>

        {/* Mobile: icon-only action row with real tap targets */}
        <div className="-mr-1 flex shrink-0 items-center lg:hidden">
          <a
            href={contact.phoneHref}
            aria-label={`Call ${contact.phone}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-km-charcoal/70 transition-colors duration-200 active:bg-km-charcoal/5 hover:bg-km-charcoal/5 hover:text-km-orange"
          >
            <PhoneIcon className="h-[15px] w-[15px]" />
          </a>
          <a
            href={`mailto:${contact.email}`}
            aria-label={`Email ${contact.email}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-km-charcoal/70 transition-colors duration-200 active:bg-km-charcoal/5 hover:bg-km-charcoal/5 hover:text-km-orange"
          >
            <MailIcon className="h-[15px] w-[15px]" />
          </a>
          <a
            href={contact.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-km-charcoal/70 transition-colors duration-200 active:bg-km-charcoal/5 hover:bg-km-charcoal/5 hover:text-km-orange"
          >
            <FacebookIcon className="h-[15px] w-[15px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
