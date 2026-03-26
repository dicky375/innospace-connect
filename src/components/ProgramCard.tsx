import { Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  name: string;
  description: string;
  duration: string;
  monthlyFee: number;
  type: string;
  onRegister?: () => void;
}

const ProgramCard = ({ name, description, duration, monthlyFee, type, onRegister }: Props) => (
  <div className="glass p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300 animate-fade-in group">
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 text-xs font-semibold rounded-full gradient-primary text-primary-foreground">{type}</span>
    </div>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-muted-foreground text-sm flex-1">{description}</p>
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{duration}</span>
      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />₦{monthlyFee.toLocaleString()}/mo</span>
    </div>
    {onRegister && (
      <Button onClick={onRegister} className="gradient-primary text-primary-foreground hover:opacity-90 mt-2">
        Register Now
      </Button>
    )}
  </div>
);

export default ProgramCard;
