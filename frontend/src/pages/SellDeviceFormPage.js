// src/pages/SellDeviceFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
    FaMobileAlt, FaTabletAlt, FaLaptop, FaSave // Added icons
} from 'react-icons/fa';

// Helper for category titles
const categoryDisplayTitles = {
    phones: "Phone",
    tablets: "Tablet",
    laptops: "Laptop",
    watches: "Watch",
    consoles: "Gaming Console",
    default: "Device"
};

// Sample data for dropdowns
const deviceFormData = {
    brands: {
        phones: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Huawei", "Oppo", "Realme", "Vivo", "Nokia", "Motorola", "Sony", "LG", "Other"],
        tablets: ["Apple", "Samsung", "Amazon", "Lenovo", "Microsoft", "Huawei", "Xiaomi", "Other"],
        laptops: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "Razer", "MSI", "Samsung", "Huawei", "Other"],
        watches: ["Apple", "Samsung", "Garmin", "Fitbit", "Huawei", "Xiaomi", "Amazfit", "Fossil", "Other"],
        consoles: ["Sony (PlayStation)", "Microsoft (Xbox)", "Nintendo", "Valve (Steam Deck)", "Other"]
    },
    storage: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB", "Other / Not Sure"],
    conditions: ["Mint (Like New, No signs of use)", "Excellent (Minimal wear, near perfect)", "Good (Light scratches/scuffs, fully functional)", "Fair (Visible wear, dents, fully functional)", "Poor (Heavy damage/functional issues)"],
    screenConditions: ["Perfect (No scratches or issues)", "Minor Scratches (Not visible when screen is on)", "Noticeable Scratches (Visible when screen is on)", "Deep Scratches / Cracks", "Display Issues (Dead pixels, lines, discoloration)"],
    bodyConditions: ["Perfect (No marks or scuffs)", "Minor Wear (Few light scuffs)", "Noticeable Scratches/Scuffs", "Dents or Dings", "Cracked or Bent Casing"],
    functionalIssuesOptions: [
        "Fully Functional",
        "Battery Drains Quickly / Needs Replacement",
        "Button(s) Not Working Properly",
        "Charging Port Issues",
        "Speaker or Microphone Issues",
        "Camera Not Working (Front or Back)",
        "Wi-Fi or Bluetooth Connectivity Problems",
        "Software Glitches / Freezes Often",
        "Overheating Regularly",
        "Device Won't Turn On / Boot Loop",
        "Water Damaged",
        "Other (Please Specify Below)"
    ],
    includedItems: ["Original Box & Packaging", "Original Charger", "Original Charging Cable", "Manuals & Documentation", "Included Accessories (e.g., S-Pen, Remote)", "None of the Above"]
};


function SellDeviceFormPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const categoryTitle = categoryDisplayTitles[category] || categoryDisplayTitles.default;

    const initialFormData = {
        deviceCategory: categoryTitle,
        brand: '',
        model: '',
        storage: '',
        imeiSerial: '',
        overallCondition: '',
        screenCondition: '',
        bodyCondition: '',
        functionalIssues: [],
        functionalIssuesDetails: '',
        included: [],
        hasPersonalData: 'yes', // New field for data wiping confirmation
        name: '',
        email: '',
        phone: '',
        agreedToTerms: false, // New field for terms agreement
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showImeiHelp, setShowImeiHelp] = useState(false);


    useEffect(() => {
        setFormData(prev => ({
            ...initialFormData, // Reset most fields but keep category
            deviceCategory: categoryTitle,
             // Attempt to keep brand if it's still valid for the new category
            brand: (deviceFormData.brands[category] && deviceFormData.brands[category].includes(prev.brand)) ? prev.brand : ''
        }));
        setFormErrors({}); // Clear errors when category changes
    }, [category, categoryTitle]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === "agreedToTerms") {
                 setFormData(prev => ({ ...prev, [name]: checked }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
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
        if (!formData.brand) errors.brand = "Brand selection is required.";
        if (!formData.model.trim()) errors.model = "Model name is required.";
        if (!formData.overallCondition) errors.overallCondition = "Overall condition must be selected.";
        if (formData.functionalIssues.includes("Other (Please Specify Below)") && !formData.functionalIssuesDetails.trim()) {
            errors.functionalIssuesDetails = "Please specify details for 'Other' functional issues.";
        }
        if (!formData.name.trim()) errors.name = "Your full name is required.";
        if (!formData.email.trim()) errors.email = "A valid email address is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Please enter a valid email format.";
        if (!formData.phone.trim()) errors.phone = "Your phone number is required.";
        else if (!/^[0-9\s+()-]{7,20}$/.test(formData.phone)) errors.phone = "Please enter a valid phone number.";
        if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the terms and conditions.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('/api/sell-device', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        deviceInfo: {
                            category: formData.category,
                            brand: formData.brand,
                            model: formData.model,
                            storage: formData.storage,
                            condition: formData.condition,
                            originalBox: formData.originalBox,
                            accessories: formData.accessories
                        },
                        customerInfo: {
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address
                        },
                        description: formData.description
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    setFormSubmitted(true);
                    window.scrollTo(0, 0); // Scroll to top to see confirmation
                } else {
                    alert(data.error || 'Failed to submit your sell request. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to submit your sell request. Please try again.');
            }
        } else {
            console.log("Form validation failed. Errors:", formErrors);
             // Find the first error and scroll to it (optional UX improvement)
            const firstErrorKey = Object.keys(formErrors).find(key => formErrors[key]);
            if (firstErrorKey) {
                const errorElement = document.getElementById(firstErrorKey);
                if (errorElement) {
                    errorElement.focus();
                     errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    };

    const renderFormSection = (title, stepNumber, children) => (
        <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>
                <span style={stepIndicatorStyle}>Step {stepNumber}</span>
                {title}
            </legend>
            {children}
        </fieldset>
    );


    if (formSubmitted) {
        return (
            <div style={pageStyle}>
                <div style={submissionConfirmationStyle}>
                    <FaCheckCircle style={confirmationIconStyle} />
                    <h2>Submission Received!</h2>
                    <p>Thank you for submitting your device details, {formData.name}.</p>
                    <p>We'll review the information and aim to get back to you with a preliminary quote via email ({formData.email}) or phone within <strong>1-2 business days</strong>.</p>
                    <p style={importantNoticeStyle}>Please check your spam/junk folder if you don't hear from us.</p>
                    <div style={confirmationButtonsContainerStyle}>
                        <Link to="/sell" style={{...confirmationButtonStyle, ...secondaryButtonStyle}}>Sell Another Device</Link>
                        <Link to="/" style={confirmationButtonStyle}>Back to Homepage</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={formContainerStyle}>
                <div style={formHeaderStyle}>
                    <Link to="/sell" style={backButtonStyle}>
                        <FaArrowLeft style={{ marginRight: '8px' }} /> Categories
                    </Link>
                    <h1>Get a Quote for Your {categoryTitle}</h1>
                    <p style={formHeaderSubtitleStyle}>Complete the form below for a free, no-obligation estimate. The more accurate your details, the better your quote!</p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle} noValidate>
                    {renderFormSection("Device Details", 1, <>
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
                                <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} style={inputStyle} placeholder="e.g., iPhone 12 Pro, Galaxy Tab S7" required />
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
                                    IMEI/Serial Number (Optional)
                                    <FaInfoCircle style={infoIconStyle} onMouseEnter={() => setShowImeiHelp(true)} onMouseLeave={() => setShowImeiHelp(false)} />
                                </label>
                                <input type="text" name="imeiSerial" id="imeiSerial" value={formData.imeiSerial} onChange={handleChange} style={inputStyle} placeholder="Helps identify specific model/status" />
                                {showImeiHelp && <p style={tooltipStyle}>For phones, dial *#06#. For other devices, check settings or original packaging.</p>}
                            </div>
                        </div>
                    </>)}

                    {renderFormSection("Condition Assessment", 2, <>
                        <div style={formGroupStyleFullWidth}>
                            <label htmlFor="overallCondition" style={labelStyle}>Overall Condition*</label>
                            <select name="overallCondition" id="overallCondition" value={formData.overallCondition} onChange={handleChange} style={selectStyle} required>
                                <option value="">-- Describe the Overall Condition --</option>
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
                            <label style={labelStyle}>Known Functional Issues? (Select all applicable)</label>
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
                                <label htmlFor="functionalIssuesDetails" style={labelStyle}>Details of "Other" Functional Issues*</label>
                                <textarea name="functionalIssuesDetails" id="functionalIssuesDetails" value={formData.functionalIssuesDetails} onChange={handleChange} style={textareaStyle} rows="3" placeholder="Please provide specific details here..."></textarea>
                                {formErrors.functionalIssuesDetails && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.functionalIssuesDetails}</p>}
                            </div>
                        )}
                    </>)}

                    {renderFormSection("Accessories & Data", 3, <>
                        <div style={formGroupStyleFullWidth}>
                            <label style={labelStyle}>What's Included with the Device?</label>
                            <div style={checkboxGroupStyle}>
                                {deviceFormData.includedItems.map(item => (
                                    <label key={item} style={checkboxLabelStyle}>
                                        <input type="checkbox" name="included" value={item} checked={formData.included.includes(item)} onChange={handleChange} style={checkboxInputStyle} /> {item}
                                    </label>
                                ))}
                            </div>
                        </div>
                         <div style={formGroupStyleFullWidth}>
                            <label htmlFor="hasPersonalData" style={labelStyle}>Personal Data</label>
                            <select name="hasPersonalData" id="hasPersonalData" value={formData.hasPersonalData} onChange={handleChange} style={selectStyle}>
                                <option value="yes">I will remove all personal data/accounts before sending.</option>
                                <option value="no">Please assist with data removal (if possible, charges may apply).</option>
                                <option value="not_applicable">Not applicable / No personal data on device.</option>
                            </select>
                            <small style={smallHelpTextStyle}>We recommend factory resetting your device. We perform secure data wiping on all received devices.</small>
                        </div>
                    </>)}

                    {renderFormSection("Your Contact Details", 4, <>
                        <div style={formGroupStyleFullWidth}>
                            <label htmlFor="name" style={labelStyle}>Full Name*</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="Your First and Last Name" required />
                            {formErrors.name && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.name}</p>}
                        </div>
                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label htmlFor="email" style={labelStyle}>Email Address*</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="you@example.com" required />
                                {formErrors.email && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.email}</p>}
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="phone" style={labelStyle}>Phone Number*</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="e.g., 07123456789" required />
                                {formErrors.phone && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.phone}</p>}
                            </div>
                        </div>
                         <div style={formGroupStyleFullWidth} marginTop="1rem">
                            <label style={checkboxLabelStyle}>
                                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} style={checkboxInputStyle} required/>
                                I confirm the device is mine to sell and I agree to the <Link to="/terms#selling" target="_blank" style={inlineLinkStyle}>Selling Terms & Conditions</Link>.*
                            </label>
                            {formErrors.agreedToTerms && <p style={errorTextStyle}><FaExclamationTriangle /> {formErrors.agreedToTerms}</p>}
                        </div>
                    </>)}

                    <button type="submit" style={submitButtonStyle}>
                        <FaSave style={{ marginRight: '10px' }} /> Get My Free Estimate
                    </button>
                </form>
            </div>
        </div>
    );
}

