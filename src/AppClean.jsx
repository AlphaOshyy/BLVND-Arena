import { useEffect, useState } from 'react'

const GTA_ART = 'https://www.rockstargames.com/VI/_next/static/media/Official_Cover_Art_landscape.12.uu2irr.2_a.jpg?akim=1&imwidth=1920'
const WHATSAPP_NUMBER = '94770000000'

const games = [
  { id: 'gta6', name: 'Grand Theft Auto VI', short: 'GTA VI', category: 'FEATURED', featured: true },
  { id: 'fc', name: 'EA Sports FC', short: 'FC', category: 'SPORTS' },
  { id: 'gt', name: 'Gran Turismo', short: 'GT', category: 'RACING' },
  { id: 'tekken', name: 'Tekken', short: 'TEKKEN', category: 'FIGHTING' },
  { id: 'cod', name: 'Call of Duty', short: 'COD', category: 'ACTION' },
  { id: 'minecraft', name: 'Minecraft', short: 'MINECRAFT', category: 'ADVENTURE' }
]

const normalPackages = [
  { id: 'n15', name: '15 MIN', price: 250, detail: 'Quick session' },
  { id: 'n30', name: '30 MIN', price: 450, detail: 'More time to play' },
  { id: 'n60', name: '1 HOUR', price: 750, detail: 'Standard session', featured: true }
]

const gtaPackages = [
  { id: 'g15', name: '15 MIN', price: 300, detail: 'GTA VI quick session' },
  { id: 'g15s', name: '15 MIN + SNACK', price: 550, detail: 'Session + snack or drink' },
  { id: 'g60', name: 'STANDARD', price: 750, detail: '1 hour GTA VI session', featured: true },
  { id: 'g60c', name: 'GAMER COMBO', price: 1100, detail: '1 hour + snack or drink' },
  { id: 'crew', name: 'CREW PACK', price: 4200, detail: '4 players + snacks + group photo', featured: true },
  { id: 'vip', name: 'LAUNCH DAY VIP', price: 1150, detail: 'Premium GTA VI experience' }
]

const money = (n) => `Rs. ${Number(n).toLocaleString('en-LK')}`

function readBookings() {
  try { return JSON.parse(localStorage.getItem('blvndBookings') || '[]') } catch { return [] }
}

