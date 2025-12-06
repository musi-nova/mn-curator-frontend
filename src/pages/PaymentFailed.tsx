import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16 text-center">
        <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Payment failed</h1>
        <p className="text-muted-foreground mb-6">Your payment did not complete. Please try again.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate("/pricing")}>Try again</Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailed;
