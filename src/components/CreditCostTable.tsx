import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ToolCost = { name: string; cost: string; free?: boolean };

// First-draft credit costs — easy to tweak.
export const TOOL_COSTS: ToolCost[] = [
  { name: 'Academy / Courses', cost: 'Free', free: true },
  { name: 'Scene Analysis', cost: '~1 credit' },
  { name: 'Storyboard Generator', cost: '2–4 credits (grows with number of frames)' },
  { name: 'Table Read', cost: '2–4 credits (varies by dialogue length)' },
  { name: 'Fundraising', cost: '~1 credit' },
  { name: 'Pitch Deck Maker', cost: '~2 credits' },
  { name: 'Calendar', cost: 'Free', free: true },
  { name: 'Call Sheet Generator', cost: '~1 credit' },
  { name: 'Project Intake Form', cost: 'Free', free: true },
  { name: 'Contract Assistant', cost: '~1 credit' },
  { name: 'Document Library', cost: 'Free', free: true },
  { name: 'Auditions', cost: 'Free', free: true },
  { name: 'Crew Hire', cost: 'Free', free: true },
  { name: 'Distribution Readiness Assessment', cost: '~1 credit' },
  { name: 'Recut', cost: '~1 credit' },
  { name: 'Marketing in a Box', cost: '—' },
  { name: 'Green Light Engine', cost: '—' },
];

const CreditCostTable = ({ className = '' }: { className?: string }) => (
  <Card className={`p-6 bg-white/[0.03] border-white/10 ${className}`}>
    <h2 className="text-xl font-semibold mb-2">How Your Credits Work</h2>
    <p className="text-sm text-white/60 mb-5">
      Every AI tool runs on credits. Here's exactly what each one costs — so you always know
      where you stand.
    </p>
    <div className="border border-white/5 rounded-md overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5 bg-white/5 text-xs uppercase tracking-wider text-white/50">
        <span>Tool</span>
        <span>Cost</span>
      </div>
      <ul className="divide-y divide-white/5">
        {TOOL_COSTS.map(t => (
          <li key={t.name} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-center text-sm">
            <span className="text-white/90">{t.name}</span>
            {t.free ? (
              <Badge
                variant="outline"
                className="border-[#00d4aa]/40 text-[#00d4aa] bg-[#00d4aa]/5"
              >
                {t.cost}
              </Badge>
            ) : (
              <span className="text-white/70 text-right">{t.cost}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  </Card>
);

export default CreditCostTable;
