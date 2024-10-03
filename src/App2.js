import React, { useEffect, useState } from "react";
import ListTasks from "./component/ListTasks";
import './index.css';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from "axios";
import '../src/BgColor.css';
import { AppBar, Toolbar, TextField, InputAdornment, Box, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import debounce from './login/debounce';

const App2 = ({ onLogout }) => {
  
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [columns, setColumns] = useState([
    { id: "todo", name: "Todo" },
    { id: "inprogress", name: "In Progress" },
    { id: "done", name: "Done" },
    { id: "cancel", name: "Cancel" }
  ]);

  const [columnsOrder, setColumnsOrder] = useState(['todo', 'inprogress', 'done', 'cancel']);
  const [searchValue, setSearchValue] = useState('');
  
  const navigate = useNavigate();

  const currentUser = {
    username: localStorage.getItem('username')
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setRefresh(false);
      }
    };

    if (refresh) {
      fetchTasks();
    }

  }, [refresh]);

  const debouncedSearch = debounce((searchInput) => {
    setSearchValue(searchInput);
  }, 300); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout(); 
    navigate('/login'); 
  };

  const privateTasks = tasks.filter(task => {
    const matchesSearchValue = task.taskName.toLowerCase().includes(searchValue.toLowerCase()); 
    const isInPrivate = (!task.visibility && task.userUpdated === currentUser.username) || (task.visibility && task.userUpdated === currentUser.username)
    return isInPrivate && matchesSearchValue ;
});

const publicTasks = tasks.filter(task => {
    const isPublicTask = task.visibility === true; 
    const matchesSearchValue = task.taskName.toLowerCase().includes(searchValue.toLowerCase());
    return isPublicTask && matchesSearchValue;
});


  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <AppBar position="static" sx={{ background: '#e6e6fa', padding: '0 16px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => debouncedSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#00d5fa' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#2c3e50',
                fontWeight: 'bold',
                mr: 2,
                fontSize: '1.2rem',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
              }}
            >
              {localStorage.getItem('username')}
            </Typography>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: '#e056fd',
                backgroundColor: '#a29bfe',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transition: 'background-color 0.3s ease',
                },
              }}
            >
              <LogoutIcon sx={{ color: '#2c3e50', fontSize: '1.5rem' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <div className="containerApp2">
        <ListTasks
          boardTitle={"Private"}
          tasks={privateTasks}
          setTasks={setTasks}
          columns={columns}
          setColumns={setColumns}
          setRefresh={setRefresh}
          columnsOrder={columnsOrder}
          setColumnsOrder={setColumnsOrder}
        />
        <ListTasks
          boardTitle={"Public"}
          tasks={publicTasks}
          setTasks={setTasks}
          columns={columns}
          setColumns={setColumns}
          setRefresh={setRefresh}
          columnsOrder={columnsOrder}
          setColumnsOrder={setColumnsOrder}
        />
      </div>
    </DndProvider>
  );
};

export default App2;
