// src/pages/Home.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMobileAlt,
  FaTabletAlt,
  FaLaptop,
  FaGamepad,
  FaClock,
  FaHeadphones,
  FaShieldAlt,
  FaBolt,
  FaSmile,
  FaStar,
  FaArrowRight,
  FaArrowLeft, // Added for back button
  FaTools,
  FaCalendarCheck,
  FaTruck,
  FaCheck,
  FaShoppingCart,
  FaTags,
  FaExchangeAlt
} from 'react-icons/fa';

const testimonialsData = [
  { id: 1, text: "Amazing staff and great prices everything is best price for all technology and amazing vapes. Great repair time and prices. I recommend you come here and get your technology fixed and get cases for all.", author: "Dale Nelson", rating: 5, details: "Local Guide·48 reviews·28 photos" },
  { id: 2, text: "Had to have stuff transferred from my old phone to new. The screen on old phone was broken so couldn't see anything. It took a few hours for them to do it but managed it all ok. Good service good price too £50. Another shop told me I would need a new screen for the old phone??", author: "Jayne Anderson-eade", rating: 4, details: "Local Guide·22 reviews·1 photo" },
  { id: 3, text: "Repaired my really badly damaged s24 (after going through the lawn mower). All done the same day, these guys are excellent.", author: "Kevin cook", rating: 5, details: "Local Guide·31 reviews" },
  { id: 4, text: "I have been going to mobile care for a number of years they are experienced help and reasonably priced I always recommend people to go there. Have always been happy with their work and they have always been able to help. I wouldn't go anywhere else.", author: "Marion Hart", rating: 5, details: "1 review" },
  { id: 5, text: "Friendly efficient and good value. Have used them a few times and never had a negative thing to say about them.", author: "Annabel Tyndall", rating: 5, details: "Local Guide·19 reviews·9 photos" },
  { id: 6, text: "Good service! Did screen replacement for a Samsung tablet and it's as good as new. Highly recommend", author: "Cerezo Audi", rating: 5, details: "3 reviews" },
  { id: 7, text: "Unreliable, took my ipad to change the battery , they had some agro with it and sent somewhere else to repair got after 4 weeks and was not done right, as you hold the ipad up it turns of by itself i mentioned it to them and they said …More", author: "henry bannar", rating: 1, details: "4 reviews" },
  { id: 8, text: "Santos took in 2 devices for me and within a day, has resolved the issue on both. I was expecting it the next day, but he called me the same day and let me know they were both done.", author: "G Man", rating: 5, details: "5 reviews" },
  { id: 9, text: "Very helpful, quick to find problem with my phone and resolve. Attentive and polite staff.", author: "Laura Smith", rating: 5, details: "5 reviews" },
  { id: 10, text: "I could have gone into a long review, all I can say is I am concerned how quick customer service can change from staff from one visit to the next to this outlet. My husband was polite and got spoken to in such a vile, ill manner by three …More", author: "A Reviewer", rating: 1, details: "Local Guide·26 reviews·16 photos" },
  { id: 11, text: "DO NOT RECOMMEND! I recently got my camera fixed and screen. They said it might be the lense but at the time couldn't acces my camera so just put a new glass bit on. When they said they won't do nothing if they can't access the camera. They …More", author: "FTBL Editzz", rating: 1, details: "4 reviews" },
  { id: 12, text: "Can't thank this shop enough. Quick reliable friendly staff and didn't get ripped off either. Needed a replacement screen for my Samsung phone as dropped ot and cracked the screen but what I didn't realise is I'd actually damaged the camera …More", author: "lesley butcher", rating: 5, details: "4 reviews·1 photo" },
  { id: 13, text: "The gentleman in the shop were amazing. Very polite and professional. Supporting local smaller businesses is the way forward. If what you want is not in the shop, ask them and if they can they will order it in. Nothing is too much bother in there, and they just gave me an amazing deal on grape prime ! So pop in ,say hello", author: "Cheryl Walls", rating: 5, details: "7 reviews" },
  { id: 14, text: "Great, friendly, and fast service! Good quality and reasonable price. He also gave me a student discount, and he offered a warranty too", author: "Gayatri Sahaay", rating: 5, details: "5 reviews·3 photos" },
  { id: 15, text: "My laptop's camera suddenly stopped working right before a meeting, and I had only 30 minutes. They managed to fix it in just 10 minutes! I'm truly grateful for their speedy service. The staff is consistently friendly, always greeting you with a smile. I highly recommend this place to anyone.🤍👏", author: "Mansi Malla", rating: 5, details: "7 reviews·1 photo" },
  { id: 16, text: "Wonderful!! Phone screen (very broken) sorted in 30 mins with best service ever!! Used these guys several times before. Totally recommended! 👍👍", author: "Davina McFadyen", rating: 5, details: "3 reviews·6 photos" },
  { id: 17, text: "Absolutely helpful guy. Delighted with the service", author: "Linda Bristow", rating: 5, details: "3 reviews" },
  { id: 18, text: "This is my 3 times I'm using this shop very good service and friendly staffs highly recommended this shop Thank you so much", author: "Thomas Ofori", rating: 5, details: "2 reviews" },
  { id: 19, text: "Phoned up this morning and they managed to replace my phone screen within an hour at a very reasonable price! Really lovely helpful people. Thank you!", author: "Lauren Johnson", rating: 5, details: "8 reviews·2 photos" },
  { id: 20, text: "Today I'm buying few accessories like headphones, tempered glasses and cases they give me good discount and staff are very helpful. Highly recommend this shop thank you", author: "hewa ozeri", rating: 5, details: "1 review" },
  { id: 21, text: "Really helpful couldn't enough for me. Strongly recommend coming to this shop.", author: "Michael Street", rating: 5, details: "1 review" },
  { id: 22, text: "This is the 2nd time I dealt with this shop because I found them efficient and honest particularly a young man named Santos", author: "Saeed Yafai", rating: 5, details: "3 reviews" },
  { id: 23, text: "My screen was absolutely kaput. They fixed it in half hour for 70 pounds. What a bargain! I'll definitely come back the next time I need a new screen", author: "Jake Davey", rating: 5, details: "1 review" },
  { id: 24, text: "I had a fantastic experience at this phone repair shop. The staff was incredibly helpful and efficiently fixed both my iPhone camera lens and screen. Special thanks to Santo for providing outstanding customer service. Highly recommend this place for any phone repairs!", author: "Clare Pier", rating: 5, details: "1 review" },
  { id: 25, text: "Amazing and friendly service! Quality service provided by Santos! Absolute life saver changed my broken screen and battery and provided a comlimentary screen protector. Recommended highly!", author: "Fabian Carvalho", rating: 5, details: "1 review" },
  { id: 26, text: "The guys are super friendly and very informative. They will do their best to serve and inform as much as you need. They take their time with customers. …More", author: "Danielle Earl", rating: 5, details: "4 reviews·1 photo" },
  { id: 27, text: "used them twice now - great price, friendly staff and very quick service!!", author: "Waishe M", rating: 5, details: "2 reviews" },
  { id: 28, text: "Really chuffed, this is a well run shop with friendly staff who are professional. I had my screen replaced as it had smashed and it was completed within 40 minutes to a seamless finish. Their pricing is competitive and service with a smile. So glad I put my custom here and support the 'local business'. Good job fellas, will definitely recommend you.", author: "Charlotte MetzHastings", rating: 5, details: "Local Guide·165 reviews·45 photos" }
];

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=mobile+care&rlz=1C1GCEU_enGB1161GB1161&oq=mobile+care&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQRRgnGDsyCAgCEEUYJxg7MgcIAxAAGIAEMgoIBBAAGLEDGIAEMgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMjQ5MWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8&zx=1748755641088&no_sw_cr=1&lqi=Cgttb2JpbGUgY2FyZUjGxcaxnaqAgAhaFRAAEAEYABgBIgttb2JpbGUgY2FyZZIBGG1vYmlsZV9waG9uZV9yZXBhaXJfc2hvcKoBRBABKg8iC21vYmlsZSBjYXJlKAAyHhABIhoLUdB65z8pGh6mzmVc6Rav0Snbvt4gX5PSejIPEAIiC21vYmlsZSBjYXJl#cobssid=s&lkt=LocalPoiReviews&rlimm=1287333568660302002";


