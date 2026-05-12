import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";


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

  if (loading) return <Loading message="Connecting soon..." />;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-lg shadow-sm">
  <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    {/* Logo */}
    <Link to="/" className="flex items-center gap-3 text-lg md:text-2xl font-semibold tracking-tight">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">T</span>
      <span>TalentHit</span>
    </Link>

    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
      <a href="#features" className="hover:text-foreground transition">Features</a>
      <a href="#workflow" className="hover:text-foreground transition">Workflow</a>
      <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
      <a href="#contact" className="hover:text-foreground transition">Contact</a>
    </nav>

    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
      <ThemeToggle />
      <Link to="/login?role=applicant">
        <Button variant="outline" size="sm">Applicant</Button>
      </Link>
      <Link to="/login?role=company">
        <Button size="sm">Start Hiring</Button>
      </Link>
    </div>

  </div>
</header>

      {/* ================= HERO ================= */}
<section className="relative overflow-hidden px-6 py-24 lg:py-32">

  <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-primary/15 to-transparent" />
  <div className="absolute right-0 top-8 -z-10 hidden w-72 h-72 rounded-full bg-primary/10 blur-3xl lg:block" />

  <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">

    <div className="space-y-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm shadow-primary/10">
        AI hiring insights · faster decisions
      </div>

      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Build a smarter hiring pipeline with AI-powered screening and assessments.
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">
          TalentHit helps teams reduce bias, accelerate recruitment, and surface the right talent with confidence.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link to="/login?role=company">
          <Button size="lg" className="min-w-[180px] px-8">
            Start Hiring →
          </Button>
        </Link>
        <Link to="/login?role=applicant">
          <Button size="lg" variant="outline" className="min-w-[180px] px-8">
            Apply for Jobs
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Faster screening", value: "70%" },
          { label: "Stronger pipeline", value: "3x" },
          { label: "Better hires", value: "90%" },
          { label: "Always live", value: "24/7" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-border/60 bg-background/80 px-4 py-5 text-center shadow-sm shadow-slate-900/5 backdrop-blur">
            <div className="text-2xl font-semibold">{item.value}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="relative">
      <div className="rounded-[32px] border border-slate-200/60 bg-gradient-to-r from-primary/20 via-slate-100/60 to-emerald-100/20 p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live assessment preview</p>
            <h2 className="mt-2 text-xl font-semibold">Candidate workflow</h2>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">AI Focused</span>
        </div>

        <div className="space-y-6">
          {[
            { title: "Resume match", subtitle: "Automated fit score", accent: "bg-primary/10 text-primary" },
            { title: "Skill tests", subtitle: "Coding + domain questions", accent: "bg-slate-100 text-slate-900" },
            { title: "Ranking", subtitle: "Top candidates surfaced", accent: "bg-emerald-100 text-emerald-700" },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-border/70 bg-muted/40 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.accent}`}>
                  Live
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border/70 bg-slate-950/5 p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Application score</span>
            <span>89%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200/70">
            <div className="h-full w-[89%] rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
      {/* ================= PROBLEM ================= */}
<section className="px-6 py-24 bg-slate-950/5">

<div className="max-w-6xl mx-auto">

  <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-center">
    <div>
      <p className="text-sm uppercase tracking-[0.32em] text-primary">The hiring challenge</p>
      <h3 className="mt-5 text-4xl font-bold leading-tight">
        Modern hiring is fragmented, slow, and too risky.
      </h3>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Companies are buried under applications, manual screening drains teams, and the best candidates slip through the cracks.
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
      {[
        { icon: "📄", title: "Resume overload", text: "Countless resumes without smart filtering." },
        { icon: "⏳", title: "Slow decisions", text: "Manual review delays every hire." },
        { icon: "🔍", title: "Poor matching", text: "Lack of skills-first candidate evaluation." },
        { icon: "💸", title: "Costly mistakes", text: "Bad hires hurt teams and budgets." },
      ].map((item) => (
        <div key={item.title} className="rounded-[28px] border border-border/70 bg-background p-7 shadow-lg shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
            {item.icon}
          </div>
          <h4 className="mt-5 text-lg font-semibold">{item.title}</h4>
          <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
        </div>
      ))}
    </div>
  </div>

</div>
</section>

      {/* ================= SOLUTION ================= */}
<section className="px-6 py-24 bg-gradient-to-b from-slate-950/5 to-transparent">

<div className="max-w-7xl mx-auto">

  <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] items-center">
    <div>
      <p className="text-sm uppercase tracking-[0.32em] text-primary">Our answer</p>
      <h3 className="mt-5 text-4xl font-bold leading-tight">
        Replace noise with clarity, speed, and stronger hiring outcomes.
      </h3>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        TalentHit centralizes your hiring workflow, automates candidate evaluation, and highlights only the best-fit applicants.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {[
          { title: "AI resume matching", description: "Match applicants to role needs instantly." },
          { title: "Skill-first testing", description: "Assess candidates with tailored challenges." },
          { title: "Automated ranking", description: "Prioritize top talent with data-driven scores." },
          { title: "Hiring reports", description: "See performance, time-to-hire, and quality metrics." },
        ].map((item) => (
          <div key={item.title} className="rounded-[28px] border border-border/70 bg-background/80 p-7 shadow-sm shadow-slate-950/5">
            <h4 className="font-semibold">{item.title}</h4>
            <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-[36px] border border-border/70 bg-background p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.35)]">
      <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-slate-100/60 to-emerald-100/20 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Overview</p>
        <h4 className="mt-4 text-3xl font-semibold">A modern hiring platform designed for teams that move fast.</h4>
        <p className="mt-4 text-sm text-muted-foreground">
          Combine resume intelligence, tests, and analytics in one elegant workspace.
        </p>

        <div className="mt-8 space-y-4">
          {[
            { title: "Save time", value: "80% reduction in review hours" },
            { title: "Improve quality", value: "Better fit candidates every time" },
            { title: "Stay aligned", value: "Central hiring insights for your team" },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl bg-white/90 p-4 shadow-sm">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

</div>
</section>

     {/* ================= FEATURES ================= */}
<section id="features" className="px-6 py-24 bg-slate-950/5">

<div className="max-w-7xl mx-auto">

  <div className="text-center max-w-2xl mx-auto">
    <p className="text-sm uppercase tracking-[0.32em] text-primary">Features</p>
    <h3 className="mt-5 text-4xl font-bold leading-tight">
      Everything you need to hire great talent faster.
    </h3>
    <p className="mt-4 text-muted-foreground text-lg">
      The complete hiring stack for screening, evaluating, and selecting candidates with confidence.
    </p>
  </div>

  <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[
      {
        badge: "01",
        title: "AI resume matching",
        description: "Automatically rank candidates based on skills and fit.",
        icon: "🤖"
      },
      {
        badge: "02",
        title: "Assessment builder",
        description: "Create role-specific evaluations in seconds.",
        icon: "🧠"
      },
      {
        badge: "03",
        title: "Performance analytics",
        description: "Track hiring progress with clear dashboards.",
        icon: "📈"
      },
      {
        badge: "04",
        title: "Candidate scoring",
        description: "Score applicants objectively with skills-first insights.",
        icon: "🏅"
      },
      {
        badge: "05",
        title: "Workflow automation",
        description: "Move candidates through stages with one click.",
        icon: "⚙️"
      },
      {
        badge: "06",
        title: "Live coding",
        description: "Evaluate technical candidates with built-in coding tasks.",
        icon: "💻"
      }
    ].map((feature) => (
      <div
        key={feature.title}
        className="group rounded-[32px] border border-border/70 bg-background p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="flex items-center justify-between rounded-3xl bg-slate-950/10 p-4">
          <span className="text-2xl">{feature.icon}</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {feature.badge}
          </span>
        </div>
        <h4 className="mt-6 text-xl font-semibold">{feature.title}</h4>
        <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
      </div>
    ))}
  </div>

  <div className="mt-20 rounded-[32px] border border-border/60 bg-slate-950/10 p-10 text-center shadow-sm">
    <h4 className="text-2xl font-semibold">A hiring platform built for teams that move fast.</h4>
    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
      TalentHit brings AI, automation, and candidate insights into a single polished workflow.
    </p>
  </div>
</div>
</section>

 {/* ================= WORKFLOW ================= */}
<section id="workflow" className="px-6 py-28">

<div className="max-w-7xl mx-auto">

  <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-center">
    <div>
      <p className="text-sm uppercase tracking-[0.32em] text-primary">Workflow</p>
      <h3 className="mt-5 text-4xl font-bold leading-tight">
        From job creation to hire, every stage is smoother.
      </h3>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        A modern hiring workflow that keeps your team aligned and your candidate funnel moving.
      </p>
    </div>

    <div className="grid gap-6">
      {[
        {
          index: "01",
          title: "Create role",
          description: "Set job requirements, skills, and assessment goals.",
          accent: "bg-primary/10 text-primary"
        },
        {
          index: "02",
          title: "Screen candidates",
          description: "Use AI to shortlist the best applicants instantly.",
          accent: "bg-slate-100 text-slate-900"
        },
        {
          index: "03",
          title: "Evaluate skills",
          description: "Deploy tests and coding challenges to measure real ability.",
          accent: "bg-emerald-100 text-emerald-700"
        },
        {
          index: "04",
          title: "Hire confidently",
          description: "Review ranked candidates and move forward with clarity.",
          accent: "bg-violet-100 text-violet-700"
        }
      ].map((step) => (
        <div key={step.index} className="rounded-[32px] border border-border/70 bg-background p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-muted-foreground">Step {step.index}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${step.accent}`}>Live</span>
          </div>
          <h4 className="mt-4 text-xl font-semibold">{step.title}</h4>
          <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="mt-20 grid gap-6 sm:grid-cols-3">
    {[
      {
        title: "Tech roles",
        description: "Coding tests, system design, and live evaluation.",
        icon: "💻"
      },
      {
        title: "Business roles",
        description: "Scenario-based assessments and sales-ready scoring.",
        icon: "📊"
      },
      {
        title: "General roles",
        description: "Aptitude, communication, and role-specific evaluation.",
        icon: "🧑‍💼"
      }
    ].map((item) => (
      <div key={item.title} className="rounded-[28px] border border-border/70 bg-slate-950/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-2xl">
          {item.icon}
        </div>
        <h4 className="mt-5 text-lg font-semibold">{item.title}</h4>
        <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
      </div>
    ))}
  </div>
</div>
</section>

{/* ================= PRICING ================= */}
<section id="pricing" className="px-6 py-28 bg-slate-950/5">

  <div className="max-w-6xl mx-auto text-center">
    <p className="text-sm uppercase tracking-[0.32em] text-primary">Pricing</p>
    <h3 className="mt-5 text-4xl font-bold">Plans designed for every stage of growth.</h3>
    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
      Simple monthly pricing plus flexible capacity for teams scaling their hiring operations.
    </p>
  </div>

  <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
    <div className="rounded-[32px] border border-border/70 bg-background p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Starter</p>
      <h4 className="mt-4 text-3xl font-semibold">₹8,000</h4>
      <p className="text-sm text-muted-foreground">For early-stage teams and first hires.</p>
      <ul className="mt-8 space-y-4 text-sm">
        <li>✅ AI resume screening</li>
        <li>✅ Basic skill assessments</li>
        <li>✅ Candidate dashboard</li>
      </ul>
      <Link to="/login?role=company">
        <Button className="mt-8 w-full">Get Started</Button>
      </Link>
    </div>

    <div className="relative rounded-[32px] bg-gradient-to-r from-primary/90 to-violet-600 px-8 py-10 text-left text-white shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-2 rounded-t-[28px] bg-white/20" />
      <div className="relative">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Most Popular</p>
        <h4 className="mt-4 text-3xl font-semibold">Growth</h4>
        <p className="mt-3 text-sm text-white/80">For growing teams that need powerful hiring automation.</p>
        <div className="mt-8 flex items-baseline gap-2">
          <span className="text-5xl font-semibold">₹25,000</span>
          <span className="text-sm text-white/80">/ month</span>
        </div>
        <ul className="mt-8 space-y-4 text-sm text-white/90">
          <li>✅ Everything in Starter</li>
          <li>✅ Advanced analytics</li>
          <li>✅ Custom assessments</li>
          <li>✅ Priority support</li>
        </ul>
        <Link to="/login?role=company">
          <Button className="mt-8 w-full bg-white text-slate-950 hover:bg-slate-100">Contact Sales</Button>
        </Link>
      </div>
    </div>

    <div className="rounded-[32px] border border-border/70 bg-background p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Enterprise</p>
      <h4 className="mt-4 text-3xl font-semibold">Custom</h4>
      <p className="text-sm text-muted-foreground">Tailored packages for high-volume hiring and enterprise teams.</p>
      <ul className="mt-8 space-y-4 text-sm">
        <li>✅ Dedicated account support</li>
        <li>✅ Custom workflows</li>
        <li>✅ Enterprise-level analytics</li>
      </ul>
      <Link to="/login?role=company">
        <Button className="mt-8 w-full">Book a Call</Button>
      </Link>
    </div>
  </div>

  <p className="mt-10 text-sm text-muted-foreground text-center">
    No hidden fees • Flexible scaling • Trusted by growing teams.
  </p>
</section>

      {/* ================= CTA ================= */}
<section className="relative px-6 py-32 overflow-hidden">
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-violet-50" />
  <div className="absolute right-0 top-8 hidden h-72 w-72 rounded-full bg-primary/10 blur-3xl lg:block" />

  <div className="relative max-w-4xl mx-auto text-center">
    <p className="text-sm uppercase tracking-[0.32em] text-primary">Ready to launch</p>
    <h3 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
      Launch your next hiring cycle with confidence.
    </h3>
    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
      Start faster, reduce screening workload, and build a stronger team with TalentHit.
    </p>

    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link to="/login?role=company">
        <Button size="lg" className="px-10">Start Hiring →</Button>
      </Link>
      <a href="mailto:info.talenthit@gmail.com">
        <Button size="lg" variant="outline" className="px-10">Book a Demo</Button>
      </a>
    </div>

    <p className="mt-6 text-sm text-muted-foreground">
      Trusted by teams hiring across engineering, sales, operations, and support.
    </p>
  </div>
</section>
      {/* ================= CONTACT ================= */}
{/* ================= CONTACT ================= */}
<section id="contact" className="px-6 py-28 bg-slate-950/5">

  <div className="max-w-6xl mx-auto text-center">
    <p className="text-sm uppercase tracking-[0.32em] text-primary">Contact</p>
    <h3 className="mt-5 text-4xl font-bold">Need help with your hiring process?</h3>
    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
      Our team is ready to answer questions, book demos, and support your rollout.
    </p>

    <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
      {[
        {
          icon: "📧",
          title: "Email support",
          detail: "info.talenthit@gmail.com",
          button: "Email us",
          href: "mailto:info.talenthit@gmail.com"
        },
        {
          icon: "🎥",
          title: "Book a demo",
          detail: "See the platform in action.",
          button: "Request demo",
          href: "mailto:info.talenthit@gmail.com?subject=Demo Request"
        },
        {
          icon: "🤝",
          title: "Enterprise help",
          detail: "Get custom support for your hiring needs.",
          button: "Connect",
          href: "mailto:info.talenthit@gmail.com?subject=Business Inquiry"
        }
      ].map((item) => (
        <div key={item.title} className="rounded-[28px] border border-border/70 bg-background p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-3xl">
            {item.icon}
          </div>
          <h4 className="mt-5 text-xl font-semibold">{item.title}</h4>
          <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
          <a href={item.href} className="mt-6 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
            {item.button}
          </a>
        </div>
      ))}
    </div>

    <div className="mt-16 rounded-[32px] border border-border/70 bg-slate-950/10 p-8">
      <h4 className="text-xl font-semibold">We’re here to support your team.</h4>
      <p className="mt-4 text-sm text-muted-foreground">
        Whether you're hiring your first employee or scaling a large team, TalentHit is ready to help you move faster.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">⏱️ We typically respond within 24 hours.</p>
    </div>
  </div>
</section>

      {/* ================= TESTIMONIALS ================= */}
<section className="px-6 py-24 bg-slate-950/5">

  <div className="max-w-7xl mx-auto">
    <div className="text-center">
      <p className="text-sm uppercase tracking-[0.32em] text-primary">Testimonials</p>
      <h3 className="mt-5 text-4xl font-bold">
        Customer stories from hiring teams.
      </h3>
    </div>

    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
      See how TalentHit has transformed hiring for companies just like yours.
    </p>

    {/* Testimonials Grid */}
    <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">

      {/* Testimonial 1 */}
      <div className="rounded-[32px] border border-border/70 bg-slate-950/5 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-500">⭐</span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground italic">
          "TalentHit cut our hiring time by 60%. The AI screening is incredibly accurate,
          and the assessments give us real insights into candidates' skills."
        </p>
        <div className="mt-6">
          <p className="font-semibold">Sarah Chen</p>
          <p className="text-xs text-muted-foreground">HR Director, TechCorp</p>
        </div>
      </div>

      {/* Testimonial 2 */}
      <div className="rounded-[32px] border border-border/70 bg-slate-950/5 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-500">⭐</span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground italic">
          "As a growing startup, we couldn't afford to waste time on bad hires.
          TalentHit's automation helped us build a strong team quickly and efficiently."
        </p>
        <div className="mt-6">
          <p className="font-semibold">Mike Johnson</p>
          <p className="text-xs text-muted-foreground">CEO, StartupXYZ</p>
        </div>
      </div>

      {/* Testimonial 3 */}
      <div className="rounded-[32px] border border-border/70 bg-slate-950/5 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-500">⭐</span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground italic">
          "The candidate ranking feature is a game-changer. We no longer miss
          top talent buried in stacks of resumes. Highly recommend!"
        </p>
        <div className="mt-6">
          <p className="font-semibold">Emily Rodriguez</p>
          <p className="text-xs text-muted-foreground">Recruitment Manager, InnovateCo</p>
        </div>
      </div>

    </div>

  </div>
</section>

      {/* ================= FOOTER ================= */}
      {/* ================= FOOTER ================= */}
<footer className="border-t border-border/70 bg-background px-6 py-16">

<div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

  {/* Brand */}
  <div>
    <h4 className="text-2xl font-bold">
      TalentHit
    </h4>
    <p className="mt-4 text-sm text-muted-foreground max-w-md">
      AI-powered hiring platform that helps teams screen, evaluate, and hire top talent faster.
    </p>
    <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
      <span className="rounded-full border border-border/70 px-3 py-1">AI</span>
      <span className="rounded-full border border-border/70 px-3 py-1">Hiring</span>
      <span className="rounded-full border border-border/70 px-3 py-1">Assessments</span>
    </div>
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