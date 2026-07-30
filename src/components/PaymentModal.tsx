import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
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

  // Load Paystack script when modal opens
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
      amount: amount * 100, // Paystack uses kobo
      ref: `reg-${registrationId}-${Date.now()}`,
      metadata: {
        registrationId,
        studentName,
        studentEmail,
      },
      callback: (response: any) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Student</p>
            <p className="font-medium">{studentName}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold text-primary">
              ₦{amount.toLocaleString()}
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
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

          <p className="text-xs text-muted-foreground text-center">
            You will be redirected to Paystack to complete payment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;