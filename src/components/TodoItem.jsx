import { useState } from 'react';
import { supabase } from '../supabase';
import {
    Checkbox,
    TextField,
    Button,
    ListItem,
    IconButton,
    ListItemText,
    Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function TodoItem({ todo, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState(todo.task);
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('todos')
                .update({ is_completed: !todo.is_completed })
                .eq('id', todo.id)
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                onUpdate(data[0]);
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', todo.id);

            if (error) throw error;

            onDelete(todo.id);
        } catch (error) {
            console.error('Error deleting todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async () => {
        if (!task.trim()) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('todos')
                .update({ task })
                .eq('id', todo.id)
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                onUpdate(data[0]);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ListItem
            secondaryAction={
                !isEditing && (
                    <Box>
                        <IconButton
                            edge="end"
                            disabled={loading}
                            onClick={() => setIsEditing(true)}
                            size="small"
                            sx={{ mr: 1 }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            edge="end"
                            disabled={loading}
                            onClick={handleDelete}
                            size="small"
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )
            }
            sx={{
                borderBottom: '1px solid #e0e0e0',
                py: 1,
            }}
        >
            <Checkbox
                checked={todo.is_completed}
                onChange={handleComplete}
                disabled={loading}
            />

            {isEditing ? (
                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', gap: 1 }}>
                    <TextField
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        disabled={loading}
                        size="small"
                        fullWidth
                    />
                    <Button
                        onClick={handleUpdateTask}
                        disabled={loading}
                        variant="contained"
                        size="small"
                    >
                        Guardar
                    </Button>
                    <Button
                        onClick={() => {
                            setIsEditing(false);
                            setTask(todo.task);
                        }}
                        disabled={loading}
                        variant="outlined"
                        size="small"
                    >
                        Cancelar
                    </Button>
                </Box>
            ) : (
                <ListItemText
                    primary={todo.task}
                    sx={{
                        textDecoration: todo.is_completed ? 'line-through' : 'none',
                        color: todo.is_completed ? 'text.secondary' : 'text.primary',
                    }}
                />
            )}
        </ListItem>
    );
}