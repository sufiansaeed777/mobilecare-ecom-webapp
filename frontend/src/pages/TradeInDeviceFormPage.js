// src/pages/TradeInDeviceFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaShoppingCart, FaTags
} from 'react-icons/fa';

// Helper for category titles (can be shared or defined locally)
const categoryDisplayTitles = {
    phones: "Phone",
    tablets: "Tablet",
    laptops: "Laptop",
    watches: "Watch",
    consoles: "Gaming Console",
    default: "Device"
};

// Sample data for dropdowns (same as SellDeviceFormPage)
const deviceFormData = {
    brands: { /* ... same as SellDeviceFormPage ... */
        phones: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Huawei", "Oppo", "Realme", "Vivo", "Nokia", "Motorola", "Sony", "LG", "Other"],
        tablets: ["Apple", "Samsung", "Amazon", "Lenovo", "Microsoft", "Huawei", "Xiaomi", "Other"],
        laptops: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "Razer", "MSI", "Samsung", "Huawei", "Other"],
        watches: ["Apple", "Samsung", "Garmin", "Fitbit", "Huawei", "Xiaomi", "Amazfit", "Fossil", "Other"],
        consoles: ["Sony (PlayStation)", "Microsoft (Xbox)", "Nintendo", "Valve (Steam Deck)", "Other"]
    },
    storage: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB", "Other / Not Sure"],
    conditions: ["Mint (Like New, No signs of use)", "Excellent (Minimal wear, near perfect)", "Good (Light Scratches/scuffs, fully functional)", "Fair (Visible Wear, dents, fully functional)", "Poor (Heavy damage/functional issues)"],
    screenConditions: ["Perfect (No issues)", "Minor Scratches (Not visible when screen is on)", "Noticeable Scratches (Visible when screen is on)", "Deep Scratches / Cracks", "Display Issues (Dead pixels, lines, discoloration)"],
    bodyConditions: ["Perfect (No marks or scuffs)", "Minor Wear (Few light scuffs)", "Noticeable Scratches/Scuffs", "Dents or Dings", "Cracked or Bent Casing"],
    functionalIssuesOptions: ["Fully Functional", "Battery Drains Quickly / Needs Replacement", "Button(s) Not Working Properly", "Charging Port Issues", "Speaker or Microphone Issues", "Camera Not Working (Front or Back)", "Wi-Fi or Bluetooth Connectivity Problems", "Software Glitches / Freezes Often", "Overheating Regularly", "Device Won't Turn On / Boot Loop", "Water Damaged", "Other (Please Specify Below)"],
    includedItems: ["Original Box & Packaging", "Original Charger", "Original Charging Cable", "Manuals & Documentation", "Included Accessories (e.g., S-Pen, Remote)", "None of the Above"]
};


function TradeInDeviceFormPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const categoryTitle = categoryDisplayTitles[category] || categoryDisplayTitles.default;

    const initialFormData = {
        deviceCategory: categoryTitle,
        brand: '',
        model: '',
        storage: '',
        imeiSerial: '', // Keep for identification if needed
        overallCondition: '',
        screenCondition: '',
        bodyCondition: '',
        functionalIssues: [],
        functionalIssuesDetails: '',
        included: [],
        emailForQuote: '', // For sending/referencing the quote
        agreedToTerms: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [estimatedValue, setEstimatedValue] = useState(0);
    const [showImeiHelp, setShowImeiHelp] = useState(false);

    useEffect(() => {
        setFormData(prev => ({
            ...initialFormData,
            deviceCategory: categoryTitle,
            brand: (deviceFormData.brands[category] && deviceFormData.brands[category].includes(prev.brand)) ? prev.brand : '',
            emailForQuote: prev.emailForQuote // Preserve email if user navigates back and forth
        }));
        setFormErrors({});
        setFormSubmitted(false); // Reset submission status if category changes
    }, [category, categoryTitle]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === "agreedToTerms") {
                 setFormData(prev => ({ ...prev, [name]: checked }));
            } else {
                 setFormData(prev => ({
                    ...prev,
                    [name]: checked ? [...prev[name], value] : prev[name].filter(item => item !== value)
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.brand) errors.brand = "Brand is required.";
        if (!formData.model.trim()) errors.model = "Model is required.";
        if (!formData.overallCondition) errors.overallCondition = "Overall condition is required.";
        if (!formData.emailForQuote.trim()) errors.emailForQuote = "Email is required for your quote.";
        else if (!/\S+@\S+\.\S+/.test(formData.emailForQuote)) errors.emailForQuote = "Email is invalid.";
        if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the trade-in terms.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // SIMULATED: Calculate an estimated trade-in value
    const calculateEstimate = (data) => {
        let baseValue = 50; // Base for any trade-in
        if (data.deviceCategory === "Laptop" || data.deviceCategory === "Gaming Console") baseValue = 100;
        if (data.deviceCategory === "Phone" || data.deviceCategory === "Tablet") baseValue = 70;

        const conditionFactor = {
            "Mint (Like New, No signs of use)": 1.5,
            "Excellent (Minimal wear, near perfect)": 1.2,
            "Good (Light Scratches/scuffs, fully functional)": 1.0,
            "Fair (Visible Wear, dents, fully functional)": 0.7,
            "Poor (Heavy damage/functional issues)": 0.3
        };
        baseValue *= (conditionFactor[data.overallCondition] || 0.5);
        if (data.included.includes("Original Box & Packaging")) baseValue += 10;
        if (data.included.includes("Original Charger")) baseValue += 5;
        // More logic can be added based on brand, storage, etc.
        return Math.max(10, Math.round(baseValue)); // Ensure a minimum value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('/api/trade-in-device', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentDevice: {
                            category: category || formData.category,
                            brand: formData.brand,
                            model: formData.model,
                            storage: formData.storage,
                            condition: formData.condition
                        },
                        newDevice: {
                            category: 'To be discussed', // Form doesn't have new device selection
                            brand: 'To be discussed',
                            model: 'To be discussed',
                            storage: 'To be discussed'
                        },
                        customerInfo: {
                            name: 'Trade-In Customer', // Default name since form doesn't have this field
                            email: formData.emailForQuote,
                            phone: '', // Form doesn't collect phone
                            address: '', // Form doesn't collect address
                            notes: formData.functionalIssuesDetails || ''
                        }
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    setFormSubmitted(true);
                    window.scrollTo(0, 0);
                } else {
                    alert(data.error || 'Failed to submit your trade-in request. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to submit your trade-in request. Please try again.');
            }
        } else {
            const firstErrorKey = Object.keys(formErrors).find(key => formErrors[key]);
            if (firstErrorKey) {
                const errorElement = document.getElementById(firstErrorKey);
                if (errorElement) errorElement.focus();
            }
        }
    };

    if (formSubmitted) {
        return (
            <div style={pageStyle}>
                <div style={submissionConfirmationStyle}>
                    <FaCheckCircle style={confirmationIconStyle} />
                    <h2>Trade-In Request Submitted!</h2>
                    <p>Thank you for submitting your trade-in request for your <strong>{formData.model || categoryTitle}</strong>.</p>
                    <div style={estimateValueBoxStyle}>
                        <p style={estimateLabelStyle}>Your Request Status:</p>
                        <p style={estimateValueStyle}>Under Review</p>
                    </div>
                    <p style={nextStepsTextStyle}>Our team will review your device information and contact you via email with a trade-in offer within 24-48 hours.</p>
                    <p style={nextStepsTextStyle}><strong>What happens next?</strong></p>
                    <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                        <li>We'll send you a trade-in value quote via email</li>
                        <li>You can accept or decline the offer</li>
                        <li>If accepted, we'll provide instructions for sending your device</li>
                    </ul>
                    <div style={confirmationButtonsContainerStyle}>
                        <Link to="/buy" style={confirmationButtonStyle}>
                            <FaShoppingCart style={{ marginRight: '8px' }} /> Browse Devices to Buy
                        </Link>
                        <Link to="/trade-in" style={{...confirmationButtonStyle, ...secondaryButtonStyle}}>
                            Start New Trade-In
                        </Link>
                    </div>
                    <p style={emailInfoStyle}>We'll send the trade-in offer to: {formData.emailForQuote}</p>
                </div>
            </div>
        );
    }

    // Reusing styles from SellDeviceFormPage, some might need minor tweaks
    return (
        <div style={pageStyle}>
            <div style={formContainerStyle}>
                <div style={formHeaderStyle}>
                    <Link to="/trade-in" style={backButtonStyle}>
                        <FaArrowLeft style={{ marginRight: '8px' }} /> Categories
                    </Link>
                    <h1>Trade In Your {categoryTitle}</h1>
                    <p style={formHeaderSubtitleStyle}>Provide details about the device you want to trade in to receive an online estimate.</p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle} noValidate>
                    {/* Step 1: Device Details */}
                    <fieldset style={fieldsetStyle}>
                        <legend style={legendStyle}><span style={stepIndicatorStyle}>1</span>Device You're Trading In</legend>
                         <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label htmlFor="brand" style={labelStyle}>Brand*</label>
                                <select name="brand" id="brand" value={formData.brand} onChange={handleChange} style={selectStyle} required>
                                    <option value="">-- Select Brand --</option>
                                    {(deviceFormData.brands[category] || deviceFormData.brands.phones).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                {formErrors.brand && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.brand}</p>}
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="model" style={labelStyle}>Model Name*</label>
                                <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} style={inputStyle} placeholder="e.g., iPhone 11, Galaxy Tab S6" required />
                                {formErrors.model && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.model}</p>}
                            </div>
                        </div>
                        <div style={formRowStyle}>
                             <div style={formGroupStyle}>
                                <label htmlFor="storage" style={labelStyle}>Storage Capacity</label>
                                <select name="storage" id="storage" value={formData.storage} onChange={handleChange} style={selectStyle}>
                                    <option value="">-- Not Sure / Select --</option>
                                    {deviceFormData.storage.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="imeiSerial" style={labelStyle}>
                                    IMEI/Serial (Optional) <FaInfoCircle style={infoIconStyle} onMouseEnter={() => setShowImeiHelp(true)} onMouseLeave={() => setShowImeiHelp(false)} />
                                </label>
                                <input type="text" name="imeiSerial" id="imeiSerial" value={formData.imeiSerial} onChange={handleChange} style={inputStyle} placeholder="Helps us verify your device" />
                                {showImeiHelp && <p style={tooltipStyle}>For phones, dial *#06#. For others, check settings or packaging.</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* Step 2: Condition */}
                     <fieldset style={fieldsetStyle}>
                        <legend style={legendStyle}><span style={stepIndicatorStyle}>2</span>Device Condition</legend>
                        <div style={formGroupStyleFullWidth}>
                            <label htmlFor="overallCondition" style={labelStyle}>Overall Condition*</label>
                            <select name="overallCondition" id="overallCondition" value={formData.overallCondition} onChange={handleChange} style={selectStyle} required>
                                <option value="">-- Describe Overall Condition --</option>
                                {deviceFormData.conditions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                             {formErrors.overallCondition && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.overallCondition}</p>}
                        </div>
                         <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label htmlFor="screenCondition" style={labelStyle}>Screen Condition</label>
                                <select name="screenCondition" id="screenCondition" value={formData.screenCondition} onChange={handleChange} style={selectStyle}>
                                    <option value="">-- Describe Screen --</option>
                                    {deviceFormData.screenConditions.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="bodyCondition" style={labelStyle}>Body / Casing</label>
                                <select name="bodyCondition" id="bodyCondition" value={formData.bodyCondition} onChange={handleChange} style={selectStyle}>
                                    <option value="">-- Describe Body --</option>
                                    {deviceFormData.bodyConditions.map(bc => <option key={bc} value={bc}>{bc}</option>)}
                                </select>
                            </div>
                        </div>
                         <div style={formGroupStyleFullWidth}>
                            <label style={labelStyle}>Known Functional Issues? (Select all that apply)</label>
                            <div style={checkboxGroupStyle}>
                                {deviceFormData.functionalIssuesOptions.map(issue => (
                                    <label key={issue} style={checkboxLabelStyle}>
                                        <input type="checkbox" name="functionalIssues" value={issue} checked={formData.functionalIssues.includes(issue)} onChange={handleChange} style={checkboxInputStyle} /> {issue}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {formData.functionalIssues.includes("Other (Please Specify Below)") && (
                            <div style={formGroupStyleFullWidth}>
                                <label htmlFor="functionalIssuesDetails" style={labelStyle}>Details of "Other" Functional Issues</label>
                                <textarea name="functionalIssuesDetails" id="functionalIssuesDetails" value={formData.functionalIssuesDetails} onChange={handleChange} style={textareaStyle} rows="3" placeholder="Please provide specific details here..."></textarea>
                            </div>
                        )}
                    </fieldset>

                     {/* Step 3: What's Included */}
                     <fieldset style={fieldsetStyle}>
                        <legend style={legendStyle}><span style={stepIndicatorStyle}>3</span>What's Included?</legend>
                         <div style={checkboxGroupStyle}>
                            {deviceFormData.includedItems.map(item => (
                                <label key={item} style={checkboxLabelStyle}>
                                    <input type="checkbox" name="included" value={item} checked={formData.included.includes(item)} onChange={handleChange} style={checkboxInputStyle} /> {item}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Step 4: Contact & Agreement */}
                     <fieldset style={fieldsetStyle}>
                        <legend style={legendStyle}><span style={stepIndicatorStyle}>4</span>Your Details & Agreement</legend>
                        <div style={formGroupStyleFullWidth}>
                            <label htmlFor="emailForQuote" style={labelStyle}>Email for Quote & Updates*</label>
                            <input type="email" name="emailForQuote" id="emailForQuote" value={formData.emailForQuote} onChange={handleChange} style={inputStyle} placeholder="you@example.com" required />
                            {formErrors.emailForQuote && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.emailForQuote}</p>}
                        </div>
                         <div style={formGroupStyleFullWidth} marginTop="1.5rem"> {/* Corrected prop name to string */}
                            <label style={checkboxLabelStyle}>
                                <input type="checkbox" name="agreedToTerms" id="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} style={checkboxInputStyle} required/>
                                I confirm I own this device and agree to the <Link to="/terms#tradein" target="_blank" style={inlineLinkStyle}>Trade-In Terms & Conditions</Link>.*
                            </label>
                            {formErrors.agreedToTerms && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.agreedToTerms}</p>}
                        </div>
                    </fieldset>

                    <button type="submit" style={submitButtonStyle}>
                        <FaTags style={{ marginRight: '10px' }} /> Get My Trade-In Estimate
                    </button>
                </form>
            </div>
        </div>
    );
}

// --- Styles (largely reused from SellDeviceFormPage, with some additions/modifications) ---
// ... (Keep most styles from SellDeviceFormPage.js)
// Add or modify specific styles below:
const pageStyle = { fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '2rem 1rem', color: '#1E3A8A', };
const formContainerStyle = { backgroundColor: '#fff', maxWidth: '850px', margin: '1rem auto 3rem auto', padding: '2.5rem 3rem', borderRadius: '18px', boxShadow: '0 10px 30px rgba(30, 58, 138, 0.12)', };
const formHeaderStyle = { textAlign: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #e0e7ff', paddingBottom: '1.5rem' };
const backButtonStyle = { display: 'inline-flex', alignItems: 'center', color: '#1E3A8A', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', marginBottom: '1rem', padding: '0.6rem 1.2rem', border: '1px solid #ced4da', borderRadius: '8px', float: 'left', transition: 'all 0.2s ease' };
backButtonStyle[':hover'] = { backgroundColor: '#e9ecef', borderColor: '#adb5bd' };
const formHeaderSubtitleStyle = { fontSize: '1rem', color: '#495057', marginTop: '0.5rem', lineHeight: 1.6 };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' }; // Reduced gap between fieldsets for tighter steps
const fieldsetStyle = { border: 'none', borderTop: '2px dashed #e0e7ff', borderRadius: '0px', padding: '2rem 0 1rem 0', margin: '0' };
fieldsetStyle[':first-of-type'] = { borderTop: 'none', paddingTop: '0.5rem' };
const legendStyle = { fontWeight: '700', fontSize: '1.35rem', padding: '0 0.2rem', color: '#1E3A8A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', width: '100%' };
const stepIndicatorStyle = {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    borderRadius: '8px', // Squarish circle
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginRight: '0.85rem',
    flexShrink: 0,
};
const formRowStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
const formGroupStyle = { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' };
const formGroupStyleFullWidth = { ...formGroupStyle, width: '100%'};
const labelStyle = { fontWeight: '500', fontSize: '0.9rem', color: '#343a40', display: 'flex', alignItems: 'center', marginBottom: '0.2rem' };
const infoIconStyle = { marginLeft: '0.5rem', color: '#6c757d', cursor: 'pointer', fontSize: '0.9em' };
const tooltipStyle = { fontSize: '0.75rem', color: '#495057', backgroundColor: '#e9ecef', padding: '0.4rem 0.7rem', borderRadius: '6px', marginTop: '0.3rem', border: '1px solid #d0d9e0' };
const inputStyle = { padding: '0.85rem 1rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', fontFamily: "'Poppins', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center', backgroundSize: '16px 12px', cursor: 'pointer' };
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical', lineHeight: 1.5 };
const checkboxGroupStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.8rem', marginTop: '0.5rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#495057', cursor: 'pointer', padding: '0.3rem 0', userSelect: 'none' };
const checkboxInputStyle = { marginRight: '0.7rem', width: '18px', height: '18px', accentColor: '#1E3A8A', cursor: 'pointer', marginTop: '0', flexShrink: 0 };
const errorTextStyle = { color: '#d9534f', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' };
const submitButtonStyle = { backgroundColor: '#1E3A8A', color: 'white', padding: '0.9rem 2rem', border: 'none', borderRadius: '8px', fontSize: '1.15rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '1.5rem', alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto' };
const smallHelpTextStyle = { fontSize: '0.8rem', color: '#6c757d', marginTop: '0.4rem', display: 'block', lineHeight: 1.4 };
const inlineLinkStyle = { color: '#1E3A8A', textDecoration: 'underline', fontWeight: '500' };

// Confirmation Screen Styles
const submissionConfirmationStyle = { textAlign: 'center', padding: '3rem 2.5rem', backgroundColor: '#fff', borderRadius: '16px', maxWidth: '650px', margin: '3rem auto', boxShadow: '0 8px 30px rgba(30, 58, 138, 0.12)' };
const confirmationIconStyle = { fontSize: '4.5rem', color: '#28a745', marginBottom: '1.5rem' };
const estimateValueBoxStyle = { backgroundColor: '#e0f0ff', padding: '1.5rem', borderRadius: '12px', margin: '1.5rem auto', display: 'inline-block', border: '1px solid #b3d1ff' };
const estimateLabelStyle = { fontSize: '1rem', color: '#1E3A8A', marginBottom: '0.25rem', fontWeight: '500' };
const estimateValueStyle = { fontSize: '2.2rem', fontWeight: 'bold', color: '#1E3A8A' };
const nextStepsTextStyle = { fontSize: '1rem', color: '#495057', lineHeight: 1.6, margin: '1rem 0' };
const confirmationButtonsContainerStyle = { marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' };
const confirmationButtonStyle = { ...submitButtonStyle, fontSize: '1rem', padding: '0.8rem 1.8rem', minWidth: '200px', textDecoration: 'none' };
const secondaryButtonStyle = { backgroundColor: '#6c757d', };
const emailInfoStyle = { marginTop: '2rem', fontSize: '0.85rem', color: '#6c757d' };

export default TradeInDeviceFormPage;