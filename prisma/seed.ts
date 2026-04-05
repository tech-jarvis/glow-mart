import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log("Products already exist; skipping seed.");
    return;
  }

  await prisma.product.createMany({
    data: [
      {
        name: "Rose quartz pendant necklace",
        slug: "rose-quartz-pendant-necklace",
        description:
          "Delicate gold-tone chain with a soft rose quartz stone—perfect for layering or wearing solo.",
        priceCents: 129900,
        category: "Jewellery",
        stock: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      },
      {
        name: "Pearl hoop earrings",
        slug: "pearl-hoop-earrings",
        description:
          "Lightweight hoops with freshwater-inspired pearls. Day-to-night friendly.",
        priceCents: 89900,
        category: "Jewellery",
        stock: 20,
        imageUrl:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      },
      {
        name: "Minimal mesh watch",
        slug: "minimal-mesh-watch",
        description:
          "Slim rose-gold mesh strap, sunray dial, and quiet elegance for everyday wear.",
        priceCents: 349900,
        category: "Watches",
        stock: 8,
        imageUrl:
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
      },
      {
        name: "Velvet lip duo set",
        slug: "velvet-lip-duo-set",
        description:
          "Two complementary velvet-matte shades in a travel-friendly tin—buildable and comfortable.",
        priceCents: 149900,
        category: "Beauty",
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
      },
      {
        name: "Silk scrunchie trio",
        slug: "silk-scrunchie-trio",
        description:
          "Gentle on hair, chic on the wrist. Blush, champagne, and cocoa tones.",
        priceCents: 6900,
        category: "Beauty",
        stock: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      },
      {
        name: "Crystal hair pins (set of 3)",
        slug: "crystal-hair-pins-set",
        description:
          "Sparkling pins for buns and half-ups—wedding season or brunch ready.",
        priceCents: 7900,
        category: "Accessories",
        stock: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
      },
    ],
  });

  console.log("Seeded starter products for Glow Mart.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
