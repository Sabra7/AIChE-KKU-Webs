import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import DualDate from './DualDate';

const YEAR = { greg: '2026', hijri: '1448' };

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="ftr">
      <div className="shell ftr__in">
        <p className="ftr__c">
          © <DualDate lang={lang} date={YEAR} inline /> AIChE.{' '}
          {pick(
            lang,
            'الفرع الطلابي بجامعة الملك خالد، أبها، المملكة العربية السعودية',
            'King Khalid University Student Chapter, Abha, Saudi Arabia',
          )}
        </p>

        <p className="ftr__c en">
          {ui.creditPrefix}{' '}
          <a href={ui.creditUrl} target="_blank" rel="noopener noreferrer">
            {ui.creditName}
          </a>
        </p>
      </div>
    </footer>
  );
}