export default function AppClean() {
  const [booking, setBooking] = useState(null)
  const [menu, setMenu] = useState(false)
  const [admin, setAdmin] = useState(window.location.pathname.includes('/admin'))
  const [bookings, setBookings] = useState(readBookings)

  useEffect(() => { localStorage.setItem('blvndBookings', JSON.stringify(bookings)) }, [bookings])
  useEffect(() => { document.body.style.overflow = booking || menu ? 'hidden' : '' }, [booking, menu])

  const openBooking = (game, pack) => setBooking({ game, pack })
  const goHome = () => { window.history.pushState({}, '', './'); setAdmin(false) }

  if (admin) return <Admin bookings={bookings} setBookings={setBookings} onHome={goHome} />

  return <div className="app-shell">
    <header className="nav">
      <a className="brand" href="#top"><span>BLVND</span><small>ARENA</small></a>
      <nav className="desktop-nav"><a href="#gta">GTA VI</a><a href="#games">GAMES</a><a href="#packages">PACKAGES</a><a href="#arcade">ARCADE</a></nav>
      <button className="nav-book" onClick={() => openBooking(games[0], gtaPackages[2])}>BOOK NOW ↗</button>
      <button className="menu-button" onClick={() => setMenu(true)}>☰</button>
    </header>

    <main>
      <section id="top" className="hero section-dark">
        <div className="hero-image" style={{ backgroundImage: `url(${GTA_ART})` }} />
        <div className="hero-noise" />
        <div className="hero-content reveal">
          <div className="eyebrow"><span className="live-dot" /> GALLE, SRI LANKA · BOOKINGS OPEN</div>
          <h1>BLVND<br /><em>ARENA</em></h1>
          <p>Galle's gaming destination. GTA VI experience and sessions across your favourite games.</p>
          <div className="hero-actions"><button className="primary-btn" onClick={() => openBooking(games[0], gtaPackages[2])}>BOOK A SESSION ↗</button><a className="ghost-btn" href="#games">EXPLORE GAMES</a></div>
        </div>
        <div className="hero-meta"><span>01</span><i /><span>BLVND / GALLE</span></div>
        <div className="scroll-cue">SCROLL ↓</div>
      </section>

      <section id="gta" className="gta-section">
        <div className="section-grid">
          <div className="section-copy reveal"><span className="section-kicker">FEATURED EXPERIENCE</span><h2>GTA <span>VI</span><br />AT BLVND.</h2><p>Experience GTA VI at BLVND Arena in Galle. Select a package, choose your preferred date and time, then send the request to our team on WhatsApp.</p><div className="status"><span className="live-dot" /> SESSION BOOKINGS OPEN</div><button className="outline-btn" onClick={() => openBooking(games[0], gtaPackages[2])}>BOOK GTA VI ↗</button></div>
          <div className="gta-art reveal" style={{ backgroundImage: `url(${GTA_ART})` }}><div className="art-caption"><span>OFFICIAL GTA VI ARTWORK</span><small>Rockstar Games</small></div></div>
        </div>
      </section>

      <section id="games" className="games-section">
        <div className="section-heading reveal"><span className="section-kicker">THE LINEUP</span><h2>CHOOSE<br /><span>YOUR GAME.</span></h2><p>GTA VI gets the featured experience. Other games use the standard BLVND rates.</p></div>
        <div className="game-grid">{games.map((game, i) => <button key={game.id} className={`game-card reveal ${game.featured ? 'game-featured' : ''}`} style={{ '--delay': `${i * 70}ms` }} onClick={() => openBooking(game, game.featured ? gtaPackages[2] : normalPackages[2])}><div className={`game-photo ${game.featured ? '' : 'placeholder p' + i}`} style={game.featured ? { backgroundImage: `url(${GTA_ART})` } : undefined}>{!game.featured && <span className="game-symbol">◈</span>}</div><div className="game-overlay" /><div className="game-info"><span>{game.category}</span><h3>{game.short}</h3><div className="game-link">BOOK ↗</div></div></button>)}</div>
      </section>

      <section id="packages" className="packages-section">
        <div className="section-heading reveal"><span className="section-kicker">BLVND SESSION RATES</span><h2>PLAY<br /><span>YOUR WAY.</span></h2></div>
        <RateBlock title="ALL OTHER GAMES" subtitle="PS5, racing, fighting, sports and more." packs={normalPackages} game={games[1]} onBook={openBooking} />
        <RateBlock title="GTA VI EXPERIENCE" subtitle="Featured GTA VI session packages." packs={gtaPackages} game={games[0]} onBook={openBooking} gta />
      </section>

      <section className="crew-section"><div className="crew-bg" style={{ backgroundImage: `url(${GTA_ART})` }} /><div className="crew-overlay" /><div className="crew-content reveal"><span className="section-kicker">FOR THE SQUAD</span><h2>BRING<br /><span>YOUR CREW.</span></h2><div className="crew-stats"><div><strong>04</strong><small>PLAYERS</small></div><div><strong>01</strong><small>HOUR</small></div><div><strong>04</strong><small>SNACKS</small></div><div><strong>01</strong><small>GROUP PHOTO</small></div></div><div className="crew-price">Rs. 4,200</div><button className="primary-btn" onClick={() => openBooking(games[0], gtaPackages[4])}>BOOK CREW PACK ↗</button></div></section>

      <section id="arcade" className="arcade-section"><div className="section-heading reveal"><span className="section-kicker">THE VENUE</span><h2>MEET<br /><span>BLVND.</span></h2><p>Gaming, racing, snacks, drinks and sessions with your crew in Happugala, Galle.</p></div><div className="venue-grid"><Venue title="CONSOLE ZONE" text="PS5 gaming sessions" icon="▣" /><Venue title="RACING" text="Competitive driving" icon="◉" /><Venue title="CREW NIGHTS" text="Group sessions and events" icon="✦" /><Venue title="SNACKS" text="Fuel for the next round" icon="◆" /></div><div className="location-card reveal"><div><span className="section-kicker">FIND US</span><h3>BLVND ARENA</h3><p>Happugala, Galle, Sri Lanka</p></div><a href="https://www.google.com/maps/search/?api=1&query=Happugala%20Galle%20Sri%20Lanka" target="_blank" rel="noreferrer">GET DIRECTIONS ↗</a></div></section>

      <section className="booking-cta"><div className="cta-inner reveal"><span className="section-kicker">READY?</span><h2>YOUR SESSION<br /><span>STARTS HERE.</span></h2><button className="primary-btn" onClick={() => openBooking(games[0], gtaPackages[2])}>BOOK NOW ↗</button></div></section>
    </main>

    <footer><div className="footer-brand">BLVND <span>ARENA</span></div><div className="footer-links"><a href="#gta">GTA VI</a><a href="#games">GAMES</a><a href="#packages">PACKAGES</a><a href="#arcade">LOCATION</a><a href="./admin">ADMIN</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BLVND ARENA</span><a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noreferrer">GTA VI MEDIA · ROCKSTAR GAMES</a><span className="social">◎ @BLVND</span></div></footer>

    {menu && <div className="mobile-menu"><button className="close-menu" onClick={() => setMenu(false)}>✕</button><div className="mobile-brand">BLVND <span>ARENA</span></div><nav><a href="#gta" onClick={() => setMenu(false)}>GTA VI</a><a href="#games" onClick={() => setMenu(false)}>GAMES</a><a href="#packages" onClick={() => setMenu(false)}>PACKAGES</a><a href="#arcade" onClick={() => setMenu(false)}>ARCADE</a></nav><button className="primary-btn" onClick={() => { setMenu(false); openBooking(games[0], gtaPackages[2]) }}>BOOK NOW ↗</button></div>}
    {booking && <BookingModal data={booking} onClose={() => setBooking(null)} setBookings={setBookings} />}
  </div>
}

