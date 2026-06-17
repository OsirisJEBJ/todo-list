import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </>
  );
}

export default App;

