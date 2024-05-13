import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import { FullScreenTemplate, Icon, IconButton, ModalTrigger } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { dimensions, palette, typography } from '../../../styles';
import { PlanItem } from '../../../models';
import ImagePicker from 'react-native-image-crop-picker';
import { Route } from '../../../navigation';
import { i18n } from '../../../locale';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const ImageLibraryScreen: React.FC<Props> = ({ navigation, route }) => {
  const [images, setImages] = useState<string[]>([]);
  const [usedImages, setUsedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const imagesDir = RNFS.DocumentDirectoryPath + '/Images/';
  const selectMode = useRef<boolean>(route.params?.updateImage ? true : false);

  const fetchImages = async () => {
    try {
      if (!(route.params?.updateImage ? true : false)) {
        const images = await PlanItem.getImgUriUsed();
        setUsedImages(images);
      }
      const result = await RNFS.readDir(imagesDir);
      const imgPaths = result.map(res => 'file://' + res.path);
      // const repeatedImages = Array.from(Array(20).keys()).map(() => imgPaths).flat();
      setImages(imgPaths);
    } catch (err: any) {
      console.error('Cannot load images:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderImageItem = ({ item }: { item: string }) => {
    const isSelected = selectedImages.includes(item);
    const isUsed = usedImages.includes(item);
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <Image
          source={{ uri: item }}
          style={[styles.image, 
            { width: 150, height: 150 }, 
            isSelected && { borderWidth: 5, borderColor: palette.primary },
            isUsed && { opacity: 0.5 }
          ]}
        />
      </TouchableOpacity>
    );
  };

  const handlePress = (uri: string) => {
    selectMode.current ? chooseImageForTask(uri) : chooseImageForDeleting(uri);
  };

  const chooseImageForTask = (uri: string) => {
    route.params?.updateImage(uri);
    navigation.goBack();
  };

  const chooseImageForDeleting = (uri: string) => {
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

  const showInfo = () => {
    return (
      <View style={styles.imageActionContainer}>
        <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('imageGallery:usage')}</Text>
      </View>
    );
  };

  return (
    <>
    {!selectMode.current && 
      <View style={styles.trashIconContainer}>
          <Text style={styles.text}>{i18n.t('imageGallery:information') + ` ${selectedImages.length ? selectedImages.length : 0}`}</Text>
          <View style={styles.iconButtonContainer}>
            <IconButton name='trash' type='font-awesome' size={24} color={palette.primary} onPress={deleteMultiple} disabled={selectedImages.length == 0}/>
          </View>
          <ModalTrigger title={i18n.t('planItemActivity:infoBox')} modalContent={showInfo()}>
              <IconButton name={'information-circle'} type={'ionicon'} size={30} disabled color={palette.informationIcon} style={{marginRight: dimensions.spacingLarge}}/>
          </ModalTrigger>
        </View>
    }
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
  imageActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: dimensions.spacingLarge,
  },
});
