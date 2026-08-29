import {createRequire} from 'module';
        const require = createRequire(import.meta.url)
        
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express2 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.9.1",
  "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Booking {\n  id           String   @id @default(uuid())\n  customerId   String\n  technicianId String\n  serviceId    String\n  bookingDate  DateTime\n\n  slot String\n\n  status      BookingStatus @default(REQUESTED)\n  totalAmount Float\n\n  availabilityId String\n\n  note String?\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  customer User @relation("CustomerBookings", fields: [customerId], references: [id])\n\n  technician User @relation("TechnicianBookings", fields: [technicianId], references: [id])\n\n  service Service @relation(fields: [serviceId], references: [id])\n\n  availability technicianAvailability @relation(fields: [availabilityId], references: [id])\n  payment      Payment?\n\n  review Review?\n\n  @@unique([availabilityId, slot])\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([serviceId])\n  @@index([status])\n  @@index([bookingDate])\n  @@index([customerId, status])\n  @@index([technicianId, status])\n  @@index([technicianId, bookingDate])\n  @@map("bookings")\n}\n\nmodel Category {\n  id String @id @default(uuid())\n\n  name String @unique\n\n  description String?\n\n  icon String?\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  services Service[]\n\n  @@index([createdAt])\n  @@map("categories")\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  UNBAN\n  BAN\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  bookingId     String @unique\n  transactionId String @unique\n\n  stripeSessionId       String? @unique\n  stripePaymentIntentId String? @unique\n\n  amount Float\n  status PaymentStatus @default(PENDING)\n  paidAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@index([status])\n  @@index([paidAt])\n  @@map("payments")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId String @unique\n\n  customerId String\n\n  technicianId String\n\n  rating Int\n\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  customer User @relation("CustomerReview", fields: [customerId], references: [id])\n\n  technician User @relation("TechnicianReview", fields: [technicianId], references: [id])\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([rating])\n  @@index([createdAt])\n  @@index([technicianId, rating])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id String @id @default(uuid())\n\n  title String\n\n  description String\n\n  img String?\n\n  price Float\n\n  duration Int\n\n  technicianId String\n\n  categoryId String\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  technician User @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  category Category @relation(fields: [categoryId], references: [id])\n\n  bookings Booking[]\n\n  @@index([technicianId])\n  @@index([categoryId])\n  @@index([price])\n  @@index([createdAt])\n  @@index([categoryId, price])\n  @@index([technicianId, categoryId])\n  @@map("services")\n}\n\nmodel technicianAvailability {\n  id           String    @id @default(uuid())\n  technicianId String\n  date         DateTime?\n  slots        String[]\n  isAvailable  Boolean   @default(true)\n\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  booking Booking[]\n\n  @@index([technicianId])\n  @@map("technician_availabilities")\n}\n\nmodel TechnicianProfile {\n  id String @id @default(uuid())\n\n  userId String @unique\n\n  bio String?\n\n  experience Int\n\n  hourlyRate Float\n\n  location String\n\n  availability technicianAvailability[]\n\n  rating Float @default(0)\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([hourlyRate])\n  @@index([rating])\n  @@index([location])\n  @@map("technician_profiles")\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String\n  email    String  @unique\n  password String\n  phone    String?\n  image    String?\n\n  role   Role       @default(CUSTOMER)\n  status UserStatus @default(UNBAN)\n\n  address String?\n  city    String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  technicianProfile TechnicianProfile?\n\n  customerBookings Booking[] @relation("CustomerBookings")\n\n  technicianBookings Booking[] @relation("TechnicianBookings")\n\n  services Service[]\n\n  reviewGiven Review[] @relation("CustomerReview")\n\n  reviewReceived Review[] @relation("TechnicianReview")\n\n  @@index([role])\n  @@index([status])\n  @@index([city])\n  @@index([createdAt])\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"bookingDate","kind":"scalar","type":"DateTime"},{"name":"slot","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerBookings"},{"name":"technician","kind":"object","type":"User","relationName":"TechnicianBookings"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"availability","kind":"object","type":"technicianAvailability","relationName":"BookingTotechnicianAvailability"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"}],"dbName":"categories"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerReview"},{"name":"technician","kind":"object","type":"User","relationName":"TechnicianReview"}],"dbName":"reviews"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"img","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technician","kind":"object","type":"User","relationName":"ServiceToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"}],"dbName":"services"},"technicianAvailability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"slots","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileTotechnicianAvailability"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingTotechnicianAvailability"}],"dbName":"technician_availabilities"},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"location","kind":"scalar","type":"String"},{"name":"availability","kind":"object","type":"technicianAvailability","relationName":"TechnicianProfileTotechnicianAvailability"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"}],"dbName":"technician_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"},{"name":"customerBookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"technicianBookings","kind":"object","type":"Booking","relationName":"TechnicianBookings"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToUser"},{"name":"reviewGiven","kind":"object","type":"Review","relationName":"CustomerReview"},{"name":"reviewReceived","kind":"object","type":"Review","relationName":"TechnicianReview"}],"dbName":"users"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","technician","booking","_count","availability","user","technicianProfile","customerBookings","technicianBookings","services","category","bookings","customer","reviewGiven","reviewReceived","service","payment","review","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","data","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","create","update","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","having","_avg","_sum","_min","_max","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","technicianAvailability.findUnique","technicianAvailability.findUniqueOrThrow","technicianAvailability.findFirst","technicianAvailability.findFirstOrThrow","technicianAvailability.findMany","technicianAvailability.createOne","technicianAvailability.createMany","technicianAvailability.createManyAndReturn","technicianAvailability.updateOne","technicianAvailability.updateMany","technicianAvailability.updateManyAndReturn","technicianAvailability.upsertOne","technicianAvailability.deleteOne","technicianAvailability.deleteMany","technicianAvailability.groupBy","technicianAvailability.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","phone","image","Role","role","UserStatus","status","address","city","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","userId","bio","experience","hourlyRate","location","rating","technicianId","date","slots","isAvailable","has","hasEvery","hasSome","title","description","img","price","duration","categoryId","bookingId","customerId","comment","transactionId","stripeSessionId","stripePaymentIntentId","amount","PaymentStatus","paidAt","icon","serviceId","bookingDate","slot","BookingStatus","totalAmount","availabilityId","note","availabilityId_slot","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "xgRQgAEWAwAAhAIAIAYAAKMCACAOAACEAgAgEQAAogIAIBIAAKQCACATAAClAgAgnAEAAKACADCdAQAACQAQngEAAKACADCfAQEAAAABqAEAAKEC3AEiqwFAAPUBACGsAUAA9QEAIcEBAQDxAQAhzwEBAPEBACHYAQEA8QEAIdkBQAD1AQAh2gEBAPEBACHcAQgAggIAId0BAQDxAQAh3gEBAPIBACHfAQAAqQIAIAEAAAABACAOBgAAgwIAIAcAAIQCACCcAQAAgAIAMJ0BAAADABCeAQAAgAIAMJ8BAQDxAQAhqwFAAPUBACGsAUAA9QEAIbsBAQDxAQAhvAEBAPIBACG9AQIAgQIAIb4BCACCAgAhvwEBAPEBACHAAQgAggIAIQEAAAADACAKAwAAqAIAIAQAAPcBACCcAQAApgIAMJ0BAAAFABCeAQAApgIAMJ8BAQDxAQAhwQEBAPEBACHCAUAAlQIAIcMBAACHAgAgxAEgAKcCACEDAwAAxAMAIAQAAMUDACDCAQAAqgIAIAoDAACoAgAgBAAA9wEAIJwBAACmAgAwnQEAAAUAEJ4BAACmAgAwnwEBAAAAAcEBAQDxAQAhwgFAAJUCACHDAQAAhwIAIMQBIACnAgAhAwAAAAUAIAEAAAYAMAIAAAcAIBUDAACEAgAgBgAAowIAIA4AAIQCACARAACiAgAgEgAApAIAIBMAAKUCACCcAQAAoAIAMJ0BAAAJABCeAQAAoAIAMJ8BAQDxAQAhqAEAAKEC3AEiqwFAAPUBACGsAUAA9QEAIcEBAQDxAQAhzwEBAPEBACHYAQEA8QEAIdkBQAD1AQAh2gEBAPEBACHcAQgAggIAId0BAQDxAQAh3gEBAPIBACEHAwAA0AMAIAYAAP8DACAOAADQAwAgEQAA_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-QMAICcAAPwDACAoAAD7AwAgKQAA-gMAIN4BAACqAgAgD5wBAACZAgAwnQEAADcAEJ4BAACZAgAwnwEBAN8BACGoAQAAmgLcASKrAUAA4wEAIawBQADjAQAhwQEBAN8BACHPAQEA3wEAIdgBAQDfAQAh2QFAAOMBACHaAQEA3wEAIdwBCAD8AQAh3QEBAN8BACHeAQEA4AEAIQMAAAAJACABAAA2ADAlAAA3ACADAAAACQAgAQAACgAwAgAAAQAgCgsAAPgBACCcAQAAmAIAMJ0BAAA9ABCeAQAAmAIAMJ8BAQAAAAGgAQEAAAABqwFAAPUBACGsAUAA9QEAIckBAQDyAQAh1wEBAPIBACEBAAAAOgAgAQAAADoAIAoLAAD4AQAgnAEAAJgCADCdAQAAPQAQngEAAJgCADCfAQEA8QEAIaABAQDxAQAhqwFAAPUBACGsAUAA9QEAIckBAQDyAQAh1wEBAPIBACEDCwAAxgMAIMkBAACqAgAg1wEAAKoCACADAAAAPQAgAQAAPgAwAgAAOgAgAwAAAD0AIAEAAD4AMAIAADoAIAMAAAA9ACABAAA-ADACAAA6ACAHCwAA9wMAIJ8BAQAAAAGgAQEAAAABqwFAAAAAAawBQAAAAAHJAQEAAAAB1wEBAAAAAQEZAABCACAGnwEBAAAAAaABAQAAAAGrAUAAAAABrAFAAAAAAckBAQAAAAHXAQEAAAABARkAAEQAMAEZAABEADAHCwAA7QMAIJ8BAQCuAgAhoAEBAK4CACGrAUAAsgIAIawBQACyAgAhyQEBAK8CACHXAQEArwIAIQIAAAA6ACAZAABHACAGnwEBAK4CACGgAQEArgIAIasBQACyAgAhrAFAALICACHJAQEArwIAIdcBAQCvAgAhAgAAAD0AIBkAAEkAIAIAAAA9ACAZAABJACADAAAAOgAgIAAAQgAgIQAARwAgAQAAADoAIAEAAAA9ACAFBQAA6gMAICgAAOwDACApAADrAwAgyQEAAKoCACDXAQAAqgIAIAmcAQAAlwIAMJ0BAABQABCeAQAAlwIAMJ8BAQDfAQAhoAEBAN8BACGrAUAA4wEAIawBQADjAQAhyQEBAOABACHXAQEA4AEAIQMAAAA9ACABAABPADAlAABQACADAAAAPQAgAQAAPgAwAgAAOgAgDgQAAJYCACCcAQAAkwIAMJ0BAAAiABCeAQAAkwIAMJ8BAQAAAAGoAQAAlALWASKrAUAA9QEAIawBQAD1AQAhzgEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBCACCAgAh1gFAAJUCACEBAAAAUwAgAQAAAFMAIAQEAADpAwAg0gEAAKoCACDTAQAAqgIAINYBAACqAgAgAwAAACIAIAEAAFYAMAIAAFMAIAMAAAAiACABAABWADACAABTACADAAAAIgAgAQAAVgAwAgAAUwAgCwQAAOgDACCfAQEAAAABqAEAAADWAQKrAUAAAAABrAFAAAAAAc4BAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAQgAAAAB1gFAAAAAAQEZAABaACAKnwEBAAAAAagBAAAA1gECqwFAAAAAAawBQAAAAAHOAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEIAAAAAdYBQAAAAAEBGQAAXAAwARkAAFwAMAsEAADnAwAgnwEBAK4CACGoAQAA_gLWASKrAUAAsgIAIawBQACyAgAhzgEBAK4CACHRAQEArgIAIdIBAQCvAgAh0wEBAK8CACHUAQgA3wIAIdYBQAD_AgAhAgAAAFMAIBkAAF8AIAqfAQEArgIAIagBAAD-AtYBIqsBQACyAgAhrAFAALICACHOAQEArgIAIdEBAQCuAgAh0gEBAK8CACHTAQEArwIAIdQBCADfAgAh1gFAAP8CACECAAAAIgAgGQAAYQAgAgAAACIAIBkAAGEAIAMAAABTACAgAABaACAhAABfACABAAAAUwAgAQAAACIAIAgFAADiAwAgJgAA4wMAICcAAOYDACAoAADlAwAgKQAA5AMAINIBAACqAgAg0wEAAKoCACDWAQAAqgIAIA2cAQAAjwIAMJ0BAABoABCeAQAAjwIAMJ8BAQDfAQAhqAEAAJAC1gEiqwFAAOMBACGsAUAA4wEAIc4BAQDfAQAh0QEBAN8BACHSAQEA4AEAIdMBAQDgAQAh1AEIAPwBACHWAUAAhgIAIQMAAAAiACABAABnADAlAABoACADAAAAIgAgAQAAVgAwAgAAUwAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACALAwAA1AIAIAQAAMgCACAOAADJAgAgnwEBAAAAAasBQAAAAAGsAUAAAAABwAECAAAAAcEBAQAAAAHOAQEAAAABzwEBAAAAAdABAQAAAAEBGQAAcAAgCJ8BAQAAAAGrAUAAAAABrAFAAAAAAcABAgAAAAHBAQEAAAABzgEBAAAAAc8BAQAAAAHQAQEAAAABARkAAHIAMAEZAAByADALAwAA0gIAIAQAAMUCACAOAADGAgAgnwEBAK4CACGrAUAAsgIAIawBQACyAgAhwAECAMMCACHBAQEArgIAIc4BAQCuAgAhzwEBAK4CACHQAQEArwIAIQIAAAAaACAZAAB1ACAInwEBAK4CACGrAUAAsgIAIawBQACyAgAhwAECAMMCACHBAQEArgIAIc4BAQCuAgAhzwEBAK4CACHQAQEArwIAIQIAAAAYACAZAAB3ACACAAAAGAAgGQAAdwAgAwAAABoAICAAAHAAICEAAHUAIAEAAAAaACABAAAAGAAgBgUAAN0DACAmAADeAwAgJwAA4QMAICgAAOADACApAADfAwAg0AEAAKoCACALnAEAAI4CADCdAQAAfgAQngEAAI4CADCfAQEA3wEAIasBQADjAQAhrAFAAOMBACHAAQIA-wEAIcEBAQDfAQAhzgEBAN8BACHPAQEA3wEAIdABAQDgAQAhAwAAABgAIAEAAH0AMCUAAH4AIAMAAAAYACABAAAZADACAAAaACABAAAAEgAgAQAAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIA0DAADcAwAgDAAAhwMAIA0AAIgDACCfAQEAAAABqwFAAAAAAawBQAAAAAHBAQEAAAAByAEBAAAAAckBAQAAAAHKAQEAAAABywEIAAAAAcwBAgAAAAHNAQEAAAABARkAAIYBACAKnwEBAAAAAasBQAAAAAGsAUAAAAABwQEBAAAAAcgBAQAAAAHJAQEAAAABygEBAAAAAcsBCAAAAAHMAQIAAAABzQEBAAAAAQEZAACIAQAwARkAAIgBADANAwAA2wMAIAwAAOECACANAADiAgAgnwEBAK4CACGrAUAAsgIAIawBQACyAgAhwQEBAK4CACHIAQEArgIAIckBAQCuAgAhygEBAK8CACHLAQgA3wIAIcwBAgDDAgAhzQEBAK4CACECAAAAEgAgGQAAiwEAIAqfAQEArgIAIasBQACyAgAhrAFAALICACHBAQEArgIAIcgBAQCuAgAhyQEBAK4CACHKAQEArwIAIcsBCADfAgAhzAECAMMCACHNAQEArgIAIQIAAAAQACAZAACNAQAgAgAAABAAIBkAAI0BACADAAAAEgAgIAAAhgEAICEAAIsBACABAAAAEgAgAQAAABAAIAYFAADWAwAgJgAA1wMAICcAANoDACAoAADZAwAgKQAA2AMAIMoBAACqAgAgDZwBAACNAgAwnQEAAJQBABCeAQAAjQIAMJ8BAQDfAQAhqwFAAOMBACGsAUAA4wEAIcEBAQDfAQAhyAEBAN8BACHJAQEA3wEAIcoBAQDgAQAhywEIAPwBACHMAQIA-wEAIc0BAQDfAQAhAwAAABAAIAEAAJMBADAlAACUAQAgAwAAABAAIAEAABEAMAIAABIAIAEAAAAHACABAAAABwAgAwAAAAUAIAEAAAYAMAIAAAcAIAMAAAAFACABAAAGADACAAAHACADAAAABQAgAQAABgAwAgAABwAgBwMAANUDACAEAAC8AwAgnwEBAAAAAcEBAQAAAAHCAUAAAAABwwEAALsDACDEASAAAAABARkAAJwBACAFnwEBAAAAAcEBAQAAAAHCAUAAAAABwwEAALsDACDEASAAAAABARkAAJ4BADABGQAAngEAMAcDAADUAwAgBAAAsAMAIJ8BAQCuAgAhwQEBAK4CACHCAUAA_wIAIcMBAACtAwAgxAEgAK4DACECAAAABwAgGQAAoQEAIAWfAQEArgIAIcEBAQCuAgAhwgFAAP8CACHDAQAArQMAIMQBIACuAwAhAgAAAAUAIBkAAKMBACACAAAABQAgGQAAowEAIAMAAAAHACAgAACcAQAgIQAAoQEAIAEAAAAHACABAAAABQAgBAUAANEDACAoAADTAwAgKQAA0gMAIMIBAACqAgAgCJwBAACFAgAwnQEAAKoBABCeAQAAhQIAMJ8BAQDfAQAhwQEBAN8BACHCAUAAhgIAIcMBAACHAgAgxAEgAIgCACEDAAAABQAgAQAAqQEAMCUAAKoBACADAAAABQAgAQAABgAwAgAABwAgDgYAAIMCACAHAACEAgAgnAEAAIACADCdAQAAAwAQngEAAIACADCfAQEAAAABqwFAAPUBACGsAUAA9QEAIbsBAQAAAAG8AQEA8gEAIb0BAgCBAgAhvgEIAIICACG_AQEA8QEAIcABCACCAgAhAQAAAK0BACABAAAArQEAIAMGAADPAwAgBwAA0AMAILwBAACqAgAgAwAAAAMAIAEAALABADACAACtAQAgAwAAAAMAIAEAALABADACAACtAQAgAwAAAAMAIAEAALABADACAACtAQAgCwYAAL0DACAHAADOAwAgnwEBAAAAAasBQAAAAAGsAUAAAAABuwEBAAAAAbwBAQAAAAG9AQIAAAABvgEIAAAAAb8BAQAAAAHAAQgAAAABARkAALQBACAJnwEBAAAAAasBQAAAAAGsAUAAAAABuwEBAAAAAbwBAQAAAAG9AQIAAAABvgEIAAAAAb8BAQAAAAHAAQgAAAABARkAALYBADABGQAAtgEAMAsGAACiAwAgBwAAzQMAIJ8BAQCuAgAhqwFAALICACGsAUAAsgIAIbsBAQCuAgAhvAEBAK8CACG9AQIAwwIAIb4BCADfAgAhvwEBAK4CACHAAQgA3wIAIQIAAACtAQAgGQAAuQEAIAmfAQEArgIAIasBQACyAgAhrAFAALICACG7AQEArgIAIbwBAQCvAgAhvQECAMMCACG-AQgA3wIAIb8BAQCuAgAhwAEIAN8CACECAAAAAwAgGQAAuwEAIAIAAAADACAZAAC7AQAgAwAAAK0BACAgAAC0AQAgIQAAuQEAIAEAAACtAQAgAQAAAAMAIAYFAADIAwAgJgAAyQMAICcAAMwDACAoAADLAwAgKQAAygMAILwBAACqAgAgDJwBAAD6AQAwnQEAAMIBABCeAQAA-gEAMJ8BAQDfAQAhqwFAAOMBACGsAUAA4wEAIbsBAQDfAQAhvAEBAOABACG9AQIA-wEAIb4BCAD8AQAhvwEBAN8BACHAAQgA_AEAIQMAAAADACABAADBAQAwJQAAwgEAIAMAAAADACABAACwAQAwAgAArQEAIBUIAAD2AQAgCQAA9wEAIAoAAPcBACALAAD4AQAgDwAA-QEAIBAAAPkBACCcAQAA8AEAMJ0BAADIAQAQngEAAPABADCfAQEAAAABoAEBAPEBACGhAQEAAAABogEBAPEBACGjAQEA8gEAIaQBAQDyAQAhpgEAAPMBpgEiqAEAAPQBqAEiqQEBAPIBACGqAQEA8gEAIasBQAD1AQAhrAFAAPUBACEBAAAAxQEAIAEAAADFAQAgFQgAAPYBACAJAAD3AQAgCgAA9wEAIAsAAPgBACAPAAD5AQAgEAAA-QEAIJwBAADwAQAwnQEAAMgBABCeAQAA8AEAMJ8BAQDxAQAhoAEBAPEBACGhAQEA8QEAIaIBAQDxAQAhowEBAPIBACGkAQEA8gEAIaYBAADzAaYBIqgBAAD0AagBIqkBAQDyAQAhqgEBAPIBACGrAUAA9QEAIawBQAD1AQAhCggAAMQDACAJAADFAwAgCgAAxQMAIAsAAMYDACAPAADHAwAgEAAAxwMAIKMBAACqAgAgpAEAAKoCACCpAQAAqgIAIKoBAACqAgAgAwAAAMgBACABAADJAQAwAgAAxQEAIAMAAADIAQAgAQAAyQEAMAIAAMUBACADAAAAyAEAIAEAAMkBADACAADFAQAgEggAAL4DACAJAAC_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-wEAIb4BCAD8AQAhvwEBAN8BACHAAQgA_AEAIQ0FAADlAQAgJgAA_gEAICcAAOUBACAoAADlAQAgKQAA5QEAIK0BAgAAAAGuAQIAAAAErwECAAAABLABAgAAAAGxAQIAAAABsgECAAAAAbMBAgAAAAG0AQIA_wEAIQ0FAADlAQAgJgAA_gEAICcAAP4BACAoAAD-AQAgKQAA_gEAIK0BCAAAAAGuAQgAAAAErwEIAAAABLABCAAAAAGxAQgAAAABsgEIAAAAAbMBCAAAAAG0AQgA_QEAIQ0FAADlAQAgJgAA_gEAICcAAP4BACAoAAD-AQAgKQAA_gEAIK0BCAAAAAGuAQgAAAAErwEIAAAABLABCAAAAAGxAQgAAAABsgEIAAAAAbMBCAAAAAG0AQgA_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-BAAgIQAAxAQAIOIBAAC_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-QIAICEAAP0CACALAAAAIgAgGQAA_QIAIJ8BAQCuAgAhqAEAAP4C1gEiqwFAALICACGsAUAAsgIAIdEBAQCuAgAh0gEBAK8CACHTAQEArwIAIdQBCADfAgAh1gFAAP8CACEJnwEBAK4CACGoAQAA_gLWASKrAUAAsgIAIawBQACyAgAh0QEBAK4CACHSAQEArwIAIdMBAQCvAgAh1AEIAN8CACHWAUAA_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_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_wMAIA4AANADACARAAD-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_AQEAAAABwAEIAAAAAQIAAACtAQAgIAAAjQQAIAMAAAADACAgAACNBAAgIQAAkQQAIAwAAAADACAHAADNAwAgGQAAkQQAIJ8BAQCuAgAhqwFAALICACGsAUAAsgIAIbsBAQCuAgAhvAEBAK8CACG9AQIAwwIAIb4BCADfAgAhvwEBAK4CACHAAQgA3wIAIQoHAADNAwAgnwEBAK4CACGrAUAAsgIAIawBQACyAgAhuwEBAK4CACG8AQEArwIAIb0BAgDDAgAhvgEIAN8CACG_AQEArgIAIcABCADfAgAhEQkAAL8DACAKAADAAwAgCwAAwQMAIA8AAMIDACAQAADDAwAgnwEBAAAAAaABAQAAAAGhAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpgEAAACmAQKoAQAAAKgBAqkBAQAAAAGqAQEAAAABqwFAAAAAAawBQAAAAAECAAAAxQEAICAAAJIEACADAAAAyAEAICAAAJIEACAhAACWBAAgEwAAAMgBACAJAAC0AgAgCgAAtQIAIAsAALYCACAPAAC3AgAgEAAAuAIAIBkAAJYEACCfAQEArgIAIaABAQCuAgAhoQEBAK4CACGiAQEArgIAIaMBAQCvAgAhpAEBAK8CACGmAQAAsAKmASKoAQAAsQKoASKpAQEArwIAIaoBAQCvAgAhqwFAALICACGsAUAAsgIAIREJAAC0AgAgCgAAtQIAIAsAALYCACAPAAC3AgAgEAAAuAIAIJ8BAQCuAgAhoAEBAK4CACGhAQEArgIAIaIBAQCuAgAhowEBAK8CACGkAQEArwIAIaYBAACwAqYBIqgBAACxAqgBIqkBAQCvAgAhqgEBAK8CACGrAUAAsgIAIawBQACyAgAhC58BAQAAAAGoAQAAANwBAqsBQAAAAAGsAUAAAAABwQEBAAAAAc8BAQAAAAHYAQEAAAAB2QFAAAAAAdoBAQAAAAHcAQgAAAAB3gEBAAAAAQSfAQEAAAABwgFAAAAAAcMBAAC7AwAgxAEgAAAAAQufAQEAAAABqAEAAADcAQKrAUAAAAABrAFAAAAAAcEBAQAAAAHYAQEAAAAB2QFAAAAAAdoBAQAAAAHcAQgAAAAB3QEBAAAAAd4BAQAAAAEMAwAA3AMAIAwAAIcDACCfAQEAAAABqwFAAAAAAawBQAAAAAHBAQEAAAAByAEBAAAAAckBAQAAAAHKAQEAAAABywEIAAAAAcwBAgAAAAHNAQEAAAABAgAAABIAICAAAJoEACADAAAAEAAgIAAAmgQAICEAAJ4EACAOAAAAEAAgAwAA2wMAIAwAAOECACAZAACeBAAgnwEBAK4CACGrAUAAsgIAIawBQACyAgAhwQEBAK4CACHIAQEArgIAIckBAQCuAgAhygEBAK8CACHLAQgA3wIAIcwBAgDDAgAhzQEBAK4CACEMAwAA2wMAIAwAAOECACCfAQEArgIAIasBQACyAgAhrAFAALICACHBAQEArgIAIcgBAQCuAgAhyQEBAK4CACHKAQEArwIAIcsBCADfAgAhzAECAMMCACHNAQEArgIAIQufAQEAAAABqAEAAADcAQKrAUAAAAABrAFAAAAAAc8BAQAAAAHYAQEAAAAB2QFAAAAAAdoBAQAAAAHcAQgAAAAB3QEBAAAAAd4BAQAAAAEGnwEBAAAAAaABAQAAAAGrAUAAAAABrAFAAAAAAckBAQAAAAHXAQEAAAABAgAAADoAICAAAKAEACAGAwAA1QMAIJ8BAQAAAAHBAQEAAAABwgFAAAAAAcMBAAC7AwAgxAEgAAAAAQIAAAAHACAgAACiBAAgEQgAAL4DACAJAAC_AwAgCwAAwQMAIA8AAMIDACAQAADDAwAgnwEBAAAAAaABAQAAAAGhAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpgEAAACmAQKoAQAAAKgBAqkBAQAAAAGqAQEAAAABqwFAAAAAAawBQAAAAAECAAAAxQEAICAAAKQEACARCAAAvgMAIAoAAMADACALAADBAwAgDwAAwgMAIBAAAMMDACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGmAQAAAKYBAqgBAAAAqAECqQEBAAAAAaoBAQAAAAGrAUAAAAABrAFAAAAAAQIAAADFAQAgIAAApgQAIAMAAAAFACAgAACiBAAgIQAAqgQAIAgAAAAFACADAADUAwAgGQAAqgQAIJ8BAQCuAgAhwQEBAK4CACHCAUAA_wIAIcMBAACtAwAgxAEgAK4DACEGAwAA1AMAIJ8BAQCuAgAhwQEBAK4CACHCAUAA_wIAIcMBAACtAwAgxAEgAK4DACEDAAAAyAEAICAAAKQEACAhAACtBAAgEwAAAMgBACAIAACzAgAgCQAAtAIAIAsAALYCACAPAAC3AgAgEAAAuAIAIBkAAK0EACCfAQEArgIAIaABAQCuAgAhoQEBAK4CACGiAQEArgIAIaMBAQCvAgAhpAEBAK8CACGmAQAAsAKmASKoAQAAsQKoASKpAQEArwIAIaoBAQCvAgAhqwFAALICACGsAUAAsgIAIREIAACzAgAgCQAAtAIAIAsAALYCACAPAAC3AgAgEAAAuAIAIJ8BAQCuAgAhoAEBAK4CACGhAQEArgIAIaIBAQCuAgAhowEBAK8CACGkAQEArwIAIaYBAACwAqYBIqgBAACxAqgBIqkBAQCvAgAhqgEBAK8CACGrAUAAsgIAIawBQACyAgAhAwAAAMgBACAgAACmBAAgIQAAsAQAIBMAAADIAQAgCAAAswIAIAoAALUCACALAAC2AgAgDwAAtwIAIBAAALgCACAZAACwBAAgnwEBAK4CACGgAQEArgIAIaEBAQCuAgAhogEBAK4CACGjAQEArwIAIaQBAQCvAgAhpgEAALACpgEiqAEAALECqAEiqQEBAK8CACGqAQEArwIAIasBQACyAgAhrAFAALICACERCAAAswIAIAoAALUCACALAAC2AgAgDwAAtwIAIBAAALgCACCfAQEArgIAIaABAQCuAgAhoQEBAK4CACGiAQEArgIAIaMBAQCvAgAhpAEBAK8CACGmAQAAsAKmASKoAQAAsQKoASKpAQEArwIAIaoBAQCvAgAhqwFAALICACGsAUAAsgIAIQufAQEAAAABqAEAAADcAQKrAUAAAAABrAFAAAAAAcEBAQAAAAHPAQEAAAAB2QFAAAAAAdoBAQAAAAHcAQgAAAAB3QEBAAAAAd4BAQAAAAEDAAAAPQAgIAAAoAQAICEAALQEACAIAAAAPQAgGQAAtAQAIJ8BAQCuAgAhoAEBAK4CACGrAUAAsgIAIawBQACyAgAhyQEBAK8CACHXAQEArwIAIQafAQEArgIAIaABAQCuAgAhqwFAALICACGsAUAAsgIAIckBAQCvAgAh1wEBAK8CACEJnwEBAAAAAasBQAAAAAGsAUAAAAAByAEBAAAAAckBAQAAAAHKAQEAAAABywEIAAAAAcwBAgAAAAHNAQEAAAABEQgAAL4DACAJAAC_AwAgCgAAwAMAIAsAAMEDACAPAADCAwAgnwEBAAAAAaABAQAAAAGhAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpgEAAACmAQKoAQAAAKgBAqkBAQAAAAGqAQEAAAABqwFAAAAAAawBQAAAAAECAAAAxQEAICAAALYEACADAAAAyAEAICAAALYEACAhAAC6BAAgEwAAAMgBACAIAACzAgAgCQAAtAIAIAoAALUCACALAAC2AgAgDwAAtwIAIBkAALoEACCfAQEArgIAIaABAQCuAgAhoQEBAK4CACGiAQEArgIAIaMBAQCvAgAhpAEBAK8CACGmAQAAsAKmASKoAQAAsQKoASKpAQEArwIAIaoBAQCvAgAhqwFAALICACGsAUAAsgIAIREIAACzAgAgCQAAtAIAIAoAALUCACALAAC2AgAgDwAAtwIAIJ8BAQCuAgAhoAEBAK4CACGhAQEArgIAIaIBAQCuAgAhowEBAK8CACGkAQEArwIAIaYBAACwAqYBIqgBAACxAqgBIqkBAQCvAgAhqgEBAK8CACGrAUAAsgIAIawBQACyAgAhB58BAQAAAAGrAUAAAAABrAFAAAAAAcABAgAAAAHBAQEAAAABzgEBAAAAAdABAQAAAAERCAAAvgMAIAkAAL8DACAKAADAAwAgCwAAwQMAIBAAAMMDACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGmAQAAAKYBAqgBAAAAqAECqQEBAAAAAaoBAQAAAAGrAUAAAAABrAFAAAAAAQIAAADFAQAgIAAAvAQAIBEDAACCAwAgBgAAgwMAIA4AAIEDACARAACTAwAgEgAAhAMAIJ8BAQAAAAGoAQAAANwBAqsBQAAAAAGsAUAAAAABwQEBAAAAAc8BAQAAAAHYAQEAAAAB2QFAAAAAAdoBAQAAAAHcAQgAAAAB3QEBAAAAAd4BAQAAAAECAAAAAQAgIAAAvgQAIAMAAADIAQAgIAAAvAQAICEAAMIEACATAAAAyAEAIAgAALMCACAJAAC0AgAgCgAAtQIAIAsAALYCACAQAAC4AgAgGQAAwgQAIJ8BAQCuAgAhoAEBAK4CACGhAQEArgIAIaIBAQCuAgAhowEBAK8CACGkAQEArwIAIaYBAACwAqYBIqgBAACxAqgBIqkBAQCvAgAhqgEBAK8CACGrAUAAsgIAIawBQACyAgAhEQgAALMCACAJAAC0AgAgCgAAtQIAIAsAALYCACAQAAC4AgAgnwEBAK4CACGgAQEArgIAIaEBAQCuAgAhogEBAK4CACGjAQEArwIAIaQBAQCvAgAhpgEAALACpgEiqAEAALECqAEiqQEBAK8CACGqAQEArwIAIasBQACyAgAhrAFAALICACEDAAAACQAgIAAAvgQAICEAAMUEACATAAAACQAgAwAA8AIAIAYAAPECACAOAADvAgAgEQAAkQMAIBIAAPICACAZAADFBAAgnwEBAK4CACGoAQAA7QLcASKrAUAAsgIAIawBQACyAgAhwQEBAK4CACHPAQEArgIAIdgBAQCuAgAh2QFAALICACHaAQEArgIAIdwBCADfAgAh3QEBAK4CACHeAQEArwIAIREDAADwAgAgBgAA8QIAIA4AAO8CACARAACRAwAgEgAA8gIAIJ8BAQCuAgAhqAEAAO0C3AEiqwFAALICACGsAUAAsgIAIcEBAQCuAgAhzwEBAK4CACHYAQEArgIAIdkBQACyAgAh2gEBAK4CACHcAQgA3wIAId0BAQCuAgAh3gEBAK8CACEHnwEBAAAAAasBQAAAAAGsAUAAAAABwAECAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAQYDAAIGAAQOAAIRAAcSIw0TJAsHBQAMCAQDCQ4BCg8BCxMHDxsLEBwLAwUABgYIBAcAAgMDAAMECwEFAAUBBAwAAQYNAAQDAAIFAAoMAAgNFgECBQAJCxQHAQsVAAENFwADAwACBAABDgACBQkdAAoeAAsfAA8gABAhAAEEAAEABAMAAgYABA4AAhEABwQDAAIGAAQOAAIRAAcFBQASJgATJwAUKAAVKQAWAAAAAAAFBQASJgATJwAUKAAVKQAWAAADBQAbKAAcKQAdAAAAAwUAGygAHCkAHQEEAAEBBAABBQUAIiYAIycAJCgAJSkAJgAAAAAABQUAIiYAIycAJCgAJSkAJgMDAAIEAAEOAAIDAwACBAABDgACBQUAKyYALCcALSgALikALwAAAAAABQUAKyYALCcALSgALikALwIDAAIMAAgCAwACDAAIBQUANCYANScANigANykAOAAAAAAABQUANCYANScANigANykAOAEDAAMBAwADAwUAPSgAPikAPwAAAAMFAD0oAD4pAD8BBwACAQcAAgUFAEQmAEUnAEYoAEcpAEgAAAAAAAUFAEQmAEUnAEYoAEcpAEgAAAMFAE0oAE4pAE8AAAADBQBNKABOKQBPFAIBFSUBFiYBFycBGCgBGioBGywOHC0PHS8BHjEOHzIQIjMBIzQBJDUOKjgRKzkXLDsILTwILj8IL0AIMEEIMUMIMkUOM0YYNEgINUoONksZN0wIOE0IOU4OOlEaO1IePFQNPVUNPlcNP1gNQFkNQVsNQl0OQ14fRGANRWIORmMgR2QNSGUNSWYOSmkhS2onTGsLTWwLTm0LT24LUG8LUXELUnMOU3QoVHYLVXgOVnkpV3oLWHsLWXwOWn8qW4ABMFyBAQddggEHXoMBB1-EAQdghQEHYYcBB2KJAQ5jigExZIwBB2WOAQ5mjwEyZ5ABB2iRAQdpkgEOapUBM2uWATlslwEEbZgBBG6ZAQRvmgEEcJsBBHGdAQRynwEOc6ABOnSiAQR1pAEOdqUBO3emAQR4pwEEeagBDnqrATx7rAFAfK4BA32vAQN-sQEDf7IBA4ABswEDgQG1AQOCAbcBDoMBuAFBhAG6AQOFAbwBDoYBvQFChwG-AQOIAb8BA4kBwAEOigHDAUOLAcQBSYwBxgECjQHHAQKOAcoBAo8BywECkAHMAQKRAc4BApIB0AEOkwHRAUqUAdMBApUB1QEOlgHWAUuXAdcBApgB2AECmQHZAQ6aAdwBTJsB3QFQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TechnicianAvailabilityScalarFieldEnum: () => TechnicianAvailabilityScalarFieldEnum,
  TechnicianProfileScalarFieldEnum: () => TechnicianProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.9.1",
  engine: "e922089b7d7502aff4249d5da3420f6fa55fc6ad"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Booking: "Booking",
  Category: "Category",
  Payment: "Payment",
  Review: "Review",
  Service: "Service",
  technicianAvailability: "technicianAvailability",
  TechnicianProfile: "TechnicianProfile",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var BookingScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  technicianId: "technicianId",
  serviceId: "serviceId",
  bookingDate: "bookingDate",
  slot: "slot",
  status: "status",
  totalAmount: "totalAmount",
  availabilityId: "availabilityId",
  note: "note",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  transactionId: "transactionId",
  stripeSessionId: "stripeSessionId",
  stripePaymentIntentId: "stripePaymentIntentId",
  amount: "amount",
  status: "status",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  customerId: "customerId",
  technicianId: "technicianId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServiceScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  img: "img",
  price: "price",
  duration: "duration",
  technicianId: "technicianId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianAvailabilityScalarFieldEnum = {
  id: "id",
  technicianId: "technicianId",
  date: "date",
  slots: "slots",
  isAvailable: "isAvailable"
};
var TechnicianProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  experience: "experience",
  hourlyRate: "hourlyRate",
  location: "location",
  rating: "rating",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  phone: "phone",
  image: "image",
  role: "role",
  status: "status",
  address: "address",
  city: "city",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_product_id: process.env.STRIPE_PRODUCT_PRICE_ID,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe_success_url: process.env.STRIPE_SUCCESS_URL,
  stripe_cancel_url: process.env.STRIPE_CANCEL_URL
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/modules/auth/auth.service.ts
var registerIntoDB = async (payload) => {
  const {
    name,
    email,
    password,
    phone,
    image,
    address,
    city,
    role,
    bio,
    experience,
    hourlyRate,
    location
  } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (isUserExist) {
    throw new Error("User with this email already exists");
  }
  if (role === "TECHNICIAN") {
    if (experience === void 0 || hourlyRate === void 0 || location === void 0) {
      throw new Error(
        "Experience, hourlyRate and location are required for technician"
      );
    }
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const userData = {
    name,
    email,
    password: hashedPassword,
    role,
    ...phone !== void 0 && { phone },
    ...image !== void 0 && { image },
    ...address !== void 0 && { address },
    ...city !== void 0 && { city }
  };
  if (role === "TECHNICIAN") {
    userData.technicianProfile = {
      create: {
        bio,
        experience,
        hourlyRate,
        location
      }
    };
  }
  const createdUser = await prisma.user.create({
    data: userData,
    include: {
      technicianProfile: true
    }
  });
  const { password: _, ...userWithoutPassword } = createdUser;
  return userWithoutPassword;
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email }
  });
  if (user.status === "BAN") {
    throw new Error("Your account has been banned. Please contact support.");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (refreshToken3) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken3,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (user.status === "BAN") {
    throw new Error("User is banned!");
  }
  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return { accessToken };
};
var getMyProfileFromDB = async (id) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      technicianProfile: true,
      customerBookings: true
    },
    omit: {
      password: true
    }
  });
  return user;
};
var authService = {
  registerIntoDB,
  loginUser,
  refreshToken,
  getMyProfileFromDB
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/modules/auth/auth.controller.ts
import httpStatus from "http-status";
var register = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const user = await authService.registerIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user }
    });
  }
);
var login = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const { accessToken, refreshToken: refreshToken3 } = await authService.loginUser(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 day
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged In",
      data: {
        accessToken,
        refreshToken: refreshToken3
      }
    });
  }
);
var me = catchAsync(
  async (req, res, next) => {
    const profile = await authService.getMyProfileFromDB(
      req.user?.id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: { profile }
    });
  }
);
var refreshToken2 = catchAsync(
  async (req, res, next) => {
    const refreshToken3 = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshToken(refreshToken3);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Token Refreshed Successfully",
      data: {
        accessToken
      }
    });
  }
);
var authController = {
  register,
  login,
  me,
  refreshToken: refreshToken2
};

