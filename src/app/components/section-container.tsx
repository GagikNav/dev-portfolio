import type { ReactNode } from "react";

type SectionContainerProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Reusable section wrapper — consistent vertical padding, max-width, and
 * horizontal gutter. Add `id` for anchor navigation from the header.
 */
export function SectionContainer({
  id,
  className = "",
  children,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={[
        "w-full py-24 scroll-mt-20",
        className,
      ].join(" ")}
    >
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}
