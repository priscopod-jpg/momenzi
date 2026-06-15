import React, { useState } from 'react';
import { 
  UserCheck, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  ExternalLink, 
  User, 
  Mail, 
  CheckCircle,
  Copy,
  Clock3,
  Coffee,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { MeetingType, Booking } from '../types';

interface BookingsViewProps {
  meetingTypes: MeetingType[];
  onAddMeetingType: (mt: Omit<MeetingType, 'id'>) => void;
  bookings: Booking[];
  onAddBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => void;
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
}

export default function BookingsView({
  meetingTypes,
  onAddMeetingType,
  bookings,
  onAddBooking,
  onUpdateBooking
}: BookingsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'types' | 'slots' | 'visitor'>('types');
  const [copiedLink, setCopiedLink] = useState(false);

  // New meeting type form
  const [isCreatingType, setIsCreatingType] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDur, setNewDur] = useState(30);
  const [newSlug, setNewSlug] = useState('');

  // Settings
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [bufferMins, setBufferMins] = useState(15);
  const [maxMeetings, setMaxMeetings] = useState(4);

  // Visitor simulator form
  const [selectedType, setSelectedType] = useState<MeetingType | null>(null);
  const [visitorDay, setVisitorDay] = useState('2026-06-16');
  const [visitorSlot, setVisitorSlot] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNotes, setGuestNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  // Available slots for visitor simulator
  const availableSlots = [
    '09:30 AM', '10:00 AM', '11:15 AM', '01:30 PM', '02:00 PM', '03:45 PM', '04:15 PM'
  ];

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateMeetingType = () => {
    if (!newTitle.trim()) return;
    onAddMeetingType({
      title: newTitle.trim(),
      description: newDesc.trim(),
      duration: Number(newDur),
      slug: newSlug.trim() || newTitle.trim().toLowerCase().replace(/\s+/g, '-'),
      isActive: true
    });

    setNewTitle('');
    setNewDesc('');
    setNewDur(30);
    setNewSlug('');
    setIsCreatingType(false);
  };

  const handleVisitorBooking = () => {
    if (!guestName.trim() || !guestEmail.trim() || !visitorSlot || !selectedType) return;

    // Convert slot format to ISO String
    const startHourStr = visitorSlot.includes('PM') && !visitorSlot.startsWith('12') 
      ? (parseInt(visitorSlot.split(':')[0]) + 12).toString() 
      : visitorSlot.split(':')[0].padStart(2, '0');
    const startMinsStr = visitorSlot.split(':')[1].split(' ')[0];
    const startISO = `${visitorDay}T${startHourStr}:${startMinsStr}:00Z`;

    // End ISO calculation
    const endHourNum = parseInt(startHourStr) + Math.floor((parseInt(startMinsStr) + selectedType.duration) / 60);
    const endMinsNum = (parseInt(startMinsStr) + selectedType.duration) % 60;
    const endISO = `${visitorDay}T${endHourNum.toString().padStart(2, '0')}:${endMinsNum.toString().padStart(2, '0')}:00Z`;

    onAddBooking({
      meetingTypeId: selectedType.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestNotes: guestNotes.trim(),
      startTime: startISO,
      endTime: endISO,
      status: 'confirmed'
    });

    setBookingConfirmed(true);
    setConfirmedBookingId(Math.random().toString(36).substring(4).toUpperCase());
  };

  const resetVisitorForm = () => {
    setGuestName('');
    setGuestEmail('');
    setGuestNotes('');
    setVisitorSlot('');
    setSelectedType(null);
    setBookingConfirmed(false);
  };

  const getMeetingName = (id: string) => {
    const mt = meetingTypes.find(m => m.id === id);
    return mt ? mt.title : 'Custom Session';
  };

  return (
    <div className="space-y-6" id="bookings-portal-root">
      
      {/* Bookings Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight">
            Seamless Bookings Engine
          </h2>
          <p className="text-sm text-slate-400">Establish availability matrices, package sessions, and launch public schedulers.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('types')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeSubTab === 'types' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Types & Logs
          </button>
          <button
            onClick={() => setActiveSubTab('slots')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeSubTab === 'slots' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Working Hours
          </button>
          <button
            onClick={() => setActiveSubTab('visitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeSubTab === 'visitor' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Visitor Simulator
          </button>
        </div>
      </div>

      {/* Main Container Views */}
      {activeSubTab === 'types' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Columns: Meeting Types Packages (Span-2) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-white">Active Session Packages</h3>
                  <p className="text-xs text-slate-400">Pre-configured bookings offerings for client access</p>
                </div>

                <button
                  onClick={() => setIsCreatingType(!isCreatingType)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition rounded-lg text-xs font-bold text-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Build Package</span>
                </button>
              </div>

              {/* Package creator */}
              {isCreatingType && (
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/20 mb-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Package Name</label>
                      <input
                        type="text"
                        placeholder="Intro Strategy call..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Duration (Mins)</label>
                      <input
                        type="number"
                        value={newDur}
                        onChange={(e) => setNewDur(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Slug URL suffix</label>
                      <input
                        type="text"
                        placeholder="strategy-call"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Scope Description</label>
                    <input
                      type="text"
                      placeholder="Introductory alignment conversation regarding business scales..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsCreatingType(false)} className="px-3 py-1 text-xs text-slate-400">Cancel</button>
                    <button onClick={handleCreateMeetingType} className="px-3.5 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-bold">Generate Offer</button>
                  </div>
                </div>
              )}

              {/* Grid offers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetingTypes.map((mt) => (
                  <div key={mt.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-indigo-500/20 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200">{mt.title}</h4>
                        <span className="flex items-center space-x-1 text-[10px] bg-slate-950 border border-slate-800 text-indigo-400 font-mono px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>{mt.duration} mins</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        {mt.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 italic">/book/{mt.slug}</span>
                      <button
                        onClick={() => {
                          setSelectedType(mt);
                          setActiveSubTab('visitor');
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                      >
                        Client Preview <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmed / Booked items Logs */}
            <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
              <h3 className="font-display font-bold text-base text-white mb-4">Upcoming Booking Logs</h3>

              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No active client bookings logged. Launch booking link in visitor simulator!
                  </div>
                ) : (
                  bookings.map((bk) => {
                    const startD = new Date(bk.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const startT = new Date(bk.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                    return (
                      <div key={bk.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-3.5">
                          <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 rounded-lg">
                            <UserCheck className="w-4.5 h-4.5" />
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-200">
                              {bk.guestName} <span className="font-mono text-slate-500">({bk.guestEmail})</span>
                            </h4>
                            <p className="text-[11px] text-indigo-400 font-mono mt-0.5">
                              {getMeetingName(bk.meetingTypeId)} • {startD} at {startT}
                            </p>
                            {bk.guestNotes && (
                              <p className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded mt-2 border border-slate-850 italic">
                                "{bk.guestNotes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions cancel/reschedule */}
                        <div className="flex items-center space-x-2 self-end md:self-center">
                          <button
                            onClick={() => onUpdateBooking(bk.id, { status: 'cancelled' })}
                            className="px-2.5 py-1 text-[11px] font-mono border border-rose-500/30 hover:bg-rose-500 hover:text-white rounded text-rose-400 font-bold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Public Share Link quick box */}
          <div className="space-y-6">
            <div className="bg-blur-card rounded-2xl p-6 shadow-lg border-l-4 border-l-indigo-500">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-2">My Booking Slug</h3>
              <p className="text-xs text-slate-400 mb-4">Share your public operating system URL where guests book instantly.</p>

              <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-indigo-300 truncate">momenzi.os/book/alex-morgan</span>
                <button
                  onClick={handleCopyLink}
                  className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
                >
                  {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {copiedLink && (
                <p className="text-[11px] text-emerald-400 mt-2 font-mono">Copied to secure buffer!</p>
              )}
            </div>

            <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
              <h3 className="font-display font-semibold text-xs text-slate-300 mb-3">Notification Reminders</h3>
              <ul className="space-y-3.5 text-xs text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Immediate reservation emails dispatched to client and guest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>24-hour reminder email sequences scheduled automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>1-hour reminder Slack warnings configured correctly.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Booking Working Hours view */}
      {activeSubTab === 'slots' && (
        <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-white">Daily Operational Grid & Rules</h3>
            <p className="text-xs text-slate-400">Configure global buffer protocols to prevent conflicts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase font-mono">Working Hours Start</label>
              <input
                type="time"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 mt-1 text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold uppercase font-mono">Working Hours End</label>
              <input
                type="time"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 mt-1 text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold uppercase font-mono">Buffer Period (Mins)</label>
              <input
                type="number"
                value={bufferMins}
                onChange={(e) => setBufferMins(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 mt-1 text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold uppercase font-mono">Max Bookings Per Day</label>
              <input
                type="number"
                value={maxMeetings}
                onChange={(e) => setMaxMeetings(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 mt-1 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs text-indigo-300">
            <Coffee className="w-5 h-5 text-indigo-400" />
            <span>Momenzi OS intelligently blocks scheduling overlays and maintains buffer sequences automatically.</span>
          </div>

          <div className="flex justify-end pt-3">
            <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white text-xs font-bold transition">
              Apply Operational Rules
            </button>
          </div>
        </div>
      )}

      {/* Visitor Simulator View */}
      {activeSubTab === 'visitor' && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Neon design touch */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 blur-3xl -z-10" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-widest">Public Client Booking Frame (Alex Morgan)</span>
            </div>
            
            <button onClick={resetVisitorForm} className="text-xs text-slate-500 hover:text-slate-200 font-mono underline">
              Reset Form
            </button>
          </div>

          {bookingConfirmed ? (
            /* Booking Confirmed State Receipt */
            <div className="text-center py-12 space-y-6 max-w-md mx-auto animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-400">The consultation has been securely logged on Momenzi calendars.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">RESERVATION ID</span>
                  <span className="text-emerald-400 font-bold">{confirmedBookingId}</span>
                </div>
                <hr className="border-slate-900" />
                <div className="flex justify-between">
                  <span className="text-slate-500">SESSION</span>
                  <span className="text-slate-200">{selectedType?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SCHEDULER</span>
                  <span className="text-slate-200">{guestName} ({guestEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TIMELINE</span>
                  <span className="text-indigo-300 font-bold">{visitorDay} at {visitorSlot}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-mono">An dynamic dispatch alert has been logged into logs tracker.</p>
              
              <button
                onClick={resetVisitorForm}
                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white transition"
              >
                Schedule Another Call
              </button>
            </div>
          ) : (
            /* Interaction state */
            <div className="space-y-6">
              
              {!selectedType ? (
                /* Step 1: Select Type */
                <div className="space-y-4">
                  <h3 className="font-display font-medium text-lg text-white">Select consulting framework:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meetingTypes.map((mt) => (
                      <div
                        key={mt.id}
                        onClick={() => setSelectedType(mt)}
                        className="p-5 bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-xl cursor-pointer transition text-left space-y-2.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-200 group-hover:text-indigo-300">{mt.title}</h4>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded font-bold">{mt.duration}m</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{mt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Step 2: Date, Slot & Guest Form */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  
                  {/* Left Column: Selection review */}
                  <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-850">
                    <button onClick={() => setSelectedType(null)} className="text-xs text-indigo-400 hover:underline">← Choose different package</button>
                    <div>
                      <h4 className="font-display font-bold text-lg text-white">{selectedType.title}</h4>
                      <p className="text-xs font-mono text-slate-400 flex items-center mt-1">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {selectedType.duration} minutes alignment
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">{selectedType.description}</p>

                    <div className="space-y-3.5 pt-3">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Select Date Slot</label>
                        <input
                          type="date"
                          value={visitorDay}
                          onChange={(e) => setVisitorDay(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 mt-1 text-slate-300"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Available timings</label>
                        <div className="grid grid-cols-3 gap-1.5 mt-1">
                          {availableSlots.map((sl) => (
                            <button
                              key={sl}
                              onClick={() => setVisitorSlot(sl)}
                              className={`p-1.5 text-[10px] rounded border font-mono transition
                                ${visitorSlot === sl 
                                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200' 
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/20'
                                }
                              `}
                            >
                              {sl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Guest Information */}
                  <div className="space-y-4">
                    <h4 className="font-display font-medium text-xs text-slate-400 uppercase tracking-wider font-mono">Guest Details</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400">Your Full Name</label>
                        <input
                          type="text"
                          placeholder="Alex Morgan"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs mt-1 text-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400">Email Address</label>
                        <input
                          type="email"
                          placeholder="alex@morgan.net"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs mt-1 text-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400">Any notes or context goals?</label>
                        <textarea
                          placeholder="Brief goals about SaaS roadmap Postgres migration goals..."
                          value={guestNotes}
                          onChange={(e) => setGuestNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs mt-1 text-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      id="submit-visitor-booking"
                      onClick={handleVisitorBooking}
                      disabled={!guestName.trim() || !guestEmail.trim() || !visitorSlot}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      Process Instant Booking
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
