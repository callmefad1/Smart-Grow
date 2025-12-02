// src/components/Write.jsx
import  { useState } from 'react';
import { database } from "../config/firebaseConfig";
import { ref, set, push } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Save,
    UserPlus,
    Eye,
    Edit3,
    CheckCircle,
    AlertCircle,
    Home,
    User,
    MapPin,
    DollarSign,
    Ruler,
    Phone,
    Building
} from 'lucide-react';
import '../styles/NewFarmer.css';

function NewFarmer() {
    const navigate = useNavigate();

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
        notes: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const saveData = async (e) => {
        e.preventDefault();

        if (!farmerData.userName.trim() || !farmerData.farmName.trim()) {
            setError("Please fill in at least user name and farm name");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const newDocRef = push(ref(database, "farmers/data"));
            await set(newDocRef, {
                userName: farmerData.userName.trim(),
                farmName: farmerData.farmName.trim(),
                farmDimension: farmerData.farmDimension.trim(),
                cropType: farmerData.cropType.trim(),
                location: farmerData.location.trim(),
                paymentStatus: farmerData.paymentStatus,
                contactNumber: farmerData.contactNumber.trim(),
                email: farmerData.email.trim(),
                experience: farmerData.experience.trim(),
                irrigationType: farmerData.irrigationType.trim(),
                notes: farmerData.notes.trim(),
                registrationDate: new Date().toISOString(),
                status: "active"
            });

            setSuccess("Farmer record added successfully!");
            // Reset form
            setFarmerData({
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
                notes: ""
            });

        } catch (error) {
            console.error("Error saving data:", error);

            if (error.code === 'PERMISSION_DENIED') {
                setError("Permission denied: Please check your Firebase database rules to allow write operations.");
            } else {
                setError(`Error saving farmer record: ${error.message}`);
            }
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
        "Vegetables",
        "Fruits",
        "Grains",
        "Legumes",
        "Herbs",
        "Flowers",
        "Dairy",
        "Poultry",
        "Mixed Farming",
        "Other"
    ];

    const irrigationTypes = [
        "Drip Irrigation",
        "Sprinkler",
        "Flood Irrigation",
        "Rain-fed",
        "Manual Watering",
        "Other"
    ];

    const experienceLevels = [
        "Beginner (0-2 years)",
        "Intermediate (3-5 years)",
        "Experienced (6-10 years)",
        "Expert (10+ years)"
    ];

    return (
        <motion.div
            className="write-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div
                className="write-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <UserPlus className="header-icon" />
                    <div>
                        <h1>Register New Farmer</h1>
                        <p className="header-subtitle">Add a new farmer to the management system</p>
                    </div>
                </div>
            </motion.div>

            {/* Add Form */}
            <motion.form
                className="write-form"
                onSubmit={saveData}
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
                            <strong>Error Saving Data</strong>
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

                <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={farmerData.notes}
                        onChange={handleChange}
                        placeholder="Any additional information about the farmer or farm..."
                        rows="3"
                        disabled={loading}
                    />
                </div>

                <motion.button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !farmerData.userName.trim() || !farmerData.farmName.trim()}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                    <Save className={loading ? 'spinning' : ''} />
                    {loading ? 'Saving Farmer Record...' : 'Save Farmer Record'}
                </motion.button>
            </motion.form>

            {/* Quick Navigation */}
            <motion.div
                className="navigation-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h3>Farmer Management</h3>
                <div className="nav-buttons">
                    <motion.button
                        className="nav-button"
                        onClick={() => navigate("/updateread")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Edit3 size={16} />
                        Manage Farmers
                    </motion.button>

                    <motion.button
                        className="nav-button"
                        onClick={() => navigate("/read")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Eye size={16} />
                        View All Farmers
                    </motion.button>

                    <motion.button
                        className="nav-button"
                        onClick={() => navigate("/")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home size={16} />
                        Dashboard
                    </motion.button>
                </div>
            </motion.div>

           
        </motion.div>
    );
}

export default NewFarmer;