function Home() {
  const deviceSectionRef = useRef(null);
  const [hoveredDevice, setHoveredDevice] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonialOpacity, setTestimonialOpacity] = useState(1);
  const intervalRef = useRef(null);
  const FADE_DURATION = 500; // ms
  const SLIDE_INTERVAL = 7000; // ms

  const changeTestimonial = useCallback((newIndexCallback) => {
    setTestimonialOpacity(0);
    setTimeout(() => {
      setCurrentTestimonialIndex(typeof newIndexCallback === 'function' ? newIndexCallback : () => newIndexCallback);
      setTestimonialOpacity(1);
    }, FADE_DURATION);
  }, []);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (testimonialsData.length > 0) {
      intervalRef.current = setInterval(() => {
        changeTestimonial(prevIndex => (prevIndex + 1) % testimonialsData.length);
      }, SLIDE_INTERVAL);
    }
  }, [testimonialsData.length, changeTestimonial]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoplay]);

  const handleNavClick = (direction) => {
    changeTestimonial(prevIndex => {
      if (direction === 'next') {
        return (prevIndex + 1) % testimonialsData.length;
      } else { // prev
        return (prevIndex - 1 + testimonialsData.length) % testimonialsData.length;
      }
    });
    startAutoplay(); // Restart autoplay timer
  };

  // Updated handleBookClick with better scroll implementation
  const handleBookClick = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Try multiple methods to ensure scrolling works
    const targetElement = document.getElementById('device-selection');
    
    if (targetElement) {
      // Method 1: Using scrollIntoView (most reliable)
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
      
      // Method 2: Fallback with offset calculation
      setTimeout(() => {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = rect.top + scrollTop - 80; // 80px offset for header
        
        if (Math.abs(window.pageYOffset - targetTop) > 10) {
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else if (deviceSectionRef.current) {
      // Method 3: Using ref as fallback
      const element = deviceSectionRef.current;
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      console.error('Could not find device selection section');
      // Method 4: Try to find by searching for the section
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading && heading.textContent.includes('Select Your Device')) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  const devices = [
    { id: 'phone', title: 'PHONE', icon: FaMobileAlt, path: '/phone' },
    { id: 'tablet', title: 'TABLET', icon: FaTabletAlt, path: '/tablet' },
    { id: 'laptop', title: 'LAPTOP', icon: FaLaptop, path: '/laptop' },
    { id: 'watch', title: 'WATCH', icon: FaClock, path: '/watch' },
    { id: 'console', title: 'GAMING CONSOLES', icon: FaGamepad, path: '/console' },
    { id: 'accessories', title: 'ACCESSORIES', icon: FaHeadphones, path: '/services?device=accessories' },
  ];

  const otherServices = [
    { id: 'buy', title: 'BUY A DEVICE', icon: FaShoppingCart, path: '/buy', description: 'Browse our selection of certified pre-owned devices.' },
    { id: 'sell', title: 'SELL YOUR DEVICE', icon: FaTags, path: '/sell', description: 'Get a competitive offer for your old phone, tablet, or watch.' },
    { id: 'tradein', title: 'TRADE-IN', icon: FaExchangeAlt, path: '/trade-in', description: 'Upgrade your device and save by trading in your old one.' },
  ];

  const processSteps = [
    { number: 1, title: 'Pick Your Device & Issue', description: 'Select your device type and tell us what needs fixing.', icon: FaTools },
    { number: 2, title: 'Schedule an Appointment', description: 'Choose a convenient date and time that works for you.', icon: FaCalendarCheck },
    { number: 3, title: 'Drop Off or Mail In', description: 'Bring your device to our store or ship it to us securely.', icon: FaTruck },
    { number: 4, title: 'Enjoy Your Repaired Device', description: 'Most repairs are completed in 30 minutes or less!', icon: FaCheck },
  ];

  const highlights = [
    { icon: FaShieldAlt, title: 'Expert Repairs', description: 'Skilled technicians with years of experience' },
    { icon: FaBolt, title: 'Fast Service', description: 'Most repairs completed within 30 minutes' },
    { icon: FaSmile, title: 'Satisfaction Guarantee', description: 'No fix, no fee policy on all repairs' },
  ];

  const currentTestimonial = testimonialsData.length > 0 ? testimonialsData[currentTestimonialIndex] : null;

  return (
    <div style={pageStyle}>
      {/* ========== HERO SECTION ========== */}
      <section style={heroSectionStyle}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          poster="/images/hero-poster.jpg"
          style={videoStyle}
        >
          <source src="/videos/Mobile_Shop_Sanjay.mp4" type="video/mp4" />
          <source src="/videos/Mobile_Shop_Sanjay.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div style={overlayStyle} />
        <div style={heroContentStyle}>
          <div style={heroContentContainerStyle}>
            <h1 style={heroTitleStyle}>Expert Device Repairs</h1>
            <p style={heroSubtitleStyle}>Fast, reliable repairs for phones, tablets, laptops and more. Most fixes completed in 30 minutes!</p>
            <div style={heroButtonsContainerStyle}>
              <button
                onClick={handleBookClick}
                style={primaryButtonStyle}
                onMouseOver={(e) => { 
                  e.currentTarget.style.backgroundColor = "#fff"; 
                  e.currentTarget.style.color = "#1E3A8A"; 
                }}
                onMouseOut={(e) => { 
                  e.currentTarget.style.backgroundColor = "#1E3A8A"; 
                  e.currentTarget.style.color = "#fff"; 
                }}
                type="button"
              >
                Book a Repair
              </button>
              <Link to="/contact" style={secondaryButtonStyle}> Contact Us </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HIGHLIGHTS SECTION ========== */}
      <section style={highlightsSectionStyle}>
        <div style={highlightsContainerStyle}>
          {highlights.map((highlight, index) => (
            <div key={index} style={highlightCardStyle}>
              <highlight.icon style={highlightIconStyle} />
              <h3 style={highlightTitleStyle}>{highlight.title}</h3>
              <p style={highlightDescriptionStyle}>{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== DEVICE SELECTION SECTION ========== */}
      <section id="device-selection" ref={deviceSectionRef} style={deviceSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Select Your Device for Repair</h2>
          <div style={accentLineStyle}></div>
          <p style={sectionDescriptionStyle}>Choose your device type to see available repair options</p>
        </div>
        <div style={deviceGridStyle}>
          {devices.map((device) => (
            <Link
              key={device.id}
              to={device.path}
              style={{
                ...deviceCardStyle,
                transform: hoveredDevice === device.id ? 'translateY(-10px)' : 'translateY(0)',
                boxShadow: hoveredDevice === device.id ? '0 15px 30px rgba(30, 58, 138, 0.15)' : '0 5px 15px rgba(30, 58, 138, 0.05)',
              }}
              onMouseEnter={() => setHoveredDevice(device.id)}
              onMouseLeave={() => setHoveredDevice(null)}
            >
              <div style={deviceIconContainerStyle}><device.icon style={deviceIconStyle} /></div>
              <p style={deviceNameStyle}>{device.title}</p>
              <div style={deviceViewRepairsStyle}>
                <span style={viewRepairsTextStyle}>View Repairs</span>
                <FaArrowRight style={arrowIconStyle} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== BUY/SELL/TRADE SECTION ========== */}
      <section style={buySellTradeSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>More Than Just Repairs</h2>
          <div style={accentLineStyle}></div>
          <p style={sectionDescriptionStyle}>Explore options to buy certified pre-owned devices, sell your old ones, or trade them in for an upgrade.</p>
        </div>
        <div style={buySellTradeGridStyle}>
          {otherServices.map((service) => (
            <Link
              key={service.id}
              to={service.path}
              style={{
                ...serviceCardStyle,
                transform: hoveredService === service.id ? 'translateY(-10px)' : 'translateY(0)',
                boxShadow: hoveredService === service.id ? '0 15px 30px rgba(30, 58, 138, 0.15)' : '0 5px 15px rgba(30, 58, 138, 0.05)',
              }}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div style={deviceIconContainerStyle}><service.icon style={deviceIconStyle} /></div>
              <h3 style={serviceTitleStyle}>{service.title}</h3>
              <p style={serviceDescriptionStyle}>{service.description}</p>
              <div style={deviceViewRepairsStyle}>
                <span style={viewRepairsTextStyle}>Learn More</span>
                <FaArrowRight style={arrowIconStyle} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section style={processSection}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>How It Works</h2>
          <div style={accentLineStyle}></div>
          <p style={sectionDescriptionStyle}>Our simple repair process from start to finish</p>
        </div>
        <div style={processStepsContainerStyle}>
          {processSteps.map((step, index) => (
            <div key={index} style={processStepStyle}>
              <div style={stepNumberContainerStyle}>
                <step.icon style={stepIconStyle} />
                <div style={stepNumberStyle}><span>{step.number}</span></div>
              </div>
              <div style={stepContentStyle}>
                <h3 style={stepTitleStyle}>{step.title}</h3>
                <p style={stepDescriptionStyle}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION (UPDATED) ========== */}
      <section style={testimonialsSection}>
        <div style={{...sectionHeaderStyle, marginBottom: '1rem' }}> {/* Reduced margin for tighter layout */}
          <h2 style={sectionTitleStyle}>What Our Customers Say</h2>
          <div style={accentLineStyle}></div>
           <p style={averageRatingStyle}>Average Rating: 4.7 <FaStar style={{ color: '#FFD700', verticalAlign: 'middle', marginLeft: '5px' }} /></p>
        </div>

        <div style={testimonialsContainerStyle}>
          {currentTestimonial ? (
            <div
              key={currentTestimonial.id}
              style={{
                ...testimonialCardStyle, 
                opacity: testimonialOpacity,
                transition: `opacity ${FADE_DURATION}ms ease-in-out`,
              }}
            >
              <div style={quotationMarkStyle}>"</div>
              <p style={testimonialTextStyle}>
                {currentTestimonial.text}
              </p>
              <div style={ratingStyle}>
                {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                  <FaStar key={i} style={starStyle} />
                ))}
                {currentTestimonial.rating && currentTestimonial.rating < 5 && [...Array(5 - currentTestimonial.rating)].map((_, i) => (
                  <FaStar key={`empty-${i}`} style={{ ...starStyle, color: '#e0e0e0' }} />
                ))}
              </div>
              <p style={testimonialAuthorStyle}>- {currentTestimonial.author}</p>
              {currentTestimonial.details && <p style={testimonialDetailsStyle}>{currentTestimonial.details}</p>}
            </div>
          ) : (
            <p>Loading testimonials...</p>
          )}
        </div>

        <div style={testimonialNavContainerStyle}>
          <button onClick={() => handleNavClick('prev')} style={testimonialNavButtonStyle} aria-label="Previous testimonial">
            <FaArrowLeft />
          </button>
          <button onClick={() => handleNavClick('next')} style={testimonialNavButtonStyle} aria-label="Next testimonial">
            <FaArrowRight />
          </button>
        </div>
         <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" style={allReviewsLinkStyle}>
            See All Our Google Reviews
        </a>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section style={ctaSectionStyle}>
        <div style={ctaContainerStyle}>
          <h2 style={ctaTitleStyle}>Ready to Fix Your Device?</h2>
          <p style={ctaDescriptionStyle}>
            Book online now or visit our store in Gravesend. We offer same-day repairs for most issues!
          </p>
          <div style={ctaButtonsContainerStyle}>
            {/* MODIFIED "Book Now" BUTTON BELOW */}
            <button
              onClick={handleBookClick}
              style={ctaPrimaryButtonStyle}
              onMouseOver={(e) => { 
                e.currentTarget.style.backgroundColor = "#fff"; 
                e.currentTarget.style.color = "#1E3A8A";
              }}
              onMouseOut={(e) => { 
                e.currentTarget.style.backgroundColor = "#1E3A8A"; 
                e.currentTarget.style.color = "#fff";
              }}
              type="button"
            >
              Book Now
            </button>
            <Link to="/contact" style={ctaSecondaryButtonStyle}> Contact Us </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== STYLES =====
const pageStyle = {
  fontFamily: "'Poppins', sans-serif",
};

const heroSectionStyle = {
  position: "relative", width: "100%", height: "80vh", minHeight: "600px", maxHeight: "800px", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
};
const videoStyle = {
  position: "absolute", 
  top: "50%", 
  left: "50%", 
  width: "100%", 
  height: "100%", 
  minWidth: "100%",
  minHeight: "100%",
  objectFit: "cover", 
  transform: "translate(-50%, -50%)",
  zIndex: 1,
  imageRendering: "-webkit-optimize-contrast",
  backfaceVisibility: "hidden",
  perspective: "1000px",
};
const overlayStyle = {
  position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4))", zIndex: 2,
};
const heroContentStyle = {
  position: "relative", zIndex: 3, width: "100%", maxWidth: "1200px", padding: "0 2rem 3rem 2rem", display: "flex", justifyContent: "flex-start",
};
const heroContentContainerStyle = { maxWidth: "600px", textAlign: "left" };
const heroTitleStyle = {
  fontSize: "3.5rem", fontWeight: "bold", color: "#FFFFFF", marginBottom: "1.5rem", lineHeight: 1.2, textShadow: '0 3px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.5)',
};
const heroSubtitleStyle = {
  fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "2rem", lineHeight: 1.6, textShadow: '0 2px 4px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 0, 0, 0.5)',
};
const heroButtonsContainerStyle = { display: "flex", gap: "1rem", flexWrap: "wrap" };
const primaryButtonStyle = {
  backgroundColor: "#1E3A8A", color: "#fff", border: "2px solid #1E3A8A", padding: "0.9rem 2rem", fontSize: "1.1rem", fontWeight: "600", borderRadius: "4px", cursor: "pointer", transition: "all 0.3s ease", textDecoration: "none", display: "inline-block", boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};
const secondaryButtonStyle = {
  backgroundColor: "#fff", color: "#1E3A8A", border: "2px solid #1E3A8A", padding: "0.9rem 2rem", fontSize: "1.1rem", fontWeight: "600", borderRadius: "4px", cursor: "pointer", transition: "all 0.3s ease", textDecoration: "none", display: "inline-block", boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};

const highlightsSectionStyle = { padding: "3rem 2rem", backgroundColor: "#f8fbff" };
const highlightsContainerStyle = {
  maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem",
};
const highlightCardStyle = {
  backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", flex: "1 1 300px", maxWidth: "350px", textAlign: "center", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
};
const highlightIconStyle = { fontSize: "2.5rem", color: "#1E3A8A", marginBottom: "1rem" };
const highlightTitleStyle = { fontSize: "1.3rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "0.75rem" };
const highlightDescriptionStyle = { fontSize: "1rem", color: "#1E3A8A", lineHeight: 1.6 };

const sectionHeaderStyle = { textAlign: "center", marginBottom: "3rem" };
const sectionTitleStyle = { fontSize: "2.5rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "1rem" };
const accentLineStyle = { width: "80px", height: "4px", backgroundColor: "#1E3A8A", margin: "0 auto 1.5rem" };
const sectionDescriptionStyle = { fontSize: "1.1rem", color: "#1E3A8A", maxWidth: "700px", margin: "0 auto", lineHeight: 1.7 };

const deviceSectionStyle = { padding: "5rem 2rem", backgroundColor: "#fff" };
const deviceGridStyle = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto",
};
const deviceCardStyle = {
  backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", border: "1px solid #e8f0fe", transition: "all 0.3s ease", textDecoration: "none", position: "relative", overflow: "hidden",
};
const deviceIconContainerStyle = {
  width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", transition: "all 0.3s ease",
};
const deviceIconStyle = { fontSize: "2.5rem", color: "#1E3A8A" };
const deviceNameStyle = { fontSize: "1.1rem", fontWeight: "600", color: "#1E3A8A", marginBottom: "1rem" };
const deviceViewRepairsStyle = { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "auto" };
const viewRepairsTextStyle = { fontSize: "0.9rem", color: "#1E3A8A" };
const arrowIconStyle = { fontSize: "0.8rem", color: "#1E3A8A" };

const buySellTradeSectionStyle = { padding: "5rem 2rem", backgroundColor: "#f8fbff" };
const buySellTradeGridStyle = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto",
};
const serviceCardStyle = {
  backgroundColor: "#fff", padding: "2.5rem 2rem", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", border: "1px solid #e8f0fe", transition: "all 0.3s ease", textDecoration: "none", position: "relative", overflow: "hidden", minHeight: "350px", justifyContent: "flex-start",
};
const serviceTitleStyle = { fontSize: "1.3rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "1rem", marginTop: "0.5rem" };
const serviceDescriptionStyle = { fontSize: "1rem", color: "#1E3A8A", lineHeight: 1.6, marginBottom: "1.5rem", flexGrow: 1 };

const processSection = { padding: "5rem 2rem", backgroundColor: "#fff" };
const processStepsContainerStyle = {
  maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem",
};
const processStepStyle = {
  display: "flex", alignItems: "flex-start", gap: "2rem", backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 12px rgba(30, 58, 138, 0.08)", border: "1px solid #e8f0fe",
};
const stepNumberContainerStyle = { position: "relative", display: "flex", alignItems: "center", justifyContent: "center" };
const stepIconStyle = { fontSize: "2rem", color: "#1E3A8A" };
const stepNumberStyle = {
  position: "absolute", top: "-10px", right: "-15px", width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#1E3A8A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold",
};
const stepContentStyle = { flex: 1 };
const stepTitleStyle = { fontSize: "1.3rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "0.75rem" };
const stepDescriptionStyle = { fontSize: "1rem", color: "#1E3A8A", lineHeight: 1.6 };

// Testimonials Section Styles
const testimonialsSection = {
  padding: "5rem 2rem", backgroundColor: "#e8f0fe", minHeight: "500px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", 
};
const averageRatingStyle = {
    fontSize: "1.1rem",
    color: "#1E3A8A",
    marginTop: "-1rem", 
    marginBottom: "2rem",
};
const testimonialsContainerStyle = {
  maxWidth: "800px", width: "100%", margin: "0 auto", minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", 
};
const testimonialCardStyle = { 
  backgroundColor: "#fff", padding: "3rem", borderRadius: "12px", position: "relative", boxShadow: "0 8px 30px rgba(30, 58, 138, 0.1)", textAlign: "center", width: "100%",
};
const quotationMarkStyle = {
  position: "absolute", top: "20px", left: "30px", fontSize: "6rem", lineHeight: 0.8, color: "#e8f0fe", fontFamily: "Georgia, serif", zIndex: 0,
};
const testimonialTextStyle = {
  fontSize: "1.3rem", color: "#1E3A8A", lineHeight: 1.6, marginBottom: "2rem", position: "relative", zIndex: 1, minHeight: "100px", 
};
const ratingStyle = { display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "1rem" };
const starStyle = { color: "#FFD700", fontSize: "1.2rem" };
const testimonialAuthorStyle = { fontSize: "1.1rem", fontWeight: "bold", color: "#1E3A8A" };
const testimonialDetailsStyle = { fontSize: "0.9rem", color: "#555", marginTop: "0.25rem" };

const testimonialNavContainerStyle = { 
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem', 
    width: '100%',
    maxWidth: '800px', 
};
const testimonialNavButtonStyle = {
    background: 'transparent',
    border: `2px solid ${"#1E3A8A"}`,
    color: "#1E3A8A",
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
};
const allReviewsLinkStyle = {
    display: 'block',
    textAlign: 'center',
    marginTop: '1.5rem',
    color: "#1E3A8A",
    textDecoration: 'underline',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.3s ease',
};


// CTA Section Styles
const ctaSectionStyle = { padding: "5rem 2rem", backgroundColor: "#fff" }; 
const ctaContainerStyle = { maxWidth: "800px", margin: "0 auto", textAlign: "center" };
const ctaTitleStyle = { fontSize: "2.5rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "1.5rem" };
const ctaDescriptionStyle = { fontSize: "1.1rem", color: "#1E3A8A", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" };
const ctaButtonsContainerStyle = { display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" };
const ctaPrimaryButtonStyle = { ...primaryButtonStyle, padding: "1rem 2.5rem" };
const ctaSecondaryButtonStyle = { ...secondaryButtonStyle, padding: "1rem 2.5rem" };

export default Home;