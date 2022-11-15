export interface Task {
  title: string;
  done: boolean;
  createdAt: string;
  deadLine: string | undefined;
  id: number | string;
}
