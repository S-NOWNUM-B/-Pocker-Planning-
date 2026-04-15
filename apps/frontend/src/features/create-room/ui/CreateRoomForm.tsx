/**
 * Форма создания комнаты через API.
 *
 * Использует TanStack Query (useMutation) для вызова roomApi.createRoom().
 * После успешного создания:
 *  - Инвалидирует кэш ['rooms'] для обновления списка комнат
 *  - Перенаправляет на /room/:id
 *
 * Используется на странице /create-room как альтернатива CreateRoomPage
 * (когда backend будет готов).
 */
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@/shared/ui';
import { roomApi } from '@/entities/room';

export function CreateRoomForm() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: () => roomApi.createRoom(name),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      navigate(`/room/${room.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createMutation.mutate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Room Name"
        placeholder="Enter room name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={createMutation.isPending}
      />
      <Button type="submit" disabled={createMutation.isPending || !name.trim()}>
        {createMutation.isPending ? 'Creating...' : 'Create Room'}
      </Button>
    </form>
  );
}
