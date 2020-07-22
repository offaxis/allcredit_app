/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, browserHistory } from 'react-router-native';

import routes from './routes';

import configureStore from './store';

import AppWrapper from './modules/App/AppWrapper';
// import ErrorBoundary from './components/Error/ErrorBoundary';

// Initialize store
const store = configureStore(window.__INITIAL_STATE__);

const App: () => React$Node = () => {
    return (
        <Provider store={store}>
            <MemoryRouter history={browserHistory}>
                <AppWrapper>
                    {routes}
                </AppWrapper>
            </MemoryRouter>
        </Provider>
    );
};

// Init page
// <Header />
// {global.HermesInternal == null ? null : (
//     <View style={styles.engine}>
//         <Text style={styles.footer}>Engine: Hermes</Text>
//     </View>
// )}
// <View style={styles.body}>
//     <View>
//         <Text>Hey this is my view ! 2</Text>
//     </View>
//     <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Step One</Text>
//         <Text style={styles.sectionDescription}>
//             Edit
//             {' '}
//             <Text style={styles.highlight}>App.js</Text>
//             {' '}
//             to
//             change this screen and then come back to see
//             your edits.
//         </Text>
//     </View>
//     <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>
//             See Your Changes
//         </Text>
//         <Text style={styles.sectionDescription}>
//             <ReloadInstructions />
//         </Text>
//     </View>
//     <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Debug</Text>
//         <Text style={styles.sectionDescription}>
//             <DebugInstructions />
//         </Text>
//     </View>
//     <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Learn More</Text>
//         <Text style={styles.sectionDescription}>
//             Read the docs to discover what to do next:
//         </Text>
//     </View>
//     <LearnMoreLinks />
// </View>


export default App;
