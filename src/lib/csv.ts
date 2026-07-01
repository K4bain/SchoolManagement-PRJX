export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: string; label: string }[],
  filename: string
) {
  const csvHeaders = headers.map((h) => h.label).join(",");
  const csvRows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h.key];
        const str = val == null ? "" : String(val);
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(",")
  );
  const csv = [csvHeaders, ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
