import { useCallback, useRef, useState } from "react";
import { Web3, Contract } from "web3";
import useSyncProviders from "./hooks/use-sync-providers";
import WalletDetails from "./components/wallet-details";
import AddTaskForm from "./components/add-task-form";
import { IContractTask, ITask } from "./typings/common";
import TasksList from "./components/tasks-list";

function App() {
  const [selectedWallet, setSelectedWallet] =
    useState<EIP6963ProviderDetail | null>(null);
  const [userAccount, setUserAccount] = useState<string>();
  const providers = useSyncProviders();
  const contractRef = useRef<Contract<IContractTask> | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);

  async function handleConnect(provider: EIP6963ProviderDetail) {
    try {
      await provider.provider.request({
        method: "eth_requestAccounts",
      });

      const accounts = (await provider.provider.request({
        method: "eth_accounts",
      })) as string[];

      const TasksContract = await import(
        "../contracts/build/contracts/TasksContract.json"
      );

      const web3Instance = new Web3(provider.provider);
      contractRef.current = new web3Instance.eth.Contract(
        TasksContract.abi,
        TasksContract.networks["5777"].address
      );

      setUserAccount(accounts[0]);
      setSelectedWallet(provider);
      fetchTasks();
    } catch (error) {
      console.error(error);
      setSelectedWallet(null);
      setUserAccount(undefined);
      setTasks([]);
    }
  }

  const fetchTasks = useCallback(async () => {
    if (!contractRef.current) return console.error("No contract found");

    try {
      const tasks = await contractRef.current.methods
        .getTasks()
        .call({ from: userAccount });

      setTasks(tasks as ITask[]);
    } catch (error) {
      console.error(error);
    }
  }, [userAccount]);

  if (!providers.length) {
    console.error("No wallet providers found");
    return (
      <div className="container mx-auto p-4">
        <h1>You must have a wallet installed</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="p-4 py-20">
        <div className="grid grid-cols-12 gap-5">
          <div className="flex col-span-12 sm:col-span-5 flex-col gap-4">
            <WalletDetails
              selectedWallet={selectedWallet}
              userAccount={userAccount}
              onConnect={handleConnect}
            />

            {!!userAccount && (
              <AddTaskForm
                userAccount={userAccount}
                contractRef={contractRef}
                onAddTask={fetchTasks}
              />
            )}
          </div>

          <div className="col-span-12 sm:col-span-7 sm:col-start-6 w-full">
            <TasksList
              tasks={tasks}
              contractRef={contractRef}
              userAccount={userAccount}
              onCompleted={setTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
