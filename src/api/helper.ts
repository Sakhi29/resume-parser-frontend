import axios from "axios";

export const getS3URL = async (objectName: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_AWS_API_ENDPOINT}/resume-parser-backend-stage/get-s3-presigned-url`,
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

export async function uploadFile(file: any, uploadURL: string) {
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
    return true;
  } catch (error: any) {
    console.error("Failed to upload file:", error);
    throw new Error(error.message);
  }
}

export const generateQuestions = async (userId: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AWS_API_ENDPOINT}/resume-parser-backend-stage/generate-questions`,
      {
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    console.log("Generated Questions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions");
  }
};

// Example usage function that combines all steps
export const processResumeAndGenerateQuestions = async (
  file: File,
  userId: string
) => {
  try {
    // 1. Get presigned URL
    const presignedUrl = await getS3URL(`uploads/${userId}_${file.name}`);

    // 2. Upload file
    await uploadFile(file, presignedUrl);

    // 3. Wait a bit for the parser to process the file (adjust time as needed)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 4. Generate questions
    const questions = await generateQuestions(userId);

    return questions;
  } catch (error) {
    console.error("Error in process:", error);
    throw error;
  }
};


