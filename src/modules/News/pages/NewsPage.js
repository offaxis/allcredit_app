import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { Content, View, Text, Button, Icon } from 'native-base';

import { getNewsRequest, getNews } from '../NewsActions';

import styles from '../../../styles';
import PageTitle from '../../../components/Content/PageTitle';
import NavigationBottom from '../../App/components/navigation/NavigationBottom';
import NewsListItem from '../components/view/NewsListItem';
import NewsView from '../components/view/NewsView';


class NewsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeNews: null,
            isFetching: false,
            nextPage: 0,
        };

        this.handleFetchNews = this.handleFetchNews.bind(this);
        this.handleGoToNews = this.handleGoToNews.bind(this);
    }

    componentDidMount() {
        this.handleFetchNews();
    }

    handleFetchNews() {
        this.setState({
            isFetching: true,
        });
        this.props.dispatch(getNewsRequest(this.state.nextPage)).then(result => {
            this.setState({
                isFetching: false,
                nextPage: result.next_page,
            });
        });
    }

    handleGoToNews(newsId) {
        this.setState({
            activeNews: this.props.news.find(news => news.id === newsId),
        });
    }

    renderTitle() {
        if(this.state.activeNews) {
            return null;
        }
        return <PageTitle><Fragment>Actualités</Fragment></PageTitle>;
    }

    renderNews() {
        return this.props.news.map((newsItem, index) => <NewsListItem key={newsItem.id} news={newsItem} goToNews={this.handleGoToNews} hideSeparator={index === (this.props.news.length - 1)} />);
    }

    renderActiveNews() {
        const { activeNews } = this.state;
        if(activeNews) {
            return (<NewsView news={activeNews} />);
        }
        return null;
    }

    render() {
        return (
            <Fragment>
                <Content>
                    <View>
                        {this.renderTitle()}

                        <View style={styles.sectionContainer}>
                            {this.state.activeNews ? this.renderActiveNews() : this.renderNews()}
                        </View>

                        {!!this.state.isFetching && (<Text style={{ marginTop: 10, textAlign: 'center' }}><Icon type="FontAwesome5" name="spinner" spin /></Text>)}

                        {!this.state.activeNews && this.state.nextPage !== null && !this.state.isFetching && (
                            <Button light block onPress={this.handleFetchNews} iconLeft style={{ marginTop: 15 }}><Icon type="FontAwesome5" name="plus" /><Text>{'Plus d\'actus'}</Text></Button>
                        )}
                    </View>
                </Content>
                <NavigationBottom onBack={this.state.activeNews ? () => this.setState({ activeNews: null }) : null} />
            </Fragment>
        );
    }

}

function mapStateToProps(store, props) {
    return {
        news: getNews(store),
    };
}

NewsPage.defaultProps = {
    news: [],
};

NewsPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    news: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps)(NewsPage);
