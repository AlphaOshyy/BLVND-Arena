import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Gamepad2, Instagram, MapPin, Menu, MessageCircle, ShieldCheck, Sparkles, Ticket, Trophy, X, Zap } from 'lucide-react'

const GTA_ART = 'https://www.rockstargames.com/VI/_next/static/media/Official_Cover_Art_landscape.12.uu2irr.2_a.jpg?akim=1&imwidth=3840'
const WHATSAPP_NUMBER = '94770000000'

const games = [
  { id: 'gta6', name: 'Grand Theft Auto VI', short: 'GTA VI', category: 'Featured', featured: true, image: GTA_ART },
  { id: 'fc', name: 'EA Sports FC', short: 'FC', category: 'Sports' },
  { id: 'gt', name: 'Gran Turismo', short: 'GT', category: 'Racing' },
  { id: 'tekken', name: 'Tekken', short: 'Tekken', category: 'Fighting' },
  { id: 'cod', name: 'Call of Duty', short: 'COD', category: 'Action' },
  { id: 'minecraft', name: 'Minecraft', short: 'Minecraft', category: 'Adventure' }
]

const normalPackages = [
  { id: '15', name: '15 MIN', price: 250, detail: 'Quick session' },
  { id: '30', name: '30 MIN', price: 450, detail: 'More time to play' },
  { id: '60', name: '1 HOUR', price: 750, detail: 'The standard session', featured: true }
]

const gtaPackages = [
  { id: 'gta15', name: '15 MIN', price: 300, detail: 'GTA VI quick session' },
  { id: 'gta15snack', name: '15 MIN + SNACK', price: 550, detail: 'Session + snack or drink' },
  { id: 'gta60', name: 'STANDARD', price: 750, detail: '1 hour GTA VI session', featured: true },
  { id: 'gta60combo', name: 'GAMER COMBO', price: 1100, detail: '1 hour + snack or drink' },
  { id: 'crew', name: 'CREW PACK', price: 4200, detail: '4 players + snacks + group photo', featured: true },
  { id: 'vip', name: 'LAUNCH DAY VIP', price: 1150, detail: 'Premium GTA VI experience' }
]

const defaultBookings = JSON.parse(localStorage.getItem('blvndBookings') || '[]')

function money(value) {
  return `Rs. ${value.toLocaleString('en-LK')}`
}

function App() {
  const [page, setPage] = useState(window.location.pathname.startsWith('/admin') ? 'admin' : 'home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(games[0])
  const [selectedPackage, setSelectedPackage] = useState(gtaPackages[2])
  const [bookings, setBookings] = useState(defaultBookings)
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('blvndBookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    document.body.style.overflow = bookingOpen || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [bookingOpen, menuOpen])

  const openBooking = (game = selectedGame, pack = selectedPackage) => {
    setSelectedGame(game)
    setSelectedPackage(pack)
    setBookingOpen(true)
    setMenuOpen(false)
  }

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  if (page === 'admin') {
    return <Admin bookings={bookings} setBookings={setBookings} onBack={() => { window.history.pushState({}, '', '/'); setPage('home') }} />
  }

  return (
    <div className="app-shell">
      <Header onBook={() => openBooking()} onMenu={() => setMenuOpen(true)} />
      <main>
        <Hero onBook={() => openBooking()} />
        <GtaFeature onBook={() => openBooking(games[0], gtaPackages[2])} />
        <Games onBook={openBooking} />
        <Packages onBook={openBooking} />
        <Crew onBook={() => openBooking(games[0], gtaPackages[4])} />
        <Arcade />
        <BookingCTA onBook={() => openBooking()} />
        <Footer />
      </main>
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} onBook={() => openBooking()} />}
      {bookingOpen && <BookingModal game={selectedGame} pack={selectedPackage} setBookings={setBookings} onClose={() => setBookingOpen(false)} onDone={showToast} />}
      {toast && <div className="toast"><Check size={18} /> {toast}</div>}
    </div>
  )
}

function Header({ onBook, onMenu }) {
  return <header className="nav">
    <a className="brand" href="#top" aria-label="BLVND Arena"><span>BLVND</span><small>ARENA</small></a>
    <nav className="desktop-nav">
      <a href="#gta">GTA VI</a><a href="#games">GAMES</a><a href="#packages">PACKAGES</a><a href="#arcade">ARCADE</a>
    </nav>
    <button className="nav-book" onClick={onBook}>BOOK NOW <ArrowRight size={17} /></button>
    <button className="menu-button" onClick={onMenu} aria-label="Open menu"><Menu /></button>
  </header>
}

