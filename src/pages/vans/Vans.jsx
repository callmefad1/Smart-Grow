// src/components/vans/Vans.jsx
import { useState, useEffect } from 'react';
import { database, auth } from '../../config/firebaseConfig';
import { ref, set, update, remove, onValue, off } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Droplets,
    Power,
    Clock,
    Timer,
    Plus,
    Trash2,
    Save,
    X,
    AlertCircle,
    RefreshCw,
    Battery,
    Activity
} from 'lucide-react';
import './Vans.css';

const Vans = () => {
    const [vans, setVans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        capacity: '',
        status: 'inactive',
        scheduleTime: '',
        timerDuration: ''
    });
    const [requestData, setRequestData] = useState({
        vanType: '',
        quantity: '',
        reason: ''
    });

    useEffect(() => {
        if (auth && auth.currentUser) {
            setCurrentUser(auth.currentUser);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const vansRef = ref(database, `users/${currentUser.uid}/vans`);

        const handleDataChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const vansList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setVans(vansList);
            } else {
                setVans([]);
            }
            setLoading(false);
        };

        const handleError = (error) => {
            console.error('Database error:', error);
            setError('Failed to load vans');
            setLoading(false);
        };

        onValue(vansRef, handleDataChange, handleError);

        return () => {
            off(vansRef, 'value', handleDataChange);
        };
    }, [currentUser]);

    const handleToggleStatus = async (van) => {
        if (!currentUser) return;

        try {
            const vanRef = ref(database, `users/${currentUser.uid}/vans/${van.id}`);
            await update(vanRef, {
                status: van.status === 'active' ? 'inactive' : 'active',
                lastStatusChange: new Date().toISOString()
            });
            setError(null);
        } catch (err) {
            setError('Failed to update van status');
            console.error('Error:', err);
        }
    };

    const handleSetSchedule = async (van) => {
        if (!currentUser || !van.scheduleTime) return;

        try {
            const vanRef = ref(database, `users/${currentUser.uid}/vans/${van.id}`);
            await update(vanRef, {
                scheduledTime: van.scheduleTime,
                hasSchedule: true,
                scheduleSetAt: new Date().toISOString()
            });
            setError(null);
        } catch (err) {
            setError('Failed to set schedule');
            console.error('Error:', err);
        }
    };

    const handleSetTimer = async (van) => {
        if (!currentUser || !van.timerDuration) return;

        try {
            const vanRef = ref(database, `users/${currentUser.uid}/vans/${van.id}`);
            await update(vanRef, {
                timerDuration: parseInt(van.timerDuration),
                timerActive: true,
                timerStartedAt: new Date().toISOString()
            });
            setError(null);
        } catch (err) {
            setError('Failed to set timer');
            console.error('Error:', err);
        }
    };

    const handleOpenModal = (van = null) => {
        if (van) {
            setEditingId(van.id);
            setFormData({
                name: van.name,
                model: van.model,
                capacity: van.capacity,
                status: van.status,
                scheduleTime: van.scheduledTime || '',
                timerDuration: van.timerDuration || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                model: '',
                capacity: '',
                status: 'inactive',
                scheduleTime: '',
                timerDuration: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequestInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            if (editingId) {
                const vanRef = ref(database, `users/${currentUser.uid}/vans/${editingId}`);
                await update(vanRef, {
                    name: formData.name,
                    model: formData.model,
                    capacity: formData.capacity,
                    status: formData.status
                });
            } else {
                const vanId = Date.now().toString();
                const vanRef = ref(database, `users/${currentUser.uid}/vans/${vanId}`);
                await set(vanRef, {
                    ...formData,
                    createdAt: new Date().toISOString(),
                    waterUsed: 0,
                    lastStatusChange: new Date().toISOString()
                });
            }
            handleCloseModal();
            setError(null);
        } catch (err) {
            setError('Failed to save van');
            console.error('Error:', err);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            const requestId = Date.now().toString();
            const requestRef = ref(database, `users/${currentUser.uid}/vanRequests/${requestId}`);
            await set(requestRef, {
                ...requestData,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            setRequestData({
                vanType: '',
                quantity: '',
                reason: ''
            });
            setShowRequestModal(false);
            setError(null);
        } catch (err) {
            setError('Failed to submit request');
            console.error('Error:', err);
        }
    };

    const handleDelete = async (vanId) => {
        if (!currentUser) return;
        if (!window.confirm('Are you sure you want to delete this van?')) return;

        try {
            const vanRef = ref(database, `users/${currentUser.uid}/vans/${vanId}`);
            await remove(vanRef);
            setError(null);
        } catch (err) {
            setError('Failed to delete van');
            console.error('Error:', err);
        }
    };

    if (loading) {
        return (
            <div className="vans-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw size={40} />
                </motion.div>
                <p>Loading vans...</p>
            </div>
        );
    }

    return (
        <div className="vans-container">
            {/* Header */}
            <motion.header
                className="vans-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <div className="header-title">
                        <Droplets size={30} />
                        <div>
                            <h1>Water Vans</h1>
                            <p className="header-subtitle">Manage and control your water vans</p>
                        </div>
                    </div>
                    <div className="header-buttons">
                        <button
                            className="btn-primary"
                            onClick={() => handleOpenModal()}
                        >
                            <Plus size={20} />
                            Add Van
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => setShowRequestModal(true)}
                        >
                            <Plus size={20} />
                            Request New Van sensor
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Error Message */}
            {error && (
                <motion.div
                    className="error-alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>
                        <X size={18} />
                    </button>
                </motion.div>
            )}

            {/* Vans Grid */}
            {vans.length > 0 ? (
                <motion.div
                    className="vans-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    <AnimatePresence>
                        {vans.map((van) => (
                            <motion.div
                                key={van.id}
                                className="van-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="van-header">
                                    <div>
                                        <h3>{van.name}</h3>
                                        <p className="van-model">{van.model}</p>
                                    </div>
                                    <div className={`status-badge ${van.status}`}>
                                        <Activity size={16} />
                                        {van.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="van-info">
                                    <div className="info-item">
                                        <Droplets size={18} />
                                        <div>
                                            <p className="info-label">Capacity</p>
                                            <p className="info-value">{van.capacity} L</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Battery size={18} />
                                        <div>
                                            <p className="info-label">Battery</p>
                                            <p className="info-value">{van.batteryLevel || 100}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="van-controls">
                                    <div className="control-group">
                                        <button
                                            className={`btn-control btn-status ${van.status === 'active' ? 'active' : 'inactive'}`}
                                            onClick={() => handleToggleStatus(van)}
                                            title={van.status === 'active' ? 'Deactivate' : 'Activate'}
                                        >
                                            <Power size={18} />
                                            <span>{van.status === 'active' ? 'Active' : 'Inactive'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="van-schedule">
                                    <div className="schedule-item">
                                        <Clock size={18} />
                                        <div className="schedule-input">
                                            <label htmlFor={`schedule-${van.id}`}>Schedule Time</label>
                                            <input
                                                type="time"
                                                id={`schedule-${van.id}`}
                                                value={van.scheduledTime || ''}
                                                onChange={(e) => {
                                                    const updated = { ...van, scheduleTime: e.target.value };
                                                    handleSetSchedule(updated);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="schedule-item">
                                        <Timer size={18} />
                                        <div className="schedule-input">
                                            <label htmlFor={`timer-${van.id}`}>Timer (minutes)</label>
                                            <input
                                                type="number"
                                                id={`timer-${van.id}`}
                                                min="1"
                                                max="1440"
                                                value={van.timerDuration || ''}
                                                onChange={(e) => {
                                                    const updated = { ...van, timerDuration: e.target.value };
                                                    handleSetTimer(updated);
                                                }}
                                                placeholder="e.g., 30"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="van-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleOpenModal(van)}
                                        title="Edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(van.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Droplets size={48} />
                    <h2>No Water Vans Yet</h2>
                    <p>Add your first water van to get started</p>
                    <button
                        className="btn-primary"
                        onClick={() => handleOpenModal()}
                    >
                        <Plus size={20} />
                        Add Water Van
                    </button>
                </motion.div>
            )}

            {/* Add/Edit Van Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>{editingId ? 'Edit Water Van' : 'Add New Water Van'}</h2>
                                <button
                                    className="modal-close"
                                    onClick={handleCloseModal}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="name">Van Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Van 01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="model">Model *</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Tanker X2000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="capacity">Capacity (Liters) *</label>
                                    <input
                                        type="number"
                                        id="capacity"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                        step="100"
                                        placeholder="e.g., 5000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status *</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        <Save size={18} />
                                        {editingId ? 'Update Van' : 'Add Van'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Request Van Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRequestModal(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Request New Water Van sensor</h2>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowRequestModal(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="vanType">Van Type *</label>
                                    <select
                                        id="vanType"
                                        name="vanType"
                                        value={requestData.vanType}
                                        onChange={handleRequestInputChange}
                                        required
                                    >
                                        <option value="">Select van type</option>
                                        <option value="small">Small (2000-3000L)</option>
                                        <option value="medium">Medium (5000-7000L)</option>
                                        <option value="large">Large (10000+L)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity *</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={requestData.quantity}
                                        onChange={handleRequestInputChange}
                                        required
                                        min="1"
                                        placeholder="e.g., 1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reason">Reason/Notes *</label>
                                    <textarea
                                        id="reason"
                                        name="reason"
                                        value={requestData.reason}
                                        onChange={handleRequestInputChange}
                                        required
                                        placeholder="Tell us why you need this van..."
                                        rows="4"
                                    ></textarea>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowRequestModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        <Plus size={18} />
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vans;
