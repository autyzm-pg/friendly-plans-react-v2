import RNFS, { ReadDirItem } from 'react-native-fs';
import { i18n } from '../locale';
import uuid from 'react-native-uuid';
import { Image } from 'react-native-image-crop-picker';
import { DocumentPickerResponse } from 'react-native-document-picker';
import _ from 'lodash';
import { zip, subscribe } from 'react-native-zip-archive';


export class InnerGalleryService {
    static imagesDir = RNFS.DocumentDirectoryPath + '/Images/';
    static recordingsDir = RNFS.DocumentDirectoryPath + '/Recordings/';
    static exportImgPath = RNFS.DownloadDirectoryPath + '/' + i18n.t('imageGallery:zip');
    static exportRecPath = RNFS.DownloadDirectoryPath + '/' + i18n.t('recGallery:zip');

    static createDirectory = async(directory: string) => {
        /* Create directory if one doesn't exists. */
        await RNFS.exists(directory)
        .then(async(exists) => {
            if (exists) { return; }
            await RNFS.mkdir(directory);
        });
    };

    static fetchFiles = async(directory: string) => {
        const result = await RNFS.readDir(directory);
        return result.map(res => 'file://' + res.path);
    };

    static splitToNameAndExtension = (fileName: string) => {
        /* Return [name, extension] of file-name using last dot.
           In case of no extension return empty string as one.
        */
        const idx = fileName.lastIndexOf('.');
        if (idx !== -1) {
          const name = fileName.substring(0, idx);
          const extension = fileName.substring(idx + 1);
          return [name, extension];
        }
        return [fileName, ''];
    };

    static validateFileName = (text: string, setText: (value: React.SetStateAction<string>) => void) => {
        /* File-name should be non empty and use only letters and digits; no special characters. */
        const isValidText = /^[a-zA-Z0-9]+$/.test(text);
        if (text.length == 0) {
          setText(i18n.t('common:required'));
          return false;
        }
        else if (!isValidText) {
          setText(i18n.t('common:incorrectFileName'));
          return false;
        }
        return true;
    };

    static getFileName = (filePath: string) => {
        return filePath.substring(filePath.lastIndexOf('/') + 1);
    };

    static createUniqueFilePath = async(directory: string, fileName: string) => {
        /* If a file already exists, in a given directory, function adds uuid.v4 to name. */
        let filePath = directory + fileName;
        const doesFileExist = await RNFS.exists(filePath);
        if (doesFileExist) { 
            const [name, extension] = InnerGalleryService.splitToNameAndExtension(fileName);
            filePath = directory + name + '_' + uuid.v4() + '.' + extension;
        }
        return filePath;
    };

    static copyFile = async(fileOrgPath: string, fileTarPath: string, uriUpdate: (uri: string) => void) => {
        await RNFS.copyFile(fileOrgPath, fileTarPath).then(() => { uriUpdate('file://' + fileTarPath); });
    };

    static copyMultipleImages = async(images: Image[]) => {
        if (images.length == 0) { return; }
        images.forEach(async(img) => {
            const fileName = InnerGalleryService.getFileName(img.path);
            const fileTarPath = await InnerGalleryService.createUniqueFilePath(InnerGalleryService.imagesDir, fileName);
            await RNFS.copyFile(img.path, fileTarPath);
          });
    };

    static copyMultipleRecs = async(recordings: DocumentPickerResponse[]) => {
        if (recordings.length == 0 ) { return; }
        recordings.forEach(async(rec) => {
            if (!rec.name) { return; }
            const fileTarPath = await InnerGalleryService.createUniqueFilePath(InnerGalleryService.recordingsDir, rec.name);
            await RNFS.copyFile(rec.uri, fileTarPath);
        });
    };

    static moveFile = async(fileOrgPath: string, fileTarPath: string, uriUpdate: (uri: string) => void) => {
        await RNFS.moveFile(fileOrgPath, fileTarPath).then(() => { uriUpdate('file://' + fileTarPath); });
    };

    static renameFile = async(fileOrgPath: string, fileTarPath: string, uriUpdate: (uri: string) => Promise<void>) => {
        await RNFS.copyFile(fileOrgPath, fileTarPath)
        .then(async() => {
            await RNFS.unlink(fileOrgPath).then(async() => {
                await uriUpdate('file://' + fileTarPath);
            });
        });
    };

    static getGallerySize = async(directory: string) => {
        const getFolderSize = async() => {
            return await RNFS.readDir(directory).then((result: ReadDirItem[]) => {
                const folderEntriesSizeInBytes: number = _.reduce(
                  result,
                  (sum: number, currentItem: ReadDirItem) => {
                    return sum + Number(currentItem.size);
                  },
                  0
                );
                return folderEntriesSizeInBytes;
              });
            };
        const size = await getFolderSize();
        return (size / (1024 **2)).toFixed(0) + ' MB';
    };

};