import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, FullScreenTemplate, IconButton, ModalTrigger, TextInput } from '../../../components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { dimensions, palette, typography } from '../../../styles';
import Sound from 'react-native-sound';
import { i18n } from '../../../locale';
import { InnerGallery, PlanItem } from '../../../models';
import ImagePicker from 'react-native-image-crop-picker';
import { Route } from '../../../navigation';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const RecordingLibraryScreen: React.FC<Props> = ({ navigation, route }) => {
    const [recordings, setRecordings] = useState<string[]>([]);
    const [usedVoices, setVoices] = useState<string[]>([]);

    const selectMode = useRef<boolean>(route.params?.updateRecording ? true : false);
    
    const [selectedRecordings, setSelectedRecordings] = useState<string[]>([]);
    const playerRef = useRef<any>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filRecordings, setFilRecordings] = useState<string[]>([]);

    const fetchRecordings = async () => {
        const isSelectMode = route.params?.updateRecording ? true : false;
        if (!isSelectMode) {
            const voices = await PlanItem.getVoiceUriUsed();
            setVoices(voices);
        }
        const recPaths = await InnerGallery.fetchFiles(InnerGallery.recordingsDir);
        //const repeatedRec = Array.from(Array(20).keys()).map(() => recPaths).flat();
        setRecordings(recPaths);
        setFilRecordings(recPaths);
    };

    useEffect(()=> {
        fetchRecordings();
        return () => {
            if (!playerRef.current) { return; }
            playerRef.current.stop();
            playerRef.current.release();
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
    };

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

    const handleLongPress = (uri: string) => {
        if (!selectMode.current) { navigation.navigate(Route.RecordingNameEditor, { uri: uri }); }
    };


    const renderItem = ({ item }: { item: string}) => {
        const isSelected = selectedRecordings.includes(item);
        const isUsed = usedVoices.includes(item);
        return (
            <TouchableOpacity onPress={() => handlePress(item)} onLongPress={() =>  { handleLongPress(item) }}>
                <Card style={[styles.container, isSelected && { borderWidth: 5, borderColor: palette.primary }, isUsed && { opacity: 0.6 }]}>
                    <View style={styles.imageActionContainer}>
                        <Text style={{fontSize: 15, color: palette.textBody, marginRight: dimensions.spacingSmall}}>{item.split('/').pop()}</Text>
                        <IconButton name='volume-high' type='material-community' size={40} onPress={() => playAudio(item)} style={{marginLeft: dimensions.spacingSmall}}/>
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

    const showInfo = () => {
        return (
            <View style={styles.imageActionContainer}>
            <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('recGallery:usage')}</Text>
            </View>
        );
    };

    const showList = () => {
        if (!selectMode.current && recordings.length > 0) {
            return (<FlatList
                data={recordings}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.contentContainer}
            />);
        }
        else if (selectMode.current && recordings.length > 0) {
            return (<FlatList
                data={filRecordings}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.contentContainer}
            />);
        }
        else {
            return (<></>);
        }
    };

    const splitToNameExtension = (fileName: string) => {
        const idx = fileName.lastIndexOf('.');
        if (idx !== -1) {
          const name = fileName.substring(0, idx);
          const extension = fileName.substring(idx + 1);
          return [name, extension];
        }
        return fileName;
      };
    

    const onSearch = (text: string) => {
        setSearchTerm(text);
        if (text.length > 0) {
            const filteredRecordings = recordings.filter(item => {
                const [name, _] = splitToNameExtension(item.substring(item.lastIndexOf('/') + 1));
                return name.includes(text);
            });
            setFilRecordings(filteredRecordings);
        }
        else {
            setFilRecordings(recordings);
        }
    }

    return (
    <>
        {!selectMode.current 
            ? 
            <View style={styles.trashIconContainer}>
                <Text style={styles.text}>{i18n.t('recGallery:information') + ` ${selectedRecordings.length ? selectedRecordings.length : 0}`}</Text>
                <View style={styles.iconButtonContainer}>
                    <IconButton name='trash' type='font-awesome' size={24} color={palette.primary} onPress={deleteMultiple} 
                                disabled={selectedRecordings.length == 0}/>
                </View>
                <ModalTrigger title={i18n.t('planItemActivity:infoBox')} modalContent={showInfo()}>
                    <IconButton name={'information-circle'} type={'ionicon'} size={30} disabled color={palette.informationIcon} 
                                style={{marginRight: dimensions.spacingLarge}}/>
                </ModalTrigger>
            </View>
            :
            <View style={styles.inputContainer}>
                <TextInput
                style={{ width: '40%' }}
                value={searchTerm}
                onChangeText={onSearch}
                placeholder="Wyszukaj nazwę nagrania..."
                />
            </View>
        }
        <FullScreenTemplate padded darkBackground>
        {showList()}
        </FullScreenTemplate>
    </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: palette.textWhite,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 0,
        paddingTop: 0
    },
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
