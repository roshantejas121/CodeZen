"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("Account created! Redirecting to login...");
      router.push("/auth/login");
    } else {
      const data = await res.json();
      toast.error(data.error || "Registration failed");
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid var(--card-border)' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>Join the Network</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Build your reputation as a master architect.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" placeholder="Username" required
            style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '12px', color: 'white', outline: 'none' }}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />
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
            Initialize Identity
          </button>
        </form>
      </motion.div>
    </div>
  );
}