// src/middlewares/auth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { email, name, id, role } = verifiedToken.data;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role
      }
    });
    if (!user) {
      throw new Error("User not found. Please log in again.");
    }
    if (user.status === "BAN") {
      throw new Error("Your account has been banned. Please contact support.");
    }
    req.user = {
      email,
      name,
      id,
      role
    };
    next();
  });
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  authController.me
);
var authRoute = router;

// src/modules/admin/admin.route.ts
import { Router as Router2 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (id, status) => {
  return await prisma.user.update({
    where: {
      id
    },
    data: {
      status
    },
    omit: {
      password: true
    }
  });
};
var getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      customer: true,
      technician: true,
      service: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createCategory = async (payload) => {
  return await prisma.category.create({
    data: payload
  });
};
var deleteCategory = async (payload) => {
  return await prisma.category.delete({
    where: {
      id: payload
    }
  });
};
var adminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
  deleteCategory
};

// src/modules/admin/admin.controller.ts
import httpStatus2 from "http-status";
var getAllUsers2 = async (req, res) => {
  const result = await adminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Users fetched successfully",
    data: result
  });
};
var updateUserStatus2 = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await adminService.updateUserStatus(id, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "User status updated successfully",
    data: result
  });
};
var getAllBookings2 = async (req, res) => {
  const result = await adminService.getAllBookings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Bookings retrieved successfully",
    data: result
  });
};
var getAllCategories2 = async (req, res) => {
  const result = await adminService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Categories retrieved successfully",
    data: result
  });
};
var createCategory2 = async (req, res) => {
  const result = await adminService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.CREATED,
    message: "Category created successfully",
    data: result
  });
};
var deleteCategory2 = async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deleteCategory(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.CREATED,
    message: "Category deleted successfully",
    data: result
  });
};
var adminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllBookings: getAllBookings2,
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/admin/admin.route.ts
var router2 = Router2();
router2.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router2.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router2.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);
router2.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);
router2.post("/categories", auth(Role.ADMIN), adminController.createCategory);
router2.delete(
  "/categories/:id",
  auth(Role.ADMIN),
  adminController.deleteCategory
);
var adminRoute = router2;

