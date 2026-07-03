"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { createLottery, updateLottery } from "@/lib/actions/admin";
import { toDatetimeLocalValue } from "@/lib/date";
import {
  adminLotteryInputSchema,
  type AdminLotteryInput,
  type Lottery,
} from "@/lib/types/lottery";

export function LotteryForm({ lottery }: { lottery?: Lottery }) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminLotteryInput>({
    resolver: zodResolver(adminLotteryInputSchema),
    defaultValues: lottery
      ? {
          title: lottery.title,
          description: lottery.description,
          ticketPriceSek: lottery.ticketPriceSek,
          prizeTitle: lottery.prizeTitle,
          prizeValueSek: lottery.prizeValueSek,
          status: lottery.status,
          drawAt: toDatetimeLocalValue(lottery.drawAt),
        }
      : { status: "open" },
  });

  // useForm's defaultValues is only read once at mount, so after
  // router.refresh() brings in fresh server data (e.g. status flips to
  // "closed" post-draw) the form needs an explicit reset to pick it up.
  useEffect(() => {
    if (!lottery) return;
    reset({
      title: lottery.title,
      description: lottery.description,
      ticketPriceSek: lottery.ticketPriceSek,
      prizeTitle: lottery.prizeTitle,
      prizeValueSek: lottery.prizeValueSek,
      status: lottery.status,
      drawAt: toDatetimeLocalValue(lottery.drawAt),
    });
  }, [lottery, reset]);

  async function onSubmit(data: AdminLotteryInput) {
    if (!user) return;

    setSubmitting(true);
    try {
      const idToken = await user.getIdToken();
      const payload = { ...data, drawAt: new Date(data.drawAt).toISOString() };

      const result = lottery
        ? await updateLottery(idToken, lottery.id, payload)
        : await createLottery(idToken, payload);

      if (result.success) {
        toast.success(lottery ? "Lotteriet uppdaterat!" : "Lotteriet skapat!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">Titel</FieldLabel>
          <Input id="title" {...register("title")} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Beskrivning</FieldLabel>
          <Textarea id="description" rows={3} {...register("description")} />
          <FieldError errors={[errors.description]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.ticketPriceSek}>
            <FieldLabel htmlFor="ticketPriceSek">Pris per lott (kr)</FieldLabel>
            <Input
              id="ticketPriceSek"
              type="number"
              min={1}
              {...register("ticketPriceSek", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.ticketPriceSek]} />
          </Field>
          <Field data-invalid={!!errors.prizeValueSek}>
            <FieldLabel htmlFor="prizeValueSek">Vinstens värde (kr)</FieldLabel>
            <Input
              id="prizeValueSek"
              type="number"
              min={1}
              {...register("prizeValueSek", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.prizeValueSek]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.prizeTitle}>
          <FieldLabel htmlFor="prizeTitle">Vinst</FieldLabel>
          <Input id="prizeTitle" {...register("prizeTitle")} />
          <FieldError errors={[errors.prizeTitle]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.drawAt}>
            <FieldLabel htmlFor="drawAt">Dragning</FieldLabel>
            <Input id="drawAt" type="datetime-local" {...register("drawAt")} />
            <FieldError errors={[errors.drawAt]} />
          </Field>

          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <select
              id="status"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs dark:bg-input/30"
              {...register("status")}
            >
              <option value="open">Öppet</option>
              <option value="closed">Stängt</option>
            </select>
            <FieldError errors={[errors.status]} />
          </Field>
        </div>

        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Sparar…" : lottery ? "Spara ändringar" : "Skapa lotteri"}
        </Button>
      </FieldGroup>
    </form>
  );
}
