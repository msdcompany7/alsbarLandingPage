import { Search, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-surface-alt py-20">
      <Container className="text-center">
        <p className="text-6xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 text-3xl font-bold text-primary">הדף לא נמצא</h1>
        <p className="mx-auto mt-3 max-w-md text-text-secondary">
          ייתכן שהקישור שגוי או שהדף הוסר. חזרו לדף הבית או חפשו בקטלוג.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" variant="navy">
            <Home className="h-4 w-4" />
            דף הבית
          </Button>
          <Button href="/products" variant="outline">
            <Search className="h-4 w-4" />
            קטלוג מוצרים
          </Button>
        </div>
      </Container>
    </section>
  );
}