// --- Enhanced Styles for SellDeviceFormPage ---
const pageStyle = { fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '2rem 1rem', color: '#1E3A8A', };
const formContainerStyle = { backgroundColor: '#fff', maxWidth: '850px', margin: '1rem auto 3rem auto', padding: '2.5rem 3rem', borderRadius: '18px', boxShadow: '0 10px 30px rgba(30, 58, 138, 0.12)', };
const formHeaderStyle = { textAlign: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #e0e7ff', paddingBottom: '1.5rem' };
const backButtonStyle = { display: 'inline-flex', alignItems: 'center', color: '#1E3A8A', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', marginBottom: '1rem', padding: '0.6rem 1.2rem', border: '1px solid #ced4da', borderRadius: '8px', float: 'left', transition: 'all 0.2s ease' };
backButtonStyle[':hover'] = { backgroundColor: '#e9ecef', borderColor: '#adb5bd' };
const formHeaderSubtitleStyle = { fontSize: '1rem', color: '#495057', marginTop: '0.5rem', lineHeight: 1.6 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '2rem' }; // Increased gap between fieldsets
const fieldsetStyle = { border: 'none', borderTop: '1px solid #e0e7ff', borderRadius: '0px', padding: '2rem 0 1rem 0', margin: 0 };
fieldsetStyle[':first-of-type'] = { borderTop: 'none', paddingTop: '0.5rem' }; // Remove top border for the first fieldset
const legendStyle = { fontWeight: '600', fontSize: '1.3rem', padding: '0', color: '#1E3A8A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' };
const stepIndicatorStyle = {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '0.75rem',
};
const formRowStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' }; // Default to column
// Responsive row using media query (better in CSS file)
// @media (min-width: 768px) { formRowStyle = { ...formRowStyle, flexDirection: 'row', gap: '2rem' }; }
const formGroupStyle = { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }; // Reduced gap for label & input
const formGroupStyleFullWidth = { ...formGroupStyle, width: '100%'};
const labelStyle = { fontWeight: '500', fontSize: '0.9rem', color: '#343a40', display: 'flex', alignItems: 'center' };
const infoIconStyle = { marginLeft: '0.5rem', color: '#6c757d', cursor: 'pointer', fontSize: '0.9em' };
const tooltipStyle = { fontSize: '0.75rem', color: '#495057', backgroundColor: '#e9ecef', padding: '0.3rem 0.6rem', borderRadius: '4px', marginTop: '0.2rem' };
const inputStyle = { padding: '0.85rem 1rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', fontFamily: "'Poppins', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center', backgroundSize: '16px 12px', cursor: 'pointer' };
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical', lineHeight: 1.5 };
const checkboxGroupStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginTop: '0.5rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#495057', cursor: 'pointer', padding: '0.3rem 0' };
const checkboxInputStyle = { marginRight: '0.6rem', width: '18px', height: '18px', accentColor: '#1E3A8A', cursor: 'pointer', marginTop: '0' };
const errorTextStyle = { color: '#d9534f', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' };
const submitButtonStyle = { backgroundColor: '#1E3A8A', color: 'white', padding: '0.9rem 2rem', border: 'none', borderRadius: '8px', fontSize: '1.15rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '1.5rem', alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' };
submitButtonStyle[':hover'] = { backgroundColor: '#162b65', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const smallHelpTextStyle = { fontSize: '0.8rem', color: '#6c757d', marginTop: '0.3rem', display: 'block' };
const inlineLinkStyle = { color: '#1E3A8A', textDecoration: 'underline', fontWeight: '500' };
inlineLinkStyle[':hover'] = { textDecoration: 'none' };

// Confirmation Screen Styles
const submissionConfirmationStyle = { textAlign: 'center', padding: '3rem 2.5rem', backgroundColor: '#fff', borderRadius: '16px', maxWidth: '650px', margin: '3rem auto', boxShadow: '0 8px 30px rgba(30, 58, 138, 0.12)' };
const confirmationIconStyle = { fontSize: '4.5rem', color: '#28a745', marginBottom: '1.5rem' };
const importantNoticeStyle = { fontSize: '0.9rem', color: '#555', marginTop: '1rem', fontStyle: 'italic' };
const confirmationButtonsContainerStyle = { marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' };
const confirmationButtonStyle = { ...submitButtonStyle, fontSize: '1rem', padding: '0.8rem 1.8rem', minWidth: '180px' };
const secondaryButtonStyle = { backgroundColor: '#6c757d', };
secondaryButtonStyle[':hover'] = { backgroundColor: '#5a6268' };


export default SellDeviceFormPage;