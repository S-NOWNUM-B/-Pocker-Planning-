/**
 * Форма присоединения к комнате по ID.
 *
 * Поле ввода ID комнаты → переход на /room/:roomId.
 * Используется когда участник получает ссылку или код приглашения.
 *
 * В будущей реализации:
 *  - Валидация формата ID комнаты
 *  - Проверка существования комнаты через roomApi.getRoom()
 *  - Обработка ошибок (комната не найдена, уже завершена)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@/shared/ui';

export function JoinRoomForm() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Room ID"
        placeholder="Enter room ID..."
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Button type="submit" disabled={!roomId.trim()}>
        Join Room
      </Button>
    </form>
  );
}
