import bcryptjs from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@email.com' }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcryptjs.hash('123456', 10)
    
    await prisma.user.create({
      data: {
        email: 'admin@email.com',
        password: hashedPassword,
        nome: 'Admin'
      }
    })

    console.log('Admin user created: admin@email.com / 123456')
  } else {
    console.log('Admin user already exists')
  }

  // seed default rule types
  const tipos = [
    'QR Code',
    'Documento',
    'Lista Impressa',
    'Confirmação por Email'
  ];

  for (const nome of tipos) {
    const existing = await prisma.tipoRegra.findUnique({ where: { nome } });
    if (!existing) {
      await prisma.tipoRegra.create({ data: { nome } });
      console.log(`Tipo de regra '${nome}' criado`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
