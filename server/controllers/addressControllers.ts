import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/errors.js";

const addressFields = {
  label: z.string().trim().min(1, "Label is required").max(40),
  address: z.string().trim().min(1, "Street address is required").max(300),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  zip: z.string().trim().min(1, "PIN / ZIP code is required").max(20),
  country: z.string().trim().min(1).max(100),
  isDefault: z.boolean(),
  lat: z.coerce.number().min(-90, "Location is required").max(90),
  lng: z.coerce.number().min(-180, "Location is required").max(180),
};
const createSchema = z.object(addressFields).extend({
  country: addressFields.country.default("India"),
  isDefault: addressFields.isDefault.default(false),
});
const updateSchema = z.object(addressFields).partial();

//Get user addresses
//GET/api/addresses
export const getAddresses = async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "asc" },
  });
  res.json({ addresses });
};

//Add address
//POST/api/addresses
export const addAddress = async (req: Request, res: Response) => {
  const data = createSchema.parse(req.body);

  const currentAddresses = await prisma.address.findMany({ where: { userId: req.user!.id } });
  const makeDefault = data.isDefault || currentAddresses.length === 0;
  if (makeDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }

  await prisma.address.create({
    data: { ...data, userId: req.user!.id, isDefault: makeDefault },
  });

  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "asc" },
  });
  res.status(201).json({ addresses });
};

//Update address
//PUT/api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
  const data = updateSchema.parse(req.body);

  const existing = await prisma.address.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
  });
  if (!existing) throw new HttpError(404, "Address not found");

  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }

  await prisma.address.update({ where: { id: existing.id }, data });

  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "asc" },
  });
  res.json({ addresses });
};

//Delete Address
//DELETE/api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
  const existing = await prisma.address.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
  });
  if (!existing) throw new HttpError(404, "Address not found");

  await prisma.address.delete({ where: { id: existing.id } });

  // If the deleted address was the default, promote the oldest remaining one
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "asc" },
    });
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "asc" },
  });
  res.json({ addresses }); // was `{ addAddress }` before - the client never actually got the updated list
};
