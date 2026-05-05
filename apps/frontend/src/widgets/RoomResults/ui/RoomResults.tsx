/**
 * Область результатов голосования в игровой комнате.
 *
 * Центральная зона RoomPage. Показывает:
 *  - Название активной задачи
 *  - Среднее значение голосов (Story Points)
 *  - До раскрытия: кнопку «Вскрыть карты» и подсказку о состоянии голосования
 *  - После раскрытия: финальную оценку крупным шрифтом + кнопку «Следующая задача»
 *
 * @param activeTaskTitle — название текущей задачи
 * @param average — среднее значение голосов
 * @param isRevealed — раскрыты ли результаты
 * @param allPlayersVoted — все ли проголосовали
 * @param anyPlayerVoted — есть ли хоть один голос
 * @param onReveal — раскрытие результатов
 * @param onNextTask — переход к следующей задаче
 * @param className — дополнительный CSS-класс
 */
import { useState, useEffect } from 'react';
import { Button, Card, Modal } from '@/shared/ui';
import { cn } from '@/shared/lib';
import { CheckIcon } from '@/shared/ui/icons';
import type { RoomSnapshot } from '@/entities/room/model/types';

interface RoomResultsProps {
  activeTaskTitle: string | null;
  average: string;
  cards: string[];
  isRevealed: boolean;
  isFinalized: boolean;
  allPlayersVoted: boolean;
  anyPlayerVoted: boolean;
  onReveal: () => void;
  onFinalize: (value: string) => void;
  onNextTask: () => void;
  isOwner: boolean;
  snapshot: RoomSnapshot;
  className?: string;
}

