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
    const { id, ...content } = req.body;
    const updatedContent = await prisma.landing_Page.update({
      where: { id },
      content,
    });
    res.status(200).json(updatedContent);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update user content." });
  }
}

async function readContent(req, res) {
  try {
    var pgeContent;
    if (req.query.userId != null) {
      pgeContent = await prisma.landing_Page.findMany({
        where: {
          userId: {
            contains: req.query.userId,
          },
        },
        include: {
          content: true,
        },
      });
    } else {
      pgeContent = await prisma.landing_Page.findMany({
        include: {
          content: true,
        },
      });
    }
    return res.status(200).json(pgeContent, { success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error reading content" + error, success: false });
  }
}

async function addContent(req, res) {
  const body = req.body;
  
  const create = {
    content: {
      userId: body.userId,
      creationDate: date.now(),
      content: body.content,
    },
    include: {
      content: true,
    },
  };
  try {
    const pgeContent = await prisma.landing_Page.create(create);
    return res.status(200).json(pgeContent, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
