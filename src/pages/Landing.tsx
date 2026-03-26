import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProgramCard from "@/components/ProgramCard";
import { Rocket, Shield, GraduationCap, ArrowRight, Users, Zap, Globe } from "lucide-react";

const programs = [
  { name: "Frontend Development Internship", description: "Master React, TypeScript, and modern web technologies. Build real-world projects with industry mentors.", duration: "3 months", monthlyFee: 15000, type: "Internship" },
  { name: "Backend Development Internship", description: "Learn Node.js, databases, and API design. Deploy scalable server-side applications.", duration: "3 months", monthlyFee: 15000, type: "Internship" },
  { name: "SIWES - Software Engineering", description: "Industrial training program for university students. Gain hands-on experience in software development.", duration: "6 months", monthlyFee: 10000, type: "SIWES" },
  { name: "SIWES - Data Science", description: "Apply data science skills in real-world scenarios. Work with Python, ML, and analytics tools.", duration: "6 months", monthlyFee: 12000, type: "SIWES" },
];

const steps = [
  { icon: Rocket, title: "Register", desc: "Sign up and choose your preferred program track." },
  { icon: Shield, title: "Get Approved", desc: "Our team reviews your application and gets you started." },
  { icon: GraduationCap, title: "Learn & Grow", desc: "Access resources, mentors, and build real projects." },
];

const Landing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">Now accepting applications</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in">
          Empowering <span className="gradient-text">Tech Talent</span><br />in Africa
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Join InnoSpace to access world-class tech training, earn commissions as an intern, and build the future of African tech.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link to="/register">
            <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 px-8 text-lg h-14 glow-primary">
              Register Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-glass-border hover:bg-secondary px-8 text-lg h-14">
              Login
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><span className="text-sm">500+ Students</span></div>
          <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-accent" /><span className="text-sm">10+ Cities</span></div>
          <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /><span className="text-sm">95% Placement</span></div>
        </div>
      </div>
    </section>

    {/* Programs */}
    <section className="py-20 px-4" id="programs">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="gradient-text">Programs</span></h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Choose from our curated tech programs designed for the African market.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {programs.map((p, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <ProgramCard {...p} />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="glass p-8 text-center animate-fade-in group hover:glow-primary transition-all duration-300" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <step.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-accent font-bold text-sm mb-2">Step {i + 1}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        © 2026 InnoSpace. Empowering Tech Talent in Africa.
      </div>
    </footer>
  </div>
);

export default Landing;
