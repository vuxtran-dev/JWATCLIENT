import Input from '@mui/joy/Input';
import ReactQuill from 'react-quill';
import Modal from 'react-modal';
import Task from './Task';
import { useDrop } from 'react-dnd';
import toast from 'react-hot-toast';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from './Section.module.css';

const Section = ({ status, tasks, setTasks, title, setRefresh, addItemToSection, handleRemove, username }) => {
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dateTimeFinish, setDateTimeFinish] = useState('');
  const [dateTimeStart, setDateTimeStart] = useState('');
  const [userUpdate, setUserUpdate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [visibility, setVisibility] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('todo');
  const [deadline, setDeadline] = useState(' ');
  const [userCreated, setUserCreated] = useState(' ')
  const [currentVisibility, setCurrentVisibility] = useState(true);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
    ],
  };


  /** This function is used Un-Take 1 task on column To Do */
  const handleUnTakeTask = async (taskId) => {
    try {
        
        const taskResponse = await axios.get(`http://localhost:8081/api/tasks/${taskId}`);
        const task = taskResponse.data;

        const userCreated = task.userCreated; 
        const userUpdate = task.userUpdate; 

        if (userCreated.username === userUpdate.username) {
            toast.error('Cannot un-take task because the creator and updater are the same.');
            return; 
        }

        const unTakeObject = {
            username: null,
        };

        const response = await axios.post(
            `http://localhost:8081/api/tasks/take/${taskId}`,
            unTakeObject,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            setRefresh(true);
            toast.success('Task un-taken successfully');
        } else {
            throw new Error('Failed to un-take task');
        }
        clearModal();
    } catch (error) {
        toast.error('Failed to un-take task');
        console.error('Error un-taking task:', error.response ? error.response.data : error.message || error);
    }
};
  

/** This function is used Take 1 task on column To Do */
const handleTakeTask = async (taskId) => {
  
  const task = tasks.find(t => t.taskId === taskId);
  if (task && task.isTaken) {
    toast.error('Task has already been taken.');
    return;
  }

  const takeObject = {
    username
  };

  try {
    const response = await axios.post(
      `http://localhost:8081/api/tasks/take/${taskId}`, takeObject,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.status === 200) {
      const updatedTask = response.data;
      console.log('Updated Task:', updatedTask);
      setRefresh(true);
      toast.success('Task taken and cloned to private board');
      clearModal();
    } else {
      throw new Error('Failed to assign user to task');
    }
  } catch (error) {
    toast.error('Failed to take task');
    console.error('Error assigning user to task:', error.message || error);
  }
};



