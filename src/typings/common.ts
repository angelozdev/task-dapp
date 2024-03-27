import type TasksContract from "../../contracts/build/contracts/TasksContract.json";

export type ITask = {
  title: string;
  description: string;
  done: boolean;
  id: number;
};

export type IContractTask = typeof TasksContract.abi;