export function RoomResults({
  activeTaskTitle,
  average,
  cards,
  isRevealed,
  isFinalized,
  allPlayersVoted,
  anyPlayerVoted,
  onReveal,
  onFinalize,
  onNextTask,
  isOwner,
  snapshot,
  className,
}: RoomResultsProps) {
  const [finalValue, setFinalValue] = useState(average);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState(average);

  // Чтобы иметь доступ к snapshot внутри useEffect, нам нужно его передать.
  // Поскольку я не хочу переписывать RoomPage слишком сильно, я добавлю snapshot в пропсы.

  const hasActiveTask = Boolean(activeTaskTitle);

  const getClosestValidCard = (avgStr: string, deck: string[]) => {
    const avg = parseFloat(avgStr);
    if (isNaN(avg)) return deck[0];

    const numericCards = deck.filter((c) => !isNaN(parseFloat(c)));
    if (numericCards.length === 0) return deck[0];

    return numericCards.reduce((prev, curr) => {
      return Math.abs(parseFloat(curr) - avg) < Math.abs(parseFloat(prev) - avg) ? curr : prev;
    });
  };

  // Мы должны передать snapshot в компонент, чтобы использовать suggested_result
  // Но чтобы не менять пропсы слишком сильно, я использую решение с передачей
  // suggested_result отдельно или просто добавлю snapshot в пропсы.

  useEffect(() => {
    const displayValue = getClosestValidCard(average, cards);
    setFinalValue(displayValue);
  }, [average, cards]);

  return (
    <>
      <section
        className={cn(
          'relative flex flex-col rounded-3xl border border-border/50 bg-card/30 shadow-xl backdrop-blur-sm transition-all duration-500',
          className,
        )}
      >
      <div className="relative z-10 flex h-full min-h-0 flex-col p-4 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Активная задача
            </div>
            <div className="line-clamp-2 text-lg font-bold leading-tight text-foreground sm:text-2xl">
              {activeTaskTitle ?? 'Добавьте задачу для оценки'}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 rounded-2xl border border-border/50 bg-background/50 px-3 py-1.5 backdrop-blur-sm shadow-inner">
            <div className="text-[10px] font-medium uppercase tracking-tight text-muted-foreground">Среднее</div>
            <div className="text-lg font-black text-primary sm:text-xl">{average} <span className="text-xs font-medium opacity-60">SP</span></div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-2 sm:py-4">
          {isRevealed ? (
            <div className="flex w-full max-w-xs flex-col items-center gap-4 text-center">
              <div className="relative group shrink-0">
                <div className="absolute -inset-8 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
                <div className={cn(
                  'relative flex flex-col items-center justify-center rounded-full border-4 border-primary bg-card p-4 shadow-2xl w-32 h-32 sm:w-40 sm:h-40 transition-all',
                  'animate-reveal-pop',
                  isOwner && !isFinalized && 'cursor-pointer hover:scale-105 hover:border-primary/80 active:scale-95',
                )}
                onClick={() => {
                  if (isOwner && !isFinalized) {
                    setIsEditModalOpen(true);
                    setEditValue(finalValue);
                  }
                }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Итог</div>
                  <div className="text-4xl font-black text-foreground sm:text-5xl">{finalValue}</div>
                  <div className="text-[9px] font-medium text-muted-foreground mt-1">Story Points</div>
                  {!isFinalized && isOwner && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-bounce">
                      <CheckIcon className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>
              </div>

              {isFinalized ? (
                <Button
                  type="button"
                  onClick={onNextTask}
                  className="h-11 rounded-full px-8 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Следующая задача
                </Button>
              ) : isOwner ? (
                <Button
                  type="button"
                  onClick={() => onFinalize(finalValue)}
                  className="h-11 rounded-full px-8 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
                >
                  Подтвердить оценку
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="max-w-sm text-sm font-medium text-muted-foreground leading-relaxed">
                {allPlayersVoted
                  ? isOwner
                    ? 'Все участники проголосовали. Можно показывать результат.'
                    : 'Все участники проголосовали. Ожидайте вскрытия карт.'
                  : anyPlayerVoted
                    ? isOwner
                      ? 'Часть голосов уже есть. Можно вскрыть сейчас или подождать остальных.'
                      : 'Идут голосования. Ожидайте вскрытия карт.'
                    : hasActiveTask
                      ? 'Пока нет голосов. Выберите карту, чтобы начать раунд.'
                      : 'Пока нет активной задачи. Добавьте задачу и начните раунд.'}
              </div>
              {isOwner ? (
                <Button
                  type="button"
                  onClick={onReveal}
                  disabled={!hasActiveTask || (!allPlayersVoted && !anyPlayerVoted)}
                  className="h-12 rounded-full px-10 text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  Вскрыть карты
                </Button>
              ) : (
                <div className="text-xs font-medium text-muted-foreground/60 italic">
                  Только владелец может вскрыть карты
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
      <EditResultModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={(value) => {
          setFinalValue(value);
          setIsEditModalOpen(false);
        }}
        cards={cards}
        currentValue={finalValue}
      />
    </>
  );
}

// Вспомогательный компонент для выбора карты в модалке
function EditResultModal({
  isOpen,
  onClose,
  onConfirm,
  cards,
  currentValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  cards: string[];
  currentValue: string;
}) {
  const [selected, setSelected] = useState(currentValue);

  useEffect(() => {
    setSelected(currentValue);
  }, [currentValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать итоговую оценку"
      className="max-w-md"
    >
      <div className="flex flex-col gap-6">
        <div className="text-sm text-muted-foreground text-center mb-2">
          Выберите подходящее значение из колоды для финальной оценки задачи
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {cards.map((card) => (
            <button
              key={card}
              onClick={() => setSelected(card)}
              className={cn(
                'h-12 rounded-xl border-2 transition-all flex items-center justify-center font-bold text-sm',
                selected === card
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                  : 'border-border/50 bg-card text-foreground hover:border-primary/50 hover:bg-primary/5',
              )}
            >
              {card}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="rounded-full px-6">
            Отмена
          </Button>
          <Button
            onClick={() => onConfirm(selected)}
            className="rounded-full px-6 bg-primary text-primary-foreground"
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
