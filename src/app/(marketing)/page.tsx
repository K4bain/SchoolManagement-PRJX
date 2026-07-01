"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{landingStyles}</style>
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <RoleShowcase />
      <StatsCounter />
      <Pricing />
      <Footer />
    </>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-nav-logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            SchoolHub
          </Link>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="#stats">Stats</a>
            <a href="#pricing">Pricing</a>
            <Link href="/login">Login</Link>
            <Link href="/login" className="lp-nav-cta">
              Get Started Free
            </Link>
          </div>
          <button
            className="lp-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
          </button>
        </div>
      </nav>
      <div className={`lp-mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#features" onClick={() => setMenuOpen(false)}>
          Features
        </a>
        <a href="#roles" onClick={() => setMenuOpen(false)}>
          Roles
        </a>
        <a href="#stats" onClick={() => setMenuOpen(false)}>
          Stats
        </a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>
          Pricing
        </a>
        <Link href="/login" onClick={() => setMenuOpen(false)}>
          Login
        </Link>
        <Link href="/login" className="lp-nav-cta" onClick={() => setMenuOpen(false)}>
          Get Started Free
        </Link>
      </div>
    </>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-bg" />
      <div className="lp-hero-content">
        <div className="lp-hero-eyebrow">✦ Built for modern schools</div>
        <h1>
          Your entire school.
          <br />
          One <span className="lp-gradient">intelligent</span> platform.
        </h1>
        <p className="lp-hero-sub">
          SchoolHub gives admins, teachers, and students one unified workspace —
          from attendance to grades to announcements, all in real time.
        </p>
        <div className="lp-hero-buttons">
          <Link href="/login" className="lp-btn-primary">
            Start Free Trial
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/login" className="lp-btn-ghost">
            View Live Demo
          </Link>
        </div>
        <div className="lp-hero-trust">
          <span>Trusted by 200+ schools</span>
          <span className="lp-dot" />
          <span>50,000+ students managed</span>
          <span className="lp-dot" />
          <span>99.9% uptime</span>
        </div>
      </div>
      <div className="lp-hero-float">
        <div className="lp-float-card">
          <div className="lp-float-header">
            <span className="lp-float-title">Dashboard Preview</span>
            <span className="lp-float-badge">Live</span>
          </div>
          <div className="lp-float-stat">
            <span>Avg. Attendance</span>
            <span className="lp-green">94.2%</span>
          </div>
          <div className="lp-float-stat">
            <span>Avg. Grade</span>
            <span>87.5</span>
          </div>
          <div className="lp-float-stat lp-float-last">
            <span>Active Students</span>
            <span className="lp-amber">847</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF ─── */
function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="lp-social-proof">
      <div className="lp-social-inner reveal" ref={ref}>
        <p>Join the schools already running smarter</p>
        <div className="lp-logos-row">
          <span>Westfield Academy</span>
          <span>Greenhill Institute</span>
          <span>Summit Preparatory</span>
          <span>Northbridge College</span>
          <span>Oakwood International</span>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    title: "Role-Based Access",
    desc: "Admins, teachers, and students each see exactly what they need. Nothing more, nothing less.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
    ),
    title: "Live Attendance Tracking",
    desc: "Mark present, absent, or late in seconds. Rates calculated automatically.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    ),
    title: "Grade Management",
    desc: "Enter scores by subject. Averages computed instantly. Students see results the moment you save.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" /></svg>
    ),
    title: "Announcements",
    desc: "Broadcast school-wide updates in one click. Every student and teacher sees it immediately.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
    ),
    title: "Weekly Timetable",
    desc: "Students always know where to be. Auto-populated from class and subject data.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
    ),
    title: "Dark Mode Native",
    desc: "Designed dark-first. Easy on the eyes during long admin sessions.",
  },
];

function Features() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    ref.current.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lp-features" id="features" ref={ref}>
      <div className="lp-features-inner">
        <div className="lp-section-label reveal">Features</div>
        <h2 className="lp-section-title reveal">
          Everything your school needs.
        </h2>
        <p className="lp-section-sub reveal">
          One platform to manage attendance, grades, timetables, and
          communication — built for how schools actually work.
        </p>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`lp-feature-card reveal ${i % 3 === 1 ? "rd1" : i % 3 === 2 ? "rd2" : ""}`}
            >
              <div className="lp-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ROLE SHOWCASE ─── */
function RoleShowcase() {
  const [tab, setTab] = useState("admin");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    ref.current.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lp-roles" id="roles" ref={ref}>
      <div className="lp-roles-inner">
        <div className="lp-section-label reveal">Roles</div>
        <h2 className="lp-section-title reveal">
          One platform. Three experiences.
        </h2>
        <p className="lp-section-sub reveal">
          Every user gets a tailored dashboard built for their specific
          workflow.
        </p>
        <div className="lp-role-tabs reveal">
          {(["admin", "teacher", "student"] as const).map((t) => (
            <button
              key={t}
              className={`lp-role-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="lp-role-panels">
          {/* ADMIN */}
          <div className={`lp-role-panel ${tab === "admin" ? "active" : ""}`}>
            <div className="lp-mock-card">
              <div className="lp-mock-header">Admin Dashboard</div>
              <div className="lp-mock-body">
                <div className="lp-mock-stats">
                  <div className="lp-mock-stat">
                    <div className="lp-mock-stat-val">847</div>
                    <div className="lp-mock-stat-label">Students</div>
                  </div>
                  <div className="lp-mock-stat">
                    <div className="lp-mock-stat-val">42</div>
                    <div className="lp-mock-stat-label">Teachers</div>
                  </div>
                  <div className="lp-mock-stat">
                    <div className="lp-mock-stat-val">18</div>
                    <div className="lp-mock-stat-label">Classes</div>
                  </div>
                </div>
                <table className="lp-mock-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Emma Wilson</td>
                      <td>Grade 10-A</td>
                      <td>
                        <span className="lp-badge lp-badge-green">Present</span>
                      </td>
                    </tr>
                    <tr>
                      <td>James Chen</td>
                      <td>Grade 11-B</td>
                      <td>
                        <span className="lp-badge lp-badge-red">Absent</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Sofia Rodriguez</td>
                      <td>Grade 9-C</td>
                      <td>
                        <span className="lp-badge lp-badge-amber">Late</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* TEACHER */}
          <div className={`lp-role-panel ${tab === "teacher" ? "active" : ""}`}>
            <div className="lp-mock-card">
              <div className="lp-mock-header">Teacher Dashboard</div>
              <div className="lp-mock-body">
                <div className="lp-mock-actions">
                  <button className="lp-mock-btn filled">
                    Mark Attendance
                  </button>
                  <button className="lp-mock-btn">Enter Grades</button>
                </div>
                <div className="lp-grade-row">
                  <div>
                    <div className="lp-grade-name">Emma Wilson</div>
                    <div className="lp-grade-subj">Mathematics</div>
                  </div>
                  <div className="lp-grade-score">88 / 100</div>
                </div>
                <div className="lp-grade-row">
                  <div>
                    <div className="lp-grade-name">James Chen</div>
                    <div className="lp-grade-subj">Mathematics</div>
                  </div>
                  <div className="lp-grade-score">76 / 100</div>
                </div>
                <div className="lp-grade-row">
                  <div>
                    <div className="lp-grade-name">Sofia Rodriguez</div>
                    <div className="lp-grade-subj">Mathematics</div>
                  </div>
                  <div className="lp-grade-score">92 / 100</div>
                </div>
              </div>
            </div>
          </div>
          {/* STUDENT */}
          <div
            className={`lp-role-panel ${tab === "student" ? "active" : ""}`}
          >
            <div className="lp-mock-card">
              <div className="lp-mock-header">Student Dashboard</div>
              <div className="lp-mock-body">
                <div className="lp-mock-big-stat">
                  <div className="lp-mock-big-num">94.2%</div>
                  <div className="lp-mock-big-label">Attendance this term</div>
                </div>
                <div className="lp-mock-grade-cards">
                  <div className="lp-mock-grade">
                    <div className="lp-mock-grade-subj">Physics</div>
                    <div className="lp-mock-grade-score good">82</div>
                  </div>
                  <div className="lp-mock-grade">
                    <div className="lp-mock-grade-subj">English</div>
                    <div className="lp-mock-grade-score good">91</div>
                  </div>
                  <div className="lp-mock-grade">
                    <div className="lp-mock-grade-subj">History</div>
                    <div className="lp-mock-grade-score mid">78</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS COUNTER ─── */
