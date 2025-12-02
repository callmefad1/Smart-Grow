import { User, Users, DollarSign } from 'lucide-react';
import './cards.css';

function ActiveCard({ count }) {
    return <StatCard icon={User} label="Active" value={count} />;
}

function PaidCard({ count }) {
    return <StatCard icon={DollarSign} label="Paid" value={count} />;
}

function TotalFarmersCard({ count }) {
    return <StatCard icon={Users} label="Total Farmers" value={count} />;
}


function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="stat-card">
            {Icon && <Icon className="stat-icon" />}
            <div className="stat-content">
                <h3>{label}</h3>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );
}

export { ActiveCard, PaidCard, TotalFarmersCard };
