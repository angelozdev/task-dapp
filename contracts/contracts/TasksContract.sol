// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TasksContract {
    constructor() {
        createTask("My first task", "This is my first task");
    }

    uint public taskCount = 0;

    struct Task {
        uint256 id;
        string title;
        bool done;
        string description;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(uint256 id => Task) public tasks;

    event TaskCreated(uint id, string title, bool done, string description);
    event TaskCompleted(uint id, bool done);

    function createTask(string memory _title, string memory _description) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _title, false, _description, block.timestamp, block.timestamp);
        emit TaskCreated(taskCount, _title, false, _description);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        tasks[_id].updatedAt = block.timestamp;
        emit TaskCompleted(_id, _task.done);

    }

    function getTask(uint _id) public view returns (Task memory) {
        Task memory _task = tasks[_id];
        return _task;
    }

    function deleteTask(uint _id) public {
        delete tasks[_id];
    }

    function getTasks() public view returns (Task[] memory) {
        Task[] memory _tasks = new Task[](taskCount);
        for (uint i = 1; i <= taskCount; i++) {
            _tasks[i - 1] = tasks[i];
        }
        return _tasks;
    }
}