function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          el.querySelectorAll<HTMLElement>(".lp-stat-num").forEach((num) => {
            const target = parseFloat(num.dataset.target || "0");
            const suffix = num.dataset.suffix || "";
            const isDecimal = num.dataset.decimal === "true";
            const duration = 1500;
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * target;
              if (isDecimal) {
                num.textContent = current.toFixed(1) + suffix;
              } else if (target >= 1000000) {
                num.textContent =
                  (current / 1000000).toFixed(1) + "M" + suffix;
              } else if (target >= 1000) {
                num.textContent =
                  Math.floor(current / 1000) + "K" + suffix;
              } else {
                num.textContent = Math.floor(current) + suffix;
              }
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lp-stats-section" id="stats" ref={ref}>
      <div className="lp-stats-inner">
        <div className="lp-stat-item reveal">
          <div
            className="lp-stat-num"
            data-target="200"
            data-suffix="+"
          >
            0
          </div>
          <div className="lp-stat-label">Schools using SchoolHub</div>
        </div>
        <div className="lp-stat-item reveal rd1">
          <div
            className="lp-stat-num"
            data-target="50000"
            data-suffix="+"
          >
            0
          </div>
          <div className="lp-stat-label">Students managed</div>
        </div>
        <div className="lp-stat-item reveal rd2">
          <div
            className="lp-stat-num"
            data-target="1200000"
            data-suffix="+"
          >
            0
          </div>
          <div className="lp-stat-label">Attendance records tracked</div>
        </div>
        <div className="lp-stat-item reveal rd3">
          <div
            className="lp-stat-num"
            data-target="99.9"
            data-suffix="%"
            data-decimal="true"
          >
            0
          </div>
          <div className="lp-stat-label">Platform uptime</div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    ref.current.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lp-pricing" id="pricing" ref={ref}>
      <div className="lp-pricing-inner">
        <div className="lp-section-label reveal">Pricing</div>
        <h2 className="lp-section-title reveal">
          Simple, transparent pricing.
        </h2>
        <p className="lp-section-sub reveal">
          Start free. Scale as your school grows. No hidden fees.
        </p>
        <div className="lp-pricing-grid">
          {/* Starter */}
          <div className="lp-price-card reveal">
            <div className="lp-price-name">Starter</div>
            <div className="lp-price-desc">
              For small schools getting started
            </div>
            <div className="lp-price-amount">
              $0<span>/mo</span>
            </div>
            <div className="lp-price-period">Free forever</div>
            <div className="lp-price-features">
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Up to 100 students
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Up to 3 teachers
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Attendance tracking
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Grade management
              </div>
              <div className="lp-price-feature dim">
                <span className="lp-check">—</span> Announcements
              </div>
              <div className="lp-price-feature dim">
                <span className="lp-check">—</span> Priority support
              </div>
            </div>
            <Link href="/login" className="lp-price-btn outline">
              Get Started
            </Link>
          </div>
          {/* Pro */}
          <div className="lp-price-card featured reveal rd1">
            <div className="lp-popular-badge">Most Popular</div>
            <div className="lp-price-name">Pro</div>
            <div className="lp-price-desc">
              For growing schools that need it all
            </div>
            <div className="lp-price-amount">
              $49<span>/mo</span>
            </div>
            <div className="lp-price-period">Billed annually</div>
            <div className="lp-price-features">
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Unlimited students
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Unlimited teachers
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Attendance tracking
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Grade management
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Announcements
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Priority support
              </div>
            </div>
            <Link href="/login" className="lp-price-btn fill">
              Start Free Trial
            </Link>
          </div>
          {/* Enterprise */}
          <div className="lp-price-card reveal rd2">
            <div className="lp-price-name">Enterprise</div>
            <div className="lp-price-desc">
              For large districts and multi-campus
            </div>
            <div className="lp-price-amount">Custom</div>
            <div className="lp-price-period">Contact for pricing</div>
            <div className="lp-price-features">
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Everything in Pro
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Multi-campus support
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> SSO integration
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Dedicated onboarding
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> Custom integrations
              </div>
              <div className="lp-price-feature">
                <span className="lp-check">✓</span> SLA guarantee
              </div>
            </div>
            <Link href="/login" className="lp-price-btn outline">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <Link href="/" className="lp-nav-logo" style={{ marginBottom: 4 }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              SchoolHub
            </Link>
            <p>
              The intelligent school management platform built for modern
              education.
            </p>
          </div>
          <div className="lp-footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#roles">Roles</a>
            <Link href="/login">Login</Link>
          </div>
          <div className="lp-footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 SchoolHub. All rights reserved.</span>
          <span>Built with Next.js &amp; Prisma</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── STYLES ─── */
const landingStyles = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;font-size:16px;line-height:1.6}
a{text-decoration:none;color:inherit}
button{font-family:inherit;cursor:pointer;border:none;outline:none}
ul{list-style:none}

/* NAV */
.lp-nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:16px 0;transition:all .3s ease}
.lp-nav.scrolled{background:rgba(13,15,20,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid #1E2330}
.lp-nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between}
.lp-nav-logo{display:flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:20px;color:#F0F2F8}
.lp-nav-logo svg{flex-shrink:0}
.lp-nav-links{display:flex;align-items:center;gap:32px}
.lp-nav-links a{font-size:14px;font-weight:500;color:#6B7280;transition:color .3s ease}
.lp-nav-links a:hover{color:#F0F2F8}
.lp-nav-cta{background:#6366F1;color:#fff!important;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;transition:all .3s ease}
.lp-nav-cta:hover{background:#818CF8;transform:scale(1.02)}
.lp-hamburger{display:none;flex-direction:column;gap:5px;background:none;padding:4px}
.lp-hamburger span{display:block;width:22px;height:2px;background:#F0F2F8;border-radius:2px;transition:all .3s ease}
.lp-hamburger span.open:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.lp-hamburger span.open:nth-child(2){opacity:0}
.lp-hamburger span.open:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.lp-mobile-menu{display:none;position:fixed;top:64px;left:0;right:0;background:rgba(13,15,20,.97);backdrop-filter:blur(20px);border-bottom:1px solid #1E2330;padding:24px;flex-direction:column;gap:16px;z-index:999}
.lp-mobile-menu.open{display:flex}
.lp-mobile-menu a{font-size:16px;color:#6B7280;padding:8px 0;transition:color .3s}
.lp-mobile-menu a:hover{color:#F0F2F8}
.lp-mobile-menu .lp-nav-cta{display:inline-block;text-align:center;margin-top:8px}

/* HERO */
.lp-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;padding:120px 24px 80px;overflow:hidden}
.lp-hero-bg{position:absolute;inset:0;z-index:0}
.lp-hero-bg::before{content:'';position:absolute;width:600px;height:600px;top:-100px;right:-100px;background:radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%);border-radius:50%;animation:lpMeshFloat 8s ease-in-out infinite}
.lp-hero-bg::after{content:'';position:absolute;width:500px;height:500px;bottom:-150px;left:-100px;background:radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%);border-radius:50%;animation:lpMeshFloat 8s ease-in-out infinite 4s}
@keyframes lpMeshFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.1)}}
.lp-hero-content{position:relative;z-index:1;max-width:900px;text-align:center}
.lp-hero-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:1px solid rgba(99,102,241,.3);border-radius:100px;font-size:13px;font-weight:500;color:#818CF8;background:rgba(99,102,241,.15);margin-bottom:32px;animation:lpFadeInUp .6s ease both}
.lp-hero h1{font-family:'DM Sans',sans-serif;font-size:clamp(36px,72px,72px);font-weight:700;line-height:1.1;letter-spacing:-.02em;margin-bottom:24px;animation:lpFadeInUp .6s ease .1s both}
.lp-gradient{background:linear-gradient(135deg,#6366F1,#a78bfa,#F59E0B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.lp-hero-sub{font-size:clamp(16px,20px,20px);color:#6B7280;max-width:640px;margin:0 auto 40px;line-height:1.7;animation:lpFadeInUp .6s ease .2s both}
.lp-hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;animation:lpFadeInUp .6s ease .3s both}
.lp-btn-primary{background:#6366F1;color:#fff;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;transition:all .3s ease;display:inline-flex;align-items:center;gap:8px}
.lp-btn-primary:hover{background:#818CF8;transform:scale(1.02);box-shadow:0 8px 32px rgba(99,102,241,.15)}
.lp-btn-ghost{background:transparent;color:#F0F2F8;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;border:1px solid #1E2330;transition:all .3s ease;display:inline-flex;align-items:center;gap:8px}
.lp-btn-ghost:hover{border-color:#6366F1;color:#818CF8;transform:scale(1.02)}
.lp-hero-trust{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:48px;font-size:14px;color:#6B7280;flex-wrap:wrap;animation:lpFadeInUp .6s ease .4s both}
.lp-hero-trust span{display:flex;align-items:center;gap:6px}
.lp-dot{width:4px;height:4px;background:#6B7280;border-radius:50%;flex-shrink:0}

/* FLOAT CARD */
.lp-hero-float{position:absolute;right:8%;top:50%;transform:translateY(-50%);width:320px;z-index:1;animation:lpFadeInUp .8s ease .5s both,lpBob 3s ease-in-out infinite 1.3s}
@keyframes lpBob{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 8px))}}
.lp-float-card{background:#13161E;border:1px solid #1E2330;border-radius:12px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.lp-float-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.lp-float-title{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600}
.lp-float-badge{font-size:11px;padding:4px 10px;border-radius:100px;background:rgba(99,102,241,.15);color:#818CF8;font-weight:600}
.lp-float-stat{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #1E2330;font-size:13px}
.lp-float-stat span:first-child{color:#6B7280}
.lp-float-stat span:last-child{font-family:'DM Sans',sans-serif;font-size:18px;font-weight:700}
.lp-float-last{border-bottom:none}
.lp-green{color:#34D399!important}
.lp-amber{color:#F59E0B!important}

/* SOCIAL PROOF */
.lp-social-proof{padding:60px 24px;border-top:1px solid #1E2330;border-bottom:1px solid #1E2330;background:rgba(19,22,30,.6)}
.lp-social-inner{max-width:1200px;margin:0 auto;text-align:center}
.lp-social-inner>p{font-size:14px;color:#6B7280;margin-bottom:32px;text-transform:uppercase;letter-spacing:.08em;font-weight:500}
.lp-logos-row{display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap}
.lp-logos-row span{font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;color:#6B7280;opacity:.5;transition:opacity .3s}
.lp-logos-row span:hover{opacity:.8}

/* FEATURES */
.lp-features{padding:120px 24px}
.lp-features-inner{max-width:1200px;margin:0 auto}
.lp-section-label{font-size:13px;font-weight:600;color:#818CF8;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px}
.lp-section-title{font-family:'DM Sans',sans-serif;font-size:clamp(28px,40px,40px);font-weight:700;margin-bottom:16px}
.lp-section-sub{font-size:17px;color:#6B7280;max-width:560px;line-height:1.7;margin-bottom:56px}
.lp-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lp-feature-card{background:#13161E;border:1px solid #1E2330;border-radius:12px;padding:32px;transition:all .3s ease;position:relative;overflow:hidden}
.lp-feature-card:hover{transform:translateY(-4px);border-color:#6366F1;box-shadow:0 8px 40px rgba(99,102,241,.15),inset 0 1px 0 rgba(99,102,241,.1)}
.lp-feature-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(99,102,241,.15);margin-bottom:20px}
.lp-feature-icon svg{width:24px;height:24px;color:#6366F1}
.lp-feature-card h3{font-family:'DM Sans',sans-serif;font-size:18px;font-weight:600;margin-bottom:8px}
.lp-feature-card p{font-size:14px;color:#6B7280;line-height:1.7}

/* ROLE SHOWCASE */
.lp-roles{padding:120px 24px}
.lp-roles-inner{max-width:1200px;margin:0 auto}
.lp-role-tabs{display:flex;gap:4px;margin-bottom:40px;background:#13161E;border:1px solid #1E2330;border-radius:8px;padding:4px;width:fit-content}
.lp-role-tab{padding:10px 28px;border-radius:6px;font-size:14px;font-weight:600;color:#6B7280;background:transparent;transition:all .3s ease}
.lp-role-tab.active{color:#fff;background:#6366F1}
.lp-role-tab:hover:not(.active){color:#F0F2F8}
.lp-role-panels{position:relative;min-height:420px}
.lp-role-panel{position:absolute;inset:0;opacity:0;transform:translateX(16px);transition:all .25s ease;pointer-events:none}
.lp-role-panel.active{opacity:1;transform:translateX(0);pointer-events:auto}
.lp-mock-card{background:#13161E;border:1px solid #1E2330;border-radius:12px;overflow:hidden}
.lp-mock-header{padding:20px 24px;border-bottom:1px solid #1E2330;font-family:'DM Sans',sans-serif;font-weight:600;font-size:16px}
.lp-mock-body{padding:24px}
.lp-mock-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.lp-mock-stat{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.1);border-radius:8px;padding:16px;text-align:center}
.lp-mock-stat-val{font-family:'DM Sans',sans-serif;font-size:24px;font-weight:700;color:#6366F1}
.lp-mock-stat-label{font-size:12px;color:#6B7280;margin-top:4px}
.lp-mock-table{width:100%;border-collapse:collapse}
.lp-mock-table th{text-align:left;font-size:12px;color:#6B7280;text-transform:uppercase;letter-spacing:.06em;padding:12px 16px;border-bottom:1px solid #1E2330;font-weight:600}
.lp-mock-table td{padding:12px 16px;border-bottom:1px solid #1E2330;font-size:14px}
.lp-mock-table tr:last-child td{border-bottom:none}
.lp-badge{display:inline-block;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600}
.lp-badge-green{background:rgba(52,211,153,.12);color:#34D399}
.lp-badge-red{background:rgba(239,68,68,.12);color:#EF4444}
.lp-badge-amber{background:rgba(245,158,11,.12);color:#F59E0B}
.lp-mock-actions{display:flex;gap:12px;margin-bottom:24px}
.lp-mock-btn{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid #1E2330;background:#13161E;color:#F0F2F8;transition:all .3s}
.lp-mock-btn:hover{border-color:#6366F1;color:#6366F1}
.lp-mock-btn.filled{background:#6366F1;border-color:#6366F1;color:#fff}
.lp-mock-btn.filled:hover{background:#818CF8}
.lp-grade-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #1E2330}
.lp-grade-row:last-child{border-bottom:none}
.lp-grade-name{font-size:14px}
.lp-grade-subj{font-size:13px;color:#6B7280}
.lp-grade-score{font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;color:#6366F1}
.lp-mock-big-stat{text-align:center;padding:40px}
.lp-mock-big-num{font-family:'DM Sans',sans-serif;font-size:56px;font-weight:700;color:#6366F1;line-height:1}
.lp-mock-big-label{font-size:14px;color:#6B7280;margin-top:8px}
.lp-mock-grade-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.lp-mock-grade{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.1);border-radius:8px;padding:20px;text-align:center}
.lp-mock-grade-subj{font-size:13px;color:#6B7280;margin-bottom:8px}
.lp-mock-grade-score{font-family:'DM Sans',sans-serif;font-size:28px;font-weight:700}
.lp-mock-grade-score.good{color:#34D399}
.lp-mock-grade-score.mid{color:#F59E0B}

/* STATS */
.lp-stats-section{padding:80px 24px;background:rgba(19,22,30,.5);border-top:1px solid #1E2330;border-bottom:1px solid #1E2330}
.lp-stats-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center}
.lp-stat-item .lp-stat-num{font-family:'DM Sans',sans-serif;font-size:clamp(32px,48px,48px);font-weight:700;color:#6366F1;line-height:1}
.lp-stat-item .lp-stat-label{font-size:14px;color:#6B7280;margin-top:8px}

/* PRICING */
.lp-pricing{padding:120px 24px}
.lp-pricing-inner{max-width:1100px;margin:0 auto}
.lp-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:start}
.lp-price-card{background:#13161E;border:1px solid #1E2330;border-radius:12px;padding:36px;transition:all .3s ease;position:relative}
.lp-price-card:hover{transform:translateY(-4px)}
.lp-price-card.featured{border-color:#6366F1;transform:scale(1.02);box-shadow:0 12px 48px rgba(99,102,241,.15)}
.lp-price-card.featured:hover{transform:scale(1.02) translateY(-4px)}
.lp-popular-badge{position:absolute;top:-12px;right:20px;background:#F59E0B;color:#000;font-size:11px;font-weight:700;padding:4px 14px;border-radius:100px;text-transform:uppercase;letter-spacing:.04em}
.lp-price-name{font-family:'DM Sans',sans-serif;font-size:20px;font-weight:600;margin-bottom:4px}
.lp-price-desc{font-size:13px;color:#6B7280;margin-bottom:20px}
.lp-price-amount{font-family:'DM Sans',sans-serif;font-size:40px;font-weight:700;margin-bottom:4px}
.lp-price-amount span{font-size:16px;font-weight:400;color:#6B7280}
.lp-price-period{font-size:13px;color:#6B7280;margin-bottom:28px}
.lp-price-features{display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
.lp-price-feature{display:flex;align-items:center;gap:10px;font-size:14px}
.lp-check{color:#6366F1;font-weight:700;font-size:16px;flex-shrink:0}
.lp-price-feature.dim{color:#6B7280}
.lp-price-feature.dim .lp-check{color:#6B7280}
.lp-price-btn{width:100%;padding:12px;border-radius:8px;font-size:14px;font-weight:600;transition:all .3s ease;text-align:center;display:block}
.lp-price-btn.outline{background:transparent;border:1px solid #1E2330;color:#F0F2F8}
.lp-price-btn.outline:hover{border-color:#6366F1;color:#6366F1}
.lp-price-btn.fill{background:#6366F1;border:1px solid #6366F1;color:#fff}
.lp-price-btn.fill:hover{background:#818CF8;transform:scale(1.02);box-shadow:0 4px 20px rgba(99,102,241,.15)}

/* FOOTER */
.lp-footer{padding:64px 24px 32px;border-top:1px solid #1E2330}
.lp-footer-inner{max-width:1200px;margin:0 auto}
.lp-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;margin-bottom:48px}
.lp-footer-brand p{font-size:14px;color:#6B7280;margin-top:12px;line-height:1.7}
.lp-footer-col h4{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;margin-bottom:16px;color:#F0F2F8}
.lp-footer-col a{display:block;font-size:14px;color:#6B7280;padding:4px 0;transition:color .3s}
.lp-footer-col a:hover{color:#6366F1}
.lp-footer-bottom{border-top:1px solid #1E2330;padding-top:24px;display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#6B7280;flex-wrap:wrap;gap:12px}

/* ANIMATIONS */
@keyframes lpFadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.rd1{transition-delay:.1s}
.rd2{transition-delay:.2s}
.rd3{transition-delay:.3s}

/* RESPONSIVE */
@media(max-width:1024px){
  .lp-hero-float{display:none}
  .lp-features-grid{grid-template-columns:repeat(2,1fr)}
  .lp-pricing-grid{grid-template-columns:1fr;max-width:420px;margin-left:auto;margin-right:auto}
  .lp-price-card.featured{transform:none}
  .lp-price-card.featured:hover{transform:translateY(-4px)}
  .lp-stats-inner{grid-template-columns:repeat(2,1fr)}
  .lp-footer-grid{grid-template-columns:1fr}
}
@media(max-width:768px){
  .lp-nav-links{display:none}
  .lp-hamburger{display:flex}
  .lp-features-grid{grid-template-columns:1fr}
  .lp-role-tabs{width:100%;overflow-x:auto}
  .lp-role-tab{padding:10px 20px;white-space:nowrap;font-size:13px}
  .lp-mock-stats{grid-template-columns:1fr}
  .lp-mock-grade-cards{grid-template-columns:1fr}
  .lp-stats-inner{grid-template-columns:repeat(2,1fr);gap:24px}
  .lp-hero h1{font-size:36px}
  .lp-hero-sub{font-size:16px}
  .lp-logos-row{gap:24px}
  .lp-logos-row span{font-size:13px}
}
`;
