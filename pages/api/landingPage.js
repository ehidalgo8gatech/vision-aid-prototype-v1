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
  let  updatedUser
  try {
    if (req.body.id != null || req.body.id != '' ) {
      updatedUser = await prisma.landing_Page.update({
        where: { 
          id: parseInt(req.body.id),
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
    console.log(req.query)
    if (req.query.id != null ) {
      userData =  await prisma.landing_Page.findFirst({
        where: {
          id: parseInt(req.query.id),
        },
      });
    } else {
      // if no content id provided, return all contents.
      userData = await findAllLandingPagePosts();
      console.log(userData.length)
    }
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}

export async function findAllLandingPagePosts() {
  const posts = await prisma.landing_Page.findMany();
  return posts.map(post => {
    return {
      ...post,
      creationDate: new Date(post.creationDate).getTime(),
    };
  });
}


async function addContent(req, res) {
  const dt = new Date();
  const body = req.body;
  const create = {
    data: {
      content: body.content,
      title: body.title,
      creationDate: dt,
    },
  };
  try {
    const data = await prisma.landing_Page.create(create);
    return res.status(200).json(data);
  } catch (error) {
    console.log("Request error " + error);
    res.status(500).json({ error: "Failed to add content." + error, success: false });
  }

  return res
}


async function deleteContent(req, res) {
  var userData;
  try {
    if (req.query.id != null || req.query.id != '' ) {
      if (req.query.action == "clear") {
        userData =  await prisma.landing_Page.deleteMany()
      } else {
        userData =  await prisma.landing_Page.delete({
          where: {
            id: parseInt(req.query.id),
          },
        });
      }

    } 
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error deleting from database", success: false });
  }
}


async function getUserID(emailAddr) {
  const data = await prisma.user.findFirst({
    where: {
      email: emailAddr,
    }
  })
  return data.id
}


