import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";


const useTheme = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return { theme, toggleTheme };
};
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border hover:bg-muted transition"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};
const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (loading) return;

    if (user?.role === "company") navigate("/company", { replace: true });
    if (user?.role === "applicant") navigate("/applicant", { replace: true });
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b">
  <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

    {/* Logo */}
    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
      <span>TalentHit</span>
    </Link>

    {/* Nav Links */}
    <nav className="hidden md:flex gap-8 text-sm font-medium">
      <a href="#features" className="hover:text-primary transition">Features</a>
      <a href="#workflow" className="hover:text-primary transition">Workflow</a>
      <a href="#pricing" className="hover:text-primary transition">Pricing</a>
      <a href="#contact" className="hover:text-primary transition">Contact</a>
    </nav>

    {/* Right Actions */}
    <div className="flex items-center gap-3">

      {/* ✅ THEME BUTTON */}
      <ThemeToggle />

      <Link to="/login?role=applicant">
        <Button variant="outline">Applicant</Button>
      </Link>

      <Link to="/login?role=company">
        <Button>Start Hiring</Button>
      </Link>

    </div>

  </div>
</header>

      {/* ================= HERO ================= */}
<section className="relative overflow-hidden px-6 py-32 text-center">

{/* Background Gradient Glow */}
<div className="absolute inset-0 -z-10">
  <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full" />
</div>

<div className="max-w-6xl mx-auto">

  {/* Tagline Badge */}
  <div className="inline-block px-4 py-1 mb-6 text-sm border rounded-full bg-muted/40 backdrop-blur">
    AI-Powered Hiring Platform
  </div>

  {/* Headline */}
  <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
    Hire Smarter, <br />
    <span className="text-primary">
      Not Harder
    </span>
  </h1>

  {/* Subtext */}
  <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
    TalentHit automates resume screening, skill assessments, and candidate ranking —
    helping you hire the right talent faster with data-driven decisions.
  </p>

  {/* CTA */}
  <div className="mt-10 flex justify-center gap-4 flex-wrap">
    <Link to="/login?role=company">
      <Button size="lg" className="px-8 text-base">
        Start Hiring →
      </Button>
    </Link>

    <Link to="/login?role=applicant">
      <Button size="lg" variant="outline" className="px-8 text-base">
        Apply for Jobs
      </Button>
    </Link>
  </div>

  {/* Trust Line */}
  <p className="mt-6 text-sm text-muted-foreground">
    Trusted by startups & growing teams
  </p>

  {/* Stats */}
  <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">

    <div className="p-4 border rounded-xl bg-background/50 backdrop-blur">
      <h3 className="text-2xl font-bold">70%</h3>
      <p className="text-xs text-muted-foreground mt-1">Faster Hiring</p>
    </div>

    <div className="p-4 border rounded-xl bg-background/50 backdrop-blur">
      <h3 className="text-2xl font-bold">3x</h3>
      <p className="text-xs text-muted-foreground mt-1">Better Screening</p>
    </div>

    <div className="p-4 border rounded-xl bg-background/50 backdrop-blur">
      <h3 className="text-2xl font-bold">90%</h3>
      <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
    </div>

    <div className="p-4 border rounded-xl bg-background/50 backdrop-blur">
      <h3 className="text-2xl font-bold">24/7</h3>
      <p className="text-xs text-muted-foreground mt-1">Automation</p>
    </div>

  </div>

</div>
</section>
      {/* ================= PROBLEM ================= */}
<section className="px-6 py-24 bg-muted/30">

