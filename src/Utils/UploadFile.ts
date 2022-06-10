import axios from "axios";

type AttachmentTag = "attachments";

const boundary = "------REJECTJS";
function appendFormData(name: string, data: any, fileName: string) {
  const fileBuffer: Buffer[] = [];

  if (!data) return;
  let str = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${fileName}"`;
  if (data instanceof Buffer) {
    str += "\r\nContent-Type: application/octet-stream";
  } else if (data instanceof Object) {
    str += "\r\nContent-Type: application/json";
    // eslint-disable-next-line no-param-reassign
    data = Buffer.from(JSON.stringify(data));
  } else {
    // eslint-disable-next-line no-param-reassign
    data = Buffer.from(`${data}`);
  }

  fileBuffer.push(Buffer.from(`${str}\r\n\r\n`));
  fileBuffer.push(data);

  fileBuffer.push(Buffer.from(`\r\n--${boundary}--`));
  return fileBuffer;
}

export async function UploadFile(
  file: { name: string; file: Buffer },
  type: AttachmentTag = "attachments",
) {
  const data = Buffer.concat(appendFormData("file", file.file, file.name)!);

  const response = (await (
    await axios.post(`https://autumn.revolt.chat/${type}`, data, {
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
    })
  ).data) as unknown as { id: string };

  return response.id;
}