function Hero({ onBook }) {
  return <section id="top" className="hero section-dark">
    <div className="hero-image" style={{ backgroundImage: `url(${GTA_ART})` }} />
    <div className="hero-noise" />
    <div className="hero-content reveal">
      <div className="eyebrow"><span className="live-dot" /> GALLE, SRI LANKA · BOOKINGS OPEN</div>
      <h1>BLVND<br /><em>ARENA</em></h1>
      <p>Galle's gaming destination. GTA VI experience and sessions across your favourite games.</p>
      <div className="hero-actions"><button className="primary-btn" onClick={onBook}>BOOK A SESSION <ArrowRight size={19} /></button><a className="ghost-btn" href="#games">EXPLORE GAMES</a></div>
    </div>
    <div className="hero-meta"><span>01</span><i /> <span>BLVND / GALLE</span></div>
    <div className="scroll-cue">SCROLL <ChevronDown size={17} /></div>
  </section>
}

function GtaFeature({ onBook }) {
  return <section id="gta" className="gta-section">
    <div className="section-grid">
      <div className="section-copy reveal">
        <span className="section-kicker">FEATURED EXPERIENCE</span>
        <h2>GTA <span>VI</span><br />AT BLVND.</h2>
        <p>Step into Vice City style gaming at BLVND Arena. Choose your session, pick your time, then send the request to our team through WhatsApp.</p>
        <div className="status"><span className="live-dot" /> SESSION BOOKINGS OPEN</div>
        <button className="outline-btn" onClick={onBook}>BOOK GTA VI <ArrowRight size={18} /></button>
      </div>
      <div className="gta-art reveal" style={{ backgroundImage: `url(${GTA_ART})` }}>
        <div className="art-caption"><span>OFFICIAL GTA VI ARTWORK</span><small>Rockstar Games</small></div>
      </div>
    </div>
  </section>
}

function Games({ onBook }) {
  return <section id="games" className="games-section">
    <div className="section-heading reveal"><span className="section-kicker">THE LINEUP</span><h2>CHOOSE<br /><span>YOUR GAME.</span></h2><p>GTA VI gets the spotlight. The rest of the lineup uses the standard BLVND session rates.</p></div>
    <div className="game-grid">
      {games.map((game, index) => <button key={game.id} className={`game-card reveal ${game.featured ? 'game-featured' : ''}`} style={{ '--delay': `${index * 70}ms` }} onClick={() => onBook(game, game.featured ? gtaPackages[2] : normalPackages[2])}>
        {game.image ? <div className="game-photo" style={{ backgroundImage: `url(${game.image})` }} /> : <div className={`game-photo placeholder p${index}`}><Gamepad2 size={42} /></div>}
        <div className="game-overlay" />
        <div className="game-info"><span>{game.category}</span><h3>{game.short}</h3><div className="game-link">BOOK <ArrowRight size={15} /></div></div>
      </button>)}
    </div>
  </section>
}

function Packages({ onBook }) {
  return <section id="packages" className="packages-section">
    <div className="section-heading reveal"><span className="section-kicker">BLVND SESSION RATES</span><h2>PLAY<br /><span>YOUR WAY.</span></h2></div>
    <div className="rate-block reveal"><div className="rate-title"><span>01</span><h3>ALL OTHER GAMES</h3><p>PS5, racing, fighting, sports and more.</p></div><div className="rate-grid">{normalPackages.map((pack) => <PackageCard key={pack.id} pack={pack} onClick={() => onBook(games[1], pack)} />)}</div></div>
    <div className="rate-block gta-rates reveal"><div className="rate-title"><span>02</span><h3>GTA VI EXPERIENCE</h3><p>Featured launch experience at BLVND Arena.</p></div><div className="rate-grid gta-grid">{gtaPackages.map((pack) => <PackageCard key={pack.id} pack={pack} onClick={() => onBook(games[0], pack)} />)}</div></div>
  </section>
}

function PackageCard({ pack, onClick }) {
  return <button className={`package-card ${pack.featured ? 'featured' : ''}`} onClick={onClick}><div className="package-top"><span>{pack.name}</span>{pack.featured && <span className="tag">POPULAR</span>}</div><strong>{money(pack.price)}</strong><p>{pack.detail}</p><div className="package-book">BOOK <ArrowRight size={16} /></div></button>
}

function Crew({ onBook }) {
  return <section className="crew-section">
    <div className="crew-bg" style={{ backgroundImage: `url(${GTA_ART})` }} />
    <div className="crew-overlay" />
    <div className="crew-content reveal"><span className="section-kicker">FOR THE SQUAD</span><h2>BRING<br /><span>YOUR CREW.</span></h2><div className="crew-stats"><div><strong>04</strong><small>PLAYERS</small></div><div><strong>01</strong><small>HOUR</small></div><div><strong>04</strong><small>SNACKS</small></div><div><strong>01</strong><small>GROUP PHOTO</small></div></div><div className="crew-price">Rs. 4,200</div><button className="primary-btn" onClick={onBook}>BOOK CREW PACK <ArrowRight size={19} /></button></div>
  </section>
}

