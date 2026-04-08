import { VoteDisplay } from '@/entities/vote';
import { Card, EmptyState } from '@/shared/ui';
import type { VoteValue } from '@poker/shared';

interface VoteResult {
  participantName: string;
  vote: VoteValue;
}

interface RoomResultsProps {
  results: VoteResult[];
  average?: number;
}

export function RoomResults({ results, average }: RoomResultsProps) {
  if (results.length === 0) {
    return <EmptyState title="No votes to display" description="Waiting for participants to vote" />;
  }

  return (
    <section className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Results</h2>
        {average !== undefined && (
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-gray-500">Average:</span>
            <span className="text-xl font-bold text-blue-500">{average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <Card className="p-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 justify-items-center">
          {results.map((result, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <VoteDisplay value={result.vote} size="sm" revealed />
              <span className="text-xs text-gray-500 text-center max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                {result.participantName}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export type { VoteResult };
