import i18n from 'i18next';
import React, {SFC} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';

import {Icon} from 'components';
import {palette, typography} from '../styles';

interface Props {
    onPress: (name: string) => void;
}

interface State {
    actionName: string;
    isOpen: boolean;
}

const actionNames = {
    add: 'create-plan',
    copy: 'copy-existing-plan',
};

const actions = [
    {
        name: actionNames.add,
        icon: <Icon name="create" type="ionicons" color={palette.primary} size={24} />,
        text: i18n.t('planList:addPlanAction'),
        position: 1,
        color: palette.background,
        textBackground: palette.primaryVariant,
        textStyle: typography.caption,
        textElevation: 0,
        textColor: palette.textWhite,
    },
    {
        name: actionNames.copy,
        icon: <Icon name="ios-copy" type="ionicon" color={palette.primary} size={24} />,
        text: i18n.t('planList:copyPlanAction'),
        position: 2,
        color: palette.background,
        textBackground: palette.primaryVariant,
        textStyle: typography.caption,
        textElevation: 0,
        textColor: palette.textWhite,
    },
];




export class FixedCreatePlanButton extends React.PureComponent<Props, State> {
    state: State = {
        actionName: '',
        isOpen: false,
    };

    onPressItem = (actionName: string = actionNames.add) => {
        this.props.onPress(actionName);
    };

    onOpen = () => {
        this.setState({ isOpen: true });
    };


    onClose = () => {
        this.setState({ isOpen: false });
    };

    renderFloatingIcon = () => {
        return this.state.isOpen ? (
            <Icon name="close" type="material" color={palette.primaryVariant} size={40} />
        ) : (
            <Icon name="add" type="material" color={palette.secondary} size={40} />
        );
    };

    render() {
        return (
            <>
                {this.state.isOpen && <Animated.View style={[styles.overlay]} />}
                <FloatingAction
                    color={this.state.isOpen ? palette.secondary : palette.primaryVariant}
                    actions={actions}
                    showBackground={false}
                    onPressItem={this.onPressItem}
                    floatingIcon={this.renderFloatingIcon()}
                    onOpen={this.onOpen}
                    onClose={this.onClose}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: palette.modalBackgroundOverlay,
    },
});
