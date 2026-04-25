"use client";

import React, { useState, useEffect } from "react";
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <header>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your profile, account, and preferences.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Section */}
        <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
              D
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Developer Profile</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>dev@example.com</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Display Name</label>
              <input type="text" defaultValue="Developer" style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Focus Level</label>
              <select style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: 'white' }}>
                <option>Intermediate</option>
                <option>Beginner</option>
                <option>Expert</option>
              </select>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={20} color="var(--primary)" /> Appearance
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Dark Mode</span>
            <div style={{ width: '40px', height: '20px', background: 'var(--primary)', borderRadius: '10px', position: 'relative' }}>
              <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Compact Dashboard</span>
            <div style={{ width: '40px', height: '20px', background: 'var(--glass-bg)', borderRadius: '10px', position: 'relative' }}>
              <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', left: '2px', top: '2px' }} />
            </div>
          </div>
        </section>

        <button 
          onClick={() => toast.success("Settings saved successfully!")}
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            padding: '16px', 
            borderRadius: '12px', 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
}
