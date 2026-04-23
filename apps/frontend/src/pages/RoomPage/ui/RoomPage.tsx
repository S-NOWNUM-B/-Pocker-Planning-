import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/app/providers';
import { roomApi } from '@/entities/room';
import type { RoomSnapshot } from '@/entities/room/model/types';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Card, Spinner } from '@/shared/ui';
import { SESSION_STORAGE_KEY, type GameSession, type Player, type Task } from '@/shared/lib/poker';
import { ParticipantsList, RoomFooter, RoomHeader, RoomResults, TaskSidebar } from '@/widgets';
import { useRoomParams } from '../lib/useRoomParams';

function toAverageLabel(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '0';
  }

  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function roomRefLooksLikeCode(value: string) {
  return /^[a-zA-Z]{4}$/.test(value);
}

function getLocalSession(): GameSession | null {
  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as GameSession;
  } catch {
    return null;
  }
}

async function loadRoomSnapshotWithToken(roomRef: string, roomAccessToken?: string): Promise<RoomSnapshot> {
  try {
    return await roomApi.getRoomSnapshot(roomRef, roomAccessToken);
  } catch {
    if (roomRefLooksLikeCode(roomRef)) {
      return roomApi.joinRoomByCode(roomRef.toUpperCase(), roomAccessToken);
    }

    throw new Error('room_not_available');
  }
}

