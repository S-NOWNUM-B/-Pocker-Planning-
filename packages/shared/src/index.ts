export type VoteValue =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '13'
  | '14'
  | '16'
  | '18'
  | '20'
  | '21'
  | '34'
  | '55'
  | '89'
  | '?'
  | 'coffee';

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
