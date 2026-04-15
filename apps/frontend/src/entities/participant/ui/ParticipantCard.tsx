/**
 * Карточка участника в списке игроков.
 *
 * Отображает:
 *  - Аватар с инициалами
 *  - Имя участника
 *  - Статус голосования (✓ Voted / Pending) — опционально
 *
 * Используется в ParticipantsList (widget) на странице комнаты.
 *
 * @param participant — данные участника
 * @param showVoteStatus — показывать ли статус голосования (по умолчанию true)
 */
import { getInitials } from '../model/selectors';
import type { Participant } from '../model/types';

interface ParticipantCardProps {
  participant: Participant;
  showVoteStatus?: boolean;
}

export function ParticipantCard({ participant, showVoteStatus = true }: ParticipantCardProps) {
  const initials = getInitials(participant.name);

  return (
    <li className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg">
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm shrink-0">
        {initials}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
          {participant.name}
        </span>
        {showVoteStatus && (
          <span className={`text-xs ${participant.hasVoted ? 'text-green-600' : 'text-gray-400'}`}>
            {participant.hasVoted ? '✓ Voted' : 'Pending'}
          </span>
        )}
      </div>
    </li>
  );
}
