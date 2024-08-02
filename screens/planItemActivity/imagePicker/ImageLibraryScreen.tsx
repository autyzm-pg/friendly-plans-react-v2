import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { FullScreenTemplate, IconButton, ModalTrigger } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { dimensions, palette, typography } from '../../../styles';
import { PlanItem, InnerGalleryService as InnerGallery } from '../../../models';
import ImagePicker from 'react-native-image-crop-picker';
import { Route } from '../../../navigation';
import { i18n } from '../../../locale';
import { MultiButton } from '../../../components/MultiButton';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const ImageLibraryScreen: React.FC<Props> = ({ navigation, route }) => {
  const [images, setImages] = useState<string[]>([]);
  const [usedImages, setUsedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const selectMode = useRef<boolean>(route.params?.updateImage ? true : false);
  const fetchImages = async () => {
      const isSelectMode = route.params?.updateImage ? true : false;
      if (!isSelectMode) {
        const images = await PlanItem.getImgUriUsed();
        setUsedImages(images);
      }
      const imgPaths = await InnerGallery.fetchFiles(InnerGallery.imagesDir);
      // const repeatedImages = Array.from(Array(20).keys()).map(() => imgPaths).flat();
      setImages(imgPaths);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderImageItem = ({ item }: { item: string }) => {
    const isSelected = selectedImages.includes(item);
    const isUsed = usedImages.includes(item);
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={isSelected && { borderWidth: 5, borderColor: palette.primary, backgroundColor: palette.primary, borderRadius: 10 }}>
          <Image
            source={{ uri: item }}
            style={[styles.image, 
              { width: 150, height: 150 }, 
              isUsed && { opacity: 0.5 }
            ]}
          />
        </View>
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

  const loadMultiple = async() => {
    await ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true
    }).then(async (images) => {
      await InnerGallery.copyMultipleImages(images);
      navigation.goBack();
    });
  };

  const showInfo = () => {
    return (
      <View style={styles.imageActionContainer}>
        <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('imageGallery:usage')}</Text>
      </View>
    );
  };

  const unSelectAll = () => {
    if (selectedImages.length == images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images);
    }
  };

  const renderSelectAllButton = () => {
    if (!selectedImages.length) { return <></>; }
    const selectAll = selectedImages.length != images.length;
    return (
      <View style={{ alignItems: 'flex-start', 
                     marginLeft: dimensions.spacingBig, 
                     marginTop: dimensions.spacingSmall }}>
        <MultiButton onPress={unSelectAll} 
                        title={selectAll ? i18n.t('planActivity:selectTasks') : i18n.t('planActivity:unSelectTasks')}
                        buttonName={selectAll ? 'check-square' : 'square'} 
                        buttonType='feather' 
                        disabled={false}/>
      </View>);
  };

  return (
    <>
    {!selectMode.current && 
      <View style={styles.trashIconContainer}>
          {/* <Text style={styles.text}>{i18n.t('imageGallery:information') + ` ${selectedImages.length ? selectedImages.length : 0}`}</Text> */}
          <MultiButton onPress={deleteMultiple} title={i18n.t('common:deleteButton')} buttonName='trash' buttonType='font-awesome' disabled={selectedImages.length == 0}/>
          <MultiButton onPress={loadMultiple} title={i18n.t('common:import')} buttonName='file-download' buttonType='material' disabled={false}/>
          <MultiButton onPress={() => { navigation.navigate(Route.Export, { images: true }); }} title={i18n.t('common:export')} buttonName='upload' buttonType='material' disabled={!images.length}/>
          <View style={{ marginRight: dimensions.spacingSmall }}></View>
          <ModalTrigger title={i18n.t('planItemActivity:infoBox')} modalContent={showInfo()}>
              <IconButton name={'information-circle'} type={'ionicon'} size={30} 
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          disabled color={palette.informationIcon} 
                          style={{marginRight: dimensions.spacingBig}}/>
          </ModalTrigger>
        </View>
    }
    <FullScreenTemplate darkBackground>
      {renderSelectAllButton()}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    marginTop: 0,
    paddingTop: 0
  },
  iconButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: dimensions.spacingBig
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
