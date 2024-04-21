import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, FullScreenTemplate, IconButton } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { dimensions, palette } from '../../../styles';
import Sound from 'react-native-sound';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const RecordingLibraryScreen: React.FC<Props> = ({ navigation, route }) => {
    const [recordings, setRecordings] = useState<string[]>([]);
    const recordingsDir = RNFS.DocumentDirectoryPath + '/Recordings/';

    useEffect(()=> {
    const fetchRecordings = async () => {
        try {
            const result = await RNFS.readDir(recordingsDir);
            // console.log('Loaded recordings...');
            const recPaths = result.map(res => 'file://' + res.path);
            //const repeatedRec = Array.from(Array(20).keys()).map(() => recPaths).flat();
            setRecordings(recPaths);
        } catch (err: any) {
            // console.log('Cannot load recordings...');
        }
        };
        fetchRecordings();
    }, [])

    const playAudio = async (item: string) => {
        const fullVoicePath = item
        .replace('file:///', '/')
        .split('%20').join(' ');
        const soundTrack = new Sound(fullVoicePath, Sound.MAIN_BUNDLE,
            (error) => {
                if(error) {
                    // console.log('Cannot load soundtrack:', error);
                }
                else {
                    soundTrack.play((success) => {
                        if(!success) {
                            // console.log('Cannot play soundtrack.');
                        }
                        soundTrack.release();
                    });
                }
            });
    }

    const handleImagePress = (uri: string) => {
        route.params?.updateRecording('file://' + uri);
        navigation.goBack();
      };

    const renderItem = ({ item }: { item: string}) => (
        <TouchableOpacity onPress={() => handleImagePress(item)}>
            <Card style={[styles.container]}>
                <View style={styles.imageActionContainer}>
                    <Text style={{fontSize: 15, color: palette.textBody, marginRight: dimensions.spacingSmall}}>{item.split('/').pop()}</Text>
                    <IconButton name="volume-high" type="material-community" size={40} onPress={() => playAudio(item)}/>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
    <>
        <FullScreenTemplate padded darkBackground>
        {recordings.length > 0
        ?
        <FlatList
            data={recordings}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.contentContainer}
        />
        :
        <></>
        }
        </FullScreenTemplate>
    </>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingTop: 12,
        width: '100%',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: dimensions.spacingTiny,
        paddingBottom: dimensions.spacingLarge,
        height: '20%',
        margin: dimensions.spacingSmall
    },
    imageActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: dimensions.spacingLarge,
    },
});
