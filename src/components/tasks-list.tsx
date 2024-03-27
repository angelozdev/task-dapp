import { Contract } from "web3";
import { IContractTask, ITask } from "../typings/common";
import { cn } from "../utils";
import { Button, Card } from "./ui";

interface Props {
  tasks: ITask[];
  onCompleted: (tasks: ITask[]) => void;
  contractRef: React.MutableRefObject<Contract<IContractTask> | null>;
  userAccount?: string;
}

function TasksList({
  onCompleted,
  tasks,
  contractRef,
  userAccount,
}: Readonly<Props>) {
  const markTaskAsDone = async (id: number) => {
    if (!contractRef.current) return console.error("No contract found");

    try {
      await contractRef.current.methods
        .toggleCompleted(id)
        .send({ from: userAccount });

      const newTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, done: !task.done };
        }
        return task;
      });

      onCompleted(newTasks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card title="List" className="h-full">
      <ul>
        {tasks.length > 0 ? (
          tasks.map(({ description, done, id, title }) => (
            <li
              className="flex justify-between items-center py-4 border-b border-gray-200"
              key={id}
            >
              <div>
                <h6
                  className={cn(
                    "text-lg",
                    done ? "line-through text-gray-500" : "text-black"
                  )}
                >
                  {title}
                </h6>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
              <div>
                <Button
                  onClick={() => markTaskAsDone(id)}
                  color={done ? "success" : "primary"}
                >
                  {done ? "Done" : "Mark as done"}
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="py-4 border-b border-gray-200">
            <p className="text-center text-gray-500">No tasks found</p>
          </li>
        )}
      </ul>
    </Card>
  );
}

export default TasksList;