function RateBlock({ title, subtitle, packs, game, onBook, gta }) {
  return <div className={`rate-block reveal ${gta ? 'gta-rates' : ''}`}><div className="rate-title"><span>{gta ? '02' : '01'}</span><h3>{title}</h3><p>{subtitle}</p></div><div className="rate-grid">{packs.map(pack => <PackageCard key={pack.id} pack={pack} onClick={() => onBook(game, pack)} />)}</div></div>
}

function PackageCard({ pack, onClick }) { return <button className={`package-card ${pack.featured ? 'featured' : ''}`} onClick={onClick}><div className="package-top"><span>{pack.name}</span>{pack.featured && <span className="tag">POPULAR</span>}</div><strong>{money(pack.price)}</strong><p>{pack.detail}</p><div className="package-book">BOOK ↗</div></button> }
function Venue({ title, text, icon }) { return <div className="venue-tile reveal"><div className="tile-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div> }

function BookingModal({ data, onClose, setBookings }) {
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', players: data.pack.id === 'crew' ? 4 : 1, note: '' })
  const [sent, setSent] = useState(false)
  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))
  const submit = e => { e.preventDefault(); if (!form.name || !form.phone || !form.date || !form.time) return; const id = `BLV-${Date.now().toString().slice(-6)}`; const item = { id, ...form, game: data.game.short, package: data.pack.name, price: data.pack.price, status: 'Pending', createdAt: new Date().toISOString() }; setBookings(old => [item, ...old]); const text = encodeURIComponent(`BLVND ARENA BOOKING REQUEST\n\nGame: ${data.game.name}\nPackage: ${data.pack.name}\nPrice: ${money(data.pack.price)}\nDate: ${form.date}\nTime: ${form.time}\nPlayers: ${form.players}\nName: ${form.name}\nWhatsApp: ${form.phone}${form.note ? `\nNote: ${form.note}` : ''}\n\nPlease confirm my booking.`); window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer'); setSent(true) }
  return <div className="modal-backdrop"><div className="booking-modal"><button className="modal-close" onClick={onClose}>✕</button>{sent ? <div className="sent-state"><div className="sent-icon">✓</div><h2>REQUEST<br /><span>SENT.</span></h2><p>Your request is saved as pending. BLVND will confirm availability through WhatsApp.</p><button className="primary-btn" onClick={onClose}>DONE</button></div> : <><div className="booking-head"><span className="section-kicker">BOOK YOUR SESSION</span><h2>{data.game.short}<br /><span>{data.pack.name}</span></h2><div className="booking-price">{money(data.pack.price)}</div></div><form onSubmit={submit}><div className="booking-summary"><span>GAME: {data.game.short}</span><span>PACKAGE: {data.pack.name}</span><span>PRICE: {money(data.pack.price)}</span></div><label>NAME<input value={form.name} onChange={e => update('name', e.target.value)} required /></label><div className="form-row"><label>WHATSAPP NUMBER<input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="07XXXXXXXX" required /></label><label>PLAYERS<input type="number" min="1" max="4" value={form.players} onChange={e => update('players', Number(e.target.value))} required /></label></div><div className="form-row"><label>DATE<input type="date" value={form.date} onChange={e => update('date', e.target.value)} required /></label><label>TIME<input type="time" value={form.time} onChange={e => update('time', e.target.value)} required /></label></div><label>NOTE, OPTIONAL<input value={form.note} onChange={e => update('note', e.target.value)} placeholder="Anything our team should know?" /></label><button className="primary-btn submit-btn" type="submit">SEND BOOKING REQUEST ↗</button><div className="booking-note">Your booking is a request. BLVND confirms availability through WhatsApp.</div></form></>}</div></div>
}

