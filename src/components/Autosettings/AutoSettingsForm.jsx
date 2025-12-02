
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, CheckCircle } from 'lucide-react';
import { saveAutoSettings } from '../../services/autoSettingsService';

function AutoSettingsForm({ autoSettings, sensorTypes }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Delegate persistence to the service. The service will parse and
            // build the firebase updates map from the provided formData.
            const result = await saveAutoSettings(formData);
            if (result && result.updated) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                setFormData({});
            } else {
                // nothing updated — still show success briefly or inform user
                setSuccess(true);
                setTimeout(() => setSuccess(false), 1500);
            }
        } catch (error) {
            console.error("Error saving auto settings:", error);
            alert("Error saving auto settings");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (sensorType) => (e) => {
        setFormData(prev => ({
            ...prev,
            [`${sensorType}auto`]: e.target.value
        }));
    };

    return (
        <motion.div
            className="auto-settings-form"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <div className="form-header">
                <Settings className="form-icon" />
                <h3>Auto Control Settings</h3>
                <p>Set thresholds for automatic VAN activation</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="settings-grid">
                    {Object.entries(sensorTypes).map(([sensorType, config]) => (
                        <div key={sensorType} className="setting-group">
                            <label htmlFor={`${sensorType}auto`}>
                                {config.unit} Auto Threshold ({config.unitSymbol})
                            </label>
                            <input
                                type="number"
                                id={`${sensorType}auto`}
                                value={formData[`${sensorType}auto`] || ''}
                                onChange={handleChange(sensorType)}
                                placeholder={`Current: ${autoSettings[`${sensorType}auto`] || 'Not set'}`}
                                min={config.min}
                                max={config.max}
                                step="0.1"
                            />
                            <span className="range-hint">
                Range: {config.min} - {config.max}{config.unitSymbol}
              </span>
                        </div>
                    ))}
                </div>

                <motion.button
                    type="submit"
                    className="save-button"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                    <Save className={loading ? 'spinning' : ''} />
                    {loading ? 'Saving...' : 'Save Auto Settings'}
                    {success && <CheckCircle size={16} />}
                </motion.button>
            </form>
        </motion.div>
    );
}

export default AutoSettingsForm;