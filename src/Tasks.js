import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { destroyTask, updateTask, createTask } from './store';

const Tasks = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { tasks } = useSelector((state) => state);
  const [name, setName] = useState('');
  const [complete, setComplete] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  let filtered = tasks;

  if (pathname === '/tasks/filter/easy') {
    filtered = filtered.filter((task) => task.difficulty === 'EASY');
  } else if (pathname === '/tasks/filter/medium') {
    filtered = filtered.filter((task) => task.difficulty === 'MEDIUM');
  } else if (pathname === '/tasks/filter/difficult') {
    filtered = filtered.filter((task) => task.difficulty === 'DIFFICULT');
  }

  useEffect(() => {
    const task = tasks.find((task) => task.id === id);
    setName(task ? task.name : '');
    setComplete(task ? task.complete : false);
  }, [tasks, id]);

  const save = (ev) => {
    ev.preventDefault();
    if (id) {
      const task = { id, name, complete };
      dispatch(updateTask(task, navigate));
    } else {
      const task = { name, complete };
      dispatch(createTask(task, navigate));
    }
  };

  const destroy = () => {
    dispatch(destroyTask({ id }, navigate));
  };
  const location = useLocation();
  console.log(location);
  return (
    <div>
      <nav>
        <Link to={'/tasks/filter/easy'}>Easy</Link>
        <Link to={'/tasks/filter/medium'}>Medium</Link>
        <Link to={'/tasks/filter/difficult'}>Difficult</Link>
      </nav>
      <ul>
        {filtered.map((task) => {
          return (
            <li key={task.id} className={task.complete ? 'complete' : ''}>
              <Link to={`/tasks/${task.id}`}>{task.name}</Link>
            </li>
          );
        })}
      </ul>
      <form onSubmit={save}>
        <input
          type="checkbox"
          checked={complete}
          onChange={(ev) => setComplete(ev.target.checked)}
        />
        <input value={name} onChange={(ev) => setName(ev.target.value)} />
        <button disabled={!name}>Save</button>
      </form>
      {id ? <button onClick={destroy}>x</button> : null}

      {/* <div>{id ? <p>{task.description}</p> : null}</div> */}
    </div>
  );
};

export default Tasks;
