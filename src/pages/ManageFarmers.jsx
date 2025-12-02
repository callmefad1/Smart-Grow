import  { useState, useEffect } from 'react';
import { database } from "../config/firebaseConfig";
import { ref, onValue, remove, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {TotalFarmersCard, ActiveCard, PaidCard } from '../components/cards/Cards';
import SearchFilterBar from '../components/searchbar/SearchFilterBar';
import {DashboardButton, AddFarmerButton}  from '../components/buttons/Buttons';
import {
    Edit3,
    Trash2,
    RefreshCw,
    Database,
    AlertTriangle,
    User,
    MapPin,
    DollarSign,
    Ruler,
    Phone
} from 'lucide-react';
import '../styles/manageFarmers.css';

function ManageFarmers() {
    const navigate = useNavigate();
    const [farmerArray, setFarmerArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFarmers, setFilteredFarmers] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isRealTime, setIsRealTime] = useState(true);
    const [filterPayment, setFilterPayment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Real-time data listener
    useEffect(() => {
        if (!isRealTime) return;

        const dbRef = ref(database, "farmers/data");

        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const myData = snapshot.val();
                const temporaryArray = Object.keys(myData).map(myFireId => {
                    return {
                        ...myData[myFireId],
                        farmerId: myFireId
                    }
                });
                setFarmerArray(temporaryArray);
                setFilteredFarmers(temporaryArray);
            } else {
                setFarmerArray([]);
                setFilteredFarmers([]);
            }
        });

        return () => unsubscribe();
    }, [isRealTime]);

    // Manual data fetch
    const fetchData = async () => {
        setLoading(true);
        try {
            const dbRef = ref(database, "farmers/data");
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const myData = snapshot.val();
                const temporaryArray = Object.keys(myData).map(myFireId => {
                    return {
                        ...myData[myFireId],
                        farmerId: myFireId
                    }
                });
                setFarmerArray(temporaryArray);
                setFilteredFarmers(temporaryArray);
            } else {
                setFarmerArray([]);
                setFilteredFarmers([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching farmer data");
        } finally {
            setLoading(false);
        }
    }

    // Search and filter functionality
    useEffect(() => {
        let filtered = farmerArray.filter(farmer =>
            farmer.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.cropType?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterPayment !== 'all') {
            filtered = filtered.filter(farmer => farmer.paymentStatus === filterPayment);
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(farmer => farmer.status === filterStatus);
        }

        setFilteredFarmers(filtered);
    }, [searchTerm, farmerArray, filterPayment, filterStatus]);

    const deleteFarmer = async (farmerIdParam, userName) => {
        try {
            const dbRef = ref(database, "farmers/data/" + farmerIdParam);
            await remove(dbRef);
            setDeleteConfirm(null);
            alert(`"${userName}" farmer record deleted successfully!`);
        } catch (error) {
            console.error("Error deleting farmer:", error);
            alert("Error deleting farmer record");
        }
    }

    const confirmDelete = (farmerId, userName) => {
        setDeleteConfirm({ farmerId, userName });
    }

    const cancelDelete = () => {
        setDeleteConfirm(null);
    }

    const getPaymentColor = (status) => {
        const colors = {
            yes: '#10b981',
            no: '#ef4444',
            pending: '#f59e0b'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusColor = (status) => {
        const colors = {
            active: '#10b981',
            inactive: '#6b7280',
            suspended: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            className="update-read-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div
                className="update-read-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <div className="title-section">
                        <Edit3 className="header-icon" />
                        <div>
                            <h1>Manage Farmers</h1>
                            <p className="header-subtitle">Update or delete farmer records</p>
                        </div>
                        <span className="data-count">{filteredFarmers.length} farmers</span>
                    </div>

                    <div className="controls">
                        <div className="real-time-toggle">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={isRealTime}
                                    onChange={(e) => setIsRealTime(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                                Live Updates
                            </label>
                        </div>

                        {!isRealTime && (
                            <motion.button
                                className="refresh-button"
                                onClick={fetchData}
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RefreshCw className={loading ? 'spinning' : ''} />
                                {loading ? 'Loading...' : 'Refresh Data'}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Search and Filter Bar */}
            <SearchFilterBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterPayment={filterPayment}
                onFilterPaymentChange={setFilterPayment}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
            />

            {/* ---------------------CARDS : Stats Overview------------------ */}
            <motion.div
                className="stats-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <TotalFarmersCard count={farmerArray.length} />
                <PaidCard count={farmerArray.filter(farmer => farmer.paymentStatus === 'yes').length} />
                <ActiveCard count={farmerArray.filter(farmer => farmer.status === 'active').length} />
            </motion.div>

            {/* ---------------------Data Display------------------ */}
            <motion.div
                className="data-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredFarmers.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <Database size={64} />
                        <h3>No farmers found</h3>
                        <p>
                            {farmerArray.length === 0
                                ? "No farmer records available. Register some farmers to get started!"
                                : "No farmers match your search criteria."
                            }
                        </p>
                        {!isRealTime && (
                            <button onClick={fetchData} className="load-button">
                                Load Data
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="farmers-grid">
                        <AnimatePresence>
                            {filteredFarmers.map((farmer, index) => (
                                <motion.div
                                    key={farmer.farmerId}
                                    className="farmer-card"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <div className="farmer-header">
                                        <div className="farmer-title">
                                            <User className="farmer-icon" />
                                            <div>
                                                <h3 className="farmer-name">{farmer.userName}</h3>
                                                <p className="farm-name">{farmer.farmName}</p>
                                            </div>
                                        </div>
                                        <div className="status-badges">
                                            <div
                                                className="payment-badge"
                                                style={{ backgroundColor: getPaymentColor(farmer.paymentStatus) }}
                                            >
                                                <DollarSign size={12} />
                                                {farmer.paymentStatus === 'yes' ? 'Paid' :
                                                    farmer.paymentStatus === 'no' ? 'Not Paid' : 'Pending'}
                                            </div>
                                            <div
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(farmer.status) }}
                                            >
                                                {farmer.status?.charAt(0).toUpperCase() + farmer.status?.slice(1)}
                                            </div>
                                        </div>
                                    </div>


                                    {/* --------------------------- farmer card details -------------------------- */}
                                    <div className="farmer-details">
                                        <div className="detail-item">
                                            <Ruler size={14} />
                                            <span className="detail-value">{farmer.farmDimension || 'Not specified'}</span>
                                        </div>

                                        <div className="detail-item">
                                            <MapPin size={14} />
                                            <span className="detail-value">{farmer.location || 'Not specified'}</span>
                                        </div>

                                        {farmer.cropType && (
                                            <div className="detail-item">
                                                <span className="detail-label">Crop:</span>
                                                <span className="detail-value">{farmer.cropType}</span>
                                            </div>
                                        )}

                                        {farmer.contactNumber && (
                                            <div className="detail-item">
                                                <Phone size={14} />
                                                <span className="detail-value">{farmer.contactNumber}</span>
                                            </div>
                                        )}

                                        {farmer.experience && (
                                            <div className="detail-item">
                                                <span className="detail-label">Experience:</span>
                                                <span className="detail-value">{farmer.experience}</span>
                                            </div>
                                        )}
                                    </div>

                                    {farmer.notes && (
                                        <p className="farmer-notes">{farmer.notes}</p>
                                    )}

                                    <div className="farmer-actions">
                                        <motion.button
                                            className="action-button update"
                                            onClick={() => navigate(`/updatefarmer/${farmer.farmerId}`)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Edit3 size={14} />
                                            Edit
                                        </motion.button>

                                        <motion.button
                                            className="action-button delete"
                                            onClick={() => confirmDelete(farmer.farmerId, farmer.userName)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </motion.button>
                                    </div>

                                    <div className="farmer-meta">
                                        <span className="farmer-id">ID: {farmer.farmerId.substring(0, 8)}...</span>
                                        {farmer.registrationDate && (
                                            <span className="registration-date">
                        Registered: {new Date(farmer.registrationDate).toLocaleDateString()}
                      </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>

            {/* -------------------Navigation Buttons--------------------------*/ }
            <motion.div
                className="navigation-buttons"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <DashboardButton />
                <AddFarmerButton />
               

            </motion.div>



            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="delete-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="modal-header">
                                <AlertTriangle className="warning-icon" />
                                <h3>Delete Farmer Record</h3>
                            </div>

                            <div className="modal-content">
                                <p>Are you sure you want to delete the farmer record for <strong>"{deleteConfirm.userName}"</strong>?</p>
                                <p className="warning-text">This action cannot be undone and will permanently remove all data for this farmer.</p>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="cancel-button"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="confirm-delete-button"
                                    onClick={() => deleteFarmer(deleteConfirm.farmerId, deleteConfirm.userName)}
                                >
                                    <Trash2 size={16} />
                                    Delete Record
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Overlay */}
            {loading && (
                <motion.div
                    className="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <RefreshCw size={32} />
                    </motion.div>
                    <p>Loading farmer data...</p>
                </motion.div>
            )}
        </motion.div>
    );
}

export default ManageFarmers;