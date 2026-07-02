'use client';

import React, { useState } from 'react';
import { User, Bell, Lock, CreditCard, Palette, Settings } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const profile = studentMockData.profile;

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'account', label: 'أمان الحساب', icon: Lock },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'billing', label: 'الفواتير', icon: CreditCard },
    { id: 'appearance', label: 'المظهر', icon: Palette },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-12" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">الإعدادات</h1>
        <p className="text-muted-foreground text-sm">إدارة تفضيلات حسابك وإعدادات النظام.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-card border border-border/60 rounded-3xl p-3 shadow-sm flex flex-col gap-1 sticky top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border/60 rounded-3xl p-6 lg:p-10 shadow-sm">
          
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-8 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold mb-1">الملف الشخصي العام</h2>
                <p className="text-muted-foreground text-xs">سيتم عرض هذه المعلومات للعامة.</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90 transition-colors shadow-sm">
                    تغيير الصورة
                  </button>
                  <button className="px-5 py-2.5 bg-muted/60 text-foreground font-bold rounded-xl text-xs hover:bg-muted transition-colors border border-border/50 shadow-sm">
                    إزالة
                  </button>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-foreground">الاسم الكامل</label>
                  <input type="text" defaultValue={profile.name} className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground focus:bg-background" />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-foreground">الدور / العنوان</label>
                  <input type="text" defaultValue={profile.role} className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground focus:bg-background" />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold text-foreground">نبذة شخصية</label>
                  <textarea rows={4} className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-foreground focus:bg-background" placeholder="اكتب نبذة قصيرة عن نفسك..." />
                </div>
              </div>

              <div className="pt-6 border-t border-border/60">
                <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <Settings className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">قريباً</h2>
              <p className="text-muted-foreground text-sm">قسم الإعدادات هذا قيد التطوير حالياً.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
