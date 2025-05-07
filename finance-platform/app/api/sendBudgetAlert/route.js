// app/api/sendBudgetAlert/route.js
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    console.log("Starting /api/sendBudgetAlert request");
    const body = await request.json();
    const {
      userEmail,
      type,
      category,
      percentage,
      budget,
      spent,
      remaining,
      currency,
    } = body;

    console.log("Send Budget Alert: Request Body:", body);

    if (!userEmail || !type || !budget || !spent || !remaining || !currency) {
      console.log("Send Budget Alert: Missing required fields");
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Send Budget Alert: Email credentials not set in .env");
      return new Response(
        JSON.stringify({ message: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Configure NodeMailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Budget Alert: ${
        type === "total" ? "Total Budget" : category
      } Reached ${percentage}%!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Budget Alert</h2>
          <p>Your ${
            type === "total" ? "Total Budget" : category
          } has reached <strong>${percentage}%</strong> of the allocated budget.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Budget: ${currency}${budget}</li>
            <li>Spent: ${currency}${spent}</li>
            <li>Remaining: ${currency}${remaining}</li>
          </ul>
          <p>Review your spending now to stay on track!</p>
          <p>Thanks,<br />Your Budget App Team</p>
        </div>
      `,
    };

    console.log(
      "Sending email to:",
      userEmail,
      "with subject:",
      mailOptions.subject
    );
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", userEmail);
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to send email", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
