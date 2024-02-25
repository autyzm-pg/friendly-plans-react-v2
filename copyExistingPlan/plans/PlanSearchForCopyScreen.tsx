import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { IconButton, NarrowScreenTemplate, TextInput } from 'components';
import { i18n } from 'locale';
import {Plan} from 'models';
import { dimensions, palette } from 'styles';
import {FilterablePlansListForCopy} from './FilterablePlansListForCopy';


interface Props extends NavigationInjectedProps {
  plans: Plan[];
}

interface State {
  searchQuery: string;
}

export class PlanSearchForCopyScreen extends React.PureComponent<Props, State> {
  state: State = {
    searchQuery: '',
  };

  onSearch = (searchQuery: string) => {
    this.setState({ searchQuery });
  };

  onSearchInputClear = () => {
    this.setState({ searchQuery: '' });
  };

  renderSearchInput = () => (
    <TextInput
      style={styles.searchInput}
      placeholder={i18n.t('studentList:search')}
      hideUnderline
      onChangeText={this.onSearch}
      value={this.state.searchQuery}
    />
  );
  renderClearInputButton = () => {
    if (!this.state.searchQuery) {
      return null;
    }

    return (
      <IconButton type="material" name="close" size={24} color={palette.textBody} onPress={this.onSearchInputClear} />
    );
  };

  render() {
    const { navigation } = this.props;
    const plans = navigation.getParam('plans');

    return (
      <NarrowScreenTemplate
        title={this.renderSearchInput()}
        navigation={navigation}
        buttons={this.renderClearInputButton()}
        isSecondaryView
      >
        <FilterablePlansListForCopy plans={plans} searchQuery={this.state.searchQuery} />
      </NarrowScreenTemplate>
    );
  }
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    marginHorizontal: dimensions.spacingTiny,
  },
});
