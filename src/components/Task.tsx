import { FC, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { MutateTask } from "../components";
import { deleteTask } from "../api/task";

import type { Task } from "../types";

const TaskComponent: FC<Props> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteTaskQ } = useMutation(deleteTask, {
    onSettled: () => queryClient.invalidateQueries("tasks"),
    onMutate: async (id) => {
      await queryClient.cancelQueries("tasks");
      const previousData = queryClient.getQueryData("tasks");
      queryClient.setQueryData(
        "tasks",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          return {
            ...oldData,
            data: oldData.data.map(
              (oldTask: Task) => Number(oldTask.id) !== Number(id)
            ),
          };
        }
      );
      return {
        previousData,
      };
    },
    onError: (_, __, context: { previousData: unknown } | undefined) => {
      queryClient.setQueryData("tasks", context?.previousData);
    },
  });

  const openModel = () => setIsOpen(true);
  const closeModel = () => setIsOpen(false);

  const onDeleteTask = () => {
    const confirmDeletion = confirm(
      "are you sure you want to delete this task"
    );

    if (!confirmDeletion) return;

    deleteTaskQ(task.id);
  };

  return (
    <>
      <div
        className={classnames(
          "w-96 flex justify-between items-center rounded-md bg-teal-400 h-24 mx-auto overflow-hidden",
          {
            "bg-teal-400/20 opacity-70": task.done,
          }
        )}
      >
        <div className="w-11/12 px-4 py-2">
          <h3
            className={classnames("font-normal text-xl italic", {
              "line-through": task.done,
            })}
          >
            {task.title}
          </h3>
          <span className="text-sm text-gray-800">
            {" "}
            The deadLine is{" "}
            {task.deadLine
              ? format(new Date(task.deadLine), "d MMMM  u")
              : "undefined"}
          </span>
        </div>
        <div className="flex flex-col justify-evenly h-full">
          <button
            className="px-1 text-white bg-blue-500 h-full"
            onClick={openModel}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="px-1 text-white bg-red-500 h-full"
            onClick={onDeleteTask}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <MutateTask task={task} isOpen={isOpen} closeModel={closeModel} />
    </>
  );
};

interface Props {
  task: Task;
}
export default TaskComponent;
