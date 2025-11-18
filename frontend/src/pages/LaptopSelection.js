import React, { useState, useEffect } from 'react';
import { SiApple, SiDell, SiHp, SiLenovo, SiAsus, SiAcer, SiSamsung } from 'react-icons/si';
import { FaTools, FaClock, FaShieldAlt, FaCheck, FaArrowRight, FaPhoneAlt, FaStar, FaQuoteLeft, FaWindows } from 'react-icons/fa';
import { HiOutlineDesktopComputer, HiOutlineWifi } from 'react-icons/hi';
import { MdBatteryChargingFull, MdKeyboard, MdMemory, MdStorage } from 'react-icons/md';
import { BiWater } from 'react-icons/bi';
import { BsMotherboard } from 'react-icons/bs';

// Enhanced brand data with descriptions
const brands = [
  { name: 'Apple', Icon: SiApple, color: '#000000', description: 'MacBook Pro, Air, and more' },
  { name: 'Dell', Icon: SiDell, color: '#007DB8', description: 'XPS, Inspiron, Latitude series' },
  { name: 'HP', Icon: SiHp, color: '#0096D6', description: 'Pavilion, Envy, Spectre lines' },
  { name: 'Lenovo', Icon: SiLenovo, color: '#E2001A', description: 'ThinkPad, IdeaPad, Yoga' },
  { name: 'Asus', Icon: SiAsus, color: '#00539C', description: 'ZenBook, ROG, VivoBook' },
  { name: 'Acer', Icon: SiAcer, color: '#83B81A', description: 'Aspire, Predator, Swift' },
  { name: 'Microsoft', Icon: FaWindows, color: '#0078D4', description: 'Surface Pro, Laptop, Book' },
  { name: 'Samsung', Icon: SiSamsung, color: '#1428A0', description: 'Galaxy Book series' },
];

// Enhanced repair services with details
const repairServices = [
  {
    name: 'Screen Replacement',
    Icon: HiOutlineDesktopComputer,
    description: 'Cracked, flickering, or dead pixels',
    turnaround: '1-2 days',
    popular: true,
  },
  {
    name: 'Battery Replacement',
    Icon: MdBatteryChargingFull,
    description: 'Poor battery life or swollen battery',
    turnaround: '2-3 hours',
    popular: true,
  },
  {
    name: 'Keyboard Repair',
    Icon: MdKeyboard,
    description: 'Sticky, broken, or missing keys',
    turnaround: '1 day',
    popular: true,
  },
  {
    name: 'Charging Port',
    Icon: FaTools,
    description: 'Loose connection or no charging',
    turnaround: '2-4 hours',
    popular: false,
  },
  {
    name: 'Memory Upgrade',
    Icon: MdMemory,
    description: 'Speed up your laptop with more RAM',
    turnaround: '1 hour',
    popular: false,
  },
  {
    name: 'Storage Upgrade',
    Icon: MdStorage,
    description: 'SSD installation for faster performance',
    turnaround: '1-2 hours',
    popular: true,
  },
  {
    name: 'Motherboard Repair',
    Icon: BsMotherboard,
    description: 'Component-level board repairs',
    turnaround: '2-5 days',
    popular: false,
  },
  {
    name: 'Water Damage',
    Icon: BiWater,
    description: 'Liquid spill recovery and cleaning',
    turnaround: '1-3 days',
    popular: false,
  },
  {
    name: 'WiFi/Bluetooth Fix',
    Icon: HiOutlineWifi,
    description: 'Connectivity issues resolution',
    turnaround: '1-2 hours',
    popular: false,
  },
];

// Customer testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    device: "MacBook Pro 2021",
    rating: 5,
    text: "Fantastic service! My MacBook screen was replaced in just one day. The quality is excellent and the price was very reasonable.",
  },
  {
    name: "Michael Chen",
    device: "Dell XPS 15",
    rating: 5,
    text: "They saved my laptop after a coffee spill. I thought it was completely dead, but they managed to recover everything!",
  },
  {
    name: "Emma Williams",
    device: "HP Spectre x360",
    rating: 5,
    text: "Quick battery replacement service. My laptop now lasts all day again. Highly recommended!",
  },
];