function Arcade() {
  return <section id="arcade" className="arcade-section">
    <div className="section-heading reveal"><span className="section-kicker">THE VENUE</span><h2>MEET<br /><span>BLVND.</span></h2><p>Gaming, racing, snacks, drinks and a place to run the session with your crew.</p></div>
    <div className="venue-grid"><VenueTile icon={<Gamepad2 />} title="CONSOLE ZONE" text="PS5 gaming sessions" /><VenueTile icon={<Trophy />} title="RACING" text="Competitive driving" /><VenueTile icon={<Sparkles />} title="CREW NIGHTS" text="Group sessions and events" /><VenueTile icon={<Zap />} title="SNACKS" text="Fuel for the next round" /></div>
    <div className="location-card reveal"><div><span className="section-kicker">FIND US</span><h3>BLVND ARENA</h3><p>Happugala, Galle, Sri Lanka</p></div><a href="https://www.google.com/maps/search/?api=1&query=Happugala%20Galle%20Sri%20Lanka" target="_blank" rel="noreferrer">GET DIRECTIONS <MapPin size={18} /></a></div>
  </section>
}

function VenueTile({ icon, title, text }) { return <div className="venue-tile reveal"><div className="tile-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div> }

function BookingCTA({ onBook }) { return <section className="booking-cta"><div className="cta-inner reveal"><span className="section-kicker">READY?</span><h2>YOUR SESSION<br /><span>STARTS HERE.</span></h2><button className="primary-btn" onClick={onBook}>BOOK NOW <ArrowRight size={19} /></button></div></section> }

function Footer() { return <footer><div className="footer-brand">BLVND <span>ARENA</span></div><div className="footer-links"><a href="#gta">GTA VI</a><a href="#games">GAMES</a><a href="#packages">PACKAGES</a><a href="#arcade">LOCATION</a><a href="/admin">ADMIN</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BLVND ARENA</span><a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noreferrer">GTA VI MEDIA · ROCKSTAR GAMES</a><span className="social"><Instagram size={15} /> @BLVND</span></div></footer> }

function MobileMenu({ onClose, onBook }) { return <div className="mobile-menu"><button className="close-menu" onClick={onClose}><X /></button><div className="mobile-brand">BLVND <span>ARENA</span></div><nav><a href="#gta" onClick={onClose}>GTA VI</a><a href="#games" onClick={onClose}>GAMES</a><a href="#packages" onClick={onClose}>PACKAGES</a><a href="#arcade" onClick={onClose}>ARCADE</a></nav><button className="primary-btn" onClick={onBook}>BOOK NOW <ArrowRight size={19} /></button></div> }

function BookingModal({ game, pack, setBookings, onClose, onDone }) {
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', players: pack.id === 'crew' ? 4 : 1, note: '' })
  const [sent, setSent] = useState(false)
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.name || !form.phone || !form.date || !form.time) return
    const booking = { id: `BLV-${Date.now().toString().slice(-6)}`, ...form, game: game.short, package: pack.name, price: pack.price, status: 'Pending', createdAt: new Date().toISOString() }
    setBookings((old) => [booking, ...old])
    const text = encodeURIComponent(`BLVND ARENA BOOKING REQUEST\n\nGame: ${game.name}\nPackage: ${pack.name}\nPrice: ${money(pack.price)}\nDate: ${form.date}\nTime: ${form.time}\nPlayers: ${form.players}\nName: ${form.name}\nWhatsApp: ${form.phone}\n${form.note ? `Note: ${form.note}\n` : ''}\nPlease confirm my booking.`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
    setSent(true)
    onDone('Booking request created')
  }
  return <div className="modal-backdrop"><div className="booking-modal"><button className="modal-close" onClick={onClose}><X /></button>{sent ? <div className="sent-state"><div className="sent-icon"><Check /></div><span className="section-kicker">REQUEST CREATED</span><h2>CHECK<br /><span>WHATSAPP.</span></h2><p>Your request is saved as pending. BLVND will confirm the session with you.</p><button className="primary-btn" onClick={onClose}>DONE</button></div> : <><div className="booking-head"><span className="section-kicker">BOOK A SESSION</span><h2>{game.short}<br /><span>{pack.name}</span></h2><div className="booking-price">{money(pack.price)}</div></div><form onSubmit={submit}><label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" required /></label><label>WhatsApp number<input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="07XXXXXXXX" required /></label><div className="form-row"><label>Date<input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required /></label><label>Time<select value={form.time} onChange={(e) => update('time', e.target.value)} required><option value="">Select</option>{['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'].map((time) => <option key={time}>{time}</option>)}</select></label></div><div className="form-row"><label>Players<input type="number" min="1" max="4" value={form.players} onChange={(e) => update('players', e.target.value)} disabled={pack.id === 'crew'} /></label><label>Note<input value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Optional" /></label></div><div className="booking-summary"><span><CalendarDays size={16} /> {form.date || 'Choose date'}</span><span><Clock3 size={16} /> {form.time || 'Choose time'}</span><span><Gamepad2 size={16} /> {game.short}</span></div><button className="primary-btn submit-btn" type="submit">SEND BOOKING REQUEST <MessageCircle size={18} /></button><small className="booking-note">Your request is not confirmed until BLVND replies through WhatsApp.</small></form></>}</div></div>
}

function Admin({ bookings, setBookings, onBack }) {
  const [logged, setLogged] = useState(localStorage.getItem('blvndAdmin') === 'true')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('bookings')
  const [newGame, setNewGame] = useState('')
  const [gameList, setGameList] = useState(JSON.parse(localStorage.getItem('blvndGames') || 'null') || games)
  const pending = bookings.filter((b) => b.status === 'Pending').length
  const confirm = (id, status) => setBookings((old) => old.map((b) => b.id === id ? { ...b, status } : b))
  const addGame = (e) => { e.preventDefault(); if (!newGame.trim()) return; const next = [...gameList, { id: newGame.toLowerCase().replace(/\s+/g, '-'), name: newGame, short: newGame, category: 'Custom' }]; setGameList(next); localStorage.setItem('blvndGames', JSON.stringify(next)); setNewGame('') }
  if (!logged) return <div className="admin-login"><div className="admin-login-box"><div className="footer-brand">BLVND <span>ADMIN</span></div><span className="section-kicker">STAFF ACCESS</span><h1>CONTROL<br /><span>ROOM.</span></h1><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === 'Enter' && password === 'blvndadmin' && (localStorage.setItem('blvndAdmin','true'), setLogged(true))} /><button className="primary-btn" onClick={() => { if (password === 'blvndadmin') { localStorage.setItem('blvndAdmin','true'); setLogged(true) } }}>ENTER <ShieldCheck size={18} /></button><button className="back-link" onClick={onBack}>← Back to website</button><small>Demo access for the first build. Replace with Supabase Auth before launch.</small></div></div>
  return <div className="admin-shell"><aside className="admin-side"><div className="footer-brand">BLVND <span>ADMIN</span></div><button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}><Ticket size={17} /> Bookings</button><button className={tab === 'games' ? 'active' : ''} onClick={() => setTab('games')}><Gamepad2 size={17} /> Games</button><button onClick={() => { localStorage.removeItem('blvndAdmin'); setLogged(false) }}>Logout</button><button className="back-link" onClick={onBack}>View website</button></aside><main className="admin-main"><div className="admin-top"><div><span className="section-kicker">BLVND ARENA</span><h1>CONTROL ROOM</h1></div><div className="admin-stat"><span>PENDING</span><strong>{pending}</strong></div></div>{tab === 'bookings' ? <div className="admin-content"><div className="dashboard-cards"><div><span>TOTAL</span><strong>{bookings.length}</strong></div><div><span>PENDING</span><strong>{pending}</strong></div><div><span>CONFIRMED</span><strong>{bookings.filter((b) => b.status === 'Confirmed').length}</strong></div></div><div className="admin-table">{bookings.length === 0 ? <div className="empty-admin">No booking requests yet.</div> : bookings.map((b) => <div className="booking-row" key={b.id}><div><strong>{b.game} · {b.package}</strong><span>{b.name} · {b.phone}</span></div><div><span>{b.date} · {b.time}</span><span>{b.players} player(s) · {money(b.price)}</span></div><div className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</div><div className="row-actions">{b.status === 'Pending' && <><button onClick={() => confirm(b.id, 'Confirmed')}>CONFIRM</button><button onClick={() => confirm(b.id, 'Rejected')}>REJECT</button></>}</div></div>)}</div></div> : <div className="admin-content"><form className="add-game" onSubmit={addGame}><input value={newGame} onChange={(e) => setNewGame(e.target.value)} placeholder="New game name" /><button className="primary-btn" type="submit">ADD GAME</button></form><div className="admin-game-list">{gameList.map((g) => <div key={g.id}><Gamepad2 size={18} /><strong>{g.name}</strong><span>{g.category}</span></div>)}</div></div>}</main></div>
}

export default App
