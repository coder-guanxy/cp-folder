import { CopyFolderOptionRename } from './types';

export const handleRename = (
  renameFiles: CopyFolderOptionRename,
  fileName: string,
) => {
  let result = fileName;

  Object.entries(renameFiles)?.find(([sourceName, targetName]) => {
    if (sourceName === fileName) {
      result = targetName;
      return true;
    }
  });

  return result;
};
