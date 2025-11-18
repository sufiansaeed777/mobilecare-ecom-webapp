// src/pages/About.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FaHandshake,
  FaCogs,
  FaRecycle,
  FaUserTie,
  FaQuoteLeft,
  FaPhoneAlt,
  // FaEnvelope, 
  FaTools,
  FaMapMarkerAlt,
  FaStar,      
  FaArrowLeft, 
  FaArrowRight 
} from 'react-icons/fa';
import AnimatedBackground from '../components/AnimatedBackground';
import { Link } from 'react-router-dom';

// Copied from Home.js: Testimonials Data and URL
const testimonialsData = [
  { id: 1, text: "Amazing staff and great prices everything is best price for all technology and amazing vapes. Great repair time and prices. I recommend you come here and get your technology fixed and get cases for all.", author: "Dale Nelson", rating: 5, details: "Local Guide·48 reviews·28 photos" },
  { id: 2, text: "Had to have stuff transferred from my old phone to new. The screen on old phone was broken so couldn't see anything. It took a few hours for them to do it but managed it all ok. Good service good price too £50. Another shop told me I would need a new screen for the old phone??", author: "Jayne Anderson-eade", rating: 4, details: "Local Guide·22 reviews·1 photo" },
  { id: 3, text: "Repaired my really badly damaged s24 (after going through the lawn mower). All done the same day, these guys are excellent.", author: "Kevin cook", rating: 5, details: "Local Guide·31 reviews" },
  { id: 4, text: "I have been going to mobile care for a number of years they are experienced help and reasonably priced I always recommend people to go there. Have always been happy with their work and they have always been able to help. I wouldn’t go anywhere else.", author: "Marion Hart", rating: 5, details: "1 review" },
  { id: 5, text: "Friendly efficient and good value. Have used them a few times and never had a negative thing to say about them.", author: "Annabel Tyndall", rating: 5, details: "Local Guide·19 reviews·9 photos" },
  { id: 6, text: "Good service! Did screen replacement for a Samsung tablet and it's as good as new. Highly recommend", author: "Cerezo Audi", rating: 5, details: "3 reviews" },
  { id: 7, text: "Unreliable, took my ipad to change the battery , they had some agro with it and sent somewhere else to repair got after 4 weeks and was not done right, as you hold the ipad up it turns of by itself i mentioned it to them and they said …More", author: "henry bannar", rating: 1, details: "4 reviews" },
  { id: 8, text: "Santos took in 2 devices for me and within a day, has resolved the issue on both. I was expecting it the next day, but he called me the same day and let me know they were both done.", author: "G Man", rating: 5, details: "5 reviews" },
  { id: 9, text: "Very helpful, quick to find problem with my phone and resolve. Attentive and polite staff.", author: "Laura Smith", rating: 5, details: "5 reviews" },
  { id: 10, text: "I could have gone into a long review, all I can say is I am concerned how quick customer service can change from staff from one visit to the next to this outlet. My husband was polite and got spoken to in such a vile, ill manner by three …More", author: "A Reviewer", rating: 1, details: "Local Guide·26 reviews·16 photos" },
  { id: 11, text: "DO NOT RECOMMEND! I recently got my camera fixed and screen. They said it might be the lense but at the time couldn’t acces my camera so just put a new glass bit on. When they said they won’t do nothing if they can’t access the camera. They …More", author: "FTBL Editzz", rating: 1, details: "4 reviews" },
  { id: 12, text: "Can't thank this shop enough. Quick reliable friendly staff and didn't get ripped off either. Needed a replacement screen for my Samsung phone as dropped ot and cracked the screen but what I didn't realise is I'd actually damaged the camera …More", author: "lesley butcher", rating: 5, details: "4 reviews·1 photo" },
  { id: 13, text: "The gentleman in the shop were amazing. Very polite and professional. Supporting local smaller businesses is the way forward. If what you want is not in the shop, ask them and if they can they will order it in. Nothing is too much bother in there, and they just gave me an amazing deal on grape prime ! So pop in ,say hello", author: "Cheryl Walls", rating: 5, details: "7 reviews" },
  { id: 14, text: "Great, friendly, and fast service! Good quality and reasonable price. He alsogave me a student discount, and he offered a warranty too", author: "Gayatri Sahaay", rating: 5, details: "5 reviews·3 photos" },
  { id: 15, text: "My laptop's camera suddenly stopped working right before a meeting, and I had only 30 minutes. They managed to fix it in just 10 minutes! I'm truly grateful for their speedy service. The staff is consistently friendly, always greeting you with a smile. I highly recommend this place to anyone.🤍👏", author: "Mansi Malla", rating: 5, details: "7 reviews·1 photo" },
  { id: 16, text: "Wonderful!! Phone screen (very broken) sorted in 30 mins with best service ever!! Used these guys several times before. Totally recommended! 👍👍", author: "Davina McFadyen", rating: 5, details: "3 reviews·6 photos" },
  { id: 17, text: "Absolutely helpful guy. Delighted with the service", author: "Linda Bristow", rating: 5, details: "3 reviews" },
  { id: 18, text: "This is my 3 times I'm using this shop very good service and friendly staffs highly recommended this shop Thank you so much", author: "Thomas Ofori", rating: 5, details: "2 reviews" },
  { id: 19, text: "Phoned up this morning and they managed to replace my phone screen within an hour at a very reasonable price! Really lovely helpful people. Thank you!", author: "Lauren Johnson", rating: 5, details: "8 reviews·2 photos" },
  { id: 20, text: "Today I'm buying few accessories like headphones, tempered glasses and cases they give me good discount and staff are very helpful. Highly recommend this shop thank you", author: "hewa ozeri", rating: 5, details: "1 review" },
  { id: 21, text: "Really helpful couldn't enough for me. Strongly recommend coming to this shop.", author: "Michael Street", rating: 5, details: "1 review" },
  { id: 22, text: "This is the 2nd time I dealt with this shop because I found them efficient and honest particularly a young man named Santos", author: "Saeed Yafai", rating: 5, details: "3 reviews" },
  { id: 23, text: "My screen was absolutely kaput. They fixed it in half hour for 70 pounds. What a bargain! I’ll definitely come back the next time I need a new screen", author: "Jake Davey", rating: 5, details: "1 review" },
  { id: 24, text: "I had a fantastic experience at this phone repair shop. The staff was incredibly helpful and efficiently fixed both my iPhone camera lens and screen. Special thanks to Santo for providing outstanding customer service. Highly recommend this place for any phone repairs!", author: "Clare Pier", rating: 5, details: "1 review" },
  { id: 25, text: "Amazing and friendly service! Quality service provided by Santos! Absolute life saver changed my broken screen and battery and provided a comlimentary screen protector. Recommended highly!", author: "Fabian Carvalho", rating: 5, details: "1 review" },
  { id: 26, text: "The guys are super friendly and very informative. They will do their best to serve and inform as much as you need. They take their time with customers. …More", author: "Danielle Earl", rating: 5, details: "4 reviews·1 photo" },
  { id: 27, text: "used them twice now - great price, friendly staff and very quick service!!", author: "Waishe M", rating: 5, details: "2 reviews" },
  { id: 28, text: "Really chuffed, this is a well run shop with friendly staff who are professional. I had my screen replaced as it had smashed and it was completed within 40 minutes to a seamless finish. Their pricing is competitive and service with a smile. So glad I put my custom here and support the 'local business'. Good job fellas, will definitely recommend you.", author: "Charlotte MetzHastings", rating: 5, details: "Local Guide·165 reviews·45 photos" }
];

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=mobile+care&rlz=1C1GCEU_enGB1161GB1161&oq=mobile+care&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQRRgnGDsyCAgCEEUYJxg7MgcIAxAAGIAEMgoIBBAAGLEDGIAEMgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMjQ5MWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8&zx=1748755641088&no_sw_cr=1&lqi=Cgttb2JpbGUgY2FyZUjGxcaxnaqAgAhaFRAAEAEYABgBIgttb2JpbGUgY2FyZZIBGG1vYmlsZV9waG9uZV9yZXBhaXJfc2hvcKoBRBABKg8iC21vYmlsZSBjYXJlKAAyHhABIhoLUdB65z8pGh6mzmVc6Rav0Snbvt4gX5PSejIPEAIiC21vYmlsZSBjYXJl#cobssid=s&lkt=LocalPoiReviews&rlimm=1287333568660302002";


