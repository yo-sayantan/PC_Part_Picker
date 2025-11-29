import nodemailer from 'nodemailer';

export interface EmailBuildData {
    parts: {
        category: string;
        name: string;
        price: number;
        retailer: string;
    }[];
    totalPrice: number;
    estimatedWattage: number;
}

export async function sendBuildSummary(toEmail: string, buildData: EmailBuildData) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const partsTable = buildData.parts.map(part => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${part.category}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${part.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${part.retailer}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${part.price.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your PC Build Summary</h2>
      <p>Here is the list of parts you selected:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Category</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Part Name</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Retailer</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${partsTable}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold;">
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Estimated Price:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${buildData.totalPrice.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
             <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Estimated Wattage:</td>
             <td style="padding: 8px; border: 1px solid #ddd;">${buildData.estimatedWattage}W</td>
          </tr>
        </tfoot>
      </table>

      <p style="font-size: 12px; color: #666;">Prices are subject to change. Please check the retailer website for the latest price.</p>
    </div>
  `;

    await transporter.sendMail({
        from: '"PC Part Picker India" <noreply@pcpartpicker.in>',
        to: toEmail,
        subject: 'Your PC Build Summary',
        html,
    });
}
