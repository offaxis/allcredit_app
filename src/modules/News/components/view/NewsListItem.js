import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import separator from '../../../../assets/images/separator.png';

import styles from '../../../../styles';

export default function NewsListItem({ news, hideSeparator, goToNews }) {
    return (
        <View>
            <TouchableOpacity onPress={event => goToNews(news.id)}>
                <View style={{ flexDirection: 'row', flex: 1, marginLeft: 10, marginRight: 10 }}>
                    <View style={{ flex: 2 }}>
                        {!!news.picture_url && (
                            <Image
                            style={{ width: '100%', aspectRatio: 1, resizeMode: 'contain' }}
                            source={{
                                uri: news.picture_url,
                            }}
                            />
                        )}
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>{news.title}</Text>
                        <Text>{news.post}</Text>
                        <Text style={{ marginTop: 10, fontStyle: 'italic', fontSize: 8 }}>{news.topics_names.join(', ')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {!hideSeparator && <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}><Image source={separator} /></View>}
        </View>
    );
}
// {!hideSeparator && <Text style={styles.itemSeparator}>{'\n'}</Text>}

NewsListItem.defaultProps = {
    hideSeparator: false,
};

NewsListItem.propTypes = {
    news: PropTypes.object.isRequired,
    hideSeparator: PropTypes.bool,
    goToNews: PropTypes.func.isRequired,
};
