import type { DualDate as Dual } from '@/lib/dates';
import type { Lang } from '@/lib/i18n';
import Num from './Num';

export default function DualDate({
  lang,
  date,
  inline = false,
}: {
  lang: Lang;
  date: Dual;
  inline?: boolean;
}) {
  const greg = (
    <>
      <Num>{date.greg}</Num>
      {lang === 'ar' ? 'م' : ''}
    </>
  );
  const hijri = (
    <>
      <Num>{date.hijri}</Num>
      {lang === 'ar' ? 'هـ' : ' AH'}
    </>
  );

  if (inline) {
    return (
      <span className="dual dual--inline">
        {greg} ({hijri})
      </span>
    );
  }

  return (
    <span className="dual">
      <span className="dual__g">{greg}</span>
      <span className="dual__h">{hijri}</span>
    </span>
  );
}