// src/modules/booking/booking.route.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.controller.ts
import httpStatus3 from "http-status";

// src/modules/booking/booking.service.ts
var createBooking = async (customerId, payload) => {
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId
    },
    include: {
      technician: {
        include: {
          technicianProfile: true
        }
      }
    }
  });
  if (!service) {
    throw new Error("Selected service does not exist");
  }
  if (service.technician?.id !== payload.technicianId) {
    throw new Error("Service does not belong to technician");
  }
  const technicianProfile = service.technician?.technicianProfile;
  if (!technicianProfile) {
    throw new Error("Technician profile not found");
  }
  const availability = await prisma.technicianAvailability.findUnique({
    where: {
      id: payload.availabilityId
    }
  });
  if (!availability) {
    throw new Error("Availability not found");
  }
  if (availability.technicianId !== technicianProfile.id) {
    throw new Error("Availability does not belong to technician");
  }
  if (!availability.slots.includes(payload.slot)) {
    throw new Error("Invalid slot selected");
  }
  const bookingDate = new Date(payload.bookingDate);
  if (Number.isNaN(bookingDate.getTime())) {
    throw new Error("Invalid booking date");
  }
  if (availability.date) {
    const availabilityDate = new Date(availability.date);
    const bookingDay = bookingDate.toISOString().split("T")[0];
    const availableDay = availabilityDate.toISOString().split("T")[0];
    if (bookingDay !== availableDay) {
      throw new Error("Booking date mismatch");
    }
  }
  const existingBooking = await prisma.booking.findFirst({
    where: {
      availabilityId: payload.availabilityId,
      slot: payload.slot,
      status: {
        notIn: ["CANCELLED", "DECLINED"]
      }
    }
  });
  if (existingBooking) {
    throw new Error("Slot already booked");
  }
  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      availabilityId: payload.availabilityId,
      bookingDate,
      slot: payload.slot,
      totalAmount: payload.totalAmount,
      note: payload.note || null,
      status: "REQUESTED"
    },
    include: {
      customer: true,
      technician: true,
      service: true,
      availability: true
    }
  });
  return booking;
};
var getMyBookings = async (customerId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      service: true,
      payment: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings;
};
var getBookingById = async (bookingId, customerId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      service: true,
      payment: true,
      review: true
    }
  });
  return booking;
};
var bookingService = {
  createBooking,
  getMyBookings,
  getBookingById
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res) => {
  const customerId = req.user?.id;
  const result = await bookingService.createBooking(
    customerId,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.CREATED,
    message: "Booking created successfully",
    data: result
  });
};
var getMyBookings2 = async (req, res) => {
  const customerId = req.user?.id;
  const result = await bookingService.getMyBookings(customerId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.OK,
    message: "Bookings retrieved successfully",
    data: result
  });
};
var getBookingById2 = async (req, res) => {
  const customerId = req.user?.id;
  const { id } = req.params;
  const result = await bookingService.getBookingById(
    id,
    customerId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.OK,
    message: "Booking retrieved successfully",
    data: result
  });
};
var bookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings2,
  getBookingById: getBookingById2
};

