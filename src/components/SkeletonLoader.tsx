export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Nav skeleton */}
      <div className="h-14 bg-card/50 border-b border-border" />

      {/* Hero skeleton */}
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="w-36 h-36 rounded-full bg-muted/20" />
        <div className="w-64 h-8 rounded-lg bg-muted/20" />
        <div className="w-96 h-5 rounded bg-muted/10" />
        <div className="flex gap-3 mt-4">
          <div className="w-28 h-10 rounded-xl bg-muted/15" />
          <div className="w-28 h-10 rounded-xl bg-muted/15" />
          <div className="w-28 h-10 rounded-xl bg-muted/15" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="w-48 h-7 rounded bg-muted/30" />
            <div className="w-full h-32 rounded-2xl bg-muted/15" />
          </div>
        ))}
      </div>
    </div>
  );
}
