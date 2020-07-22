import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, AppState, Dimensions, View, Text } from 'react-native';
import { Content } from 'native-base';
import { withRouter } from 'react-router-dom';
import RNBootSplash from 'react-native-bootsplash';
import * as Animatable from 'react-native-animatable';

import BackgroundTimer from 'react-native-background-timer';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import { getItem } from '../../../util/storage';

import { getNewsRequest, LAST_NEWS_DATE_KEY } from '../../News/NewsActions';

import styles from '../../../styles';
import PageTitle from '../../../components/Content/PageTitle';
import Tiles from '../../../components/Content/Tiles';
import NavigationBottom from '../components/navigation/NavigationBottom';

class HomePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayLogo: false,
            displayMenu: false,
            appState: AppState.currentState,
        };

        this.fetchNewsInterval = null;

        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount() {
        console.log('Show spashscreen');
        !this.state.displayLogo && RNBootSplash.show();
        setTimeout(() => {
            console.log('Hide spashscreen');
            this.setState({
                displayLogo: true,
            });
            RNBootSplash.hide();
        }, 2000);

        this.initNotification();

        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    initNotification = () => {
        const { history } = this.props;
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            // onRegister: function (token) {
            //     console.log("TOKEN:", token);
            // },

            // (required) Called when a remote is received or opened, or local notification is opened

            onNotification(notification) {
                console.log('NOTIFICATION:', notification);

                // process the notification
                history.push('/news');

                // (required) Called when a remote is received or opened, or local notification is opened
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            // permissions: {
            //     alert: true,
            //     badge: true,
            //     sound: true,
            // },
            requestPermissions: Platform.OS === 'ios',

            // Should the initial notification be popped automatically
            // default: true
            // popInitialNotification: true,

            /**
            * (optional) default: true
            * - Specified if permissions (ios) and token (android and ios) will requested or not,
            * - if not, you must call PushNotificationsHandler.requestPermissions() later
            * - if you are not using remote notification or do not have Firebase installed, use this:
            *     requestPermissions: Platform.OS === 'ios'
            */
            // requestPermissions: true,
        });
    }

    sendNotification = () => {
        PushNotification.localNotification({
            title: 'AllCredit',
            message: 'Nouvelles actualités',
            playSound: true,
            smallIcon: 'ic_launcher',
        });
    }

    handleAppStateChange(nextAppState) {
        console.log(this.state.appState, '=>', nextAppState, this.fetchNewsInterval);
        if(this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('Clear news fetch interval');
            BackgroundTimer.stopBackgroundTimer();
        } else if(nextAppState.match(/inactive|background/) && !this.fetchNewsInterval) {
            console.log('Init news fetch interval');

            BackgroundTimer.runBackgroundTimer(() => {
                // code that will be called every X seconds
                console.log('Check last news');
                getItem(LAST_NEWS_DATE_KEY).then(lastDate => {
                    console.log('Last news date fetched', lastDate);
                    if(lastDate) {
                        this.props.dispatch(getNewsRequest(0, 1, false)).then(result => {
                            console.log('Data feched ?', !!result);
                            if(result && result.activities && result.activities[0]) {
                                console.log(new Date(lastDate), new Date(result.activities[0].published_at));
                                if(new Date(lastDate) - new Date(result.activities[0].published_at)) {
                                    console.log('Send Push Notification');
                                    this.sendNotification();
                                }
                            }
                        });
                    }
                });
            }, 3000);
        }
        this.setState({ appState: nextAppState });
    }

    render() {
        const zoomOut = {
            0: {
                translateY: (Dimensions.get('window').height / 2) - 140,
                scale: 2,
            },
            // 0.5: {
            //     translateY: 100,
            //     scale: 1.5,
            // },
            1: {
                translateY: 0,
                scale: 1,
            },
        };
        return (
            <Fragment>
                <Content>
                    <View style={{ height: '100%', minHeight: 500 }}>
                        {this.state.displayLogo && (
                            <View>
                                <Animatable.View animation={zoomOut} duration={500} delay={0} onAnimationEnd={() => this.setState({ displayMenu: true })}>
                                    <PageTitle />
                                </Animatable.View>
                            </View>
                        )}
                        {this.state.displayMenu && (
                            <Fragment>
                                <Tiles
                                    tiles={[
                                        {
                                            to: '/simulators',
                                            title: 'Simulateurs',
                                            picto: 'calculator',
                                        },
                                        {
                                            to: '/agencies',
                                            title: 'Agences',
                                            picto: 'map-marker-alt',
                                        },
                                        {
                                            to: '/page/metiers',
                                            title: 'Notre métier',
                                            picto: 'briefcase',
                                        },
                                        {
                                            to: '/news',
                                            title: 'Actualités',
                                            picto: 'clipboard-list',
                                        },
                                        // {
                                        //     to: '/page/about-us',
                                        //     title: 'Qui sommes-nous ?',
                                        //     picto: 'info-circle',
                                        // },
                                    ]}
                                />
                            </Fragment>
                        )}
                    </View>
                </Content>
                <NavigationBottom hideHomeNav />
            </Fragment>
        );
    }

    // <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
    //     <View style={{ alignItems: 'center' }}>
    //         <Text onPress={() => this.props.history.push('/test')}>Test page</Text>
    //         <Text onPress={this.sendNotification}>Test Notification</Text>
    //     </View>
    // </View>

}

HomePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default connect()(withRouter(HomePage));
