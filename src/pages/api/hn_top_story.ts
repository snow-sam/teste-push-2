import MagicBell from "magicbell"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, get, limitToFirst, query } from "firebase/database"
import type { NextApiRequest, NextApiResponse } from "next"
import { topics } from "@/constants/topics"

interface WelcomeRequest extends NextApiRequest {
  body: {
    userId: string
  }
}

type ResponseData = {
  status: string
}

type Story = {
  by: string
  descendants: number
  id: number
  kids: number[]
  score: number
  time: number
  title: string
  type: "story"
  url: string
}

const magicbell = new MagicBell({
  apiKey: "7f448c94e94201cfe85cb7426f7c764d4ce88bef",
  apiSecret: "GwrFcxINDxC99GQMbv9m0BmPpAqvseyiLaVj3SmB",
})

const firebaseConfig = {
  databaseURL: "https://hacker-news.firebaseio.com",
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export default async function handler(
  req: WelcomeRequest,
  res: NextApiResponse<ResponseData>
) {
  const docRef = query(ref(db, "v0/topstories"), limitToFirst(5))

  await get(docRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      const items = snapshot.val()
      const fullItems: Story[] = await Promise.all(
        items.map((item: number) =>
          get(ref(db, `v0/item/${item}`)).then((snapshot) => snapshot.val())
        )
      )
      // TODO: check for the first un-notified item
      const firstUnNotifiedItem = fullItems[0]
      return magicbell.notifications.create({
        title: `(${firstUnNotifiedItem.score}) ${firstUnNotifiedItem.title}`,
        action_url: firstUnNotifiedItem.url,
        recipients: [{ external_id: req.body.userId }],
        category: "default",
        topic: topics["HN Top Story"].id,
      })
    } else {
      console.log("No data available")
    }
  })

  res.status(200).json({ status: "success" })
}
