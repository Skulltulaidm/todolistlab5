import { useState } from 'react';
import { supabase } from '../supabase';
import { Box, TextField, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function AddTodo({ onAdd }) {
    const [task, setTask] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.trim()) return;

        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('todos')
                .insert([{ task }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                onAdd(data[0]);
                setTask('');
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Añadir nueva tarea..."
                    disabled={loading}
                    size="small"
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<AddIcon />}
                >
                    {loading ? 'Añadiendo...' : 'Añadir'}
                </Button>
            </Box>
        </Box>
    );
}