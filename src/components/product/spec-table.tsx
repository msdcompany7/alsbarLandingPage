import type { ProductSpec } from "@/lib/mock-data";

type SpecTableProps = {
  specs: ProductSpec[];
};

export function SpecTable({ specs }: SpecTableProps) {
  if (specs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label} className="border-b border-border last:border-0">
              <th className="w-2/5 bg-surface-alt px-4 py-3 text-start font-semibold text-text-primary">
                {spec.label}
              </th>
              <td className="px-4 py-3 text-text-secondary" dir="ltr">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
