import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import { FullScreenTemplate, IconButton } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { dimensions, palette, typography } from '../../../styles';
import { PlanItem } from '../../../models';
import ImagePicker from 'react-native-image-crop-picker';
import { Route } from '../../../navigation';
import { i18n } from '../../../locale';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const ImageLibraryScreen: React.FC<Props> = ({ navigation, route }) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const imagesDir = RNFS.DocumentDirectoryPath + '/Images/';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await RNFS.readDir(imagesDir);
        const imgPaths = result.map(res => 'file://' + res.path);
        // const repeatedImages = Array.from(Array(20).keys()).map(() => imgPaths).flat();
        setImages(imgPaths);
      } catch (err: any) {
        console.error('Cannot load images:', err);
      }
    };
    fetchImages();
  }, []);

  const renderImageItem = ({ item }: { item: string }) => {
    const isSelected = selectedImages.includes(item);
    return (
      <TouchableOpacity onLongPress={() => handleImageLongPress(item)} onPress={() => handleImageShortPress(item)}>
        <Image
          source={{ uri: item }}
          style={[styles.image, { width: 150, height: 150 }, isSelected && { borderWidth: 5, borderColor: palette.primary }]}
        />
      </TouchableOpacity>
    );
  };

  const handleImageLongPress = (uri: string) => {
    route.params?.updateImage(uri);
    navigation.goBack();
  };

  const handleImageShortPress = (uri: string) => {
    const isSelected = selectedImages.includes(uri);
    if (isSelected) {
      const filteredImages = selectedImages.filter((image) => image !== uri);
      setSelectedImages(filteredImages);
    } else {
      setSelectedImages((prev) => [...prev, uri]);
    }
  };

  const deleteMultiple = async() => {
    Alert.alert(i18n.t('imageGallery:warningHeader'), i18n.t('imageGallery:warningInformation'), [
      { text: i18n.t('common:cancel') },
      {
        text: i18n.t('common:confirm'),
        onPress: async() => {
          await PlanItem.removeNonExistingUris(selectedImages);
          selectedImages.forEach(async(uri) => { await ImagePicker.cleanSingle(uri).catch(() => {});});
          navigation.navigate(Route.Dashboard);
        },
      },
    ]);
  };

  return (
    <>
    <View style={styles.trashIconContainer}>
        <Text style={styles.text}>{i18n.t('imageGallery:information') + ` ${selectedImages.length ? selectedImages.length : 0}`}</Text>
        <View style={styles.iconButtonContainer}>
          <IconButton name='trash' type='font-awesome' size={24} color={palette.primary} onPress={deleteMultiple} disabled={selectedImages.length == 0}/>
        </View>
      </View>
    <FullScreenTemplate darkBackground>
      <View style={styles.container}>
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={Math.floor(useWindowDimensions().width / 150)}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </FullScreenTemplate>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dimensions.spacingSmall,
    marginRight: dimensions.spacingSmall
  },
  trashIconContainer: {
    backgroundColor: palette.textWhite,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 0,
    paddingTop: 0
  },
  iconButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: dimensions.spacingLarge
  },
  flatListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  image: {
    margin: 3,
    borderRadius: 10,
  },
  text: {
    ...typography.body,
    marginRight: 'auto',
    marginLeft: dimensions.spacingLarge,
    color: palette.textBody,
  },
});
