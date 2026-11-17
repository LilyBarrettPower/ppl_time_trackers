// Temporary home page for Stage 1 — replaced by the dashboard in Stage 3.
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-4 py-16">
      <p className="text-sm font-medium tracking-wide text-emerald-600 uppercase">
        Stage 1 complete
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Job Time Tracker
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Manage clients, jobs and rates, log time, and calculate billable amounts
        (excl. and incl. GST).
      </p>
    </main>
  );
}