// src/modules/booking/booking.route.ts
var router3 = Router3();
router3.post("/", auth(Role.CUSTOMER), bookingController.createBooking);
router3.get("/", auth(Role.CUSTOMER), bookingController.getMyBookings);
router3.get("/:id", auth(Role.CUSTOMER), bookingController.getBookingById);
var bookingRoute = router3;

// src/modules/service/service.route.ts
import { Router as Router4 } from "express";

// src/modules/service/service.service.ts
var createService = async (technicianId, payload) => {
  const technician = await prisma.user.findFirst({
    where: {
      id: technicianId,
      role: "TECHNICIAN"
    },
    include: {
      technicianProfile: true
    }
  });
  if (!technician) {
    throw new Error("Technician not found");
  }
  if (!technician.technicianProfile) {
    throw new Error("Technician profile not found");
  }
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId
    }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const service = await prisma.service.create({
    data: {
      technicianId,
      title: payload.title,
      description: payload.description,
      price: payload.price,
      duration: payload.duration,
      categoryId: payload.categoryId
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          technicianProfile: true
        }
      },
      category: true
    }
  });
  return service;
};
var getAllServices = async (query) => {
  const { search, category, location, rating } = query;
  const services = await prisma.service.findMany({
    where: {
      ...search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          }
        ]
      },
      ...category && {
        category: {
          name: {
            contains: category,
            mode: "insensitive"
          }
        }
      },
      ...location && {
        technician: {
          technicianProfile: {
            location: {
              contains: location,
              mode: "insensitive"
            }
          }
        }
      },
      ...rating && {
        technician: {
          technicianProfile: {
            rating: {
              gte: parseFloat(rating)
            }
          }
        }
      }
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          technicianProfile: true
        }
      },
      category: true
    }
  });
  return services;
};
var serviceService = {
  createService,
  getAllServices
};

