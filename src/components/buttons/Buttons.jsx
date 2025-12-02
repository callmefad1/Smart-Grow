import { motion } from 'framer-motion';
import {  Home, UserRoundPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './buttons.css';



function AddFarmerButton() {
    const navigate = useNavigate();

    return (
        <motion.button
            className="nav-button "
            onClick={() => navigate("/newfarmer")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <UserRoundPlus />
            Add Farmer
        </motion.button>
    );
}

function DashboardButton() {
    const navigate = useNavigate();

    return (
        <motion.button
            className="nav-button "
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Home />
            Dashboard
        </motion.button>
    );
}

export { AddFarmerButton, DashboardButton };
