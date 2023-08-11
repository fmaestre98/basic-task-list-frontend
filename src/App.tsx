import React from 'react';
import logo from './logo.svg';
import './App.css';
import './TaskList/TaskList';
import { TaskList } from './TaskList/TaskList';

function App() {
  return (
    <div className="App">
     <TaskList/>    
    </div>
  );
}

export default App;
