import React, { Fragment } from 'react';
import { View } from 'react-native';
import { Link } from 'react-router-native';

import PageTitle from '../../../components/Content/PageTitle';
import Tiles from '../../../components/Content/Tiles';

export default function ErrorPage(props) {
    return (
        <View>
            <PageTitle>
                <Fragment>{'Besoin d\'aide ?'}</Fragment>
            </PageTitle>
            <Tiles
                tiles={[
                    {
                        to: '/',
                        title: 'Accueil',
                    },
                    {
                        to: '/page/about-us',
                        title: 'À propos',
                    },
                ]}
            />
        </View>
    );
}
