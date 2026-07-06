export function time_biutifier(value: string | Date): string {
   return new Date(value)
      .toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      .replace(',', '-')
      .replace(/\s/g, '');
}