// src/modules/service/service.controller.ts
var createService2 = async (req, res) => {
  const technicianId = req.user?.id;
  const result = await serviceService.createService(
    technicianId,
    req.body
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Service created successfully",
    data: result
  });
};
var getAllServices2 = async (req, res) => {
  const query = req.query;
  const result = await serviceService.getAllServices(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Services retrieved successfully",
    data: result
  });
};
var serviceController = {
  createService: createService2,
  getAllServices: getAllServices2
};

// src/modules/service/service.route.ts
var router4 = Router4();
router4.post("/", auth(Role.TECHNICIAN), serviceController.createService);
router4.get("/", serviceController.getAllServices);
var serviceRoute = router4;

// src/modules/category/category.route.ts
import { Router as Router5 } from "express";

// src/modules/category/category.controller.ts
import httpStatus4 from "http-status";

// src/modules/category/category.service.ts
var getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};
var categoryService = {
  getAllCategoriesFromDB
};

// src/modules/category/category.controller.ts
var getAllCategories3 = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategoriesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Categories retrieved successfully",
    data: categories
  });
});
var categoryController = {
  getAllCategories: getAllCategories3
};

// src/modules/category/category.route.ts
var router5 = Router5();
router5.get("/", categoryController.getAllCategories);
var categoryRoute = router5;

