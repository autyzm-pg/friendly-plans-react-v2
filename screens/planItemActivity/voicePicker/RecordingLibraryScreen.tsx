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
import DocumentPicker, {types} from 'react-native-document-picker';
import { MultiButton } from '../../../components/MultiButton';

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
                        <IconButton name='volume-high' type='material-community' size={40} 
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => playAudio(item)} style={{marginLeft: dimensions.spacingSmall}}/>
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

    const loadMultiple = async() => {
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: types.audio,
          allowMultiSelection: true
        });
        await InnerGallery.copyMultipleRecs(response);
        navigation.goBack();
    };

    const showInfo = () => {
        return (
            <View style={styles.imageActionContainer}>
            <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('recGallery:usage')}</Text>
            </View>
        );
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
    };

    const unSelectAll = () => {
        if (selectedRecordings.length == filRecordings.length) {
            setSelectedRecordings([]);
        } else {
            setSelectedRecordings(filRecordings);
        }
    };

    return (
    <>
        <View style={styles.trashIconContainer}>
            <View style={{ marginLeft: dimensions.spacingBig }}/>
            <TextInput
                style={{ width: '40%' }}
                value={searchTerm}
                onChangeText={onSearch}
                placeholder={i18n.t('recGallery:find')}
                height={35}
            />
            {!selectMode.current && 
                <View style={styles.iconButtonContainer}>
                    <MultiButton onPress={deleteMultiple} buttonName='trash' buttonType='font-awesome'
                                 title={i18n.t('common:deleteButton')} disabled={selectedRecordings.length == 0}/>
                    <MultiButton onPress={loadMultiple} buttonName='file-download' buttonType='material'
                                 title={i18n.t('common:addButton')} disabled={false}/>
                    <MultiButton onPress={unSelectAll} 
                     title={selectedRecordings.length != recordings.length ? i18n.t('planActivity:selectTasks') : i18n.t('planActivity:unSelectTasks')}
                     buttonName={selectedRecordings.length != recordings.length ? 'check-square' : 'square'} 
                     buttonType='feather' 
                     disabled={false}/>
                    <View style={{ marginLeft: dimensions.spacingSmall }}/>
                    <ModalTrigger title={i18n.t('planItemActivity:infoBox')} modalContent={showInfo()}>
                        <IconButton name={'information-circle'} type={'ionicon'} size={30} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} disabled color={palette.informationIcon}/>
                    </ModalTrigger>
                </View>
            }
        </View>
        <FullScreenTemplate padded darkBackground>
        {recordings.length > 0 ?
            <FlatList
            data={filRecordings}
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
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        minWidth: 800
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
        height: 60,
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: dimensions.spacingBig,
        flex: 1
      },
});
