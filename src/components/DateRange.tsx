import { useResume } from '../context/ResumeContext';
import { splitDateRange } from '../utils/date';

interface Props {
  start: string;
  end: string;
  /** Carry the spacing the template wants: " ~ ", " — ", or a tight "~" */
  sep?: string;
}

/**
 * A single period rendered as two fixed-width columns, so start dates share a left edge and
 * end dates share a right edge down the page — including 至今/Present, which is narrower
 * than a month and would otherwise leave the column ragged.
 */
export default function DateRange({ start, end, sep = ' ~ ' }: Props) {
  const { lang } = useResume();
  const { from, to } = splitDateRange(start, end, lang);

  if (!from) return <>{to}</>;
  if (!to) return <>{from}</>;

  return (
    <span className="inline-flex items-baseline whitespace-nowrap tabular-nums">
      {/* 8ch clears the widest value ("2021-03", "Present") so both columns keep one fixed
          width everywhere and their left/right edges land on the same pixel */}
      <span className="min-w-[8ch]">{from}</span>
      <span>{sep}</span>
      <span className="min-w-[8ch] text-right">{to}</span>
    </span>
  );
}
