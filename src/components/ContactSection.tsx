import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CalendarCheck, CheckCircle2, Ticket, Sparkles } from "lucide-react";
import { ARCHITECT_PROFILE } from "../data/portfolioData";

export default function ContactSection() {
  // Booking State
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [projectType, setProjectType] = useState("Architecture Spec");
  const [messageText, setMessageText] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedSlot, setSelectedSlot] = useState("10:00 - 11:00");
  const [hasBooked, setHasBooked] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);

  // Message Inquiry form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [hasInquired, setHasInquired] = useState(false);

  // Time Slots
  const timeSlots = ["09:00 - 10:00", "10:00 - 11:00", "14:00 - 15:00", "16:00 - 17:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Handle consultation booking form
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail) return;

    const newTicket = {
      id: "TKT-" + Math.floor(100000 + Math.random() * 900000),
      name: bookingName,
      email: bookingEmail,
      projectType,
      day: selectedDay,
      timeSlot: selectedSlot,
      message: messageText,
      timestamp: new Date().toLocaleString(),
    };

    // Store in LocalStorage
    const currentBookings = JSON.parse(localStorage.getItem("architect_bookings") || "[]");
    localStorage.setItem("architect_bookings", JSON.stringify([...currentBookings, newTicket]));

    setActiveTicket(newTicket);
    setHasBooked(true);

    // Reset fields
    setBookingName("");
    setBookingEmail("");
    setMessageText("");
  };

  // Handle generalized contact inquiry form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    const newInquiry = {
      id: "INQ-" + Math.floor(100000 + Math.random() * 900000),
      name: contactName,
      email: contactEmail,
      subject: contactSubject || "General SPEC Inquiry",
      message: contactMsg,
      timestamp: new Date().toLocaleString(),
    };

    const currentInquiries = JSON.parse(localStorage.getItem("architect_inquiries") || "[]");
    localStorage.setItem("architect_inquiries", JSON.stringify([...currentInquiries, newInquiry]));

    setHasInquired(true);

    // Reset fields
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMsg("");

    // Automatically dismiss announcement after 5 seconds
    setTimeout(() => {
      setHasInquired(false);
    }, 6000);
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 bg-[#050505] border-b border-white/5 overflow-hidden">
      {/* Blueprint Grid Lines Backdrop */}
      <div className="sleek-grid absolute inset-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="font-mono text-xs tracking-[0.35em] text-white/50 uppercase">SECTION 04 / ENGAGEMENT</span>
          </div>
          <h2 className="font-display text-3.5xl md:text-5xl font-light tracking-tight text-white mb-2">COLLABORATION & RESERVATIONS</h2>
          <div className="h-[1px] w-20 bg-white/30" />
        </div>

        {/* Layout container - Split columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMN 1: Detailed General Contact and Consultation Booking */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* INQUIRY STATUS CONFIRMATION ALERT */}
            {hasInquired && (
              <div id="inquiry-success-alert" className="p-4 rounded-none bg-white/5 border border-white/20 text-white flex items-start gap-3 animate-fade-in font-mono text-xs">
                <CheckCircle2 className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium uppercase tracking-wider">Inquiry Cataloged Successfully</p>
                  <p className="text-white/60 mt-1">Thank you. Your message has been encrypted and recorded in local telemetry storage. Studio Mearey will reply within 24 working hours.</p>
                </div>
              </div>
            )}

            {/* Standard Inquiry Form */}
            <div className="rounded-none border border-white/5 bg-black/40 p-6 md:p-8 relative">
              <span className="absolute top-0 right-8 transform -translate-y-1/2 font-mono text-[9px] tracking-widest text-white/40 py-0.5 px-2 bg-black border border-white/10 uppercase">
                FORM_INQ_V4
              </span>

              <h3 className="font-display text-xl font-light tracking-tight text-white mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-white/40" />
                DIRECT GENERAL INQUIRIES
              </h3>

              <form onSubmit={handleContactSubmit} id="inquiry-form" className="flex flex-col gap-5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Your Name *</label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Jean Nouvel"
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/45 rounded-none px-4 py-3 text-white placeholder-white/20 font-mono transition-colors outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Your Email *</label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. jean@nouvel.com"
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/45 rounded-none px-4 py-3 text-white placeholder-white/20 font-mono transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-subject" className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Parametric Facade Optimization"
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/45 rounded-none px-4 py-3 text-white placeholder-white/20 font-mono transition-colors outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Describe your design specifications, scope, or parametric needs..."
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/45 rounded-none px-4 py-3 text-white placeholder-white/20 font-mono transition-colors outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-inquiry-button"
                  className="w-full py-3.5 rounded-none bg-zinc-900 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white font-mono text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer uppercase group"
                >
                  <Send className="w-3.5 h-3.5 text-current opacity-50 group-hover:opacity-90 transition-opacity" />
                  TRANSMIT DIGITAL SPEC-RECORD
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 2: Workshop & Consultation scheduler */}
          <div className="lg:col-span-5 flex flex-col gap-6" id="consultation">
            
            {/* Consultation Booking Receipt Modal/Container */}
            {hasBooked && activeTicket ? (
              <div id="booking-success-ticket" className="rounded-none border border-white/20 bg-black/90 relative p-6 flex flex-col gap-5 overflow-hidden animate-fade-in shadow-lg">
                {/* Top Glowing Gradient */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="sleek-grid absolute inset-0 opacity-10 pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-white/60 animate-pulse" />
                    <span className="font-mono text-[9px] tracking-widest text-white/50 uppercase">DIGITAL TICKET</span>
                  </div>
                  <button 
                    onClick={() => setHasBooked(false)}
                    id="clear-ticket-button"
                    className="font-mono text-[9px] tracking-widest text-white/40 hover:text-white underline uppercase"
                  >
                    BOOK ANOTHER
                  </button>
                </div>

                <div className="text-center py-2 z-10">
                  <span className="text-[9px] tracking-widest font-mono text-white/40 block uppercase">CONSULTATION CONFIRMED</span>
                  <span className="font-display text-xl font-light text-white tracking-tight mt-1">{activeTicket.projectType}</span>
                </div>

                {/* Ticket Details */}
                <div className="bg-white/[0.02] border border-white/5 rounded-none p-4 font-mono text-xs flex flex-col gap-2.5 z-10">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40 uppercase text-[9px]">CLIENT</span>
                    <span className="text-white/80 font-light">{activeTicket.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40 uppercase text-[9px]">SCHED SLOT</span>
                    <span className="text-white/80 font-light text-right">{activeTicket.day}, {activeTicket.timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40 uppercase text-[9px]">STATUS</span>
                    <span className="text-white tracking-wider uppercase">● STREAM READY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase text-[9px]">TKT_NUM</span>
                    <span className="text-white font-medium">{activeTicket.id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/50 z-10">
                  <Sparkles className="w-4 h-4 text-white/40 animate-spin" style={{ animationDuration: "10s" }} />
                  <span className="tracking-wide">Interactive 3D stream will start on slot duration.</span>
                </div>

                <div className="border-t border-dashed border-white/10 pt-3 flex flex-col items-center gap-1 z-10 text-[8px] tracking-widest font-mono text-white/30 text-center">
                  <span>SWISS SECTOR D-24 // EXCITON SYNERGY</span>
                  <span>BOOKED ON: {activeTicket.timestamp}</span>
                </div>
              </div>
            ) : (
              // Active Consultation Booking Form
              <div className="rounded-none border border-white/5 bg-black/40 p-6 md:p-8 flex flex-col gap-6 relative">
                <span className="absolute top-0 right-8 transform -translate-y-1/2 font-mono text-[9px] tracking-widest text-white/40 py-0.5 px-2 bg-black border border-white/10 uppercase">
                  OFFICE_SCHEDULE
                </span>

                <h3 className="font-display text-lg font-light tracking-tight text-white flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-white/40" />
                  CO-DESIGN BOOKING
                </h3>

                <form onSubmit={handleBookingSubmit} id="booking-form" className="flex flex-col gap-4 text-xs font-mono">
                  
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-name" className="text-white/40 uppercase text-[9px] tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      id="booking-name"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Richard Serra"
                      className="w-full bg-zinc-900 border border-white/10 focus:border-white/30 rounded-none px-3.5 py-2.5 text-white placeholder-white/20 outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-email" className="text-white/40 uppercase text-[9px] tracking-wider">Your Email *</label>
                    <input
                      type="email"
                      id="booking-email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="e.g. richard@serra.org"
                      className="w-full bg-zinc-900 border border-white/10 focus:border-white/30 rounded-none px-3.5 py-2.5 text-white placeholder-white/20 outline-none"
                    />
                  </div>

                  {/* Consultation Type */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-type" className="text-white/40 uppercase text-[9px] tracking-wider">Discipline Focus</label>
                    <select
                      id="booking-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 focus:border-white/30 rounded-none px-3.5 py-2.5 text-white outline-none"
                    >
                      <option value="Parametric Design Consult">Parametric Optimization (Rhino/Grasshopper)</option>
                      <option value="Residential Spec">Brutalist / Modular Architecture Specs</option>
                      <option value="3D Asset Rendering">3D Environment Modeling (Unreal/VRAY)</option>
                      <option value="General Portfolio Query">Public Art & Space Installations</option>
                    </select>
                  </div>

                  {/* Days Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white/40 uppercase text-[9px] tracking-wider">Select Weekday</span>
                    <div className="flex flex-wrap gap-1">
                      {days.map((day) => (
                        <button
                          key={day}
                          type="button"
                          id={`booking-day-${day.toLowerCase()}`}
                          onClick={() => setSelectedDay(day)}
                          className={`flex-1 py-1 px-2 rounded-none font-mono text-[9px] text-center border transition-colors cursor-pointer ${
                            selectedDay === day 
                              ? "bg-white border-white text-black font-semibold" 
                              : "bg-transparent border-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {day.substring(0, 3).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time slots Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white/40 uppercase text-[9px] tracking-wider">Select Daily Time Window</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          id={`booking-slot-${slot.replace(/\s+/g, "")}`}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-1.5 px-2 rounded-none font-mono text-[9px] text-center border transition-colors cursor-pointer ${
                            selectedSlot === slot 
                              ? "bg-white border-white text-black font-semibold" 
                              : "bg-transparent border-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="book-consultation-button"
                    className="w-full mt-2 py-3 rounded-none bg-zinc-900 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white font-mono text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer uppercase"
                  >
                    <span>SCHEDULE CO-DESIGN CELL</span>
                  </button>

                </form>
              </div>
            )}

            {/* Static Telephone Contact Details */}
            <div className="rounded-none border border-white/5 bg-black/40 p-5 flex flex-col gap-3.5 font-mono text-xs">
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">DIGITAL CHANNELS</span>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-white/10 text-white/60 font-medium">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/30 uppercase tracking-[0.05em]">Direct Email</span>
                  <a href={`mailto:${ARCHITECT_PROFILE.email}`} className="text-white font-light hover:underline underline-offset-4 decoration-white/20 transition-all">{ARCHITECT_PROFILE.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-white/10 text-white/60 font-medium">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/30 uppercase tracking-[0.05em]">STUDIO TELEPHONE</span>
                  <a href={`tel:${ARCHITECT_PROFILE.phone}`} className="text-white font-light hover:underline underline-offset-4 decoration-white/20 transition-all">{ARCHITECT_PROFILE.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-white/10 text-white/60 font-medium">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/30 uppercase tracking-[0.05em]">LOCAL HEADQUARTERS</span>
                  <span className="text-white/60 font-light">{ARCHITECT_PROFILE.address}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
