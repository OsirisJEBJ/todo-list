import './App.css';
import TodosPage from './features/Todos/TodosPage';
import Header from './shared/Header'; 
import Logon from './features/Logon';
import { useAuth } from './reducers/contexts/AuthProvider.jsx';

function App() {
  const { isAuthenticated } = useAuth();  

return(
  <div>
      <Header />

      {isAuthenticated ? (
        <TodosPage />
      ) : (
        <Logon />
      )}
    </div>
)
}

export default App
