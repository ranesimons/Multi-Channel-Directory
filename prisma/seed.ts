import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const HOUR = 1000 * 60 * 60;
const now = Date.now();
const ago = (hours: number) => new Date(now - hours * HOUR);

async function main() {
  await prisma.tagsOnLeads.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.note.deleteMany();
  await prisma.message.deleteMany();
  await prisma.lead.deleteMany();

  const [hot, warm, referral, vip] = await Promise.all([
    prisma.tag.create({ data: { name: "Hot Lead", color: "red" } }),
    prisma.tag.create({ data: { name: "Warm", color: "amber" } }),
    prisma.tag.create({ data: { name: "Referral", color: "violet" } }),
    prisma.tag.create({ data: { name: "VIP", color: "emerald" } }),
  ]);

  // 1. Maya Torres — multi-channel, active negotiation
  const maya = await prisma.lead.create({
    data: {
      name: "Maya Torres",
      stage: "QUALIFIED",
      location: "Vancouver, Canada",
      email: "maya.torres@gmail.com",
      phone: "+1 (415) 555-0142",
      facebookHandle: "maya.torres.9",
      instagramHandle: "@mayatorresphoto",
      whatsappNumber: "+1 415 555 0142",
      tags: { create: [{ tagId: hot.id }, { tagId: vip.id }] },
      notes: {
        create: [
          {
            body: "Booked a discovery call for next Tuesday. Very responsive, wants pricing for the annual plan.",
            createdAt: ago(20),
          },
        ],
      },
      messages: {
        create: [
          { channel: "INSTAGRAM", direction: "INBOUND", body: "Hey! Saw your ad, do you ship internationally?", sentAt: ago(96), read: true },
          { channel: "INSTAGRAM", direction: "OUTBOUND", body: "Hi Maya! Yes we do 🌍 Where are you located?", sentAt: ago(95), read: true },
          { channel: "INSTAGRAM", direction: "INBOUND", body: "Vancouver, Canada. What's the cost to ship there?", sentAt: ago(95), read: true },
          { channel: "EMAIL", direction: "OUTBOUND", body: "Hi Maya, following up from Instagram — attached is our international shipping rate sheet and a quote for your order. Let me know if you have questions!", sentAt: ago(70), read: true },
          { channel: "EMAIL", direction: "INBOUND", body: "This looks great, thank you! Can we hop on a call this week to go over the annual plan?", sentAt: ago(50), read: true },
          { channel: "WHATSAPP", direction: "OUTBOUND", body: "Hi Maya, it's Alex from the team — happy to call! Does Tuesday 2pm PT work for you?", sentAt: ago(30), read: true },
          { channel: "WHATSAPP", direction: "INBOUND", body: "Tuesday 2pm works perfectly, talk then!", sentAt: ago(29), read: true },
          { channel: "WHATSAPP", direction: "INBOUND", body: "Quick q before the call — does the annual plan include onboarding support?", sentAt: ago(3), read: false },
        ],
      },
    },
  });

  // 2. Jordan Blake — Facebook lead, early stage
  await prisma.lead.create({
    data: {
      name: "Jordan Blake",
      stage: "NEW",
      location: "Chicago, IL",
      email: null,
      phone: "+1 (312) 555-0199",
      facebookHandle: "jordan.blake.90",
      instagramHandle: null,
      whatsappNumber: null,
      tags: { create: [{ tagId: warm.id }] },
      messages: {
        create: [
          { channel: "FACEBOOK", direction: "INBOUND", body: "Hi, I saw your post about the spring collection — is it still available?", sentAt: ago(6), read: false },
          { channel: "FACEBOOK", direction: "INBOUND", body: "Also do you offer a student discount?", sentAt: ago(6), read: false },
        ],
      },
    },
  });

  // 3. Priya Chandran — email-first, referral, deal won
  await prisma.lead.create({
    data: {
      name: "Priya Chandran",
      stage: "WON",
      location: "New York, NY",
      email: "priya.chandran@outlook.com",
      phone: "+1 (646) 555-0177",
      facebookHandle: null,
      instagramHandle: "@priyac.designs",
      whatsappNumber: "+1 646 555 0177",
      tags: { create: [{ tagId: referral.id }, { tagId: vip.id }] },
      notes: {
        create: [
          { body: "Closed the deal! Onboarding kickoff scheduled. Great referral source — thank David.", createdAt: ago(15) },
        ],
      },
      messages: {
        create: [
          { channel: "EMAIL", direction: "INBOUND", body: "Hi there, David Kim recommended I reach out — we're looking for a solution for our small studio.", sentAt: ago(200), read: true },
          { channel: "EMAIL", direction: "OUTBOUND", body: "Hi Priya, wonderful to hear from you! I'd love to learn more about your studio's needs. Free for a quick call this week?", sentAt: ago(195), read: true },
          { channel: "EMAIL", direction: "INBOUND", body: "Thursday works. Also, what are your payment terms?", sentAt: ago(190), read: true },
          { channel: "EMAIL", direction: "OUTBOUND", body: "Thursday 11am it is — sending an invite now. We offer monthly or annual billing, annual gets 15% off.", sentAt: ago(188), read: true },
          { channel: "WHATSAPP", direction: "INBOUND", body: "Loved the call! Sending over our team details for onboarding shortly.", sentAt: ago(40), read: true },
          { channel: "WHATSAPP", direction: "OUTBOUND", body: "Amazing, welcome aboard Priya! 🎉 Kickoff doc is on its way to your inbox.", sentAt: ago(39), read: true },
          { channel: "EMAIL", direction: "OUTBOUND", body: "Contract signed and payment received — excited to get started!", sentAt: ago(16), read: true },
        ],
      },
    },
  });

  // 4. Sam Okafor — SMS/personal texting, lost deal
  await prisma.lead.create({
    data: {
      name: "Sam Okafor",
      stage: "LOST",
      location: "Chicago, IL",
      email: "sam.okafor@yahoo.com",
      phone: "+1 (773) 555-0110",
      facebookHandle: null,
      instagramHandle: null,
      whatsappNumber: null,
      messages: {
        create: [
          { channel: "SMS", direction: "OUTBOUND", body: "Hi Sam, this is Alex from the studio — following up on the quote I sent last week. Any questions?", sentAt: ago(300), read: true },
          { channel: "SMS", direction: "INBOUND", body: "Hey, thanks for following up. We decided to go with another vendor for this round. Appreciate the time though!", sentAt: ago(280), read: true },
          { channel: "SMS", direction: "OUTBOUND", body: "Totally understand, thanks for letting me know! Keep us in mind for next time 🙌", sentAt: ago(279), read: true },
        ],
      },
      notes: {
        create: [{ body: "Went with a competitor on price. Follow up again in Q1 next year.", createdAt: ago(278) }],
      },
    },
  });

  // 5. Leah Fitzgerald — WhatsApp heavy, contacted
  await prisma.lead.create({
    data: {
      name: "Leah Fitzgerald",
      stage: "CONTACTED",
      location: "London, UK",
      email: "leah.fitz@icloud.com",
      phone: "+44 7700 900123",
      facebookHandle: null,
      instagramHandle: "@leahfitz.creative",
      whatsappNumber: "+44 7700 900123",
      tags: { create: [{ tagId: warm.id }] },
      messages: {
        create: [
          { channel: "WHATSAPP", direction: "INBOUND", body: "Hi! Found you through your catalog, is the ceramic set still in stock?", sentAt: ago(12), read: true },
          { channel: "WHATSAPP", direction: "OUTBOUND", body: "Hi Leah! Yes, we have 3 sets left. Want me to hold one for you?", sentAt: ago(11), read: true },
          { channel: "WHATSAPP", direction: "INBOUND", body: "Yes please! Do you ship to the UK?", sentAt: ago(10), read: true },
          { channel: "WHATSAPP", direction: "OUTBOUND", body: "We do — usually 5-7 business days. I'll hold your set for 48 hours while you decide.", sentAt: ago(9), read: true },
          { channel: "INSTAGRAM", direction: "INBOUND", body: "Just followed you! Your feed is gorgeous 😍", sentAt: ago(2), read: false },
        ],
      },
    },
  });

  // 6. Marcus Webb — Instagram DM only, new
  await prisma.lead.create({
    data: {
      name: "Marcus Webb",
      stage: "NEW",
      location: "Los Angeles, CA",
      email: null,
      phone: null,
      facebookHandle: null,
      instagramHandle: "@marcuswebb.fit",
      whatsappNumber: null,
      messages: {
        create: [
          { channel: "INSTAGRAM", direction: "INBOUND", body: "Yo do you do custom orders?", sentAt: ago(1), read: false },
        ],
      },
    },
  });

  // 7. Elena Vasquez — email, qualified, multi-touch
  await prisma.lead.create({
    data: {
      name: "Elena Vasquez",
      stage: "QUALIFIED",
      location: "Austin, TX",
      email: "elena.vasquez@vasquezstudio.com",
      phone: "+1 (512) 555-0163",
      facebookHandle: "elena.vasquez.studio",
      instagramHandle: null,
      whatsappNumber: null,
      tags: { create: [{ tagId: hot.id }] },
      notes: {
        create: [{ body: "Runs a 12-person design studio, evaluating us against two competitors. Decision by end of month.", createdAt: ago(24) }],
      },
      messages: {
        create: [
          { channel: "EMAIL", direction: "INBOUND", body: "Hi, requesting a demo of your platform for our design studio (12 seats).", sentAt: ago(120), read: true },
          { channel: "EMAIL", direction: "OUTBOUND", body: "Hi Elena, happy to set that up! What's your team's biggest pain point right now?", sentAt: ago(115), read: true },
          { channel: "EMAIL", direction: "INBOUND", body: "Mainly keeping client feedback organized across projects. Also comparing you to two other tools.", sentAt: ago(110), read: true },
          { channel: "FACEBOOK", direction: "INBOUND", body: "Hi, following up from email — is there a discount for annual teams over 10 seats?", sentAt: ago(24), read: true },
          { channel: "FACEBOOK", direction: "OUTBOUND", body: "Yes! Teams over 10 get 20% off annual. I'll send a formal quote over email today.", sentAt: ago(23), read: true },
        ],
      },
    },
  });

  // 8. Devon Park — SMS, qualified
  await prisma.lead.create({
    data: {
      name: "Devon Park",
      stage: "CONTACTED",
      location: "Seattle, WA",
      email: "devon.park@parkbuilds.co",
      phone: "+1 (206) 555-0188",
      facebookHandle: null,
      instagramHandle: null,
      whatsappNumber: null,
      messages: {
        create: [
          { channel: "SMS", direction: "OUTBOUND", body: "Hi Devon, great meeting you at the trade show! Here's the info packet I promised: bit.ly/info-pack", sentAt: ago(48), read: true },
          { channel: "SMS", direction: "INBOUND", body: "Thanks! Will look this over with my team and get back to you next week.", sentAt: ago(46), read: true },
          { channel: "SMS", direction: "INBOUND", body: "One more q — what's the minimum contract length?", sentAt: ago(5), read: false },
        ],
      },
    },
  });

  console.log("Seed complete:", { maya: maya.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
