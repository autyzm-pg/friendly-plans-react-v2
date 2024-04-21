import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import { FullScreenTemplate } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const ImageLibraryScreen: React.FC<Props> = ({navigation, route}) => {

  // static navigationOptions = {
  //   title: i18n.t('planItemActivity:imageLibraryTitle'),
  // };

  const [images, setImages] = useState<string[]>([]);
  const imagesDir = RNFS.DocumentDirectoryPath + '/Images/';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await RNFS.readDir(imagesDir);
        // console.log('Loaded images...');
        const imgPaths = result.map(res => 'file://' + res.path);
        //const repeatedImages = Array.from(Array(20).keys()).map(() => imgPaths).flat();
        setImages(imgPaths);
      } catch (err: any) {
        // console.log('Cannot load images...');
      }
    };
    fetchImages();
  }, [])

  const renderImageItem = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image
          source={{ uri: item }}
          style={[styles.image, { width: /*Math.floor(Math.random() * 100) +*/ 150, height: /*Math.floor(Math.random() * 100) +*/ 150}]}
        />
      </TouchableOpacity>
    );
  };

  const handleImagePress = (uri: string) => {
    route.params?.updateImage(uri);
    navigation.goBack();
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  image: {
    margin: 3,
    borderRadius: 10,
  },
});