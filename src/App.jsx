import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import TodoList from './components/TodoList';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {}
            <Container maxWidth="md">
                <TodoList />
            </Container>
        </ThemeProvider>
    );
}

export default App;