function LaptopSelection() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Professional Laptop Repair Services</h1>
          <p style={styles.heroSubtitle}>
            Expert technicians, genuine parts, and fast turnaround for all major brands
          </p>
          <div style={styles.heroFeatures}>
            <div style={styles.heroFeature}>
              <FaClock size={24} style={styles.heroFeatureIcon} />
              <span>Same Day Service</span>
            </div>
            <div style={styles.heroFeature}>
              <FaShieldAlt size={24} style={styles.heroFeatureIcon} />
              <span>90-Day Warranty</span>
            </div>
            <div style={styles.heroFeature}>
              <FaTools size={24} style={styles.heroFeatureIcon} />
              <span>Expert Technicians</span>
            </div>
          </div>
          <a href="/contact" style={styles.heroCTA}>
            Get Free Diagnosis <FaArrowRight style={{ marginLeft: '8px' }} />
          </a>
        </div>
      </section>

      {/* Brands Section */}
      <section style={styles.brandsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Brands We Service</h2>
          <p style={styles.sectionSubtitle}>
            Specialized in all major laptop brands with certified expertise
          </p>
        </div>
        <div style={styles.brandsGrid}>
          {brands.map((brand) => (
            <div
              key={brand.name}
              style={{
                ...styles.brandCard,
                ...(selectedBrand === brand.name ? styles.brandCardActive : {}),
                borderColor: selectedBrand === brand.name ? brand.color : '#e0e0e0',
              }}
              onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
              }}
            >
              <brand.Icon size={48} style={{ color: brand.color, marginBottom: '12px' }} />
              <h3 style={styles.brandName}>{brand.name}</h3>
              <p style={styles.brandDescription}>{brand.description}</p>
              <div style={{ ...styles.brandCheckmark, opacity: selectedBrand === brand.name ? 1 : 0 }}>
                <FaCheck size={16} color="white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Repair Services</h2>
          <p style={styles.sectionSubtitle}>
            From simple fixes to complex repairs, we handle it all
          </p>
        </div>
        <div style={styles.servicesGrid}>
          {repairServices.map((service, index) => (
            <div
              key={service.name}
              style={{
                ...styles.serviceCard,
                ...(hoveredService === index ? styles.serviceCardHover : {}),
              }}
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {service.popular && <div style={styles.popularBadge}>Popular</div>}
              <service.Icon size={40} style={styles.serviceIcon} />
              <h3 style={styles.serviceName}>{service.name}</h3>
              <p style={styles.serviceDescription}>{service.description}</p>
              <div style={styles.serviceTurnaround}>
                <FaClock size={14} style={{ marginRight: '6px' }} />
                {service.turnaround}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section style={styles.processSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Simple 4-step process to get your laptop fixed</p>
        </div>
        <div style={styles.processSteps}>
          {[
            { step: 1, title: 'Contact Us', description: 'Call or fill out our online form' },
            { step: 2, title: 'Free Diagnosis', description: 'We identify the issue at no cost' },
            { step: 3, title: 'Transparent Quote', description: 'Get upfront pricing before repair' },
            { step: 4, title: 'Fast Repair', description: 'Expert fix with warranty included' },
          ].map((item, index) => (
            <div key={item.step} style={styles.processStep}>
              <div style={styles.stepNumber}>{item.step}</div>
              <h3 style={styles.stepTitle}>{item.title}</h3>
              <p style={styles.stepDescription}>{item.description}</p>
              {index < 3 && <div style={styles.stepConnector}></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
        </div>
        <div style={styles.testimonialContainer}>
          <FaQuoteLeft size={40} style={styles.quoteIcon} />
          <div style={styles.testimonialContent}>
            <p style={styles.testimonialText}>{testimonials[currentTestimonial].text}</p>
            <div style={styles.testimonialAuthor}>
              <div style={styles.testimonialRating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} color="#ffc107" />
                ))}
              </div>
              <p style={styles.testimonialName}>{testimonials[currentTestimonial].name}</p>
              <p style={styles.testimonialDevice}>{testimonials[currentTestimonial].device}</p>
            </div>
          </div>
          <div style={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.testimonialDot,
                  ...(index === currentTestimonial ? styles.testimonialDotActive : {}),
                }}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Fix Your Laptop?</h2>
          <p style={styles.ctaSubtitle}>
            Get a free diagnosis and competitive quote today
          </p>
          <div style={styles.ctaButtons}>
            <a href="/contact" style={styles.primaryButton}>
              Request Quote Online
            </a>
            <a href="tel:+447438780903" style={styles.secondaryButton}>
              <FaPhoneAlt style={{ marginRight: '8px' }} />
              Call +44 7438 780903
            </a>
          </div>
          <div style={styles.ctaFeatures}>
            <div style={styles.ctaFeature}>
              <FaCheck style={{ marginRight: '8px', color: '#4CAF50' }} />
              Free Diagnosis
            </div>
            <div style={styles.ctaFeature}>
              <FaCheck style={{ marginRight: '8px', color: '#4CAF50' }} />
              No Fix, No Fee
            </div>
            <div style={styles.ctaFeature}>
              <FaCheck style={{ marginRight: '8px', color: '#4CAF50' }} />
              90-Day Warranty
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#333',
    overflow: 'hidden',
  },
  
  // Hero Section
  heroSection: {
    position: 'relative',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    opacity: 0.95,
    zIndex: -1,
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '800px',
    color: 'white',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '700',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    marginBottom: '40px',
    opacity: 0.9,
  },
  heroFeatures: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  heroFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1rem',
  },
  heroFeatureIcon: {
    opacity: 0.9,
  },
  heroCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'white',
    color: '#1a73e8',
    padding: '16px 32px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  
  // Brands Section
  brandsSection: {
    padding: '80px 20px',
    background: '#f8f9fa',
  },
  brandsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  brandCard: {
    background: 'white',
    padding: '32px 24px',
    borderRadius: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid #e0e0e0',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
  },
  brandCardActive: {
    borderWidth: '2px',
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '8px',
  },
  brandDescription: {
    fontSize: '0.875rem',
    color: '#666',
  },
  brandCheckmark: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '24px',
    height: '24px',
    background: '#4CAF50',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease',
  },
  
  // Services Section
  servicesSection: {
    padding: '80px 20px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  serviceCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid #e0e0e0',
    position: 'relative',
    cursor: 'pointer',
  },
  serviceCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
    borderColor: '#1a73e8',
  },
  popularBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#ff6b6b',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  serviceIcon: {
    color: '#1a73e8',
    marginBottom: '16px',
  },
  serviceName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '12px',
  },
  serviceDescription: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '16px',
  },
  serviceTurnaround: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    color: '#1a73e8',
    fontWeight: '500',
  },
  
  // Process Section
  processSection: {
    padding: '80px 20px',
    background: '#f8f9fa',
  },
  processSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1000px',
    margin: '0 auto',
    flexWrap: 'wrap',
    gap: '32px',
  },
  processStep: {
    flex: '1',
    minWidth: '200px',
    textAlign: 'center',
    position: 'relative',
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    background: '#1a73e8',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '8px',
  },
  stepDescription: {
    fontSize: '0.875rem',
    color: '#666',
  },
  stepConnector: {
    position: 'absolute',
    top: '30px',
    left: 'calc(50% + 30px)',
    width: 'calc(100% - 60px)',
    height: '2px',
    background: '#e0e0e0',
    zIndex: -1,
  },
  
  // Testimonials Section
  testimonialsSection: {
    padding: '80px 20px',
    background: 'white',
  },
  testimonialContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
  },
  quoteIcon: {
    color: '#e0e0e0',
    marginBottom: '24px',
  },
  testimonialContent: {
    marginBottom: '40px',
  },
  testimonialText: {
    fontSize: '1.25rem',
    fontStyle: 'italic',
    lineHeight: '1.8',
    marginBottom: '32px',
    color: '#333',
  },
  testimonialAuthor: {
    marginTop: '24px',
  },
  testimonialRating: {
    marginBottom: '12px',
  },
  testimonialName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '4px',
  },
  testimonialDevice: {
    fontSize: '0.875rem',
    color: '#666',
  },
  testimonialDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  testimonialDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  testimonialDotActive: {
    background: '#1a73e8',
    transform: 'scale(1.2)',
  },
  
  // CTA Section
  ctaSection: {
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    color: 'white',
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '40px',
    opacity: 0.9,
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'white',
    color: '#1a73e8',
    padding: '16px 32px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  secondaryButton: {
    background: 'transparent',
    color: 'white',
    padding: '16px 32px',
    border: '2px solid white',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  ctaFeatures: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  ctaFeature: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
  },
  
  // Common styles
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: '1.125rem',
    color: '#666',
  },
};

export default LaptopSelection;