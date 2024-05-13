import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, FullScreenTemplate, IconButton } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { dimensions, palette, typography } from '../../../styles';
import Sound from 'react-native-sound';
import { i18n } from '../../../locale';
import { PlanItem } from '../../../models';
import ImagePicker from 'react-native-image-crop-picker';
import { Route } from '../../../navigation';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const RecordingLibraryScreen: React.FC<Props> = ({ navigation, route }) => {
    const [recordings, setRecordings] = useState<string[]>([]);
    const [usedVoices, setVoices] = useState<string[]>([]);
    const recordingsDir = RNFS.DocumentDirectoryPath + '/Recordings/';
    const [selectedRecordings, setSelectedRecordings] = useState<string[]>([]);
    const playerRef = useRef<any>(null);
    const selectMode = useRef<boolean>(route.params?.updateRecording ? true : false);

    const fetchRecordings = async () => {
        try {
            if (!(route.params?.updateRecording ? true : false)) {
                const voices = await PlanItem.getVoiceUriUsed();
                setVoices(voices);
            }
            const result = await RNFS.readDir(recordingsDir);
            const recPaths = result.map(res => 'file://' + res.path);
            //const repeatedRec = Array.from(Array(20).keys()).map(() => recPaths).flat();
            setRecordings(recPaths);
        } catch (err: any) {
            console.log('Cannot load recordings...');
        }
    };

    useEffect(()=> {
        fetchRecordings();
        return () => {
            if (playerRef.current) {
              playerRef.current.stop();
              playerRef.current.release();
            }
        };
    }, []);

    const playAudio = async (item: string) => {
        const fullVoicePath = item
        .replace('file:///', '/')
        .split('%20').join(' ');
        playerRef.current = new Sound(fullVoicePath, Sound.MAIN_BUNDLE,
            (error) => {
                if(error) {
                    console.log('Cannot load soundtrack:', error);
                }
                else {
                    playerRef.current.play((success:any) => {
                        if(!success) {
                            console.log('Cannot play soundtrack.');
                        }
                        playerRef.current.release();
                    });
                }
            });
    }

    const handlePress = (uri: string) => {
        selectMode.current ? chooseRecordingForTask(uri) : chooseRecForDeleting(uri);
    };

    const chooseRecordingForTask = (uri: string) => {
        route.params?.updateRecording(uri);
        navigation.goBack();
    };
    
    const chooseRecForDeleting = (uri: string) => {
        const isSelected = selectedRecordings.includes(uri);
        if (isSelected) {
          const filteredImages = selectedRecordings.filter((rec) => rec !== uri);
          setSelectedRecordings(filteredImages);
        } else {
          setSelectedRecordings((prev) => [...prev, uri]);
        }
    };

    const renderItem = ({ item }: { item: string}) => {
        const isSelected = selectedRecordings.includes(item);
        const isUsed = usedVoices.includes(item);
        return (
            <TouchableOpacity onPress={() => handlePress(item)}>
                <Card style={[styles.container, isSelected && { borderWidth: 5, borderColor: palette.primary }, isUsed && { opacity: 0.6 }]}>
                    <View style={styles.imageActionContainer}>
                        <Text style={{fontSize: 15, color: palette.textBody, marginRight: dimensions.spacingSmall}}>{item.split('/').pop()}</Text>
                        <IconButton name='volume-high' type='material-community' size={40} onPress={() => playAudio(item)}/>
                    </View>
                </Card>
            </TouchableOpacity>
    )};

    const deleteMultiple = async() => {
        Alert.alert(i18n.t('recGallery:warningHeader'), i18n.t('recGallery:warningInformation'), [
          { text: i18n.t('common:cancel') },
          {
            text: i18n.t('common:confirm'),
            onPress: async() => {
              await PlanItem.removeNonExistingRecs(selectedRecordings);
              selectedRecordings.forEach(async(uri) => { await ImagePicker.cleanSingle(uri).catch(() => {});});
              navigation.navigate(Route.Dashboard);
            },
          },
        ]);
      };

    return (
    <>
        <View style={styles.trashIconContainer}>
            <Text style={styles.text}>{i18n.t('recGallery:information') + ` ${selectedRecordings.length ? selectedRecordings.length : 0}`}</Text>
            <View style={styles.iconButtonContainer}>
                <IconButton name='trash' type='font-awesome' size={24} color={palette.primary} onPress={deleteMultiple} disabled={selectedRecordings.length == 0 || selectMode.current}/>
            </View>
        </View>
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
    trashIconContainer: {
        backgroundColor: palette.textWhite,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 0,
        paddingTop: 0
      },
      text: {
        ...typography.body,
        marginRight: 'auto',
        marginLeft: dimensions.spacingLarge,
        color: palette.textBody,
      },
      iconButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: dimensions.spacingLarge
      },
});
