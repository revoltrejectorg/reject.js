import axios from "axios";
import FormData from "form-data";
import { constants } from "..";

type AttachmentTag = "attachments";

export type revoltAttachmentResponse = {
  id: string;
}

export async function UploadFile(
  file: { name: string; file: Buffer },
  contentType?: string,
  type: AttachmentTag = "attachments",
  autumnURL = constants.AutumnURL,
) {
  const data = new FormData();
  data.append("file", file.file, { filename: file.name, contentType });

  const response = (await axios.post(
    `${autumnURL}/${type}`,
    data,
    { headers: data.getHeaders() },
  )).data as unknown as revoltAttachmentResponse;

  return response.id;
}
