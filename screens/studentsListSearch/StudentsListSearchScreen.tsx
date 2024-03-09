import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
//import { NavigationInjectedProps } from '@react-navigation/native';

import { IconButton, NarrowScreenTemplate, TextInput } from '../../components';
import { i18n } from '../../locale';
import { Student } from '../../models';
import { dimensions, palette } from '../../styles';
import { FilterableStudentsList } from './FilterableStudentsList';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

interface State {
  searchQuery: string;
}

export const StudentsListSearchScreen: React.FC<Props> = ({navigation, route}) => {

  const [searchQuery, setSearchQuery] = useState('')

  const onSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);
  };

  const onSearchInputClear = () => {
    setSearchQuery('');
  };

  const renderSearchInput = () => (
    <TextInput
      style={styles.searchInput}
      placeholder={i18n.t('studentList:search')}
      hideUnderline
      onChangeText={onSearch}
      value={searchQuery}
    />
  );

  const renderClearInputButton = () => {
    if (!searchQuery) {
      return null;
    }

    return (
      <IconButton type="material" name="close" size={24} color={palette.textBody} onPress={onSearchInputClear} />
    );
  };

  const students = route.params?.students

  return (
    <NarrowScreenTemplate
      title={renderSearchInput()}
      navigation={navigation}
      buttons={renderClearInputButton()}
      isSecondaryView
    >
      <FilterableStudentsList students={students} searchQuery={searchQuery} navigation={navigation}/>
    </NarrowScreenTemplate>
  );
  
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    marginHorizontal: dimensions.spacingTiny,
  },
});
