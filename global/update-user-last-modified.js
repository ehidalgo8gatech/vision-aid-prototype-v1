export const updateUserLastModified = async (prisma, endpoint, method, email) => {
  const data = {
    lastUpdate: `${method} ${endpoint}`,
    lastUpdateDate: new Date().toISOString(),
  };
  await prisma.user.update({
    data,
    where: { email },
  });
}