// src/modules/technicians/technicians.route.ts
import { Router as Router6 } from "express";

// src/modules/technicians/technicians.controller.ts
import httpStatus5 from "http-status";

// src/modules/technicians/technicians.service.ts
var getAllTechniciansFromDB = async () => {
  const technicians = await prisma.user.findMany({
    where: {
      role: "TECHNICIAN"
    },
    include: {
      technicianProfile: {
        include: {
          availability: true
        }
      },
      services: true,
      reviewReceived: true
    },
    omit: {
      password: true
    }
  });
  return technicians;
};
var getTechnicianByIdFromDB = async (id) => {
  const technician = await prisma.user.findUnique({
    where: {
      id,
      role: "TECHNICIAN"
    },
    include: {
      technicianProfile: {
        include: {
          availability: true
        }
      },
      services: true,
      reviewReceived: true
    },
    omit: {
      password: true
    }
  });
  return technician;
};
var getAvailability = async (technicianId, date) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN"
    },
    include: {
      technicianProfile: true
    }
  });
  if (!technician || !technician.technicianProfile) {
    throw new Error("Technician not found");
  }
  const profileId = technician.technicianProfile.id;
  const availabilityDate = new Date(date);
  availabilityDate.setUTCHours(0, 0, 0, 0);
  const availability = await prisma.technicianAvailability.findFirst({
    where: {
      technicianId: profileId,
      date: availabilityDate,
      isAvailable: true
    },
    include: {
      booking: {
        select: {
          slot: true,
          status: true
        }
      }
    }
  });
  if (!availability) {
    return {
      availabilityId: null,
      date,
      slots: []
    };
  }
  const bookedSlots = availability.booking.filter((book) => book.status !== "CANCELLED" && book.status !== "DECLINED").map((booking) => booking.slot);
  const slots = availability.slots.map((slot) => ({
    time: slot,
    isBooked: bookedSlots.includes(slot)
  }));
  return {
    availabilityId: availability.id,
    date,
    slots
  };
};
var techniciansService = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB,
  getAvailability
};

