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
  "inlineSchema": 'model Booking {\n  id String @id @default(uuid())\n\n  customerId String\n\n  technicianId String\n\n  serviceId String\n\n  bookingDate DateTime\n\n  status BookingStatus @default(REQUESTED)\n\n  totalAmount    Float\n  availabilityId String  @unique\n  note           String?\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  customer User @relation("CustomerBookings", fields: [customerId], references: [id])\n\n  technician User @relation("TechnicianBookings", fields: [technicianId], references: [id])\n\n  service Service @relation(fields: [serviceId], references: [id])\n\n  availability technicianAvailability @relation(fields: [availabilityId], references: [id])\n  payment      Payment?\n\n  review Review?\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([serviceId])\n  @@index([status])\n  @@index([bookingDate])\n  @@index([customerId, status])\n  @@index([technicianId, status])\n  @@index([technicianId, bookingDate])\n  @@map("bookings")\n}\n\nmodel Category {\n  id String @id @default(uuid())\n\n  name String @unique\n\n  description String?\n\n  icon String?\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  services Service[]\n\n  @@index([createdAt])\n  @@map("categories")\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  UNBAN\n  BAN\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  bookingId     String @unique\n  transactionId String @unique\n\n  stripeSessionId       String? @unique\n  stripePaymentIntentId String? @unique\n\n  amount Float\n  status PaymentStatus @default(PENDING)\n  paidAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@index([status])\n  @@index([paidAt])\n  @@map("payments")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId String @unique\n\n  customerId String\n\n  technicianId String\n\n  rating Int\n\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  customer User @relation("CustomerReview", fields: [customerId], references: [id])\n\n  technician User @relation("TechnicianReview", fields: [technicianId], references: [id])\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([rating])\n  @@index([createdAt])\n  @@index([technicianId, rating])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id String @id @default(uuid())\n\n  title String\n\n  description String\n\n  img String?\n\n  price Float\n\n  duration Int\n\n  technicianId String\n\n  categoryId String\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  technician User @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  category Category @relation(fields: [categoryId], references: [id])\n\n  bookings Booking[]\n\n  @@index([technicianId])\n  @@index([categoryId])\n  @@index([price])\n  @@index([createdAt])\n  @@index([categoryId, price])\n  @@index([technicianId, categoryId])\n  @@map("services")\n}\n\nmodel technicianAvailability {\n  id           String    @id @default(uuid())\n  technicianId String\n  date         DateTime?\n  slots        String[]\n  isAvailable  Boolean   @default(true)\n\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  booking Booking?\n\n  @@index([technicianId])\n  @@map("technician_availabilities")\n}\n\nmodel TechnicianProfile {\n  id String @id @default(uuid())\n\n  userId String @unique\n\n  bio String?\n\n  experience Int\n\n  hourlyRate Float\n\n  location String\n\n  availability technicianAvailability[]\n\n  rating Float @default(0)\n\n  createdAt DateTime @default(now())\n\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([hourlyRate])\n  @@index([rating])\n  @@index([location])\n  @@map("technician_profiles")\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String\n  email    String  @unique\n  password String\n  phone    String?\n  image    String?\n\n  role   Role       @default(CUSTOMER)\n  status UserStatus @default(UNBAN)\n\n  address String?\n  city    String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  technicianProfile TechnicianProfile?\n\n  customerBookings Booking[] @relation("CustomerBookings")\n\n  technicianBookings Booking[] @relation("TechnicianBookings")\n\n  services Service[]\n\n  reviewGiven Review[] @relation("CustomerReview")\n\n  reviewReceived Review[] @relation("TechnicianReview")\n\n  @@index([role])\n  @@index([status])\n  @@index([city])\n  @@index([createdAt])\n  @@map("users")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"bookingDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerBookings"},{"name":"technician","kind":"object","type":"User","relationName":"TechnicianBookings"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"availability","kind":"object","type":"technicianAvailability","relationName":"BookingTotechnicianAvailability"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"}],"dbName":"categories"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerReview"},{"name":"technician","kind":"object","type":"User","relationName":"TechnicianReview"}],"dbName":"reviews"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"img","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technician","kind":"object","type":"User","relationName":"ServiceToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"}],"dbName":"services"},"technicianAvailability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"slots","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileTotechnicianAvailability"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingTotechnicianAvailability"}],"dbName":"technician_availabilities"},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"location","kind":"scalar","type":"String"},{"name":"availability","kind":"object","type":"technicianAvailability","relationName":"TechnicianProfileTotechnicianAvailability"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"}],"dbName":"technician_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"},{"name":"customerBookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"technicianBookings","kind":"object","type":"Booking","relationName":"TechnicianBookings"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToUser"},{"name":"reviewGiven","kind":"object","type":"Review","relationName":"CustomerReview"},{"name":"reviewReceived","kind":"object","type":"Review","relationName":"TechnicianReview"}],"dbName":"users"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","technician","booking","availability","user","_count","technicianProfile","customerBookings","technicianBookings","services","category","bookings","customer","reviewGiven","reviewReceived","service","payment","review","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","data","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","create","update","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","having","_avg","_sum","_min","_max","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","technicianAvailability.findUnique","technicianAvailability.findUniqueOrThrow","technicianAvailability.findFirst","technicianAvailability.findFirstOrThrow","technicianAvailability.findMany","technicianAvailability.createOne","technicianAvailability.createMany","technicianAvailability.createManyAndReturn","technicianAvailability.updateOne","technicianAvailability.updateMany","technicianAvailability.updateManyAndReturn","technicianAvailability.upsertOne","technicianAvailability.deleteOne","technicianAvailability.deleteMany","technicianAvailability.groupBy","technicianAvailability.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","phone","image","Role","role","UserStatus","status","address","city","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","userId","bio","experience","hourlyRate","location","rating","technicianId","date","slots","isAvailable","has","hasEvery","hasSome","title","description","img","price","duration","categoryId","bookingId","customerId","comment","transactionId","stripeSessionId","stripePaymentIntentId","amount","PaymentStatus","paidAt","icon","serviceId","bookingDate","BookingStatus","totalAmount","availabilityId","note","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "wARPgAEUAwAAgwIAIAUAAKICACAOAACDAgAgEQAAoQIAIBIAAKMCACATAACkAgAgnAEAAJ8CADCdAQAACQAQngEAAJ8CADCfAQEAAAABqAEAAKAC2wEiqwFAAPQBACGsAUAA9AEAIcEBAQDwAQAhzwEBAPABACHYAQEA8AEAIdkBQAD0AQAh2wEIAIECACHcAQEAAAAB3QEBAPEBACEBAAAAAQAgDgUAAIICACAGAACDAgAgnAEAAP8BADCdAQAAAwAQngEAAP8BADCfAQEA8AEAIasBQAD0AQAhrAFAAPQBACG7AQEA8AEAIbwBAQDxAQAhvQECAIACACG-AQgAgQIAIb8BAQDwAQAhwAEIAIECACEBAAAAAwAgCgMAAKcCACAEAACoAgAgnAEAAKUCADCdAQAABQAQngEAAKUCADCfAQEA8AEAIcEBAQDwAQAhwgFAAJQCACHDAQAAhgIAIMQBIACmAgAhAwMAAL8DACAEAADkAwAgwgEAAKkCACAKAwAApwIAIAQAAKgCACCcAQAApQIAMJ0BAAAFABCeAQAApQIAMJ8BAQAAAAHBAQEA8AEAIcIBQACUAgAhwwEAAIYCACDEASAApgIAIQMAAAAFACABAAAGADACAAAHACAUAwAAgwIAIAUAAKICACAOAACDAgAgEQAAoQIAIBIAAKMCACATAACkAgAgnAEAAJ8CADCdAQAACQAQngEAAJ8CADCfAQEA8AEAIagBAACgAtsBIqsBQAD0AQAhrAFAAPQBACHBAQEA8AEAIc8BAQDwAQAh2AEBAPABACHZAUAA9AEAIdsBCACBAgAh3AEBAPABACHdAQEA8QEAIQEAAAAJACABAAAABQAgBwMAAMsDACAFAAD6AwAgDgAAywMAIBEAAPkDACASAAD7AwAgEwAA_AMAIN0BAACpAgAgAwAAAAkAIAEAAAwAMAIAAAEAIAMAAAAJACABAAAMADACAAABACAQAwAAgwIAIAwAAJ4CACANAAD2AQAgnAEAAJ0CADCdAQAADwAQngEAAJ0CADCfAQEA8AEAIasBQAD0AQAhrAFAAPQBACHBAQEA8AEAIcgBAQDwAQAhyQEBAPABACHKAQEA8QEAIcsBCACBAgAhzAECAIACACHNAQEA8AEAIQQDAADLAwAgDAAA-AMAIA0AAMADACDKAQAAqQIAIBADAACDAgAgDAAAngIAIA0AAPYBACCcAQAAnQIAMJ0BAAAPABCeAQAAnQIAMJ8BAQAAAAGrAUAA9AEAIawBQAD0AQAhwQEBAPABACHIAQEA8AEAIckBAQDwAQAhygEBAPEBACHLAQgAgQIAIcwBAgCAAgAhzQEBAPABACEDAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAEAAAAPACADAAAACQAgAQAADAAwAgAAAQAgAQAAAAkAIA4DAACDAgAgBAAAlQIAIA4AAIMCACCcAQAAnAIAMJ0BAAAXABCeAQAAnAIAMJ8BAQDwAQAhqwFAAPQBACGsAUAA9AEAIcABAgCAAgAhwQEBAPABACHOAQEA8AEAIc8BAQDwAQAh0AEBAPEBACEEAwAAywMAIAQAAOQDACAOAADLAwAg0AEAAKkCACAOAwAAgwIAIAQAAJUCACAOAACDAgAgnAEAAJwCADCdAQAAFwAQngEAAJwCADCfAQEAAAABqwFAAPQBACGsAUAA9AEAIcABAgCAAgAhwQEBAPABACHOAQEAAAABzwEBAPABACHQAQEA8QEAIQMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAQAAAAkAIAEAAAAJACABAAAADwAgAQAAABcAIAEAAAAXACAOBAAAlQIAIJwBAACSAgAwnQEAACEAEJ4BAACSAgAwnwEBAPABACGoAQAAkwLWASKrAUAA9AEAIawBQAD0AQAhzgEBAPABACHRAQEA8AEAIdIBAQDxAQAh0wEBAPEBACHUAQgAgQIAIdYBQACUAgAhAQAAACEAIAEAAAAXACABAAAAAQAgAwAAAAkAIAEAAAwAMAIAAAEAIAMAAAAJACABAAAMADACAAABACADAAAACQAgAQAADAAwAgAAAQAgEQMAAIEDACAFAACCAwAgDgAAgAMAIBEAAJIDACASAACDAwAgEwAAhAMAIJ8BAQAAAAGoAQAAANsBAqsBQAAAAAGsAUAAAAABwQEBAAAAAc8BAQAAAAHYAQEAAAAB2QFAAAAAAdsBCAAAAAHcAQEAAAAB3QEBAAAAAQEZAAAoACALnwEBAAAAAagBAAAA2wECqwFAAAAAAawBQAAAAAHBAQEAAAABzwEBAAAAAdgBAQAAAAHZAUAAAAAB2wEIAAAAAdwBAQAAAAHdAQEAAAABARkAACoAMAEZAAAqADARAwAA7wIAIAUAAPACACAOAADuAgAgEQAAkAMAIBIAAPECACATAADyAgAgnwEBAK0CACGoAQAA7ALbASKrAUAAsQIAIawBQACxAgAhwQEBAK0CACHPAQEArQIAIdgBAQCtAgAh2QFAALECACHbAQgA3gIAIdwBAQCtAgAh3QEBAK4CACECAAAAAQAgGQAALQAgC58BAQCtAgAhqAEAAOwC2wEiqwFAALECACGsAUAAsQIAIcEBAQCtAgAhzwEBAK0CACHYAQEArQIAIdkBQACxAgAh2wEIAN4CACHcAQEArQIAId0BAQCuAgAhAgAAAAkAIBkAAC8AIAIAAAAJACAZAAAvACADAAAAAQAgIAAAKAAgIQAALQAgAQAAAAEAIAEAAAAJACAGBwAA8wMAICYAAPQDACAnAAD3AwAgKAAA9gMAICkAAPUDACDdAQAAqQIAIA6cAQAAmAIAMJ0BAAA2ABCeAQAAmAIAMJ8BAQDeAQAhqAEAAJkC2wEiqwFAAOIBACGsAUAA4gEAIcEBAQDeAQAhzwEBAN4BACHYAQEA3gEAIdkBQADiAQAh2wEIAPsBACHcAQEA3gEAId0BAQDfAQAhAwAAAAkAIAEAADUAMCUAADYAIAMAAAAJACABAAAMADACAAABACAKCwAA9wEAIJwBAACXAgAwnQEAADwAEJ4BAACXAgAwnwEBAAAAAaABAQAAAAGrAUAA9AEAIawBQAD0AQAhyQEBAPEBACHXAQEA8QEAIQEAAAA5ACABAAAAOQAgCgsAAPcBACCcAQAAlwIAMJ0BAAA8ABCeAQAAlwIAMJ8BAQDwAQAhoAEBAPABACGrAUAA9AEAIawBQAD0AQAhyQEBAPEBACHXAQEA8QEAIQMLAADBAwAgyQEAAKkCACDXAQAAqQIAIAMAAAA8ACABAAA9ADACAAA5ACADAAAAPAAgAQAAPQAwAgAAOQAgAwAAADwAIAEAAD0AMAIAADkAIAcLAADyAwAgnwEBAAAAAaABAQAAAAGrAUAAAAABrAFAAAAAAckBAQAAAAHXAQEAAAABARkAAEEAIAafAQEAAAABoAEBAAAAAasBQAAAAAGsAUAAAAAByQEBAAAAAdcBAQAAAAEBGQAAQwAwARkAAEMAMAcLAADoAwAgnwEBAK0CACGgAQEArQIAIasBQACxAgAhrAFAALECACHJAQEArgIAIdcBAQCuAgAhAgAAADkAIBkAAEYAIAafAQEArQIAIaABAQCtAgAhqwFAALECACGsAUAAsQIAIckBAQCuAgAh1wEBAK4CACECAAAAPAAgGQAASAAgAgAAADwAIBkAAEgAIAMAAAA5ACAgAABBACAhAABGACABAAAAOQAgAQAAADwAIAUHAADlAwAgKAAA5wMAICkAAOYDACDJAQAAqQIAINcBAACpAgAgCZwBAACWAgAwnQEAAE8AEJ4BAACWAgAwnwEBAN4BACGgAQEA3gEAIasBQADiAQAhrAFAAOIBACHJAQEA3wEAIdcBAQDfAQAhAwAAADwAIAEAAE4AMCUAAE8AIAMAAAA8ACABAAA9ADACAAA5ACAOBAAAlQIAIJwBAACSAgAwnQEAACEAEJ4BAACSAgAwnwEBAAAAAagBAACTAtYBIqsBQAD0AQAhrAFAAPQBACHOAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEIAIECACHWAUAAlAIAIQEAAABSACABAAAAUgAgBAQAAOQDACDSAQAAqQIAINMBAACpAgAg1gEAAKkCACADAAAAIQAgAQAAVQAwAgAAUgAgAwAAACEAIAEAAFUAMAIAAFIAIAMAAAAhACABAABVADACAABSACALBAAA4wMAIJ8BAQAAAAGoAQAAANYBAqsBQAAAAAGsAUAAAAABzgEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBCAAAAAHWAUAAAAABARkAAFkAIAqfAQEAAAABqAEAAADWAQKrAUAAAAABrAFAAAAAAc4BAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAQgAAAAB1gFAAAAAAQEZAABbADABGQAAWwAwCwQAAOIDACCfAQEArQIAIagBAAD9AtYBIqsBQACxAgAhrAFAALECACHOAQEArQIAIdEBAQCtAgAh0gEBAK4CACHTAQEArgIAIdQBCADeAgAh1gFAAP4CACECAAAAUgAgGQAAXgAgCp8BAQCtAgAhqAEAAP0C1gEiqwFAALECACGsAUAAsQIAIc4BAQCtAgAh0QEBAK0CACHSAQEArgIAIdMBAQCuAgAh1AEIAN4CACHWAUAA_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_gIAIcMBAACsAwAgxAEgAK0DACECAAAABQAgGQAAogEAIAIAAAAFACAZAACiAQAgAwAAAAcAICAAAJsBACAhAACgAQAgAQAAAAcAIAEAAAAFACAEBwAAzAMAICgAAM4DACApAADNAwAgwgEAAKkCACAInAEAAIQCADCdAQAAqQEAEJ4BAACEAgAwnwEBAN4BACHBAQEA3gEAIcIBQACFAgAhwwEAAIYCACDEASAAhwIAIQMAAAAFACABAACoAQAwJQAAqQEAIAMAAAAFACABAAAGADACAAAHACAOBQAAggIAIAYAAIMCACCcAQAA_wEAMJ0BAAADABCeAQAA_wEAMJ8BAQAAAAGrAUAA9AEAIawBQAD0AQAhuwEBAAAAAbwBAQDxAQAhvQECAIACACG-AQgAgQIAIb8BAQDwAQAhwAEIAIECACEBAAAArAEAIAEAAACsAQAgAwUAAMoDACAGAADLAwAgvAEAAKkCACADAAAAAwAgAQAArwEAMAIAAKwBACADAAAAAwAgAQAArwEAMAIAAKwBACADAAAAAwAgAQAArwEAMAIAAKwBACALBQAAuAMAIAYAAMkDACCfAQEAAAABqwFAAAAAAawBQAAAAAG7AQEAAAABvAEBAAAAAb0BAgAAAAG-AQgAAAABvwEBAAAAAcABCAAAAAEBGQAAswEAIAmfAQEAAAABqwFAAAAAAawBQAAAAAG7AQEAAAABvAEBAAAAAb0BAgAAAAG-AQgAAAABvwEBAAAAAcABCAAAAAEBGQAAtQEAMAEZAAC1AQAwCwUAAKEDACAGAADIAwAgnwEBAK0CACGrAUAAsQIAIawBQACxAgAhuwEBAK0CACG8AQEArgIAIb0BAgDCAgAhvgEIAN4CACG_AQEArQIAIcABCADeAgAhAgAAAKwBACAZAAC4AQAgCZ8BAQCtAgAhqwFAALECACGsAUAAsQIAIbsBAQCtAgAhvAEBAK4CACG9AQIAwgIAIb4BCADeAgAhvwEBAK0CACHAAQgA3gIAIQIAAAADACAZAAC6AQAgAgAAAAMAIBkAALoBACADAAAArAEAICAAALMBACAhAAC4AQAgAQAAAKwBACABAAAAAwAgBgcAAMMDACAmAADEAwAgJwAAxwMAICgAAMYDACApAADFAwAgvAEAAKkCACAMnAEAAPkBADCdAQAAwQEAEJ4BAAD5AQAwnwEBAN4BACGrAUAA4gEAIawBQADiAQAhuwEBAN4BACG8AQEA3wEAIb0BAgD6AQAhvgEIAPsBACG_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_AQAwnQEAAAMAEJ4BAAD_AQAwnwEBAPABACGrAUAA9AEAIawBQAD0AQAhuwEBAPABACG8AQEA8QEAIb0BAgCAAgAhvgEIAIECACG_AQEA8AEAIcABCACBAgAh3gEAAAMAIN8BAAADACADuAEAAAkAILkBAAAJACC6AQAACQAgA7gBAAAPACC5AQAADwAgugEAAA8AIAO4AQAAFwAguQEAABcAILoBAAAXACAMnAEAAPkBADCdAQAAwQEAEJ4BAAD5AQAwnwEBAN4BACGrAUAA4gEAIawBQADiAQAhuwEBAN4BACG8AQEA3wEAIb0BAgD6AQAhvgEIAPsBACG_AQEA3gEAIcABCAD7AQAhDQcAAOQBACAmAAD9AQAgJwAA5AEAICgAAOQBACApAADkAQAgrQECAAAAAa4BAgAAAASvAQIAAAAEsAECAAAAAbEBAgAAAAGyAQIAAAABswECAAAAAbQBAgD-AQAhDQcAAOQBACAmAAD9AQAgJwAA_QEAICgAAP0BACApAAD9AQAgrQEIAAAAAa4BCAAAAASvAQgAAAAEsAEIAAAAAbEBCAAAAAGyAQgAAAABswEIAAAAAbQBCAD8AQAhDQcAAOQBACAmAAD9AQAgJwAA_QEAICgAAP0BACApAAD9AQAgrQEIAAAAAa4BCAAAAASvAQgAAAAEsAEIAAAAAbEBCAAAAAGyAQgAAAABswEIAAAAAbQBCAD8AQAhCK0BCAAAAAGuAQgAAAAErwEIAAAABLABCAAAAAGxAQgAAAABsgEIAAAAAbMBCAAAAAG0AQgA_QEAIQ0HAADkAQAgJgAA_QEAICcAAOQBACAoAADkAQAgKQAA5AEAIK0BAgAAAAGuAQIAAAAErwECAAAABLABAgAAAAGxAQIAAAABsgECAAAAAbMBAgAAAAG0AQIA_gEAIQ4FAACCAgAgBgAAgwIAIJwBAAD_AQAwnQEAAAMAEJ4BAAD_AQAwnwEBAPABACGrAUAA9AEAIawBQAD0AQAhuwEBAPABACG8AQEA8QEAIb0BAgCAAgAhvgEIAIECACG_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_wEAMJ0BAAADABCeAQAA_wEAMJ8BAQDwAQAhqwFAAPQBACGsAUAA9AEAIbsBAQDwAQAhvAEBAPEBACG9AQIAgAIAIb4BCACBAgAhvwEBAPABACHAAQgAgQIAId4BAAADACDfAQAAAwAgFgMAAIMCACAFAACiAgAgDgAAgwIAIBEAAKECACASAACjAgAgEwAApAIAIJwBAACfAgAwnQEAAAkAEJ4BAACfAgAwnwEBAPABACGoAQAAoALbASKrAUAA9AEAIawBQAD0AQAhwQEBAPABACHPAQEA8AEAIdgBAQDwAQAh2QFAAPQBACHbAQgAgQIAIdwBAQDwAQAh3QEBAPEBACHeAQAACQAg3wEAAAkAIAAAAAAB4wEBAAAAAQHjAQEAAAABAeMBAAAApgECAeMBAAAAqAECAeMBQAAAAAEHIAAAnAMAICEAAJ8DACDgAQAAnQMAIOEBAACeAwAg5AEAAAMAIOUBAAADACDmAQAArAEAIAsgAACTAwAwIQAAlwMAMOABAACUAwAw4QEAAJUDADDiAQAAlgMAIOMBAADmAgAw5AEAAOYCADDlAQAA5gIAMOYBAADmAgAw5wEAAJgDADDoAQAA6QIAMAsgAACIAwAwIQAAjAMAMOABAACJAwAw4QEAAIoDADDiAQAAiwMAIOMBAADmAgAw5AEAAOYCADDlAQAA5gIAMOYBAADmAgAw5wEAAI0DADDoAQAA6QIAMAsgAADUAgAwIQAA2QIAMOABAADVAgAw4QEAANYCADDiAQAA1wIAIOMBAADYAgAw5AEAANgCADDlAQAA2AIAMOYBAADYAgAw5wEAANoCADDoAQAA2wIAMAsgAADJAgAwIQAAzQIAMOABAADKAgAw4QEAAMsCADDiAQAAzAIAIOMBAAC8AgAw5AEAALwCADDlAQAAvAIAMOYBAAC8AgAw5wEAAM4CADDoAQAAvwIAMAsgAAC4AgAwIQAAvQIAMOABAAC5AgAw4QEAALoCADDiAQAAuwIAIOMBAAC8AgAw5AEAALwCADDlAQAAvAIAMOYBAAC8AgAw5wEAAL4CADDoAQAAvwIAMAkEAADHAgAgDgAAyAIAIJ8BAQAAAAGrAUAAAAABrAFAAAAAAcABAgAAAAHOAQEAAAABzwEBAAAAAdABAQAAAAECAAAAGQAgIAAAxgIAIAMAAAAZACAgAADGAgAgIQAAwwIAIAEZAADABAAwDgMAAIMCACAEAACVAgAgDgAAgwIAIJwBAACcAgAwnQEAABcAEJ4BAACcAgAwnwEBAAAAAasBQAD0AQAhrAFAAPQBACHAAQIAgAIAIcEBAQDwAQAhzgEBAAAAAc8BAQDwAQAh0AEBAPEBACECAAAAGQAgGQAAwwIAIAIAAADAAgAgGQAAwQIAIAucAQAAvwIAMJ0BAADAAgAQngEAAL8CADCfAQEA8AEAIasBQAD0AQAhrAFAAPQBACHAAQIAgAIAIcEBAQDwAQAhzgEBAPABACHPAQEA8AEAIdABAQDxAQAhC5wBAAC_AgAwnQEAAMACABCeAQAAvwIAMJ8BAQDwAQAhqwFAAPQBACGsAUAA9AEAIcABAgCAAgAhwQEBAPABACHOAQEA8AEAIc8BAQDwAQAh0AEBAPEBACEHnwEBAK0CACGrAUAAsQIAIawBQACxAgAhwAECAMICACHOAQEArQIAIc8BAQCtAgAh0AEBAK4CACEF4wECAAAAAeoBAgAAAAHrAQIAAAAB7AECAAAAAe0BAgAAAAEJBAAAxAIAIA4AAMUCACCfAQEArQIAIasBQACxAgAhrAFAALECACHAAQIAwgIAIc4BAQCtAgAhzwEBAK0CACHQAQEArgIAIQUgAAC4BAAgIQAAvgQAIOABAAC5BAAg4QEAAL0EACDmAQAAAQAgBSAAALYEACAhAAC7BAAg4AEAALcEACDhAQAAugQAIOYBAADEAQAgCQQAAMcCACAOAADIAgAgnwEBAAAAAasBQAAAAAGsAUAAAAABwAECAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAQMgAAC4BAAg4AEAALkEACDmAQAAAQAgAyAAALYEACDgAQAAtwQAIOYBAADEAQAgCQMAANMCACAEAADHAgAgnwEBAAAAAasBQAAAAAGsAUAAAAABwAECAAAAAcEBAQAAAAHOAQEAAAAB0AEBAAAAAQIAAAAZACAgAADSAgAgAwAAABkAICAAANICACAhAADQAgAgARkAALUEADACAAAAGQAgGQAA0AIAIAIAAADAAgAgGQAAzwIAIAefAQEArQIAIasBQACxAgAhrAFAALECACHAAQIAwgIAIcEBAQCtAgAhzgEBAK0CACHQAQEArgIAIQkDAADRAgAgBAAAxAIAIJ8BAQCtAgAhqwFAALECACGsAUAAsQIAIcABAgDCAgAhwQEBAK0CACHOAQEArQIAIdABAQCuAgAhBSAAALAEACAhAACzBAAg4AEAALEEACDhAQAAsgQAIOYBAADEAQAgCQMAANMCACAEAADHAgAgnwEBAAAAAasBQAAAAAGsAUAAAAABwAECAAAAAcEBAQAAAAHOAQEAAAAB0AEBAAAAAQMgAACwBAAg4AEAALEEACDmAQAAxAEAIAsMAACGAwAgDQAAhwMAIJ8BAQAAAAGrAUAAAAABrAFAAAAAAcgBAQAAAAHJAQEAAAABygEBAAAAAcsBCAAAAAHMAQIAAAABzQEBAAAAAQIAAAARACAgAACFAwAgAwAAABEAICAAAIUDACAhAADfAgAgARkAAK8EADAQAwAAgwIAIAwAAJ4CACANAAD2AQAgnAEAAJ0CADCdAQAADwAQngEAAJ0CADCfAQEAAAABqwFAAPQBACGsAUAA9AEAIcEBAQDwAQAhyAEBAPABACHJAQEA8AEAIcoBAQDxAQAhywEIAIECACHMAQIAgAIAIc0BAQDwAQAhAgAAABEAIBkAAN8CACACAAAA3AIAIBkAAN0CACANnAEAANsCADCdAQAA3AIAEJ4BAADbAgAwnwEBAPABACGrAUAA9AEAIawBQAD0AQAhwQEBAPABACHIAQEA8AEAIckBAQDwAQAhygEBAPEBACHLAQgAgQIAIcwBAgCAAgAhzQEBAPABACENnAEAANsCADCdAQAA3AIAEJ4BAADbAgAwnwEBAPABACGrAUAA9AEAIawBQAD0AQAhwQEBAPABACHIAQEA8AEAIckBAQDwAQAhygEBAPEBACHLAQgAgQIAIcwBAgCAAgAhzQEBAPABACEJnwEBAK0CACGrAUAAsQIAIawBQACxAgAhyAEBAK0CACHJAQEArQIAIcoBAQCuAgAhywEIAN4CACHMAQIAwgIAIc0BAQCtAgAhBeMBCAAAAAHqAQgAAAAB6wEIAAAAAewBCAAAAAHtAQgAAAABCwwAAOACACANAADhAgAgnwEBAK0CACGrAUAAsQIAIawBQACxAgAhyAEBAK0CACHJAQEArQIAIcoBAQCuAgAhywEIAN4CACHMAQIAwgIAIc0BAQCtAgAhBSAAAJoEACAhAACtBAAg4AEAAJsEACDhAQAArAQAIOYBAAA5ACALIAAA4gIAMCEAAOcCADDgAQAA4wIAMOEBAADkAgAw4gEAAOUCACDjAQAA5gIAMOQBAADmAgAw5QEAAOYCADDmAQAA5gIAMOcBAADoAgAw6AEAAOkCADAPAwAAgQMAIAUAAIIDACAOAACAAwAgEgAAgwMAIBMAAIQDACCfAQEAAAABqAEAAADbAQKrAUAAAAABrAFAAAAAAcEBAQAAAAHPAQEAAAAB2QFAAAAAAdsBCAAAAAHcAQEAAAAB3QEBAAAAAQIAAAABACAgAAD_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_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_AwAgCQAAwAMAIAoAAMADACALAADBAwAgDwAAwgMAIBAAAMIDACCjAQAAqQIAIKQBAACpAgAgqQEAAKkCACCqAQAAqQIAIAAAAAUgAACIBAAgIQAAiwQAIOABAACJBAAg4QEAAIoEACDmAQAArAEAIAMgAACIBAAg4AEAAIkEACDmAQAArAEAIAAAAAAABSAAAIMEACAhAACGBAAg4AEAAIQEACDhAQAAhQQAIOYBAADEAQAgAyAAAIMEACDgAQAAhAQAIOYBAADEAQAgAAAAAAAAAAAAAAUgAAD-AwAgIQAAgQQAIOABAAD_AwAg4QEAAIAEACDmAQAAAQAgAyAAAP4DACDgAQAA_wMAIOYBAAABACAHAwAAywMAIAUAAPoDACAOAADLAwAgEQAA-QMAIBIAAPsDACATAAD8AwAg3QEAAKkCACAAAAALIAAA6QMAMCEAAO0DADDgAQAA6gMAMOEBAADrAwAw4gEAAOwDACDjAQAA2AIAMOQBAADYAgAw5QEAANgCADDmAQAA2AIAMOcBAADuAwAw6AEAANsCADALAwAA1wMAIA0AAIcDACCfAQEAAAABqwFAAAAAAawBQAAAAAHBAQEAAAAByAEBAAAAAckBAQAAAAHKAQEAAAABywEIAAAAAcwBAgAAAAECAAAAEQAgIAAA8QMAIAMAAAARACAgAADxAwAgIQAA8AMAIAEZAAD9AwAwAgAAABEAIBkAAPADACACAAAA3AIAIBkAAO8DACAJnwEBAK0CACGrAUAAsQIAIawBQACxAgAhwQEBAK0CACHIAQEArQIAIckBAQCtAgAhygEBAK4CACHLAQgA3gIAIcwBAgDCAgAhCwMAANYDACANAADhAgAgnwEBAK0CACGrAUAAsQIAIawBQACxAgAhwQEBAK0CACHIAQEArQIAIckBAQCtAgAhygEBAK4CACHLAQgA3gIAIcwBAgDCAgAhCwMAANcDACANAACHAwAgnwEBAAAAAasBQAAAAAGsAUAAAAABwQEBAAAAAcgBAQAAAAHJAQEAAAABygEBAAAAAcsBCAAAAAHMAQIAAAABBCAAAOkDADDgAQAA6gMAMOIBAADsAwAg5gEAANgCADAAAAAAAAMLAADBAwAgyQEAAKkCACDXAQAAqQIAIAQDAADLAwAgDAAA-AMAIA0AAMADACDKAQAAqQIAIAMDAAC_AwAgBAAA5AMAIMIBAACpAgAgBAQAAOQDACDSAQAAqQIAINMBAACpAgAg1gEAAKkCACAEAwAAywMAIAQAAOQDACAOAADLAwAg0AEAAKkCACAJnwEBAAAAAasBQAAAAAGsAUAAAAABwQEBAAAAAcgBAQAAAAHJAQEAAAABygEBAAAAAcsBCAAAAAHMAQIAAAABEAMAAIEDACAFAACCAwAgDgAAgAMAIBEAAJIDACATAACEAwAgnwEBAAAAAagBAAAA2wECqwFAAAAAAawBQAAAAAHBAQEAAAABzwEBAAAAAdgBAQAAAAHZAUAAAAAB2wEIAAAAAdwBAQAAAAHdAQEAAAABAgAAAAEAICAAAP4DACADAAAACQAgIAAA_gMAICEAAIIEACASAAAACQAgAwAA7wIAIAUAAPACACAOAADuAgAgEQAAkAMAIBMAAPICACAZAACCBAAgnwEBAK0CACGoAQAA7ALbASKrAUAAsQIAIawBQACxAgAhwQEBAK0CACHPAQEArQIAIdgBAQCtAgAh2QFAALECACHbAQgA3gIAIdwBAQCtAgAh3QEBAK4CACEQAwAA7wIAIAUAAPACACAOAADuAgAgEQAAkAMAIBMAAPICACCfAQEArQIAIagBAADsAtsBIqsBQACxAgAhrAFAALECACHBAQEArQIAIc8BAQCtAgAh2AEBAK0CACHZAUAAsQIAIdsBCADeAgAh3AEBAK0CACHdAQEArgIAIREIAAC5AwAgCQAAugMAIAoAALsDACAPAAC9AwAgEAAAvgMAIJ8BAQAAAAGgAQEAAAABoQEBAAAAAaIBAQAAAAGjAQEAAAABpAEBAAAAAaYBAAAApgECqAEAAACoAQKpAQEAAAABqgEBAAAAAasBQAAAAAGsAUAAAAABAgAAAMQBACAgAACDBAAgAwAAAMcBACAgAACDBAAgIQAAhwQAIBMAAADHAQAgCAAAsgIAIAkAALMCACAKAAC0AgAgDwAAtgIAIBAAALcCACAZAACHBAAgnwEBAK0CACGgAQEArQIAIaEBAQCtAgAhogEBAK0CACGjAQEArgIAIaQBAQCuAgAhpgEAAK8CpgEiqAEAALACqAEiqQEBAK4CACGqAQEArgIAIasBQACxAgAhrAFAALECACERCAAAsgIAIAkAALMCACAKAAC0AgAgDwAAtgIAIBAAALcCACCfAQEArQIAIaABAQCtAgAhoQEBAK0CACGiAQEArQIAIaMBAQCuAgAhpAEBAK4CACGmAQAArwKmASKoAQAAsAKoASKpAQEArgIAIaoBAQCuAgAhqwFAALECACGsAUAAsQIAIQoGAADJAwAgnwEBAAAAAasBQAAAAAGsAUAAAAABuwEBAAAAAbwBAQAAAAG9AQIAAAABvgEIAAAAAb8BAQAAAAHAAQgAAAABAgAAAKwBACAgAACIBAAgAwAAAAMAICAAAIgEACAhAACMBAAgDAAAAAMAIAYAAMgDACAZAACMBAAgnwEBAK0CACGrAUAAsQIAIawBQACxAgAhuwEBAK0CACG8AQEArgIAIb0BAgDCAgAhvgEIAN4CACG_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_BAAgnwEBAK0CACGoAQAA7ALbASKrAUAAsQIAIawBQACxAgAhwQEBAK0CACHPAQEArQIAIdgBAQCtAgAh2QFAALECACHbAQgA3gIAIdwBAQCtAgAh3QEBAK4CACEQAwAA7wIAIAUAAPACACAOAADuAgAgEQAAkAMAIBIAAPECACCfAQEArQIAIagBAADsAtsBIqsBQACxAgAhrAFAALECACHBAQEArQIAIc8BAQCtAgAh2AEBAK0CACHZAUAAsQIAIdsBCADeAgAh3AEBAK0CACHdAQEArgIAIQefAQEAAAABqwFAAAAAAawBQAAAAAHAAQIAAAABzgEBAAAAAc8BAQAAAAHQAQEAAAABBgMAAgUABA4AAhEABhIiDBMjCgcHAAsIBAMJDQEKDgELEgYPGgoQGwoDBQgEBgACBwAFAgMAAwQKAQEFCwAEAwACBwAJDAAHDRUBAgcACAsTBgELFAABDRYAAwMAAgQAAQ4AAgUJHAAKHQALHgAPHwAQIAABBAABAAQDAAIFAAQOAAIRAAYEAwACBQAEDgACEQAGBQcAESYAEicAEygAFCkAFQAAAAAABQcAESYAEicAEygAFCkAFQAAAwcAGigAGykAHAAAAAMHABooABspABwBBAABAQQAAQUHACEmACInACMoACQpACUAAAAAAAUHACEmACInACMoACQpACUDAwACBAABDgACAwMAAgQAAQ4AAgUHAComACsnACwoAC0pAC4AAAAAAAUHAComACsnACwoAC0pAC4CAwACDAAHAgMAAgwABwUHADMmADQnADUoADYpADcAAAAAAAUHADMmADQnADUoADYpADcBAwADAQMAAwMHADwoAD0pAD4AAAADBwA8KAA9KQA-AQYAAgEGAAIFBwBDJgBEJwBFKABGKQBHAAAAAAAFBwBDJgBEJwBFKABGKQBHAAADBwBMKABNKQBOAAAAAwcATCgATSkAThQCARUkARYlARcmARgnARopARsrDRwsDh0uAR4wDR8xDyIyASMzASQ0DSo3ECs4Fiw6By07By4-By8_BzBABzFCBzJEDTNFFzRHBzVJDTZKGDdLBzhMBzlNDTpQGTtRHTxTDD1UDD5WDD9XDEBYDEFaDEJcDUNdHkRfDEVhDUZiH0djDEhkDEllDUpoIEtpJkxqCk1rCk5sCk9tClBuClFwClJyDVNzJ1R1ClV3DVZ4KFd5Clh6Cll7DVp-KVt_L1yAAQZdgQEGXoIBBl-DAQZghAEGYYYBBmKIAQ1jiQEwZIsBBmWNAQ1mjgExZ48BBmiQAQZpkQENapQBMmuVAThslgEEbZcBBG6YAQRvmQEEcJoBBHGcAQRyngENc58BOXShAQR1owENdqQBOnelAQR4pgEEeacBDXqqATt7qwE_fK0BA32uAQN-sAEDf7EBA4ABsgEDgQG0AQOCAbYBDYMBtwFAhAG5AQOFAbsBDYYBvAFBhwG9AQOIAb4BA4kBvwENigHCAUKLAcMBSIwBxQECjQHGAQKOAckBAo8BygECkAHLAQKRAc0BApIBzwENkwHQAUmUAdIBApUB1AENlgHVAUqXAdYBApgB1wECmQHYAQ2aAdsBS5sB3AFP"
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
var adminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategories,
  createCategory
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
var adminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllBookings: getAllBookings2,
  getAllCategories: getAllCategories2,
  createCategory: createCategory2
};

