import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
} from '@mui/material';
import './CodeBlockPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const CodeBlockPage = () => {
    const codeBlockId = useParams().id;
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [codeBlock, setCodeBlock] = useState(null);
    const [studentsCount, setStudentsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize the socket connection
         const socket = io(API_URL);
         socketRef.current = socket;

        // Join the room
        socket.on('connect', () => {
            socket.emit('join-room', codeBlockId);
        });

        socket.on('assign-role', (assignedRole) => {
        setRole(assignedRole);
    });

    socket.on('code-update', (updatedCode) => {
        setCode(updatedCode);
    });

    socket.on('students-count', (count) => {
        setStudentsCount(count);
    });

    // Redirect students if the mentor leaves the room
    socket.on('mentor-left', () => {
        if (role === 'student') {
            alert('The mentor has left the session.');
            navigate('/');
        }
    });


        const fetchCodeBlock = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/codeblocks/${codeBlockId}`);
                setCodeBlock(response.data);
            } catch (error) {
                console.error('Failed to fetch the code block:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCodeBlock();

        return () => {
        socket.emit('leave-room', codeBlockId);
        socket.disconnect();
        socketRef.current = null;
    };   

       
    }, [codeBlockId]);

    useEffect(() => {
        if (role === 'student') {
            socketRef.current.on('mentor-left', () => {
                alert('The mentor has left the session.');
                navigate('/');
            });
        }
    }, [role]);

    const fetchCodeBlocks = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/codeblocks/${codeBlockId}`);
            setCodeBlock(response.data);
            setCode(response.data.initialCode);
        } catch (error) {
            console.error('Failed to fetch code blocks:', error);
        }
    };

    useEffect(() => {
        fetchCodeBlocks();
    }, [codeBlockId, role, navigate]);

    const handleCodeChange = (editor, data, newCode) => {
        setCode(newCode);
        socketRef.current.emit('code-update', newCode);
    };

    const handleCheck = () => {
        if (!codeBlock?.solution) {
            alert('Solution not available!');
            return;
        }

        // Trim and normalize the code and solution for logical comparison
        const normalizedCode = code.trim().replace(/\s+/g, ' ');
        const normalizedSolution = codeBlock.solution.trim().replace(/\s+/g, ' ');

        if (normalizedCode === normalizedSolution) {
            alert('✅ Correct solution! Great job! 😊');
        } else {
            alert('❌ Incorrect solution. Try again.');
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom className='title'>
                Code Block {codeBlock?.title}
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="body1">
                    Role: <strong>{role || 'Loading...'}</strong>
                </Typography>
                <Typography variant="body1">
                    Students in the room: <strong>{studentsCount}</strong>
                </Typography>
            </Paper>
            {codeBlock?.description && (
                <Typography variant="h6" gutterBottom className='description'>
                    {codeBlock.description}
                </Typography>
            )}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                    <CodeMirror
                        value={code}
                        options={{
                            mode: 'javascript',
                            theme: 'material',
                            lineNumbers: true,
                            readOnly: role === 'mentor',
                        }}
                        onBeforeChange={(editor, data, value) => {
                            handleCodeChange(editor, data, value);
                        }}
                    />
                </Paper>
            )}
            {role === 'student' && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheck}
                    sx={{ mt: 3 }}
                >
                    Check Code
                </Button>
            )}
        </Box>
    );
};

export default CodeBlockPage;
