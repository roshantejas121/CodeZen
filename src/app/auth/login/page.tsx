"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Identity verified. Welcome back.");
      router.push("/problems");
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid var(--card-border)' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>Login to Hub</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Verify your credentials to access the terminal.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="email" placeholder="Email" required
            style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '12px', color: 'white', outline: 'none' }}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <input 
            type="password" placeholder="Password" required
            style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '12px', color: 'white', outline: 'none' }}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="bg-gradient" style={{ padding: '16px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 900, cursor: 'pointer', marginTop: '10px' }}>
            Verify Identity
          </button>
        </form>
      </motion.div>
    </div>
  );
}
