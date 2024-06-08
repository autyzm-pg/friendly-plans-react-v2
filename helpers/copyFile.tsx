import RNFS from 'react-native-fs';

export const copyFromAssetsToRNFS = async (filePath: string): Promise<string | undefined> => {
  try {
    const imageData = await RNFS.readFileAssets(filePath, 'base64');
    await RNFS.writeFile(`${RNFS.DocumentDirectoryPath}/${filePath}`, imageData, 'base64');
    return `file://${RNFS.DocumentDirectoryPath}/${filePath}`
  } catch(e) {
    console.error(e)
  }
}