/** This function has two features: Save the newly created Task and edit the task */
  const handleSaveTask = async () => {

    const existingTask = editingTaskId ? await axios.get(`http://localhost:8081/api/tasks/${editingTaskId}`) : null;

    const isTaskCanceled = existingTask && existingTask.data.status === 'cancel';
    if (isTaskCanceled) {
      toast.error("Cannot save task in Cancel column");
      return;
    }

    if (!dateTimeStart || !dateTimeFinish) {
      toast.error("You must set both start and finish time.");
      return;
    }

    const currentVisibility = existingTask ? existingTask.data.visibility : true;
    const taskObject = {
      taskName: newTask,
      description,
      priority,
      dateTimeFinish: new Date(dateTimeFinish).toISOString(),
      dateTimeStart: new Date(dateTimeStart).toISOString(),
      userUpdate: null,
      status: selectedStatus,
      userCreated: username,
      visibility: selectedStatus === 'todo' ? visibility : currentVisibility,
    };

    try {
      if (editingTaskId) {
        const response = await axios.put(`http://localhost:8081/api/tasks/${editingTaskId}`, taskObject);
        if (response.status === 200) {
          setRefresh(true);
          toast.success("Update task successfully");
        }
      } else {
        const response = await axios.post("http://localhost:8081/api/tasks", taskObject);
        if (response.status === 200) {
          setRefresh(true);
          toast.success("Added task successfully");
        }
      }
      clearModal();
    } catch (error) {
      toast.error("An error occurred while saving the task");
      console.error("Error", error);
    }
  };


  /** This function calculates Deadline time based on creation time and completion time */
  const calculateDeadline = (start, finish) => {
    const now = new Date(start);
    const finishDate = new Date(finish);

    if (finishDate < now) {
      return 'Past Deadline';
    }

    const diffTime = Math.max(finishDate - now, 0);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days} days ${hours} hours`;
  };

  useEffect(() => {
    if (dateTimeStart && dateTimeFinish) {
      setDeadline(calculateDeadline(dateTimeStart, dateTimeFinish));
    }
  }, [dateTimeStart, dateTimeFinish]);


  /** The handleEditTask function prepares all the information necessary for editing a task */
  const handleEditTask = (task) => {
    setEditingTaskId(task.taskId);
    setNewTask(task.taskName);
    setDescription(task.description);
    setPriority(task.priority);
    setDateTimeFinish(new Date(task.dateTimeFinish).toISOString().slice(0, 16));
    setDateTimeStart(new Date(task.dateTimeStart).toISOString().slice(0, 16));
    setUserUpdate(task.userUpdate || '');
    setSelectedStatus(task.status);
    setVisibility(task.visibility);
    setCurrentVisibility(task.visibility);
    setIsModalOpen(true);
    setUserCreated(task.userUpdate || '');
  };

  /** The clearModal function is used to reset all values ​​and states related to the modal, preparing it for the next use of the modal. */
  const clearModal = () => {
    setNewTask('');
    setDescription('');
    setPriority('medium');
    setDateTimeFinish('');
    setDateTimeStart('');
    setUserUpdate('');
    setEditingTaskId(null);
    setIsModalOpen(false);
    setSelectedStatus('todo');
    setUserCreated('')
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      addItemToSection(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={styles.section}>
      <div className="rounded-md p-2">
        <EditableHeaderInput text={title} count={tasks.length} />
        <div className={`${styles['task-container']} ${isOver ? styles['section-over'] : ''}`}>
          {tasks.map((task) => (
            <div key={task.taskId} onDoubleClick={() => handleEditTask(task)}>
              <Task
                key={task.taskId}
                task={task}
                setTasks={setTasks}
                isCancelColumn={status === 'cancel'}
                handleRemove={handleRemove}
                handleTakeTask={status === 'todo' && task.visibility === true && !task.isTaken ? () => handleTakeTask(task.taskId) : null}
                handleUnTakeTask={status === 'todo' && task.visibility === false ? () => handleUnTakeTask(task.taskId, task.userCreated, task.userUpdated) : null}
              />
            </div>
          ))}
        </div>
        {status === 'todo' && (
          <button
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Add Task
          </button>
        )}
        <Modal
          isOpen={isModalOpen}
          contentLabel={editingTaskId ? 'Edit Task' : 'Add Task'}
          ariaHideApp={false}
          className={styles['modal-content']}
          overlayClassName={styles['modal-overlay']}
        >
          <div className="flex text-center justify-center text-4xl mb-5 font-bold">
            <h2>{editingTaskId ? 'Edit Task' : 'Add Task'}</h2>
          </div>

          <hr className="border border-yellow-400"></hr>

          <div className="pt-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col space-y-3">
                <label className="text-2xl">Task Name</label>
                <Input
                  type="text"
                  placeholder="TaskName"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>

              <div className="flex space-x-6">
                <div className="flex flex-col space-y-1">
                  <label className="text-lg">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={dateTimeStart}
                    onChange={(e) => setDateTimeStart(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-lg">Finish Time</label>
                  <Input
                    type="datetime-local"
                    value={dateTimeFinish}
                    onChange={(e) => setDateTimeFinish(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-lg">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="bg-gray-200 rounded-md p-1 text-black w-full border border-black"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-10">
                <div>
                  <label className="text-lg">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(
                      e) => setSelectedStatus(e.target.value)}
                    className="bg-gray-200 rounded-md p-1 text-black w-full border border-black"
                  >
                    <option value="todo">Todo</option>
                    <option value="inprogress">InProgress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="text-lg">Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    readOnly
                    className="bg-gray-200 rounded-md p-1 text-black w-full border border-black text-center"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <label>{visibility ? 'Public' : 'Private'}</label>
                  <input
                    type="checkbox"
                    checked={visibility === true}
                    className='size-8 mx-auto'
                    onChange={(e) => {
                      if (status === 'todo') {
                        setVisibility(e.target.checked);
                      }
                    }}
                    disabled={status !== 'todo'}
                  />
                </div>
              </div>
              <div>
                <label className="text-xl">Description</label>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <div className='space-x-6'>
            <button
              className="bg-orange-400 px-3 py-1 rounded-lg"
              onClick={() => handleTakeTask(editingTaskId)}
            >
              TakeTask
            </button>
            <button
              className="bg-orange-400 px-3 py-1 rounded-lg"
              onClick={() => handleUnTakeTask(editingTaskId)}
            >
              Un-takeTask
            </button>
            </div>
            <div className='space-x-6'>
            <button className="bg-green-400 px-3 py-1 rounded-lg" onClick={handleSaveTask}>
              Save Task
            </button>
            <button className="bg-red-400 px-3 py-1 rounded-lg" onClick={clearModal}>
              Close
            </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const EditableHeaderInput = ({ text, count }) => {
  return (
    <div className="flex items-center h-12 pl-4 rounded-md uppercase text-black mr-4   ">
      <div className="flex justify-between items-center w-full cursor-pointer mb-6 font-bold italic ">
        <span>{text}</span>
        <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
          {count}
        </div>
      </div>
    </div>
  );
};

export default Section;
