import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Supabase's connection pooler can take several seconds to accept a brand new
 * connection (cold start / idle wake-up), which surfaces as Prisma "P1001: Can't
 * reach database server". Retrying the query a few times turns that transient
 * failure into a slightly slower success instead of a 500 response.
 */
const MAX_ATTEMPTS = 4;
const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1008", "P1017", "P2024"]);

function isTransientConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(error.code);
  }

  const message = error instanceof Error ? error.message : String(error ?? "");

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return /can't reach database server|timed out|connection refused|connection reset|server has closed the connection/i.test(
      message
    );
  }

  return /can't reach database server|connection (refused|reset|closed)|timed out|ECONNRESET|ETIMEDOUT|EPIPE/i.test(
    message
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  return client.$extends({
    name: "connection-retry",
    query: {
      async $allOperations({ args, query }) {
        for (let attempt = 1; ; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            if (attempt >= MAX_ATTEMPTS || !isTransientConnectionError(error)) {
              throw error;
            }
            // 300ms, 600ms, 1200ms — enough to ride out a pooler cold start.
            await sleep(300 * 2 ** (attempt - 1));
          }
        }
      },
    },
  });
}

type PrismaClientWithRetry = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientWithRetry;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
