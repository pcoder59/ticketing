import { create } from 'ipfs-http-client';

const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http',
});

export async function readFileFromIPFS(cid) {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const fileContent = new Blob(chunks, { type: 'image/jpeg' }); // Adjust the MIME type as per your image type
    return fileContent;
  } catch (error) {
    console.error('Error reading file from IPFS:', error);
    return null;
  }
}
