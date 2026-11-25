import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The real TESDA DPA Form 1 template is read from disk when a PDF is built.
  outputFileTracingIncludes: {
    "/api/applications/**": ["./assets/tesda-dpa-form-1.pdf"],
    "/api/pre-registration/form": ["./assets/tesda-dpa-form-1.pdf"],
  },
};

export default nextConfig;
