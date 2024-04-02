import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import { FullScreenTemplate } from '../../components';

interface Props {
  // planItem: PlanItem;
}

export const ImageLibraryScreen: React.FC<Props> = ({}) => {

  // static navigationOptions = {
  //   title: i18n.t('planItemActivity:imageLibraryTitle'),
  // };

  const [images, setImages] = useState<string[]>([]);
  const imagesDir = RNFS.DocumentDirectoryPath + '/Images/';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await RNFS.readDir(imagesDir);
        console.log('Loaded images...');
        const imgPaths = result.map(res => 'file://' + res.path);
        setImages(imgPaths);
      } catch (err: any) {
        console.log('Cannot load images...');
      }
    };
    fetchImages();
  }, [])

  const renderImageItem = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image
          source={{ uri: item }}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  };

  const handleImagePress = (uri: string) => {
    // Tutaj możesz obsłużyć kliknięcie obrazka, np. otworzyć go w pełnym ekranie
  };

  return (
    <FullScreenTemplate darkBackground>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={Math.floor(useWindowDimensions().width / 100)}
        contentContainerStyle={styles.flatListContainer}
      />
    </FullScreenTemplate>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  image: {
    width: 100,
    aspectRatio: 1,
    margin: 3,
  },
});