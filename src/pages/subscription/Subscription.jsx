// src/components/subscription/Subscription.jsx
import { useState, useEffect } from 'react';
import { database, auth } from '../../config/firebaseConfig';
import { ref, onValue, off, set, update } from 'firebase/database';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Check,
    X,
    Lock,
    MessageCircle,
    Zap,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import PaymentForm from '../../components/features/paymentForm/PaymentForm';
import './Subscription.css';

const Subscription = () => {
    const [currentPlan, setCurrentPlan] = useState('basic');
    const [userSubscription, setUserSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        if (auth && auth.currentUser) {
            setCurrentUser(auth.currentUser);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const subscriptionRef = ref(database, `users/${currentUser.uid}/subscription`);

        const handleDataChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUserSubscription(data);
                setCurrentPlan(data.plan || 'basic');
            } else {
                setCurrentPlan('basic');
                setUserSubscription(null);
            }
            setLoading(false);
        };

        const handleError = (error) => {
            console.error('Database error:', error);
            setError('Failed to load subscription info');
            setLoading(false);
        };

        onValue(subscriptionRef, handleDataChange, handleError);

        return () => {
            off(subscriptionRef, 'value', handleDataChange);
        };
    }, [currentUser]);

    // Fetch subscription plans from Firebase
    useEffect(() => {
        const fetchPlans = () => {
            try {
                const plansRef = ref(database, 'subscriptions');
                const unsubscribe = onValue(
                    plansRef,
                    (snapshot) => {
                        if (snapshot.exists()) {
                            const plansData = snapshot.val();
                            let plansArray = [];
                            if (Array.isArray(plansData)) {
                                plansArray = plansData.filter(Boolean); // filter out nulls if any
                            } else if (plansData && typeof plansData === 'object') {
                                plansArray = Object.entries(plansData).map(([key, plan]) => ({
                                    ...plan,
                                    id: plan && plan.id ? plan.id : key
                                }));
                            }
                            // Defensive: ensure array
                            if (!Array.isArray(plansArray)) plansArray = [];
                            // Update CTA text based on current plan
                            const updatedPlans = plansArray.map(plan => ({
                                ...plan,
                                cta: currentPlan === plan.id ? 'Current Plan' : (plan.price === 0 ? 'Downgrade' : 'Upgrade')
                            }));
                            setPlans(updatedPlans);
                            setLoading(false);
                        } else {
                            setPlans([]);
                            setLoading(false);
                        }
                    },
                    (error) => {
                        setError('Failed to load subscription plans');
                        setPlans([]);
                        setLoading(false);
                    }
                );
                return unsubscribe;
            } catch (err) {
                setError('Failed to load subscription plans');
                setPlans([]);
                setLoading(false);
            }
        };
        const unsubscribe = fetchPlans();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentPlan]);

    const handleUpgrade = async (planName) => {
        if (!currentUser || !plans || plans.length === 0) return;

        // Get the selected plan to check if it's free
        const plan = plans.find(p => p.id === planName);
        
        // If Basic plan (free), directly process without payment
        if (plan && plan.price === 0) {
            try {
                const subscriptionRef = ref(database, `users/${currentUser.uid}/subscription`);
                await set(subscriptionRef, {
                    plan: planName,
                    upgradedAt: new Date().toISOString(),
                    active: true,
                    renewalDate: calculateRenewalDate(planName)
                });
                
                setCurrentPlan(planName);
                setShowUpgradeModal(false);
                setError(null);
            } catch (err) {
                setError('Failed to process plan change');
                console.error('Error:', err);
            }
        } else {
            // For paid plans, show payment form
            setShowPaymentForm(true);
        }
    };

    const handlePaymentSubmit = async (paymentData) => {
        if (!currentUser || !selectedPlan) return;

        setPaymentLoading(true);
        try {
            // Here you would normally send the payment data to your backend
            // For now, we'll just process the subscription upgrade
            const subscriptionRef = ref(database, `users/${currentUser.uid}/subscription`);
            await set(subscriptionRef, {
                plan: selectedPlan,
                upgradedAt: new Date().toISOString(),
                active: true,
                renewalDate: calculateRenewalDate(selectedPlan),
                paymentMethod: 'credit_card',
                lastPaymentDate: new Date().toISOString()
            });
            
            setCurrentPlan(selectedPlan);
            setShowUpgradeModal(false);
            setShowPaymentForm(false);
            setError(null);
        } catch (err) {
            setError('Failed to process payment');
            console.error('Error:', err);
        } finally {
            setPaymentLoading(false);
        }
    };

    const calculateRenewalDate = (plan) => {
        const date = new Date();
        if (plan === 'moderate') {
            date.setMonth(date.getMonth() + 1);
        } else if (plan === 'premium') {
            date.setFullYear(date.getFullYear() + 1);
        }
        return date.toISOString();
    };

    const isFeatureUnlocked = (feature) => {
        switch (feature) {
            case 'dashboard':
                return true;
            case 'farmZones':
                return currentPlan !== 'basic';
            case 'vans':
                return currentPlan !== 'basic';
            case 'liveChat':
                return currentPlan === 'premium';
            case 'aiAssistant':
                return currentPlan === 'premium';
            default:
                return false;
        }
    };

    if (loading) {
        return (
            <div className="subscription-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw size={40} />
                </motion.div>
                <p>Loading subscription info...</p>
            </div>
        );
    }

    return (
        <div className="subscription-container">
            {/* Header */}
            <motion.header
                className="subscription-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <div className="header-title">
                        <CreditCard size={30} />
                        <div>
                            <h1>Subscription Plans</h1>
                            <p className="header-subtitle">Choose the perfect plan for your farm</p>
                        </div>
                    </div>
                    {currentPlan && (
                        <div className="current-plan-badge">
                            <Check size={20} />
                            <span>Current: <strong>{currentPlan.toUpperCase()}</strong></span>
                        </div>
                    )}
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

            {/* Pricing Cards */}
            <motion.div
                className="pricing-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
            >
                {Array.isArray(plans) && plans.length > 0 ? (
                    plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            className={`pricing-card ${currentPlan === plan.id ? 'active' : ''}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h2>{plan.name}</h2>
                                    {plan.id === 'premium' && (
                                        <span className="discount-badge">Save 10%</span>
                                    )}
                                </div>
                                <p className="card-description">{plan.description}</p>
                                <div className="price-section">
                                    <span className="price">{plan.price}</span>
                                    <span className="currency">{plan.currency || "dt"}</span>
                                    <span className="period">{plan.period || "Forever"}</span>
                                </div>
                            </div>
                            <div className="features-list">
                                {Array.isArray(plan.features) && plan.features.length > 0 ? (
                                    plan.features.map((feature, featureIdx) => {
                                        const featureName = typeof feature === 'object' && feature !== null ? feature.name : String(feature);
                                        const included = typeof feature === 'object' && feature !== null ? feature.included : true;
                                        return (
                                            <div key={featureIdx} className="feature-item">
                                                {included ? (
                                                    <>
                                                        <Check size={18} className="feature-icon included" />
                                                        <span className="feature-name included">{featureName}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock size={18} className="feature-icon disabled" />
                                                        <span className="feature-name disabled">{featureName}</span>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <span className="feature-name disabled">No features listed</span>
                                )}
                            </div>
                            <button
                                className={`btn-action ${currentPlan === plan.id ? 'current' : 'upgrade'}`}
                                onClick={() => {
                                    if (currentPlan !== plan.id) {
                                        setSelectedPlan(plan.id);
                                        setShowUpgradeModal(true);
                                        setShowPaymentForm(false);
                                    }
                                }}
                                disabled={currentPlan === plan.id}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#fff' }}>Loading subscription plans...</p>
                    </div>
                )}
            </motion.div>

            {/* Premium Features Highlight */}
            <motion.section
                className="premium-features"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2>Premium Features</h2>
                <div className="premium-grid">
                    <div className="premium-feature">
                        <MessageCircle size={32} className="feature-icon" />
                        <h3>Live Chat Support</h3>
                        <p>Get instant support from our team during farming hours</p>
                        <span className="plan-badge">Premium Only</span>
                    </div>
                    <div className="premium-feature">
                        <Zap size={32} className="feature-icon" />
                        <h3>AI Assistant</h3>
                        <p>Get AI-powered insights and recommendations for your farm</p>
                        <span className="plan-badge">Premium Only</span>
                    </div>
                    <div className="premium-feature">
                        <CreditCard size={32} className="feature-icon" />
                        <h3>Priority Access</h3>
                        <p>Get priority access to new features and updates</p>
                        <span className="plan-badge">Premium Only</span>
                    </div>
                </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
                className="faq-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h3>Can I change plans anytime?</h3>
                        <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept credit cards, debit cards, and bank transfers for subscription payments.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Is there a free trial?</h3>
                        <p>Yes! You can start with our Basic plan for free with full access to dashboard features.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What happens if I cancel?</h3>
                        <p>You'll be downgraded to the Basic plan and lose access to premium features immediately.</p>
                    </div>
                </div>
            </motion.section>

            {/* Upgrade Confirmation Modal */}
            {showUpgradeModal && selectedPlan && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowUpgradeModal(false)}
                >
                    <motion.div
                        className="modal-content"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>{showPaymentForm ? 'Payment Information' : 'Confirm Upgrade'}</h2>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowUpgradeModal(false);
                                    setShowPaymentForm(false);
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {!showPaymentForm ? (
                                // Confirmation Step
                                (() => {
                                    const planObj = plans.find(p => p.id === selectedPlan);
                                    return (
                                        <>
                                            <p className="confirmation-text">
                                                Are you sure you want to upgrade to the <strong>{planObj?.name ? planObj.name : selectedPlan.toUpperCase()}</strong> plan?
                                            </p>
                                            <div className="plan-details">
                                                <div className="detail-row">
                                                    <span>Plan:</span>
                                                    <strong>{planObj?.name ? planObj.name : selectedPlan.toUpperCase()}</strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Price:</span>
                                                    <strong>
                                                        {planObj?.price} {planObj?.currency}
                                                    </strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Billing Period:</span>
                                                    <strong>{planObj?.period}</strong>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()
                            ) : (
                                // Payment Form Component
                                <PaymentForm 
                                    onSubmit={handlePaymentSubmit} 
                                    isLoading={paymentLoading}
                                />
                            )}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    if (showPaymentForm) {
                                        setShowPaymentForm(false);
                                    } else {
                                        setShowUpgradeModal(false);
                                    }
                                }}
                                disabled={paymentLoading}
                            >
                                {showPaymentForm ? 'Back' : 'Cancel'}
                            </button>
                            {!showPaymentForm ? (
                                <button
                                    className="btn-confirm"
                                    onClick={() => {
                                        const plan = plans.find(p => p.id === selectedPlan);
                                        if (plan && plan.price === 0) {
                                            // For free plans, directly confirm
                                            handleUpgrade(selectedPlan);
                                        } else {
                                            setShowPaymentForm(true);
                                        }
                                    }}
                                >
                                    {plans.find(p => p.id === selectedPlan)?.price === 0 ? (
                                        <>
                                            <Check size={18} />
                                            Confirm
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={18} />
                                            Continue to Payment
                                        </>
                                    )}
                                </button>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Subscription;