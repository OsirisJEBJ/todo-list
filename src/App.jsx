import './App.css';

function App() {

const todoList= [
  {id:1, tittle:"review resources"},
  {id:2, tittle:"take notes"},
  {id:3, tittle:"code out app"}
]

return(
<div>
  <h1>
    My Todos
  </h1>
  
  <ul>
    {todoList.map(todo => 
      <li key={todo.id}>{todo.tittle}</li>
    )}
  </ul>
</div>
)
}

export default App
