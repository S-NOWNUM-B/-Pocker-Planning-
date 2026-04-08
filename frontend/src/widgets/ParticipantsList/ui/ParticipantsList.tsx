import { ParticipantCard, sortParticipants } from '@/entities/participant';
import { EmptyState } from '@/shared/ui';
import type { Participant } from '@poker/shared';

interface ParticipantsListProps {
  participants: Participant[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  if (participants.length === 0) {
    return (
      <EmptyState title="No participants yet" description="Share the room ID to invite others" />
    );
  }

  const sortedParticipants = [...participants].sort(sortParticipants);

  return (
    <section className="p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Participants ({participants.length})
      </h2>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {sortedParticipants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </ul>
    </section>
  );
}