<div className="max-w-6xl mx-auto text-center">

  {/* Heading */}
  <h3 className="text-4xl font-bold leading-tight">
    Hiring Today is Slow, Costly, and Inefficient
  </h3>

  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
    Companies are drowning in resumes, wasting hours on manual screening,
    and still missing the best candidates.
  </p>

  {/* Problem Cards */}
  <div className="mt-16 grid md:grid-cols-3 gap-8">

    {/* Card 1 */}
    <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
      <div className="text-3xl mb-4">📄</div>
      <h4 className="text-lg font-semibold">
        Too Many Irrelevant Resumes
      </h4>
      <p className="text-sm text-muted-foreground mt-3">
        Recruiters spend hours filtering candidates who don’t match the job requirements.
      </p>
    </div>

    {/* Card 2 */}
    <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
      <div className="text-3xl mb-4">⏳</div>
      <h4 className="text-lg font-semibold">
        Manual Screening Wastes Time
      </h4>
      <p className="text-sm text-muted-foreground mt-3">
        Teams manually review applications, slowing down the entire hiring process.
      </p>
    </div>

    {/* Card 3 */}
    <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
      <div className="text-3xl mb-4">❌</div>
      <h4 className="text-lg font-semibold">
        No Real Skill Evaluation
      </h4>
      <p className="text-sm text-muted-foreground mt-3">
        Hiring decisions are often based on resumes instead of actual skills and performance.
      </p>
    </div>

  </div>

  {/* Bottom Punch Line */}
  <p className="mt-12 text-base font-medium text-muted-foreground">
    Result? <span className="text-foreground font-semibold">
      Bad hires, wasted time, and lost opportunities.
    </span>
  </p>

</div>
</section>

      {/* ================= SOLUTION ================= */}
<section className="px-6 py-24">

<div className="max-w-6xl mx-auto text-center">

  {/* Heading */}
  <h3 className="text-4xl font-bold leading-tight">
    Meet TalentHit — Your AI Hiring Engine
  </h3>

  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
    TalentHit replaces manual hiring workflows with intelligent automation —
    so you can focus only on the best candidates.
  </p>

  {/* Solution Cards */}
  <div className="mt-16 grid md:grid-cols-3 gap-8">

    {/* Card 1 */}
    <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
      <div className="text-3xl mb-4">🤖</div>
      <h4 className="text-lg font-semibold">
        AI Resume Screening
      </h4>
      <p className="text-sm text-muted-foreground mt-3">
        Instantly filter candidates based on skills, experience, and job requirements.
      </p>
    </div>

    {/* Card 2 */}
    <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
      <div className="text-3xl mb-4">🧠</div>
      <h4 className="text-lg font-semibold">
        Smart Skill Assessments
      </h4>
      <p className="text-sm text-muted-foreground mt-3">
        Auto-generate MCQs, coding tests, and domain-based evaluations tailored to the role.
      </p>
    </div>

    {/* Card 3 */}
    <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
      <div className="text-3xl mb-4">📊</div>
      <h4 className="text-lg font-semibold">
        AI Candidate Ranking
      </h4>
      <p className="text-sm text-muted-foreground mt-3">
        Get a ranked list of candidates so you can quickly identify top performers.
      </p>
    </div>

  </div>

  {/* Workflow strip (very powerful) */}
  <div className="mt-20 border rounded-2xl p-8 bg-muted/30">

    <h4 className="text-xl font-semibold mb-6">
      From Application to Hiring — Fully Automated
    </h4>

    <div className="grid md:grid-cols-4 gap-6 text-sm">

      <div>
        <p className="font-semibold">1. Apply</p>
        <p className="text-muted-foreground mt-1">Candidates submit resumes</p>
      </div>

      <div>
        <p className="font-semibold">2. Screen</p>
        <p className="text-muted-foreground mt-1">AI filters best matches</p>
      </div>

      <div>
        <p className="font-semibold">3. Evaluate</p>
        <p className="text-muted-foreground mt-1">Tests based on role</p>
      </div>

      <div>
        <p className="font-semibold">4. Hire</p>
        <p className="text-muted-foreground mt-1">Select top candidates</p>
      </div>

    </div>

  </div>

</div>
</section>

     {/* ================= FEATURES ================= */}
<section id="features" className="px-6 py-24 bg-muted/30">

