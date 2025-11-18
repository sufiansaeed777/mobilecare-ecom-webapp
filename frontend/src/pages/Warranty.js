// src/pages/Warranty.js
import React from 'react';

const Warranty = () => {
  return (
    <div className="warranty-page" style={styles.container}>
      <h1 style={styles.title}>Repair Warranty</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <strong>Pre-Repair Testing:</strong> Ensure the device is tested before leaving the premises. The warranty will be voided if there is any physical damage, liquid damage, or third-party repair attempts.
        </li>
        <li style={styles.listItem}>
          <strong>Responsibility for Personal Items:</strong> The customer is responsible for the loss of SIM cards, memory cards, and phone cases, as these are not handed over to Mobile Care.
        </li>
        <li style={styles.listItem}>
          <strong>Warranty Period:</strong> There is a 100-day warranty on repairs.
        </li>
        <li style={styles.listItem}>
          <strong>Water Damage:</strong> No warranty is provided for water damage repairs. Data such as contacts and photos may be lost during repairs, and it is the customer's responsibility to back up their data.
        </li>
        <li style={styles.listItem}>
          <strong>Manufacturer Repairs:</strong> Some repairs may require sending the device to the manufacturer, which could extend the repair time. Provide the password to avoid delays.
        </li>
        <li style={styles.listItem}>
          <strong>Additional Faults:</strong> If additional faults are found during repair, and the device could not be powered on at the time of booking, the customer will be responsible for any extra repair costs.
        </li>
        <li style={styles.listItem}>
          <strong>Device Collection:</strong> Upon collection, the customer must ensure the device is fully functional. Mobile Care is not liable for faults unrelated to the original repair.
        </li>
      </ul>

      <h2 style={styles.subtitle}>Device Sales Warranty</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <strong>Proof of Purchase:</strong> Keep the receipt as proof of purchase.
        </li>
        <li style={styles.listItem}>
          <strong>Device Testing:</strong> The customer confirms the device is fully functional at the time of purchase.
        </li>
        <li style={styles.listItem}>
          <strong>Exchange Policy:</strong> A 14-day exchange policy is offered if the device is faulty.
        </li>
        <li style={styles.listItem}>
          <strong>Warranty Period:</strong> Devices come with a 24-month warranty, excluding third-party software issues, accidental damage (e.g., water damage), and screen damage.
        </li>
        <li style={styles.listItem}>
          <strong>Third-Party Repairs:</strong> Taking the device to a third-party service will void the warranty.
        </li>
        <li style={styles.listItem}>
          <strong>Pre-Owned Devices:</strong> Pre-owned devices come with a 3-month battery warranty from the purchase date.
        </li>
        <li style={styles.listItem}>
          <strong>Exclusions:</strong> The warranty does not cover LCD damage, screen cracks, faulty touch screens, pixel damage, or issues with fingerprint/iris sensors and Face ID.
        </li>
        <li style={styles.listItem}>
          <strong>Manufacturer Repair:</strong> If the device requires manufacturer repair, it may take up to 4 weeks.
        </li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'SeoulBlack, sans-serif',
    color: '#000',
    lineHeight: 1.6,
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  list: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
  },
  listItem: {
    marginBottom: '1rem',
  },
};

export default Warranty;
