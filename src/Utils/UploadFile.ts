import axios from "axios";

type AttachmentTag = "attachments";

const boundary = "------REJECTJS"
function appendFormData(name: string, data: any, fileName: string) {
  const fileBuffer: Buffer[] = [];

  if (!data) return;
  let str = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${fileName}"`;
  if (data instanceof Buffer) {
    str += "\r\nContent-Type: application/octet-stream";
  } else if (data instanceof Object) {
    str += "\r\nContent-Type: application/json";
    data = Buffer.from(JSON.stringify(data));
  } else {
    data = Buffer.from(`${data}`);
  }

  fileBuffer.push(Buffer.from(`${str}\r\n\r\n`));
  fileBuffer.push(data);

  fileBuffer.push(Buffer.from(`\r\n--${boundary}--`));
  return fileBuffer;
}

export async function UploadFile(
  file: { name: string; file: Buffer },
  type: AttachmentTag = "attachments"
) {
  const response = (await (
    await axios({
      method: "POST",
      url: `https://autumn.revolt.chat/${type}`,
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      data: Buffer.concat(appendFormData("file", file.file, file.name)!)
    })
  ).data) as unknown as { id: string };

  return response.id;
}
