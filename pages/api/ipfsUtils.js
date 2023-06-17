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
    const fileContent = Buffer.concat(chunks).toString();
    return fileContent;
  } catch (error) {
    console.error('Error reading file from IPFS:', error);
    return null;
  }
}

export async function writeFileToIPFS(jsonArray) {
  try {
    const jsonString = JSON.stringify(jsonArray);
    const { cid } = await ipfs.add(jsonString);
    return cid.toString();
  } catch (error) {
    console.error('Error writing file to IPFS:', error);
    return null;
  }
}

export async function writeImageFileToIPFS(image) {
  try {
    const { cid } = await ipfs.add(image);
    return cid.toString();
  } catch (error) {
    console.error('Error writing file to IPFS:', error);
    return null;
  }
}