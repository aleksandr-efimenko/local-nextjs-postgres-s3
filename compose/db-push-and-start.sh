#!/bin/sh
npx prisma generate
npx prisma db push
npm run dev