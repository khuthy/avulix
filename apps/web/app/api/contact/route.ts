import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  school: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().optional(),
  message: z.string().min(10),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.contactInquiry.create({
      data: {
        name: data.name,
        school: data.school,
        email: data.email,
        phone: data.phone ?? null,
        role: data.role ?? null,
        message: data.message,
        source: data.source ?? null,
      },
    });

    // Send notification email if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Avulix Contact" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL ?? process.env.SMTP_USER,
          subject: `New contact inquiry from ${data.name} — ${data.school}`,
          html: `
            <h2>New Contact Inquiry</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>School:</strong> ${data.school}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone ?? "—"}</p>
            <p><strong>Role:</strong> ${data.role ?? "—"}</p>
            <p><strong>Source:</strong> ${data.source ?? "—"}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, "<br/>")}</p>
          `,
        });
      } catch {
        // Email failure is non-fatal — inquiry is already saved to DB
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", issues: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
