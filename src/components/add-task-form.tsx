import { FormEvent } from "react";
import { Button, Card } from "./ui";
import { Contract } from "web3";
import { IContractTask } from "../typings/common";

interface Props {
  userAccount: string;
  contractRef: React.MutableRefObject<Contract<IContractTask> | null>;
  onAddTask?: () => void;
}

function AddTaskForm({ contractRef, userAccount, onAddTask }: Readonly<Props>) {
  const addTaskHandler = async (event: FormEvent) => {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
      return console.warn("Empty fields", title, description);
    }

    if (!contractRef.current) return console.error("No contract found");
    if (!userAccount) return console.error("No user account found");

    try {
      await contractRef.current.methods
        .createTask(title, description)
        .send({ from: userAccount });

      formElement.reset();
      onAddTask?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card title="Save a task">
      <form onSubmit={addTaskHandler}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="task" className="text-sm">
              Title
            </label>
            <input
              type="text"
              id="task"
              name="title"
              className="p-2 border border-gray-200 rounded-lg dark:bg-gray-800"
              placeholder="Task title"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="p-2 border border-gray-200 rounded-lg dark:bg-gray-800"
              placeholder="Task description"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

export default AddTaskForm;
