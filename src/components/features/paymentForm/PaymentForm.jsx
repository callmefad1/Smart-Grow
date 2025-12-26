// src/components/features/paymentForm/PaymentForm.jsx
import { useState } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import './PaymentForm.css';

const PaymentForm = ({ onSubmit, isLoading = false }) => {
    const [paymentData, setPaymentData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        billingAddress: ''
    });
    const [paymentError, setPaymentError] = useState(null);

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }

        // Format expiry date
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
        }

        // Limit CVV to 3-4 digits
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setPaymentData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const validatePaymentData = () => {
        setPaymentError(null);

        if (!paymentData.cardholderName.trim()) {
            setPaymentError('Cardholder name is required');
            return false;
        }

        const cardNum = paymentData.cardNumber.replace(/\s/g, '');
        if (cardNum.length < 13 || cardNum.length > 19) {
            setPaymentError('Invalid card number');
            return false;
        }

        if (!paymentData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
            setPaymentError('Expiry date must be MM/YY');
            return false;
        }

        if (paymentData.cvv.length < 3) {
            setPaymentError('CVV must be at least 3 digits');
            return false;
        }

        if (!paymentData.billingAddress.trim()) {
            setPaymentError('Billing address is required');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validatePaymentData()) return;
        onSubmit(paymentData);
    };

    return (
        <div className="payment-form-wrapper">
            {paymentError && (
                <div className="payment-error">
                    <AlertCircle size={18} />
                    {paymentError}
                </div>
            )}
            
            <div className="payment-form">
                <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                        type="text"
                        name="cardholderName"
                        value={paymentData.cardholderName}
                        onChange={handlePaymentChange}
                        placeholder="John Doe"
                        maxLength="50"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label>Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>CVV</label>
                        <input
                            type="text"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength="4"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Billing Address</label>
                    <textarea
                        name="billingAddress"
                        value={paymentData.billingAddress}
                        onChange={handlePaymentChange}
                        placeholder="Street address, city, state, zip"
                        rows="3"
                        disabled={isLoading}
                    />
                </div>

                <div className="security-note">
                    <Lock size={16} />
                    <span>Your payment information is secure and encrypted</span>
                </div>
            </div>

            <button
                className="btn-payment-submit"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Submit Payment'}
            </button>
        </div>
    );
};

export default PaymentForm;
