import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "primary" | "accent" | "default";
}

const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: Props) => {
  const glowClass = variant === "primary" ? "glow-primary" : variant === "accent" ? "glow-accent" : "";

  return (
    <div className={`glass p-6 animate-fade-in ${glowClass} group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && <p className="text-xs text-accent mt-2">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${variant === "primary" ? "gradient-primary" : variant === "accent" ? "gradient-accent" : "bg-secondary"}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
