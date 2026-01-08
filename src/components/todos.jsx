import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // READ – get all todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/todos/`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
      setError("");
    } catch (err) {
      setError("Error loading todos: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE – add todo
  const addTodo = async () => {
    if (!title.trim()) {
      setError("Please enter a todo title");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/todos/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!res.ok) throw new Error("Failed to add todo");
      const data = await res.json();
      setTodos([...todos, data]);
      setTitle("");
      setError("");
    } catch (err) {
      setError("Error adding todo: " + err.message);
      console.error(err);
    }
  };

  // UPDATE – toggle completed
  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_BASE}/todos/update/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!res.ok) throw new Error("Failed to update todo");
      const data = await res.json();
      setTodos(todos.map(t => (t.id === id ? data : t)));
      setError("");
    } catch (err) {
      setError("Error updating todo: " + err.message);
      console.error(err);
    }
  };

  // DELETE – remove todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/todos/delete/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter(t => t.id !== id));
      setError("");
    } catch (err) {
      setError("Error deleting todo: " + err.message);
      console.error(err);
    }
  };

  // EDIT – edit existing todo
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) {
      setError("Please enter a todo title");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/todos/update/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editText }),
      });

      if (!res.ok) throw new Error("Failed to update todo");
      const data = await res.json();
      setTodos(todos.map(t => (t.id === id ? data : t)));
      setEditingId(null);
      setEditText("");
      setError("");
    } catch (err) {
      setError("Error updating todo: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="todos-container">
      <h2>📝 Todo App</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyPress={e => e.key === "Enter" && addTodo()}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button onClick={addTodo} className="btn btn-add">
          Add Todo
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className="empty-state">No todos yet. Add one above!</p>
      ) : (
        <ul className="todos-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="todo-checkbox"
              />
              {editingId === todo.id ? (
                <div className="edit-group">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="btn btn-save"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`todo-text ${
                      todo.completed ? "completed" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => startEdit(todo)}
                    className="btn btn-edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-delete"
                  >
                    ❌
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Todos;