// src/modules/technicians/technicians.controller.ts
var getAllTechnicians = catchAsync(async (req, res) => {
  const technicians = await techniciansService.getAllTechniciansFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Technicians retrieved successfully",
    data: technicians
  });
});
var getTechnicianById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const technician = await techniciansService.getTechnicianByIdFromDB(
    id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Technician retrieved successfully",
    data: technician
  });
});
var getAvailability2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { date } = req.query;
    console.log("id", id, "Date", date);
    if (!date) {
      throw new Error("Date is required");
    }
    const result = await techniciansService.getAvailability(
      id,
      date
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Availability retrieved successfully",
      data: result
    });
  }
);
var techniciansController = {
  getAllTechnicians,
  getTechnicianById,
  getAvailability: getAvailability2
};

// src/modules/technicians/technicians.route.ts
var router6 = Router6();
router6.get("/", techniciansController.getAllTechnicians);
router6.get("/:id", techniciansController.getTechnicianById);
router6.get("/:id/availability", techniciansController.getAvailability);
var techniciansRoute = router6;

// src/modules/technician/technician.route.ts
import { Router as Router7 } from "express";

// src/modules/technician/technician.controller.ts
import httpStatus6 from "http-status";

// src/modules/technician/technician.service.ts
var updateTechnicianAvailability = async (technicianId, availability) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId
    },
    include: {
      technicianProfile: true
    }
  });
  if (!technician || technician.role !== "TECHNICIAN") {
    throw new Error("Technician not found");
  }
  if (!technician.technicianProfile) {
    throw new Error("Technician profile not found");
  }
  const profileId = technician.technicianProfile.id;
  const date = new Date(availability.date);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid availability date");
  }
  date.setUTCHours(0, 0, 0, 0);
  if (!availability.slots || availability.slots.length === 0) {
    throw new Error("At least one time slot is required");
  }
  const uniqueSlots = [...new Set(availability.slots)];
  const existingAvailability = await prisma.technicianAvailability.findFirst({
    where: {
      technicianId: profileId,
      date
    }
  });
  if (existingAvailability) {
    const duplicateSlots = uniqueSlots.filter(
      (slot) => existingAvailability.slots.includes(slot)
    );
    if (duplicateSlots.length > 0) {
      throw new Error(
        `These time slots already exist: ${duplicateSlots.join(", ")}`
      );
    }
    const updatedAvailability = await prisma.technicianAvailability.update({
      where: {
        id: existingAvailability.id
      },
      data: {
        slots: [...existingAvailability.slots, ...uniqueSlots],
        ...availability.isAvailable !== void 0 && {
          isAvailable: availability.isAvailable
        }
      }
    });
    return updatedAvailability;
  }
  const newAvailability = await prisma.technicianAvailability.create({
    data: {
      technicianId: profileId,
      date,
      slots: uniqueSlots,
      isAvailable: availability.isAvailable ?? true
    }
  });
  return newAvailability;
};
var updateTechnicianProfile = async (technicianId, profileData) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN"
    },
    include: {
      services: true,
      technicianProfile: true
    }
  });
  if (!technician?.technicianProfile) {
    throw new Error("Technician profile not found");
  }
  const profileId = technician.technicianProfile.id;
  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      id: profileId
    },
    data: profileData
  });
  return updatedProfile;
};
var getTechnicianBookings = async (technicianId) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN"
    },
    include: {
      technicianProfile: true
    }
  });
  if (!technician?.technicianProfile) {
    throw new Error("Technician profile not found");
  }
  const bookings = await prisma.booking.findMany({
    where: {
      technicianId
    },
    include: {
      technician: true,
      customer: true,
      service: true
    }
  });
  return bookings;
};
var updateTechnicianBookingStatus = async (bookingId, status) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status
    }
  });
  return updatedBooking;
};
var technicianService = {
  updateTechnicianAvailability,
  updateTechnicianProfile,
  getTechnicianBookings,
  updateTechnicianBookingStatus
};

