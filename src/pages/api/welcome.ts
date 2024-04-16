import MagicBell from "magicbell"
import type { NextApiRequest, NextApiResponse } from "next"

interface WelcomeRequest extends NextApiRequest {
  body: {
    userId: string
  }
}

type ResponseData = {
  status: string
}

const magicbell = new MagicBell({
  apiKey: "7f448c94e94201cfe85cb7426f7c764d4ce88bef",
  apiSecret: "GwrFcxINDxC99GQMbv9m0BmPpAqvseyiLaVj3SmB",
})

export default async function handler(
  req: WelcomeRequest,
  res: NextApiResponse<ResponseData>
) {
  await magicbell.notifications.create({
    title: "Thanks for subscribing!",
    action_url: "https://magicbell.com",
    recipients: [{ external_id: req.body.userId }],
    category: "default",
  })
  res.status(200).json({ status: "success" })
}
