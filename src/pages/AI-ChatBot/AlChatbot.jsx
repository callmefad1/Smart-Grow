import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    IconButton,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Send,
    Mic,
    MicOff,
    AttachFile,
    PhotoCamera,
    SmartToy,
    Close,
    Refresh,
    VolumeUp,
    Agriculture,
    Lightbulb,
    PestControl,
    WaterDrop
} from '@mui/icons-material';
import './aiChatbot.css';

const FarmingChatbot = ({ darkMode = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'text',
            content: 'Hello Farmer! I\'m your FarmSmart Assistant. How can I help you today? You can ask about crops, pests, weather impact, or upload images for analysis.',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [voiceResponse, setVoiceResponse] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingIntervalRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/d3407d7b-921c-41d6-8e7d-3ad8c39a4952';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                handleAudioSend(audioBlob);
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            setError('Microphone access denied. Please allow microphone permissions.');
            console.error('Recording error:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTextSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            type: 'text',
            content: inputText.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);
        setError('');

        try {
            const payload = {
                messageTypes: ['text'],
                textMessage: inputText.trim()
            };

            const result = await axios.post(N8N_WEBHOOK_URL, payload);
            const botResponse = extractFinalResponse(result.data);

            const botMessage = {
                id: Date.now() + 1,
                type: 'text',
                content: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            setError('Error: ' + (err.response?.data?.message || err.message));
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAudioSend = async (audioBlob) => {
        const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });

        const userMessage = {
            id: Date.now(),
            type: 'audio',
            content: URL.createObjectURL(audioBlob),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError('');

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Audio = e.target.result;

                const payload = {
                    messageTypes: ['audio'],
                    voiceFile: base64Audio
                };

                const result = await axios.post(N8N_WEBHOOK_URL, payload);
                const botResponse = extractFinalResponse(result.data);

                const botMessage = {
                    id: Date.now() + 1,
                    type: 'text',
                    content: botResponse,
                    sender: 'bot',
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botMessage]);
            };
            reader.readAsDataURL(audioFile);
        } catch (err) {
            setError('Error processing audio: ' + (err.response?.data?.message || err.message));
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSend = async (file) => {
        if (!file) return;

        const userMessage = {
            id: Date.now(),
            type: 'image',
            content: URL.createObjectURL(file),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError('');

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result;

                const payload = {
                    messageTypes: ['image'],
                    imageFile: base64Image,
                    researchPrompt: "Analyze this farming image",
                    researchDepth: "detailed",
                    researchFocus: "auto"
                };

                const result = await axios.post(N8N_WEBHOOK_URL, payload);
                const botResponse = extractFinalResponse(result.data);

                const botMessage = {
                    id: Date.now() + 1,
                    type: 'text',
                    content: botResponse,
                    sender: 'bot',
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botMessage]);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError('Error processing image: ' + (err.response?.data?.message || err.message));
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'audio') {
            if (!file.type.startsWith('audio/')) {
                setError('Please select a valid audio file');
                return;
            }
            handleAudioSend(file);
        } else if (type === 'image') {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            handleImageSend(file);
        }

        e.target.value = '';
    };

    const extractFinalResponse = (data) => {
        if (!data) return 'No response received';

        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return parseN8NResponse(parsed);
            } catch {
                return data;
            }
        }

        return parseN8NResponse(data);
    };

    const parseN8NResponse = (responseData) => {
        if (responseData.output) {
            return responseData.output;
        }

        if (responseData.data && responseData.data.output) {
            return responseData.data.output;
        }

        if (Array.isArray(responseData)) {
            const lastItem = responseData[responseData.length - 1];
            if (lastItem && lastItem.json && lastItem.json.output) {
                return lastItem.json.output;
            }
        }

        return JSON.stringify(responseData, null, 2);
    };

    const clearChat = () => {
        setMessages([{
            id: 1,
            type: 'text',
            content: 'Hello Farmer! I\'m your FarmSmart Assistant. How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        }]);
        setError('');
    };

    const quickQuestions = [
        { text: 'Best crops for this season?', icon: '🌱' },
        { text: 'Pest identification help', icon: '🐛' },
        { text: 'Watering schedule advice', icon: '💧' },
        { text: 'Fertilizer recommendations', icon: '🧪' },
        { text: 'Weather impact on crops', icon: '🌤️' },
        { text: 'Market price trends', icon: '📈' }
    ];

    const handleQuickQuestion = (question) => {
        setInputText(question);
    };

    const formatMessageContent = (content) => {
        if (typeof content !== 'string') return content;

        try {
            const parsed = JSON.parse(content);
            return typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : content;
        } catch {
            return content;
        }
    };

    return (
        <div className={`ai-chatbot ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="ai-chatbot-card">
                {/* Header */}
                <div className="ai-chatbot-header">
                    <div className="ai-chatbot-header-left">
                        <Avatar className="ai-chatbot-avatar">
                            <SmartToy />
                        </Avatar>
                        <div>
                            <Typography variant="h6" className="ai-chatbot-title">
                                FarmSmart AI Assistant
                            </Typography>
                            <Typography variant="caption" className="ai-chatbot-caption">
                                24/7 Farming Expert
                            </Typography>
                        </div>
                    </div>
                    <div className="ai-chatbot-header-right">
                        <IconButton
                            size="small"
                            onClick={clearChat}
                            className="ai-chatbot-refresh-btn"
                        >
                            <Refresh />
                        </IconButton>
                        <Chip
                            label="Online"
                            size="small"
                            className="ai-chatbot-status"
                        />
                    </div>
                </div>

                {/* Quick Questions */}
                <div className="ai-chatbot-quick-questions">
                    <Typography variant="caption" className="ai-chatbot-quick-title">
                        💡 Quick Questions
                    </Typography>
                    <div className="ai-chatbot-quick-list">
                        {quickQuestions.map((q, i) => (
                            <Chip
                                key={i}
                                label={`${q.icon} ${q.text}`}
                                size="small"
                                onClick={() => handleQuickQuestion(q.text)}
                                className="ai-chatbot-quick-chip"
                            />
                        ))}
                    </div>
                </div>

                {/* Messages Container */}
                <div className="ai-chatbot-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`ai-chatbot-message-row ${message.sender === 'user' ? 'user' : 'bot'}`}
                        >
                            <Avatar className={`ai-chatbot-message-avatar ${message.sender}`}>
                                {message.sender === 'user' ? '👨‍🌾' : <SmartToy />}
                            </Avatar>
                            <div className="ai-chatbot-message-content">
                                <div className={`ai-chatbot-message-bubble ${message.sender}`}>
                                    {message.type === 'text' && (
                                        <Typography variant="body2" className="ai-chatbot-message-text">
                                            {formatMessageContent(message.content)}
                                        </Typography>
                                    )}
                                    {message.type === 'audio' && (
                                        <audio
                                            controls
                                            src={message.content}
                                            className="ai-chatbot-message-audio"
                                        />
                                    )}
                                    {message.type === 'image' && (
                                        <img
                                            src={message.content}
                                            alt="Uploaded"
                                            className="ai-chatbot-message-image"
                                        />
                                    )}
                                </div>
                                <Typography
                                    variant="caption"
                                    className="ai-chatbot-message-time"
                                >
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="ai-chatbot-message-row bot">
                            <Avatar className="ai-chatbot-message-avatar bot">
                                <SmartToy />
                            </Avatar>
                            <div className="ai-chatbot-message-content">
                                <div className="ai-chatbot-message-bubble bot">
                                    <div className="ai-chatbot-typing">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Error Display */}
                {error && (
                    <div className="ai-chatbot-error">
                        <Typography variant="body2" color="error" className="ai-chatbot-error-text">
                            ⚠️ {error}
                        </Typography>
                    </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                    <div className="ai-chatbot-recording">
                        <div className="ai-chatbot-recording-indicator"></div>
                        <Typography variant="body2" className="ai-chatbot-recording-text">
                            Recording... {formatTime(recordingTime)}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={stopRecording}
                            className="ai-chatbot-recording-stop"
                        >
                            Stop
                        </Button>
                    </div>
                )}

                {/* Input Area */}
                <div className="ai-chatbot-input-area">
                    <form onSubmit={handleTextSend} className="ai-chatbot-input-form">
                        <IconButton
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading || isRecording}
                            className="ai-chatbot-input-btn image"
                        >
                            <PhotoCamera />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => audioInputRef.current?.click()}
                            disabled={loading || isRecording}
                            className="ai-chatbot-input-btn audio"
                        >
                            <AttachFile />
                        </IconButton>
                        <TextField
                            fullWidth
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask about crops, pests, weather..."
                            disabled={loading || isRecording}
                            size="small"
                            className="ai-chatbot-input-text"
                            InputProps={{ className: 'ai-chatbot-input-text-inner' }}
                        />
                        <IconButton
                            size="small"
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={loading}
                            className={`ai-chatbot-input-btn mic${isRecording ? ' recording' : ''}`}
                        >
                            {isRecording ? <MicOff /> : <Mic />}
                        </IconButton>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || !inputText.trim() || isRecording}
                            className="ai-chatbot-input-send"
                        >
                            <Send />
                        </Button>
                    </form>
                    <Typography variant="caption" className="ai-chatbot-tip">
                        💡 Tip: You can type, speak, or upload images
                    </Typography>
                    {/* Hidden File Inputs */}
                    <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        style={{ display: 'none' }}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'image')}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FarmingChatbot;