<div className="max-w-7xl mx-auto">

  {/* Heading */}
  <div className="text-center max-w-2xl mx-auto">
    <h3 className="text-4xl font-bold leading-tight">
      Everything You Need to Hire Better
    </h3>
    <p className="mt-4 text-muted-foreground text-lg">
      A complete hiring system — from screening to final selection — powered by AI.
    </p>
  </div>

  {/* Features Grid */}
  <div className="mt-16 grid md:grid-cols-3 gap-8">

    {[
      {
        icon: "🤖",
        title: "AI Resume Screening",
        desc: "Automatically filter candidates based on skills, experience, and job fit."
      },
      {
        icon: "🧠",
        title: "Skill-Based Assessments",
        desc: "Generate MCQs, coding problems, and domain-specific evaluations instantly."
      },
      {
        icon: "💻",
        title: "Live Coding Engine",
        desc: "Evaluate real-world coding ability with test cases and execution support."
      },
      {
        icon: "📊",
        title: "Candidate Ranking",
        desc: "Get AI-powered ranking based on performance and skills."
      },
      {
        icon: "📈",
        title: "Company Dashboard",
        desc: "Track hiring metrics, applicants, and progress in one place."
      },
      {
        icon: "⚙️",
        title: "Automated Pipeline",
        desc: "Move candidates through stages without manual effort."
      }
    ].map((feature, i) => (
      <div
        key={i}
        className="p-8 rounded-2xl border bg-background hover:shadow-xl transition duration-300"
      >
        <div className="text-3xl mb-4">{feature.icon}</div>
        <h4 className="text-lg font-semibold">{feature.title}</h4>
        <p className="text-sm text-muted-foreground mt-3">
          {feature.desc}
        </p>
      </div>
    ))}

  </div>

  {/* Bottom Highlight Strip */}
  <div className="mt-20 border rounded-2xl p-10 text-center bg-background shadow-sm">

    <h4 className="text-2xl font-semibold">
      Built for Every Hiring Need
    </h4>

    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
      Whether you're hiring developers, marketers, HR professionals, or operations staff —
      TalentHit adapts to your hiring workflow seamlessly.
    </p>

  </div>

</div>
</section>

 {/* ================= WORKFLOW ================= */}
<section id="workflow" className="px-6 py-28">

<div className="max-w-7xl mx-auto text-center">

  {/* Heading */}
  <h3 className="text-4xl font-bold leading-tight">
    How TalentHit Works
  </h3>

  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
    From job creation to final hiring — TalentHit automates every step of your hiring process.
  </p>

  {/* Steps */}
  <div className="mt-20 grid md:grid-cols-4 gap-10">

    {[
      {
        step: "01",
        title: "Create Job",
        desc: "Define role, skills, and experience required for the position."
      },
      {
        step: "02",
        title: "AI Screening",
        desc: "Automatically filter candidates based on job-specific criteria."
      },
      {
        step: "03",
        title: "Skill Evaluation",
        desc: "Assess candidates with MCQs, coding tests, or domain-based questions."
      },
      {
        step: "04",
        title: "Hire Faster",
        desc: "Get ranked candidates and make confident hiring decisions."
      }
    ].map((item, i) => (
      <div
        key={i}
        className="relative p-8 border rounded-2xl bg-background hover:shadow-xl transition"
      >
        {/* Step Number */}
        <div className="text-sm font-medium text-muted-foreground mb-2">
          {item.step}
        </div>

        <h4 className="text-lg font-semibold">{item.title}</h4>

        <p className="text-sm text-muted-foreground mt-3">
          {item.desc}
        </p>
      </div>
    ))}

  </div>

  {/* Connector Line (desktop only) */}
  <div className="hidden md:block mt-10 relative">
    <div className="h-[2px] bg-border w-full max-w-5xl mx-auto" />
  </div>

  {/* Role Adaptation Section */}
  <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

    <div className="p-6 border rounded-xl bg-muted/30">
      💻 <strong>Tech Roles</strong>
      <p className="mt-2 text-sm text-muted-foreground">
        Coding tests, backend/frontend problems, system design
      </p>
    </div>

    <div className="p-6 border rounded-xl bg-muted/30">
      📈 <strong>Business Roles</strong>
      <p className="mt-2 text-sm text-muted-foreground">
        Sales scenarios, marketing strategy, case-based MCQs
      </p>
    </div>

    <div className="p-6 border rounded-xl bg-muted/30">
      🧑‍💼 <strong>General Roles</strong>
      <p className="mt-2 text-sm text-muted-foreground">
        Aptitude, communication, HR, and domain-specific tests
      </p>
    </div>

  </div>

