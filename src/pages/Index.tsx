import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">TalentHit</h1>

          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="flex gap-3">
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
      <section className="text-center px-6 py-28 max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold leading-tight">
          Stop Wasting Hours Screening Candidates
        </h2>

        <p className="mt-6 text-lg text-muted-foreground">
          TalentHit automates resume screening, technical assessments, and
          candidate ranking — so you can hire the best talent faster with data,
          not guesswork.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/login?role=company">
            <Button size="lg">Start Hiring</Button>
          </Link>
          <Link to="/login?role=applicant">
            <Button size="lg" variant="outline">
              Apply for Jobs
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Built for startups, agencies, and growing teams
        </p>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="px-8 py-20 bg-muted/30 text-center">
        <h3 className="text-3xl font-bold mb-6">
          Hiring is Broken Today
        </h3>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
          <div>❌ Too many irrelevant resumes</div>
          <div>❌ Manual screening wastes time</div>
          <div>❌ No proper skill evaluation</div>
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section className="px-8 py-20 text-center max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-6">
          TalentHit Solves This with AI
        </h3>

        <p className="text-muted-foreground">
          Our platform automatically filters, evaluates, and ranks candidates
          using AI-powered resume analysis, MCQ testing, and real coding
          assessments.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Core Features
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            ["AI Resume Screening", "Filter candidates instantly"],
            ["Skill-Based MCQs", "Auto-generated evaluations"],
            ["Coding Engine", "Run real-world coding tests"],
            ["Candidate Ranking", "AI-powered scoring system"],
            ["Company Dashboard", "Track hiring metrics"],
            ["Pipeline Automation", "Multi-stage hiring flow"]
          ].map(([title, desc], i) => (
            <div key={i} className="p-6 border rounded-2xl">
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm mt-2 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      {/* ================= HOW IT WORKS ================= */}
<section id="workflow" className="px-8 py-24 bg-muted/30">
  <h3 className="text-3xl font-bold text-center mb-6">
    How TalentHit Works for Any Role
  </h3>

  <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
    Whether you're hiring developers, marketers, HRs, sales executives, or support staff —
    TalentHit adapts assessments based on the job role and required skills.
  </p>

  <div className="grid md:grid-cols-4 gap-10 text-center max-w-6xl mx-auto">

    <div>
      <div className="text-4xl font-bold mb-2">1</div>
      <h4 className="font-semibold">Create Job Role</h4>
      <p className="text-sm text-muted-foreground mt-2">
        Define role, skills, and experience required (e.g. Developer, Sales, HR).
      </p>
    </div>

    <div>
      <div className="text-4xl font-bold mb-2">2</div>
      <h4 className="font-semibold">AI Resume Screening</h4>
      <p className="text-sm text-muted-foreground mt-2">
        Automatically filters candidates based on job-specific criteria.
      </p>
    </div>

    <div>
      <div className="text-4xl font-bold mb-2">3</div>
      <h4 className="font-semibold">Role-Based Assessments</h4>
      <p className="text-sm text-muted-foreground mt-2">
        Technical MCQs, domain questions, or coding tests based on role.
      </p>
    </div>

    <div>
      <div className="text-4xl font-bold mb-2">4</div>
      <h4 className="font-semibold">Smart Ranking</h4>
      <p className="text-sm text-muted-foreground mt-2">
        AI ranks candidates so you can hire faster with confidence.
      </p>
    </div>

  </div>

  {/* EXTRA CLARITY SECTION */}
  <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-sm text-center">
    <div className="p-6 border rounded-xl">
      💻 <strong>Tech Roles</strong>
      <p className="mt-2 text-muted-foreground">
        Coding tests + system design + backend/frontend questions
      </p>
    </div>

    <div className="p-6 border rounded-xl">
      📈 <strong>Business Roles</strong>
      <p className="mt-2 text-muted-foreground">
        Sales scenarios, marketing strategy, case-based MCQs
      </p>
    </div>

    <div className="p-6 border rounded-xl">
      🧑‍💼 <strong>General Roles</strong>
      <p className="mt-2 text-muted-foreground">
        Aptitude, communication, HR, and domain-specific evaluations
      </p>
    </div>
  </div>

</section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="px-8 py-24 text-center">
        <h3 className="text-3xl font-bold mb-12">Pricing</h3>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          <div className="border rounded-2xl p-8">
            <h4 className="text-xl font-semibold">Starter</h4>
            <p className="text-muted-foreground mt-2">Perfect for small teams</p>

            <h3 className="text-3xl font-bold mt-6">₹8,000/month</h3>
            <p className="text-sm text-muted-foreground mt-2">
              + ₹20 per applicant
            </p>

            <Link to="/login?role=company">
              <Button className="mt-6 w-full">Get Started</Button>
            </Link>
          </div>

          <div className="border rounded-2xl p-8 shadow-lg">
            <h4 className="text-xl font-semibold">Growth</h4>
            <p className="text-muted-foreground mt-2">For scaling companies</p>

            <h3 className="text-3xl font-bold mt-6">₹25,000/month</h3>

            <Link to="/login?role=company">
              <Button className="mt-6 w-full">Contact Sales</Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      {/* ================= CTA ================= */}
<section className="text-center py-24 bg-muted/30">
  <h3 className="text-4xl font-bold leading-tight max-w-3xl mx-auto">
    Hire the Right Candidates — Not Just More Candidates
  </h3>

  <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
    TalentHit automatically screens resumes, evaluates real skills,
    and ranks candidates based on the job role — whether you're hiring
    developers, sales teams, or operational staff.
  </p>

  <div className="mt-8 flex justify-center gap-4">
    <Link to="/login?role=company">
      <Button size="lg">Start Hiring with AI</Button>
    </Link>

    <a href="mailto:contact@talenthit.in">
      <Button size="lg" variant="outline">
        Book a Demo
      </Button>
    </a>
  </div>

  <p className="mt-6 text-sm text-muted-foreground">
    No setup hassle • Role-based assessments • Faster hiring decisions
  </p>
</section>
      {/* ================= CONTACT ================= */}
      {/* ================= CONTACT ================= */}
<section id="contact" className="px-8 py-24 bg-muted/30">
  <div className="max-w-5xl mx-auto text-center">

    <h3 className="text-3xl font-bold">
      Let’s Help You Hire Better
    </h3>

    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
      Have questions, want a demo, or looking to integrate TalentHit into your hiring process?
      Our team is here to help you get started.
    </p>

    {/* CONTACT OPTIONS */}
    <div className="mt-10 grid md:grid-cols-3 gap-6">

      <div className="p-6 border rounded-2xl bg-background">
        <h4 className="font-semibold text-lg">Email</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Reach out for support or inquiries
        </p>
        <a
          href="mailto:contact@talenthit.in"
          className="block mt-4 text-primary font-medium"
        >
          contact@talenthit.in
        </a>
      </div>

      <div className="p-6 border rounded-2xl bg-background">
        <h4 className="font-semibold text-lg">Book a Demo</h4>
        <p className="text-sm text-muted-foreground mt-2">
          See TalentHit in action with a guided walkthrough
        </p>
        <a href="mailto:contact@talenthit.in?subject=Demo Request">
          <button className="mt-4 text-primary font-medium">
            Request Demo →
          </button>
        </a>
      </div>

      <div className="p-6 border rounded-2xl bg-background">
        <h4 className="font-semibold text-lg">Business Inquiries</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Partnerships, pricing, or enterprise plans
        </p>
        <a
          href="mailto:contact@talenthit.in?subject=Business Inquiry"
          className="block mt-4 text-primary font-medium"
        >
          Connect with us →
        </a>
      </div>

    </div>

    {/* TRUST LINE */}
    <p className="mt-10 text-sm text-muted-foreground">
      We typically respond within 24 hours
    </p>

  </div>
</section>
      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-gray-700 py-10 px-8 text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">

          <div>
            <h4 className="font-semibold text-foreground">TalentHit</h4>
            <p className="mt-2">
              AI hiring automation platform for modern recruitment.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="font-medium">Product</p>
              <p className="mt-2">Features</p>
              <p>Pricing</p>
            </div>

            <div>
              <p className="font-medium">Company</p>
              <p className="mt-2">About</p>
              <p>Contact</p>
            </div>
          </div>

        </div>

        <p className="text-center mt-8">
          © {new Date().getFullYear()} TalentHit. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;