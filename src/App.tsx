import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Task as TaskComponent, MutateTask } from "./components";

import type { Task } from "./types";
import type { AxiosError } from "axios";

const getTasks = () => axios.get<Task[]>("http://localhost:4000/tasks");

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError, error, isFetching } = useQuery(
    "tasks",
    getTasks
  );

  const openModel = () => setIsOpen(true);
  const closeModel = () => setIsOpen(false);

  if (isLoading || isFetching) {
    return <h2 className="text-center text-xl">data is loading ...</h2>;
  }

  if (isError) {
    const err = error as AxiosError;
    console.log(err);
    return (
      <h2 className="text-xl text-center text-red-500"> {err.message} </h2>
    );
  }

  return (
    <section className="mx-auto container space-y-2">
      <div className="py-6 text-center">
        <button
          className="bloc mx-auto py-4 px-2 bg-teal-800 text-white font-semibold cursor-pointer rounded hover:scale-110 hover:bg-teal-600 transition ease-in-out duration-300"
          onClick={openModel}
        >
          Add Task
        </button>
        <MutateTask isOpen={isOpen} closeModel={closeModel} />
      </div>
      {data?.data.map((task) => (
        <TaskComponent key={task.id} task={task} />
      ))}
    </section>
  );
}

export default App;
