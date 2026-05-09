import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Container,
    CircularProgress,
    Box,
} from '@mui/material';
import './LobbyPage.css';

const LobbyPage = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';


    useEffect(() => {
        const fetchCodeBlocks = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/codeblocks`);
                setCodeBlocks(response.data);
            } catch (error) {
                console.error('Failed to fetch code blocks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCodeBlocks();
    }, []);

    const handleCodeBlockClick = (id) => {
        navigate(`/code-block/${id}`);
    };

    return (
        <Container maxWidth="sm" className='main-container'>
            <Typography variant="h4" gutterBottom align="center" className='title'>
                Choose Code Block
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {codeBlocks.map((codeBlock) => (
                        <ListItem key={codeBlock.id} disablePadding className='list-item'>
                            <ListItemButton onClick={() => handleCodeBlockClick(codeBlock._id)}>
                                <ListItemText
                                    primary={codeBlock.title}
                                    className='list-item-text'
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default LobbyPage;
