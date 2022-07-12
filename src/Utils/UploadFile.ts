import axios from "axios";
import FormData from "form-data";

type AttachmentTag = "attachments";

export type revoltAttachmentResponse = {
  id: string;
}

export async function UploadFile(
  file: { name: string; file: Buffer },
  type: AttachmentTag = "attachments",
) {
  const data = new FormData();
  data.append("file", file.file, { filename: file.name });

  const response = (await axios.post(
    `https://autumn.revolt.chat/${type}`,
    data,
    { headers: data.getHeaders() },
  )).data as unknown as revoltAttachmentResponse;

  return response.id;
}
