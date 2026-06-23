import fs from 'fs';
import path from 'path';

/**
 * Generates an email-safe 2-column table grid of cart items.
 * Robust design using table cells instead of flexbox for 100% email client compatibility.
 */
export function renderCartItemsGrid(cartItems, allowedOrigin) {
  if (!cartItems || cartItems.length === 0) return '';
  
  let html = '<table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">';
  
  for (let i = 0; i < cartItems.length; i += 2) {
    html += '<tr>';
    
    // Column 1
    const item1 = cartItems[i];
    const img1 = item1.sku === 'MD-50G' 
      ? `${allowedOrigin}/packaging_highres.webp` 
      : item1.sku === 'MD-100G' 
        ? `${allowedOrigin}/packaging_highres.webp` 
        : `${allowedOrigin}/morivana-powder.jpeg`;
                 
    html += `
      <td width="48%" align="center" style="font-family: sans-serif; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px 0 0 0; vertical-align: top; overflow: hidden;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td align="center" height="120" valign="middle" style="padding: 0 16px 12px 16px;">
              <img src="${img1}" height="100" style="border-radius: 6px; display: block; border: 0; outline: none; text-decoration: none;" alt="${item1.name || 'Product'}"/>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#F1F5F9" style="padding: 12px 16px; border-radius: 0 0 12px 12px; height: 38px; vertical-align: middle;">
              <div style="font-size: 13px; font-weight: bold; color: #1C3A1C; line-height: 1.3; text-align: center;">${item1.name || 'Product'}</div>
            </td>
          </tr>
        </table>
      </td>
    `;
    
    // Column 2
    if (i + 1 < cartItems.length) {
      const item2 = cartItems[i + 1];
      const img2 = item2.sku === 'MD-50G' 
        ? `${allowedOrigin}/packaging_highres.webp` 
        : item2.sku === 'MD-100G' 
          ? `${allowedOrigin}/packaging_highres.webp` 
          : `${allowedOrigin}/morivana-powder.jpeg`;
                   
      html += `
        <td width="4%" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
        <td width="48%" align="center" style="font-family: sans-serif; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px 0 0 0; vertical-align: top; overflow: hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td align="center" height="120" valign="middle" style="padding: 0 16px 12px 16px;">
                <img src="${img2}" height="100" style="border-radius: 6px; display: block; border: 0; outline: none; text-decoration: none;" alt="${item2.name || 'Product'}"/>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#F1F5F9" style="padding: 12px 16px; border-radius: 0 0 12px 12px; height: 38px; vertical-align: middle;">
                <div style="font-size: 13px; font-weight: bold; color: #1C3A1C; line-height: 1.3; text-align: center;">${item2.name || 'Product'}</div>
              </td>
            </tr>
          </table>
        </td>
      `;
    } else {
      // Empty spacing cell
      html += `
        <td width="4%" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
        <td width="48%">&nbsp;</td>
      `;
    }
    
    html += '</tr>';
    
    if (i + 2 < cartItems.length) {
      html += '<tr><td colspan="3" style="height: 16px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>';
    }
  }
  
  html += '</table>';
  return html;
}

/**
 * Compiles an email template by loading the HTML file and injecting data keys.
 * Supports special handling for complex structures like cart lists.
 */
export function compileTemplate(templateName, data = {}) {
  const filePath = path.join(process.cwd(), 'server', 'templates', `${templateName}.html`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template not found at: ${filePath}`);
  }
  
  let html = fs.readFileSync(filePath, 'utf-8');
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
  
  // Inject defaults
  const compileData = {
    allowedOrigin,
    year: new Date().getFullYear().toString(),
    ...data
  };
  
  // Render cart items if present
  if (data.cartItems) {
    compileData.cartItemsListHtml = renderCartItemsGrid(data.cartItems, allowedOrigin);
  }
  
  // Replace tags
  for (const [key, value] of Object.entries(compileData)) {
    // Escape string in replacement
    const replacement = typeof value === 'string' ? value : JSON.stringify(value);
    html = html.split(`{{${key}}}`).join(replacement);
  }
  
  return html;
}
