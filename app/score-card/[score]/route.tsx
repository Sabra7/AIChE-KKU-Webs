import { parseScore, renderScoreImage, scoreParams } from '@/lib/scoreImage';

export const dynamic = 'force-static';
export const generateStaticParams = scoreParams;

export async function GET(_request: Request, { params }: { params: Promise<{ score: string }> }) {
  const { score } = await params;
  return renderScoreImage(parseScore(score));
}
