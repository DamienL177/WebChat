rm -rf dev.db
npx prisma db push
node dbCreation.js