'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070a13] flex items-center justify-center text-stone-400 text-sm">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span>جاري توجيهك إلى بوابة الإدارة...</span>
      </div>
    </div>
  );
}
