import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "KM100 Skills and Training Center, Inc. | Diploma Programs in Bogo City, Cebu",
    template: "%s | KM100 Skills and Training Center, Inc.",
  },
  description:
    "Discover KM100 Skills and Training Center, Inc. in Bogo City, Cebu. Explore five 3-year PQF Level 5 Diploma Programs and pre-register today.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // 1. Instantly strip extension-injected attributes to prevent hydration mismatch
                try {
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && (m.attributeName === 'bis_skin_checked' || m.attributeName === 'bis_register')) {
                        m.target.removeAttribute(m.attributeName);
                      }
                      if (m.addedNodes) {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          var node = m.addedNodes[j];
                          if (node.nodeType === 1) {
                            if (node.hasAttribute('bis_skin_checked')) node.removeAttribute('bis_skin_checked');
                            if (node.hasAttribute('bis_register')) node.removeAttribute('bis_register');
                            var els = node.querySelectorAll ? node.querySelectorAll('[bis_skin_checked], [bis_register]') : [];
                            for (var k = 0; k < els.length; k++) {
                              els[k].removeAttribute('bis_skin_checked');
                              els[k].removeAttribute('bis_register');
                            }
                          }
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register']
                  });
                } catch(e) {}

                // 2. Filter out console errors triggered by extension attributes
                var origError = console.error;
                console.error = function() {
                  for (var i = 0; i < arguments.length; i++) {
                    var str = typeof arguments[i] === 'string' ? arguments[i] : (arguments[i] && arguments[i].message) || '';
                    if (str.indexOf('bis_skin_checked') !== -1 || str.indexOf('bis_register') !== -1) {
                      return;
                    }
                  }
                  origError.apply(console, arguments);
                };

                // 3. Catch and silence runtime errors originating from browser extensions
                window.addEventListener('error', function(e) {
                  if (e.filename && (e.filename.includes('chrome-extension://') || e.filename.includes('moz-extension://'))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var stack = (e.reason && e.reason.stack) || '';
                  if (stack.includes('chrome-extension://') || stack.includes('moz-extension://')) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
      <body
        className="flex min-h-screen flex-col bg-white font-body text-km-charcoal"
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
