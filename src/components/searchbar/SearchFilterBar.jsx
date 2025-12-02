import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import './searchbar.css';

function SearchFilterBar({ 
    searchTerm, 
    onSearchChange, 
    filterPayment, 
    onFilterPaymentChange, 
    filterStatus, 
    onFilterStatusChange 
}) {
    return (
        <motion.div
            className="search-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="search-container">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder="Search farmers by name, farm, location, or crop..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-group">
                <div className="filter-container">
                    <Filter className="filter-icon" />
                    <select
                        value={filterPayment}
                        onChange={(e) => onFilterPaymentChange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Payments</option>
                        <option value="yes">Paid</option>
                        <option value="no">Not Paid</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="filter-container">
                    <Filter className="filter-icon" />
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterStatusChange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
}

export default SearchFilterBar;
