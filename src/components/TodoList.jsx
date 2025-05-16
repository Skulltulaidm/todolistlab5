import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const { data, error } = await supabase
                    .from('todos')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setTodos(data || []);
            } catch (error) {
                setError('Error cargando las tareas');
                console.error('Error fetching todos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();

        const subscription = supabase
            .channel('table-db-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'todos'
            }, (payload) => {
                console.log('Change received!', payload);
                fetchTodos();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleAddTodo = (newTodo) => {
        setTodos([newTodo, ...todos]);
    };

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleUpdateTodo = (updatedTodo) => {
        setTodos(todos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        ));
    };

    if (loading) {
        return <div className="text-center p-4">Cargando tareas...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>

            <AddTodo onAdd={handleAddTodo} />

            <div className="todos-container">
                {todos.length === 0 ? (
                    <p className="text-center text-gray-500">No hay tareas pendientes.</p>
                ) : (
                    todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onDelete={handleDeleteTodo}
                            onUpdate={handleUpdateTodo}
                        />
                    ))
                )}
            </div>
        </div>
    );
}