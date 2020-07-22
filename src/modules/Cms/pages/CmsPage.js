import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Dimensions } from 'react-native';
import { Content } from 'native-base';
import HTML from 'react-native-render-html';

import { getPageData } from '../CmsActions';

import PageTitle from '../../../components/Content/PageTitle';
import Tiles from '../../../components/Content/Tiles';
import NavigationBottom from '../../App/components/navigation/NavigationBottom';
import ErrorPage from '../../App/pages/ErrorPage';

import styles from '../../../styles';

export default function CmsPage(props) {
    const { params } = props.match;
    const data = getPageData(`${params.path}${params.sub ? `/${params.sub}` : ''}`);

    let content = null;
    if(data.tiles) {
        content = <Tiles tiles={data.tiles} />;
    } else if(data.content) {
        content = (
            <View style={styles.sectionContainer}>
                <HTML html={data.content} imagesMaxWidth={Dimensions.get('window').width} />
            </View>
        );
    }
    if(content) {
        console.log('CMS navigation', data.navigation);
        return (
            <Fragment>
                <Content>
                    <ScrollView>
                        {
                            data.title
                            ? (
                                <PageTitle>
                                    <Fragment>{data.title}</Fragment>
                                </PageTitle>
                            )
                            : null
                        }
                        {content}
                    </ScrollView>
                </Content>
                <NavigationBottom onBack={data.urlBack ? () => props.history.push(data.urlBack) : null} {...data.navigation || {}} />
            </Fragment>
        );
    }
    return <ErrorPage />;

}

CmsPage.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};