// src/modules/admin/admin.route.ts
var router2 = Router2();
router2.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router2.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router2.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);
router2.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);
router2.post("/categories", auth(Role.ADMIN), adminController.createCategory);
var adminRoute = router2;

// src/modules/booking/booking.route.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.controller.ts
import httpStatus3 from "http-status";

// src/modules/booking/booking.service.ts
var createBooking = async (customerId, payload) => {
  const checkService = await prisma.service.findUnique({
    where: {
      id: payload.serviceId
    },
    include: {
      technician: true
    }
  });
  if (!checkService) {
    throw new Error("Selected service does not exist");
  }
  if (checkService.technician?.id !== payload.technicianId) {
    throw new Error(
      "Selected service does not belong to the selected technician"
    );
  }
  const technicianProfile = await prisma.user.findUnique({
    where: {
      id: payload.technicianId
    },
    include: {
      technicianProfile: true
    }
  });
  const technicianId = technicianProfile?.technicianProfile?.id;
  if (!technicianId) {
    throw new Error("Technician profile not found");
  }
  const technicianAvailability = await prisma.technicianProfile.findUnique({
    where: {
      id: technicianId
    },
    include: {
      availability: true
    }
  });
  if (!technicianAvailability?.availability.some(
    (availability2) => availability2.id === payload.availabilityId
  )) {
    throw new Error(
      "Selected availability does not belong to the selected technician"
    );
  }
  const availability = await prisma.technicianAvailability.findUnique({
    where: {
      id: payload.availabilityId
    }
  });
  if (!availability?.isAvailable) {
    throw new Error("Selected availability is not available");
  }
  await prisma.technicianAvailability.update({
    where: {
      id: payload.availabilityId
    },
    data: {
      isAvailable: false
    }
  });
  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      bookingDate: payload.bookingDate,
      totalAmount: payload.totalAmount,
      availabilityId: payload.availabilityId,
      ...payload.note && {
        note: payload.note
      }
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
      service: true
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
      reviewReceived: true
    },
    omit: {
      password: true
    }
  });
  return technician;
};
var techniciansService = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB
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
var techniciansController = {
  getAllTechnicians,
  getTechnicianById
};