</div>
</section>

{/* ================= PRICING ================= */}
<section id="pricing" className="px-6 py-28 bg-muted/30">

  <div className="max-w-6xl mx-auto text-center">

    {/* Heading */}
    <h3 className="text-4xl font-bold">
      Simple, Transparent Pricing
    </h3>

    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
      Start small and scale as your hiring grows. No hidden fees.
    </p>

    {/* Pricing Cards */}
    <div className="mt-16 grid md:grid-cols-2 gap-10">

      {/* Starter Plan */}
      <div className="p-10 border rounded-2xl bg-background hover:shadow-xl transition">

        <h4 className="text-xl font-semibold">Starter</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Ideal for startups and small teams
        </p>

        <div className="mt-6">
          <span className="text-4xl font-bold">₹8,000</span>
          <span className="text-muted-foreground"> / month</span>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          + ₹20 per applicant
        </p>

        <ul className="mt-6 space-y-3 text-sm text-left">
          <li>✅ AI Resume Screening</li>
          <li>✅ Skill-Based Assessments</li>
          <li>✅ Candidate Ranking</li>
          <li>✅ Basic Dashboard</li>
        </ul>

        <Link to="/login?role=company">
          <Button className="mt-8 w-full">Get Started</Button>
        </Link>
      </div>

      {/* Growth Plan (Highlighted) */}
      <div className="relative p-10 border-2 border-primary rounded-2xl bg-background shadow-xl">

        {/* Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-xs bg-primary text-white rounded-full">
          Most Popular
        </div>

        <h4 className="text-xl font-semibold">Growth</h4>
        <p className="text-sm text-muted-foreground mt-2">
          For scaling companies & hiring teams
        </p>

        <div className="mt-6">
          <span className="text-4xl font-bold">₹25,000</span>
          <span className="text-muted-foreground"> / month</span>
        </div>

        <ul className="mt-6 space-y-3 text-sm text-left">
          <li>✅ Everything in Starter</li>
          <li>✅ Advanced Analytics</li>
          <li>✅ Custom Assessments</li>
          <li>✅ Priority Support</li>
        </ul>

        <Link to="/login?role=company">
          <Button className="mt-8 w-full">Contact Sales</Button>
        </Link>
      </div>

    </div>

    {/* Bottom trust line */}
    <p className="mt-10 text-sm text-muted-foreground">
      No setup fees • Cancel anytime • Scales with your hiring needs
    </p>

  </div>
