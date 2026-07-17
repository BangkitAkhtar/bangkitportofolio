import { lazy, Suspense, ComponentProps } from "react";

/**
 * Modal detail hanya di-load saat benar-benar dibuka (open=true).
 * Selama tertutup return null → chunk DetailDialog + framer-motion TIDAK ikut
 * di-download saat load awal halaman, hanya saat user klik sebuah item.
 */
const RealDetailDialog = lazy(() =>
  import("./DetailDialog").then((m) => ({ default: m.DetailDialog }))
);

type Props = ComponentProps<typeof RealDetailDialog>;

export function DetailDialog(props: Props) {
  if (!props.open) return null;
  return (
    <Suspense fallback={null}>
      <RealDetailDialog {...props} />
    </Suspense>
  );
}
