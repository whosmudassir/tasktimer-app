export type Task = {
  id: string;
  room: TaskRoom;
  title: string;
  created_at: string; // ISO 8601 datetime string
  starts_at: string; // ISO 8601 datetime string
  starts_in: {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
  };
};

export type TaskRoom = {
  id: string;
};

// Room Interface
export interface Room {
  id: string;
  name: string;
}

// HorizontalScrollComponentProps Interface
export interface HorizontalScrollComponentProps {
  data: Room[];
  onPress: (item: Room) => void;
  selectedRoom: string;
}