export function RoomPage() {
  const { roomId: roomRef } = useRoomParams();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const localSession = getLocalSession();
  const roomAccessToken = user ? undefined : localSession?.roomAccessToken;

  const roomQuery = useQuery({
    queryKey: ['room', roomRef, user?.id ?? 'guest', roomAccessToken ?? 'no-token'],
    enabled: Boolean(user || roomAccessToken),
    queryFn: () => loadRoomSnapshotWithToken(roomRef, roomAccessToken),
    refetchInterval: 4000,
  });

  const snapshot = roomQuery.data;
  const roomId = snapshot?.room.id;

  const refreshRoomData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['room', roomRef, user?.id ?? 'guest', roomAccessToken ?? 'no-token'],
      }),
      queryClient.invalidateQueries({ queryKey: ['rooms'] }),
      queryClient.invalidateQueries({ queryKey: ['room-history', roomId] }),
    ]);
  };

  const createTaskMutation = useMutation({
    mutationFn: (title: string) => roomApi.createTask(roomId as string, title, roomAccessToken),
    onSuccess: refreshRoomData,
  });

  const selectTaskMutation = useMutation({
    mutationFn: (taskId: string) => roomApi.selectTask(roomId as string, taskId, roomAccessToken),
    onSuccess: refreshRoomData,
  });

  const startRoundMutation = useMutation({
    mutationFn: (taskId: string) => roomApi.startRound(roomId as string, taskId, roomAccessToken),
    onSuccess: refreshRoomData,
  });

  const voteMutation = useMutation({
    mutationFn: ({ roundId, value }: { roundId: string; value: string }) =>
      roomApi.submitVote(roomId as string, roundId, value, roomAccessToken),
    onSuccess: refreshRoomData,
  });

  const revealMutation = useMutation({
    mutationFn: (roundId: string) => roomApi.revealRound(roomId as string, roundId, roomAccessToken),
    onSuccess: refreshRoomData,
  });

  const finalizeMutation = useMutation({
    mutationFn: ({ roundId, resultValue }: { roundId: string; resultValue?: string }) =>
      roomApi.finalizeRound(roomId as string, roundId, resultValue, roomAccessToken),
    onSuccess: refreshRoomData,
  });

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    const selfParticipant = snapshot.self_participant_id
      ? snapshot.participants.find((participant) => participant.id === snapshot.self_participant_id)
      : null;
    const userName = user?.name || selfParticipant?.name || localSession?.userName || 'Гость';
    const isOwner = selfParticipant?.role === 'owner';
    const session: GameSession = {
      roomId: snapshot.room.slug,
      roomName: snapshot.room.name,
      userName,
      ownerId: snapshot.room.owner_id,
      ownerName: isOwner ? userName : 'Владелец комнаты',
      deckType: snapshot.room.deck.code === 'even' ? 'even' : 'fibonacci',
      roomAccessToken,
      selfParticipantId: snapshot.self_participant_id,
    };

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [localSession?.userName, roomAccessToken, snapshot, user?.name]);

  if (!user && !roomAccessToken) {
    return <Navigate to="/login" replace />;
  }

  if (roomQuery.isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (roomQuery.isError || !snapshot) {
    return <NotFoundPage />;
  }

  const selfParticipant = snapshot.self_participant_id
    ? snapshot.participants.find((participant) => participant.id === snapshot.self_participant_id)
    : null;
  const isOwner = selfParticipant?.role === 'owner';
  const currentUserName = user?.name || selfParticipant?.name || localSession?.userName || 'Гость';

  const tasks = [...snapshot.tasks]
    .sort((a, b) => a.position - b.position)
    .map(
      (task): Task => ({
        id: task.id,
        title: task.title,
        estimate: task.estimate_value,
      }),
    );

  const activeTaskId = snapshot.active_round?.task_id ?? snapshot.room.current_task_id;
  const activeTask = activeTaskId ? tasks.find((task) => task.id === activeTaskId) ?? null : null;
  const isRevealed = snapshot.active_round?.status === 'revealed';
  const allPlayersVoted =
    snapshot.active_round !== null
      ? snapshot.active_round.votes_submitted >= snapshot.active_round.total_participants
      : false;
  const anyPlayerVoted = snapshot.active_round !== null ? snapshot.active_round.votes_submitted > 0 : false;

  const voteValueByParticipantId = new Map(
    (snapshot.active_round?.votes ?? []).map((vote) => [vote.participant_id, vote]),
  );

  const players = snapshot.participants.map(
    (participant): Player => {
      const roundVote = voteValueByParticipantId.get(participant.id);
      const vote =
        snapshot.active_round?.status === 'revealed'
          ? roundVote?.value ?? null
          : participant.has_voted
            ? '✓'
            : null;

      return {
        id: participant.id,
        name: participant.name,
        role: participant.role === 'owner' ? 'Создатель' : 'Участник',
        vote,
        isThinking: false,
        isBot: false,
      };
    },
  );

  const selectedCard = snapshot.active_round?.self_vote_value ?? null;
  const average = toAverageLabel(snapshot.active_round?.average_score);

  const isBusy =
    createTaskMutation.isPending ||
    selectTaskMutation.isPending ||
    startRoundMutation.isPending ||
    voteMutation.isPending ||
    revealMutation.isPending ||
    finalizeMutation.isPending;

  const handleSelectCard = async (card: string) => {
    if (!activeTask || isBusy) {
      return;
    }

    const activeRound = snapshot.active_round;

    if (!activeRound) {
      if (!isOwner) {
        return;
      }

      const startedSnapshot = await startRoundMutation.mutateAsync(activeTask.id);
      if (!startedSnapshot.active_round) {
        return;
      }

      await voteMutation.mutateAsync({
        roundId: startedSnapshot.active_round.id,
        value: card,
      });
      return;
    }

    if (activeRound.status !== 'voting') {
      return;
    }

    await voteMutation.mutateAsync({
      roundId: activeRound.id,
      value: card,
    });
  };

  const handleReveal = async () => {
    if (!isOwner || !snapshot.active_round || snapshot.active_round.status !== 'voting' || isBusy) {
      return;
    }

    await revealMutation.mutateAsync(snapshot.active_round.id);
  };

  const handleNextTask = async () => {
    if (!isOwner || !snapshot.active_round || snapshot.active_round.status !== 'revealed' || isBusy) {
      return;
    }

    const roundId = snapshot.active_round.id;
    const resultValue = snapshot.active_round.suggested_result ?? undefined;

    await finalizeMutation.mutateAsync({ roundId, resultValue });

    const nextTask = snapshot.tasks
      .filter((task) => task.id !== snapshot.active_round?.task_id && task.estimate_value === null)
      .sort((a, b) => a.position - b.position)[0];

    if (nextTask) {
      await selectTaskMutation.mutateAsync(nextTask.id);
    }
  };

  const handleAddTask = async () => {
    const title = newTaskTitle.trim();
    if (!title || !isOwner || !roomId || isBusy) {
      return;
    }

    await createTaskMutation.mutateAsync(title);
    setNewTaskTitle('');
  };

  const handleSelectTask = async (taskId: string) => {
    if (!isOwner || isBusy || snapshot.active_round?.status === 'voting') {
      return;
    }

    await selectTaskMutation.mutateAsync(taskId);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <RoomHeader
        roomName={snapshot.room.name}
        roomId={snapshot.room.slug}
        deckName={snapshot.room.deck.code === 'even' ? 'Чётная' : 'Фибоначчи'}
        inviteLink={snapshot.room.invite_link}
      />

      <main className="relative mx-auto grid w-full max-w-7xl min-h-0 flex-1 gap-3 overflow-y-auto px-4 py-3 pb-4 sm:px-6 sm:py-4 sm:pb-5 lg:grid-cols-[20rem_minmax(0,1fr)] lg:overflow-visible lg:px-8">
        <TaskSidebar
          tasks={tasks}
          activeTaskId={activeTaskId}
          isRevealed={isRevealed}
          newTaskTitle={newTaskTitle}
          onNewTaskTitleChange={setNewTaskTitle}
          onAddTask={handleAddTask}
          onSelectTask={handleSelectTask}
          className="h-auto min-h-0 lg:h-full lg:max-h-full"
        />

        <div className="grid min-w-0 min-h-0 gap-3 lg:grid-rows-[auto_minmax(0,1.8fr)_auto]">
          <Card className="border border-border/70 bg-card/90 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Создатель комнаты
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {isOwner
                    ? currentUserName
                    : snapshot.participants.find((participant) => participant.role === 'owner')?.name ||
                      'Владелец комнаты'}
                </div>
              </div>
            </div>
          </Card>

          <RoomResults
            activeTaskTitle={activeTask ? activeTask.title : null}
            average={average}
            isRevealed={isRevealed}
            allPlayersVoted={allPlayersVoted}
            anyPlayerVoted={anyPlayerVoted}
            onReveal={handleReveal}
            onNextTask={handleNextTask}
            className="h-auto min-h-48 lg:h-full"
          />

          <ParticipantsList
            players={players}
            hasActiveTask={activeTask !== null}
            isRevealed={isRevealed}
            className="self-start h-auto min-h-5.5rem"
          />
        </div>
      </main>

      <RoomFooter
        cards={snapshot.room.deck.cards}
        selectedCard={selectedCard}
        disabled={isRevealed || !activeTask || isBusy}
        onSelectCard={(card) => {
          void handleSelectCard(card);
        }}
      />
    </div>
  );
}