export default function About() {
  // Testimonial Slider Logic 
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
    startAutoplay(); 
  };
  
  const currentTestimonial = testimonialsData.length > 0 ? testimonialsData[currentTestimonialIndex] : null;

  return (
    <div className="about-page" style={pageStyle}>
      {/* ===== HERO SECTION ===== */}
      <section className="about-hero" style={heroSectionStyle}>
        <AnimatedBackground />
        <div style={heroOverlayStyle}>
          <h1 style={heroTitleStyle}>Welcome to mobile care</h1>
          <p style={heroSubtitleStyle}>
            Your Expert in Device Care and Repair
          </p>
          <Link to="/contact" style={heroButtonStyle}>
            Get in Touch
          </Link>
        </div>
      </section>

      {/* ===== OUR STORY SECTION ===== */}
      <section style={storySectionStyle}>
        <div style={storyContainerStyle}>
          <div style={storyHeaderStyle}>
            <h2 style={sectionTitleStyle}>Our Story</h2>
            <div style={accentLineStyle}></div>
          </div>
          
          <div style={storyContentStyle}>
            <div style={storyImageContainerStyle}>
              <div style={storyImageStyle}></div>
              <div style={storyImageOverlayStyle}>
                <span style={yearBadgeStyle}>2001</span>
              </div>
            </div>
            
            <div style={storyTextStyle}>
              <p style={paragraphStyle}>
                Founded in <strong style={{color: '#1E3A8A'}}>2001</strong>, mobile care began with a clear vision: to provide affordable, swift, and high-quality repair services for mobile devices. Born from the observation that local repair companies were either overcharging or sluggish, mobile care initially offered a unique 'come to you' service during the COVID-19 lockdown, repairing devices at customer locations while other shops were closed.
              </p>
              <p style={paragraphStyle}>
                Today, mobile care stands as a testament to our commitment to exceptional service, offering a comprehensive range of in-house repairs, from basic screen and battery replacements to advanced data recovery. We don't just replace parts; we excel in <em style={{color: '#1E3A8A', fontWeight: 'bold'}}>micro soldering damaged logic boards</em> and offer glass-only repairs for Apple Watches and iPads.
              </p>
              <div style={contactBoxStyle}> 
                <h4 style={contactBoxTitleStyle}>Visit Us Today</h4>
                <div style={contactOptionsStyle}>
                  <Link to="/location" style={contactOptionStyle}>
                    <FaMapMarkerAlt style={contactIconStyle} />
                    <span>Find Us</span>
                  </Link>
                  <Link to="/booking" style={contactOptionStyle}>
                    <FaTools style={contactIconStyle} />
                    <span>Book Online</span>
                  </Link>
                  <a href="tel:01689825549" style={contactOptionStyle}>
                    <FaPhoneAlt style={contactIconStyle} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section style={valuesSectionStyle}>
        <div style={storyContainerStyle}> 
          <div style={storyHeaderStyle}>
            <h2 style={{...sectionTitleStyle, color: '#1E3A8A'}}>Why Choose mobile care?</h2>
            <div style={{...accentLineStyle, backgroundColor: '#1E3A8A'}}></div>
          </div>

          <div style={valuesContainerStyle}>
            <EnhancedValueCard
              icon={<FaCogs size={48} />}
              title="State-of-the-Art Equipment"
              text="Thousands invested in screen refurbishing equipment and a microsoldering lab for precision repairs."
            />
            <EnhancedValueCard
              icon={<FaHandshake size={48} />}
              title="Quality and Affordability"
              text="Precision repairs at competitive prices with rigorous testing using specialist software."
            />
            <EnhancedValueCard
              icon={<FaUserTie size={48} />}
              title="Specialized Services"
              text="We excel in micro soldering damaged logic boards and offer glass-only repairs for Apple Watches and iPads."
            />
            <EnhancedValueCard
              icon={<FaRecycle size={48} />}
              title="Rigorous Testing"
              text="Every part is inspected, and repairs are tested with specialist software to ensure quality."
            />
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL SECTION (NOW DYNAMIC) ===== */}
      <section style={dynamicTestimonialSectionStyle}> 
        <div style={{...aboutSectionHeaderStyle, marginBottom: '1rem' }}> 
          <h2 style={aboutSectionTitleStyle}>What Our Customers Say</h2>
          <div style={aboutAccentLineStyle}></div>
           <p style={aboutAverageRatingStyle}>Average Rating: 4.7 <FaStar style={{ color: '#FFD700', verticalAlign: 'middle', marginLeft: '5px' }} /></p>
        </div>

        <div style={dynamicTestimonialContainerStyle}> 
          {currentTestimonial ? (
            <div
              key={currentTestimonial.id}
              style={{
                ...dynamicTestimonialCardStyle, 
                opacity: testimonialOpacity,
                transition: `opacity ${FADE_DURATION}ms ease-in-out`,
              }}
            >
              <div style={aboutQuoteIconStyle}>"</div> 
              <p style={dynamicTestimonialTextStyle}> 
                {currentTestimonial.text}
              </p>
              <div style={aboutRatingStyle}> 
                {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                  <FaStar key={i} style={aboutStarStyle} /> 
                ))}
                {currentTestimonial.rating && currentTestimonial.rating < 5 && [...Array(5 - currentTestimonial.rating)].map((_, i) => (
                  <FaStar key={`empty-${i}`} style={{ ...aboutStarStyle, color: '#e0e0e0' }} />
                ))}
              </div>
              <p style={dynamicTestimonialAuthorStyle}>- {currentTestimonial.author}</p> 
              {currentTestimonial.details && <p style={dynamicTestimonialDetailsStyle}>{currentTestimonial.details}</p>} 
            </div>
          ) : (
            <p>Loading testimonials...</p>
          )}
        </div>

        <div style={dynamicTestimonialNavContainerStyle}> 
          <button onClick={() => handleNavClick('prev')} style={dynamicTestimonialNavButtonStyle} aria-label="Previous testimonial">
            <FaArrowLeft />
          </button>
          <button onClick={() => handleNavClick('next')} style={dynamicTestimonialNavButtonStyle} aria-label="Next testimonial">
            <FaArrowRight />
          </button>
        </div>
         <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" style={dynamicAllReviewsLinkStyle}> 
            See All Our Google Reviews
        </a>
      </section>

      {/* ===== CONTACT CTA SECTION ===== */}
      <section style={ctaSectionStyle}>
        <h2 style={ctaTitleStyle}>Ready to Experience Expert Device Care?</h2>
        <p style={ctaTextStyle}>
          Walk-ins welcome, call ahead advised. Mail-in repairs also available. 
          Open Monday & Saturday 9:00-7:00, Sunday 10:00-5:00. 
          Contact us at 01689 825549 or ask.mobilecare@outlook.com
        </p>
        <div style={ctaButtonsContainerStyle}>
          {/* MODIFIED "Book a Repair" LINK BELOW */}
          <Link to="/#device-selection" style={primaryButtonStyle}>
            Book a Repair
          </Link>
          <Link to="/contact" style={secondaryButtonStyle}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

