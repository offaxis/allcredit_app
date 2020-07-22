import { callExternalApi } from '../../util/apiCaller';
import { setItem } from '../../util/storage';

import config from '../../config';

export const SET_NEWS = 'SET_NEWS';

export const POSTS_PER_PAGE = 10;
export const LAST_NEWS_DATE_KEY = 'lastNewsDateFetched';

export function getNewsRequest(page = 0, perPage = null, needDispatch = true) {
    return dispatch => {
        return callExternalApi(
            `https://app.arturin.com/api/v1/external/social_activities?page=${page + 1}&per_page=${perPage || POSTS_PER_PAGE}&token=${config.arturin.token}`,
            'get',
            undefined,
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        ).then(result => {
            // console.log('Agencies found:', results.length);
            if(result && result.activities) {
                needDispatch && dispatch(setNews(result.activities, page > 0));
                if(page === 0) {
                    setItem(LAST_NEWS_DATE_KEY, result.activities[0].published_at);
                }
            }
            return result;
        }).catch(err => {
            console.error(err);
            return null;
        });
    };
}

export function getNews(store) {
    return store.news.data.sort((newsA, newsB) => new Date(newsB.published_at) - new Date(newsA.published_at));
}

export function setNews(news, isAdd = false) {
    return {
        type: SET_NEWS,
        news,
        isAdd,
    };
}
