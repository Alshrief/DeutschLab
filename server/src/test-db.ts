import prisma from './prisma.js';

async function main() {
  const users = await prisma.user.count();
  const providers = await prisma.aiProvider.findMany({ select: { name: true, providerType: true, modelName: true, isDefault: true } });
  const grammarRules = await prisma.grammarRule.findMany({ select: { title: true, slug: true, cefrLevel: true } });
  const vocabularies = await prisma.vocabulary.findMany({
    include: { sentenceHistories: true, fsrsProgress: true },
  });

  console.log('--- DATABASE HEALTH CHECK ---');
  console.log(`Total Users: ${users}`);
  console.log(`AI Providers: ${providers.length}`, providers);
  console.log(`Grammar Rules: ${grammarRules.length}`, grammarRules);
  console.log(`Vocabularies: ${vocabularies.length}`);
  for (const v of vocabularies) {
    console.log(`- [${v.cefrLevel}] ${v.word} (${v.arabicTranslation}) -> ${v.sentenceHistories.length} sentences, FSRS stability: ${v.fsrsProgress[0]?.stability}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
