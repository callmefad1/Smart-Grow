// src/components/farmZones/FarmZones.jsx
import { useState, useEffect } from 'react';
import { database, auth } from '../../config/firebaseConfig';
import { ref, set, update, remove, onValue, off } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Leaf,
    MapPin,
    Maximize2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import './FarmZones.css';

const FarmZones = () => {
    const [zones, setZones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        area: '',
        cropType: '',
        description: '',
        soilType: ''
    });

    useEffect(() => {
        if (auth && auth.currentUser) {
            setCurrentUser(auth.currentUser);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const zonesRef = ref(database, `users/${currentUser.uid}/farmZones`);

        const handleDataChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const zonesList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setZones(zonesList);
            } else {
                setZones([]);
            }
            setLoading(false);
        };

        const handleError = (error) => {
            console.error('Database error:', error);
            setError('Failed to load farm zones');
            setLoading(false);
        };

        onValue(zonesRef, handleDataChange, handleError);

        return () => {
            off(zonesRef, 'value', handleDataChange);
        };
    }, [currentUser]);

    const handleOpenModal = (zone = null) => {
        if (zone) {
            setEditingId(zone.id);
            setFormData({
                name: zone.name,
                location: zone.location,
                area: zone.area,
                cropType: zone.cropType,
                description: zone.description,
                soilType: zone.soilType
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                location: '',
                area: '',
                cropType: '',
                description: '',
                soilType: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            if (editingId) {
                // Update existing zone
                const zoneRef = ref(database, `users/${currentUser.uid}/farmZones/${editingId}`);
                await update(zoneRef, formData);
            } else {
                // Create new zone
                const zoneId = Date.now().toString();
                const zoneRef = ref(database, `users/${currentUser.uid}/farmZones/${zoneId}`);
                await set(zoneRef, {
                    ...formData,
                    createdAt: new Date().toISOString()
                });
            }
            handleCloseModal();
            setError(null);
        } catch (err) {
            setError('Failed to save farm zone');
            console.error('Error:', err);
        }
    };

    const handleDelete = async (zoneId) => {
        if (!currentUser) return;
        if (!window.confirm('Are you sure you want to delete this farm zone?')) return;

        try {
            const zoneRef = ref(database, `users/${currentUser.uid}/farmZones/${zoneId}`);
            await remove(zoneRef);
            setError(null);
        } catch (err) {
            setError('Failed to delete farm zone');
            console.error('Error:', err);
        }
    };

    if (loading) {
        return (
            <div className="farm-zones-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw size={40} />
                </motion.div>
                <p>Loading farm zones...</p>
            </div>
        );
    }

    return (
        <div className="farm-zones-container">
            {/* Header */}
            <motion.header
                className="farmzones-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <div className="header-title">
                        <Leaf size={30} />
                        <div>
                            <h1>Farm Zones</h1>
                            <p className="header-subtitle">Manage your farm zones and crops</p>
                        </div>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => handleOpenModal()}
                    >
                        <Plus size={20} />
                        Add New Zone
                    </button>
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

            {/* Zones Grid */}
            {zones.length > 0 ? (
                <motion.div
                    className="zones-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    <AnimatePresence>
                        {zones.map((zone) => (
                            <motion.div
                                key={zone.id}
                                className="zone-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="zone-header">
                                    <h3>{zone.name}</h3>
                                    <div className="zone-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleOpenModal(zone)}
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(zone.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="zone-details">
                                    <div className="detail-item">
                                        <MapPin size={16} />
                                        <div>
                                            <p className="detail-label">Location</p>
                                            <p className="detail-value">{zone.location}</p>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <Maximize2 size={16} />
                                        <div>
                                            <p className="detail-label">Area</p>
                                            <p className="detail-value">{zone.area} hectares</p>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <Leaf size={16} />
                                        <div>
                                            <p className="detail-label">Crop Type</p>
                                            <p className="detail-value">{zone.cropType}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="zone-info">
                                    <div>
                                        <p className="info-label">Soil Type</p>
                                        <p className="info-value">{zone.soilType}</p>
                                    </div>
                                </div>

                                {zone.description && (
                                    <div className="zone-description">
                                        <p>{zone.description}</p>
                                    </div>
                                )}
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
                    <Leaf size={48} />
                    <h2>No Farm Zones Yet</h2>
                    <p>Create your first farm zone to get started</p>
                    <button
                        className="btn-primary"
                        onClick={() => handleOpenModal()}
                    >
                        <Plus size={20} />
                        Add Farm Zone
                    </button>
                </motion.div>
            )}

            {/* Modal */}
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
                                <h2>{editingId ? 'Edit Farm Zone' : 'Create New Farm Zone'}</h2>
                                <button
                                    className="modal-close"
                                    onClick={handleCloseModal}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="name">Zone Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., North Field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location">Location *</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Latitude, Longitude"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="area">Area (hectares) *</label>
                                        <input
                                            type="number"
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            required
                                            step="0.1"
                                            placeholder="0.5"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cropType">Crop Type *</label>
                                        <input
                                            type="text"
                                            id="cropType"
                                            name="cropType"
                                            value={formData.cropType}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Wheat"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="soilType">Soil Type *</label>
                                    <select
                                        id="soilType"
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select soil type</option>
                                        <option value="Clay">Clay</option>
                                        <option value="Sandy">Sandy</option>
                                        <option value="Loamy">Loamy</option>
                                        <option value="Silt">Silt</option>
                                        <option value="Peat">Peat</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Additional notes about this farm zone..."
                                        rows="4"
                                    ></textarea>
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
                                        {editingId ? 'Update Zone' : 'Create Zone'}
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

export default FarmZones;
