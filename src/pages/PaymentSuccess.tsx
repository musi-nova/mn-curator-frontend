import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  const { search } = useLocation();

  useEffect(() => {
    const run = async () => {
      // Optionally handle query params (like payment id) from the gateway
      await refreshSubscription();
      // Redirect to dashboard after refreshing status
      navigate("/dashboard", { replace: true });
    };
    run();
  }, [refreshSubscription, navigate, search]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Payment successful</h1>
        <p className="text-muted-foreground mb-6">Thanks — we are updating your subscription now.</p>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </main>
    </div>
  );
};

export default PaymentSuccess;