// src/modules/technicians/technicians.route.ts
var router6 = Router6();
router6.get("/", techniciansController.getAllTechnicians);
router6.get("/:id", techniciansController.getTechnicianById);
var techniciansRoute = router6;

// src/modules/technician/technician.route.ts
import { Router as Router7 } from "express";

// src/modules/technician/technician.controller.ts
import httpStatus6 from "http-status";

// src/modules/technician/technician.service.ts
var updateTechnicianAvailability = async (technicianId, availability) => {
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
  const profileId = technician.technicianProfile.id;
  const date = new Date(availability.date);
  const existingAvailability = await prisma.technicianAvailability.findFirst({
    where: {
      technicianId: profileId,
      date
    }
  });
  if (existingAvailability) {
    const duplicateSlots = availability.slots.filter(
      (slot) => existingAvailability.slots.includes(slot)
    );
    if (duplicateSlots.length > 0) {
      throw new Error(
        `These time slots already exist: ${duplicateSlots.join(", ")}`
      );
    }
  }
  const newAvailability = await prisma.technicianAvailability.create({
    data: {
      technicianId: profileId,
      date,
      slots: availability.slots,
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
var reviewService = {
  createReview
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
var reviewController = {
  createReview: createReview2
};

// src/modules/reviews/review.route.ts
var router8 = Router8();
router8.post("/", auth(Role.CUSTOMER), reviewController.createReview);
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
    await prisma.payment.update({
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
  console.log(signature, "signature");
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
router9.post(
  "/confirm",
  express.raw({
    type: "application/json"
  }),
  paymentController.confirmPayment
);
router9.get("/", auth(Role.CUSTOMER), paymentController.getPayments);
router9.get("/:id", auth(Role.CUSTOMER), paymentController.getPaymentById);
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
