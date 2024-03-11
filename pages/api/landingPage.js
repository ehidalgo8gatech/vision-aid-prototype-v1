import prisma from "client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await addContent(req, res);
  } else if (req.method == "GET") {
    return await readContent(req, res);
  } else if (req.method == "PATCH") {
    return await updateContent(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function updateContent(req, res) {
  try {
    const { id, ...data } = req.body;
    const updatedUser = await prisma.landing_Page.update({
      where: { id },
      data,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update user data." });
  }
}

async function readContent(req, res) {}

async function addContent(req, res) {
  
  const body = req.body;
  console.log(body.userId)
  console.log(body.content)
  const create = {
    data: {
      userId: parseInt(body.userId),
      content:body.content,

    },
  };
  try {
    const counselling = await prisma.landing_Page.create(create);
    return res.status(200).json(counselling, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
