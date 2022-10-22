import storageClient from '@config/connectStorage';

const uploadToBucket = async (fileName: string, folder: string, file: Buffer) => {
  try {
    const bucketName = 'dii-project-bucket'
    const storageUrl =
      `https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/${bucketName}/`;

    const response = await storageClient
      .from(bucketName)
      .upload(`${folder}/${fileName}.png`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (response.error) throw new Error(`${response.error.name} : ${response.error.message}`);

    return {
      error: false,
      path: `${storageUrl}${response.data.path}`
    }
  } catch (e) {
    console.error(e);

    return {
      error: true,
      path: ''
    }
  }
}

export default uploadToBucket