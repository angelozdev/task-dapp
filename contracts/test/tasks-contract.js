const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {
  it("Should be able to deploy the contract", async () => {
    const tasksContract = await TasksContract.deployed();
    assert.notEqual(tasksContract.address, undefined);
    assert.notEqual(tasksContract.address, null);
    assert.notEqual(tasksContract.address, "");
    assert.notEqual(tasksContract.address, "0x0");
  });

  it("Should create a new taks once deployed", async () => {
    const tasksContract = await TasksContract.deployed();
    const tasksCount = await tasksContract.taskCount();
    const firstTask = await tasksContract.tasks(tasksCount);

    assert.equal(tasksCount, 1);
    assert.equal(firstTask.id.toNumber(), 1);
    assert.equal(firstTask.title, "My first task");
    assert.equal(firstTask.description, "This is my first task");
    assert.equal(firstTask.done, false);
  });

  it("Should be able to add a task", async () => {
    const tasksContract = await TasksContract.deployed();

    assert.equal(await tasksContract.taskCount(), 1);

    await tasksContract.createTask("A new task", "Description of the new task");
    const index = await tasksContract.taskCount();
    const newTask = await tasksContract.tasks(index);

    assert.equal(await tasksContract.taskCount(), 2);
    assert.equal(newTask.id.toNumber(), index);
    assert.equal(newTask.title, "A new task");
    assert.equal(newTask.description, "Description of the new task");
    assert.equal(newTask.done, false);
  });

  it("Should be able to toggle task completion", async () => {
    const tasksContract = await TasksContract.deployed();
    const index = await tasksContract.taskCount();
    await tasksContract.toggleCompleted(index);
    const task = await tasksContract.tasks(index);
    assert.equal(task.done, true);
  });

  it("should emit the correct event when a new task is created", async () => {
    const tasksContract = await TasksContract.deployed();
    const tx = await tasksContract.createTask(
      "Another task",
      "Another task description"
    );
    const taskCreatedEvent = tx.logs[0];
    assert.equal(taskCreatedEvent.event, "TaskCreated");
    const taskData = taskCreatedEvent.args;
    assert.equal(taskData.id.toNumber(), 3);
    assert.equal(taskData.title, "Another task");
    assert.equal(taskData.description, "Another task description");
    assert.equal(taskData.done, false);
  });

  it("should emit the correct event when a task is toggled", async () => {
    const tasksContract = await TasksContract.deployed();
    const tx = await tasksContract.toggleCompleted(1);
    const taskToggledEvent = tx.logs[0];
    assert.equal(taskToggledEvent.event, "TaskCompleted");
    const taskData = taskToggledEvent.args;
    assert.equal(taskData.id.toNumber(), 1);
    assert.equal(taskData.done, true);
  });
});
