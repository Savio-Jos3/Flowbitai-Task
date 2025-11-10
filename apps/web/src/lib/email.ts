let resend: any = null;

// Only import and initialize Resend if API key exists
if (process.env.RESEND_API_KEY) {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;

  // Development mode - just log the link
  if (!resend) {
    console.log('\n📧 ========================================');
    console.log('📧 EMAIL VERIFICATION (Development Mode)');
    console.log('📧 ========================================');
    console.log(`📧 To: ${email}`);
    console.log(`🔗 Verification Link: ${verificationUrl}`);
    console.log('📧 ========================================\n');
    return { id: 'dev-mode-email' };
  }

  // Production mode - send real email
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '✅ Verify your Invoice Analytics account',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">Welcome to Invoice Analytics!</h1>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; 
                      color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Verify Email Address
            </a>
            <p>Or copy and paste this link:</p>
            <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('✅ Verification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}
