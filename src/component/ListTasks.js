  import React, { useEffect, useState } from 'react'
  import toast from 'react-hot-toast';
  import 'react-quill/dist/quill.snow.css'
  import 'react-quill/dist/quill.snow.css';
  import axios from 'axios';
  import styles from './ListTasks.module.css';
  import Section from './Section'

  const ListTasks = ({ boardTitle, tasks, setTasks, columns, setColumns, columnsOrder, setColumnsOrder, setRefresh }) => {
    const [taskGroups, setTaskGroups] = useState({});
    const username = localStorage.getItem('username'); ;

    useEffect(() => {

      const groupedTasks = columnsOrder.reduce((acc, columnId) => {
        acc[columnId] = tasks.filter(task => task.status === columnId);
        return acc;
      }, {});

      setTaskGroups(groupedTasks);

    }, [tasks, columnsOrder]);

    /** This function is used to remove tasks from the column and only works on Cancel */
    const handleRemove = async (taskId) => {
      try {
        const response = await axios.delete(`http://localhost:8081/api/tasks/${taskId}`);
        if (response.status === 200) {
          setRefresh(true)
          
          toast.success("Task removed");
        } else {
          toast.error("Failed to remove task");
        }
      } catch (error) {
        toast.error("An error occurred while removing the task");
        console.error('Error:', error);
      }
    };
    

    /** This function is used to update 1 task in 1 column (Move Task) */
    const addItemToSection = async (taskId, newStatus) => {
      const taskToMove = tasks.find(task => task.taskId === taskId);
      console.log('Task to move:', taskToMove);
      
      if (!taskToMove) return;
    
      const updatedTask = { ...taskToMove, status: newStatus };
      console.log('Updated task:', updatedTask);
    
      try {
        const response = await axios.put(`http://localhost:8081/api/tasks/${taskId}`, updatedTask);
        console.log('API response:', response);
        
        if (response.status === 200) {
          setRefresh(true);
          toast.success("Task moved successfully");
        } else {
          toast.error("Failed to move the task");
        }
      } catch (error) {
        toast.error("An error occurred while moving the task");
        console.error("Error moving task:", error);
      }
    };
    

    return (
      <div className={styles.container}>
        <div className={styles['columns-section']}>
          <div className={styles['columns-group']}>
            <h2 className={styles['columns-title']}>{boardTitle}</h2>
            <div className='flex gap-16'>
              {columnsOrder.map((columnId) => {
                const column = columns.find(c => c.id === columnId);
                if (!column) return null;
                return (
                  <Section
                    key={columnId}
                    status={columnId}
                    tasks={taskGroups[columnId] || []}
                    setTasks={setTasks}
                    title={column.name}
                    columns={columns}
                    setColumns={setColumns}
                    columnsOrder={columnsOrder}
                    setColumnsOrder={setColumnsOrder}
                    setRefresh={setRefresh}
                    addItemToSection={addItemToSection}
                    handleRemove={handleRemove}
                    username={username} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ListTasks;