</section>

      {/* ================= CTA ================= */}
{/* ================= CTA ================= */}
<section className="relative px-6 py-32 text-center overflow-hidden">

  {/* Background Glow */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 blur-[140px] rounded-full" />
  </div>

  <div className="max-w-4xl mx-auto">

    {/* Heading */}
    <h3 className="text-4xl md:text-5xl font-bold leading-tight">
      Start Hiring Smarter Today
    </h3>

    {/* Subtext */}
    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
      Stop wasting time on manual screening. Let TalentHit automate your hiring
      process and help you find the best candidates faster.
    </p>

    {/* CTA Buttons */}
    <div className="mt-10 flex justify-center gap-4 flex-wrap">

      <Link to="/login?role=company">
        <Button size="lg" className="px-10 text-base">
          Start Hiring →
        </Button>
      </Link>

      <a href="mailto:info.talenthit@gmail.com">
        <Button size="lg" variant="outline" className="px-10 text-base">
          Book a Demo
        </Button>
      </a>

    </div>

    {/* Trust Line */}
    <p className="mt-6 text-sm text-muted-foreground">
      No setup hassle • Cancel anytime • Get started in minutes
    </p>

  </div>
</section>
      {/* ================= CONTACT ================= */}
{/* ================= CONTACT ================= */}
<section id="contact" className="px-6 py-28 bg-muted/30">

  <div className="max-w-6xl mx-auto text-center">

    {/* Heading */}
    <h3 className="text-4xl font-bold">
      Let’s Help You Hire Better
    </h3>

    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
      Have questions, want a demo, or looking to integrate TalentHit into your hiring process?
      Our team is here to help you get started.
    </p>

    {/* Contact Cards */}
    <div className="mt-16 grid md:grid-cols-3 gap-8">

      {/* Email */}
      <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
        <div className="text-3xl mb-4">📧</div>
        <h4 className="font-semibold text-lg">Email Support</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Reach out for any questions or support
        </p>

        <a
          href="mailto:info.talenthit@gmail.com"
          className="block mt-4 text-primary font-medium"
        >
          info.talenthit@gmail.com
        </a>
      </div>

      {/* Demo */}
      <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
        <div className="text-3xl mb-4">🎥</div>
        <h4 className="font-semibold text-lg">Book a Demo</h4>
        <p className="text-sm text-muted-foreground mt-2">
          See TalentHit in action with a guided walkthrough
        </p>

        <a href="mailto:info.talenthit@gmail.com?subject=Demo Request">
          <Button className="mt-4">Request Demo</Button>
        </a>
      </div>

      {/* Business */}
      <div className="p-8 border rounded-2xl bg-background hover:shadow-lg transition">
        <div className="text-3xl mb-4">🤝</div>
        <h4 className="font-semibold text-lg">Business Inquiries</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Partnerships, pricing, or enterprise plans
        </p>

        <a
          href="mailto:info.talenthit@gmail.com?subject=Business Inquiry"
          className="block mt-4 text-primary font-medium"
        >
          Connect with us →
        </a>
      </div>

    </div>

    {/* Bottom trust section */}
    <div className="mt-16 p-8 border rounded-2xl bg-background max-w-3xl mx-auto">

      <h4 className="text-xl font-semibold">
        We’re Here to Support You
      </h4>

      <p className="mt-3 text-muted-foreground text-sm">
        Whether you're a startup hiring your first employee or a company scaling rapidly —
        TalentHit is built to support your journey.
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        ⏱️ We typically respond within 24 hours
      </p>

    </div>

  </div>
</section>
      {/* ================= FOOTER ================= */}
      {/* ================= FOOTER ================= */}
<footer className="border-t bg-background px-6 py-16">

<div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

  {/* Brand */}
  <div>
    <h4 className="text-xl font-bold flex items-center gap-2">
      TalentHit
    </h4>
    <p className="mt-4 text-sm text-muted-foreground">
      AI-powered hiring platform that helps companies screen, evaluate,
      and hire top talent faster.
    </p>
  </div>

  {/* Product */}
  <div>
    <h5 className="font-semibold mb-4">Product</h5>
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li><a href="#features" className="hover:text-primary">Features</a></li>
      <li><a href="#workflow" className="hover:text-primary">Workflow</a></li>
      <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
    </ul>
  </div>

  {/* Company */}
  <div>
    <h5 className="font-semibold mb-4">Company</h5>
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li><a href="#contact" className="hover:text-primary">Contact</a></li>
      <li><a href="#" className="hover:text-primary">About</a></li>
      <li><a href="#" className="hover:text-primary">Careers</a></li>
    </ul>
  </div>

  {/* CTA / Contact */}
  <div>
    <h5 className="font-semibold mb-4">Get Started</h5>
    <p className="text-sm text-muted-foreground">
      Start hiring smarter with TalentHit today.
    </p>

    <Link to="/login?role=company">
      <Button className="mt-4 w-full">Start Hiring</Button>
    </Link>

    <a
      href="mailto:info.talenthit@gmail.com"
      className="block mt-3 text-sm text-primary"
    >
      info.talenthit@gmail.com
    </a>
  </div>

</div>

{/* Bottom Bar */}
<div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
  © {new Date().getFullYear()} TalentHit. All rights reserved.
</div>

</footer>
    </div>
  );
};

export default Index;