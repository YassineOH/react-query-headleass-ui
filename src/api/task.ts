import axios from "axios";
import type { Task } from "../types";

export const getAllTasks = () =>
  axios.get<Task[]>("http://localhost:4000/tasks");

export const addTask = ({ title, done, deadLine, createdAt }: Task) =>
  axios.post<Task>("http://localhost:4000/tasks", {
    title,
    done,
    deadLine,
    createdAt,
  });

export const updateTask = ({ title, done, deadLine, createdAt, id }: Task) =>
  axios.patch<Task>(`http://localhost:4000/tasks/${id}`, {
    title,
    done,
    deadLine,
    createdAt,
  });

export const deleteTask = (id: string | number) =>
  axios.delete(`http://localhost:4000/tasks/${id}`);
