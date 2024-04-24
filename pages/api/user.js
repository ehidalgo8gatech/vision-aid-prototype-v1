import prisma from "client";
import { ManagementClient } from "auth0";
import { getSession } from '@auth0/nextjs-auth0';

const managementClient = new ManagementClient({
  domain: 'dev-edn8nssry67zy267.us.auth0.com',
  clientId: process.env['AUTH0_MANAGEMENT_CLIENT_ID'],
  clientSecret: process.env['AUTH0_MANAGEMENT_CLIENT_SECRET'],
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await createUser(req, res);
  } else if (req.method == "PATCH") {
    return await updateUser(req, res);
  } else if (req.method == "DELETE") {
    return await deleteUser(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

/**
 * Creates a user in Auth0, stored in the defaul Usernmae/Password database.
 * Returns the essential user attributes. 
 * 
 * @param req 
 * @param res 
 */
async function createUser(req, res) {
  const body = req.body;
  const userObject = {
    email: body.email,
    app_metadata: {
      "va_partners": {
        hospitalRole: [],
        admin: body.admin || false,
      }
    },
    name: body.name,
    password: body.password,
    connection: "Username-Password-Authentication"
  }

  try {
    const response = await managementClient.users.create(userObject);
    return res.status(200).json({
      email: response.data.email,
      name: response.data.name,
      admin: response.data.app_metadata.va_partners.admin,
      hospitalRole: response.data.app_metadata.va_partners.hospitalRole
    }, { success: true });
  }
  catch (error) {
    return res.status(500).json({ error: `Failed to create user with error: ${error.message}` });
  }
}

/**
 * Updates a user based on the data passed in. Only updatesa users name, hospitalRole, and admin
 * status. Does NOT update email or password.
 * 
 * @param req 
 * @param res  
 */
async function updateUser(req, res) {
  try {
    const body = req.body;
    const updateObject = {
      name: body.name,
      app_metadata: {
        "va_partners": {
          hospitalRole: body.hospitalRole,
          admin: body.admin,
        }
      }
    };

    await managementClient.users.update({ id: req.query.id }, updateObject);
    return res.status(200).end();
  }
  catch (error) {
    return res.status(500).json({ error: `Failed to update user with error: ${error.message}` });
  }
}


export async function getUsersByHospital(hospitalId) {
  const hospital = await prisma.hospitalRole.findMany({
    where: {
      name: hospitalId,
    },
    include: {
      hospitalRole: true,
    },
  });
  let userId = [];
  hospital.forEach((hospital) => {
    hospital.hospitalRole.forEach((role) => {
      userId.push(role.userId);
    });
  });
  return prisma.user.findMany({
    where: {
      userId: { in: userId },
    },
  });
}

/**
 * Retrieves all users from Auth0.
 * @returns {Promise}
 */
export async function allUsers() {
  // Retrieve all the users in the username/password connection
  const results = await managementClient.users.getAll({
    q: "identities.connection:Username-Password-Authentication"
  });

  console.log(results.data)

  return results.data.map((user) => {
    return {
    id: user.user_id,
    email: user.email,
    name: user.name,
    admin: user.app_metadata.va_partners.admin || false,
    hospitalRole: user.app_metadata.va_partners.hospitalRole || [],
    lastLogin: (user.last_login) ? new Date(user.last_login).getTime() : null
  }});
}

export async function allHospitalRoles() {
  return prisma.hospitalRole.findMany();
}


/**
 * Deletes a user from Auth0 by their user ID.
 * @returns 204 No Content
 */
async function deleteUser(req, res) {
  const response = await managementClient.users.delete({ id: req.query.id });

  if (response.status !== 204) {
    return res.status(response.status).end();
  }
  
  return res.status(204).end();
}

/**
 * Extracts the users details from the session object
 * @param ctx 
 * @returns Null if the session is null, else user details
 */
export async function getUserFromSession(ctx) {
  const session = await getSession(ctx.req, ctx.res);

  // Session not active, redirect user to homepage
  if (session === null) {
    return null;
  }

  const userFromSession = session.user;
  const userMetadata = userFromSession['https://vapartners.org/app_metadata'];

  // Error logic
  if (!userMetadata || !userMetadata.va_partners) {
    throw new Error("User metadata is incorrectly formatted");
  }

  return {
    email: userFromSession.email,
    name: userFromSession.name,
    admin: (userMetadata.va_partners.admin !== undefined) ? userMetadata.va_partners.admin : false,
    hospitalRole: userMetadata.va_partners.hospitalRole
  };
}
