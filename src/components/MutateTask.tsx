import { FC, FormEvent, Fragment, useId, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Dialog, Transition, Switch } from "@headlessui/react";

import { addTask, updateTask } from "../api/task";

import type { Task } from "../types";
import classNames from "classnames";

const MutateTask: FC<Props> = ({ isOpen, closeModel, task }) => {
  const id = useId();
  const queryClient = useQueryClient();
  const initialData: Task = {
    id,
    title: "",
    done: false,
    createdAt: "",
    deadLine: "",
  };

  const { mutate: addTaskQ } = useMutation(addTask, {
    onSettled: () => queryClient.invalidateQueries("tasks"),
    onMutate: async (task) => {
      await queryClient.cancelQueries("tasks");
      const previousData = queryClient.getQueryData("tasks");
      queryClient.setQueryData(
        "tasks",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          return {
            ...oldData,
            data: [...oldData.data, task],
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
  const { mutate: updateTaskQ } = useMutation(updateTask, {
    onSettled: () => queryClient.invalidateQueries("tasks"),
    onMutate: async (task) => {
      await queryClient.cancelQueries("tasks");
      const previousData = queryClient.getQueryData("tasks");
      queryClient.setQueryData(
        "tasks",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          return {
            ...oldData,
            data: [...oldData.data, task],
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

  const [newTask, setNewTask] = useState<Task>(task || initialData);

  const canSubmit = !!newTask.title;

  const handleSubmit = (e: FormEvent) => {
    if (task) {
      updateTaskQ(newTask);
      e.preventDefault();
      closeModel();
      return;
    }

    addTaskQ({
      ...newTask,
      createdAt: new Date().toISOString(),
      deadLine: newTask.deadLine
        ? new Date(newTask.deadLine).toISOString()
        : undefined,
    });
    e.preventDefault();
    closeModel();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={closeModel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-slate-800/50 h-screen w-screen absolute top-0 right-0 flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-1000"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white shadow-md p-6 rounded-lg w-96 space-y-4">
                <Dialog.Title className="text-lg font-semibold text-teal-800 my-">
                  {task ? "Edit Task" : "Add Task"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col items-start">
                    <label className="mb-2" htmlFor="title">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="border-2 border-teal-500 w-full focus:outline-none rounded-sm p-2"
                      id="title"
                      value={newTask.title}
                      onChange={(e: FormEvent) =>
                        setNewTask({
                          ...newTask,
                          title: (e.target as HTMLInputElement).value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="mb-2" htmlFor="title">
                      Deadline{" "}
                    </label>
                    <input
                      type="date"
                      name="deadLine"
                      className="border-2 border-teal-500 w-full focus:outline-none rounded-sm p-2"
                      id="deadLine"
                      value={
                        newTask.deadLine && newTask.deadLine.substring(0, 10)
                      }
                      onChange={(e: FormEvent) =>
                        setNewTask({
                          ...newTask,
                          deadLine: (e.target as HTMLInputElement).value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="mb-2" htmlFor="title">
                      Mark as done
                    </label>
                    <input
                      type="checkbox"
                      name="done"
                      className="sr-only"
                      id="done"
                      checked={newTask.done}
                      onChange={() =>
                        setNewTask({ ...newTask, done: !newTask.done })
                      }
                    />
                    <Switch
                      checked={newTask.done}
                      // as={Fragment}
                      className={classNames(
                        "relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75",
                        {
                          "bg-teal-900": newTask.done,
                          "bg-teal-700": !newTask.done,
                        }
                      )}
                      onChange={() =>
                        setNewTask({ ...newTask, done: !newTask.done })
                      }
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          newTask.done
                            ? "translate-x-9  bg-white "
                            : "translate-x-0 bg-gray-500/70"
                        }
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <div className="flex gap-x-4">
                    <input
                      type="submit"
                      className="bg-teal-200 text-teal-800 cursor-pointer px-4 py-2 rounded-lg font-semibold disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                      disabled={!canSubmit}
                      value={task ? "edit" : "add"}
                    />
                    <button
                      type="button"
                      className="text-red-600 cursor-pointer bg-red-200 px-4 py-2 rounded-lg font-semibold"
                      onClick={closeModel}
                    >
                      close
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

interface Props {
  isOpen: boolean;
  closeModel: () => void;
  task?: Task;
}

export default MutateTask;
