import { prisma } from './index';

async function main() {
  await prisma.websiteCategory.createMany({
    data: [
      { category_id: 1, category_name: 'Social Media' },
      { category_id: 2, category_name: 'Entertainment' },
      { category_id: 3, category_name: 'E-commerce' },
      { category_id: 4, category_name: 'News & Media' },
      { category_id: 5, category_name: 'Business' },
      { category_id: 6, category_name: 'Education' },
      { category_id: 7, category_name: 'Technology' },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
