import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSession } from '@/app/providers';
import { roomApi } from '@/entities/room';
import {
  getRoomVotingView,
  mapSnapshotPlayers,
  mapSnapshotTasks,
  resolveRoomOwnerName,
} from '@/entities/room/lib/roomSnapshotMappers';
import { handleRevealAction, handleSelectCardAction } from '@/features/voting/lib/roomVotingActions';
import {
  handleAddTaskAction,
  handleNextTaskAction,
  handleSelectTaskAction,
} from '@/features/task-management/lib/roomTaskActions';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Card, Spinner } from '@/shared/ui';
import { getLocalSession, loadRoomSnapshotWithToken, roomRefLooksLikeCode } from '@/shared/lib/room';
import { persistRoomSession } from '@/shared/lib/session/persistRoomSession';
import { SessionManager } from '@/shared/lib/session';
import { useRoomWebSocket } from '@/shared/lib/hooks';
import { ParticipantsList, RoomFooter, RoomHeader, RoomHistory, RoomResults, TaskSidebar } from '@/widgets';
import { useRoomParams } from '../lib/useRoomParams';

export function RoomPage() {
  const { roomId: roomRef } = useRoomParams();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [resolvedRoomRef, setResolvedRoomRef] = useState(roomRef);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const localSession = getLocalSession();
  const roomAccessToken = user ? undefined : localSession?.roomAccessToken;

  useEffect(() => {
    setResolvedRoomRef(roomRef);
  }, [roomRef]);

  // Подтверждение при выходе из комнаты
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const roomQuery = useQuery({
    queryKey: ['room', resolvedRoomRef, user?.id ?? 'guest', roomAccessToken ?? 'no-token'],
    enabled: Boolean(user || roomAccessToken),
    queryFn: () => loadRoomSnapshotWithToken(resolvedRoomRef, roomAccessToken),
    refetchInterval: (query) => {
      // Fallback на polling если WebSocket не подключен
      const snapshot = query.state.data;
      return snapshot ? 10000 : 4000;
    },
  });

  const snapshot = roomQuery.data;
  const roomId = snapshot?.room.id;

  // Получаем JWT токен для WebSocket
  const wsToken = user ? SessionManager.getToken() : roomAccessToken;
  const canConnectWs = Boolean(roomId && wsToken);

  // Подключаем WebSocket
  const { isConnected: wsConnected } = useRoomWebSocket({
    roomId: roomId || '',
    roomRef: resolvedRoomRef,
    token: wsToken || '',
    userId: user?.id ?? 'guest',
    enabled: canConnectWs,
  });

  const refreshRoomData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['room', resolvedRoomRef, user?.id ?? 'guest', roomAccessToken ?? 'no-token'],
      }),
      queryClient.invalidateQueries({ queryKey: ['rooms'] }),
      queryClient.invalidateQueries({ queryKey: ['room-history', roomId] }),
    ]);
  };

  const createTaskMutation = useMutation({
    mutationFn: (title: string) => roomApi.createTask(roomId as string, title, roomAccessToken),
    onSuccess: () => {
      refreshRoomData();
      toast.success('Задача добавлена');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Не удалось добавить задачу');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      roomApi.updateTask(roomId as string, taskId, title, roomAccessToken),
    onSuccess: () => {
      refreshRoomData();
      toast.success('Задача обновлена');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Не удалось обновить задачу');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => roomApi.deleteTask(roomId as string, taskId, roomAccessToken),
    onSuccess: () => {
      refreshRoomData();
      toast.success('Задача удалена');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Не удалось удалить задачу');
    },
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
    onSuccess: () => {
      refreshRoomData();
      toast.success('Голос принят');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Не удалось отправить голос');
    },
  });

  const revealMutation = useMutation({
    mutationFn: (roundId: string) => roomApi.revealRound(roomId as string, roundId, roomAccessToken),
    onSuccess: () => {
      refreshRoomData();
      toast.success('Карты раскрыты');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Не удалось раскрыть карты');
    },
  });

  const resetRoundMutation = useMutation({
    mutationFn: (roundId: string) => roomApi.resetRound(roomId as string, roundId, roomAccessToken),
    onSuccess: () => {
      refreshRoomData();
      toast.success('Раунд сброшен, голосуйте заново');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Не удалось сбросить раунд');
    },
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

    if (roomRefLooksLikeCode(resolvedRoomRef) && snapshot.room.id !== resolvedRoomRef) {
      setResolvedRoomRef(snapshot.room.id);
    }

    persistRoomSession({
      snapshot,
      authUserName: user?.name,
      localUserName: localSession?.userName,
      roomAccessToken,
    });
  }, [localSession?.userName, resolvedRoomRef, roomAccessToken, snapshot, user?.name]);

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
  const tasks = mapSnapshotTasks(snapshot);
  const players = mapSnapshotPlayers(snapshot);
  const { activeTaskId, activeTask, isRevealed, allPlayersVoted, anyPlayerVoted, selectedCard, average } =
    getRoomVotingView(snapshot, tasks);
  const roomOwnerName = resolveRoomOwnerName(snapshot);

  const isBusy =
    createTaskMutation.isPending ||
    updateTaskMutation.isPending ||
    deleteTaskMutation.isPending ||
    selectTaskMutation.isPending ||
    startRoundMutation.isPending ||
    voteMutation.isPending ||
    revealMutation.isPending ||
    resetRoundMutation.isPending ||
    finalizeMutation.isPending;

  const handleSelectCard = async (card: string) => {
    await handleSelectCardAction({
      card,
      activeTask,
      isBusy,
      snapshot,
      isOwner,
      startRound: (taskId) => startRoundMutation.mutateAsync(taskId),
      vote: (payload) => voteMutation.mutateAsync(payload),
    });
  };

  const handleReveal = async () => {
    await handleRevealAction({
      snapshot,
      isOwner,
      isBusy,
      revealRound: (roundId) => revealMutation.mutateAsync(roundId),
    });
  };

  const handleResetRound = async () => {
    if (!isOwner || isBusy || !snapshot.active_round) {
      return;
    }

    try {
      await resetRoundMutation.mutateAsync(snapshot.active_round.id);
    } catch (error) {
      console.error('Failed to reset round:', error);
    }
  };

  const handleNextTask = async () => {
    await handleNextTaskAction({
      snapshot,
      isOwner,
      isBusy,
      finalizeRound: (payload) => finalizeMutation.mutateAsync(payload),
      selectTask: (taskId) => selectTaskMutation.mutateAsync(taskId),
    });
  };

  const handleAddTask = async () => {
    const isTaskCreated = await handleAddTaskAction({
      title: newTaskTitle,
      roomId,
      isOwner,
      isBusy,
      createTask: (title) => createTaskMutation.mutateAsync(title),
    });

    if (isTaskCreated) {
      setNewTaskTitle('');
    }
  };

  const handleSelectTask = async (taskId: string) => {
    await handleSelectTaskAction({
      taskId,
      snapshot,
      isOwner,
      isBusy,
      selectTask: (id) => selectTaskMutation.mutateAsync(id),
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!isOwner || isBusy) {
      return;
    }

    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, newTitle: string) => {
    if (!isOwner || isBusy) {
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({ taskId, title: newTitle });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
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
        onShowHistory={() => setIsHistoryOpen(true)}
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
          onDeleteTask={isOwner ? handleDeleteTask : undefined}
          onUpdateTask={isOwner ? handleUpdateTask : undefined}
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
                  {isOwner ? currentUserName : roomOwnerName}
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
            onResetRound={isOwner ? handleResetRound : undefined}
            isLoading={isBusy}
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

      <RoomHistory
        history={snapshot.history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
