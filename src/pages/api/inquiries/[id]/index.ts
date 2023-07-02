import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { inquiryValidationSchema } from 'validationSchema/inquiries';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.inquiry
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInquiryById();
    case 'PUT':
      return updateInquiryById();
    case 'DELETE':
      return deleteInquiryById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInquiryById() {
    const data = await prisma.inquiry.findFirst(convertQueryToPrismaUtil(req.query, 'inquiry'));
    return res.status(200).json(data);
  }

  async function updateInquiryById() {
    await inquiryValidationSchema.validate(req.body);
    const data = await prisma.inquiry.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteInquiryById() {
    const data = await prisma.inquiry.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
