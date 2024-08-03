/* eslint-disable prettier/prettier */
import React, { useEffect, FC, useState } from 'react';
import { Route } from '../navigation/routes';
import DatabaseService, { executeQuery } from '../services/DatabaseService';
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { i18n } from '../locale';
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';

interface Props {
  navigation: any
};

const images: { [key: string]: any } = {
  'pl-PL': require('../assets/images/launch_screen_pl-PL.png'),
  'en-GB': require('../assets/images/launch_screen_en-GB.png'),
};

export const WelcomeScreen: FC<Props> = ({ navigation }) => {  
  const [clicked, setClicked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageSource, _] = useState(images[i18n.t('common:language')]);
  const {setEditionMode} = useRootNavigatorContext();

  const handlePress = () => {
    setClicked(true);
  };

  const connectToDatabase = async () => {
    const db = new DatabaseService();
    await db.initializeDatabase().then(async() => { 
      const resultSet = await executeQuery(`SELECT * FROM EditionMode ORDER BY id ASC LIMIT 1;`);
      if (resultSet.rows.length) {
        setEditionMode(!!resultSet.rows.item(0).editionMode);
      };
     }).then(() => { setLoaded(true); });
  };
  
  useEffect(() => {
    connectToDatabase();
  }, []);

  useEffect(() => {
    if (clicked && loaded) { navigation.navigate(Route.Dashboard); };
  }, [clicked, loaded]);

  return(<TouchableOpacity
        onPress={handlePress}
        style={{ flex: 1 }}
        activeOpacity={1}
      >
        <StatusBar hidden />
        <View style={styles.container}>
          <Image
            source={imageSource}
            resizeMode="stretch"
            style={{ flex: 1, width: "100%" }}
          />
        </View>
      </TouchableOpacity>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
});