function Admin({ bookings, setBookings, onHome }) {
  const [login, setLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [gamesCount, setGamesCount] = useState(games.length)
  if (!login) return <div className="admin-login"><div className="admin-login-box"><span className="section-kicker">BLVND ARENA</span><h1>ADMIN<br /><span>PORTAL.</span></h1><input type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} /><button className="primary-btn" onClick={() => password === 'blvnd2026' && setLogin(true)}>ENTER PORTAL</button><button className="ghost-btn" onClick={onHome}>BACK TO SITE</button></div></div>
  const confirm = id => setBookings(old => old.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b))
  const reject = id => setBookings(old => old.map(b => b.id === id ? { ...b, status: 'Rejected' } : b))
  return <div className="admin-shell"><div className="admin-top"><div><span className="section-kicker">BLVND ARENA</span><h1>CONTROL<br /><span>ROOM.</span></h1></div><button className="ghost-btn" onClick={onHome}>VIEW SITE</button></div><div className="admin-stats"><div><span>BOOKINGS</span><strong>{bookings.length}</strong></div><div><span>PENDING</span><strong>{bookings.filter(b => b.status === 'Pending').length}</strong></div><div><span>CONFIRMED</span><strong>{bookings.filter(b => b.status === 'Confirmed').length}</strong></div><div><span>GAMES</span><strong>{gamesCount}</strong></div></div><section className="admin-panel"><div className="admin-panel-head"><h2>BOOKING REQUESTS</h2><button className="outline-btn" onClick={() => setGamesCount(c => c + 1)}>+ ADD GAME</button></div>{bookings.length === 0 ? <p className="admin-empty">No booking requests yet.</p> : bookings.map(b => <div className="admin-booking" key={b.id}><div><strong>{b.id}</strong><h3>{b.game} · {b.package}</h3><p>{b.name} · {b.phone} · {b.date} · {b.time} · {b.players} player(s)</p></div><div className="admin-actions"><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span>{b.status === 'Pending' && <><button onClick={() => confirm(b.id)}>CONFIRM</button><button onClick={() => reject(b.id)}>REJECT</button></>}</div></div>)}</section></div>
}
