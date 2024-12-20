import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { IconButton, NarrowScreenTemplate, TextInput } from '../../components';
import { i18n } from '../../locale';
import { dimensions, palette } from '../../styles';
import { FilterablePlansListForCopy } from './FilterablePlansListForCopy';
import { NavigationProp, RouteProp } from '@react-navigation/native';


interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

interface State {
  searchQuery: string;
}

export const PlanSearchForCopyScreen: FC<Props> = ({ navigation, route }) => {
  const [state, setState] = useState<State>({
    searchQuery: '',
  });

  const onSearch = (searchQuery: string) => {
    setState({ searchQuery: searchQuery });
  };

  const onSearchInputClear = () => {
    setState({ searchQuery: '' });
  };

  const renderSearchInput = () => (
    <TextInput
      style={styles.searchInput}
      placeholder={i18n.t('studentList:search')}
      hideUnderline
      onChangeText={onSearch}
      value={state.searchQuery}
    />
  );

  const renderClearInputButton = () => {
    if (!state.searchQuery) {
      return null;
    }

    return (
      <IconButton 
        type="material" 
        name="close" 
        size={24} 
        color={palette.textBody} 
        onPress={onSearchInputClear} 
        containerStyle={styles.iconContainer}
      />
    );
  };

  return (
    <NarrowScreenTemplate
      title={renderSearchInput()}
      navigation={navigation}
      buttons={renderClearInputButton()}
      isSecondaryView
    >
      <FilterablePlansListForCopy plans={route.params?.plans} searchQuery={state.searchQuery} navigation={navigation} />
    </NarrowScreenTemplate>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    marginHorizontal: dimensions.spacingTiny,
  },
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  }
});
