import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, X } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  amount: number;
  studentName: string;
  studentEmail: string;
  onSuccess: () => void;
}

const PaymentModal = ({
  open,
  onOpenChange,
  registrationId,
  amount,
  studentName,
  studentEmail,
  onSuccess,
}: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && !window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [open]);

  const handlePayment = () => {
    setIsLoading(true);

    if (!window.PaystackPop) {
      toast.error("Payment system is loading. Please try again.");
      setIsLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
      email: studentEmail,
      amount: amount * 100,
      ref: `reg-${registrationId}-${Date.now()}`,
      metadata: {
        registrationId,
        studentName,
        studentEmail,
      },
      callback: () => {
        toast.success("Payment successful! Registration confirmed.");
        setIsLoading(false);
        onSuccess();
        onOpenChange(false);
      },
      onClose: () => {
        toast.error("Payment cancelled. Please try again.");
        setIsLoading(false);
      },
    });

    handler.openIframe();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Complete Payment</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Student</span>
              <span className="font-medium">{studentName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-2xl font-bold text-primary">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">💳 Pay with Card, Bank Transfer, or USSD</p>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ₦{amount.toLocaleString()}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to Paystack to complete payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;