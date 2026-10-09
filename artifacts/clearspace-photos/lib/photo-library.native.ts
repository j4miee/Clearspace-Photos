import { File } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset, AssetField, MediaType, Query } from 'expo-media-library';
import type { MediaMetadata, PhotoMetadata, PhotoPermission } from './photo-library.types';

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

export async function queryMediaPage({
  isVideo,
  limit,
  createdBefore,
  ascending = false,
}: {
  isVideo: boolean;
  limit: number;
  createdBefore?: number;
  ascending?: boolean;
}): Promise<MediaMetadata[]> {
  let query = new Query().eq(AssetField.MEDIA_TYPE, isVideo ? MediaType.VIDEO : MediaType.IMAGE);
  if (createdBefore != null) {
    query = query.lte(AssetField.CREATION_TIME, createdBefore);
  }
  const assets = await query
    .orderBy({ key: AssetField.CREATION_TIME, ascending })
    .limit(limit)
    .exeForMetadata();

  return assets.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    width: asset.width,
    height: asset.height,
    creationTime: asset.creationTime,
    isFavorite: asset.isFavorite,
    fileSize: null,
    isVideo,
  }));
}

export async function queryScreenshots(limit: number): Promise<MediaMetadata[]> {
  const { assets } = await MediaLibrary.getAssetsAsync({
    mediaType: ['photo'],
    mediaSubtypes: ['screenshot'],
    first: limit,
    sortBy: [['creationTime', false]],
  });

  const favouriteFlags = new Map<string, boolean>();
  for (let index = 0; index < assets.length; index += 8) {
    await Promise.all(
      assets.slice(index, index + 8).map(async (asset) => {
        try {
          const info = await MediaLibrary.getAssetInfoAsync(asset);
          favouriteFlags.set(asset.id, info.isFavorite ?? false);
        } catch {
          favouriteFlags.set(asset.id, true);
        }
      }),
    );
  }

  return assets.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    width: asset.width,
    height: asset.height,
    creationTime: asset.creationTime,
    isFavorite: favouriteFlags.get(asset.id) ?? true,
    fileSize: null,
    isVideo: false,
  }));
}

export async function getPhotoUri(id: string): Promise<string | null> {
  try {
    return await new Asset(id).getUri();
  } catch {
    return null;
  }
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
