import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDrag } from 'react-dnd';
import { MdOutlineUpdate } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";



const Task = ({ task, isCancelColumn, handleRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.taskId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });


  /**The formatDate function is used to format a date string into an easy-to-read date string. */
  const formatDate = (dateString) => {
    if (!Date.parse(dateString)) {
      return "No date available";
    }
    const date = new Date(dateString);
    if (isNaN(date.getDay())) {
      return "Invalid date";
    }
    return `${date.toLocaleDateString()}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'text-yellow-400';
      case 'Medium':
        return 'text-sky-300';
      case 'High':
        return 'text-red-500';
    }
  };

  console.log('Task Priority:', task.priority);


  return (
    <div
      ref={isCancelColumn ? undefined : drag}
      className={`relative p-4 mb-4 shadow-md rounded-md space-y-2 bg-stone-400 text-zinc-700 ${isDragging ? 'opacity-25' : 'opacity-100'} cursor-${isCancelColumn ? 'default' : 'grab'}`}
    >
      <p className='font-bold'>{task.taskName}</p>
      <div className='flex'>
        <MdOutlineUpdate className='size-5 text-blue-700' />
        <p className='text-sm text-zinc-700'>{formatDate(task.createdAt)}</p>
      </div>
      <p className='text-sm text-zinc-700 italic'>
        <strong>Visibility: </strong>
        {task.visibility ? 'Public' : 'Private'}
      </p>
      <p className='text-sm italic'>
        <strong>Priority: </strong>
        <span className={`text-sm italic ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </p>
      {isCancelColumn && (
        <button className="absolute top-2 right-2 text-red-500" onClick={() => handleRemove(task.taskId)}>
          <RemoveCircleIcon />
        </button>
      )}
      <div className='flex items-end justify-end space-x-3'>
        <FaUserCheck
          style={{
            color: 'yellow',
            fontSize: '1.6rem',
            cursor: 'pointer'
          }}
          title={`Created By: ${task.userCreated}`}
        />

        {task.userUpdated && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserEdit
              style={{
                color: 'green',
                fontSize: '1.6rem',
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
              title={`Updated By: ${task.userUpdated}`}
            />
          </div>
        )}
      </div>
    </div>

  );
};



export default Task;
