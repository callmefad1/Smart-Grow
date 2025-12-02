// src/components/UpdateWrite.jsx
import { useState, useEffect } from 'react';
import { database } from "../config/firebaseConfig";
import { ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Save,
    ArrowLeft,
    Edit3,
    
    RefreshCw,
    CheckCircle,
    AlertCircle,
    User,
    MapPin,
    DollarSign,
    Ruler,
    Phone,
    Building
} from 'lucide-react';
import '../styles/UpdateFarmer.css';

function UpdateFarmer() {
    const navigate = useNavigate();
    const { firebaseId } = useParams();

    const [farmerData, setFarmerData] = useState({
        userName: "",
        farmName: "",
        farmDimension: "",
        cropType: "",
        location: "",
        paymentStatus: "no",
        contactNumber: "",
        email: "",
        experience: "",
        irrigationType: "",
        notes: "",
        status: "active"
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setFetching(true);
            try {
                const dbRef = ref(database, "farmers/data/" + firebaseId);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const targetObject = snapshot.val();
                    setFarmerData({
                        userName: targetObject.userName || "",
                        farmName: targetObject.farmName || "",
                        farmDimension: targetObject.farmDimension || "",
                        cropType: targetObject.cropType || "",
                        location: targetObject.location || "",
                        paymentStatus: targetObject.paymentStatus || "no",
                        contactNumber: targetObject.contactNumber || "",
                        email: targetObject.email || "",
                        experience: targetObject.experience || "",
                        irrigationType: targetObject.irrigationType || "",
                        notes: targetObject.notes || "",
                        status: targetObject.status || "active"
                    });
                } else {
                    setError("Farmer record not found");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error loading farmer data");
            } finally {
                setFetching(false);
            }
        }
        fetchData();
    }, [firebaseId]);

    const overwriteData = async (e) => {
        e.preventDefault();

        if (!farmerData.userName.trim() || !farmerData.farmName.trim()) {
            setError("Please fill in at least user name and farm name");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const farmerRef = ref(database, "farmers/data/" + firebaseId);
            await set(farmerRef, {
                ...farmerData,
                userName: farmerData.userName.trim(),
                farmName: farmerData.farmName.trim(),
                farmDimension: farmerData.farmDimension.trim(),
                cropType: farmerData.cropType.trim(),
                location: farmerData.location.trim(),
                contactNumber: farmerData.contactNumber.trim(),
                email: farmerData.email.trim(),
                experience: farmerData.experience.trim(),
                irrigationType: farmerData.irrigationType.trim(),
                notes: farmerData.notes.trim(),
                updatedAt: new Date().toISOString()
            });

            setSuccess("Farmer record updated successfully!");
            setTimeout(() => {
                navigate("/managefarmers");
            }, 1500);

        } catch (error) {
            console.error("Error updating data:", error);
            setError(`Error updating farmer record: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFarmerData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    }

    const cropTypes = [
        "Vegetables", "Fruits", "Grains", "Legumes", "Herbs", "Flowers",
        "Dairy", "Poultry", "Mixed Farming", "Other"
    ];

    const irrigationTypes = [
        "Drip Irrigation", "Sprinkler", "Flood Irrigation", "Rain-fed", "Manual Watering", "Other"
    ];

    const experienceLevels = [
        "Beginner (0-2 years)",
        "Intermediate (3-5 years)",
        "Experienced (6-10 years)",
        "Expert (10+ years)"
    ];

    const statusTypes = ["active", "inactive", "suspended"];

    if (fetching) {
        return (
            <div className="update-write-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw size={40} />
                </motion.div>
                <p>Loading farmer data...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="update-write-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div
                className="update-write-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.button
                    className="back-button"
                    onClick={() => navigate("/updateread")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft />
                    Back to Farmer Management
                </motion.button>

                <div className="header-content">
                    <Edit3 className="header-icon" />
                    <div>
                        <h1>Update Farmer Record</h1>
                        <p className="header-subtitle">Edit farmer information and details</p>
                        <p className="farmer-id">Record ID: {firebaseId}</p>
                    </div>
                </div>
            </motion.div>

            {/* Update Form */}
            <motion.form
                className="update-write-form"
                onSubmit={overwriteData}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {error && (
                    <motion.div
                        className="error-message"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <AlertCircle size={18} />
                        <div className="error-content">
                            <strong>Error Updating Data</strong>
                            <p>{error}</p>
                        </div>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        className="success-message"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <CheckCircle size={18} />
                        {success}
                    </motion.div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="userName">
                            <User size={16} />
                            Farmer Name *
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={farmerData.userName}
                            onChange={handleChange}
                            placeholder="Enter farmer's full name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="farmName">
                            <Building size={16} />
                            Farm Name *
                        </label>
                        <input
                            type="text"
                            id="farmName"
                            name="farmName"
                            value={farmerData.farmName}
                            onChange={handleChange}
                            placeholder="Enter farm name"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="contactNumber">
                            <Phone size={16} />
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={farmerData.contactNumber}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={farmerData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="farmDimension">
                            <Ruler size={16} />
                            Farm Dimension
                        </label>
                        <input
                            type="text"
                            id="farmDimension"
                            name="farmDimension"
                            value={farmerData.farmDimension}
                            onChange={handleChange}
                            placeholder="e.g., 5 acres, 2 hectares"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cropType">Main Crop Type</label>
                        <select
                            id="cropType"
                            name="cropType"
                            value={farmerData.cropType}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select crop type</option>
                            {cropTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="location">
                            <MapPin size={16} />
                            Farm Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={farmerData.location}
                            onChange={handleChange}
                            placeholder="Enter farm location/address"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="experience">Farming Experience</label>
                        <select
                            id="experience"
                            name="experience"
                            value={farmerData.experience}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select experience level</option>
                            {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="irrigationType">Irrigation Type</label>
                        <select
                            id="irrigationType"
                            name="irrigationType"
                            value={farmerData.irrigationType}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select irrigation type</option>
                            {irrigationTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="paymentStatus">
                            <DollarSign size={16} />
                            Payment Status
                        </label>
                        <select
                            id="paymentStatus"
                            name="paymentStatus"
                            value={farmerData.paymentStatus}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="no">Not Paid</option>
                            <option value="yes">Paid</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="status">Account Status</label>
                        <select
                            id="status"
                            name="status"
                            value={farmerData.status}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {statusTypes.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={farmerData.notes}
                        onChange={handleChange}
                        placeholder="Update any additional information about the farmer..."
                        rows="3"
                        disabled={loading}
                    />
                </div>

                <div className="form-actions">
                    <motion.button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !farmerData.userName.trim() || !farmerData.farmName.trim()}
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                        <Save className={loading ? 'spinning' : ''} />
                        {loading ? 'Updating...' : 'Update Farmer Record'}
                    </motion.button>

                    <motion.button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/managefarmers")}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cancel
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
}

export default UpdateFarmer;