// === Enhanced Value Card Component === 
function EnhancedValueCard({ icon, title, text }) {
  return (
    <div style={valueCardStyle}>
      <div style={iconContainerStyle}>
        {React.cloneElement(icon, { style: { color: '#fff' } })}
      </div>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={cardTextStyle}>{text}</p>
    </div>
  );
}

// === Styles ===
const pageStyle = {
  fontFamily: "'Poppins', sans-serif",
  color: '#1E3A8A', 
};

const heroSectionStyle = {
  position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', height: '500px', overflow: 'hidden', textAlign: 'center',
};
const heroOverlayStyle = {
  position: 'absolute', zIndex: 2, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', width: '90%', maxWidth: '700px',
};
const heroTitleStyle = {
  fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1E3A8A',
};
const heroSubtitleStyle = {
  fontSize: '1.5rem', maxWidth: '600px', margin: '0 auto 2rem auto', color: '#1E3A8A', lineHeight: '1.4',
};
const heroButtonStyle = {
  display: 'inline-block', padding: '0.8rem 2rem', backgroundColor: '#1E3A8A', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '1.1rem', transition: 'all 0.3s ease', border: '2px solid #1E3A8A',
};

const storySectionStyle = { padding: '5rem 1rem', backgroundColor: '#fff' };
const storyContainerStyle = { maxWidth: '1200px', margin: '0 auto' };
const storyHeaderStyle = { textAlign: 'center', marginBottom: '3rem' };

