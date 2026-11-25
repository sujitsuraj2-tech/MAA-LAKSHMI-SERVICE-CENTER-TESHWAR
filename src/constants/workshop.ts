export const SHOP_NAME = 'MAA LAKSHMI AUTO SERVICE CENTER';
export const OWNER_NAME = 'Dhanjay Kumar';
export const SHOP_ADDRESS = 'Main Road, Aanand Bazar, Teshwar, Gaya, Bihar';
export const DEVELOPER_CREDIT = 'Developed by Sujit Razz';
export const CONTACT_NUMBER = '7634807282';
export const CALL_LINK = 'tel:7634807282';

export function buildWhatsAppUrl(message?: string): string {
  const defaultMsg =
    'Namaste Dhanjay Kumar ji, mujhe MAA LAKSHMI AUTO SERVICE CENTER par bike repair ya servicing karwani hai.';
  const text = encodeURIComponent(message ?? defaultMsg);
  return `https://wa.me/91${CONTACT_NUMBER}?text=${text}`;
}

export const WHATSAPP_LINK = buildWhatsAppUrl();
