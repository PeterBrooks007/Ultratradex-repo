
//Get PublicId from cloudinary Url
const getPublicIdFromUrl = (secureUrl) => {
  const urlParts = secureUrl.split("/");
  const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));
  const publicIdWithExtension = urlParts.slice(versionIndex + 1).join("/");
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
};





module.exports = {
  getPublicIdFromUrl,
};
