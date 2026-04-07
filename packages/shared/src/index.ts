export type VoteValue = '0' | '1/2' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '?' | 'coffee';

export type RoomStatus = 'waiting' | 'voting' | 'revealed';

export interface Participant {
  id: string;
  name: string;
  hasVoted: boolean;
}

export interface RoomState {
  id: string;
  name: string;
  status: RoomStatus;
  participants: Participant[];
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}
