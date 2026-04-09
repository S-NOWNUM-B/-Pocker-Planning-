import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, EmptyState } from '@/shared/ui';
import { TargetIcon } from '@/shared/ui/icons';
import { useTheme } from '@/shared/lib/hooks';
import {
  DECKS,
  SESSION_STORAGE_KEY,
  createRoomId,
  getAverageVote,
  type DeckType,
  type GameSession,
  type Player,
  type Task,
} from '@/shared/lib/poker';
import { ParticipantsList, RoomHeader, RoomResults, TaskSidebar, VotingCards } from '@/widgets';
import { useRoomParams } from '../lib/useRoomParams';

function readSession(roomId: string) {
  try {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession) as GameSession;
    return session.roomId === roomId ? session : null;
  } catch {
    return null;
  }
}

function getDeckName(deckType: DeckType) {
  return deckType === 'fibonacci' ? 'Фибоначчи' : 'Чётная';
}

export function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useRoomParams();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const storedSession = readSession(roomId);

    if (!storedSession) {
      setSession(null);
      return;
    }

    setSession(storedSession);
    setTheme(storedSession.theme);
    setPlayers([
      {
        id: 'user',
        name: storedSession.userName,
        role: 'Вы',
        vote: null,
        isThinking: false,
        isBot: false,
      },
    ]);
  }, [roomId, setTheme]);

  const deck = useMemo(() => {
    return session ? DECKS[session.deckType] : DECKS.fibonacci;
  }, [session]);

  const activeTask = activeTaskId ? (tasks.find((task) => task.id === activeTaskId) ?? null) : null;
  const allPlayersVoted = players.every((player) => player.vote !== null);
  const anyPlayerVoted = players.some((player) => player.vote !== null);
  const average = getAverageVote(players);

  const handleSelectCard = (card: string) => {
    if (isRevealed) {
      return;
    }

    setSelectedCard(card);
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => (!player.isBot ? { ...player, vote: card } : player)),
    );
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setStatusMessage(
      activeTask ? `Оценка "${activeTask.title}" сохранена: ${average} SP` : 'Результат открыт',
    );

    if (activeTaskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === activeTaskId ? { ...task, estimate: average } : task,
        ),
      );
    }

    const votes = players
      .map((player) => player.vote)
      .filter((vote): vote is string => vote !== null && vote !== '?' && vote !== '☕');
    if (votes.length > 0 && votes.every((vote) => vote === votes[0])) {
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 2200);
    }
  };

  const handleClearTable = () => {
    const nextTask = tasks.find((task) => task.id !== activeTaskId && !task.estimate);

    if (nextTask) {
      setActiveTaskId(nextTask.id);
      setStatusMessage(`Переход к: ${nextTask.title}`);
    } else if (tasks.length > 0 && tasks.every((task) => task.estimate !== null)) {
      setStatusMessage('Все задачи оценены');
    }

    setIsRevealed(false);
    setSelectedCard(null);
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({ ...player, vote: null, isThinking: false })),
    );
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      return;
    }

    const newTask: Task = {
      id: `${createRoomId(newTaskTitle)}-${Date.now()}`,
      title: newTaskTitle.trim(),
      estimate: null,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setActiveTaskId((currentActiveTaskId) => currentActiveTaskId ?? newTask.id);
    setNewTaskTitle('');
    setStatusMessage(`Добавлена задача: ${newTask.title}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
      setCopyState('copied');
      setStatusMessage('Ссылка скопирована');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setStatusMessage('Не удалось скопировать ссылку');
    }
  };

  const handleExitRoom = () => {
    navigate('/');
  };

  if (!session) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
        <Card className="w-full border border-border/70 bg-card/95 p-8 text-center shadow-2xl backdrop-blur">
          <EmptyState
            icon={<TargetIcon className="h-10 w-10" />}
            title="Комната не найдена"
            description="Сначала создайте сессию на главной странице, затем откройте комнату снова"
            actionLabel="Вернуться на главную"
            onAction={() => navigate('/')}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 bg-primary/10 animate-pulse" />
      )}

      <RoomHeader
        roomName={session.roomName}
        roomId={roomId}
        deckName={getDeckName(session.deckType)}
        theme={theme}
        copyLabel={copyState === 'copied' ? 'Скопировано' : 'Пригласить'}
        onToggleTheme={toggleTheme}
        onCopyLink={handleCopyLink}
        onExit={handleExitRoom}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:px-8">
        <TaskSidebar
          tasks={tasks}
          activeTaskId={activeTaskId}
          isRevealed={isRevealed}
          newTaskTitle={newTaskTitle}
          onNewTaskTitleChange={setNewTaskTitle}
          onAddTask={handleAddTask}
          onSelectTask={setActiveTaskId}
        />

        <RoomResults
          activeTaskTitle={activeTask ? activeTask.title : null}
          average={average}
          isRevealed={isRevealed}
          allPlayersVoted={allPlayersVoted}
          anyPlayerVoted={anyPlayerVoted}
          statusMessage={statusMessage}
          onReveal={handleReveal}
          onNextTask={handleClearTable}
        />
      </main>

      <ParticipantsList players={players} isRevealed={isRevealed} />

      <VotingCards
        cards={deck}
        selectedCard={selectedCard}
        disabled={isRevealed}
        onSelectCard={handleSelectCard}
      />
    </div>
  );
}
