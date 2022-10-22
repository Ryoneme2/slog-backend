import storageClient from '@config/connectStorage';

const uploadToBucket = async (fileName: string, folder: string, file: Buffer) => {
  try {
    const bucketName = 'dii-project-bucket'
    const storageUrl =
      `https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/${bucketName}/`;

    const x = await storageClient
      .from(bucketName)
      .upload(`${folder}/${fileName}.png`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (x.error) throw new Error(`${x.error.name} : ${x.error.message}`);

    return {
      error: false,
      data: x.data.path
    }
  } catch (e) {
    return ''
  }
}

export default uploadToBucket