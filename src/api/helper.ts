import axios from "axios";

export const getS3URL = async (objectName: string) => {
  try {
    const response = await axios.get(
      `https://3kqj6jpfxg.execute-api.ap-south-1.amazonaws.com/resume-parser-backend-stage/get-s3-presigned-url`,
      {
        params: { object_name: objectName },
      }
    );
    console.log(response?.data?.url);
    return response?.data?.url; // Return the pre-signed URL
  } catch (error) {
    console.error("Error getting pre-signed URL:", error);
    throw new Error("Could not get pre-signed URL");
  }
};

export async function uploadFile(file, uploadURL: string) {
  try {
    const response = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("File uploaded successfully.");
  } catch (error: any) {
    console.error("Failed to upload file:", error);
    throw new Error(error.message);
  }
}
