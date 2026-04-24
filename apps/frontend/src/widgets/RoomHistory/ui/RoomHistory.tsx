/**
 * Модальное окно с историей голосований комнаты.
 *
 * Показывает таблицу с результатами всех завершённых раундов:
 *  - Название задачи
 *  - Финальная оценка
 *  - Среднее значение
 *  - Количество голосов
 *  - Консенсус (да/нет)
 *  - Дата
 *
 * @param history — массив элементов истории
 * @param isOpen — открыто ли модальное окно
 * @param onClose — обработчик закрытия
 */
import { Modal, Badge } from '@/shared/ui';
import type { RoomHistoryItem } from '@/entities/room/model/types';

interface RoomHistoryProps {
  history: RoomHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function RoomHistory({ history, isOpen, onClose }: RoomHistoryProps) {
  if (history.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="История голосований"
        className="max-w-[min(96vw,72rem)]"
      >
        <div className="py-8 text-center text-muted-foreground">
          История голосований пуста. Завершите хотя бы один раунд, чтобы увидеть результаты.
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="История голосований"
      className="max-w-[min(96vw,72rem)]"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-semibold">Задача</th>
              <th className="px-3 py-2 text-center font-semibold">Оценка</th>
              <th className="px-3 py-2 text-center font-semibold">Среднее</th>
              <th className="px-3 py-2 text-center font-semibold">Голосов</th>
              <th className="px-3 py-2 text-center font-semibold">Консенсус</th>
              <th className="px-3 py-2 text-right font-semibold">Дата</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-3 py-2.5 text-left">{item.task_title}</td>
                <td className="px-3 py-2.5 text-center">
                  <Badge label={`${item.result_value} SP`} color="primary" shape="rounded" />
                </td>
                <td className="px-3 py-2.5 text-center text-muted-foreground">
                  {item.average_score !== null ? item.average_score.toFixed(1) : '—'}
                </td>
                <td className="px-3 py-2.5 text-center text-muted-foreground">{item.votes_count}</td>
                <td className="px-3 py-2.5 text-center">
                  {item.consensus ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
