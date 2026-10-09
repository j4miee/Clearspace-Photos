import { File } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset, AssetField, MediaType, Query } from 'expo-media-library';
import type { PhotoMetadata, PhotoPermission } from './photo-library.types';

function toPermission(response: MediaLibrary.PermissionResponse): PhotoPermission {
  return {
    granted: response.granted,
    canAskAgain: response.canAskAgain,
    status: String(response.status),
    accessPrivileges: response.accessPrivileges,
  };
}

export async function getPhotoPermission(): Promise<PhotoPermission> {
  return toPermission(await MediaLibrary.getPermissionsAsync(false, ['photo']));
}

export async function requestPhotoAccess(): Promise<PhotoPermission> {
  return toPermission(await MediaLibrary.requestPermissionsAsync(false, ['photo']));
}

export async function queryPhotoPage(offset: number, limit: number): Promise<PhotoMetadata[]> {
  const assets = await new Query()
    .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
    .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
    .offset(offset)
    .limit(limit)
    .exeForMetadata();

  return assets.map((asset) => ({ ...asset, fileSize: null }));
}

export async function getLocalPhotoFileSize(id: string): Promise<number | null> {
  try {
    const uri = await new Asset(id).getUri();
    const size = new File(uri).size;
    return typeof size === 'number' && size > 0 ? size : null;
  } catch {
    return null;
  }
}

export async function presentLimitedPhotoPicker() {
  await MediaLibrary.presentPermissionsPicker(['photo']);
}

export async function deletePhotos(ids: string[]) {
  await Asset.delete(ids.map((id) => new Asset(id)));
}