const storyContentStyle = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', justifyContent: 'center' };
const storyImageContainerStyle = { flex: '1 1 300px', position: 'relative', maxWidth: '450px', height: '350px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' };
const storyImageStyle = { width: '100%', height: '100%', backgroundColor: '#e8f0fe', backgroundImage: 'url(/images/WebsiteLogo.JPEG)', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
const storyImageOverlayStyle = { position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' };
const yearBadgeStyle = { display: 'inline-block', backgroundColor: '#1E3A8A', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' };
const storyTextStyle = { flex: '1 1 300px', maxWidth: '600px' };
const paragraphStyle = { fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem', color: '#1E3A8A' };
const contactBoxStyle = { backgroundColor: '#e8f0fe', borderRadius: '8px', padding: '1.5rem', marginTop: '2rem' };
const contactBoxTitleStyle = { fontSize: '1.3rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem', textAlign: 'center' };
const contactOptionsStyle = { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' };
const contactOptionStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#1E3A8A', textDecoration: 'none', padding: '0.5rem', transition: 'transform 0.3s ease' };
const contactIconStyle = { fontSize: '1.5rem', marginBottom: '0.5rem' };

const valuesSectionStyle = { padding: '5rem 1rem', backgroundColor: '#f4f7fc' };
const valuesContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' };
const valueCardStyle = { backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
const iconContainerStyle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' };
const cardTitleStyle = { fontSize: '1.3rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem' };
const cardTextStyle = { fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' };

const sectionTitleStyle = { 
  fontSize: '2.5rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem',
};
const accentLineStyle = { 
  width: '80px', height: '4px', backgroundColor: '#1E3A8A', margin: '0 auto',
};

const dynamicTestimonialSectionStyle = { 
  padding: "5rem 2rem", backgroundColor: "#e8f0fe", 
  minHeight: "500px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
};
const aboutSectionHeaderStyle = { 
  textAlign: "center", marginBottom: "1rem", 
};
const aboutSectionTitleStyle = { 
  fontSize: "2.5rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "1rem",
};
const aboutAccentLineStyle = { 
  width: "80px", height: "4px", backgroundColor: "#1E3A8A", margin: "0 auto 1.5rem",
};
const aboutAverageRatingStyle = { 
    fontSize: "1.1rem", color: "#1E3A8A", marginTop: "-1rem", marginBottom: "2rem",
};
const dynamicTestimonialContainerStyle = { 
  maxWidth: "800px", width: "100%", margin: "0 auto", minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
};
const dynamicTestimonialCardStyle = { 
  backgroundColor: "#fff", padding: "3rem", borderRadius: "12px", position: "relative", boxShadow: "0 8px 30px rgba(30, 58, 138, 0.1)", textAlign: "center", width: "100%",
};
const aboutQuoteIconStyle = { 
  fontSize: '3rem', color: '#e8f0fe', position: 'absolute', top: '2rem', left: '2rem', zIndex:0, 
};
const dynamicTestimonialTextStyle = { 
  fontSize: "1.3rem", color: "#1E3A8A", lineHeight: "1.6", marginBottom: "2rem", position: "relative", zIndex: 1, minHeight: "100px",
};
const aboutRatingStyle = { 
  display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "1rem",
};
const aboutStarStyle = { 
  color: "#FFD700", fontSize: "1.2rem",
};
const dynamicTestimonialAuthorStyle = { 
  fontSize: "1.1rem", fontWeight: "bold", color: "#1E3A8A",
};
const dynamicTestimonialDetailsStyle = { 
  fontSize: "0.9rem", color: "#555", marginTop: "0.25rem",
};
const dynamicTestimonialNavContainerStyle = { 
    display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', width: '100%', maxWidth: '800px',
};
const dynamicTestimonialNavButtonStyle = { 
    background: 'transparent', border: `2px solid ${"#1E3A8A"}`, color: "#1E3A8A", borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.3s ease',
};
const dynamicAllReviewsLinkStyle = { 
    display: 'block', textAlign: 'center', marginTop: '1.5rem', color: "#1E3A8A", textDecoration: 'underline', fontSize: '1rem', fontWeight: '500', transition: 'color 0.3s ease',
};

const ctaSectionStyle = { padding: '5rem 1rem', textAlign: 'center', backgroundColor: '#e8f0fe' };
const ctaTitleStyle = { fontSize: '2.2rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem' };
const ctaTextStyle = { fontSize: '1.1rem', color: '#1E3A8A', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: '1.6' };
const ctaButtonsContainerStyle = { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' };

const primaryButtonStyle = { 
  padding: '0.8rem 2rem', backgroundColor: '#1E3A8A', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s ease', border: '2px solid #1E3A8A',
};
const secondaryButtonStyle = { 
  padding: '0.8rem 2rem', backgroundColor: 'transparent', color: '#1E3A8A', border: '2px solid #1E3A8A', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s ease',
};