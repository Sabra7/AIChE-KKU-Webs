import { parseScore, renderScoreImage, SCORE_IMAGE_SIZE, scoreParams } from '@/lib/scoreImage';

export const size = SCORE_IMAGE_SIZE;
export const contentType = 'image/png';
export const alt = 'AIChE KKU periodic table challenge score';
export const generateStaticParams = scoreParams;

export default async function ScoreImage({ params }: { params: Promise<{ score: string }> }) {
  const { score } = await params;
  return renderScoreImage(parseScore(score));
}
