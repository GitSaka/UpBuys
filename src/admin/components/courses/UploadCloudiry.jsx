// utiliser 

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "WhatsUpload");

  try {
    // image ou fichier
    const resourceType = file.type.startsWith("image/")
      ? "image"
      : "raw";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dyen5y5kh/${resourceType}/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    if (!res.ok) {
      throw new Error("Échec upload Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;

  } catch (error) {
    console.error("❌ Cloudinary upload error :", error);
    return null;
  }
};
