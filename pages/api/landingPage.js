import prisma from "client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await addContent(req, res);
  } else if (req.method == "GET") {
    return await readContent(req, res);
  } else if (req.method == "PATCH") {
    return await updateContent(req, res);
  } else if (req.method == "DELETE") {
    return await deleteContent(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function updateContent(req, res) {
  console.log(" \n\n +++++++ inside updateContent ++++++ ")
  let  updatedUser
  try {
    if (req.body.userId != null || req.body.userId != '' ) {
      updatedUser = await prisma.landing_Page.update({
        where: { 
          userId: parseInt(req.body.userId),
        }, 
        data: {
          content: req.body.content,
        },
      });
  }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update content." });
  }
}


async function readContent(req, res) {
  var userData;
  try {
    if (req.query.userId != null || req.query.userId != '' ) {
      userData =  await prisma.landing_Page.findFirst({
        where: {
          userId: parseInt(req.query.userId),
        },
      });
    } 
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}

async function addContent(req, res) {
  console.log(" \n\n +++++++ inside addContent ++++++ ")
  const dt = new Date();
  const body = req.body;
  const create = {
    data: {
      user: {
        connect: {
          id: parseInt(body.userId),
        },
      },
      content: body.content,
      creationDate: dt,
    },
  };
  try {
    const data = await prisma.landing_Page.create(create);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Request error " + error);
    res.status(500).json({ error: "Failed to add content." + error, success: false });
  }

  return res
}


async function deleteContent(req, res) {
  var userData;
  try {
    if (req.query.userId != null || req.query.userId != '' ) {
      userData =  await prisma.landing_Page.delete({
        where: {
          userId: parseInt(req.query.userId),
        },
      });
    } 
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error deleting from database", success: false });
  }
}




///////////////////