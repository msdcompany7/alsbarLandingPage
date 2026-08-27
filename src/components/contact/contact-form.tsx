"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import {
  inquiryFormSchemaWithHoneypot,
  type InquiryFormValues,
} from "@/lib/validation/inquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchemaWithHoneypot),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: InquiryFormValues) {
    setServerError(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setServerError(data.error ?? "שליחת הטופס נכשלה. נסו שוב.");
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setServerError("שגיאת רשת. בדקו את החיבור ונסו שוב.");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/20 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-4 text-xl font-bold text-primary">הפנייה נשלחה בהצלחה</h2>
        <p className="mt-2 text-text-secondary">
          קיבלנו את ההודעה ונחזור אליכם בהקדם האפשרי.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          שליחת פנייה נוספת
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">שם מלא *</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="ישראל ישראלי"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div>
          <Label htmlFor="phone">טלפון *</Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder="050-000-0000"
            className="text-start"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">אימייל (אופציונלי)</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="name@example.com"
          className="text-start"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div>
        <Label htmlFor="message">הודעה</Label>
        <Textarea
          id="message"
          placeholder="ספרו לנו מה אתם מחפשים — סוג מוצר, כמות, פרויקט..."
          error={errors.message?.message}
          {...register("message")}
        />
      </div>

      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {serverError && (
        <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="navy" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            שולח...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            שליחת פנייה
          </>
        )}
      </Button>

      <p className="text-xs text-text-secondary">
        שליחת הטופס מהווה הסכמה ליצירת קשר בהתאם ל
        <a href="/privacy" className="mx-1 underline hover:text-primary">
          מדיניות הפרטיות
        </a>
        .
      </p>
    </form>
  );
}
