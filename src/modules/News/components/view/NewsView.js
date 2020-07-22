import React from 'react';
import PropTypes from 'prop-types';
import { Linking, View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import styles from '../../../../styles';

export default function NewsView({ news }) {

    const formatDate = dateString => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        return `${date.getDate()}/${month < 10 ? `0${month}` : month}/${date.getFullYear()}`;
    };

    const handleShare = type => {
        let url = null;
        switch(type) {

            case 'fb':
                url = 'https://www.facebook.com/sharer/sharer.php?u=';
                break;

            case 'tw':
                url = `http://twitter.com/share?text=${encodeURIComponent(news.title)}&url=`;
                break;

            case 'in':
                url = `https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(news.title)}&url=`;
                break;

            default:
                url = `mailto:?subject=${news.title}&content=`;

        }

        return Linking.openURL(`${url}${news.article_url}`);
    };

    return (
        <View>
            <Text style={{ marginBottom: 20, fontSize: 20 }}>{news.title}</Text>
            <Text>{news.caption}</Text>
            <Text style={{ textAlign: 'right' }} onPress={() => Linking.openURL(news.article_url)}>En savoir plus +</Text>

            <View style={{ flexDirection: 'row', flex: 1, marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                <View style={{ flex: 6 }}>
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
                <View style={{ flex: 6, marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>{formatDate(news.published_at)}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity onPress={event => handleShare('fb')} style={{ flex: 1 }}><Icon type="FontAwesome5" name="facebook-square" style={{ color: '#3b5998', fontSize: 50 }} /></TouchableOpacity>
                        <TouchableOpacity onPress={event => handleShare('in')} style={{ flex: 1 }}><Icon type="FontAwesome5" name="linkedin" style={{ color: '#0e76a8', fontSize: 50 }} /></TouchableOpacity>
                        <TouchableOpacity onPress={event => handleShare('tw')} style={{ flex: 1 }}><Icon type="FontAwesome5" name="twitter-square" style={{ color: '#00acee', fontSize: 50 }} /></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

NewsView.defaultProps = {
    hideSeparator: false,
};

NewsView.propTypes = {
    news: PropTypes.object.isRequired,
    hideSeparator: PropTypes.bool,
    goToNews: PropTypes.func.isRequired,
};