// src/modules/technician/technician.controller.ts
var updateProfile = catchAsync(async (req, res) => {
  const profileData = req.body;
  const technicianId = req.user?.id;
  const updatedProfile = await technicianService.updateTechnicianProfile(
    technicianId,
    profileData
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Profile updated successfully",
    data: updatedProfile
  });
});
var getBookings = catchAsync(async (req, res) => {
  const technicianId = req.user?.id;
  const bookings = await technicianService.getTechnicianBookings(
    technicianId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Bookings retrieved successfully",
    data: bookings
  });
});
var updateAvailability = catchAsync(async (req, res) => {
  const availability = req.body;
  const technicianId = req.user?.id;
  const updatedAvailability = await technicianService.updateTechnicianAvailability(
    technicianId,
    availability
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Availability updated successfully",
    data: updatedAvailability
  });
});
var updateBookingStatus = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;
  const updatedBooking = await technicianService.updateTechnicianBookingStatus(
    bookingId,
    status
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Booking status updated successfully",
    data: updatedBooking
  });
});
var technicianController = {
  updateProfile,
  updateAvailability,
  getBookings,
  updateBookingStatus
};

// src/modules/technician/technician.route.ts
var router7 = Router7();
router7.put(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianController.updateAvailability
);
router7.put(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateProfile
);
router7.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianController.getBookings
);
router7.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  technicianController.updateBookingStatus
);
var technicianRoute = router7;

// src/modules/reviews/review.route.ts
import { Router as Router8 } from "express";

// src/modules/reviews/review.controller.ts
import httpStatus7 from "http-status";

// src/modules/reviews/review.service.ts
var createReview = async ({
  bookingId,
  userId,
  rating,
  comment
}) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    select: {
      customerId: true,
      technicianId: true,
      status: true
    }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.customerId !== userId) {
    throw new Error("You can only review your own booking");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review a completed booking");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId
    }
  });
  if (existingReview) {
    throw new Error("Review already exists for this booking");
  }
  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId: userId,
      technicianId: booking.technicianId,
      rating,
      comment: comment ?? null
    }
  });
  return review;
};
var getReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      customer: true,
      technician: true,
      booking: true
    }
  });
  return result;
};
var reviewService = {
  createReview,
  getReviews
};

// src/modules/reviews/review.controller.ts
var createReview2 = catchAsync(async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const review = await reviewService.createReview({
    bookingId,
    userId,
    rating,
    comment
  });
  sendResponse(res, {
    statusCode: httpStatus7.CREATED,
    success: true,
    message: "Review created successfully",
    data: review
  });
});
var getReviews2 = catchAsync(async (req, res) => {
  const reviews = await reviewService.getReviews();
  if (!reviews) {
    throw new Error("Reviews not retrived");
  }
  sendResponse(res, {
    statusCode: httpStatus7.CREATED,
    success: true,
    message: "Review retrived successfully",
    data: reviews
  });
});
var reviewController = {
  createReview: createReview2,
  getReviews: getReviews2
};

// src/modules/reviews/review.route.ts
var router8 = Router8();
router8.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router8.get("/", reviewController.getReviews);
var reviewRoute = router8;

// src/modules/payment/payment.route.ts
import express from "express";

// src/modules/payment/payment.controller.ts
import httpStatus8 from "http-status";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/modules/payment/payment.service.ts
var createPayment = async (userId, payload) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
      customerId: userId
    },
    include: {
      customer: true,
      service: true
    }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.status !== "ACCEPTED") {
    throw new Error("Payment is only available for accepted bookings");
  }
  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId: booking.id
    }
  });
  if (existingPayment && existingPayment.status === "COMPLETED") {
    throw new Error("This booking has already been paid");
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency: "BDT",
          product_data: {
            name: booking.service.title
          },
          unit_amount: Math.round(booking.totalAmount * 50)
          // Convert to cents
        },
        quantity: 1
      }
    ],
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId
    },
    client_reference_id: booking.id
  });
  await prisma.payment.upsert({
    where: {
      bookingId: booking.id
    },
    update: {
      transactionId: session.id,
      stripeSessionId: session.id,
      amount: booking.totalAmount,
      status: "PENDING"
    },
    create: {
      bookingId: booking.id,
      transactionId: session.id,
      stripeSessionId: session.id,
      amount: booking.totalAmount,
      status: "PENDING"
    }
  });
  return {
    sessionId: session.id,
    paymentUrl: session.url
  };
};
var confirmPayment = async (rawBody, signature) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw new Error("Invalid Stripe webhook signature");
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      throw new Error("Booking ID not found in Stripe metadata");
    }
    const payment = await prisma.payment.findUnique({
      where: {
        bookingId
      }
    });
    if (!payment) {
      throw new Error("Payment record not found");
    }
    if (payment.status === "COMPLETED") {
      return {
        received: true,
        message: "Payment already completed"
      };
    }
    const paymentIntent = session.payment_intent;
    await prisma.$transaction(async (tx) => {
      try {
        await tx.booking.update({
          where: {
            id: bookingId
          },
          data: {
            status: "PAID",
            totalAmount: 2e3
          }
        });
        await tx.payment.update({
          where: {
            bookingId
          },
          data: {
            status: "COMPLETED",
            paidAt: /* @__PURE__ */ new Date(),
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof paymentIntent === "string" ? paymentIntent : null,
            transactionId: session.id
          }
        });
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      throw new Error("Booking ID not found in Stripe metadata");
    }
    const payment = await prisma.payment.findUnique({
      where: {
        bookingId
      }
    });
    if (!payment) {
      throw new Error("Payment record not found");
    }
    if (payment.status === "COMPLETED") {
      return {
        received: true,
        message: "Payment already completed"
      };
    }
    await prisma.payment.update({
      where: {
        bookingId
      },
      data: {
        status: "FAILED"
      }
    });
  }
  return {
    received: true
  };
};
var getPayments = async (userId) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId
      }
    },
    include: {
      booking: {
        include: {
          service: true,
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          availability: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return payments;
};
var getPaymentById = async (userId, paymentId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      booking: {
        customerId: userId
      }
    },
    include: {
      booking: {
        include: {
          service: true,
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          availability: true
        }
      }
    }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};
var paymentService = {
  createPayment,
  confirmPayment,
  getPayments,
  getPaymentById
};

// src/modules/payment/payment.controller.ts
var createPayment2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const { bookingId } = req.body;
  if (!bookingId) {
    throw new Error("bookingId is required");
  }
  const result = await paymentService.createPayment(userId, {
    bookingId
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Payment session created successfully",
    data: result
  });
});
var confirmPayment2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Stripe signature is missing"
    });
  }
  const result = await paymentService.confirmPayment(
    req.body,
    signature
  );
  return res.status(200).json(result);
});
var getPayments2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const result = await paymentService.getPayments(userId);
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result
  });
});
var getPaymentById2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const { id } = req.params;
  const result = await paymentService.getPaymentById(userId, id);
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result
  });
});
var paymentController = {
  createPayment: createPayment2,
  confirmPayment: confirmPayment2,
  getPayments: getPayments2,
  getPaymentById: getPaymentById2
};

// src/modules/payment/payment.route.ts
var router9 = express.Router();
router9.post("/create", auth(Role.CUSTOMER), paymentController.createPayment);
router9.post("/confirm", paymentController.confirmPayment);
router9.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPayments);
router9.get(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getPaymentById
);
var paymentRoute = router9;

// src/middlewares/globalErrorHandler.ts
import httpStatus9 from "http-status";
var globalErrorHandler = (err, req, res, next) => {
  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";
  let errorDetails = err.stack;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus9.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus9.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus9.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus9.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus9.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus9.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus9.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  }
  res.status(httpStatus9.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpStatus9.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    errorDetails: err.stack
  });
};

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
};

// src/app.ts
var app = express2();
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
);
app.use(
  "/api/payments/confirm",
  express2.raw({
    type: "application/json"
  })
);
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth/", authRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/bookings/", bookingRoute);
app.use("/api/services/", serviceRoute);
app.use("/api/categories/", categoryRoute);
app.use("/api/technicians/", techniciansRoute);
app.use("/api/technician/", technicianRoute);
app.use("/api/reviews/", reviewRoute);
app.use("/api/payments/", paymentRoute);
app.get("/", (req, res) => {
  res.send("Fix Now Server is Running");
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app_default.listen(5e3, () => {
      console.log(`Server is running on port 5000`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
