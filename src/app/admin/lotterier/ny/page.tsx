import type { Metadata } from "next";

import { LotteryForm } from "@/components/admin/lottery-form";
import { RequireAdmin } from "@/components/auth/require-admin";

export const metadata: Metadata = {
  title: "Nytt lotteri – Admin",
};

export default function NewLotteryPage() {
  return (
    <RequireAdmin>
      <div className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Nytt lotteri</h1>
        <LotteryForm />
      </div>
    </RequireAdmin>
  );
}
